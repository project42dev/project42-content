# Reliable Agent Capstone: Design, Test, and Operate: text-only class

This route contains the complete teaching content, learner actions, feedback,
and assessment handoff without requiring audio, video, or animation.

## Welcome: Welcome And Outcomes

Welcome to the Reliable Agent Capstone. Your goal is not to build the largest or most autonomous agent. Your goal is to prove that one useful workflow can be understood, bounded, tested, observed, recovered, revised, and handed to another operator with evidence they can independently review. This is a fictional, offline learning exercise. Nothing in the lab sends a message, calls a model, contacts a provider, or creates a real approval.

## Narration: Capstone Mission

Begin with a bounded mission whose effects can be simulated or safely reversed. Define the user, desired outcome, inputs, non-goals, acceptance criteria, stop conditions, and residual risks. Reliability is not the same as task size. Write the state transitions before selecting a model or provider. At minimum, distinguish intake, planning, authorization, execution, verification, reconciliation, completion, and failure. For each transition, name the durable record that proves it occurred. Follow one synthetic support case through that diagram. At intake, record its case identifier and immutable input hash. Planning may propose a response, but authorization must create a separate approval record. Execution uses a durable operation key. Verification reads the simulated destination. Reconciliation decides whether an uncertain write occurred. Completion is allowed only when the observed postcondition matches the authorized case and operation key. Keep portable responsibilities separate from provider adapters. Anthropic, OpenAI, and Google examples may differ in tools or tracing syntax, but no adapter may silently redefine authority or the evidence contract. Meta Llama, Qwen, DeepSeek, Mistral, and Microsoft Phi identify model families or projects. A local runtime, hosted service, and agent framework are different operational contracts. Validate each adapter instead of assuming shared tool calling, authorization, telemetry, or structured-output behavior.

Visual alternative: Every state transition has an authority owner, acceptance condition, durable evidence record, and failure path to containment.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>

## Checkpoint: Mission Checkpoint

Checkpoint. Before automation, can a reviewer identify every allowed transition, the durable evidence for each transition, the stop conditions, and the system that alone may authorize an effect?

Learner action: Identify transitions, evidence, stop conditions, and the sole authority for effects.

## Pause: Mission Pause

## Feedback: Mission Feedback

A workflow is not ready to automate if any transition, evidence record, stop condition, or authority owner is unclear. Narrow the mission and make the missing contract explicit before choosing a model.

If correct: You checked the workflow as a state and evidence contract rather than as a model demonstration.

If retrying: Name one allowed transition, its durable record, its stop condition, and the component allowed to authorize it.

## Narration: Capstone Tools Trust

Inventory every model, tool, data source, credential, human role, and destination. For each tool, record its allowed operation, denied operations, input validation, approval requirement, execution limit, postcondition, audit event, and recovery behavior. Draw trust boundaries around untrusted user input, retrieved content, model output, MCP servers, secret-bearing executors, memory, and external systems. Instructions inside data remain data until a trusted control plane validates them. Threat-model prompt injection, confused-deputy behavior, excessive permission, secret exposure, replay, duplicate writes, poisoned memory, unsafe delegation, and misleading success claims. Each material threat needs prevention, detection, containment, and recovery. A model may propose an action, but confidence never grants authority. The trusted executor performs deterministic identity, policy, approval, limit, audit, and postcondition checks. In this lab, ticket text is deterministic fixture data and the destination is a local directory. No model runs and no message is sent. Passing fixture tests does not qualify authentication, provider behavior, rate limits, network failure handling, data handling, or reconciliation in a live destination.

Visual alternative: Untrusted input, retrieved content, model output, memory, and MCP servers cannot authorize effects. The trusted executor validates policy, approval, limits, audit, and postconditions.

Sources:

- <https://modelcontextprotocol.io/specification/2025-11-25/basic/security_best_practices>
- <https://www.nist.gov/itl/ai-risk-management-framework>

## Checkpoint: Tools Checkpoint

Checkpoint. Model confidence never grants authority. Why is a deny-all policy also an invalid repair?

Learner action: Explain that valid revised and changed packages must be accepted while stale evidence is rejected.

## Pause: Tools Pause

## Feedback: Tools Feedback

Deny-all is not a repair because it hides whether the validator compares evidence correctly. A valid revised package and an independently changed valid case must pass. The correct control rejects stale or mismatched bindings while accepting packages whose values match the manifest.

If correct: You distinguished least authority from a validator that simply rejects everything.

If retrying: State which valid packages must pass and which stale package must fail.

## Narration: Capstone Context Handoffs

For each step, define the minimum context packet: objective, constraints, authoritative evidence, current state, tool contract, output schema, and escalation rule. Exclude stale, irrelevant, unrelated, and secret material. Separate working context from durable memory. State what may be remembered, who may read it, how it expires, how corrections propagate, and which source wins when memory conflicts with current evidence. For MCP or multi-agent work, document capability discovery, identity, authorization, input and output validation, delegation limits, timeouts, idempotency, and handoff acceptance. A receiving component must reject an incomplete handoff without guessing. The package binding is a concrete contract. The attempt identifier says which submission is under review. The version identifies its revision. The case identifier identifies the evaluated input. The outcome identifies the observed result. If a referenced artifact belongs to another attempt, version, case, or outcome, the receiver must reject it even when the file exists. Filenames establish location, not provenance.

Visual alternative: Each step receives only needed objective, constraints, evidence, state, tool contract, schema, and escalation rule. A handoff adds matching attempt, version, case, and outcome values.

Sources:

- <https://modelcontextprotocol.io/specification/2025-11-25/basic/security_best_practices>
- <https://www.nist.gov/itl/ai-risk-management-framework>

## Checkpoint: Handoff Checkpoint

Checkpoint. Is a handoff a conversational promise, a directory-existence check, or a contract with evidence?

Learner action: Choose and explain that a handoff is a contract with evidence and provenance.

## Pause: Handoff Pause

## Feedback: Handoff Feedback

A handoff is a contract with evidence. The receiver must be able to compare the packet with the manifest, reject stale or incomplete material, and identify what remains unresolved. Existing filenames do not establish that relationship.

If correct: You treated provenance and acceptance checks as part of the handoff contract.

If retrying: Name the four binding values the receiver must compare with the manifest.

## Narration: Capstone Evaluation

Build a representative evaluation set with routine cases, boundary cases, adversarial inputs, and known failure modes. Use deterministic checks where possible and calibrated human review where judgment is necessary. Test tool denial, malformed output, timeouts, partial writes, duplicate requests, stale context, poisoned instructions, provider unavailability, and missing telemetry. Record expected containment before execution and the observed result afterward. Do not retry an uncertain external action until the destination is reconciled. A retry must be idempotent or protected by a durable operation key, and recovery evidence must show that it did not duplicate or conceal an effect. The lab adds deterministic checks for exact criterion identifiers, integer score ranges, total arithmetic, evidence-reference syntax, file existence, and binding to attempt, version, case, and outcome. Those checks establish structural consistency only. They do not decide whether prose is safe, useful, or truthful, and they do not qualify a live integration.

Visual alternative: Each row records an expected decision, containment control, observed result, and evidence reference. Structural validation is separate from human judgment and live qualification.

Sources:

- <https://developers.openai.com/api/docs/guides/evaluation-best-practices>
- <https://www.nist.gov/itl/ai-risk-management-framework>

## Checkpoint: Evaluation Checkpoint

Checkpoint. A happy-path demonstration proves possibility. What does a failure test add?

Learner action: Explain that a failure test supplies evidence of detection, containment, reconciliation, or recovery.

## Pause: Evaluation Pause

## Feedback: Evaluation Feedback

A failure test supplies evidence of control. It can show detection, containment, reconciliation, safe retry, or recovery. A changed-input test also helps reveal a hard-coded repair. The expected decision and the observed evidence must both be recorded.

If correct: You separated a possibility demonstration from evidence that controls work under failure.

If retrying: Choose one failure and state the expected containment and the evidence that would prove it.

## Narration: Capstone Observability

Design privacy-aware observability and the operating runbook together. Correlate workflow, agent, model, tool, handoff, approval, and outcome events. Record versions, latency, error class, state transitions, evaluation results, and secure evidence references. Redact prompts, secrets, personal data, sensitive tool payloads, and hidden reasoning. Define indicators that reveal user harm or control failure, not only infrastructure health. Include evaluation regressions, policy denials, incomplete traces, duplicate-effect attempts, unresolved reconciliations, and evidence-integrity failures. The synthetic lab trace is intentionally small: validator version, package path, decision code, score, and pass status. Do not copy ticket bodies or fictional approvals into telemetry. The operating runbook covers detection, triage, containment, reconciliation, safe retry, rollback, escalation, communication, recovery verification, and post-incident improvement. Name the owner and evidence required at each decision point. Incident response is broader than this validator, so do not present the lab as a live incident qualification.

Visual alternative: The safe trace contains correlation data and decision codes. The prohibited trace contains credentials, personal data, full prompts, or hidden reasoning.

Sources:

- <https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/registry/attributes/gen-ai.md>
- <https://www.nist.gov/publications/incident-response-recommendations-and-considerations-cybersecurity-risk-management-csf>

## Checkpoint: Observability Checkpoint

Checkpoint. What should useful telemetry answer, and what must it avoid becoming?

Learner action: Describe telemetry that explains what happened and what to do next without becoming a data leak.

## Pause: Observability Pause

## Feedback: Observability Feedback

Useful telemetry answers what happened, which decision was made, what evidence supports it, and what action comes next. It must not become a second data leak. Redact sensitive content and retain only the operational fields needed for diagnosis, accountability, and recovery.

If correct: You connected observability to recovery while preserving privacy boundaries.

If retrying: Name two safe operational fields and two categories of content that should be excluded.

## Narration: Capstone Evidence Revision

Submit exactly eight required artifacts: architecture-and-state-model.md, tool-inventory-and-permission-matrix.md, trust-boundary-and-threat-model.md, evaluation-set-and-rubric.json, failure-tests-and-results.md, observability-plan.md, operating-runbook.md, and evidence-map-and-handoff.md. Map every rubric judgment to a submitted artifact or assessment result. The six criteria total 100 points: reliable-capstone-correctness is 20, reliable-capstone-safety is 20, reliable-capstone-evidence is 15, reliable-capstone-reliability is 20, reliable-capstone-maintainability is 15, and reliable-capstone-communication is 10. The pass threshold is 80 percent. A score without a traceable evidence reference is invalid, even if the conclusion sounds reasonable. Compare complete and flawed exemplars by evidence, not polish. The flawed package has broad authority, three easy cases, blind retry, invasive telemetry, and no actionable handoff. Preserve the failed submission, feedback, revised artifacts, and final handoff. Completion requires a passing knowledge check and a capstone score of at least 80 percent.

Visual alternative: Correctness 20, safety 20, evidence 15, reliability 20, maintainability 15, and communication 10 total 100 points. Each judgment links to evidence.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>
- <https://developers.openai.com/api/docs/guides/evaluation-best-practices>

## Demonstration: Exemplar Demonstration

Compare two fictional support-triage packages. The complete package uses synthetic tickets, explicit states, a durable case identifier and operation key, human approval before a sandbox effect, nine failure tests, redacted traces, destination read-back, and an owned runbook. Every score points to artifacts and test identifiers. The flawed package says the agent resolves tickets, grants all tools, trusts user text, asks the same evaluator to judge three easy cases, retries every timeout, stores sensitive material forever, and declares success because the demonstration looked good. Its polished language cannot replace state, authority, representative testing, privacy controls, reconciliation, or evidence. The complete exemplar scores 20 plus 20 plus 15 plus 20 plus 15 plus 10, which equals 100 points. The flawed exemplar scores 8 plus 5 plus 5 plus 6 plus 4 plus 3, which equals 31 points. These are supplied calibration records, not live approvals or production decisions.

Visual alternative: The complete package has bounded authority, tests, reconciliation, privacy, and evidence links. The flawed package lacks those controls despite confident prose.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>
- <https://developers.openai.com/api/docs/guides/evaluation-best-practices>

## Learner Prompt: Learner Capstone Prompt

Choose the weakest criterion in your first submission. Name the exact artifact or assessment result that should support it, the evidence currently missing, and the smallest revision that would make the handoff reviewable.

Learner action: Map one weak criterion to concrete missing evidence and a bounded revision.

## Pause: Learner Work Time

## Checkpoint: Evidence Map Checkpoint

Checkpoint. A reviewer believes the workflow is safe but cannot link the safety score to a submitted artifact or assessment result. Is the score valid?

Learner action: Reject the score until criterion-level evidence references support it.

## Pause: Checkpoint Response Time

## Feedback: Evidence Map Feedback

The score is invalid. Reviewer confidence cannot replace criterion evidence. Link safety points to the permission matrix, threat model, containment test, privacy controls, approval record, or relevant assessment result. If the evidence does not exist, lower the score and revise the package. One overall screenshot is not enough. Stable artifact and test references let another reviewer reproduce why each point was awarded without hidden reasoning.

If correct: You required reproducible criterion evidence instead of accepting confidence as proof.

If retrying: For every awarded point, identify the stable artifact or assessment result another reviewer can inspect.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>

## Transition: Activity Transition

Open the reliable-agent capstone. Produce the eight artifacts, execute routine, adversarial, and recovery tests, define privacy-aware telemetry and the runbook, map all six criteria to evidence, self-score against both exemplars, preserve feedback, revise failing evidence, and deliver the operational handoff with residual limits.

## Pause: Activity Work Time

## Narration: Capstone Worked Repair Lab Narration

Now repair the evidence-binding defect. The failed fixture declares attempt-1, version 1.0.0, case support-017, outcome failed, and an 80-point score. Several referenced files actually carry attempt-0, version 0.9.0, or outcome passed. The starter validator checks shared package rules and confirms that filenames exist, but omits binding equality. It therefore prints VALID score=80 pass=true and exits with code 0. That is unearned credit because existence proves location, not provenance. The missing invariant is equality of each artifact binding with the manifest's attempt identifier, version, case identifier, and outcome. The focused repair reads the first line of each Markdown artifact, requires the Evidence-Binding prefix, parses its JSON, and compares those four values. The evaluation JSON uses its binding object. The first mismatch must produce E_BINDING with the artifact and key. The repaired validator must still accept revised, complete, and changed valid packages, so deny-all is not a valid repair. The revised fixture uses attempt-2, version 1.1.0, case support-017, outcome passed. The changed-input fixture changes case support-017 to support-099 in the manifest, every binding, and the synthetic input text. Acceptance proves comparison of values rather than a hard-coded case. Exact commands and outputs are selectable in the visual artifact. The starter CLI on failed prints VALID score=80 pass=true and exits 0. Starter tests finish with TESTS total=8 passed=7 failed=1 and exit 1. The reference CLI on failed prints INVALID E_BINDING architecture-and-state-model.md:attemptId and exits 1. The reference CLI on revised prints VALID score=80 pass=true and exits 0. Reference tests finish with TESTS total=8 passed=8 failed=0 and exit 0. This is fixture simulation. No API, model, MCP server, human approver, external ticket system, or real write is invoked. These strings are teaching records, not signed approvals. The offline package check does not evaluate model quality, live safety, or human judgment.

Visual alternative: The repair compares attempt identifier, version, case identifier, and outcome. Failed evidence is rejected, revised evidence is accepted, and support-099 proves changed-input comparison.

Sources:

- <https://nodejs.org/api/esm.html>

## Learner Prompt: Repair Learner Prompt

Before editing, predict the first error from the failed fixture. Which artifact and which binding key should the validator report? Then explain why checking only that the file exists would be insufficient.

Learner action: Predict architecture-and-state-model.md and attemptId, then explain the provenance gap.

## Pause: Repair Pause

## Feedback: Repair Feedback

The first mismatch is architecture-and-state-model.md at attemptId. The file exists, but its evidence belongs to another attempt. A filename establishes location only. The validator must compare attempt identifier, version, case identifier, and outcome with the manifest, in that order, and report the first mismatch.

If correct: You identified the causal provenance mismatch rather than treating file existence as evidence.

If retrying: Compare the first artifact binding with the manifest and name the first unequal value.

## Narration: Capstone Lab Activity Lab Narration

From the repository root, run the starter CLI against the failed fixture and record its incorrect successful decision. Then run the immutable tests. Edit only starter/validator.mjs. Do not change fixtures, shared logic, or tests. Keep the exported validation function, import the shared package-validation module with the ordinary relative ECMAScript module import, and provide the evidence-binding callback. Use the evaluation binding for evaluation-set-and-rubric.json. For Markdown evidence, read the first line, require the Evidence-Binding prefix, parse valid JSON, and compare attempt identifier, version, case identifier, and outcome. Return E_BINDING with missing for absent or malformed binding, or the first mismatched key. The shared rules continue to handle exact criterion identifiers, integer and maximum points, declared sums, safe references, manifest shape, and file existence. A complete repair rejects stale binding, unknown criteria, invalid points, bad sums, unsafe references, and missing evidence. It accepts revised, complete, and generated support-099 packages. Returning invalid for every package fails acceptance. Before comparison, copy the revised fixture to a separate workspace and change one binding value in one artifact only. The changed artifact should be the only binding failure. Restore it and the package should pass. If an edit breaks parsing, restore the original starter file, rerun the baseline, and make one focused change. Preserve the failed fixture. Do not repair evidence by rewriting history. Your handoff must state the defect, violated invariant, containment decision, changed code, revision evidence, residual limits, and commands run. State explicitly that the result qualifies an offline package validator, not a live agent or human safety judgment.

Visual alternative: Learners edit only starter/validator.mjs, preserve failed evidence, compare four binding values, and verify stale rejection plus revised and support-099 acceptance.

Sources:

- <https://nodejs.org/api/esm.html>

## Checkpoint: Lab Completion Checkpoint

Completion checkpoint. What must be true before you call the repair complete?

Learner action: State that tests pass, failed evidence remains preserved, revised and changed inputs pass, and the handoff separates offline validation from live or human qualification.

## Pause: Lab Completion Pause

## Feedback: Lab Completion Feedback

The repair is complete only when immutable tests pass, failed evidence remains preserved, revised and changed inputs pass, and the handoff states the residual limits. The result qualifies deterministic offline package validation. It does not approve a live agent, assess model quality, sign a human decision, or establish provider equivalence.

If correct: You included both technical acceptance and the boundary around what the evidence does not establish.

If retrying: List the passing fixtures, the preserved history, and the live or human claims that remain unqualified.

## Assessment Handoff: Assessment Handoff

When ready, begin the knowledge check. You will prove a safe write with a durable operation key and read-back, reconcile a timeout before retrying, require criterion-level evidence, use the flawed exemplar for calibration, apply the 80 percent completion gate, compare provenance, and state what the offline lab does and does not establish. Then return to the versioned capstone submission.

## Closing: Class Closing

A reliable agent is bounded by state, authority, evidence, evaluation, privacy-aware observability, and tested recovery. Preserve failed and revised attempts so mastery reflects improvement, not hidden replacement. Your final handoff should let another reviewer understand what passed, what failed, what changed, what remains uncertain, and which claims still require live integration or human review.
