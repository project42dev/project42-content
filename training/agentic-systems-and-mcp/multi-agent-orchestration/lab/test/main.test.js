'use strict';

const assert = require('node:assert/strict');
const { selfConsistency, runDebate, runJoin } = require('../src/core');
const { correctedDebateAgents, wrongDebateAgents, worker } = require('../src/fixtures');

async function main() {
  let assertions = 0;
  const check = (actual, expected) => { assert.deepEqual(actual, expected); assertions += 1; };
  const expectThrow = (fn, text) => { assert.throws(fn, new RegExp(text)); assertions += 1; };
  const expectReject = async (promise, text) => { await assert.rejects(promise, new RegExp(text)); assertions += 1; };

  const majority = selfConsistency({ answerSet: ['yes', 'no', 'unclear'], samples: ['yes', 'yes', 'yes', 'yes', 'no', 'no', 'unclear'], acceptAt: 0.8, groundTruth: 'no' });
  check(majority.winner, 'yes'); check(majority.decision, 'escalate-low-agreement'); check(majority.externalValidation, 'incorrect');
  const tie = selfConsistency({ answerSet: ['a', 'b', 'c'], samples: ['a', 'a', 'b', 'b', 'c'], acceptAt: 0.8 });
  check(tie.winner, null); check(tie.decision, 'escalate-tie');
  const invalid = selfConsistency({ answerSet: ['yes', 'no'], samples: ['yes', 'yes', 'yes', 'yes', 'MAYBE'], acceptAt: 0.8, groundTruth: 'yes' });
  check(invalid.invalidSamples, ['MAYBE']); check(invalid.decision, 'escalate-invalid-output');
  expectThrow(() => selfConsistency({ answerSet: ['yes'], samples: ['yes'], acceptAt: NaN }), 'finite');

  const debateOptions = { prompt: 'Compute 6 * 7', maxRounds: 3, roundTimeoutMs: 100, overallTimeoutMs: 500, externalCheck: ({ position }) => position === '42' };
  const corrected = await runDebate({ agents: correctedDebateAgents(), ...debateOptions });
  check(corrected.rounds, 2); check(corrected.revisions, 3); check(corrected.externalValidation, 'correct');
  const wrong = await runDebate({ agents: wrongDebateAgents(), ...debateOptions });
  check(wrong.converged, true); check(wrong.externalValidation, 'incorrect');
  await expectReject(runDebate({ agents: [correctedDebateAgents()[0], correctedDebateAgents()[0]], ...debateOptions }), 'unique');

  const neverResolvingAgents = [
    { id: 'stuck-a', respond: () => new Promise(() => {}) },
    { id: 'stuck-b', respond: () => new Promise(() => {}) }
  ];
  await expectReject(runDebate({
    agents: neverResolvingAgents,
    prompt: 'This callback never settles',
    maxRounds: 1,
    roundTimeoutMs: 25,
    overallTimeoutMs: 25
  }), 'round-timeout');

  const joined = await runJoin({ workers: [worker('alpha', 20, 'A'), worker('beta', 2, 'B'), worker('gamma', 10, 'G')], requiredWorkerIds: ['alpha', 'beta', 'gamma'], tenant: 'tenant-7', revision: 'rev-3', input: { nested: { immutable: true } }, callBudget: 3, deadlineMs: 100 });
  check(joined.completionOrder, ['beta', 'gamma', 'alpha']); check(joined.merged.map((item) => item.workerId), ['alpha', 'beta', 'gamma']); check(joined.complete, true); check(joined.missingRequired, []);
  const stale = await runJoin({ workers: [worker('alpha', 1, 'A'), worker('beta', 2, 'B', { revision: 'old' })], requiredWorkerIds: ['alpha', 'beta'], tenant: 'tenant-7', revision: 'rev-3', input: {}, callBudget: 2, deadlineMs: 100 });
  check(stale.rejected, [{ workerId: 'beta', reason: 'revision-mismatch' }]); check(stale.complete, false);
  await expectReject(runJoin({ workers: [], requiredWorkerIds: [], tenant: '', revision: '', input: {}, callBudget: 0, deadlineMs: 0 }), 'workers');
  console.log(`PASS main regressions: ${assertions} assertions`);
}
main().catch((error) => { console.error(`FAIL main regressions: ${error.message}`); process.exitCode = 1; });
