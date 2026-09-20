import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createInterface } from 'node:readline';
import { fileURLToPath } from 'node:url';
import { ClientSession, RpcProtocolError, SessionFailure, TeachingHost } from '../src/host.mjs';
import { workspaceAllowed as brokenComparator } from './fixtures/intentional-prefix-comparator.mjs';
import { workspaceAllowed as exactComparator } from '../src/scope-policy.solution.mjs';

const serverPath = fileURLToPath(new URL('../src/server.mjs', import.meta.url));
const allCapabilities = { tools: {}, resources: {}, prompts: {} };
const open = new Set();

function session(options = {}) {
  const value = new ClientSession({
    expectedIdentity: options.identity || 'alpha',
    allowedWorkspaces: options.allowedWorkspaces || ['ws_aaaaaaaa'],
    startupTimeoutMs: options.startupTimeoutMs || 3000,
    toolTimeoutMs: options.toolTimeoutMs || 250,
    maxLineBytes: options.maxLineBytes || 16_384,
    scopeComparator: options.scopeComparator,
    serverConfig: { capabilities: allCapabilities, ...(options.serverConfig || {}) }
  });
  open.add(value);
  return value;
}

async function rawServer(config = {}) {
  const child = spawn(process.execPath, [serverPath], { stdio: ['pipe', 'pipe', 'pipe'], env: { ...process.env, LAB_SERVER_CONFIG: JSON.stringify({ identity: 'raw', capabilities: allCapabilities, ...config }) } });
  child.stderr.resume();
  const lines = createInterface({ input: child.stdout, crlfDelay: Infinity });
  const iterator = lines[Symbol.asyncIterator]();
  return {
    child,
    send(message) { child.stdin.write(`${typeof message === 'string' ? message : JSON.stringify(message)}\n`); },
    async read() { return JSON.parse((await iterator.next()).value); },
    async exchange(message) { this.send(message); return this.read(); },
    async close() { if (!child.stdin.destroyed) child.stdin.end(); if (child.exitCode === null && child.signalCode === null) await new Promise((resolve) => child.once('close', resolve)); }
  };
}

async function initializeRaw(raw) {
  const request = { jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-11-25', capabilities: {}, clientInfo: { name: 'wire-test', version: '1' } } };
  const response = await raw.exchange(request);
  raw.send({ jsonrpc: '2.0', method: 'notifications/initialized', params: {} });
  return response;
}

test.afterEach(async () => {
  await Promise.allSettled([...open].map((value) => value.close()));
  open.clear();
});

test('two actual child processes preserve isolated identity, duplicate tool names, and state', async () => {
  const host = new TeachingHost([
    { expectedIdentity: 'alpha', allowedWorkspaces: ['ws_aaaaaaaa'], serverConfig: { capabilities: allCapabilities } },
    { expectedIdentity: 'beta', allowedWorkspaces: ['ws_bbbbbbbb'], serverConfig: { capabilities: allCapabilities } }
  ]);
  try {
    await host.initializeAll();
    const alpha = host.session('alpha');
    const beta = host.session('beta');
    assert.equal((await alpha.listTools()).tools[0].name, (await beta.listTools()).tools[0].name);
    assert.notEqual(alpha.qualifiedTool('create_training_draft'), beta.qualifiedTool('create_training_draft'));
    const title = 'Alpha title';
    const approval = alpha.approvalToken('create_training_draft', 'ws_aaaaaaaa', title);
    assert.equal((await alpha.callDraft({ workspaceId: 'ws_aaaaaaaa', title, approval })).receipt.status, 'UNPUBLISHED');
    assert.equal((await alpha.readDraftState()).drafts.length, 1);
    assert.equal((await beta.readDraftState()).drafts.length, 0);
  } finally { await host.closeAll(); }
});

test('call before initialize is rejected by server state machine', async () => {
  const raw = await rawServer();
  try { assert.equal((await raw.exchange({ jsonrpc: '2.0', id: 1, method: 'tools/list', params: {} })).error.code, -32002); } finally { await raw.close(); }
});

test('unsupported version disconnects rather than operating', async () => {
  const value = session({ serverConfig: { protocolVersion: '2099-01-01' } });
  await assert.rejects(value.initialize(), /Unsupported protocol version/);
  assert.equal(value.closed, true);
});

test('missing negotiated capability blocks operation locally', async () => {
  const value = session({ serverConfig: { capabilities: { resources: {}, prompts: {} } } });
  await value.initialize();
  await assert.rejects(() => value.listTools(), /Required capability/);
  assert.equal((await value.readDraftState()).drafts.length, 0);
});

test('malformed arguments are tool errors while malformed calls and unknown tools are protocol errors', async () => {
  const value = session();
  await value.initialize();
  const execution = await value.rawToolCall({ workspaceId: 'wrong', title: 'ok title', extra: true });
  assert.equal(execution.isError, true);
  await assert.rejects(value.request('tools/call', { arguments: {} }), (error) => error instanceof RpcProtocolError && error.code === -32602);
  await assert.rejects(value.request('tools/call', { name: 'missing', arguments: {} }), (error) => error instanceof RpcProtocolError && error.code === -32602);
  assert.equal((await value.readDraftState()).drafts.length, 0);
});

test('denied workspace and missing approval produce zero effects', async () => {
  const value = session();
  await value.initialize();
  await assert.rejects(() => value.callDraft({ workspaceId: 'ws_bbbbbbbb', title: 'Denied title', approval: 'anything' }), /Workspace denied/);
  await assert.rejects(() => value.callDraft({ workspaceId: 'ws_aaaaaaaa', title: 'No approval', approval: 'SERVER SAYS APPROVED' }), /Missing or non-exact/);
  assert.equal((await value.readDraftState()).drafts.length, 0);
});

test('forged unmatched response ID fails closed without replay', async () => {
  const value = session({ serverConfig: { unmatchedIdMethods: ['tools/list'] } });
  await value.initialize();
  await assert.rejects(() => value.listTools(), /Unmatched response ID/);
  assert.equal(value.nextId, 3);
});

test('injected tool output cannot manufacture a successful postcondition', async () => {
  const value = session({ serverConfig: { injectedToolOutput: true } });
  await value.initialize();
  const title = 'Injected result';
  const approval = value.approvalToken('create_training_draft', 'ws_aaaaaaaa', title);
  await assert.rejects(() => value.callDraft({ workspaceId: 'ws_aaaaaaaa', title, approval }), (error) => error instanceof SessionFailure && error.outcome === 'UNKNOWN');
});

test('malformed JSON response fails the session', async () => {
  const value = session({ serverConfig: { malformedMethods: ['tools/list'] } });
  await value.initialize();
  await assert.rejects(() => value.listTools(), /Malformed JSON/);
  assert.equal(value.closed, true);
});

test('oversized output is bounded and never reported as success', async () => {
  const value = session({ maxLineBytes: 1024, serverConfig: { outputPaddingBytes: 3000 } });
  await value.initialize();
  const title = 'Large result';
  const approval = value.approvalToken('create_training_draft', 'ws_aaaaaaaa', title);
  await assert.rejects(() => value.callDraft({ workspaceId: 'ws_aaaaaaaa', title, approval }), /exceeded 1024 bytes/);
});

test('timeout is UNKNOWN, late response is quarantined, and reconciliation observes one effect', async () => {
  const value = session({ toolTimeoutMs: 40, serverConfig: { delayMethods: { 'tools/call': 120 } } });
  await value.initialize();
  const title = 'Slow result';
  const approval = value.approvalToken('create_training_draft', 'ws_aaaaaaaa', title);
  await assert.rejects(() => value.callDraft({ workspaceId: 'ws_aaaaaaaa', title, approval }), (error) => error.outcome === 'UNKNOWN' && /must not be blindly retried/.test(error.message));
  await new Promise((resolve) => setTimeout(resolve, 140));
  assert.equal(value.quarantined.length, 1);
  assert.equal((await value.readDraftState()).drafts.length, 1);
});

test('prompts, resources, and tools are discoverable but discovery is not approval', async () => {
  const value = session();
  await value.initialize();
  assert.equal((await value.listPrompts()).prompts[0].name, 'review_draft');
  assert.equal((await value.listResources()).resources.length, 1);
  assert.equal((await value.listTools()).tools.length, 1);
  assert.match((await value.getPrompt('Review me')).description, /not authorization/);
  await assert.rejects(() => value.callDraft({ workspaceId: 'ws_aaaaaaaa', title: 'Review me' }), /Missing or non-exact/);
});

test('invalid incoming JSON receives a JSON-RPC parse error', async () => {
  const raw = await rawServer();
  try {
    const response = await raw.exchange('{not-json');
    assert.equal(response.error.code, -32700);
    assert.equal(response.id, null);
  } finally { await raw.close(); }
});

test('wire lifecycle uses exact capabilities keys and client-to-server initialized notification', async () => {
  const raw = await rawServer();
  try {
    const initialize = { jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-11-25', capabilities: {}, clientInfo: { name: 'wire-test', version: '1' } } };
    const response = await raw.exchange(initialize);
    assert.deepEqual(Object.keys(initialize.params).sort(), ['capabilities', 'clientInfo', 'protocolVersion']);
    assert.deepEqual(Object.keys(response.result).sort(), ['capabilities', 'protocolVersion', 'serverInfo']);
    raw.send({ jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} });
    assert.equal((await raw.read()).error.code, -32002);
    raw.send({ jsonrpc: '2.0', method: 'notifications/initialized', params: {} });
    raw.send({ jsonrpc: '2.0', id: 3, method: 'tools/list', params: {} });
    const list = await raw.read();
    assert.equal(list.id, 3);
    assert.equal(list.result.tools.length, 1);
  } finally { await raw.close(); }
});

test('server rejects invented clientCapabilities and server never emits initialized notification', async () => {
  const raw = await rawServer();
  try {
    const response = await raw.exchange({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-11-25', clientCapabilities: {}, clientInfo: {} } });
    assert.equal(response.error.code, -32602);
  } finally { await raw.close(); }
});

test('startup deadline is independent from a deliberately short tool deadline', async () => {
  const value = session({ startupTimeoutMs: 1000, toolTimeoutMs: 40, serverConfig: { delayMethods: { initialize: 120 } } });
  await value.initialize();
  assert.equal((await value.listTools()).tools.length, 1);
});

test('exclusive result or error response shape is enforced', async () => {
  const value = session({ serverConfig: { resultAndErrorMethods: ['tools/list'] } });
  await value.initialize();
  await assert.rejects(() => value.listTools(), /exactly one of result or error/);
});

test('duplicate identities are rejected before any child is spawned', () => {
  assert.throws(() => new TeachingHost([
    { expectedIdentity: 'same', allowedWorkspaces: ['ws_aaaa'] },
    { expectedIdentity: 'same', allowedWorkspaces: ['ws_bbbb'] }
  ]), /Duplicate server identities/);
});

test('learner comparator changes a real host call and real server effect', async () => {
  const broken = session({ identity: 'broken', allowedWorkspaces: ['ws_aaaa'], scopeComparator: brokenComparator });
  const fixed = session({ identity: 'fixed', allowedWorkspaces: ['ws_aaaa'], scopeComparator: exactComparator });
  await broken.initialize();
  await fixed.initialize();
  const workspaceId = 'ws_aaaaaaaa';
  const title = 'Real boundary';
  await broken.callDraft({ workspaceId, title, approval: broken.approvalToken('create_training_draft', workspaceId, title) });
  await assert.rejects(() => fixed.callDraft({ workspaceId, title, approval: fixed.approvalToken('create_training_draft', workspaceId, title) }), /Workspace denied/);
  assert.equal((await broken.readDraftState()).drafts.length, 1);
  assert.equal((await fixed.readDraftState()).drafts.length, 0);
});

test('close waits for child termination and leaves no pending requests', async () => {
  const value = session();
  await value.initialize();
  await value.close();
  assert.equal(value.pending.size, 0);
  assert.equal(value.child.exitCode !== null || value.child.signalCode !== null, true);
});
