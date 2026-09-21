import {validateProposal, validateStores, publicFailure} from '../src/contracts.mjs';
import {evaluateGuardrail} from '../src/guardrail.mjs';
import {reserveBudget, authorize, addResults} from '../src/policy.mjs';
import {executeInternal, validateAndRedactResult} from '../src/internal-api.mjs';
import {auditBase, deniedAudit, allowedAudit} from '../src/audit.mjs';

export function createBridge(stores) {
  validateStores(stores);
  const usageBySession = new Map();
  const audit = [];
  return {
    audit,
    execute(sessionId, candidate) {
      let event;
      try {
        const proposal = validateProposal(candidate);
        const session = stores.sessions.find(value => value.id === sessionId);
        if (!session) return publicFailure();
        const guardDecision = evaluateGuardrail(proposal);
        event = auditBase(session, proposal, guardDecision);
        reserveBudget(session, usageBySession);
        const authorizedCustomer = authorize(session, proposal, stores);
        const internalResult = executeInternal(proposal, authorizedCustomer);
        const publicResult = validateAndRedactResult(internalResult);
        addResults(session, usageBySession, publicResult.records.length);
        audit.push(allowedAudit(event, publicResult.records.length));
        return publicResult;
      } catch (error) {
        if (event) audit.push(deniedAudit(event, error.code ?? 'VALIDATION_FAILED'));
        return publicFailure();
      }
    }
  };
}
