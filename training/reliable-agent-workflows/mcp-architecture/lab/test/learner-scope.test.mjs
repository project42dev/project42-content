import test from 'node:test';
import assert from 'node:assert/strict';
import { ClientSession } from '../src/host.mjs';
import { workspaceAllowed } from '../src/scope-policy.broken.mjs';

const capabilities = { tools: {}, resources: {} };

test('broken prefix policy must deny a valid but unauthorized workspace with zero effects', async () => {
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
    let denied = false;
    try {
      await session.callDraft({ workspaceId, title, approval });
    } catch (error) {
      denied = /Workspace denied/.test(error.message);
    }
    const state = await session.readDraftState();
    assert.equal(denied, true, 'unauthorized valid workspace must be denied by the actual host call');
    assert.equal(state.drafts.length, 0, 'denial must have zero server effects');
  } finally {
    await session.close();
  }
});
