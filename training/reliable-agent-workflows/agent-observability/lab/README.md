# Agent observability redaction repair lab

This deterministic Node 22 native ESM lab repairs one telemetry defect. It uses synthetic JSON fixtures, no dependencies, no API keys, no network calls, no live model, no real tool execution, and no real approval. Passing it is not proof of production instrumentation.

## Files

- `redact.mjs`: the only learner-editable file
- `run.mjs`: focused baseline runner
- `data/failed-trace.json`: complete visible trace
- `data/changed-trace.json`: independent changed input used by tests
- `test/redact.test.mjs`: immutable invariant tests
- `reference/redact.mjs`: independent reference implementation

## Run from the repository root

```sh
node training/reliable-agent-workflows/agent-observability/lab/run.mjs
```

Exact starter stdout:

```text
TRACE tr_demo_7
APPROVAL_ARGS {"accountId":"acct_demo_7","destination":"ops@example.test","apiKey":"SYNTHETIC_CANARY_KEY_7"}
RESULT FAIL privacy values exported
```

Starter exit code: `1`.

Edit only `training/reliable-agent-workflows/agent-observability/lab/redact.mjs`. Replace every approval span's `attributes.toolArgs` value tree with:

```json
{"fields":["sorted","topLevel","fieldNames"],"redacted":true}
```

Preserve all trace and span structure, statuses, IDs, timings, usage, versions, and unrelated safe attributes. Do not hard-code the visible field names. Do not mutate the input object.

Run the immutable tests:

```sh
node --test training/reliable-agent-workflows/agent-observability/lab/test/redact.test.mjs
```

The changed fixture uses different IDs, fields, nesting, values, and order. Deleting the trace, deleting every attribute, or returning a fixed baseline answer fails.

Exact repaired runner stdout:

```text
TRACE tr_demo_7
APPROVAL_ARGS {"fields":["accountId","apiKey","destination"],"redacted":true}
RESULT PASS approval arguments redacted
```

Repaired exit code: `0`.

## Causal test feedback

- A canary value in output means approval values were not fully removed.
- Missing IDs, spans, status, or safe model metadata means the repair over-deleted telemetry.
- Wrong fields on the changed fixture mean the solution was hard-coded or handled only one shape.
- A changed source fixture means the sanitizer mutated its input.

## Recovery

Read the independent reference at `training/reliable-agent-workflows/agent-observability/lab/reference/redact.mjs`. To restore it on a shell with `cp`:

```sh
cp training/reliable-agent-workflows/agent-observability/lab/reference/redact.mjs training/reliable-agent-workflows/agent-observability/lab/redact.mjs
node training/reliable-agent-workflows/agent-observability/lab/run.mjs
node --test training/reliable-agent-workflows/agent-observability/lab/test/redact.test.mjs
```

A correct recovery produces the repaired stdout, exit code 0, and passing tests.