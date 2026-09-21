export class PolicyDenied extends Error {
  constructor(code) { super(code); this.name = 'PolicyDenied'; this.code = code; }
}

function boundedTime(text) {
  if (typeof text !== 'string' || text.length > 40) throw new PolicyDenied('BAD_APPROVAL_TIME');
  const value = Date.parse(text);
  if (!Number.isSafeInteger(value) || value < 0) throw new PolicyDenied('BAD_APPROVAL_TIME');
  return value;
}

export function reserveBudget(session, counters) {
  const used = counters.get(session.id) ?? {calls:0, results:0};
  if (!Number.isSafeInteger(used.calls) || used.calls >= session.maxCalls) throw new PolicyDenied('BUDGET_EXHAUSTED');
  const next = {calls:used.calls + 1, results:used.results};
  counters.set(session.id, next);
  return next;
}

export function authorize(session, proposal, stores) {
  if (!session.actions.includes(proposal.tool)) throw new PolicyDenied('ACTION_NOT_ALLOWED');
  const customer = stores.customers.find(item => item.id === proposal.args.customerId);
  if (!customer) throw new PolicyDenied('RESOURCE_NOT_FOUND');
  if (customer.tenant !== session.tenant) throw new PolicyDenied('TENANT_MISMATCH');
  if (proposal.tool === 'customer.export') {
    const approval = stores.approvals.find(item => item.subject === session.subject && item.tenant === session.tenant && item.action === proposal.tool);
    if (!approval) throw new PolicyDenied('APPROVAL_REQUIRED');
    const from = boundedTime(approval.validFrom);
    const until = boundedTime(approval.expiresAt);
    if (approval.revoked || stores.nowMs < from || stores.nowMs >= until) throw new PolicyDenied('APPROVAL_INVALID');
  }
  return customer;
}

export function addResults(session, counters, count) {
  if (!Number.isSafeInteger(count) || count < 0) throw new PolicyDenied('BAD_RESULT_COUNT');
  const used = counters.get(session.id);
  if (!used || used.results > Number.MAX_SAFE_INTEGER - count || used.results + count > session.maxResults) throw new PolicyDenied('RESULT_BUDGET_EXHAUSTED');
  used.results += count;
}
