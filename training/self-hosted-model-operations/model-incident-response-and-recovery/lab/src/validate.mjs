const actions = new Set(['create-payment', 'send-notification']);
const observedStatuses = new Set(['unknown', 'failed', 'succeeded']);
const outcomes = new Set(['failed', 'succeeded', 'partial', 'pending']);
const gates = ['identity', 'access', 'quality', 'compatibility', 'capacity', 'telemetry', 'cost', 'userService'];

function object(value, name) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${name} must be an object`);
  return value;
}

function exactKeys(value, allowed, name) {
  for (const key of Object.keys(value)) if (!allowed.includes(key)) throw new Error(`${name}.${key} is unknown`);
  for (const key of allowed) if (!(key in value)) throw new Error(`${name}.${key} is required`);
}

function text(value, name) {
  if (typeof value !== 'string' || value.length < 1 || value.length > 128) throw new Error(`${name} must be a non-empty string of at most 128 characters`);
  return value;
}

function finiteInteger(value, name, min = 0, max = 10_000_000_000_000) {
  if (!Number.isFinite(value) || !Number.isInteger(value) || value < min || value > max) throw new Error(`${name} must be a finite integer from ${min} to ${max}`);
  return value;
}

function boolean(value, name) {
  if (typeof value !== 'boolean') throw new Error(`${name} must be boolean`);
  return value;
}

function validateEvidence(value, name) {
  if (value === null) return null;
  object(value, name);
  exactKeys(value, ['authoritative', 'requestId', 'action', 'target', 'identity', 'outcome', 'observedAtMs'], name);
  boolean(value.authoritative, `${name}.authoritative`);
  text(value.requestId, `${name}.requestId`);
  if (!actions.has(value.action)) throw new Error(`${name}.action is unknown`);
  text(value.target, `${name}.target`);
  text(value.identity, `${name}.identity`);
  if (!outcomes.has(value.outcome)) throw new Error(`${name}.outcome is unknown`);
  finiteInteger(value.observedAtMs, `${name}.observedAtMs`);
  return value;
}

export function validate(input) {
  object(input, 'input');
  exactKeys(input, ['incidentId', 'request', 'observed', 'history', 'recoveryGate', 'timing'], 'input');
  text(input.incidentId, 'incidentId');

  object(input.request, 'request');
  exactKeys(input.request, ['id', 'action', 'target', 'identity'], 'request');
  text(input.request.id, 'request.id');
  if (!actions.has(input.request.action)) throw new Error('request.action is unknown');
  text(input.request.target, 'request.target');
  text(input.request.identity, 'request.identity');

  object(input.observed, 'observed');
  exactKeys(input.observed, ['status', 'evidence'], 'observed');
  if (!observedStatuses.has(input.observed.status)) throw new Error('observed.status is unknown');
  validateEvidence(input.observed.evidence, 'observed.evidence');

  if (!Array.isArray(input.history) || input.history.length > 100) throw new Error('history must be an array with at most 100 entries');
  for (const [index, entry] of input.history.entries()) {
    object(entry, `history[${index}]`);
    exactKeys(entry, ['requestId', 'action', 'target', 'identity', 'outcome'], `history[${index}]`);
    text(entry.requestId, `history[${index}].requestId`);
    if (!actions.has(entry.action)) throw new Error(`history[${index}].action is unknown`);
    text(entry.target, `history[${index}].target`);
    text(entry.identity, `history[${index}].identity`);
    if (entry.outcome !== 'completed') throw new Error(`history[${index}].outcome is unknown`);
  }

  object(input.recoveryGate, 'recoveryGate');
  exactKeys(input.recoveryGate, gates, 'recoveryGate');
  for (const gate of gates) boolean(input.recoveryGate[gate], `recoveryGate.${gate}`);

  object(input.timing, 'timing');
  exactKeys(input.timing, ['decisionAtMs', 'evidenceMaxAgeMs', 'declaredAtMs', 'recoveredAtMs', 'rtoMs', 'checkpointAtMs', 'incidentAtMs', 'rpoMs'], 'timing');
  for (const key of Object.keys(input.timing)) finiteInteger(input.timing[key], `timing.${key}`);
  if (input.timing.recoveredAtMs < input.timing.declaredAtMs) throw new Error('recoveredAtMs must not precede declaredAtMs');
  if (input.timing.incidentAtMs < input.timing.checkpointAtMs) throw new Error('incidentAtMs must not precede checkpointAtMs');
  return input;
}

export const recoveryGateNames = Object.freeze([...gates]);
