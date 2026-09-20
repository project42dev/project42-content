const result = (kind, revision, contract, cost, actions, extra = {}) => ({kind, revision, contract, cost, actions, ...extra});

export function delay(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(signal.reason ?? new Error('aborted'));
    const timer = setTimeout(resolve, ms);
    const abort = () => {
      clearTimeout(timer);
      reject(signal.reason ?? new Error('aborted'));
    };
    signal?.addEventListener('abort', abort, {once: true});
  });
}

async function after(ms, signal, value) {
  await delay(ms, signal);
  return value;
}

export const fixtures = {
  direct: ({input, revision, node, signal}) => after(2, signal, result('final', revision, node.outputVersion, 1, ['publish'], {approved: true, summary: input.title})),
  classify: ({input, revision, node, signal}) => after(2, signal, result('route', revision, node.outputVersion, 1, [], {route: input.risk === 'high' ? 'specialist' : 'direct'})),
  specialistWorker: ({revision, node, signal}) => after(5, signal, result('evidence', revision, node.outputVersion, 2, ['read'], {route: 'specialist', finding: 'Require specialist provenance review.'})),
  directWorker: ({revision, node, signal}) => after(2, signal, result('evidence', revision, node.outputVersion, 1, ['read'], {route: 'direct', finding: 'Standard controls are sufficient.'})),
  routerJoin: ({dependencies, revision, node, signal}) => {
    const route = dependencies.classify?.route;
    const workerId = node.routeBranches?.[route];
    const selected = workerId ? dependencies[workerId] : undefined;
    const approved = typeof route === 'string' && selected?.kind === 'evidence' && selected.route === route;
    return after(2, signal, result('final', revision, node.outputVersion, 2, ['approve'], {approved, selectedRoute: route, selectedWorker: workerId, aggregation: approved ? ['classify', workerId] : []}));
  },
  draft: ({input, revision, node, signal}) => after(4, signal, result('artifact', revision, node.outputVersion, 2, ['draft'], {text: `${input.title}: require signed release records`})),
  research: ({input, revision, node, signal}) => after(input.researchDelayMs ?? 14, signal, result('evidence', revision, node.outputVersion, 2, ['read'], {claim: 'Fictional fixture evidence for provenance checks.', source: 'fixture:R-17'})),
  review: ({revision, node, signal}) => after(4, signal, result('evidence', revision, node.outputVersion, 2, ['read'], {risk: 'Rollback ownership must be explicit.'})),
  validate: ({revision, node, signal}) => after(8, signal, result('evidence', revision, node.outputVersion, 1, ['validate'], {tests: ['signature-required', 'rollback-owner-required'], passed: true})),
  optionalStyle: ({revision, node, signal}) => after(18, signal, result('evidence', revision, node.outputVersion, 1, ['read'], {style: 'plain-language'})),
  parent: ({dependencies, revision, node, signal}) => {
    const required = ['research', 'review', 'validate'];
    const complete = required.every(id => dependencies[id]?.kind === 'evidence');
    return after(2, signal, result('final', revision, node.outputVersion, 2, ['approve'], {approved: complete, aggregation: Object.keys(dependencies).sort()}));
  },
  manager: ({dependencies, revision, node, signal}) => {
    const entries = Object.entries(dependencies);
    const complete = entries.length > 0 && entries.every(([, value]) => value && typeof value.kind === 'string');
    return after(2, signal, result('final', revision, node.outputVersion, 2, ['approve'], {approved: complete, aggregation: entries.map(([id]) => id).sort()}));
  },
  handoff: ({revision, node, signal}) => after(2, signal, result('handoff', revision, node.outputVersion, 1, ['transfer'], {transition: 'transfer', accepted: true, acceptanceContract: node.handoff.acceptanceContract, from: node.handoff.from, to: node.handoff.to})),
  specialistReturn: ({revision, node, signal}) => after(3, signal, result('handoff', revision, node.outputVersion, 1, ['return'], {transition: 'return', accepted: true, acceptanceContract: node.handoff.acceptanceContract, from: node.handoff.from, to: node.handoff.to, recommendation: 'Require signatures'})),
  evaluateArtifact: ({revision, node, signal, artifact, artifactRevision, criteria}) => {
    const unmet = criteria.filter(criterion => !artifact.includes(criterion));
    const approved = unmet.length === 0;
    const feedback = approved ? 'All configured criteria are present.' : `Add the following unmet criteria: ${unmet.join(', ')}`;
    return after(2, signal, result('review', revision, node.outputVersion, 1, approved ? ['approve'] : [], {approved, unmet, feedback, artifactRevision}));
  },
  reviseArtifact: ({revision, node, signal, artifact, artifactRevision, feedback}) => {
    const addition = feedback?.unmet?.[0];
    const revised = addition ? `${artifact} ${addition}.`.trim() : artifact;
    return after(3, signal, result('artifact', revision, node.outputVersion, 2, ['revise'], {artifact: revised, fromArtifactRevision: artifactRevision, artifactRevision: artifactRevision + 1, appliedFeedback: addition ?? null}));
  },
  hostileApproval: ({revision, node, signal}) => after(2, signal, result('evidence', revision, node.outputVersion, 1, ['read'], {approved: true})),
  stale: ({revision, node, signal}) => after(2, signal, result('evidence', revision - 1, node.outputVersion, 1, ['read'])),
  timeout: ({revision, node, signal}) => after(node.timeoutMs + 20, signal, result('evidence', revision, node.outputVersion, 1, ['read'])),
  never: () => new Promise(() => {}),
  flaky: async ({revision, node, attempt, signal}) => {
    await delay(2, signal);
    if (attempt === 1) throw new Error('deterministic first-attempt failure');
    return result('evidence', revision, node.outputVersion, 1, ['read'], {attempt});
  },
  fail: async ({signal}) => {
    await delay(3, signal);
    throw new Error('deterministic required failure');
  },
  conflictA: ({revision, node, signal}) => after(3, signal, result('evidence', revision, node.outputVersion, 1, ['write'], {writeKey: 'proposal', value: 'A'})),
  conflictB: ({revision, node, signal}) => after(6, signal, result('evidence', revision, node.outputVersion, 1, ['write'], {writeKey: 'proposal', value: 'B'}))
};
