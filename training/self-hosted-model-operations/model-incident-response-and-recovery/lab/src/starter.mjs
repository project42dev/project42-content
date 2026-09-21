import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { validate, recoveryGateNames } from './validate.mjs';

function matchesRequest(record, request) {
  return record.requestId === request.id && record.action === request.action && record.target === request.target && record.identity === request.identity;
}

export function decide(raw) {
  const input = validate(raw);
  const { request, observed, history, timing } = input;
  const actualRto = timing.recoveredAtMs - timing.declaredAtMs;
  const actualRpo = timing.incidentAtMs - timing.checkpointAtMs;
  const rtoPass = actualRto <= timing.rtoMs;
  const rpoPass = actualRpo <= timing.rpoMs;
  const gatesPass = recoveryGateNames.every((name) => input.recoveryGate[name]);
  const recoveryPass = gatesPass && rtoPass && rpoPass;
  let decision;
  let reason;

  if (history.some((entry) => matchesRequest(entry, request) && entry.outcome === 'completed')) {
    decision = 'COMPLETED';
    reason = 'completed request is never repeated';
  } else {
    const evidence = observed.evidence;
    const fresh = evidence !== null && evidence.observedAtMs <= timing.decisionAtMs && timing.decisionAtMs - evidence.observedAtMs <= timing.evidenceMaxAgeMs;
    const matching = evidence !== null && matchesRequest(evidence, request);
    const authoritativeFinal = evidence !== null && evidence.authoritative && fresh && matching && (evidence.outcome === 'failed' || evidence.outcome === 'succeeded');

    if (authoritativeFinal && evidence.outcome === 'succeeded') {
      decision = 'COMPLETED';
      reason = 'matching authoritative evidence proves success';
    } else if (authoritativeFinal && evidence.outcome === 'failed' && recoveryPass) {
      decision = 'RETRY_ALLOWED';
      reason = 'matching authoritative evidence proves failure';
    } else if (authoritativeFinal && evidence.outcome === 'failed') {
      decision = 'HOLD_RECONCILE';
      reason = 'new action blocked by failed recovery gate or objective';
    } else if (observed.status === 'unknown' && recoveryPass) {
      // DELIBERATE DEFECT: repair only the next two assignments.
      decision = 'RETRY_ALLOWED';
      reason = 'timeout treated as failure';
    } else if (!recoveryPass) {
      decision = 'HOLD_RECONCILE';
      reason = 'new action blocked by failed recovery gate or objective';
    } else {
      decision = 'HOLD_RECONCILE';
      reason = observed.status === 'unknown' ? 'unknown outcome lacks matching authoritative final evidence' : 'outcome lacks matching authoritative final evidence';
    }
  }

  return {
    output: {
      incidentId: input.incidentId,
      requestId: request.id,
      decision,
      reason,
      recovery: recoveryPass ? 'PASS' : 'FAILED',
      rto: { actualMs: actualRto, objectiveMs: timing.rtoMs, pass: rtoPass },
      rpo: { actualMs: actualRpo, objectiveMs: timing.rpoMs, pass: rpoPass }
    },
    exitCode: !recoveryPass ? 3 : decision === 'HOLD_RECONCILE' ? 2 : 0
  };
}

async function main() {
  if (process.argv.length !== 3) throw new Error('usage: node src/starter.mjs <fixture.json>');
  const raw = JSON.parse(await readFile(process.argv[2], 'utf8'));
  const result = decide(raw);
  process.stdout.write(`${JSON.stringify(result.output)}\n`);
  process.exitCode = result.exitCode;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    process.stderr.write(`ERROR ${error.message}\n`);
    process.exitCode = 64;
  });
}
