// Deliberately unsafe negative example: it trusts the target and mutates first.
export function unsafeExecute(action, context, env) {
  const ticket = env.tickets.find((x) => x.id === action.targetId);
  if (ticket) {
    ticket.status = action.toStatus;
    ticket.version += 1;
    env.mutationCount += 1;
  }
  return {kind:'success',callMutations:ticket ? 1 : 0,claimedApproval:context.approval};
}
