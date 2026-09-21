import { validateInputs } from "../lib/validators.mjs";
import {
  ACTION_UNIT_LIMITS,
  ROLE_ACTIONS,
  decision
} from "../lib/policy.mjs";

export function authorize(principalInput, requestInput) {
  const validated = validateInputs(principalInput, requestInput);
  const principal = validated.principal;
  const request = validated.request;
  const resource = validated.resource;

  if (principal.authenticated !== true) {
    return decision(false, "unauthenticated", principal, request);
  }

  if (principal.credentialStatus !== "active") {
    return decision(false, "credential_inactive", principal, request);
  }

  const permittedActions = ROLE_ACTIONS[principal.role];
  if (!permittedActions.includes(request.action)) {
    return decision(false, "action_not_allowed", principal, request);
  }

  if (principal.tenant !== resource.tenant) {
    return decision(false, "scope_mismatch", principal, request);
  }

  const unitLimit = ACTION_UNIT_LIMITS[request.action];
  if (request.units > unitLimit) {
    return decision(false, "resource_limit", principal, request);
  }

  return decision(true, "authorized", principal, request);
}
