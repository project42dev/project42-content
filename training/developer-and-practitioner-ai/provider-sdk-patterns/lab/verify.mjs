import { readFile } from "node:fs/promises";
import { isDeepStrictEqual } from "node:util";
import { adaptOpenAIResponse } from "./adapter.mjs";

const fixtureUrl = new URL("./fixtures/openai-responses-incomplete.json", import.meta.url);
const fixture = JSON.parse(await readFile(fixtureUrl, "utf8"));

const metadataValid = fixture.fixtureMetadata?.provider === "openai" &&
  fixture.fixtureMetadata?.interface === "OpenAI Responses API" &&
  fixture.fixtureMetadata?.fixtureSchemaVersion === 1 &&
  fixture.fixtureMetadata?.simulationOnly === true;

if (!metadataValid) {
  console.log("FAIL fixture-metadata: provider, interface, version, or simulation marker changed");
  console.log("RESULT 0 passed, 1 failed");
  process.exitCode = 1;
} else {
  const call = (overrides = {}) => ({
    type: "function_call",
    call_id: "call_1",
    name: "refund",
    arguments: "{}",
    ...overrides
  });
  const message = (text = "Inspection complete.") => ({
    type: "message",
    role: "assistant",
    content: [{ type: "output_text", text }]
  });

  const incomplete = structuredClone(fixture.response);
  incomplete.id = "resp_independent_changed_id";

  const cases = [
    {
      name: "fixture-incomplete-tool-hidden",
      input: incomplete,
      expected: { outcome: "truncated", text: "Draft: inspect the", toolCalls: [], rawStop: "max_output_tokens" }
    },
    {
      name: "completed-message",
      input: { status: "completed", output: [message()], usage: {} },
      expected: { outcome: "complete", text: "Inspection complete.", toolCalls: [], rawStop: "completed" }
    },
    {
      name: "completed-refusal",
      input: { status: "completed", output: [{ type: "message", role: "assistant", content: [{ type: "refusal", refusal: "I cannot help with that." }] }], usage: {} },
      expected: { outcome: "refused", text: "", toolCalls: [], rawStop: "completed" }
    },
    {
      name: "completed-tool-request",
      input: { status: "completed", output: [call()], usage: {} },
      expected: { outcome: "tool_request", text: "", toolCalls: [{ id: "call_1", name: "refund", args: "{}" }], rawStop: "completed" }
    },
    ...["in_progress", "queued", "failed", "cancelled"].map((status) => ({
      name: `${status.replace("_", "-")}-tool-hidden`,
      input: { status, output: [call()], usage: {} },
      expected: { outcome: "other", text: "", toolCalls: [], rawStop: status }
    })),
    {
      name: "missing-call-id",
      input: { status: "completed", output: [call({ call_id: undefined })], usage: {} },
      expected: { outcome: "other", text: "", toolCalls: [], rawStop: "completed" }
    },
    {
      name: "item-id-is-not-call-id",
      input: { status: "completed", output: [call({ call_id: undefined, id: "item_1" })], usage: {} },
      expected: { outcome: "other", text: "", toolCalls: [], rawStop: "completed" }
    },
    {
      name: "malformed-null-envelope",
      input: null,
      expected: { outcome: "other", text: "", toolCalls: [], rawStop: null }
    },
    {
      name: "malformed-output-object",
      input: { status: "completed", output: {}, usage: {} },
      expected: { outcome: "other", text: "", toolCalls: [], rawStop: "completed" }
    },
    {
      name: "malformed-null-item",
      input: { status: "completed", output: [null], usage: {} },
      expected: { outcome: "other", text: "", toolCalls: [], rawStop: "completed" }
    },
    {
      name: "malformed-content-object",
      input: { status: "completed", output: [{ type: "message", content: {} }], usage: {} },
      expected: { outcome: "other", text: "", toolCalls: [], rawStop: "completed" }
    },
    {
      name: "malformed-null-part",
      input: { status: "completed", output: [{ type: "message", content: [null] }], usage: {} },
      expected: { outcome: "other", text: "", toolCalls: [], rawStop: "completed" }
    },
    {
      name: "partial-message-unknown-status",
      input: { status: "future_status", output: [message("Partial diagnostic")], usage: {} },
      expected: { outcome: "other", text: "Partial diagnostic", toolCalls: [], rawStop: "future_status" }
    },
    {
      name: "incomplete-unknown-reason",
      input: { status: "incomplete", incomplete_details: { reason: "future_reason" }, output: [message("Partial")], usage: {} },
      expected: { outcome: "other", text: "Partial", toolCalls: [], rawStop: "future_reason" }
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of cases) {
    let result;
    try {
      result = adaptOpenAIResponse(test.input);
    } catch (error) {
      console.log(`FAIL ${test.name}: threw ${error?.name ?? "Error"}`);
      failed += 1;
      continue;
    }

    const actual = {
      outcome: result.outcome,
      text: result.text,
      toolCalls: result.toolCalls,
      rawStop: result.rawStop
    };

    if (isDeepStrictEqual(actual, test.expected)) {
      console.log(`PASS ${test.name}`);
      passed += 1;
    } else if (test.name === "fixture-incomplete-tool-hidden") {
      console.log(`FAIL ${test.name}: expected ${test.expected.outcome} with ${test.expected.toolCalls.length} tool calls, received ${actual.outcome} with ${actual.toolCalls.length} tool calls`);
      failed += 1;
    } else {
      console.log(`FAIL ${test.name}: expected ${JSON.stringify(test.expected)}, received ${JSON.stringify(actual)}`);
      failed += 1;
    }
  }

  console.log(`RESULT ${passed} passed, ${failed} failed`);
  process.exitCode = failed === 0 ? 0 : 1;
}
