const GATES = Object.freeze(['quality','safety','security','compatibility','capacity','cost','recovery']);
const STRATEGIES = Object.freeze(['offline','route-switch','rolling','canary','blue-green','shadow']);
const DIGEST = /^sha256:[0-9a-f]{64}$/;

function object(value, path) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) throw new TypeError(`${path} must be an object`);
  return value;
}
function exact(value, allowed, path) {
  for (const key of Object.keys(value)) if (!allowed.includes(key)) throw new RangeError(`${path}.${key} is unknown`);
  for (const key of allowed) if (!Object.hasOwn(value, key)) throw new RangeError(`${path}.${key} is required`);
}
function text(value, path) {
  if (typeof value !== 'string' || value.trim() === '') throw new TypeError(`${path} must be a non-empty string`);
  return value;
}
function evidence(value, path) {
  text(value, path);
  if (/^(unknown|missing|n\/a|unverified|unavailable)$/i.test(value.trim())) throw new RangeError(`${path} must contain verified fixture evidence`);
  return value;
}
function digest(value, path) {
  if (typeof value !== 'string' || !DIGEST.test(value)) throw new TypeError(`${path} must be sha256 plus 64 lowercase hexadecimal characters`);
  return value;
}
function bool(value, path) {
  if (typeof value !== 'boolean') throw new TypeError(`${path} must be boolean`);
  return value;
}
function finite(value, path, min, max, integer = false) {
  if (typeof value !== 'number' || !Number.isFinite(value)) throw new TypeError(`${path} must be finite`);
  if (integer && !Number.isInteger(value)) throw new RangeError(`${path} must be an integer`);
  if (value < min || value > max) throw new RangeError(`${path} must be in [${min}, ${max}]`);
  return value;
}
function strings(value, path) {
  if (!Array.isArray(value) || value.length === 0) throw new TypeError(`${path} must be a nonempty array`);
  value.forEach((entry, index) => text(entry, `${path}[${index}]`));
  return value;
}
function artifact(value, path) {
  object(value, path); exact(value, ['revision','digest'], path);
  text(value.revision, `${path}.revision`); digest(value.digest, `${path}.digest`);
}
function manifest(value, path) {
  object(value, path);
  exact(value, ['releaseId','model','tokenizer','runtime','acceleratorLibraries','image','adapters','promptTemplates','safetyPolicy','gatewayContract','infrastructureConfig','evaluationSet','telemetrySchema','stateSchema'], path);
  text(value.releaseId, `${path}.releaseId`);
  artifact(value.model, `${path}.model`); artifact(value.tokenizer, `${path}.tokenizer`);
  object(value.runtime, `${path}.runtime`); exact(value.runtime, ['name','version'], `${path}.runtime`);
  text(value.runtime.name, `${path}.runtime.name`); text(value.runtime.version, `${path}.runtime.version`);
  strings(value.acceleratorLibraries, `${path}.acceleratorLibraries`);
  object(value.image, `${path}.image`); exact(value.image, ['ref','digest'], `${path}.image`);
  text(value.image.ref, `${path}.image.ref`); digest(value.image.digest, `${path}.image.digest`);
  if (!Array.isArray(value.adapters) || value.adapters.length === 0) throw new TypeError(`${path}.adapters must be a nonempty array`);
  value.adapters.forEach((entry, index) => artifact(entry, `${path}.adapters[${index}]`));
  strings(value.promptTemplates, `${path}.promptTemplates`);
  artifact(value.safetyPolicy, `${path}.safetyPolicy`);
  for (const key of ['gatewayContract','infrastructureConfig','evaluationSet','telemetrySchema','stateSchema']) text(value[key], `${path}.${key}`);
}

export function validatePacket(value) {
  object(value, 'packet'); exact(value, ['schemaVersion','simulationOnly','manifests','gates','rollback','rollout','rehearsal'], 'packet');
  if (value.schemaVersion !== 1) throw new RangeError('packet.schemaVersion must equal 1');
  if (value.simulationOnly !== true) throw new RangeError('packet.simulationOnly must equal true');
  object(value.manifests, 'packet.manifests'); exact(value.manifests, ['baseline','candidate'], 'packet.manifests');
  manifest(value.manifests.baseline, 'packet.manifests.baseline'); manifest(value.manifests.candidate, 'packet.manifests.candidate');

  if (!Array.isArray(value.gates) || value.gates.length !== GATES.length) throw new RangeError('packet.gates must contain exactly seven gates');
  const seen = new Set();
  for (const [index, gate] of value.gates.entries()) {
    object(gate, `packet.gates[${index}]`); exact(gate, ['name','status','owner','evidence'], `packet.gates[${index}]`);
    if (!GATES.includes(gate.name)) throw new RangeError(`unknown gate: ${gate.name}`);
    if (seen.has(gate.name)) throw new RangeError(`duplicate gate: ${gate.name}`); seen.add(gate.name);
    if (!['pass','fail'].includes(gate.status)) throw new RangeError(`unknown gate status: ${gate.status}`);
    text(gate.owner, `packet.gates[${index}].owner`); evidence(gate.evidence, `packet.gates[${index}].evidence`);
  }
  for (const name of GATES) if (!seen.has(name)) throw new RangeError(`missing gate: ${name}`);

  object(value.rollback, 'packet.rollback');
  exact(value.rollback, ['rollbackCompatible','procedure','stateProcedure','baselineStateSchema','candidateStateSchema','compatibilityEvidence'], 'packet.rollback');
  bool(value.rollback.rollbackCompatible, 'packet.rollback.rollbackCompatible');
  text(value.rollback.procedure, 'packet.rollback.procedure'); text(value.rollback.stateProcedure, 'packet.rollback.stateProcedure');
  text(value.rollback.baselineStateSchema, 'packet.rollback.baselineStateSchema'); text(value.rollback.candidateStateSchema, 'packet.rollback.candidateStateSchema');
  evidence(value.rollback.compatibilityEvidence, 'packet.rollback.compatibilityEvidence');
  if (value.rollback.baselineStateSchema !== value.manifests.baseline.stateSchema) throw new RangeError('rollback baseline schema evidence does not match baseline manifest');
  if (value.rollback.candidateStateSchema !== value.manifests.candidate.stateSchema) throw new RangeError('rollback candidate schema evidence does not match candidate manifest');
  const recovery = value.gates.find((gate) => gate.name === 'recovery');
  if (value.rollback.rollbackCompatible && recovery.status !== 'pass') throw new RangeError('compatible rollback requires recovery pass');
  if (!value.rollback.rollbackCompatible && recovery.status !== 'fail') throw new RangeError('incompatible rollback requires recovery fail');
  if (value.rollback.rollbackCompatible && /unavailable|unknown|missing|unverified/i.test(value.rollback.stateProcedure)) throw new RangeError('compatible rollback requires a tested state procedure');

  object(value.rollout, 'packet.rollout');
  exact(value.rollout, ['strategy','exposurePercent','observationMinutes','drainTimeoutSeconds','costCeilingUnits','decisionOwner','executor','stopConditions','drainConditions'], 'packet.rollout');
  if (!STRATEGIES.includes(value.rollout.strategy)) throw new RangeError(`unknown rollout strategy: ${value.rollout.strategy}`);
  finite(value.rollout.exposurePercent, 'packet.rollout.exposurePercent', 0, 100);
  finite(value.rollout.observationMinutes, 'packet.rollout.observationMinutes', 1, 10080, true);
  finite(value.rollout.drainTimeoutSeconds, 'packet.rollout.drainTimeoutSeconds', 1, 86400, true);
  finite(value.rollout.costCeilingUnits, 'packet.rollout.costCeilingUnits', 0, 1000000000);
  text(value.rollout.decisionOwner, 'packet.rollout.decisionOwner'); text(value.rollout.executor, 'packet.rollout.executor');
  strings(value.rollout.stopConditions, 'packet.rollout.stopConditions'); strings(value.rollout.drainConditions, 'packet.rollout.drainConditions');

  object(value.rehearsal, 'packet.rehearsal'); exact(value.rehearsal, ['guardrail','readback'], 'packet.rehearsal');
  object(value.rehearsal.guardrail, 'packet.rehearsal.guardrail'); exact(value.rehearsal.guardrail, ['name','observed','maximum'], 'packet.rehearsal.guardrail');
  text(value.rehearsal.guardrail.name, 'packet.rehearsal.guardrail.name');
  finite(value.rehearsal.guardrail.observed, 'packet.rehearsal.guardrail.observed', -1000000, 1000000);
  finite(value.rehearsal.guardrail.maximum, 'packet.rehearsal.guardrail.maximum', -1000000, 1000000);
  object(value.rehearsal.readback, 'packet.rehearsal.readback'); exact(value.rehearsal.readback, ['manifest','ready'], 'packet.rehearsal.readback');
  manifest(value.rehearsal.readback.manifest, 'packet.rehearsal.readback.manifest'); bool(value.rehearsal.readback.ready, 'packet.rehearsal.readback.ready');
  return value;
}
