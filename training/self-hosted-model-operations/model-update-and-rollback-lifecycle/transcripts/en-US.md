# Release and Reverse the Complete Serving Unit

Package: `model-update-and-rollback-lifecycle-class` 2.0.0

> This is the canonical text equivalent of an AI-assisted virtual-instructor
> class. It remains usable without synthesized audio, video, animation, or a
> player runtime.

## Welcome: Welcome And Outcomes

Welcome. This lesson treats a model update as a release of a complete serving system, not as a new label attached to model weights. We will version the entire serving unit, qualify the exact candidate before traffic, stage it with bounded exposure, treat rollback as a tested release, and close the lifecycle with evidence. We will then repair a small local decision program whose deliberate defect allows an incompatible rollback state to promote. The examples are synthetic fixtures. They do not represent live infrastructure, provider execution, authenticated people, production approvals, or rendered media.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>

## Narration: Change Unit Narration

Version the entire serving unit. Start with the immutable model revision and digest, but do not stop there. Record the tokenizer, runtime, accelerator libraries, container image, adapters, prompt templates, stop conditions, safety policy, gateway contract, infrastructure configuration, evaluation set, telemetry schema, and state schema. Include data dependencies that can affect serving behavior or recovery. Any one of these can change quality, latency, memory use, security, observability, or compatibility. Give the assembled candidate one release identity and compare it with the currently approved baseline. For every difference, record whether it is intentional, tested, and owned. Unexplained drift is not a harmless detail. It is missing release evidence. Retain the manifests, artifacts, immutable locations, policy references, and deployment procedures needed to reconstruct both releases. A mutable image tag or a remembered command is not enough. SLSA provenance can describe where, when, and how an artifact was produced, but provenance does not prove quality, safety, capacity, or rollback compatibility. Those claims need their own evidence. Required arrays in the operating packet are deliberately nonempty. Accelerator libraries, adapters, prompt templates, stop conditions, and drain conditions must not silently disappear as unknown evidence. If a component is genuinely absent, represent that fact explicitly in the production schema rather than disguising absence as an empty value. Finally, do not infer capabilities from a model-family or software-project name. Meta Llama, Qwen, DeepSeek, Mistral, Microsoft Phi, and NVIDIA software occupy different project surfaces. Inventory the exact artifacts and runtime actually deployed, including their contracts and recovery behavior.

Sources:

- <https://slsa.dev/spec/v1.2/provenance>
- <https://www.nist.gov/itl/ai-risk-management-framework>
- <https://github.com/meta-llama/llama-models>
- <https://github.com/QwenLM/Qwen>
- <https://github.com/deepseek-ai/DeepSeek-V3>
- <https://github.com/mistralai/mistral-inference>
- <https://github.com/microsoft/PhiCookBook>
- <https://github.com/triton-inference-server/server>

## Demonstration: Manifest Demonstration

Here is a worked synthetic demonstration. The proposed change is initially described as model version two. The complete difference report reveals four additional changes: a new tokenizer, an inference-server image update, a revised safety template, and a telemetry field rename. A simple response check passes, but the old client streaming parser breaks. Accelerator memory also increases, and the dashboard appears incomplete because it expects the old telemetry field. The arithmetic is simple but important. Suppose the baseline uses 8 gigabytes for the serving process and the candidate uses 9.2 gigabytes. The increase is 9.2 minus 8, which is 1.2 gigabytes. Dividing 1.2 by 8 gives 0.15, or a 15 percent increase. That is a capacity input, not a promotion decision. We now split the work into gates. First, restore the application-owned telemetry contract through a tested adapter. Second, test the old client parser against the new server. Third, measure the tokenizer and memory changes in representative quality and capacity cases. Fourth, record the revised safety template as an intentional policy difference. The release identity is therefore not merely model version two. It is the exact assembly and its evidence. The lesson is causal: omitting surrounding dependencies hides the very changes that can make rollback incomplete.

Sources:

- <https://slsa.dev/spec/v1.2/provenance>
- <https://docs.docker.com/engine/containers/resource_constraints/>

## Narration: Qualify Candidate Narration

Qualification asks whether this exact assembly can replace the baseline in this exact environment. Verify provenance, license disposition, signatures or documented alternatives, dependency inventory, vulnerability findings, configuration policy, environment compatibility, secret-handling evidence, and required resource availability. Then test representative quality, safety, API compatibility, load, cost, failure, and recovery cases. Use seven explicit gates. Quality covers representative tasks and operational slices. Safety covers approved cases and hard prohibitions. Security covers provenance, dependencies, vulnerabilities, secret handling, and deployed configuration. Compatibility covers the API, tokenizer, prompt, telemetry, runtime, and state contracts. Capacity covers bounded load, latency, queues, memory, and failure behavior. Cost compares measured resource use with a declared ceiling. Recovery proves that the retained known-good unit and compatible state can be restored and read back. Compare candidate and baseline by case and slice rather than relying on one average. Define hard failures, allowed deltas, uncertainty, owners, and waiver authority before seeing results. Unknown, missing, placeholder, or contradictory evidence does not count as a pass. A newer model-family name cannot override a failed gate. The risk-management framework from NIST helps organize governance and measurement, but a deployment still needs concrete thresholds and accountable decision authority. A process that starts is not a capacity result. Docker documents that containers have no resource constraints by default, so CPU, memory, accelerator allocation, and host capacity belong in tested configuration. Similarly, a security checklist is guidance, not proof that a cluster enforces a setting. For latency distributions, aggregate histogram buckets rather than averaging precomputed quantiles. The lab values are deterministic fixture values, not benchmark claims.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>
- <https://docs.docker.com/engine/containers/resource_constraints/>
- <https://kubernetes.io/docs/concepts/security/security-checklist/>
- <https://prometheus.io/docs/practices/histograms/>
- <https://slsa.dev/spec/v1.2/provenance>

## Demonstration: Qualify Arithmetic Demonstration

Let us make a gate decision from supplied fixture values. The safety guardrail observes a refusal-rate delta of 0.05 and allows a maximum of 0.02. Subtracting the maximum from the observed value gives 0.05 minus 0.02, which equals 0.03 above the limit. Equivalently, 0.05 is 2.5 times 0.02. The result is safety FAIL, not pass. Now consider a cost ceiling of 100 units per observation window. A candidate total of 96 is below the ceiling by 4 units, so cost passes this fixture. That one pass cannot cancel the safety failure. Seven pass labels are also not sufficient when compatibility evidence contradicts rollback evidence. The decision function must inspect the evidence and the gate statuses together. A missing state conversion, a false compatibility claim, or a complete-manifest mismatch remains a recovery failure even if the other six rows pass.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>
- <https://prometheus.io/docs/practices/histograms/>

## Narration: Stage Release Narration

A rollout converts qualification evidence into bounded exposure. Choose the strategy for the actual environment and consequence. Options include offline replacement, explicit route switching, rolling replacement, canary traffic, blue-green service, and shadow comparison that cannot create user-visible effects. Retain exact request-routing identity in telemetry. The supplied worked packet declares a one percent simulated canary, a ten-minute observation window, a 120-second drain timeout, a cost ceiling, stop conditions, drain conditions, a decision owner, and an executor. The names are synthetic exercise data, not authenticated people or production approvals. Stop on any hard gate failure, unknown serving identity, incompatible state, guardrail breach, or cost-ceiling breach. Draining means stopping new candidate routing, allowing bounded in-flight completion, handling remaining work under a declared policy, and restoring routes only after baseline readiness and identity verification. Kubernetes Deployment mechanics can change a workload template, but the application still owns exact model identity, mixed-version behavior, state compatibility, and postconditions. A shadow comparison is not automatically harmless. Its data use, side effects, and policy must be approved. This local lab reads JSON fixtures only. It invokes no model server, container runtime, cluster API, cloud API, artifact store, approval service, database, or telemetry backend. Passing the lab proves only that local decision code handles supplied evidence consistently. A real integration must resolve retained artifact identities, verify provenance and required signatures, exercise the deployed runtime, read actual routing and telemetry, and obtain authorization through the approved organizational system.

Sources:

- <https://kubernetes.io/docs/concepts/workloads/controllers/deployment/>
- <https://kubernetes.io/docs/tutorials/kubernetes-basics/update/update-intro/>

## Checkpoint: Hard Gate Checkpoint

Checkpoint. A newer candidate improves average quality, but it fails one predeclared safety gate and breaks a required client behavior during a canary. Exposure is only five percent. What happens next, and what evidence must be retained?

Expected learner action: State that exposure stops, candidate traffic is removed or drained, the approved baseline is verified, exact identities and failure evidence are retained, and authorized review is required before any revised release.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>
- <https://kubernetes.io/docs/concepts/workloads/controllers/deployment/>

## Pause: Checkpoint Response Time

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>

## Feedback: Hard Gate Feedback

The correct action is to stop the rollout. Five percent limits blast radius; it does not convert a hard failure into an acceptable result. Preserve candidate and baseline identities, exact routed requests or approved summaries, the safety failure, the compatibility trace, the decision, and affected-state evidence without retaining secrets or unnecessary request content. Remove candidate traffic, verify the approved baseline, reconcile bounded in-flight work, and issue a hold or reject disposition. A revised candidate must return through qualification. If you continued because the candidate is newer or its average improved, the causal error was allowing aggregate improvement to override predeclared safety and compatibility gates.

Correct feedback: You stopped exposure, honored hard gates, preserved evidence, and restored or verified the approved baseline.

Retry feedback: Novelty and aggregate improvement cannot override predeclared safety or compatibility failures.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>
- <https://kubernetes.io/docs/concepts/workloads/controllers/deployment/>

## Narration: Rollback Release Narration

Treat rollback as a controlled release whose target is the retained known-good serving unit. Retain the model and tokenizer artifacts, runtime and accelerator dependencies, image, adapters, prompt templates, policy, gateway and infrastructure configuration, evaluation identity, telemetry schema, state schema, secret references, and recovery procedure. A Kubernetes Deployment revision rollback changes the workload template managed by the Deployment controller. It does not automatically restore an external database, undo a schema migration, recreate a queue or vector index, recover an object store, restore deleted artifacts, or make forward-written state readable by an older runtime. State restoration and compatibility therefore need separate evidence and procedures. The validator binds rollback evidence to the actual baseline and candidate state schemas. Baseline state schema evidence must equal the baseline manifest value, and candidate evidence must equal the candidate manifest value. A compatible-rollback claim must agree with a passing recovery gate and non-placeholder compatibility evidence. A false claim must agree with a failed recovery gate. Consider the supplied worked example. Baseline release svc-2026-09-01 uses conversation-v1. Candidate release svc-2026-09-20 uses conversation-v2. There is no tested reverse conversion, so rollback compatibility is false and recovery fails. Six other gates pass. The deliberate defect discards recovery while collecting failures, so the starter promotes. The repaired predicate collects every gate whose status is not pass. The repaired result rejects and reports recovery. During the simulated rehearsal, the safety value is 0.05 and the maximum is 0.02, so 0.05 is greater than 0.02. The guardrail is FAIL and the action is STOP_AND_DRAIN. The exposure is one percent, the observation window is ten minutes, and the drain timeout is 120 seconds. The rollback target and readback release are both svc-2026-09-01. Readiness is true. The complete readback manifest equals the immutable baseline, so READBACK_COMPLETE_MANIFEST_MATCH is true and ROLLBACK_VERIFIED is true. That comparison covers release ID, model, tokenizer, runtime, accelerator libraries, image, adapters, prompt templates, safety policy, gateway contract, infrastructure configuration, evaluation set, telemetry schema, and state schema. One matching model digest is not enough. This is simulated fixture processing, not proof that live traffic was exposed, a drain occurred, external state was restored, artifacts were recovered, or an approval was issued.

Sources:

- <https://kubernetes.io/docs/concepts/workloads/controllers/deployment/>
- <https://kubernetes.io/docs/tutorials/kubernetes-basics/update/update-intro/>
- <https://slsa.dev/spec/v1.2/provenance>

## Demonstration: Rollback Postcondition Demonstration

Let us distinguish identity from postcondition. Matching the baseline model digest proves only that one artifact was selected. It does not prove that the tokenizer, runtime, image, adapters, policy, gateway, infrastructure, evaluation identity, telemetry schema, or state schema match. It also does not prove readiness. The correct logical result requires every required comparison to be true. If there are fourteen independent identity and readiness checks and thirteen are true, the complete match is false, not thirteen fourteenths acceptable. Rollback is a conjunction, not an average. The same reasoning applies to state. If the candidate wrote conversation-v2 and the baseline reads conversation-v1, a route switch alone leaves a postcondition boundary unresolved. Provide a tested conversion, a compatible reader, restoration, or a documented compensating path. Otherwise recovery fails and promotion must be blocked.

Sources:

- <https://kubernetes.io/docs/concepts/workloads/controllers/deployment/>

## Narration: Evidence Improvement Narration

Close the lifecycle with an evidence ledger. Record who proposed, reviewed, approved, executed, paused, rolled back, and verified a change, while distinguishing synthetic exercise records from authenticated organizational records. Retain timestamps, immutable identities, test outputs, exposure, decisions, residual risks, exceptions, expiry, and follow-up without retaining secrets or unnecessary request content. Evidence must make successful and failed decisions reconstructable. Keep rejected candidate combinations with an explicit disposition and failed gates. Use those failures to update evaluation cases, thresholds, capacity assumptions, compatibility manifests, state-migration tests, and runbooks. A test log is evidence about software behavior, not authorization to expose users. Evidence also expires. When infrastructure, traffic, policy, data, graders, or dependencies change, rerun affected gates instead of treating an old approval as permanent. A complete activity preserves complete baseline and candidate manifests, all seven gates, bounded exposure, observation, stop, drain, cost, owner, executor, rollback verification, and residual risks. It rejects contradictory rollback evidence. A deny-all implementation, a hardcoded release identifier, a weakened validator, altered immutable tests, placeholder evidence, or partial readback does not satisfy the activity.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>
- <https://slsa.dev/spec/v1.2/provenance>

## Learner Prompt: Activity Transition

Now plan and rehearse a reversible update. Create baseline and candidate manifests that identify the model, tokenizer, runtime, image, adapters, policies, configuration, infrastructure, evaluation set, telemetry schema, and state schema by immutable identity. Define quality, safety, security, compatibility, capacity, cost, and recovery comparisons with hard gates and authorized reviewers. Select a workstation, container, on-premises, edge, or cloud rollout pattern. Specify exposure, observation, stop, drain, routing, cost, and approval controls. Force one guardrail failure in a tabletop or isolated rehearsal. Execute the rollback procedure and verify the restored endpoint, complete manifest, state compatibility, telemetry, and service postconditions. Then issue a release, reject, or revise decision and record residual risks and follow-up. Use the activity worksheet, not memory, for every identity and control.

Expected learner action: Complete immutable baseline and candidate manifests, qualification gates, bounded rollout, forced-stop and rollback rehearsal, restored postconditions, human disposition, residual risks, and follow-up evidence.

Sources:

- <https://kubernetes.io/docs/concepts/workloads/controllers/deployment/>
- <https://kubernetes.io/docs/tutorials/kubernetes-basics/update/update-intro/>
- <https://slsa.dev/spec/v1.2/provenance>
- <https://www.nist.gov/itl/ai-risk-management-framework>

## Pause: Activity Work Time

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>

## Learner Prompt: Repair Lab Prediction Pause

Pause here and write two predictions before opening the reference. For the incompatible packet, state the decision, exit code, rollback compatibility value, failed-gate list, and the causal evidence from the state schemas and recovery gate. For the renamed compatible packet, state the decision, exit code, compatibility value, and why different identifiers require a general rule. Also write one malformed-input case that must be rejected. Do not read the answer until you have recorded all three predictions.

Expected learner action: Record both predictions and one malformed-input rejection rationale before revealing the answer key.

Sources:

- <https://kubernetes.io/docs/concepts/workloads/controllers/deployment/>

## Pause: Repair Lab Answer Pause

Sources:

- <https://kubernetes.io/docs/concepts/workloads/controllers/deployment/>

## Narration: Repair Lab Narration

The focused repair lab is a deterministic Node.js 22 native-ESM exercise. It uses local JSON fixtures only. There are no dependencies, network calls, live models, containers, clusters, approval services, databases, or telemetry services. All identities, observations, people, and approvals in the fixtures are synthetic. Passing the lab is not production approval. First inspect fixtures/packet.json and fixtures/changed-compatible.json before opening the reference. Predict the starter decision for the packet with a failed recovery gate. The packet has six passing gates, a false rollback-compatible claim, and state-schema evidence that does not support recovery. The starter is expected to print DECISION: PROMOTE, ROLLBACK_COMPATIBLE: false, and FAILED_GATES: none, each on its own line, with exit code 0. This is supplied expected behavior, not a claim that this artifact was executed live. The supplied starter test evidence reports 29 discovered tests, 28 passing, one failure named incompatible rollback state blocks promotion, and exit code 1. The stable assertion expected reject but received promote. Before the answer, predict the renamed compatible fixture too. Its identifiers differ, its state schemas agree, its rollback evidence is compatible, and all seven gates pass. A general repair must promote it. Rejecting both cases would be deny-all behavior. Back up only src/decision.mjs into the lab's bounded temporary directory. Edit only src/decision.mjs, preserve its export and return shape, and do not modify validation, fixtures, tests, or the independent reference. The defect is precise: the starter predicate excludes the gate named recovery while collecting failed gates. Replace that logic with a predicate selecting every gate whose status is not pass. The repaired packet must print DECISION: REJECT, ROLLBACK_COMPATIBLE: false, and FAILED_GATES: recovery, with exit code 2. The supplied repaired evidence reports 29 passing tests, zero failures, and exit code 0. The changed fixture must print DECISION: PROMOTE, ROLLBACK_COMPATIBLE: true, and FAILED_GATES: none, with exit code 0. The renamed positive case rules out both hardcoded identifiers and deny-all behavior. Causal testing matters. If the incompatible packet still promotes, recovery is still discarded or overridden. If the renamed compatible packet rejects, the repair is identity-specific or deny-all. If malformed digests, missing fields, unknown values, empty required arrays, non-finite ranges, contradictory compatibility evidence, or complete-manifest readback mismatches are accepted, the shared validator or recovery verification was weakened outside the focused defect. The activity also requires teaching malformed-input rejection and the postcondition boundary. A deny-all repair is not valid because promotion of the changed valid case is itself a requirement.

Sources:

- <https://kubernetes.io/docs/concepts/workloads/controllers/deployment/>

## Feedback: Repair Lab Feedback

Now compare your predictions with the supplied answer. The incompatible packet must reject because recovery is false and the state evidence does not establish a compatible return to the baseline. Its failed-gate output is recovery, not none. The renamed compatible packet must promote because all seven gates pass, the state schemas agree, and its compatible evidence is valid despite different identifiers. The repair is therefore the general predicate that selects every gate whose status is not pass. It is not a release-name exception and it is not a rule that rejects every packet. The exact repaired packet output is DECISION: REJECT, ROLLBACK_COMPATIBLE: false, FAILED_GATES: recovery, with exit code 2. The supplied evidence reports 29 pass and zero fail for the repaired test suite. The changed fixture output is DECISION: PROMOTE, ROLLBACK_COMPATIBLE: true, FAILED_GATES: none, with exit code 0. Malformed digests, missing fields, unknown enums, empty required arrays, non-finite ranges, contradictory compatibility evidence, and any complete readback mismatch must continue to be rejected by the sound shared validator and recovery checks. Do not weaken those controls to fix this one defect. The causal boundary is clear: promotion depends on every failed gate being retained, while rollback verification depends on complete identity, compatible state, and readiness. The lab processes fixtures only. It does not prove a live rollback, external-state restoration, traffic exposure, or approval.

Correct feedback: You predicted both outcomes, connected rejection to failed recovery evidence, and preserved promotion for the renamed valid case.

Retry feedback: A repair must retain every non-pass gate while leaving shared validation, independent tests, and complete readback verification intact.

Sources:

- <https://kubernetes.io/docs/concepts/workloads/controllers/deployment/>

## Demonstration: Repair Lab Commands

Use the repository-root commands supplied by the lab README. The first command runs the local decision program against the incompatible packet. The second runs both immutable test files. The third runs the renamed compatible fixture. The fourth runs the simulated guardrail and rollback rehearsal. The selectable command block contains the full root-relative paths. The supplied rehearsal output is simulation-only, exposure is one percent, observation is ten minutes, the guardrail observes 0.05 against a maximum of 0.02, and the action is STOP_AND_DRAIN with a 120-second drain timeout. It reports baseline readback, readiness true, complete manifest match true, and rollback verified true. Those outputs are fixture processing. They must never be narrated as live infrastructure results. To recover the workspace, restore the named backup or copy the independent reference over the learner file using the bounded README commands. The tests create and remove only the lab-local changed-input file.

Sources:

- <https://kubernetes.io/docs/concepts/workloads/controllers/deployment/>

## Assessment Handoff: Assessment Handoff

Begin the knowledge check when you can define the complete serving unit, compare candidate and baseline by case and slice, identify all seven qualification gates, preserve exact canary routing, stop on a hard gate, distinguish deployment revision rollback from external state restoration, verify complete baseline readback, and retain rejected-candidate evidence. The check contains six questions. It opens only when you choose Begin knowledge check. Nothing is submitted automatically.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>
- <https://kubernetes.io/docs/concepts/workloads/controllers/deployment/>

## Closing: Class Closing

Remember the lifecycle rule: version the whole serving unit, qualify exactly what will run, bound every rollout, and rehearse the complete compatible baseline as a release before you need it. Preserve the evidence for both promotion and rejection. A rollback is complete only when identity, state, readiness, behavior, and postconditions are verified.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>
