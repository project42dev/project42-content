import { validateInputs } from "../lib/validators.mjs";
import {
  ACTION_UNIT_LIMITS,
  ROLE_ACTIONS,
  decision
} from "../lib/policy.mjs";

export function authorize(principalInput, requestInput) {
  const { principal, request } = validateInputs(principalInput, requestInput);

  if (!principal.authenticated) {
    return decision(false, "unauthenticated", principal, request);
  }
  if (principal.credentialStatus !== "active") {
    return decision(false, "credential_inactive", principal, request);
  }
  if (!ROLE_ACTIONS[principal.role].includes(request.action)) {
    return decision(false, "action_not_allowed", principal, request);
  }

  // DEFECT: role permission is checked, but tenant/resource scope is omitted.

  if (request.units > ACTION_UNIT_LIMITS[request.action]) {
    return decision(false, "resource_limit", principal, request);
  }
  return decision(true, "authorized", principal, request);
}
