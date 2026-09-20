import test from 'node:test';
import assert from 'node:assert/strict';
import { ClientSession } from '../src/host.mjs';
import { workspaceAllowed } from '../src/scope-policy.solution.mjs';

const capabilities = { tools: {}, resources: {} };

test('exact policy denies a valid but unauthorized workspace with zero effects', async () => {
  const session = new ClientSession({
    expectedIdentity: 'exercise',
    allowedWorkspaces: ['ws_aaaa'],
    scopeComparator: workspaceAllowed,
    serverConfig: { capabilities }
  });
  try {
    await session.initialize();
    const workspaceId = 'ws_aaaaaaaa';
    const title = 'Changed input boundary';
    const approval = session.approvalToken('create_training_draft', workspaceId, title);
    await assert.rejects(() => session.callDraft({ workspaceId, title, approval }), /Workspace denied/);
    assert.equal((await session.readDraftState()).drafts.length, 0);
  } finally {
    await session.close();
  }
});

test('exact allowed workspace still creates a meaningful receipt', async () => {
  const session = new ClientSession({ expectedIdentity: 'exercise-ok', allowedWorkspaces: ['ws_aaaa'], scopeComparator: workspaceAllowed, serverConfig: { capabilities } });
  try {
    await session.initialize();
    const title = 'Exact identity';
    const approval = session.approvalToken('create_training_draft', 'ws_aaaa', title);
    const result = await session.callDraft({ workspaceId: 'ws_aaaa', title, approval });
    assert.equal(result.receipt.receiptId, 'exercise-ok:1');
  } finally {
    await session.close();
  }
});
