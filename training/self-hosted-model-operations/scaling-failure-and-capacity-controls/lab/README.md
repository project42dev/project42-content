# Scaling capacity repair lab

Repository entry: [`training/self-hosted-model-operations/scaling-failure-and-capacity-controls/lab/`](./README.md)

Public repository URL: UNKNOWN because the repository origin was not supplied with this work item. The hosting repository's verified public origin would establish it. All executable commands below are repository-root-relative.

This deterministic Node 22 native ESM lab contains one focused defect. Admission uses nominal host slots instead of slots on ready, non-draining hosts. It has no dependencies, installation step, API keys, network calls, containers, model downloads, or live-infrastructure claims.

## File roles

- `src/schema.js` provides shared strict validation. Do not edit it.
- `src/policy.js` is the learner-editable starter with one defect.
- `src/simulate.js` prints a deterministic decision.
- `reference/policy.js` is an independent recovery implementation.
- `test/run-tests.js` contains the eight immutable tests.
- `fixtures/*.json` contain deterministic evidence.
- `worked-artifact.json` contains the complete design packet and answer key.
- `scripts/recover.js` restores the independent reference with Node-native file operations.
- `.tmp/` is the only temporary-fixture directory. Tests remove only their named bounded file.

## Requirements

Use Node 22 or later. Run every command from the repository root. No package installation is needed.

## Starter baseline

```text
node training/self-hosted-model-operations/scaling-failure-and-capacity-controls/lab/src/simulate.js training/self-hosted-model-operations/scaling-failure-and-capacity-controls/lab/fixtures/baseline.json
```

Exact starter stdout:

```text
fixture=baseline.json
readyCapacity=4 nominalCapacity=12 demand=9 queueLimit=2
admission=ADMIT decision=APPROVE
causes=none
```

Starter exit code: `0`.

## Immutable tests before repair

```text
node training/self-hosted-model-operations/scaling-failure-and-capacity-controls/lab/test/run-tests.js
```

Exact starter stdout:

```text
FAIL baseline-capacity: expected REJECT/capacity, got APPROVE/none
RESULT 7 passed, 1 failed
```

Starter test exit code: `1`.

The baseline oracle uses literal expected values. It does not derive the learner expectation from the reference implementation. The same test separately verifies that the independent reference reaches those literals.

## Repair

Edit only `src/policy.js`. Admission capacity must be the sum of slots on hosts whose status is `ready`. The status enum is mutually exclusive, so warming, draining, and failed hosts contribute zero. Preserve deadline, failure-domain, and cost gates. Do not implement deny-all because the changed-positive case must approve.

After repair, rerun the baseline. Exact repaired stdout:

```text
fixture=baseline.json
readyCapacity=4 nominalCapacity=12 demand=9 queueLimit=2
admission=REJECT decision=REJECT
causes=capacity
```

Repaired baseline exit code: `2`.

Rerun the tests. Exact repaired stdout:

```text
RESULT 8 passed, 0 failed
```

Repaired test exit code: `0`.

## Independent changed input

Prediction before execution: `changed-positive.json` has 4 + 4 = 8 ready slots. Eight ready slots plus queue limit 2 equals 10, which covers demand 9. Queue delay 40 ms plus service time 300 ms equals 340 ms, below deadline 1,000 ms. Two ready domains meet the minimum of two. Cost 20 is below 24. Predict APPROVE, then run:

```text
node training/self-hosted-model-operations/scaling-failure-and-capacity-controls/lab/src/simulate.js training/self-hosted-model-operations/scaling-failure-and-capacity-controls/lab/fixtures/changed-positive.json
```

Exact repaired stdout:

```text
fixture=changed-positive.json
readyCapacity=8 nominalCapacity=8 demand=9 queueLimit=2
admission=ADMIT decision=APPROVE
causes=none
```

Changed-input exit code: `0`. A rejection usually indicates deny-all, stale capacity, or damage to a separate gate. An approval of the baseline means ineligible slots are still counted.

## Recovery

Restore the independent reference implementation and rerun tests:

```text
node training/self-hosted-model-operations/scaling-failure-and-capacity-controls/lab/scripts/recover.js
node training/self-hosted-model-operations/scaling-failure-and-capacity-controls/lab/test/run-tests.js
```

Exact recovery-script stdout is `RECOVERED src/policy.js from reference/policy.js` with exit code `0`. Exact test stdout is `RESULT 8 passed, 0 failed` with exit code `0`.

## Fixture versus live integration

Fixtures simulate host status, slots, domains, deadlines, traffic, synthetic quality, and fictional cost. Passing proves only that the local decision function handles supplied evidence. It does not prove Kubernetes scheduling, device-plugin behavior, runtime compatibility, model readiness, cancellation, artifact integrity, security enforcement, provider API behavior, quality on a real model, billing, or production availability. Those require target-environment integration tests and observed telemetry.
