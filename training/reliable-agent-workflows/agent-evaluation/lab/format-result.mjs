const orderedSlices = ['representative', 'boundary', 'adversarial', 'regression'];

export function formatResult(result) {
  const sliceText = orderedSlices
    .map((slice) => `${slice}=${result.sliceMeans[slice].toFixed(2)}`)
    .join(', ');
  return [
    `Decision: ${result.decision}`,
    `Average: ${result.average.toFixed(2)}`,
    `Slice means: ${sliceText}`,
    `Critical failures: ${result.criticalFailures.length ? result.criticalFailures.join(', ') : 'none'}`,
    `Reasons: ${result.reasons.length ? result.reasons.join(' | ') : 'none'}`
  ].join('\n');
}
