import { copyFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const scripts = dirname(fileURLToPath(import.meta.url));
const lab = dirname(scripts);
await copyFile(join(lab, 'reference', 'policy.js'), join(lab, 'src', 'policy.js'));
console.log('RECOVERED src/policy.js from reference/policy.js');
