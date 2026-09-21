import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { executeRecovery } from '../src/recovery-core.mjs';
import { validateState } from '../src/validation.mjs';

const mode = process.argv[2];
const modulePath = mode === 'reference'
  ? '../reference/reconcile.reference.mjs'
  : '../src/reconcile.mjs';
const { reconcileAction } = await import(modulePath);

async function fixture(name) {
  return JSON.parse(await readFile(new URL(`../fixtures/${name}`, import.meta.url), 'utf8'));
}

function clone(value) {
  return structuredClone(value);
}

function expectValidationFailure(incident, ledger, pattern) {
  assert.throws(() => validateState(incident, ledger), pattern);
}

try {
  const incident = await fixture('incident.json');
  const ledger = await fixture('ledger.json');
  const baseline = executeRecovery(incident, ledger, reconcileAction);
  assert.deepEqual(baseline.metrics, { CONFIRMED: 1, MISSING: 1, UNKNOWN: 1 });
  assert.equal(baseline.state.entries.filter((entry) => entry.idempotencyKey === 'pay-100').length, 1);
  assert.equal(baseline.state.entries.filter((entry) => entry.idempotencyKey === 'audit-7').length, 1);
  assert.equal(baseline.state.entries.find((entry) => entry.idempotencyKey === 'notice-9').status, 'pending');
  assert.equal(baseline.state.accounts.operating.balance, 1000);
  assert.equal(baseline.state.accounts.reserve.balance, 0);
  console.log('PASS baseline classifications and recovery');

  const changedIncident = await fixture('incident-changed.json');
  const changedLedger = await fixture('ledger-changed.json');
  const changed = executeRecovery(changedIncident, changedLedger, reconcileAction);
  assert.deepEqual(changed.metrics, { CONFIRMED: 1, MISSING: 1, UNKNOWN: 1 });
  assert.equal(changed.state.entries.filter((entry) => entry.idempotencyKey === 'pay-2043').length, 1);
  assert.equal(changed.state.entries.filter((entry) => entry.idempotencyKey === 'audit-2043').length, 1);
  assert.equal(changed.state.entries.find((entry) => entry.idempotencyKey === 'notice-2043').status, 'pending');
  assert.equal(changed.state.accounts.operating.balance, 500);
  assert.equal(changed.state.accounts.reserve.balance, 0);
  console.log('PASS changed-input classifications and recovery');

  assert.deepEqual(baseline.state.entries.slice(0, ledger.entries.length), ledger.entries);
  assert.deepEqual(incident.events, (await fixture('incident.json')).events);
  console.log('PASS original evidence preservation');

  const duplicateLedger = clone(ledger);
  duplicateLedger.entries.push(clone(duplicateLedger.entries[0]));
  duplicateLedger.entries[2].entryId = 'L-duplicate';
  expectValidationFailure(incident, duplicateLedger, /duplicate ledger idempotency key/);
  console.log('PASS duplicate binding rejection');

  const malformedIncident = clone(incident);
  malformedIncident.actions[0].retryBudget = '1';
  expectValidationFailure(malformedIncident, ledger, /retryBudget must be an integer/);
  console.log('PASS malformed type rejection');

  const unknownIdentityIncident = clone(incident);
  unknownIdentityIncident.actions[1].actorId = 'unknown-actor';
  expectValidationFailure(unknownIdentityIncident, ledger, /unknown actor identity/);
  console.log('PASS unknown identity rejection');

  const invalidBudgetIncident = clone(incident);
  invalidBudgetIncident.actions[1].retryBudget = -1;
  expectValidationFailure(invalidBudgetIncident, ledger, /retryBudget must be between 0 and 3/);
  console.log('PASS invalid budget rejection');

  const mismatchedLedger = clone(ledger);
  mismatchedLedger.entries[0].binding.amount = 101;
  expectValidationFailure(incident, mismatchedLedger, /intended binding mismatch/);
  console.log('PASS mismatched binding rejection');

  console.log('PASS all 8 checks');
} catch (error) {
  console.error(`FAIL ${error.message}`);
  process.exitCode = 1;
}
