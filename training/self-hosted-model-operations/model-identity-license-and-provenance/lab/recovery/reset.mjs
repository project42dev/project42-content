import { copyFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const recovery = dirname(fileURLToPath(import.meta.url));
const labRoot = resolve(recovery, '..');
await copyFile(resolve(recovery, 'starter.evaluate.mjs'), resolve(labRoot, 'src/evaluate.mjs'));
process.stdout.write('Restored deliberate starter defect in src/evaluate.mjs\n');
