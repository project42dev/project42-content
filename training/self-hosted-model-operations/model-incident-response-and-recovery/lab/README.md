# Model incident response and recovery repair lab

Repository entry: [model incident response and recovery lab](./README.md)

This is a deterministic local fixture simulation. It performs no network call, model inference, deployment, payment, notification, approval, rollback, compensation, or other external action. It does not establish runtime or security contracts for Meta Llama, Qwen, DeepSeek, Mistral, Microsoft Phi, NVIDIA software, or another provider.

## Requirements

Use Node.js 22. The lab uses native ECMAScript modules, built-in Node APIs, no dependencies, no API keys, and no network. Run commands from the repository root.

## Defect and allowed edit

`src/starter.mjs` contains one deliberate defect. Its unknown-outcome branch treats a timeout as proof of failure and labels a retry allowed. Repair only the two assignments in that branch so the decision is `HOLD_RECONCILE` with reason `unknown outcome lacks matching authoritative final evidence`.

Edit only `src/starter.mjs`. Treat `tests/`, `reference/`, `fixtures/`, and `src/validate.mjs` as immutable. Do not import the reference. A blanket hold is invalid because matching authoritative failure evidence may permit a changed request after every recovery gate and both objectives pass. The program reports eligibility only. It never executes or approves an action.

## Prediction before the answer

Before editing, predict results for missing, stale, future-dated, wrong-identity, non-authoritative, partial, duplicate-completed, failed-gate, RTO-miss, RPO-miss, authoritative-success, and changed-retryable inputs. Explain which evidence establishes success, failure, or continued uncertainty.

## Commands and exact results

Run the starter:

```text
node training/self-hosted-model-operations/model-incident-response-and-recovery/lab/src/starter.mjs training/self-hosted-model-operations/model-incident-response-and-recovery/lab/fixtures/unknown-outcome.json
```

Before repair, stdout is exactly:

```text
{"incidentId":"INC-42","requestId":"req-pay-7","decision":"RETRY_ALLOWED","reason":"timeout treated as failure","recovery":"PASS","rto":{"actualMs":420000,"objectiveMs":600000,"pass":true},"rpo":{"actualMs":120000,"objectiveMs":300000,"pass":true}}
```

Exit code: 0.

Run immutable tests:

```text
npm test --prefix training/self-hosted-model-operations/model-incident-response-and-recovery/lab
```

Before repair, stdout is exactly:

```text
TEST FAILURE unknown-outcome.json: expected HOLD_RECONCILE/2, got RETRY_ALLOWED/0
TEST FAILURE stale-evidence.json: expected HOLD_RECONCILE/2, got RETRY_ALLOWED/0
TEST FAILURE future-evidence.json: expected HOLD_RECONCILE/2, got RETRY_ALLOWED/0
TEST FAILURE wrong-identity.json: expected HOLD_RECONCILE/2, got RETRY_ALLOWED/0
TEST FAILURE non-authoritative.json: expected HOLD_RECONCILE/2, got RETRY_ALLOWED/0
TEST FAILURE partial-outcome.json: expected HOLD_RECONCILE/2, got RETRY_ALLOWED/0
RESULT 17 passed, 6 failed
```

Exit code: 1.

After repair, rerun the starter command. Stdout is exactly:

```text
{"incidentId":"INC-42","requestId":"req-pay-7","decision":"HOLD_RECONCILE","reason":"unknown outcome lacks matching authoritative final evidence","recovery":"PASS","rto":{"actualMs":420000,"objectiveMs":600000,"pass":true},"rpo":{"actualMs":120000,"objectiveMs":300000,"pass":true}}
```

Exit code: 2.

After repair, the test command prints exactly:

```text
RESULT 23 passed, 0 failed
```

Exit code: 0.

Run the changed-input variation:

```text
node training/self-hosted-model-operations/model-incident-response-and-recovery/lab/src/starter.mjs training/self-hosted-model-operations/model-incident-response-and-recovery/lab/fixtures/changed-retryable.json
```

Stdout is exactly:

```text
{"incidentId":"INC-43","requestId":"req-pay-8","decision":"RETRY_ALLOWED","reason":"matching authoritative evidence proves failure","recovery":"PASS","rto":{"actualMs":300000,"objectiveMs":600000,"pass":true},"rpo":{"actualMs":100000,"objectiveMs":300000,"pass":true}}
```

Exit code: 0.

## Causal feedback and answer key

Missing evidence leaves both success and failure possible. Stale or future-dated evidence is not timely. Wrong-identity evidence concerns another principal. Non-authoritative evidence cannot settle the system of record. Partial evidence is not final. Each case must hold.

A matching completed-history entry or matching authoritative success returns `COMPLETED`, and the action never repeats. That historical result is distinct from permission for a new action. Matching authoritative failure can return `RETRY_ALLOWED` only if identity, access, quality, compatibility, capacity, telemetry, cost, and userService all pass and RTO and RPO both pass. Any failed gate or objective blocks a new attempt with exit 3. The changed fixture must remain retryable, so deny-all is not a valid repair.

Tests compare the learner implementation against literal expected decision, reason, recovery, RTO, RPO, and exit-code values. They separately verify the private reference against the same literals, so the reference is not used as a circular oracle for learner output. Tests report all failures instead of stopping at the first one.

Temporary files are created only under `lab/.tmp-tests`. Cleanup rejects paths outside that directory and removes only the bounded test directory.
