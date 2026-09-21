import { rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const lab = dirname(fileURLToPath(import.meta.url));
await writeFile(join(lab, 'fixtures', 'artifact.bin'), Buffer.alloc(0));
await writeFile(join(lab, 'fixtures', 'tokenizer.txt'), Buffer.from('abc', 'utf8'));
await rm(join(lab, '.test-workspaces'), { recursive: true, force: true });
console.log('RECOVERY PASS fixture restored; investigation example retained');
