# Size the Exact Model Service from Evidence: text-only class

This route contains the complete teaching content, learner actions, feedback,
and assessment handoff without requiring audio, video, or animation.

## Welcome: Welcome And Outcomes

Welcome. This class turns the question, what hardware do I need, into a reproducible compatibility and capacity decision. You will bind the exact artifact to its runtime and device stack, estimate memory and storage without mistaking estimates for measurements, build a representative load profile, find the first saturation point, protect the host during overload, and publish supported limits with costs, exclusions, and re-benchmark triggers.

## Narration: Compatibility Narration

Begin with an exact-stack compatibility matrix. Record model architecture, artifact and tensor formats, precision or quantization, tokenizer, template, maximum tested context, runtime and version, execution backend, operating system, CPU architecture, accelerator model and count, driver, compute library, container base, and required extensions. Use current runtime and hardware documentation to identify a candidate combination, then load the exact quarantined artifact in the intended environment. Architecture support does not prove support for every conversion, quantization, kernel, device, operating system, or feature. Watch for automatic fallback. A runtime may silently execute one operation, or the entire model, on a slower backend. Make the selected backend visible in logs and measurements. Accept fallback only through an explicit quality, latency, resource, and cost decision. Label every matrix cell documented, measured, inferred, or unknown so a documentation claim is not presented as a successful test.

Visual alternative: Each exact stack component is labeled documented, measured, inferred, or unknown; fallback is visible and requires an explicit decision.

Sources:

- <https://onnxruntime.ai/docs/execution-providers/>
- <https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/>

## Narration: Capacity Estimate Narration

Estimate before measuring so you can reject impossible candidates safely. Start with actual artifact sizes and a rough weight-memory estimate from parameter count and bits per parameter. Add quantization metadata, embeddings, runtime workspace, graph or kernel caches, temporary buffers, loaded replicas, and safety headroom. Dynamic cache depends on concurrent sequences, context and output lengths, cache representation, batching, and runtime implementation. Add host memory for the runtime, tokenizer, queues, telemetry, page cache, staging, and failure handling. Add storage for immutable artifacts, container layers, caches, logs, evaluation data, backups, and rollback bundles. Include download, verification, load, compilation, and warm-up time. Every value is a hypothesis with an evidence label and range. A model can fit at startup and still fail under long context, concurrency, batching, restart, or recovery.

Visual alternative: Weight bytes are only one component. Dynamic context and concurrency, runtime workspace, host services, storage, startup, recovery, and headroom are also sized.

Sources:

- <https://docs.docker.com/engine/containers/resource_constraints/>
- <https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/>

## Demonstration: Sizing Demonstration

Use a deliberately rough synthetic example. A candidate has eight billion parameters represented near four bits per parameter. The simple weight estimate begins near four billion bytes before metadata, scales, padding, runtime copies, workspace, and caches. Do not turn that arithmetic into a device recommendation. Add the measured artifact size, runtime overhead from the exact build, context-cache estimates for short and long requests, concurrent sequences, one loaded replica, and a declared headroom target. The result is a planning range. If the high end exceeds usable device memory, reject the scenario or reduce model, context, concurrency, or replicas before any load. If it fits on paper, proceed to isolated measurement. The estimate filters candidates; it never certifies capacity.

Visual alternative: The simple weight estimate is expanded into a planning range. The sheet explicitly says that fitting on paper does not certify the service.

Sources:

- <https://docs.docker.com/engine/containers/resource_constraints/>

## Narration: Load Profile Narration

Version a representative load profile. Include cold and warm starts, realistic input and output length distributions, modalities, concurrency steps, bursts, cancellations, timeouts, malformed requests, maximum allowed context, pressure, restart, and recovery. Measure time to ready, time to first output, inter-output latency when relevant, end-to-end latency percentiles, throughput, queue time, error and rejection rates, accelerator and host memory, compute utilization, storage, network, power where relevant, and restart time. Keep artifact, runtime, configuration, hardware, template, and cases constant when comparing candidates. Published benchmarks such as MLPerf can inform methods and candidate selection, but their workload, quality rules, software, and hardware describe their own result. They do not establish capacity for your request distribution or service policy.

Visual alternative: Each case records exact build identity, request distribution, expected threshold, measured latency, queueing, throughput, errors, resources, and recovery.

Sources:

- <https://mlcommons.org/benchmarks/inference-datacenter/>
- <https://onnxruntime.ai/docs/execution-providers/>

## Checkpoint: Benchmark Checkpoint

Checkpoint. A published benchmark reports high throughput on the same accelerator family. Name three differences that could make your endpoint's capacity lower, and state the measurement you still need.

Learner action: Name differences such as exact model, quantization, runtime, request lengths, concurrency, quality gate, server policy, or hardware configuration and require exact-build representative measurement.

Sources:

- <https://mlcommons.org/benchmarks/inference-datacenter/>

## Pause: Benchmark Response Time

## Feedback: Benchmark Feedback

A strong answer names the exact model and precision, software stack, request-length distribution, batching, concurrency, quality target, server limits, and full hardware configuration. The benchmark remains useful evidence about its stated setup. Your capacity requires the exact serving build under your versioned representative profile. If your answer copied the throughput number directly, replace it with a hypothesis and a measurement plan.

If correct: You kept the external result within its documented scope and required exact-build measurement.

If retrying: Identify which workload or stack assumption differs, then convert the external number into a hypothesis.

Sources:

- <https://mlcommons.org/benchmarks/inference-datacenter/>

## Narration: Saturation Narration

Increase concurrency and request size gradually until latency, queueing, memory, errors, power, or quality crosses a threshold declared in advance. Record the first limiting resource and failure mode. Repeat after restart and with neighboring workloads when resources are shared. Set container or scheduler requests and limits from evidence while preserving host headroom for the operating system, telemetry, recovery, and control plane. Docker notes that containers have no resource constraints by default, and memory pressure can lead to out-of-memory termination. Capacity therefore includes admission control, bounded queues, context and output limits, rate or concurrency limits, deadlines, cancellation, load shedding, stable overload responses, and bounded retry guidance. An endpoint that accepts unlimited work until the host fails does not have a capacity plan.

Visual alternative: Concurrency rises until a declared threshold is crossed. The service then bounds queues, contexts, outputs, rates, deadlines, shedding, and retries while preserving host headroom.

Sources:

- <https://docs.docker.com/engine/containers/resource_constraints/>
- <https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/>

## Narration: Capacity Decision Narration

Publish a dated capacity decision. State supported workload slices, tested concurrency, latency and throughput distributions, quality gates, resource reservations and limits, minimum headroom, overload behavior, replica assumptions, startup and recovery time, storage, power or cloud cost assumptions, monitoring thresholds, and excluded cases. Separate measurements from estimates and extrapolation. Define re-benchmark triggers: model revision, quantization, runtime, driver, device, host, operating system, container, context policy, batching, template, feature flags, traffic distribution, telemetry, or service objective. Capacity evidence expires when the production stack or workload no longer matches what was measured.

Visual alternative: Measured results are separated from estimates and extrapolations, and material model, stack, workload, or objective changes expire the decision.

Sources:

- <https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/>
- <https://mlcommons.org/benchmarks/inference-datacenter/>

## Learner Prompt: Activity Transition

Now build the measured-paper capacity plan. Complete the exact-stack matrix, estimate three context and concurrency scenarios, design cold, warm, steady, burst, boundary, overload, restart, and recovery cases, declare thresholds before viewing synthetic results, identify the first saturated resource, and publish supported slices, headroom, costs, overload behavior, exclusions, and re-benchmark triggers.

Learner action: Complete the compatibility matrix, planning ranges, versioned load profile, predeclared thresholds, saturation analysis, overload controls, and dated capacity decision.

Sources:

- <https://docs.docker.com/engine/containers/resource_constraints/>
- <https://mlcommons.org/benchmarks/inference-datacenter/>

## Pause: Activity Work Time

## Assessment Handoff: Assessment Handoff

Begin the check when you can identify the full compatibility stack, explain non-weight memory, choose a representative load profile, design overload behavior, bound external benchmark claims, and recognize re-benchmark triggers. The check starts only when you choose Begin knowledge check.

## Closing: Class Closing

Remember: compatibility is exact, sizing begins as a hypothesis, capacity comes from representative measurement, and every supported limit expires when its model, stack, workload, or objective changes.
