import {scoreOption, validateDecision} from './validation.mjs';

function satisfiesReferenceConstraints(option, decision) {
  const knownRecovery = option.recovery.rtoMinutes !== null && option.recovery.rpoMinutes !== null;
  const matchingBoundary = option.dataBoundary !== 'unknown' && option.dataBoundary === decision.dataBoundary;
  const recoveryWithinLimits = knownRecovery &&
    option.recovery.rtoMinutes <= decision.recovery.rtoMinutes &&
    option.recovery.rpoMinutes <= decision.recovery.rpoMinutes;
  const owned = option.owner === decision.requiredOwner;
  return matchingBoundary && recoveryWithinLimits && owned;
}

export function selectReference(decision) {
  validateDecision(decision);
  const candidates = [];
  for (const option of decision.options) {
    if (satisfiesReferenceConstraints(option, decision)) candidates.push(option);
  }
  if (candidates.length === 0) throw new Error('no eligible option');
  candidates.sort((left, right) =>
    scoreOption(right) - scoreOption(left) || left.id.localeCompare(right.id)
  );
  return {selected: candidates[0].id, eligible: true, reason: 'eligible'};
}
