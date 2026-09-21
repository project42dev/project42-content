import {readFile, mkdir, rm, writeFile} from 'node:fs/promises';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {dirname, resolve} from 'node:path';
import {validateFixtureDocument} from '../lib/contracts.mjs';
import {replayCase} from '../lib/replay.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const labRoot = resolve(here, '..');
const targetArg = process.argv.find((arg) => arg.startsWith('--target='));
const target = targetArg?.slice('--target='.length);
if (!new Set(['starter', 'reference']).has(target)) {
  console.error('USAGE --target=starter|reference');
  process.exitCode = 2;
} else {
  await run(target);
}

async function run(selectedTarget) {
  const fixturePath = resolve(labRoot, 'fixtures/cases.json');
  const document = JSON.parse(await readFile(fixturePath, 'utf8'));
  validateFixtureDocument(document);

  const modulePath = resolve(labRoot, selectedTarget, 'authorize.mjs');
  const {authorize} = await import(`${pathToFileURL(modulePath).href}?run=${Date.now()}`);
  if (typeof authorize !== 'function') throw new Error('authorize export is required');

  const scratch = resolve(labRoot, 'test-scratch');
  await rm(scratch, {recursive: true, force: true});
  await mkdir(scratch, {recursive: true});

  const results = [];
  let passed = 0;
  let failed = 0;
  let skipped = 0;
  const counts = {
    static: {total: 0, unsafe: 0},
    adaptive: {total: 0, unsafe: 0}
  };

  for (const testCase of document.cases) {
    counts[testCase.mode].total += 1;
    let observed;
    let exception = null;
    try {
      observed = await replayCase(testCase, authorize);
    } catch (error) {
      exception = error instanceof Error ? error.message : String(error);
      observed = {decision: 'EXCEPTION', stateChanges: 0, toolCalls: 0, protectedExposed: false};
    }

    const unsafe = testCase.expected.decision === 'DENY' && (
      observed.decision === 'ALLOW' || observed.stateChanges !== 0 || observed.toolCalls !== 0 || observed.protectedExposed === true
    );
    if (unsafe) counts[testCase.mode].unsafe += 1;

    const matches = exception === null &&
      observed.decision === testCase.expected.decision &&
      observed.stateChanges === testCase.expected.stateChanges &&
      observed.toolCalls === testCase.expected.toolCalls &&
      observed.protectedExposed === testCase.expected.protectedExposed;

    if (matches) {
      passed += 1;
    } else {
      failed += 1;
      if (exception !== null) {
        console.log(`FAIL ${testCase.id} exception=${JSON.stringify(exception)}`);
      } else {
        console.log(`FAIL ${testCase.id} decision=${observed.decision} stateChanges=${observed.stateChanges} toolCalls=${observed.toolCalls} protectedExposed=${observed.protectedExposed}`);
      }
    }
    results.push({id: testCase.id, mode: testCase.mode, expected: testCase.expected, observed, unsafe, exception});
  }

  await writeFile(resolve(scratch, 'latest-results.json'), `${JSON.stringify({target: selectedTarget, results}, null, 2)}\n`, 'utf8');

  const staticRate = rate(counts.static.unsafe, counts.static.total);
  const adaptiveRate = rate(counts.adaptive.unsafe, counts.adaptive.total);
  console.log(`RESULT cases=${document.cases.length} passed=${passed} failed=${failed} skipped=${skipped} staticUnsafe=${counts.static.unsafe}/${counts.static.total} staticFailureRate=${staticRate} adaptiveUnsafe=${counts.adaptive.unsafe}/${counts.adaptive.total} adaptiveFailureRate=${adaptiveRate}`);
  process.exitCode = failed === 0 ? 0 : 1;
}

function rate(numerator, denominator) {
  if (!Number.isSafeInteger(numerator) || !Number.isSafeInteger(denominator) || denominator <= 0 || numerator < 0 || numerator > denominator) {
    throw new Error('invalid rate operands');
  }
  return `${((numerator * 100) / denominator).toFixed(2)}%`;
}
