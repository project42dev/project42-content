# Make Model Operations Observable without Making Data Public

Package: `observability-cost-and-performance-class` 2.0.0

> This is the canonical text equivalent of an AI-assisted virtual-instructor
> class. It remains usable without synthesized audio, video, animation, or a
> player runtime.

## Welcome: Welcome And Outcomes

Welcome. Observability is not collecting everything. It is answering important operational questions with justified, privacy-conscious evidence. In this lesson, you will define questions and objectives, correlate exact serving identities, minimize sensitive telemetry, interpret performance distributions and cost, and build alerts that lead an accountable operator toward safe action and recovery. The examples are synthetic teaching fixtures. They are not live infrastructure results, provider prices, model benchmarks, or deployment approval.

## Narration: Questions Objectives Narration

Start with questions an operator, product owner, security reviewer, or incident responder must answer. Is the approved model and runtime bundle serving? Are users receiving valid outcomes? Which bounded slices fail? Where is time spent? What is queued, rejected, canceled, or retried? Which resource is saturated? Did an update change quality, policy outcomes, latency, cost, or recovery? Can an incident be scoped and reproduced without exposing unnecessary content? Translate each question into an indicator and objective. State the population, observation window, denominator, threshold, owner, decision, response, and retention period. For example, a synthetic interactive-latency objective can require at least 95 percent of valid requests to finish at or below 400 milliseconds in a five-minute window. The denominator is part of the contract. Missing measurements are unknown, not successful outcomes. A dashboard panel with no owned decision is decorative telemetry. A useful contract tells an owner what evidence changes a decision, such as tuning, capacity adjustment, release hold, or rollback. NIST's generative artificial intelligence risk profile supports managing and measuring risk across the lifecycle. Here, that becomes a practical rule: every signal has an approved purpose, an accountable consumer, and a defined response and retention boundary.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Narration: Correlation Narration

Correlate the serving path with a bounded application-owned request or run identifier. Connect gateway, adapter, inference server, runtime, policy, optional tool, and user-outcome events. Record service and instance identity, exact model and runtime bundle, release, route, operation, status, bounded error category, policy disposition, input and output size measures, queue time, processing time, resource observations, and an evaluation or result reference. OpenTelemetry Semantic Conventions provide shared names and stability metadata, but a field exposed by one runtime is not proof that another provider exposes an equivalent field. Version the core contract you own, then use explicit adapters for external conventions. A request identifier can connect traces and logs, but it must not become an unbounded metric label. Do not use raw personal identifiers, prompts, or arbitrary user values as labels. Exact model, tokenizer, runtime, configuration, adapter, precision, and release identities let an operator compare releases and reproduce failures. A friendly alias alone can hide that replicas served different artifacts or policies.

Sources:

- <https://opentelemetry.io/docs/specs/semconv/>
- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Demonstration: Correlation Demonstration

Consider a synthetic assistant request that feels slow and returns an invalid citation. The gateway event shows an approved route and release with no policy denial. The adapter records a bounded input-size class and an output contract failure. The inference server records two seconds of queue time and one second to first output. Runtime metrics show high accelerator use but available host memory. Exact identity reveals that one replica loaded the prior prompt-template bundle. A release annotation shows the mismatch began during a partial rollout. No raw prompt is needed to answer the first questions: which build failed, where time accumulated, and which replica should leave service. An authorized evaluator can use a separately governed fixture to reproduce citation quality. The operator isolates the mismatched replica, verifies the approved bundle, repeats readiness and regression checks, and records recovery. Correlation turned several signals into a bounded diagnosis without copying learner content into every store. Notice the causal boundary. The evidence supports a likely release mismatch and a safe investigation path. It does not prove that every invalid citation has the same cause.

Sources:

- <https://opentelemetry.io/docs/specs/semconv/>
- <https://kubernetes.io/docs/tasks/debug/debug-cluster/resource-usage-monitoring/>

## Narration: Telemetry Privacy Narration

Default to metadata and derived measurements, not raw prompts, responses, retrieved documents, credentials, authorization headers, personal identifiers, or tool secrets. Classify every proposed field as required metadata, derived measurement, optional sensitive content, or prohibited secret. For approved content sampling, document purpose and authority, minimize and redact, encrypt in transit and storage, restrict access, audit use, set short retention, and test deletion. Sampling reduces volume; it does not remove sensitivity. Threat-model instrumentation, collectors, exporters, queues, stores, dashboards, alerts, exemplars, support bundles, backups, and analyst exports. An encrypted inference request can still be disclosed by a verbose exception, trace body, metric label, screenshot, or copied support archive. Control cardinality as both a reliability and privacy concern. Unbounded request, user, prompt, or document values can overwhelm metric systems and create searchable copies. Test rejected requests and exception paths because they may copy input content. Detect unauthorized field appearance with fixtures and scans, and audit telemetry access itself.

Sources:

- <https://opentelemetry.io/docs/specs/semconv/>
- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Checkpoint: Privacy Checkpoint

Checkpoint. Inference transport is encrypted, but a trace exporter copies full prompts, retrieved passages, authorization headers, and responses into a broadly accessible support store for ninety days. Is the serving data boundary protected, and what must change?

Expected learner action: Recognize the telemetry disclosure, stop prohibited collection, remove credentials and unjustified content, govern any approved minimized sample, restrict and audit access, shorten retention, delete existing copies, and verify the fix.

Sources:

- <https://opentelemetry.io/docs/specs/semconv/>
- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Pause: Privacy Response Time

## Feedback: Privacy Feedback

The boundary is not protected. Encryption on the inference hop does not authorize a second copy in telemetry. Stop exporting authorization headers and unjustified raw content, revoke exposed credentials, restrict the store, assess access, delete existing copies under the incident and retention process, and verify deletion. If approved content sampling is genuinely required, create a separate minimized, redacted, encrypted, access-controlled, short-lived, audited path. If your answer only encrypted the support store, revisit minimization. Protection begins by not collecting what the operational question does not require.

Correct feedback: You treated telemetry as a separate governed data path and removed unjustified sensitive copies.

Retry feedback: Encryption does not make unnecessary prompt, response, retrieved content, or credential collection acceptable.

Sources:

- <https://opentelemetry.io/docs/specs/semconv/>
- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Narration: Distributions Cost Narration

Measure latency and size as distributions with suitable histogram resolution, not only averages. Preserve counts, failures, and the population behind every percentile. Prometheus explains that precomputed summary quantiles generally cannot be aggregated across replicas, while compatible histogram buckets can be aggregated. Do not average three p95 values and call that a fleet p95. Aggregate the underlying observations, then estimate once. Separate queue time, time to first output, processing time, streaming duration, and total duration. Track throughput, concurrency, rejections, cancellations, retries, cache behavior, accelerator and host utilization, memory headroom, storage, network, and energy or cloud charges where available. Use bounded workload, route, model, release, and tenant-class dimensions. Kubernetes resource monitoring is general deployment guidance, not proof that a particular deployment exports or enforces a measurement. Attribute cost with explicit inputs and denominators. State what the estimate includes and excludes. A number without its population, window, and allocation rule is not decision-ready evidence.

Sources:

- <https://prometheus.io/docs/practices/histograms/>
- <https://kubernetes.io/docs/tasks/debug/debug-cluster/resource-usage-monitoring/>

## Demonstration: Histogram Demonstration

Work the supplied baseline. The bucket bounds are 100, 200, 400, and 800 milliseconds. Replica one has cumulative counts 50, 90, 100, 100. Replica two has 5, 15, 35, 40. Replica three has 1, 2, 8, 10. Add matching buckets: 50 plus 5 plus 1 is 56; 90 plus 15 plus 2 is 107; 100 plus 35 plus 8 is 143; and 100 plus 40 plus 10 is 150. For p95, rank equals 0.95 times 150, or 142.5. That rank lies in the 200-to-400 millisecond bucket. Linear interpolation gives 200 plus ((142.5 minus 107) divided by (143 minus 107)) times 200, which is 397.22 milliseconds. This is an estimate, assuming observations are spread within the bucket. The fixture has 143 of 150 requests at or below 400 milliseconds, or 95.333 percent, so it passes a synthetic 95 percent latency objective by about 0.333 percentage points. If two of the same 150 requests were unsuccessful, 148 divided by 150 equals 98.667 percent, which fails a separate 99 percent success objective. Do not remove failures from a denominator unless the indicator contract explicitly justifies it. The synthetic cost example is three replicas for half an hour, at a fictional accelerator rate of two dollars per replica-hour and fictional host rate of forty cents per replica-hour. Accelerator cost is 3 times 0.5 times 2, or 3 dollars. Host cost is 3 times 0.5 times 0.40, or 0.60 dollars. Add fictional storage of 0.05 and network of 0.10 to get 3.75 dollars. For 15,000 completed requests, 3.75 divided by 15,000 is 0.00025 dollars per request. These are teaching inputs, not provider prices or production measurements.

Sources:

- <https://prometheus.io/docs/practices/histograms/>
- <https://kubernetes.io/docs/tasks/debug/debug-cluster/resource-usage-monitoring/>

## Narration: Alerts Investigation Narration

Alert on symptoms that require action: user-visible objective burn, critical safety or security outcomes, sustained queueing or rejection, memory pressure, unavailable replicas, exact identity mismatch, telemetry loss, cost anomalies, and failed recovery checks. Every alert needs a symptom, owner, severity, population, threshold and duration, safe first action, runbook, evidence links, escalation, and recovery condition. Five paper-tested examples are useful. A latency burn alert routes to serving on-call and checks queueing and saturation before scaling or rollback. A policy-deny anomaly routes to safety and security with policy version and disposition counts, without content. A queue alert fires only when p95 queue time and rejection rate are both elevated for ten minutes. An identity mismatch alert fires on any artifact, runtime, configuration, or release digest outside the approved route manifest. A telemetry-loss or cost anomaly alert includes missing-series evidence and allocation inputs. Test firing, routing, deduplication, planned-maintenance suppression, escalation timers, permissions, and recovery notifications. Missing telemetry is not proof of health. Recovery must test affected outcomes, not merely the existence of a rollback command.

Sources:

- <https://opentelemetry.io/docs/specs/semconv/>
- <https://prometheus.io/docs/practices/histograms/>
- <https://kubernetes.io/docs/tasks/debug/debug-cluster/resource-usage-monitoring/>

## Learner Prompt: Activity Transition

Now build the privacy-conscious observability contract. Write ten operator questions and map each to signals, exact identities, bounded dimensions, owner, decision, and retention. Define request, model, release, policy, latency, queue, error, saturation, and cost fields with stability and cardinality limits. Classify every field as required metadata, derived measurement, optional sensitive content, or prohibited secret. Design latency and size histograms, objective calculations, and cost allocation for three replicas without averaging quantiles. Create five alerts and paper-test firing, routing, evidence, safe first action, runbook, escalation, telemetry-loss behavior, and recovery. Your work is complete only when it answers all ten questions and states field type, stability, enum, range, and cardinality.

Expected learner action: Complete the operator-question matrix, versioned telemetry contract, privacy and retention review, fleet distributions, bounded cost attribution, investigation views, and five tested alert contracts.

Sources:

- <https://opentelemetry.io/docs/specs/semconv/>
- <https://prometheus.io/docs/practices/histograms/>
- <https://kubernetes.io/docs/tasks/debug/debug-cluster/resource-usage-monitoring/>
- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Pause: Activity Work Time

## Narration: Operator Contract Worked Example Lab Narration

Here is a worked contract. For approved build, use startup inventory and request identity, exact model, tokenizer, runtime, configuration, adapter, and release identities, with environment, route, and release dimensions. The release owner isolates or rolls back; example retention is 90 days for inventory and 30 days for request metadata. For valid outcomes, use status and outcome counters by route, operation, model, release, and bounded outcome; product reliability staff retain or halt a release for 30 days. For a failing reviewed slice, use evaluation and outcome counters with evaluation-set version, release, bounded locale, route, and workload class; the evaluation lead blocks promotion or commissions tests for 90 days. For time spent, use gateway, queue, first-output, processing, tool, and end-to-end histograms plus request-linked traces. The performance owner tunes the measured stage; metrics remain 90 days and sampled traces 7 days. For queued or rejected work, use queue histograms, depth gauges, and rejection counters with bounded rejection reasons; the capacity owner shapes traffic or adds reviewed capacity for 30 days. For saturation, use accelerator and host utilization, memory headroom, storage, and network activity; the infrastructure owner changes placement or limits for 30 days. For quality or security change, retain before-and-after outcomes, policy and evaluation fixtures, old and new exact bundles, policy version, bounded test suite, and disposition for 180 days. For cost change, use metered resource time and charge allocation by workload, route, model, release, and bounded tenant class; finance operations investigates for 13 months subject to policy. For recovery, use backup, restore, rollback, and probe events with elapsed-time histograms; the resilience owner accepts or remediates for 180 days. For incident scope and reproduction, correlate governed traces, deployment events, deterministic probes, request or run identifiers, exact bundles, route, status, and bounded error category under the approved incident schedule. The field contract is obs-contract/v1. The request identifier is required application metadata and prohibited as a metric label. Build digests and release identifiers have at most 20 active values per environment. Policy disposition is limited to allow, deny, review, error, and unknown, with at most 20 active policy versions. Latency and queue measurements are finite from 0 through 3,600,000 milliseconds and use configured buckets. Error category is limited to none, timeout, overload, invalid request, policy, dependency, internal, and unknown. Saturation is finite from 0 through 1. Allocated cost is finite and nonnegative. Unknown enums and types are rejected or mapped explicitly to unknown at the adapter boundary. Cardinality alarms compare active series with the contract budget. Privacy review covers access, retention, redaction, encryption, sampling, deletion, audit, and support bundles. Deny-all, removed validation, or an unowned dashboard does not pass.

Sources:

- <https://opentelemetry.io/docs/specs/semconv/>
- <https://prometheus.io/docs/practices/histograms/>
- <https://kubernetes.io/docs/tasks/debug/debug-cluster/resource-usage-monitoring/>
- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Learner Prompt: Changed Input Prompt

Before seeing the answer, inspect changed.json. Write down its cumulative bucket totals and predict whether traffic-weighted aggregation will be higher or lower than equal averaging of replica p95 estimates. Explain your prediction using the fact that replica three carries 25 requests and places most of them in the first two buckets. Then state the postcondition your repair must preserve: validation remains active, all compatible traffic remains in the population, and p95 is estimated once from summed cumulative buckets.

Expected learner action: Predict a lower traffic-weighted result than equal replica averaging, record the changed sums [29,47,53,55], and state the validation and population postconditions.

Sources:

- <https://prometheus.io/docs/practices/histograms/>

## Pause: Changed Input Pause

## Narration: Repair Lab Lab Narration

This deterministic Node 22 native module lab has no dependencies, network calls, model calls, or live integration. The focused defect averages per-replica p95 estimates. Unequal traffic means equal replica weighting does not represent the combined request population. The repair must validate compatible cumulative buckets, sum matching counts, and estimate p95 once. Preserve the export aggregateP95 and its result schema. Edit only the aggregate implementation. Do not edit the validator, fixtures, or immutable tests. The validator checks schema, unit, window, exact identities, unknown fields, finite ranges, monotonic cumulative counts, duplicate replica identifiers, missing records, and compatible bucket bounds. A constant, deny-all result, discarded traffic, removed validation, or changed test is not a repair. The root-relative starter command is shown visually. Supplied starter evidence is exit 1 with empty standard error and standard output: FAIL baseline aggregate: expected 397.22, received 546.67; FAIL changed-input aggregate: expected 375.00, received 391.67; PASS 6 tests; RESULT failed=2 passed=6. The repaired tests exit 0 with empty standard error and standard output: PASS 8 tests; RESULT failed=0 passed=8. The baseline input has replicas with 100, 40, and 10 requests and cumulative counts [50,90,100,100], [5,15,35,40], and [1,2,8,10]. The changed input has cumulative sums [29,47,53,55]. Its third replica has most of 25 requests in the first two buckets, while replicas one and two have slower tails. The changed answer is 375.00 milliseconds. If baseline passes but changed input fails, the implementation likely memorized the baseline or retained replica-level weighting. The answer key is: baseline sums [56,107,143,150], rank 142.5, estimate 397.22 milliseconds. Changed sums [29,47,53,55], rank 52.25, estimate 375.00 milliseconds in the 200-to-400 millisecond bucket. The finite final bound covers these fixtures only. Production ingestion needs complete overflow or count evidence. These local values are not production claims. Real integration would collect authenticated telemetry from a deployed gateway, adapter, runtime, and metrics backend, preserve exact identities, and validate exporter behavior. The lab does not establish that any model family, runtime, hosted service, billing system, or production telemetry works. Distinct model families and a runtime project also do not share a telemetry or security contract. Capture actual artifact, runtime, adapter, configuration, and release identities for each deployment.

Sources:

- <https://nodejs.org/api/esm.html>
- <https://prometheus.io/docs/practices/histograms/>
- <https://opentelemetry.io/docs/specs/semconv/>

## Feedback: Changed Input Feedback

Now compare your reasoning with the supplied answer. The changed cumulative buckets sum to 29, 47, 53, and 55. The p95 rank is 0.95 times 55, or 52.25. It lies in the 200-to-400 millisecond bucket. Linear interpolation gives 200 plus ((52.25 minus 47) divided by (53 minus 47)) times 200, which equals 375.00 milliseconds. The result is lower than the defective 391.67 millisecond average because the busiest replica has the faster distribution. Equal weighting gives each replica one vote, but the combined population gives each request one vote. A correct implementation also rejects malformed input, preserves compatible observations, and keeps the final finite-bound postcondition for these fixtures. Deny-all is not a repair because it discards valid traffic and hides operational behavior. Removing validation is not a repair because malformed or incompatible inputs can corrupt the distribution. The result is a causal explanation, not merely a memorized number.

Correct feedback: You used request-weighted cumulative buckets, preserved validation and population, and explained why the changed result is 375.00 milliseconds.

Retry feedback: Do not average replica p95 values. Sum compatible cumulative buckets first, then calculate one percentile while preserving validation and all valid traffic.

Sources:

- <https://prometheus.io/docs/practices/histograms/>

## Assessment Handoff: Assessment Handoff

Begin the knowledge check when you can start from operational questions, preserve exact release identity, defend content minimization, interpret latency distributions, avoid averaging replica quantiles, and design an actionable alert. The check uses the six supplied questions. Choose Begin knowledge check when you are ready. It will not start or submit automatically.

## Closing: Class Closing

Remember the operating rule: collect only signals that answer owned questions, connect them to the exact serving build, protect the data boundary, measure distributions and cost honestly, preserve denominators and validation, and test every alert through recovery. Synthetic arithmetic can teach reasoning, but it cannot prove a production integration. Use evidence that is bounded, attributable, and sufficient for the decision.
