import { fixture } from "../fixtures/data.mjs";
import { normalizeCall, parseArguments, wrapResult } from "./contracts.mjs";

const ROUTES = Object.freeze({ add_comment: Object.freeze({ method: "POST", kind: "ticket-comment" }) });

export function authenticate(verifiedPrincipal) {
  const principal = fixture.principals[verifiedPrincipal];
  if (!principal) throw new Error("AUTHENTICATION_REQUIRED");
  return Object.freeze({ subject: principal.subject, accountId: principal.accountId });
}

export function createState() {
  return { calls: 0, mutations: 0, approvals: new Map(), effects: new Map(), comments: [] };
}

function approvalKey(actor, args) {
  return JSON.stringify([actor.subject, actor.accountId, args.ticket_id, args.comment]);
}

export function approveComment(state, approver, actor, ticketId, comment) {
  if (approver.subject === actor.subject) throw new Error("INDEPENDENT_APPROVAL_REQUIRED");
  const args = parseArguments("helpdesk_tickets", { action: "add_comment", ticket_id: ticketId, comment });
  state.approvals.set(approvalKey(actor, args), approver.subject);
}

function lookupOrder(authenticated, args) {
  // DELIBERATE DEFECT: this lookup omits authenticated.accountId.
  return fixture.orders.find((candidate) => candidate.order_number === args.order_number);
}

function execute(call, authenticated, state) {
  if (!authenticated?.subject || !authenticated?.accountId) return { ok: false, code: "AUTHENTICATION_REQUIRED", message: "Authenticated context required." };
  if (!Number.isSafeInteger(state.calls) || state.calls < 0 || state.calls >= 4) return { ok: false, code: "CALL_BUDGET_EXCEEDED", message: "Call budget exhausted." };
  state.calls += 1;
  let args;
  try { args = parseArguments(call.name, call.args); } catch (error) {
    const code = error.message === "UNKNOWN_TOOL" ? "UNKNOWN_TOOL" : "INVALID_ARGUMENTS";
    return { ok: false, code, message: code === "UNKNOWN_TOOL" ? "Unknown tool." : "Arguments do not match the closed contract." };
  }
  if (call.name === "orders_get_status") {
    const row = lookupOrder(authenticated, args);
    if (!row) return { ok: false, code: "NOT_FOUND", message: "No matching order on this account." };
    return { ok: true, code: "OK", data: { order_number: row.order_number, status: row.status, updated_at: row.updated_at } };
  }
  const route = ROUTES[args.action];
  if (!route) return { ok: false, code: "INVALID_ARGUMENTS", message: "Action is not routed." };
  if (state.effects.has(call.callId)) return state.effects.get(call.callId);
  if (state.mutations >= 1) return { ok: false, code: "MUTATION_BUDGET_EXCEEDED", message: "Mutation budget exhausted." };
  const ticket = fixture.tickets.find((value) => value.account_id === authenticated.accountId && value.ticket_id === args.ticket_id);
  if (!ticket) return { ok: false, code: "NOT_FOUND", message: "No matching ticket on this account." };
  const key = approvalKey(authenticated, args);
  if (!state.approvals.has(key)) return { ok: false, code: "APPROVAL_REQUIRED", message: "Independent approval required." };
  state.approvals.delete(key);
  state.mutations += 1;
  state.comments.push({ account_id: authenticated.accountId, ticket_id: args.ticket_id, text: args.comment, route: route.kind });
  const outcome = { ok: true, code: "COMMENT_ADDED", data: { ticket_id: args.ticket_id } };
  state.effects.set(call.callId, outcome);
  return outcome;
}

export function handle(provider, wire, authenticated, state) {
  let call;
  try { call = normalizeCall(provider, wire); } catch (error) {
    const outcome = { ok: false, code: error.message, message: "Call envelope rejected." };
    if (provider === "openai" && typeof wire?.call_id === "string") return { type: "function_call_output", call_id: wire.call_id, output: JSON.stringify(outcome) };
    throw error;
  }
  return wrapResult(call, execute(call, authenticated, state));
}
