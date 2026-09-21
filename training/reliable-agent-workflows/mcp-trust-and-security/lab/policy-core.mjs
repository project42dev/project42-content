// Shared fail-closed validation and decisions for starter and reference.
// tokenClaims must be verifier-derived in a real system. Lab objects are synthetic.

const OPERATIONS = new Set(['ADD_LABEL']);
const STATES = new Set(['NOT_DISPATCHED', 'COMPLETED', 'AFTER_WRITE']);
const RESPONSES = new Set(['NONE', 'OK', 'TIMEOUT']);
const POSTCONDITIONS = new Set(['NOT_APPLICABLE', 'CONFIRMED', 'UNKNOWN']);
const DECISIONS = new Set([
  'ALLOW', 'REJECT_MALFORMED_INPUT', 'REJECT_AUDIENCE',
  'REJECT_CONSENT_MISMATCH', 'REJECT_SCOPE', 'REJECT_TOOL_DRIFT',
  'CONTAIN_UNTRUSTED_OUTPUT', 'CONTAIN_VERIFY_POSTCONDITION'
]);

function record(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function nonempty(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function validScopeArray(value) {
  if (!Array.isArray(value) || value.length === 0) return false;
  if (!value.every(nonempty)) return false;
  return new Set(value).size === value.length;
}

function sameSet(left, right) {
  if (left.length !== right.length) return false;
  const rightSet = new Set(right);
  return left.every(value => rightSet.has(value));
}

function coherentDispatch(dispatch) {
  if (!record(dispatch) || !STATES.has(dispatch.state) || !RESPONSES.has(dispatch.response)) return false;
  if (dispatch.postcondition !== undefined && !POSTCONDITIONS.has(dispatch.postcondition)) return false;
  if (dispatch.state === 'NOT_DISPATCHED') return dispatch.response === 'NONE' && dispatch.postcondition === 'NOT_APPLICABLE';
  if (dispatch.state === 'COMPLETED') return dispatch.response === 'OK' && dispatch.postcondition === 'CONFIRMED';
  return dispatch.state === 'AFTER_WRITE' && dispatch.response === 'TIMEOUT';
}

function malformed(input) {
  if (!record(input)) return true;
  if (!nonempty(input.serverId) || !OPERATIONS.has(input.operation)) return true;
  if (!record(input.tokenClaims) || !nonempty(input.tokenClaims.aud)) return true;
  if (!record(input.consent) || !nonempty(input.consent.approvedClientId) || !nonempty(input.consent.requestingClientId)) return true;
  if (!nonempty(input.approvedToolDigest) || !nonempty(input.observedToolDigest)) return true;
  if (!validScopeArray(input.requiredScopes) || !validScopeArray(input.requestedScopes) || !validScopeArray(input.tokenClaims.scope)) return true;
  if (!record(input.result) || !coherentDispatch(input.dispatch)) return true;
  if (Object.hasOwn(input.result, 'untrustedInstructions') && !nonempty(input.result.untrustedInstructions)) return true;
  return false;
}

export function evaluateWithConsentRule(input, consentMatches) {
  let decision;
  if (typeof consentMatches !== 'function' || malformed(input)) {
    decision = 'REJECT_MALFORMED_INPUT';
  } else if (input.result.untrustedInstructions) {
    decision = 'CONTAIN_UNTRUSTED_OUTPUT';
  } else if (input.tokenClaims.aud !== input.serverId) {
    decision = 'REJECT_AUDIENCE';
  } else if (!consentMatches(input.consent)) {
    decision = 'REJECT_CONSENT_MISMATCH';
  } else if (input.requestedScopes.includes('*') || !sameSet(input.requiredScopes, input.requestedScopes) || !sameSet(input.requestedScopes, input.tokenClaims.scope)) {
    decision = 'REJECT_SCOPE';
  } else if (input.approvedToolDigest !== input.observedToolDigest) {
    decision = 'REJECT_TOOL_DRIFT';
  } else if (input.dispatch.state === 'AFTER_WRITE' && input.dispatch.response === 'TIMEOUT' && input.dispatch.postcondition !== 'CONFIRMED') {
    decision = 'CONTAIN_VERIFY_POSTCONDITION';
  } else {
    decision = 'ALLOW';
  }
  return DECISIONS.has(decision) ? decision : 'REJECT_MALFORMED_INPUT';
}
