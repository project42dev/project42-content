'use strict';

const assert = require('node:assert/strict');
const { hasRequiredWorkers } = require('./join-policy');

try {
  const required = ['alpha', 'beta', 'gamma'];
  assert.equal(hasRequiredWorkers([
    { workerId: 'alpha' },
    { workerId: 'gamma' },
    { workerId: 'delta' }
  ], required), false);
  assert.equal(hasRequiredWorkers([
    { workerId: 'gamma' },
    { workerId: 'alpha' },
    { workerId: 'beta' }
  ], required), true);
  console.log('PASS reference solution: required identities enforced');
} catch (error) {
  console.error(`FAIL reference solution: ${error.message}`);
  process.exitCode = 1;
}
