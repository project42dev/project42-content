# Model identity, license, and provenance lab

This offline Node.js 22 lab evaluates synthetic evidence under a fictional educational policy. It does not interpret vendor licenses, grant rights, establish Open Source AI status, or provide legal advice. An authorized human legal or policy reviewer remains responsible for consequential interpretation.

The artifact files and every dossier number are synthetic. SHA-256 and date calculations are real computations over supplied files and inputs. A matching hash verifies byte identity only. It does not prove publisher identity, training data, architecture, quality, authority to distribute, or claimed lineage. No benchmark is run or claimed.

## Requirements

- Node.js 22
- No dependencies or installation
- No network, GPU, model download, or remote execution

## Commands

Run from the repository root:

```bash
cd training/self-hosted-model-operations/model-identity-license-and-provenance/lab/
node src/cli.mjs fixtures/positive.json --as-of 2026-09-20
node test/run-tests.mjs starter
```

The worked command exits 0 and prints:

```text
{"fixture":"positive.json","asOf":"2026-09-20","completeness":{"known":12,"total":12,"percent":100,"missing":[]},"disposition":"approve-isolated-evaluation","reasons":[]}
```

## One deliberate defect

Only `src/evaluate.mjs` is intentionally wrong. It preserves direct prohibition but approves when assessment reports missing or contradictory evidence. All boundary validation is already implemented: exact object and array shapes, integer domains, units, enums, proposal-to-matrix binding, real calendar dates, rejection of an `asOf` date before `decision.date`, deterministic expiry, and realpath containment under `artifacts/`, including symlink resolution.

Edit only `src/evaluate.mjs`. Do not hardcode fixture names, expected answers, or reason strings, and do not replace the file wholesale from the reference. The focused repair is one general gate.

## Test commands

Commands:

```bash
node recovery/reset.mjs
node test/run-tests.mjs starter
# attempt the repair in src/evaluate.mjs
node test/run-tests.mjs learner
# only after attempting the repair
node test/run-tests.mjs reference
```

Expected starter output and exit code 1:

```text
PASS positive-before-expiry
FAIL hold-contradiction: expected hold-for-evidence, got approve-isolated-evaluation
PASS reject-prohibition
FAIL changed-distribution: expected hold-for-evidence, got approve-isolated-evaluation
PASS positive-day-before-expiry
FAIL positive-on-expiry: expected hold-for-evidence, got approve-isolated-evaluation
FAIL positive-after-expiry: expected hold-for-evidence, got approve-isolated-evaluation
PASS invalid-decision-date
PASS invalid-as-of-date
PASS as-of-before-decision
PASS stale-proposed-use
PASS stale-proposed-users
PASS stale-proposed-distribution
PASS empty-matrix
PASS outside-artifacts
PASS windows-different-drive
PASS symlink-escape
13 passed; 4 failed; 0 skipped
```

Expected learner output after the focused repair and exit code 0:

```text
PASS positive-before-expiry
PASS hold-contradiction
PASS reject-prohibition
PASS changed-distribution
PASS positive-day-before-expiry
PASS positive-on-expiry
PASS positive-after-expiry
PASS invalid-decision-date
PASS invalid-as-of-date
PASS as-of-before-decision
PASS stale-proposed-use
PASS stale-proposed-users
PASS stale-proposed-distribution
PASS empty-matrix
PASS outside-artifacts
PASS windows-different-drive
PASS symlink-escape
17 passed; 0 failed; 0 skipped
```

Expected reference output and exit code 0 is identical to the learner output above. Reference mode imports `solution/reference.mjs`; it does not modify the learner file.

If the platform reports `EPERM` or `ENOTSUP` while creating the same-drive symlink probe, replace `PASS symlink-escape` with:

```text
SKIP symlink-escape: platform does not support this symlink probe: EPERM
```

Use the actual reported code. The supported-platform starter summary becomes `12 passed; 4 failed; 1 skipped`, and the repaired learner and reference summary becomes `16 passed; 0 failed; 1 skipped`. A skipped probe is not claimed as containment coverage. Any other symlink exception fails the case.

The test runner creates dossier probes and the external symlink target only beneath `lab/test-scratch/`; it does not use the operating system temporary directory or read an external canary. The symlink itself is created beneath `artifacts/` so that canonical-path containment is exercised, then removed. On Windows, `path.relative()` can return an absolute path for paths on different drives, so containment also rejects an absolute relative result. See the Node.js documentation for [`path.relative()`](https://nodejs.org/api/path.html#pathrelativefrom-to), [`path.isAbsolute()`](https://nodejs.org/api/path.html#pathisabsolutepath), [`fs.realpath()`](https://nodejs.org/api/fs.html#fsrealpathpath-cache-options), and [`fs.symlink()`](https://nodejs.org/api/fs.html#fssymlinktarget-path-type).

## Individual repaired outputs

Commands:

```bash
node src/cli.mjs fixtures/hold.json --as-of 2026-09-20
node src/cli.mjs fixtures/reject.json --as-of 2026-09-20
node src/cli.mjs fixtures/changeduse.json --as-of 2026-09-20
node src/cli.mjs fixtures/positive.json --as-of 2026-10-20
```

Expected output, one line per command:

```text
{"fixture":"hold.json","asOf":"2026-09-20","completeness":{"known":9,"total":12,"percent":75,"missing":["tokenizer.digest","lineage.base","provenance.noGaps"]},"disposition":"hold-for-evidence","reasons":["artifact-digest-mismatch","contradictory-terms","lineage-gap"]}
{"fixture":"reject.json","asOf":"2026-09-20","completeness":{"known":12,"total":12,"percent":100,"missing":[]},"disposition":"reject","reasons":["explicitly-prohibited"]}
{"fixture":"changeduse.json","asOf":"2026-09-20","completeness":{"known":11,"total":12,"percent":91.67,"missing":["terms.matrix"]},"disposition":"hold-for-evidence","reasons":["use-not-covered"]}
{"fixture":"positive.json","asOf":"2026-10-20","completeness":{"known":11,"total":12,"percent":91.67,"missing":["decision.expiry"]},"disposition":"hold-for-evidence","reasons":["decision-expired"]}
```

## Why the tests are independent

The runner invokes the CLI for public behavior and imports validation and assessment only to construct changed-input boundary probes. It directly exercises the exported containment helper with synthetic `D:\\artifacts` and `C:\\path` Windows paths, without reading either path. Expected dispositions and validation substrings are stored in the test file, not imported from `evaluate.mjs` or the reference. The temporal regression requires `--as-of 2020-01-01` to fail because it precedes the synthetic decision dated 2026-09-20. All cases run even after failure. Nonzero unexpected exits, signals, malformed JSON, and exceptions fail a case. Reference mode selects a separate implementation through an explicit environment variable.

## Rubric and answer

- 4 points: all 17 independent cases pass, or 16 pass with only the documented unsupported symlink probe skipped.
- 2 points: the change is the focused, data-driven hold gate in `src/evaluate.mjs`, with no fixture or expected-output hardcoding.
- 1 point: direct prohibition remains highest priority.
- 1 point: the learner explains matrix binding, deterministic expiry, and artifact containment.
- 1 point: the learner explains that hashes prove matching bytes, not provenance.
- 1 point: the learner explains that the fictional disposition is not legal approval and names re-review triggers.

Eight of ten points demonstrates completion. Hardcoding answers, editing tests, or replacing the whole learner file from the reference earns zero for the focused-repair criterion.

The worked repair is:

```js
if (assessment.completeness.missing.length > 0 || assessment.problems.length > 0) {
  return { disposition: 'hold-for-evidence', reasons: assessment.problems };
}
```

Place it after the prohibition branch and before approval.

## Recovery

Command:

```bash
node recovery/reset.mjs
```

Expected output and exit code 0:

```text
Restored deliberate starter defect in src/evaluate.mjs
```

The command copies the immutable starter into `src/evaluate.mjs` and changes no other file.