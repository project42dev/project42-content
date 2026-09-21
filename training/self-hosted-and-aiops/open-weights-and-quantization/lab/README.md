# Open weights and quantization offline lab

This lab runs on Node.js 22 using only native ESM and built-in modules. Do not install dependencies. No network, GPU, model file, or live provider account is required.

All names, sizes, runtime declarations, memory budgets, and task scores in `fixtures/` are synthetic teaching data. They are not vendor specifications, prices, benchmark results, or license grants. The fixture's `evidence` strings say what the exercise assumes. A real assessment would parse and hash the exact artifact, establish lineage, consult documentation for the exact runtime version and hardware, and measure representative tasks.

## Goal

The analyzer separates:

1. Predicted tensor payload: `parameters * measuredBpw / 8`.
2. Actual artifact bytes and container overhead.
The canonical public repository directory for this lab is https://github.com/project42dev/project42-content/tree/main/training/self-hosted-and-aiops/open-weights-and-quantization/lab. From the repository root, run `cd training/self-hosted-and-aiops/open-weights-and-quantization/lab/`, verify Node.js 22 with `node --version`, and run `node tests/run-tests.js` and `node src/cli.js fixtures/variants.json`; no dependencies need to be installed. Before repair, the immutable suite reports 10 passing tests and 2 failing tests. After repairing only `residentWeightBytesForRuntime`, the supplied execution results show all 12 tests passing, the repaired variants report retains `worked-q8` as READY while holding the two learner variants for their independent evidence failures, and `node src/cli.js fixtures/changed.json` exits successfully with the independent changed-input variant READY.
4. Independent lineage, discrepancy, quality, and memory gates.

`measuredBpw` already includes represented block scales, minima, and tensor mixtures. Do not add those costs again. `actualFileBytes - predictedPayloadBytes` is reported separately as container or unexplained overhead.

## Commands

From the repository root:

```bash
cd training/self-hosted-and-aiops/open-weights-and-quantization/lab/
node --version
node tests/run-tests.js
node src/cli.js fixtures/variants.json
```

No dependency installation command is needed.

## Completed worked example

For `worked-q8`:

```text
parameters = 8,000,000,000 weights
measuredBpw = 8.5 bits/weight
predictedPayloadBytes = 8,000,000,000 * 8.5 / 8
                      = 8,500,000,000 bytes
overheadBytes = 8,585,000,000 - 8,500,000,000
              = 85,000,000 bytes
discrepancyPercent = 85,000,000 / 8,500,000,000 * 100
                   = 1.00%
residentWeightBytes = 8,500,000,000 because runtime.mode is packed
memoryBudgetBytes = 10 * 1,073,741,824
                  = 10,737,418,240 bytes
quality = 9/10, threshold 8/10
result = READY
```

The payload is 8.5 GB or approximately 7.916 GiB. The budget is exactly 10 GiB.

## Deliberate bounded defect

`src/analyze.js` deliberately assumes every runtime keeps weights packed. Repair only `residentWeightBytesForRuntime`. Required behavior:

* `packed`: return predicted payload bytes.
* `dequantized`: return `parameters * denseBits / 8`.
* `UNKNOWN`: return `null`; the existing gate will add `runtime-unknown`.

Do not hardcode fixture IDs or expected numbers. Do not replace the file with the reference. Make the focused algorithm and gate repair, rerun the tests, and assess the changed input. Only after attempting the repair should you inspect `solution/reference.js`.

## Baseline tests

Command:

```bash
node tests/run-tests.js
```

Exact baseline output:

```text
PASS rejects a non-array manifest
PASS rejects a non-object variant
PASS validates integer parameter counts
PASS validates finite positive measured bpw
PASS validates units
PASS validates format enum
PASS validates runtime enum
PASS computes worked payload and overhead
PASS computes packed resident weights
FAIL computes dequantized resident weights: expected 16000000000, received 4900000000
FAIL leaves unsupported runtime resident memory UNKNOWN: expected null, received 3500000000
PASS accepts the changed input without identifier-specific logic
2 test(s) failed of 12.
```

Baseline exit code: `1`.

## Baseline report

Command:

```bash
node src/cli.js fixtures/variants.json
```

Exact baseline output before repair:

```text
worked-q8 predicted=8500000000 actual=8585000000 overhead=85000000 discrepancy=1.00% resident=8500000000 status=READY holds=none
learner-q4 predicted=4900000000 actual=5047000000 overhead=147000000 discrepancy=3.00% resident=4900000000 status=HOLD holds=size-discrepancy>2%|quality-below-threshold
learner-q3-unknown predicted=3500000000 actual=3535000000 overhead=35000000 discrepancy=1.00% resident=3500000000 status=HOLD holds=lineage-unknown|runtime-unknown
```

Exit code: `2`, because at least one variant is on HOLD.

## Repaired tests

After the focused repair, command:

```bash
node tests/run-tests.js
```

Exact repaired output:

```text
PASS rejects a non-array manifest
PASS rejects a non-object variant
PASS validates integer parameter counts
PASS validates finite positive measured bpw
PASS validates units
PASS validates format enum
PASS validates runtime enum
PASS computes worked payload and overhead
PASS computes packed resident weights
PASS computes dequantized resident weights
PASS leaves unsupported runtime resident memory UNKNOWN
PASS accepts the changed input without identifier-specific logic
All 12 tests passed.
```

Repaired exit code: `0`.

## Repaired report

Command:

```bash
node src/cli.js fixtures/variants.json
```

Exact repaired output:

```text
worked-q8 predicted=8500000000 actual=8585000000 overhead=85000000 discrepancy=1.00% resident=8500000000 status=READY holds=none
learner-q4 predicted=4900000000 actual=5047000000 overhead=147000000 discrepancy=3.00% resident=16000000000 status=HOLD holds=size-discrepancy>2%|quality-below-threshold|memory-budget-exceeded
learner-q3-unknown predicted=3500000000 actual=3535000000 overhead=35000000 discrepancy=1.00% resident=UNKNOWN status=HOLD holds=lineage-unknown|runtime-unknown
```

Exit code: `2`, because two variants remain on HOLD.

## Changed-input assessment

Command:

```bash
node src/cli.js fixtures/changed.json
```

Exact output:

```text
changed-q4-independent predicted=4900000000 actual=4949000000 overhead=49000000 discrepancy=1.00% resident=4900000000 status=READY holds=none
```

Exit code: `0`. This input has a different ID and values. Passing it demonstrates that the repair follows runtime evidence rather than memorizing the original fixture.

## Rubric

* 3 points: arithmetic uses measured bpw and reports exact payload, actual bytes, overhead, and discrepancy without double counting.
* 3 points: focused runtime repair handles packed, dequantized, and UNKNOWN modes and passes all immutable tests.
* 2 points: explanation identifies every hold and distinguishes GB from GiB.
* 1 point: changed-input assessment produces the documented result without hardcoding IDs.
* 1 point: reflection distinguishes synthetic fixture evidence from real artifact parsing, runtime documentation, and workload measurement.

A score of 8/10 passes. Copying the whole reference, editing tests or fixtures, or hardcoding expected variant IDs receives zero points for the focused-repair criterion.

## Recovery and reference

To restore the deliberate starter after an unsuccessful edit:

```bash
cp recovery/analyze.starter.js src/analyze.js
```

After attempting and documenting your repair:

```bash
diff -u src/analyze.js solution/reference.js
```
