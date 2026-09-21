import assert from "node:assert/strict";

const target = process.env.BRIDGE_TARGET === "reference" ? "../reference/bridge.mjs" : "../src/bridge.mjs";
const bridge = await import(target);
let pass = 0, fail = 0, skip = 0;

function openai(id, name, args) { return { type: "function_call", name, call_id: id, arguments: JSON.stringify(args) }; }
function outcome(provider, result) {
  if (provider === "openai") return JSON.parse(result.output);
  if (provider === "anthropic") return JSON.parse(result.content);
  return JSON.parse(result.result[0].text);
}
function order(provider, id, number, extra = {}) {
  const args = { order_number: number, ...extra };
  if (provider === "openai") return openai(id, "orders_get_status", args);
  if (provider === "anthropic") return { type: "tool_use", id, name: "orders_get_status", input: args };
  return { type: "function_call", id, name: "orders_get_status", arguments: args };
}
async function test(name, feedback, work) {
  try { await work(); console.log(`PASS ${name}`); pass += 1; }
  catch { console.log(`FAIL ${name}: ${feedback}`); fail += 1; }
}

const a = bridge.authenticate("signed-user-a");
const b = bridge.authenticate("signed-user-b");
const supervisor = bridge.authenticate("signed-supervisor");

await test("openai correlation", "function_call_output must preserve call_id", () => {
  const r = bridge.handle("openai", order("openai", "oa-1", "1042"), a, bridge.createState()); assert.equal(r.call_id, "oa-1");
});
await test("claude correlation", "tool_result must preserve tool_use_id", () => {
  const r = bridge.handle("anthropic", order("anthropic", "cl-1", "1042"), a, bridge.createState()); assert.equal(r.tool_use_id, "cl-1");
});
await test("gemini correlation", "function_result must preserve call_id", () => {
  const r = bridge.handle("google", order("google", "gg-1", "1042"), a, bridge.createState()); assert.equal(r.call_id, "gg-1");
});
await test("unknown argument rejected", "closed contracts must reject extra fields", () => {
  const r = bridge.handle("openai", order("openai", "oa-2", "1042", { debug: true }), a, bridge.createState()); assert.equal(outcome("openai", r).code, "INVALID_ARGUMENTS");
});
await test("model identity rejected", "account_id must not be accepted from model arguments", () => {
  const r = bridge.handle("openai", order("openai", "oa-3", "1042", { account_id: "acct-b" }), a, bridge.createState()); assert.equal(outcome("openai", r).code, "INVALID_ARGUMENTS");
});
await test("malformed order rejected", "order_number must be exactly 4-6 digits", () => {
  const r = bridge.handle("openai", order("openai", "oa-4", "1 OR 1=1"), a, bridge.createState()); assert.equal(outcome("openai", r).code, "INVALID_ARGUMENTS");
});
await test("tenant A overlapping order", "tenant A should receive its packed order", () => {
  const r = bridge.handle("openai", order("openai", "oa-5", "1042"), a, bridge.createState()); assert.equal(outcome("openai", r).data.status, "packed");
});
await test("tenant B overlapping order", "lookup must follow authenticated account, not the first overlapping ID", () => {
  const r = bridge.handle("openai", order("openai", "oa-6", "1042"), b, bridge.createState()); assert.equal(outcome("openai", r).data.status, "shipped");
});
await test("changed-input isolation", "tenant A must not see tenant B order 9001", () => {
  const r = bridge.handle("openai", order("openai", "oa-7", "9001"), a, bridge.createState()); assert.equal(outcome("openai", r).code, "NOT_FOUND");
});
await test("unknown tool is an error", "unknown tools must never become success", () => {
  const r = bridge.handle("openai", openai("oa-8", "run_sql", { query: "SELECT 1" }), a, bridge.createState()); assert.equal(outcome("openai", r).code, "UNKNOWN_TOOL");
});
await test("independent approval and mutation", "same-actor approval must fail and approved route must apply once", () => {
  const state = bridge.createState(); assert.throws(() => bridge.approveComment(state, b, b, "T-7", "Approved reply"));
  bridge.approveComment(state, supervisor, b, "T-7", "Approved reply");
  const wire = openai("mut-1", "helpdesk_tickets", { action: "add_comment", ticket_id: "T-7", comment: "Approved reply" });
  assert.equal(outcome("openai", bridge.handle("openai", wire, b, state)).code, "COMMENT_ADDED"); assert.equal(state.comments.length, 1);
});
await test("at-most-once retry", "same trusted call_id must not repeat the effect", () => {
  const state = bridge.createState(); bridge.approveComment(state, supervisor, b, "T-7", "Once");
  const wire = openai("mut-2", "helpdesk_tickets", { action: "add_comment", ticket_id: "T-7", comment: "Once" });
  bridge.handle("openai", wire, b, state); bridge.handle("openai", wire, b, state); assert.equal(state.comments.length, 1); assert.equal(state.mutations, 1);
});
await test("call budget", "fifth dispatch must return CALL_BUDGET_EXCEEDED", () => {
  const state = bridge.createState(); for (let i = 0; i < 4; i += 1) bridge.handle("openai", order("openai", `budget-${i}`, "1042"), a, state);
  const r = bridge.handle("openai", order("openai", "budget-4", "1042"), a, state); assert.equal(outcome("openai", r).code, "CALL_BUDGET_EXCEEDED");
});

console.log(`SUMMARY pass=${pass} fail=${fail} skip=${skip}`);
process.exitCode = fail === 0 ? 0 : 1;
