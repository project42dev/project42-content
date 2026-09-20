import { readFile } from 'node:fs/promises';
import { evaluate as learnerEvaluate } from './learner.js';
import { evaluate as referenceEvaluate } from '../solution/reference.js';

function argument(name, fallback) {
  const prefix = `--${name}=`;
  const item = process.argv.slice(2).find(value => value.startsWith(prefix));
  return item ? item.slice(prefix.length) : fallback;
}

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

try {
  const engineName = argument('engine', 'learner');
  if (!['learner', 'reference'].includes(engineName)) throw new TypeError('engine must be learner or reference');
  const candidates = await readJson(argument('candidates', 'fixtures/candidates.json'));
  const requirements = await readJson(argument('requirements', 'fixtures/requirements.json'));
  const cases = await readJson(argument('expected', 'fixtures/case-results.json'));
  const evaluate = engineName === 'reference' ? referenceEvaluate : learnerEvaluate;
  const result = evaluate(candidates, requirements);
  console.log(JSON.stringify(result, null, 2));
  if (JSON.stringify(result) !== JSON.stringify(cases.selectionExpected)) {
    console.error('Result does not match the exact expected selection output.');
    process.exitCode = 1;
  } else {
    console.log('Result matches expected output.');
  }
} catch (error) {
  console.error(`Input or evaluation error: ${error.message}`);
  process.exitCode = 2;
}
