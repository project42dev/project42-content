# Reliable Agent Capstone: Design, Test, and Operate: text-only class

This route contains the complete teaching content, learner actions, feedback,
and assessment handoff without requiring audio, video, or animation.

## Welcome: Welcome And Outcomes

Welcome to the Reliable Agent Capstone. Your goal is not to build the largest or most autonomous agent. Your goal is to prove that one useful workflow can be understood, bounded, tested, observed, recovered, revised, and handed to another operator with evidence they can independently review.

## Narration: Capstone Mission

Choose a bounded mission whose effects can be simulated or safely reversed. Define the user, desired outcome, inputs, non-goals, acceptance criteria, stop conditions, and residual risk. Write the state model before selecting a provider or model. At minimum, distinguish intake, validation, planning, authorization, execution, verification, reconciliation, completion, and failure. Name the durable record that proves every transition. Completion is not a model statement; it is an observed postcondition tied to the workflow state. Keep portable responsibilities above provider adapters. Anthropic, OpenAI, and Google implementations may expose different tools, tracing objects, or orchestration features, but none may silently change authority, evidence, or terminal-state rules. If a reviewer cannot say what the workflow may change, when it must stop, and how completion is proven, narrow the mission before continuing.

Visual alternative: Every state transition has an acceptance condition, authority owner, durable evidence record, and failure path to containment.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>

## Narration: Capstone Tools Trust

Inventory every model, tool, data source, credential, human role, and destination. For each tool, record allowed and denied operations, input validation, object authorization, approval, execution limits, idempotency, postcondition, audit event, and recovery. Draw trust boundaries around user input, retrieved content, model output, MCP servers, memory, secret-bearing executors, and external systems. Instructions inside data remain untrusted data until a trusted control plane validates them. Threat-model prompt injection, confused-deputy action, excessive permission, secret exposure, replay, duplicate writes, poisoned memory, unsafe delegation, and misleading success. Every material threat needs prevention, detection, containment, and recovery. The model may propose an action, but only the trusted executor resolves identity and tenant, enforces policy, obtains required approval, performs the bounded effect, and verifies the result. Confidence never grants authority.

Visual alternative: Untrusted input, retrieval, model output, MCP servers, and memory cannot authorize effects; a trusted executor applies identity, policy, approval, limits, audit, and postcondition checks.

Sources:

- <https://modelcontextprotocol.io/specification/2025-11-25/basic/security_best_practices>
- <https://www.nist.gov/itl/ai-risk-management-framework>

## Narration: Capstone Context Handoffs

Engineer the minimum context for each step: objective, constraints, authoritative evidence, current state, tool contract, output schema, budget, and escalation rule. Exclude stale, irrelevant, unrelated, and secret material. Separate working context from durable memory. Define what may be remembered, lawful purpose, reader, source of truth, correction path, expiration, deletion, and conflict behavior. For MCP connections, record server identity, negotiated capabilities, authorization, data sent, tool contracts, approval, postconditions, and fallback. For multi-agent handoffs, transfer a versioned packet with goal, trusted facts, unresolved questions, completed effects, allowed and denied actions, budget, acceptance checks, return states, and trace. The recipient must be able to reject an incomplete, stale, misrouted, or over-privileged packet without guessing. A handoff transfers a contract with evidence, not a conversation dump or hidden authority.

Visual alternative: Each step receives only required objective, constraints, evidence, state, tools, schema, budget, and escalation; durable memory and handoffs add reader, correction, expiry, acceptance, and return controls.

Sources:

- <https://modelcontextprotocol.io/specification/2025-11-25/basic/security_best_practices>
- <https://www.nist.gov/itl/ai-risk-management-framework>

## Narration: Capstone Evaluation

Evaluate success and exercise failure. Build representative routine cases, boundary cases, adversarial inputs, and known failures. Use deterministic checks for schemas, permissions, tool arguments, approvals, operation keys, postconditions, terminal states, latency, and cost. Use calibrated human review for judgment. Test tool denial, malformed output, timeout, partial write, duplicate request, stale context, poisoned instruction, provider unavailability, and missing telemetry. Write expected containment before execution and record the observed result. Never retry an uncertain external action until the system of record reconciles its state. A retry must be idempotent or protected by a durable operation key, and recovery evidence must prove it did not duplicate or conceal an effect. Compare the candidate with a baseline on identical versioned cases and preserve every input needed for reproduction and rollback.

Visual alternative: Nine failure tests include denial, malformed output, timeout, partial write, duplicate request, stale context, poisoned instruction, provider outage, and missing telemetry.

Sources:

- <https://developers.openai.com/api/docs/guides/evaluation-best-practices>
- <https://www.nist.gov/itl/ai-risk-management-framework>

## Narration: Capstone Observability

Design observability and the operating runbook together. Correlate workflow, agent, model, retrieval, tool, handoff, approval, verification, and outcome events. Record versions, timing, state transitions, policy decisions, failure classes, resource use, and secure evidence references. Exclude or redact prompts, secrets, personal data, sensitive tool payloads, and hidden reasoning. Define service indicators that expose user harm or control failure: evaluation regression, policy denial, incomplete trace, duplicate-effect attempt, unresolved reconciliation, unsafe escalation, and learner-evidence integrity failure. The runbook covers detection, severity, containment, evidence preservation, reconciliation, safe retry, rollback, escalation, communication, recovery verification, and post-incident improvement. Name the owner, authority, exact target, evidence required, and fallback at each decision. A healthy endpoint is insufficient if external state or the learner record remains wrong.

Visual alternative: The runbook links detection, containment, reconciliation, retry, rollback, escalation, communication, verification, and improvement to redacted evidence.

Sources:

- <https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/registry/attributes/gen-ai.md>
- <https://www.nist.gov/publications/incident-response-recommendations-and-considerations-cybersecurity-risk-management-csf>
- <https://www.nist.gov/itl/ai-risk-management-framework>

## Narration: Capstone Evidence Revision

Submit eight versioned artifacts: architecture and state model; tool inventory and permission matrix; trust-boundary and threat model; evaluation set and rubric; failure tests and results; observability plan; operating runbook; and evidence map with operational handoff. Use the stable filenames architecture-and-state-model.md, tool-inventory-and-permission-matrix.md, trust-boundary-and-threat-model.md, evaluation-set-and-rubric.json, failure-tests-and-results.md, observability-plan.md, operating-runbook.md, and evidence-map-and-handoff.md. Map each of six rubric criteria to exact artifact or knowledge-check references. Correctness and safety are worth twenty points each. Evidence quality and maintainability are worth fifteen each. Reliability is worth twenty, and communication is worth ten. A score without references is invalid. Compare the complete and flawed exemplars by evidence, not polish. The flawed example has broad authority, three easy cases, blind retry, invasive telemetry, and no actionable runbook even though its language sounds confident. Preserve the first submission, criterion feedback, revised artifacts, changed evidence map, and final handoff. Completion requires both an eighty-percent knowledge check and an applied capstone score of at least eighty percent.

Visual alternative: Correctness 20, safety 20, evidence 15, reliability 20, maintainability 15, and communication 10 each link to named artifacts or assessment evidence.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>
- <https://developers.openai.com/api/docs/guides/evaluation-best-practices>
- <https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/registry/attributes/gen-ai.md>

## Demonstration: Exemplar Demonstration

Compare two support-triage packages. The complete package uses synthetic tickets, explicit states, a durable case and operation key, human approval before sandbox send, one-object permissions, nine failure tests, redacted traces, destination read-back, and an owned runbook. Every score points to artifacts and test identifiers. The flawed package says the agent resolves tickets, grants all tools, trusts user text, asks the same model to judge three easy cases, retries every timeout, stores prompts and credentials forever, and declares success because the demo looked good. Its polish cannot compensate for missing state, authority, failure evidence, privacy, or recovery. Use the flawed exemplar to locate the weakest criterion in your own first submission, revise that evidence, and explain the change in the handoff.

Visual alternative: The complete package has bounded states, permissions, tests, reconciliation, privacy, runbook, and evidence links; the flawed package lacks each despite confident prose.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>
- <https://developers.openai.com/api/docs/guides/evaluation-best-practices>
- <https://www.nist.gov/publications/incident-response-recommendations-and-considerations-cybersecurity-risk-management-csf>

## Learner Prompt: Learner Capstone Prompt

Name the most consequential effect your workflow could attempt. Identify the trusted executor, exact permission, approval, operation key, postcondition, containment control, and recovery evidence that make the effect bounded.

Learner action: Define the complete trusted-execution contract for the workflow's highest-impact effect.

## Pause: Learner Work Time

## Checkpoint: Evidence Map Checkpoint

Checkpoint. A reviewer believes the workflow is safe but cannot link the safety score to a submitted artifact or assessment result. Is the score valid?

Learner action: Reject the score until criterion-level evidence references support it.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>

## Pause: Checkpoint Response Time

## Feedback: Evidence Map Feedback

The score is invalid. Reviewer confidence cannot replace criterion evidence. Link safety points to the permission matrix, threat model, containment test, privacy controls, approval record, or relevant assessment result. If the evidence does not exist, lower the score and revise the package. If you supplied one overall screenshot, split it into stable artifact and test references. The evidence map must let another reviewer reproduce why each point was awarded without hidden reasoning.

If correct: You required reproducible criterion evidence instead of accepting confidence as proof.

If retrying: For every awarded point, identify the stable artifact or assessment record another reviewer can inspect.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>

## Transition: Activity Transition

Open the reliable-agent capstone. Produce all eight artifacts, execute routine, adversarial, and recovery tests, define privacy-aware telemetry and the runbook, map all six rubric criteria to evidence, self-score against both exemplars, submit, preserve feedback, revise failing evidence, and deliver the final operational handoff with residual risk.

## Pause: Activity Work Time

## Narration: Capstone Worked Repair Lab Narration

The failed fixture declares attempt-1, version 1.0.0, case support-017, outcome failed, and an 80-point score. Several referenced files actually carry bindings from attempt-0, version 0.9.0, or outcome passed. The starter validator checks all shared package rules and confirms each referenced filename exists, but deliberately omits binding equality. It therefore prints VALID score=80 pass=true and exits 0. That is unearned credit because existence does not prove that evidence supports the submission being scored. Trace the cause before editing. Shared validation already rejects unknown criterion IDs, malformed points, bad sums, unsafe references, missing files, malformed manifests, and incorrect criterion membership. The only intended defect is that the starter supplies no evidence-binding validator to the shared package logic. The missing invariant is provenance equality: each referenced artifact must bind to the manifest's attemptId, version, caseId, and outcome. The focused repair adds a binding callback that parses the first line of each Markdown artifact and compares all four keys. The evaluation JSON uses its binding object. The validator rejects stale, missing, or mismatched evidence after confirming safe reference syntax and file existence. It still accepts the revised and complete packages, so deny-all is not a valid repair. Recovery is a new attempt, not a retry that overwrites history. The revised fixture uses attempt-2, version 1.1.0, case support-017, outcome passed. Its artifacts describe a bounded draft-only executor, approval requirements for any future live effect, timeout reconciliation, privacy-aware traces, and revision handoff. All references carry the new binding. Exact trace after the focused repair: the starter CLI on `failed` still prints `VALID score=80 pass=true` and exits 0 because the starter validator does not bind evidence to the manifest. The real shared validation is used by the test runner, without dependency injection or replacement of the shared rules module. Therefore the starter tests reject only the stale-binding case and end with `TESTS total=8 passed=7 failed=1`, exit 1. The unknown-criterion, malformed-points, and bad-sum cases are rejected by the actual `shared/package-validation.mjs` rules, not by a simulated adversarial substitute. A correct repair imports the shared module with the ordinary relative import used by this ESM project and supplies the evidence-binding callback required by `validatePackageCore`. The repaired CLI on `failed` prints `INVALID E_BINDING architecture-and-state-model.md:attemptId` and exits 1. The repaired CLI on `revised` prints `VALID score=80 pass=true` and exits 0. Reference tests end with `TESTS total=8 passed=8 failed=0` and exit 0. To test your understanding, change only the binding in one of the eight artifacts while leaving its filename, criterion IDs, integer points, declared sum, safe local references, manifest schema, case ID, version, outcome, and provider metadata unchanged. The causal result should be a binding error naming that artifact and the first mismatched key, while the other seven artifacts remain valid. This demonstrates why evidence existence alone is insufficient: the validator must compare each artifact's `attemptId`, `version`, `caseId`, and `outcome` with the manifest. The eight-artifact package remains an offline structural check, not a model-quality evaluation, live approval, or human signature. The changed-input test copies the revised eight-file package, changes caseId from support-017 to support-099 in the manifest and every binding, and changes the synthetic input text. Acceptance proves that the repair compares values rather than hard-coding support-017. Rejection of the stale fixture plus acceptance of revised, complete, and changed fixtures supplies causal evidence against both permissive and deny-all repairs. This exercise is fixture simulation. No API, model, MCP server, human approver, external ticket system, or real write is invoked. The strings describing approvals and decisions are teaching records, not signed approvals. Node.js native ECMAScript module behavior is documented at https://nodejs.org/api/esm.html. Instructor narration: reproduce before editing, read the failed package's first lines, and identify the first mismatch. Show that the shared rules are used by starter and reference. Then add only the binding parser and comparator. Close by running both rejection and acceptance cases and asking which claims still need live testing or human review.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>

## Narration: Capstone Lab Activity Lab Narration

From the repository root, run the starter CLI against the failed fixture and record its incorrect successful decision. Then run the immutable tests. The exact starter count is four passes and four failures. Unknown criterion, malformed point string, bad sum, and stale binding all pass the starter validator and therefore fail their rejection tests. Do not change fixtures, shared logic, or tests. Implement the same binding validation contract demonstrated by the reference, but write and explain your own code before comparison. All shared score, type, criterion, manifest, sum, and path validation remains in `shared/package-validation.mjs`. Run the tests again. A complete repair must reject stale binding, unknown criterion IDs, non-integer or excessive points, bad sums, unsafe references, and missing evidence. It must accept the revised fixture, the complete fixture, and generated support-099 changed input. Returning invalid for every package fails the acceptance tests. Inspect all eight files in failed and revised. Write a short causal handoff containing defect, violated invariant, containment decision, changed code, revision evidence, residual limits, and commands run. State explicitly that the result qualifies an offline package validator, not a live agent or a human safety judgment. Recovery procedure: if an edit breaks imports or parsing, restore the starter file from `starter/validator.original.mjs`, rerun the baseline commands, and make one focused change. To inspect a known-good implementation without overwriting your attempt, compare against `reference/validator.mjs`. Preserve the failed fixture and do not repair evidence by rewriting history. Visual cue: use a four-step panel labeled reproduce, localize, repair, recover. At each step, retain the command, exact output, exit code, and evidence path. Instructor narration: require a prediction before each run. If malformed-score tests fail, inspect whether the shared validator was bypassed. If revised or support-099 fails with E_BINDING, inspect whether all four keys and the evaluation JSON binding are handled. If every package fails, the repair is deny-all rather than provenance validation.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>

## Assessment Handoff: Assessment Handoff

When ready, begin the knowledge check. You will prove writes with durable evidence, reconcile timeouts, require criterion-level references, use the flawed exemplar for calibration, and apply the dual eighty-percent completion gate. Then return to the versioned capstone submission.

## Closing: Class Closing

A reliable agent is bounded by state, authority, evidence, evaluation, privacy-aware observability, and tested recovery. Preserve failed and revised attempts so mastery reflects improvement, not hidden replacement.
