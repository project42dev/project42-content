# Defend a Portable, Secure, Reversible Model Service: text-only class

This route contains the complete teaching content, learner actions, feedback,
and assessment handoff without requiring audio, video, or animation.

## Welcome: Welcome And Outcomes

Welcome to the Self-Hosted Model Operations capstone. Your goal is not to show that a chat page can answer one prompt. You will assemble a portable, authorized, secure, evaluated, capacity-bounded, observable, reversible, and recoverable service package. Every mastery claim must point to reproducible evidence, and consequential release and recovery decisions remain with authorized humans.

## Narration: Mission Boundaries Narration

Choose one bounded mission and one deployment shape: workstation, container on premises, edge, or cloud-managed compute. Define intended learners or users, supported workload, prohibited data, request and response contract, non-goals, quality and service objectives, cost boundary, and stop conditions. Homestead Foundry may supply an optional reference adapter, but it cannot become a required runtime or evidence dependency. Put a portable contract at the center: artifact identity, endpoint behavior, security controls, evaluation, load, telemetry, lifecycle, recovery, and approval evidence. Keep workstation commands, container manifests, cluster resources, cloud bindings, or Foundry orchestration in named adapters. Another organization must be able to satisfy the same contract with a different environment. Create one release identity spanning model artifact, tokenizer, runtime, endpoint, policy, infrastructure configuration, evaluation set, load profile, telemetry contract, and lifecycle plan. State assumptions and unavailable capabilities directly. Portability does not mean pretending environments are identical; it means preserving required outcomes, evidence, and human authority while isolating implementation differences.

Visual alternative: Artifact, endpoint, security, evaluation, capacity, telemetry, lifecycle, recovery, and approvals remain stable while environment commands differ.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>
- <https://slsa.dev/spec/v1.2/provenance>

## Demonstration: Mission Demonstration

Consider a synthetic internal documentation assistant. It serves approved public and internally authorized documents, never regulated personal data, and returns a bounded answer with cited evidence. The portable contract requires immutable artifact identity, verified endpoint readiness, authenticated callers, object authorization, a representative evaluation, a burst-load decision, redacted telemetry, a stopped canary, complete rollback, and incident recovery. One adapter uses Docker Compose on a local workstation. A second maps the same fields to a cluster. An optional Foundry adapter supplies governed orchestration and evidence collection. The capstone does not give extra credit for the most complicated environment. It scores whether another operator can reproduce the mission, verify the exact build, test failed paths, and take over the service without hidden credentials or assumptions.

Visual alternative: All adapters preserve exact identity, access controls, evaluation, load, telemetry, rollback, incident recovery, and handoff evidence.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>
- <https://kubernetes.io/docs/concepts/workloads/controllers/deployment/>

## Narration: Build Protect Narration

Build from verified artifacts and explicit authority. Select an immutable model revision, record publisher and primary source, review the license and intended use, capture provenance and digest, inventory dependencies, and quarantine any failed verification. SLSA provenance provides a standard vocabulary for verifiable artifact production information; use it where available and document governed alternatives where it is not. Record hardware and driver assumptions and prove the runtime can reconstruct the build. Expose only the required endpoint contract with separate liveness, readiness, exact model identity, inference, cancellation, timeout, overload, and stable error behavior. Define caller, workload, operator, approver, and break-glass principals. Test object and function authorization outside prompts. Bound network ingress and egress, deliver secrets through the approved external mechanism, set request and resource limits, record redacted audit decisions, and prove rotation, revocation, and recovery. Never place credentials in the package, repository, prompts, screenshots, transcripts, or evidence fixtures.

Visual alternative: Failed verification quarantines the build; prompt content never grants authority; secrets remain outside packages and evidence.

Sources:

- <https://slsa.dev/spec/v1.2/provenance>
- <https://www.nist.gov/itl/ai-risk-management-framework>
- <https://kubernetes.io/docs/concepts/workloads/controllers/deployment/>

## Narration: Evaluate Size Narration

Evaluate and size the exact serving build. Create routine, important-slice, boundary, adversarial, accessibility, unauthorized, malformed, timeout, overload, dependency, and recovery cases for the mission. Use deterministic checks for schemas, authorization, citations, side effects, limits, and postconditions. Use calibrated blinded human review for usefulness, nuance, accessibility, and consequential quality. A separately configured model-assisted reviewer may add a versioned signal after calibration and disagreement analysis; it cannot serve as sole judge or release authority. Report by case and slice so averages cannot hide a safety or underserved-workflow failure. Run a bounded load profile through the real gateway and endpoint. Measure latency distributions, queue time, first output, throughput, errors, rejection, cancellations, resource saturation, warm-up, failure behavior, and attributable cost. Issue a capacity decision with body, context, output, concurrency, rate, queue, deadline, resource, and cost limits plus stop conditions. Preserve the exact load profile and build identity.

Visual alternative: Critical failures stay visible beside aggregate results; the capacity decision records distributions, saturation, rejection, warm-up, and stop conditions.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>
- <https://opentelemetry.io/docs/specs/semconv/>
- <https://kubernetes.io/docs/concepts/workloads/controllers/deployment/>

## Checkpoint: Slice Checkpoint

Checkpoint. The candidate improves average quality and latency, but the accessibility slice fails required structure and one unauthorized tool case creates a side effect. Can the capstone pass this gate, and what evidence controls the decision?

Learner action: Fail the critical gate, preserve slice and side-effect evidence, hold or reject release, remediate and re-evaluate the exact build, and require authorized human disposition.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>

## Pause: Checkpoint Response Time

## Feedback: Slice Feedback

The build cannot pass. Required accessibility behavior and authorization postconditions are criterion-level gates; averages do not cancel them. Preserve the exact build, case, trace, policy decision, side effect, reviewer result, and human disposition without exposing unnecessary content. Hold or reject the candidate, correct the responsible application, policy, adapter, template, or model boundary, then rerun the affected and regression cases. If your answer passed because most users improved, revise the mastery rule: evidence must protect important slices and prohibited effects, not merely optimize the average.

If correct: You preserved critical slice and authorization gates and required evidence-backed remediation.

If retrying: Aggregate improvement cannot erase a required accessibility failure or unauthorized external effect.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>

## Narration: Observe Change Recover Narration

Prove operations through failure. Correlate secret-safe logs, metrics, traces, policy decisions, exact build identities, infrastructure, evaluation references, and outcomes with bounded identifiers. Document redaction, access, retention, deletion, cardinality, sampling, and telemetry-loss detection. Fire and route at least one actionable alert through its runbook and recovery condition. Build a complete candidate manifest, compare it with the known-good baseline, obtain required human approval, warm it, and release it with bounded exposure and exact routing evidence. Inject a predeclared failed gate. Stop exposure, reconcile in-flight state, and roll back the complete compatible baseline, not only a model alias. Verify identity, authorization, quality, endpoint behavior, queues, telemetry, cost, and user-visible postconditions. Then run an incident from detection and severity through targeted containment, governed evidence, boundary diagnosis, unknown-outcome reconciliation, recovery-objective validation, communication, closure, and owned prevention. The exercise must include a failed path; a perfect demonstration supplies too little recovery evidence.

Visual alternative: Every state preserves exact identities, authority, evidence, affected work, postconditions, and residual risks without storing secrets.

Sources:

- <https://opentelemetry.io/docs/specs/semconv/>
- <https://kubernetes.io/docs/concepts/workloads/controllers/deployment/>
- <https://www.nist.gov/publications/incident-response-recommendations-and-considerations-cybersecurity-risk-management-csf>

## Narration: Evidence Handoff Narration

Submit mastery evidence, not a demo claim. The package contains eight required artifacts: artifact-license-provenance, endpoint-security-contract, evaluation-results, load-capacity-decision, telemetry-alert-cost-plan, update-rollback-evidence, incident-recovery-runbook, and approval-evidence-handoff. Each artifact records immutable evidence digests, revision history, owners, and status without secrets. Map rubric criteria directly to submitted evidence: fifteen points each for artifact, security, evaluation, capacity, lifecycle, and recovery, plus ten for observability. The passing threshold is eighty percent, but every required artifact and critical gate remains mandatory. Human reviewers record criterion-level judgments and authorized approvals. The operator handoff names versions, service owner, reviewer roles, supported workload, access model, limits, cost boundary, dashboards, alerts, runbook, rollback trigger, recovery objectives, residual risks, evidence expiry, and next review date. An independent operator should be able to reproduce the build, validate its boundaries, operate within its limits, and recover it without asking the learner for hidden context.

Visual alternative: Every score cites immutable evidence; the handoff includes versions, owners, limits, alerts, rollback, recovery, risks, expiry, and next review.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>
- <https://slsa.dev/spec/v1.2/provenance>
- <https://www.nist.gov/publications/incident-response-recommendations-and-considerations-cybersecurity-risk-management-csf>

## Learner Prompt: Activity Transition

Now build and defend the portable service. Complete the schema-valid lab package for one deployment shape and isolate adapter commands. Deploy the exact verified build and capture artifact, license, provenance, endpoint, identity, access, and infrastructure evidence. Run representative evaluation and bounded load suites, issue capacity and cost decisions, and verify privacy-conscious telemetry and alerts. Qualify a candidate change, obtain human approval, force a release-gate failure, and prove complete rollback. Run an incident through recovery and closure. Map all seven rubric criteria to the eight immutable, secret-free artifacts and submit the operator handoff and residual-risk statement.

Learner action: Submit the schema-valid portable package, eight required artifacts, exact evaluation and load evidence, tested telemetry and alerting, approved failed-gate rollback, incident recovery, criterion-level evidence map, approvals, revision history, residual risks, and operator handoff.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>
- <https://www.nist.gov/publications/incident-response-recommendations-and-considerations-cybersecurity-risk-management-csf>
- <https://slsa.dev/spec/v1.2/provenance>
- <https://opentelemetry.io/docs/specs/semconv/>
- <https://kubernetes.io/docs/concepts/workloads/controllers/deployment/>

## Pause: Activity Work Time

## Assessment Handoff: Assessment Handoff

Begin the knowledge check and capstone review only when the portable contract is separate from adapters, artifact mastery is evidenced, slice gates are preserved, rollback postconditions pass, human authority is recorded, and criterion-level scores map to all required reproducible artifacts. Nothing begins or submits automatically.

## Closing: Class Closing

Remember: operational mastery is portable, reproducible, tested through failure, bounded by human authority, and defensible one criterion and one immutable piece of evidence at a time.
