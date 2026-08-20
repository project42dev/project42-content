# Design Typed Tool Contracts and Action Controls: text-only class

This route contains the complete teaching content, learner actions, feedback,
and assessment handoff without requiring audio, video, or animation.

## Welcome: Welcome And Outcomes

Welcome. This class turns a model's proposed tool call into a controlled application action. You will classify tool risk, write narrow input and result contracts, separate schema validation from authorization, place approval before impact, prevent duplicate side effects, verify real postconditions, and recover honestly when a tool outcome is uncertain.

## Narration: Action Risk Ladder

Not every tool deserves the same authority. Reading a public document differs from reading private records. Editing a local draft differs from sending it. Creating a preview differs from deploying production. Archiving a recoverable object differs from deleting it permanently. Classify each operation by data sensitivity, target scope, reversibility, external impact, cost, permission change, and destruction. Give the run only the operations and resolved resources it needs. Separate read credentials from write credentials, scope temporary credentials to one task, and expire them. Keep secrets outside prompts and ordinary logs. If a tool exposes arbitrary shell, SQL, network, or filesystem access, treat that breadth as a design defect unless the task genuinely requires it and a stronger sandbox contains it.

Visual alternative: Read, local reversible edit, external send, production change, permission change, and destruction receive progressively stronger scope, approval, verification, and recovery controls.

Sources:

- <https://developers.openai.com/api/docs/guides/function-calling>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview>
- <https://ai.google.dev/gemini-api/docs/function-calling>

## Narration: Typed Contract

Give each tool one clear purpose. Define required fields, allowed values, formats, length and numeric bounds, and reject unknown fields. Use stable result variants such as succeeded, failed, rejected, conflict, retryable transport failure, and outcome unknown. Document which variants may follow a side effect. Generated arguments must pass application validation even when a provider reports valid structured output. A valid resource identifier can still name the wrong tenant's object. A valid amount can still exceed policy. A valid operation can still be forbidden for the caller. The schema improves parsing and reduces ambiguity; it does not authenticate the principal, authorize the object, express user consent, or prove success.

Visual alternative: Schema validation accepts shape, application validation checks meaning, authorization checks the caller and resolved target, and execution returns a stable result union.

Sources:

- <https://developers.openai.com/api/docs/guides/function-calling>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview>
- <https://ai.google.dev/gemini-api/docs/function-calling>

## Demonstration: Contract Demonstration

Suppose an agent can archive a document. Its proposal contains resource ID doc one-two-three, operation archive, and an idempotency key. The JSON is valid. The executor authenticates the caller, resolves the document, and discovers that it belongs to a different workspace. The correct result is authorization denied, with no archive attempt. Now the caller selects an owned document, but the human approval names a different resource. Reject that mismatch too. Finally, the exact target and approval match. The executor records the idempotency key, performs one archive, queries the document state, and returns succeeded with postcondition evidence. The model never receives authority merely by producing well-shaped arguments.

Visual alternative: The first targets another workspace and is denied. The second mismatches approval and is denied. The third matches caller, target, operation, approval, and postcondition.

Sources:

- <https://developers.openai.com/api/docs/guides/function-calling>

## Narration: Approval Before Impact

Approval matters only while the reviewer can still prevent impact. Ask before sending, purchasing, publishing, deploying, changing permission, or destroying. Show the resolved target, operation, material arguments, expected effect, cost, reversibility, and evidence the reviewer is approving. Bind the approval to that exact action, identity, contract version, and expiry. Do not treat a general conversation, earlier approval, or approval for one target as permission for another. If arguments change after review, request a new approval. Low-risk read or local draft operations may be preauthorized by policy, but consequential effects need an explicit rule. The application, not the prompt, decides whether that rule is satisfied.

Visual alternative: Execution is allowed only when the current resolved action exactly matches the still-valid approval envelope.

Sources:

- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview>
- <https://ai.google.dev/gemini-api/docs/function-calling>

## Narration: Idempotency And Unknown

Design duplicate prevention before enabling retries. Give each logical operation a caller-stable idempotency key. Store the key with the resolved target, operation, request digest, and result. Reusing the key for different arguments is a conflict. A timeout after a write is not confirmed failure. Mark the outcome unknown, query the authoritative system, and reconcile the idempotency record before any retry. If the effect occurred, return the prior result. If it definitely did not, a bounded retry may be allowed. If evidence remains ambiguous, stop and escalate. Blind retry can duplicate messages, charges, permission changes, or deletions. Compensation and rollback are new actions with their own authorization and failure evidence.

Visual alternative: After timeout, the controller reconciles real state and chooses prior success, bounded retry after confirmed absence, or unknown and escalation.

Sources:

- <https://developers.openai.com/api/docs/guides/function-calling>

## Narration: Trusted Executor

Use a trusted executor between model and implementation. It authenticates the caller and workload, parses the proposed call, validates schema and business meaning, resolves the target, authorizes object and operation, verifies exact approval, enforces rate, cost, concurrency, and time limits, reserves idempotency, executes, checks the real postcondition, records a secret-safe audit event, and returns a stable result. Treat tool output as untrusted data because it may be stale, malformed, compromised, or contain instructions. Preserve call and result linkage without placing secrets or unnecessary personal data into traces. The executor can deny an action even when the model strongly recommends it. That is the boundary doing its job.

Visual alternative: Authentication, validation, resolution, authorization, approval, limits, idempotency, execution, postcondition, audit, and stable result surround the tool implementation.

Sources:

- <https://developers.openai.com/api/docs/guides/function-calling>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview>
- <https://ai.google.dev/gemini-api/docs/function-calling>

## Learner Prompt: Learner Tool Prompt

Choose one consequential tool. Write one schema constraint, one semantic validation, one object-level authorization check, one exact approval field, one idempotency rule, and one independent postcondition.

Learner action: Separate schema, semantic, authorization, approval, idempotency, and postcondition controls.

## Pause: Learner Work Time

## Checkpoint: Authorization Checkpoint

Checkpoint. A request matches the tool's JSON schema and names an existing document, but the authenticated caller does not own that document. The model says the change is necessary. Which control decides the result?

Learner action: Object-level authorization rejects the action regardless of schema validity or model recommendation.

Sources:

- <https://developers.openai.com/api/docs/guides/function-calling>

## Pause: Checkpoint Response Time

## Feedback: Authorization Feedback

Reject the action at object-level authorization. Schema validity proves only that the request can be parsed. The document's existence proves only that resolution succeeded. Neither grants this caller permission. The model's recommendation is not authority. Record a denied decision without exposing the other workspace's sensitive details. If you chose schema validation, add the missing identity and resource authorization step. If you chose human approval, remember that approval cannot grant a reviewer authority they do not possess.

If correct: You separated a valid shape from permission on the resolved object.

If retrying: Ask who authenticated, which exact object was resolved, and where the policy grants that principal the requested operation.

Sources:

- <https://developers.openai.com/api/docs/guides/function-calling>

## Transition: Activity Transition

Open the typed-tool threat test. Define one consequential tool, its stable result union, identity, validation, authorization, exact approval, limits, idempotency, postcondition, audit, and recovery controls. Run malformed arguments, an unauthorized target, injected tool output, timeout after possible success, and a duplicate call. Retain the contract and five-case result table.

## Pause: Activity Work Time

## Assessment Handoff: Assessment Handoff

When ready, begin the knowledge check. You will choose least privilege, place approval before impact, distinguish schema from authorization, reconcile an uncertain write, and classify tool output as untrusted data. The assessment begins only when you choose Begin knowledge check.

## Closing: Class Closing

Let the model propose. Let trusted code authenticate, validate, authorize, approve, execute once, verify, audit, and recover.
