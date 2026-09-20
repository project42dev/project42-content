import {
  closeSync,
  constants,
  fstatSync,
  lstatSync,
  openSync,
  readSync,
  realpathSync
} from 'node:fs';
import path from 'node:path';

const MAX_INPUT_BYTES = 8192;
const APPROVED_PATHS = new Set([
  'training/field-guides/commands-hooks-and-automation-guide/README.md'
]);

class InputError extends Error {}
class ValidationError extends Error {}

function inputError(message) {
  throw new InputError(message);
}

function invalid(message) {
  throw new ValidationError(message);
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function requireExactObject(value, location, fields) {
  if (!isPlainObject(value)) {
    invalid(`${location} must be an object`);
  }
  for (const field of fields) {
    if (!Object.hasOwn(value, field)) {
      invalid(`${location} missing required field "${field}"`);
    }
  }
  for (const field of Object.keys(value)) {
    if (!fields.includes(field)) {
      invalid(`${location} has unexpected field "${field}"`);
    }
  }
}

function hasForbiddenSegment(value) {
  return value.split('/').some((segment) => segment === '' || segment === '.' || segment === '..');
}

function validateLogicalPath(value, location) {
  if (typeof value !== 'string' || value.length === 0 || value.length > 240) {
    invalid(`${location} must be a nonempty string of at most 240 characters`);
  }
  if (value.includes('\\') || path.posix.isAbsolute(value) || hasForbiddenSegment(value)) {
    invalid(`${location} contains a forbidden path segment`);
  }
  if (!/^[A-Za-z0-9._/-]+$/.test(value)) {
    invalid(`${location} contains unsupported characters`);
  }
  if (!APPROVED_PATHS.has(value)) {
    invalid(`${location} is not an approved path`);
  }
}

function validateArtifact(value) {
  requireExactObject(value, '$', [
    'artifactVersion',
    'task',
    'scope',
    'permissions',
    'trigger',
    'expected'
  ]);

  if (value.artifactVersion !== 1) {
    invalid('$.artifactVersion must equal 1');
  }
  if (value.task !== 'validate-learning-resource') {
    invalid('$.task must equal "validate-learning-resource"');
  }

  requireExactObject(value.scope, '$.scope', ['repository', 'paths']);
  if (value.scope.repository !== 'project42') {
    invalid('$.scope.repository must equal "project42"');
  }
  if (!Array.isArray(value.scope.paths) || value.scope.paths.length < 1 || value.scope.paths.length > 8) {
    invalid('$.scope.paths must contain between 1 and 8 paths');
  }
  value.scope.paths.forEach((item, index) => validateLogicalPath(item, `$.scope.paths[${index}]`));
  if (new Set(value.scope.paths).size !== value.scope.paths.length) {
    invalid('$.scope.paths must not contain duplicates');
  }

  requireExactObject(value.permissions, '$.permissions', ['readOnly', 'network', 'credentials']);
  if (value.permissions.readOnly !== true) {
    invalid('$.permissions.readOnly must equal true');
  }
  if (value.permissions.network !== false) {
    invalid('$.permissions.network must equal false');
  }
  if (value.permissions.credentials !== false) {
    invalid('$.permissions.credentials must equal false');
  }

  if (value.trigger !== 'manual') {
    invalid('$.trigger must equal "manual"');
  }

  requireExactObject(value.expected, '$.expected', ['decision', 'terminal']);
  if (value.expected.decision !== 'accept') {
    invalid('$.expected.decision must equal "accept"');
  }
  if (value.expected.terminal !== true) {
    invalid('$.expected.terminal must equal true');
  }
}

function validateInputPath(argument) {
  if (typeof argument !== 'string' || argument.length === 0 || argument.length > 240) {
    inputError('input path must be a nonempty relative path of at most 240 characters');
  }
  if (argument.includes('\\') || path.isAbsolute(argument)) {
    inputError('input path must stay within the working directory');
  }
  const segments = argument.split('/');
  if (segments.some((segment) => segment === '' || segment === '.' || segment === '..')) {
    inputError('input path must stay within the working directory');
  }
  if (!argument.endsWith('.json') || !/^[A-Za-z0-9._/-]+$/.test(argument)) {
    inputError('input path must name a relative .json file using safe characters');
  }

  const root = realpathSync(process.cwd());
  const candidate = path.resolve(root, argument);
  const relative = path.relative(root, candidate);
  if (relative === '' || relative.startsWith(`..${path.sep}`) || relative === '..' || path.isAbsolute(relative)) {
    inputError('input path must stay within the working directory');
  }

  let metadata;
  try {
    metadata = lstatSync(candidate);
  } catch {
    inputError('cannot read input file');
  }
  if (metadata.isSymbolicLink() || !metadata.isFile()) {
    inputError('input must be a regular file and not a symbolic link');
  }

  let realCandidate;
  try {
    realCandidate = realpathSync(candidate);
  } catch {
    inputError('cannot read input file');
  }
  const realRelative = path.relative(root, realCandidate);
  if (realRelative.startsWith(`..${path.sep}`) || realRelative === '..' || path.isAbsolute(realRelative)) {
    inputError('input path must stay within the working directory');
  }
  return realCandidate;
}

function readBoundedFile(filePath) {
  let descriptor;
  try {
    descriptor = openSync(filePath, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0));
    const metadata = fstatSync(descriptor);
    if (!metadata.isFile()) {
      inputError('input must be a regular file and not a symbolic link');
    }
    if (metadata.size > MAX_INPUT_BYTES) {
      inputError(`input exceeds ${MAX_INPUT_BYTES} bytes`);
    }
    const buffer = Buffer.alloc(metadata.size);
    let offset = 0;
    while (offset < buffer.length) {
      const count = readSync(descriptor, buffer, offset, buffer.length - offset, offset);
      if (count === 0) break;
      offset += count;
    }
    if (offset !== metadata.size) {
      inputError('input changed while being read');
    }
    try {
      return new TextDecoder('utf-8', { fatal: true }).decode(buffer);
    } catch {
      inputError('input is not valid UTF-8');
    }
  } catch (error) {
    if (error instanceof InputError) throw error;
    inputError('cannot read input file');
  } finally {
    if (descriptor !== undefined) closeSync(descriptor);
  }
}

function main() {
  if (process.versions.node.split('.')[0] !== '22') {
    inputError('Node.js 22 is required');
  }
  if (process.argv.length !== 3) {
    inputError('usage: node check.mjs <relative-artifact.json>');
  }
  const filePath = validateInputPath(process.argv[2]);
  const text = readBoundedFile(filePath);
  let artifact;
  try {
    artifact = JSON.parse(text);
  } catch {
    inputError('input is not valid JSON');
  }
  validateArtifact(artifact);
  process.stdout.write('PASS: task artifact satisfies the bounded read-only contract\n');
}

try {
  main();
} catch (error) {
  if (error instanceof ValidationError) {
    process.stderr.write(`FAIL: ${error.message}\n`);
    process.exitCode = 1;
  } else if (error instanceof InputError) {
    process.stderr.write(`ERROR: ${error.message}\n`);
    process.exitCode = 2;
  } else {
    process.stderr.write('ERROR: unexpected internal failure\n');
    process.exitCode = 2;
  }
}