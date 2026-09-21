import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { loadFixture } from './fixture-loader.mjs';
import { evaluateRelease } from './gate.mjs';
import { formatResult } from './format-result.mjs';
import { EvidenceValidationError } from './schema-validation.mjs';

const labDirectory = fileURLToPath(new URL('.', import.meta.url));
const fixturePath = process.argv[2] ? resolve(process.argv[2]) : resolve(labDirectory, 'fixtures/cases.json');

try {
  const fixture = await loadFixture(fixturePath);
  const result = evaluateRelease(fixture.cases, fixture.thresholds, {requireFullCaseSet: true});
  console.log(formatResult(result));
  process.exitCode = result.decision === 'SHIP' ? 0 : 1;
} catch (error) {
  if (error instanceof EvidenceValidationError || error instanceof SyntaxError) {
    console.log('Decision: HOLD');
    console.log(`Validation error: ${error.message}`);
    process.exitCode = 1;
  } else {
    throw error;
  }
}
