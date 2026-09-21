# Multi-agent handoff authority repair

This deterministic Node.js 22 lab tests application-level validation and authorization. It does not call a model, provider SDK, external tool, approval service, or network endpoint. Fixture side effects are data, not evidence of real execution.

Repository entry: [/training/reliable-agent-workflows/multi-agent-handoffs/lab/](/training/reliable-agent-workflows/multi-agent-handoffs/lab/)

## Run from the repository root

```sh
node training/reliable-agent-workflows/multi-agent-handoffs/lab/tests/run-tests.mjs
```

No dependencies or API keys are required.

Exact starter stdout:

```text
REFERENCE 22/22
LEARNER 20/22
FAIL excessive-permission: effectiveActions expected ["read"] got ["read","publish"]
FAIL changed-authority-input: effectiveActions expected ["comment"] got ["comment","delete"]
RESULT FAIL
```

Exact starter exit code: `1`.

## Repair one defect

Edit only `training/reliable-agent-workflows/multi-agent-handoffs/lab/src/handoff.mjs`.

The line marked `DELIBERATE DEFECT` trusts sender-requested actions. Retain only actions that are requested, permitted by `policy.recipientAllowed`, and absent from `packet.deniedActions`.

Do not return an empty list unconditionally. The independent changed input requests `["comment","delete"]` and must retain `comment`.

Exact repaired stdout:

```text
REFERENCE 22/22
LEARNER 22/22
RESULT PASS
```

Exact repaired exit code: `0`.

## Worked answer

For `excessive-permission`, `["read","publish"]` intersect `["read","comment"]` is `["read"]`. Removing denied `["publish","delete"]` leaves `["read"]`.

For `changed-authority-input`, `["comment","delete"]` intersect `["read","comment"]` is `["comment"]`. Removing denied delete leaves `["comment"]`.

Budget arithmetic is `3 - 1 = 2` receiver work turns. If the arithmetic yields zero, the result is paused with no active agent. If it is negative, the packet is rejected.

## Eight activity fixtures

1. `correct-transfer`: accepted; continuity fields survive.
2. `wrong-recipient`: rejected before activation.
3. `missing-provenance`: rejected because receiver-consumed facts lack provenance.
4. `excessive-permission`: accepted with authority narrowed to read.
5. `poisoned-context`: rejected because context has a nonallowlisted key.
6. `timeout`: escalated without replaying a recorded side effect.
7. `recursive-bounce`: rejected because depth 3 exceeds maximum 2.
8. `rejected-handoff`: escalated after explicit receiver rejection.

The suite preserves the original ten cases and adds tests for unproven context facts, null constraints, null return conditions, unknown events, missing policy bounds with depth 999, null policy, whitespace identifiers, nonstring actions, mismatched duplicate facts and artifacts, zero remaining work turns, and exhausted budget.

## Recovery

```sh
cp training/reliable-agent-workflows/multi-agent-handoffs/lab/src/handoff.starter.mjs training/reliable-agent-workflows/multi-agent-handoffs/lab/src/handoff.mjs
node training/reliable-agent-workflows/multi-agent-handoffs/lab/tests/run-tests.mjs
```

After attempting the repair, compare with `training/reliable-agent-workflows/multi-agent-handoffs/lab/reference/handoff.mjs`.

Do not edit `tests`, `fixtures`, `shared`, `reference`, or `src/handoff.starter.mjs`. Course packaging should mount those paths read-only or compare them with repository versions.

## Schema and runtime validation

`fixtures/handoff.schema.json` and `fixtures/policy.schema.json` document the complete structural contracts. `shared/validate.mjs` is the dependency-free typed runtime validator used by both starter and reference. It also enforces semantic equality between top-level facts/artifacts and the context actually consumed by the receiver.

## Live integration limit

A live adapter needs separate tests for serialization, authentication, role mapping, provider errors, cancellation, streaming, and observed tool results. Model-family names do not establish authorization, budget, or idempotency guarantees.

Node.js ESM documentation: https://nodejs.org/api/esm.html

OpenAI handoff transport documentation: https://openai.github.io/openai-agents-js/guides/handoffs/