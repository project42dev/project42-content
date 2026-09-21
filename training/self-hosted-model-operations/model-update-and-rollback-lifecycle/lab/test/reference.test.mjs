import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { decidePromotion } from '../reference/decision.mjs';
import { validatePacket } from '../src/validate.mjs';

const lab = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fixture = async (name) => JSON.parse(await readFile(path.join(lab, 'fixtures', name), 'utf8'));

test('independent reference rejects the validated incompatible packet', async () => {
  const result = decidePromotion(validatePacket(await fixture('packet.json')));
  assert.equal(result.decision, 'reject');
  assert.deepEqual(result.failedGates, ['recovery']);
});

test('independent reference promotes the renamed compatible packet', async () => {
  const result = decidePromotion(validatePacket(await fixture('changed-compatible.json')));
  assert.equal(result.decision, 'promote');
  assert.deepEqual(result.failedGates, []);
});

test('independent reference defensively rejects false compatibility even if all gates claim pass', async () => {
  const packet = await fixture('changed-compatible.json');
  packet.rollback.rollbackCompatible = false;
  const result = decidePromotion(packet);
  assert.equal(result.decision, 'reject');
  assert.deepEqual(result.failedGates, ['recovery']);
});
