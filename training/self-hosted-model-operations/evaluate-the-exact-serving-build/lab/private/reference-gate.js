import { pathToFileURL } from 'node:url';
import { loadDossier } from '../src/validation.js';

export function decide(a) {
  const reasons = [];
  if (!a.identityMatches) reasons.push('identity-mismatch');
  if (!a.denominatorMatches) reasons.push('denominator-mismatch');
  if (!a.evidenceComplete) reasons.push('evidence-incomplete');
  if (a.aggregate < a.dossier.gate.aggregateThreshold) reasons.push('aggregate-below-threshold');
  for (const id of a.criticalFailures) reasons.push(`critical-failure:${id}`);
  if (!a.serviceObjectivesMet) reasons.push('service-objective-failed');
  if (!a.recoveryMet) reasons.push('recovery-failed');
  return { disposition: reasons.length === 0 ? 'PASS' : 'REJECT', reasons };
}

export function formatDecision(a, d) {
  const base = `${d.disposition} aggregate=${(a.aggregate * 100).toFixed(2)}% criticalFailures=${a.criticalFailures.length}`;
  return d.reasons.length ? `${base} reasons=${d.reasons.join(',')}` : base;
}

export async function main(path) {
  const a = await loadDossier(path);
  const d = decide(a);
  process.stdout.write(`${formatDecision(a, d)}\n`);
  process.exitCode = d.disposition === 'PASS' ? 0 : 2;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv[2]).catch((error) => {
    process.stderr.write(`ERROR ${error.message}\n`);
    process.exitCode = 1;
  });
}
