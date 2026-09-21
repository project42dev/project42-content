function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

export function sanitizeTrace(trace) {
  const sanitized = cloneJson(trace);

  for (const span of sanitized.spans) {
    if (span.operation === "approval" && span.attributes?.toolArgs) {
      // DELIBERATE DEFECT: approval argument values are exported unchanged.
      // Replace toolArgs with a safe field-name summary without changing
      // any other trace or span data.
      span.attributes.toolArgs = span.attributes.toolArgs;
    }
  }

  return sanitized;
}
