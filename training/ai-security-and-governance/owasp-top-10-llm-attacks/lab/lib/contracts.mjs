const own = (value, key) => Object.prototype.hasOwnProperty.call(value, key);

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function exactKeys(value, keys) {
  if (!isRecord(value)) return false;
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  return actual.length === expected.length && actual.every((key, index) => key === expected[index]);
}

function stringArray(value) {
  return Array.isArray(value) && value.length > 0 && value.every((item) => typeof item === 'string' && item.length > 0);
}

export function validateProposal(proposal) {
  const keys = ['action', 'scope', 'destination', 'tokenCost', 'payload'];
  if (!exactKeys(proposal, keys)) return {ok: false, reason: 'invalid-contract'};
  const actions = new Set(['export', 'revealHidden', 'renderExternal', 'summarize', 'loopTool']);
  const scopes = new Set(['public', 'protected']);
  const destinations = new Set(['console', 'external']);
  if (!actions.has(proposal.action)) return {ok: false, reason: 'unknown-action'};
  if (!scopes.has(proposal.scope)) return {ok: false, reason: 'unknown-scope'};
  if (!destinations.has(proposal.destination)) return {ok: false, reason: 'unknown-destination'};
  if (!Number.isSafeInteger(proposal.tokenCost) || proposal.tokenCost < 0 || proposal.tokenCost > 1000) return {ok: false, reason: 'invalid-token-cost'};
  if (typeof proposal.payload !== 'string' || proposal.payload.length > 500) return {ok: false, reason: 'invalid-payload'};
  return {ok: true};
}

export function validateFixtureDocument(document) {
  if (!exactKeys(document, ['schemaVersion', 'cases']) || document.schemaVersion !== '1.0' || !Array.isArray(document.cases)) {
    throw new Error('invalid fixture document');
  }
  const ids = new Set();
  for (const item of document.cases) {
    const keys = ['id', 'mode', 'pairId', 'owasp', 'anatomy', 'trustProfile', 'controlType', 'retrievedText', 'proposal', 'expected'];
    if (!exactKeys(item, keys)) throw new Error('invalid case shape');
    if (typeof item.id !== 'string' || item.id.length === 0 || ids.has(item.id)) throw new Error('invalid case id');
    ids.add(item.id);
    if (!new Set(['static', 'adaptive']).has(item.mode)) throw new Error('invalid mode');
    if (typeof item.pairId !== 'string' || !stringArray(item.owasp)) throw new Error('invalid case metadata');
    if (!exactKeys(item.anatomy, ['deliverySurface', 'propagation', 'encoding'])) throw new Error('invalid anatomy');
    for (const key of ['deliverySurface', 'propagation', 'encoding']) if (typeof item.anatomy[key] !== 'string') throw new Error('invalid anatomy value');
    for (const key of ['trustProfile', 'controlType', 'retrievedText']) if (typeof item[key] !== 'string') throw new Error('invalid case text');
    if (!isRecord(item.proposal)) throw new Error('proposal must be an object');
    if (!exactKeys(item.expected, ['decision', 'stateChanges', 'toolCalls', 'protectedExposed'])) throw new Error('invalid expected shape');
    if (!new Set(['ALLOW', 'DENY']).has(item.expected.decision)) throw new Error('invalid expected decision');
    for (const key of ['stateChanges', 'toolCalls']) if (!Number.isSafeInteger(item.expected[key]) || item.expected[key] < 0) throw new Error('invalid expected count');
    if (typeof item.expected.protectedExposed !== 'boolean') throw new Error('invalid expected exposure');
  }
}
