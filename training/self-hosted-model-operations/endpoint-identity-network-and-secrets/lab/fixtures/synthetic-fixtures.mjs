export const principals = Object.freeze({
  userRed: Object.freeze({
    id: "user-red",
    tenant: "tenant-red",
    role: "invoker",
    authenticated: true,
    credentialStatus: "active"
  }),
  userBlue: Object.freeze({
    id: "user-blue",
    tenant: "tenant-blue",
    role: "invoker",
    authenticated: true,
    credentialStatus: "active"
  }),
  operatorRed: Object.freeze({
    id: "operator-red",
    tenant: "tenant-red",
    role: "operator",
    authenticated: true,
    credentialStatus: "active"
  }),
  recoveryRed: Object.freeze({
    id: "recovery-red",
    tenant: "tenant-red",
    role: "recovery",
    authenticated: true,
    credentialStatus: "active"
  }),
  revokedRed: Object.freeze({
    id: "revoked-red",
    tenant: "tenant-red",
    role: "invoker",
    authenticated: true,
    credentialStatus: "revoked"
  })
});

export function request(overrides = {}) {
  return {
    action: "invoke",
    resourceId: "endpoint-red",
    units: 4,
    content: "Synthetic request content.",
    ...overrides
  };
}
