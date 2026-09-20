const authority = (role, actions, principal = role) => ({tenant: 'civic-lab', role, principal, allowedActions: actions});
const contractsFor = dependsOn => Object.fromEntries(dependsOn.map(id => [id, `${id}.v1`]));

export const node = (id, fixture, dependsOn, role, actions, extra = {}) => ({
  id,
  fixture,
  dependsOn,
  dependencyContracts: contractsFor(dependsOn),
  role,
  principal: role,
  authority: authority(role, actions),
  reserve: 3,
  attemptCap: 1,
  timeoutMs: 60,
  inputVersion: 'proposal.v1',
  outputVersion: `${id}.v1`,
  required: true,
  ...extra
});

export const base = (id, pattern, nodes, extra = {}) => ({id, pattern, owner: 'parent', inputVersion: 'proposal.v1', outputVersion: 'decision.v1', totalBudget: 30, concurrency: 3, failureTerminal: 'escalation', nodes, ...extra});

export const input = {tenant: 'civic-lab', revision: 4, title: 'Require signed deployment records', risk: 'high', researchDelayMs: 14, badReply: 'Draft omits required controls.'};

export const directGraph = base('direct-proposal', 'direct', [
  node('direct', 'direct', [], 'parent', ['publish'], {final: true, outputVersion: 'decision.v1'})
], {concurrency: 1});

export const sequentialGraph = base('sequential-proposal', 'sequential', [
  node('draft', 'draft', [], 'writer', ['draft']),
  node('validate', 'validate', ['draft'], 'validator', ['validate']),
  node('parent', 'manager', ['validate'], 'parent', ['approve'], {final: true, outputVersion: 'decision.v1'})
], {concurrency: 1});

const routeBranches = {specialist: 'specialistWorker', direct: 'directWorker'};
export const routerGraph = base('router-proposal', 'router', [
  node('classify', 'classify', [], 'router', []),
  node('specialistWorker', 'specialistWorker', ['classify'], 'security-specialist', ['read'], {routeValue: 'specialist'}),
  node('directWorker', 'directWorker', ['classify'], 'generalist', ['read'], {routeValue: 'direct'}),
  node('parent', 'routerJoin', ['classify', 'specialistWorker', 'directWorker'], 'parent', ['approve'], {final: true, outputVersion: 'decision.v1', routeBranches})
], {concurrency: 1, routing: {classifier: 'classify', branches: routeBranches}});

export const managerGraph = base('manager-proposal', 'manager', [
  node('research', 'research', [], 'researcher', ['read']),
  node('parent', 'manager', ['research'], 'parent', ['approve'], {final: true, outputVersion: 'decision.v1'})
]);

export const handoffGraph = base('handoff-proposal', 'handoff', [
  node('handoff', 'handoff', [], 'parent', ['transfer'], {handoff: {transition: 'transfer', from: 'parent', to: 'security-specialist', acceptanceContract: 'handoff-acceptance.v1'}}),
  node('specialist', 'specialistReturn', ['handoff'], 'security-specialist', ['return'], {handoff: {transition: 'return', from: 'security-specialist', to: 'parent', acceptanceContract: 'handoff-return.v1'}}),
  node('parent', 'manager', ['specialist'], 'parent', ['approve'], {final: true, outputVersion: 'decision.v1'})
], {concurrency: 1});

export const parallelGraph = base('parallel-proposal', 'parallel', [
  node('research', 'research', [], 'researcher', ['read']),
  node('review', 'review', [], 'reviewer', ['read']),
  node('validate', 'validate', [], 'validator', ['validate']),
  node('style', 'optionalStyle', [], 'style-reviewer', ['read'], {required: false}),
  node('parent', 'parent', ['research', 'review', 'validate'], 'parent', ['approve'], {final: true, outputVersion: 'decision.v1'})
]);

export const evaluatorGraph = base('evaluator-proposal', 'evaluator', [
  node('evaluate', 'evaluateArtifact', [], 'parent', ['approve'], {outputVersion: 'evaluation.v1'}),
  node('revise', 'reviseArtifact', [], 'writer', ['revise'], {outputVersion: 'artifact.v1'})
], {concurrency: 1, loop: {evaluator: 'evaluate', reviser: 'revise', criteria: ['signed release records', 'verified rollback owner'], maxRevisions: 2, deadlineMs: 200}});

export const allGraphs = [directGraph, sequentialGraph, routerGraph, managerGraph, handoffGraph, parallelGraph, evaluatorGraph];
