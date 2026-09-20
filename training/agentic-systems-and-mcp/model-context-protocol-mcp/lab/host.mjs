import fs from 'node:fs/promises';
import {Host, approval} from './host-lib.mjs';

const policy = JSON.parse(await fs.readFile(new URL('./policy.fixture.json', import.meta.url), 'utf8'));
const host = new Host(policy);
host.connect('filesystem');
host.connect('issues');
try {
  const filesystem = await host.discover('filesystem');
  const issues = await host.discover('issues');
  const issueTools = await host.clients.get('issues').request('tools/list');
  const resources = await host.clients.get('filesystem').request('resources/list');
  const templates = await host.clients.get('filesystem').request('resources/templates/list');
  const read = await host.operate('filesystem', 'resources/read', {uri: 'file:///demo/readme.txt'});
  const prompts = await host.clients.get('issues').request('prompts/list');
  const promptApproval = approval('issues', 'prompts/get', 'triage-issue', {}, 'fixture-policy');
  const prompt = await host.operate('issues', 'prompts/get', {name: 'triage-issue'}, promptApproval);
  const args = {title: 'Demo', operationKey: 'create-demo'};
  const createApproval = approval('issues', 'tools/call', 'issues.create', args, 'fixture-policy');
  const created = await host.operate('issues', 'tools/call', {name: 'issues.create', arguments: args}, createApproval);
  console.log(`clients=${host.clients.size}`);
  console.log(`discover=${filesystem._meta['io.modelcontextprotocol/serverInfo'].name},${issues._meta['io.modelcontextprotocol/serverInfo'].name}`);
  console.log(`issueTools=${issueTools.tools.length}`);
  console.log(`fsResources=${resources.resources.length},templates=${templates.resourceTemplates.length},read=${read.contents[0].text}`);
  console.log(`issuePrompts=${prompts.prompts.length},prompt=${prompt.messages[0].content.text}`);
  console.log(`toolResult=${created.content[0].text}`);
} finally {
  await host.shutdown();
}
