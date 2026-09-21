import {scoreOption, validateDecision} from './validation.mjs';

export function isEligibleForMandatoryConstraints(option, decision) {
  return option.dataBoundary !== 'unknown' &&
    option.dataBoundary === decision.dataBoundary &&
    option.recovery.rtoMinutes !== null &&
    option.recovery.rpoMinutes !== null &&
    option.recovery.rtoMinutes <= decision.recovery.rtoMinutes &&
    option.recovery.rpoMinutes <= decision.recovery.rpoMinutes &&
    option.owner === decision.requiredOwner;
}

export function select(decision) {
  validateDecision(decision);

  // INTENTIONAL DEFECT: attractiveness is ranked before mandatory eligibility.
  const selected = [...decision.options].sort((left, right) =>
    scoreOption(right) - scoreOption(left) || left.id.localeCompare(right.id)
  )[0];

  const eligible = isEligibleForMandatoryConstraints(selected, decision);
  return {
    selected: selected.id,
    eligible,
    reason: eligible ? 'eligible' : 'mandatory-constraints-not-met'
  };
}
