import { readFile } from 'node:fs/promises';
import { basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseEvidence } from './schema.js';
import { assess } from './policy.js';

export async function run(path) {
  const raw = await readFile(path, 'utf8');
  const evidence = parseEvidence(JSON.parse(raw));
  const result = assess(evidence);
  console.log(`fixture=${basename(path)}`);
  console.log(`readyCapacity=${result.readyCapacity} nominalCapacity=${result.nominalCapacity} demand=${evidence.demand} queueLimit=${evidence.queueLimit}`);
  console.log(`admission=${result.admission} decision=${result.decision}`);
  console.log(`causes=${result.causes.length === 0 ? 'none' : result.causes.join(',')}`);
  return result.decision === 'APPROVE' ? 0 : 2;
}

const invoked = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (invoked) {
  const path = process.argv[2];
  if (!path) {
    console.error('usage: node src/simulate.js <fixture.json>');
    process.exitCode = 64;
  } else {
    try {
      process.exitCode = await run(path);
    } catch (error) {
      console.error(`invalid evidence: ${error.message}`);
      process.exitCode = 65;
    }
  }
}
