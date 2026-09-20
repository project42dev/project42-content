import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { buildContext } from '../src/engine.js';

const fixtures = JSON.parse(fs.readFileSync(new URL('../fixtures/scenarios.json', import.meta.url), 'utf8')).cases;
const get = id => structuredClone(fixtures.find(item => item.caseId === id));

test('normal context independently reconstructs reservations and evidence', () => {
  const input = get('normal-sufficient');
  const result = buildContext(input);
  const reserved = Object.values(input.budget.reserve).reduce((a, b) => a + b, 0);
  const selectedSize = input.records.filter(r => result.selected.includes(r.id)).reduce((n, r) => n + r.sizeUnits, 0);
  const untrustedSize = input.records.filter(r => result.untrusted.includes(r.id)).reduce((n, r) => n + r.sizeUnits, 0);
  assert.equal(result.status, 'READY');
  assert.equal(result.reservations.evidenceCapacity, input.budget.total - reserved);
  assert.equal(result.reservations.used, selectedSize + untrustedSize);
  assert.deepEqual(new Set(result.selected), new Set(['approval-r7', 'safety-r3']));
  assert.ok(result.omissions.some(o => o.id === 'large-manual'));
});

test('stale record is replaced rather than treated as cumulative support', () => {
  const result = buildContext(get('stale-refreshed'));
  assert.equal(result.status, 'READY');
  assert.deepEqual(result.selected, ['approval-r7']);
  assert.deepEqual(result.refreshes, ['approval-r6->approval-r7']);
});

test('missing material evidence escalates', () => {
  const result = buildContext(get('missing-material'));
  assert.equal(result.status, 'ESCALATE');
  assert.ok(result.missing.includes('claim:safety'));
});

test('contradictory authoritative records are both retained and escalate', () => {
  const result = buildContext(get('authoritative-contradiction'));
  assert.equal(result.status, 'ESCALATE');
  assert.ok(result.selected.includes('approval-r7'));
  assert.ok(result.selected.includes('board-r2'));
  assert.deepEqual(result.conflicts, ['approval']);
});

test('retrieved and tool instructions remain untrusted data', () => {
  const result = buildContext(get('injection-preserved-untrusted'));
  assert.equal(result.status, 'READY');
  assert.deepEqual(result.untrusted, ['tool-text-1']);
  assert.ok(!result.selected.includes('tool-text-1'));
});

test('irrelevant oversized evidence is rejected', () => {
  const result = buildContext(get('irrelevant-oversize'));
  assert.equal(result.status, 'READY');
  assert.ok(result.omissions.some(o => o.id === 'archive-dump'));
});

test('irrelevant untrusted input is omitted before capacity charging', () => {
  const input = get('normal-sufficient');
  input.records.push({
    id: 'irrelevant-forum', sourceId: 'community-forum', revision: '1', digest: 'f1',
    role: 'untrustedData', origin: 'retrieved', sizeUnits: 100, relevant: false,
    claimId: 'safety', value: 'clear'
  });
  const result = buildContext(input);
  assert.ok(!result.untrusted.includes('irrelevant-forum'));
  assert.ok(result.omissions.some(o => o.id === 'irrelevant-forum' && o.reason === 'irrelevant'));
  assert.equal(result.reservations.used, 10);
});

test('summary retains explicit provenance while exact claim rehydrates', () => {
  const summary = buildContext(get('summary-provenance'));
  const exact = buildContext(get('exact-claim-rehydrated'));
  assert.ok(summary.selected.includes('approval-summary'));
  assert.ok(exact.selected.includes('approval-original'));
  assert.deepEqual(exact.rehydrated, ['approval-summary->approval-original']);
});

test('missing summary linkage is invalid', () => {
  const input = get('summary-provenance');
  delete input.records[0].sourceRefs;
  assert.throws(() => buildContext(input), /summary missing provenance linkage/);
});

test('malformed budget and mandatory reservation overflow fail closed', () => {
  const malformed = get('normal-sufficient');
  malformed.budget.total = '32';
  assert.throws(() => buildContext(malformed), /malformed budget total/);
  const overflow = get('normal-sufficient');
  overflow.budget.total = 5;
  assert.throws(() => buildContext(overflow), /reservations exceed/);
});

test('unknown roles, forged trust, revision clashes, and unlinked results are rejected', () => {
  const unknown = get('normal-sufficient');
  unknown.records[0].role = 'superPolicy';
  assert.throws(() => buildContext(unknown), /unknown role/);
  const forged = get('normal-sufficient');
  forged.records[0].trust = 'trusted';
  assert.throws(() => buildContext(forged), /forged trust/);
  const clash = get('normal-sufficient');
  clash.records.push({...clash.records[0], id:'copy', digest:'different'});
  assert.throws(() => buildContext(clash), /duplicate source revision clash/);
  const unlinked = get('normal-sufficient');
  unlinked.toolResults.push({id:'orphan',callId:'missing-call'});
  assert.throws(() => buildContext(unlinked), /unlinked tool result/);
});

test('fixture change causes independently generated output to change', () => {
  const input = get('normal-sufficient');
  const before = buildContext(input);
  input.records.find(r => r.id === 'safety-r3').value = 'blocked';
  input.records.push({id:'safety-r4',sourceId:'safety-register',revision:'4',digest:'s4',role:'evidence',sizeUnits:4,relevant:true,claimId:'safety',value:'clear',ageDays:1,disconfirming:true});
  const after = buildContext(input);
  assert.notDeepEqual(after.selected, before.selected);
  assert.equal(after.status, 'ESCALATE');
  assert.deepEqual(after.conflicts, ['safety']);
});
