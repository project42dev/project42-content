export class ExecutionError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'ExecutionError';
    this.code = code;
    this.details = details;
  }
}

const patterns = new Set(['direct', 'sequential', 'router', 'manager', 'handoff', 'parallel', 'evaluator']);
const terminalStates = new Set(['success', 'fail', 'escalation']);
const resultKinds = new Set(['evidence', 'artifact', 'route', 'handoff', 'review', 'final']);
const clone = value => structuredClone(value);
const byPriority = (a, b) => Number(a.required === false) - Number(b.required === false) || a.id.localeCompare(b.id);

function graphError(message, details = {}) {
  throw new ExecutionError('GRAPH_INVALID', message, details);
}

function validateGraph(graph) {
  if (!graph || typeof graph !== 'object') graphError('graph must be an object');
  if (typeof graph.id !== 'string' || graph.id.length === 0) graphError('graph id must be a non-empty string');
  if (!patterns.has(graph.pattern)) graphError(`unknown pattern ${graph.pattern}`);
  if (!Array.isArray(graph.nodes) || graph.nodes.length === 0) graphError('graph nodes must be a non-empty array');
  if (!terminalStates.has(graph.failureTerminal)) graphError('graph failureTerminal is invalid');
  if (typeof graph.owner !== 'string' || graph.owner.length === 0) graphError('graph owner must be a non-empty string');
  if (typeof graph.inputVersion !== 'string' || graph.inputVersion.length === 0) graphError('graph inputVersion must be a non-empty string');

  const byId = new Map();
  for (const node of graph.nodes) {
    if (typeof node.id !== 'string' || node.id.length === 0) graphError('node id must be a non-empty string');
    if (byId.has(node.id)) graphError(`duplicate node ${node.id}`);
    byId.set(node.id, node);
    if (!Array.isArray(node.dependsOn)) graphError(`${node.id} dependsOn must be an array`);
    if (!Number.isInteger(node.reserve) || node.reserve <= 0) graphError(`${node.id} reserve must be a positive integer`);
    if (!Number.isInteger(node.timeoutMs) || node.timeoutMs <= 0) graphError(`${node.id} timeoutMs must be a positive integer`);
    if (!Number.isInteger(node.attemptCap) || node.attemptCap <= 0) graphError(`${node.id} attemptCap must be a positive integer`);
    if (node.inputVersion !== graph.inputVersion) graphError(`${node.id} input contract ${node.inputVersion} does not match graph input ${graph.inputVersion}`);
    if (typeof node.outputVersion !== 'string' || node.outputVersion.length === 0) graphError(`${node.id} outputVersion must be a non-empty string`);
    if (typeof node.fixture !== 'string' || node.fixture.length === 0) graphError(`${node.id} fixture must be a non-empty string`);
    if (!node.authority || !Array.isArray(node.authority.allowedActions)) graphError(`${node.id} authority is invalid`);
    if (!node.dependencyContracts || typeof node.dependencyContracts !== 'object' || Array.isArray(node.dependencyContracts)) graphError(`${node.id} dependencyContracts must be an object`);
  }

  for (const node of graph.nodes) {
    const dependencies = new Set(node.dependsOn);
    if (dependencies.size !== node.dependsOn.length) graphError(`${node.id} contains a duplicate dependency`);
    for (const id of dependencies) {
      if (!byId.has(id)) graphError(`${node.id} has unknown dependency ${id}`);
      if (id === node.id) graphError(`${node.id} cannot depend on itself`);
    }
    const contractIds = Object.keys(node.dependencyContracts).sort();
    const dependencyIds = [...dependencies].sort();
    if (JSON.stringify(contractIds) !== JSON.stringify(dependencyIds)) graphError(`${node.id} must declare exactly one dependency contract for every dependency`);
    for (const id of dependencyIds) {
      const expected = node.dependencyContracts[id];
      const produced = byId.get(id).outputVersion;
      if (expected !== produced) graphError(`${node.id} expects ${id} contract ${expected}, but the dependency produces ${produced}`);
    }
    if (node.handoff !== undefined) {
      const policy = node.handoff;
      if (!policy || !['transfer', 'return'].includes(policy.transition)) graphError(`${node.id} handoff transition is invalid`);
      if (typeof policy.from !== 'string' || typeof policy.to !== 'string' || policy.from === policy.to) graphError(`${node.id} handoff owners are invalid`);
      if (typeof policy.acceptanceContract !== 'string' || !policy.acceptanceContract) graphError(`${node.id} handoff acceptance contract is invalid`);
      if (node.principal !== policy.from || node.authority.principal !== policy.from) graphError(`${node.id} handoff producer must be the configured source owner`);
      if (!node.authority.allowedActions.includes(policy.transition)) graphError(`${node.id} handoff action is not allowed`);
    }
  }

  const indegree = new Map(graph.nodes.map(node => [node.id, node.dependsOn.length]));
  const children = new Map(graph.nodes.map(node => [node.id, []]));
  for (const node of graph.nodes) for (const id of node.dependsOn) children.get(id).push(node.id);
  const queue = graph.nodes.filter(node => indegree.get(node.id) === 0).map(node => node.id);
  let visited = 0;
  while (queue.length) {
    const id = queue.shift();
    visited += 1;
    for (const child of children.get(id)) {
      indegree.set(child, indegree.get(child) - 1);
      if (indegree.get(child) === 0) queue.push(child);
    }
  }
  if (visited !== graph.nodes.length) graphError('dependency graph contains a cycle');

  const finals = graph.nodes.filter(node => node.final === true);
  if (finals.length > 1) graphError('graph has ambiguous multiple final nodes');
  if (finals.length === 1) {
    const finalNode = finals[0];
    if (finalNode.required === false) graphError('final node cannot be optional');
    const ancestors = new Set();
    const visit = id => {
      for (const dependencyId of byId.get(id).dependsOn) {
        if (!ancestors.has(dependencyId)) {
          ancestors.add(dependencyId);
          visit(dependencyId);
        }
      }
    };
    visit(finalNode.id);
    const missing = graph.nodes.filter(node => node.id !== finalNode.id && node.required !== false && !ancestors.has(node.id)).map(node => node.id).sort();
    if (missing.length) graphError(`final node ${finalNode.id} lacks transitive required dependencies: ${missing.join(', ')}`, {missing});
  }

  if (graph.pattern === 'router') {
    const routing = graph.routing;
    if (!routing || typeof routing !== 'object') graphError('router graph requires trusted routing policy');
    if (!byId.has(routing.classifier)) graphError('router classifier is unknown');
    if (!routing.branches || typeof routing.branches !== 'object' || Array.isArray(routing.branches)) graphError('router branches must be an object');
    const routes = Object.keys(routing.branches);
    if (routes.length < 2) graphError('router requires at least two routes');
    const workerIds = Object.values(routing.branches);
    if (new Set(workerIds).size !== workerIds.length) graphError('router routes must map to distinct workers');
    for (const [route, id] of Object.entries(routing.branches)) {
      const worker = byId.get(id);
      if (!worker || worker.routeValue !== route) graphError(`route ${route} does not map to a matching trusted worker`);
      if (!worker.dependsOn.includes(routing.classifier)) graphError(`route worker ${id} must depend on classifier`);
    }
  }

  if (graph.pattern === 'evaluator') {
    const loop = graph.loop;
    if (!loop || typeof loop !== 'object') graphError('evaluator graph requires loop policy');
    if (!byId.has(loop.evaluator) || !byId.has(loop.reviser)) graphError('evaluator loop nodes are unknown');
    if (!Array.isArray(loop.criteria) || loop.criteria.length === 0 || loop.criteria.some(item => typeof item !== 'string' || !item)) graphError('evaluator criteria must be non-empty strings');
    if (!Number.isInteger(loop.maxRevisions) || loop.maxRevisions < 0) graphError('maxRevisions must be a nonnegative integer');
    if (!Number.isInteger(loop.deadlineMs) || loop.deadlineMs <= 0) graphError('evaluator deadlineMs must be positive');
  }
}

function validateTypedResult(node, result, revision) {
  if (!result || typeof result !== 'object') throw new ExecutionError('INVALID_RESULT', `${node.id} returned no typed result`);
  if (result.contract !== node.outputVersion) throw new ExecutionError('OUTPUT_VERSION', `${node.id} output contract ${result.contract} did not match ${node.outputVersion}`);
  if (result.revision !== revision) throw new ExecutionError('STALE_COMPLETION', `${node.id} completed revision ${result.revision}, current revision is ${revision}`);
  if (!resultKinds.has(result.kind)) throw new ExecutionError('INVALID_RESULT', `${node.id} returned unknown kind ${result.kind}`);
  if (!Number.isInteger(result.cost) || result.cost < 0 || result.cost > node.reserve) throw new ExecutionError('COST', `${node.id} reported invalid action cost`);
  if (!Array.isArray(result.actions)) throw new ExecutionError('INVALID_RESULT', `${node.id} actions must be an array`);
  for (const action of result.actions) if (!node.authority.allowedActions.includes(action)) throw new ExecutionError('AUTHORITY', `${node.id} attempted forbidden action ${action}`);
  if (result.approved === true && node.authority.role !== 'parent') throw new ExecutionError('APPROVAL_FORGED', `${node.id} cannot manufacture approval`);
  if (result.actions.includes('approve') && result.approved !== true) throw new ExecutionError('APPROVAL_REQUIRED', `${node.id} attempted approval without an approved result`);
}

function validateIdentity(node, graph, input) {
  if (node.authority.tenant !== input.tenant || node.authority.role !== node.role || node.authority.principal !== node.principal) throw new ExecutionError('AUTHORITY', `${node.id} role, tenant, or principal mismatch`);
  if (node.inputVersion !== graph.inputVersion) throw new ExecutionError('INPUT_VERSION', `${node.id} rejected graph input contract ${graph.inputVersion}`);
}

function validateHandoff(node, result, activeOwner) {
  const policy = node.handoff;
  if (!policy) throw new ExecutionError('HANDOFF', `${node.id} has no trusted handoff policy`);
  if (node.principal !== activeOwner || node.authority.principal !== activeOwner || policy.from !== activeOwner) throw new ExecutionError('HANDOFF_PRODUCER', `${node.id} is not the trusted current owner`);
  if (result.transition !== policy.transition || result.from !== policy.from || result.to !== policy.to) throw new ExecutionError('HANDOFF_DESTINATION', `${node.id} result does not match its trusted handoff route`);
  if (result.accepted !== true || result.acceptanceContract !== policy.acceptanceContract) throw new ExecutionError('HANDOFF_ACCEPTANCE', `${node.id} lacks the configured receiver acceptance contract`);
  return policy.to;
}

function timedFixture({fixture, context, timeoutMs}) {
  const controller = new AbortController();
  const task = Promise.resolve().then(() => fixture({...context, signal: controller.signal}));
  const timeout = new Promise((_, reject) => {
    const timer = setTimeout(() => {
      const error = new ExecutionError('TIMEOUT', `${context.node.id} exceeded timeout`);
      controller.abort(error);
      reject(error);
    }, timeoutMs);
    task.finally(() => clearTimeout(timer)).catch(() => {});
  });
  return {controller, completion: Promise.race([task, timeout])};
}

async function executeEvaluator({graph, fixtures, input, config}) {
  const revision = input.revision;
  const totalBudget = config.totalBudget ?? graph.totalBudget;
  const runId = config.runId ?? 'run-001';
  const evaluator = graph.nodes.find(node => node.id === graph.loop.evaluator);
  const reviser = graph.nodes.find(node => node.id === graph.loop.reviser);
  if (!Number.isInteger(revision)) throw new ExecutionError('REVISION', 'input revision must be an integer');
  if (!Number.isInteger(totalBudget) || totalBudget < 0) throw new ExecutionError('BUDGET', 'total budget must be a nonnegative integer');
  validateIdentity(evaluator, graph, input);
  validateIdentity(reviser, graph, input);

  const started = Date.now();
  let available = totalBudget;
  let sequence = 0;
  let artifact = String(input.badReply ?? '');
  let artifactRevision = 0;
  let terminal = null;
  const evidence = [];
  const effects = [];
  const trace = [];
  const emit = (node, event, details = {}) => trace.push({sequence: sequence++, runId, spanId: `${runId}:${node?.id ?? 'graph'}:${artifactRevision}`, parentSpanId: runId, node: node?.id ?? 'graph', activeAgent: node?.role ?? graph.owner, event, inputVersion: graph.inputVersion, outputVersion: node?.outputVersion ?? graph.outputVersion, budgetAvailable: available, artifactRevision, ...details});

  const invoke = async (node, context, recordId) => {
    const remaining = graph.loop.deadlineMs - (Date.now() - started);
    if (remaining <= 0) throw new ExecutionError('DEADLINE', 'evaluator graph deadline reached');
    if (node.reserve > available) throw new ExecutionError('BUDGET', `cannot reserve ${node.id}`);
    const fixture = fixtures[node.fixture];
    if (typeof fixture !== 'function') throw new ExecutionError('FIXTURE', `missing trusted fixture ${node.fixture}`);
    available -= node.reserve;
    emit(node, 'dispatch', {reserved: node.reserve, recordId});
    const timeoutMs = Math.min(node.timeoutMs, remaining);
    try {
      const operation = timedFixture({fixture, timeoutMs, context: {input: clone(input), node: clone(node), revision, artifact, artifactRevision, criteria: clone(graph.loop.criteria), feedback: clone(context.feedback ?? null)}});
      const result = await operation.completion;
      validateTypedResult(node, result, revision);
      available += node.reserve - result.cost;
      effects.push(...result.actions.map(action => ({node: recordId, action, revision, artifactRevision: result.artifactRevision})));
      evidence.push({id: recordId, state: 'success', revision, result: clone(result)});
      emit(node, 'complete', {recordId, used: result.cost, released: node.reserve - result.cost});
      return result;
    } catch (error) {
      available += node.reserve;
      evidence.push({id: recordId, state: 'failed', revision, error: error.message});
      emit(node, 'attempt-failed', {recordId, code: error.code ?? 'FIXTURE_ERROR', released: node.reserve});
      throw error;
    }
  };

  while (!terminal) {
    let review;
    try {
      review = await invoke(evaluator, {}, `evaluate-${artifactRevision}`);
    } catch (error) {
      terminal = {state: 'escalation', reason: error.code ?? 'evaluator-failed'};
      break;
    }
    if (review.kind !== 'review' || review.artifactRevision !== artifactRevision || typeof review.approved !== 'boolean' || !Array.isArray(review.unmet) || typeof review.feedback !== 'string') {
      terminal = {state: 'escalation', reason: 'EVALUATOR_CONTRACT'};
      break;
    }
    const expectedUnmet = graph.loop.criteria.filter(criterion => !artifact.includes(criterion));
    if (JSON.stringify(review.unmet) !== JSON.stringify(expectedUnmet)) {
      terminal = {state: 'escalation', reason: 'EVALUATOR_CRITERIA_MISMATCH'};
      break;
    }
    if (review.approved === true) {
      if (review.unmet.length !== 0 || !review.actions.includes('approve')) terminal = {state: 'escalation', reason: 'INVALID_TERMINAL_APPROVAL'};
      else terminal = {state: 'success', reason: 'terminal-evaluator-approved'};
      break;
    }
    if (review.actions.includes('approve')) {
      terminal = {state: 'escalation', reason: 'INVALID_TERMINAL_APPROVAL'};
      break;
    }
    if (artifactRevision >= graph.loop.maxRevisions) {
      terminal = {state: 'escalation', reason: 'iteration-cap'};
      break;
    }

    let revised;
    try {
      revised = await invoke(reviser, {feedback: {unmet: review.unmet, text: review.feedback}}, `revise-${artifactRevision + 1}`);
    } catch (error) {
      terminal = {state: 'escalation', reason: error.code ?? 'reviser-failed'};
      break;
    }
    if (revised.kind !== 'artifact' || revised.fromArtifactRevision !== artifactRevision || revised.artifactRevision !== artifactRevision + 1 || typeof revised.artifact !== 'string' || revised.artifact === artifact) {
      terminal = {state: 'escalation', reason: 'REVISION_CONTRACT'};
      break;
    }
    artifact = revised.artifact;
    artifactRevision = revised.artifactRevision;
  }

  emit(null, 'terminal', {terminal: terminal.state, reason: terminal.reason, finalArtifact: artifact});
  return {runId, pattern: graph.pattern, revision, terminal, activeOwner: graph.owner, budget: {total: totalBudget, available, used: totalBudget - available}, evidence, effects, trace, artifact, artifactRevision};
}

export async function execute({graph, fixtures, input, config = {}}) {
  validateGraph(graph);
  if (graph.pattern === 'evaluator') return executeEvaluator({graph, fixtures, input, config});

  const runId = config.runId ?? 'run-001';
  const revision = input.revision;
  const totalBudget = config.totalBudget ?? graph.totalBudget;
  const concurrency = config.concurrency ?? graph.concurrency;
  const hooks = config.hooks ?? {};
  if (!Number.isInteger(revision)) throw new ExecutionError('REVISION', 'input revision must be an integer');
  if (!Number.isInteger(totalBudget) || totalBudget < 0) throw new ExecutionError('BUDGET', 'total budget must be a nonnegative integer');
  if (!Number.isInteger(concurrency) || concurrency < 1) throw new ExecutionError('CONCURRENCY', 'concurrency must be at least one');

  let available = totalBudget;
  let activeOwner = graph.owner;
  let terminal = null;
  let selectedRoute = null;
  let sequence = 0;
  const records = new Map();
  const pending = new Map(graph.nodes.map(node => [node.id, node]));
  const running = new Map();
  const attempts = new Map();
  const trace = [];
  const effects = [];
  const emit = (node, event, details = {}) => trace.push({sequence: sequence++, runId, spanId: `${runId}:${node?.id ?? 'graph'}`, parentSpanId: runId, node: node?.id ?? 'graph', activeAgent: node?.role ?? activeOwner, event, inputVersion: node?.inputVersion ?? graph.inputVersion, outputVersion: node?.outputVersion ?? graph.outputVersion, budgetAvailable: available, ...details});
  const routeWorkerIds = graph.pattern === 'router' ? new Set(Object.values(graph.routing.branches)) : new Set();
  const isSatisfied = id => records.get(id)?.state === 'success' || (routeWorkerIds.has(id) && records.get(id)?.state === 'skipped');

  const requiredNonFinalCurrent = () => graph.nodes.filter(node => node.required !== false && node.final !== true).every(node => {
    const record = records.get(node.id);
    if (node.routeValue && node.routeValue !== selectedRoute) return record?.state === 'skipped' && record.revision === revision;
    return record?.state === 'success' && record.revision === revision;
  });

  const preflight = node => {
    validateIdentity(node, graph, input);
    for (const id of node.dependsOn) {
      const record = records.get(id);
      if (record?.state === 'skipped' && routeWorkerIds.has(id)) continue;
      if (record?.state !== 'success' || record.revision !== revision) throw new ExecutionError('DEPENDENCY', `${node.id} lacks current successful dependency ${id}`);
      if (record.result?.contract !== node.dependencyContracts[id]) throw new ExecutionError('DEPENDENCY_CONTRACT', `${node.id} received the wrong contract from ${id}`);
    }
    if (node.routeValue && node.routeValue !== selectedRoute) throw new ExecutionError('ROUTE_NOT_SELECTED', `${node.id} is not the selected route`);
  };

  const invoke = (node, controller, attempt) => {
    const task = (async () => {
      preflight(node);
      const fixture = fixtures[node.fixture];
      if (typeof fixture !== 'function') throw new ExecutionError('FIXTURE', `missing trusted fixture ${node.fixture}`);
      const dependencies = Object.fromEntries(node.dependsOn.filter(id => records.get(id)?.state === 'success').map(id => [id, clone(records.get(id).result)]));
      hooks.onStart?.(node.id);
      try {
        return await fixture({input: clone(input), dependencies, node: clone(node), attempt, revision, activeOwner, selectedRoute, signal: controller.signal});
      } finally {
        hooks.onEnd?.(node.id);
      }
    })();
    const timeout = new Promise((_, reject) => {
      const timer = setTimeout(() => {
        const error = new ExecutionError('TIMEOUT', `${node.id} exceeded timeout`);
        controller.abort(error);
        reject(error);
      }, node.timeoutMs);
      task.finally(() => clearTimeout(timer)).catch(() => {});
    });
    return Promise.race([task, timeout]).then(result => ({node, attempt, result}), error => ({node, attempt, error}));
  };

  const dispatch = node => {
    if (terminal || node.reserve > available) return false;
    if (node.final === true && !requiredNonFinalCurrent()) return false;
    pending.delete(node.id);
    available -= node.reserve;
    const attempt = (attempts.get(node.id) ?? 0) + 1;
    attempts.set(node.id, attempt);
    const controller = new AbortController();
    emit(node, 'dispatch', {reserved: node.reserve, dependencies: [...node.dependsOn]});
    running.set(node.id, {node, controller, completion: invoke(node, controller, attempt)});
    return true;
  };

  const processCompletion = completion => {
    const {node} = completion;
    if (terminal) return;
    if (completion.error) {
      available += node.reserve;
      emit(node, 'attempt-failed', {attempt: completion.attempt, code: completion.error.code ?? 'FIXTURE_ERROR', released: node.reserve});
      const nonRetryable = new Set(['AUTHORITY', 'INPUT_VERSION', 'DEPENDENCY', 'DEPENDENCY_CONTRACT', 'ROUTE_NOT_SELECTED']);
      if (completion.attempt < node.attemptCap && !nonRetryable.has(completion.error.code)) {
        pending.set(node.id, node);
        emit(node, 'retry-scheduled', {nextAttempt: completion.attempt + 1});
      } else {
        records.set(node.id, {state: node.required === false ? 'optional-failed' : 'failed', error: completion.error.message, revision});
        if (node.required !== false) terminal = {state: graph.failureTerminal, reason: completion.error.code ?? 'node-failed'};
      }
      return;
    }

    try {
      validateTypedResult(node, completion.result, revision);
      if (graph.pattern === 'router' && node.id === graph.routing.classifier) {
        if (completion.result.kind !== 'route' || typeof completion.result.route !== 'string' || !Object.hasOwn(graph.routing.branches, completion.result.route)) throw new ExecutionError('ROUTE_INVALID', `${node.id} returned a missing or unknown route`);
        selectedRoute = completion.result.route;
      }
      if (node.routeValue && completion.result.route !== node.routeValue) throw new ExecutionError('ROUTE_EVIDENCE_INVALID', `${node.id} did not bind evidence to its trusted route`);
      let nextOwner = activeOwner;
      if (completion.result.kind === 'handoff') nextOwner = validateHandoff(node, completion.result, activeOwner);
      if (completion.result.writeKey) {
        const conflict = [...records.values()].find(record => record.result?.writeKey === completion.result.writeKey && record.result?.value !== completion.result.value);
        if (conflict) throw new ExecutionError('WRITE_CONFLICT', `conflicting write ${completion.result.writeKey}`);
      }
      activeOwner = nextOwner;
      available += node.reserve - completion.result.cost;
      effects.push(...completion.result.actions.map(action => ({node: node.id, action, revision})));
      records.set(node.id, {state: 'success', result: clone(completion.result), revision, attempt: completion.attempt});
      emit(node, 'complete', {attempt: completion.attempt, used: completion.result.cost, released: node.reserve - completion.result.cost});
      if (graph.pattern === 'router' && node.id === graph.routing.classifier) {
        emit(node, 'route-selected', {route: selectedRoute, worker: graph.routing.branches[selectedRoute]});
        for (const [route, workerId] of Object.entries(graph.routing.branches)) {
          if (route !== selectedRoute && pending.has(workerId)) {
            pending.delete(workerId);
            records.set(workerId, {state: 'skipped', reason: 'route-not-selected', route, revision});
            emit(graph.nodes.find(item => item.id === workerId), 'skip', {reason: 'route-not-selected', route});
          }
        }
      }
    } catch (error) {
      available += node.reserve;
      records.set(node.id, {state: node.required === false ? 'optional-failed' : 'failed', error: error.message, revision});
      emit(node, 'rejected-result', {code: error.code ?? 'INVALID_RESULT', released: node.reserve});
      if (node.required !== false) terminal = {state: graph.failureTerminal, reason: error.code ?? 'INVALID_RESULT'};
    }
  };

  while ((pending.size || running.size) && !terminal) {
    for (const node of [...pending.values()]) {
      if (node.dependsOn.some(id => records.has(id) && !isSatisfied(id))) {
        pending.delete(node.id);
        records.set(node.id, {state: 'cancelled', reason: 'dependency-failed', revision});
        emit(node, 'cancel', {reason: 'dependency-failed'});
      }
    }
    const ready = [...pending.values()].filter(node => node.dependsOn.every(isSatisfied)).filter(node => !node.routeValue || node.routeValue === selectedRoute).filter(node => node.final !== true || requiredNonFinalCurrent()).sort(byPriority);
    for (const node of ready) {
      if (running.size >= concurrency) break;
      if (!dispatch(node)) {
        if (node.reserve > available) {
          emit(node, 'reject-before-effect', {reason: 'total-budget-reservation'});
          terminal = {state: graph.failureTerminal, reason: 'budget'};
        }
        break;
      }
    }
    if (terminal) break;
    if (!running.size) {
      if (pending.size) terminal = {state: 'fail', reason: 'unresolvable-dependencies'};
      break;
    }
    const completion = await Promise.race([...running.values()].map(item => item.completion));
    running.delete(completion.node.id);
    processCompletion(completion);
  }

  if (terminal && running.size) {
    for (const item of running.values()) item.controller.abort(new ExecutionError('CANCELLED', 'run reached a terminal state'));
    const late = await Promise.all([...running.values()].map(item => item.completion));
    for (const completion of late.sort((a, b) => a.node.id.localeCompare(b.node.id))) {
      available += completion.node.reserve;
      records.set(completion.node.id, {state: 'cancelled', reason: 'terminal-reached', revision});
      emit(completion.node, 'late-completion-ignored', {reason: 'terminal-reached', released: completion.node.reserve});
    }
  }
  if (terminal) {
    for (const node of pending.values()) {
      records.set(node.id, {state: 'cancelled', reason: 'terminal-reached', revision});
      emit(node, 'cancel', {reason: 'terminal-reached'});
    }
  }

  const finalNode = graph.nodes.find(node => node.final === true);
  if (!terminal) {
    const finalRecord = finalNode ? records.get(finalNode.id) : null;
    const ownerReturned = activeOwner === graph.owner;
    terminal = requiredNonFinalCurrent() && ownerReturned && (!finalNode || finalRecord?.result?.approved === true) ? {state: 'success', reason: 'all-required-evidence-validated'} : {state: graph.failureTerminal, reason: ownerReturned ? 'missing-required-evidence' : 'control-not-returned'};
  }
  emit(null, 'terminal', {terminal: terminal.state, reason: terminal.reason, activeOwner, selectedRoute});
  const evidence = [...records.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([id, record]) => ({id, ...clone(record)}));
  return {runId, pattern: graph.pattern, revision, terminal, activeOwner, selectedRoute, budget: {total: totalBudget, available, used: totalBudget - available}, evidence, effects, trace};
}
