# Respond to the Impact, Diagnose the Boundary, Prove the Recovery

Package: `model-incident-response-and-recovery-class` 1.0.0

> This is the canonical text equivalent of an AI-assisted virtual-instructor
> class. It remains usable without synthesized audio, video, animation, or a
> player runtime.

## Welcome: Welcome And Outcomes

Welcome. An unsafe answer, timeout, queue alarm, access denial, cost spike, or artifact mismatch is a signal, not a root cause. In this class, you will declare severity from impact, contain the narrowest effective boundary, diagnose the first failure, reconcile uncertain effects, recover to explicit objectives, communicate confirmed facts, and turn the incident into owned prevention work.

## Narration: Detect Declare Narration

Detect impact and declare deliberately. Signals can begin with failed quality or safety checks, unsupported output, authorization denials, unusual resource use, queue growth, latency, cost, artifact identity mismatch, telemetry loss, a bad deployment, or a user report. Correlate the request, exact serving build, policy decision, infrastructure, dependency state, and observed outcome before calling every symptom a model failure. Set severity from actual and credible potential impact to people, data, authorization, external actions, service, money, and legal or safety duties. A fluent answer can conceal unauthorized access, while a visible timeout may have no lasting effect or may hide a completed external action. Name an incident lead, evidence owner, technical responders, communications owner, and decision authority. Establish an update cadence and one decision log. Record confirmed facts, observations, and timestamps separately from hypotheses. NIST's incident-response recommendations integrate preparation and response with broader cybersecurity risk management; use that discipline to make roles, evidence, decisions, and recovery expectations ready before an emergency.

Sources:

- <https://www.nist.gov/publications/incident-response-recommendations-and-considerations-cybersecurity-risk-management-csf>
- <https://www.nist.gov/cyberframework>

## Demonstration: Incident Demonstration

Consider a synthetic incident after a model rollout. Queue delay rises, one replica reports the candidate alias but an old artifact digest, and a user says an action timed out. Confirmed facts are limited: queue delay exceeded the objective, identity is inconsistent, and the client did not receive completion. It is not yet confirmed whether the external action occurred or whether the weights caused the delay. Severity accounts for the credible duplicate-action and authorization impact, not merely the visible latency. The incident lead assigns an evidence owner, serving responder, application responder, communications owner, and rollback authority. The first update states the time, affected route, current uncertainty, bounded containment, service status, and next decision. This prevents a fluent but unsupported root-cause story from replacing the investigation.

Sources:

- <https://www.nist.gov/publications/incident-response-recommendations-and-considerations-cybersecurity-risk-management-csf>
- <https://opentelemetry.io/docs/specs/semconv/>

## Narration: Contain Preserve Narration

Contain at the narrowest boundary that reliably stops ongoing impact. Reject one workload, disable a route or tool, revoke a principal or secret, quarantine an artifact, stop a rollout, reduce concurrency, isolate a node or site, require manual approval, or switch to a separately evaluated fallback. Keep service unavailable when no safe mode exists. Prevent automatic retries from multiplying load or repeating uncertain side effects. Preserve evidence without creating another incident. Capture necessary timestamps, bounded correlation identifiers, exact release and artifact identities, digests, policy decisions, redacted logs, metrics, traces, queue state, deployment history, approvals, configuration changes, and observed postconditions. Follow retention, privacy, legal-hold, and access policy. An incident is not permission to collect every prompt, response, personal identifier, credential, secret, or hidden reasoning. OpenTelemetry conventions can help correlate signals, but your application-owned contract and evidence policy determine which fields are justified and safe.

Sources:

- <https://www.nist.gov/publications/incident-response-recommendations-and-considerations-cybersecurity-risk-management-csf>
- <https://opentelemetry.io/docs/specs/semconv/>

## Narration: Diagnose Boundary Narration

Diagnose the first failed boundary with evidence. Test artifact integrity and provenance; runtime, driver, and library compatibility; endpoint and adapter contracts; identity and object or function authorization; network and secret access; evaluation behavior; prompt, retrieval, and data inputs; capacity, placement, and queues; dependencies; telemetry; and recent change history. More than one boundary can fail. A bad release may create memory pressure, which creates queueing, which triggers unsafe retries, while an identity mismatch makes attribution harder. Classify evidence as transient, deterministic, policy, authorization, corrupt-state, capacity, dependency, telemetry, or incompatible-release failure because each permits different recovery. For any unknown external or user-visible outcome, query the authoritative system of record and observed postcondition before retrying, compensating, or declaring success. A client timeout proves that the client did not receive completion; it does not prove that downstream work did not happen.

Sources:

- <https://www.nist.gov/cyberframework>
- <https://opentelemetry.io/docs/specs/semconv/>
- <https://kubernetes.io/docs/concepts/workloads/controllers/deployment/>

## Checkpoint: Unknown Outcome Checkpoint

Checkpoint. A tool call times out after the request left the model service. The user sees an error, but the external system may have completed the action. Should the service retry, and what evidence must come first?

Expected learner action: Do not retry automatically; reconcile the authoritative external record and postcondition, then choose no action, safe retry, or authorized compensation using exact identity and evidence.

Sources:

- <https://www.nist.gov/publications/incident-response-recommendations-and-considerations-cybersecurity-risk-management-csf>
- <https://opentelemetry.io/docs/specs/semconv/>

## Pause: Checkpoint Response Time

## Feedback: Unknown Outcome Feedback

Do not retry merely because the caller saw a timeout. Correlate the exact request and operation, query the external system of record, inspect the durable postcondition, and determine whether the action completed, failed, or remains uncertain. Only then choose no action, an idempotent or otherwise safe retry, or an authorized compensating operation. Preserve the reconciliation and decision without exposing unnecessary content. If your answer retried immediately, it could duplicate a financial, administrative, communication, or data-changing action. The safe sequence is reconcile, authorize, act, and verify.

Correct feedback: You reconciled the authoritative postcondition before selecting a safe retry or compensation.

Retry feedback: A timeout is an unknown outcome, not proof that the external action failed.

Sources:

- <https://www.nist.gov/publications/incident-response-recommendations-and-considerations-cybersecurity-risk-management-csf>
- <https://opentelemetry.io/docs/specs/semconv/>

## Narration: Recover Validate Narration

Recover to explicit objectives. Choose a tested action: remove traffic, restart one bounded component, replace a corrupt artifact, rotate and revoke a secret, restore configuration or durable state, scale within an evaluated envelope, fail over, roll back the complete serving unit, or remain unavailable pending human authority. Where durable state exists, state recovery-time and recovery-point objectives and the evidence that proves them. Validate the complete service contract: exact model and dependency identity, authentication and authorization, representative quality and safety cases, endpoint compatibility, capacity and queue state, telemetry and alerting, cost behavior, reconciled external effects, and user-visible postconditions. Restore traffic in bounded stages with an observation window and recurrence stop condition. A green liveness endpoint proves only that one process can answer its health check. It does not prove the correct model, safe access, valid outcomes, cleared queues, consistent state, working telemetry, or restored user service.

Sources:

- <https://www.nist.gov/cyberframework>
- <https://kubernetes.io/docs/concepts/workloads/controllers/deployment/>

## Narration: Communicate Learn Narration

Communicate what is confirmed. Each update states time, known scope and impact, current containment, service status, next decision, and expected update cadence. Follow organizational privacy, legal, customer, contractual, and regulatory duties. Avoid unsupported root-cause claims and never publish sensitive operational evidence. Close only after impact has stopped, recovery postconditions pass, required stakeholders are informed, temporary access and emergency controls are removed, and follow-up work has owners and dates. Build a blameless timeline that identifies contributing conditions rather than searching for one person to blame. Add privacy-reviewed reproducing cases, strengthen identity, capacity, telemetry, release, backup, or rollback controls, update the runbook, rehearse the revised response, and measure recurrence. A resolved alert without validated recovery and owned prevention is not incident closure.

Sources:

- <https://www.nist.gov/publications/incident-response-recommendations-and-considerations-cybersecurity-risk-management-csf>
- <https://www.nist.gov/cyberframework>

## Learner Prompt: Activity Transition

Now run the incident exercise. Use the scenario combining a bad release, queue delay, artifact identity mismatch, and uncertain user-visible effect. Declare severity, roles, cadence, containment, and evidence boundaries. Build the boundary diagnostic table and reconcile every unknown outcome before retry, rollback, or compensation. Execute the recovery runbook against explicit objectives. Verify exact identity, access, quality, compatibility, capacity, queues, telemetry, cost, and user-visible service. Produce the timeline, stakeholder update, closure decision, reproducing cases, and prevention backlog with owners and dates.

Expected learner action: Complete the severity and role record, targeted containment, governed evidence ledger, boundary diagnosis, unknown-outcome reconciliation, recovery validation, stakeholder update, closure decision, timeline, and owned prevention plan.

Sources:

- <https://www.nist.gov/publications/incident-response-recommendations-and-considerations-cybersecurity-risk-management-csf>
- <https://www.nist.gov/cyberframework>
- <https://opentelemetry.io/docs/specs/semconv/>
- <https://kubernetes.io/docs/concepts/workloads/controllers/deployment/>

## Pause: Activity Work Time

## Assessment Handoff: Assessment Handoff

Begin the check when you can set severity from impact, select narrow containment, reconcile a timeout, preserve governed evidence, validate more than endpoint health, and define evidence-based closure. The check starts only when you choose Begin knowledge check.

## Closing: Class Closing

Remember: respond to impact, contain narrowly, preserve only justified evidence, diagnose the boundary, reconcile unknown effects, and call service recovered only when the complete contract passes.
