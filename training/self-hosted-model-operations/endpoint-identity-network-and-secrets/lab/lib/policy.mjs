export const ROLE_ACTIONS = Object.freeze({
  invoker: Object.freeze(["invoke", "discover"]),
  operator: Object.freeze(["configure", "observe"]),
  promoter: Object.freeze(["promote"]),
  approver: Object.freeze(["approve"]),
  security: Object.freeze(["rotate", "revoke"]),
  recovery: Object.freeze(["recover"]),
  observer: Object.freeze(["observe"])
});

export const ACTION_UNIT_LIMITS = Object.freeze({
  invoke: 8,
  discover: 2,
  configure: 1,
  promote: 1,
  observe: 2,
  approve: 1,
  rotate: 1,
  revoke: 1,
  recover: 1
});

export function decision(allowed, reason, principal, request) {
  return Object.freeze({
    allowed,
    reason,
    audit: Object.freeze({
      principalId: principal.id,
      tenant: principal.tenant,
      action: request.action,
      resourceId: request.resourceId,
      units: request.units,
      outcome: allowed ? "allow" : "deny",
      reason
    })
  });
}
