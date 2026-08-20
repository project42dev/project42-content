# Evaluate What You Will Actually Deploy: text-only class

This route contains the complete teaching content, learner actions, feedback,
and assessment handoff without requiring audio, video, or animation.

## Welcome: Welcome And Outcomes

Welcome. This class replaces the question, Is this model good, with a release decision about the exact system you will deploy. You will predeclare claims and gates, govern representative and adversarial cases, combine deterministic checks with calibrated judgment, compare baseline and candidate by slice and distribution, and issue a human disposition backed by reproducible evidence.

## Narration: Claims And Gates Narration

Write the release claims before running the candidate. List supported tasks, users, languages, modalities, context shapes, tools, safety boundaries, accessibility needs, latency and throughput objectives, resource and cost envelopes, privacy rules, and recovery behavior. For each claim, define observable cases, important slices, a scoring rule, an uncertainty treatment, a threshold, and any must-not-regress condition. Also state prohibited effects: unauthorized tool execution, disclosure of protected data, fabricated evidence presented as verified, unbounded resource use, or failure to restore service. The evaluation target is not a provider name, model family, public leaderboard, or unpinned model card result. It is the immutable combination of model artifact, tokenizer, prompt template, retrieval behavior, application adapter, inference server, runtime, quantization, hardware, policy, and configuration. Separate the behavior owned by each layer so a failure can be diagnosed and a rollback can restore a known build. NIST's generative-AI risk profile frames evaluation as part of ongoing risk management; your release gate turns that principle into testable local claims and accountable decisions.

Visual alternative: Every release claim is attached to the immutable artifact, tokenizer, template, adapter, runtime, quantization, hardware, policy, and configuration under test.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Demonstration: Claim Traceability Demonstration

Consider a synthetic support assistant. One claim says approved employees can receive a grounded answer in English or Spanish, with a valid citation, within the agreed latency objective. A prohibited effect says a prompt or retrieved document must never authorize access to another employee's record. A service objective bounds p95 latency and overload behavior under a declared load. A recovery claim says the operator can restore the prior verified bundle and reproduce its health and conformance results. Now map each claim to cases and evidence. Citation structure receives an exact schema check and source-resolution check. Usefulness and language quality receive blinded human review. Authorization receives deterministic policy and side-effect checks. Latency receives a distribution under controlled hardware, runtime, request, concurrency, and warm-up conditions. Recovery receives a timed exercise and exact identity comparison. One average quality number cannot represent these different obligations.

Visual alternative: Grounding, language quality, authorization, latency, and rollback each have distinct cases, graders, thresholds, and evidence.

Sources:

- <https://platform.claude.com/docs/en/test-and-evaluate/develop-tests>
- <https://developers.openai.com/api/docs/guides/evaluation-best-practices>
- <https://mlcommons.org/benchmarks/inference-datacenter/>

## Narration: Versioned Cases Narration

Build a governed, versioned case set. Include common tasks and important user, language, accessibility, workflow, and data slices. Include short and long contexts, edge cases, known failures, unsafe requests, prompt injection, malformed protocol input, timeouts, overload, dependency loss, restart, rollback, and privacy-reviewed incident reproductions. Keep a holdout set separate from prompt, policy, retrieval, and configuration tuning so it remains independent evidence. For every case, record its owner, purpose, origin, permission, sensitivity, expected properties, prohibited effects, allowed tool trajectory, rubric, expiry, and revision history. Minimize personal and restricted data. Prefer synthetic or expressly approved fixtures where they can represent the condition faithfully. Generated cases can expand coverage, but review them for realism, duplicated patterns, mislabeled expectations, and leakage from the tuning set. Anthropic's evaluation guidance emphasizes task-specific, representative, clearly scored evaluations, while OpenAI's evaluation practices likewise stress defined objectives, datasets, metrics, and continuous evaluation. The provider-neutral lesson is simple: cases must represent your declared use, not whatever is easiest to score.

Visual alternative: Representative, boundary, adversarial, accessibility, failure, incident, and holdout rows each list permission, sensitivity, rubric, expiry, and owner.

Sources:

- <https://platform.claude.com/docs/en/test-and-evaluate/develop-tests>
- <https://developers.openai.com/api/docs/guides/evaluation-best-practices>
- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Narration: Graders Narration

Match each property to an appropriate grader. Use deterministic checks for schemas, citation presence and resolution, authorization decisions, policy flags, permitted tool trajectories, side effects, timeouts, limits, exact identities, and recovery postconditions. Use blinded human judgment for usefulness, nuance, accessibility, and high-consequence quality that cannot be reduced safely to one exact rule. A model-assisted grader can add a versioned signal only after calibration against labeled examples. Measure agreement and disagreement by case type and slice. Preserve the grader model and version, prompt and rubric, input boundary, raw score, rationale where appropriate, and escalation outcome. Keep the candidate from serving as its own sole judge. Do not treat an uncalibrated model grader as ground truth, and do not let averaging erase a declared critical failure. Preserve raw outputs, traces, deterministic results, human ratings, overrides, and adjudication. The goal is not to make all graders agree. It is to know where each signal is reliable, where it is uncertain, and which authorized human resolves consequential disagreement.

Visual alternative: No grader has unlimited authority. Critical deterministic failures remain blocking, and model-assisted disagreement is preserved for review.

Sources:

- <https://platform.claude.com/docs/en/test-and-evaluate/develop-tests>
- <https://developers.openai.com/api/docs/guides/evaluation-best-practices>
- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Checkpoint: Critical Gate Checkpoint

Checkpoint. The candidate improves average usefulness and latency, but one predeclared must-not-regress authorization case performs an unauthorized tool action. A model grader still rates the response highly. What does the release gate do, and which evidence controls the decision?

Learner action: Honor the critical authorization gate, hold or reject the candidate, preserve the unauthorized side-effect evidence and grader disagreement, investigate the exact build, and require human disposition.

Sources:

- <https://developers.openai.com/api/docs/guides/evaluation-best-practices>
- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Pause: Checkpoint Response Time

## Feedback: Critical Gate Feedback

A strong answer honors the predeclared critical gate. The deterministic authorization and side-effect evidence shows a prohibited effect, so the candidate cannot pass because its averages improved or a model grader liked the response. Hold or reject it, preserve the exact build, raw trace, policy decision, side effect, and grader disagreement, investigate the responsible layer, and require an authorized human disposition. If your answer averaged the failure away, restore the distinction between a release-blocking invariant and a trend metric.

If correct: You preserved the critical gate and treated the grader disagreement as evidence for human investigation.

If retrying: A predeclared prohibited effect cannot be canceled by a better average or an unbounded grader opinion.

Sources:

- <https://developers.openai.com/api/docs/guides/evaluation-best-practices>
- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Narration: Slice Comparison Narration

Compare baseline and candidate under identical, recorded conditions. Hold cases, seeds or sampling policy where meaningful, request and output limits, prompt template, retrieval fixtures, runtime configuration, hardware allocation, concurrency, warm-up, and load shape constant. Report pass rates, severity, uncertainty, grader disagreement, failure categories, latency percentiles, throughput, resource use, and recovery outcomes by important slice and distribution. MLPerf Inference illustrates why performance claims require a defined system, scenario, rules, and measurement rather than an isolated speed number. Your local gate applies the same discipline to the exact workload you own. Investigate every critical regression and every surprising improvement. A quantized candidate may be faster and less accurate on one long-context slice. A stricter refusal policy may block unsafe requests while creating unacceptable false blocks for a legitimate workflow. A higher aggregate score may hide a severe accessibility, language, or rare operational failure. Record uncertainty and sample limitations instead of converting them into false precision.

Visual alternative: Averages sit beside slice pass rates, severity, uncertainty, disagreement, latency percentiles, resource use, and critical failures.

Sources:

- <https://mlcommons.org/benchmarks/inference-datacenter/>
- <https://platform.claude.com/docs/en/test-and-evaluate/develop-tests>
- <https://developers.openai.com/api/docs/guides/evaluation-best-practices>

## Narration: Release Disposition Narration

Issue one explicit disposition: pass, bounded pilot, hold for evidence, reject, or roll back. Link every release claim to its cases, graders, results, and threshold. Record exact baseline and candidate identities, critical findings, uncertainty, exceptions, compensating controls, reviewers and authority, monitoring, expiry, stop conditions, and rollback criteria. A bounded pilot names who may participate, what traffic is allowed, which controls stay active, and which observation ends or expands the pilot. Publication and promotion remain human decisions. Convert privacy-reviewed production failures and incidents into reproducible regression cases. Re-run the appropriate gates after a change to the artifact, tokenizer, template, retrieval data, runtime, quantization, hardware, adapter, policy, traffic, case set, rubric, or grader. Evidence expires as the system and its environment change. Keeping the baseline bundle and decision record makes a later rollback an evidence-backed operation rather than a guess.

Visual alternative: The decision includes critical findings, exceptions, monitoring, expiry, stop conditions, human reviewers, and preserved rollback.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>
- <https://platform.claude.com/docs/en/test-and-evaluate/develop-tests>
- <https://developers.openai.com/api/docs/guides/evaluation-best-practices>

## Learner Prompt: Activity Transition

Now create the exact-build release gate. Define one synthetic immutable serving build, five supported claims, three prohibited effects, two service objectives, and one recovery claim. Build twelve governed cases spanning representative, slice, boundary, adversarial, accessibility, failure, incident, and holdout coverage. Assign deterministic, blinded human, or calibrated model-assisted graders, then define disagreement and critical-failure handling. Compare synthetic baseline and candidate results under identical conditions by slice and distribution. Issue a pass, bounded pilot, hold, reject, or rollback disposition with evidence links, reviewers, monitoring, expiry, and new regression cases.

Learner action: Complete the versioned claims, governed cases, grader assignments and calibration, baseline-candidate slice results, critical-failure handling, and evidence-linked human release disposition.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>
- <https://mlcommons.org/benchmarks/inference-datacenter/>
- <https://platform.claude.com/docs/en/test-and-evaluate/develop-tests>
- <https://developers.openai.com/api/docs/guides/evaluation-best-practices>

## Pause: Activity Work Time

## Assessment Handoff: Assessment Handoff

Begin the check when you can identify the exact evaluation target, protect holdout independence, bound model-assisted grading, preserve a must-not-regress gate, explain slice reporting, and name the authorized human release decision. The check starts only when you choose Begin knowledge check.

## Closing: Class Closing

Remember: evaluate the immutable system you will deploy, protect independent cases, keep every grader bounded, expose critical slices, and let accountable humans promote only what the evidence supports.
