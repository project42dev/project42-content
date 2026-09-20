import { readFile } from 'node:fs/promises';

try {
  const fixture = JSON.parse(await readFile('fixtures/case-results.json', 'utf8'));
  const weights = fixture.taskRubric.dimensions;
  let mismatch = false;
  for (const sample of fixture.taskSamples) {
    const total = Number(Object.entries(weights).reduce((sum, [dimension, weight]) => {
      const value = sample.answer.dimensionScores[dimension];
      if (!Number.isFinite(value) || value < 0 || value > 100) throw new TypeError(`${sample.id} has invalid ${dimension}`);
      return sum + value * weight;
    }, 0).toFixed(4));
    const matches = total === sample.answer.expectedTotal;
    mismatch ||= !matches;
    console.log(JSON.stringify({ id: sample.id, computedTotal: total, expectedTotal: sample.answer.expectedTotal, matches, rationale: sample.answer.rationale }));
  }
  process.exitCode = mismatch ? 1 : 0;
} catch (error) {
  console.error(`Sample grading error: ${error.message}`);
  process.exitCode = 2;
}
