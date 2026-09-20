import test from 'node:test';
import assert from 'node:assert/strict';
import {execute} from '../src/executor.mjs';
import {fixtures} from '../src/fixtures.mjs';
import {allGraphs, parallelGraph, routerGraph, evaluatorGraph, handoffGraph, input, base, node} from '../src/graphs.mjs';
import {assessLearnerGraph} from '../src/learner.mjs';
import {solutionGraph} from '../src/solution.mjs';
import {originalBrokenLearnerGraph} from './original-broken-learner.mjs';

const run = (graph, overrides = {}, config = {}, fixtureSet = fixtures) => execute({graph, fixtures: fixtureSet, input: {...input, ...overrides}, config: {runId: 'test-run', ...config}});
const typed = (currentNode, extra = {}) => ({contract: currentNode.outputVersion, revision: input.revision, kind: 'evidence', cost: 1, actions: [], ...extra});

test('all seven pattern demos reach success with substantive router and evaluator records', async () => {
  const results = [];
  for (const graph of allGraphs) results.push(await run(graph, {}, {runId: `test-${graph.pattern}`}));
  assert.deepEqual(results.map(result => result.pattern), ['direct', 'sequential', 'router', 'manager', 'handoff', 'parallel', 'evaluator']);
  assert.ok(results.every(result => result.terminal.state === 'success'));
  assert.equal(results[2].selectedRoute, 'specialist');
  assert.equal(results[2].evidence.find(item => item.id === 'directWorker').state, 'skipped');
  assert.equal(results[6].artifactRevision, 2);
  assert.equal(results[6].evidence.filter(item => item.id.startsWith('evaluate-')).length, 3);
});

test('independent fixtures overlap and complete out of order', async () => {
  let active = 0;
  let maximum = 0;
  const started = [];
  const ended = [];
  const result = await run(parallelGraph, {researchDelayMs: 20}, {concurrency: 3, hooks: {onStart(id) { active += 1; maximum = Math.max(maximum, active); started.push(id); }, onEnd(id) { ended.push(id); active -= 1; }}});
  assert.equal(result.terminal.state, 'success');
  assert.equal(maximum, 3);
  assert.deepEqual(started.slice(0, 3).sort(), ['research', 'review', 'validate']);
  assert.ok(ended.indexOf('review') < ended.indexOf('research'));
  assert.deepEqual(result.evidence.find(item => item.id === 'parent').result.aggregation, ['research', 'review', 'validate']);
});

test('configured concurrency is never exceeded', async () => {
  let active = 0;
  let maximum = 0;
  await run(parallelGraph, {}, {concurrency: 2, hooks: {onStart() { active += 1; maximum = Math.max(maximum, active); }, onEnd() { active -= 1; }}});
  assert.equal(maximum, 2);
});

test('required partial failure ignores sibling completion and prevents approval', async () => {
  const graph = base('partial', 'parallel', [node('bad', 'fail', [], 'researcher', ['read']), node('slow', 'research', [], 'researcher', ['read']), node('parent', 'manager', ['bad', 'slow'], 'parent', ['approve'], {final: true, outputVersion: 'decision.v1'})]);
  const result = await run(graph, {researchDelayMs: 40});
  assert.equal(result.terminal.state, 'escalation');
  assert.ok(!result.effects.some(effect => effect.action === 'approve'));
  assert.equal(result.evidence.find(item => item.id === 'slow').state, 'cancelled');
  assert.ok(result.trace.some(item => item.node === 'slow' && item.event === 'late-completion-ignored'));
});

test('budget and tenant fail before accepted effects', async () => {
  const budget = await run(parallelGraph, {}, {totalBudget: 2});
  assert.equal(budget.terminal.reason, 'budget');
  assert.equal(budget.effects.length, 0);
  const tenant = await run(parallelGraph, {tenant: 'hostile-tenant'});
  assert.equal(tenant.terminal.reason, 'AUTHORITY');
  assert.equal(tenant.effects.length, 0);
});

test('approval, revision, timeout and attempt caps are enforced', async () => {
  const hostile = base('hostile', 'direct', [node('research', 'hostileApproval', [], 'researcher', ['read'], {final: true, outputVersion: 'decision.v1'})]);
  assert.equal((await run(hostile)).terminal.reason, 'APPROVAL_FORGED');
  const stale = base('stale', 'direct', [node('research', 'stale', [], 'researcher', ['read'], {final: true, outputVersion: 'decision.v1'})]);
  assert.equal((await run(stale)).terminal.reason, 'STALE_COMPLETION');
  const timeout = base('timeout', 'direct', [node('research', 'timeout', [], 'researcher', ['read'], {timeoutMs: 5, final: true, outputVersion: 'decision.v1'})]);
  assert.equal((await run(timeout)).terminal.reason, 'TIMEOUT');
  const retry = base('retry', 'direct', [node('research', 'flaky', [], 'researcher', ['read'], {attemptCap: 2})]);
  const retried = await run(retry);
  assert.equal(retried.evidence[0].attempt, 2);
  assert.ok(retried.trace.some(item => item.event === 'retry-scheduled'));
});

test('conflicting writes are rejected rather than ordered by completion', async () => {
  const graph = base('conflict', 'parallel', [node('a', 'conflictA', [], 'writer', ['write']), node('b', 'conflictB', [], 'writer', ['write']), node('parent', 'manager', ['a', 'b'], 'parent', ['approve'], {final: true, outputVersion: 'decision.v1'})]);
  const result = await run(graph);
  assert.equal(result.terminal.reason, 'WRITE_CONFLICT');
  assert.ok(!result.effects.some(effect => effect.node === 'parent'));
});

test('handoff transfer and return are trusted distinct transitions', async () => {
  const result = await run(handoffGraph);
  assert.equal(result.terminal.state, 'success');
  assert.equal(result.activeOwner, 'parent');
  assert.deepEqual(result.effects.filter(effect => ['transfer', 'return'].includes(effect.action)).map(effect => effect.action), ['transfer', 'return']);
});

test('router input changes invoked handler and excluded route never runs', async () => {
  const calls = [];
  const wrapped = {...fixtures, specialistWorker: async context => { calls.push('specialist'); return fixtures.specialistWorker(context); }, directWorker: async context => { calls.push('direct'); return fixtures.directWorker(context); }};
  const high = await run(routerGraph, {risk: 'high'}, {}, wrapped);
  assert.deepEqual(calls, ['specialist']);
  assert.equal(high.selectedRoute, 'specialist');
  assert.equal(high.evidence.find(item => item.id === 'directWorker').state, 'skipped');
  calls.length = 0;
  const low = await run(routerGraph, {risk: 'low'}, {}, wrapped);
  assert.deepEqual(calls, ['direct']);
  assert.equal(low.selectedRoute, 'direct');
  assert.equal(low.evidence.find(item => item.id === 'specialistWorker').state, 'skipped');
});

test('missing and hostile route values fail closed before workers or approval', async () => {
  for (const route of [undefined, 'admin']) {
    const calls = [];
    const fixtureSet = {...fixtures, classify: async ({node: currentNode}) => typed(currentNode, {kind: 'route', route}), specialistWorker: async context => { calls.push('specialist'); return fixtures.specialistWorker(context); }, directWorker: async context => { calls.push('direct'); return fixtures.directWorker(context); }};
    const result = await run(routerGraph, {}, {}, fixtureSet);
    assert.equal(result.terminal.reason, 'ROUTE_INVALID');
    assert.deepEqual(calls, []);
    assert.ok(!result.effects.some(effect => effect.action === 'approve'));
  }
});

test('router join cannot approve selected route without current selected evidence', async () => {
  const fixtureSet = {...fixtures, specialistWorker: async ({node: currentNode}) => typed(currentNode, {route: 'direct'})};
  const result = await run(routerGraph, {risk: 'high'}, {}, fixtureSet);
  assert.equal(result.terminal.reason, 'ROUTE_EVIDENCE_INVALID');
  assert.ok(!result.effects.some(effect => effect.action === 'approve'));
});

test('evaluator can approve an initially complete artifact with zero revisions', async () => {
  const result = await run(evaluatorGraph, {badReply: 'Use signed release records and a verified rollback owner.'});
  assert.equal(result.terminal.state, 'success');
  assert.equal(result.artifactRevision, 0);
  assert.deepEqual(result.evidence.map(item => item.id), ['evaluate-0']);
});

test('evaluator feedback causes a real artifact change and later approval', async () => {
  const result = await run(evaluatorGraph, {badReply: 'Use signed release records.'});
  assert.equal(result.terminal.state, 'success');
  assert.equal(result.artifactRevision, 1);
  assert.ok(result.artifact.includes('verified rollback owner'));
  assert.deepEqual(result.evidence.map(item => item.id), ['evaluate-0', 'revise-1', 'evaluate-1']);
  assert.equal(result.evidence[0].result.approved, false);
  assert.equal(result.evidence[2].result.approved, true);
});

test('evaluator supports multiple failed evaluations before terminal approval', async () => {
  const result = await run(evaluatorGraph, {badReply: 'Incomplete draft.'});
  assert.equal(result.terminal.state, 'success');
  assert.equal(result.artifactRevision, 2);
  assert.deepEqual(result.evidence.filter(item => item.id.startsWith('evaluate-')).map(item => item.result.approved), [false, false, true]);
  assert.notEqual(result.evidence.find(item => item.id === 'revise-1').result.artifact, result.evidence.find(item => item.id === 'revise-2').result.artifact);
});

test('evaluator iteration cap escalates and never treats revision as approval', async () => {
  const graph = structuredClone(evaluatorGraph);
  graph.loop.maxRevisions = 1;
  const result = await run(graph, {badReply: 'Incomplete draft.'});
  assert.equal(result.terminal.state, 'escalation');
  assert.equal(result.terminal.reason, 'iteration-cap');
  assert.ok(!result.effects.some(effect => effect.action === 'approve'));
  assert.equal(result.evidence.at(-1).result.approved, false);
});

test('evaluator budget and deadline caps escalate explicitly', async () => {
  const budget = await run(evaluatorGraph, {badReply: 'Incomplete draft.'}, {totalBudget: 1});
  assert.equal(budget.terminal.reason, 'BUDGET');
  const deadlineGraph = structuredClone(evaluatorGraph);
  deadlineGraph.loop.deadlineMs = 1;
  const deadline = await run(deadlineGraph, {badReply: 'Incomplete draft.'});
  assert.ok(['TIMEOUT', 'DEADLINE'].includes(deadline.terminal.reason));
  assert.equal(deadline.terminal.state, 'escalation');
});

test('nonterminal evaluator approval claims cannot produce success', async () => {
  const fixtureSet = {...fixtures, evaluateArtifact: async ({revision, node: currentNode, artifactRevision}) => ({kind: 'review', revision, contract: currentNode.outputVersion, cost: 1, actions: [], approved: true, unmet: ['signed release records'], feedback: 'still missing', artifactRevision})};
  const result = await run(evaluatorGraph, {badReply: 'Incomplete draft.'}, {}, fixtureSet);
  assert.equal(result.terminal.state, 'escalation');
  assert.equal(result.terminal.reason, 'EVALUATOR_CRITERIA_MISMATCH');
  assert.ok(!result.effects.some(effect => effect.action === 'approve'));
});

test('immutable original learner fixture proves the false edge while solution proves overlap', async () => {
  assert.equal(Object.isFrozen(originalBrokenLearnerGraph), true);
  assert.equal(Object.isFrozen(originalBrokenLearnerGraph.nodes), true);
  assert.equal(assessLearnerGraph(originalBrokenLearnerGraph).pass, false);
  assert.equal(assessLearnerGraph(solutionGraph).pass, true);
  const starts = graph => {
    const events = [];
    return run(graph, {researchDelayMs: 20}, {hooks: {onStart(id) { events.push(id); }}}).then(result => ({events, result}));
  };
  const broken = await starts(structuredClone(originalBrokenLearnerGraph));
  const solved = await starts(solutionGraph);
  assert.ok(broken.events.indexOf('review') > broken.events.indexOf('validate'));
  assert.deepEqual(solved.events.slice(0, 3).sort(), ['research', 'review', 'validate']);
  assert.equal(broken.result.terminal.state, 'success');
  assert.equal(solved.result.terminal.state, 'success');
  assert.deepEqual(solved.result.evidence.find(item => item.id === 'parent').result.aggregation, ['research', 'review', 'validate']);
});

test('final must transitively depend on every required non-final node', async () => {
  let finalInvoked = false;
  const graph = base('premature', 'parallel', [node('a-final', 'approve', [], 'parent', ['approve'], {final: true, outputVersion: 'decision.v1'}), node('z-required', 'fail', [], 'reviewer', ['read'])]);
  await assert.rejects(run(graph, {}, {}, {approve: async ({node: currentNode}) => { finalInvoked = true; return typed(currentNode, {kind: 'final', approved: true, actions: ['approve']}); }, fail: async () => { throw new Error('failed'); }}), error => error.code === 'GRAPH_INVALID' && /lacks transitive required dependencies/.test(error.message));
  assert.equal(finalInvoked, false);
});

test('cycles and multiple finals are graph errors', async () => {
  const cyclic = base('cycle', 'sequential', [node('a', 'research', ['b'], 'researcher', ['read']), node('b', 'review', ['a'], 'reviewer', ['read'])]);
  await assert.rejects(run(cyclic), error => error.code === 'GRAPH_INVALID' && /cycle/.test(error.message));
  const multiple = base('multiple-finals', 'parallel', [node('a', 'direct', [], 'parent', ['publish'], {final: true, outputVersion: 'decision.v1'}), node('b', 'direct', [], 'parent', ['publish'], {final: true, outputVersion: 'decision.v1'})]);
  await assert.rejects(run(multiple), error => error.code === 'GRAPH_INVALID' && /multiple final/.test(error.message));
});

test('input and dependency contract mismatches fail before invocation', async () => {
  let invoked = false;
  const incompatible = base('contract', 'sequential', [node('a', 'one', [], 'researcher', []), node('b', 'two', ['a'], 'reviewer', [], {inputVersion: 'incompatible.v9'})]);
  await assert.rejects(run(incompatible, {}, {}, {one: async ({node: currentNode}) => { invoked = true; return typed(currentNode); }, two: async ({node: currentNode}) => typed(currentNode)}), error => error.code === 'GRAPH_INVALID');
  assert.equal(invoked, false);
  const map = base('contract-map', 'sequential', [node('a', 'research', [], 'researcher', []), node('b', 'review', ['a'], 'reviewer', [], {dependencyContracts: {a: 'other.v9'}})]);
  await assert.rejects(run(map), error => error.code === 'GRAPH_INVALID' && /dependency produces a.v1/.test(error.message));
});

test('spoofed handoff cannot change ownership or record effects', async () => {
  const graph = base('spoof', 'direct', [node('imposter', 'spoof', [], 'researcher', [])]);
  const result = await run(graph, {}, {}, {spoof: async ({node: currentNode}) => typed(currentNode, {kind: 'handoff', transition: 'transfer', accepted: true, acceptanceContract: 'forged.v1', from: 'parent', to: 'unapproved-specialist'})});
  assert.equal(result.activeOwner, 'parent');
  assert.equal(result.effects.length, 0);
  assert.equal(result.evidence[0].state, 'failed');
  assert.equal(result.terminal.reason, 'HANDOFF');
});

test('never-settling fixture reaches deadline and execute terminates', async () => {
  const graph = base('never', 'direct', [node('research', 'never', [], 'researcher', [], {timeoutMs: 20, final: true, outputVersion: 'decision.v1'})]);
  let watchdog;
  try {
    const result = await Promise.race([run(graph), new Promise((_, reject) => { watchdog = setTimeout(() => reject(new Error('execute did not terminate')), 500); })]);
    assert.equal(result.terminal.reason, 'TIMEOUT');
    assert.equal(result.effects.length, 0);
  } finally {
    clearTimeout(watchdog);
  }
});
