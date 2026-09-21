import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { loadFixture } from '../fixture-loader.mjs';
import { formatResult } from '../format-result.mjs';
import { evaluateReleaseReference } from './gate.reference.mjs';

const referenceDirectory = fileURLToPath(new URL('.', import.meta.url));
const fixture = await loadFixture(resolve(referenceDirectory, '../fixtures/cases.json'));
const result = evaluateReleaseReference(fixture.cases, fixture.thresholds, {requireFullCaseSet: true});
console.log(formatResult(result));
process.exitCode = result.decision === 'SHIP' ? 0 : 1;
