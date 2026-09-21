import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const policyArgument = process.argv[2];
if (!policyArgument) {
  console.error('Usage: node test.mjs <policy.mjs>');
  process.exit(2);
}

const fixtures = JSON.parse(await readFile(new URL('./fixtures.json', import.meta.url), 'utf8'));
const { evaluateBoundary } = await import(pathToFileURL(resolve(process.cwd(), policyArgument)).href);
const baseline = fixtures.cases[0].input;
const changed = mutation => {
  const input = structuredClone(baseline);
  mutation(input);
  return input;
};

const regressions = [
  { id: 'missing-audience-and-server', expected: 'REJECT_MALFORMED_INPUT', input: changed(x => { delete x.serverId; delete x.tokenClaims.aud; }) },
  { id: 'missing-both-digests', expected: 'REJECT_MALFORMED_INPUT', input: changed(x => { delete x.approvedToolDigest; delete x.observedToolDigest; }) },
  { id: 'token-grants-no-scopes', expected: 'REJECT_MALFORMED_INPUT', input: changed(x => { x.tokenClaims.scope = []; }) },
  { id: 'unknown-post-write-state', expected: 'CONTAIN_VERIFY_POSTCONDITION', input: changed(x => { x.dispatch = { state: 'AFTER_WRITE', response: 'TIMEOUT', operationId: 'synthetic-op-unknown' }; }) },
  { id: 'null-input', expected: 'REJECT_MALFORMED_INPUT', input: null },
  { id: 'array-input', expected: 'REJECT_MALFORMED_INPUT', input: [] },
  { id: 'server-id-wrong-type', expected: 'REJECT_MALFORMED_INPUT', input: changed(x => { x.serverId = 42; }) },
  { id: 'empty-consent-identity', expected: 'REJECT_MALFORMED_INPUT', input: changed(x => { x.consent.requestingClientId = ''; }) },
  { id: 'scope-not-array', expected: 'REJECT_MALFORMED_INPUT', input: changed(x => { x.requestedScopes = 'issues:label'; }) },
  { id: 'empty-required-scopes', expected: 'REJECT_MALFORMED_INPUT', input: changed(x => { x.requiredScopes = []; }) },
  { id: 'duplicate-requested-scope', expected: 'REJECT_MALFORMED_INPUT', input: changed(x => { x.requestedScopes = ['issues:label', 'issues:label']; }) },
  { id: 'duplicate-token-scope', expected: 'REJECT_MALFORMED_INPUT', input: changed(x => { x.tokenClaims.scope = ['issues:label', 'issues:label']; }) },
  { id: 'token-missing-required-grant', expected: 'REJECT_SCOPE', input: changed(x => { x.tokenClaims.scope = ['issues:read']; }) },
  { id: 'invalid-dispatch-state', expected: 'REJECT_MALFORMED_INPUT', input: changed(x => { x.dispatch.state = 'SOMETIME'; }) },
  { id: 'invalid-response-enum', expected: 'REJECT_MALFORMED_INPUT', input: changed(x => { x.dispatch.response = 'MAYBE'; }) },
  { id: 'invalid-postcondition-enum', expected: 'REJECT_MALFORMED_INPUT', input: changed(x => { x.dispatch.postcondition = 'PROBABLY'; }) },
  { id: 'confirmed-after-write-timeout', expected: 'ALLOW', input: changed(x => { x.dispatch = { state: 'AFTER_WRITE', response: 'TIMEOUT', postcondition: 'CONFIRMED', operationId: 'synthetic-op-confirmed' }; }) },
  { id: 'completed-confirmed', expected: 'ALLOW', input: changed(() => {}) }
];

const cases = [...fixtures.cases, ...regressions];
let passed = 0;
for (const testCase of cases) {
  let actual;
  try {
    actual = evaluateBoundary(structuredClone(testCase.input));
  } catch (error) {
    actual = `THREW_${error?.name ?? 'ERROR'}`;
  }
  const ok = actual === testCase.expected;
  if (ok) passed += 1;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${testCase.id} expected=${testCase.expected} actual=${actual}`);
}
console.log(`SUMMARY ${passed}/${cases.length}`);
process.exitCode = passed === cases.length ? 0 : 1;
