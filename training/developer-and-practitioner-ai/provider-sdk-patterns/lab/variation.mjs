import { readFile } from "node:fs/promises";
import { adaptOpenAIResponse } from "./adapter.mjs";

const fixtureUrl = new URL("./fixtures/openai-responses-incomplete.json", import.meta.url);
const fixture = JSON.parse(await readFile(fixtureUrl, "utf8"));
const changed = structuredClone(fixture.response);
changed.id = "resp_independent_changed_reason";
changed.incomplete_details.reason = "content_filter";
changed.output[0].content[0].text = "Different partial text";
changed.output[1].call_id = "call_independent_refund";

const result = adaptOpenAIResponse(changed);
const passed = result.outcome === "other" &&
  result.text === "Different partial text" &&
  result.rawStop === "content_filter" &&
  Array.isArray(result.toolCalls) &&
  result.toolCalls.length === 0;

if (passed) {
  console.log(`PASS changed-reason: outcome ${result.outcome}, text ${result.text}, rawStop ${result.rawStop}, toolCalls ${result.toolCalls.length}`);
  console.log("RESULT 1 passed, 0 failed");
  process.exitCode = 0;
} else {
  console.log(`FAIL changed-reason: outcome ${result.outcome}, text ${result.text}, rawStop ${result.rawStop}, toolCalls ${Array.isArray(result.toolCalls) ? result.toolCalls.length : "invalid"}`);
  console.log("RESULT 0 passed, 1 failed");
  process.exitCode = 1;
}
