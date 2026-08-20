# Safe Tool-Use Workflow: text-only class

This route contains the complete teaching content, learner actions, feedback,
and assessment handoff without requiring audio, video, or animation.

## Welcome: Welcome And Outcomes

Welcome. Tool use turns generated intent into action, so this class focuses on delegated authority rather than novelty. You will define what one tool can read or change, expose consequential parameters before execution, verify the real postcondition, and recover from timeouts, duplicate calls, partial effects, and untrusted output. The goal is a workflow in which people can see, approve, verify, cancel, and recover from consequence.

## Narration: Tool Contract Explanation

Begin with a tool contract. Give the tool one clear purpose. Define typed inputs, permitted values, size and format limits, required identifiers, and validation failures. Define success, error, and unknown-outcome responses. Inventory every system and data class the tool reads, writes, sends, spends, or deletes. Name side effects such as a message, charge, deployment, permission change, record update, or external disclosure. Record authentication and least-privilege requirements, call-rate and cost ceilings, timeouts, and concurrency limits. Decide whether the action is safe to retry. If it writes, identify an idempotency key or state that it is not retry-safe. Finally, name the required approval, postcondition check, audit fields, compensation, rollback, and escalation path. A capability description says what a tool can do. A contract says when, where, and under whose authority it may do it.

Visual alternative: The contract names purpose, validated inputs, response shapes, systems read or changed, side effects, call limits, retry behavior, exact approval, and verification or recovery.

Sources:

- <https://developers.openai.com/api/docs/guides/function-calling>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview>
- <https://ai.google.dev/gemini-api/docs/function-calling>

## Demonstration: Message Tool Demonstration

Consider a tool that sends a customer status message. Its purpose is one outbound message to one resolved recipient after review. Inputs include the recipient identifier, approved channel, subject, body, incident reference, and idempotency key. It reads approved contact data and writes to the messaging service. Side effects include external communication, possible disclosure, and provider cost. The model may draft text, but it cannot choose an ambiguous recipient, widen the audience, or invent incident facts. Before approval, the interface shows the resolved recipient, exact message, channel, and expected send. Approval binds to those values for one attempt. Verification checks the provider record and message identifier, not the model's statement that it sent successfully. Recovery distinguishes confirmed failure from an unknown result after timeout.

Visual alternative: The preview exposes one recipient, channel, message, incident reference, idempotency key, one-use approval, and provider-state verification.

Sources:

- <https://developers.openai.com/api/docs/guides/function-calling>

## Narration: Visible Bounded Execution Explanation

Resolve intent before execution. Translate the request into the exact tool, target, action, and material parameters. Reject missing or ambiguous identifiers instead of guessing. Validate values against the contract, then compare consequence with the current approval tier. Read-only inspection, reversible internal writes, external communication, spending, permission changes, and destructive action should not share one blanket permission. Before a consequential call, show the person the resolved target, operation, important values, expected effect, and recovery boundary. Apply count, time, cost, and concurrency ceilings in code rather than relying on polite instructions. Treat returned text and files as untrusted data. A webpage, document, issue, or tool response may contain malicious directions asking the system to ignore policy, reveal secrets, change tools, or contact another target. Those words remain data inside the task; they do not become governing authority. Stop when the call would exceed scope or approval.

Visual alternative: Approval increases from read-only inspection to reversible write, external action, spending, permission change, and destructive action.

Sources:

- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview>
- <https://ai.google.dev/gemini-api/docs/function-calling>

## Learner Prompt: Approval Preview Prompt

Choose one tool-enabled task. List the exact target, action, material parameters, visible side effects, and recovery limit a person must see before approving it. Name one value the workflow must never guess.

Learner action: Create an approval preview bound to a resolved action and identify one fail-closed input.

Sources:

- <https://ai.google.dev/gemini-api/docs/function-calling>

## Pause: Approval Preview Work Time

## Narration: Postcondition Verification Explanation

A returned success value is not the same as the intended postcondition. Define what must be true in the target system and check it independently. After creating a record, confirm that exactly one record exists with the expected values. After writing a file, compare location, size, and digest. After deployment, check the deployed version, health, and a representative behavior. After sending a message, reconcile the provider's delivery record with the approved recipient and idempotency key. Verification should also detect forbidden effects: no second record, no widened audience, no unapproved permission, and no unrelated file change. Create an audit record containing the request identity, authorization decision, resolved target, tool and contract version, material parameters or safe digest, start and completion time, result, postcondition evidence, and recovery disposition. Do not log credentials, tokens, full private content, or unnecessary personal data. If the postcondition cannot be checked, report uncertainty rather than success.

Visual alternative: Rows for records, files, deployments, and messages map each action to target-system evidence, forbidden effects, and secret-safe audit fields.

Sources:

- <https://developers.openai.com/api/docs/guides/function-calling>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview>

## Checkpoint: Timeout After Success Checkpoint

Checkpoint. A payment tool times out after submitting a request. The model says the call failed and proposes sending it again with the same amount and recipient but no idempotency key. What is the outcome state, and what should happen next?

Learner action: Classify the outcome as unknown, stop the retry, reconcile the payment system using a safe request identity, and escalate if the result cannot be established.

Sources:

- <https://developers.openai.com/api/docs/guides/function-calling>

## Pause: Timeout Response Time

## Feedback: Timeout After Success Feedback

The outcome is unknown, not confirmed failure. The external service may have accepted the request before the response was lost. Stop the blind retry. Reconcile the provider using the original safe request identity, recipient, amount, and time window without exposing payment secrets. If one matching payment exists, record success and do not repeat it. If confirmed absent and the authorized workflow permits a new attempt, create a new controlled request. If state cannot be established, escalate. If you chose immediate retry, revise the rule: transport failure does not prove business failure. Consequential writes need idempotency and target-state verification before repetition.

If correct: You preserved the unknown outcome, prevented a duplicate charge, and required reconciliation before any authorized next action.

If retrying: A timeout describes the missing response, not whether the external payment happened. Check target state before repeating a write.

Sources:

- <https://developers.openai.com/api/docs/guides/function-calling>

## Narration: Partial Failure Recovery Explanation

Plan recovery for partial and repeated execution. Give retryable writes stable idempotency keys and store enough state to recognize the same intended action. Separate confirmed failure, confirmed success, and unknown outcome. In a multi-step workflow, record each completed effect before starting the next dependent action. When a later step fails, stop the sequence, inspect what already changed, and decide whether to resume, compensate, roll back, or escalate. Compensation is a new consequential action, not magic reversal, so it needs its own contract and authority. Never assume deletion recreates the prior state or that a refund erases disclosure. Preserve the original request, approval, result, and recovery chain. Use bounded retries with backoff only for errors the contract identifies as transient. Do not retry invalid input, denied permission, exceeded limits, destructive ambiguity, or untrusted instructions. Disable or narrow the tool when observed behavior exceeds its tested boundary.

Visual alternative: Outcomes branch to complete, bounded retry, reconcile, resume, compensate, roll back, disable, or escalate based on verified state and authority.

Sources:

- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview>
- <https://ai.google.dev/gemini-api/docs/function-calling>

## Demonstration: Partial Deployment Demonstration

Imagine a deployment workflow that uploads an artifact, updates configuration, and shifts traffic. Upload succeeds, configuration succeeds, and the traffic check fails before the shift. The record shows that no traffic moved, so repeating the entire workflow could create unnecessary versions or overwrite reviewed configuration. The bounded response verifies the artifact digest and configuration, preserves those completed effects, repairs only the failed health condition, reruns the check, and requests the exact traffic-shift approval when ready. If the artifact or configuration differs from approval, stop and roll back according to the contract. Step-level evidence makes safe resumption possible.

Visual alternative: Artifact upload and configuration are verified. Traffic remains unchanged. Health is repaired and checked before a new exact traffic-shift approval.

Sources:

- <https://ai.google.dev/gemini-api/docs/function-calling>

## Narration: Human Control Explanation

Keep people in control of consequence. Require exact, current approval for destructive, external, costly, privacy-sensitive, or permission-expanding actions. Approval must bind to the resolved target, action, values, scope, and time; it is not a reusable blank check. Provide preview and cancellation before execution when consequence permits. Make denials fail closed. Separate the model that proposes an action from deterministic validation and, for high consequence, accountable human authorization. Restrict credentials to the smallest tool and task boundary. Redact sensitive material from previews and audit without hiding what is being approved. Provide status, postcondition evidence, recovery options, and a clear handoff when automation stops. Test duplicate requests, timeouts after success, partial completion, stale state, target substitution, permission denial, limit exhaustion, and malicious instructions returned by tools. A useful agent can do less than its environment technically permits because reliable authority is deliberately narrower than capability.

Visual alternative: The checklist covers exact approval, least privilege, preview, cancellation, fail-closed validation, real postconditions, secret-safe audit, recovery, and adversarial testing.

Sources:

- <https://developers.openai.com/api/docs/guides/function-calling>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview>
- <https://ai.google.dev/gemini-api/docs/function-calling>

## Transition: Activity Transition

Open the safe tool plan activity. Choose one tool-enabled task and complete its purpose, inputs, outputs, errors, reads and writes, side effects, limits, retry behavior, approval, verification, and recovery contract. Draw the sequence from intent through resolved target, preview, approval, call, postcondition, audit, and completion. Test timeout after success, a duplicate request, and malicious instructions inside tool output. For each, record stop, reconciliation, compensation, rollback, disablement, or escalation behavior.

Sources:

- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview>

## Pause: Activity Work Time

## Assessment Handoff: Assessment Handoff

When you are ready, begin the knowledge check. You will identify a complete tool contract, respond to a timeout after a payment request, classify instructions inside tool output, distinguish a response from a verified postcondition, and recognize an action requiring exact current approval. Review the class or return to the activity before submitting. The assessment begins only when you choose Begin knowledge check.

## Closing: Class Closing

Remember the boundary: tool access is delegated authority. Resolve the target, expose consequence, approve exactly, verify reality, and recover from recorded state.
