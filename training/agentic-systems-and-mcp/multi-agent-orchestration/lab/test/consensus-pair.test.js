'use strict';

const assert = require('node:assert/strict');
const { runDebate } = require('../src/core.js');

const roundOptions = {
  prompt: 'Compare the position and artifact fields.',
  maxRounds: 1,
  roundTimeoutMs: 1000,
  overallTimeoutMs: 1000
};

function fixedAgents(states) {
  return states.map((state, index) => ({
    id: `agent-${index + 1}`,
    respond: async () => state
  }));
}

async function run() {
  // Worked example and negative case:
  // Pair A is { position: 'a\\u0000b', artifact: 'c' }.
  // Pair B is { position: 'a', artifact: 'b\\u0000c' }.
  // A legacy position + NUL + artifact signature makes both strings
  // "a\\u0000b\\u0000c", but the structured pairs are different.
  const nul = '\u0000';
  const distinct = await runDebate({
    ...roundOptions,
    agents: fixedAgents([
      { position: `a${nul}b`, artifact: 'c' },
      { position: 'a', artifact: `b${nul}c` }
    ])
  });

  assert.equal(
    distinct.converged,
    false,
    'Expected non-convergence: position and artifact differ even though separator concatenation collides'
  );
  assert.equal(
    distinct.consensus,
    null,
    'Expected no consensus when the final structured pairs are distinct'
  );
  assert.deepEqual(distinct.finalStates, [
    { id: 'agent-1', position: `a${nul}b`, artifact: 'c' },
    { id: 'agent-2', position: 'a', artifact: `b${nul}c` }
  ], 'Expected both original NUL-containing fields to be preserved');

  // Positive case: identical pairs, including NUL-containing strings, still
  // converge. This checks that the repair compares values rather than
  // rejecting or narrowing meaningful input.
  const identicalPair = { position: `claim${nul}part`, artifact: `result${nul}part` };
  const identical = await runDebate({
    ...roundOptions,
    agents: fixedAgents([identicalPair, identicalPair])
  });

  assert.equal(identical.converged, true, 'Expected convergence for identical position and artifact fields');
  assert.deepEqual(identical.consensus, {
    id: 'agent-1',
    ...identicalPair
  }, 'Expected the first identical final state as consensus');
  assert.deepEqual(identical.finalStates, [
    { id: 'agent-1', ...identicalPair },
    { id: 'agent-2', ...identicalPair }
  ], 'Expected identical final states to remain ordered and intact');

  console.log('PASS: distinct structured pairs do not converge; identical pairs converge; NUL data is preserved');
}

run().catch((error) => {
  console.error('FAIL: consensus pair equality regression');
  console.error(error);
  process.exitCode = 1;
});
