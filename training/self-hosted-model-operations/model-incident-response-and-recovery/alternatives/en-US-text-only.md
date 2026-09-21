# Respond to the Impact, Diagnose the Boundary, Prove the Recovery: text-only class

This route contains the complete teaching content, learner actions, feedback,
and assessment handoff without requiring audio, video, or animation.

## Welcome: Welcome And Outcomes

Welcome to Model Incident Response and Recovery. This lesson is a deterministic exercise about a self-hosted model service. Nothing in the exercise runs a deployment, calls a model, sends a payment, or changes an external system. We will detect impact, declare deliberately, contain narrowly, preserve useful evidence, diagnose by boundary, reconcile uncertain effects, recover to explicit objectives, communicate responsibly, and convert evidence into owned improvements. Keep one distinction in mind throughout: an observation is not yet a cause. A timeout is not automatically failure. A green health endpoint is not complete recovery. Your job is to make decisions that are safe, evidence-based, and reversible where possible.

Visual alternative: The lesson teaches detection, declaration, containment, evidence preservation, diagnosis, recovery, communication, closure, and improvement.

## Narration: Detect Declare Narration

Begin by separating observations from conclusions. Signals may include a failed quality case, unsafe output, an access denial, unusual resource use, queue growth, latency, cost, an artifact mismatch, missing telemetry, or a user report. Correlate the request, exact serving build, policy decision, infrastructure, dependency state, and outcome before calling every symptom a model failure. Set severity from actual and credible potential impact to people, data, authorization, external actions, service, money, and legal or safety duties. Name an incident lead, evidence owner, technical responders, communications owner, and decision authority. Record confirmed facts with times, and keep hypotheses visibly separate. The severity scale used in this exercise is local to the scenario. It is not a universal industry scale.

Visual alternative: Incident severity is based on actual and credible potential impact, not on fluency, model size, or the number of dashboards.

Sources:

- <https://www.nist.gov/publications/incident-response-recommendations-and-considerations-cybersecurity-risk-management-csf>
- <https://www.nist.gov/cyberframework>

## Demonstration: Incident Demonstration

Here is the worked declaration for INC-42. At 10:02:00Z, release rel-2026-09-21.3 is expected to serve one artifact, while gpu-node-07 reports a different artifact. Queue p95 is 48,000 milliseconds. Request req-pay-7 attempted create-payment for order-8842 through principal svc-checkout, and its outcome is unknown. Quality case quality-03 fails. These are fixture observations. They do not prove that the model caused the queue delay, that the identity mismatch caused the quality failure, or that payment failed. Declare SEV-1 because the financial outcome is unknown and the artifact mismatch creates a credible wider integrity risk. Assign I. Chen as lead, R. Singh as evidence owner, A. Okafor as serving responder, M. Diaz as external-action responder, J. Park as communications owner, and S. Laurent as decision authority. Publish updates every 15 minutes until containment, then every 30 minutes during monitored recovery.

Visual alternative: INC-42 has a financial unknown and an artifact mismatch, so the exercise declares local SEV-1 without claiming a root cause.

Sources:

- <https://www.nist.gov/publications/incident-response-recommendations-and-considerations-cybersecurity-risk-management-csf>
- <https://www.nist.gov/cyberframework>
- <https://opentelemetry.io/docs/specs/semconv/>

## Narration: Contain Preserve Narration

Contain at the narrowest effective boundary that stops credible harm. Possible controls include rejecting one workload, disabling a route or tool, revoking a principal or secret, quarantining an artifact, stopping a rollout, reducing concurrency, isolating a node, requiring manual approval, or switching to a separately evaluated fallback. Do not allow automatic retries to amplify load or repeat an uncertain side effect. Preserve secret-safe timestamps, correlation identifiers, exact versions and digests, policy decisions, redacted logs, metrics, traces, queue state, deployment history, approvals, and observed postconditions. Follow privacy, access, retention, and legal requirements. An incident is not permission to collect every prompt, credential, payment detail, personal datum, or hidden reasoning. The retention duration for this exercise is UNKNOWN because no organizational policy was supplied.

Visual alternative: Containment stops the narrowest credible harm while the ledger preserves necessary redacted evidence and protects sensitive data.

Sources:

- <https://www.nist.gov/publications/incident-response-recommendations-and-considerations-cybersecurity-risk-management-csf>
- <https://opentelemetry.io/docs/specs/semconv/>
- <https://docs.docker.com/engine/containers/resource_constraints/>
- <https://kubernetes.io/docs/concepts/security/security-checklist/>

## Demonstration: Containment Demonstration

For INC-42, containment completes at 10:05:00Z. Pause the rollout. Remove gpu-node-07 from service. Place only create-payment in reconciliation-only mode. Disable automatic retries for unknown outcomes. Reduce admission for the affected workload. Make artifact directories read-only. Give read-only queue and deployment snapshots to R. Singh. This stops the risky route and quarantines the mismatched node without pretending that unaffected traffic is unsafe. Do not authorize rollback, retry, or compensation merely because containment is complete. Also remember that a container or cluster setting is evidence to inspect, not proof that the deployed system is safe. Explicit resource limits and host capacity matter, and configuration guidance does not prove that a particular cluster enforces a control.

Visual alternative: INC-42 is contained narrowly, with the external action held and evidence preserved; no rollback or compensation is authorized by the record.

Sources:

- <https://docs.docker.com/engine/containers/resource_constraints/>
- <https://kubernetes.io/docs/concepts/security/security-checklist/>

## Narration: Diagnose Boundary Narration

Now diagnose by boundary rather than by the loudest symptom. Test artifact integrity and provenance; runtime and driver compatibility; endpoint and adapter contracts; identity and authorization; network and secret access; evaluation behavior; data and prompt inputs; capacity and scheduling; dependencies; telemetry; and recent changes. More than one boundary may fail. Classify evidence as transient, deterministic, policy, authorization, corrupt-state, capacity, dependency, telemetry, or incompatible-release failure. For an uncertain external outcome, reconcile the authoritative system of record and observed postcondition before retrying or compensating. A client timeout proves that the client did not receive completion. It does not prove that downstream work did not happen.

Visual alternative: The matrix distinguishes a first failed boundary from downstream symptoms and requires reconciliation for unknown effects.

Sources:

- <https://www.nist.gov/cyberframework>
- <https://opentelemetry.io/docs/specs/semconv/>
- <https://kubernetes.io/docs/concepts/workloads/controllers/deployment/>

## Demonstration: Diagnostic Worked Matrix

Apply the matrix to INC-42. Artifact integrity expects release rel-2026-09-21.3 and the expected digest, but gpu-node-07 reports another digest. Quarantine that node and verify provenance. Runtime compatibility expects the recorded serving image and fixture contract fixture-v1, and the snapshot matches, so runtime incompatibility is not established. Authorization expects svc-checkout to have only create-payment access, and the snapshot shows that grant. That proves access, not completion. Evaluation expects quality-01 through quality-04 to pass, and quality-03 fails on the bad release. Capacity expects queue age below 5,000 milliseconds, while the observed age is 48,000 milliseconds. Telemetry expects correlated serving, queue, policy, and adapter events, but the adapter result is missing. The exercise budget guard remains true. Each conclusion stays bounded by its evidence.

Visual alternative: Artifact identity, quality, capacity, and telemetry are failed or incomplete boundaries; runtime incompatibility and budget breach are not established.

Sources:

- <https://www.nist.gov/cyberframework>
- <https://opentelemetry.io/docs/specs/semconv/>
- <https://kubernetes.io/docs/concepts/workloads/controllers/deployment/>

## Checkpoint: Unknown Outcome Checkpoint

Checkpoint. Request req-pay-7 timed out after invoking create-payment for order-8842. The principal was svc-checkout, but no authoritative final result is present. What decision should the runbook make, and what evidence must come first?

Learner action: Choose HOLD_RECONCILE and identify the authoritative final record and observed postcondition required before retry or compensation.

Sources:

- <https://www.nist.gov/publications/incident-response-recommendations-and-considerations-cybersecurity-risk-management-csf>
- <https://opentelemetry.io/docs/specs/semconv/>

## Pause: Checkpoint Response Time

## Feedback: Unknown Outcome Feedback

The correct decision is HOLD_RECONCILE. A timeout leaves success and failure both possible. Compare the exact incident, request, action, target, identity, authority, observation time, and final outcome. Missing, stale, future-dated, wrong-identity, non-authoritative, or partial evidence cannot settle the result. Matching authoritative success means mark COMPLETED and never repeat. Matching authoritative failure may make a new attempt eligible only after every recovery gate and both objectives pass. Immediate retry could duplicate a payment. Compensation could reverse an action that never occurred. The safe causal sequence is reconcile, authorize, act, and verify. This is not blanket denial, because valid evidence can support a different result.

If correct: You selected HOLD_RECONCILE and required matching authoritative final evidence before another side effect.

If retrying: A timeout is uncertainty, not failure. Require matching authoritative evidence and an observed postcondition before acting.

Sources:

- <https://www.nist.gov/publications/incident-response-recommendations-and-considerations-cybersecurity-risk-management-csf>
- <https://opentelemetry.io/docs/specs/semconv/>

## Narration: Recover Validate Narration

Recovery is a gated decision, not a restart. Choose a tested action such as removing traffic, replacing a corrupt artifact, restoring state, scaling within a safe envelope, failing over, rolling back the complete serving unit, or remaining unavailable pending human authority. Validate exact model and dependency identity, access, representative quality and safety cases, endpoint compatibility, capacity, queues, telemetry, alerts, cost, reconciled external effects, and user-visible postconditions. Restore traffic in bounded stages and stop if recurrence appears. A green health endpoint proves only that one process answers a check. It does not prove the correct artifact, safe access, valid quality, cleared queues, working telemetry, reconciled state, or recovered user service.

Visual alternative: Recovery requires identity, access, quality, compatibility, capacity, telemetry, cost, and user-service validation, not only a health endpoint.

Sources:

- <https://www.nist.gov/cyberframework>
- <https://kubernetes.io/docs/concepts/workloads/controllers/deployment/>

## Demonstration: Recovery Arithmetic Demonstration

The exercise sets an RTO objective of 600,000 milliseconds and an RPO objective of 300,000 milliseconds. RTO actual equals recovered-at time minus declared-at time. The supplied values are 1,720,000,420,000 minus 1,720,000,000,000, which equals 420,000 milliseconds. Because 420,000 is no greater than 600,000, RTO passes. RPO actual equals incident time minus checkpoint time. The supplied values are 1,720,000,000,000 minus 1,719,999,880,000, which equals 120,000 milliseconds. Because 120,000 is no greater than 300,000, RPO passes. These are deterministic fixtures, not production recommendations. At 10:09:00Z, the known-good unit passes all eight gates for non-action traffic, queue age is 3,100 milliseconds, and correlated telemetry is present. The payment route remains held because req-pay-7 is unreconciled. Recovery is therefore scoped, not falsely complete.

Visual alternative: RTO is 420,000 milliseconds against a 600,000 objective, and RPO is 120,000 milliseconds against a 300,000 objective; both pass.

Sources:

- <https://www.nist.gov/cyberframework>

## Narration: Communicate Learn Narration

A useful update states the time, scope, impact, confirmed facts, current containment, service status, next decision, and expected cadence. Follow privacy, legal, customer, contractual, and regulatory duties. Do not publish raw operational evidence or claim a root cause merely because rollback improves symptoms. Close only after impact has stopped, recovery evidence passes for the restored scope, required communication is sent, temporary access is removed, and follow-up work has owners and dates. Build a blameless timeline. Add reproducing cases, improve controls, rehearse the runbook, and measure recurrence. A cleared alarm without validated recovery and owned prevention is not closure.

Visual alternative: Closure requires stopped impact, validated recovery, required communication, temporary-access cleanup, and dated prevention owners.

Sources:

- <https://www.nist.gov/publications/incident-response-recommendations-and-considerations-cybersecurity-risk-management-csf>
- <https://www.nist.gov/cyberframework>

## Demonstration: Stakeholder Update Demonstration

Here is the exercise update at 10:10:00Z. INC-42 remains SEV-1. Scope includes release rel-2026-09-21.3 on gpu-node-07, elevated queue delay, and create-payment request req-pay-7 with an unknown external outcome. We paused the rollout, quarantined the mismatched artifact, removed the node from routing, and disabled retries for unknown external actions. A known-good serving unit passes identity, access, quality, compatibility, capacity, telemetry, cost, and non-action user-service checks. The payment route remains in reconciliation-only mode. No root cause is confirmed. The next decision depends on authoritative payment-system evidence for req-pay-7. Next update: 10:25:00Z. Later, at 10:12:00Z, matching authoritative evidence reports success, so req-pay-7 is marked completed and never retried.

Visual alternative: The update says no root cause is confirmed and keeps the payment route in reconciliation-only mode until authoritative evidence arrives.

Sources:

- <https://www.nist.gov/publications/incident-response-recommendations-and-considerations-cybersecurity-risk-management-csf>
- <https://www.nist.gov/cyberframework>

## Learner Prompt: Activity Transition

Now complete the incident exercise. Use the bad release, elevated queue delay, artifact identity mismatch, and uncertain user-visible outcome. Declare severity, roles, cadence, containment, and evidence boundaries. Build a boundary-by-boundary diagnostic table. Reconcile every uncertain outcome before retry, rollback, or compensation. Execute the recovery runbook against the supplied objectives. Verify identity, access, quality, compatibility, capacity, telemetry, cost, and user service. Produce a timeline, stakeholder update, closure decision, and owned prevention backlog. In your explanation, state why a timeout creates uncertainty, why uncertainty is not failure, why repeated side effects can cause duplicate harm, why completed history is not permission for a new action, and why matching final evidence plus successful gates and objectives is required before a retry.

Learner action: Complete the incident exercise and submit the decision record, timeline, communication, closure evidence, prevention backlog, predictions, repair, and causal explanation.

Sources:

- <https://www.nist.gov/publications/incident-response-recommendations-and-considerations-cybersecurity-risk-management-csf>
- <https://www.nist.gov/cyberframework>
- <https://opentelemetry.io/docs/specs/semconv/>
- <https://kubernetes.io/docs/concepts/workloads/controllers/deployment/>

## Learner Prompt: Prediction Prompt

Before reading an answer key, predict the result for each variation. Consider missing, stale, future-dated, wrong-identity, non-authoritative, partial, duplicate-completed, authoritative-success, failed-gate, RTO-miss, RPO-miss, and changed-retryable inputs. For each, identify the fact that establishes completion, failure, or continued uncertainty. Write the prediction first. The changed valid case must remain eligible when matching authoritative failure exists and every gate and objective passes. Do not choose blanket hold or blanket retry as a shortcut.

Learner action: Record predictions for all listed evidence and recovery variations before continuing.

## Pause: Prediction Pause

## Demonstration: Repair Lab Demonstration

Now enter the local repair lab from the repository root. It requires Node.js 22, native ECMAScript modules, built-in Node APIs, no dependencies, no network, and no access keys. It performs no model inference, deployment, payment, notification, approval, rollback, compensation, or other external action. Edit only the deliberate unknown-outcome branch in the starter file, changing its two assignments so the decision is HOLD_RECONCILE with the supplied reason. Keep tests, fixtures, validation, and reference files immutable. Do not import the reference or replace the decision with a blanket hold. The program reports eligibility only. It never executes or approves an action.

Visual alternative: The deterministic local lab uses Node.js 22, no network, and only permits repair of the deliberate branch in the starter file.

## Demonstration: Repair Results Demonstration

The supplied repaired results are exact. The unknown case prints HOLD_RECONCILE, with exit code 2, RTO actual 420,000 milliseconds, and RPO actual 120,000 milliseconds. The immutable test suite prints RESULT 23 passed, 0 failed, with exit code 0. The changed input prints RETRY_ALLOWED because matching authoritative evidence proves failure, with exit code 0, RTO actual 300,000 milliseconds, and RPO actual 100,000 milliseconds. A failed access gate, another failed gate, an RTO miss, or an RPO miss blocks a new action and uses recovery failure with exit code 3. Completed history is different: a matching completed request returns COMPLETED and is never repeated, even if recovery is otherwise blocked. This is why deny-all is not a valid repair.

Visual alternative: Unknown evidence holds, matching authoritative failure may permit a changed retry after all gates and objectives pass, and completed history is never repeated.

## Learner Prompt: Timeline And Prevention Prompt

Finish the written exercise with the supplied timeline and prevention backlog. The timeline begins at 10:00:00Z with the release, reaches the queue alarm at 10:01:30Z, declares INC-42 at 10:03:00Z, contains it at 10:05:00Z, reproduces quality-03 at 10:07:00Z, validates non-action recovery at 10:09:00Z, communicates at 10:10:00Z, reconciles payment success at 10:12:00Z, passes a canary at 10:15:00Z, restores bounded traffic at 10:20:00Z, observes no recurrence at 10:35:00Z, and closes at 10:40:00Z only when all conditions pass. Assign the supplied owners and dates to identity verification, reconciliation, idempotency tests, communication, rollback rehearsal, and closure evidence.

Learner action: Submit the timeline, closure conditions, and owned prevention backlog without claiming real execution or approval.

## Pause: Activity Work Time

## Assessment Handoff: Assessment Handoff

Begin the knowledge check when you can set severity from impact, select narrow containment, preserve governed evidence, diagnose boundaries, reconcile a timeout, calculate recovery objectives, validate more than endpoint health, communicate uncertainty, and define evidence-based closure. The check contains six questions. It starts only when you choose Begin knowledge check.

## Closing: Class Closing

Remember the decision pattern. Respond to impact, not presentation. Contain the narrowest credible harm. Preserve only justified evidence. Diagnose the failed boundary instead of guessing from a symptom. Reconcile unknown effects before another side effect. Recover only when identity, access, quality, compatibility, capacity, telemetry, cost, user service, RTO, and RPO pass for the claimed scope. Communicate confirmed facts and uncertainty. Close only with cleanup and owned prevention. In this exercise, a timeout is uncertainty, not failure, and a successful repair must still allow a distinct valid request when evidence and recovery conditions support it.

Visual alternative: Safe incident response distinguishes uncertainty from failure and permits valid recovery decisions without blanket retry or blanket denial.
