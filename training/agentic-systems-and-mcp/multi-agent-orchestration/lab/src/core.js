'use strict';

const MAX_SAMPLES = 1000;
const MAX_ANSWER_LENGTH = 1000;
const MAX_AGENTS = 64;
const MAX_ROUNDS = 50;
const MAX_ID_LENGTH = 200;
const MAX_TIMEOUT_MS = 120000;

function nonEmptyString(value, name) {
  if (typeof value !== 'string' || value.length === 0 || value.length > MAX_ID_LENGTH || value.trim() !== value) {
    throw new Error(`${name} must be a nonempty trimmed string`);
  }
}

function uniqueNonEmptyStrings(values, name) {
  if (!Array.isArray(values) || values.length === 0) throw new Error(`${name} must be nonempty`);
  const seen = new Set();
  for (const value of values) {
    if (typeof value !== 'string' || value.length === 0 || value.length > MAX_ANSWER_LENGTH || value.trim() !== value) {
      throw new Error(`${name} must contain nonempty strings`);
    }
    if (seen.has(value)) throw new Error(`${name} must be unique`);
    seen.add(value);
  }
}

function boundedInteger(value, name, minimum, maximum) {
  if (!Number.isInteger(value) || value < minimum || value > maximum) {
    throw new Error(`${name} must be an integer from ${minimum} through ${maximum}`);
  }
}

function selfConsistency({ answerSet, samples, acceptAt, groundTruth }) {
  uniqueNonEmptyStrings(answerSet, 'answerSet');
  if (!Array.isArray(samples) || samples.length === 0 || samples.length > MAX_SAMPLES) throw new Error('samples must be nonempty and bounded');
  for (const sample of samples) {
    if (typeof sample !== 'string' || sample.length === 0 || sample.length > MAX_ANSWER_LENGTH || sample.trim() !== sample) {
      throw new Error('samples must contain nonempty strings');
    }
  }
  if (typeof acceptAt !== 'number' || !Number.isFinite(acceptAt) || acceptAt < 0 || acceptAt > 1) throw new Error('acceptAt must be finite and bounded from 0 through 1');
  if (groundTruth !== undefined) nonEmptyString(groundTruth, 'groundTruth');

  const counts = Object.fromEntries(answerSet.map((answer) => [answer, 0]));
  const invalidSamples = [];
  for (const sample of samples) {
    if (Object.hasOwn(counts, sample)) counts[sample] += 1;
    else invalidSamples.push(sample);
  }
  const maxVotes = Math.max(...Object.values(counts));
  const leaders = answerSet.filter((answer) => counts[answer] === maxVotes);
  const winner = leaders.length === 1 ? leaders[0] : null;
  const agreement = maxVotes / samples.length;
  let decision;
  if (invalidSamples.length > 0) decision = 'escalate-invalid-output';
  else if (winner === null) decision = 'escalate-tie';
  else if (agreement < acceptAt) decision = 'escalate-low-agreement';
  else decision = 'accept';
  let externalValidation = 'not-checked';
  if (groundTruth !== undefined && winner !== null) externalValidation = winner === groundTruth ? 'correct' : 'incorrect';
  return { counts, invalidSamples, winner, agreement, decision, externalValidation };
}

function validateAgents(agents) {
  if (!Array.isArray(agents) || agents.length < 2 || agents.length > MAX_AGENTS) throw new Error('agents must contain a bounded set of at least two agents');
  const ids = new Set();
  for (const agent of agents) {
    if (!agent || typeof agent !== 'object') throw new Error('invalid agent');
    nonEmptyString(agent.id, 'agent id');
    if (ids.has(agent.id)) throw new Error('agent IDs must be unique');
    if (typeof agent.respond !== 'function') throw new Error('agent responder required');
    ids.add(agent.id);
  }
}

function withTimeout(promise, timeoutMs, reason) {
  let timer;
  return Promise.race([
    Promise.resolve(promise),
    new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(reason)), timeoutMs); })
  ]).finally(() => clearTimeout(timer));
}

async function runDebate({ agents, prompt, maxRounds, roundTimeoutMs, overallTimeoutMs, externalCheck }) {
  validateAgents(agents);
  nonEmptyString(prompt, 'prompt');
  boundedInteger(maxRounds, 'maxRounds', 1, MAX_ROUNDS);
  boundedInteger(roundTimeoutMs, 'roundTimeoutMs', 1, MAX_TIMEOUT_MS);
  boundedInteger(overallTimeoutMs, 'overallTimeoutMs', 1, MAX_TIMEOUT_MS);
  if (typeof externalCheck !== 'undefined' && typeof externalCheck !== 'function') throw new Error('externalCheck must be a function');

  const startedAt = Date.now();
  let states = new Map(agents.map((agent) => [agent.id, null]));
  const history = [];
  let revisions = 0;
  let converged = false;

  for (let round = 1; round <= maxRounds; round += 1) {
    const remainingOverall = overallTimeoutMs - (Date.now() - startedAt);
    if (remainingOverall <= 0) break;
    const prior = new Map(states);
    const updates = await withTimeout(Promise.all(agents.map(async (agent) => {
      const peers = [...prior.entries()].filter(([id, state]) => id !== agent.id && state !== null).map(([id, state]) => ({ id, ...state }));
      const next = await withTimeout(agent.respond({ round, prompt, previous: prior.get(agent.id), peers }), Math.min(roundTimeoutMs, remainingOverall), 'round-timeout');
      if (!next || typeof next.position !== 'string' || next.position.length === 0 || typeof next.artifact !== 'string' || next.artifact.length === 0) throw new Error(`invalid debate update from ${agent.id}`);
      return [agent.id, Object.freeze({ position: next.position, artifact: next.artifact })];
    })), remainingOverall, 'overall-timeout');

    states = new Map(updates);
    for (const [id, next] of updates) {
      const previous = prior.get(id);
      if (previous && (previous.position !== next.position || previous.artifact !== next.artifact)) revisions += 1;
    }
    history.push({ round, states: updates.map(([id, state]) => ({ id, ...state })) });

    // Compare the two fields separately. Concatenating with a separator is
    // ambiguous when either learner-controlled field contains that separator.
    const firstState = updates[0][1];
    converged = updates.every(([, state]) => (
      state.position === firstState.position &&
      state.artifact === firstState.artifact
    ));
    if (converged) break;
  }

  const finalStates = [...states.entries()].filter(([, state]) => state !== null).map(([id, state]) => ({ id, ...state }));
  const consensus = converged ? finalStates[0] : null;
  let externalValidation = 'not-checked';
  if (consensus && externalCheck) {
    const remaining = overallTimeoutMs - (Date.now() - startedAt);
    if (remaining > 0) externalValidation = (await withTimeout(externalCheck(consensus), remaining, 'overall-timeout')) ? 'correct' : 'incorrect';
  }
  return { rounds: history.length, converged, revisions, consensus, finalStates, history, externalValidation };
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  for (const child of Object.values(value)) deepFreeze(child);
  return Object.freeze(value);
}

function strictRequiredPolicy(validResults, requiredWorkerIds) {
  const present = new Set(validResults.map((result) => result.workerId));
  return requiredWorkerIds.every((workerId) => present.has(workerId));
}

async function runJoin({ workers, requiredWorkerIds, tenant, revision, input, callBudget, deadlineMs, quorumPolicy = strictRequiredPolicy }) {
  if (!Array.isArray(workers) || workers.length === 0 || workers.length > MAX_AGENTS) throw new Error('workers must be nonempty and bounded');
  uniqueNonEmptyStrings(requiredWorkerIds, 'requiredWorkerIds');
  nonEmptyString(tenant, 'tenant');
  nonEmptyString(revision, 'revision');
  boundedInteger(callBudget, 'callBudget', 1, 10000);
  boundedInteger(deadlineMs, 'deadlineMs', 1, MAX_TIMEOUT_MS);
  if (typeof quorumPolicy !== 'function') throw new Error('quorumPolicy must be a function');

  const workerIds = workers.map((worker) => worker && worker.id);
  uniqueNonEmptyStrings(workerIds, 'worker IDs');
  const workerSet = new Set(workerIds);
  for (const id of requiredWorkerIds) if (!workerSet.has(id)) throw new Error(`required worker ${id} is not configured`);
  const frozenInput = deepFreeze(structuredClone(input));
  const admitted = [];
  const failures = [];
  let budgetUsed = 0;
  for (const worker of workers) {
    if (!worker || typeof worker.run !== 'function') throw new Error(`invalid worker ${worker && worker.id}`);
    const cost = worker.cost ?? 1;
    boundedInteger(cost, `cost for ${worker.id}`, 1, callBudget);
    if (budgetUsed + cost > callBudget) failures.push({ workerId: worker.id, reason: 'budget-exceeded' });
    else { budgetUsed += cost; admitted.push(worker); }
  }

  const completionOrder = [];
  const startedAt = Date.now();
  const settled = await Promise.all(admitted.map(async (worker) => {
    const remaining = deadlineMs - (Date.now() - startedAt);
    if (remaining <= 0) return { worker, error: new Error('deadline-exceeded') };
    try {
      const envelope = await withTimeout(worker.run({ input: frozenInput, tenant, revision }), remaining, 'deadline-exceeded');
      completionOrder.push(worker.id);
      return { worker, envelope };
    } catch (error) { return { worker, error }; }
  }));

  const validResults = [];
  const rejected = [];
  for (const item of settled) {
    if (item.error) {
      failures.push({ workerId: item.worker.id, reason: item.error.message === 'deadline-exceeded' ? 'deadline-exceeded' : 'worker-error' });
      continue;
    }
    const envelope = item.envelope;
    let reason = null;
    if (!envelope || envelope.workerId !== item.worker.id) reason = 'identity-mismatch';
    else if (envelope.tenant !== tenant) reason = 'tenant-mismatch';
    else if (envelope.revision !== revision) reason = 'revision-mismatch';
    else if (!Object.hasOwn(envelope, 'evidence')) reason = 'missing-evidence';
    if (reason) rejected.push({ workerId: item.worker.id, reason });
    else validResults.push(Object.freeze({ ...envelope }));
  }
  validResults.sort((a, b) => a.workerId.localeCompare(b.workerId));
  const complete = quorumPolicy(validResults, requiredWorkerIds);
  const present = new Set(validResults.map((result) => result.workerId));
  return { completionOrder, merged: validResults, complete, missingRequired: requiredWorkerIds.filter((id) => !present.has(id)).sort(), rejected, failures: failures.sort((a, b) => a.workerId.localeCompare(b.workerId)), budgetUsed };
}

module.exports = { selfConsistency, runDebate, runJoin, strictRequiredPolicy };
