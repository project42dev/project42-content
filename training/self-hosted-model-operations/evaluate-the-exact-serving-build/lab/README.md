# Exact serving build release-gate repair lab

This deterministic Node.js 22 native ESM lab uses trusted synthetic fixture records. It makes no network request, needs no API key or dependency, and does not evaluate, measure, attest, or approve a live model. Synthetic digest labels identify fixture builds only.

## Defect

`src/gate.js` uses only aggregate pass rate. Shared strict parsing and validation are identical for starter and reference execution. Validation rejects malformed, empty, unknown, mistyped, unbound, or arithmetically false records before the learner predicate runs. The only deliberate learner defect is the gate predicate, which permits a candidate with a failed critical authorization case. Edit only `src/gate.js`. Do not edit tests, validation, or fixtures.

A correct gate requires exact identity, complete evidence, truthful integer denominators, aggregate rate at or above the predeclared threshold, no critical failure, both service objectives, and recovery. It must accept a valid positive changed input. Do not hard-code a fixture filename or case ID.

## Predict before running

The supplied candidate passes 11/12 cases but fails critical case C06. Predict stdout, exit code, and release result before running the starter. Then predict the result after repair. Finally predict the generated all-pass changed input.

## Repository-root commands

```sh
node training/self-hosted-model-operations/evaluate-the-exact-serving-build/lab/src/gate.js training/self-hosted-model-operations/evaluate-the-exact-serving-build/lab/fixtures/release-dossier.json
node --test training/self-hosted-model-operations/evaluate-the-exact-serving-build/lab/test/gate.test.js
```

Starter exact result:

```text
stdout: PASS aggregate=91.67% criticalFailures=1\n
exit: 0
```

Repaired exact result:

```text
stdout: REJECT aggregate=91.67% criticalFailures=1 reasons=critical-failure:C06\n
exit: 2
```

Positive changed-input exact result, asserted by the immutable tests:

```text
stdout: PASS aggregate=100.00% criticalFailures=0\n
exit: 0
```

Node's TAP timing text can vary. With the starter installed, the 24-test suite has 16 passed and 8 failed, with process exit code 1. The eight failures are: critical failure is not averaged away; exact CLI outputs and exit codes; exact identity mismatch fails closed; denominator mismatch assessment fails closed; evidence incomplete assessment fails closed; aggregate below threshold fails closed; service failure fails closed; and recovery failure fails closed. The starter CLI output is `PASS aggregate=91.67% criticalFailures=1\n` with exit code 0. After repair, the CLI output is `REJECT aggregate=91.67% criticalFailures=1 reasons=critical-failure:C06\n` with exit code 2, because C06 remains a critical failure. Independent learner execution and independent reference execution each pass all 24 tests, with process exit code 0. Validation probes pass in the starter because strict shared validation is not the learner task. Node's native ECMAScript module behavior is documented at https://nodejs.org/api/esm.html#native-esm, and the test runner's TAP output and timing fields are documented at https://nodejs.org/api/test.html.

## Recovery and reference

To restore the starter:

```sh
cp training/self-hosted-model-operations/evaluate-the-exact-serving-build/lab/starter/gate.js training/self-hosted-model-operations/evaluate-the-exact-serving-build/lab/src/gate.js
```

To install the independent reference after attempting the repair:

```sh
cp training/self-hosted-model-operations/evaluate-the-exact-serving-build/lab/private/reference-gate.js training/self-hosted-model-operations/evaluate-the-exact-serving-build/lab/src/gate.js
node --test training/self-hosted-model-operations/evaluate-the-exact-serving-build/lab/test/gate.test.js
```

These commands use repository-relative paths and work from the repository root on platforms that provide `cp`. If `cp` is unavailable, copy the named file with the platform's file-copy command. Test file paths are derived from `import.meta.url`, not the process working directory. Temporary generated fixtures stay under `lab/.tmp/`. Tests remove only that bounded directory through `fs.promises`, with a bounded synchronous exit fallback. Node's file-system API documents the promise-based file-system operations at https://nodejs.org/api/fs.html#file-system.

## Causal answer key

The aggregate-only predicate answers the wrong question. Eleven ordinary passes cannot compensate for an unauthorized write. The repair composes independent conditions and reports the condition that failed. Identity mutations produce `identity-mismatch`; omitted evidence produces `evidence-incomplete`; a declared denominator inconsistent with records produces `denominator-mismatch`; aggregate, service, and recovery failures produce their own reasons. The all-pass variation proves the predicate is not deny-all. Renamed generated files prove the decision is based on parsed content rather than a fixture name.

Strict validation requires exact nonempty typed build identities, nonempty baseline and candidate result sets, complete case-bound evidence records for baseline and candidate, service evidence bound to each objective, and recovery evidence bound to every recovery case. It also requires the same explicit comparison workload, case, grader, and configuration conditions except for separately declared candidate build variables. Empty identities, deletion of the baseline, or labels such as `ABSENT` without matching evidence records are validation errors, not PASS inputs.

The dossier's outputs, latencies, reviewer names, evidence, and signatures are synthetic. Real integration requires observations from the exact deployed artifact under bound workload, runtime, hardware, resource, policy, and grader conditions. A passing fixture gate or test suite is not deployment approval.
