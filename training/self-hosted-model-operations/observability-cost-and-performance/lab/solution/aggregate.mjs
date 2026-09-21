import { validateFixture, estimatePercentile } from '../src/validate.mjs';

export function aggregateP95(input) {
  const fixture = validateFixture(input);
  const combined = fixture.records[0].buckets.map((bucket) => ({ le: bucket.le, count: 0 }));
  for (const record of fixture.records) {
    for (let index = 0; index < combined.length; index += 1) combined[index].count += record.buckets[index].count;
  }
  return { p95Ms: estimatePercentile(combined, 0.95), requests: combined.at(-1).count, replicas: fixture.records.length, releaseId: fixture.identity.releaseId };
}
