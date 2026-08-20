# Observe Agent Quality, Cost, and Risk: text-only class

This route contains the complete teaching content, learner actions, feedback,
and assessment handoff without requiring audio, video, or animation.

## Welcome: Welcome And Outcomes

Welcome. This class shows how to observe an agent system without turning telemetry into an uncontrolled copy of user data. You will connect causal spans, measure useful outcomes, minimize sensitive content, diagnose the first wrong transition, and prepare decision-ready human escalation.

## Narration: Signals Answer Different Questions

Use traces, metrics, logs, and evaluations together because each answers a different question. A trace reconstructs one run and its parent-child operations. Metrics reveal trends, distributions, and service-objective performance across many runs. Logs record discrete operational events. Evaluations judge behavior against cases and rubrics. None replaces the others. Begin with decisions the team must make: detect a quality regression, locate a failed boundary, control spend, prove an external postcondition, explain an escalation, or decide whether automated recovery is safe. Collect a signal only when it supports a named decision, control, or obligation. Request volume alone does not reveal useful outcomes. A full transcript alone does not reveal aggregate reliability and may violate data promises. Purpose should determine collection, resolution, access, retention, and deletion.

Visual alternative: Traces explain one run, metrics show trends, logs record events, and evaluations judge behavior against explicit expectations.

Sources:

- <https://openai.github.io/openai-agents-js/guides/tracing/>
- <https://google.github.io/adk-docs/observability/>
- <https://opentelemetry.io/docs/specs/semconv/registry/attributes/gen-ai/>

## Narration: Trace The Agent Graph

Preserve causal structure across the run. Assign the workflow a trace identifier. Give every agent step, model call, retrieval, tool call, approval, guardrail, handoff, verifier, and recovery action a span with its own identifier, parent linkage, timing, status, and failure class. Record stable references to workflow, prompt, model, tool, policy, content, adapter, and evaluation versions. Add low-cardinality fields for aggregation such as operation type and terminal state. Keep detailed evidence behind access-controlled references rather than copying it into searchable labels. Correlation and idempotency identifiers should connect provider requests and external effects without containing credentials or personal data. A portable span envelope lets different provider frameworks feed one product-level trace while preserving adapter-specific request IDs and feature limitations.

Visual alternative: Every span has trace, span, and parent identifiers plus operation, versions, timing, status, usage, and a redacted evidence reference.

Sources:

- <https://openai.github.io/openai-agents-js/guides/tracing/>
- <https://google.github.io/adk-docs/observability/>
- <https://opentelemetry.io/docs/specs/semconv/registry/attributes/gen-ai/>

## Narration: Measure Service And Quality

Measure outcomes, not activity alone. Track task success and independently verified completion beside policy violations, unsafe attempts, user correction, escalation, abandonment, tool and retrieval failures, retry rate, and unresolved outcomes. Measure latency as distributions and stage-level spans, not one average. Relate token use and estimated cost to verified successful tasks so optimization does not reward cheap failures. Segment by workflow and policy version, model, tool, journey, risk class, supported language, and other meaningful populations. Avoid high-cardinality labels that expose sensitive content or make metrics unusable. Alert on error-budget burn, critical policy events, duplicate-effect attempts, unresolved reconciliation, missing trace segments, and material quality changes. A healthy endpoint and growing request count can coexist with user harm, excessive cost, or declining completion.

Visual alternative: The catalog includes success, policy, correction, escalation, failures, retries, latency percentiles, cost per success, and trace completeness.

Sources:

- <https://google.github.io/adk-docs/observability/>
- <https://opentelemetry.io/docs/specs/semconv/registry/attributes/gen-ai/>
- <https://www.nist.gov/itl/ai-risk-management-framework>

## Narration: Privacy Preserving Telemetry

Assume model and tool content is sensitive. Inputs, outputs, retrieval queries, documents, tool arguments, results, and approval notes may contain personal data, credentials, customer content, or protected business information. Default to metadata, bounded classifications, hashes, and secure references. Capture raw content only for a documented purpose, permitted population, and controlled duration. Redact before export, isolate tenants, encrypt data, enforce role-based access, audit viewing, sample by risk and debugging need, and propagate deletion. Define residency and regional transfer rules where required. Short retention is a control, not an inconvenience. Never collect hidden reasoning as an operational requirement. A concise decision summary, tool record, evidence reference, and policy result support diagnosis without asking a model to reveal private internal reasoning. Observability that violates the product's data promises is itself an incident.

Visual alternative: Raw prompts, documents, tool payloads, credentials, personal data, and hidden reasoning are excluded or replaced by redacted evidence references.

Sources:

- <https://openai.github.io/openai-agents-js/guides/tracing/>
- <https://opentelemetry.io/docs/specs/semconv/registry/attributes/gen-ai/>
- <https://www.nist.gov/itl/ai-risk-management-framework>

## Narration: Trace Review And Escalation

Diagnose from the visible failure backward to the first wrong transition. Compare each span's actual input, output, authority, postcondition, and state with its contract. Classify the first divergence before changing a prompt: model, prompt, retrieval, data, tool, policy, orchestration, or infrastructure. A wrong final answer may begin with stale retrieval. A duplicate write may begin with a lost idempotency key. Contain ongoing risk and preserve redacted evidence. Escalate when a trace indicates unsafe action, cross-tenant data, repeated unknown outcomes, policy conflict, or impact beyond automated recovery. The human packet should contain a redacted timeline, affected targets, versions, confirmed facts, containment status, evidence references, remaining uncertainty, and the exact decision required. It should not contain secrets, unnecessary customer content, unsupported blame, or hidden reasoning.

Visual alternative: The visible failure occurs at completion, but stale retrieval is the first wrong transition; the packet includes timeline, target, containment, evidence, uncertainty, and required decision.

Sources:

- <https://openai.github.io/openai-agents-js/guides/tracing/>
- <https://google.github.io/adk-docs/observability/>
- <https://www.nist.gov/itl/ai-risk-management-framework>

## Demonstration: Causal Review Demonstration

A support agent claims a policy exception. The final model span looks fluent and the tool span succeeded. Walking backward reveals that retrieval selected an expired policy because the content-version filter was missing. The verifier checked citation format but not effective date. Classify the first divergence as retrieval or data freshness, not model style. Disable the affected route, preserve the content and workflow version references, add a dated-policy regression case, and give the reviewer a redacted timeline. Changing temperature would not repair the failed boundary.

Visual alternative: The first wrong transition is the retrieval filter, followed by a verifier that checked citation shape but not effective date.

Sources:

- <https://google.github.io/adk-docs/observability/>
- <https://www.nist.gov/itl/ai-risk-management-framework>

## Learner Prompt: Learner Telemetry Prompt

Choose one raw telemetry field from an agent workflow. State the operator decision it supports, then replace it with the least sensitive metadata, classification, hash, or secure reference that still supports that decision.

Learner action: Minimize one sensitive field while preserving its documented operational purpose.

## Pause: Learner Work Time

## Checkpoint: Escalation Packet Checkpoint

Checkpoint. Should a human escalation packet include full customer prompts and hidden model reasoning by default so the reviewer has every detail?

Learner action: Reject default disclosure and provide only redacted, decision-relevant evidence.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>

## Pause: Checkpoint Response Time

## Feedback: Escalation Packet Feedback

No. Give the reviewer a redacted timeline, targets, versions, containment, evidence references, uncertainty, and required decision. Include content only when policy, purpose, permission, access, and retention justify it. Hidden reasoning is not required for operational accountability. If you chose full capture for convenience, return to data minimization. If you removed every detail, add enough governed evidence to reproduce the state transition and decide containment or recovery.

If correct: You preserved useful causal evidence without treating sensitive content or hidden reasoning as default telemetry.

If retrying: List only the fields required to understand impact, containment, and the human decision.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>
- <https://opentelemetry.io/docs/specs/semconv/registry/attributes/gen-ai/>

## Transition: Activity Transition

Open the trace review activity. Define spans for agent, model, retrieval, tool, approval, handoff, verification, and recovery. Add quality, safety, reliability, latency, token, cost, and escalation metrics. Write the telemetry policy, diagnose one failed trace, and prepare the redacted human-escalation packet.

## Pause: Activity Work Time

## Assessment Handoff: Assessment Handoff

When ready, begin the knowledge check. You will choose linked traces for causal review, relate cost to successful outcomes, minimize raw content, find the first wrong transition, and build a safe escalation packet.

## Closing: Class Closing

Collect signals for decisions, preserve causal structure, measure outcomes, minimize sensitive data, find the first wrong transition, and escalate with redacted evidence.
