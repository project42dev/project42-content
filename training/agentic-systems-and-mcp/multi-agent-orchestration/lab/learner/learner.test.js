'use strict';

const assert = require('node:assert/strict');
const { runJoin } = require('../src/core');
const { worker } = require('../src/fixtures');
const { hasRequiredWorkers } = require('./join-policy');

async function main() {
  const common = {
    requiredWorkerIds: ['alpha', 'beta', 'gamma'],
    tenant: 'tenant-7',
    revision: 'rev-3',
    input: { case: 'missing-beta-with-same-count' },
    callBudget: 4,
    deadlineMs: 100,
    quorumPolicy: hasRequiredWorkers
  };

  // Beta is configured, so strict runJoin validation succeeds. Its stale
  // envelope is then rejected. Optional delta leaves three valid envelopes,
  // which is the same number as the three required identities.
  const missingBeta = await runJoin({
    ...common,
    workers: [
      worker('alpha', 8, 'A'),
      worker('beta', 2, 'B', { revision: 'old' }),
      worker('gamma', 5, 'G'),
      worker('delta', 3, 'D')
    ]
  });

  assert.deepEqual(missingBeta.merged.map((item) => item.workerId), ['alpha', 'delta', 'gamma']);
  assert.deepEqual(missingBeta.missingRequired, ['beta']);
  assert.deepEqual(missingBeta.rejected, [{ workerId: 'beta', reason: 'revision-mismatch' }]);

  if (missingBeta.complete) {
    console.error('FAIL learner repair: required worker beta is absent but broken policy returned complete=true');
    console.error('CAUSE: three valid envelopes matched the required count, but delta did not satisfy required identity beta');
    process.exitCode = 1;
    return;
  }

  // Positive control: beta is valid and optional delta is invalid. The number
  // of valid results is still three, but all required identities are present.
  const covered = await runJoin({
    ...common,
    input: { case: 'required-identities-covered' },
    workers: [
      worker('alpha', 8, 'A'),
      worker('beta', 2, 'B'),
      worker('gamma', 5, 'G'),
      worker('delta', 3, 'D', { revision: 'old' })
    ]
  });

  assert.deepEqual(covered.merged.map((item) => item.workerId), ['alpha', 'beta', 'gamma']);
  assert.deepEqual(covered.missingRequired, []);
  assert.equal(covered.complete, true);
  console.log('PASS learner repair: required identities enforced');
}

main().catch((error) => {
  console.error(`FAIL learner repair: ${error.message}`);
  process.exitCode = 1;
});
