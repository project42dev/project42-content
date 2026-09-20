import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';

export const VERSION = '2026-07-28';
const serverPath = fileURLToPath(new URL('./server.mjs', import.meta.url));

export class LabError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}
function object(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
function exactKeys(value, required) {
  return object(value) && required.every(key => Object.hasOwn(value, key)) && Object.keys(value).every(key => required.includes(key));
}
function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (object(value)) return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
}
function byteSize(value) {
  return Buffer.byteLength(JSON.stringify(value), 'utf8');
}
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export class StdioClient {
  constructor(serverName, clientIdentity = 'lab-host', limits = {}) {
    this.serverName = serverName;
    this.clientIdentity = clientIdentity;
    this.maxFrameBytes = limits.maxFrameBytes ?? 4096;
    this.maxDiagnosticBytes = limits.maxDiagnosticBytes ?? 512;
    this.terminationMs = limits.terminationMs ?? 300;
    this.nextId = 1;
    this.pending = new Map();
    this.quarantine = new Map();
    this.maxQuarantine = 32;
    this.quarantineTtlMs = 1000;
    this.stdoutBuffer = Buffer.alloc(0);
    this.stderrBytes = 0;
    this.sentByMethod = new Map();
    this.closed = false;
    this.fatalError = null;
    this.child = spawn(process.execPath, [serverPath, serverName], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: {...process.env, EXPECTED_CLIENT_ID: clientIdentity}
    });
    this.exitPromise = new Promise(resolve => this.child.once('exit', (code, signal) => resolve({code, signal})));
    this.child.stdout.on('data', chunk => this.receiveBytes(chunk));
    this.child.stderr.on('data', chunk => {
      this.stderrBytes += chunk.length;
      if (this.stderrBytes > this.maxDiagnosticBytes) this.fail(new LabError('DIAGNOSTIC_LIMIT', 'child stderr exceeded the diagnostic limit'));
    });
    this.child.on('error', error => this.fail(new LabError('CHILD_ERROR', error.message)));
    this.child.on('exit', (code, signal) => {
      if (!this.closed && this.pending.size) this.fail(new LabError('CHILD_EXIT', `child exited with ${code ?? signal}`), false);
    });
  }
  meta() {
    return {
      'io.modelcontextprotocol/protocolVersion': VERSION,
      'io.modelcontextprotocol/clientInfo': {name: this.clientIdentity, version: '1.0.0'},
      'io.modelcontextprotocol/clientCapabilities': {roots: {}}
    };
  }
  cleanupQuarantine() {
    const now = Date.now();
    for (const [id, expiresAt] of this.quarantine) if (expiresAt <= now) this.quarantine.delete(id);
    while (this.quarantine.size > this.maxQuarantine) this.quarantine.delete(this.quarantine.keys().next().value);
  }
  quarantineId(id) {
    this.cleanupQuarantine();
    this.quarantine.set(id, Date.now() + this.quarantineTtlMs);
    this.cleanupQuarantine();
  }
  fail(error, kill = true) {
    if (this.fatalError) return;
    this.fatalError = error;
    for (const pending of this.pending.values()) {
      clearTimeout(pending.timer);
      pending.reject(error);
    }
    this.pending.clear();
    if (kill && this.child.exitCode === null && this.child.signalCode === null) this.child.kill('SIGKILL');
  }
  receiveBytes(chunk) {
    if (this.fatalError) return;
    this.stdoutBuffer = Buffer.concat([this.stdoutBuffer, chunk]);
    if (this.stdoutBuffer.length > this.maxFrameBytes && this.stdoutBuffer.indexOf(10) === -1) {
      this.fail(new LabError('FRAME_LIMIT', 'stdout frame exceeded the byte limit'));
      return;
    }
    let newline;
    while ((newline = this.stdoutBuffer.indexOf(10)) !== -1) {
      const frame = this.stdoutBuffer.subarray(0, newline);
      this.stdoutBuffer = this.stdoutBuffer.subarray(newline + 1);
      if (frame.length > this.maxFrameBytes) {
        this.fail(new LabError('FRAME_LIMIT', 'stdout frame exceeded the byte limit'));
        return;
      }
      this.receiveFrame(frame.toString('utf8'));
      if (this.fatalError) return;
    }
  }
  receiveFrame(line) {
    let message;
    try {
      message = JSON.parse(line);
    } catch {
      this.fail(new LabError('MALFORMED_RESPONSE', 'server emitted malformed JSON'));
      return;
    }
    if (!object(message) || message.jsonrpc !== '2.0' || !(typeof message.id === 'string' || Number.isInteger(message.id))) {
      this.fail(new LabError('INVALID_RESPONSE', 'invalid JSON-RPC response envelope'));
      return;
    }
    const hasResult = Object.hasOwn(message, 'result');
    const hasError = Object.hasOwn(message, 'error');
    if (hasResult === hasError || Object.keys(message).some(key => !['jsonrpc', 'id', 'result', 'error'].includes(key))) {
      this.fail(new LabError('INVALID_RESPONSE', 'response must contain exactly one of result or error'));
      return;
    }
    const pending = this.pending.get(message.id);
    if (!pending) {
      this.cleanupQuarantine();
      if (this.quarantine.has(message.id)) return;
      this.fail(new LabError('UNKNOWN_RESPONSE_ID', `unexpected response id ${message.id}`));
      return;
    }
    clearTimeout(pending.timer);
    this.pending.delete(message.id);
    if (hasError) {
      if (!exactKeys(message.error, ['code', 'message']) || !Number.isInteger(message.error.code) || typeof message.error.message !== 'string') {
        pending.reject(new LabError('INVALID_RESPONSE', 'invalid JSON-RPC error object'));
      } else {
        pending.reject(new LabError(`RPC_${message.error.code}`, message.error.message));
      }
    } else {
      pending.resolve(message.result);
    }
  }
  request(method, fields = {}, options = {}) {
    if (this.closed) return Promise.reject(new LabError('SHUTDOWN', 'client is closed'));
    if (this.fatalError) return Promise.reject(this.fatalError);
    if (!object(fields) || Object.hasOwn(fields, '_meta')) return Promise.reject(new LabError('UNTRUSTED_META', 'call fields may not supply or replace params._meta'));
    const id = this.nextId++;
    const timeoutMs = options.timeoutMs ?? 500;
    const metadata = options.trustedMeta ?? this.meta();
    const params = {_meta: metadata, ...fields};
    const request = {jsonrpc: '2.0', id, method, params};
    this.sentByMethod.set(method, (this.sentByMethod.get(method) ?? 0) + 1);
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        this.quarantineId(id);
        reject(new LabError(options.sideEffect ? 'UNKNOWN_OUTCOME' : 'TIMEOUT', `deadline exceeded for ${method}; request was not replayed`));
      }, timeoutMs);
      this.pending.set(id, {resolve, reject, timer});
      this.child.stdin.write(JSON.stringify(request) + '\n', error => {
        if (!error) return;
        const pending = this.pending.get(id);
        if (!pending) return;
        clearTimeout(pending.timer);
        this.pending.delete(id);
        pending.reject(new LabError('WRITE_ERROR', error.message));
      });
    });
  }
  raw(line, timeoutMs = 500) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new LabError('TIMEOUT', 'raw request timed out'));
      }, timeoutMs);
      this.pending.set(id, {resolve, reject, timer});
      this.child.stdin.write(line.replace('__ID__', String(id)) + '\n');
    });
  }
  async close() {
    if (this.closed) return;
    this.closed = true;
    for (const pending of this.pending.values()) {
      clearTimeout(pending.timer);
      pending.reject(new LabError('SHUTDOWN', 'client shutting down'));
    }
    this.pending.clear();
    if (this.child.exitCode === null && this.child.signalCode === null) this.child.stdin.end();
    const first = await Promise.race([this.exitPromise, delay(this.terminationMs).then(() => null)]);
    if (!first && this.child.exitCode === null && this.child.signalCode === null) {
      this.child.kill('SIGKILL');
      const second = await Promise.race([this.exitPromise, delay(this.terminationMs).then(() => null)]);
      if (!second) throw new LabError('TERMINATION_TIMEOUT', 'child did not terminate after SIGKILL');
    }
  }
}

export class Host {
  constructor(policy, options = {}) {
    this.policy = policy;
    this.clients = new Map();
    this.discoveryCache = new Map();
    this.maxDiscoveryTtlMs = options.maxDiscoveryTtlMs ?? 2000;
    this.maxDiscoveryEntries = options.maxDiscoveryEntries ?? 8;
    this.startupDeadlineMs = options.startupDeadlineMs ?? 600;
  }
  connect(serverName, clientIdentity = 'lab-host', limits = {}) {
    if (this.clients.has(serverName)) throw new LabError('DUPLICATE_SERVER', serverName);
    const client = new StdioClient(serverName, clientIdentity, limits);
    this.clients.set(serverName, client);
    return client;
  }
  cacheKey(serverName, clientIdentity) {
    return canonical({serverName, clientIdentity, policyIdentity: this.policy.identity});
  }
  validateDiscovery(result, expectedIdentity) {
    const info = result?._meta?.['io.modelcontextprotocol/serverInfo'];
    if (!object(result) || result.resultType !== 'complete' || !Array.isArray(result.supportedVersions) || !result.supportedVersions.includes(VERSION)) throw new LabError('BAD_DISCOVERY', 'version or result type invalid');
    if (!object(result.capabilities) || !object(result.capabilities.tools) || !object(result.capabilities.resources) || !object(result.capabilities.prompts)) throw new LabError('BAD_DISCOVERY', 'capabilities invalid');
    if (!exactKeys(result._meta, ['io.modelcontextprotocol/serverInfo']) || !object(info) || info.name !== expectedIdentity || typeof info.version !== 'string') throw new LabError('CROSS_SERVER_IDENTITY', `expected ${expectedIdentity}, received ${info?.name}`);
    if (!Number.isInteger(result.ttlMs) || result.ttlMs < 0 || result.cacheScope !== 'server') throw new LabError('BAD_DISCOVERY', 'ttlMs or cacheScope invalid');
    return result;
  }
  async discover(serverName, expectedIdentity = serverName) {
    const client = this.clients.get(serverName);
    if (!client) throw new LabError('NO_CLIENT', serverName);
    const key = this.cacheKey(serverName, client.clientIdentity);
    const cached = this.discoveryCache.get(key);
    if (cached && cached.expiresAt > Date.now()) return this.validateDiscovery(cached.value, expectedIdentity);
    if (cached) this.discoveryCache.delete(key);
    const result = this.validateDiscovery(await client.request('server/discover', {}, {timeoutMs: this.startupDeadlineMs}), expectedIdentity);
    const ttl = Math.min(result.ttlMs, this.maxDiscoveryTtlMs);
    this.discoveryCache.set(key, {value: result, expiresAt: Date.now() + ttl});
    while (this.discoveryCache.size > this.maxDiscoveryEntries) this.discoveryCache.delete(this.discoveryCache.keys().next().value);
    return result;
  }
  deriveItem(method, fields) {
    if (!object(fields) || Object.hasOwn(fields, '_meta')) throw new LabError('UNTRUSTED_META', 'operation fields may not contain _meta');
    if (method === 'tools/call' || method === 'prompts/get') {
      if (typeof fields.name !== 'string') throw new LabError('INVALID_OPERATION', 'name is required');
      return fields.name;
    }
    if (method === 'resources/read') {
      if (typeof fields.uri !== 'string') throw new LabError('INVALID_OPERATION', 'uri is required');
      return fields.uri;
    }
    throw new LabError('DENIED', 'method is not an authorized protected operation');
  }
  operationArgs(method, fields) {
    if (method === 'tools/call') {
      if (!object(fields.arguments)) throw new LabError('INVALID_OPERATION', 'tool arguments must be an object');
      return fields.arguments;
    }
    return {};
  }
  authorize(serverName, method, fields, suppliedApproval, claimedItem) {
    const client = this.clients.get(serverName);
    if (!client) throw new LabError('NO_CLIENT', serverName);
    const item = this.deriveItem(method, fields);
    if (claimedItem !== undefined && claimedItem !== item) throw new LabError('ITEM_MISMATCH', 'claimed item differs from the validated request item');
    const args = this.operationArgs(method, fields);
    const operations = this.policy.servers?.[serverName]?.operations;
    if (!Array.isArray(operations)) throw new LabError('DENIED', 'server is outside policy scope');
    const operation = operations.find(candidate => candidate.method === method && candidate.item === item && canonical(candidate.args) === canonical(args));
    if (!operation) throw new LabError('DENIED', 'discovery is not authorization and no exact operation rule matched');
    if (!Number.isInteger(operation.timeoutMs) || operation.timeoutMs < 1 || !Number.isInteger(operation.maxOutputBytes) || operation.maxOutputBytes < 1) throw new LabError('INVALID_POLICY', 'bounds must be positive integers');
    const expected = {
      server: serverName,
      method,
      item,
      args,
      policyIdentity: this.policy.identity,
      clientIdentity: client.clientIdentity
    };
    if (operation.requiresApproval) {
      if (canonical(operation.approval) !== canonical(expected) || canonical(suppliedApproval) !== canonical(expected)) throw new LabError('APPROVAL_MISMATCH', `required exact structured approval ${canonical(expected)}`);
    }
    return {operation, item};
  }
  async operate(serverName, method, fields, approval, options = {}) {
    const {operation} = this.authorize(serverName, method, fields, approval, options.claimedItem);
    const client = this.clients.get(serverName);
    const result = await client.request(method, fields, {timeoutMs: operation.timeoutMs, sideEffect: operation.sideEffect === true});
    if (byteSize(result) > operation.maxOutputBytes) throw new LabError('OUTPUT_LIMIT', `result exceeds ${operation.maxOutputBytes} bytes`);
    return result;
  }
  async shutdown() {
    const results = await Promise.allSettled([...this.clients.values()].map(client => client.close()));
    const failure = results.find(result => result.status === 'rejected');
    if (failure) throw failure.reason;
  }
}

export function approval(server, method, item, args, policyIdentity, clientIdentity = 'lab-host') {
  return {server, method, item, args, policyIdentity, clientIdentity};
}
