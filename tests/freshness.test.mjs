import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import test from 'node:test';

import { checkFreshness, evaluate, report } from '../scripts/check-freshness.mjs';
import { validateCurrencyShape } from '../scripts/validate-content.mjs';

const AS_OF = new Date('2026-09-06T00:00:00.000Z');

test('a recorded date inside its cadence is current', () => {
  assert.equal(evaluate('2026-09-01', 30, AS_OF).status, 'current');
});

test('a recorded date near the end of its cadence is review-due', () => {
  assert.equal(evaluate('2026-08-11', 30, AS_OF).status, 'review-due');
});

test('a recorded date past its cadence is stale', () => {
  const state = evaluate('2026-07-25', 30, AS_OF);
  assert.equal(state.status, 'stale');
  assert.equal(state.ageDays, 43);
});

test('an absent date is unverified, not stale', () => {
  assert.equal(evaluate(undefined, 30, AS_OF).status, 'unverified');
  assert.equal(evaluate(null, 30, AS_OF).status, 'unverified');
  assert.equal(evaluate(undefined, 30, AS_OF).ageDays, null);
});

test('unverified is not reached by age, so no cadence makes it stale', () => {
  for (const cadence of [1, 30, 180, 365]) {
    assert.equal(evaluate(undefined, cadence, AS_OF).status, 'unverified');
  }
});

// The defect this whole file exists to prevent. The platform's gate did
// new Date("undefinedT00:00:00.000Z") -> NaN, and NaN > cadence is false, so an
// unverified citation was silently indistinguishable from a fresh one.
test('an unverified citation is never silently treated as current', () => {
  assert.notEqual(evaluate(undefined, 30, AS_OF).status, 'current');
});

test('a malformed date is rejected outright rather than read as unknown', () => {
  assert.throws(() => evaluate('', 30, AS_OF), TypeError);
  assert.throws(() => evaluate('unknown', 30, AS_OF), TypeError);
  assert.throws(() => evaluate('2026-8-3', 30, AS_OF), TypeError);
});

test('validateCurrencyShape accepts absence and rejects every other unknown', () => {
  const errors = [];
  validateCurrencyShape({ id: 'a' }, 'a.json', errors, AS_OF);
  assert.deepEqual(errors, [], 'an absent lastVerified is a legal way to say unknown');

  for (const bad of [null, '', 'unknown', 'TBD', 2026]) {
    const found = [];
    validateCurrencyShape({ id: 'a', lastVerified: bad }, 'a.json', found, AS_OF);
    assert.equal(found.length, 1, `expected ${JSON.stringify(bad)} to be rejected`);
  }
});

test('validateCurrencyShape rejects a date later than the day it was recorded', () => {
  const errors = [];
  validateCurrencyShape(
    { id: 'a', lastVerified: '2026-08-23' },
    'a.json',
    errors,
    new Date('2026-08-22T23:38:47.000Z')
  );
  assert.equal(errors.length, 1);
  assert.match(errors[0], /future/);
});

test('validateCurrencyShape checks source citations, not only the rollup', () => {
  const errors = [];
  validateCurrencyShape(
    { id: 'a', sources: [{ url: 'https://example.test/', lastVerified: null }] },
    'a.json',
    errors,
    AS_OF
  );
  assert.equal(errors.length, 1);
  assert.match(errors[0], /example\.test/);
});

// End to end over a throwaway curriculum: one stale citation must fail the run,
// one unverified module must not, and both must be named.
test('the gate fails on stale and reports-without-failing on unverified', async () => {
  const root = await mkdtemp(join(tmpdir(), 'p42-freshness-'));
  try {
    await writeFile(
      resolve(root, 'source-registry.json'),
      JSON.stringify({
        sources: [
          {
            id: 'example-docs',
            urlPrefix: 'https://example.test/docs/',
            publisher: 'Example',
            trustTier: 'primary',
            reviewCadenceDays: 30,
            owner: 'curriculum',
          },
        ],
      })
    );
    await writeFile(resolve(root, 'catalog.json'), JSON.stringify({ paths: [] }));
    await mkdir(resolve(root, 'modules'), { recursive: true });
    await mkdir(resolve(root, 'resources'), { recursive: true });

    await writeFile(
      resolve(root, 'modules/stale.json'),
      JSON.stringify({
        id: 'stale-module',
        reviewCadenceDays: 30,
        lastVerified: '2026-09-01',
        sources: [
          {
            title: 'Example docs',
            url: 'https://example.test/docs/',
            publisher: 'Example',
            lastVerified: '2026-07-01',
          },
        ],
      })
    );
    // No reviewCadenceDays, no lastVerified, and a citation with no date.
    await writeFile(
      resolve(root, 'modules/unknown.json'),
      JSON.stringify({
        id: 'unverified-module',
        sources: [
          { title: 'Example docs', url: 'https://example.test/docs/', publisher: 'Example' },
        ],
      })
    );

    const result = await checkFreshness(root, AS_OF);

    assert.equal(result.counts.stale, 1, 'the expired citation is stale');
    assert.equal(result.counts.unverified, 2, 'the undated module and its undated citation');
    assert.equal(result.failures.length, 1, 'only the stale citation fails the run');
    assert.match(result.failures[0], /stale-module/);

    assert.equal(
      result.unverified.filter((line) => line.includes('unverified-module')).length,
      2,
      'every unverified claim is named, never counted silently'
    );

    const text = report(result);
    assert.match(text, /UNVERIFIED unverified-module/);
    assert.match(text, /1 current, 0 review-due, 1 stale, 2 unverified/);
    assert.match(text, /Unverified is not stale/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

async function findJson(target) {
  const { stat, readdir } = await import('node:fs/promises');
  let info;
  try {
    info = await stat(target);
  } catch {
    return [];
  }
  if (info.isFile()) return target.endsWith('.json') ? [target] : [];
  const found = [];
  for (const entry of await readdir(target, { withFileTypes: true })) {
    found.push(...(await findJson(resolve(target, entry.name))));
  }
  return found;
}

// Guards the correction this repository's history now records: every review
// claim resolves to a registered source, lands in exactly one of the four
// states, and nothing carries the 2026-08-23 stamp the bulk bump wrote a day
// before the date it set.
test('every review claim in the shipped curriculum resolves and lands in one state', async () => {
  const root = resolve(import.meta.dirname, '..');
  const result = await checkFreshness(root, AS_OF);
  assert.equal(
    result.failures.filter((line) => line.includes('unregistered')).length,
    0,
    'every citation resolves to a registered source'
  );
  assert.ok(result.references > 700, 'the whole catalogue is covered, not a sample');

  // The bulk bump wrote 2026-08-23 in a commit authored 2026-08-22. Not one
  // record may carry that stamp again.
  const bumped = [];
  for (const dir of ['catalog.json', 'modules', 'resources', 'reference', 'resource-packs', 'training']) {
    for (const file of await findJson(resolve(root, dir))) {
      if ((await readFile(file, 'utf8')).includes('"lastVerified": "2026-08-23"')) bumped.push(file);
    }
  }
  assert.deepEqual(bumped, [], 'no file carries the bulk-bumped review date');

  assert.ok(
    result.counts.current + result.counts['review-due'] + result.counts.stale + result.counts.unverified ===
      result.references,
    'every review claim lands in exactly one of the four states'
  );
});
