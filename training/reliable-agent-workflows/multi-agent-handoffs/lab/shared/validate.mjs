const packetKeys = new Set(['schemaVersion','runId','from','to','reason','goal','facts','artifacts','allowedActions','deniedActions','budget','returnWhen','context','depth','transitionCostTurns','receiverDecision','receiverReason','event']);
const contextKeys = new Set(['goal','constraints','traceId','completedSideEffects','facts','artifacts']);
const policyKeys = new Set(['expectedRecipient','recipientAllowed','contextAllowlist','maxTurns','maxDepth']);
const events = new Set(['normal','ambiguous-timeout']);
const decisions = new Set(['accept','reject']);
const text = (v) => typeof v === 'string' && v.trim().length > 0;
const plain = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const textArray = (v, nonempty = false) => Array.isArray(v) && (!nonempty || v.length > 0) && v.every(text) && new Set(v).size === v.length;
const same = (a,b) => JSON.stringify(a) === JSON.stringify(b);

function traceOf(packet) {
  return plain(packet) && plain(packet.context) && text(packet.context.traceId) ? packet.context.traceId : null;
}

export function rejected(packet, reason) {
  return { status:'rejected', reason, traceId:traceOf(packet), activeAgent:null };
}

function validFacts(value) {
  return Array.isArray(value) && value.every((fact) => plain(fact) && Object.keys(fact).length === 2 && text(fact.claim) && text(fact.sourceRef));
}

function validSideEffects(value) {
  return Array.isArray(value) && value.every((item) => plain(item) && Object.keys(item).length === 2 && text(item.idempotencyKey) && item.status === 'completed');
}

function validPolicy(policy) {
  return plain(policy) && Object.keys(policy).every((key) => policyKeys.has(key)) &&
    Object.keys(policy).length === policyKeys.size && text(policy.expectedRecipient) &&
    textArray(policy.recipientAllowed) && textArray(policy.contextAllowlist) &&
    policy.contextAllowlist.every((key) => contextKeys.has(key)) &&
    Number.isInteger(policy.maxTurns) && policy.maxTurns >= 1 &&
    Number.isInteger(policy.maxDepth) && policy.maxDepth >= 0;
}

export function validateAndPrepare(packet, policy) {
  if (!validPolicy(policy)) return { terminal: rejected(packet, 'invalid_policy') };
  if (!plain(packet) || Object.keys(packet).some((key) => !packetKeys.has(key))) return { terminal: rejected(packet, 'malformed_packet') };
  if (!['schemaVersion','runId','from','to','reason','goal'].every((key) => text(packet[key]))) return { terminal: rejected(packet, 'malformed_packet') };
  if (packet.schemaVersion !== '1.0') return { terminal: rejected(packet, 'unsupported_schema') };
  if (!validFacts(packet.facts)) return { terminal: rejected(packet, 'missing_provenance') };
  if (!textArray(packet.artifacts) || !textArray(packet.allowedActions) || !textArray(packet.deniedActions) || !textArray(packet.returnWhen,true)) return { terminal: rejected(packet, 'malformed_packet') };
  if (packet.to !== policy.expectedRecipient) return { terminal: rejected(packet, 'recipient_mismatch') };
  if (!plain(packet.context)) return { terminal: rejected(packet, 'malformed_packet') };
  if (Object.keys(packet.context).some((key) => !contextKeys.has(key) || !policy.contextAllowlist.includes(key))) return { terminal: rejected(packet, 'context_not_allowlisted') };
  if (![...contextKeys].every((key) => key in packet.context)) return { terminal: rejected(packet, 'malformed_packet') };
  if (!text(packet.context.goal) || packet.context.goal !== packet.goal) return { terminal: rejected(packet, 'goal_mismatch') };
  if (!text(packet.context.traceId) || !textArray(packet.context.constraints) || !validSideEffects(packet.context.completedSideEffects)) return { terminal: rejected(packet, 'malformed_packet') };
  if (!validFacts(packet.context.facts)) return { terminal: rejected(packet, 'missing_provenance') };
  if (!textArray(packet.context.artifacts)) return { terminal: rejected(packet, 'malformed_packet') };
  if (!same(packet.facts,packet.context.facts)) return { terminal: rejected(packet, 'facts_mismatch') };
  if (!same(packet.artifacts,packet.context.artifacts)) return { terminal: rejected(packet, 'artifacts_mismatch') };
  if (!events.has(packet.event) || !decisions.has(packet.receiverDecision)) return { terminal: rejected(packet, 'malformed_packet') };
  if (packet.receiverDecision === 'reject' && !text(packet.receiverReason)) return { terminal: rejected(packet, 'malformed_packet') };
  if (!Number.isInteger(packet.depth) || packet.depth < 0) return { terminal: rejected(packet, 'malformed_packet') };
  if (packet.depth > policy.maxDepth) return { terminal: rejected(packet, 'max_recursion_exceeded') };
  if (!plain(packet.budget) || Object.keys(packet.budget).length !== 1 || !Number.isInteger(packet.budget.turns) || packet.budget.turns < 1 || packet.budget.turns > policy.maxTurns || !Number.isInteger(packet.transitionCostTurns) || packet.transitionCostTurns < 0) return { terminal: rejected(packet, 'malformed_budget') };
  const remainingTurns = packet.budget.turns - packet.transitionCostTurns;
  if (remainingTurns < 0) return { terminal: rejected(packet, 'budget_exhausted') };
  if (packet.event === 'ambiguous-timeout') return { terminal:{status:'escalate',reason:'ambiguous_timeout',traceId:packet.context.traceId,activeAgent:null,mayRepeatSideEffects:false,completedSideEffects:structuredClone(packet.context.completedSideEffects),next:'human'} };
  if (packet.receiverDecision === 'reject') return { terminal:{status:'escalate',reason:`receiver_rejected:${packet.receiverReason}`,traceId:packet.context.traceId,activeAgent:null,mayRepeatSideEffects:false,completedSideEffects:structuredClone(packet.context.completedSideEffects),next:'human'} };
  if (remainingTurns === 0) return { terminal:{status:'paused',reason:'no_receiver_work_turn',traceId:packet.context.traceId,activeAgent:null,remainingTurns:0,next:'parent-or-human'} };
  return { packet, policy, remainingTurns };
}

export function acceptedResult(packet, remainingTurns, effectiveActions) {
  return {status:'accepted',activeAgent:packet.to,effectiveActions,remainingTurns,traceId:packet.context.traceId,goal:packet.context.goal,constraints:structuredClone(packet.context.constraints),completedSideEffects:structuredClone(packet.context.completedSideEffects),returnWhen:structuredClone(packet.returnWhen)};
}
