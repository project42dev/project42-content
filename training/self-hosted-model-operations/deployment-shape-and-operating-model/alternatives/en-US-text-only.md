# Choose a Deployment Shape You Can Actually Operate: text-only class

This route contains the complete teaching content, learner actions, feedback,
and assessment handoff without requiring audio, video, or animation.

## Welcome: Welcome And Outcomes

Welcome. In this class, you will choose where a self-hosted model should run by starting with the work and the consequences of failure, not with a favorite platform. We will define a service contract, compare workstation, container, on-premises, edge, cloud, and hybrid shapes, map real failure domains, assign operating ownership, and select a reversible first step. Self-hosted does not automatically mean private, inexpensive, reliable, or under control. Those are claims that the complete system must prove.

## Narration: Workload Contract Narration

Begin with a workload contract. Name the users, their tasks, the model class, input and output types, sensitivity, concurrency, arrival pattern, context size, output length, latency objective, availability target, geographic boundary, disconnected requirement, retention rule, and recovery objective. Separate an individual experiment from a shared internal service and from a production dependency. Those labels change who can be affected and how quickly someone must respond. Then describe failure behavior. What should happen when the endpoint is slow, unavailable, overloaded, wrong, unsafe, or unable to accept a request? Can work wait, move to a reviewed fallback, or stop? Which data may be retained for recovery, and which data must never enter the service? A platform is suitable only when the team can operate both the normal path and the failure path. Starting with hardware reverses this logic. It encourages the team to reshape requirements around a purchase before it has defined what success, safety, or recovery mean.

Visual alternative: The deployment decision begins with users, tasks, data, demand, latency, availability, failure behavior, and recovery rather than a hardware or cloud product.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Demonstration: Workload Demonstration

Consider a synthetic documentation assistant used by six engineers. It receives approved public manuals, produces draft explanations, has short weekday bursts, and may stop safely when evidence is missing. It must not process customer records or secrets. A five-minute interruption delays work but does not cause an external action. The first claim to prove is that one exact model and runtime can meet the quality target on representative manuals within the available memory. This contract does not yet justify a multi-site cluster. Now change one fact: the endpoint becomes a production dependency for hundreds of users with a strict recovery objective. The model may be identical, but ownership, capacity, availability, telemetry, and recovery evidence must expand. The deployment shape follows the service contract.

Visual alternative: The experiment can stop safely and has six users; the production service affects hundreds and requires stronger availability, capacity, telemetry, ownership, and recovery.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Narration: Shape Comparison Narration

Compare each shape against the same contract. A workstation can be excellent for individual learning, offline experiments, and low-concurrency development. It may also sleep, share a user's privileges, change without review, throttle under heat, and disappear when the user leaves. A container gives the process a reproducible package and an explicit runtime boundary. It does not automatically add authentication, strong tenant isolation, resource limits, backups, or high availability. On-premises infrastructure can support local data or connectivity requirements and direct hardware control. In exchange, the operator owns capacity, patching, power, cooling, spares, physical access, and incident response. Edge equipment can reduce distance and survive intermittent upstream connectivity, but power, memory, update bandwidth, physical security, and repair are constrained. Cloud compute can speed provisioning and offer managed building blocks, yet region, identity, networking, encryption, quota, cost, observability, backup, and exit still require proof. Hybrid designs add routing, consistency, and failure choices. None of the labels establishes privacy, price, performance, or resilience. Write those as measurable requirements, then collect evidence.

Visual alternative: Every shape offers different control, capacity, connectivity, physical, operating, cost, and recovery tradeoffs; no row is automatically best.

Sources:

- <https://docs.docker.com/engine/containers/resource_constraints/>
- <https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/>
- <https://onnxruntime.ai/docs/execution-providers/>

## Learner Prompt: Shape Bias Prompt

Choose the shape that first felt obvious for your workload. Write one benefit you expected and one property you may have assumed without evidence, such as privacy, lower cost, availability, or easier recovery. Then name the measurement or test that would support that property.

Learner action: Identify one initial platform bias, one unproven property, and a concrete measurement or test.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Pause: Shape Bias Work Time

## Narration: Failure Domain Narration

Next, map failure domains instead of counting replicas. List the process, container, accelerator, host, storage, network, identity provider, scheduler, site, region, artifact registry, and management plane. Decide which failure should restart one process, replace one replica, move work to another node, fail over, shed load, or stop safely. Two replicas on one host share the host, device, power, and often storage and network. They may improve process recovery without surviving host loss. Two sites can still share identity, registry, routing, or management dependencies. An orchestrator can restart a failed process, but it cannot repair an incompatible artifact, restore a lost secret, or prove that queued work completed. Test the failure domain you claim. Confirm that exact artifacts, configuration, state, secrets, queues, routing, and telemetry remain recoverable. Availability language should describe observed survival and recovery, not topology alone.

Visual alternative: Replicas protect against some process failures but share a host and several external dependencies, so they do not prove host or site availability.

Sources:

- <https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/>
- <https://docs.docker.com/engine/containers/resource_constraints/>

## Checkpoint: Failure Domain Checkpoint

Checkpoint. A team runs three model-server containers on one physical workstation and calls the endpoint highly available. Name two failures that can remove all three replicas, and state what evidence would be required before making a host-availability claim.

Learner action: Name shared failures such as host power, device, storage, network, or operating system loss and require an observed cross-host recovery test.

Sources:

- <https://docs.docker.com/engine/containers/resource_constraints/>

## Pause: Failure Domain Response Time

## Feedback: Failure Domain Feedback

A strong answer names shared host power, operating system, accelerator, local storage, network, or physical damage. All three containers can disappear together. Process replication is still useful, but the claim must stay inside that boundary. Host availability requires independent capacity and an observed test that removes the host, restores routing, reconstructs the exact approved service, preserves or reconciles state, and meets the stated recovery objective. If your answer only added more containers, revise it by moving the recovery target outside the failed host.

If correct: You kept the availability claim inside the tested boundary and required observed cross-host recovery evidence.

If retrying: Identify a dependency shared by every container, then place recovery capacity outside that dependency.

Sources:

- <https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/>

## Narration: Ownership Narration

A deployable design also needs named owners. Assign model and license review, artifact integrity, host and accelerator lifecycle, runtime, identity and access, secrets, network policy, data handling, evaluation, capacity, cost, telemetry, vulnerability response, abuse handling, incident command, backup, restore, rollback, and end of life. For each responsibility, record decision authority, evidence produced, on-call expectation, escalation path, and a qualified substitute. A team name is not enough if nobody can approve a rollback or access the recovery system during an incident. Managed services shift some tasks to a provider, but the organization still owns configuration, access, workload evidence, and the decision to accept residual risk. A technically successful endpoint with no update owner, no cost owner, or no restore operator is an unmanaged liability. Find those gaps before deployment, when changing the design is still inexpensive.

Visual alternative: Each model-service responsibility has a named accountable owner who can act, produce evidence, respond or escalate, and be replaced by a qualified substitute.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Narration: Reversible Choice Narration

Choose the smallest reversible shape that can safely prove the next claim. If the question is whether the immutable artifact runs and meets representative quality on available hardware, an isolated workstation or bounded container may be enough. If the question is whether a shared endpoint meets capacity and access requirements, use a controlled service environment with real identity, load, and telemetry. Do not build multi-site orchestration before one endpoint has a verified contract. Record the chosen and rejected shapes, assumptions, evidence, unresolved risks, capacity and cost envelope, required controls, stop conditions, migration path, and review date. Define how to return to a known safe state. Trigger a new decision when users, workload, data class, geography, model, runtime, demand, objectives, incident history, or ownership changes. Reversibility is not reluctance. It is a design property that lets evidence change the decision without trapping people, data, or operations.

Visual alternative: The first deployment is selected to prove one claim safely and includes evidence requirements, stop conditions, a known-safe return, migration path, and review date.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>
- <https://onnxruntime.ai/docs/execution-providers/>

## Transition: Activity Transition

Now create the deployment-shape decision record. Define one synthetic workload and score workstation, containerized host, on-premises service, edge, cloud, and one hybrid option against identical criteria. Draw process, host, site, identity, network, storage, registry, and management failure domains. Assign every operating role and flag gaps. Choose a bounded first shape, explain rejected alternatives, define stop and migration triggers, and describe the return to a known safe state. Your evidence is the dated workload contract, comparison matrix, failure map, ownership matrix, and reversible decision.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Pause: Activity Work Time

## Assessment Handoff: Assessment Handoff

When you are ready, begin the knowledge check. You will define the pre-platform service contract, distinguish what a container does and does not provide, reason about shared failure domains, evaluate locality claims, assign actionable ownership, and choose a reversible first shape. Review the transcript or decision record before submitting. The assessment begins only when you select Begin knowledge check.

## Closing: Class Closing

Keep this rule: define the work, failure, and owner before choosing the platform. Select the smallest reversible shape that proves the next claim, and never describe privacy, reliability, cost, or recovery beyond the evidence you have tested.
