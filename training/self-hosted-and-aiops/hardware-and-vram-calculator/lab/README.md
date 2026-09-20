# Hardware and VRAM calculator repair lab

Public directory: https://github.com/project42dev/project42-content/tree/main/training/self-hosted-and-aiops/hardware-and-vram-calculator/lab

This offline lab uses synthetic data to test planning arithmetic. It does not inspect a checkpoint, start a server, use a GPU, or measure throughput, latency, or real runtime allocation.

## Requirements

- Node.js 22
- No dependency installation, network, or GPU

From the repository root:

```bash
cd training/self-hosted-and-aiops/hardware-and-vram-calculator/lab/
node --version
node src/cli.mjs fixtures/baseline.json
node test/run-tests.mjs
```

## Evidence and representation boundary

`artifact.measuredBitsPerWeight` describes the synthetic packed artifact. `runtime.weightRepresentation` separately states whether runtime-resident weights remain `packed`, are `dequantized`, or are `UNKNOWN`. A dequantized representation requires `runtime.denseWeightDtypeBits`. KV dtype is separate from weight representation.

The fixtures are synthetic. They provide exact arithmetic inputs, not evidence about an actual model file, GPU, runtime, throughput, or latency.

## Deliberate defect and task

`src/core.mjs` performs validation, representation-aware weight calculations, safe integer checks, and KV calculations. `src/planner.mjs` contains one deliberate defect: its final required-KV gate uses `kvBytesPerSequence` instead of the already checked total for all requested sequences.

Repair only that assignment. Do not modify tests, hardcode fixture values, weaken validation, edit `src/core.mjs`, or replace the learner implementation with the reference.

After editing:

```bash
node test/run-tests.mjs
node src/cli.mjs fixtures/baseline.json
node src/cli.mjs fixtures/changed-concurrency.json
```

Only after attempting the repair:

```bash
node solution/reference-cli.mjs fixtures/baseline.json
```

Restore the complete deliberate starter and verify it:

```bash
cp recovery/planner.starter.mjs src/planner.mjs
node test/run-tests.mjs
```

The restored starter test command is expected to exit 1 and report the documented 6/4 baseline. It does not overwrite tests.

## Exit codes

- 0: plan status OK
- 2: invalid input shape, domain, unit, enum, relationship, or safe arithmetic
- 3: valid input but status UNKNOWN because the request is infeasible or unsupported
- 1: unexpected CLI or test-runner failure

## Exact expected runs

Commands and expected output are intentionally separate.

Starter baseline command:

```bash
node src/cli.mjs fixtures/baseline.json
```

Expected exit: `0`. Expected stdout is in `expected/starter-baseline.stdout.txt`.

Starter tests command:

```bash
node test/run-tests.mjs
```

Expected exit: `1`.

```text
{"passed":6,"failed":4,"failures":["baseline multiplies all simultaneous sequences","changed input fails closed above maximum concurrency","exact fit succeeds","one beyond exact fit is infeasible"]}
```

Repaired tests use the same command. Expected exit: `0`.

```text
{"passed":10,"failed":0,"failures":[]}
```

Repaired baseline exits 0 and matches `expected/repaired-baseline.stdout.txt`. Repaired changed concurrency exits 3 and matches `expected/repaired-changed.stdout.txt`.

## Why the answer works

The core has already validated that `kvBytesPerSequence * requestedSequences` is a safe integer and exposes it as `checkedRequestedKvBytes`. The repair changes the final gate from one sequence to this requested total. Maximum concurrency remains floored because a fractional sequence cannot hold the stated prompt and generation allowance.

## Rubric

- 4 points: focused assignment uses `checkedRequestedKvBytes` without hardcoded answers.
- 2 points: all 10 immutable gather-all cases pass.
- 2 points: baseline and changed outputs and exit codes match exactly.
- 1 point: validation and fail-closed UNKNOWN behavior remain intact.
- 1 point: evidence distinguishes synthetic arithmetic, artifact size, runtime residency, and UNMEASURED performance.

A whole-reference replacement, modified tests, hardcoded fixture answers, weakened validation, or a claim of measured performance receives no repair credit.