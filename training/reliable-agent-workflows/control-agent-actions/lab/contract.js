const ACTION = 'update_ticket_status';
const RESULT_KINDS = new Set(['success','invalid','denied','conflict','uncertain']);
const ACTION_KEYS = ['action','targetId','toStatus','operationKey','expectedVersion'];
const CONTEXT_KEYS = ['actor','policy','approval','limits','usage','charge','clock','toolOutput'];
const ACTOR_KEYS = ['id','tenantId','allowedResources'];
const POLICY_KEYS = ['allowedActions','tenantId','resourceId','fromStatus','toStatus'];
const APPROVAL_KEYS = ['approvalId','actorId','tenantId','action','resourceId','toStatus','expectedVersion','operationKey'];
const LIMIT_KEYS = ['maxSteps','maxCostUnits','maxRateActions','rateWindowMs'];
const USAGE_KEYS = ['steps','costUnits','rateActions','windowStartMs'];
const CHARGE_KEYS = ['steps','costUnits','rateActions'];
const CLOCK_KEYS = ['nowMs'];
const TICKET_KEYS = ['id','tenantId','status','version'];
const RECEIPT_KEYS = ['operationKey','fingerprint','tenantId','resourceId','fromStatus','toStatus','fromVersion','toVersion'];
const OPERATION_KEYS = ['operationKey','fingerprint','status','evidence','originalRun'];
const EVIDENCE_KEYS = ['operationKey','fingerprint','expectedVersion','intended','uncertainty'];
const INTENDED_KEYS = ['tenantId','resourceId','fromStatus','toStatus','fromVersion','toVersion'];
const ORIGINAL_KEYS = ['behavior','result'];

/** @typedef {{action:'update_ticket_status',targetId:string,toStatus:'RESOLVED',operationKey:string,expectedVersion:number}} ActionRequest */
/** @typedef {{id:string,tenantId:string,status:'OPEN'|'RESOLVED',version:number}} Ticket */
/** @typedef {{operationKey:string,fingerprint:string,tenantId:string,resourceId:string,fromStatus:'OPEN',toStatus:'RESOLVED',fromVersion:number,toVersion:number}} Receipt */
/** @typedef {{tickets:Ticket[],receipts:Receipt[],operations:object[],ledger:object[],mutationCount:number}} Environment */
/** @typedef {{kind:'success'|'invalid'|'denied'|'conflict'|'uncertain',code:string,message:string,effects:number,callMutations:number,cumulativeMutations:number,receiptCount:number,operationKey:string|null,trace:object[],ledger:object[],data?:object,recovery?:object}} ToolResult */

function record(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}
function exact(value, keys) {
  if (!record(value)) return false;
  const own = Object.keys(value);
  if (own.some((key) => ['__proto__','prototype','constructor'].includes(key))) return false;
  return own.length === keys.length && keys.every((key) => Object.hasOwn(value,key));
}
function text(value, pattern, max = 128) {
  return typeof value === 'string' && value.length > 0 && value.length <= max && pattern.test(value);
}
function count(value) { return Number.isSafeInteger(value) && value >= 0; }
function amount(value) { return typeof value === 'number' && Number.isFinite(value) && value >= 0; }
function push(env, entry) { env.ledger.push(structuredClone(entry)); }
function emptyMetrics() { return {receipts:[],ledger:[],mutationCount:0}; }
function result(env, kind, code, message, operationKey = null, trace = [], callMutations = 0, extra = {}) {
  if (!RESULT_KINDS.has(kind)) throw new Error('internal result kind');
  const receiptCount = Array.isArray(env.receipts) ? env.receipts.length : 0;
  const cumulativeMutations = count(env.mutationCount) ? env.mutationCount : 0;
  return {kind,code,message,effects:callMutations,callMutations,cumulativeMutations,receiptCount,operationKey,trace,ledger:structuredClone(Array.isArray(env.ledger) ? env.ledger : []),...extra};
}
function fingerprint(action, context) {
  return JSON.stringify({actorId:context.actor.id,tenantId:context.actor.tenantId,action:action.action,targetId:action.targetId,toStatus:action.toStatus,expectedVersion:action.expectedVersion,operationKey:action.operationKey});
}
function validateAction(action) {
  if (!exact(action,ACTION_KEYS)) return 'action must contain exactly the five contract fields as own properties';
  if (action.action !== ACTION) return 'unsupported action';
  if (!text(action.targetId,/^ticket_[0-9]{8}$/)) return 'targetId is malformed';
  if (action.toStatus !== 'RESOLVED') return 'toStatus must be RESOLVED';
  if (!text(action.operationKey,/^op_[A-Za-z0-9_]{13,61}$/,64)) return 'operationKey must be 16 to 64 safe characters';
  if (!count(action.expectedVersion)) return 'expectedVersion must be a nonnegative safe integer';
  return null;
}
function validateContext(c) {
  if (!exact(c,CONTEXT_KEYS)) return 'trusted context fields are missing or unknown';
  if (!exact(c.actor,ACTOR_KEYS) || !text(c.actor.id,/^actor_[a-z0-9_]+$/) || !text(c.actor.tenantId,/^tenant_[a-z0-9_]+$/) || !Array.isArray(c.actor.allowedResources) || c.actor.allowedResources.some((x) => !text(x,/^ticket_[0-9]{8}$/))) return 'actor is malformed';
  if (!exact(c.policy,POLICY_KEYS) || !Array.isArray(c.policy.allowedActions) || c.policy.allowedActions.some((x) => x !== ACTION) || !text(c.policy.tenantId,/^tenant_[a-z0-9_]+$/) || !text(c.policy.resourceId,/^ticket_[0-9]{8}$/) || c.policy.fromStatus !== 'OPEN' || c.policy.toStatus !== 'RESOLVED') return 'policy is malformed';
  if (!exact(c.approval,APPROVAL_KEYS) || !text(c.approval.approvalId,/^approval_[a-z0-9_]+$/) || !text(c.approval.actorId,/^actor_[a-z0-9_]+$/) || !text(c.approval.tenantId,/^tenant_[a-z0-9_]+$/) || c.approval.action !== ACTION || !text(c.approval.resourceId,/^ticket_[0-9]{8}$/) || c.approval.toStatus !== 'RESOLVED' || !count(c.approval.expectedVersion) || !text(c.approval.operationKey,/^op_[A-Za-z0-9_]{13,61}$/,64)) return 'approval is malformed';
  if (!exact(c.limits,LIMIT_KEYS) || !count(c.limits.maxSteps) || !amount(c.limits.maxCostUnits) || !count(c.limits.maxRateActions) || !amount(c.limits.rateWindowMs)) return 'limits must be finite and nonnegative';
  if (!exact(c.usage,USAGE_KEYS) || !count(c.usage.steps) || !amount(c.usage.costUnits) || !count(c.usage.rateActions) || !amount(c.usage.windowStartMs)) return 'usage must be finite and nonnegative';
  if (!exact(c.charge,CHARGE_KEYS) || !count(c.charge.steps) || !amount(c.charge.costUnits) || !count(c.charge.rateActions)) return 'charges must be finite and nonnegative';
  if (!exact(c.clock,CLOCK_KEYS) || !amount(c.clock.nowMs)) return 'fixture clock must provide finite nonnegative nowMs';
  if (typeof c.toolOutput !== 'string' || c.toolOutput.length > 500) return 'toolOutput must be a bounded untrusted string';
  return null;
}
function validateReceipt(receipt) {
  if (!exact(receipt,RECEIPT_KEYS)) return 'environment receipt is malformed';
  if (!text(receipt.operationKey,/^op_[A-Za-z0-9_]{13,61}$/,64) || typeof receipt.fingerprint !== 'string' || receipt.fingerprint.length === 0 || receipt.fingerprint.length > 1000 || !text(receipt.tenantId,/^tenant_[a-z0-9_]+$/) || !text(receipt.resourceId,/^ticket_[0-9]{8}$/) || receipt.fromStatus !== 'OPEN' || receipt.toStatus !== 'RESOLVED' || !count(receipt.fromVersion) || !count(receipt.toVersion) || receipt.toVersion !== receipt.fromVersion + 1) return 'environment receipt is malformed';
  return null;
}
function validateIntended(value) {
  return exact(value,INTENDED_KEYS) && text(value.tenantId,/^tenant_[a-z0-9_]+$/) && text(value.resourceId,/^ticket_[0-9]{8}$/) && value.fromStatus === 'OPEN' && value.toStatus === 'RESOLVED' && count(value.fromVersion) && count(value.toVersion) && value.toVersion === value.fromVersion + 1;
}
function validateOperation(op) {
  if (!exact(op,OPERATION_KEYS) || !text(op.operationKey,/^op_[A-Za-z0-9_]{13,61}$/,64) || typeof op.fingerprint !== 'string' || op.fingerprint.length === 0 || op.fingerprint.length > 1000 || !['uncertain','verified'].includes(op.status)) return 'environment operation is malformed';
  if (!exact(op.evidence,EVIDENCE_KEYS) || op.evidence.operationKey !== op.operationKey || op.evidence.fingerprint !== op.fingerprint || !count(op.evidence.expectedVersion) || !validateIntended(op.evidence.intended) || op.evidence.expectedVersion !== op.evidence.intended.fromVersion || typeof op.evidence.uncertainty !== 'string' || op.evidence.uncertainty.length === 0 || op.evidence.uncertainty.length > 200) return 'environment operation is malformed';
  if (!exact(op.originalRun,ORIGINAL_KEYS) || !['normal','timeout_after_write','omit_receipt'].includes(op.originalRun.behavior) || op.originalRun.result !== 'uncertain') return 'environment operation is malformed';
  return null;
}
function validateEnvironment(env) {
  if (!exact(env,['tickets','receipts','operations','ledger','mutationCount']) || !Array.isArray(env.tickets) || !Array.isArray(env.receipts) || !Array.isArray(env.operations) || !Array.isArray(env.ledger) || !count(env.mutationCount)) return 'environment is malformed';
  for (const ticket of env.tickets) if (!exact(ticket,TICKET_KEYS) || !text(ticket.id,/^ticket_[0-9]{8}$/) || !text(ticket.tenantId,/^tenant_[a-z0-9_]+$/) || !['OPEN','RESOLVED'].includes(ticket.status) || !count(ticket.version)) return 'environment ticket is malformed';
  for (const receipt of env.receipts) { const error = validateReceipt(receipt); if (error) return error; }
  for (const operation of env.operations) { const error = validateOperation(operation); if (error) return error; }
  const ticketKeys = new Set(env.tickets.map((x) => `${x.tenantId}\u0000${x.id}`));
  if (ticketKeys.size !== env.tickets.length) return 'environment contains duplicate tickets';
  const operationKeys = new Set(env.operations.map((x) => x.operationKey));
  if (operationKeys.size !== env.operations.length) return 'environment contains duplicate operations';
  return null;
}
function authorization(action, context, env) {
  const ticket = env.tickets.find((x) => x.id === action.targetId && x.tenantId === context.actor.tenantId);
  const identityAllowed = Boolean(ticket && context.actor.allowedResources.includes(action.targetId));
  const policyAllowed = context.policy.allowedActions.includes(action.action) && context.policy.tenantId === context.actor.tenantId && context.policy.resourceId === action.targetId && context.policy.fromStatus === 'OPEN' && context.policy.toStatus === action.toStatus;
  return {ticket,identityAllowed,policyAllowed,accepted:identityAllowed && policyAllowed};
}
function approvalMatches(action, context) {
  return context.approval.actorId === context.actor.id && context.approval.tenantId === context.actor.tenantId && context.approval.action === action.action && context.approval.resourceId === action.targetId && context.approval.toStatus === action.toStatus && context.approval.expectedVersion === action.expectedVersion && context.approval.operationKey === action.operationKey;
}
function budget(context) {
  const inWindow = context.clock.nowMs >= context.usage.windowStartMs && context.clock.nowMs - context.usage.windowStartMs <= context.limits.rateWindowMs;
  const accepted = inWindow && context.usage.steps + context.charge.steps <= context.limits.maxSteps && context.usage.costUnits + context.charge.costUnits <= context.limits.maxCostUnits && context.usage.rateActions + context.charge.rateActions <= context.limits.maxRateActions;
  return {inWindow,accepted};
}
function exactReceipt(receipt, action, tenantId, fp) {
  return receipt.operationKey === action.operationKey && receipt.fingerprint === fp && receipt.resourceId === action.targetId && receipt.tenantId === tenantId && receipt.fromStatus === 'OPEN' && receipt.toStatus === action.toStatus && receipt.fromVersion === action.expectedVersion && receipt.toVersion === action.expectedVersion + 1;
}
function verify(env, action, tenantId, fp) {
  const ticket = env.tickets.find((x) => x.id === action.targetId && x.tenantId === tenantId);
  const keyed = env.receipts.filter((x) => x.operationKey === action.operationKey);
  const matching = keyed.filter((x) => exactReceipt(x,action,tenantId,fp));
  const accepted = Boolean(ticket && ticket.status === action.toStatus && ticket.version === action.expectedVersion + 1 && keyed.length === 1 && matching.length === 1);
  return {source:'independent in-memory ticket and all keyed receipts query',accepted,keyedReceipts:keyed.length,matchingReceipts:matching.length,observedTicket:ticket ? {status:ticket.status,version:ticket.version} : null};
}
function recordAuthority(env, action, context, stage = 'authorization') {
  const auth = authorization(action,context,env);
  push(env,{stage,accepted:auth.accepted,actorId:context.actor.id,tenantId:context.actor.tenantId,resourceId:action.targetId,identityAllowed:auth.identityAllowed,policyAllowed:auth.policyAllowed});
  return auth;
}
function recordApproval(env, action, context, ticket, stage = 'approval') {
  const accepted = approvalMatches(action,context);
  push(env,{stage,accepted,approvalId:context.approval.approvalId,resourceId:action.targetId,intendedMutation:{from:ticket?.status ?? 'UNKNOWN',to:action.toStatus,expectedVersion:action.expectedVersion}});
  return accepted;
}
function recordBudget(env, context, stage = 'budget') {
  const checked = budget(context);
  push(env,{stage,accepted:checked.accepted,inWindow:checked.inWindow,clock:structuredClone(context.clock),usage:structuredClone(context.usage),charge:structuredClone(context.charge),limits:structuredClone(context.limits)});
  return checked.accepted;
}

/** Execute one exact revision-bound mutation. `behavior` is trusted fixture configuration. */
export function executeAction(action, context, env, behavior = 'normal') {
  const trace = [{stage:'input',actionTrust:'untrusted',toolOutput:{trust:'untrusted',data:record(context) && typeof context.toolOutput === 'string' ? context.toolOutput : null}}];
  const envError = validateEnvironment(env);
  if (envError) return result(emptyMetrics(),'invalid','INVALID_ENVIRONMENT',envError,null,trace);
  const actionError = validateAction(action);
  push(env,{stage:'validation',accepted:!actionError,reason:actionError ?? 'exact action schema accepted'});
  if (actionError) return result(env,'invalid','INVALID_ACTION',actionError,record(action) && typeof action.operationKey === 'string' ? action.operationKey : null,trace);
  const contextError = validateContext(context);
  push(env,{stage:'trusted-context-validation',accepted:!contextError,reason:contextError ?? 'trusted context accepted'});
  if (contextError) return result(env,'invalid','INVALID_CONTEXT',contextError,action.operationKey,trace);
  if (!['normal','timeout_after_write','omit_receipt'].includes(behavior)) return result(env,'invalid','INVALID_BEHAVIOR','unsupported trusted fixture behavior',action.operationKey,trace);

  const fp = fingerprint(action,context);
  const prior = env.operations.find((x) => x.operationKey === action.operationKey);
  if (prior && prior.fingerprint !== fp) {
    push(env,{stage:'idempotency',status:'conflict',operationKey:action.operationKey,fingerprint:fp});
    return result(env,'conflict','IDEMPOTENCY_CONFLICT','operation key is bound to a different request',action.operationKey,trace);
  }
  if (prior) {
    push(env,{stage:'idempotency',status:prior.status === 'verified' ? 'candidate-duplicate' : 'unresolved',operationKey:action.operationKey,fingerprint:fp});
    const auth = recordAuthority(env,action,context,'authorization-recheck');
    if (!auth.accepted) return result(env,'denied','NOT_AUTHORIZED','current identity or policy no longer allows this tenant and resource',action.operationKey,trace);
    const approved = recordApproval(env,action,context,auth.ticket,'approval-recheck');
    if (!approved) return result(env,'denied','APPROVAL_MISMATCH','current approval is not bound to the exact request',action.operationKey,trace);
    if (!recordBudget(env,context,'budget-recheck')) return result(env,'denied','LIMIT_EXCEEDED','current trusted rate, cost, step, or deterministic time preflight failed',action.operationKey,trace);
    if (prior.status !== 'verified') return result(env,'uncertain','UNRESOLVED_OPERATION','reconcile the preserved uncertain operation before retry',action.operationKey,trace,0,{recovery:structuredClone(prior.evidence)});
    const postcondition = verify(env,action,context.actor.tenantId,fp);
    push(env,{stage:'postcondition-recheck',...postcondition});
    push(env,{stage:'idempotency',status:'deduplicated',callMutations:0,postconditionAccepted:postcondition.accepted});
    return postcondition.accepted ? result(env,'success','DEDUPLICATED','prior verified result returned after current authority checks and without a second mutation',action.operationKey,trace,0,{data:{deduplicated:true,postcondition}}) : result(env,'conflict','PRIOR_EFFECT_DIVERGED','prior verified environment no longer proves the exact effect',action.operationKey,trace);
  }
  push(env,{stage:'idempotency',status:'new',operationKey:action.operationKey,fingerprint:fp});

  const auth = recordAuthority(env,action,context);
  if (!auth.accepted) return result(env,'denied','NOT_AUTHORIZED','identity or trusted policy does not allow this tenant and resource',action.operationKey,trace);
  const ticket = auth.ticket;
  if (ticket.version !== action.expectedVersion) return result(env,'conflict','STALE_REVISION','expected ticket version does not match current version',action.operationKey,trace);
  if (ticket.status !== context.policy.fromStatus) return result(env,'denied','TRANSITION_DENIED','trusted policy does not allow the current status transition',action.operationKey,trace);
  if (!recordApproval(env,action,context,ticket)) return result(env,'denied','APPROVAL_MISMATCH','approval is not bound to the exact actor, target, mutation, revision, and operation key',action.operationKey,trace);
  if (!recordBudget(env,context)) return result(env,'denied','LIMIT_EXCEEDED','trusted rate, cost, step, or deterministic time preflight failed',action.operationKey,trace);

  const intended = {tenantId:ticket.tenantId,resourceId:ticket.id,fromStatus:ticket.status,toStatus:action.toStatus,fromVersion:ticket.version,toVersion:ticket.version + 1};
  push(env,{stage:'effect-intent',intended});
  ticket.status = action.toStatus;
  ticket.version += 1;
  env.mutationCount += 1;
  context.usage.steps += context.charge.steps;
  context.usage.costUnits += context.charge.costUnits;
  context.usage.rateActions += context.charge.rateActions;
  if (behavior !== 'omit_receipt') env.receipts.push({operationKey:action.operationKey,fingerprint:fp,tenantId:ticket.tenantId,resourceId:ticket.id,fromStatus:intended.fromStatus,toStatus:action.toStatus,fromVersion:action.expectedVersion,toVersion:ticket.version});
  const evidence = {operationKey:action.operationKey,fingerprint:fp,expectedVersion:action.expectedVersion,intended,uncertainty:behavior === 'timeout_after_write' ? 'timeout after possible mutation' : 'postcondition not yet accepted'};
  const operation = {operationKey:action.operationKey,fingerprint:fp,status:'uncertain',evidence,originalRun:{behavior,result:'uncertain'}};
  env.operations.push(operation);
  push(env,{stage:'effect-observed',observed:{ticketStatus:ticket.status,ticketVersion:ticket.version,callMutations:1,cumulativeMutations:env.mutationCount,receiptCount:env.receipts.length,usage:structuredClone(context.usage)},behavior});
  if (behavior === 'timeout_after_write') {
    push(env,{stage:'recovery',status:'required',evidence});
    return result(env,'uncertain','TIMEOUT_AFTER_POSSIBLE_WRITE','outcome is unknown; reconcile before any retry',action.operationKey,trace,1,{recovery:evidence});
  }
  const postcondition = verify(env,action,context.actor.tenantId,fp);
  push(env,{stage:'postcondition',...postcondition});
  if (!postcondition.accepted) return result(env,'uncertain','POSTCONDITION_FAILED','one mutation occurred but exact independent postcondition evidence failed',action.operationKey,trace,1,{recovery:evidence});
  operation.status = 'verified';
  return result(env,'success','UPDATED','exact ticket mutation independently verified',action.operationKey,trace,1,{data:{deduplicated:false,postcondition}});
}

/** Reconcile independent state without retrying. */
export function reconcileOperation(env, operationKey) {
  const envError = validateEnvironment(env);
  if (envError) return result(emptyMetrics(),'invalid','INVALID_ENVIRONMENT',envError,typeof operationKey === 'string' ? operationKey : null);
  if (!text(operationKey,/^op_[A-Za-z0-9_]{13,61}$/,64)) return result(env,'invalid','INVALID_OPERATION_KEY','operation key is malformed',null);
  const op = env.operations.find((x) => x.operationKey === operationKey);
  if (!op || op.status !== 'uncertain') return result(env,'invalid','NO_UNCERTAIN_OPERATION','no uncertain operation exists for this key',operationKey);
  const keyed = env.receipts.filter((x) => x.operationKey === operationKey);
  const exactMatches = keyed.filter((x) => x.fingerprint === op.fingerprint && x.resourceId === op.evidence.intended.resourceId && x.tenantId === op.evidence.intended.tenantId && x.fromStatus === op.evidence.intended.fromStatus && x.toStatus === op.evidence.intended.toStatus && x.fromVersion === op.evidence.expectedVersion && x.toVersion === op.evidence.expectedVersion + 1);
  const ticket = env.tickets.find((x) => x.id === op.evidence.intended.resourceId && x.tenantId === op.evidence.intended.tenantId);
  const one = keyed.length === 1 && exactMatches.length === 1 && ticket?.status === op.evidence.intended.toStatus && ticket?.version === op.evidence.expectedVersion + 1;
  const zero = keyed.length === 0 && ticket?.status === op.evidence.intended.fromStatus && ticket?.version === op.evidence.expectedVersion;
  const query = one ? 'one' : zero ? 'zero' : 'conflicting';
  push(env,{stage:'recovery',operationKey,query,retryPerformed:false,keyedReceipts:keyed.length,matchingReceipts:exactMatches.length,observedTicket:ticket ? {status:ticket.status,version:ticket.version} : null});
  if (one) {
    op.status = 'verified';
    return result(env,'success','RECOVERED_ONE_EFFECT','reconciliation proved exactly one mutation with exact evidence; do not retry',operationKey,[],0,{recovery:{query,retryPerformed:false,provedMutations:1,originalRun:structuredClone(op.originalRun)}});
  }
  if (zero) return result(env,'uncertain','RECOVERED_ZERO_EFFECT','reconciliation observed the original state and no keyed receipt; this fixture does not retry automatically',operationKey,[],0,{recovery:{query,retryPerformed:false,provedMutations:0,originalRun:structuredClone(op.originalRun)}});
  return result(env,'conflict','RECOVERY_CONFLICT','reconciliation found malformed, duplicate, or contradictory evidence; human review is required',operationKey,[],0,{recovery:{query,retryPerformed:false,provedMutations:null,originalRun:structuredClone(op.originalRun)}});
}
