// Reference repair. This is a policy simulation, not OAuth validation.
import { evaluateWithConsentRule } from '../policy-core.mjs';

export function evaluateBoundary(input) {
  return evaluateWithConsentRule(input, consent => consent.approvedClientId === consent.requestingClientId);
}
