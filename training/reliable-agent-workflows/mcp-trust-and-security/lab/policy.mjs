// Deliberately defective starter. Repair only this consent predicate.
import { evaluateWithConsentRule } from './policy-core.mjs';

export function evaluateBoundary(input) {
  // DEFECT: Presence is not identity binding.
  return evaluateWithConsentRule(input, consent => Boolean(consent.approvedClientId));
}
