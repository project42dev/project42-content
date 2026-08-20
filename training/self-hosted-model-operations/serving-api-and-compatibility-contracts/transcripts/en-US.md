# Expose a Model Service without Hiding Its Contract

Package: `serving-api-and-compatibility-contracts-class` 1.0.0

> This is the canonical text equivalent of an AI-assisted virtual-instructor
> class. It remains usable without synthesized audio, video, animation, or a
> player runtime.

## Welcome: Welcome And Outcomes

Welcome. This class turns a running model process into a service contract an application can depend on and an operator can replace safely. You will separate serving layers, distinguish process health from exact-model readiness, define inference and failure behavior before traffic arrives, test compatibility as a bounded subset, and preserve a portable adapter with a reversible cutover. One successful chat request is a demonstration, not a compatibility proof.

## Narration: Serving Layers Narration

Separate the layers and give each one a visible responsibility. The model runtime loads and executes the artifact. The inference server exposes runtime operations through a network protocol. A gateway authenticates callers, authorizes operations, applies body, rate, concurrency, and cost limits, routes requests, records policy decisions, and provides a stable external name. The application adapter maps product-owned requests, outcomes, errors, and telemetry to a selected serving protocol. The public contract is what approved clients may rely on. Keep identity, authorization, and policy outside model prompts. Do not let replacing a runtime silently change learner-facing behavior or weaken access controls. Bind every friendly served-model name to the exact immutable model and runtime bundle. Responses, traces, evaluations, incidents, and rollback records preserve that underlying identity even when clients use an alias.

Sources:

- <https://kserve.github.io/website/docs/concepts/architecture/data-plane/v2-protocol>
- <https://docs.vllm.ai/en/latest/serving/openai_compatible_server/>

## Demonstration: Layer Demonstration

Consider an application that submits a document question and expects a structured answer, cited evidence, one stable error taxonomy, and an audit identifier. Runtime A uses one chat field and one streaming event shape. Runtime B uses different field names and emits usage only at the end. The application should not learn both protocols. Two adapters map the same product request and outcome contract while the gateway enforces the same identity and limits. If Runtime B cannot preserve a required citation, cancellation, or error behavior, the adapter reports the capability unavailable. It must not fabricate equivalence or silently drop the field.

Sources:

- <https://docs.vllm.ai/en/latest/serving/openai_compatible_server/>
- <https://developers.openai.com/api/reference/resources/chat/subresources/completions/methods/create>

## Narration: Health Identity Narration

Define health states separately. Liveness asks whether the server process is functioning enough that the supervisor should leave it running. It should not fail merely because every downstream dependency is unavailable. Instance readiness asks whether this instance should receive inference traffic. Model readiness confirms that the intended model and exact version are loaded and can serve the required contract. Model metadata exposes the served identity and supported contract without revealing credentials, internal paths, or unnecessary infrastructure. KServe's Open Inference Protocol version two separates server live, server ready, model ready, model metadata, and inference endpoints. Whatever protocol you choose, test startup, artifact loading, warm-up, pressure, dependency failure, unload, update, rollback, and shutdown transitions. A process can return HTTP two hundred while the wrong model, wrong adapter, or incomplete warm-up is present. That process may be live and still must not be ready.

Sources:

- <https://kserve.github.io/website/docs/concepts/architecture/data-plane/v2-protocol>
- <https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/>

## Checkpoint: Readiness Checkpoint

Checkpoint. The server process responds to its health endpoint, but telemetry shows it loaded the previous model revision after an update. Should it be live, ready, both, or neither, and what must happen next?

Expected learner action: Classify the process as potentially live but not ready, remove it from inference routing, and reconcile or restore the approved exact bundle.

Sources:

- <https://kserve.github.io/website/docs/concepts/architecture/data-plane/v2-protocol>

## Pause: Readiness Response Time

## Feedback: Readiness Feedback

A strong answer says the process may be live because it responds, but it is not model-ready for the approved contract. Remove it from inference routing, preserve exact identity evidence, reconcile why the prior revision loaded, then load or restore a verified bundle and repeat readiness and conformance checks. Restarting without identifying the bundle can repeat the same failure. If your answer marked it ready because the port opened, revise the rule: readiness includes the intended model identity and contract.

Correct feedback: You separated process health from model readiness and required exact-bundle reconciliation before routing.

Retry feedback: Include the intended model identity and serving contract in the readiness decision.

Sources:

- <https://kserve.github.io/website/docs/concepts/architecture/data-plane/v2-protocol>
- <https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/>

## Narration: Inference Contract Narration

Own the inference and failure contract. Version allowed fields, roles or input parts, modalities, encodings, context and output limits, sampling controls, stop rules, optional tools, response schema, exact model identity, usage accounting, finish reasons, policy outcomes, and extension fields. Reject unsupported or ambiguous inputs instead of ignoring them. Define authentication and object authorization outside the prompt. Specify request and correlation identifiers, body limits, deadlines, cancellation, streaming event order, disconnect behavior, queue and rate limits, overload status, retryability, stable error codes, telemetry identifiers, redaction, and postconditions. A timeout does not automatically prove that no work occurred. A retry policy must classify the failure, reconcile any external effect, and remain bounded. One overloaded client must not multiply load through unbounded retries.

Sources:

- <https://developers.openai.com/api/reference/resources/chat/subresources/completions/methods/create>
- <https://kserve.github.io/website/docs/concepts/architecture/data-plane/v2-protocol>

## Narration: Compatibility Narration

Treat compatibility as a tested subset. A server described as OpenAI-compatible may implement selected paths and fields while differing in model discovery, roles, tools, structured output, streaming chunks, token accounting, errors, limits, extensions, or parameter handling. vLLM documents an OpenAI-compatible server, but application compatibility still depends on the exact vLLM version, endpoint, model, configuration, and features the application uses. Build a conformance matrix for the product-owned subset. Label every behavior required, transformed, ignored, emulated, rejected, or unavailable. Test normal, boundary, invalid, unauthorized, rate-limited, overloaded, timeout, cancellation, streaming, restart, and recovery cases. Verify status, body, event sequence, identity, usage, error category, and telemetry. Never infer full equivalence from matching URL paths or one successful response.

Sources:

- <https://docs.vllm.ai/en/latest/serving/openai_compatible_server/>
- <https://developers.openai.com/api/reference/resources/chat/subresources/completions/methods/create>

## Narration: Adapter Cutover Narration

Keep user outcomes, application schemas, authorization policy, evaluation cases, trace fields, postconditions, error categories, and recovery rules above runtime adapters. Put server-specific field names, streaming events, tool formats, and extensions inside adapters. Portability does not mean hiding important differences behind the lowest common denominator. Expose capabilities and safety differences explicitly. For a runtime change, run identical conformance and evaluation suites against baseline and candidate. Compare quality, security, latency, capacity, streaming, cancellation, failures, and observability. Canary a bounded route, preserve exact identities in telemetry, and retain the last verified adapter and serving bundle. Roll back on any critical contract, quality, security, performance, capacity, or evidence regression.

Sources:

- <https://docs.vllm.ai/en/latest/serving/openai_compatible_server/>
- <https://kserve.github.io/website/docs/concepts/architecture/data-plane/v2-protocol>

## Learner Prompt: Activity Transition

Now design the portable serving conformance suite. Define separate health, readiness, identity, inference, stream, cancellation, timeout, invalid-input, unauthorized, rate-limit, and overload contracts. Map one application schema to two hypothetical adapters. Label each behavior required, transformed, ignored, emulated, rejected, or unavailable. Write deterministic normal, boundary, failure, restart, and recovery cases, then define cutover thresholds, canary scope, stop conditions, and rollback evidence.

Expected learner action: Complete the endpoint and error contract, two-adapter matrix, deterministic conformance fixtures, and reversible baseline-candidate cutover decision.

Sources:

- <https://kserve.github.io/website/docs/concepts/architecture/data-plane/v2-protocol>
- <https://docs.vllm.ai/en/latest/serving/openai_compatible_server/>

## Pause: Activity Work Time

## Assessment Handoff: Assessment Handoff

Begin the check when you can place protocol translation in the adapter, distinguish liveness from readiness, bound compatibility claims, reject unsupported fields, design representative conformance cases, and plan a tested cutover and rollback. The check starts only when you choose Begin knowledge check.

## Closing: Class Closing

Remember: a stable service owns its behavior above the runtime, proves exact readiness, calls compatibility only what it tests, and keeps every serving change observable and reversible.
