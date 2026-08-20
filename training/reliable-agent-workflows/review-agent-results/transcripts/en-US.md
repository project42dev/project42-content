# Operate, Recover, and Improve Agent Systems

Package: `review-agent-results-class` 1.0.0

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

## Assessment Handoff: Assessment Handoff

When ready, begin the knowledge check. You will classify stale evidence, reconcile timed-out writes, reject unchanged authorization retries, contain ongoing unsafe action, and separate failures across system boundaries.

## Closing: Class Closing

Classify before changing, contain ongoing impact, reconcile unknown effects, recover within tested bounds, communicate evidence, and close only after verified recovery and owned improvement.
