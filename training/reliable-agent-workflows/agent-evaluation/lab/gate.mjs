import { assertValidEvaluationInput, meanFinite } from './schema-validation.mjs';

export function evaluateRelease(cases, thresholds, options = {}) {
  assertValidEvaluationInput(cases, thresholds, options);

  const average = meanFinite(cases.map((testCase) => testCase.candidate.total));
  const sliceNames = [...new Set(cases.map((testCase) => testCase.slice))];
  const sliceMeans = Object.fromEntries(
    sliceNames.map((slice) => [
      slice,
      meanFinite(cases.filter((testCase) => testCase.slice === slice).map((testCase) => testCase.candidate.total))
    ])
  );
  const criticalFailures = cases
    .filter((testCase) => testCase.candidate.criticalPolicyFailure)
    .map((testCase) => testCase.id);

  const reasons = [];
  if (average < thresholds.minAverage) {
    reasons.push(`Average ${average.toFixed(2)} is below ${thresholds.minAverage.toFixed(2)}`);
  }
  for (const [slice, sliceMean] of Object.entries(sliceMeans)) {
    if (sliceMean < thresholds.minSliceMean) {
      reasons.push(`Slice ${slice} mean ${sliceMean.toFixed(2)} is below ${thresholds.minSliceMean.toFixed(2)}`);
    }
  }

  // DELIBERATE LEARNER DEFECT: add the zero-tolerance critical-policy condition here.

  return {
    decision: reasons.length === 0 ? 'SHIP' : 'HOLD',
    average,
    sliceMeans,
    criticalFailures,
    reasons
  };
}
