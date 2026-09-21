# Offline capacity admission repair lab

[Repository lab entry](/training/self-hosted-model-operations/hardware-runtime-and-capacity-planning/lab/README.md)

This Node.js 22 native ESM lab has no dependencies, API keys, model downloads, containers, cloud calls, or charges. It evaluates deterministic JSON fixtures. It does not run a model or benchmark hardware, and passing it does not approve a real deployment.

## Learning defect

`capacity.mjs` has exactly one deliberate calculation defect: `dynamicGiB` is assigned zero. Dynamic cache must scale with concurrent requests and the maximum token allowance. Validation, host memory, storage, rollback, startup transfer, cost, and output structure are already working and must remain unchanged.

Use this formula:

`dynamicGiB = concurrency × (maxTokens / 1000) × cacheGiBPerKTokens`

Then compute `totalGiB = baseGiB + dynamicGiB`. Admission remains the conjunction of accelerator, host, and storage limits.

## Root-relative commands

Run these commands from the repository root:

```text
node training/self-hosted-model-operations/hardware-runtime-and-capacity-planning/lab/capacity.mjs training/self-hosted-model-operations/hardware-runtime-and-capacity-planning/lab/fixtures/base.json
node training/self-hosted-model-operations/hardware-runtime-and-capacity-planning/lab/capacity.mjs training/self-hosted-model-operations/hardware-runtime-and-capacity-planning/lab/fixtures/changed-overload.json
node training/self-hosted-model-operations/hardware-runtime-and-capacity-planning/lab/test/capacity.test.mjs
```

Each CLI command writes one JSON line to stdout. Successful CLI evaluation exits 0. Invalid JSON or invalid fields write a named error to stderr and exit 1.

## Exact starter results

Base starter stdout:

```text
{"schemaVersion":"1.0","scenario":"base-safe","accelerator":{"baseGiB":14,"dynamicGiB":0,"totalGiB":14,"limitGiB":23,"withinLimit":true},"host":{"requiredGiB":18,"limitGiB":24,"withinLimit":true},"storage":{"requiredGiB":54,"limitGiB":80,"withinLimit":true},"startupSeconds":8,"dailyCostUSD":57.6,"admit":true}
```

Exit code: `0`.

Changed-overload starter stdout:

```text
{"schemaVersion":"1.0","scenario":"changed-overload","accelerator":{"baseGiB":14,"dynamicGiB":0,"totalGiB":14,"limitGiB":23,"withinLimit":true},"host":{"requiredGiB":18,"limitGiB":24,"withinLimit":true},"storage":{"requiredGiB":54,"limitGiB":80,"withinLimit":true},"startupSeconds":8,"dailyCostUSD":57.6,"admit":true}
```

Exit code: `0`. This admission is wrong because the changed workload needs 10 GiB of dynamic cache.

Starter test stdout is deterministic:

```text
PASS base admits a genuine under-limit request
FAIL changed workload includes per-concurrent-request cache: dynamicGiB expected 10, received 0
FAIL changed overload is rejected: totalGiB expected 24, received 14
PASS shared validation rejects invalid values and units
SUMMARY 2 passed, 2 failed
```

Starter test exit code: `1`.

## Repair

Edit only `capacity.mjs`. Replace the zero assignment with the formula above. Do not edit the tests, fixtures, validation module, or reference. Do not hardcode scenario names or totals. Do not return false for every request, because the base request genuinely fits.

A minimal correct replacement is:

```js
const dynamicGiB = input.workload.concurrency
  * (input.workload.maxTokens / 1000)
  * input.accelerator.cacheGiBPerKTokens;
```

## Exact repaired results

Base repaired stdout:

```text
{"schemaVersion":"1.0","scenario":"base-safe","accelerator":{"baseGiB":14,"dynamicGiB":8,"totalGiB":22,"limitGiB":23,"withinLimit":true},"host":{"requiredGiB":18,"limitGiB":24,"withinLimit":true},"storage":{"requiredGiB":54,"limitGiB":80,"withinLimit":true},"startupSeconds":8,"dailyCostUSD":57.6,"admit":true}
```

Exit code: `0`.

Changed-overload repaired stdout:

```text
{"schemaVersion":"1.0","scenario":"changed-overload","accelerator":{"baseGiB":14,"dynamicGiB":10,"totalGiB":24,"limitGiB":23,"withinLimit":false},"host":{"requiredGiB":18,"limitGiB":24,"withinLimit":true},"storage":{"requiredGiB":54,"limitGiB":80,"withinLimit":true},"startupSeconds":8,"dailyCostUSD":57.6,"admit":false}
```

Exit code: `0`. A capacity rejection is a successful calculator execution, so the process exits 0 while `admit` is false.

Repaired test stdout:

```text
PASS base admits a genuine under-limit request
PASS changed workload includes per-concurrent-request cache
PASS changed overload is rejected
PASS shared validation rejects invalid values and units
SUMMARY 4 passed, 0 failed
```

Repaired test exit code: `0`.

## Worked reasoning and answer key

Base accelerator arithmetic is `10 static + 2 workspace + 2 safety = 14 GiB` before request cache. Dynamic cache is `4 × (4000 / 1000) × 0.5 = 8 GiB`. Total is `14 + 8 = 22 GiB`, so 22 is at or below the 23 GiB ceiling and the request is admitted.

Changed overload uses `5 × (4000 / 1000) × 0.5 = 10 GiB` dynamic cache. Total is `14 + 10 = 24 GiB`, which exceeds 23 GiB and is rejected.

The host calculation remains `6 + 2 + 1 + 2 + 2 + 2 + 3 = 18 GiB`, including recovery headroom. Storage remains `12 + 4 + 6 + 5 + 3 + 12 + 12 = 54 GiB`, including distinct backup and rollback copies. Startup transfer remains `12 GB / 1.5 GB/s = 8 seconds`. Cost remains `USD 2.40 × 24 = USD 57.60`. These are fixture calculations, not measurements.

## Independent changed-input variation

Create a repository-local copy of `changed-overload.json`, such as `.learner-workspaces/concurrency-3.json`, and change only `workload.concurrency` from 5 to 3. Predict before running:

`dynamicGiB = 3 × 4 × 0.5 = 6 GiB`

`totalGiB = 14 + 6 = 20 GiB`

Expected stdout is the same structure with your retained scenario string, `dynamicGiB: 6`, `totalGiB: 20`, `withinLimit: true`, and `admit: true`. This variation catches deny-all logic and solutions hardcoded only for the two supplied scenario names.

## Recovery

If files were accidentally changed, restore `validation.mjs`, `reference/capacity.reference.mjs`, `test/capacity.test.mjs`, and both fixture files from the repository, then make the one-line calculation repair again. If a test says dynamic cache is 0, the formula was not connected to concurrency, tokens, and cache rate. If total is 24 but `admit` is true, inspect the accelerator limit comparison. If the base case is rejected, undo deny-all logic or an altered limit. If validation tests fail, restore the shared validator rather than weakening input checks.

The tests create temporary changed input only below `lab/.test-workspaces/` and remove the individual workspace after execution. The independent reference never imports the learner calculation. The test also derives its expected dynamic cache directly from changed input, so a fixture-specific constant does not satisfy the changed workload.
