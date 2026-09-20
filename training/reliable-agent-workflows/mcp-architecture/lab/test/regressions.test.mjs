import test from 'node:test';
import assert from 'node:assert/strict';
import cp from 'node:child_process';
import { syncBuiltinESMExports } from 'node:module';

const originalSpawn = cp.spawn;
const spawned = [];
cp.spawn = (...args) => {
  const child = originalSpawn(...args);
  spawned.push(child);
  return child;
};
syncBuiltinESMExports();

const { ClientSession, TeachingHost, MAX_QUARANTINED } = await import('../src/host.mjs');
const capabilities = { tools: {}, resources: {}, prompts: {} };

function makeSession(identity, workspace) {
  return new ClientSession({
    expectedIdentity: identity,
    allowedWorkspaces: [workspace],
    serverConfig: { capabilities }
  });
}

test('structured approval binding rejects a collision and produces zero effects', async () => {
  const alpha = makeSession('alpha', 'ws_aaaa');
  const beta = makeSession('alpha::create_training_draft|ws_aaaa|x', 'ws_bbbb');
  try {
    await Promise.all([alpha.initialize(), beta.initialize()]);
    const alphaTitle = 'x::create_training_draft|ws_bbbb|Other';
    const forged = alpha.approvalToken('create_training_draft', 'ws_aaaa', alphaTitle);
    const genuine = beta.approvalToken('create_training_draft', 'ws_bbbb', 'Other');
    assert.notEqual(forged, genuine);
    await assert.rejects(
      () => beta.callDraft({ workspaceId: 'ws_bbbb', title: 'Other', approval: forged }),
      /Missing or non-exact trusted approval/
    );
    assert.equal((await beta.readDraftState()).drafts.length, 0);
  } finally {
    await Promise.all([alpha.close(), beta.close()]);
  }
});

test('invalid second definition is rejected before any child is spawned', () => {
  const before = spawned.length;
  assert.throws(() => new TeachingHost([
    { expectedIdentity: 'valid-first', allowedWorkspaces: ['ws_aaaa'] },
    { expectedIdentity: 'invalid-second', allowedWorkspaces: [1] }
  ]), /allowedWorkspaces must contain valid workspace identities/);
  assert.equal(spawned.length - before, 0);
  assert.equal(spawned.slice(before).filter((child) => child.exitCode === null && child.signalCode === null).length, 0);
});

test('quarantine history is bounded at 64 entries and unknown IDs remain fatal', async () => {
  const session = makeSession('quarantine', 'ws_aaaa');
  try {
    for (let i = 0; i < MAX_QUARANTINED + 36; i += 1) {
      session.expired.set(i, { method: 'probe', expiresAt: Date.now() + 5000 });
      session.consume(`${JSON.stringify({ jsonrpc: '2.0', id: i, result: {} })}\n`);
    }
    assert.equal(session.quarantined.length, 64);
    session.quarantined[0].receivedAt = Date.now() - 6000;
    session.pruneQuarantined();
    assert.equal(session.quarantined.length, 63);

    const id = session.nextId++;
    let rejectPending;
    const pendingPromise = new Promise((resolve, reject) => {
      rejectPending = reject;
    });
    const timer = setTimeout(() => {
      session.pending.delete(id);
      rejectPending(new Error('regression probe timed out'));
    }, 5000);
    session.pending.set(id, {
      resolve: () => {},
      reject: rejectPending,
      timer,
      method: 'regression-probe'
    });

    const observedRejection = pendingPromise.catch((error) => error);
    session.consume(`${JSON.stringify({ jsonrpc: '2.0', id: 'never-requested', result: {} })}\n`);

    const error = await observedRejection;
    assert.equal(error.name, 'SessionFailure');
    assert.equal(error.message, 'Unmatched response ID');
    assert.equal(error.outcome, 'UNKNOWN');
    assert.equal(session.closed, true);
    assert.equal(session.pending.size, 0);
    await session.cleanupPromise;
    assert.ok(session.child.exitCode !== null || session.child.signalCode !== null);
  } finally {
    await session.close();
  }
});

test.after(() => {
  cp.spawn = originalSpawn;
  syncBuiltinESMExports();
  for (const child of spawned) {
    if (child.exitCode === null && child.signalCode === null) child.kill('SIGKILL');
  }
});
