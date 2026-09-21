import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { verifyWorkspace } from './verifier-core.mjs';

const defaultRoot = dirname(fileURLToPath(import.meta.url));
const root = resolve(process.argv[2] || defaultRoot);

const exitCode = await verifyWorkspace(root, manifest => {
  // DELIBERATE DEFECT: a bundle label is not the verified inventory binding.
  return manifest.bundleId;
});
process.exitCode = exitCode;
