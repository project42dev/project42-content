import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { calculate } from '../capacity.mjs';
import { calculateReference } from '../reference/capacity.reference.mjs';
import { validateInput } from '../validation.mjs';

const labRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const base = JSON.parse(await readFile(join(labRoot, 'fixtures/base.json'), 'utf8'));
const changedSource = JSON.parse(await readFile(join(labRoot, 'fixtures/changed-overload.json'), 'utf8'));
const workspaceRoot = join(labRoot, '.test-workspaces');
const { mkdir } = await import('node:fs/promises');
await mkdir(workspaceRoot, { recursive: true });
const workspace = await mkdtemp(join(workspaceRoot, 'capacity-'));
const changedPath = join(workspace, 'changed.json');
await writeFile(changedPath, `${JSON.stringify(changedSource, null, 2)}\n`);
const changed = JSON.parse(await readFile(changedPath, 'utf8'));

let passed = 0;
let failed = 0;

function check(name, action) {
  try {
    action();
    passed += 1;
    console.log(`PASS ${name}`);
  } catch (error) {
    failed += 1;
    console.log(`FAIL ${name}: ${error.message}`);
  }
}

function equal(actual, expected, label) {
  if (!Object.is(actual, expected)) {
    throw new Error(`${label} expected ${expected}, received ${actual}`);
  }
}

check('base admits a genuine under-limit request', () => {
  const result = calculate(base);
  equal(result.admit, true, 'admit');
});

check('changed workload includes per-concurrent-request cache', () => {
  const independentExpected = changed.workload.concurrency
    * (changed.workload.maxTokens / 1000)
    * changed.accelerator.cacheGiBPerKTokens;
  equal(calculateReference(changed).accelerator.dynamicGiB, independentExpected, 'reference dynamicGiB');
  equal(calculate(changed).accelerator.dynamicGiB, independentExpected, 'dynamicGiB');
});

check('changed overload is rejected', () => {
  const result = calculate(changed);
  equal(result.accelerator.totalGiB, 24, 'totalGiB');
  equal(result.admit, false, 'admit');
});

check('shared validation rejects invalid values and units', () => {
  const invalidCases = [
    { mutate: value => { value.workload.concurrency = -1; } },
    { mutate: value => { value.accelerator.staticGiB = Number.POSITIVE_INFINITY; } },
    { mutate: value => { value.memoryUnit = 'GB'; } },
    { mutate: value => { delete value.host.runtimeGiB; } },
    { mutate: value => { value.startup.bandwidthGBps = 0; } }
  ];
  for (const testCase of invalidCases) {
    const value = structuredClone(base);
    testCase.mutate(value);
    let rejected = false;
    try {
      validateInput(value);
    } catch {
      rejected = true;
    }
    equal(rejected, true, 'invalid input rejection');
  }
});

await rm(workspace, { recursive: true, force: true });
console.log(`SUMMARY ${passed} passed, ${failed} failed`);
if (failed > 0) process.exitCode = 1;
