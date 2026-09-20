import { assessGates, scoreCandidate, sortRanking, unknownMetrics, validateInputs } from '../src/core.js';

export function evaluate(candidates, requirements) {
  validateInputs(candidates, requirements);

  const assessed = candidates.map(candidate => ({
    candidate,
    gate: assessGates(candidate, requirements.requiredGates)
  }));

  const eligible = assessed.filter(row => row.gate.eligible);
  const ranking = sortRanking(eligible
    .filter(row => unknownMetrics(row.candidate, requirements.weights).length === 0)
    .map(row => scoreCandidate(row.candidate, requirements.weights)));

  const disqualified = assessed
    .filter(row => !row.gate.eligible)
    .map(row => ({
      id: row.candidate.id,
      label: row.candidate.label ?? row.candidate.id,
      failedGates: row.gate.failedGates,
      unknownGates: row.gate.unknownGates
    }))
    .sort((a, b) => a.id.localeCompare(b.id));

  const insufficientEvidence = eligible
    .map(row => ({
      id: row.candidate.id,
      label: row.candidate.label ?? row.candidate.id,
      unknownMetrics: unknownMetrics(row.candidate, requirements.weights)
    }))
    .filter(row => row.unknownMetrics.length > 0)
    .sort((a, b) => a.id.localeCompare(b.id));

  return { ranking, disqualified, insufficientEvidence };
}
