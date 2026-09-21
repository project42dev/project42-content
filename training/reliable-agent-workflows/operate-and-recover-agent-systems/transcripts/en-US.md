# Operate, Recover, and Improve Agent Systems

Package: `operate-and-recover-agent-systems-class` 1.0.0

> This is the canonical text equivalent of an AI-assisted virtual-instructor
> class. It remains usable without synthesized audio, video, animation, or a
> player runtime.

## Welcome: Welcome And Outcomes

Welcome. This class treats agent operations as a system discipline. You will classify the failed boundary, contain impact, reconcile uncertain actions, choose bounded recovery, communicate with evidence, and turn incidents into tests and stronger controls.

## Narration: Classify Before Changing

Classify evidence before choosing a fix. Model failures include unsupported or incorrect generation. Prompt failures encode ambiguity, conflicting requirements, or missing constraints. Tool failures include bad schemas, authorization, execution, or postconditions. Retrieval and data failures include missing, stale, poisoned, malformed, or cross-tenant evidence. Policy failures permit forbidden action or block required escalation. Orchestration failures misroute, loop, race, lose state, or join results incorrectly. Infrastructure failures include capacity, network, dependency, credential, storage, and deployment faults. One incident may cross several classes. Record the first wrong transition, later contributing factors, and uncertainty instead of forcing one convenient root cause. Replacing the model cannot repair an expired data source, missing authorization, duplicate-effect retry, or broken network route.

Sources:

- <https://www.nist.gov/publications/incident-response-recommendations-and-considerations-cybersecurity-risk-management-csf>
- <https://www.nist.gov/itl/ai-risk-management-framework>

## Narration: Triage And Contain

Triage actual and credible potential impact. Assess affected users and tenants, data exposure, permissions, external side effects, money, availability, legal or safety obligations, and whether the agent is still acting. Severity comes from impact and propagation, not fluent output or a familiar error code. Contain first when unsafe behavior may continue. Pause the workflow or one tool, revoke credentials, disable a route, reduce concurrency, stop retries, switch to a read-only fallback, or require manual approval. Preserve secret-safe traces, request and operation identifiers, configuration versions, approval records, and postcondition evidence before mutable state disappears. Containment should be scoped enough to reduce harm without destroying evidence or unnecessarily disabling healthy paths. Record who authorized it, its target, expected effect, validation, and rollback.

Sources:

- <https://www.nist.gov/publications/incident-response-recommendations-and-considerations-cybersecurity-risk-management-csf>
- <https://www.nist.gov/itl/ai-risk-management-framework>

## Narration: Reconcile And Recover

Reconcile before retry, rollback, or replay. A timeout after a write does not prove failure; the effect may have completed while the response was lost. Query the system of record using the durable operation key or correlation identifier. Compare intended and actual postconditions, then classify the outcome as completed, not completed, partially completed, conflicting, or still unknown. Choose accept, compensate, retry, roll back, or escalate from that evidence. Retry only transient failures within a total budget, using provider guidance, exponential backoff, jitter, and idempotency. Do not retry validation, authorization, policy, or deterministic conflict failures unchanged. Rollback must target an exact version or object through a tested path and verify restored state. If reconciliation cannot prove the outcome, preserve uncertainty and require a human decision instead of manufacturing completion.

Sources:

- <https://platform.claude.com/docs/en/api/errors>
- <https://developers.openai.com/api/docs/guides/error-codes>
- <https://www.nist.gov/publications/incident-response-recommendations-and-considerations-cybersecurity-risk-management-csf>

## Demonstration: Unknown Outcome Demonstration

An agent sends a sandbox notification and receives a network timeout. Blind retry risks two messages. The responder pauses the send tool, reads the operation ledger, and queries the destination using the same case and operation identifiers. One matching message exists with the expected recipient and content hash. The outcome is completed, so no retry occurs. The responder records the missing acknowledgment as an infrastructure symptom, verifies the user-visible postcondition, restores the tool after a canary, and adds a lost-response regression test. If no authoritative query existed, the correct state would remain unknown and escalate.

Sources:

- <https://platform.claude.com/docs/en/api/errors>
- <https://developers.openai.com/api/docs/guides/error-codes>
- <https://www.nist.gov/publications/incident-response-recommendations-and-considerations-cybersecurity-risk-management-csf>

## Narration: Runbook And Communication

Give responders a decision-ready runbook. Name triggers, severity rules, owner, communication channel, dashboards and queries, exact containment targets, required credentials and approvals, reconciliation procedure, safe retry conditions, rollback or fallback, verification, escalation, and closure criteria. Commands must be safe to copy, explicit about environment and target, and guarded against broad destructive scope. Status updates separate confirmed facts, hypotheses, actions, impact, uncertainty, and the next decision. Avoid unsupported blame and do not expose secrets or customer content. Notify affected people under applicable incident, privacy, and contractual obligations. Every material decision needs an owner, time, evidence reference, and follow-up. A runbook should support action under pressure without encouraging blind restarts, limitless retry, or invented success.

Sources:

- <https://www.nist.gov/publications/incident-response-recommendations-and-considerations-cybersecurity-risk-management-csf>

## Narration: Learn And Improve

Close only after recovery evidence and owned prevention work. Verify the user-visible result, external postconditions, queues, retries, permissions, data isolation, cost, and monitoring. A green health endpoint may miss a duplicated effect, lost learner record, or incomplete workflow. Preserve a blameless timeline of facts and contributing conditions. Add the smallest reproducing case to the evaluation suite, improve the control at the failed boundary, and rehearse the updated runbook. Assign owners and due dates for follow-up defects, security work, documentation, and monitoring. Measure recurrence, detection time, containment time, recovery time, unknown outcomes, and whether the new control catches the case. The post-incident review is not closure if its actions disappear into prose. Closure requires evidence that service and external state are correct and that required work is tracked.

Sources:

- <https://www.nist.gov/publications/incident-response-recommendations-and-considerations-cybersecurity-risk-management-csf>
- <https://www.nist.gov/itl/ai-risk-management-framework>

## Learner Prompt: Learner Incident Prompt

For a timed-out consequential tool call, write the evidence that would distinguish completed, not completed, partial, conflicting, and unknown outcomes. Then name which outcomes permit retry and which require compensation or escalation.

Expected learner action: Create an evidence-based reconciliation table before selecting recovery.

## Pause: Learner Work Time

## Checkpoint: Timeout Checkpoint

Checkpoint. A write reached the server and then timed out. Should the workflow assume failure and retry immediately?

Expected learner action: Treat the outcome as unknown and reconcile authoritative state before another mutation.

Sources:

- <https://platform.claude.com/docs/en/api/errors>
- <https://developers.openai.com/api/docs/guides/error-codes>

## Pause: Checkpoint Response Time

## Feedback: Timeout Feedback

No. The outcome is unknown until the system of record proves the postcondition. Use the operation key and target identifier, then accept, compensate, retry, rollback, or escalate from evidence. If you chose immediate retry, add reconciliation and idempotency first. If you chose never to retry, refine the rule: a proven transient failure may be retried within budget when the operation is idempotent and provider guidance permits it.

Correct feedback: You protected the external system from duplicate impact by reconciling before retry.

Retry feedback: A timeout describes communication, not the final state of the external action.

Sources:

- <https://platform.claude.com/docs/en/api/errors>
- <https://developers.openai.com/api/docs/guides/error-codes>
- <https://www.nist.gov/publications/incident-response-recommendations-and-considerations-cybersecurity-risk-management-csf>

## Transition: Activity Transition

Open the incident runbook activity. Classify model, prompt, tool, retrieval, data, policy, orchestration, and infrastructure evidence. Write severity, containment, reconciliation, retry, rollback, communication, escalation, validation, and closure. Convert the incident into regression cases, a control change, a rehearsal, an owner, and a recurrence metric.

## Pause: Activity Work Time

## Narration: Incident Worked Example Lab Narration

At 09:00 UTC, fictional incident INC-2042 begins when tenant-a asks an agent to apply a reserve policy and record the decision. Retrieval returns policy version 2025-01 even though version 2026-04 is required. At 09:01, transfer action transfer-100 sends 100 units from operating to reserve under idempotency key pay-100. The transport times out after the write reaches the tool. The persisted ledger nevertheless contains confirmed entry L-1 and balances of 900 and 100 from a baseline of 1000 and 0. At 09:02, audit action audit-7 times out before any ledger entry is created. At 09:03, notification action notice-9 has a persisted pending record, so its external postcondition cannot be verified. At 09:03, the agent states that all actions completed. At 09:04, the responder declares SEV-1 because a consequential transfer occurred under stale policy and another external action remains uncertain. At 09:05, retries are disabled. At 09:08, reconciliation begins. At 09:14, the authorized compensation restores the two account balances. At 09:16, the missing audit write is retried once with its original idempotency key. At 09:18, the pending notification is escalated without retry. At 09:24, validation and handoff complete. Elapsed response time is 24 minutes because 09:24 minus 09:00 equals 24 minutes. The completed classification matrix is: model, unsupported completion claim; prompt, instruction allowed a completion claim without postcondition evidence; tool, transfer response timed out and notification postcondition is not exposed as confirmed; retrieval, obsolete policy version selected; data, stale policy content entered the decision context; policy, consequential action proceeded under an obsolete rule and compensation requires separate approval; orchestration, timeout was treated as retryable instead of unknown; infrastructure, transport timeout obscured the transfer response. These entries can coexist and do not assert that every boundary was an independent root cause. The impact decision records one tenant, one confirmed consequential transfer of 100 fixture units, one missing audit record, and one unverifiable notification. The fixture units are synthetic state values, not currency or vendor billing. The recovery metrics are computed from three actions: one confirmed, one missing, and one unknown. Duplicate writes after repaired recovery equal zero. The restored operating balance is 1000 because 900 plus the compensated 100 equals 1000, and the restored reserve balance is 0 because 100 minus 100 equals 0. Visual checkpoint: draw three columns labeled CONFIRMED, MISSING, and UNKNOWN. Place transfer-100 under CONFIRMED, audit-7 under MISSING, and notice-9 under UNKNOWN. Only the missing action is eligible for a bounded idempotent retry. The confirmed harmful action follows the authorized compensation path, while the unknown action stops and escalates.

Sources:

- <https://www.nist.gov/publications/incident-response-recommendations-and-considerations-cybersecurity-risk-management-csf>

## Narration: Repair Lab Lab Narration

The learner edits only `src/reconcile.mjs`. The starter has one causal defect: it labels every timed-out action MISSING without consulting persisted state. On the baseline fixture, this attempts to retry pay-100 even though confirmed ledger entry L-1 already binds that key. The immutable recovery guard blocks the duplicate and exits with failure. A deny-all implementation also fails because the independently expected audit action must be classified MISSING and written exactly once. The exact starter demo command is `node src/recover.mjs fixtures/incident.json fixtures/ledger.json .tmp/starter-ledger.json`. Its stdout is `INCIDENT INC-2042 SEV-1 CONTAINED`, `RECONCILE transfer-100: MISSING`, `ERROR unsafe retry blocked: idempotency key pay-100 already binds ledger entry L-1`, and `RESULT FAILED`, each on its own line. Its exit code is 1. The output file is not written, and the fixture files remain unchanged. Repair reconciliation by looking up entries with the action idempotency key. Return CONFIRMED only for one confirmed entry whose binding has passed shared validation, MISSING only when no entry exists, and UNKNOWN for a pending or otherwise unverifiable entry. Do not infer success from the agent claim or failure from the timeout. After repair, the same demo command exits 0 and prints, one line at a time: `INCIDENT INC-2042 SEV-1 CONTAINED`; `RECONCILE transfer-100: CONFIRMED`; `COMPENSATE transfer-100: VERIFIED operating=1000 reserve=0`; `RECONCILE audit-7: MISSING`; `RETRY audit-7: CONFIRMED key=audit-7`; `RECONCILE notice-9: UNKNOWN`; `ESCALATE notice-9: unverifiable postcondition`; `EVIDENCE preserved events=6 originalEntries=2`; `METRICS confirmed=1 missing=1 unknown=1 duplicateWrites=0 restoredOperating=1000 restoredReserve=0`; `RESULT RECOVERED_WITH_ESCALATION`. The independent tests assert the baseline state, a changed-input fixture, preservation of original evidence, unique idempotency bindings, required audit writes, compensation approval, restored balances, and escalation of pending outcomes. They also submit malformed types, an unknown actor identity, a negative retry budget, and a mismatched idempotency binding to shared validation. Passing output is documented in the lab README and ends with `PASS all 8 checks`; the exit code is 0. Visual checkpoint: inspect the output ledger rather than trusting stdout. L-1 must still exist unchanged, one compensation entry must reverse transfer-100, one audit entry must bind audit-7, the pending notice record must remain pending, and no key may appear twice.

Sources:

- <https://www.nist.gov/publications/incident-response-recommendations-and-considerations-cybersecurity-risk-management-csf>

## Narration: Independent Variation Lab Narration

Run `node src/recover.mjs fixtures/incident-changed.json fixtures/ledger-changed.json .tmp/changed-ledger.json`. This independent variation changes the incident ID, action IDs, idempotency keys, approval ID, account baseline, and transfer amount. A repair that hard-codes pay-100, transfer-100, 1000, or L-1 will fail. For INC-2043, the confirmed transfer moves 40 fixture units from a baseline operating balance of 500. Reconciliation must find the existing confirmed entry by changed idempotency key pay-2043, compensate it under the changed approval, and verify operating=500 and reserve=0. The missing changed audit action must be written exactly once. The changed pending notification must remain UNKNOWN and be escalated. The changed command exits 0. Its metrics line is exactly `METRICS confirmed=1 missing=1 unknown=1 duplicateWrites=0 restoredOperating=500 restoredReserve=0`. The arithmetic is fixture-derived: 460 plus 40 restores 500, and 40 minus 40 restores 0. Learner activity: before running tests, predict the three classifications from the changed ledger. Then run the command, inspect `.tmp/changed-ledger.json`, and explain why the confirmed, missing, and unknown outcomes require three different actions. Record which assertion would fail if the implementation returned UNKNOWN for everything. The required missing audit entry provides the causal signal that deny-all is not a valid repair. Checkpoint: the variation passes only if behavior follows validated bindings and persisted status. Matching the baseline text without generalizing is insufficient.

Sources:

- <https://www.nist.gov/publications/incident-response-recommendations-and-considerations-cybersecurity-risk-management-csf>

## Narration: Ecosystem Transfer Lab Narration

This incident method is provider-neutral because the decisive evidence comes from tool contracts, retrieved artifacts, orchestration state, and systems of record. A hosted API error, a self-hosted runtime exception, and a network timeout can all obscure an outcome, but their retry guidance, identifiers, and observability fields differ. Consult the documentation for the API and runtime actually deployed. Do not treat a model family as an API. Meta Llama, Qwen, DeepSeek, Mistral, and Microsoft Phi name model families or project ecosystems. They may be served by their project runtimes, third-party runtimes, cloud services, or custom infrastructure. Their common presence in an agent design does not establish a common tool-call contract, idempotency guarantee, policy layer, context format, or approval capability. For Meta Llama, inspect the specific Llama model and serving repository used. For Qwen and DeepSeek, distinguish model-repository behavior from the serving API wrapped around it. Mistral’s open inference runtime documents one implementation, not every service hosting Mistral-family weights. Microsoft’s Phi materials similarly describe models and examples rather than a universal agent API. The reconciliation rule remains stable: the external system of record, not a fluent model claim, decides whether a consequential side effect occurred. For hosted providers such as Anthropic or OpenAI, use the provider’s dated error and retry documentation, but still bind each tool action to your own correlation or idempotency evidence. Provider error classes can inform whether a request was transient. They do not by themselves prove the external postcondition of a separate tool. Visual checkpoint: write four separate labels in an architecture diagram: model family, inference runtime, model API, and consequential tool. Attach retry policy to the actual failing interface and attach postcondition reconciliation to the consequential tool’s system of record.

Sources:

- <https://www.nist.gov/publications/incident-response-recommendations-and-considerations-cybersecurity-risk-management-csf>

## Narration: Answer Key And Rubric Lab Narration

Answer key: the defect is the unconditional MISSING result in `src/reconcile.mjs`. The correct implementation searches `state.entries` by `action.idempotencyKey`. Zero matches means MISSING. One confirmed match means CONFIRMED. One pending match means UNKNOWN. Shared validation has already rejected duplicate keys and mismatched bindings, so reconciliation must not bypass it. The reference implementation is available in `reference/reconcile.reference.mjs` for comparison after the learner attempts the repair. Causal explanation: the timeout describes the response path, not the persisted write. Labeling transfer-100 MISSING sends it to retry, where the immutable guard detects that pay-100 is already bound to L-1. Reconciliation changes the classification to CONFIRMED, allowing the stale-policy transfer to follow the separately authorized compensation path. The absent audit entry remains MISSING and is retried once. The pending notification remains UNKNOWN and is escalated. A complete submission earns credit only when all of the following evidence is present: the baseline and changed tests pass; no duplicate idempotency binding exists; original incident events and ledger entries are preserved; the confirmed transfer is reconciled and compensated under the scoped approval; restored balances are verified; the missing audit write is created once; the pending notification is neither reported as success nor treated as failure; malformed states, types, identities, budgets, and bindings are rejected; and the learner explains why compensation requires authorization. Operational reasoning is complete when the learner also supplies the eight-category matrix, timeline, SEV-1 impact decision, containment target, executable runbook, communication and handoff packet, regression case, control change, rehearsal owner, and recurrence metric. A solution that merely makes stdout match, disables all writes, edits fixtures, weakens validation, or treats every uncertain outcome identically does not satisfy the activity. Reflection: the unsupported completion claim initially looks like only a model failure. The trace shows stale retrieval, a committed write hidden by a timeout, an unsafe orchestration decision, and an unresolved external postcondition. Which of those observations changes the recovery action most, and why?

Sources:

- <https://www.nist.gov/publications/incident-response-recommendations-and-considerations-cybersecurity-risk-management-csf>

## Assessment Handoff: Assessment Handoff

When ready, begin the knowledge check. You will classify stale evidence, reconcile timed-out writes, reject unchanged authorization retries, contain ongoing unsafe action, and separate failures across system boundaries.

## Closing: Class Closing

Classify before changing, contain ongoing impact, reconcile unknown effects, recover within tested bounds, communicate evidence, and close only after verified recovery and owned improvement.
