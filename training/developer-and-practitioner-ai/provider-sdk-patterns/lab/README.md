# Provider SDK patterns repair lab

This deterministic Node.js 22 native ESM lab repairs one ordering defect in a final-response OpenAI Responses adapter. It has no dependencies, makes no network calls, requires no API key, and does not reproduce live model behavior.

## Run from the repository root

```sh
node training/developer-and-practitioner-ai/provider-sdk-patterns/lab/verify.mjs
```

No installation step is required.

## Exact starter result

Stdout:

```text
FAIL fixture-incomplete-tool-hidden: expected truncated with 0 tool calls, received tool_request with 1 tool calls
PASS completed-message
PASS completed-refusal
PASS completed-tool-request
PASS in-progress-tool-hidden
PASS queued-tool-hidden
PASS failed-tool-hidden
PASS cancelled-tool-hidden
PASS missing-call-id
PASS item-id-is-not-call-id
PASS malformed-null-envelope
PASS malformed-output-object
PASS malformed-null-item
PASS malformed-content-object
PASS malformed-null-part
PASS partial-message-unknown-status
PASS incomplete-unknown-reason
RESULT 16 passed, 1 failed
```

Exit code: `1`

The failure occurs because `adapter.mjs` considers a ready function call before it handles `status: "incomplete"`. The ordinary-message branch already requires `status: "completed"`.

## Focused repair

Edit only `adapter.mjs`. Move incomplete-status classification before the function-call branch.

Preserve all existing rules:

1. `incomplete` plus `max_output_tokens` maps to `truncated`.
2. Another incomplete reason maps to `other`.
3. Partial text remains available for diagnostics.
4. Incomplete and all other noncompleted states expose no executable tool calls.
5. A completed function call requires its own nonempty `call_id`, name, and arguments.
6. An item `id` is not a fallback for `call_id`.
7. A valid completed refusal maps to `refused`.
8. A valid ordinary completed message maps to `complete`.
9. Unknown and malformed inputs map to `other` without throwing.
10. Raw status, incomplete reason, and valid usage remain available.

Do not edit `verify.mjs`, the fixture, `adapter.starter.mjs`, or `adapter.reference.mjs`. Do not hardcode fixture identifiers. Returning `other` for every response is not a valid repair.

## Exact repaired result

Stdout:

```text
PASS fixture-incomplete-tool-hidden
PASS completed-message
PASS completed-refusal
PASS completed-tool-request
PASS in-progress-tool-hidden
PASS queued-tool-hidden
PASS failed-tool-hidden
PASS cancelled-tool-hidden
PASS missing-call-id
PASS item-id-is-not-call-id
PASS malformed-null-envelope
PASS malformed-output-object
PASS malformed-null-item
PASS malformed-content-object
PASS malformed-null-part
PASS partial-message-unknown-status
PASS incomplete-unknown-reason
RESULT 17 passed, 0 failed
```

Exit code: `0`

## Independent learner variation

Run after repairing the adapter:

```sh
node training/developer-and-practitioner-ai/provider-sdk-patterns/lab/variation.mjs
```

Exact stdout:

```text
PASS changed-reason: outcome other, text Different partial text, rawStop content_filter, toolCalls 0
RESULT 1 passed, 0 failed
```

Exit code: `0`

The variation independently changes the id, incomplete reason, and partial text. It retains a ready call-shaped item. The result is `other` because this focused adapter has no established normalized outcome for `content_filter`. The incomplete status still suppresses tool execution.

## Recovery and reference

Restore the exact starter:

```sh
cp training/developer-and-practitioner-ai/provider-sdk-patterns/lab/adapter.starter.mjs training/developer-and-practitioner-ai/provider-sdk-patterns/lab/adapter.mjs
```

Inspect the reference only after attempting the repair:

```sh
node --check training/developer-and-practitioner-ai/provider-sdk-patterns/lab/adapter.reference.mjs
```

The verifier declares expected values independently and does not import the reference.

## Fixture versus live integration

This fixture tests local parsing only. It cannot establish current model availability, provider uptime, account permissions, billing, SDK behavior, or live model behavior. A separate real integration test must use approved credentials, the native provider surface, explicit storage policy, bounded attempts and budget, cancellation, and provider-specific assertions. No live provider call was executed for this lab.
