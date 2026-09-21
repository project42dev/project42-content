import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile, rm, rmdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { decidePromotion } from '../src/decision.mjs';
import { validatePacket } from '../src/validate.mjs';
import { verifyRollbackReadback } from '../src/recovery.mjs';

const lab = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tempDir = path.join(lab, '.lab-tmp');
const changedPath = path.join(tempDir, 'changed-input.json');
const fixture = async (name) => JSON.parse(await readFile(path.join(lab, 'fixtures', name), 'utf8'));
const clone = (value) => structuredClone(value);

after(async () => {
  await rm(changedPath, { force: true });
  try { await rmdir(tempDir); } catch (error) {
    if (error.code !== 'ENOENT' && error.code !== 'ENOTEMPTY') throw error;
  }
});

test('incompatible rollback state blocks promotion', async () => {
  const result = decidePromotion(validatePacket(await fixture('packet.json')));
  assert.equal(result.decision, 'reject');
  assert.deepEqual(result.failedGates, ['recovery']);
  assert.equal(result.rollbackCompatible, false);
});

test('renamed compatible packet promotes and rules out deny-all', async () => {
  await mkdir(tempDir, { recursive: true });
  const changed = await fixture('changed-compatible.json');
  await writeFile(changedPath, `${JSON.stringify(changed, null, 2)}\n`);
  const packet = validatePacket(JSON.parse(await readFile(changedPath, 'utf8')));
  const result = decidePromotion(packet);
  assert.equal(result.decision, 'promote');
  assert.deepEqual(result.failedGates, []);
  assert.equal(packet.manifests.candidate.releaseId, 'edge-candidate-omega');
});

test('false-compatible evidence cannot hide behind seven pass statuses', async () => {
  const packet = await fixture('changed-compatible.json');
  packet.rollback.rollbackCompatible = false;
  assert.throws(() => validatePacket(packet), /incompatible rollback requires recovery fail/);
});

test('rollback baseline schema evidence is bound to baseline manifest', async () => {
  const packet = await fixture('changed-compatible.json');
  packet.rollback.baselineStateSchema = 'invented-schema';
  assert.throws(() => validatePacket(packet), /baseline schema evidence/);
});

test('rollback candidate schema evidence is bound to candidate manifest', async () => {
  const packet = await fixture('changed-compatible.json');
  packet.rollback.candidateStateSchema = 'invented-schema';
  assert.throws(() => validatePacket(packet), /candidate schema evidence/);
});

test('validator rejects missing required fields', async () => {
  const packet = await fixture('changed-compatible.json');
  delete packet.manifests.candidate.telemetrySchema;
  assert.throws(() => validatePacket(packet), /telemetrySchema is required/);
});

test('validator rejects malformed immutable digests', async () => {
  const packet = await fixture('changed-compatible.json');
  packet.manifests.candidate.model.digest = 'sha256:not-a-digest';
  assert.throws(() => validatePacket(packet), /64 lowercase hexadecimal/);
});

test('validator rejects empty required arrays', async () => {
  for (const mutate of [
    (p) => { p.manifests.candidate.acceleratorLibraries = []; },
    (p) => { p.manifests.candidate.adapters = []; },
    (p) => { p.manifests.candidate.promptTemplates = []; },
    (p) => { p.rollout.stopConditions = []; },
    (p) => { p.rollout.drainConditions = []; }
  ]) {
    const packet = await fixture('changed-compatible.json'); mutate(packet);
    assert.throws(() => validatePacket(packet), /nonempty array/);
  }
});

test('validator rejects unknown enums and invalid types', async () => {
  const packet = await fixture('changed-compatible.json');
  packet.gates[0].status = 'waived';
  assert.throws(() => validatePacket(packet), /unknown gate status/);
  packet.gates[0].status = 'pass'; packet.rollout.strategy = 'magic-rollout';
  assert.throws(() => validatePacket(packet), /unknown rollout strategy/);
  packet.rollout.strategy = 'canary'; packet.rehearsal.readback.ready = 'yes';
  assert.throws(() => validatePacket(packet), /must be boolean/);
});

test('validator rejects non-finite and out-of-range controls', async () => {
  const packet = await fixture('changed-compatible.json');
  packet.rollout.exposurePercent = Number.POSITIVE_INFINITY;
  assert.throws(() => validatePacket(packet), /must be finite/);
  packet.rollout.exposurePercent = 101;
  assert.throws(() => validatePacket(packet), /must be in/);
  packet.rollout.exposurePercent = 1; packet.rollout.observationMinutes = 1.5;
  assert.throws(() => validatePacket(packet), /must be an integer/);
});

test('a non-recovery gate failure blocks promotion', async () => {
  const packet = await fixture('changed-compatible.json');
  packet.gates.find((gate) => gate.name === 'quality').status = 'fail';
  const result = decidePromotion(validatePacket(packet));
  assert.equal(result.decision, 'reject');
  assert.deepEqual(result.failedGates, ['quality']);
});

const mismatches = [
  ['release identity', (p) => { p.rehearsal.readback.manifest.releaseId = 'wrong-release'; }],
  ['model identity', (p) => { p.rehearsal.readback.manifest.model.digest = `sha256:${'0'.repeat(64)}`; }],
  ['tokenizer identity', (p) => { p.rehearsal.readback.manifest.tokenizer.digest = `sha256:${'0'.repeat(64)}`; }],
  ['runtime identity', (p) => { p.rehearsal.readback.manifest.runtime.version = 'wrong-runtime'; }],
  ['accelerator-library identity', (p) => { p.rehearsal.readback.manifest.acceleratorLibraries[0] = 'wrong-library'; }],
  ['image identity', (p) => { p.rehearsal.readback.manifest.image.digest = `sha256:${'0'.repeat(64)}`; }],
  ['adapter identity', (p) => { p.rehearsal.readback.manifest.adapters[0].digest = `sha256:${'0'.repeat(64)}`; }],
  ['prompt-template identity', (p) => { p.rehearsal.readback.manifest.promptTemplates[0] = 'wrong-prompt'; }],
  ['safety-policy identity', (p) => { p.rehearsal.readback.manifest.safetyPolicy.digest = `sha256:${'0'.repeat(64)}`; }],
  ['gateway-contract identity', (p) => { p.rehearsal.readback.manifest.gatewayContract = 'wrong-gateway'; }],
  ['infrastructure identity', (p) => { p.rehearsal.readback.manifest.infrastructureConfig = 'wrong-infra'; }],
  ['evaluation-set identity', (p) => { p.rehearsal.readback.manifest.evaluationSet = 'wrong-eval'; }],
  ['telemetry-schema identity', (p) => { p.rehearsal.readback.manifest.telemetrySchema = 'wrong-telemetry'; }],
  ['state-schema identity', (p) => { p.rehearsal.readback.manifest.stateSchema = 'wrong-state'; }],
  ['readiness evidence', (p) => { p.rehearsal.readback.ready = false; }]
];

for (const [label, mutate] of mismatches) {
  test(`rollback verification rejects ${label} mismatch`, async () => {
    const packet = validatePacket(await fixture('packet.json'));
    const changed = clone(packet); mutate(changed);
    assert.equal(verifyRollbackReadback(changed), false);
  });
}
