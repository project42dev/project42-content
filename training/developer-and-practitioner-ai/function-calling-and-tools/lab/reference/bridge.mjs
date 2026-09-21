import { fixture } from "../fixtures/data.mjs";
import { normalizeCall, parseArguments, wrapResult } from "../src/contracts.mjs";

const ROUTES = Object.freeze({ add_comment: Object.freeze({ method: "POST", kind: "ticket-comment" }) });
export function authenticate(id) { const p = fixture.principals[id]; if (!p) throw new Error("AUTHENTICATION_REQUIRED"); return Object.freeze({ subject: p.subject, accountId: p.accountId }); }
export function createState() { return { calls: 0, mutations: 0, approvals: new Map(), effects: new Map(), comments: [] }; }
const approvalKey = (actor, a) => JSON.stringify([actor.subject, actor.accountId, a.ticket_id, a.comment]);
export function approveComment(state, approver, actor, ticketId, comment) { if (approver.subject === actor.subject) throw new Error("INDEPENDENT_APPROVAL_REQUIRED"); const a = parseArguments("helpdesk_tickets", { action: "add_comment", ticket_id: ticketId, comment }); state.approvals.set(approvalKey(actor, a), approver.subject); }
function execute(call, auth, state) {
  if (!auth?.subject || !auth?.accountId) return { ok: false, code: "AUTHENTICATION_REQUIRED", message: "Authenticated context required." };
  if (!Number.isSafeInteger(state.calls) || state.calls < 0 || state.calls >= 4) return { ok: false, code: "CALL_BUDGET_EXCEEDED", message: "Call budget exhausted." };
  state.calls += 1;
  let a; try { a = parseArguments(call.name, call.args); } catch (e) { const code = e.message === "UNKNOWN_TOOL" ? "UNKNOWN_TOOL" : "INVALID_ARGUMENTS"; return { ok: false, code, message: code === "UNKNOWN_TOOL" ? "Unknown tool." : "Arguments do not match the closed contract." }; }
  if (call.name === "orders_get_status") {
    const row = fixture.orders.find((candidate) => candidate.account_id === auth.accountId && candidate.order_number === a.order_number);
    return row ? { ok: true, code: "OK", data: { order_number: row.order_number, status: row.status, updated_at: row.updated_at } } : { ok: false, code: "NOT_FOUND", message: "No matching order on this account." };
  }
  const route = ROUTES[a.action]; if (!route) return { ok: false, code: "INVALID_ARGUMENTS", message: "Action is not routed." };
  if (state.effects.has(call.callId)) return state.effects.get(call.callId);
  if (state.mutations >= 1) return { ok: false, code: "MUTATION_BUDGET_EXCEEDED", message: "Mutation budget exhausted." };
  const ticket = fixture.tickets.find((v) => v.account_id === auth.accountId && v.ticket_id === a.ticket_id);
  if (!ticket) return { ok: false, code: "NOT_FOUND", message: "No matching ticket on this account." };
  const key = approvalKey(auth, a); if (!state.approvals.has(key)) return { ok: false, code: "APPROVAL_REQUIRED", message: "Independent approval required." };
  state.approvals.delete(key); state.mutations += 1; state.comments.push({ account_id: auth.accountId, ticket_id: a.ticket_id, text: a.comment, route: route.kind });
  const out = { ok: true, code: "COMMENT_ADDED", data: { ticket_id: a.ticket_id } }; state.effects.set(call.callId, out); return out;
}
export function handle(provider, wire, auth, state) { let call; try { call = normalizeCall(provider, wire); } catch (e) { const out = { ok: false, code: e.message, message: "Call envelope rejected." }; if (provider === "openai" && typeof wire?.call_id === "string") return { type: "function_call_output", call_id: wire.call_id, output: JSON.stringify(out) }; throw e; } return wrapResult(call, execute(call, auth, state)); }
