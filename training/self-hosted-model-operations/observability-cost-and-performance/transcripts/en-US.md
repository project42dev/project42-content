# Make Model Operations Observable without Making Data Public

Package: `observability-cost-and-performance-class` 1.0.0

> This is the canonical text equivalent of an AI-assisted virtual-instructor
> class. It remains usable without synthesized audio, video, animation, or a
> player runtime.

## Welcome: Welcome And Outcomes

Welcome. Observability is not the act of collecting everything. It is the ability to answer important operational questions with justified, privacy-conscious evidence. In this class, you will define questions and objectives, correlate exact serving identities, minimize sensitive telemetry, interpret performance and cost distributions, and build alerts that lead an accountable operator toward safe action and recovery.

## Narration: Questions Objectives Narration

Start with questions an operator, product owner, security reviewer, or incident responder must answer. Is the approved model and runtime bundle serving? Are users receiving valid outcomes? Which languages, accessibility needs, workflows, or other important slices fail? Where is time spent? What is queued, rejected, canceled, or retried? Which resource is saturated? Did an update change quality, policy outcomes, latency, cost, or recovery? Can an incident be scoped and reproduced without exposing unnecessary content? Translate those questions into indicators and objectives for availability, successful outcomes, policy dispositions, latency distributions, queue time, throughput, rejection, error, recovery, and budget. State the population, window, threshold, owner, decision, and response. A dashboard panel with no question, owner, or decision is decorative telemetry. NIST's generative-AI risk profile emphasizes measurement and management across the lifecycle. Here, that becomes an observability contract: every collected signal has an approved purpose, an accountable consumer, and a defined retention and response.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Narration: Correlation Narration

Correlate the serving path with a bounded request or run identifier. Connect gateway, application adapter, inference server, runtime, policy, optional tool, and user-outcome events. Record an application-owned core: service and instance identity, immutable model and runtime bundle, release, route, operation, status, stable error category, policy disposition, bounded input and output size measures, queue time, processing time, resource observations, and a result or evaluation reference. OpenTelemetry semantic conventions provide shared names and stability metadata, but not every generative-AI field is stable or implemented identically across runtimes. Version the convention and fields you adopt. Keep your product's core contract stable and map external conventions through explicit adapters. Avoid using raw personal identifiers, prompts, or unbounded user values as correlation labels. Exact identities let an operator compare releases and reproduce failures. A friendly alias alone can hide that two replicas served different artifacts, templates, runtimes, or policies.

Sources:

- <https://opentelemetry.io/docs/specs/semconv/>
- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Demonstration: Correlation Demonstration

Consider a synthetic assistant request that feels slow and returns an invalid citation. The gateway event shows an approved caller, route, release, and no policy denial. The adapter records a bounded input-size class and output contract failure. The inference server records two seconds of queue time, one second to first output, and a completed stream. Runtime metrics show high accelerator use but available host memory. The exact identity reveals that one replica loaded the prior prompt-template bundle. A release annotation shows the mismatch began during a partial rollout. No raw prompt is needed to answer the first operational questions: which build failed, where time accumulated, and which replica should leave service. An authorized evaluator can use a separately governed fixture to reproduce citation quality. The operator removes the mismatched replica, verifies the approved bundle, repeats readiness and regression checks, and records the recovery. Correlation turned several signals into a bounded diagnosis without copying learner content into every telemetry store.

Sources:

- <https://opentelemetry.io/docs/specs/semconv/>
- <https://kubernetes.io/docs/tasks/debug/debug-cluster/resource-usage-monitoring/>

## Narration: Telemetry Privacy Narration

Default to metadata and derived measurements, not raw prompts, responses, retrieved documents, credentials, authorization headers, personal identifiers, or tool secrets. Classify each proposed field as required metadata, derived measurement, optional sensitive content, or prohibited secret. For approved content sampling, document purpose and authority, minimize and redact, encrypt in transit and storage, restrict access, audit use, set short retention, and test deletion. Sampling reduces volume; it does not remove sensitivity. Threat-model the whole telemetry path: instrumentation, collectors, exporters, queues, stores, dashboards, alerts, exemplars, support bundles, backups, and analyst exports. A securely encrypted inference request can still be disclosed by a verbose exception, trace body, metric label, screenshot, or copied support archive. Control cardinality as both a reliability and privacy concern. Unbounded request, user, prompt, or document values can overwhelm metric systems and create searchable data copies. Detect unauthorized field appearance with fixtures and scans, and make telemetry access itself an audited privilege.

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

The boundary is not protected. Encryption on the inference hop does not authorize a second copy in telemetry. Stop exporting authorization headers and unjustified raw content, revoke any exposed credentials, restrict the store, assess access, delete existing copies under the incident and retention process, and verify deletion. If approved content sampling is genuinely required, create a separate minimized, redacted, encrypted, access-controlled, short-lived, audited path. If your answer only encrypted the support store, revisit data minimization: protection begins by not collecting what the operational question does not require.

Correct feedback: You treated telemetry as a separate governed data path and removed unjustified sensitive copies.

Retry feedback: Encryption does not make unnecessary prompt, response, retrieved content, or credential collection acceptable.

Sources:

- <https://opentelemetry.io/docs/specs/semconv/>
- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Narration: Distributions Cost Narration

Measure latency and size as distributions with appropriate histogram resolution, not only averages. Preserve event counts, failures, and the population behind each percentile. Prometheus explains that precomputed summary quantiles generally cannot be aggregated across replicas, while histograms support later aggregation subject to their buckets or representation. Do not average three p95 values and call the result a fleet p95. Aggregate the underlying histogram observations correctly. Separate queue time, time to first output, processing time, streaming duration, and total duration. Track throughput, concurrency, rejections, cancellations, retries, cache behavior, accelerator and host utilization, memory headroom, storage, network, and energy or cloud charges when available. Kubernetes resource-monitoring guidance distinguishes pipeline and full-metrics approaches; choose signals that support your questions and capacity actions. Attribute cost by bounded tenant class, workload, route, model, and release. Avoid unbounded labels. Include idle capacity, failed work, retries, data transfer, storage, telemetry, and operational labor where relevant, and state what the estimate excludes.

Sources:

- <https://prometheus.io/docs/practices/histograms/>
- <https://kubernetes.io/docs/tasks/debug/debug-cluster/resource-usage-monitoring/>

## Narration: Alerts Investigation Narration

Alert on symptoms that require action: user-visible objective burn, critical safety or security outcomes, sustained queueing or rejection, error growth, memory pressure, unavailable replicas, exact-model identity mismatch, telemetry loss, cost anomalies, and failed backup or rollback checks. Every alert needs an owner, severity, population, threshold and duration, safe first action, runbook, evidence links, escalation, and recovery condition. Test firing, routing, deduplication, suppression, escalation, acknowledgment, and resolution. Attach baseline and deployment annotations so the investigator can compare before and after a change. Missing telemetry is not proof of health. Create a separate signal for absent expected observations, stalled exporters, dropped spans, delayed metrics, and inconsistent replica counts. Dashboards should move from service symptom to slice, release, serving layer, saturation, and recovery evidence without requiring broad access to sensitive content.

Sources:

- <https://opentelemetry.io/docs/specs/semconv/>
- <https://prometheus.io/docs/practices/histograms/>
- <https://kubernetes.io/docs/tasks/debug/debug-cluster/resource-usage-monitoring/>

## Learner Prompt: Activity Transition

Now build the privacy-conscious observability contract. Write ten operator questions and map each to signals, exact identities, bounded dimensions, owner, decision, and retention. Define request, model, release, policy, latency, queue, error, saturation, and cost fields with stability and cardinality limits. Classify every field as required metadata, derived measurement, optional sensitive content, or prohibited secret. Design latency and size histograms, objective calculations, and cost allocation for three replicas without averaging quantiles. Create five alerts, then paper-test firing, routing, evidence, safe first action, runbook, escalation, telemetry-loss behavior, and recovery.

Expected learner action: Complete the operator-question matrix, versioned telemetry contract, privacy and retention review, fleet distributions, bounded cost attribution, investigation views, and five tested alert contracts.

Sources:

- <https://opentelemetry.io/docs/specs/semconv/>
- <https://prometheus.io/docs/practices/histograms/>
- <https://kubernetes.io/docs/tasks/debug/debug-cluster/resource-usage-monitoring/>
- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Pause: Activity Work Time

## Narration: Operator Contract Worked Example Lab Narration

Instructor narration: Map ten questions to bounded evidence. 1. Approved build: startup inventory and request identity; exact model, tokenizer, runtime, configuration, adapter, and release identities; dimensions environment, route, release; release owner isolates or rolls back; example retention inventory 90 days and request metadata 30 days. 2. Valid outcomes: status and outcome counters; route, operation, model, release, and bounded outcome; product SRE retains or halts a release; 30 days. 3. Failing reviewed slice: evaluation and outcome counters; evaluation-set version and release; bounded locale, route, and workload class; evaluation lead blocks promotion or commissions tests; 90 days. 4. Time spent: gateway, queue, first-output, processing, tool, and end-to-end histograms plus request-linked traces; service, operation, runtime, and release; performance owner tunes the measured stage; metrics 90 days and sampled traces 7 days. 5. Queued or rejected: queue histogram, depth gauge, and rejection counter; service, instance, route, release, and bounded rejection reason; capacity owner shapes traffic or adds reviewed capacity; 30 days. 6. Saturated resource: accelerator and host utilization, memory headroom, storage and network activity; node, instance, runtime, release, resource type, and bounded pool; infrastructure owner changes placement or limits; 30 days. 7. Quality or security change: before-and-after outcome, policy, and evaluation fixtures; old and new exact bundles plus policy version; bounded test suite and disposition; safety and release owners promote or roll back; 180 days. 8. Cost change: metered resource time and charge allocation; workload, route, model, release, and bounded tenant class; finance operations investigates or adjusts capacity; 13 months subject to policy. 9. Recovery objective: backup, restore, rollback, and probe events with elapsed-time histogram; artifact, runtime, configuration, release, and recovery-plan version; resilience owner accepts or remediates; 180 days. 10. Incident scope and reproduction: correlated metadata, governed traces, deployment events, and deterministic probes; request or run ID plus exact bundle; route, status, and bounded error category; incident commander scopes traffic and commissions reproduction; request metadata 30 days and incident evidence under the approved schedule. Field contract obs-contract/v1: request_id is required application-stable metadata and prohibited as a metric label. Build digests and release_id are required metadata with at most 20 active values per environment. policy_disposition is limited to allow, deny, review, error, and unknown, with at most 20 active policy versions. latency_ms and queue_ms are finite derived measurements from 0 through 3,600,000 ms represented by configured buckets. error_category is limited to none, timeout, overload, invalid_request, policy, dependency, internal, and unknown. saturation_ratio is finite from 0 through 1. allocated_cost_usd is finite and nonnegative. Unknown enums and types are rejected or mapped explicitly to unknown at the adapter boundary. Cardinality alarms compare active series with the contract budget. Privacy review covers access, retention, redaction, encryption, sampling, deletion, audit, and support bundles. Rubric: complete work answers all ten questions with signals, exact identity, bounded dimensions, owner, decision, and retention; versions every field and states type, stability, enum, range, and cardinality; classifies every field and documents controls; aggregates compatible cumulative histograms without averaging quantiles; shows objective and cost arithmetic with denominators; and defines five alerts with firing, routing, evidence, runbook, escalation, and recovery. Deny-all, removed validation, or an unowned dashboard does not pass.

Sources:

- <https://opentelemetry.io/docs/specs/semconv/>

## Narration: Repair Lab Lab Narration

The focused defect averages per-replica p95 estimates. Unequal traffic means equal replica weighting does not represent the combined request population. The repair must validate compatible cumulative buckets, sum matching counts, and estimate p95 once. Real integration and fixture simulation are separate. The fixtures do not prove that Meta Llama, Qwen, DeepSeek, Mistral, Microsoft Phi, NVIDIA TensorRT-LLM, a hosted API, a serving runtime, cloud billing, or production telemetry works. A live integration would collect authenticated telemetry from the deployed gateway, adapter, runtime, and metrics backend, then preserve exact identities and validate exporter behavior. Passing this lab is not deployment approval. Prediction before execution: baseline replicas contain 100, 40, and 10 requests. Predict whether equal weighting of replica p95 values overstates or understates the combined p95, and explain why. Then run the root-relative command in README. Supplied Node 22 run evidence requires starter tests to exit 1 with empty stderr and stdout: FAIL baseline aggregate: expected 397.22, received 546.67; FAIL changed-input aggregate: expected 375.00, received 391.67; PASS 6 tests; RESULT failed=2 passed=6. The repaired tests exit 0 with empty stderr and stdout: PASS 8 tests; RESULT failed=0 passed=8. Learner activity: edit only src/aggregate.mjs. Preserve export aggregateP95(input) and its result schema. Do not edit validator, fixtures, or immutable tests. The unchanged validator checks schema, unit, window, exact identities, unknown fields, finite ranges, monotonic cumulative counts, duplicate replica IDs, missing records, and compatible bucket bounds. A constant, deny-all result, discarded traffic, removed validation, or changed test is not a repair. Changed-input prediction: inspect changed.json before running tests. Replica 3 has most of its 25 requests in the first two buckets, while replicas 1 and 2 have slower tails. Predict how traffic-weighted aggregation differs from equal averaging. The repaired result is 375.00 ms. If baseline passes but changed input fails, the implementation likely memorized the baseline or retained replica-level weighting. Answer key: baseline sums to [56,107,143,150]. Rank is 142.5, in the 200-to-400 ms bucket, producing 397.22 ms by linear interpolation. Changed sums to [29,47,53,55]. Rank is 52.25, producing 375.00 ms in the 200-to-400 ms bucket. The finite final bound covers all observations in these fixtures. Production histograms need complete overflow or count evidence and this finite-fixture simplification is not a general ingestion contract. Local values are not production claims. Provider transfer: Meta Llama, Qwen, DeepSeek, Mistral, and Microsoft Phi are distinct model families and artifacts. NVIDIA TensorRT-LLM is a runtime project, not a model-family synonym. These projects do not establish a shared telemetry, API, tokenizer, quantization, security, or runtime contract. Capture the actual model artifact, runtime, adapter, configuration, and release identities for each deployment.

Sources:

- <https://opentelemetry.io/docs/specs/semconv/>

## Assessment Handoff: Assessment Handoff

Begin the check when you can start from operational questions, preserve exact release identity, defend content minimization, interpret latency distributions, avoid averaging replica quantiles, and design an actionable alert. The check starts only when you choose Begin knowledge check.

## Closing: Class Closing

Remember: collect only signals that answer owned questions, connect them to the exact serving build, protect the data boundary, measure distributions and cost honestly, and test every alert through recovery.
