# Model update and rollback lifecycle repair lab

This deterministic Node.js 22 native-ESM exercise simulates a promotion decision and rollback rehearsal. It has no dependencies, API keys, network calls, live model, container, cluster, approval service, database, or telemetry service. All identities, observations, people, and approvals are synthetic fixtures. Passing the lab is not production approval.

A real integration must verify retained artifacts and provenance, exercise the deployed runtime, inspect actual state and telemetry, and obtain authenticated approvals. A Kubernetes Deployment revision rollback does not itself restore databases, external state, queues, indexes, object stores, or deleted model artifacts.

Public repository entry: [lab README](./README.md)

## Prediction before the answer

Inspect `fixtures/packet.json` and `fixtures/changed-compatible.json` before opening the reference.

1. Predict the starter decision for the packet whose recovery gate fails.
2. Explain why `rollbackCompatible: false` and the schema evidence make promotion unsafe.
3. Predict the correct decision for the renamed compatible fixture.
4. Explain why rejecting both fixtures is deny-all behavior.

## Safe backup

Run from the repository root:

```sh
mkdir -p training/self-hosted-model-operations/model-update-and-rollback-lifecycle/lab/.lab-tmp
cp training/self-hosted-model-operations/model-update-and-rollback-lifecycle/lab/src/decision.mjs training/self-hosted-model-operations/model-update-and-rollback-lifecycle/lab/.lab-tmp/decision.backup.mjs
```

These commands create one bounded directory under the lab and copy one named file.

## Starter behavior

```sh
node training/self-hosted-model-operations/model-update-and-rollback-lifecycle/lab/src/run.mjs training/self-hosted-model-operations/model-update-and-rollback-lifecycle/lab/fixtures/packet.json
```

Exact starter stdout:

```text
DECISION: PROMOTE
ROLLBACK_COMPATIBLE: false
FAILED_GATES: none
```

Starter exit code: `0`.

Run both immutable test files:

```sh
node --test training/self-hosted-model-operations/model-update-and-rollback-lifecycle/lab/test/decision.test.mjs training/self-hosted-model-operations/model-update-and-rollback-lifecycle/lab/test/reference.test.mjs
```

Expected starter result: 29 tests are discovered, 28 pass, only `incompatible rollback state blocks promotion` fails, and the process exits `1`. TAP timing and ordering across files may vary. The stable failed assertion expects `reject` and receives `promote`. This is an expected result derived from the supplied code, not a claim that this corrected artifact was executed.

## Repair

Edit only:

```text
training/self-hosted-model-operations/model-update-and-rollback-lifecycle/lab/src/decision.mjs
```

Keep the export and return shape. Do not modify validation, fixtures, tests, or the reference. The single defect excludes recovery while collecting failed gates. A correct repair includes every gate whose status is not `pass`.

Exact repaired packet stdout:

```text
DECISION: REJECT
ROLLBACK_COMPATIBLE: false
FAILED_GATES: recovery
```

Repaired packet exit code: `2`.

Expected repaired test result: 29 pass, zero fail, exit code `0`.

## Independent renamed variation

```sh
node training/self-hosted-model-operations/model-update-and-rollback-lifecycle/lab/src/run.mjs training/self-hosted-model-operations/model-update-and-rollback-lifecycle/lab/fixtures/changed-compatible.json
```

Exact stdout after a correct repair:

```text
DECISION: PROMOTE
ROLLBACK_COMPATIBLE: true
FAILED_GATES: none
```

Exit code: `0`. Different release identities and evidence rule out hardcoding. Required promotion rules out deny-all.

## Simulated guardrail failure and rollback

```sh
node training/self-hosted-model-operations/model-update-and-rollback-lifecycle/lab/src/rehearse.mjs training/self-hosted-model-operations/model-update-and-rollback-lifecycle/lab/fixtures/packet.json
```

Exact stdout:

```text
SIMULATION_ONLY: true
EXPOSURE_PERCENT: 1
OBSERVATION_MINUTES: 10
GUARDRAIL: safety_refusal_rate_delta observed=0.05 maximum=0.02 result=FAIL
ACTION: STOP_AND_DRAIN
DRAIN_TIMEOUT_SECONDS: 120
ROLLBACK_TARGET: svc-2026-09-01
READBACK_RELEASE: svc-2026-09-01
READBACK_MODEL_DIGEST: sha256:1111111111111111111111111111111111111111111111111111111111111111
READBACK_IMAGE_DIGEST: sha256:3333333333333333333333333333333333333333333333333333333333333333
READBACK_STATE_SCHEMA: conversation-v1
READBACK_TELEMETRY_SCHEMA: telemetry-v3
READBACK_READY: true
READBACK_COMPLETE_MANIFEST_MATCH: true
ROLLBACK_VERIFIED: true
```

Exit code: `0`.

`READBACK_COMPLETE_MANIFEST_MATCH` is computed by structurally comparing the complete readback manifest with the baseline. The immutable tests independently alter release, model, tokenizer, runtime, accelerator libraries, image, adapters, prompt templates, policy, gateway configuration, infrastructure configuration, evaluation identity, telemetry schema, state schema, and readiness. Every mismatch must make verification false.

This command processes fixtures only. It does not prove that traffic was exposed, a drain occurred, external state was restored, artifacts were recovered, or a real approval was issued.

## Answer and causal feedback

The starter predicate filters out `recovery`. Replace it with a predicate that selects every gate whose status is not `pass`.

If the incompatible fixture still promotes, recovery is still excluded or overridden. If the renamed compatible fixture rejects, the implementation is deny-all or identity-specific. If contradictory compatibility evidence, malformed digests, missing fields, unknown values, empty required arrays, non-finite ranges, or readback mismatches are accepted, shared validation or recovery verification was weakened outside the focused repair.

## Recovery and reference

Restore the starter backup:

```sh
cp training/self-hosted-model-operations/model-update-and-rollback-lifecycle/lab/.lab-tmp/decision.backup.mjs training/self-hosted-model-operations/model-update-and-rollback-lifecycle/lab/src/decision.mjs
rm training/self-hosted-model-operations/model-update-and-rollback-lifecycle/lab/.lab-tmp/decision.backup.mjs
rmdir training/self-hosted-model-operations/model-update-and-rollback-lifecycle/lab/.lab-tmp
```

After attempting the repair, apply the independent reference:

```sh
cp training/self-hosted-model-operations/model-update-and-rollback-lifecycle/lab/reference/decision.mjs training/self-hosted-model-operations/model-update-and-rollback-lifecycle/lab/src/decision.mjs
node --test training/self-hosted-model-operations/model-update-and-rollback-lifecycle/lab/test/decision.test.mjs training/self-hosted-model-operations/model-update-and-rollback-lifecycle/lab/test/reference.test.mjs
```

The learner tests do not use the reference to calculate expected decisions. The suite creates and removes only `.lab-tmp/changed-input.json` under this lab.
