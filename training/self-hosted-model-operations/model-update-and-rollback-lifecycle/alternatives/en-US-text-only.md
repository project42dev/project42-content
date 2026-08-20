# Release and Reverse the Complete Serving Unit: text-only class

This route contains the complete teaching content, learner actions, feedback,
and assessment handoff without requiring audio, video, or animation.

## Welcome: Welcome And Outcomes

Welcome. A model update is a release of a complete serving system, not a new label attached to weights. In this class, you will version the whole change unit, qualify the exact candidate, bound its exposure, rehearse rollback as another controlled release, and preserve evidence so approved and rejected combinations remain reconstructable.

## Narration: Change Unit Narration

Version the entire serving unit. Record the immutable model revision and digest together with the tokenizer, prompt template, retrieval configuration, runtime, accelerator libraries, container image, application adapter, gateway contract, safety and authorization policy, infrastructure configuration, evaluation set, and telemetry schema. Any one of these can change quality, latency, memory, security, privacy, compatibility, or recovery. Give the assembled candidate one release identity and produce a machine-readable difference report against the approved baseline. Separate intentional changes from drift discovered during assembly. SLSA provenance describes verifiable information about where, when, and how an artifact was produced. Apply that evidence discipline to every artifact you can, and document governed alternatives where signing or provenance is unavailable. Retain manifests, immutable artifacts or recoverable locations, policy references, and deployment procedures for both baseline and candidate. If neither stack can be reconstructed without guessing at a mutable tag, external file, or operator memory, the release is not reversible.

Visual alternative: Baseline and candidate columns show exact versions, digests, provenance status, intentional differences, detected drift, and retained recovery locations.

Sources:

- <https://slsa.dev/spec/v1.2/provenance>
- <https://www.nist.gov/itl/ai-risk-management-framework>

## Demonstration: Manifest Demonstration

Consider a synthetic upgrade described only as model version two. The manifest reveals four additional changes: a new tokenizer, an inference-server image update, a revised safety template, and a telemetry field rename. The candidate passes a simple response check but fails the old client's streaming parser, uses more accelerator memory, and makes rollback telemetry appear incomplete because the dashboard expects the renamed field. The operator now divides the change. First, restore the application-owned telemetry contract through an adapter. Second, test the client parser against the new server. Third, include tokenizer and memory behavior in the evaluation and capacity gates. The exact difference report transformed one vague model update into four testable changes and prevented a model-tag rollback from leaving incompatible surrounding components.

Visual alternative: The worked example exposes a streaming incompatibility, memory increase, and telemetry-contract drift that a model tag alone would hide.

Sources:

- <https://slsa.dev/spec/v1.2/provenance>
- <https://kubernetes.io/docs/concepts/workloads/controllers/deployment/>

## Narration: Qualify Candidate Narration

Qualify the exact candidate before user traffic. Verify artifact provenance, license disposition, signatures or documented alternatives, dependency inventory, vulnerability findings, configuration policy, environment and driver compatibility, secret references, and required resource availability. Then run the same representative quality, safety, authorization, API compatibility, load, cost, failure, backup, rollback, and recovery cases that approved the baseline. Compare candidate and baseline by case and operational slice, not one average. Predeclare hard failures, allowed deltas, uncertainty, required reviewer roles, and waiver authority before opening the results. The NIST AI Risk Management Framework organizes work around governing, mapping, measuring, and managing risk. A release gate makes those responsibilities concrete: evidence informs the decision, while authorized humans retain promotion authority. A newer model name, larger parameter count, or stronger public benchmark does not override a failed safety, compatibility, privacy, capacity, or recovery gate.

Visual alternative: Each gate compares baseline and candidate by case and slice and names hard failures, uncertainty, reviewer roles, and waiver authority.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>
- <https://slsa.dev/spec/v1.2/provenance>

## Narration: Stage Release Narration

Choose a rollout that matches the environment and consequence. A workstation may use an offline replacement with an explicit restore point. Containers can run baseline and candidate side by side with a controlled route switch. A cluster can use a rolling update, bounded canary, or blue-green service. A shadow comparison can observe candidate behavior only when it cannot create user-visible or external effects and its data use is approved. Kubernetes Deployments support declarative rollout and rollback mechanics, but the application still owns exact model identity, quality gates, mixed-version behavior, and state compatibility. Define maximum users or traffic, observation window, success and guardrail indicators, cost ceiling, required approver, and automatic or manual stop conditions. Verify artifact identity, readiness, warm-up, policy, telemetry, and rollback availability before exposure. Drain old capacity deliberately. Record exact request routing so mixed versions cannot hide which build produced an outcome.

Visual alternative: Each environment has a controlled strategy; no candidate receives traffic before exact identity, warm-up, telemetry, and rollback checks pass.

Sources:

- <https://kubernetes.io/docs/concepts/workloads/controllers/deployment/>
- <https://kubernetes.io/docs/tutorials/kubernetes-basics/update/update-intro/>

## Checkpoint: Hard Gate Checkpoint

Checkpoint. A newer candidate improves average quality, but it fails one predeclared safety gate and breaks a required client behavior during the canary. The model name is newer and the rollout has used only five percent of traffic. What happens next?

Learner action: Stop candidate exposure, preserve exact routing and failure evidence, restore or retain the approved baseline, reconcile affected work, and require authorized review before any revised release.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>
- <https://kubernetes.io/docs/concepts/workloads/controllers/deployment/>

## Pause: Checkpoint Response Time

## Feedback: Hard Gate Feedback

Stop the rollout. Five-percent exposure limits blast radius; it does not convert a hard failure into an acceptable result. Preserve candidate and baseline identities, exact routed requests, the safety failure, compatibility trace, decision, and any affected state without copying unnecessary content. Remove candidate traffic, verify the approved baseline, reconcile in-flight work, and issue a hold or reject disposition. A revised candidate must return through the qualification gates. If your answer continued because the model is newer or the average improved, restore the authority of predeclared safety and compatibility gates.

If correct: You honored the hard gates, stopped exposure, preserved evidence, and restored the approved baseline.

If retrying: Novelty and aggregate improvement cannot override predeclared safety or compatibility failures.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>
- <https://kubernetes.io/docs/concepts/workloads/controllers/deployment/>

## Narration: Rollback Release Narration

Treat rollback as a tested release of the complete known-good unit. Retain model, tokenizer, runtime, image, adapters, prompt and safety policy, infrastructure configuration, secret references, telemetry contract, and deployment procedure. Identify state that may have changed during the candidate: database schemas, queue formats, caches, tool side effects, evaluation records, or user-visible work. For every forward-only change, provide a compatible reader, restore procedure, migration reversal, or documented compensating path. Rehearse rollback before production using the same authorization, provenance, artifact verification, readiness, warm-up, routing, and postcondition checks as an update. During reversal, stop candidate admission, drain or reconcile bounded in-flight work, restore the complete baseline, and verify exact identity, representative quality, endpoint contract, authorization, queue state, telemetry, cost, and user-visible recovery. Changing an alias to old weights while leaving a new incompatible tokenizer or schema is not a complete rollback.

Visual alternative: A model alias change alone fails the test; exact identity, behavior, authorization, queues, telemetry, cost, and recovery must all be verified.

Sources:

- <https://kubernetes.io/docs/concepts/workloads/controllers/deployment/>
- <https://kubernetes.io/docs/tutorials/kubernetes-basics/update/update-intro/>
- <https://slsa.dev/spec/v1.2/provenance>

## Narration: Evidence Improvement Narration

Close the lifecycle with an evidence ledger. Record who proposed, reviewed, approved, executed, paused, rolled back, and verified the change. Preserve timestamps, immutable versions, test outputs, traffic exposure, stop conditions, decisions, exceptions, expiry, and residual risks without storing secrets or unnecessary request content. Link every decision to reproducible evidence. Feed release and rollback findings back into evaluation cases, thresholds, capacity assumptions, compatibility manifests, state-migration tests, and runbooks. Retain rejected candidates under policy with an explicit disposition and failed gates. That record prevents the same unsafe combination from being rediscovered and promoted later without context. Evidence also expires: when infrastructure, traffic, policy, data, grader, or dependency conditions change, rerun the affected gates rather than treating an old approval as permanent.

Visual alternative: Approved and rejected candidates remain distinguishable; findings update evaluation, compatibility, capacity, migration, and recovery evidence.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>
- <https://slsa.dev/spec/v1.2/provenance>

## Learner Prompt: Activity Transition

Now plan and rehearse the reversible update. Create baseline and candidate manifests for the model, tokenizer, runtime, image, adapters, policies, configuration, infrastructure, evaluation set, and telemetry schema using immutable identities. Define quality, safety, security, compatibility, capacity, cost, and recovery comparisons with hard gates and authorized reviewers. Choose a workstation, container, on-premises, edge, or cloud rollout and specify exposure, observation, stop, drain, routing, and approval controls. Force one guardrail failure in a tabletop or isolated rehearsal, execute rollback, verify the restored endpoint and state, then issue a release, reject, or revise decision with residual risks and follow-up.

Learner action: Complete immutable baseline and candidate manifests, qualification gates, bounded rollout, forced-stop and rollback rehearsal, restored postconditions, human disposition, residual risks, and follow-up evidence.

Sources:

- <https://kubernetes.io/docs/concepts/workloads/controllers/deployment/>
- <https://kubernetes.io/docs/tutorials/kubernetes-basics/update/update-intro/>
- <https://slsa.dev/spec/v1.2/provenance>
- <https://www.nist.gov/itl/ai-risk-management-framework>

## Pause: Activity Work Time

## Assessment Handoff: Assessment Handoff

Begin the check when you can define the complete serving unit, compare candidate and baseline by case and slice, preserve exact canary routing, stop on a hard gate, prove complete rollback, and retain rejected-candidate evidence. The check starts only when you choose Begin knowledge check.

## Closing: Class Closing

Remember: version the whole serving unit, qualify what will actually run, bound every rollout, and rehearse the complete compatible baseline as a release before you need it.
