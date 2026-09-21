function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

export function sanitizeTrace(trace) {
  const sanitized = cloneJson(trace);

  for (const span of sanitized.spans) {
    if (span.operation === "approval" && span.attributes?.toolArgs) {
      span.attributes.toolArgs = {
        fields: Object.keys(span.attributes.toolArgs).sort(),
        redacted: true
      };
    }
  }

  return sanitized;
}
