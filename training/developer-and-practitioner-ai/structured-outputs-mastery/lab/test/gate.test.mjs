import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { evaluate } from '../src/gate.mjs';

const fixture = async (name) => JSON.parse(await readFile(new URL(`../fixtures/${name}`, import.meta.url), 'utf8'));
const validText = (changes = {}) => JSON.stringify({
  schema_version: '1',
  request_id: 'req-200',
  action: 'refund',
  subject_id: 'acct-9',
  amount: 10,
  currency: 'USD',
  evidence_ids: ['tx-20'],
  ...changes
});
const bundle = (text = validText()) => ({
  response: { state: 'completed', refusal: null, text },
  request: { request_id: 'req-200', subject_id: 'acct-9' },
  evidence: [{ id: 'tx-20', subject_id: 'acct-9', currency: 'USD', refundable_amount: 20 }],
  authorization: { subject_id: 'acct-9', actions: ['refund'], max_refund: 15 }
});

function reason(result, expected) {
  assert.equal(result.ok, false);
  assert.equal(result.reason, expected);
}

test('rejects the worked duplicate action before the last value can be approved', async () => {
  const result = evaluate(await fixture('duplicate-action.json'));
  reason(result, 'duplicate_key');
  assert.equal(result.path, '$.action');
});

test('accepts the independent changed fixture, preventing deny-all repairs', async () => {
  assert.deepEqual(evaluate(await fixture('valid-changed.json')), {
    ok: true,
    action: 'refund',
    requestId: 'req-101',
    subjectId: 'acct-7',
    amount: 40,
    currency: 'USD',
    evidenceIds: ['tx-10']
  });
});

test('accepts a separately constructed valid input', () => {
  assert.equal(evaluate(bundle()).ok, true);
});

test('decodes escaped member names before duplicate comparison', () => {
  const text = '{"schema_version":"1","request_id":"req-200","action":"refund","act\\u0069on":"refund","subject_id":"acct-9","amount":10,"currency":"USD","evidence_ids":["tx-20"]}';
  reason(evaluate(bundle(text)), 'duplicate_key');
});

test('detects a duplicate in a nested object before shape validation', () => {
  const text = '{"schema_version":"1","request_id":"req-200","action":"refund","subject_id":"acct-9","amount":10,"currency":"USD","evidence_ids":["tx-20"],"meta":{"x":1,"x":2}}';
  const result = evaluate(bundle(text));
  reason(result, 'duplicate_key');
  assert.equal(result.path, '$.meta.x');
});

test('rejects an unknown output field', () => {
  reason(evaluate(bundle(validText({ approved: true }))), 'unknown_or_missing_field');
});

test('checks refusal and incomplete states before parsing', () => {
  const refused = bundle('{bad');
  refused.response.refusal = 'policy';
  reason(evaluate(refused), 'refused');
  const incomplete = bundle('{bad');
  incomplete.response.state = 'incomplete';
  reason(evaluate(incomplete), 'incomplete');
});

test('binds output to the current request', () => {
  reason(evaluate(bundle(validText({ request_id: 'req-other' }))), 'request_binding_failed');
});

test('requires every cited evidence ID to exist', () => {
  reason(evaluate(bundle(validText({ evidence_ids: ['missing'] }))), 'evidence_missing');
});

test('checks a second cross-account citation instead of only the first', () => {
  const input = bundle(validText({ evidence_ids: ['tx-20', 'tx-other'] }));
  input.evidence.push({ id: 'tx-other', subject_id: 'acct-other', currency: 'USD', refundable_amount: 10 });
  reason(evaluate(input), 'evidence_binding_failed');
});

test('checks currency on every cited record', () => {
  const input = bundle(validText({ evidence_ids: ['tx-20', 'tx-eur'] }));
  input.evidence.push({ id: 'tx-eur', subject_id: 'acct-9', currency: 'EUR', refundable_amount: 10 });
  reason(evaluate(input), 'evidence_binding_failed');
});

test('rejects otherwise valid multi-record aggregation without an explicit rule', () => {
  const input = bundle(validText({ evidence_ids: ['tx-20', 'tx-21'] }));
  input.evidence.push({ id: 'tx-21', subject_id: 'acct-9', currency: 'USD', refundable_amount: 20 });
  reason(evaluate(input), 'evidence_aggregation_unsupported');
});

test('rejects duplicate cited evidence IDs', () => {
  reason(evaluate(bundle(validText({ evidence_ids: ['tx-20', 'tx-20'] }))), 'evidence_invalid');
});

test('rejects conflicting duplicate evidence registry IDs before Map-last behavior', () => {
  const input = bundle();
  input.evidence.push({ id: 'tx-20', subject_id: 'acct-other', currency: 'EUR', refundable_amount: 999 });
  reason(evaluate(input), 'evidence_registry_duplicate');
});

test('enforces the trusted refundable amount invariant', () => {
  const input = bundle(validText({ amount: 21 }));
  input.authorization.max_refund = 30;
  reason(evaluate(input), 'invariant_failed');
});

test('checks authorization actions independently', () => {
  const input = bundle();
  input.authorization.actions = ['read'];
  reason(evaluate(input), 'unauthorized');
});

test('fails closed for authorization max_refund string unlimited', () => {
  const input = bundle();
  input.authorization.max_refund = 'unlimited';
  reason(evaluate(input), 'trusted_context_invalid');
});

test('fails closed for missing authorization max_refund', () => {
  const input = bundle();
  delete input.authorization.max_refund;
  reason(evaluate(input), 'trusted_context_invalid');
});

test('rejects an output amount beyond the safe integer range', () => {
  reason(evaluate(bundle(validText({ amount: Number.MAX_SAFE_INTEGER + 1 }))), 'invariant_failed');
});

test('rejects a trusted evidence amount beyond the safe integer range', () => {
  const input = bundle();
  input.evidence[0].refundable_amount = Number.MAX_SAFE_INTEGER + 1;
  reason(evaluate(input), 'trusted_context_invalid');
});

test('rejects an authorization limit beyond the safe integer range', () => {
  const input = bundle();
  input.authorization.max_refund = Number.MAX_SAFE_INTEGER + 1;
  reason(evaluate(input), 'trusted_context_invalid');
});

test('rejects zero and does not coerce numeric strings', () => {
  reason(evaluate(bundle(validText({ amount: 0 }))), 'invariant_failed');
  const input = bundle();
  input.evidence[0].refundable_amount = '20';
  reason(evaluate(input), 'trusted_context_invalid');
});

test('accepts Number.MAX_SAFE_INTEGER at every positive numeric boundary', () => {
  const maximum = Number.MAX_SAFE_INTEGER;
  const input = bundle(validText({ amount: maximum }));
  input.evidence[0].refundable_amount = maximum;
  input.authorization.max_refund = maximum;
  assert.equal(evaluate(input).ok, true);
});
