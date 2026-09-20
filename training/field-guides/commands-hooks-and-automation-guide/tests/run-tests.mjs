import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SENTINEL = path.join(BASE, 'shell-sentinel');

function digestTree(directory) {
  const entries = [];
  function visit(current, relative) {
    for (const name of readdirSync(current).sort()) {
      const absolute = path.join(current, name);
      const nextRelative = path.posix.join(relative, name);
      const metadata = statSync(absolute);
      if (metadata.isDirectory()) visit(absolute, nextRelative);
      else if (metadata.isFile()) {
        const digest = createHash('sha256').update(readFileSync(absolute)).digest('hex');
        entries.push(`${nextRelative}:${digest}`);
      }
    }
  }
  visit(directory, '');
  return entries.join('\n');
}

function run(script, argument) {
  const result = spawnSync(process.execPath, [path.join(BASE, script), argument], {
    cwd: BASE,
    shell: false,
    encoding: 'utf8',
    env: {
      PATH: process.env.PATH ?? '',
      SystemRoot: process.env.SystemRoot ?? '',
      WINDIR: process.env.WINDIR ?? ''
    }
  });
  if (result.error) throw result.error;
  return {
    status: result.status,
    stdout: result.stdout,
    stderr: result.stderr
  };
}

function assertResult(name, actual, expected) {
  for (const field of ['status', 'stdout', 'stderr']) {
    if (actual[field] !== expected[field]) {
      throw new Error(`${name}: ${field} was ${JSON.stringify(actual[field])}, expected ${JSON.stringify(expected[field])}`);
    }
  }
}

if (process.versions.node.split('.')[0] !== '22') {
  process.stderr.write('TEST_ERROR: Node.js 22 is required\n');
  process.exit(2);
}

const fixtureDigestBefore = digestTree(path.join(BASE, 'fixtures'));

const cases = [
  {
    name: 'positive artifact',
    script: 'check.mjs',
    argument: 'fixtures/positive.json',
    expected: {
      status: 0,
      stdout: 'PASS: task artifact satisfies the bounded read-only contract\n',
      stderr: ''
    }
  },
  {
    name: 'changed learner artifact',
    script: 'check.mjs',
    argument: 'fixtures/changed-invalid.json',
    expected: {
      status: 1,
      stdout: '',
      stderr: 'FAIL: $.expected.decision must equal "accept"\n'
    }
  },
  {
    name: 'complete solution',
    script: 'check.mjs',
    argument: 'fixtures/solution.json',
    expected: {
      status: 0,
      stdout: 'PASS: task artifact satisfies the bounded read-only contract\n',
      stderr: ''
    }
  },
  {
    name: 'malformed JSON',
    script: 'check.mjs',
    argument: 'fixtures/malformed.json',
    expected: {
      status: 2,
      stdout: '',
      stderr: 'ERROR: input is not valid JSON\n'
    }
  },
  {
    name: 'missing field',
    script: 'check.mjs',
    argument: 'fixtures/missing-field.json',
    expected: {
      status: 1,
      stdout: '',
      stderr: 'FAIL: $ missing required field "permissions"\n'
    }
  },
  {
    name: 'artifact path traversal',
    script: 'check.mjs',
    argument: 'fixtures/path-traversal.json',
    expected: {
      status: 1,
      stdout: '',
      stderr: 'FAIL: $.scope.paths[0] contains a forbidden path segment\n'
    }
  },
  {
    name: 'untrusted shell-like artifact text',
    script: 'check.mjs',
    argument: 'fixtures/untrusted-input.json',
    expected: {
      status: 1,
      stdout: '',
      stderr: 'FAIL: $.task must equal "validate-learning-resource"\n'
    }
  },
  {
    name: 'entry path traversal',
    script: 'check.mjs',
    argument: '../outside.json',
    expected: {
      status: 2,
      stdout: '',
      stderr: 'ERROR: input path must stay within the working directory\n'
    }
  },
  {
    name: 'positive generic event',
    script: 'adapter.mjs',
    argument: 'events/positive-event.json',
    expected: {
      status: 0,
      stdout: 'PASS: task artifact satisfies the bounded read-only contract\n',
      stderr: ''
    }
  },
  {
    name: 'missing generic event field',
    script: 'adapter.mjs',
    argument: 'events/missing-field-event.json',
    expected: {
      status: 2,
      stdout: '',
      stderr: 'ADAPTER_ERROR: event missing required field "artifactPath"\n'
    }
  }
];

try {
  for (const testCase of cases) {
    assertResult(testCase.name, run(testCase.script, testCase.argument), testCase.expected);
  }

  const untrustedEvent = run('adapter.mjs', 'events/untrusted-event.json');
  assertResult('untrusted generic event', untrustedEvent, {
    status: 2,
    stdout: '',
    stderr: 'ADAPTER_ERROR: artifactPath must name a relative .json file using safe characters\n'
  });

  const fixtureDigestAfter = digestTree(path.join(BASE, 'fixtures'));
  if (fixtureDigestAfter !== fixtureDigestBefore) {
    throw new Error('read-only check failed: fixture contents changed');
  }
  if (existsSync(SENTINEL)) {
    throw new Error('security check failed: shell sentinel exists');
  }

  process.stdout.write('PASS: 11 tests\n');
} catch (error) {
  process.stderr.write(`TEST_FAIL: ${error.message}\n`);
  process.exitCode = 1;
}