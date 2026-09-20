import test from 'node:test';
import assert from 'node:assert/strict';
import {executeAction} from '../solution/executor.js';
import {changedInput} from '../solution/changed-input.js';

test('separate solution passes the base task',() => {
  const x = changedInput();
  const result = executeAction(x.action,x.context,x.env);
  assert.equal(result.kind,'success');
  assert.equal(result.callMutations,1);
  assert.equal(x.env.tickets[0].version,5);
});
test('separate solution blocks stale revision',() => {
  const x = changedInput(); x.action.expectedVersion=3; x.context.approval.expectedVersion=3;
  const result=executeAction(x.action,x.context,x.env);
  assert.equal(result.kind,'conflict'); assert.equal(x.env.mutationCount,0);
});
test('separate solution blocks changed target',() => {
  const x=changedInput(); x.action.targetId='ticket_12345678';
  const result=executeAction(x.action,x.context,x.env);
  assert.equal(result.kind,'denied'); assert.equal(x.env.mutationCount,0);
});
test('separate solution blocks request-supplied authority',() => {
  const x=changedInput(); x.action.approval=x.context.approval;
  const result=executeAction(x.action,x.context,x.env);
  assert.equal(result.kind,'invalid'); assert.equal(x.env.mutationCount,0);
});
