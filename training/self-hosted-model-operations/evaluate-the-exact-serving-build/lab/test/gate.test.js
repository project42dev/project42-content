import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { validateDossier } from '../src/validation.js';
import { decide } from '../src/gate.js';

const lab = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tmp = path.join(lab, '.tmp');
const fixturePath = path.join(lab, 'fixtures', 'release-dossier.json');
const gatePath = path.join(lab, 'src', 'gate.js');
const original = JSON.parse(await readFile(fixturePath, 'utf8'));
process.on('exit', () => { rmSync(tmp, { recursive: true, force: true }); });

function clone(value) { return structuredClone(value); }
function makeAllPass() {
  const data = clone(original);
  for (const result of data.candidate.results) result.status = 'pass';
  data.candidate.declaredPassed = 12;
  data.metrics.candidate.passed = 12;
  data.metrics.candidate.rate = 1;
  for (const slice of data.metrics.slices) slice.candidatePassed = slice.cases.length;
  return data;
}
function expectedOracle(a) {
  const reasons = [];
  if (!a.identityMatches) reasons.push('identity-mismatch');
  if (!a.denominatorMatches) reasons.push('denominator-mismatch');
  if (!a.evidenceComplete) reasons.push('evidence-incomplete');
  if (a.aggregate < a.dossier.gate.aggregateThreshold) reasons.push('aggregate-below-threshold');
  for (const id of a.criticalFailures) reasons.push(`critical-failure:${id}`);
  if (!a.serviceObjectivesMet) reasons.push('service-objective-failed');
  if (!a.recoveryMet) reasons.push('recovery-failed');
  return { disposition: reasons.length ? 'REJECT' : 'PASS', reasons };
}
function check(data) {
  const a = validateDossier(data);
  assert.deepStrictEqual(decide(a), expectedOracle(a));
}
function invalid(mutator, pattern) {
  const data = clone(original);
  mutator(data);
  assert.throws(() => validateDossier(data), pattern);
}
async function runFile(name, data) {
  await mkdir(tmp, { recursive: true });
  const target = path.join(tmp, name);
  await writeFile(target, `${JSON.stringify(data)}\n`);
  return spawnSync(process.execPath, [gatePath, target], { encoding: 'utf8' });
}

test('critical failure is not averaged away', () => check(original));

test('exact CLI outputs and exit codes', async () => {
  const rejected = spawnSync(process.execPath, [gatePath, fixturePath], { encoding: 'utf8' });
  assert.deepStrictEqual({ stdout: rejected.stdout, stderr: rejected.stderr, status: rejected.status }, { stdout: 'REJECT aggregate=91.67% criticalFailures=1 reasons=critical-failure:C06\n', stderr: '', status: 2 });
  const accepted = await runFile('renamed-positive-case.json', makeAllPass());
  assert.deepStrictEqual({ stdout: accepted.stdout, stderr: accepted.stderr, status: accepted.status }, { stdout: 'PASS aggregate=100.00% criticalFailures=0\n', stderr: '', status: 0 });
});

test('all-pass positive defeats deny-all repair', () => check(makeAllPass()));

test('exact identity mismatch fails closed', () => {
  const data = makeAllPass();
  data.expectedCandidateIdentity.configDigest = 'sha256:synthetic-unexpected-config';
  check(data);
});

test('denominator mismatch assessment fails closed', () => {
  const a = validateDossier(makeAllPass());
  checkAssessment({ ...a, denominatorMatches: false });
});

test('evidence incomplete assessment fails closed', () => {
  const a = validateDossier(makeAllPass());
  checkAssessment({ ...a, evidenceComplete: false });
});

test('aggregate below threshold fails closed', () => {
  const a = validateDossier(makeAllPass());
  checkAssessment({ ...a, aggregate: 0.89 });
});

test('service failure fails closed', () => {
  const data = makeAllPass();
  data.serviceObjectives[0].observed = 221;
  data.serviceObjectives[0].met = false;
  data.metrics.candidateP95Milliseconds = 221;
  data.metrics.candidateLatencyMilliseconds[11] = 221;
  check(data);
});

test('recovery failure fails closed', () => {
  const data = makeAllPass();
  data.recoveryClaim.met = false;
  check(data);
});

test('changed noncritical input is evaluated by content, not filename', async () => {
  const data = makeAllPass();
  data.candidate.results.find((item) => item.caseId === 'C02').status = 'fail';
  data.candidate.declaredPassed = 11;
  data.metrics.candidate.passed = 11;
  data.metrics.candidate.rate = 11 / 12;
  data.metrics.slices.find((item) => item.slice === 'representative').candidatePassed = 1;
  const run = await runFile('release-dossier.json', data);
  assert.deepStrictEqual({ stdout: run.stdout, stderr: run.stderr, status: run.status }, { stdout: 'PASS aggregate=91.67% criticalFailures=0\n', stderr: '', status: 0 });
  check(data);
});

function checkAssessment(a) { assert.deepStrictEqual(decide(a), expectedOracle(a)); }

test('empty identities are rejected', () => invalid((d) => { d.expectedCandidateIdentity = {}; d.candidate.identity = {}; }, /identity.*fields/i));
test('missing baseline is rejected', () => invalid((d) => { delete d.baseline; }, /dossier.*fields/i));
test('empty baseline results are rejected', () => invalid((d) => { d.baseline.results = []; }, /non-empty/i));
test('absent recovery evidence label is rejected', () => invalid((d) => { d.recoveryClaim.evidenceIds = ['ABSENT']; }, /evidence/i));
test('missing candidate case evidence is rejected', () => invalid((d) => { d.evidenceRecords = d.evidenceRecords.filter((e) => e.id !== 'EV-C12'); }, /evidence/i));
test('wrongly bound baseline evidence is rejected', () => invalid((d) => { d.evidenceRecords.find((e) => e.id === 'BASE-C01').caseId = 'C02'; }, /evidence/i));
test('condition drift is rejected', () => invalid((d) => { d.candidate.conditions.seed = 7; }, /conditions/i));
test('unknown identity field is rejected', () => invalid((d) => { d.candidate.identity.unknown = 'x'; }, /identity.*fields/i));
test('identity type error is rejected', () => invalid((d) => { d.candidate.identity.runtime = 24; }, /runtime/i));
test('fractional denominator is rejected', () => invalid((d) => { d.candidate.declaredTotal = 11.5; }, /integer/i));
test('malformed schema version is rejected', () => invalid((d) => { d.schemaVersion = ''; }, /schemaVersion/i));
test('unknown top-level field is rejected', () => invalid((d) => { d.unexpected = true; }, /dossier.*fields/i));
test('service evidence must exist and be correctly bound', () => invalid((d) => { d.serviceObjectives[0].evidenceIds = ['EV-C01']; }, /evidence/i));
test('duplicate evidence IDs are rejected', () => invalid((d) => { d.evidenceRecords.push(clone(d.evidenceRecords[0])); }, /duplicate evidence/i));

test.after(async () => { await rm(tmp, { recursive: true, force: true }); });
