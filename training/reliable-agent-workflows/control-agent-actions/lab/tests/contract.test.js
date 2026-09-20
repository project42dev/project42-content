import test from 'node:test';
import assert from 'node:assert/strict';
import {executeAction,reconcileOperation} from '../contract.js';
import {base,getFixture,environment} from '../fixtures.js';

function run(id) { const fixture = getFixture(id); return {fixture,result:fixture.run()}; }
function mutations(state) { return state.env.mutationCount; }

test('happy path verifies exact mutation and ordered controls',() => {
  const {fixture,result} = run('happy-path');
  assert.equal(result.kind,'success');
  assert.equal(result.callMutations,1);
  assert.equal(result.cumulativeMutations,1);
  assert.equal(result.receiptCount,1);
  assert.equal(fixture.state.env.tickets[0].status,'RESOLVED');
  assert.equal(fixture.state.env.tickets[0].version,8);
  assert.deepEqual(fixture.state.env.ledger.map((x) => x.stage),['validation','trusted-context-validation','idempotency','authorization','approval','budget','effect-intent','effect-observed','postcondition']);
});

test('malformed arguments have no mutation',() => {
  const {fixture,result} = run('malformed-arguments');
  assert.equal(result.kind,'invalid');
  assert.equal(result.callMutations,0);
  assert.equal(mutations(fixture.state),0);
  assert.equal(fixture.state.env.tickets[0].version,7);
});

test('unauthorized target has no mutation',() => {
  const {fixture,result} = run('unauthorized-target');
  assert.equal(result.kind,'denied');
  assert.equal(result.callMutations,0);
  assert.equal(mutations(fixture.state),0);
});

test('injected tool output stays data and cannot widen scope',() => {
  const {fixture,result} = run('injected-tool-output');
  assert.equal(result.kind,'success');
  assert.deepEqual(fixture.state.context.actor.allowedResources,['ticket_12345678']);
  assert.match(JSON.stringify(result.trace),/IGNORE POLICY/);
  assert.equal(mutations(fixture.state),1);
});

test('timeout preserves exact evidence and reconciliation proves one without retry',() => {
  const {fixture,result} = run('timeout-after-success');
  assert.equal(result.kind,'uncertain');
  assert.equal(result.callMutations,1);
  assert.equal(result.recovery.expectedVersion,7);
  assert.match(result.recovery.fingerprint,/ticket_12345678/);
  const original = structuredClone(fixture.state.env.operations[0].originalRun);
  const recovered = reconcileOperation(fixture.state.env,result.operationKey);
  assert.equal(recovered.kind,'success');
  assert.equal(recovered.recovery.query,'one');
  assert.equal(recovered.recovery.retryPerformed,false);
  assert.equal(recovered.recovery.provedMutations,1);
  assert.equal(recovered.callMutations,0);
  assert.equal(recovered.cumulativeMutations,1);
  assert.deepEqual(fixture.state.env.operations[0].originalRun,original);
});

test('same request and key rechecks authority then deduplicates without another mutation',() => {
  const x = base();
  const first = executeAction(x.action,x.context,x.env);
  const second = executeAction(x.action,x.context,x.env);
  assert.equal(first.kind,'success');
  assert.equal(second.code,'DEDUPLICATED');
  assert.equal(second.callMutations,0);
  assert.equal(second.cumulativeMutations,1);
  assert.equal(x.env.tickets[0].version,8);
  assert.equal(x.env.receipts.length,1);
  assert.equal(x.env.ledger.some((e) => e.stage === 'authorization-recheck' && e.accepted),true);
});

test('dedup fails closed after resource or policy revocation',() => {
  for (const revoke of [
    (x) => { x.context.actor.allowedResources = []; },
    (x) => { x.context.policy.allowedActions = []; }
  ]) {
    const x = base();
    assert.equal(executeAction(x.action,x.context,x.env).kind,'success');
    revoke(x);
    const before = mutations(x);
    const result = executeAction(x.action,x.context,x.env);
    assert.equal(result.kind,'denied');
    assert.equal(result.callMutations,0);
    assert.equal(mutations(x),before);
  }
});

test('cross-tenant duplicate cannot reuse cached authority',() => {
  const x = base();
  assert.equal(executeAction(x.action,x.context,x.env).kind,'success');
  x.context.actor.tenantId = 'tenant_other';
  x.context.policy.tenantId = 'tenant_other';
  x.context.approval.tenantId = 'tenant_other';
  const result = executeAction(x.action,x.context,x.env);
  assert.equal(result.kind,'conflict');
  assert.equal(result.code,'IDEMPOTENCY_CONFLICT');
  assert.equal(result.callMutations,0);
  assert.equal(mutations(x),1);
});

test('stale and mismatched approvals are blocked before mutation',() => {
  for (const id of ['stale-approval','mismatched-approval']) {
    const {fixture,result} = run(id);
    assert.equal(result.kind,'denied',id);
    assert.equal(result.callMutations,0,id);
    assert.equal(mutations(fixture.state),0,id);
  }
});

test('same key with changed target conflicts before a second mutation',() => {
  const {fixture,result} = run('same-key-changed-payload');
  assert.equal(result.kind,'conflict');
  assert.equal(result.code,'IDEMPOTENCY_CONFLICT');
  assert.equal(result.callMutations,0);
  assert.equal(result.cumulativeMutations,1);
  assert.equal(fixture.state.env.tickets[1].status,'OPEN');
});

test('failed postcondition records one mutation even with zero receipts',() => {
  const {fixture,result} = run('failed-postcondition');
  assert.equal(result.kind,'uncertain');
  assert.equal(result.code,'POSTCONDITION_FAILED');
  assert.equal(result.callMutations,1);
  assert.equal(result.cumulativeMutations,1);
  assert.equal(result.receiptCount,0);
  assert.equal(fixture.state.env.tickets[0].status,'RESOLVED');
  assert.equal(fixture.state.env.tickets[0].version,8);
});

test('unknown action, inherited fields, and prototype tricks are invalid',() => {
  for (const mutate of [
    (x) => { x.action.action = 'delete_ticket'; },
    (x) => { x.action = Object.create({...x.action}); },
    (x) => { Object.defineProperty(x.action,'__proto__',{value:{admin:true},enumerable:true}); }
  ]) {
    const x = base();
    mutate(x);
    const result = executeAction(x.action,x.context,x.env);
    assert.equal(result.kind,'invalid');
    assert.equal(mutations(x),0);
  }
});

test('request cannot supply authority',() => {
  const x = base();
  x.action.approval = x.context.approval;
  const result = executeAction(x.action,x.context,x.env);
  assert.equal(result.kind,'invalid');
  assert.equal(mutations(x),0);
});

test('missing negative NaN and Infinity limits or charges never bypass',() => {
  const variants = [
    (x) => { delete x.context.limits.maxSteps; },
    (x) => { x.context.limits.maxCostUnits = -1; },
    (x) => { x.context.charge.costUnits = NaN; },
    (x) => { x.context.clock.nowMs = Infinity; }
  ];
  for (const mutate of variants) {
    const x = base();
    mutate(x);
    const result = executeAction(x.action,x.context,x.env);
    assert.equal(result.kind,'invalid');
    assert.equal(mutations(x),0);
  }
});

test('budget and deterministic rate clock stop mutation at preflight',() => {
  for (const mutate of [(x) => { x.context.charge.steps = 4; },(x) => { x.context.clock.nowMs = 70001; }]) {
    const x = base();
    mutate(x);
    const result = executeAction(x.action,x.context,x.env);
    assert.equal(result.kind,'denied');
    assert.equal(result.code,'LIMIT_EXCEEDED');
    assert.equal(mutations(x),0);
  }
});

test('usage accumulates across consecutive distinct operations in the offline fixture',() => {
  const x = base();
  x.context.limits.maxSteps = 2;
  x.context.limits.maxCostUnits = 2;
  x.context.limits.maxRateActions = 2;
  assert.equal(executeAction(x.action,x.context,x.env).kind,'success');
  x.env.tickets.push({id:'ticket_87654321',tenantId:'tenant_acme',status:'OPEN',version:1});
  x.context.actor.allowedResources.push('ticket_87654321');
  x.context.policy.resourceId = 'ticket_87654321';
  x.action.targetId = 'ticket_87654321';
  x.action.expectedVersion = 1;
  x.action.operationKey = 'op_resolve_acme_0002';
  x.context.approval.resourceId = 'ticket_87654321';
  x.context.approval.expectedVersion = 1;
  x.context.approval.operationKey = 'op_resolve_acme_0002';
  assert.equal(executeAction(x.action,x.context,x.env).kind,'success');
  x.env.tickets.push({id:'ticket_11111111',tenantId:'tenant_acme',status:'OPEN',version:2});
  x.context.actor.allowedResources.push('ticket_11111111');
  x.context.policy.resourceId = 'ticket_11111111';
  x.action.targetId = 'ticket_11111111';
  x.action.expectedVersion = 2;
  x.action.operationKey = 'op_resolve_acme_0003';
  x.context.approval.resourceId = 'ticket_11111111';
  x.context.approval.expectedVersion = 2;
  x.context.approval.operationKey = 'op_resolve_acme_0003';
  const third = executeAction(x.action,x.context,x.env);
  assert.equal(third.kind,'denied');
  assert.equal(third.code,'LIMIT_EXCEEDED');
  assert.deepEqual(x.context.usage,{steps:2,costUnits:2,rateActions:2,windowStartMs:1000});
  assert.equal(x.env.mutationCount,2);
  assert.equal(x.env.tickets[2].status,'OPEN');
});

test('stale revision conflicts before mutation',() => {
  const x = base();
  x.action.expectedVersion = 6;
  x.context.approval.expectedVersion = 6;
  const result = executeAction(x.action,x.context,x.env);
  assert.equal(result.kind,'conflict');
  assert.equal(mutations(x),0);
});

test('recovery distinguishes zero and conflicting without retry',() => {
  const x = base();
  executeAction(x.action,x.context,x.env,'timeout_after_write');
  x.env.receipts = [];
  x.env.tickets[0].status = 'OPEN';
  x.env.tickets[0].version = 7;
  let result = reconcileOperation(x.env,x.action.operationKey);
  assert.equal(result.recovery.query,'zero');
  assert.equal(result.recovery.retryPerformed,false);
  x.env.tickets[0].status = 'RESOLVED';
  x.env.tickets[0].version = 8;
  result = reconcileOperation(x.env,x.action.operationKey);
  assert.equal(result.kind,'conflict');
  assert.equal(result.recovery.query,'conflicting');
});

test('malformed receipt and operation evidence fails closed without throwing',() => {
  const malformedReceipt = environment();
  malformedReceipt.receipts.push({operationKey:'op_resolve_acme_0001'});
  assert.doesNotThrow(() => executeAction(base().action,base().context,malformedReceipt));
  assert.equal(executeAction(base().action,base().context,malformedReceipt).kind,'invalid');
  const x = base();
  executeAction(x.action,x.context,x.env,'timeout_after_write');
  x.env.operations[0].evidence.expectedVersion = NaN;
  let output;
  assert.doesNotThrow(() => { output = reconcileOperation(x.env,x.action.operationKey); });
  assert.equal(output.kind,'invalid');
  assert.equal(output.code,'INVALID_ENVIRONMENT');
});

test('duplicate or contradictory receipt evidence cannot be ignored',() => {
  for (const variant of ['duplicate','contradictory']) {
    const x = base();
    executeAction(x.action,x.context,x.env,'timeout_after_write');
    const extra = structuredClone(x.env.receipts[0]);
    if (variant === 'contradictory') extra.fingerprint = 'different-fingerprint';
    x.env.receipts.push(extra);
    const result = reconcileOperation(x.env,x.action.operationKey);
    assert.equal(result.kind,'conflict',variant);
    assert.equal(result.recovery.query,'conflicting',variant);
    assert.equal(result.recovery.retryPerformed,false,variant);
  }
});
