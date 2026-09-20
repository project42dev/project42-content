'use strict';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function debateAgent(id, updates) {
  return {
    id,
    async respond(context) {
      const update = updates(context);
      return { position: update.position, artifact: update.artifact };
    }
  };
}

function correctedDebateAgents() {
  return [
    debateAgent('a', ({ round }) => round === 1
      ? { position: '42', artifact: '6 * 7 = 42' }
      : { position: '42', artifact: 'verified multiplication: 6 * 7 = 42' }),
    debateAgent('b', ({ round, peers }) => {
      if (round === 1) return { position: '41', artifact: 'initial arithmetic slip' };
      const peerSupports42 = peers.some((peer) => peer.position === '42');
      return peerSupports42
        ? { position: '42', artifact: 'verified multiplication: 6 * 7 = 42' }
        : { position: '41', artifact: 'unchanged' };
    }),
    debateAgent('c', ({ round }) => round === 1
      ? { position: '42', artifact: 'counted six groups of seven' }
      : { position: '42', artifact: 'verified multiplication: 6 * 7 = 42' })
  ];
}

function wrongDebateAgents() {
  return ['a', 'b', 'c'].map((id) => debateAgent(id, () => ({
    position: '41',
    artifact: 'shared but incorrect claim: 6 * 7 = 41'
  })));
}

function worker(id, delayMs, evidence, options = {}) {
  return {
    id,
    cost: options.cost ?? 1,
    async run({ tenant, revision }) {
      await sleep(delayMs);
      if (options.fail) throw new Error('fixture failure');
      return {
        workerId: options.claimedId ?? id,
        tenant: options.tenant ?? tenant,
        revision: options.revision ?? revision,
        evidence
      };
    }
  };
}

module.exports = {
  correctedDebateAgents,
  wrongDebateAgents,
  worker
};
