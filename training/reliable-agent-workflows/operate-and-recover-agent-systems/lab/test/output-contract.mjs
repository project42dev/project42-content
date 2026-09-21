import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdir, readFile, copyFile, link, symlink, rm, writeFile, lstat } from 'node:fs/promises';
import { dirname, resolve, relative, isAbsolute, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const execFileAsync = promisify(execFile);
const labRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const tmpRoot = resolve(labRoot, '.tmp');
const workspace = resolve(tmpRoot, 'output-contract-tests');
const incidentFixture = resolve(labRoot, 'fixtures/incident.json');
const ledgerFixture = resolve(labRoot, 'fixtures/ledger.json');
const recover = resolve(labRoot, 'src/recover.mjs');

const expectedSuccess = [
  'INCIDENT INC-2042 SEV-1 CONTAINED',
  'RECONCILE transfer-100: CONFIRMED',
  'COMPENSATE transfer-100: VERIFIED operating=1000 reserve=0',
  'RECONCILE audit-7: MISSING',
  'RETRY audit-7: CONFIRMED key=audit-7',
  'RECONCILE notice-9: UNKNOWN',
  'ESCALATE notice-9: unverifiable postcondition',
  'EVIDENCE preserved events=6 originalEntries=2',
  'METRICS confirmed=1 missing=1 unknown=1 duplicateWrites=0 restoredOperating=1000 restoredReserve=0',
  'RESULT RECOVERED_WITH_ESCALATION',
].join('\n') + '\n';

const expectedPersistedState = {
  tenantId: 'tenant-a',
  identities: [
    { actorId: 'agent-7', tenantId: 'tenant-a', active: true },
  ],
  approvals: [
    {
      approvalId: 'APR-9',
      tenantId: 'tenant-a',
      actionId: 'transfer-100',
      operation: 'compensate',
      active: true,
    },
  ],
  accounts: {
    operating: { baseline: 1000, balance: 1000 },
    reserve: { baseline: 0, balance: 0 },
  },
  entries: [
    {
      entryId: 'L-1',
      status: 'confirmed',
      tenantId: 'tenant-a',
      actorId: 'agent-7',
      actionId: 'transfer-100',
      idempotencyKey: 'pay-100',
      correlationId: 'corr-transfer-100',
      kind: 'transfer',
      binding: { from: 'operating', to: 'reserve', amount: 100 },
    },
    {
      entryId: 'L-2',
      status: 'pending',
      tenantId: 'tenant-a',
      actorId: 'agent-7',
      actionId: 'notice-9',
      idempotencyKey: 'notice-9',
      correlationId: 'corr-notice-9',
      kind: 'notify',
      binding: { channel: 'ops', template: 'reserve-change' },
    },
    {
      entryId: 'recovery-compensation-transfer-100',
      status: 'confirmed',
      tenantId: 'tenant-a',
      actorId: 'agent-7',
      actionId: 'compensate:transfer-100',
      idempotencyKey: 'compensate:pay-100',
      correlationId: 'compensate:corr-transfer-100',
      kind: 'compensation',
      binding: {
        originalActionId: 'transfer-100',
        approvalId: 'APR-9',
        from: 'reserve',
        to: 'operating',
        amount: 100,
      },
    },
    {
      entryId: 'recovery-audit-audit-7',
      status: 'confirmed',
      tenantId: 'tenant-a',
      actorId: 'agent-7',
      actionId: 'audit-7',
      idempotencyKey: 'audit-7',
      correlationId: 'corr-audit-7',
      kind: 'audit',
      binding: {
        recordType: 'policy-decision',
        subjectId: 'transfer-100',
      },
    },
  ],
};

async function run(ledgerPath, outputPath, incidentPath = incidentFixture) {
  try {
    const result = await execFileAsync(process.execPath, [recover, incidentPath, ledgerPath, outputPath], {
      cwd: labRoot,
    });
    return { status: 0, stdout: result.stdout, stderr: result.stderr };
  } catch (error) {
    return { status: error.code, stdout: error.stdout, stderr: error.stderr };
  }
}

function assertCondition(condition, message) {
  if (!condition) throw new Error(message);
}

function isContained(parent, target) {
  const child = relative(parent, target);
  return child !== '' && child !== '..' && !child.startsWith(`..${sep}`) && !isAbsolute(child);
}

function assertWorkspacePath(path, label) {
  assertCondition(isContained(workspace, path), `${label} must be inside the test workspace`);
}

async function assertNotSymlink(path, label) {
  try {
    const stats = await lstat(path);
    assertCondition(!stats.isSymbolicLink(), `${label} must not be a symbolic link`);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

async function removeWorkspace() {
  assertCondition(isContained(labRoot, tmpRoot), 'temporary root must be inside lab root');
  assertCondition(isContained(tmpRoot, workspace), 'workspace deletion target must be inside temporary root');
  await assertNotSymlink(tmpRoot, 'temporary root');
  await assertNotSymlink(workspace, 'workspace');
  await rm(workspace, { recursive: true, force: true });
}

async function assertInputsUnchanged(originalIncidentBytes, originalIncidentEvents, originalLedgerBytes, sourceLedger) {
  const currentIncidentBytes = await readFile(incidentFixture);
  assert(currentIncidentBytes.equals(originalIncidentBytes), 'incident source bytes changed');
  assert.deepEqual(
    JSON.parse(currentIncidentBytes.toString('utf8')).events,
    originalIncidentEvents,
    'incident source events changed'
  );
  assert((await readFile(sourceLedger)).equals(originalLedgerBytes), 'ledger source bytes changed');
}

await removeWorkspace();
await mkdir(workspace, { recursive: true });

const originalIncidentBytes = await readFile(incidentFixture);
const originalIncident = JSON.parse(originalIncidentBytes.toString('utf8'));
const originalIncidentEvents = structuredClone(originalIncident.events);
const sourceLedger = resolve(workspace, 'ledger.json');
assertWorkspacePath(sourceLedger, 'source ledger');
await copyFile(ledgerFixture, sourceLedger);
const originalLedgerBytes = await readFile(sourceLedger);
const originalLedger = JSON.parse(originalLedgerBytes.toString('utf8'));
const originalEntries = structuredClone(originalLedger.entries);

const sameLedgerPath = await run(sourceLedger, sourceLedger);
assertCondition(sameLedgerPath.status === 1, 'source-equals-output must fail');
await assertInputsUnchanged(originalIncidentBytes, originalIncidentEvents, originalLedgerBytes, sourceLedger);

const sameIncidentPath = resolve(workspace, 'same-incident-output.json');
assertWorkspacePath(sameIncidentPath, 'same-incident output');
const sameIncidentResult = await run(sourceLedger, sameIncidentPath, sameIncidentPath);
assertCondition(sameIncidentResult.status === 1, 'incident-equals-output must fail');
assert(!(await readFile(sameIncidentPath).catch(() => null)), 'incident-equals-output must not be created');
await assertInputsUnchanged(originalIncidentBytes, originalIncidentEvents, originalLedgerBytes, sourceLedger);

const existingOutput = resolve(workspace, 'existing-output.json');
assertWorkspacePath(existingOutput, 'existing output');
const existingBytes = Buffer.from('evidence sentinel\n');
await writeFile(existingOutput, existingBytes);
const preexisting = await run(sourceLedger, existingOutput);
assertCondition(preexisting.status === 1, 'pre-existing output must fail');
assert((await readFile(existingOutput)).equals(existingBytes), 'pre-existing output bytes changed');
await assertInputsUnchanged(originalIncidentBytes, originalIncidentEvents, originalLedgerBytes, sourceLedger);

const symlinkOutput = resolve(workspace, 'ledger-symlink.json');
assertWorkspacePath(symlinkOutput, 'symlink output');
await symlink(sourceLedger, symlinkOutput);
const symlinkResult = await run(sourceLedger, symlinkOutput);
assertCondition(symlinkResult.status === 1, 'symlink alias must fail');
await assertInputsUnchanged(originalIncidentBytes, originalIncidentEvents, originalLedgerBytes, sourceLedger);

const hardlinkOutput = resolve(workspace, 'ledger-hardlink.json');
assertWorkspacePath(hardlinkOutput, 'hardlink output');
await link(sourceLedger, hardlinkOutput);
const hardlinkResult = await run(sourceLedger, hardlinkOutput);
assertCondition(hardlinkResult.status === 1, 'hardlink alias must fail');
await assertInputsUnchanged(originalIncidentBytes, originalIncidentEvents, originalLedgerBytes, sourceLedger);

const freshOutput = resolve(workspace, 'fresh-output.json');
assertWorkspacePath(freshOutput, 'fresh output');
const success = await run(sourceLedger, freshOutput);
assertCondition(success.status === 0, 'fresh output must succeed');
assert.equal(success.stdout, expectedSuccess, 'fresh output stdout changed');

const recovered = JSON.parse(await readFile(freshOutput, 'utf8'));
assert(recovered && typeof recovered === 'object', 'recovery output must be an object');
assert(!('state' in recovered), 'CLI output must not include a nested state property');
assert(!('metrics' in recovered), 'CLI output must not include metrics');
assert.deepEqual(recovered, expectedPersistedState, 'persisted output state changed');

assert(Array.isArray(recovered.entries), 'persisted ledger must include entries directly');
assert.equal(recovered.entries.length, originalEntries.length + 2, 'recovered ledger must contain exactly two new entries');
assert.deepEqual(
  recovered.entries.slice(0, originalEntries.length),
  originalEntries,
  'original ledger entries must remain an exact prefix of the recovered ledger'
);

const compensation = recovered.entries.find((entry) => entry.idempotencyKey === 'compensate:pay-100');
assert(compensation, 'compensation entry for transfer-100 is missing');
assert.deepEqual(compensation, expectedPersistedState.entries[2], 'compensation entry does not match the recovery contract');

const audit = recovered.entries.find((entry) => entry.entryId === 'recovery-audit-audit-7');
assert(audit, 'recovery audit entry for audit-7 is missing');
assert.deepEqual(audit, expectedPersistedState.entries[3], 'audit retry entry does not match the recovery contract');

const pendingNotice = recovered.entries.find((entry) => entry.idempotencyKey === 'notice-9');
assert(pendingNotice, 'pending notice entry was not preserved');
assert.equal(pendingNotice.entryId, 'L-2', 'pending notice entry identity changed');
assert.equal(pendingNotice.status, 'pending', 'unknown notice action must remain pending');

assert.equal(recovered.accounts.operating.balance, 1000, 'operating balance was not restored');
assert.equal(recovered.accounts.reserve.balance, 0, 'reserve balance was not restored');

const idempotencyKeys = recovered.entries.map((entry) => entry.idempotencyKey);
assert.equal(new Set(idempotencyKeys).size, idempotencyKeys.length, 'recovered ledger contains duplicate idempotency keys');
await assertInputsUnchanged(originalIncidentBytes, originalIncidentEvents, originalLedgerBytes, sourceLedger);

console.log('PASS output creation and alias protection');
await removeWorkspace();
