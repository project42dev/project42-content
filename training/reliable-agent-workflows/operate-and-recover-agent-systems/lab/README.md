# Operate and recover agent systems repair lab

This deterministic Node.js 22 lab models a timeout after a consequential write, stale retrieved policy, and an unsupported completion claim. It uses local JSON fixtures as a simulated system of record. It does not call a model, transfer money, send a notification, contact a provider, or grant a real approval.

## Requirements

- Node.js 22 or later
- No dependencies
- No API keys
- No network access
- Native ESM only

From the repository root:

```sh
cd training/reliable-agent-workflows/operate-and-recover-agent-systems/lab
npm test
npm run test:output-contract
```

Edit only `src/reconcile.mjs`. Do not edit fixtures, shared validation, tests, or recovery logic. The output-contract regression test is an independent test in `test/output-contract.mjs`; it is run separately so the original eight learner checks and their output remain unchanged.

## The single learner defect

The starter labels every timed-out action `MISSING`. It does not query persisted entries by idempotency key. This creates an unsafe retry decision for a transfer that already committed. The immutable recovery guard detects the attempted duplicate.

The repair must search `state.entries` by `action.idempotencyKey` and return `CONFIRMED` for one confirmed matching entry, `MISSING` for no entry, and `UNKNOWN` for a pending or otherwise unverifiable entry. Shared validation has already rejected duplicate keys and binding mismatches. Do not hard-code fixture IDs. Do not return `UNKNOWN` for everything because the missing audit write must be retried exactly once.

## Worked example: baseline fixture

Run the starter or repaired CLI with the baseline incident and ledger:

```sh
node src/recover.mjs fixtures/incident.json fixtures/ledger.json .tmp/recovered-ledger.json
```

The causal sequence is:

1. `transfer-100` timed out after its consequential write. Looking only at the timeout labels it missing, but the ledger contains a confirmed entry for idempotency key `pay-100`, so the safe decision is `CONFIRMED`.
2. The confirmed transfer is not retried. Because stale policy caused the incident, the scoped approval permits compensation. Recovery verifies operating balance `1000` and reserve balance `0`.
3. `audit-7` has no persisted entry. It is retried once with its original key and becomes `CONFIRMED`.
4. `notice-9` has a pending, unverifiable postcondition. It is not retried and is escalated.
5. The output contains the six original incident events and two original ledger entries, allowing reconstruction of the incident.

Exact repaired stdout:

```text
INCIDENT INC-2042 SEV-1 CONTAINED
RECONCILE transfer-100: CONFIRMED
COMPENSATE transfer-100: VERIFIED operating=1000 reserve=0
RECONCILE audit-7: MISSING
RETRY audit-7: CONFIRMED key=audit-7
RECONCILE notice-9: UNKNOWN
ESCALATE notice-9: unverifiable postcondition
EVIDENCE preserved events=6 originalEntries=2
METRICS confirmed=1 missing=1 unknown=1 duplicateWrites=0 restoredOperating=1000 restoredReserve=0
RESULT RECOVERED_WITH_ESCALATION
```

The repaired command exits `0`. The starter exits `1` because the unsafe retry is blocked.

## Independent learner variation

Run the changed fixture without changing the reconciliation algorithm:

```sh
node src/recover.mjs fixtures/incident-changed.json fixtures/ledger-changed.json .tmp/changed-ledger.json
```

The changed fixture uses different incident, action, entry, key, approval, amount, and balance values. The same causal rules must apply: confirm the already persisted action, compensate only after the allowed verification, retry the absent audit write once, and escalate the unknown notification. Its exact metrics line is:

```text
METRICS confirmed=1 missing=1 unknown=1 duplicateWrites=0 restoredOperating=500 restoredReserve=0
```

The changed command exits `0`. If a solution hard-codes `transfer-100`, `pay-100`, or the baseline balances, this variation exposes the defect.

## Output-file evidence contract

The incident and ledger arguments are source evidence. The output argument must name a new regular file. The CLI rejects all of these cases with exit code `1`, prints an error, and leaves source and pre-existing output bytes unchanged:

- output path exactly equals the incident or ledger path
- output path is an existing symlink to an input
- output path is an existing hard link to an input
- output path is any other pre-existing file

The CLI uses Node's exclusive file creation mode (`fs.promises.open(path, 'wx')`). This is an atomic create-if-absent operation, so a race that creates the output after validation is also rejected rather than overwritten. A newly created output is removed if recovery or serialization fails. The source files are never opened for writing.

Repeated runs must use a new output path, for example:

```sh
mkdir -p .tmp
node src/recover.mjs fixtures/incident.json fixtures/ledger.json .tmp/run-001.json
node src/recover.mjs fixtures/incident.json fixtures/ledger.json .tmp/run-002.json
```

Use `.tmp/` as the repository-local scratch path. It is intentionally inside the lab and should not contain evidence that needs to be retained. Do not use the fixture paths for output.

Run the focused regression independently:

```sh
npm run test:output-contract
```

It tests source-equals-output, a pre-existing evidence file, symlink and hard-link aliases, unchanged source bytes after each rejection, and a fresh output success with exact baseline stdout and preserved evidence counts.

## Existing checks and reference

After the learner repair, `npm test` prints:

```text
PASS baseline classifications and recovery
PASS changed-input classifications and recovery
PASS original evidence preservation
PASS duplicate binding rejection
PASS malformed type rejection
PASS unknown identity rejection
PASS invalid budget rejection
PASS mismatched binding rejection
PASS all 8 checks
```

Exit code: `0`. The test oracle checks required state directly. It does not merely compare learner output with the reference. The separate reference implementation is in `reference/reconcile.reference.mjs` and can be checked with:

```sh
npm run test:reference
```

The focused output-contract test is separate from the reference and does not use the reference implementation as its oracle.

## Fixture simulation versus live integration

The ledger is a deterministic fixture simulation. In a live integration, replace local lookup with an authenticated system-of-record query, follow the actual provider or tool retry guidance, protect tenant-scoped credentials, record real correlation identifiers, and require a real approval system for compensation. Passing this lab does not certify a production integration or prove any external action occurred.

This lab's provider metadata is deliberately local and provider-neutral: no model, provider, API, or external system is invoked. The implementation uses native Node.js ESM and the Node.js 22 `fs.promises` and path APIs documented at:

- https://nodejs.org/api/fs.html#fspromisesopenpath-flags-mode
- https://nodejs.org/api/fs.html#fspromisesmkdirpath-options
- https://nodejs.org/api/fs.html#fspromisesreadfilepath-options
- https://nodejs.org/api/path.html#path_dirname_path
- https://nodejs.org/api/esm.html#top-level-await

## ASSUMPTIONS.

- The supplied repository paths, fixtures, recovery core, reference implementation, and existing eight-check test are unchanged except for the files returned in this artifact.
- Node.js 22 supports `fs.promises.open()` with the `'wx'` exclusive-create mode and `FileHandle.writeFile()`.
- The focused test runs on a filesystem supporting symlinks and hard links, as required by the alias-protection contract.

## OMITTED.

- No live provider integration, model call, network access, or external system-of-record query was added because the lab explicitly specifies a deterministic local fixture simulation.
- No existing module, fixture, recovery logic, learner test, or reference implementation was rewritten.
