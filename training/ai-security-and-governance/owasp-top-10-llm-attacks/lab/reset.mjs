#!/usr/bin/env node
import {copyFile, rm} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {dirname, resolve} from 'node:path';

const root = dirname(fileURLToPath(import.meta.url));
await copyFile(resolve(root, 'fixtures/starter-original.mjs'), resolve(root, 'starter/authorize.mjs'));
await rm(resolve(root, 'test-scratch'), {recursive: true, force: true});
console.log('RESET starter/authorize.mjs');
