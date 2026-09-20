import fs from 'node:fs/promises';
import {Host, approval} from './host-lib.mjs';

const policy = JSON.parse(await fs.readFile(new URL('./policy.broken.json', import.meta.url), 'utf8'));
const host = new Host(policy);
host.connect('issues');
try {
  await host.discover('issues');
  const args = {title: 'Learner repair', operationKey: 'learner-1'};
  const trustedApproval = approval('issues', 'tools/call', 'issues.create', args, 'learner-policy');
  const result = await host.operate('issues', 'tools/call', {name: 'issues.create', arguments: args}, trustedApproval);
  if (result.content?.[0]?.text !== 'created:Learner repair') throw new Error('unexpected tool result');
  console.log('PASS learner repair: exact structured issue-create approval accepted');
} catch (error) {
  console.error(`FAIL learner repair: ${error.code ?? error.name}: ${error.message}`);
  console.error('Repair only policy.broken.json; do not edit this test.');
  process.exitCode = 1;
} finally {
  await host.shutdown();
}
