import { readFile } from 'node:fs/promises';
import { evaluate } from './gate.mjs';

const file = process.argv[2];
if (!file) {
  console.error('usage: node src/cli.mjs FIXTURE.json');
  process.exitCode = 64;
} else {
  try {
    const bundle = JSON.parse(await readFile(file, 'utf8'));
    const result = evaluate(bundle);
    if (result.ok) {
      console.log(`APPROVE ${result.action} request=${result.requestId} subject=${result.subjectId} amount=${result.amount} ${result.currency} evidence=${result.evidenceIds.join(',')}`);
      process.exitCode = 0;
    } else {
      const suffix = result.path ? ` path=${result.path}` : '';
      console.log(`REJECT ${result.reason}${suffix}`);
      process.exitCode = 2;
    }
  } catch (error) {
    console.error(`ERROR ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  }
}
