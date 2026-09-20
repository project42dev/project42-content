'use strict';

const { selfConsistency, runDebate, runJoin } = require('./core');
const { correctedDebateAgents, wrongDebateAgents, worker } = require('./fixtures');
function voteLine(name, result) { console.log(`VOTE ${name}: winner=${result.winner === null ? 'null' : result.winner} agreement=${result.agreement.toFixed(3)} decision=${result.decision} external=${result.externalValidation}`); }
function failureText(items) { return items.map((item) => `${item.workerId}:${item.reason}`).join(','); }
async function main() {
  voteLine('majority', selfConsistency({ answerSet: ['yes', 'no', 'unclear'], samples: ['yes', 'yes', 'yes', 'yes', 'no', 'no', 'unclear'], acceptAt: 0.8, groundTruth: 'no' }));
  voteLine('tie', selfConsistency({ answerSet: ['a', 'b', 'c'], samples: ['a', 'a', 'b', 'b', 'c'], acceptAt: 0.8 }));
  voteLine('invalid', selfConsistency({ answerSet: ['yes', 'no'], samples: ['yes', 'yes', 'yes', 'yes', 'MAYBE'], acceptAt: 0.8, groundTruth: 'yes' }));
  voteLine('unanimous-wrong', selfConsistency({ answerSet: ['yes', 'no'], samples: ['yes', 'yes', 'yes', 'yes', 'yes'], acceptAt: 0.8, groundTruth: 'no' }));
  const options = { prompt: 'Compute 6 * 7', maxRounds: 3, roundTimeoutMs: 100, overallTimeoutMs: 500, externalCheck: ({ position }) => position === '42' };
  const corrected = await runDebate({ agents: correctedDebateAgents(), ...options });
  console.log(`DEBATE corrected: rounds=${corrected.rounds} converged=${corrected.converged} revisions=${corrected.revisions} final=${corrected.consensus.position} external=${corrected.externalValidation}`);
  const wrong = await runDebate({ agents: wrongDebateAgents(), ...options });
  console.log(`DEBATE unanimous-wrong: rounds=${wrong.rounds} converged=${wrong.converged} revisions=${wrong.revisions} final=${wrong.consensus.position} external=${wrong.externalValidation}`);
  const common = { requiredWorkerIds: ['alpha', 'beta', 'gamma'], tenant: 'tenant-7', revision: 'rev-3', input: { question: 'fixture' }, callBudget: 3, deadlineMs: 100 };
  const ordered = await runJoin({ ...common, workers: [worker('alpha', 30, 'A'), worker('beta', 5, 'B'), worker('gamma', 15, 'G')] });
  console.log(`JOIN ordered: completion=${ordered.completionOrder.join(',')} merged=${ordered.merged.map((x) => x.workerId).join(',')} complete=${ordered.complete} budgetUsed=${ordered.budgetUsed}`);
  const partial = await runJoin({ ...common, workers: [worker('alpha', 5, 'A'), worker('beta', 10, 'B', { fail: true }), worker('gamma', 15, 'G')] });
  console.log(`JOIN partial: completion=${partial.completionOrder.join(',')} merged=${partial.merged.map((x) => x.workerId).join(',')} complete=${partial.complete} missing=${partial.missingRequired.join(',')} failures=${failureText(partial.failures)}`);
  const rejected = await runJoin({ ...common, workers: [worker('alpha', 5, 'A'), worker('beta', 10, 'B', { claimedId: 'delta' }), worker('gamma', 15, 'G')] });
  console.log(`JOIN rejected: complete=${rejected.complete} rejected=${failureText(rejected.rejected)}`);
  const budget = await runJoin({ ...common, callBudget: 2, workers: [worker('alpha', 5, 'A'), worker('beta', 10, 'B'), worker('gamma', 15, 'G')] });
  console.log(`JOIN budget: complete=${budget.complete} missing=${budget.missingRequired.join(',')} failures=${failureText(budget.failures)} budgetUsed=${budget.budgetUsed}`);
  const deadline = await runJoin({ ...common, deadlineMs: 25, workers: [worker('alpha', 5, 'A'), worker('beta', 10, 'B'), worker('gamma', 60, 'G')] });
  console.log(`JOIN deadline: complete=${deadline.complete} missing=${deadline.missingRequired.join(',')} failures=${failureText(deadline.failures)}`);
}
main().catch((error) => { console.error(error.stack || error.message); process.exitCode = 1; });
