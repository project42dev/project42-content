import {
  closeSync,
  constants,
  fstatSync,
  lstatSync,
  openSync,
  readSync,
  realpathSync
} from 'node:fs';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE_DIRECTORY = path.dirname(fileURLToPath(import.meta.url));
const CHECKER_PATH = path.join(BASE_DIRECTORY, 'check.mjs');
const MAX_EVENT_BYTES = 4096;

class AdapterError extends Error {}

function fail(message) {
  throw new AdapterError(message);
}

function safeRelativeJsonPath(value, label) {
  if (typeof value !== 'string' || value.length === 0 || value.length > 240) {
    fail(`${label} must be a nonempty relative path of at most 240 characters`);
  }
  if (value.includes('\\') || path.isAbsolute(value)) {
    fail(`${label} must stay within the guide directory`);
  }
  const segments = value.split('/');
  if (segments.some((segment) => segment === '' || segment === '.' || segment === '..')) {
    fail(`${label} must stay within the guide directory`);
  }
  if (!value.endsWith('.json') || !/^[A-Za-z0-9._/-]+$/.test(value)) {
    fail(`${label} must name a relative .json file using safe characters`);
  }
  const candidate = path.resolve(BASE_DIRECTORY, value);
  const relative = path.relative(BASE_DIRECTORY, candidate);
  if (relative === '' || relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    fail(`${label} must stay within the guide directory`);
  }
  return { candidate, relative: value };
}

function readEvent(argument) {
  const { candidate } = safeRelativeJsonPath(argument, 'event path');
  let metadata;
  try {
    metadata = lstatSync(candidate);
  } catch {
    fail('cannot read event file');
  }
  if (metadata.isSymbolicLink() || !metadata.isFile()) {
    fail('event input must be a regular file and not a symbolic link');
  }
  const root = realpathSync(BASE_DIRECTORY);
  const realCandidate = realpathSync(candidate);
  const relative = path.relative(root, realCandidate);
  if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    fail('event path must stay within the guide directory');
  }

  let descriptor;
  try {
    descriptor = openSync(realCandidate, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0));
    const current = fstatSync(descriptor);
    if (!current.isFile()) fail('event input must be a regular file and not a symbolic link');
    if (current.size > MAX_EVENT_BYTES) fail(`event input exceeds ${MAX_EVENT_BYTES} bytes`);
    const buffer = Buffer.alloc(current.size);
    let offset = 0;
    while (offset < buffer.length) {
      const count = readSync(descriptor, buffer, offset, buffer.length - offset, offset);
      if (count === 0) break;
      offset += count;
    }
    if (offset !== current.size) fail('event input changed while being read');
    try {
      return new TextDecoder('utf-8', { fatal: true }).decode(buffer);
    } catch {
      fail('event input is not valid UTF-8');
    }
  } catch (error) {
    if (error instanceof AdapterError) throw error;
    fail('cannot read event file');
  } finally {
    if (descriptor !== undefined) closeSync(descriptor);
  }
}

function validateEvent(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    fail('event must be an object');
  }
  const fields = ['eventVersion', 'eventType', 'artifactPath'];
  for (const field of fields) {
    if (!Object.hasOwn(value, field)) fail(`event missing required field "${field}"`);
  }
  for (const field of Object.keys(value)) {
    if (!fields.includes(field)) fail(`event has unexpected field "${field}"`);
  }
  if (value.eventVersion !== 1) fail('eventVersion must equal 1');
  if (value.eventType !== 'preflight') fail('eventType must equal "preflight"');
  return safeRelativeJsonPath(value.artifactPath, 'artifactPath').relative;
}

async function main() {
  if (process.versions.node.split('.')[0] !== '22') fail('Node.js 22 is required');
  if (process.argv.length !== 3) fail('usage: node adapter.mjs <relative-event.json>');
  const text = readEvent(process.argv[2]);
  let event;
  try {
    event = JSON.parse(text);
  } catch {
    fail('event input is not valid JSON');
  }
  const artifactPath = validateEvent(event);

  const child = spawn(process.execPath, [CHECKER_PATH, artifactPath], {
    cwd: BASE_DIRECTORY,
    shell: false,
    stdio: ['ignore', 'inherit', 'inherit'],
    env: {
      PATH: process.env.PATH ?? '',
      SystemRoot: process.env.SystemRoot ?? '',
      WINDIR: process.env.WINDIR ?? ''
    }
  });

  const exitCode = await new Promise((resolve, reject) => {
    child.once('error', reject);
    child.once('close', (code, signal) => {
      if (signal !== null) reject(new AdapterError(`checker ended from signal ${signal}`));
      else resolve(code ?? 2);
    });
  });
  process.exitCode = exitCode;
}

try {
  await main();
} catch (error) {
  const message = error instanceof AdapterError ? error.message : 'unexpected internal failure';
  process.stderr.write(`ADAPTER_ERROR: ${message}\n`);
  process.exitCode = 2;
}