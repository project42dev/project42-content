// Recovery copy of the deliberately defective starter.
import { evaluateWithConsentRule } from './policy-core.mjs';

export function evaluateBoundary(input) {
  return evaluateWithConsentRule(input, consent => Boolean(consent.approvedClientId));
}
