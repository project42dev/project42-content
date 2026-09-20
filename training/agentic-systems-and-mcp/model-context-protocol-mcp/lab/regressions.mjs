import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {Host, LabError, approval} from './host-lib.mjs';

const fixture = JSON.parse(await fs.readFile(new URL('./policy.fixture.json', import.meta.url), 'utf8'));
let passed = 0;
async function expectCode(promise, code) {
  await assert.rejects(promise, error => error instanceof LabError && error.code === code);
}
async function test(name, fn) {
  await fn();
  passed++;
  console.log(`PASS ${name}`);
}
async function withHost(policy, fn, limits) {
  const host = new Host(policy);
  try { await fn(host, limits); } finally { await host.shutdown(); }
}

await test('two isolated clients and primitive families', async () => {
  await withHost(structuredClone(fixture), async h => {
    const f = h.connect('filesystem');
    const i = h.connect('issues');
    assert.notEqual(f.child.pid, i.child.pid);
    await h.discover('filesystem');
    await h.discover('issues');
    assert.equal((await f.request('tools/list')).tools[0].name, 'files.wordCount');
    assert.equal((await f.request('resources/list')).resources[0].uri, 'file:///demo/readme.txt');
    assert.deepEqual((await f.request('resources/templates/list')).resourceTemplates, []);
    assert.equal((await i.request('prompts/list')).prompts[0].name, 'triage-issue');
  });
});
await test('discovery is not authorization', async () => {
  await withHost(structuredClone(fixture), async h => {
    h.connect('filesystem');
    await h.discover('filesystem');
    await expectCode(h.operate('filesystem', 'tools/call', {name: 'files.wordCount', arguments: {text: 'one two'}}), 'DENIED');
  });
});
await test('operation-specific prompt and create approvals', async () => {
  await withHost(structuredClone(fixture), async h => {
    h.connect('issues');
    const pa = approval('issues', 'prompts/get', 'triage-issue', {}, 'fixture-policy');
    assert.equal((await h.operate('issues', 'prompts/get', {name: 'triage-issue'}, pa)).messages[0].role, 'user');
    const args = {title: 'Demo', operationKey: 'create-demo'};
    const ca = approval('issues', 'tools/call', 'issues.create', args, 'fixture-policy');
    assert.equal((await h.operate('issues', 'tools/call', {name: 'issues.create', arguments: args}, ca)).operationKey, 'create-demo');
  });
});
await test('wrong protocol version rejected', async () => {
  await withHost(structuredClone(fixture), async h => {
    const c = h.connect('filesystem');
    const meta = c.meta();
    meta['io.modelcontextprotocol/protocolVersion'] = '1900-01-01';
    await expectCode(c.request('server/discover', {}, {trustedMeta: meta}), 'RPC_-32602');
  });
});
await test('forged client identity rejected', async () => {
  await withHost(structuredClone(fixture), async h => {
    const c = h.connect('filesystem');
    const meta = c.meta();
    meta['io.modelcontextprotocol/clientInfo'] = {name: 'forged', version: '1.0.0'};
    await expectCode(c.request('server/discover', {}, {trustedMeta: meta}), 'RPC_-32602');
  });
});
await test('caller metadata override rejected before send', async () => {
  await withHost(structuredClone(fixture), async h => {
    const c = h.connect('filesystem');
    await expectCode(c.request('tools/list', {_meta: {forged: true}}), 'UNTRUSTED_META');
    assert.equal(c.sentByMethod.get('tools/list'), undefined);
  });
});
await test('claimed item mismatch rejected', async () => {
  await withHost(structuredClone(fixture), async h => {
    h.connect('issues');
    const args = {title: 'Demo', operationKey: 'create-demo'};
    const a = approval('issues', 'tools/call', 'issues.create', args, 'fixture-policy');
    await expectCode(h.operate('issues', 'tools/call', {name: 'issues.create', arguments: args}, a, {claimedItem: 'issues.search'}), 'ITEM_MISMATCH');
  });
});
await test('structured approvals resist delimiter collision', async () => {
  await withHost(structuredClone(fixture), async h => {
    h.connect('issues');
    const args = {title: 'Demo', operationKey: 'create-demo'};
    const forged = approval('issues|tools/call', 'issues.create', '', args, 'fixture-policy');
    await expectCode(h.operate('issues', 'tools/call', {name: 'issues.create', arguments: args}, forged), 'APPROVAL_MISMATCH');
  });
});
await test('cross-server discovery identity rejected', async () => {
  await withHost(structuredClone(fixture), async h => {
    h.connect('issues');
    await expectCode(h.discover('issues', 'filesystem'), 'CROSS_SERVER_IDENTITY');
  });
});
await test('cache is bounded, isolated, and revalidated on hit', async () => {
  await withHost(structuredClone(fixture), async h => {
    h.connect('filesystem');
    const first = await h.discover('filesystem');
    first._meta['io.modelcontextprotocol/serverInfo'].name = 'issues';
    await expectCode(h.discover('filesystem'), 'CROSS_SERVER_IDENTITY');
    h.discoveryCache.clear();
    for (let n = 0; n < 12; n++) {
      h.policy.identity = `policy-${n}`;
      await h.discover('filesystem');
    }
    assert.equal(h.discoveryCache.size, 8);
    assert.ok([...h.discoveryCache.keys()].every(key => key.includes('clientIdentity')));
  });
});
await test('oversized operation result rejected', async () => {
  await withHost(structuredClone(fixture), async h => {
    h.connect('issues');
    const a = approval('issues', 'tools/call', 'issues.big', {}, 'fixture-policy');
    await expectCode(h.operate('issues', 'tools/call', {name: 'issues.big', arguments: {}}, a), 'OUTPUT_LIMIT');
  });
});
await test('malformed JSON-RPC request receives invalid request', async () => {
  await withHost(structuredClone(fixture), async h => {
    const c = h.connect('filesystem');
    await expectCode(c.raw('{"jsonrpc":"2.0","id":__ID__,"method":7,"params":{}}'), 'RPC_-32600');
  });
});
await test('malformed response fails closed', async () => {
  await withHost(structuredClone(fixture), async h => {
    const c = h.connect('filesystem');
    await expectCode(c.request('test/malformedResponse'), 'MALFORMED_RESPONSE');
  });
});
await test('result and error together fail closed', async () => {
  await withHost(structuredClone(fixture), async h => {
    const c = h.connect('filesystem');
    await expectCode(c.request('test/doubleEnvelope'), 'INVALID_RESPONSE');
  });
});
await test('unknown response id fails closed', async () => {
  await withHost(structuredClone(fixture), async h => {
    const c = h.connect('filesystem');
    await expectCode(c.request('test/unknownResponse'), 'UNKNOWN_RESPONSE_ID');
  });
});
await test('oversized response frame rejected', async () => {
  await withHost(structuredClone(fixture), async h => {
    const c = h.connect('filesystem');
    await expectCode(c.request('test/oversizedFrame'), 'FRAME_LIMIT');
  });
});
await test('stderr diagnostics are bounded', async () => {
  await withHost(structuredClone(fixture), async h => {
    const c = h.connect('filesystem');
    await expectCode(c.request('test/stderrFlood'), 'DIAGNOSTIC_LIMIT');
  });
});
await test('early child exit rejects pending request', async () => {
  await withHost(structuredClone(fixture), async h => {
    const c = h.connect('filesystem');
    await expectCode(c.request('test/exit'), 'CHILD_EXIT');
  });
});
await test('side-effect timeout is reconciled without replay', async () => {
  await withHost(structuredClone(fixture), async h => {
    const c = h.connect('issues');
    const slowArgs = {title: 'Do not replay', operationKey: 'slow-1'};
    const slowApproval = approval('issues', 'tools/call', 'issues.slowCreate', slowArgs, 'fixture-policy');
    await expectCode(h.operate('issues', 'tools/call', {name: 'issues.slowCreate', arguments: slowArgs}, slowApproval), 'UNKNOWN_OUTCOME');
    await new Promise(resolve => setTimeout(resolve, 180));
    const reconcileArgs = {operationKey: 'slow-1'};
    const reconcileApproval = approval('issues', 'tools/call', 'issues.reconcile', reconcileArgs, 'fixture-policy');
    const state = await h.operate('issues', 'tools/call', {name: 'issues.reconcile', arguments: reconcileArgs}, reconcileApproval);
    assert.deepEqual(state.record, {operationKey: 'slow-1', title: 'Do not replay', state: 'created'});
    assert.equal(c.sentByMethod.get('tools/call'), 2);
    assert.equal(c.quarantine.size, 1);
  });
});
await test('shutdown is bounded and leaves no live child', async () => {
  const h = new Host(structuredClone(fixture));
  const c = h.connect('filesystem', 'lab-host', {terminationMs: 100});
  const pending = c.request('test/hang', {}, {timeoutMs: 5000});
  const pendingExpectation = expectCode(pending, 'SHUTDOWN');
  const started = Date.now();
  await h.shutdown();
  await pendingExpectation;
  assert.ok(Date.now() - started < 1000);
  assert.ok(c.child.exitCode !== null || c.child.signalCode !== null);
});

console.log(`RESULT ${passed}/20 regressions passed`);
