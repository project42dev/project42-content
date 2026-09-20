import { evaluate } from '../src/learner.js';

const tests = [];
function test(name, fn) { tests.push({ name, fn }); }
function equal(actual, expected, message) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) throw new Error(`${message}\nexpected ${e}\nactual   ${a}`);
}
function throws(fn, pattern) {
  try { fn(); } catch (error) {
    if (!pattern.test(error.message)) throw new Error(`wrong error: ${error.message}`);
    return;
  }
  throw new Error('expected an error');
}

const req = {
  requiredGates: ['policy'],
  unknownPolicy: 'fail-closed',
  weights: { quality: 0.5, operations: 0.5 }
};
const candidate = (id, gate, quality, operations) => ({ id, label: id.toUpperCase(), gates: { policy: gate }, metrics: { quality, operations } });

test('positive: gates exclude a higher-scoring failed candidate before ranking', () => {
  const result = evaluate([candidate('eligible','PASS',60,80), candidate('blocked','FAIL',100,100)], req);
  equal(result.ranking, [{id:'eligible',label:'ELIGIBLE',score:70}], 'only the eligible row may be ranked');
  equal(result.disqualified, [{id:'blocked',label:'BLOCKED',failedGates:['policy'],unknownGates:[]}], 'failed gate must be reported');
});

test('negative: non-finite metrics are rejected', () => {
  throws(() => evaluate([candidate('bad','PASS',Infinity,50)], req), /finite in \[0,100\]/);
});

test('negative: out-of-range weights are rejected', () => {
  throws(() => evaluate([candidate('a','PASS',50,50)], {...req, weights:{quality:1.2,operations:-0.2}}), /weight quality/);
});

test('negative: gate enums are validated', () => {
  throws(() => evaluate([candidate('a','MAYBE',50,50)], req), /PASS, FAIL, or UNKNOWN/);
});

test('boundary: 0 and 100 are valid, metric UNKNOWN is unscored, gate UNKNOWN fails closed', () => {
  const rows = [candidate('boundary','PASS',0,100), candidate('missing','PASS','UNKNOWN',100), candidate('closed','UNKNOWN',100,100)];
  const result = evaluate(rows, req);
  equal(result.ranking, [{id:'boundary',label:'BOUNDARY',score:50}], 'boundary score must be derived');
  equal(result.disqualified, [{id:'closed',label:'CLOSED',failedGates:[],unknownGates:['policy']}], 'unknown gate must fail closed');
  equal(result.insufficientEvidence, [{id:'missing',label:'MISSING',unknownMetrics:['quality']}], 'unknown metric must remain explicit');
});

test('changed-input: changing metrics recomputes and changes the winner', () => {
  const first = evaluate([candidate('a','PASS',80,80), candidate('b','PASS',70,70)], req);
  const changed = evaluate([candidate('a','PASS',80,80), candidate('b','PASS',100,100)], req);
  equal(first.ranking.map(row => row.id), ['a','b'], 'initial order');
  equal(changed.ranking.map(row => row.id), ['b','a'], 'changed input must change order without fixture-name logic');
  equal(changed.ranking[0].score, 100, 'changed score must be computed');
});

let failures = 0;
for (const item of tests) {
  try {
    await item.fn();
    console.log(`PASS ${item.name}`);
  } catch (error) {
    failures += 1;
    console.error(`FAIL ${item.name}\n${error.message}`);
  }
}
console.log(`${tests.length - failures}/${tests.length} tests passed; ${failures} failed.`);
process.exitCode = failures === 0 ? 0 : 1;
