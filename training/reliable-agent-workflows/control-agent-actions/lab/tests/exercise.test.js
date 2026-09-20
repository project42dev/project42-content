import test from 'node:test';
import assert from 'node:assert/strict';
import {executeAction} from '../contract.js';
import {changedInput} from '../exercise/changed-input.js';

test('changed tenant and target completes exactly once',() => {
  const x = changedInput();
  const result = executeAction(x.action,x.context,x.env);
  assert.equal(result.kind,'success','Align approval resourceId, expectedVersion, and operationKey with the already-correct actor and policy bindings');
  assert.equal(result.callMutations,1,'The solved input must make exactly one mutation');
  assert.equal(x.env.tickets[0].version,5);
  assert.equal(x.env.tickets[0].status,'RESOLVED');
  assert.equal(x.env.ledger.find((e) => e.stage === 'approval')?.accepted,true);
});

test('variant feedback: stale revision must conflict with zero mutations',() => {
  const x = changedInput();
  x.action.expectedVersion = 3;
  x.context.approval.expectedVersion = 3;
  const result = executeAction(x.action,x.context,x.env);
  assert.equal(result.kind,'conflict','Stale version was not blocked before mutation');
  assert.equal(result.callMutations,0);
  assert.equal(x.env.mutationCount,0);
});

test('variant feedback: changed target must be denied with zero mutations',() => {
  const x = changedInput();
  x.action.targetId = 'ticket_12345678';
  const result = executeAction(x.action,x.context,x.env);
  assert.equal(result.kind,'denied','Changed target escaped trusted actor or policy scope');
  assert.equal(result.callMutations,0);
  assert.equal(x.env.mutationCount,0);
});

test('variant feedback: forged request authority must be invalid',() => {
  const x = changedInput();
  x.action.approval = x.context.approval;
  const result = executeAction(x.action,x.context,x.env);
  assert.equal(result.kind,'invalid','Request supplied its own authority instead of using separate trusted context');
  assert.equal(result.callMutations,0);
  assert.equal(x.env.mutationCount,0);
});
