import assert from 'node:assert/strict';

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function requireString(value, label) {
  assert.equal(typeof value, 'string', `${label} must be a string`);
  assert.ok(value.length > 0, `${label} must not be empty`);
}

function sameJson(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

export function validateState(incident, ledger) {
  assert.ok(isObject(incident), 'incident must be an object');
  assert.ok(isObject(ledger), 'ledger must be an object');
  requireString(incident.id, 'incident.id');
  requireString(incident.severity, 'incident.severity');
  requireString(incident.tenantId, 'incident.tenantId');
  assert.equal(typeof incident.contained, 'boolean', 'incident.contained must be a boolean');
  assert.equal(incident.contained, true, 'incident must be contained before recovery');
  assert.ok(Array.isArray(incident.events), 'incident.events must be an array');
  assert.ok(Array.isArray(incident.actions), 'incident.actions must be an array');
  assert.ok(Array.isArray(ledger.identities), 'ledger.identities must be an array');
  assert.ok(Array.isArray(ledger.approvals), 'ledger.approvals must be an array');
  assert.ok(Array.isArray(ledger.entries), 'ledger.entries must be an array');
  assert.equal(ledger.tenantId, incident.tenantId, 'ledger tenant must match incident tenant');

  const actionIds = new Set();
  const actionKeys = new Set();
  for (const action of incident.actions) {
    assert.ok(isObject(action), 'each action must be an object');
    for (const field of ['actionId', 'kind', 'tenantId', 'actorId', 'idempotencyKey', 'correlationId', 'transport']) {
      requireString(action[field], `action.${field}`);
    }
    assert.equal(action.tenantId, incident.tenantId, 'action tenant must match incident tenant');
    assert.ok(Number.isInteger(action.retryBudget), 'action.retryBudget must be an integer');
    assert.ok(action.retryBudget >= 0 && action.retryBudget <= 3, 'action.retryBudget must be between 0 and 3');
    assert.ok(!actionIds.has(action.actionId), `duplicate actionId ${action.actionId}`);
    assert.ok(!actionKeys.has(action.idempotencyKey), `duplicate action idempotency key ${action.idempotencyKey}`);
    actionIds.add(action.actionId);
    actionKeys.add(action.idempotencyKey);
    const identity = ledger.identities.find((item) => item.actorId === action.actorId);
    assert.ok(identity, `unknown actor identity ${action.actorId}`);
    assert.equal(identity.active, true, `actor identity ${action.actorId} must be active`);
    assert.equal(identity.tenantId, action.tenantId, `actor identity ${action.actorId} tenant mismatch`);
    assert.ok(isObject(action.intended), `action ${action.actionId} intended must be an object`);
    if (action.kind === 'transfer') {
      requireString(action.intended.from, 'transfer intended.from');
      requireString(action.intended.to, 'transfer intended.to');
      assert.ok(Number.isFinite(action.intended.amount) && action.intended.amount > 0, 'transfer amount must be a positive number');
    } else if (action.kind === 'audit') {
      requireString(action.intended.recordType, 'audit intended.recordType');
      requireString(action.intended.subjectId, 'audit intended.subjectId');
    } else if (action.kind === 'notify') {
      requireString(action.intended.channel, 'notify intended.channel');
      requireString(action.intended.template, 'notify intended.template');
    } else {
      assert.fail(`unsupported action kind ${action.kind}`);
    }
  }

  const entryKeys = new Map();
  for (const entry of ledger.entries) {
    assert.ok(isObject(entry), 'each ledger entry must be an object');
    for (const field of ['entryId', 'status', 'tenantId', 'actorId', 'actionId', 'idempotencyKey', 'correlationId', 'kind']) {
      requireString(entry[field], `entry.${field}`);
    }
    assert.ok(['confirmed', 'pending'].includes(entry.status), `unsupported entry status ${entry.status}`);
    assert.equal(entry.tenantId, incident.tenantId, `entry ${entry.entryId} tenant mismatch`);
    assert.ok(!entryKeys.has(entry.idempotencyKey), `duplicate ledger idempotency key ${entry.idempotencyKey}`);
    entryKeys.set(entry.idempotencyKey, entry.entryId);
    const action = incident.actions.find((item) => item.idempotencyKey === entry.idempotencyKey);
    assert.ok(action, `entry ${entry.entryId} has no incident action binding`);
    assert.equal(entry.actionId, action.actionId, `entry ${entry.entryId} action binding mismatch`);
    assert.equal(entry.actorId, action.actorId, `entry ${entry.entryId} actor binding mismatch`);
    assert.equal(entry.correlationId, action.correlationId, `entry ${entry.entryId} correlation binding mismatch`);
    assert.equal(entry.kind, action.kind, `entry ${entry.entryId} kind binding mismatch`);
    assert.ok(sameJson(entry.binding, action.intended), `entry ${entry.entryId} intended binding mismatch`);
  }

  assert.ok(isObject(ledger.accounts), 'ledger.accounts must be an object');
  for (const accountName of ['operating', 'reserve']) {
    const account = ledger.accounts[accountName];
    assert.ok(isObject(account), `account ${accountName} must be an object`);
    assert.ok(Number.isFinite(account.baseline), `account ${accountName} baseline must be a number`);
    assert.ok(Number.isFinite(account.balance), `account ${accountName} balance must be a number`);
  }
}
