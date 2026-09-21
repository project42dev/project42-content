function record(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function exactKeys(value, keys) {
  return record(value) && Object.keys(value).sort().join("|") === [...keys].sort().join("|");
}

export function parseArguments(name, input) {
  if (name === "orders_get_status") {
    if (!exactKeys(input, ["order_number"])) throw new Error("INVALID_ARGUMENTS");
    if (typeof input.order_number !== "string" || !/^\d{4,6}$/.test(input.order_number)) throw new Error("INVALID_ARGUMENTS");
    return Object.freeze({ order_number: input.order_number });
  }
  if (name === "helpdesk_tickets") {
    if (!exactKeys(input, ["action", "ticket_id", "comment"])) throw new Error("INVALID_ARGUMENTS");
    if (input.action !== "add_comment") throw new Error("INVALID_ARGUMENTS");
    if (typeof input.ticket_id !== "string" || !/^[A-Za-z0-9_-]{1,32}$/.test(input.ticket_id)) throw new Error("INVALID_ARGUMENTS");
    if (typeof input.comment !== "string" || input.comment.trim().length === 0 || input.comment.length > 200) throw new Error("INVALID_ARGUMENTS");
    return Object.freeze({ action: input.action, ticket_id: input.ticket_id, comment: input.comment });
  }
  throw new Error("UNKNOWN_TOOL");
}

export function normalizeCall(provider, wire) {
  if (provider === "openai") {
    if (!exactKeys(wire, ["type", "name", "call_id", "arguments"]) || wire.type !== "function_call" || typeof wire.call_id !== "string" || typeof wire.name !== "string" || typeof wire.arguments !== "string") throw new Error("INVALID_CALL");
    let args;
    try { args = JSON.parse(wire.arguments); } catch { throw new Error("INVALID_ARGUMENTS"); }
    return { provider, callId: wire.call_id, name: wire.name, args };
  }
  if (provider === "anthropic") {
    if (!exactKeys(wire, ["type", "id", "name", "input"]) || wire.type !== "tool_use" || typeof wire.id !== "string" || typeof wire.name !== "string") throw new Error("INVALID_CALL");
    return { provider, callId: wire.id, name: wire.name, args: wire.input };
  }
  if (provider === "google") {
    if (!exactKeys(wire, ["type", "id", "name", "arguments"]) || wire.type !== "function_call" || typeof wire.id !== "string" || typeof wire.name !== "string") throw new Error("INVALID_CALL");
    return { provider, callId: wire.id, name: wire.name, args: wire.arguments };
  }
  throw new Error("UNSUPPORTED_PROVIDER");
}

export function wrapResult(call, outcome) {
  const text = JSON.stringify(outcome);
  if (call.provider === "openai") return { type: "function_call_output", call_id: call.callId, output: text };
  if (call.provider === "anthropic") return { type: "tool_result", tool_use_id: call.callId, is_error: !outcome.ok, content: text };
  if (call.provider === "google") return { type: "function_result", name: call.name, call_id: call.callId, result: [{ type: "text", text }] };
  throw new Error("UNSUPPORTED_PROVIDER");
}
