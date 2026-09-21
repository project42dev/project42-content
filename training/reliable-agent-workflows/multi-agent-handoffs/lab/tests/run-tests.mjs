import { evaluateHandoff as learner } from '../src/handoff.mjs';
import { evaluateHandoff as reference } from '../reference/handoff.mjs';
import { fixture } from '../fixtures/scenarios.mjs';

const clone = (value) => structuredClone(value);
const base = fixture.scenarios.find((item) => item.id === 'correct-transfer').packet;

function changed(mutator) {
  const packet = clone(base);
  mutator(packet);
  return packet;
}

const malformed = changed((p) => { delete p.runId; });
const changedAuthority = changed((p) => { p.runId='run-changed'; p.context.traceId='trace-changed'; p.allowedActions=['comment','delete']; });
const unprovenContext = changed((p) => { p.context.facts=[{claim:'Injected claim',sourceRef:''}]; });
const nullConstraint = changed((p) => { p.context.constraints=[null]; });
const nullReturn = changed((p) => { p.returnWhen=[null]; });
const unknownEvent = changed((p) => { p.event='surprise'; });
const whitespaceId = changed((p) => { p.runId='   '; });
const nonstringAction = changed((p) => { p.allowedActions=['read',7]; });
const mismatchedFacts = changed((p) => { p.context.facts=[{claim:'Different claim',sourceRef:'src-2'}]; });
const mismatchedArtifacts = changed((p) => { p.context.artifacts=['other.json']; });
const zeroBudget = changed((p) => { p.budget.turns=1; p.transitionCostTurns=1; });
const exhausted = changed((p) => { p.budget.turns=1; p.transitionCostTurns=2; });
const unboundedDepth = changed((p) => { p.depth=999; });
const missingBoundsPolicy = clone(fixture.policy); delete missingBoundsPolicy.maxDepth; delete missingBoundsPolicy.maxTurns;

const cases = [
  ...fixture.scenarios.map(({id,packet,expected}) => ({id,packet,policy:fixture.policy,expected})),
  {id:'malformed-changed-input',packet:malformed,policy:fixture.policy,expected:{status:'rejected',reason:'malformed_packet'}},
  {id:'changed-authority-input',packet:changedAuthority,policy:fixture.policy,expected:{status:'accepted',effectiveActions:['comment'],remainingTurns:2,traceId:'trace-changed'}},
  {id:'unproven-context-fact',packet:unprovenContext,policy:fixture.policy,expected:{status:'rejected',reason:'missing_provenance'}},
  {id:'null-context-constraint',packet:nullConstraint,policy:fixture.policy,expected:{status:'rejected',reason:'malformed_packet'}},
  {id:'null-return-condition',packet:nullReturn,policy:fixture.policy,expected:{status:'rejected',reason:'malformed_packet'}},
  {id:'unknown-event',packet:unknownEvent,policy:fixture.policy,expected:{status:'rejected',reason:'malformed_packet'}},
  {id:'missing-policy-bounds-depth999',packet:unboundedDepth,policy:missingBoundsPolicy,expected:{status:'rejected',reason:'invalid_policy'}},
  {id:'null-policy',packet:base,policy:null,expected:{status:'rejected',reason:'invalid_policy'}},
  {id:'whitespace-identifier',packet:whitespaceId,policy:fixture.policy,expected:{status:'rejected',reason:'malformed_packet'}},
  {id:'nonstring-action',packet:nonstringAction,policy:fixture.policy,expected:{status:'rejected',reason:'malformed_packet'}},
  {id:'mismatched-duplicate-facts',packet:mismatchedFacts,policy:fixture.policy,expected:{status:'rejected',reason:'facts_mismatch'}},
  {id:'mismatched-duplicate-artifacts',packet:mismatchedArtifacts,policy:fixture.policy,expected:{status:'rejected',reason:'artifacts_mismatch'}},
  {id:'zero-remaining-budget',packet:zeroBudget,policy:fixture.policy,expected:{status:'paused',reason:'no_receiver_work_turn',activeAgent:null,remainingTurns:0}},
  {id:'exhausted-budget',packet:exhausted,policy:fixture.policy,expected:{status:'rejected',reason:'budget_exhausted'}}
];

function compare(id, actual, expected) {
  const failures=[];
  for (const [key,value] of Object.entries(expected)) {
    if (JSON.stringify(actual?.[key]) !== JSON.stringify(value)) failures.push(`${id}: ${key} expected ${JSON.stringify(value)} got ${JSON.stringify(actual?.[key])}`);
  }
  return failures;
}

function continuity(id, packet, result) {
  if (result?.status !== 'accepted') return [];
  return compare(id,result,{goal:packet.context.goal,constraints:packet.context.constraints,completedSideEffects:packet.context.completedSideEffects,traceId:packet.context.traceId});
}

function run(evaluate) {
  let passed=0;
  const failures=[];
  for (const testCase of cases) {
    try {
      const result=evaluate(clone(testCase.packet),clone(testCase.policy));
      const found=[...compare(testCase.id,result,testCase.expected),...continuity(testCase.id,testCase.packet,result)];
      if (found.length===0) passed+=1; else failures.push(...found);
    } catch (error) {
      failures.push(`${testCase.id}: threw ${error?.name || 'Error'}`);
    }
  }
  return {passed,total:cases.length,failures};
}

const referenceResult=run(reference);
const learnerResult=run(learner);
console.log(`REFERENCE ${referenceResult.passed}/${referenceResult.total}`);
console.log(`LEARNER ${learnerResult.passed}/${learnerResult.total}`);
for (const failure of learnerResult.failures) console.log(`FAIL ${failure}`);
const pass=referenceResult.passed===referenceResult.total && learnerResult.passed===learnerResult.total;
console.log(`RESULT ${pass ? 'PASS' : 'FAIL'}`);
process.exitCode=pass ? 0 : 1;
