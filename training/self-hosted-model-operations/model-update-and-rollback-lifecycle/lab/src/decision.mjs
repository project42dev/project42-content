// Deliberate single defect: recovery failures are excluded from failedGates.
export function decidePromotion(packet) {
  const failedGates = packet.gates
    .filter((gate) => gate.name !== 'recovery' && gate.status !== 'pass')
    .map((gate) => gate.name);
  return {
    decision: failedGates.length === 0 ? 'promote' : 'reject',
    failedGates,
    rollbackCompatible: packet.rollback.rollbackCompatible
  };
}
