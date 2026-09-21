import {validateProposal, validateStores, publicFailure} from './contracts.mjs';
import {evaluateGuardrail} from './guardrail.mjs';
import {reserveBudget, authorize, addResults} from './policy.mjs';
import {executeInternal, validateAndRedactResult} from './internal-api.mjs';
import {auditBase, deniedAudit, allowedAudit} from './audit.mjs';

export function createBridge(stores) {
  validateStores(stores);
  const counters = new Map();
  const audit = [];
  return {
    audit,
    execute(sessionId, untrustedProposal) {
      let base;
      try {
        const proposal = validateProposal(untrustedProposal);
        const session = stores.sessions.find(item => item.id === sessionId);
        if (!session) return publicFailure();
        const guard = evaluateGuardrail(proposal);
        base = auditBase(session, proposal, guard);
        reserveBudget(session, counters);
        if (!guard.allowed) authorize(session, proposal, stores); // DELIBERATE DEFECT: authorization must be unconditional.
        const customer = stores.customers.find(item => item.id === proposal.args.customerId);
        if (!customer) throw Object.assign(new Error('RESOURCE_NOT_FOUND'), {code:'RESOURCE_NOT_FOUND'});
        const raw = executeInternal(proposal, customer);
        const result = validateAndRedactResult(raw);
        addResults(session, counters, result.records.length);
        audit.push(allowedAudit(base, result.records.length));
        return result;
      } catch (error) {
        if (base) audit.push(deniedAudit(base, error.code ?? 'VALIDATION_FAILED'));
        return publicFailure();
      }
    }
  };
}
