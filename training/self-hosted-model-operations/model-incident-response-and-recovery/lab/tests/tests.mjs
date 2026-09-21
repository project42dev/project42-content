import { readFile, mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { decide } from '../src/starter.mjs';
import { referenceDecision } from '../reference/reference.mjs';

const labRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const fixtureRoot = resolve(labRoot, 'fixtures');
const tempRoot = resolve(labRoot, '.tmp-tests');
const gateNames = ['identity', 'access', 'quality', 'compatibility', 'capacity', 'telemetry', 'cost', 'userService'];

function bounded(path) {
  const resolved = resolve(path);
  if (resolved !== tempRoot && !resolved.startsWith(`${tempRoot}${sep}`)) throw new Error('refusing cleanup outside lab/.tmp-tests');
  return resolved;
}

async function fixture(name) {
  return JSON.parse(await readFile(resolve(fixtureRoot, name), 'utf8'));
}

function variant(base, mutate) {
  const copy = structuredClone(base);
  mutate(copy);
  return copy;
}

function expected(data, decision, reason, recovery, exitCode) {
  const actualRto = data.timing.recoveredAtMs - data.timing.declaredAtMs;
  const actualRpo = data.timing.incidentAtMs - data.timing.checkpointAtMs;
  return {
    output: {
      incidentId: data.incidentId,
      requestId: data.request.id,
      decision,
      reason,
      recovery,
      rto: { actualMs: actualRto, objectiveMs: data.timing.rtoMs, pass: actualRto <= data.timing.rtoMs },
      rpo: { actualMs: actualRpo, objectiveMs: data.timing.rpoMs, pass: actualRpo <= data.timing.rpoMs }
    },
    exitCode
  };
}

function finalEvidence(data, changes = {}) {
  return {
    authoritative: true,
    requestId: data.request.id,
    action: data.request.action,
    target: data.request.target,
    identity: data.request.identity,
    outcome: 'failed',
    observedAtMs: data.timing.decisionAtMs,
    ...changes
  };
}

function same(actual, expectedValue) {
  return JSON.stringify(actual) === JSON.stringify(expectedValue);
}

async function main() {
  await rm(bounded(tempRoot), { recursive: true, force: true });
  await mkdir(bounded(tempRoot), { recursive: true });
  const failures = [];
  let passed = 0;

  try {
    const unknown = await fixture('unknown-outcome.json');
    const changed = await fixture('changed-retryable.json');
    const holdReason = 'unknown outcome lacks matching authoritative final evidence';
    const blockReason = 'new action blocked by failed recovery gate or objective';
    const cases = [];

    cases.push(['unknown-outcome.json', unknown, expected(unknown, 'HOLD_RECONCILE', holdReason, 'PASS', 2)]);
    cases.push(['changed-retryable.json', changed, expected(changed, 'RETRY_ALLOWED', 'matching authoritative evidence proves failure', 'PASS', 0)]);

    const stale = variant(unknown, (x) => { x.observed.evidence = finalEvidence(x, { observedAtMs: x.timing.decisionAtMs - x.timing.evidenceMaxAgeMs - 1 }); });
    cases.push(['stale-evidence.json', stale, expected(stale, 'HOLD_RECONCILE', holdReason, 'PASS', 2)]);

    const future = variant(unknown, (x) => { x.observed.evidence = finalEvidence(x, { observedAtMs: x.timing.decisionAtMs + 1 }); });
    cases.push(['future-evidence.json', future, expected(future, 'HOLD_RECONCILE', holdReason, 'PASS', 2)]);

    const wrongIdentity = variant(unknown, (x) => { x.observed.evidence = finalEvidence(x, { identity: 'svc-other' }); });
    cases.push(['wrong-identity.json', wrongIdentity, expected(wrongIdentity, 'HOLD_RECONCILE', holdReason, 'PASS', 2)]);

    const nonAuthoritative = variant(unknown, (x) => { x.observed.evidence = finalEvidence(x, { authoritative: false }); });
    cases.push(['non-authoritative.json', nonAuthoritative, expected(nonAuthoritative, 'HOLD_RECONCILE', holdReason, 'PASS', 2)]);

    const partial = variant(unknown, (x) => { x.observed.evidence = finalEvidence(x, { outcome: 'partial' }); });
    cases.push(['partial-outcome.json', partial, expected(partial, 'HOLD_RECONCILE', holdReason, 'PASS', 2)]);

    const success = variant(unknown, (x) => { x.observed.status = 'succeeded'; x.observed.evidence = finalEvidence(x, { outcome: 'succeeded' }); });
    cases.push(['authoritative-success.json', success, expected(success, 'COMPLETED', 'matching authoritative evidence proves success', 'PASS', 0)]);

    const duplicate = variant(unknown, (x) => {
      const entry = { requestId: x.request.id, action: x.request.action, target: x.request.target, identity: x.request.identity, outcome: 'completed' };
      x.history.push(entry, structuredClone(entry));
    });
    cases.push(['duplicate-completed.json', duplicate, expected(duplicate, 'COMPLETED', 'completed request is never repeated', 'PASS', 0)]);

    for (const gate of gateNames) {
      const failedGate = variant(changed, (x) => { x.recoveryGate[gate] = false; });
      cases.push([`failed-gate-${gate}.json`, failedGate, expected(failedGate, 'HOLD_RECONCILE', blockReason, 'FAILED', 3)]);
    }

    const rtoMiss = variant(changed, (x) => { x.timing.recoveredAtMs = x.timing.declaredAtMs + x.timing.rtoMs + 1; });
    cases.push(['rto-miss.json', rtoMiss, expected(rtoMiss, 'HOLD_RECONCILE', blockReason, 'FAILED', 3)]);

    const rpoMiss = variant(changed, (x) => { x.timing.incidentAtMs = x.timing.checkpointAtMs + x.timing.rpoMs + 1; });
    cases.push(['rpo-miss.json', rpoMiss, expected(rpoMiss, 'HOLD_RECONCILE', blockReason, 'FAILED', 3)]);

    for (const [name, data, literalExpected] of cases) {
      await writeFile(bounded(resolve(tempRoot, name)), `${JSON.stringify(data, null, 2)}\n`, 'utf8');
      const before = JSON.stringify(data);
      const referenceActual = referenceDecision(structuredClone(data));
      if (!same(referenceActual, literalExpected)) {
        failures.push(`REFERENCE FAILURE ${name}: independent reference disagrees with literal expectation`);
      }
      const actual = decide(data);
      if (JSON.stringify(data) !== before) {
        failures.push(`TEST FAILURE ${name}: input was mutated`);
      } else if (!same(actual, literalExpected)) {
        failures.push(`TEST FAILURE ${name}: expected ${literalExpected.output.decision}/${literalExpected.exitCode}, got ${actual.output.decision}/${actual.exitCode}`);
      } else {
        passed += 1;
      }
    }

    const invalidCases = [
      ['unknown-action', variant(unknown, (x) => { x.request.action = 'unknown-action'; })],
      ['non-finite-rto', variant(unknown, (x) => { x.timing.rtoMs = Number.POSITIVE_INFINITY; })],
      ['unknown-gate', variant(unknown, (x) => { x.recoveryGate.mystery = true; })],
      ['unknown-status', variant(unknown, (x) => { x.observed.status = 'maybe'; })]
    ];

    for (const [name, data] of invalidCases) {
      let rejected = false;
      try { decide(data); } catch { rejected = true; }
      if (rejected) passed += 1;
      else failures.push(`TEST FAILURE strict-validation-${name}: invalid input was accepted`);
    }

    for (const failure of failures) process.stdout.write(`${failure}\n`);
    process.stdout.write(`RESULT ${passed} passed, ${failures.length} failed\n`);
    process.exitCode = failures.length === 0 ? 0 : 1;
  } finally {
    await rm(bounded(tempRoot), { recursive: true, force: true });
  }
}

main().catch((error) => {
  process.stdout.write(`TEST FAILURE harness: ${error.message}\nRESULT 0 passed, 1 failed\n`);
  process.exitCode = 1;
});
