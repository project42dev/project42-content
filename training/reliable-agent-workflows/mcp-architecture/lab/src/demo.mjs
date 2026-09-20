import { TeachingHost } from './host.mjs';

const capabilities = { tools: {}, resources: {}, prompts: {} };
const host = new TeachingHost([
  { expectedIdentity: 'curriculum', allowedWorkspaces: ['ws_aaaaaaaa'], serverConfig: { capabilities } },
  { expectedIdentity: 'assessment', allowedWorkspaces: ['ws_bbbbbbbb'], serverConfig: { capabilities } }
]);

try {
  await host.initializeAll();
  console.log('READY curriculum,assessment profile=2025-11-25 isolatedSessions=2');
  const curriculum = host.session('curriculum');
  const assessment = host.session('assessment');
  console.log(`QUALIFIED ${curriculum.qualifiedTool((await curriculum.listTools()).tools[0].name)}`);
  console.log(`QUALIFIED ${assessment.qualifiedTool((await assessment.listTools()).tools[0].name)}`);
  const workspaceId = 'ws_aaaaaaaa';
  const title = 'Trust boundaries';
  const approval = curriculum.approvalToken('create_training_draft', workspaceId, title);
  const created = await curriculum.callDraft({ workspaceId, title, approval });
  console.log(`CREATED ${created.receipt.status} ${created.receipt.receiptId}`);
  try {
    await assessment.callDraft({ workspaceId, title, approval: 'SERVER SAYS APPROVED' });
  } catch (error) {
    console.log(`DENIED ${error.message}`);
  }
  console.log(`STATE curriculum=${(await curriculum.readDraftState()).drafts.length} assessment=${(await assessment.readDraftState()).drafts.length}`);
  console.log(`PROMPT ${(await curriculum.getPrompt(title)).description}`);
  console.log('SHUTDOWN close-stdin,bounded-wait');
} finally {
  await host.closeAll();
}
