import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { loadFixture } from '../fixture-loader.mjs';
import { evaluateRelease } from '../gate.mjs';
import { EvidenceValidationError, meanFinite } from '../schema-validation.mjs';

const testDirectory = fileURLToPath(new URL('.', import.meta.url));
const tests = [];
let baseFixture;

function test(name, body) {
  tests.push({name, body});
}

function copy(value) {
  return structuredClone(value);
}

function expectEqual(actual, expected) {
  if (actual !== expected) throw new Error(`expected ${expected}, got ${actual}`);
}

function expectValidation(body, text) {
  try {
    body();
  } catch (error) {
    if (!(error instanceof EvidenceValidationError)) {
      throw new Error(`expected EvidenceValidationError, got ${error.name}`);
    }
    if (!error.message.includes(text)) {
      throw new Error(`expected validation message containing ${text}, got ${error.message}`);
    }
    return;
  }
  throw new Error('expected validation rejection, but evaluation returned');
}

function setTotal(testCase, values) {
  testCase.candidate.score = {...values};
  testCase.candidate.total = Object.values(values).reduce((sum, value) => sum + value, 0);
}

function evaluateFull(fixture) {
  return evaluateRelease(fixture.cases, fixture.thresholds, {requireFullCaseSet: true});
}

baseFixture = await loadFixture(resolve(testDirectory, '../fixtures/cases.json'));

test('zero-tolerance critical failure holds', () => {
  const result = evaluateFull(copy(baseFixture));
  expectEqual(result.decision, 'HOLD');
  expectEqual(result.criticalFailures.join(','), 'ADV-01');
});

test('recovery variation ships', async () => {
  const fixture = await loadFixture(resolve(testDirectory, '../fixtures/recovery.json'));
  const result = evaluateFull(fixture);
  expectEqual(result.decision, 'SHIP');
  expectEqual(result.average.toFixed(2), '91.60');
});

test('low average holds', () => {
  const fixture = copy(baseFixture);
  for (const testCase of fixture.cases) {
    setTotal(testCase, {outcome: 0, trajectory: 0, policy: 0, cost: 0, latency: 0});
    testCase.candidate.criticalPolicyFailure = false;
  }
  expectEqual(evaluateFull(fixture).decision, 'HOLD');
});

test('safe full input ships, preventing deny-all', async () => {
  const fixture = await loadFixture(resolve(testDirectory, '../fixtures/recovery.json'));
  expectEqual(evaluateFull(fixture).decision, 'SHIP');
});

test('low slice holds despite passing overall', () => {
  const fixture = copy(baseFixture);
  for (const testCase of fixture.cases) {
    if (testCase.slice === 'adversarial') {
      setTotal(testCase, {outcome: 40, trajectory: 25, policy: 0, cost: 7, latency: 7});
    } else {
      setTotal(testCase, {outcome: 40, trajectory: 25, policy: 20, cost: 8, latency: 7});
    }
    testCase.candidate.criticalPolicyFailure = false;
  }
  const result = evaluateFull(fixture);
  expectEqual(result.average.toFixed(2), '95.80');
  expectEqual(result.sliceMeans.adversarial.toFixed(2), '79.00');
  expectEqual(result.decision, 'HOLD');
});

test('string total is rejected', () => {
  const fixture = copy(baseFixture);
  fixture.cases[0].candidate.total = 'not-a-score';
  expectValidation(() => evaluateFull(fixture), 'candidate.total must be a finite number');
});

test('missing total is rejected', () => {
  const fixture = copy(baseFixture);
  delete fixture.cases[0].candidate.total;
  expectValidation(() => evaluateFull(fixture), 'candidate.total must be a finite number');
});

test('NaN total is rejected', () => {
  const fixture = copy(baseFixture);
  fixture.cases[0].candidate.total = Number.NaN;
  expectValidation(() => evaluateFull(fixture), 'candidate.total must be a finite number');
});

test('infinite total is rejected', () => {
  const fixture = copy(baseFixture);
  fixture.cases[0].candidate.total = Number.POSITIVE_INFINITY;
  expectValidation(() => evaluateFull(fixture), 'candidate.total must be a finite number');
});

test('total above 100 is rejected', () => {
  const fixture = copy(baseFixture);
  fixture.cases[0].candidate.total = 101;
  expectValidation(() => evaluateFull(fixture), 'candidate.total must be between 0 and 100');
});

test('negative total is rejected', () => {
  const fixture = copy(baseFixture);
  fixture.cases[0].candidate.total = -1;
  expectValidation(() => evaluateFull(fixture), 'candidate.total must be between 0 and 100');
});

test('string threshold is rejected', () => {
  const fixture = copy(baseFixture);
  fixture.thresholds.minAverage = '85';
  expectValidation(() => evaluateFull(fixture), 'thresholds.minAverage must be a finite number');
});

test('non-finite threshold is rejected', () => {
  const fixture = copy(baseFixture);
  fixture.thresholds.minSliceMean = Number.NaN;
  expectValidation(() => evaluateFull(fixture), 'thresholds.minSliceMean must be a finite number');
});

test('missing threshold is rejected', () => {
  const fixture = copy(baseFixture);
  delete fixture.thresholds.minAverage;
  expectValidation(() => evaluateFull(fixture), 'thresholds.minAverage must be a finite number');
});

test('nonzero critical allowance is rejected', () => {
  const fixture = copy(baseFixture);
  fixture.thresholds.maxCriticalPolicyFailures = 1;
  expectValidation(() => evaluateFull(fixture), 'thresholds.maxCriticalPolicyFailures must be between 0 and 0');
});

test('string score component is rejected', () => {
  const fixture = copy(baseFixture);
  fixture.cases[0].candidate.score.outcome = '35';
  expectValidation(() => evaluateFull(fixture), 'candidate.score.outcome must be a finite number');
});

test('component above fixed limit is rejected', () => {
  const fixture = copy(baseFixture);
  fixture.cases[0].candidate.score.outcome = 41;
  fixture.cases[0].candidate.total = 98;
  expectValidation(() => evaluateFull(fixture), 'candidate.score.outcome must be between 0 and 40');
});

test('score-sum mismatch is rejected', () => {
  const fixture = copy(baseFixture);
  fixture.cases[0].candidate.total = 91;
  expectValidation(() => evaluateFull(fixture), 'candidate.total must equal score component sum 92');
});

test('invalid case ID is rejected', () => {
  const fixture = copy(baseFixture);
  fixture.cases[0].id = 'OTHER-01';
  expectValidation(() => evaluateFull(fixture), 'not a valid stable case ID');
});

test('invalid slice is rejected', () => {
  const fixture = copy(baseFixture);
  fixture.cases[0].slice = 'normal';
  expectValidation(() => evaluateFull(fixture), 'slice must be representative for REP-01');
});

test('non-Boolean critical flag is rejected', () => {
  const fixture = copy(baseFixture);
  fixture.cases[0].candidate.criticalPolicyFailure = 'false';
  expectValidation(() => evaluateFull(fixture), 'criticalPolicyFailure must be a boolean');
});

test('duplicate case is rejected', () => {
  const fixture = copy(baseFixture);
  fixture.cases[1] = copy(fixture.cases[0]);
  expectValidation(() => evaluateFull(fixture), 'duplicate case ID REP-01');
});

test('missing slices in full contract are rejected', () => {
  const fixture = copy(baseFixture);
  fixture.cases = fixture.cases.filter((testCase) => testCase.slice !== 'adversarial');
  expectValidation(() => evaluateFull(fixture), 'full case contract requires all ten stable IDs');
});

test('missing required case field is rejected', () => {
  const fixture = copy(baseFixture);
  delete fixture.cases[0].input;
  expectValidation(() => evaluateFull(fixture), 'cases[0].input must be a non-empty string');
});

test('generic mean refuses coercion', () => {
  expectValidation(() => meanFinite([90, '90']), 'mean values[1] must be a finite number');
});

let failures = 0;
for (let index = 0; index < tests.length; index += 1) {
  const {name, body} = tests[index];
  try {
    await body();
    console.log(`ok ${index + 1} - ${name}`);
  } catch (error) {
    failures += 1;
    console.log(`not ok ${index + 1} - ${name}: ${error.message}`);
  }
}
console.log(`1..${tests.length}`);
process.exitCode = failures === 0 ? 0 : 1;
