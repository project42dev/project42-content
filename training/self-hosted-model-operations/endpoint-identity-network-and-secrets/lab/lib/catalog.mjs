export const ACTIONS = Object.freeze([
  "invoke",
  "discover",
  "configure",
  "promote",
  "observe",
  "approve",
  "rotate",
  "revoke",
  "recover"
]);

export const TENANTS = Object.freeze(["tenant-red", "tenant-blue"]);

export const ROLES = Object.freeze([
  "invoker",
  "operator",
  "promoter",
  "approver",
  "security",
  "recovery",
  "observer"
]);

export const CREDENTIAL_STATUSES = Object.freeze([
  "active",
  "expired",
  "revoked"
]);

export const RESOURCES = Object.freeze({
  "endpoint-red": Object.freeze({
    id: "endpoint-red",
    tenant: "tenant-red",
    kind: "model-endpoint"
  }),
  "endpoint-blue": Object.freeze({
    id: "endpoint-blue",
    tenant: "tenant-blue",
    kind: "model-endpoint"
  })
});

export const PRINCIPAL_IDS = Object.freeze([
  "user-red",
  "user-blue",
  "operator-red",
  "promoter-red",
  "approver-red",
  "security-red",
  "recovery-red",
  "observer-red",
  "revoked-red"
]);
