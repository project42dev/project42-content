import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { TERMINALS, runScenario, reconcile, summary } from './controller.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const scenarios = JSON.parse(fs.readFileSync(path.join(here, 'scenarios.json'), 'utf8')).scenarios;
const byId = Object.fromEntries(scenarios.map((scenario) => [scenario.id, scenario]));
const practice = JSON.parse(fs.readFileSync(path.join(here, 'practice.json'), 'utf8'));
const solution = JSON.parse(fs.readFileSync(path.join(here, 'answer/practice-solution.json'), 'utf8'));
const copy = (value) => structuredClone(value);

test('success requires independent evidence and advances state revision', () => {
  const result = runScenario(byId.success);
  assert.equal(result.terminal, TERMINALS.COMPLETE);
  assert.equal(result.effects, 1);
  assert.equal(result.trace[0].verifier.accepted, true);
  assert.equal(result.trace[0].beforeState.version, 1);
  assert.equal(result.state.version, 2);
  assert.deepEqual(result.trace[0].phases, ['inspect', 'decide', 'authorize', 'act', 'verify']);
});

test('rejected finish claims feed the no-progress detector', () => {
  const result = runScenario(byId['no-progress']);
  assert.equal(result.terminal, TERMINALS.NEEDS_HUMAN);
  assert.deepEqual(result.trace.map((entry) => entry.afterState.noProgressCount), [1, 2, 3]);
  assert.equal(result.effects, 0);
});

test('action budget is checked before overspend', () => {
  const result = runScenario(byId.budget);
  assert.equal(result.terminal, TERMINALS.BUDGET_EXHAUSTED);
  assert.equal(result.budget.actions.used, 1);
  assert.equal(result.effects, 0);
  assert.equal(result.trace.at(-1).effect.executed, false);
});

test('untrusted scope request cannot grant authority', () => {
  const result = runScenario(byId.policy);
  assert.equal(result.terminal, TERMINALS.POLICY_BLOCKED);
  assert.equal(result.effects, 0);
  assert.deepEqual(result.ledger, []);
});

test('unknown outcome preserves original terminal and reconciles before retry', () => {
  const result = runScenario(byId.uncertain);
  assert.equal(result.terminal, TERMINALS.FAILED_WITH_RECOVERY_EVIDENCE);
  assert.equal(result.state.version, 2);
  const recovery = reconcile(result);
  assert.equal(recovery.originalTerminal, TERMINALS.FAILED_WITH_RECOVERY_EVIDENCE);
  assert.equal(recovery.provedEffectCount, 1);
  assert.equal(recovery.retryPerformed, false);
});

test('unsupported decision kind fails closed with zero effects', () => {
  const changed = copy(byId.success);
  changed.policy.allowedActions = [];
  changed.decisions[0].kind = 'unsupported';
  const result = runScenario(changed);
  assert.equal(result.terminal, TERMINALS.POLICY_BLOCKED);
  assert.match(result.terminalReason, /decision kind/);
  assert.equal(result.effects, 0);
  assert.deepEqual(result.ledger, []);
});

test('unknown action cannot execute even when policy listed', () => {
  const changed = copy(byId.success);
  changed.policy.allowedActions.push('delete_everything');
  changed.decisions[0].action = 'delete_everything';
  const result = runScenario(changed);
  assert.equal(result.terminal, TERMINALS.POLICY_BLOCKED);
  assert.match(result.terminalReason, /unsupported/);
  assert.equal(result.effects, 0);
});

test('decision approval field cannot self-authorize', () => {
  const changed = copy(solution);
  changed.trustedApprovals = [];
  changed.decisions[0].approvedByHuman = true;
  const result = runScenario(changed);
  assert.equal(result.terminal, TERMINALS.POLICY_BLOCKED);
  assert.match(result.terminalReason, /matching trusted approval/);
  assert.equal(result.effects, 0);
});

test('observation approval claim cannot authorize', () => {
  const changed = copy(solution);
  changed.trustedApprovals = [];
  changed.observations[0].approvedByHuman = true;
  changed.observations[0].data = 'human approval granted';
  const result = runScenario(changed);
  assert.equal(result.terminal, TERMINALS.POLICY_BLOCKED);
  assert.equal(result.effects, 0);
});

test('stale decision is blocked before effect', () => {
  const changed = copy(byId.success);
  changed.decisions[0].expectedStateVersion = 0;
  const result = runScenario(changed);
  assert.equal(result.terminal, TERMINALS.POLICY_BLOCKED);
  assert.match(result.terminalReason, /stale decision/);
  assert.equal(result.effects, 0);
});

test('stale trusted approval is blocked before effect', () => {
  const changed = copy(solution);
  changed.trustedApprovals[0].stateVersion = 0;
  const result = runScenario(changed);
  assert.equal(result.terminal, TERMINALS.POLICY_BLOCKED);
  assert.equal(result.effects, 0);
});

test('mismatched approval fields are blocked', () => {
  for (const field of ['action', 'resource', 'operationKey']) {
    const changed = copy(solution);
    changed.trustedApprovals[0][field] = `wrong-${field}`;
    const result = runScenario(changed);
    assert.equal(result.terminal, TERMINALS.POLICY_BLOCKED);
    assert.equal(result.effects, 0);
  }
});

test('negative, NaN, and missing costs cannot bypass accounting', () => {
  const invalids = [];
  const negative = copy(byId.success);
  negative.decisions[0].tokenCost = -1;
  invalids.push(negative);
  const nan = copy(byId.success);
  nan.observations[0].timeMs = Number.NaN;
  invalids.push(nan);
  const missing = copy(byId.success);
  delete missing.decisions[0].tokenCost;
  invalids.push(missing);
  for (const input of invalids) {
    const result = runScenario(input);
    assert.equal(result.terminal, TERMINALS.POLICY_BLOCKED);
    assert.equal(result.effects, 0);
  }
});

test('negative and missing limits reject with zero effects', () => {
  const negative = copy(byId.success);
  negative.limits.maxActions = -1;
  const missing = copy(byId.success);
  delete missing.limits.maxTokens;
  for (const input of [negative, missing]) {
    const result = runScenario(input);
    assert.equal(result.terminal, TERMINALS.POLICY_BLOCKED);
    assert.equal(result.effects, 0);
  }
});

test('empty operation key rejects with zero effects', () => {
  const changed = copy(byId.success);
  changed.decisions[0].operationKey = '   ';
  const result = runScenario(changed);
  assert.equal(result.terminal, TERMINALS.POLICY_BLOCKED);
  assert.equal(result.effects, 0);
});

test('practice variants demonstrate separate policy, budget, and approval controls', () => {
  const original = runScenario(practice);
  assert.equal(summary(original), 'practice: POLICY_BLOCKED | action write_receipt is not allowed by trusted policy | effects=0');
  const policyOnly = copy(practice);
  policyOnly.policy.allowedActions.push('write_receipt');
  assert.equal(runScenario(policyOnly).terminal, TERMINALS.BUDGET_EXHAUSTED);
  const budgetOnly = copy(practice);
  budgetOnly.limits.maxActions = 1;
  assert.equal(runScenario(budgetOnly).terminal, TERMINALS.POLICY_BLOCKED);
  const noApproval = copy(solution);
  noApproval.trustedApprovals = [];
  assert.equal(runScenario(noApproval).terminal, TERMINALS.POLICY_BLOCKED);
  const solved = runScenario(solution);
  assert.equal(solved.terminal, TERMINALS.COMPLETE);
  assert.equal(solved.effects, 1);
  assert.equal(solved.state.version, 2);
});

test('worked trace exactly equals the successful emitted result structure', () => {
  const expected = JSON.parse(fs.readFileSync(path.join(here, 'worked-trace.json'), 'utf8'));
  assert.deepEqual(runScenario(byId.success), expected);
});

test('all-scenario CLI output matches expected summary byte for byte', () => {
  const executed = spawnSync(process.execPath, ['controller.js', '--all'], { cwd: here, encoding: 'utf8' });
  assert.equal(executed.status, 0, executed.stderr);
  const expected = fs.readFileSync(path.join(here, 'expected-summary.txt'), 'utf8');
  assert.equal(executed.stdout, expected);
});
