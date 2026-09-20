import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { buildContext } from '../src/engine.js';

const fixtures = JSON.parse(fs.readFileSync(new URL('../fixtures/scenarios.json', import.meta.url), 'utf8')).cases;
const get = id => structuredClone(fixtures.find(item => item.caseId === id));

function recordSize(input, ids) {
  return input.records
    .filter(record => ids.includes(record.id))
    .reduce((total, record) => total + record.sizeUnits, 0);
}

test('untrusted data that does not fit is omitted and not charged', () => {
  const input = get('normal-sufficient');
  input.budget.total = Object.values(input.budget.reserve).reduce((a, b) => a + b, 0) + 8;
  const result = buildContext(input);

  assert.deepEqual(result.selected, ['safety-r3', 'approval-r7']);
  assert.deepEqual(result.untrusted, []);
  assert.ok(result.omissions.some(o =>
    o.id === 'retrieved-note' && o.reason === 'untrusted_data_does_not_fit'
  ));
  assert.equal(result.reservations.used, 8);
  assert.equal(
    result.reservations.used,
    recordSize(input, result.selected) + recordSize(input, result.untrusted)
  );
});

test('a renamed untrusted record is absent when it does not fit', () => {
  const input = get('normal-sufficient');
  const note = input.records.find(record => record.id === 'retrieved-note');
  note.id = 'retrieved-note-renamed';
  input.budget.total = Object.values(input.budget.reserve).reduce((a, b) => a + b, 0) + 8;
  const result = buildContext(input);

  assert.ok(!result.selected.includes('retrieved-note-renamed'));
  assert.ok(!result.untrusted.includes('retrieved-note-renamed'));
  assert.ok(result.omissions.some(o =>
    o.id === 'retrieved-note-renamed' && o.reason === 'untrusted_data_does_not_fit'
  ));
});

test('sufficient capacity retains the untrusted note and charges it once', () => {
  const input = get('normal-sufficient');
  const note = input.records.find(record => record.id === 'retrieved-note');
  note.id = 'retrieved-note-renamed';
  const result = buildContext(input);

  assert.deepEqual(result.selected, ['safety-r3', 'approval-r7']);
  assert.deepEqual(result.untrusted, ['retrieved-note-renamed']);
  assert.ok(!result.omissions.some(o => o.id === 'retrieved-note-renamed'));
  assert.equal(result.reservations.used, 10);
  assert.equal(
    result.reservations.used,
    recordSize(input, result.selected) + recordSize(input, result.untrusted)
  );
});
