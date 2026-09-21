// Repair only this function. Shared validation runs before it is called.
export function reconcileAction(action, state) {
  // DEFECT: a timeout does not prove that the system of record is missing a write.
  if (action.transport === 'timeout') {
    return { status: 'MISSING' };
  }
  return { status: 'UNKNOWN' };
}
