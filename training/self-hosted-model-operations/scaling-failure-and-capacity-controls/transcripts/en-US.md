# Scale the Bottleneck without Scaling the Failure

Package: `scaling-failure-and-capacity-controls-class` 1.0.0

> This is the canonical text equivalent of an AI-assisted virtual-instructor
> class. It remains usable without synthesized audio, video, animation, or a
> player runtime.

## Welcome: Welcome And Outcomes

Welcome. Scaling is not the act of adding replicas until a graph looks better. It is a controlled response to measured demand and failure risk. In this class, you will identify the real bottleneck, bound admission and retries, place and warm useful capacity, test blast radius, and approve only a scale policy whose quality, cost, recovery, and rollback evidence holds under representative traffic.

## Narration: Scale Bottleneck Narration

Scale the measured bottleneck, not the architecture diagram. Use latency distributions, queue time, concurrency, rejection, accelerator and host utilization, memory headroom, bandwidth, storage delay, cache behavior, request sizes, and attributable cost. Then compare options. A larger device or host can increase vertical capacity but may enlarge one failure domain. More replicas can improve parallel work and replacement but also multiply startup, memory, and shared-dependency load. Model or tensor parallelism can fit or accelerate a larger build while adding communication and placement constraints. Batching can improve throughput while increasing queue and tail latency. A bounded queue can absorb a short burst but cannot create compute. Caching can avoid repeated work only when keys, freshness, authorization, and data isolation are correct. Workload routing can match requests to specialized evaluated capacity. A smaller evaluated model can reduce latency and cost but changes quality and safety evidence. Scaling compute cannot repair an unbounded queue, unavailable identity service, slow artifact store, bad prompt template, incompatible runtime, or quality regression.

Sources:

- <https://mlcommons.org/benchmarks/inference-datacenter/>
- <https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/>
- <https://docs.docker.com/engine/containers/resource_constraints/>

## Demonstration: Scaling Choice Demonstration

Consider a synthetic service with acceptable processing time at one request, but rising queue delay during a ten-request burst. Accelerator utilization is high, memory has safe headroom, artifact storage is healthy, and quality is unchanged. The first experiment compares two warmed replicas against one larger-batch replica under the same requests, limits, hardware class, and load. Two replicas reduce queue delay and preserve time to first output, but both are placed on one host and share one gateway. That does not satisfy a host-failure availability claim. The batched option improves throughput but violates the interactive latency objective. The decision selects two replicas spread across verified failure domains, retains bounded batching, and records the shared gateway as a remaining dependency. It also preserves the baseline policy and cost ceiling. The answer came from queue, placement, latency, quality, and cost evidence, not from replica count alone.

Sources:

- <https://mlcommons.org/benchmarks/inference-datacenter/>
- <https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/>

## Narration: Admission Backpressure Narration

Control admission before saturation. Set body, context, output, concurrency, rate, queue, deadline, and compute limits by workload and priority. Reject early with a stable error and bounded retry guidance when work cannot finish inside its deadline or budget. Propagate cancellation and deadlines through gateway, queue, inference server, runtime, and dependent tools so abandoned work does not keep consuming capacity. Backpressure tells upstream callers that downstream capacity is constrained; an unbounded queue only hides overload until latency and memory fail. Retry only classified transient failures, use a bounded attempt count and jitter, honor a retry budget, and confirm the operation is safe to repeat. Circuit breakers stop repeated calls to a failing dependency. Load shedding protects critical work by rejecting lower-priority demand before all work fails. Define safe degraded modes in advance: smaller limits, lower-priority rejection, a read-only path, or a separately evaluated fallback. A degraded mode is not permission to bypass identity, authorization, privacy, safety, or evidence controls.

Sources:

- <https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/>
- <https://docs.docker.com/engine/containers/resource_constraints/>

## Checkpoint: Retry Checkpoint

Checkpoint. One dependency begins timing out. Each client retries immediately without a limit, the gateway retries twice, and the queue accepts every attempt. Explain how a small partial failure becomes a cascade and name the controls that stop it.

Expected learner action: Identify multiplicative retry and queue amplification, then require end-to-end deadlines and cancellation, classified bounded retries with jitter and a retry budget, circuit breaking, bounded queues, load shedding, and safe recovery.

Sources:

- <https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/>
- <https://docs.docker.com/engine/containers/resource_constraints/>

## Pause: Retry Response Time

## Feedback: Retry Feedback

Every original request creates multiple client attempts, and each gateway attempt multiplies them again. The unbounded queue preserves work after its useful deadline, so capacity is consumed by requests that should already have failed. Stop the cascade with one end-to-end deadline, propagated cancellation, one owned retry layer, classified transient failures, a small attempt and retry budget with jitter, a circuit breaker, bounded admission and queueing, and prioritized shedding. Recover the dependency, drain or discard expired work safely, and verify normal load before closing the event. If your answer only added replicas, the amplification would consume those replicas too.

Correct feedback: You bounded retries, deadlines, cancellation, queueing, and circuits before adding capacity.

Retry feedback: Adding capacity does not correct multiplicative retries and expired work in an unbounded queue.

Sources:

- <https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/>
- <https://docs.docker.com/engine/containers/resource_constraints/>

## Narration: Placement Warmup Narration

Place capacity against real device, memory, topology, storage, network, driver, and runtime requirements. Kubernetes resource requests influence scheduling, limits bound some resource use, and extended devices have different allocation behavior from fractional CPU. Docker likewise warns that containers have no resource constraints by default. Verify actual scheduler, device-plugin, topology, and runtime behavior in the target environment. A scheduled process is not useful capacity. Account for artifact download, integrity and policy verification, model load, compilation, cache warm-up, adapter initialization, and exact-model readiness before routing traffic. During removal or update, stop new admission to the replica, drain bounded in-flight work until a declared deadline, cancel or reconcile remaining operations, preserve telemetry, revoke the route, and only then reclaim resources. Test cold start, replacement, host pressure, and simultaneous rollout so autoscaling does not count replicas that cannot become ready before the demand passes.

Sources:

- <https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/>
- <https://docs.docker.com/engine/containers/resource_constraints/>

## Narration: Failure Isolation Narration

Inject failures and measure the actual blast radius. Include process crash, out-of-memory termination, device loss, host loss, storage delay, network partition, identity failure, telemetry failure, registry outage, queue pressure, malformed work, and a bad model release. Observe affected requests, replicas, nodes, sites, shared services, and management functions. Confirm liveness and readiness remove unsafe capacity, queues stay bounded, retries do not amplify demand, one workload cannot starve another, exact model identity remains visible, and recovery rejects stale or unverified artifacts. Multiple replicas improve availability only when placement and shared dependencies support the claim. Two replicas on one host do not survive host loss. Replicas across hosts still share a gateway, identity provider, artifact store, network, power domain, or operator error unless those dependencies are addressed. Record the expected and observed blast radius, containment, data and state reconciliation, recovery time, evidence gaps, and owner.

Sources:

- <https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/>
- <https://docs.docker.com/engine/containers/resource_constraints/>

## Narration: Autoscaling Change Narration

Choose scale signals that lead useful demand without chasing noise. Queue delay, admitted concurrency, work units, saturation, or a tested combination may react earlier than CPU or accelerator utilization alone. Kubernetes Horizontal Pod Autoscaling periodically adjusts desired replicas from observed metrics, subject to its algorithm and configured behavior; model-serving warm-up means your useful-capacity policy must account for the delay between a scale decision and readiness. Set a minimum safe floor, maximum cost and quota, stabilization windows, scale-up rate, warm-up allowance, scale-down drain, telemetry-loss behavior, and alerts. Compare baseline and candidate policies under steady, burst, ramp, skewed, and failure traffic. Approve only when service objectives, quality, isolation, cost, startup, recovery, and rollback gates pass. Preserve the prior policy, exact configuration, and safe capacity floor. If telemetry is missing or the candidate thrashes, fail to the declared safe state rather than treating absent measurements as zero demand.

Sources:

- <https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/>
- <https://mlcommons.org/benchmarks/inference-datacenter/>

## Learner Prompt: Activity Transition

Now design and challenge the scaling policy. Use synthetic load evidence to identify one bottleneck and compare vertical, replica, sharded, batched, queued, cached, routed, and smaller-model options. Define per-workload admission, queue, deadline, cancellation, retry, circuit, shedding, and degraded behavior. Write placement, artifact verification, warm-up, readiness, drain, replacement, minimum capacity, maximum cost, and stabilization rules. Create ten process, device, host, dependency, pressure, telemetry, and bad-release failures with expected blast radius and recovery. Compare baseline and candidate under steady, burst, ramp, skewed, and failure traffic, then issue a reversible decision.

Expected learner action: Complete the bottleneck-to-pattern comparison, bounded admission and backpressure policy, placement and lifecycle rules, ten failure cases, representative traffic comparison, and evidence-linked reversible scale decision.

Sources:

- <https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/>
- <https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/>
- <https://docs.docker.com/engine/containers/resource_constraints/>
- <https://mlcommons.org/benchmarks/inference-datacenter/>

## Pause: Activity Work Time

## Assessment Handoff: Assessment Handoff

Begin the check when you can select a pattern from a measured bottleneck, explain backpressure, define useful replica readiness, stop retry amplification, measure failure isolation, and preserve a reversible autoscaling policy. The check starts only when you choose Begin knowledge check.

## Closing: Class Closing

Remember: scale the measured constraint, bound demand before saturation, count only verified ready capacity, test shared failures, and preserve the policy and floor that let you reverse the change.
