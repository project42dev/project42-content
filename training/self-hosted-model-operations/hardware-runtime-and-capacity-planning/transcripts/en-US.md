# Hardware, Runtime, and Capacity Planning

Package: `hardware-runtime-and-capacity-planning-class` 2.0.0

> This is the canonical text equivalent of an AI-assisted virtual-instructor
> class. It remains usable without synthesized audio, video, animation, or a
> player runtime.

## Welcome: Welcome And Outcomes

Welcome to Hardware, Runtime, and Capacity Planning. This lesson answers a practical question without pretending that a paper estimate is a benchmark: what exact serving build can support which workload, and under what limits? We will build a compatibility matrix, estimate accelerator, host, and storage needs, measure a representative request profile, find the first saturation boundary, protect the host during overload, and issue a dated capacity decision. The examples are deterministic offline fixtures. They do not execute a model, benchmark an accelerator, contact a cloud provider, or approve a deployment. By the end, you will have a reproducible plan with evidence labels, arithmetic, limits, exclusions, and triggers for measuring again.

## Narration: Compatibility Narration

Start with the whole stack, not the model name. Record the model architecture, artifact revision and digest, tensor format, precision or quantization, tokenizer, prompt template, maximum tested context, runtime and version, execution backend, operating system, CPU architecture, accelerator model and count, driver, compute library, container base, and required extensions. For every cell, use one evidence label: documented, measured, inferred, or unknown. Documented means a cited source states the exact value or support claim. Measured means the exact build produced retained evidence. Inferred means a calculation or analogy suggests the value, but has not established it. Unknown means evidence is absent. A model family name never upgrades an exact quantization, kernel, device, driver, or runtime combination to compatible. Load the exact artifact in quarantine, make fallback visible, and either accept or reject it using measured quality, latency, resource, and cost evidence. The synthetic matrix calls its architecture an exercise transformer and its artifact a fixture-only digest. Its runtime is a Node.js 22 native module calculator, and its execution backend is arithmetic only. The learner host operating system and CPU are unknown until recorded. The proposed single 24 GiB-class device is only an inferred sizing target. Because the real artifact, inference runtime, accelerator, driver, and library are unknown, this matrix cannot approve a real deployment. Official ecosystem repositories are discovery evidence, not proof of an interchangeable serving stack.

Sources:

- <https://onnxruntime.ai/docs/execution-providers/>
- <https://nodejs.org/api/esm.html>

## Checkpoint: Compatibility Checkpoint

Checkpoint. The arithmetic fits below a 24 GiB device limit, but the exact quantized artifact and driver have not been loaded. Should those matrix cells be marked measured, inferred, or unknown, and what test resolves the uncertainty?

Expected learner action: Choose unknown for the exact compatibility cells and propose a quarantined load of the exact artifact on the exact stack.

Sources:

- <https://onnxruntime.ai/docs/execution-providers/>

## Pause: Compatibility Pause

## Feedback: Compatibility Feedback

The correct answer is unknown, not measured. Arithmetic establishes capacity size, not loading or execution compatibility. A quarantined integration test with the exact artifact, runtime, backend, device, driver, and operating system can produce measured evidence. If you selected inferred, keep that label only for the proposed sizing target, not for successful execution. If you selected measured because the numbers fit, return to the evidence rule: size and compatibility are separate claims.

Correct feedback: You separated capacity arithmetic from exact-stack compatibility and required a quarantined integration test.

Retry feedback: Mark exact execution compatibility unknown, then name the exact-stack quarantine test that would make it measured.

Sources:

- <https://onnxruntime.ai/docs/execution-providers/>

## Narration: Estimate Memory And Storage Narration

Now estimate memory and storage before measuring. Keep decimal gigabytes and binary gibibytes separate. One GB is 1,000,000,000 bytes, while one GiB is 1,073,741,824 bytes. Accelerator memory, host memory, and storage are separate ledgers. A free accelerator GiB cannot compensate for exhausted host memory or storage. Begin with exact artifact size and a rough weight estimate. Then add quantization metadata, embeddings, runtime workspace, graph and kernel caches, temporary buffers, loaded replicas, dynamic request cache, and safety headroom. For the host, include the runtime, tokenizer, queues, observability, page cache, staging, failure handling, and recovery. For storage, include immutable artifacts, container layers, caches, logs, evaluation data, backups, and a distinct rollback copy. Startup arithmetic is also only a hypothesis until measured on the exact build.

Sources:

- <https://docs.docker.com/engine/containers/resource_constraints/>
- <https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/>

## Demonstration: Sizing Demonstration

Here is the worked synthetic calculation. The fixture has 16 billion parameters at 4 bits per parameter. Compute 16,000,000,000 times 4, divided by 8. That is 8,000,000,000 bytes, or 8 GB, approximately 7.451 GiB. The exercise rounds the loaded static allocation upward to 10 GiB. Add 2 GiB of workspace and 2 GiB of accelerator safety headroom. The base is therefore 10 plus 2 plus 2, which equals 14 GiB. The dynamic cache rate is a fixed fixture assumption: 0.5 GiB per concurrent request per 1,000 maximum tokens. It is not a claim about a real model or runtime. The formula is concurrency times maximum tokens divided by 1,000, times 0.5. Scenario A has 2 requests and 2,000 tokens. Its dynamic cache is 2 times 2 times 0.5, or 2 GiB. Total is 14 plus 2, or 16 GiB. Scenario B has 4 requests and 4,000 tokens. Dynamic cache is 4 times 4 times 0.5, or 8 GiB. Total is 14 plus 8, or 22 GiB. Scenario C has 5 requests and 4,000 tokens. Dynamic cache is 5 times 4 times 0.5, or 10 GiB. Total is 14 plus 10, or 24 GiB. Against the predeclared 23 GiB admission ceiling, A and B fit, while C must be rejected. The defective calculator reports zero dynamic cache and therefore wrongly admits all three. The independent host ledger is 6 plus 2 plus 1 plus 2 plus 2 plus 2 plus 3, or 18 GiB, against a 24 GiB limit. Storage is 12 plus 4 plus 6 plus 5 plus 3 plus 12 plus 12, or 54 GiB, against an 80 GiB ceiling, including separate backup and rollback. Startup is 12 GB divided by 1.5 GB per second, or 8 seconds under an idealized constant-bandwidth assumption. Cost is 2 dollars and 40 cents times 24 hours, or 57 dollars and 60 cents per replica-day. These are fixture calculations, not measurements or a quote.

Sources:

- <https://docs.docker.com/engine/containers/resource_constraints/>

## Narration: Measure Representative Load Narration

Measure a versioned request distribution, not one convenient request. Include cold and warm starts, input and output lengths, concurrency steps, bursts, cancellations, timeouts, malformed requests, maximum context, overload, restart, and recovery. Record time to ready, time to first output, inter-output latency where relevant, end-to-end latency percentiles, throughput, queue time, internal errors, controlled rejections, accelerator and host memory, utilization, storage, network, power where relevant, and restart time. Hold the artifact, runtime, configuration, hardware, template, and request cases constant when comparing builds. For nearest-rank p95, sort observations and choose rank ceiling of 0.95 times n, using one-based ranks. Successful throughput is completed requests divided by duration. Internal error rate is internal errors divided by admitted requests. A zero admitted denominator is invalid, not zero percent. Rejection rate is rejected requests divided by offered requests.

Sources:

- <https://mlcommons.org/benchmarks/inference-datacenter/>
- <https://onnxruntime.ai/docs/execution-providers/>

## Demonstration: Load Profile Demonstration

Apply the contract to the supplied synthetic traces. Warmup has two requests after a cold start, with 45 seconds to ready. Its latencies are 1,800 and 1,200 milliseconds, so warmup is excluded from steady latency objectives. Steady state offers 10 requests over one second. The sorted latency list ends at 700 milliseconds, and the sorted queue list ends at 40 milliseconds. Because there are 10 observations, rank ceiling of 9.5 is 10. Therefore p95 latency is 700 milliseconds and p95 queue is 40 milliseconds. Throughput is 10 completions divided by 1 second, or 10 requests per second. With zero errors among 10 admitted requests, internal error rate is zero percent. Accelerator allocation is 22 GiB and host allocation is 18 GiB. It passes thresholds of 800 milliseconds, 100 milliseconds, 8 requests per second, 1 percent errors, 23 GiB accelerator, and 24 GiB host. Burst p95 latency is 780 milliseconds and p95 queue is 90 milliseconds, with 10 requests per second, so it passes. Maximum context has five requests at 4,000 tokens. Its p95 latency is 790 milliseconds and throughput is 5 requests per second, passing the separate 4 requests per second boundary. Overload offers 10 requests at concurrency 5. Correct arithmetic requires 24 GiB, so all 10 are rejected before execution for capacity_limit. Rejection is 10 divided by 10, or 100 percent. Internal error rate is not applicable because zero requests were admitted. Cancellation records one client cancellation, four completions, and zero internal errors. Restart is 45 seconds, below the 60-second limit. Recovery returns to p95 latency 720 milliseconds and p95 queue 45 milliseconds, with 10 requests per second, so it passes the steady thresholds.

Sources:

- <https://mlcommons.org/benchmarks/inference-datacenter/>

## Checkpoint: Benchmark Checkpoint

Checkpoint. The overload row says zero internal errors. Is that a zero percent rate, or is the rate not applicable? Explain why, and separately calculate the rejection rate.

Expected learner action: Checkpoint. The overload row says zero internal errors. Is that a zero percent rate, or is the rate not applicable? Explain why, and separately calculate the rejection rate.

## Pause: Benchmark Response Time

## Feedback: Benchmark Feedback

The internal error rate is not applicable because the denominator, admitted requests, is zero. Calling it zero percent hides the absence of an eligible denominator. The controlled rejection rate is 10 divided by 10, or 100 percent, with reason capacity_limit. That is an intentional overload policy result, not an internal model error. If warmup was included in steady p95, restore the declared population and recompute rather than mixing cold-start behavior into the steady objective.

Correct feedback: You kept rejection and internal errors separate and recognized the zero admitted denominator.

Retry feedback: Internal errors are divided by admitted requests. With zero admitted requests, report not applicable, then calculate 10 rejected out of 10 offered.

## Narration: Find Saturation And Protect Host Narration

Find saturation by increasing concurrency and request size gradually until a declared boundary is crossed. Record the first limiting resource and failure mode. In this fixture, 2 requests at 2,000 tokens require 16 GiB, 4 at 4,000 require 22 GiB, and 5 at 4,000 require 24 GiB. The first boundary is the accelerator admission ceiling, caused by dynamic per-request cache. This is arithmetic evidence, not an observed hardware out-of-memory event. The policy admits at most 4 concurrent requests when each may reach 4,000 tokens. Validate units and token fields, reject over-limit work before allocation with capacity_limit, and do not automatically retry a nontransient capacity rejection. Keep a bounded queue outside the calculator, and preserve the 1 GiB gap between the 23 GiB admission ceiling and a nominal 24 GiB device class. Separately protect the host. The 24 GiB host limit includes 3 GiB recovery headroom. Container and scheduler requests or limits are controls, not proof of application fit. A deny-all repair is also wrong: it would reject safe Scenario B. Raising the ceiling changes the policy rather than fixing the missing cache term.

Sources:

- <https://docs.docker.com/engine/containers/resource_constraints/>
- <https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/>

## Narration: Capacity Decision Narration

Issue a dated decision with scope and expiry. State supported workload slices, tested concurrency, latency and throughput distributions, quality gates, resource reservations and limits, headroom, overload behavior, replica assumptions, startup and recovery, storage, cost assumptions, monitoring thresholds, and excluded cases. The fixture decision dated September 21, 2026 supports Scenario B at no more than 4 concurrent requests and 4,000 maximum tokens because calculated accelerator allocation is 22 GiB under the 23 GiB ceiling. It rejects Scenario C at 5 concurrent requests because allocation is 24 GiB. Host is 18 GiB against 24 GiB. Storage is 54 GiB against 80 GiB. Idealized transfer is 8 seconds, restart is 45 seconds, and illustrative cost is 57 dollars and 60 cents per replica-day. This is not real deployment approval. Exact compatibility, latency, throughput, memory rate, power, quality, startup, and recovery for a real model remain unknown. Re-benchmark after a model revision, digest, quantization, tokenizer, template, runtime, backend, driver, library, accelerator, host, operating system, container, batching or context policy, feature flag, telemetry change, traffic change, neighboring workload, quality gate, cost basis, or service-objective change. The module also has a 60-day review cadence. Evidence expires when the measured stack or workload no longer matches production.

Sources:

- <https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/>
- <https://mlcommons.org/benchmarks/inference-datacenter/>

## Checkpoint: Capacity Decision Checkpoint

Checkpoint. May this deterministic fixture be written as approval for a real service because Scenario B passes its arithmetic? State the strongest conclusion that the evidence supports.

Expected learner action: Checkpoint. May this deterministic fixture be written as approval for a real service because Scenario B passes its arithmetic? State the strongest conclusion that the evidence supports.

## Pause: Capacity Decision Pause

## Feedback: Capacity Decision Feedback

The supported conclusion is narrower: the deterministic capacity policy behaves as specified for the synthetic Scenario B slice, while Scenario C is rejected. It does not approve a real deployment. The unknown exact compatibility cells require a quarantined integration load, and synthetic latency, throughput, memory, power, quality, startup, and recovery values require representative exact-build measurements. A capacity decision is versioned evidence with exclusions and expiry, not a permanent approval.

Correct feedback: You limited the conclusion to deterministic fixture behavior and preserved unknown real-stack evidence.

Retry feedback: Replace real approval with a bounded synthetic policy result and list the exact-stack measurements still required.

## Learner Prompt: Activity Transition

Now build the measured-paper capacity plan. Create the exact-stack matrix and label every field. Estimate all three accelerator scenarios, plus host, storage, rollback, startup, and cost. Design the versioned load profile with warmup, steady, burst, maximum context, overload, cancellation, restart, and recovery. Declare thresholds before inspecting results. Identify accelerator cache as the first fixture boundary, preserve host recovery headroom, and write supported slices, limits, costs, exclusions, overload behavior, and re-benchmark triggers. Then repair the offline lab. The starter has one defect: dynamicGiB is assigned zero. Edit only capacity.mjs and replace that assignment with concurrency times maximum tokens divided by 1,000, times cacheGiBPerKTokens. Do not edit validation, fixtures, the independent reference, or tests. Do not hardcode scenario names, totals, or unconditional denial.

Expected learner action: Complete the matrix, ledgers, profile, thresholds, decision, repair, and evidence record, then run the supplied commands.

Sources:

- <https://nodejs.org/api/esm.html>
- <https://docs.docker.com/engine/containers/resource_constraints/>

## Demonstration: Lab Executable Entry

The lab is offline and deterministic. It has no dependencies, model download, cloud call, credential, container, or charge. The supplied starter outputs show base-safe with dynamicGiB zero, totalGiB 14, and admit true. The changed-overload starter also shows dynamicGiB zero, totalGiB 14, and admit true, which is wrong because its cache is omitted. The starter test reports two passes and two failures. After the one-line formula repair, the supplied base output has dynamicGiB 8, totalGiB 22, withinLimit true, and admit true. The supplied changed-overload output has dynamicGiB 10, totalGiB 24, withinLimit false, and admit false. The immutable test reports four passes and zero failures. A false result for every input would not be a repair because it would reject the genuine 22 GiB base case. The validator must also remain unchanged, so malformed JSON or invalid fields continue to be rejected rather than being silently accepted.

Sources:

- <https://nodejs.org/api/esm.html>

## Learner Prompt: Changed Input Prompt

Changed-input task. Copy the changed-overload fixture into a repository-local workspace. Change only workload concurrency from 5 to 3. Before running the repaired calculator, predict the result. Keep maximum tokens at 4,000, base at 14 GiB, cache rate at 0.5 GiB, and all host and storage inputs unchanged. Write the dynamic cache, total, within-limit result, and admission decision. Also explain why this changed valid input defeats a solution hardcoded to the two supplied scenario names.

Expected learner action: Predict dynamicGiB 6, totalGiB 20, withinLimit true, and admit true before running the independent variation.

## Pause: Changed Input Pause

## Feedback: Changed Input Feedback

Now compare with the answer. Dynamic cache is 3 times 4 times 0.5, which equals 6 GiB. Total is 14 plus 6, which equals 20 GiB. Twenty is below the 23 GiB ceiling, so withinLimit is true and admit is true, assuming host and storage remain within their limits. The result must retain the copied scenario string while changing those calculated values. This changed input defeats hardcoded handling because the formula responds to concurrency. It also defeats deny-all logic, because this valid case must be admitted. If the result differs, inspect whether the formula reads concurrency, maximum tokens, and the cache rate, then preserve validation and the conjunction of accelerator, host, and storage checks.

Correct feedback: You calculated the changed valid case from its inputs and preserved admission for safe capacity.

Retry feedback: Recompute 3 times 4 times 0.5, then add 6 to the 14 GiB base. Check that the admission conjunction remains intact.

## Assessment Handoff: Assessment Handoff

Begin the knowledge check when you can explain the complete compatibility stack, why weight memory alone is insufficient, how a representative profile differs from an unrelated benchmark, how admission and overload controls protect the host, why controlled rejection is distinct from internal error, and when capacity must be re-benchmarked. The check contains six questions. You need at least 80 percent. Choose Begin knowledge check when you are ready. The activity and check are separate, so you may return to the worksheet first.

## Closing: Class Closing

Take away four rules. Compatibility is exact and evidence-labeled. Sizing is a hypothesis that must include dynamic cache, workspace, host, storage, recovery, and headroom. Capacity comes from a versioned representative profile with explicit percentile and denominator rules. Finally, a decision is bounded: it names supported slices, admission behavior, costs, exclusions, and the changes that require a new benchmark. In this fixture, 22 GiB is admitted, 24 GiB is rejected at a 23 GiB ceiling, and neither result certifies a real model service. Keep the arithmetic, the unknowns, and the evidence together.
