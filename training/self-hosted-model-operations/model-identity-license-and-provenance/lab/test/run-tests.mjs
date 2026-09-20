import { spawnSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { dirname, resolve, win32 } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isArtifactPathContained } from '../src/assess.mjs';

const labRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const mode = process.argv[2];
if (!['starter','learner','reference'].includes(mode)) {
  process.stderr.write('usage: node test/run-tests.mjs starter|learner|reference\n');
  process.exit(2);
}
const env = { ...process.env, ...(mode === 'reference' ? { P42_DECIDER: 'reference' } : {}) };
const positive = JSON.parse(await readFile(resolve(labRoot, 'fixtures/positive.json'), 'utf8'));
const scratchRoot = resolve(labRoot, 'test-scratch');
const boundaryCanary = resolve(scratchRoot, 'boundary-canary.txt');
await rm(scratchRoot, { recursive: true, force: true });
await mkdir(scratchRoot, { recursive: true });
await writeFile(boundaryCanary, 'abc');
let passed = 0;
let failed = 0;
let skipped = 0;
const results = [];

function clone(value) { return JSON.parse(JSON.stringify(value)); }
function record(name, ok, detail = '') { results.push({ name, ok, detail, skipped: false }); }
function recordSkip(name, detail) { results.push({ name, ok: false, detail, skipped: true }); }
function runCli(fixture, asOf = '2026-09-20') {
  const run = spawnSync(process.execPath, ['src/cli.mjs', fixture, '--as-of', asOf], { cwd: labRoot, encoding: 'utf8', env });
  if (run.error) throw run.error;
  if (run.signal) throw new Error(`CLI terminated by ${run.signal}`);
  return run;
}
function expectDisposition(name, fixture, asOf, expected) {
  try {
    const run = runCli(fixture, asOf);
    if (run.status !== 0) throw new Error(`CLI exited ${run.status}: ${run.stderr.trim()}`);
    const output = JSON.parse(run.stdout);
    record(name, output.disposition === expected, `expected ${expected}, got ${String(output.disposition)}`);
  } catch (error) { record(name, false, `unexpected exception: ${error instanceof Error ? error.message : String(error)}`); }
}
async function withFixture(mutator, action) {
  const directory = await mkdtemp(resolve(scratchRoot, 'p42-dossier-'));
  const path = resolve(directory, 'probe.json');
  const value = clone(positive); mutator(value); await writeFile(path, JSON.stringify(value));
  try { await action(path); } finally { await rm(directory, { recursive: true, force: true }); }
}
async function expectValidation(name, mutator, substring) {
  try {
    await withFixture(mutator, async path => {
      const run = runCli(path);
      const ok = run.status === 2 && run.stderr.includes(substring);
      record(name, ok, `expected exit 2 containing ${substring}; got exit ${run.status}: ${run.stderr.trim()}`);
    });
  } catch (error) { record(name, false, `unexpected exception: ${error instanceof Error ? error.message : String(error)}`); }
}

expectDisposition('positive-before-expiry', 'fixtures/positive.json', '2026-09-20', 'approve-isolated-evaluation');
expectDisposition('hold-contradiction', 'fixtures/hold.json', '2026-09-20', 'hold-for-evidence');
expectDisposition('reject-prohibition', 'fixtures/reject.json', '2026-09-20', 'reject');
expectDisposition('changed-distribution', 'fixtures/changeduse.json', '2026-09-20', 'hold-for-evidence');
expectDisposition('positive-day-before-expiry', 'fixtures/positive.json', '2026-10-19', 'approve-isolated-evaluation');
expectDisposition('positive-on-expiry', 'fixtures/positive.json', '2026-10-20', 'hold-for-evidence');
expectDisposition('positive-after-expiry', 'fixtures/positive.json', '2026-10-21', 'hold-for-evidence');
await expectValidation('invalid-decision-date', d => { d.decision.date = '2026-02-30'; }, 'decision.date: expected real calendar date');
try { const run = runCli('fixtures/positive.json', '2026-02-30'); record('invalid-as-of-date', run.status === 2 && run.stderr.includes('asOf: expected real calendar date'), `expected invalid asOf failure; got exit ${run.status}: ${run.stderr.trim()}`); } catch (error) { record('invalid-as-of-date', false, `unexpected exception: ${error instanceof Error ? error.message : String(error)}`); }
try { const run = runCli('fixtures/positive.json', '2020-01-01'); record('as-of-before-decision', run.status === 2 && run.stderr.includes('asOf: must be on or after decision.date'), `expected temporal validation failure; got exit ${run.status}: ${run.stderr.trim()}`); } catch (error) { record('as-of-before-decision', false, `unexpected exception: ${error instanceof Error ? error.message : String(error)}`); }
await expectValidation('stale-proposed-use', d => { d.proposed.use = 'changed-purpose'; }, 'must equal proposed.use');
await expectValidation('stale-proposed-users', d => { d.proposed.users = 'employees'; }, 'must equal proposed.users');
await expectValidation('stale-proposed-distribution', d => { d.proposed.distribution = 'internal-service'; }, 'must equal proposed.distribution');
await expectValidation('empty-matrix', d => { d.terms.matrix = []; }, 'expected use, distribution, and users rows');
await expectValidation('outside-artifacts', d => { d.identity.weights.file = 'test-scratch/boundary-canary.txt'; d.identity.weights.bytes = 3; d.identity.weights.sha256 = 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'; }, 'must resolve beneath');
record('windows-different-drive', !isArtifactPathContained('D:\\artifacts', 'C:\\path', win32), 'expected a different-drive Windows path to be outside the artifact root');
try {
  const link = resolve(labRoot, 'artifacts', '.boundary-link');
  try {
    await rm(link, { force: true });
    await symlink(boundaryCanary, link);
    await expectValidation('symlink-escape', d => { d.identity.weights.file = 'artifacts/.boundary-link'; }, 'must resolve beneath');
  } catch (error) {
    if (error && ['EPERM','ENOTSUP'].includes(error.code)) recordSkip('symlink-escape', `platform does not support this symlink probe: ${error.code}`);
    else throw error;
  } finally { await rm(link, { force: true }); }
} catch (error) { record('symlink-escape', false, `unexpected exception: ${error instanceof Error ? error.message : String(error)}`); }

await rm(scratchRoot, { recursive: true, force: true });
for (const result of results) {
  if (result.skipped) { process.stdout.write(`SKIP ${result.name}: ${result.detail}\n`); skipped += 1; }
  else if (result.ok) { process.stdout.write(`PASS ${result.name}\n`); passed += 1; }
  else { process.stdout.write(`FAIL ${result.name}: ${result.detail}\n`); failed += 1; }
}
process.stdout.write(`${passed} passed; ${failed} failed; ${skipped} skipped\n`);
if (failed > 0) process.exitCode = 1;
