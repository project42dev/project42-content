import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const policyArgument = process.argv[2];
if (!policyArgument) {
  console.error('Usage: node variation.mjs <policy.mjs>');
  process.exit(2);
}
const { evaluateBoundary } = await import(pathToFileURL(resolve(process.cwd(), policyArgument)).href);

function baseInput() {
  return {
    serverId: 'fixture-issue-server',
    operation: 'ADD_LABEL',
    tokenClaims: { aud: 'fixture-issue-server', scope: ['issues:label'] },
    consent: { approvedClientId: 'accessibility-host', requestingClientId: 'accessibility-host' },
    requiredScopes: ['issues:label'],
    requestedScopes: ['issues:label'],
    approvedToolDigest: 'sha256:fixture-issue-add-label-v1',
    observedToolDigest: 'sha256:fixture-issue-add-label-v1',
    result: { status: 'ok', label: 'accessibility' },
    dispatch: { state: 'COMPLETED', response: 'OK', postcondition: 'CONFIRMED' }
  };
}

const overbroad = baseInput();
overbroad.requestedScopes = ['issues:label', 'issues:admin'];
overbroad.tokenClaims.scope = ['issues:label', 'issues:admin'];
const mismatch = baseInput();
mismatch.consent.approvedClientId = 'reporting-host';

const cases = [
  { id: 'changed-overbroad-scope', expected: 'REJECT_SCOPE', input: overbroad },
  { id: 'changed-client-mismatch', expected: 'REJECT_CONSENT_MISMATCH', input: mismatch },
  { id: 'changed-authorized-client', expected: 'ALLOW', input: baseInput() }
];

let passed = 0;
for (const testCase of cases) {
  const actual = evaluateBoundary(structuredClone(testCase.input));
  const ok = actual === testCase.expected;
  if (ok) passed += 1;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${testCase.id} expected=${testCase.expected} actual=${actual}`);
}
console.log(`SUMMARY ${passed}/${cases.length}`);
process.exitCode = passed === cases.length ? 0 : 1;
