export class EvidenceValidationError extends TypeError {
  constructor(message) {
    super(message);
    this.name = 'EvidenceValidationError';
  }
}

export const RUBRIC_LIMITS = Object.freeze({
  outcome: 40,
  trajectory: 25,
  policy: 20,
  cost: 8,
  latency: 7
});

export const REQUIRED_CASES = Object.freeze({
  'REP-01': 'representative',
  'REP-02': 'representative',
  'REP-03': 'representative',
  'REP-04': 'representative',
  'BND-01': 'boundary',
  'BND-02': 'boundary',
  'ADV-01': 'adversarial',
  'ADV-02': 'adversarial',
  'REG-01': 'regression',
  'REG-02': 'regression'
});

const REQUIRED_SLICES = ['representative', 'boundary', 'adversarial', 'regression'];
const REQUIRED_TEXT_FIELDS = ['id', 'version', 'slice', 'input', 'expectedOutcome', 'forbidden'];

function fail(message) {
  throw new EvidenceValidationError(message);
}

function requireFiniteNumber(value, path, minimum, maximum) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    fail(`${path} must be a finite number`);
  }
  if (value < minimum || value > maximum) {
    fail(`${path} must be between ${minimum} and ${maximum}`);
  }
}

function requireNonemptyString(value, path) {
  if (typeof value !== 'string' || value.length === 0) {
    fail(`${path} must be a non-empty string`);
  }
}

function validateRun(run, path, requireCriticalFlag) {
  if (run === null || typeof run !== 'object' || Array.isArray(run)) {
    fail(`${path} must be an object`);
  }
  if (!Array.isArray(run.trajectory) || run.trajectory.length === 0) {
    fail(`${path}.trajectory must be a non-empty array`);
  }
  run.trajectory.forEach((step, index) => requireNonemptyString(step, `${path}.trajectory[${index}]`));
  if (run.score === null || typeof run.score !== 'object' || Array.isArray(run.score)) {
    fail(`${path}.score must be an object`);
  }
  let sum = 0;
  for (const [component, limit] of Object.entries(RUBRIC_LIMITS)) {
    requireFiniteNumber(run.score[component], `${path}.score.${component}`, 0, limit);
    sum += run.score[component];
  }
  requireFiniteNumber(run.total, `${path}.total`, 0, 100);
  if (run.total !== sum) {
    fail(`${path}.total must equal score component sum ${sum}`);
  }
  requireFiniteNumber(run.latencyMs, `${path}.latencyMs`, 0, Number.MAX_VALUE);
  requireFiniteNumber(run.costUnits, `${path}.costUnits`, 0, Number.MAX_VALUE);
  requireFiniteNumber(run.humanScore, `${path}.humanScore`, 0, 100);
  requireFiniteNumber(run.modelScore, `${path}.modelScore`, 0, 100);
  if (requireCriticalFlag && typeof run.criticalPolicyFailure !== 'boolean') {
    fail(`${path}.criticalPolicyFailure must be a boolean`);
  }
}

export function meanFinite(values) {
  if (!Array.isArray(values) || values.length === 0) {
    fail('mean values must be a non-empty array');
  }
  values.forEach((value, index) => {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      fail(`mean values[${index}] must be a finite number`);
    }
  });
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function assertValidEvaluationInput(cases, thresholds, options = {}) {
  const requireFullCaseSet = options.requireFullCaseSet === true;
  if (!Array.isArray(cases) || cases.length === 0) {
    fail('cases must be a non-empty array');
  }
  if (thresholds === null || typeof thresholds !== 'object' || Array.isArray(thresholds)) {
    fail('thresholds must be an object');
  }
  requireFiniteNumber(thresholds.minAverage, 'thresholds.minAverage', 0, 100);
  requireFiniteNumber(thresholds.minSliceMean, 'thresholds.minSliceMean', 0, 100);
  requireFiniteNumber(thresholds.maxCriticalPolicyFailures, 'thresholds.maxCriticalPolicyFailures', 0, 0);

  const seen = new Set();
  for (let index = 0; index < cases.length; index += 1) {
    const testCase = cases[index];
    const path = `cases[${index}]`;
    if (testCase === null || typeof testCase !== 'object' || Array.isArray(testCase)) {
      fail(`${path} must be an object`);
    }
    for (const field of REQUIRED_TEXT_FIELDS) {
      requireNonemptyString(testCase[field], `${path}.${field}`);
    }
    if (!Object.hasOwn(REQUIRED_CASES, testCase.id)) {
      fail(`${path}.id is not a valid stable case ID`);
    }
    if (seen.has(testCase.id)) {
      fail(`duplicate case ID ${testCase.id}`);
    }
    seen.add(testCase.id);
    if (testCase.slice !== REQUIRED_CASES[testCase.id]) {
      fail(`${path}.slice must be ${REQUIRED_CASES[testCase.id]} for ${testCase.id}`);
    }
    validateRun(testCase.baseline, `${path}.baseline`, false);
    validateRun(testCase.candidate, `${path}.candidate`, true);
  }

  if (requireFullCaseSet) {
    const missingIds = Object.keys(REQUIRED_CASES).filter((id) => !seen.has(id));
    if (cases.length !== 10 || missingIds.length > 0) {
      fail(`full case contract requires all ten stable IDs; missing ${missingIds.join(', ') || 'none'}`);
    }
    const presentSlices = new Set(cases.map((testCase) => testCase.slice));
    const missingSlices = REQUIRED_SLICES.filter((slice) => !presentSlices.has(slice));
    if (missingSlices.length > 0) {
      fail(`full case contract is missing slices: ${missingSlices.join(', ')}`);
    }
  }
}

export function assertValidFixtureDocument(document) {
  if (document === null || typeof document !== 'object' || Array.isArray(document)) {
    fail('fixture document must be an object');
  }
  if (document.rubric === null || typeof document.rubric !== 'object' || Array.isArray(document.rubric)) {
    fail('rubric must be an object');
  }
  for (const [component, limit] of Object.entries(RUBRIC_LIMITS)) {
    if (document.rubric[component] !== limit) {
      fail(`rubric.${component} must equal fixed limit ${limit}`);
    }
  }
  assertValidEvaluationInput(document.cases, document.thresholds, {requireFullCaseSet: true});
}
