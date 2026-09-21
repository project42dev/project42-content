# Observe Agent Quality, Cost, and Risk: text-only class

This route contains the complete teaching content, learner actions, feedback,
and assessment handoff without requiring audio, video, or animation.

## Welcome: Welcome And Outcomes

Welcome. This class shows how to observe an agent system without turning telemetry into an uncontrolled copy of user data. You will connect causal spans, measure useful outcomes, minimize sensitive content, diagnose the first wrong transition, repair one deterministic privacy defect, and prepare a decision-ready human escalation. The examples are synthetic. A passing exercise is not evidence that a production system is instrumented safely.

Visual alternative: A redacted trace is shown with quality, safety, reliability, latency, cost, and escalation measures.

## Narration: Signals Answer Different Questions

Use traces, metrics, logs, and evaluations together because each answers a different question. A trace reconstructs one run and its parent-child operations. Metrics reveal trends, distributions, and service objectives across many runs. Logs record discrete operational events. Evaluations judge behavior against an explicit rubric. None replaces the others. Begin with a decision the team must make. Perhaps you need to detect a regression, locate a failed boundary, control spend, explain an escalation, or prove that a postcondition held. Collect only signals that support a named decision, control, or obligation. A quality metric can show that successful completion declined after a workflow release, but it cannot localize the retrieval, approval, or tool boundary that failed in one run. A trace can localize that run. An evaluation can judge whether the final behavior met the task rubric. A log can record that an escalation packet was created. Request volume alone is not an outcome, and a full transcript alone is not aggregate reliability. Also remember the boundary of this lesson. The lab uses deterministic JSON fixtures. It does not prove that a deployed system creates spans at real workflow boundaries, propagates identifiers across external calls, or exports genuine provider and tool outcomes.

Visual alternative: Traces explain one run, metrics show trends, logs record events, and evaluations judge behavior against expectations.

Sources:

- <https://openai.github.io/openai-agents-js/guides/tracing/>
- <https://adk.dev/observability/>
- <https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/registry/attributes/gen-ai.md>

## Narration: Trace The Agent Graph

Preserve causal structure across the run. Give the workflow a trace identifier. Give each agent step, model call, retrieval, tool call, approval, handoff, verifier, and recovery step a span with its own identifier, parent linkage, timing, status, and failure class. Record stable references to workflow, prompt, model, tool, policy, and content versions. A portable span envelope includes the trace identifier, span identifier, parent identifier, operation, version references, start and end times, status, failure class, usage, retries, estimated cost, and a redacted evidence reference. Use low-cardinality fields such as operation type and terminal state for aggregation. Keep detailed evidence behind access-controlled references. A span contract says what must be true before and after an operation. Preparation may produce a non-executing action plan. Approval may authorize or deny it. Verification may confirm that no side effect occurred after denial. Status alone is not enough. Record a compact outcome such as prepared, denied, recovered, escalated, or verified no effect. Correlation identifiers can connect provider requests and external effects, but they must be random or otherwise non-semantic. Do not put an email address, account number, customer name, prompt text, or sensitive value in an identifier or metric label.

Visual alternative: Every span has trace, span, and parent identifiers, an operation, versions, timing, status, usage, and a redacted evidence reference.

Sources:

- <https://openai.github.io/openai-agents-js/guides/tracing/>
- <https://adk.dev/observability/>
- <https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/registry/attributes/gen-ai.md>

## Narration: Measure Service And Quality

Measure outcomes, not activity alone. Track task success and verified completion beside policy violations, unsafe attempts, user corrections, escalations, abandonment, tool and retrieval failures, retries, latency, token use, and cost per successful task. Segment these measures by workflow version, model, tool, user journey, risk class, language, and other supported groups. Define every metric before graphing it. Outcome says what happened to the task. Quality compares behavior with a rubric. Safety records attempted and prevented violations separately. Reliability records whether required boundaries completed and whether recovery restored a valid state. Escalation records both the trigger and whether a human decision was requested. State whether token and cost fields are provider-reported, locally counted, or estimated. For the supplied fixture, use nearest rank across all eight spans, including the root agent span. The ordered latency values are 15, 20, 25, 30, 40, 60, 120, and 900 milliseconds. The fourth value is the nearest rank for eight observations at the fiftieth percentile, so p50 is 30 milliseconds. The nearest rank for the ninety-fifth percentile is the eighth value, so p95 is 900 milliseconds. These are exercise results, not production objectives. The exercise cost convention is 0.001 dollars per token. The model span has 180 input tokens plus 40 output tokens, for 220 total tokens. Multiply 0.001 by 220: the estimated cost is 0.220 dollars. This is a local exercise estimate, not a provider invoice. Any clear-text approval argument is an immediate privacy alert in this exercise. An action after denial is an immediate safety alert. An unknown final verification enters human escalation. Product owners must select real thresholds from representative traffic.

Visual alternative: The latency values produce p50 of 30 milliseconds and p95 of 900 milliseconds; 180 plus 40 tokens at 0.001 dollars per token produces 0.220 dollars.

Sources:

- <https://adk.dev/observability/>
- <https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/registry/attributes/gen-ai.md>
- <https://www.nist.gov/itl/ai-risk-management-framework>

## Narration: Privacy Preserving Telemetry

Assume model and tool content is sensitive. Inputs, outputs, retrieval queries, documents, tool arguments, results, and approval notes may contain personal data, secrets, customer content, or protected business information. Default to metadata and secure references. The lesson default exports operation names, opaque identifiers, version references, status, duration, aggregate token counts, estimated cost, and redacted field-name summaries. It does not export full prompts, hidden reasoning, credentials, raw retrieval documents, argument values, or result bodies. A complete telemetry policy answers eight questions. What purpose requires each field? What redaction runs before export? Which approved population, if any, permits content capture? What risk-based sampling rule selects runs? Which role may read each data class? When is each class removed? How does subject or tenant deletion propagate to telemetry and backups? Which approved region permits collection, processing, and storage? Apply redaction before export, isolate tenants, encrypt data, enforce role-based access, audit access, use short retention, propagate deletion, and apply regional controls. Sample because of risk and debugging need, not merely because storage is available. Synthetic canaries can test leakage. Never insert a real secret to test redaction. Observability that violates the product's data promises is an operational failure.

Visual alternative: Raw prompts, documents, tool payloads, credentials, personal data, and hidden reasoning are excluded or governed by explicit policy.

Sources:

- <https://openai.github.io/openai-agents-js/guides/tracing/>
- <https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/registry/attributes/gen-ai.md>
- <https://www.nist.gov/itl/ai-risk-management-framework>

## Narration: Trace Review And Escalation

Begin at the user-visible failure, then walk backward to the first span whose actual state diverged from its expected contract. Compare input, output, authority, postcondition, and state at each boundary. Classify the first divergence before changing a prompt. Possible classes include model, prompt, tool, retrieval, data, policy, infrastructure, and orchestration. Escalate when the trace indicates an unsafe action, cross-tenant data, repeated unknown outcomes, policy conflict, or impact beyond automated recovery. Give the human a redacted timeline, affected targets, containment status, evidence references, confirmed facts, remaining uncertainty, and the exact decision required. Do not include secrets, unnecessary customer content, unsupported blame, or hidden reasoning. For this synthetic case, the packet identifies trace tr demo seven, workflow version wf three, and a synthetic account target. The issue is clear-text approval arguments in telemetry. Containment is to disable the affected exporter route and restrict trace access. The verified workflow effect is no external action. Evidence references are the approval span and verifier span. The requested decision is to authorize a redacted re-export and deletion of the defective record. The packet excludes full prompts, hidden reasoning, and argument values.

Visual alternative: The packet contains a trace, workflow version, synthetic target, privacy issue, containment, no external effect, evidence pointers, and a required decision.

Sources:

- <https://openai.github.io/openai-agents-js/guides/tracing/>
- <https://adk.dev/observability/>
- <https://www.nist.gov/itl/ai-risk-management-framework>

## Demonstration: Causal Review Demonstration

A support agent claims a policy exception. The final model span looks fluent and the tool span succeeded. Walking backward reveals that retrieval selected an expired policy because the content-version filter was missing. The verifier checked citation format but not effective date. Classify the first divergence as retrieval or data freshness, not model style. Disable the affected route, preserve the content and workflow version references, add a dated-policy regression case, and give the reviewer a redacted timeline. Changing temperature would not repair the failed boundary.

Visual alternative: The first wrong transition is the retrieval filter, followed by a verifier that checked citation shape but not effective date.

Sources:

- <https://adk.dev/observability/>
- <https://www.nist.gov/itl/ai-risk-management-framework>

## Learner Prompt: Learner Telemetry Prompt

Choose one raw telemetry field from an agent workflow. State the operator decision it supports. Then replace it with the least sensitive metadata, classification, hash, or secure reference that still supports that decision. Include who may access it, how long it is retained, and how deletion reaches backups. Do not use a real secret or personal data in your answer.

Learner action: Minimize one sensitive field while preserving its documented operational purpose.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>

## Pause: Learner Work Time

## Checkpoint: Escalation Packet Checkpoint

Checkpoint. Should a human escalation packet include full customer prompts and hidden model reasoning by default so the reviewer has every detail? Pause and decide before hearing the explanation.

Learner action: Reject default disclosure and choose redacted, decision-relevant evidence.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>

## Pause: Checkpoint Response Time

## Feedback: Escalation Packet Feedback

No. The default packet contains a redacted timeline, affected targets, versions, containment, evidence references, uncertainty, and the required decision. Include content only when purpose, permission, access, retention, and deletion policy justify it. Hidden reasoning is not required for operational accountability. If you chose full capture for convenience, return to data minimization. If you removed every detail, restore enough governed evidence to understand the state transition and decide containment or recovery.

If correct: You preserved useful causal evidence without treating sensitive content or hidden reasoning as default telemetry.

If retrying: List only the fields required to understand impact, containment, and the human decision.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>
- <https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/registry/attributes/gen-ai.md>

## Transition: Activity Transition

Open the trace review activity. Create a schema for agent, model, retrieval, tool, approval, handoff, verification, and recovery spans. Define quality, safety, reliability, latency, token, cost, and escalation metrics with dimensions and product-owned alert thresholds. Write the eight-part telemetry policy. Review the synthetic failed trace, identify the first wrong transition, prepare the redacted escalation packet, and repair the exporter defect.

## Pause: Activity Work Time

## Narration: Worked Failed Trace Lab Narration

The repair lab is deliberately small. The only learner-editable file is redact dot m j s. From the repository root, run the focused runner with the supplied training path. Then run the immutable Node test command with the supplied training path. Node 22 executes these native modules without a bundler, third-party dependency, network call, model, provider API, approval service, or external tool. Before repair, the runner prints three lines: trace tr demo seven; an approval argument object containing unredacted values; and result fail, privacy values exported. Its exit code is one. After repair, it prints trace tr demo seven; an object with a sorted list of the three top-level field names and redacted true; and result pass, approval arguments redacted. Its exit code is zero. The sanitizer must replace every approval span's argument value tree, preserve trace and span identifiers, parent links, operation, status, versions, timings, usage, and unrelated safe attributes, and avoid mutating the input. A leaked canary means value removal is incomplete. Missing spans or identifiers means the repair over-deleted telemetry. Wrong field names on a changed input mean the code was hard-coded. A changed source fixture means the sanitizer mutated shared input. These are causal diagnoses, not merely test messages.

Sources:

- <https://nodejs.org/api/esm.html>
- <https://nodejs.org/api/console.html>
- <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON>

## Narration: Repair Lab Repair Instructions

Implement the general transformation in sanitize trace. For each approval span, inspect the top-level keys of its argument object, sort those keys, and replace the complete value tree with the sorted field list and a redacted marker. Do not copy the visible example into the code. Do not return an empty object. Do not delete all spans or all attributes. The immutable tests check both the visible trace and an independent changed input. A correct repair retains useful structural telemetry while exporting no argument value. The supplied execution evidence records the repaired runner with exit code zero and both immutable tests passing. It also records the starter runner and tests failing before repair. This exercise behavior demonstrates one pure transformation only. It is not live deployment verification.

Sources:

- <https://nodejs.org/api/esm.html>
- <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON>

## Narration: Independent Variation Lab Narration

Now change the case, without editing the fixture or test. The approval arguments have three top-level fields: recipient, token, and nested. The general repair emits the sorted field list nested, recipient, token, with redacted true. It removes all values, including the nested canary. The operation remains approval. The status remains error. The changed trace and span identifiers remain intact. The trace still has two spans, and the non-approval model span retains its safe model identifier. If the baseline passes but this variation fails, inspect for fixed field names or masking at only one known path. The required transformation discards the entire value tree. Recursive value-by-value masking is unnecessary because retaining value shape can itself disclose sensitive structure. The changed-case answer is exactly a sorted list of nested, recipient, and token, with redacted true. No original argument string may appear in serialized output.

Sources:

- <https://nodejs.org/api/esm.html>
- <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON>

## Learner Prompt: Changed Case Prompt

Before reviewing the answer, write down four checks. What fields should remain? What values must disappear, including nested values? Which identifiers and statuses must remain? What evidence would show that the input object was not mutated? Then compare your prediction with the changed-case answer.

Learner action: Predict the changed-case output and explain why structural metadata remains while values are removed.

## Pause: Changed Case Pause

## Feedback: Changed Case Feedback

The answer is the sorted field list nested, recipient, token, with redacted true. All values, including the nested value, are absent. The approval operation and error status remain. The trace and span identifiers remain. The unrelated model metadata remains. If your answer retained a value, the transformation stopped too early. If it lost identifiers or spans, it removed too much. If it used the visible example's fields, it was hard-coded. If the source changed, the sanitizer mutated shared data. Each result points to a different causal defect.

If correct: You generalized the transformation, removed the complete value tree, and retained safe diagnostic structure.

If retrying: Sort the three changed top-level field names, remove every value, and preserve the approval span and its status.

Sources:

- <https://nodejs.org/api/esm.html>
- <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON>

## Narration: Live Integration Transfer Lab Narration

Transfer the pattern carefully. The lab proves only that one pure JavaScript transformation satisfies the supplied fixture invariants. It does not prove that a live runtime creates spans, propagates context, reports provider usage accurately, redacts before network export, or honors deletion and residency controls. Validate those properties with runtime-specific integration tests and a collector configured for the deployed environment. The supplied module cites first-party tracing documentation for OpenAI Agents, agent observability documentation for Google ADK, and OpenTelemetry semantic conventions for generative AI attributes. Their source history was last verified on September 13, 2026, but live availability is not verified in this drafting environment. Keep four concepts separate. A model family names related weights or models. A runtime loads or serves a model. An API defines a request and response boundary. An agent framework coordinates model, retrieval, tool, approval, and handoff operations. Do not infer common tool calling, token reporting, tracing, or approval capabilities merely because systems can run language models. A portable adapter should obtain metadata from the actual runtime or response, normalize only established meanings, preserve a native request identifier as protected correlation when permitted, and mark unavailable values as unknown rather than estimating them. Approval, tool execution, recovery, and human handoff usually belong to the surrounding workflow.

Visual alternative: The diagram distinguishes model identity, serving runtime, request boundary, and workflow coordination.

Sources:

- <https://openai.github.io/openai-agents-js/guides/tracing/>
- <https://adk.dev/observability/>
- <https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/registry/attributes/gen-ai.md>
- <https://github.com/meta-llama/llama-models>
- <https://github.com/QwenLM/Qwen3>
- <https://github.com/deepseek-ai/DeepSeek-V3>
- <https://github.com/mistralai/mistral-inference>
- <https://github.com/microsoft/Phi-3CookBook>

## Assessment Handoff: Assessment Handoff

When ready, begin the knowledge check. You will choose linked traces for causal review, relate cost to verified success, minimize raw content, find the first wrong transition, preserve diagnostic structure, and build a safe escalation packet. The knowledge check is not a claim that a human approval or live provider call occurred.

## Closing: Class Closing

Collect signals for decisions. Preserve causal structure and preconditions and postconditions. Measure outcomes, safety, reliability, latency, tokens, cost, and escalation by meaningful slices. Minimize sensitive telemetry and govern exceptional capture. Walk backward to the first wrong transition. Keep safe structure while removing values. Escalate with redacted evidence, containment, uncertainty, and a precise decision. Finally, distinguish deterministic exercise behavior from real deployment verification. Those habits make observability useful without making it a sensitive-data archive.

Visual alternative: The class ends with rules for decision-focused signals, causal traces, outcome measures, minimization, diagnosis, and safe escalation.
