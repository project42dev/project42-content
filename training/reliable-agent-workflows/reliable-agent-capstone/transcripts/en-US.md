# Reliable Agent Capstone: Design, Test, and Operate

Package: `reliable-agent-capstone-class` 1.0.0

> This is the canonical text equivalent of an AI-assisted virtual-instructor
> class. It remains usable without synthesized audio, video, animation, or a
> player runtime.

## Welcome: Welcome And Outcomes

Welcome to the Reliable Agent Capstone. Your goal is not to build the largest or most autonomous agent. Your goal is to prove that one useful workflow can be understood, bounded, tested, observed, recovered, revised, and handed to another operator with evidence they can independently review.

## Narration: Capstone Mission

Choose a bounded mission whose effects can be simulated or safely reversed. Define the user, desired outcome, inputs, non-goals, acceptance criteria, stop conditions, and residual risk. Write the state model before selecting a provider or model. At minimum, distinguish intake, validation, planning, authorization, execution, verification, reconciliation, completion, and failure. Name the durable record that proves every transition. Completion is not a model statement; it is an observed postcondition tied to the workflow state. Keep portable responsibilities above provider adapters. Anthropic, OpenAI, and Google implementations may expose different tools, tracing objects, or orchestration features, but none may silently change authority, evidence, or terminal-state rules. If a reviewer cannot say what the workflow may change, when it must stop, and how completion is proven, narrow the mission before continuing.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>

## Narration: Capstone Tools Trust

Inventory every model, tool, data source, credential, human role, and destination. For each tool, record allowed and denied operations, input validation, object authorization, approval, execution limits, idempotency, postcondition, audit event, and recovery. Draw trust boundaries around user input, retrieved content, model output, MCP servers, memory, secret-bearing executors, and external systems. Instructions inside data remain untrusted data until a trusted control plane validates them. Threat-model prompt injection, confused-deputy action, excessive permission, secret exposure, replay, duplicate writes, poisoned memory, unsafe delegation, and misleading success. Every material threat needs prevention, detection, containment, and recovery. The model may propose an action, but only the trusted executor resolves identity and tenant, enforces policy, obtains required approval, performs the bounded effect, and verifies the result. Confidence never grants authority.

Sources:

- <https://modelcontextprotocol.io/specification/2025-11-25/basic/security_best_practices>
- <https://www.nist.gov/itl/ai-risk-management-framework>

## Narration: Capstone Context Handoffs

Engineer the minimum context for each step: objective, constraints, authoritative evidence, current state, tool contract, output schema, budget, and escalation rule. Exclude stale, irrelevant, unrelated, and secret material. Separate working context from durable memory. Define what may be remembered, lawful purpose, reader, source of truth, correction path, expiration, deletion, and conflict behavior. For MCP connections, record server identity, negotiated capabilities, authorization, data sent, tool contracts, approval, postconditions, and fallback. For multi-agent handoffs, transfer a versioned packet with goal, trusted facts, unresolved questions, completed effects, allowed and denied actions, budget, acceptance checks, return states, and trace. The recipient must be able to reject an incomplete, stale, misrouted, or over-privileged packet without guessing. A handoff transfers a contract with evidence, not a conversation dump or hidden authority.

Sources:

- <https://modelcontextprotocol.io/specification/2025-11-25/basic/security_best_practices>
- <https://www.nist.gov/itl/ai-risk-management-framework>

## Narration: Capstone Evaluation

Evaluate success and exercise failure. Build representative routine cases, boundary cases, adversarial inputs, and known failures. Use deterministic checks for schemas, permissions, tool arguments, approvals, operation keys, postconditions, terminal states, latency, and cost. Use calibrated human review for judgment. Test tool denial, malformed output, timeout, partial write, duplicate request, stale context, poisoned instruction, provider unavailability, and missing telemetry. Write expected containment before execution and record the observed result. Never retry an uncertain external action until the system of record reconciles its state. A retry must be idempotent or protected by a durable operation key, and recovery evidence must prove it did not duplicate or conceal an effect. Compare the candidate with a baseline on identical versioned cases and preserve every input needed for reproduction and rollback.

Sources:

- <https://developers.openai.com/api/docs/guides/evaluation-best-practices>
- <https://www.nist.gov/itl/ai-risk-management-framework>

## Narration: Capstone Observability

Design observability and the operating runbook together. Correlate workflow, agent, model, retrieval, tool, handoff, approval, verification, and outcome events. Record versions, timing, state transitions, policy decisions, failure classes, resource use, and secure evidence references. Exclude or redact prompts, secrets, personal data, sensitive tool payloads, and hidden reasoning. Define service indicators that expose user harm or control failure: evaluation regression, policy denial, incomplete trace, duplicate-effect attempt, unresolved reconciliation, unsafe escalation, and learner-evidence integrity failure. The runbook covers detection, severity, containment, evidence preservation, reconciliation, safe retry, rollback, escalation, communication, recovery verification, and post-incident improvement. Name the owner, authority, exact target, evidence required, and fallback at each decision. A healthy endpoint is insufficient if external state or the learner record remains wrong.

Sources:

- <https://opentelemetry.io/docs/specs/semconv/registry/attributes/gen-ai/>
- <https://www.nist.gov/publications/incident-response-recommendations-and-considerations-cybersecurity-risk-management-csf>
- <https://www.nist.gov/itl/ai-risk-management-framework>

## Narration: Capstone Evidence Revision

Submit eight versioned artifacts: architecture and state model; tool inventory and permission matrix; trust-boundary and threat model; evaluation set and rubric; failure tests and results; observability plan; operating runbook; and evidence map with operational handoff. Use the stable filenames architecture-and-state-model.md, tool-inventory-and-permission-matrix.md, trust-boundary-and-threat-model.md, evaluation-set-and-rubric.json, failure-tests-and-results.md, observability-plan.md, operating-runbook.md, and evidence-map-and-handoff.md. Map each of six rubric criteria to exact artifact or knowledge-check references. Correctness and safety are worth twenty points each. Evidence quality and maintainability are worth fifteen each. Reliability is worth twenty, and communication is worth ten. A score without references is invalid. Compare the complete and flawed exemplars by evidence, not polish. The flawed example has broad authority, three easy cases, blind retry, invasive telemetry, and no actionable runbook even though its language sounds confident. Preserve the first submission, criterion feedback, revised artifacts, changed evidence map, and final handoff. Completion requires both an eighty-percent knowledge check and an applied capstone score of at least eighty percent.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>
- <https://developers.openai.com/api/docs/guides/evaluation-best-practices>
- <https://opentelemetry.io/docs/specs/semconv/registry/attributes/gen-ai/>

## Demonstration: Exemplar Demonstration

Compare two support-triage packages. The complete package uses synthetic tickets, explicit states, a durable case and operation key, human approval before sandbox send, one-object permissions, nine failure tests, redacted traces, destination read-back, and an owned runbook. Every score points to artifacts and test identifiers. The flawed package says the agent resolves tickets, grants all tools, trusts user text, asks the same model to judge three easy cases, retries every timeout, stores prompts and credentials forever, and declares success because the demo looked good. Its polish cannot compensate for missing state, authority, failure evidence, privacy, or recovery. Use the flawed exemplar to locate the weakest criterion in your own first submission, revise that evidence, and explain the change in the handoff.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>
- <https://developers.openai.com/api/docs/guides/evaluation-best-practices>
- <https://www.nist.gov/publications/incident-response-recommendations-and-considerations-cybersecurity-risk-management-csf>

## Learner Prompt: Learner Capstone Prompt

Name the most consequential effect your workflow could attempt. Identify the trusted executor, exact permission, approval, operation key, postcondition, containment control, and recovery evidence that make the effect bounded.

Expected learner action: Define the complete trusted-execution contract for the workflow's highest-impact effect.

## Pause: Learner Work Time

## Checkpoint: Evidence Map Checkpoint

Checkpoint. A reviewer believes the workflow is safe but cannot link the safety score to a submitted artifact or assessment result. Is the score valid?

Expected learner action: Reject the score until criterion-level evidence references support it.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>

## Pause: Checkpoint Response Time

## Feedback: Evidence Map Feedback

The score is invalid. Reviewer confidence cannot replace criterion evidence. Link safety points to the permission matrix, threat model, containment test, privacy controls, approval record, or relevant assessment result. If the evidence does not exist, lower the score and revise the package. If you supplied one overall screenshot, split it into stable artifact and test references. The evidence map must let another reviewer reproduce why each point was awarded without hidden reasoning.

Correct feedback: You required reproducible criterion evidence instead of accepting confidence as proof.

Retry feedback: For every awarded point, identify the stable artifact or assessment record another reviewer can inspect.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>

## Transition: Activity Transition

Open the reliable-agent capstone. Produce all eight artifacts, execute routine, adversarial, and recovery tests, define privacy-aware telemetry and the runbook, map all six rubric criteria to evidence, self-score against both exemplars, submit, preserve feedback, revise failing evidence, and deliver the final operational handoff with residual risk.

## Pause: Activity Work Time

## Assessment Handoff: Assessment Handoff

When ready, begin the knowledge check. You will prove writes with durable evidence, reconcile timeouts, require criterion-level references, use the flawed exemplar for calibration, and apply the dual eighty-percent completion gate. Then return to the versioned capstone submission.

## Closing: Class Closing

A reliable agent is bounded by state, authority, evidence, evaluation, privacy-aware observability, and tested recovery. Preserve failed and revised attempts so mastery reflects improvement, not hidden replacement.
