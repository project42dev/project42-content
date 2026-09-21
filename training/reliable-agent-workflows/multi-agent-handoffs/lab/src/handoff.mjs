import { validateAndPrepare, acceptedResult } from '../shared/validate.mjs';

export function evaluateHandoff(packet, policy) {
  const prepared = validateAndPrepare(packet, policy);
  if (prepared.terminal) return prepared.terminal;

  // DELIBERATE DEFECT: sender-requested actions bypass recipient reauthorization.
  const effectiveActions = [...prepared.packet.allowedActions];

  return acceptedResult(prepared.packet, prepared.remainingTurns, effectiveActions);
}
