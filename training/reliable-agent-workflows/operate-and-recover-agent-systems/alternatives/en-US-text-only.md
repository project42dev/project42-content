# Operate, Recover, and Improve Agent Systems: text-only class

This route contains the complete teaching content, learner actions, feedback,
and assessment handoff without requiring audio, video, or animation.

## Welcome: Welcome And Outcomes

Welcome. This class treats agent operations as a system discipline, not as prompt editing. We will classify evidence across eight boundaries, contain ongoing impact, reconcile uncertain actions, recover within tested limits, communicate what is known, and convert the incident into regression tests and controls. The incident and lab are fictional and deterministic. No live model, provider, notification service, transfer system, or approval system will be contacted during this lesson.

Visual alternative: The lesson follows seven steps from failure classification through verified improvement.

## Narration: Classify Before Changing

Begin with the failed boundary, and do not confuse a fluent sentence with a complete diagnosis. A model failure is unsupported or incorrect generation. A prompt failure is ambiguous, conflicting, or incomplete instruction. A tool failure can involve a bad contract, authorization, execution, or postcondition. Retrieval fails when the needed source is missing or stale. Data fails when records are malformed, poisoned, incorrectly scoped, or cross-tenant. Policy can permit a forbidden action or block an escalation that is required. Orchestration can misroute work, loop, race, retry unsafely, or lose state. Infrastructure includes capacity, network, dependencies, credentials, storage, and deployment. These are diagnostic locations, not blame labels. One incident can contain several classes. Record the observed evidence, the boundary it supports, and what remains unknown. In our incident, the sentence all actions completed is model evidence. The obsolete policy is retrieval and data evidence. The blind retry is orchestration evidence. The timeout is infrastructure evidence, but it does not tell us whether the write committed. Therefore, changing the model alone would not repair this incident. A useful first record has three columns: symptom, supported boundary, and evidence still needed. That discipline prevents a convenient but unsupported root-cause claim.

Visual alternative: The matrix lists model, prompt, tool, retrieval, data, policy, orchestration, and infrastructure, with the incident evidence assigned without claiming one root cause.

Sources:

- <https://www.nist.gov/publications/incident-response-recommendations-and-considerations-cybersecurity-risk-management-csf>
- <https://www.nist.gov/itl/ai-risk-management-framework>

## Narration: Triage And Contain

Triage asks what may have been affected and whether harm can continue. Assess users, tenants, data, permissions, external actions, money, availability, legal duties, safety duties, and active automation. Severity follows actual and credible potential impact, not the fluency of the agent and not the familiarity of an error message. Containment comes before a long explanation when unsafe behavior may continue. Possible controls include pausing one workflow or tool, revoking credentials, disabling a route, reducing concurrency, stopping retries, using a safe read-only fallback, or requiring manual approval. Choose the narrowest control that stops credible harm. Preserve secret-safe traces, configuration versions, request and operation identifiers, retrieved-document versions, idempotency keys, and postcondition evidence before mutable state changes. In the fictional incident, the transfer tool is paused at 09:04 UTC. Automated retries are disabled at 09:05. The audit tool remains available only through a bounded recovery command. This is narrower than shutting down every service, and safer than allowing the agent to continue. A containment record must say what stopped, what remains available, who can authorize recovery, how the original evidence is preserved, and how the control will be validated. NIST connects impact analysis, containment, recovery, and lessons learned. They are parts of one response, not unrelated tickets.

Visual alternative: Users, data, permissions, external effects, money, availability, and legal or safety obligations determine severity and containment.

Sources:

- <https://www.nist.gov/publications/incident-response-recommendations-and-considerations-cybersecurity-risk-management-csf>

## Narration: Incident Worked Example

Now work the complete dossier. At 09:00 UTC, fictional incident INC-2042 begins when tenant-a asks an agent to apply a reserve policy and record the decision. Retrieval returns policy version 2025-01, although version 2026-04 is required. At 09:01, transfer-100 sends 100 fixture units from operating to reserve under idempotency key pay-100. The transport times out after the write reaches the tool. The ledger nevertheless contains confirmed entry L-1. Starting balances were operating 1000 and reserve 0. The persisted balances are operating 900 and reserve 100. At 09:02, audit-7 times out before any ledger entry is created. At 09:03, notice-9 has a persisted pending record, so its external postcondition cannot be verified. At that same time, the agent says all actions completed. At 09:04, the responder declares SEV-1 because a consequential transfer used stale governing evidence and another external action remains uncertain. At 09:05, retries are disabled. Reconciliation begins at 09:08. At 09:14, authorized compensation restores the balances. At 09:16, the missing audit write is retried once with its original idempotency key. At 09:18, the pending notification is escalated without retry. At 09:24, validation and handoff complete. The elapsed response time is 24 minutes, because 09:24 minus 09:00 equals 24 minutes. The matrix now reads: model, unsupported completion claim; prompt, completion was allowed without postcondition evidence; tool, transfer response timed out and notification confirmation was not exposed; retrieval, obsolete policy selected; data, stale policy entered the decision context; policy, a consequential action proceeded under an obsolete rule and compensation needs separate authorization; orchestration, timeout was treated as retryable; infrastructure, transport timeout obscured the response. These observations coexist. They do not prove that every boundary independently caused the incident. Impact is one tenant, one confirmed consequential transfer of 100 synthetic fixture units, one missing audit record, and one unverifiable notification. The three action metrics are confirmed equals 1, missing equals 1, and unknown equals 1. Duplicate writes after recovery equal 0. Compensation changes operating from 900 back to 1000 because 900 plus 100 equals 1000. It changes reserve from 100 back to 0 because 100 minus 100 equals 0. The visual classification is transfer-100 under CONFIRMED, audit-7 under MISSING, and notice-9 under UNKNOWN. Only the missing action is eligible for a bounded idempotent retry. The confirmed harmful action follows authorized compensation. The unknown action stops and escalates.

Visual alternative: Transfer-100 is confirmed, audit-7 is missing, notice-9 is unknown, and compensation restores operating 1000 and reserve 0.

Sources:

- <https://www.nist.gov/publications/incident-response-recommendations-and-considerations-cybersecurity-risk-management-csf>

## Narration: Reconcile And Recover

The central rule is reconcile before retry, rollback, replay, or acceptance. A transport timeout does not prove that a write failed. Query the system of record with the idempotency key or correlation identifier. Verify that the binding still identifies the same tenant, actor, action, and intended postcondition. Then compare intended state with actual state. A confirmed and acceptable action can be accepted. A confirmed but harmful action can be compensated only through a tested path with scoped authorization and verification. A missing action can be retried when the failure is transient and a retry budget remains. An unauthorized, policy-blocked, or deterministic validation failure must stop and escalate rather than repeat unchanged. A pending or otherwise unverifiable action remains UNKNOWN and also stops for escalation. In production, a permitted transient retry would use provider guidance, exponential backoff, jitter, idempotency, and a total budget. This local lab is deterministic, so its single retry represents the decision that would come before a production delay schedule. Compensation is itself a new consequential action. The approval for this lesson applies only to the confirmed transfer identified in the fixture. It does not authorize arbitrary transfers or a retry of the notification. A successful command exit is not enough. Before closure, preserve original evidence, prevent a second binding for the same idempotency key, perform the required missing write, leave the unverifiable action unresolved, and verify restored balances.

Visual alternative: The system of record, validated binding, postcondition, and retry budget determine the recovery action.

Sources:

- <https://www.nist.gov/publications/incident-response-recommendations-and-considerations-cybersecurity-risk-management-csf>
- <https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/>
- <https://nodejs.org/api/esm.html>

## Demonstration: Unknown Outcome Demonstration

Here is a small demonstration before the lab. Suppose a notification request reaches its destination, but the response times out. The responder pauses the send capability and searches the operation ledger using the original identifiers. One matching record exists, with the expected recipient and content evidence. The destination read-back confirms one message. The correct classification is CONFIRMED, so the responder does not retry. The missing acknowledgment is recorded as a communication symptom, not as proof that the message failed. If the ledger contained no record, the result would be MISSING only if the system of record were authoritative and the query complete. If it contained a pending record with no verified external postcondition, the result would remain UNKNOWN. That action would be preserved and escalated, not retried blindly. The same reasoning applies to transfer-100. Its timeout describes the response path. L-1 and pay-100 describe the persisted action. The latter evidence controls recovery.

Visual alternative: The demonstration uses supplied evidence only and shows one confirmed message with no duplicate retry.

Sources:

- <https://www.nist.gov/publications/incident-response-recommendations-and-considerations-cybersecurity-risk-management-csf>
- <https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/>

## Learner Prompt: Learner Incident Prompt

Pause and make your own reconciliation table. For a timed-out consequential call, write what evidence would distinguish completed, not completed, partial, conflicting, and unknown outcomes. For each outcome, name whether the next action is accept, compensate, retry, rollback, or escalate. Include the identifier you would query, the binding you would verify, and the postcondition you would need.

Learner action: Create an evidence-based reconciliation table before selecting recovery.

## Pause: Learner Work Time

Visual alternative: Learners enter evidence and recovery actions for five possible outcomes.

## Checkpoint: Timeout Checkpoint

Checkpoint. A write reached the server and then timed out. Should the workflow assume failure and retry immediately?

Learner action: Treat the result as unknown and reconcile authoritative state before another mutation.

Sources:

- <https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/>

## Pause: Checkpoint Response Time

## Feedback: Timeout Feedback

The correct answer is no. A timeout describes communication, not the final state of the external action. Query the system of record with the operation key, verify the target and intended postcondition, and then choose a bounded action. If you chose immediate retry, add reconciliation and idempotency first, because the original write may already exist. If you chose never to retry, refine that rule. A proven transient failure may be retried when the operation is idempotent, the input is valid and authorized, provider guidance permits it, and the total budget remains. The lesson is not never retry. The lesson is never retry an uncertain consequential action without evidence.

If correct: You identified the unknown postcondition and protected the external system from duplicate impact.

If retrying: A timeout describes the response path, not the final state. Reconcile the system of record before another mutation.

Sources:

- <https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/>
- <https://www.nist.gov/publications/incident-response-recommendations-and-considerations-cybersecurity-risk-management-csf>

## Narration: Repair Lab

Now enter the local repair lab. It uses Node.js 22 native ECMAScript modules, no dependencies, no network access, and local JSON fixtures as a simulated system of record. Edit only the reconciliation source file. The starter defect is causal and narrow: every timed-out action is labeled MISSING without consulting persisted state. On the baseline fixture, that sends transfer-100 toward a retry even though pay-100 already binds to confirmed ledger entry L-1. The immutable guard blocks the duplicate and the run fails. A deny-all repair also fails, because the independently expected audit action really is missing and must be written exactly once. Run the starter command shown on screen from the lab directory and preserve its output. The exact starter output has four lines: the incident is contained at SEV-1, transfer-100 is classified MISSING, an unsafe retry is blocked because pay-100 already binds L-1, and the result is FAILED. Its exit code is 1, no output file is written, and the fixtures remain unchanged. Repair by looking up entries using the action idempotency key. Zero matching entries means MISSING. One confirmed matching entry, after shared binding validation, means CONFIRMED. One pending or otherwise unverifiable entry means UNKNOWN. Never infer success from the agent claim or failure from the timeout. After repair, the exact baseline output has the contained incident line, CONFIRMED transfer-100, compensation verified at operating 1000 and reserve 0, MISSING audit-7, one confirmed retry keyed to audit-7, UNKNOWN notice-9, escalation for its unverifiable postcondition, preserved evidence counts of events 6 and original entries 2, metrics of confirmed 1, missing 1, unknown 1, duplicate writes 0, restored operating 1000, restored reserve 0, and the result RECOVERED_WITH_ESCALATION. The repaired command exits 0. The tests also reject malformed types, unknown identity, a negative retry budget, and mismatched binding. They check state directly, not merely matching text. The supplied execution evidence reports all eight checks passing for both learner and reference results. Inspect the output ledger. L-1 must remain unchanged, one compensation entry must reverse transfer-100, one audit entry must bind audit-7, notice-9 must remain pending, and no key may appear twice. The output must be a new file. Do not overwrite or alias an input.

Visual alternative: Learners edit only the reconciliation file, preserve fixtures, create a new output file, and inspect confirmed, compensated, missing, and pending entries.

Sources:

- <https://nodejs.org/api/esm.html>
- <https://nodejs.org/api/fs.html#fspromisesopenpath-flags-mode>
- <https://nodejs.org/api/path.html#path_dirname_path>

## Narration: Independent Variation

Next, prove that the repair follows validated state rather than baseline text. The changed fixture uses a different incident, action identifiers, idempotency keys, approval identifier, transfer amount, and account baseline. For INC-2043, the confirmed action moves 40 fixture units from an operating baseline of 500. The persisted operating value is 460 and reserve is 40 before compensation. Reconciliation must find the existing entry by its changed key, compensate only under its changed approval, and verify operating 500 and reserve 0. The missing changed audit action must be written once. The changed pending notification must stay UNKNOWN and be escalated. Before running the changed command, predict the three classifications from the changed ledger. Then inspect the output file and explain why the three outcomes require three different actions. The exact changed metrics are confirmed 1, missing 1, unknown 1, duplicate writes 0, restored operating 500, restored reserve 0. The arithmetic is 460 plus 40 equals 500, and 40 minus 40 equals 0. If the repair hard-codes transfer-100, pay-100, 1000, or L-1, it fails this task. If it returns UNKNOWN for everything, the required missing audit write will not occur. That is the causal reason deny-all is not a repair. The supplied changed execution evidence shows a changed move action, changed log action, and changed message action, with the same three classifications and a successful recovered-with-escalation result.

Visual alternative: The changed case requires 460 plus 40 to restore 500 and 40 minus 40 to restore 0, while retaining confirmed, missing, and unknown classifications.

Sources:

- <https://nodejs.org/api/esm.html>

## Learner Prompt: Variation Prediction Prompt

Before you reveal or run the variation, predict the classifications. Which changed action is already confirmed, which has no persisted entry, and which remains pending? Then write the assertion that would fail if every action were classified UNKNOWN.

Learner action: Predict the changed classifications and identify the required missing-write assertion.

## Pause: Variation Prediction Pause

Visual alternative: Learners predict one confirmed action, one missing action, one unknown action, and the assertion requiring the missing write.

## Feedback: Variation Feedback

The answer is: the changed move action is CONFIRMED, the changed log action is MISSING, and the changed message action is UNKNOWN. The failed deny-all assertion is the requirement that the missing audit write be created exactly once. Confirmed follows the persisted validated binding and takes authorized compensation. Missing has no entry and permits one bounded idempotent retry. Unknown has a pending record without a verified external postcondition and therefore remains escalated. The changed identities and arithmetic demonstrate causal generalization rather than output memorization.

If correct: You separated persisted confirmation, absent state, and unverifiable pending state, then connected each to its distinct recovery action.

If retrying: Use the changed ledger, not the baseline names. The absent audit record is the evidence that deny-all cannot satisfy the repair.

Sources:

- <https://nodejs.org/api/esm.html>

## Narration: Runbook And Communication

A decision-ready runbook begins from the repository root, enters the lab directory, runs the tests, inspects immutable fixtures, runs baseline recovery with a new scratch output path, compares original and recovered ledger entries, verifies unique keys and balances, runs the changed fixture, retains both outputs, and hands off the pending notification. A production analogue must name the real system of record, target scope, credential scope, approval source, query, retry budget, compensation operation, validation query, communication channel, and closure authority. Trigger on a timeout after consequential write, stale governing evidence, unsupported completion claim, duplicate binding, or unverifiable postcondition. For this fixture, severity is SEV-1. The owner is Agent Operations on-call. The fictional channel is shown on screen. Containment pauses transfer automation and retries while retaining read-only reconciliation. Read-only ledger access is separate from compensation authority. Escalation goes to the Incident Commander and Policy Owner for stale policy, and the External Actions Owner for the pending notification. The communication packet separates confirmed facts, hypotheses, actions, impact, and decisions. Confirmed facts include L-1, retrieved policy 2025-01, absent audit-7, and pending notice-9. The hypothesis is that the timeout occurred after the transfer committed. Actions include pausing automation, reconciling, compensating under scoped approval, retrying audit once, and escalating notification. The impact is one tenant, one compensated transfer of 100 synthetic fixture units, and no duplicate write. The decision still needed is the real notification outcome. The handoff names INC-2042, the current state RECOVERED_WITH_ESCALATION, unresolved notice-9, preserved artifacts, the next checkpoint at 09:44 UTC, and a closure blocker of verified notification postcondition or authorized residual-risk acceptance. Do not include credentials, personal data, unsupported blame, or a claim that the notification succeeded.

Visual alternative: A responder can identify the incident, run safe local validation, find the unresolved notification, and identify the decision owner.

Sources:

- <https://www.nist.gov/publications/incident-response-recommendations-and-considerations-cybersecurity-risk-management-csf>

## Narration: Learn And Improve

Do not close because a health endpoint is green. Verify the user-visible result, external postconditions, queues, retries, permissions, data isolation, cost, and monitoring. In this fixture, a healthy endpoint could coexist with notice-9 still pending. Write a blameless timeline and contributing factors. Add the smallest reproducing case to the evaluation suite. Improve the control at the failed boundary, rehearse the changed runbook, assign owners, and measure recurrence. The regression owner is Agent Reliability, with a timeout case containing one confirmed, one absent, and one pending system-of-record entry. The control owner is Tooling Platform. Its control change is to require reconciliation before any timeout retry and reject malformed identity, budget, or idempotency bindings. The rehearsal owner is the Incident Commander. The retrieval owner adds a release gate that rejects expired policy versions. The communication owner maintains a template separating facts, hypotheses, actions, impact, and decisions. The recurrence metric counts incidents per 1,000 consequential tool requests in which a timeout is followed by a retry before system-of-record reconciliation. A production rate is UNKNOWN because this fixture supplies no production request denominator. Establish it from actual request and incident logs. The lab target is exact: zero duplicate writes across both supplied recovery fixtures and repeated test runs. Prevention is complete only when each action has an owner, a testable result, and a rehearsal or measurement. Be more careful is not a control.

Visual alternative: Closure requires evidence, and prevention work has named owners, testable results, and a recurrence metric.

Sources:

- <https://www.nist.gov/publications/incident-response-recommendations-and-considerations-cybersecurity-risk-management-csf>
- <https://www.nist.gov/itl/ai-risk-management-framework>

## Narration: Ecosystem Transfer

The method transfers across model families, runtimes, and APIs because decisive evidence comes from tool contracts, retrieved artifacts, orchestration state, and systems of record. A hosted API error, a self-hosted runtime exception, and a network timeout may all obscure an outcome, but their retry guidance, identifiers, and observability fields differ. Consult documentation for the API and runtime actually deployed. Do not treat a model family as an API. Llama, Qwen, DeepSeek, Mistral, and Phi name model families or project ecosystems. They may be served by project runtimes, third-party runtimes, cloud services, or custom infrastructure. Their presence in one design does not establish a shared tool-call contract, idempotency guarantee, policy layer, context format, or approval capability. Inspect the specific model and serving repository. Distinguish a model repository from the serving API wrapped around it. An inference runtime documents one implementation, not every service hosting a model family. Provider error classes can inform whether a request is transient, but they do not prove the postcondition of a separate consequential tool. Keep four labels separate in your architecture: model family, inference runtime, model API, and consequential tool. Attach retry policy to the interface that actually failed. Attach postcondition reconciliation to the consequential tool's system of record. The stable rule is evidence over fluent claims.

Visual alternative: Retry guidance belongs to the failing interface, while postcondition reconciliation belongs to the consequential tool's system of record.

Sources:

- <https://github.com/meta-llama/llama-models>
- <https://github.com/QwenLM/Qwen3>
- <https://github.com/deepseek-ai/DeepSeek-V3>
- <https://github.com/mistralai/mistral-inference>
- <https://github.com/microsoft/Phi-3CookBook>
- <https://platform.claude.com/docs/en/api/errors>
- <https://developers.openai.com/api/docs/guides/error-codes>

## Narration: Answer Key And Rubric

The repair defect is the unconditional MISSING result in the reconciliation source. The correct logic searches persisted entries by the action idempotency key. Zero matches means MISSING. One confirmed match means CONFIRMED. One pending match means UNKNOWN. Shared validation has already rejected duplicate keys and mismatched bindings, so reconciliation must not bypass it. The timeout describes the response path, not the persisted write. Labeling transfer-100 MISSING sends it toward retry, where the immutable guard detects that pay-100 is already bound to L-1. Reconciliation changes the classification to CONFIRMED, allowing the stale-policy transfer to follow the separately authorized compensation path. The absent audit remains MISSING and is retried once. The pending notification remains UNKNOWN and is escalated. Full credit requires baseline and changed tests, no duplicate binding, preserved original events and ledger entries, scoped compensation, verified balances, one missing audit write, no false success or failure for the pending notification, rejection of malformed states and bindings, and an explanation of why compensation requires authorization. Operational reasoning also requires the eight-category matrix, timeline, SEV-1 decision, containment target, executable runbook, communication and handoff packet, regression case, control change, rehearsal owner, and recurrence metric. Matching stdout alone is insufficient. Editing fixtures, weakening validation, disabling all writes, or treating every uncertain outcome identically is not a repair. Reflect on this question: which observation changed the recovery action most? The strongest answer identifies the persisted confirmed entry, because it distinguishes an already committed consequential write from an absent audit and a pending notification. The stale policy explains why compensation is needed, while the system of record determines what action is safe.

Visual alternative: Credit requires evidence of safe generalization, not merely matching the expected terminal text.

Sources:

- <https://www.nist.gov/publications/incident-response-recommendations-and-considerations-cybersecurity-risk-management-csf>

## Transition: Activity Transition

When you are ready, open the incident runbook activity. Build the eight-category matrix and timeline. Write severity, containment, reconciliation, retry, compensation, communication, escalation, validation, and closure. Include the baseline and changed evidence, explain why compensation requires scoped authorization, and convert the incident into a regression case, control change, rehearsal, owner, and recurrence metric.

## Pause: Activity Work Time

Visual alternative: Learners complete the operational evidence packet and may save or extend the activity.

## Assessment Handoff: Assessment Handoff

When ready, begin the knowledge check. It covers stale evidence, timed-out writes, invalid retries, containment, boundary classification, pending outcomes, and authorization for compensation. The supplied question set has seven questions and a pass threshold of 80 percent. The questions are about this lesson's reasoning, not about live infrastructure.

## Closing: Class Closing

Remember the sequence. Classify before changing. Triage impact and contain ongoing harm. Reconcile unknown effects against the system of record. Recover only within tested and authorized bounds. Communicate confirmed facts separately from hypotheses and decisions. Close only after external state is verified and prevention work has an owner and a measure. In this dossier, the timeout did not decide the outcome. Persisted evidence did. Thank you for practicing recovery that is safe, explainable, and generalizable.

Visual alternative: The lesson ends with classify, contain, reconcile, recover, communicate, and improve, while preserving uncertainty where evidence is incomplete.
