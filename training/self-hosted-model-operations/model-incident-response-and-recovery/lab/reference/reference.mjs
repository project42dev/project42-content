import { validate, recoveryGateNames } from '../src/validate.mjs';

function sameRequest(record, request) {
  return record.requestId === request.id && record.action === request.action && record.target === request.target && record.identity === request.identity;
}

export function referenceDecision(raw) {
  const input = validate(structuredClone(raw));
  const actualRto = input.timing.recoveredAtMs - input.timing.declaredAtMs;
  const actualRpo = input.timing.incidentAtMs - input.timing.checkpointAtMs;
  const rtoPass = actualRto <= input.timing.rtoMs;
  const rpoPass = actualRpo <= input.timing.rpoMs;
  const gatesPass = recoveryGateNames.every((gate) => input.recoveryGate[gate] === true);
  const recoveryPass = gatesPass && rtoPass && rpoPass;
  const completed = input.history.some((entry) => entry.outcome === 'completed' && sameRequest(entry, input.request));
  let decision = 'HOLD_RECONCILE';
  let reason = input.observed.status === 'unknown' ? 'unknown outcome lacks matching authoritative final evidence' : 'outcome lacks matching authoritative final evidence';

  if (completed) {
    decision = 'COMPLETED';
    reason = 'completed request is never repeated';
  } else {
    const proof = input.observed.evidence;
    const age = proof === null ? null : input.timing.decisionAtMs - proof.observedAtMs;
    const validFinal = proof !== null && proof.authoritative === true && age >= 0 && age <= input.timing.evidenceMaxAgeMs && sameRequest(proof, input.request) && (proof.outcome === 'failed' || proof.outcome === 'succeeded');
    if (validFinal && proof.outcome === 'succeeded') {
      decision = 'COMPLETED';
      reason = 'matching authoritative evidence proves success';
    } else if (validFinal && proof.outcome === 'failed' && recoveryPass) {
      decision = 'RETRY_ALLOWED';
      reason = 'matching authoritative evidence proves failure';
    } else if (!recoveryPass) {
      decision = 'HOLD_RECONCILE';
      reason = 'new action blocked by failed recovery gate or objective';
    }
  }

  return {
    output: {
      incidentId: input.incidentId,
      requestId: input.request.id,
      decision,
      reason,
      recovery: recoveryPass ? 'PASS' : 'FAILED',
      rto: { actualMs: actualRto, objectiveMs: input.timing.rtoMs, pass: rtoPass },
      rpo: { actualMs: actualRpo, objectiveMs: input.timing.rpoMs, pass: rpoPass }
    },
    exitCode: !recoveryPass ? 3 : decision === 'HOLD_RECONCILE' ? 2 : 0
  };
}
