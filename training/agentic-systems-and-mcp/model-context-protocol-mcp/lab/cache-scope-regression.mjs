import assert from 'node:assert/strict';
import {Host, LabError} from './host-lib.mjs';

function discovery(cacheScope, name = 'issues') {
  return {
    resultType: 'complete',
    supportedVersions: ['2026-07-28'],
    capabilities: {tools: {}, resources: {}, prompts: {}},
    _meta: {'io.modelcontextprotocol/serverInfo': {name, version: '1.0.0'}},
    ttlMs: 1000,
    cacheScope
  };
}

function expectCode(fn, code) {
  assert.throws(fn, error => error instanceof LabError && error.code === code);
}

const hostA = new Host({identity: 'policy-a', servers: {}});
assert.equal(hostA.validateDiscovery(discovery('public'), 'issues').cacheScope, 'public');
assert.equal(hostA.validateDiscovery(discovery('private'), 'issues').cacheScope, 'private');
expectCode(() => hostA.validateDiscovery(discovery('server'), 'issues'), 'BAD_DISCOVERY');
expectCode(() => hostA.validateDiscovery(discovery('PUBLIC'), 'issues'), 'BAD_DISCOVERY');
expectCode(() => hostA.validateDiscovery(discovery('public', 'filesystem'), 'issues'), 'CROSS_SERVER_IDENTITY');

const hostB = new Host({identity: 'policy-b', servers: {}});
assert.notEqual(hostA.cacheKey('issues', 'client-a'), hostA.cacheKey('filesystem', 'client-a'));
assert.notEqual(hostA.cacheKey('issues', 'client-a'), hostA.cacheKey('issues', 'client-b'));
assert.notEqual(hostA.cacheKey('issues', 'client-a'), hostB.cacheKey('issues', 'client-a'));
assert.equal(hostA.maxDiscoveryEntries, 8);
assert.equal(hostA.maxDiscoveryTtlMs, 2000);

console.log('PASS cacheScope public accepted');
console.log('PASS cacheScope private accepted');
console.log('PASS invented cacheScope server rejected');
console.log('PASS server, client, and policy cache-key isolation retained');
console.log('PASS serverInfo mismatch remains a routing diagnostic');
