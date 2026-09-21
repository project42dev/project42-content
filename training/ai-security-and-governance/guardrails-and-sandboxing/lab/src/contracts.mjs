const TOOLS = new Set(['customer.read', 'customer.export']);
const READ_FIELDS = new Set(['name', 'email']);

export class ContractError extends Error {
  constructor(code) { super(code); this.name = 'ContractError'; this.code = code; }
}

function object(value, allowed, code) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new ContractError(code);
  for (const key of Object.keys(value)) if (!allowed.has(key)) throw new ContractError('UNKNOWN_PROPERTY');
}

function shortString(value, code, max = 120) {
  if (typeof value !== 'string' || value.length < 1 || value.length > max) throw new ContractError(code);
}

export function validateProposal(proposal) {
  object(proposal, new Set(['tool', 'args', 'note']), 'BAD_PROPOSAL');
  shortString(proposal.tool, 'BAD_TOOL', 40);
  if (!TOOLS.has(proposal.tool)) throw new ContractError('TOOL_NOT_ALLOWED');
  shortString(proposal.note, 'BAD_NOTE', 200);
  if (proposal.tool === 'customer.read') {
    object(proposal.args, new Set(['customerId', 'fields']), 'BAD_ARGS');
    shortString(proposal.args.customerId, 'BAD_CUSTOMER_ID', 40);
    if (!Array.isArray(proposal.args.fields) || proposal.args.fields.length < 1 || proposal.args.fields.length > 2) throw new ContractError('BAD_FIELDS');
    if (new Set(proposal.args.fields).size !== proposal.args.fields.length) throw new ContractError('BAD_FIELDS');
    for (const field of proposal.args.fields) if (!READ_FIELDS.has(field)) throw new ContractError('BAD_FIELD');
  } else {
    object(proposal.args, new Set(['customerId', 'format']), 'BAD_ARGS');
    shortString(proposal.args.customerId, 'BAD_CUSTOMER_ID', 40);
    if (proposal.args.format !== 'json') throw new ContractError('BAD_FORMAT');
  }
  return proposal;
}

export function validateStores(stores) {
  if (!Number.isSafeInteger(stores.nowMs) || stores.nowMs < 0) throw new ContractError('BAD_TIME');
  for (const session of stores.sessions) {
    object(session, new Set(['id','subject','tenant','authMethod','authenticatedAt','actions','maxCalls','maxResults']), 'BAD_SESSION');
    if (!Number.isSafeInteger(session.maxCalls) || session.maxCalls < 1 || session.maxCalls > 100) throw new ContractError('BAD_BUDGET');
    if (!Number.isSafeInteger(session.maxResults) || session.maxResults < 1 || session.maxResults > 1000) throw new ContractError('BAD_BUDGET');
  }
}

export function publicFailure() { return {ok:false, error:'request_denied'}; }
