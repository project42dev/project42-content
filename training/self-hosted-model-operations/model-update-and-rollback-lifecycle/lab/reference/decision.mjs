// Independent defensive reference. Learner tests do not derive expected values from it.
export function decidePromotion(packet) {
  const failedGates = packet.gates.filter((gate) => gate.status !== 'pass').map((gate) => gate.name);
  if (!packet.rollback.rollbackCompatible && !failedGates.includes('recovery')) failedGates.push('recovery');
  return {
    decision: failedGates.length === 0 && packet.rollback.rollbackCompatible ? 'promote' : 'reject',
    failedGates,
    rollbackCompatible: packet.rollback.rollbackCompatible
  };
}
