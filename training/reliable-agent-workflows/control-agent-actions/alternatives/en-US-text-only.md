# Design Typed Tool Contracts and Action Controls: text-only class

This route contains the complete teaching content, learner actions, feedback,
and assessment handoff without requiring audio, video, or animation.

## Welcome: Welcome And Outcomes

Welcome. This class turns a model's proposed ticket update into a controlled application action. You will separate typed inputs, trusted authority, exact approval, revision checks, idempotency, mutation evidence, postcondition verification, and recovery. The executable fixture is offline and in-memory. It makes no network calls, uses no credentials, and creates no external effects or paid model calls. Today we inspect why.

## Narration: Action Risk Ladder

Not every tool call deserves same controls. Classify data access, reversibility, external impact, cost, permission change, and destruction. Reading differs from editing; editing differs from sending; previewing differs from deploying. Grant only the actor, tenant, resource, operation, and time needed. Keep credentials outside prompts and ordinary logs. Separate read, reversible local, external communication, production, permission, and destructive policies before execution.

Visual alternative: Read, reversible local change, external communication, production change, permission change, and destructive change receive distinct controls.

Sources:

- <https://developers.openai.com/api/docs/guides/function-calling>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview>
- <https://ai.google.dev/gemini-api/docs/function-calling>

## Narration: Runtime Input Contract

The action contract has exactly five own fields: action, targetId, toStatus, operationKey, expectedVersion. Runtime checks reject missing, extra, inherited, or prototype-polluting fields. Patterns restrict ticket and operation identifiers; enums restrict the action and destination status; safe nonnegative integers restrict revisions. Types help developers, but application validation still runs on every proposed call before any side effect can occur at all.

Visual alternative: The action name, ticket identifier, destination status, operation key, and expected revision each have a narrow validation rule.

Sources:

- <https://json-schema.org/draft/2020-12/json-schema-validation.html>
- <https://json-schema.org/draft/2020-12/json-schema-core.html>
- <https://json-schema.org/draft/2020-12/json-schema-core.html>

## Narration: Runtime Output Contract

The output contract always returns a stable kind: success, invalid, denied, conflict, or uncertain. Invalid means malformed contract or evidence. Denied means current authority, transition, approval, or budget refuses the request. Conflict marks stale revisions, changed payloads under one key, or contradictory evidence. Uncertain means mutation may have happened without sufficient proof. Controllers recover from kind and code, not prose.

Visual alternative: Success confirms the effect, invalid rejects malformed data, denied rejects current permission or policy, conflict reports incompatible state, and uncertain requires reconciliation.

Sources:

- <https://github.com/project42dev/project42-content/blob/4000879/training/reliable-agent-workflows/control-agent-actions/lab/contract.js>

## Narration: Exact Approval

Trusted authority and approval answer different questions. Actor scope plus policy decides whether this principal may mutate this tenant's resolved ticket. Approval decides whether a reviewer accepted this exact actor, tenant, action, target, destination status, expected version, and operation key. A prior conversation cannot substitute. Any changed target, payload, revision, or key requires a new exact match before execution proceeds.

Visual alternative: Actor scope and policy authorize the resolved resource; approval separately matches actor, tenant, action, target, status, revision, and operation key.

Sources:

- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview>
- <https://ai.google.dev/gemini-api/docs/function-calling>

## Narration: Trusted Executor Sequence

The executor validates environment, action, and trusted context first. It checks the idempotency fingerprint before mutation, then authorizes actor and policy, compares the current revision, binds approval, and enforces step, simulated cost, rate, and deterministic time limits. Only then does it update status once. Afterward it independently queries ticket state and every receipt sharing the operation key before declaring success.

Visual alternative: Validation, idempotency, authorization, revision, approval, limits, mutation, and independent verification occur in order.

Sources:

- <https://nodejs.org/api/globals.html#structuredclone>
- <https://nodejs.org/api/globals.html>

## Narration: Worked State Transition

In the happy path, ticket_12345678 begins OPEN at version seven, with zero receipts and zero mutations. The request asks for RESOLVED at expectedVersion seven under op_resolve_acme_0001. After checks pass, the fixture changes status to RESOLVED, increments version to eight, records one mutation, and adds one matching receipt. Verification proves exactly that ticket and receipt pair, so result kind is success, UPDATED.

Visual alternative: Before execution there are zero mutations and receipts. After verified execution there is one mutation, one matching receipt, and a success result.

## Demonstration: Counter Demonstration

Run the complete fixture set from the repository root. The exact command is visible in the stage direction. The first summary is happy-path: success, with one call mutation, one cumulative mutation, and one receipt. These counters are intentionally different. Call mutations belong to this invocation. Cumulative mutations span calls sharing the fixture environment. Receipts count evidence, not writes. Never infer zero mutation from a missing receipt, because evidence and effect can diverge after execution or failure.

Sources:

- <https://nodejs.org/api/esm.html#packages>

## Demonstration: Required Threat Cases

The required negative cases expose distinct boundaries. malformed-arguments is invalid with zero mutations. unauthorized-target is denied with zero. injected-tool-output still succeeds once because hostile text remains bounded data. timeout-after-success is uncertain after one mutation and one receipt. duplicate-call returns cached success with zero new mutations, one cumulative mutation, and one receipt. Together they test parsing, authority, trust, uncertainty, and idempotency.

Sources:

- <https://nodejs.org/api/test.html>

## Narration: Additional Safety Tests

Five additional fixtures test happy execution, stale approval, mismatched approval, changed payload reuse, and failed postcondition. Stale and mismatched approvals are denied before mutation. Reusing a key with changed payload conflicts while preserving the first mutation. omit_receipt changes the ticket once but returns uncertain with zero receipts. Independent tests also revoke resource or policy before cached reuse and require denial.

Sources:

- <https://nodejs.org/api/test.html>

## Narration: Cumulative Budget Demo

Budget figures are fixture units, not billing or security metrics. A trusted context accumulates steps, costUnits, and rateActions after each attempted mutation. Distinct operations sharing that context therefore consume one cumulative budget. The deterministic clock must remain inside its configured window; this lab denies outside it rather than silently resetting usage. Evaluate preflight against current usage plus the proposed charge.

Sources:

- <https://github.com/project42dev/project42-content/blob/4000879/training/reliable-agent-workflows/control-agent-actions/lab/contract.js>

## Narration: Uncertain Recovery Demo

For timeout-after-success, run the case with --trace --recover. Recovery reports query=one, retryPerformed=false, callMutations=0, cumulativeMutations=1, and receipts=1. Reconciliation inspects the preserved operation, ticket, and all keyed receipts. One exact effect becomes verified. Zero evidence leaves uncertain without automatic retry. Extra, malformed, or contradictory evidence becomes conflict. Recovery never retries, selects convenient evidence, or invents certainty when authoritative state remains unresolved afterward.

Sources:

- <https://nodejs.org/api/test.html>

## Checkpoint: Authorization Checkpoint

Checkpoint. A request matches the tool schema and names an existing ticket, but the authenticated caller lacks that resource. Which control decides the result? Object-level authorization must deny it. Shape only proves parsing, existence only proves resolution, approval cannot create missing authority, and model recommendation has no permission. Record denial without exposing another tenant's sensitive details or attempting mutation.

Learner action: Select object-level authorization and explain why schema validity, target existence, approval, and model recommendation do not grant authority.

## Pause: Checkpoint Response Pause

## Feedback: Authorization Feedback

Before assessment, explain each failure by the first control that should stop it. Shape errors fail validation. Cross-tenant targets fail authorization. Changed revisions conflict. Approval mismatches deny. Exhausted cumulative budgets deny. Unknown outcomes reconcile without blind retries. Missing receipts can coexist with one mutation. These rules transfer to local, open-weight, and hosted adapters, although this offline fixture tests no provider.

If correct: Correct. You identified the first trusted control and connected it to the prevented mutation.

If retrying: Start with the resolved target and current caller, then move through revision, approval, budget, mutation, and independent evidence.

## Narration: Changed Exercise Demonstration

Watch the changed input, not its filename. The action contains action, targetId, toStatus, operationKey, and expectedVersion. Actor and tenant remain in trusted context, not the action. Repair only approval: resourceId ticket_87654321, expectedVersion 4, and operationKey op_beta_resolve_0001. The starter passes 3 of 4 checks and fails 1 because those approval bindings mismatch. Run the supplied test. The repaired solution passes 4 of 4, mutates once, sets the ticket to RESOLVED at version 5, and records accepted approval. A stale expectedVersion 3 conflicts before mutation. Changing targetId to ticket_12345678 is denied before mutation. Adding action.approval is INVALID_ACTION because approval is an unknown action field. It does not enlarge scope. All three negative variants produce zero mutations. Explain each result by naming the failed guard and its causal evidence.

Sources:

- <https://nodejs.org/api/test.html>

## Learner Prompt: Changed Exercise Prompt

Now begin the Changed Policy and Target Exercise. Edit only exercise/changed-input.js. The fixed request is actor_learner resolving ticket_87654321 in tenant_beta from version four with op_beta_resolve_0001. Actor resources and policy target are already correct. Repair only approval.resourceId, approval.expectedVersion, and approval.operationKey. Do not edit the executor, tests, action, policy, or environment. Then run the exercise test command and diagnose failures causally yourself.

Learner action: Edit only the three incorrect approval bindings and run the four independent exercise checks.

## Pause: Changed Exercise Pause

## Feedback: Exercise Diagnosis Feedback

The starter is deliberately unsafe as a negative control and is expected to fail; never present it as a solution. The changed-input starter begins three of four tests passing. A safe repair makes all four pass. Success requires one mutation to RESOLVED version five and an accepted approval ledger entry. Stale revision, changed target, and forged authority variants must not mutate.

If correct: The three approval fields now bind the exact target, revision, and operation key while negative variants remain unable to mutate.

If retrying: Compare the action with approval.resourceId, approval.expectedVersion, and approval.operationKey. Do not broaden actor scope or policy.

Sources:

- <https://nodejs.org/api/test.html>

## Pause: Causal Diagnosis Pause

## Assessment Handoff: Assessment Handoff

Begin the knowledge check only when you are ready. Choose least privilege, approval before impact, object-level authorization after schema validation, reconciliation after an uncertain write, and distrust of tool-output instructions. For every answer, identify the mutation that would occur if the wrong control were trusted. Canonical integration remains blocked until factual, learning, accessibility, and editorial qualification approve this draft package.

## Closing: Class Closing

Let the model propose. Let trusted code validate the runtime contract, resolve the target, check current authority, bind exact approval and revision, enforce cumulative limits, execute once, verify independent state and evidence, and reconcile uncertainty without blind retry. Preserve the distinction between mutation and receipt. Keep the fixture's offline teaching guarantees separate from production security, durability, authentication, accounting, and provider claims.
