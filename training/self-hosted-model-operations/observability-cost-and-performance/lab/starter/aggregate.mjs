import { validateFixture, estimatePercentile } from '../src/validate.mjs';

export function aggregateP95(input) {
  const fixture = validateFixture(input);
  const replicaP95 = fixture.records.map((record) => estimatePercentile(record.buckets, 0.95));
  const p95Ms = replicaP95.reduce((sum, value) => sum + value, 0) / replicaP95.length;
  const requests = fixture.records.reduce((sum, record) => sum + record.buckets.at(-1).count, 0);
  return { p95Ms, requests, replicas: fixture.records.length, releaseId: fixture.identity.releaseId };
}
