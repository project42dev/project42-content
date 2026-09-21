import assert from 'node:assert/strict';
import { validateState } from './validation.mjs';

function clone(value) {
  return structuredClone(value);
}

function countDuplicateKeys(entries) {
  const keys = new Set();
  let duplicates = 0;
  for (const entry of entries) {
    if (keys.has(entry.idempotencyKey)) duplicates += 1;
    keys.add(entry.idempotencyKey);
  }
  return duplicates;
}

function retryMissing(action, state) {
  const existing = state.entries.find((entry) => entry.idempotencyKey === action.idempotencyKey);
  if (existing) {
    throw new Error(`unsafe retry blocked: idempotency key ${action.idempotencyKey} already binds ledger entry ${existing.entryId}`);
  }
  if (action.retryBudget < 1) {
    throw new Error(`retry budget exhausted for ${action.actionId}`);
  }
  if (action.kind !== 'audit') {
    throw new Error(`missing ${action.kind} action ${action.actionId} requires human authorization`);
  }
  state.entries.push({
    entryId: `recovery-audit-${action.actionId}`,
    status: 'confirmed',
    tenantId: action.tenantId,
    actorId: action.actorId,
    actionId: action.actionId,
    idempotencyKey: action.idempotencyKey,
    correlationId: action.correlationId,
    kind: action.kind,
    binding: clone(action.intended)
  });
}

function compensateTransfer(action, state) {
  const approval = state.approvals.find((item) => item.approvalId === action.compensationApprovalId);
  assert.ok(approval, `compensation approval missing for ${action.actionId}`);
  assert.equal(approval.active, true, `compensation approval ${approval.approvalId} is inactive`);
  assert.equal(approval.tenantId, action.tenantId, `compensation approval ${approval.approvalId} tenant mismatch`);
  assert.equal(approval.actionId, action.actionId, `compensation approval ${approval.approvalId} action mismatch`);
  assert.equal(approval.operation, 'compensate', `approval ${approval.approvalId} does not permit compensation`);
  const compensationKey = `compensate:${action.idempotencyKey}`;
  assert.ok(!state.entries.some((entry) => entry.idempotencyKey === compensationKey), `duplicate compensation key ${compensationKey}`);
  state.accounts[action.intended.from].balance += action.intended.amount;
  state.accounts[action.intended.to].balance -= action.intended.amount;
  state.entries.push({
    entryId: `recovery-compensation-${action.actionId}`,
    status: 'confirmed',
    tenantId: action.tenantId,
    actorId: action.actorId,
    actionId: `compensate:${action.actionId}`,
    idempotencyKey: compensationKey,
    correlationId: `compensate:${action.correlationId}`,
    kind: 'compensation',
    binding: {
      originalActionId: action.actionId,
      approvalId: approval.approvalId,
      from: action.intended.to,
      to: action.intended.from,
      amount: action.intended.amount
    }
  });
  assert.equal(state.accounts.operating.balance, state.accounts.operating.baseline, 'operating balance was not restored');
  assert.equal(state.accounts.reserve.balance, state.accounts.reserve.baseline, 'reserve balance was not restored');
}

export function executeRecovery(incidentInput, ledgerInput, reconcileAction) {
  validateState(incidentInput, ledgerInput);
  const incidentBefore = JSON.stringify(incidentInput);
  const ledgerBefore = JSON.stringify(ledgerInput);
  const originalEntries = clone(ledgerInput.entries);
  const state = clone(ledgerInput);
  const lines = [`INCIDENT ${incidentInput.id} ${incidentInput.severity} CONTAINED`];
  const metrics = { CONFIRMED: 0, MISSING: 0, UNKNOWN: 0 };

  for (const action of incidentInput.actions) {
    const result = reconcileAction(clone(action), clone(state));
    assert.ok(result && ['CONFIRMED', 'MISSING', 'UNKNOWN'].includes(result.status), `invalid reconciliation status for ${action.actionId}`);
    metrics[result.status] += 1;
    lines.push(`RECONCILE ${action.actionId}: ${result.status}`);

    if (result.status === 'CONFIRMED') {
      if (action.kind === 'transfer' && incidentInput.retrieval.stale === true) {
        compensateTransfer(action, state);
        lines.push(`COMPENSATE ${action.actionId}: VERIFIED operating=${state.accounts.operating.balance} reserve=${state.accounts.reserve.balance}`);
      }
    } else if (result.status === 'MISSING') {
      retryMissing(action, state);
      lines.push(`RETRY ${action.actionId}: CONFIRMED key=${action.idempotencyKey}`);
    } else {
      lines.push(`ESCALATE ${action.actionId}: unverifiable postcondition`);
    }
  }

  assert.equal(JSON.stringify(incidentInput), incidentBefore, 'incident evidence changed during recovery');
  assert.equal(JSON.stringify(ledgerInput), ledgerBefore, 'source ledger changed during recovery');
  assert.deepEqual(state.entries.slice(0, originalEntries.length), originalEntries, 'original ledger entries were not preserved');
  const duplicates = countDuplicateKeys(state.entries);
  assert.equal(duplicates, 0, 'recovered ledger contains duplicate idempotency bindings');
  lines.push(`EVIDENCE preserved events=${incidentInput.events.length} originalEntries=${originalEntries.length}`);
  lines.push(`METRICS confirmed=${metrics.CONFIRMED} missing=${metrics.MISSING} unknown=${metrics.UNKNOWN} duplicateWrites=${duplicates} restoredOperating=${state.accounts.operating.balance} restoredReserve=${state.accounts.reserve.balance}`);
  lines.push('RESULT RECOVERED_WITH_ESCALATION');
  return { lines, state, metrics };
}
