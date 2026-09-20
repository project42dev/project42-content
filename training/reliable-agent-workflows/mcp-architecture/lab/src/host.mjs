import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const PROFILE = '2025-11-25';
export const DEFAULT_STARTUP_TIMEOUT_MS = 3000;
export const DEFAULT_TOOL_TIMEOUT_MS = 250;
export const DEFAULT_MAX_LINE_BYTES = 16_384;
export const EXPIRED_TTL_MS = 5000;
export const MAX_EXPIRED_IDS = 64;
export const QUARANTINE_TTL_MS = 5000;
export const MAX_QUARANTINED = 64;
const serverPath = fileURLToPath(new URL('./server.mjs', import.meta.url));

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function exactKeys(value, keys) {
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  return actual.length === expected.length && actual.every((key, index) => key === expected[index]);
}

function positiveInteger(value, name) {
  if (!Number.isInteger(value) || value <= 0) throw new TypeError(`${name} must be a positive integer`);
}

function validWorkspace(value) {
  return typeof value === 'string' && /^ws_[a-z0-9]{4,12}$/.test(value);
}

export function exactWorkspaceComparator(allowedWorkspaces, requestedWorkspace) {
  return allowedWorkspaces.includes(requestedWorkspace);
}

export function validateSessionDefinition(definition) {
  if (!isObject(definition)) throw new TypeError('session definition must be an object');
  if (typeof definition.expectedIdentity !== 'string' || definition.expectedIdentity.length === 0) throw new TypeError('expectedIdentity must be a non-empty string');
  const allowed = definition.allowedWorkspaces ?? [];
  if (!Array.isArray(allowed) || !allowed.every(validWorkspace)) throw new TypeError('allowedWorkspaces must contain valid workspace identities');
  if (definition.serverConfig !== undefined && !isObject(definition.serverConfig)) throw new TypeError('serverConfig must be an object');
  positiveInteger(definition.startupTimeoutMs ?? DEFAULT_STARTUP_TIMEOUT_MS, 'startupTimeoutMs');
  positiveInteger(definition.toolTimeoutMs ?? DEFAULT_TOOL_TIMEOUT_MS, 'toolTimeoutMs');
  positiveInteger(definition.maxLineBytes ?? DEFAULT_MAX_LINE_BYTES, 'maxLineBytes');
  if (definition.scopeComparator !== undefined && typeof definition.scopeComparator !== 'function') throw new TypeError('scopeComparator must be an explicitly supplied trusted function');
  return true;
}

export class RpcProtocolError extends Error {
  constructor(error) {
    super(error.message);
    this.name = 'RpcProtocolError';
    this.code = error.code;
    this.data = error.data;
  }
}

export class SessionFailure extends Error {
  constructor(message, outcome = 'NOT_APPLIED') {
    super(message);
    this.name = 'SessionFailure';
    this.outcome = outcome;
  }
}

export class ClientSession {
  constructor({ expectedIdentity, allowedWorkspaces = [], serverConfig = {}, startupTimeoutMs = DEFAULT_STARTUP_TIMEOUT_MS, toolTimeoutMs = DEFAULT_TOOL_TIMEOUT_MS, maxLineBytes = DEFAULT_MAX_LINE_BYTES, scopeComparator = exactWorkspaceComparator }) {
    validateSessionDefinition({ expectedIdentity, allowedWorkspaces, serverConfig, startupTimeoutMs, toolTimeoutMs, maxLineBytes, scopeComparator });
    this.expectedIdentity = expectedIdentity;
    this.allowedWorkspaces = [...allowedWorkspaces];
    this.scopeComparator = scopeComparator;
    this.startupTimeoutMs = startupTimeoutMs;
    this.toolTimeoutMs = toolTimeoutMs;
    this.maxLineBytes = maxLineBytes;
    this.capabilities = {};
    this.nextId = 1;
    this.pending = new Map();
    this.expired = new Map();
    this.quarantined = [];
    this.buffer = '';
    this.state = 'uninitialized';
    this.closed = false;
    this.cleanupPromise = null;
    this.child = spawn(process.execPath, [serverPath], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, LAB_SERVER_CONFIG: JSON.stringify({ ...serverConfig, identity: expectedIdentity }) }
    });
    this.child.stdout.setEncoding('utf8');
    this.child.stdout.on('data', (chunk) => this.consume(chunk));
    this.child.stderr.resume();
    this.child.on('error', (error) => this.fatal(new SessionFailure(`Child process error: ${error.message}`, 'UNKNOWN')));
    this.child.on('close', () => {
      this.closed = true;
      this.failAll(new SessionFailure('Transport closed', 'UNKNOWN'));
    });
  }

  pruneExpired() {
    const now = Date.now();
    for (const [id, record] of this.expired) if (record.expiresAt <= now) this.expired.delete(id);
    while (this.expired.size > MAX_EXPIRED_IDS) this.expired.delete(this.expired.keys().next().value);
  }

  pruneQuarantined() {
    const cutoff = Date.now() - QUARANTINE_TTL_MS;
    this.quarantined = this.quarantined.filter((record) => record.receivedAt > cutoff);
    if (this.quarantined.length > MAX_QUARANTINED) this.quarantined.splice(0, this.quarantined.length - MAX_QUARANTINED);
  }

  recordQuarantined(record) {
    this.pruneQuarantined();
    this.quarantined.push(record);
    this.pruneQuarantined();
  }

  validateResponse(message) {
    if (!isObject(message) || message.jsonrpc !== '2.0' || !Object.hasOwn(message, 'id')) return 'Invalid JSON-RPC response envelope';
    const hasResult = Object.hasOwn(message, 'result');
    const hasError = Object.hasOwn(message, 'error');
    if (hasResult === hasError) return 'Response must contain exactly one of result or error';
    if (!exactKeys(message, hasResult ? ['jsonrpc', 'id', 'result'] : ['jsonrpc', 'id', 'error'])) return 'Response contains invalid top-level fields';
    if (hasError && (!isObject(message.error) || typeof message.error.code !== 'number' || typeof message.error.message !== 'string')) return 'Invalid JSON-RPC error object';
    return null;
  }

  consume(chunk) {
    this.buffer += chunk;
    if (Buffer.byteLength(this.buffer, 'utf8') > this.maxLineBytes && !this.buffer.includes('\n')) return this.fatal(new SessionFailure(`Response exceeded ${this.maxLineBytes} bytes`, 'UNKNOWN'));
    let newline;
    while ((newline = this.buffer.indexOf('\n')) >= 0) {
      const line = this.buffer.slice(0, newline);
      this.buffer = this.buffer.slice(newline + 1);
      if (Buffer.byteLength(line, 'utf8') > this.maxLineBytes) return this.fatal(new SessionFailure(`Response exceeded ${this.maxLineBytes} bytes`, 'UNKNOWN'));
      let message;
      try { message = JSON.parse(line); } catch { return this.fatal(new SessionFailure('Malformed JSON from server', 'UNKNOWN')); }
      if (isObject(message) && typeof message.method === 'string' && !Object.hasOwn(message, 'id')) return this.fatal(new SessionFailure('Unexpected server notification', 'UNKNOWN'));
      const shapeError = this.validateResponse(message);
      if (shapeError) return this.fatal(new SessionFailure(shapeError, 'UNKNOWN'));
      this.pruneExpired();
      if (this.expired.has(message.id)) {
        const expired = this.expired.get(message.id);
        this.expired.delete(message.id);
        this.recordQuarantined({ id: message.id, method: expired.method, receivedAt: Date.now() });
        continue;
      }
      if (!this.pending.has(message.id)) return this.fatal(new SessionFailure('Unmatched response ID', 'UNKNOWN'));
      const pending = this.pending.get(message.id);
      this.pending.delete(message.id);
      clearTimeout(pending.timer);
      if (Object.hasOwn(message, 'error')) pending.reject(new RpcProtocolError(message.error));
      else pending.resolve(message.result);
    }
  }

  failAll(error) {
    for (const pending of this.pending.values()) {
      clearTimeout(pending.timer);
      pending.reject(error);
    }
    this.pending.clear();
  }

  fatal(error) {
    if (this.closed && this.cleanupPromise) return;
    this.closed = true;
    this.failAll(error);
    this.cleanupPromise ||= this.terminate();
  }

  request(method, params = {}, timeoutMs = this.toolTimeoutMs) {
    if (this.closed) return Promise.reject(new SessionFailure('Session is closed', 'UNKNOWN'));
    if (typeof method !== 'string' || method.length === 0 || !isObject(params)) return Promise.reject(new TypeError('method and params are invalid'));
    positiveInteger(timeoutMs, 'timeoutMs');
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        this.expired.set(id, { method, expiresAt: Date.now() + EXPIRED_TTL_MS });
        this.pruneExpired();
        reject(new SessionFailure(`Request timed out after ${timeoutMs} ms; side effect is UNKNOWN and must not be blindly retried`, 'UNKNOWN'));
      }, timeoutMs);
      this.pending.set(id, { resolve, reject, timer, method });
      this.child.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', id, method, params })}\n`, (error) => {
        if (error && this.pending.has(id)) {
          clearTimeout(timer);
          this.pending.delete(id);
          reject(new SessionFailure(`Transport write failed: ${error.message}`, 'UNKNOWN'));
        }
      });
    });
  }

  notifyInitialized() {
    if (this.state !== 'awaiting-initialized-notification') throw new SessionFailure('Initialized notification is out of order or duplicated');
    this.child.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized', params: {} })}\n`);
    this.state = 'ready';
  }

  async initialize() {
    if (this.state !== 'uninitialized') throw new SessionFailure('Initialize is out of order or duplicated');
    this.state = 'initializing';
    const result = await this.request('initialize', { protocolVersion: PROFILE, capabilities: {}, clientInfo: { name: 'project42-teaching-host', version: '2.0.0' } }, this.startupTimeoutMs);
    if (!isObject(result) || !exactKeys(result, ['protocolVersion', 'capabilities', 'serverInfo']) || !isObject(result.capabilities) || !isObject(result.serverInfo)) { await this.close(); throw new SessionFailure('Invalid initialize result', 'UNKNOWN'); }
    if (result.protocolVersion !== PROFILE) { await this.close(); throw new SessionFailure(`Unsupported protocol version ${result.protocolVersion}; required ${PROFILE}`, 'UNKNOWN'); }
    if (result.serverInfo.name !== this.expectedIdentity) { await this.close(); throw new SessionFailure('Server identity did not match the isolated session identity', 'UNKNOWN'); }
    this.capabilities = result.capabilities;
    this.state = 'awaiting-initialized-notification';
    this.notifyInitialized();
    return result;
  }

  requireCapability(name) {
    if (this.state !== 'ready') throw new SessionFailure('Client session is not ready');
    if (!Object.hasOwn(this.capabilities, name) || !isObject(this.capabilities[name])) throw new SessionFailure(`Required capability not negotiated: ${name}`);
  }

  qualifiedTool(name) { return `${this.expectedIdentity}::${name}`; }

  approvalToken(name, workspaceId, title) {
    return JSON.stringify(['APPROVE', this.expectedIdentity, name, workspaceId, title]);
  }

  async listTools() { this.requireCapability('tools'); return this.request('tools/list', {}); }

  async callDraft({ workspaceId, title, approval }) {
    this.requireCapability('tools');
    const tool = 'create_training_draft';
    if (!this.scopeComparator(this.allowedWorkspaces, workspaceId)) throw new SessionFailure(`Workspace denied by trusted host scope: ${workspaceId}`);
    if (approval !== this.approvalToken(tool, workspaceId, title)) throw new SessionFailure('Missing or non-exact trusted approval');
    const result = await this.request('tools/call', { name: tool, arguments: { workspaceId, title } });
    if (result.isError === true) return { ok: false, error: result.structuredContent };
    if (result.isError !== false || !validDraftResult(result.structuredContent, { workspaceId, title, serverIdentity: this.expectedIdentity })) throw new SessionFailure('Tool output failed structured postcondition validation', 'UNKNOWN');
    return { ok: true, receipt: result.structuredContent };
  }

  async rawToolCall(argumentsValue) { this.requireCapability('tools'); return this.request('tools/call', { name: 'create_training_draft', arguments: argumentsValue }); }
  async readDraftState() { this.requireCapability('resources'); const result = await this.request('resources/read', { uri: `state://${this.expectedIdentity}/drafts` }); return JSON.parse(result.contents[0].text); }
  async listResources() { this.requireCapability('resources'); return this.request('resources/list', {}); }
  async listPrompts() { this.requireCapability('prompts'); return this.request('prompts/list', {}); }
  async getPrompt(title) { this.requireCapability('prompts'); return this.request('prompts/get', { name: 'review_draft', arguments: { title } }); }

  waitForClose(timeoutMs) {
    if (this.child.exitCode !== null || this.child.signalCode !== null) return Promise.resolve(true);
    return new Promise((resolve) => {
      const timer = setTimeout(() => { cleanup(); resolve(false); }, timeoutMs);
      const onClose = () => { cleanup(); resolve(true); };
      const cleanup = () => { clearTimeout(timer); this.child.off('close', onClose); };
      this.child.once('close', onClose);
    });
  }

  async terminate() {
    if (!this.child.stdin.destroyed) this.child.stdin.end();
    if (await this.waitForClose(200)) return;
    this.child.kill('SIGTERM');
    if (await this.waitForClose(200)) return;
    this.child.kill('SIGKILL');
    if (!(await this.waitForClose(500))) throw new SessionFailure('Child process did not terminate within cleanup deadline', 'UNKNOWN');
  }

  async close() {
    this.closed = true;
    this.failAll(new SessionFailure('Session closed', 'UNKNOWN'));
    this.cleanupPromise ||= this.terminate();
    await this.cleanupPromise;
  }
}

export function validDraftResult(value, expected) {
  if (!isObject(value) || !exactKeys(value, ['receiptId', 'status', 'workspaceId', 'title', 'serverIdentity'])) return false;
  const escaped = expected.serverIdentity.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return typeof value.receiptId === 'string' && new RegExp(`^${escaped}:\\d+$`).test(value.receiptId) && value.status === 'UNPUBLISHED' && value.workspaceId === expected.workspaceId && value.title === expected.title && value.serverIdentity === expected.serverIdentity;
}

export class TeachingHost {
  constructor(sessionDefinitions) {
    if (!Array.isArray(sessionDefinitions) || sessionDefinitions.length === 0) throw new TypeError('sessionDefinitions must be a non-empty array');
    for (const definition of sessionDefinitions) validateSessionDefinition(definition);
    const identities = sessionDefinitions.map((definition) => definition.expectedIdentity);
    if (new Set(identities).size !== identities.length) throw new TypeError('Duplicate server identities are not allowed');
    const created = [];
    try {
      for (const definition of sessionDefinitions) created.push(new ClientSession(definition));
      this.sessions = new Map(created.map((session) => [session.expectedIdentity, session]));
    } catch (error) {
      for (const session of created) void session.close().catch(() => {});
      throw error;
    }
  }

  async initializeAll() {
    try { await Promise.all([...this.sessions.values()].map((session) => session.initialize())); }
    catch (error) { await this.closeAll(); throw error; }
  }

  session(identity) {
    const session = this.sessions.get(identity);
    if (!session) throw new SessionFailure(`Unknown server identity: ${identity}`);
    return session;
  }

  async closeAll() { await Promise.all([...this.sessions.values()].map((session) => session.close())); }
}
