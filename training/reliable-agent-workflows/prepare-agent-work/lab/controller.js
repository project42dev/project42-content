#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const TERMINALS = Object.freeze({
  COMPLETE: 'COMPLETE',
  NEEDS_HUMAN: 'NEEDS_HUMAN',
  BUDGET_EXHAUSTED: 'BUDGET_EXHAUSTED',
  POLICY_BLOCKED: 'POLICY_BLOCKED',
  FAILED_WITH_RECOVERY_EVIDENCE: 'FAILED_WITH_RECOVERY_EVIDENCE'
});

const KNOWN_ACTIONS = new Set(['noop', 'write_receipt']);
const KNOWN_KINDS = new Set(['act', 'finish', 'escalate']);
const LEDGER_LIMIT = 32;

function copy(value) {
  return structuredClone(value);
}

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function finiteNonnegative(value) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

function nonempty(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function pushLedger(ledger, record) {
  ledger.push(record);
  if (ledger.length > LEDGER_LIMIT) ledger.shift();
}

function snapshotState(state) {
  return copy({
    version: state.version,
    objective: state.objective,
    plan: state.plan,
    completedActions: state.completedActions,
    evidence: state.evidence,
    unresolved: state.unresolved,
    noProgressCount: state.noProgressCount,
    operationKeys: state.operationKeys
  });
}

function snapshotBudget(used, limits) {
  return {
    turns: { used: used.turns, limit: limits.maxTurns, remaining: limits.maxTurns - used.turns },
    timeMs: { used: used.timeMs, limit: limits.maxTimeMs, remaining: limits.maxTimeMs - used.timeMs },
    tokens: { used: used.tokens, limit: limits.maxTokens, remaining: limits.maxTokens - used.tokens },
    actions: { used: used.actions, limit: limits.maxActions, remaining: limits.maxActions - used.actions }
  };
}

function semanticState(state) {
  return JSON.stringify({
    objective: state.objective,
    completedActions: state.completedActions,
    evidence: state.evidence,
    unresolved: state.unresolved,
    operationKeys: state.operationKeys
  });
}

function validateScenario(scenario) {
  if (!isObject(scenario)) return 'scenario must be an object';
  if (!nonempty(scenario.id)) return 'id must be a nonempty string';
  if (!Number.isSafeInteger(scenario.initialStateVersion) || scenario.initialStateVersion < 0) return 'initialStateVersion must be a nonnegative safe integer';
  if (!isObject(scenario.workOrder) || !nonempty(scenario.workOrder.outcome)) return 'workOrder.outcome must be a nonempty string';
  if (!isObject(scenario.contract) || !nonempty(scenario.contract.requiredText) || !nonempty(scenario.contract.operationKey)) return 'contract text and operation key must be nonempty strings';
  if (!isObject(scenario.policy) || !Array.isArray(scenario.policy.allowedActions) || !Array.isArray(scenario.policy.requireHumanApprovalFor)) return 'policy action lists must be arrays';
  if (!isObject(scenario.limits)) return 'limits must be an object';
  for (const field of ['maxTurns', 'maxTimeMs', 'maxTokens', 'maxActions']) {
    if (!finiteNonnegative(scenario.limits[field])) return `${field} must be finite and nonnegative`;
  }
  if (!Array.isArray(scenario.observations) || scenario.observations.length === 0) return 'observations must be a nonempty array';
  for (const observation of scenario.observations) {
    if (!isObject(observation) || !finiteNonnegative(observation.timeMs)) return 'every observation timeMs must be finite and nonnegative';
  }
  if (!Array.isArray(scenario.decisions) || scenario.decisions.length === 0) return 'decisions must be a nonempty array';
  for (const decision of scenario.decisions) {
    if (!isObject(decision) || !KNOWN_KINDS.has(decision.kind)) return 'decision kind must be act, finish, or escalate';
    if (!finiteNonnegative(decision.tokenCost)) return 'every decision tokenCost must be finite and nonnegative';
    if (decision.kind === 'act') {
      if (!nonempty(decision.action) || !KNOWN_ACTIONS.has(decision.action)) return 'act decision action is unsupported';
      if (!Number.isSafeInteger(decision.expectedStateVersion) || decision.expectedStateVersion < 0) return 'act decision expectedStateVersion must be a nonnegative safe integer';
      if (decision.action === 'write_receipt') {
        if (!nonempty(decision.resource)) return 'write_receipt resource must be nonempty';
        if (!nonempty(decision.operationKey)) return 'write_receipt operationKey must be nonempty';
        if (!nonempty(decision.text)) return 'write_receipt text must be nonempty';
      }
    }
  }
  if (!Array.isArray(scenario.trustedApprovals)) return 'trustedApprovals must be an array';
  for (const approval of scenario.trustedApprovals) {
    if (!isObject(approval) || !nonempty(approval.approvalId) || !nonempty(approval.action) || !nonempty(approval.resource) || !nonempty(approval.operationKey) || !Number.isSafeInteger(approval.stateVersion) || approval.stateVersion < 0) return 'trusted approval is malformed';
  }
  if (!['confirmed', 'timeout_after_possible_write'].includes(scenario.toolBehavior)) return 'toolBehavior is unsupported';
  return null;
}

function emptyResult(input, reason) {
  const id = isObject(input) && nonempty(input.id) ? input.id : 'invalid-input';
  return {
    scenario: id,
    terminal: TERMINALS.POLICY_BLOCKED,
    terminalReason: `invalid input: ${reason}`,
    state: null,
    budget: null,
    trace: [],
    ledger: [],
    environment: { receipts: [] },
    effects: 0
  };
}

function verify(environment, contract) {
  const matches = environment.receipts.filter((receipt) => receipt.text === contract.requiredText && receipt.operationKey === contract.operationKey);
  const accepted = matches.length === 1 && environment.receipts.length === 1;
  return {
    accepted,
    source: 'independent environment inspection',
    matchingReceipts: matches.length,
    totalReceipts: environment.receipts.length,
    reason: accepted ? 'exactly one receipt matches text and operation key' : 'required single matching receipt is not present'
  };
}

function authorize(decision, policy, trustedApprovals, currentVersion) {
  if (!isObject(decision) || !KNOWN_KINDS.has(decision.kind)) return { allowed: false, reason: 'decision kind is malformed or unsupported' };
  if (decision.kind !== 'act') return { allowed: true, reason: 'no action authorization required' };
  if (!KNOWN_ACTIONS.has(decision.action)) return { allowed: false, reason: `action ${String(decision.action)} is not implemented` };
  if (decision.expectedStateVersion !== currentVersion) return { allowed: false, reason: `stale decision expected state version ${decision.expectedStateVersion}; current version is ${currentVersion}` };
  if (!policy.allowedActions.includes(decision.action)) return { allowed: false, reason: `action ${decision.action} is not allowed by trusted policy` };
  if (policy.requireHumanApprovalFor.includes(decision.action)) {
    const match = trustedApprovals.find((approval) =>
      approval.action === decision.action &&
      approval.resource === decision.resource &&
      approval.operationKey === decision.operationKey &&
      approval.stateVersion === currentVersion
    );
    if (!match) return { allowed: false, reason: `action ${decision.action} requires a matching trusted approval for the current state revision` };
    return { allowed: true, reason: `action allowed by trusted policy and trusted approval ${match.approvalId}` };
  }
  return { allowed: true, reason: 'action allowed by trusted policy; human approval not required' };
}

function executeFixture(decision, environment, ledger, toolBehavior) {
  if (decision.action === 'noop') return { outcome: 'known', changed: false, result: 'noop completed without semantic state change' };
  if (decision.action !== 'write_receipt') return { outcome: 'blocked', changed: false, result: 'unknown action was not executed' };
  const existing = environment.receipts.filter((receipt) => receipt.operationKey === decision.operationKey);
  if (existing.length > 0) {
    pushLedger(ledger, { operationKey: decision.operationKey, action: decision.action, status: 'deduplicated', effectCount: 0 });
    return { outcome: 'known', changed: false, result: 'operation key already exists; duplicate suppressed' };
  }
  environment.receipts.push({ operationKey: decision.operationKey, resource: decision.resource, text: decision.text });
  if (toolBehavior === 'timeout_after_possible_write') {
    pushLedger(ledger, { operationKey: decision.operationKey, action: decision.action, status: 'outcome-unknown', effectCount: 'unknown' });
    return { outcome: 'unknown', changed: 'unknown', result: 'timeout after the write may have occurred' };
  }
  pushLedger(ledger, { operationKey: decision.operationKey, action: decision.action, status: 'confirmed', effectCount: 1 });
  return { outcome: 'known', changed: true, result: 'one in-memory receipt created' };
}

export function runScenario(input) {
  const validationError = validateScenario(input);
  if (validationError) return emptyResult(input, validationError);

  const scenario = copy(input);
  const environment = { receipts: [] };
  const ledger = [];
  const trace = [];
  const used = { turns: 0, timeMs: 0, tokens: 0, actions: 0 };
  const state = {
    version: scenario.initialStateVersion,
    objective: scenario.workOrder.outcome,
    plan: ['inspect', 'decide', 'authorize', 'act', 'verify'],
    completedActions: [],
    evidence: { receiptVerified: false },
    unresolved: [],
    noProgressCount: 0,
    operationKeys: []
  };
  let terminal = null;
  let terminalReason = null;
  let index = 0;

  function finish(name, reason, entry) {
    terminal = name;
    terminalReason = reason;
    entry.terminal = name;
    entry.terminalReason = reason;
    entry.afterState = snapshotState(state);
    entry.afterBudget = snapshotBudget(used, scenario.limits);
    trace.push(entry);
  }

  function recordNoProgress(entry, beforeSemantic) {
    const unchanged = beforeSemantic === semanticState(state);
    state.noProgressCount = unchanged ? state.noProgressCount + 1 : 0;
    if (state.noProgressCount >= 3) {
      finish(TERMINALS.NEEDS_HUMAN, 'three identical no-progress state transitions', entry);
      return true;
    }
    entry.afterState = snapshotState(state);
    entry.afterBudget = snapshotBudget(used, scenario.limits);
    entry.terminalReason = unchanged ? `no-progress transition ${state.noProgressCount} of 3` : 'state changed; continue';
    trace.push(entry);
    return false;
  }

  while (!terminal) {
    const observation = copy(scenario.observations[Math.min(index, scenario.observations.length - 1)]);
    const decision = copy(scenario.decisions[Math.min(index, scenario.decisions.length - 1)]);
    const beforeSemantic = semanticState(state);
    const entry = {
      iteration: index + 1,
      phases: ['inspect', 'decide', 'authorize', 'act', 'verify'],
      beforeState: snapshotState(state),
      beforeBudget: snapshotBudget(used, scenario.limits),
      observation: { trust: 'untrusted', data: observation.data ?? null, requestedAction: observation.requestedAction ?? null },
      decision,
      authorization: null,
      effect: null,
      verifier: null,
      afterState: null,
      afterBudget: null,
      terminal: null,
      terminalReason: null
    };

    if (used.turns + 1 > scenario.limits.maxTurns) {
      entry.authorization = { allowed: false, reason: 'turn budget preflight failed' };
      finish(TERMINALS.BUDGET_EXHAUSTED, 'next turn would exceed maxTurns', entry);
      break;
    }
    if (used.timeMs + observation.timeMs > scenario.limits.maxTimeMs) {
      entry.authorization = { allowed: false, reason: 'fixture time budget preflight failed' };
      finish(TERMINALS.BUDGET_EXHAUSTED, 'next inspection would exceed maxTimeMs', entry);
      break;
    }
    used.turns += 1;
    used.timeMs += observation.timeMs;

    if (observation.requestedAction && !scenario.policy.allowedActions.includes(observation.requestedAction)) {
      entry.authorization = { allowed: false, reason: `untrusted observation requested unauthorized action ${observation.requestedAction}` };
      entry.effect = { executed: false, result: 'zero unauthorized effects' };
      entry.verifier = verify(environment, scenario.contract);
      finish(TERMINALS.POLICY_BLOCKED, entry.authorization.reason, entry);
      break;
    }

    if (used.tokens + decision.tokenCost > scenario.limits.maxTokens) {
      entry.authorization = { allowed: false, reason: 'fixture token budget preflight failed' };
      finish(TERMINALS.BUDGET_EXHAUSTED, 'next decision would exceed maxTokens', entry);
      break;
    }
    used.tokens += decision.tokenCost;

    if (decision.kind === 'finish') {
      entry.authorization = { allowed: true, reason: 'finish proposal requires verifier, not action authority' };
      entry.effect = { executed: false, result: 'finish proposal has no effect' };
      entry.verifier = verify(environment, scenario.contract);
      if (entry.verifier.accepted) {
        state.evidence.receiptVerified = true;
        finish(TERMINALS.COMPLETE, 'independent verifier accepted exactly one receipt', entry);
        break;
      }
      if (recordNoProgress(entry, beforeSemantic)) break;
      index += 1;
      continue;
    }

    if (decision.kind === 'escalate') {
      entry.authorization = { allowed: true, reason: 'fixture requested human escalation' };
      entry.effect = { executed: false, result: 'no action executed' };
      entry.verifier = verify(environment, scenario.contract);
      finish(TERMINALS.NEEDS_HUMAN, 'decision fixture requested human escalation', entry);
      break;
    }

    const authorization = authorize(decision, scenario.policy, scenario.trustedApprovals, state.version);
    entry.authorization = authorization;
    if (!authorization.allowed) {
      entry.effect = { executed: false, result: 'zero unauthorized effects' };
      entry.verifier = verify(environment, scenario.contract);
      finish(TERMINALS.POLICY_BLOCKED, authorization.reason, entry);
      break;
    }

    if (used.actions + 1 > scenario.limits.maxActions) {
      entry.effect = { executed: false, result: 'action stopped before overspend' };
      entry.verifier = verify(environment, scenario.contract);
      finish(TERMINALS.BUDGET_EXHAUSTED, 'next action would exceed maxActions', entry);
      break;
    }

    used.actions += 1;
    const effect = executeFixture(decision, environment, ledger, scenario.toolBehavior);
    entry.effect = { executed: true, ...effect };

    if (decision.action === 'write_receipt' && (effect.changed === true || effect.outcome === 'unknown')) {
      state.version += 1;
      if (!state.operationKeys.includes(decision.operationKey)) state.operationKeys.push(decision.operationKey);
    }

    if (effect.outcome === 'unknown') {
      state.unresolved.push({
        operationKey: decision.operationKey,
        invokedAtStateVersion: decision.expectedStateVersion,
        stateVersionAfterInvocation: state.version,
        uncertainty: 'write may have occurred before timeout',
        reconciliation: 'inspect receipts for the operation key before any retry'
      });
      entry.verifier = { accepted: false, source: 'completion deferred while outcome is unknown', reason: 'reconciliation required' };
      finish(TERMINALS.FAILED_WITH_RECOVERY_EVIDENCE, `unknown outcome for operation key ${decision.operationKey}; reconcile before retry`, entry);
      break;
    }

    if (effect.changed) state.completedActions.push({ action: decision.action, operationKey: decision.operationKey ?? null });
    entry.verifier = verify(environment, scenario.contract);
    if (entry.verifier.accepted) {
      state.evidence.receiptVerified = true;
      state.noProgressCount = 0;
      finish(TERMINALS.COMPLETE, 'independent verifier accepted exactly one receipt', entry);
      break;
    }

    if (recordNoProgress(entry, beforeSemantic)) break;
    index += 1;
  }

  return {
    scenario: scenario.id,
    terminal,
    terminalReason,
    state: snapshotState(state),
    budget: snapshotBudget(used, scenario.limits),
    trace,
    ledger: copy(ledger),
    environment: copy(environment),
    effects: environment.receipts.length
  };
}

export function reconcile(result) {
  const recovered = copy(result);
  const unresolved = recovered.state?.unresolved?.[0];
  if (!unresolved) return { originalTerminal: recovered.terminal, reconciled: false, reason: 'no unresolved operation', retryPerformed: false };
  const matches = recovered.environment.receipts.filter((receipt) => receipt.operationKey === unresolved.operationKey);
  const record = {
    operationKey: unresolved.operationKey,
    inspectedReceiptCount: matches.length,
    reconciled: matches.length === 1,
    provedEffectCount: matches.length,
    retryPerformed: false,
    instruction: matches.length === 1 ? 'record the existing effect and do not retry' : 'seek human review before any retry'
  };
  pushLedger(recovered.ledger, { operationKey: unresolved.operationKey, action: 'reconcile', status: record.reconciled ? 'confirmed-one-effect' : 'unresolved', effectCount: matches.length });
  return { originalTerminal: recovered.terminal, ...record, ledger: recovered.ledger };
}

export function summary(result) {
  return `${result.scenario}: ${result.terminal} | ${result.terminalReason} | effects=${result.effects}`;
}

function loadInput(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

export function main(argv) {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const scenariosDocument = loadInput(path.join(here, 'scenarios.json'));
  const inputAt = argv.indexOf('--input');
  const scenarioAt = argv.indexOf('--scenario');
  let selected;
  if (inputAt >= 0) {
    if (!argv[inputAt + 1]) throw new Error('--input requires a path');
    selected = [loadInput(path.resolve(argv[inputAt + 1]))];
  } else if (argv.includes('--all')) {
    selected = scenariosDocument.scenarios;
  } else {
    const id = scenarioAt >= 0 ? argv[scenarioAt + 1] : 'success';
    selected = [scenariosDocument.scenarios.find((scenario) => scenario.id === id)];
  }
  if (!selected[0]) throw new Error('Scenario not found');
  for (const scenario of selected) {
    const result = runScenario(scenario);
    console.log(summary(result));
    if (argv.includes('--trace')) console.log(JSON.stringify(result, null, 2));
    if (argv.includes('--recover')) {
      const recovery = reconcile(result);
      console.log(`recovery: original=${recovery.originalTerminal} | operationKey=${recovery.operationKey} | provedEffects=${recovery.provedEffectCount} | retryPerformed=${recovery.retryPerformed}`);
    }
  }
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : '';
if (invokedPath === fileURLToPath(import.meta.url)) main(process.argv.slice(2));
