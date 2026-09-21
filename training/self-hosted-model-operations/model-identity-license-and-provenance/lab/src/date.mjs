const DAY_MS = 86_400_000;

export function parseDate(value, path) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new TypeError(`${path}: expected YYYY-MM-DD`);
  }
  const [year, month, day] = value.split('-').map(Number);
  const instant = Date.UTC(year, month - 1, day);
  const check = new Date(instant);
  if (check.getUTCFullYear() !== year || check.getUTCMonth() + 1 !== month || check.getUTCDate() !== day) {
    throw new TypeError(`${path}: expected real calendar date`);
  }
  return instant;
}

export function expiryStatus(decisionDate, expiresAfterDays, asOf) {
  const decisionMs = parseDate(decisionDate, 'decision.date');
  const asOfMs = parseDate(asOf, 'asOf');
  if (asOfMs < decisionMs) {
    throw new TypeError('asOf: must be on or after decision.date');
  }
  const expiryMs = decisionMs + expiresAfterDays * DAY_MS;
  return { expired: asOfMs >= expiryMs, expiryDate: new Date(expiryMs).toISOString().slice(0, 10) };
}
