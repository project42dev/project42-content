# Scale the Bottleneck without Scaling the Failure: text-only class

This route contains the complete teaching content, learner actions, feedback,
and assessment handoff without requiring audio, video, or animation.

## Welcome: Welcome And Outcomes

Welcome. Scaling is not adding replicas until a graph looks better. It is a controlled response to measured demand and failure risk. In this class, you will identify a bottleneck, compare eight scaling patterns, bound admission and retries, place and warm useful capacity, test failure blast radius, repair a capacity policy, and approve only a reversible decision whose service, quality, cost, recovery, and rollback evidence holds. The examples are fictional teaching data. The lab is deterministic local code. Nothing in this lesson starts a service, invokes a provider, downloads a model, or proves a production control.

Visual alternative: The lesson moves from measured demand to bounded admission, verified capacity, failure testing, scale gates, and rollback.

## Narration: Scale Bottleneck Narration

Begin with measurements, not a preferred topology. Inspect latency distributions, queue time, utilization, memory headroom, bandwidth, cache behavior, request sizes, concurrency, rejection, quality, and cost. MLPerf Inference Datacenter is useful here because comparisons need defined workloads, scenarios, and measured systems. It supplies no measurement or score for this fictional exercise.

Here is the worked bottleneck. Four ready replicas each complete two work units per interval. Four times two equals eight immediately serviceable units. Burst demand is thirteen. Device utilization is ninety-one percent, memory headroom is thirty-four percent, artifact-store latency is eighteen milliseconds, and cache hit rate is sixty-two percent. Queue delay rises from twenty milliseconds to four hundred ten milliseconds. These observations identify serving-compute throughput as the measured burst bottleneck. Demand thirteen minus ready capacity eight leaves five units needing queueing or rejection. A queue limited to two absorbs two. Therefore, five minus two equals three rejected units.

Now compare eight alternatives. Vertical scaling may increase throughput, but raises unit cost and host blast radius. More replicas add capacity only after readiness, and improve host availability only when spread across failure domains. Model or tensor parallelism may fit or accelerate a model, but adds communication and can widen the serving-unit failure domain. Batching may improve utilization, but adds waiting time and needs evaluated limits. A bounded queue absorbs a short burst, but creates no throughput and must fit the deadline. Caching may remove repeated work, but needs correct identity, isolation, freshness, and invalidation. Workload routing can protect interactive traffic, but adds a routing dependency and reserved-capacity tradeoff. A smaller evaluated model may reduce latency and cost, but requires separate quality and safety evidence.

The provisional design adds two warmed replicas, raises ready capacity from eight to twelve work units, places the new replicas in a second host domain, retains a queue limit of two, and rejects excess work before completion becomes impossible. We do not choose sharding because the model fits with thirty-four percent synthetic memory headroom. We do not claim caching solves this burst because thirty-eight percent of requests are misses. We retain only the previously evaluated batch bound. Every choice remains provisional until service, quality, placement, startup, failure, cost, recovery, and rollback gates pass.

Visual alternative: Four ready replicas provide eight units. Demand of thirteen leaves five units, a queue holds two, and three are rejected. Each alternative has a stated tradeoff.

Sources:

- <https://mlcommons.org/benchmarks/inference-datacenter/>
- <https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/>
- <https://docs.docker.com/engine/containers/resource_constraints/>

## Demonstration: Scaling Choice Demonstration

The older comparison adds an important caution. Suppose one request has acceptable processing time, but queue delay rises during a ten-request burst. Accelerator utilization is high, memory has safe headroom, artifact storage is healthy, and quality is unchanged. Compare two warmed replicas with one larger-batch replica under the same requests, limits, hardware class, and load. Two replicas reduce queue delay and preserve time to first output, but if both sit on one host, they do not support a host-failure availability claim. The batched option improves throughput but violates the interactive latency objective. Select two replicas only when they are spread across verified failure domains. Retain bounded batching, record the shared gateway as a remaining dependency, preserve the baseline policy and cost ceiling, and attribute the decision to queue, placement, latency, quality, and cost evidence. Replica count alone is not evidence of availability.

Visual alternative: Queue delay, first-output latency, placement, quality, shared dependency, and cost jointly determine the choice.

Sources:

- <https://mlcommons.org/benchmarks/inference-datacenter/>
- <https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/>

## Narration: Admission Backpressure Narration

Capacity does not replace admission control. Set body, context, output, concurrency, rate, queue, deadline, and resource limits by workload and priority. For this fictional policy, interactive work permits a one megabyte body, eight thousand one hundred ninety-two context tokens, one thousand twenty-four output tokens, sixteen concurrent requests per tenant, twenty requests per second, a queue of two work units, and a one thousand millisecond deadline. Batch work permits a four megabyte body, sixteen thousand three hundred eighty-four context tokens, two thousand forty-eight output tokens, four concurrent jobs per tenant, two jobs per second, a queue of eight work units, and a thirty thousand millisecond deadline. Administrative evaluation permits two concurrent jobs and no retry by default. These are teaching limits, not production recommendations.

Reject malformed input before queueing. Reject work that cannot finish inside its deadline or budget, and provide stable retry guidance. Propagate deadlines and cancellation through the gateway, queue, server, runtime, and dependent tools. Cancellation removes queued work and signals active work through each supported layer. If active computation cannot stop, suppress its result and account for residual capacity use.

Retry at most twice with bounded jitter, only for classified transient failures, only when repetition is safe, and only within the original deadline and queue budget. Never retry malformed input, an authorization denial, an exhausted deadline, an unverified model, or a deterministic context-limit failure. Open the artifact-store circuit after three classified failures in a thirty-second exercise window. Allow one probe after a twenty-second cooldown, and close after two successful probes. Shed batch work first when its deadline cannot be met. Reject lower-priority interactive work next with retry guidance. A degraded mode may lower output to two hundred fifty-six tokens or use a separately evaluated fallback. It must not silently change model identity, weaken authorization, or claim equal quality without measurement.

Deny-all is not a repair. It destroys available service and fails the positive changed-input case. Admit-all is also invalid because warming, draining, and failed replicas are not capacity. A valid decision needs ready capacity plus bounded queue coverage, queue delay plus service time within deadline, enough ready failure domains, and cost at or below its ceiling.

Visual alternative: Unsafe or late work is rejected early. Retries, queues, circuits, shedding, and degraded behavior remain bounded and do not bypass security or quality controls.

Sources:

- <https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/>
- <https://docs.docker.com/engine/containers/resource_constraints/>

## Checkpoint: Retry Checkpoint

Checkpoint. One dependency begins timing out. Each client retries immediately without a limit. The gateway retries twice, and the queue accepts every attempt. Explain how a small partial failure becomes a cascade. Name the controls that stop it. Include malformed-input rejection, deadlines, cancellation, retry ownership, retry budget, jitter, circuit breaking, bounded queues, shedding, and recovery.

Learner action: Identify multiplicative retry and queue amplification, then specify end-to-end deadlines, cancellation, bounded classified retries, a retry budget, jitter, a circuit, bounded queues, shedding, and safe recovery.

Sources:

- <https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/>
- <https://docs.docker.com/engine/containers/resource_constraints/>

## Pause: Retry Response Time

## Feedback: Retry Feedback

Every original request creates multiple client attempts, and each gateway attempt multiplies them again. The unbounded queue preserves work after its useful deadline, so capacity is consumed by work that should already have failed. Stop the cascade with one end-to-end deadline, propagated cancellation, one owned retry layer, classified transient failures, a small attempt limit, a retry budget, jitter, a circuit breaker, bounded admission and queueing, and prioritized shedding. Recover the dependency, drain or discard expired work safely, and verify normal load before closing the event. If your answer only added replicas, the amplification would consume those replicas too. A correct answer names both the causal amplification and the controls. A retry answer should be marked correct when it bounds safe transient retries and preserves the original deadline. Otherwise, mark retry and revisit the control chain.

If correct: You bounded retries, deadlines, cancellation, queueing, and circuits before adding capacity.

If retrying: Adding capacity does not correct multiplicative retries and expired work in an unbounded queue.

Sources:

- <https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/>
- <https://docs.docker.com/engine/containers/resource_constraints/>

## Narration: Placement Warmup Narration

Schedule against actual device, memory, topology, storage, network, driver, and runtime requirements. Kubernetes resource requests influence placement and limits bound some resource use. Extended devices such as accelerators cannot be overcommitted in the same way as fractional CPU. Docker containers have no resource constraints by default, so explicit limits and host capacity matter. Documentation describes platform behavior, but does not prove that a live deployment enforces a proposed policy.

A replacement passes through artifact download, digest verification, model load, compilation where required, cache warm-up, and an exact model-identity readiness probe. It contributes zero admission capacity while warming. A listening port or scheduled workload is insufficient evidence of readiness. Require the intended accelerator, sufficient device and host memory, compatible driver and runtime, artifact reachability, and tested network capacity. Spread ready replicas across at least two host domains before making a two-domain availability claim. Two replicas on one host remain one host-failure domain.

For removal, mark a replica draining before route removal, stop new work, allow bounded in-flight work until the drain deadline, preserve telemetry, revoke the route, and reclaim resources. Draining and failed replicas contribute zero capacity. Start a verified replacement, but do not count it until ready. Maintain at least four ready slots across required domains. Use queue delay and admitted work units as leading signals, with saturation as corroborating evidence. Keep a minimum of four ready slots, cap the fleet at twelve slots, and cap cost at twenty-four fictional cost units per hour. Allow two intervals for warm-up, require three stable intervals before scale-down, drain before removal, and retain the prior policy and floor for rollback.

Visual alternative: Only verified, warmed, ready, non-draining capacity counts. Warming, draining, and failed capacity count as zero.

Sources:

- <https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/>
- <https://docs.docker.com/engine/containers/resource_constraints/>
- <https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/>

## Demonstration: Lab Demonstration

Now we will use the focused simulator. It has one defect. Admission uses nominal host slots instead of slots on ready, non-draining hosts. The status values are mutually exclusive, so warming, draining, and failed hosts contribute zero. The lab is local deterministic code. It does not start containers, schedule workloads, allocate accelerators, download models, invoke provider services, measure live inference, or prove production security.

From the repository root, the starter baseline prints a nominal capacity of twelve but a ready capacity of four. Demand is nine and the queue limit is two. The starter says admit and approve, with no causes, and exits zero. That is wrong because four plus two equals six, which does not cover demand nine. The starter tests print one failed baseline-capacity check and seven passed checks. The test command exits one.

Repair only the admission-capacity calculation in the learner file. Do not edit the schema, tests, fixtures, or reference. After repair, the baseline still reports ready capacity four and nominal capacity twelve, but now says reject and reject, with capacity as the cause, and exits two. The repaired tests print eight passed and zero failed, with exit zero. These are supplied execution results, not a live run by this lesson.

The repair must not deny every request. It must preserve deadline, failure-domain, and cost gates. A deny-all policy would appear safe for the baseline but would fail the positive case and destroy available service.

Visual alternative: The simulator incorrectly counts nominal capacity. Repairing the ready non-draining capacity calculation changes the baseline rejection and makes eight tests pass.

## Narration: Failure Isolation Narration

Failure testing asks what becomes unsafe, how far the effect travels, whether retries amplify demand, and whether recovery preserves identity and budgets. Test ten cases. First, a process crash removes one replica, with retries only for safe in-flight work. Second, device loss removes every replica using that device. Third, host loss removes all replicas in that host domain. Fourth, artifact-store delay blocks warming replacements without making them ready. Fifth, a network partition removes unreachable routes and invokes the dependency circuit. Sixth, identity failure rejects protected requests without bypassing authorization. Seventh, telemetry failure raises an alarm and leaves health evidence unknown rather than inventing capacity. Eighth, queue pressure reaches its bound, sheds batch first, and rejects excess demand. Ninth, malformed work is rejected before queueing and is not retried. Tenth, a bad model release fails identity or measured quality gates, remains unrouted, and triggers rollback to the verified prior release.

For every case, record blast radius, unsafe capacity removal, retry amplification, queue behavior, workload starvation, exact model identity, state reconciliation, recovery time, evidence gaps, and residual shared dependencies. Multiple replicas help only when placement and dependencies support the claim. A fixture pass proves only that a local function handles supplied evidence. Real integration would need observed scheduler, device, runtime, artifact, readiness, cancellation, routing, telemetry, quality, failure-injection, and billing evidence.

Visual alternative: Each case records what is removed, how load is contained, how identity is preserved, and how recovery is evidenced.

Sources:

- <https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/>
- <https://docs.docker.com/engine/containers/resource_constraints/>

## Learner Prompt: Changed Input Prompt

Prediction task. Before running the changed positive fixture, decide whether demand nine should be admitted. Two ready hosts each provide four slots. The queue limit is two. The queue delay is forty milliseconds, service time is three hundred milliseconds, and the deadline is one thousand milliseconds. There are two ready domains. Cost is twenty, and the ceiling is twenty-four. List every gate and predict the admission and decision. Also state what a rejection would suggest about the repair.

Learner action: Calculate ready capacity, queue coverage, deadline, failure domains, and cost, then predict ADMIT and APPROVE before execution.

## Pause: Changed Input Pause

## Feedback: Changed Input Feedback

Now compare your prediction with the supplied result. Four plus four equals eight ready slots. Eight plus the queue limit of two equals ten, which covers demand nine. Queue delay forty plus service time three hundred equals three hundred forty milliseconds, below the one thousand millisecond deadline. Two ready domains meet the minimum of two. Cost twenty is below the ceiling of twenty-four. Therefore the repaired decision is admit and approve, with no causes. The supplied output names the changed fixture, reports ready capacity eight and nominal capacity eight, demand nine, queue limit two, admission admit, decision approve, and causes none, then exits zero.

If your repair rejects this valid case, it may implement deny-all, retain stale capacity logic, or damage another gate. If it approves the original baseline, it still counts ineligible slots. The causal boundary is readiness: nominal capacity is not useful capacity. The repaired policy must accept the valid changed case while rejecting the baseline case.

If correct: You checked all four gates and predicted approval from ready capacity, queue coverage, deadline, domains, and cost.

If retrying: Recalculate with ready non-draining slots, then check queue, deadline, domains, and cost separately. Do not use nominal capacity.

## Narration: Gate Autoscaling And Change Narration

Autoscaling is a controlled change, not evidence of success by itself. Predeclare service, quality, cost, recovery, and rollback thresholds. For this fictional policy, interactive p95 latency must be at most seven hundred milliseconds, queue delay at most two hundred milliseconds, and deadline one thousand milliseconds. Batch p95 latency must be at most five thousand milliseconds, queue delay at most two thousand milliseconds, and deadline thirty thousand milliseconds. Cost must be at most twenty-four units per hour. Recovery must restore the twelve-slot candidate within two intervals. Minimum safe ready capacity is four slots.

Quality gates are measured separately for the baseline and candidate. Release identity is r17 and prompt contract identity is p4. Interactive success must be at least ninety-five correct out of one hundred. Batch success must be at least one hundred eighty-eight out of two hundred, or ninety-four percent. Safety refusal correctness must be at least forty-nine out of fifty, or ninety-eight percent. Route-to-contract correctness must be one hundred out of one hundred. A changed release, prompt contract, denominator, or scoring rule makes comparison unknown until reevaluation.

The synthetic comparisons show why gates matter. At steady demand six, the baseline serves six with zero rejection, four hundred twenty millisecond p95 latency, cost twelve, and quality ninety-seven out of one hundred. The candidate serves six with zero rejection, three hundred ninety milliseconds, cost twenty, and quality ninety-seven. The candidate costs eight more units, calculated as twenty minus twelve, but remains below twenty-four.

At burst demand thirteen, the baseline has eight ready slots and a queue of two. It serves ten and rejects three, because thirteen minus eight minus two equals three. Its queue delay is four hundred ten milliseconds and p95 latency is one thousand one hundred twenty, so it fails. The candidate has twelve ready slots, queues one, serves thirteen, rejects zero, records one hundred twenty milliseconds of queue delay and six hundred forty milliseconds p95 latency, cost twenty, and quality ninety-six out of one hundred. It passes.

For ramp demands six, eight, and ten, the baseline reaches two hundred sixty milliseconds of queue delay and seven hundred eighty milliseconds p95 latency at the third interval, breaching both limits. The candidate warms before that interval, counts capacity only after readiness, and records ready capacities eight, eight, and twelve. Its queue delays are zero, seventy, and sixty milliseconds. Its p95 latencies are four hundred, five hundred twenty, and five hundred ten milliseconds. It passes.

For skewed demand, interactive seven plus batch six, the baseline protects neither priority and rejects one interactive request and two batch requests. The candidate serves all seven interactive and five batch requests, sheds one batch request, records interactive queue delay eighty and p95 latency five hundred, batch queue delay nine hundred and p95 latency three thousand two hundred, interactive quality ninety-six out of one hundred, batch quality one hundred eighty-nine out of two hundred, and route correctness one hundred out of one hundred. Batch quality is ninety-four point five percent. It passes because only lower-priority batch work is shed.

After one host-domain loss at demand six, the baseline retains zero ready slots and rejects six. The candidate retains four slots in the second domain, queues two, serves all six, rejects zero, records one hundred eighty milliseconds queue delay and six hundred eighty milliseconds p95 latency, and restores twelve ready slots after two intervals. Its safety result is forty-nine out of fifty and route correctness is one hundred out of one hundred. It meets the gates exactly.

The decision is only a staged fictional-policy recommendation, not live deployment approval. Roll back if quality misses its denominator threshold, identity changes without reevaluation, cost exceeds twenty-four, queue delay breaches for two intervals, readiness becomes unknown, routing is below one hundred percent, or recovery exceeds two intervals. Preserve the prior policy, route configuration, verified artifact identity, and capacity floor.

Visual alternative: The candidate is judged by service, quality, cost, isolation, startup, recovery, and rollback gates across five traffic patterns.

Sources:

- <https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/>
- <https://mlcommons.org/benchmarks/inference-datacenter/>

## Learner Prompt: Activity Transition

Now design and challenge the scaling policy. Use the supplied synthetic load result to identify one measured bottleneck and compare vertical, replica, sharded, batched, queued, cached, routed, and smaller-model options. Record quality, latency, failure, cost, and complexity effects. Define interactive, batch, and administrative admission, queue, deadline, retry, cancellation, circuit, shedding, and degraded-mode behavior. Explain why deny-all and admit-all are invalid. Write placement, artifact warm-up, readiness, draining, replacement, minimum capacity, maximum cost, warm-up, and scale-down stabilization rules.

Create or review all ten failure cases with expected blast radius and recovery. Calculate baseline and candidate results under steady, burst, ramp, skewed, and failure traffic. Apply the service, quality, cost, recovery, and rollback thresholds before issuing a reversible decision. Record your prediction before execution. Run the baseline and immutable tests. Repair only the policy file. Do not modify tests, fixtures, schema validation, or the reference. Run the changed input after repair and explain causally why it approves. Use the worked artifact only after recording your prediction. Finish by answering this reflection: which autoscaling signal would arrive too late for your workload, and what leading signal should accompany it?

Learner action: Complete the comparison, policy, lifecycle, failure matrix, traffic calculations, prediction, repair, changed-input explanation, and reflection.

Sources:

- <https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/>
- <https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/>
- <https://docs.docker.com/engine/containers/resource_constraints/>
- <https://mlcommons.org/benchmarks/inference-datacenter/>

## Pause: Activity Work Time

## Assessment Handoff: Assessment Handoff

Begin the knowledge check when you can select a pattern from a measured bottleneck, explain backpressure, define useful replica readiness, reject malformed input, stop retry amplification, measure failure isolation, and preserve a reversible autoscaling policy. The check opens only when you choose to begin. It contains six questions. You need at least eighty percent for a passing result.

## Closing: Class Closing

Remember the boundary. Scale the measured constraint, not the diagram. Bound demand before saturation. Reject malformed work early. Count only verified ready capacity. Keep queues and retries bounded. Test shared failure domains, not just replica count. Judge service, quality, cost, startup, recovery, and rollback together. Preserve the verified prior policy and safe capacity floor so a change can be reversed. The learner activity and knowledge check are now ready.

Visual alternative: Scale measured constraints, bound demand, count verified capacity, test failure domains, apply gates, and preserve rollback.
