import { validateAndPrepare, acceptedResult } from '../shared/validate.mjs';

export function evaluateHandoff(packet, policy) {
  const prepared = validateAndPrepare(packet, policy);
  if (prepared.terminal) return prepared.terminal;

  const recipientAllowed = new Set(prepared.policy.recipientAllowed);
  const denied = new Set(prepared.packet.deniedActions);
  const effectiveActions = prepared.packet.allowedActions.filter(
    (action) => recipientAllowed.has(action) && !denied.has(action)
  );

  return acceptedResult(prepared.packet, prepared.remainingTurns, effectiveActions);
}
