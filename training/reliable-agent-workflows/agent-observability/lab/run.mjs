import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { sanitizeTrace } from "./redact.mjs";

const fixtureUrl = new URL("./data/failed-trace.json", import.meta.url);
const trace = JSON.parse(await readFile(fileURLToPath(fixtureUrl), "utf8"));
const sanitized = sanitizeTrace(trace);
const approval = sanitized.spans.find((span) => span.operation === "approval");
const exported = JSON.stringify(sanitized);
const originalApproval = trace.spans.find((span) => span.operation === "approval");

function scalarValues(value) {
  if (value !== null && typeof value === "object") {
    return Object.values(value).flatMap(scalarValues);
  }
  return [String(value)];
}

const leaked = scalarValues(originalApproval.attributes.toolArgs).some((value) =>
  exported.includes(value)
);
const expectedFields = Object.keys(originalApproval.attributes.toolArgs).sort();
const summaryIsValid =
  JSON.stringify(approval.attributes.toolArgs) ===
  JSON.stringify({ fields: expectedFields, redacted: true });

console.log(`TRACE ${sanitized.traceId}`);
console.log(`APPROVAL_ARGS ${JSON.stringify(approval.attributes.toolArgs)}`);

if (!leaked && summaryIsValid) {
  console.log("RESULT PASS approval arguments redacted");
  process.exitCode = 0;
} else {
  console.log("RESULT FAIL privacy values exported");
  process.exitCode = 1;
}
