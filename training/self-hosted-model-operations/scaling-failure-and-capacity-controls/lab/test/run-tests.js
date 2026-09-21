import { readFile, mkdir, writeFile, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseEvidence } from '../src/schema.js';
import { assess } from '../src/policy.js';
import { assess as referenceAssess } from '../reference/policy.js';

const here = dirname(fileURLToPath(import.meta.url));
const lab = dirname(here);
const baseline = JSON.parse(await readFile(join(lab, 'fixtures', 'baseline.json'), 'utf8'));
const changed = JSON.parse(await readFile(join(lab, 'fixtures', 'changed-positive.json'), 'utf8'));
let passed = 0;
const failures = [];

async function test(name, fn) {
  try {
    await fn();
    passed += 1;
  } catch (error) {
    failures.push(`FAIL ${name}: ${error.message}`);
  }
}

function result(value) {
  return assess(parseEvidence(value));
}

function requireValue(actual, expected, message) {
  if (actual !== expected) throw new Error(`${message}: expected ${expected}, got ${actual}`);
}

await test('baseline-capacity', () => {
  const evidence = parseEvidence(baseline);
  const reference = referenceAssess(evidence);
  requireValue(reference.decision, 'REJECT', 'independent reference baseline decision');
  requireValue(reference.causes.join(','), 'capacity', 'independent reference baseline cause');
  requireValue(reference.readyCapacity, 4, 'independent reference ready capacity');
  const actual = assess(evidence);
  if (actual.decision !== 'REJECT' || actual.causes.join(',') !== 'capacity') {
    throw new Error(`expected REJECT/capacity, got ${actual.decision}/${actual.causes.length ? actual.causes.join(',') : 'none'}`);
  }
  requireValue(actual.readyCapacity, 4, 'warming, draining, and failed hosts must contribute zero');
});

await test('positive-changed-input', () => {
  const actual = result(changed);
  requireValue(actual.decision, 'APPROVE', 'available changed input');
  requireValue(actual.causes.join(','), '', 'positive input causes');
  requireValue(actual.readyCapacity, 8, 'changed ready capacity');
});

await test('shared-failure-domain', () => {
  const value = structuredClone(changed);
  value.hosts[1].domain = 'rack-a';
  const actual = result(value);
  requireValue(actual.causes.includes('failure-domain'), true, 'two hosts in one domain are not two domains');
});

await test('queue-and-deadline-budget', () => {
  const value = structuredClone(changed);
  value.demand = 11;
  value.queueDelayMs = 800;
  value.serviceMs = 300;
  const actual = result(value);
  requireValue(actual.causes.join(','), 'capacity,deadline', 'bounded queue and end-to-end deadline');
});

await test('cost-ceiling', () => {
  const value = structuredClone(changed);
  value.hourlyCost = 25;
  const actual = result(value);
  requireValue(actual.causes.join(','), 'cost', 'cost ceiling');
});

await test('unknown-enum', () => {
  const value = structuredClone(changed);
  value.hosts[0].status = 'starting';
  let rejected = false;
  try { parseEvidence(value); } catch { rejected = true; }
  requireValue(rejected, true, 'unknown status must be rejected');
});

await test('malformed-and-unknown-evidence', () => {
  const nonFinite = structuredClone(changed);
  nonFinite.demand = Number.NaN;
  let nonFiniteRejected = false;
  try { parseEvidence(nonFinite); } catch { nonFiniteRejected = true; }
  requireValue(nonFiniteRejected, true, 'non-finite demand must be rejected');

  const wrongType = structuredClone(changed);
  wrongType.queueLimit = '2';
  let typeRejected = false;
  try { parseEvidence(wrongType); } catch { typeRejected = true; }
  requireValue(typeRejected, true, 'wrong numeric type must be rejected');

  const outOfRange = structuredClone(changed);
  outOfRange.hosts[0].slots = 1001;
  let rangeRejected = false;
  try { parseEvidence(outOfRange); } catch { rangeRejected = true; }
  requireValue(rangeRejected, true, 'out-of-range integer must be rejected');

  const unknown = {...changed, surprise: true};
  let unknownRejected = false;
  try { parseEvidence(unknown); } catch { unknownRejected = true; }
  requireValue(unknownRejected, true, 'unknown fields must be rejected');
});

await test('bounded-local-temporary-fixture', async () => {
  const tempDir = join(lab, '.tmp');
  const tempFile = join(tempDir, 'changed-copy.json');
  await mkdir(tempDir, {recursive: true});
  try {
    await writeFile(tempFile, JSON.stringify(changed), 'utf8');
    const copied = parseEvidence(JSON.parse(await readFile(tempFile, 'utf8')));
    requireValue(referenceAssess(copied).decision, 'APPROVE', 'temporary changed fixture');
  } finally {
    await rm(tempFile, {force: true});
  }
});

for (const failure of failures) console.log(failure);
console.log(`RESULT ${passed} passed, ${failures.length} failed`);
process.exitCode = failures.length === 0 ? 0 : 1;
