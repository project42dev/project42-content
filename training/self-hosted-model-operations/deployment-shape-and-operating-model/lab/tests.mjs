import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {select} from './selector.mjs';
import {selectReference} from './reference.mjs';
import {validateDecision} from './validation.mjs';

const labDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(labDirectory, '../../../..');
const cliPath = path.join(labDirectory, 'cli.mjs');
const rootFixture = path.relative(repositoryRoot, path.join(labDirectory, 'workload.json'));
const load = name => JSON.parse(fs.readFileSync(path.join(labDirectory, name), 'utf8'));
const base = load('workload.json');
const changed = load('changed.json');
const expectedBase = {selected: 'on-premises-service', eligible: true, reason: 'eligible'};
const expectedChanged = {selected: 'cloud-service', eligible: true, reason: 'eligible'};

const checks = [];
function check(name, operation) {
  checks.push({name, operation});
}
function clone(value) {
  return structuredClone(value);
}
function mustThrow(operation, pattern) {
  assert.throws(operation, pattern);
}

check('base-selection', () => assert.deepEqual(select(base), expectedBase));
check('changed-selection', () => assert.deepEqual(select(changed), expectedChanged));
check('reference-base', () => assert.deepEqual(select(base), selectReference(base)));
check('reference-changed', () => assert.deepEqual(select(changed), selectReference(changed)));

check('unknown-boundary-fallback', () => {
  const value = clone(base);
  value.options.find(option => option.id === 'on-premises-service').dataBoundary = 'unknown';
  assert.deepEqual(select(value), {selected: 'hybrid', eligible: true, reason: 'eligible'});
});

check('tie-policy', () => {
  const value = clone(base);
  value.options.find(option => option.id === 'on-premises-service').scores.capacityLatency = 15;
  assert.deepEqual(select(value), {selected: 'hybrid', eligible: true, reason: 'eligible'});
});

check('unknown-recovery-fallback', () => {
  const value = clone(base);
  value.options.find(option => option.id === 'on-premises-service').recovery.rtoMinutes = null;
  assert.deepEqual(select(value), {selected: 'hybrid', eligible: true, reason: 'eligible'});
});

check('zero-eligible', () => {
  const value = clone(base);
  for (const option of value.options) {
    option.dataBoundary = 'unknown';
    option.recovery.rtoMinutes = null;
    option.recovery.rpoMinutes = null;
    option.owner = 'missing';
  }
  mustThrow(() => select(value), /no eligible option/);
});

check('invalid-option-boundary', () => {
  const value = clone(base);
  value.options[0].dataBoundary = 'somewhere';
  mustThrow(() => select(value), /invalid option dataBoundary/);
});

check('invalid-workload-boundary', () => {
  const value = clone(base);
  value.dataBoundary = 'unknown';
  mustThrow(() => select(value), /invalid required dataBoundary/);
});

check('wrong-options-type', () => {
  const value = clone(base);
  value.options = {};
  mustThrow(() => select(value), /options must be an array/);
});

check('missing-id', () => {
  const value = clone(base);
  value.options.pop();
  mustThrow(() => select(value), /exact option set/);
});

check('duplicate-id', () => {
  const value = clone(base);
  value.options[5].id = 'workstation';
  mustThrow(() => select(value), /duplicate option id/);
});

check('invalid-requiredOwner', () => {
  const value = clone(base);
  value.requiredOwner = 'missing';
  mustThrow(() => select(value), /invalid requiredOwner/);
});

check('negative-workload-recovery', () => {
  const value = clone(base);
  value.recovery.rtoMinutes = -1;
  mustThrow(() => select(value), /finite non-negative number/);
});

check('negative-option-recovery', () => {
  const value = clone(base);
  value.options[0].recovery.rpoMinutes = -1;
  mustThrow(() => select(value), /finite non-negative number/);
});

check('nonfinite-score', () => {
  const value = clone(base);
  value.options[0].scores.capacityLatency = Number.NaN;
  mustThrow(() => select(value), /finite non-negative number/);
});

check('nonfinite-recovery', () => {
  const value = clone(base);
  value.options[0].recovery.rtoMinutes = Number.POSITIVE_INFINITY;
  mustThrow(() => select(value), /finite non-negative number/);
});

check('score-above-weight', () => {
  const value = clone(base);
  value.options[0].scores.capacityLatency = 26;
  mustThrow(() => select(value), /exceeds weight/);
});

check('invalid-owner', () => {
  const value = clone(base);
  value.options[0].owner = 'maybe';
  mustThrow(() => select(value), /invalid option owner/);
});

check('cli-root', () => {
  const run = spawnSync(process.execPath, [cliPath, rootFixture], {cwd: repositoryRoot, encoding: 'utf8'});
  assert.equal(run.status, 0);
  assert.equal(run.stdout.trim(), JSON.stringify(expectedBase));
  assert.equal(run.stderr, '');
});

check('cli-lab', () => {
  const run = spawnSync(process.execPath, ['cli.mjs', 'workload.json'], {cwd: labDirectory, encoding: 'utf8'});
  assert.equal(run.status, 0);
  assert.equal(run.stdout.trim(), JSON.stringify(expectedBase));
  assert.equal(run.stderr, '');
});

check('deterministic-repeat', () => assert.deepEqual(select(clone(base)), select(clone(base))));

check('extra-option', () => {
  const value = clone(base);
  value.options.push(clone(value.options[0]));
  value.options[6].id = 'extra';
  mustThrow(() => select(value), /exact option set/);
});

check('wrong-recovery-type', () => {
  const value = clone(base);
  value.options[0].recovery.rtoMinutes = '60';
  mustThrow(() => select(value), /finite non-negative number/);
});

check('missing-score-criterion', () => {
  const value = clone(base);
  delete value.options[0].scores.workloadFit;
  mustThrow(() => select(value), /exact weighted criteria/);
});

check('unknown-evidence-valid-input', () => {
  const value = clone(base);
  const cloud = value.options.find(option => option.id === 'cloud-service');
  assert.equal(cloud.dataBoundary, 'unknown');
  assert.equal(cloud.recovery.rtoMinutes, null);
  assert.equal(cloud.recovery.rpoMinutes, null);
  assert.equal(validateDecision(value), value);
});

const failures = [];
for (const item of checks) {
  try {
    item.operation();
  } catch {
    failures.push(item.name);
  }
}

if (failures.length === 0) {
  console.log(`PASS ${checks.length}/${checks.length}`);
} else {
  console.log(`FAIL ${checks.length - failures.length}/${checks.length} failed=${failures.join(',')}`);
  process.exitCode = 1;
}
