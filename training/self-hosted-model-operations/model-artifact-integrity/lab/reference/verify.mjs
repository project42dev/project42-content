import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { verifyWorkspace } from '../verifier-core.mjs';

const defaultRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const root = resolve(process.argv[2] || defaultRoot);
const exitCode = await verifyWorkspace(root, manifest => manifest.promotion.inventoryBinding);
process.exitCode = exitCode;
