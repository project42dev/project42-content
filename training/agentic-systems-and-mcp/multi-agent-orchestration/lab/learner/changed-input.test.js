'use strict';

const assert = require('node:assert/strict');
const { runJoin } = require('../src/core');
const { worker } = require('../src/fixtures');
const { hasRequiredWorkers } = require('./join-policy');

async function main() {
  const result = await runJoin({
    workers: [
      worker('alpha', 7, 'A'),
      worker('beta', 2, 'B', { tenant: 'wrong-tenant' }),
      worker('gamma', 5, 'G'),
      worker('epsilon', 3, 'E')
    ],
    requiredWorkerIds: ['alpha', 'beta', 'gamma'],
    tenant: 'tenant-7',
    revision: 'rev-3',
    input: { case: 'independently-changed-extra-worker' },
    callBudget: 4,
    deadlineMs: 100,
    quorumPolicy: hasRequiredWorkers
  });

  assert.deepEqual(result.merged.map((item) => item.workerId), ['alpha', 'epsilon', 'gamma']);
  assert.deepEqual(result.missingRequired, ['beta']);
  assert.deepEqual(result.rejected, [{ workerId: 'beta', reason: 'tenant-mismatch' }]);

  if (result.complete) {
    console.error('FAIL changed input: count-only policy let impostor epsilon replace required beta');
    console.error('CAUSE: changing delta to epsilon preserved quantity but did not restore beta identity coverage');
    process.exitCode = 1;
    return;
  }

  console.log('PASS changed input: impostor epsilon cannot replace required beta');
}

main().catch((error) => {
  console.error(`FAIL changed input: ${error.message}`);
  process.exitCode = 1;
});
