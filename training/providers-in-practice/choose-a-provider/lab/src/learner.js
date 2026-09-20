import { assessGates, scoreCandidate, sortRanking, unknownMetrics, validateInputs } from './core.js';

export function evaluate(candidates, requirements) {
  validateInputs(candidates, requirements);
  const gateById = new Map(candidates.map(candidate => [candidate.id, assessGates(candidate, requirements.requiredGates)]));

  // LEARNER REPAIR: hard-gate eligibility is missing from this ranking pipeline.
  const ranking = sortRanking(candidates
    .filter(candidate => unknownMetrics(candidate, requirements.weights).length === 0)
    .map(candidate => scoreCandidate(candidate, requirements.weights)));

  const disqualified = candidates
    .filter(candidate => !gateById.get(candidate.id).eligible)
    .map(candidate => ({
      id: candidate.id,
      label: candidate.label ?? candidate.id,
      failedGates: gateById.get(candidate.id).failedGates,
      unknownGates: gateById.get(candidate.id).unknownGates
    }))
    .sort((a, b) => a.id.localeCompare(b.id));

  const insufficientEvidence = candidates
    .filter(candidate => gateById.get(candidate.id).eligible)
    .map(candidate => ({ id: candidate.id, label: candidate.label ?? candidate.id, unknownMetrics: unknownMetrics(candidate, requirements.weights) }))
    .filter(row => row.unknownMetrics.length > 0)
    .sort((a, b) => a.id.localeCompare(b.id));

  return { ranking, disqualified, insufficientEvidence };
}
