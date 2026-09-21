import { copyFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const [from, to] = process.argv.slice(2);
if (!from || !to) {
  console.error('usage: node scripts/copy.mjs FROM TO');
  process.exitCode = 64;
} else {
  await copyFile(resolve(from), resolve(to));
  console.log(`copied ${from} -> ${to}`);
}
