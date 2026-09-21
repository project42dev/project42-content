# Choose a Deployment Shape and Operating Model

Package: `deployment-shape-and-operating-model-class` 2.0.0

> This is the canonical text equivalent of an AI-assisted virtual-instructor
> class. It remains usable without synthesized audio, video, animation, or a
> player runtime.

## Welcome: Welcome And Outcomes

Welcome. In this class, you will choose a deployment shape and operating model from evidence rather than from a platform preference. We will begin with a workload and failure contract. We will compare workstation, containerized single host, on-premises service, edge appliance, cloud service, and hybrid deployment. We will separate process, host, site, and control-plane failure domains. We will assign operating ownership, including the gaps that prevent production use. Then we will choose a reversible first shape and repair a constraint-first selector. The central rule is simple: define the work, the failure consequences, and the owner before choosing the platform. A label such as cloud, local, container, or hybrid does not by itself prove privacy, cost efficiency, performance, availability, or recoverability.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Narration: Workload Contract Narration

Begin with the service contract. Record the users, tasks, model class, input and output modalities, sensitivity, concurrency, arrival pattern, context size, output length, latency objective, availability target, geographic boundary, disconnected requirement, retention rule, and recovery objective. Separate an experiment, a shared internal service, and a production dependency. They may use the same model, but they do not justify the same operating commitment. Next, record failure behavior. What happens when the endpoint is slow, unavailable, overloaded, wrong, unsafe, or unable to process a request? A retry response, a safe refusal, a traffic stop, or a human queue can be intentional behavior. Silent loss and an undocumented bypass are not. A deployment shape is suitable only when the team can operate both the normal path and the failure path. Starting with a hardware catalog reverses this reasoning. It encourages a team to reshape the service around a purchase before success, safety, and recovery have been defined.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Demonstration: Workload Demonstration

Here is the worked workload for this class, dated September 21, 2026. It is a synthetic internal support assistant serving 120 analysts in one country. Demand is 60 requests per minute at the ninety-fifth percentile point, with bursts to 120 requests per minute. Inputs contain 2,000 to 8,000 tokens. Outputs are capped at 800 tokens. The model class is a text-generating language model accessed through an internal text-in and text-out service. The data is confidential internal text and must remain in-country. Disconnected operation is not required. The service objective is p95 latency of 4 seconds or less and 99.5 percent monthly availability. The recovery time objective, or RTO, is 60 minutes. The recovery point objective, or RPO, is 15 minutes. Inputs are retained for 7 days for approved evaluation and then deleted. Audit events are retained for 90 days. When the service is unavailable, requests enter an approved human queue. When overloaded, the service returns a retryable response instead of dropping work. Unsafe or unprocessable requests stop safely and go to human review. These figures define the exercise. They are not measurements of a model, accelerator, runtime, API, provider, or deployment. A real team would use the exact artifact, runtime, hardware, representative prompts, and controlled load tests to establish capacity and latency. This lab does not execute a model and does not prove that any service objective has been achieved.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Narration: Shape Comparison Narration

Compare each shape against the same contract. A workstation supports individual learning, offline experiments, and low-concurrency development, but sessions may sleep, local privileges may be broad, changes may be unmanaged, thermal limits may appear, and the machine may disappear with its user. A container adds reproducible packaging and a process boundary. It does not by itself add strong isolation, authentication, backups, high availability, or resource limits. On-premises infrastructure can fit local data, connectivity, and hardware-control requirements, but the operator owns capacity, patching, power, cooling, spare parts, physical access, and incidents. Edge appliances reduce distance and can support intermittent connectivity, while constraining power, memory, update bandwidth, physical security, and repair. Cloud compute can provide faster provisioning and elastic capacity, but region, identity, networking, encryption, quotas, cost controls, observability, backup, and exit planning still need evidence. Hybrid designs add routing, consistency, identity, and operational choices. A deployment label never proves a desired property. For containers, resource limits and host capacity must be configured and verified, not inferred from packaging. Keep model family, artifact, runtime, hardware integration, and API as separate decision fields. A model or runtime name does not establish an equivalent interface, license, context limit, quality level, or operating contract.

Sources:

- <https://docs.docker.com/engine/containers/resource_constraints/>
- <https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/>
- <https://kubernetes.io/docs/concepts/security/security-checklist/>
- <https://onnxruntime.ai/docs/execution-providers/>

## Demonstration: Shape Matrix Demonstration

Now apply hard constraints before weighted ranking. The mandatory constraints are a verified match to the required data boundary, RTO no worse than 60 minutes, RPO no worse than 15 minutes, and a qualified owner for the bounded evaluation. Unknown evidence is incomplete. It is not sufficient evidence. The six illustrative weights are capacity and latency fit, 25 points; scalability, 20; operability, 20; reversibility, 15; cost predictability, 10; and workload fit, 10. The exact synthetic arithmetic is as follows. Workstation scores 4 plus 2 plus 2 plus 5 plus 3 plus 2, which equals 18. Containerized single host scores 15 plus 10 plus 10 plus 14 plus 8 plus 7, which equals 64. On-premises service scores 20 plus 14 plus 17 plus 12 plus 8 plus 7, which equals 78. Edge appliance scores 10 plus 5 plus 10 plus 10 plus 10 plus 10, which equals 55. Cloud service scores 25 plus 20 plus 18 plus 15 plus 9 plus 5, which equals 92. Hybrid scores 19 plus 17 plus 14 plus 10 plus 8 plus 5, which equals 73. These are decision scores, not benchmark results. The eligibility evidence is equally important. Workstation has unknown boundary, RTO 1,440 minutes, RPO 1,440 minutes, and a missing owner, so it is ineligible. Containerized single host has a verified local-only boundary and a qualified owner, but RTO 180 and RPO 60, so it is ineligible. On-premises service has verified local-only boundary, RTO 60, RPO 15, and a qualified owner, so it is eligible. Edge has RTO 120 and RPO 60, so it is ineligible. Cloud has unknown boundary and recovery and a missing owner, so it is ineligible despite its score of 92. Hybrid has verified local-only boundary, RTO 60, RPO 15, and a qualified owner, so it is eligible. Hard constraints first. Ranking second.

Sources:

- <https://docs.docker.com/engine/containers/resource_constraints/>
- <https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/>

## Learner Prompt: Shape Bias Prompt

Before continuing, choose the deployment shape that first felt obvious for your own workload. Write one benefit you expected and one property you may have assumed without evidence, such as privacy, lower cost, availability, or easier recovery. Then name the measurement, review, or failure test that would support that property. Do not answer with a platform label alone. State the evidence you would need.

Expected learner action: Identify one platform bias, one unproven property, and one concrete measurement, review, or test.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Pause: Shape Bias Work Time

## Narration: Failure Domain Narration

Next, map failure domains instead of counting replicas. List the process, container, device, accelerator, host, storage, network, identity provider, scheduler, site, region, artifact registry, and management plane. For each dependency, decide whether the response is a process restart, replica replacement, movement to another node, failover to another site, load shedding, or a safe stop. Three containers on one workstation may improve process recovery, but they share host power, operating system, device, local storage, network, and physical damage. Two sites may still share identity, registry, routing, or management services. An orchestrator can restart a broken process, but it cannot repair an incompatible artifact, restore a lost secret, or prove that queued work completed. Recovery evidence must show that the exact approved artifact, configuration, state, secrets, queues, routing, and telemetry remain recoverable. A claimed RTO or RPO without a dated exercise remains unknown.

Sources:

- <https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/>
- <https://kubernetes.io/docs/concepts/security/security-checklist/>

## Checkpoint: Failure Domain Checkpoint

Checkpoint. A team runs three model-server containers on one physical workstation and calls the endpoint highly available. Name two failures that can remove all three replicas. Then state what evidence is required before making a host-availability claim.

Expected learner action: Name two shared failures and require an observed recovery test outside the failed host.

Sources:

- <https://docs.docker.com/engine/containers/resource_constraints/>

## Pause: Failure Domain Response Time

## Feedback: Failure Domain Feedback

A strong answer names shared host power, operating-system loss, accelerator failure, local-storage corruption, network loss, or physical damage. All three containers can disappear together. Process replication is useful, but its claim stays inside the process and host boundary. Host availability requires independent capacity and an observed test that removes the host, restores routing, reconstructs the exact approved service, preserves or reconciles queued state, and meets the stated recovery objective. If your answer only added more containers, revise it by moving recovery capacity outside the dependency shared by every replica.

Correct feedback: You kept the availability claim inside the tested boundary and required observed recovery outside the shared host.

Retry feedback: Identify a dependency shared by every container, then require recovery capacity and an observed test outside that dependency.

Sources:

- <https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/>

## Demonstration: Failure Domain Demonstration

For the worked support assistant, a process crash triggers a bounded restart. A container failure replaces the replica. An image defect rolls back to the prior approved digest. An accelerator failure moves service to a tested spare host. A host failure moves traffic to another host. Storage corruption invokes a restore test against the 15-minute RPO. Network loss sheds traffic to the human queue. Site loss invokes the approved secondary-site procedure. Identity-provider loss stops new requests safely because there is no emergency authentication bypass. Registry loss permits use of a locally cached approved artifact but blocks new deployment. Scheduler or management-plane loss freezes changes and retains the last known-good data plane where safe. A region failure matters only if the chosen topology uses a cloud region. The lab fixture represents evidence such as an RTO, an RPO, or an explicit unknown. It does not perform these failure tests.

Sources:

- <https://kubernetes.io/docs/concepts/security/security-checklist/>
- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Narration: Ownership Narration

Assign operating work before the endpoint becomes important. Name accountable owners for model and license review, artifact integrity, host and accelerator lifecycle, runtime, identity and access, secrets, network policy, data handling, evaluation, capacity, cost, telemetry, vulnerability response, abuse handling, incident command, backup, restore, rollback, and end of life. For each role, record decision authority, evidence produced, business-hours or on-call expectation, escalation path, and a qualified substitute. A team name without authority and evidence is not an operating assignment. In the worked ownership packet, the model steward approves the model and license. The artifact custodian verifies hashes and provenance. Platform operations owns hosts, accelerators, runtime, capacity, cost, telemetry, backup, restore, rollback, and end of life. Security owns identity, secrets, network policy, vulnerability response, and abuse handling. Data governance owns classification, retention, deletion evidence, and geographic handling. Evaluation owns quality and safety gates. The incident commander coordinates incidents and declares recovery. Each accepted evaluation assignment records authority, business-hours response, evidence location, escalation to the service owner, and a named substitute where available. Two production gaps remain: there is no qualified substitute for the artifact custodian, and no owner has accepted after-hours incident command. Therefore this packet authorizes only a staffed business-hours evaluation, not a 24-hour production dependency. If qualified coverage disappears, every option becomes ineligible until coverage returns or the workload is reduced to a safely bounded experiment.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>
- <https://csrc.nist.gov/pubs/sp/800/207/final>

## Narration: Reversible Choice Narration

Choose the smallest reversible shape that can safely answer the next question. That question might be whether the exact artifact and runtime work, whether representative quality passes, whether one host meets capacity, or whether a shared service meets reliability. Apply hard constraints before ranking. In this worked case, workstation, containerized single host, edge appliance, and cloud service are rejected because one or more mandatory constraints are unmet or unknown. On-premises service and hybrid are eligible. Their scores are 78 and 73, so on-premises service is selected. If eligible options tie, sort their documented option IDs in ascending lexicographic order. A high score never overrides an unmet boundary, recovery, or owner constraint. Hybrid remains useful evidence, but its routing and consistency responsibilities are not needed to prove the next claim. The decision is a staffed on-premises evaluation, not a production availability claim. The safe return state is the last approved model digest, image digest, configuration, and routing rule, with new model traffic disabled and the human queue enabled. Preserve the prior artifact and configuration until rollback has been tested. Capacity and cost remain UNKNOWN until representative load and financial measurements are collected. Stop if boundary evidence expires, an RTO or RPO exercise fails, qualified ownership disappears, a quality or safety gate fails, an unapproved artifact appears, retention or deletion controls fail, or a severe incident requires containment. Migrate or redesign if host or site loss cannot meet the objective, demand exceeds the tested envelope for two review periods, the 99.5 percent objective is missed, geography changes, or after-hours production coverage becomes required. Review weekly during evaluation and at least every 60 days afterward, or sooner after a material change. To exit, disable routing, preserve required audit evidence, remove retained inputs according to policy, revoke service credentials, archive the decision record, and return work to the human queue.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>
- <https://onnxruntime.ai/docs/execution-providers/>

## Transition: Activity Transition

Now create the deployment-shape decision record. Define one synthetic workload with users, data class, request distribution, context and output sizes, latency and availability objectives, disconnected needs, and recovery objectives. Score workstation, containerized single host, on-premises service, edge appliance, cloud service, and one hybrid option against the same criteria. Draw process, host, site, identity, network, storage, registry, and management-plane failure domains. Assign every operating role and identify every role without a qualified owner. Choose a bounded first shape, explain rejected alternatives, define stop and migration triggers, and describe the return to a known safe state. Your evidence is the dated workload contract, comparable matrix, failure-domain map, ownership packet, and reversible decision record.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Pause: Activity Work Time

## Learner Prompt: Repair Changed Case Prompt

Predict before inspecting the answer. In the baseline, cloud has the highest score but unknown boundary and recovery evidence and a missing owner. On-premises and hybrid are eligible. Which option should the selector return, and why? Now change the valid evidence: the required boundary is cloud-region-verified, cloud matches it, cloud has RTO 60 and RPO 15, cloud has a qualified owner, and hybrid also matches the boundary. Which option should return then? Explain the causal order. Eligibility must be established first, and ranking must happen only among eligible options.

Expected learner action: Predict on-premises-service for baseline and cloud-service for changed evidence, with an eligibility-before-ranking explanation.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Pause: Repair Changed Case Pause

## Narration: Repair Selector Lab Lab Narration

This focused lab repairs one selector defect without replacing the operating packet. It runs locally with Node native modules, built-in modules only, deterministic JSON, no dependencies, no credentials, and no network. The fixtures are decision evidence, not a running model or production system. They do not establish privacy, availability, or deployment approval.

The starter validates a six-option fixture, calculates each weighted score, ranks all options, and checks eligibility only after choosing a winner. That lets cloud service rank first with score ninety-two even though its boundary and recovery are unknown and its owner is missing. The repair changes only selector dot mjs. Keep validation and score calculation. First filter for mandatory boundary, recovery, and owner evidence. Then rank the eligible options by descending score and ascending ID.

Null recovery is explicit unknown evidence. It is accepted by validation, but it does not satisfy the mandatory recovery check. Validation still rejects negative, non-finite, missing, duplicate, wrongly typed, and unsupported values. The shared validator must remain in use.

Before the repair, predict the baseline result. On premises and hybrid are eligible, but the defective order chooses cloud service. After the repair, predict on premises. For the independent variation, cloud service gains a verified cloud boundary, recovery targets of sixty minutes and fifteen minutes, and a qualified owner. Hybrid also matches the boundary. Predict cloud service for that input.

The causal control flow is simple. Validate the decision. Filter with the shared eligibility predicate. If nothing remains, report no eligible option. Otherwise, sort only the eligible options by score, then by ascending ID. Do not return a canned result, deny every option, inspect the fixture name, or hard-code an ID. Those shortcuts break changed inputs, fallback cases, tie handling, malformed input, or the zero-eligible case.

Failure names provide feedback. A base-selection failure means ranking happened too early. Unknown-boundary or unknown-recovery failure means unknown evidence was counted as satisfied. A tie-policy failure means the ID rule is wrong. A zero-eligible failure means an ineligible option was returned. Root and lab command failures indicate a working-directory problem.

Run the recorded baseline, repair, test, changed-input, and restore actions shown on screen. Use the repository root unless the display says to work in the lab directory. The displayed results are supplied execution records, not live execution. Passing all twenty-seven checks proves this selector behavior only. It does not approve deployment. The wider submission still needs the workload contract, six-shape matrix, failure-domain map, ownership gaps, reversible decision, rejected alternatives, triggers, and safe-state plan.

Sources:

- <https://docs.docker.com/engine/containers/resource_constraints/>

## Feedback: Repair Changed Case Feedback

The baseline answer is on-premises-service. It is eligible at score 78, while hybrid is eligible at 73. Cloud is not eligible even though its score is 92, because its boundary and recovery are unknown and its owner is missing. The changed answer is cloud-service. The changed boundary evidence, recovery evidence, and ownership make cloud eligible, and its score of 92 exceeds hybrid at 73. This is not a hardcoded preference for cloud. It is the result of changed constraint evidence followed by ranking. A complete repair preserves the shared validator and score calculation, filters first with the mandatory-constraint predicate, stops with `no eligible option` when the filtered set is empty, and sorts eligible options by descending score and ascending option ID. Unknown evidence is valid incomplete input but never satisfies a mandatory constraint. Deny-all is not a valid repair because it rejects the changed valid case and does not select a safe eligible option. Returning a canned ID is not a valid repair because it fails changed inputs and tie tests. Passing the lab proves only the selector behavior represented by the fixtures. It does not approve a model, provider, runtime, or deployment.

Correct feedback: You applied eligibility before ranking, treated unknown evidence as disqualifying for mandatory constraints, and explained why changed valid evidence selects cloud-service.

Retry feedback: Separate incomplete evidence from satisfied constraints. Then filter eligible options before comparing scores, including the changed boundary, recovery, and owner evidence.

Sources:

- <https://docs.docker.com/engine/containers/resource_constraints/>

## Assessment Handoff: Assessment Handoff

When you are ready, begin the knowledge check. Question one asks what must be defined before hardware or cloud services. Question two asks what a container establishes by itself. Question three asks why replicas on one host do not prove host availability. Question four tests whether local deployment automatically proves privacy, cost, security, or recovery. Question five asks what makes ownership operationally useful. Question six asks for the safest first deployment shape. Review the workload demonstration, failure-domain checkpoint, ownership gaps, selector arithmetic, and changed-input explanation before submitting. The knowledge check begins only when you choose Begin knowledge check.

## Closing: Class Closing

Keep the rule: define the work, the failure behavior, and the owner before choosing the platform. Apply hard constraints before ranking attractive options. Select the smallest reversible shape that proves the next claim. Keep the safe return state explicit, test the failure domain you claim, and never describe privacy, reliability, cost, or recovery beyond the evidence you have collected.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>
