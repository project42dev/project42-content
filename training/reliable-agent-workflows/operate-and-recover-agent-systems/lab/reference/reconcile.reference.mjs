export function reconcileAction(action, state) {
  const matches = state.entries.filter(
    (entry) => entry.idempotencyKey === action.idempotencyKey
  );

  if (matches.length === 0) {
    return { status: 'MISSING' };
  }

  const [entry] = matches;
  if (entry.status === 'confirmed') {
    return { status: 'CONFIRMED', entryId: entry.entryId };
  }

  return { status: 'UNKNOWN', entryId: entry.entryId };
}
