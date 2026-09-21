# Percentile aggregation repair lab

Repository entry: `training/self-hosted-model-operations/observability-cost-and-performance/lab/README.md`. Run every command from the repository root. This is Node.js 22 native ESM, with no dependencies, network calls, model calls, or API keys. Fixtures simulate compatible cumulative histograms. They are not production observations, provider benchmarks, prices, approvals, or evidence that a live integration works.

## Predict first

Baseline replica totals are 100, 40, and 10. Predict whether equal weighting of replica p95 values represents the combined request population. Inspect `fixtures/changed.json` and predict how its unequal traffic changes the result.

## Starter

```sh
node training/self-hosted-model-operations/observability-cost-and-performance/lab/src/cli.mjs training/self-hosted-model-operations/observability-cost-and-performance/lab/fixtures/baseline.json
```

Supplied Node 22 run evidence: starter tests exit 1, stderr is empty, and stdout is:

```text
FAIL baseline aggregate: expected 397.22, received 546.67
FAIL changed-input aggregate: expected 375.00, received 391.67
PASS 6 tests
RESULT failed=2 passed=6
```

The deliberate defect averages replica-level p95 values. Do not average quantiles when traffic differs.

## Repair

Edit only `src/aggregate.mjs`. Preserve `aggregateP95(input)` and its result fields. Sum matching cumulative buckets across replicas, then estimate p95 once. Do not edit fixtures, validator, or immutable tests. Do not return a constant, discard traffic, remove validation, or deny all inputs.

## Repaired output

The baseline repaired CLI output is:

```text
p95_ms=397.22 requests=150 replicas=3 release=rel-2026-09-13-a
```

Stderr is empty and exit code is 0. Immutable tests output:

```text
PASS 8 tests
RESULT failed=0 passed=8
```

Stderr is empty and exit code is 0. The changed fixture must produce 375.00 ms.

## Independent reference

```sh
node training/self-hosted-model-operations/observability-cost-and-performance/lab/reference/run-reference.mjs training/self-hosted-model-operations/observability-cost-and-performance/lab/fixtures/baseline.json
```

Expected stdout is `p95_ms=397.22 requests=150 replicas=3 release=rel-2026-09-13-a` plus a newline. Stderr is empty and exit code is 0. The reference uses independent aggregation code.

## Recovery

```sh
cp training/self-hosted-model-operations/observability-cost-and-performance/lab/solution/aggregate.mjs training/self-hosted-model-operations/observability-cost-and-performance/lab/src/aggregate.mjs
node training/self-hosted-model-operations/observability-cost-and-performance/lab/test/run-tests.mjs
```

To restore the deliberate starter:

```sh
cp training/self-hosted-model-operations/observability-cost-and-performance/lab/starter/aggregate.mjs training/self-hosted-model-operations/observability-cost-and-performance/lab/src/aggregate.mjs
```

Tests create and remove only the bounded `.tmp-tests` directory under this lab.

The finite final bucket covers all observations in these fixtures. Production ingestion requires complete overflow or count evidence. Local fixture measurements are not production claims.