import test from 'node:test';
import assert from 'node:assert/strict';
import { authorizeAndApply } from '../src/engine.js';

const contract = {id:'record.change',trustedConfiguration:true,allowedAuthoritySourceIds:['policy-registry'],allowedMutationPaths:['status']};
const proposal = {toolId:'record.change',expectedRevision:'12',authorityRevision:'4',mutation:{path:'status',from:'reviewed',to:'approved'}};
const authority = {sourceId:'policy-registry',revision:'4'};
const state = {revision:'12',data:{status:'reviewed',owner:'team-blue'}};

test('typed tool contract gates exact mutation and revision-bound authority before side effect', () => {
  let calls = 0;
  const next = authorizeAndApply({contract,proposal,state,authority,decision:{status:'READY'},apply(value){calls++; assert.equal(value.data.owner,'team-blue');}});
  assert.equal(calls, 1);
  assert.deepEqual(next, {revision:'12+1',data:{status:'approved',owner:'team-blue'}});
});

test('safety: escalation, forged authority, stale state, and broadened mutation cause no side effect', () => {
  for (const changed of [
    {decision:{status:'ESCALATE'}},
    {authority:{sourceId:'retrieved-page',revision:'4'}},
    {state:{revision:'13',data:{status:'reviewed'}}},
    {proposal:{...proposal,mutation:{path:'owner',from:'team-blue',to:'attacker'}}}
  ]) {
    let calls = 0;
    assert.throws(() => authorizeAndApply({contract,proposal,state,authority,decision:{status:'READY'},apply(){calls++;},...changed}));
    assert.equal(calls, 0);
  }
});

test('idempotency: replay against advanced revision is rejected before a second effect', () => {
  let calls = 0;
  const next = authorizeAndApply({contract,proposal,state,authority,decision:{status:'READY'},apply(){calls++;}});
  assert.throws(() => authorizeAndApply({contract,proposal,state:next,authority,decision:{status:'READY'},apply(){calls++;}}), /state revision mismatch/);
  assert.equal(calls, 1);
});

test('recovery: failed apply is observable and retry can use unchanged authoritative input', () => {
  let committed = null;
  assert.throws(() => authorizeAndApply({contract,proposal,state,authority,decision:{status:'READY'},apply(){throw new Error('simulated storage failure');}}), /storage failure/);
  assert.equal(committed, null);
  const next = authorizeAndApply({contract,proposal,state,authority,decision:{status:'READY'},apply(value){committed=value;}});
  assert.deepEqual(committed, next);
});
