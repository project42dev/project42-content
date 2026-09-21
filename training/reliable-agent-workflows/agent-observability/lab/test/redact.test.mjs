import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { sanitizeTrace } from "../redact.mjs";

async function loadFixture(name) {
  const url = new URL(`../data/${name}`, import.meta.url);
  return JSON.parse(await readFile(fileURLToPath(url), "utf8"));
}

function approval(trace) {
  return trace.spans.find((span) => span.operation === "approval");
}

function scalarValues(value) {
  if (value !== null && typeof value === "object") {
    return Object.values(value).flatMap(scalarValues);
  }
  return [String(value)];
}

test("baseline redacts approval values and preserves diagnostic structure", async () => {
  const source = await loadFixture("failed-trace.json");
  const before = JSON.stringify(source);
  const result = sanitizeTrace(source);

  assert.notStrictEqual(result, source);
  assert.equal(JSON.stringify(source), before, "sanitizer must not mutate its input");
  assert.equal(result.traceId, "tr_demo_7");
  assert.equal(result.spans.length, 8);
  assert.deepEqual(
    result.spans.map(({ spanId, parentSpanId, operation, status }) => ({
      spanId,
      parentSpanId,
      operation,
      status
    })),
    source.spans.map(({ spanId, parentSpanId, operation, status }) => ({
      spanId,
      parentSpanId,
      operation,
      status
    }))
  );
  assert.deepEqual(approval(result).attributes.toolArgs, {
    fields: ["accountId", "apiKey", "destination"],
    redacted: true
  });
  assert.equal(approval(result).attributes.decision, "denied");
  assert.equal(result.spans.find((span) => span.operation === "model").attributes.modelId, "fixture-model-v1");

  const exported = JSON.stringify(result);
  for (const value of scalarValues(approval(source).attributes.toolArgs)) {
    assert.equal(exported.includes(value), false, `leaked baseline value: ${value}`);
  }
});

test("changed input is generalized and deny-all output is rejected", async () => {
  const source = await loadFixture("changed-trace.json");
  const before = JSON.stringify(source);
  const result = sanitizeTrace(source);

  assert.equal(JSON.stringify(source), before, "changed fixture was mutated");
  assert.equal(result.traceId, "tr_changed_42");
  assert.equal(result.spans.length, 2, "all spans must remain available");
  assert.deepEqual(approval(result).attributes.toolArgs, {
    fields: ["nested", "recipient", "token"],
    redacted: true
  });
  assert.equal(approval(result).spanId, "sp_changed_approval");
  assert.equal(approval(result).parentSpanId, "sp_changed_agent");
  assert.equal(approval(result).status, "error");
  assert.equal(result.spans[0].attributes.modelId, "fixture-model-v2");

  const exported = JSON.stringify(result);
  for (const value of scalarValues(approval(source).attributes.toolArgs)) {
    assert.equal(exported.includes(value), false, `leaked changed value: ${value}`);
  }
});
