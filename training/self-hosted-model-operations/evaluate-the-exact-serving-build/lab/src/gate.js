import { pathToFileURL } from 'node:url';
import { loadDossier } from './validation.js';

// LEARNER DEFECT: strict shared validation is correct, but this predicate
// averages away critical, identity, evidence, denominator, service, and recovery failures.
export function decide(assessment) {
  const pass = assessment.aggregate >= assessment.dossier.gate.aggregateThreshold;
  return { disposition: pass ? 'PASS' : 'REJECT', reasons: [] };
}

export function formatDecision(assessment, decision) {
  const base = `${decision.disposition} aggregate=${(assessment.aggregate * 100).toFixed(2)}% criticalFailures=${assessment.criticalFailures.length}`;
  return decision.reasons.length ? `${base} reasons=${decision.reasons.join(',')}` : base;
}

export async function main(path) {
  const assessment = await loadDossier(path);
  const decision = decide(assessment);
  process.stdout.write(`${formatDecision(assessment, decision)}\n`);
  process.exitCode = decision.disposition === 'PASS' ? 0 : 2;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv[2]).catch((error) => {
    process.stderr.write(`ERROR ${error.message}\n`);
    process.exitCode = 1;
  });
}
