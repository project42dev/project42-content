import {
  ACTIONS,
  CREDENTIAL_STATUSES,
  PRINCIPAL_IDS,
  RESOURCES,
  ROLES,
  TENANTS
} from "./catalog.mjs";

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

function requireRecord(value, label) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new ValidationError(`${label} must be an object`);
  }
}

function rejectUnknownKeys(value, allowed, label) {
  for (const key of Object.keys(value)) {
    if (!allowed.includes(key)) {
      throw new ValidationError(`${label} has unknown field: ${key}`);
    }
  }
}

function requireKnownString(value, known, label) {
  if (typeof value !== "string" || !known.includes(value)) {
    throw new ValidationError(`${label} is unknown or malformed`);
  }
}

export function validatePrincipal(input) {
  requireRecord(input, "principal");
  rejectUnknownKeys(
    input,
    ["id", "tenant", "role", "authenticated", "credentialStatus"],
    "principal"
  );
  requireKnownString(input.id, PRINCIPAL_IDS, "principal.id");
  requireKnownString(input.tenant, TENANTS, "principal.tenant");
  requireKnownString(input.role, ROLES, "principal.role");
  requireKnownString(
    input.credentialStatus,
    CREDENTIAL_STATUSES,
    "principal.credentialStatus"
  );
  if (typeof input.authenticated !== "boolean") {
    throw new ValidationError("principal.authenticated must be boolean");
  }
  return Object.freeze({ ...input });
}

export function validateRequest(input) {
  requireRecord(input, "request");
  rejectUnknownKeys(
    input,
    ["action", "resourceId", "units", "content"],
    "request"
  );
  requireKnownString(input.action, ACTIONS, "request.action");
  requireKnownString(
    input.resourceId,
    Object.keys(RESOURCES),
    "request.resourceId"
  );
  if (!Number.isFinite(input.units) || !Number.isInteger(input.units)) {
    throw new ValidationError("request.units must be a finite integer");
  }
  if (input.units < 1 || input.units > 1000) {
    throw new ValidationError("request.units must be between 1 and 1000");
  }
  if (typeof input.content !== "string" || input.content.length > 500) {
    throw new ValidationError("request.content must be a string of at most 500 characters");
  }
  return Object.freeze({ ...input });
}

export function validateInputs(principalInput, requestInput) {
  const principal = validatePrincipal(principalInput);
  const request = validateRequest(requestInput);
  const resource = RESOURCES[request.resourceId];
  return Object.freeze({ principal, request, resource });
}
