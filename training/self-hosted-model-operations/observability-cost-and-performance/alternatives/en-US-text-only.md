# Make Model Operations Observable without Making Data Public: text-only class

This route contains the complete teaching content, learner actions, feedback,
and assessment handoff without requiring audio, video, or animation.

## Welcome: Welcome And Outcomes

Welcome. Observability is not the act of collecting everything. It is the ability to answer important operational questions with justified, privacy-conscious evidence. In this class, you will define questions and objectives, correlate exact serving identities, minimize sensitive telemetry, interpret performance and cost distributions, and build alerts that lead an accountable operator toward safe action and recovery.

## Narration: Questions Objectives Narration

Start with questions an operator, product owner, security reviewer, or incident responder must answer. Is the approved model and runtime bundle serving? Are users receiving valid outcomes? Which languages, accessibility needs, workflows, or other important slices fail? Where is time spent? What is queued, rejected, canceled, or retried? Which resource is saturated? Did an update change quality, policy outcomes, latency, cost, or recovery? Can an incident be scoped and reproduced without exposing unnecessary content? Translate those questions into indicators and objectives for availability, successful outcomes, policy dispositions, latency distributions, queue time, throughput, rejection, error, recovery, and budget. State the population, window, threshold, owner, decision, and response. A dashboard panel with no question, owner, or decision is decorative telemetry. NIST's generative-AI risk profile emphasizes measurement and management across the lifecycle. Here, that becomes an observability contract: every collected signal has an approved purpose, an accountable consumer, and a defined retention and response.

Visual alternative: Rows cover exact model identity, valid outcomes, failing slices, queueing, saturation, release change, cost, recovery, and incident scope.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Narration: Correlation Narration

Correlate the serving path with a bounded request or run identifier. Connect gateway, application adapter, inference server, runtime, policy, optional tool, and user-outcome events. Record an application-owned core: service and instance identity, immutable model and runtime bundle, release, route, operation, status, stable error category, policy disposition, bounded input and output size measures, queue time, processing time, resource observations, and a result or evaluation reference. OpenTelemetry semantic conventions provide shared names and stability metadata, but not every generative-AI field is stable or implemented identically across runtimes. Version the convention and fields you adopt. Keep your product's core contract stable and map external conventions through explicit adapters. Avoid using raw personal identifiers, prompts, or unbounded user values as correlation labels. Exact identities let an operator compare releases and reproduce failures. A friendly alias alone can hide that two replicas served different artifacts, templates, runtimes, or policies.

Visual alternative: Gateway, adapter, server, runtime, policy, resource, and outcome rows share the run identifier and exact release identity without storing raw prompt content.

Sources:

- <https://opentelemetry.io/docs/specs/semconv/>
- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Demonstration: Correlation Demonstration

Consider a synthetic assistant request that feels slow and returns an invalid citation. The gateway event shows an approved caller, route, release, and no policy denial. The adapter records a bounded input-size class and output contract failure. The inference server records two seconds of queue time, one second to first output, and a completed stream. Runtime metrics show high accelerator use but available host memory. The exact identity reveals that one replica loaded the prior prompt-template bundle. A release annotation shows the mismatch began during a partial rollout. No raw prompt is needed to answer the first operational questions: which build failed, where time accumulated, and which replica should leave service. An authorized evaluator can use a separately governed fixture to reproduce citation quality. The operator removes the mismatched replica, verifies the approved bundle, repeats readiness and regression checks, and records the recovery. Correlation turned several signals into a bounded diagnosis without copying learner content into every telemetry store.

Visual alternative: Metadata and exact identities support diagnosis and recovery while raw prompt and response content remain outside routine telemetry.

Sources:

- <https://opentelemetry.io/docs/specs/semconv/>
- <https://kubernetes.io/docs/tasks/debug/debug-cluster/resource-usage-monitoring/>

## Narration: Telemetry Privacy Narration

Default to metadata and derived measurements, not raw prompts, responses, retrieved documents, credentials, authorization headers, personal identifiers, or tool secrets. Classify each proposed field as required metadata, derived measurement, optional sensitive content, or prohibited secret. For approved content sampling, document purpose and authority, minimize and redact, encrypt in transit and storage, restrict access, audit use, set short retention, and test deletion. Sampling reduces volume; it does not remove sensitivity. Threat-model the whole telemetry path: instrumentation, collectors, exporters, queues, stores, dashboards, alerts, exemplars, support bundles, backups, and analyst exports. A securely encrypted inference request can still be disclosed by a verbose exception, trace body, metric label, screenshot, or copied support archive. Control cardinality as both a reliability and privacy concern. Unbounded request, user, prompt, or document values can overwhelm metric systems and create searchable data copies. Detect unauthorized field appearance with fixtures and scans, and make telemetry access itself an audited privilege.

Visual alternative: Secrets and routine raw content are prohibited; bounded metadata and derived measures are preferred; approved samples receive strict controls.

Sources:

- <https://opentelemetry.io/docs/specs/semconv/>
- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Checkpoint: Privacy Checkpoint

Checkpoint. Inference transport is encrypted, but a trace exporter copies full prompts, retrieved passages, authorization headers, and responses into a broadly accessible support store for ninety days. Is the serving data boundary protected, and what must change?

Learner action: Recognize the telemetry disclosure, stop prohibited collection, remove credentials and unjustified content, govern any approved minimized sample, restrict and audit access, shorten retention, delete existing copies, and verify the fix.

Sources:

- <https://opentelemetry.io/docs/specs/semconv/>
- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Pause: Privacy Response Time

## Feedback: Privacy Feedback

The boundary is not protected. Encryption on the inference hop does not authorize a second copy in telemetry. Stop exporting authorization headers and unjustified raw content, revoke any exposed credentials, restrict the store, assess access, delete existing copies under the incident and retention process, and verify deletion. If approved content sampling is genuinely required, create a separate minimized, redacted, encrypted, access-controlled, short-lived, audited path. If your answer only encrypted the support store, revisit data minimization: protection begins by not collecting what the operational question does not require.

If correct: You treated telemetry as a separate governed data path and removed unjustified sensitive copies.

If retrying: Encryption does not make unnecessary prompt, response, retrieved content, or credential collection acceptable.

Sources:

- <https://opentelemetry.io/docs/specs/semconv/>
- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Narration: Distributions Cost Narration

Measure latency and size as distributions with appropriate histogram resolution, not only averages. Preserve event counts, failures, and the population behind each percentile. Prometheus explains that precomputed summary quantiles generally cannot be aggregated across replicas, while histograms support later aggregation subject to their buckets or representation. Do not average three p95 values and call the result a fleet p95. Aggregate the underlying histogram observations correctly. Separate queue time, time to first output, processing time, streaming duration, and total duration. Track throughput, concurrency, rejections, cancellations, retries, cache behavior, accelerator and host utilization, memory headroom, storage, network, and energy or cloud charges when available. Kubernetes resource-monitoring guidance distinguishes pipeline and full-metrics approaches; choose signals that support your questions and capacity actions. Attribute cost by bounded tenant class, workload, route, model, and release. Avoid unbounded labels. Include idle capacity, failed work, retries, data transfer, storage, telemetry, and operational labor where relevant, and state what the estimate excludes.

Visual alternative: Underlying histogram observations aggregate across replicas; precomputed p95 values are not averaged. Queue, first-output, processing, streaming, saturation, and cost are separate.

Sources:

- <https://prometheus.io/docs/practices/histograms/>
- <https://kubernetes.io/docs/tasks/debug/debug-cluster/resource-usage-monitoring/>

## Narration: Alerts Investigation Narration

Alert on symptoms that require action: user-visible objective burn, critical safety or security outcomes, sustained queueing or rejection, error growth, memory pressure, unavailable replicas, exact-model identity mismatch, telemetry loss, cost anomalies, and failed backup or rollback checks. Every alert needs an owner, severity, population, threshold and duration, safe first action, runbook, evidence links, escalation, and recovery condition. Test firing, routing, deduplication, suppression, escalation, acknowledgment, and resolution. Attach baseline and deployment annotations so the investigator can compare before and after a change. Missing telemetry is not proof of health. Create a separate signal for absent expected observations, stalled exporters, dropped spans, delayed metrics, and inconsistent replica counts. Dashboards should move from service symptom to slice, release, serving layer, saturation, and recovery evidence without requiring broad access to sensitive content.

Visual alternative: Alerts cover objective burn, queueing, identity mismatch, telemetry loss, and rollback failure, each with a named response and resolution condition.

Sources:

- <https://opentelemetry.io/docs/specs/semconv/>
- <https://prometheus.io/docs/practices/histograms/>
- <https://kubernetes.io/docs/tasks/debug/debug-cluster/resource-usage-monitoring/>

## Learner Prompt: Activity Transition

Now build the privacy-conscious observability contract. Write ten operator questions and map each to signals, exact identities, bounded dimensions, owner, decision, and retention. Define request, model, release, policy, latency, queue, error, saturation, and cost fields with stability and cardinality limits. Classify every field as required metadata, derived measurement, optional sensitive content, or prohibited secret. Design latency and size histograms, objective calculations, and cost allocation for three replicas without averaging quantiles. Create five alerts, then paper-test firing, routing, evidence, safe first action, runbook, escalation, telemetry-loss behavior, and recovery.

Learner action: Complete the operator-question matrix, versioned telemetry contract, privacy and retention review, fleet distributions, bounded cost attribution, investigation views, and five tested alert contracts.

Sources:

- <https://opentelemetry.io/docs/specs/semconv/>
- <https://prometheus.io/docs/practices/histograms/>
- <https://kubernetes.io/docs/tasks/debug/debug-cluster/resource-usage-monitoring/>
- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Pause: Activity Work Time

## Assessment Handoff: Assessment Handoff

Begin the check when you can start from operational questions, preserve exact release identity, defend content minimization, interpret latency distributions, avoid averaging replica quantiles, and design an actionable alert. The check starts only when you choose Begin knowledge check.

## Closing: Class Closing

Remember: collect only signals that answer owned questions, connect them to the exact serving build, protect the data boundary, measure distributions and cost honestly, and test every alert through recovery.
