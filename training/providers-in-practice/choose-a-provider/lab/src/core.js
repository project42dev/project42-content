export const GATE_VALUES = new Set(['PASS', 'FAIL', 'UNKNOWN']);
export const UNKNOWN = 'UNKNOWN';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function validateInputs(candidates, requirements) {
  assert(Array.isArray(candidates) && candidates.length > 0, 'candidates must be a non-empty array');
  assert(isPlainObject(requirements), 'requirements must be an object');
  assert(Array.isArray(requirements.requiredGates) && requirements.requiredGates.length > 0, 'requiredGates must be a non-empty array');
  assert(new Set(requirements.requiredGates).size === requirements.requiredGates.length, 'requiredGates must be unique');
  for (const gate of requirements.requiredGates) assert(typeof gate === 'string' && gate.length > 0, 'gate names must be non-empty strings');
  assert(requirements.unknownPolicy === 'fail-closed', 'unknownPolicy must be fail-closed');
  assert(isPlainObject(requirements.weights) && Object.keys(requirements.weights).length > 0, 'weights must be a non-empty object');

  let weightSum = 0;
  for (const [metric, weight] of Object.entries(requirements.weights)) {
    assert(metric.length > 0, 'metric names must be non-empty');
    assert(Number.isFinite(weight) && weight >= 0 && weight <= 1, `weight ${metric} must be finite and in [0,1]`);
    weightSum += weight;
  }
  assert(Math.abs(weightSum - 1) <= 1e-9, 'weights must sum to 1');

  const ids = new Set();
  for (const candidate of candidates) {
    assert(isPlainObject(candidate), 'each candidate must be an object');
    assert(typeof candidate.id === 'string' && candidate.id.length > 0, 'candidate id must be a non-empty string');
    assert(!ids.has(candidate.id), `duplicate candidate id: ${candidate.id}`);
    ids.add(candidate.id);
    assert(candidate.label === undefined || typeof candidate.label === 'string', `candidate ${candidate.id} label must be a string`);
    assert(isPlainObject(candidate.gates), `candidate ${candidate.id} gates must be an object`);
    assert(isPlainObject(candidate.metrics), `candidate ${candidate.id} metrics must be an object`);

    for (const gate of requirements.requiredGates) {
      assert(GATE_VALUES.has(candidate.gates[gate]), `candidate ${candidate.id} gate ${gate} must be PASS, FAIL, or UNKNOWN`);
    }
    for (const metric of Object.keys(requirements.weights)) {
      const value = candidate.metrics[metric];
      assert(value === UNKNOWN || (Number.isFinite(value) && value >= 0 && value <= 100), `candidate ${candidate.id} metric ${metric} must be UNKNOWN or finite in [0,100]`);
    }
  }
}

export function assessGates(candidate, requiredGates) {
  const failedGates = requiredGates.filter(gate => candidate.gates[gate] === 'FAIL').sort();
  const unknownGates = requiredGates.filter(gate => candidate.gates[gate] === 'UNKNOWN').sort();
  return { eligible: failedGates.length === 0 && unknownGates.length === 0, failedGates, unknownGates };
}

export function unknownMetrics(candidate, weights) {
  return Object.keys(weights).filter(metric => candidate.metrics[metric] === UNKNOWN).sort();
}

export function scoreCandidate(candidate, weights) {
  const score = Object.entries(weights).reduce((sum, [metric, weight]) => sum + candidate.metrics[metric] * weight, 0);
  return { id: candidate.id, label: candidate.label ?? candidate.id, score: Number(score.toFixed(4)) };
}

export function sortRanking(rows) {
  return rows.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
}
