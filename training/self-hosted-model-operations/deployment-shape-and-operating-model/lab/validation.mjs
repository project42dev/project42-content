export const OPTION_IDS = Object.freeze([
  'workstation',
  'containerized-single-host',
  'on-premises-service',
  'edge-appliance',
  'cloud-service',
  'hybrid'
]);

export const SCORE_WEIGHTS = Object.freeze({
  capacityLatency: 25,
  scalability: 20,
  operability: 20,
  reversibility: 15,
  costPredictability: 10,
  workloadFit: 10
});

const REQUIRED_BOUNDARIES = new Set(['local-only', 'cloud-region-verified']);
const EVIDENCE_BOUNDARIES = new Set(['local-only', 'cloud-region-verified', 'unknown']);
const OPTION_OWNERS = new Set(['qualified', 'missing', 'unknown']);
const REQUIRED_OWNERS = new Set(['qualified']);

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function requireRecord(value, label) {
  if (!isRecord(value)) throw new TypeError(`${label} must be an object`);
}

function requireFiniteNonNegative(value, label) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    throw new TypeError(`${label} must be a finite non-negative number`);
  }
}

function validateRecovery(value, label, allowUnknown) {
  requireRecord(value, label);
  for (const key of ['rtoMinutes', 'rpoMinutes']) {
    const item = value[key];
    if (allowUnknown && item === null) continue;
    requireFiniteNonNegative(item, `${label}.${key}`);
  }
}

function validateScores(scores) {
  requireRecord(scores, 'scores');
  const expected = Object.keys(SCORE_WEIGHTS).sort();
  const actual = Object.keys(scores).sort();
  if (actual.length !== expected.length || actual.some((key, index) => key !== expected[index])) {
    throw new Error('scores must contain the exact weighted criteria');
  }
  for (const [key, maximum] of Object.entries(SCORE_WEIGHTS)) {
    requireFiniteNonNegative(scores[key], `scores.${key}`);
    if (scores[key] > maximum) throw new RangeError(`scores.${key} exceeds weight`);
  }
}

export function scoreOption(option) {
  return Object.keys(SCORE_WEIGHTS).reduce((total, key) => total + option.scores[key], 0);
}

export function validateDecision(decision) {
  requireRecord(decision, 'decision');
  if (!REQUIRED_BOUNDARIES.has(decision.dataBoundary)) throw new Error('invalid required dataBoundary');
  if (!REQUIRED_OWNERS.has(decision.requiredOwner)) throw new Error('invalid requiredOwner');
  validateRecovery(decision.recovery, 'recovery', false);
  if (!Array.isArray(decision.options)) throw new TypeError('options must be an array');
  if (decision.options.length !== OPTION_IDS.length) throw new Error('options must contain the exact option set');

  const seen = new Set();
  for (const option of decision.options) {
    requireRecord(option, 'option');
    if (typeof option.id !== 'string' || !OPTION_IDS.includes(option.id)) throw new Error('invalid option id');
    if (seen.has(option.id)) throw new Error('duplicate option id');
    seen.add(option.id);
    validateScores(option.scores);
    if (!EVIDENCE_BOUNDARIES.has(option.dataBoundary)) throw new Error('invalid option dataBoundary');
    if (!OPTION_OWNERS.has(option.owner)) throw new Error('invalid option owner');
    validateRecovery(option.recovery, 'option.recovery', true);
  }

  for (const id of OPTION_IDS) {
    if (!seen.has(id)) throw new Error('options must contain the exact option set');
  }
  return decision;
}
