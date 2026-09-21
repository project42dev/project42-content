# Evaluate the Exact Serving Build: text-only class

This route contains the complete teaching content, learner actions, feedback,
and assessment handoff without requiring audio, video, or animation.

## Welcome: Welcome And Outcomes

Welcome. This class is about making a release decision for the exact serving build you intend to deploy. We are not deciding whether a model family is generally good. We are deciding whether one immutable combination of artifact, tokenizer, template, adapter, runtime, quantization, hardware, policy, and configuration has enough evidence for a particular release. We will write falsifiable claims and gates, build governed cases, combine deterministic checks with calibrated human judgment, compare baseline and candidate by slice and distribution, repair a deliberately unsafe gate, and issue a human release disposition. All dossier outputs, identities, measurements, reviewer names, and signatures in this lesson are synthetic fixtures. They are not observations from a live endpoint, and they do not constitute approval.

Visual alternative: The lesson evaluates an exact serving build using synthetic fixture evidence and does not approve a live endpoint.

## Narration: Claims And Gates Narration

Begin with claims, before running the candidate. List supported tasks, users, languages, modalities, contexts, tools, safety boundaries, accessibility requirements, latency and throughput objectives, cost and privacy rules, and recovery behavior. Convert each item into an observable case, a scoring rule, a critical slice, a must-not-regress condition, and a threshold. Also state prohibited effects. In this dossier, five supported claims cover grounded answers, English and Spanish requests, accessible plain-language output, authorized read-only tool use, and stable refusal behavior. Three prohibited effects forbid unauthorized tool calls, disclosure of fixture secrets, and unsafe incident instructions. Two service objectives set a synthetic p95 latency limit of 220 milliseconds and a zero-crash requirement. The recovery claim requires a failed dependency to produce a bounded error and a successful retry after restoration. These are synthetic teaching claims, not measurements from a live endpoint. A claim is useful only if it could be shown false by an observed result.

Visual alternative: Each release claim is falsifiable and connected to observable evidence.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Demonstration: Exact Build Identity Demonstration

Now inspect the exact identity contract. It requires nonempty typed values for artifact digest, tokenizer digest, template digest, adapter identity, runtime version, quantization, hardware profile, policy digest, configuration digest, and case-set version. Digest fields use sha256 identifiers. The fixture values are synthetic labels, not cryptographic attestations. Unknown, missing, empty, extra, or mistyped identity fields invalidate the dossier. A family label is not enough. Meta Llama, Qwen, DeepSeek, Mistral, Microsoft Phi, and NVIDIA software refer to different families, repositories, serving components, and optimization tools. Do not infer a shared interface, tokenizer, security boundary, license, tool-use contract, or runtime behavior from those names. Consult the relevant first-party repository, then evaluate the exact combination actually deployed. The target is not a model card result or a benchmark result from a different system. It is the bound build named by the dossier.

Visual alternative: The exact build is identified by artifact, tokenizer, template, adapter, runtime, quantization, hardware, policy, configuration, and case-set values.

Sources:

- <https://github.com/meta-llama/llama-models>
- <https://github.com/QwenLM/Qwen>
- <https://github.com/deepseek-ai/DeepSeek-V3>
- <https://github.com/mistralai/mistral-inference>
- <https://github.com/microsoft/PhiCookBook>
- <https://github.com/NVIDIA/TensorRT-LLM>

## Demonstration: Claim Traceability Demonstration

Map claims to evidence rather than averaging unrelated obligations. A grounded answer can receive an exact citation and schema check. Usefulness and language quality can receive blinded human review. Authorization can receive deterministic policy and side-effect checks. Latency can receive a distribution under controlled hardware, runtime, request, concurrency, and warm-up conditions. Recovery can receive a timed exercise and exact identity comparison. The predeclared rubric says PASS requires a structurally valid dossier, exact expected identity, nonempty baseline and candidate results, complete evidence with correct subject and case binding, truthful integer denominators, an aggregate pass rate of at least 0.90, no failed critical case, both service objectives, and every bound recovery case. BOUNDED PILOT covers an aggregate from 0.85 through less than 0.90 when there is no critical failure and compensating control is documented. HOLD FOR EVIDENCE applies when identity, evidence, denominator, calibration, or required review material is incomplete. REJECT applies before deployment when a critical case, prohibited effect, service objective, or recovery requirement fails. ROLL BACK applies after deployment when the same condition is observed or a declared rollback trigger fires. An automated predicate supplies evidence. An authorized human still decides promotion.

Visual alternative: No single score or automated predicate can replace critical gates and accountable human authorization.

Sources:

- <https://platform.claude.com/docs/en/test-and-evaluate/develop-tests>
- <https://developers.openai.com/api/docs/guides/evaluation-best-practices>
- <https://mlcommons.org/benchmarks/inference-datacenter/>

## Narration: Versioned Cases Narration

Build a governed, versioned case set. Cover common tasks, important users and data slices, short and long contexts, multilingual and accessibility needs, edge cases, known failures, adversarial prompts, unsafe requests, prompt injection, malformed protocol input, timeouts, overload, dependency failure, restart, rollback, and incident reproduction. Keep holdout cases separate from prompt, template, adapter, policy, threshold, and configuration tuning. For every case, record owner, purpose, source, permission, sensitivity, expected properties, prohibited effects, allowed tool trajectory, rubric, and expiry. Minimize personal or restricted data, and use synthetic or approved fixtures when possible. Review generated cases for realism, duplicated patterns, mislabeled expectations, and hidden leakage. The twelve synthetic cases are C01 and C02 representative grounded-answer cases; C03 a Spanish slice; C04 a short-context boundary; C05 an adversarial prompt-injection case; C06 the critical authorization slice; C07 plain-language accessibility; C08 dependency failure; C09 an incident involving secret-like text; C10 an overload boundary; and C11 and C12 sealed holdouts for recovery and unsafe-instruction refusal. The fixtures are marked internal-training and expire on 2026-10-13. A real production case set needs permission and privacy review.

Visual alternative: C01 through C12 cover declared use cases and operational risks, with C11 and C12 kept sealed as holdouts.

Sources:

- <https://platform.claude.com/docs/en/test-and-evaluate/develop-tests>
- <https://developers.openai.com/api/docs/guides/evaluation-best-practices>
- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Narration: Graders Narration

Match each property to a grader. Deterministic checks own schemas, citations, authorization, policy flags, permitted tool trajectories, side effects, timeouts, resource limits, exact identities, and recovery postconditions. Blinded humans own usefulness, nuance, accessibility, and high-consequence quality that cannot safely be reduced to one exact rule. A model-assisted grader may add a versioned usefulness signal after calibration against labeled examples and disagreement analysis. In this dossier its version is fixture-grader-1.0, and it has four calibration items: two agreements and two disagreements. The raw agreement is two out of four. That is 2 divided by 4, which equals 0.5, or 50 percent. This tiny fictional record is explicitly non-authoritative. On CAL-02, the model grader passed a fluent answer that contradicted the supplied source; the citation check and human label failed it. On CAL-03, the model grader failed a concise Spanish answer while the bilingual human label found it correct. These disagreements have causes. Fluency cannot substitute for source fidelity, and language preference cannot substitute for correctness. Preserve raw outputs, traces, grader versions, rubrics, rationales where appropriate, overrides, and adjudication. Any disagreement on a critical or prohibited-effect case goes to an authorized human. Candidate output cannot grade itself, and no model grader has promotion authority.

Visual alternative: The model-assisted grader is a versioned signal only, with two agreements and two disagreements out of four calibration items.

Sources:

- <https://platform.claude.com/docs/en/test-and-evaluate/develop-tests>
- <https://developers.openai.com/api/docs/guides/evaluation-best-practices>
- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Checkpoint: Critical Gate Checkpoint

Checkpoint. The candidate improves average usefulness and latency, but one predeclared must-not-regress authorization case performs an unauthorized write. A model grader rates the answer highly. What should the release gate do, and which evidence controls the decision? State the disposition, the blocking condition, and the evidence that must be preserved.

Learner action: Choose reject or hold, identify the unauthorized write as a critical prohibited effect, preserve deterministic side-effect evidence and grader disagreement, and require authorized human adjudication.

Sources:

- <https://developers.openai.com/api/docs/guides/evaluation-best-practices>
- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Pause: Checkpoint Response Time

## Feedback: Critical Gate Feedback

The correct reasoning honors the predeclared critical authorization gate. The unauthorized write is a prohibited effect, so the candidate cannot pass because its averages improved or because a model grader preferred the answer. Reject it before deployment, or hold it while the required investigation and authorized decision are completed. Preserve the exact build identity, raw output and trace, deterministic policy decision, side effect record, and model-grader disagreement. Investigate which layer caused the effect. If the answer averaged away the failure, the repair is to restore the distinction between a release-blocking invariant and a trend metric. The critical result remains blocking until an authorized process resolves it. A high score is not permission to ignore a safety boundary.

If correct: Correct. You kept the critical authorization failure blocking and preserved the evidence for human investigation.

If retrying: Do not average away an unauthorized effect. Identify the critical gate, preserve the side-effect record, and require authorized human disposition.

Sources:

- <https://developers.openai.com/api/docs/guides/evaluation-best-practices>
- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Narration: Slice Comparison Narration

Compare baseline and candidate under the same explicitly bound conditions. Bind the case set, prompt set, deterministic seed 4242, greedy sampling, request limit 12, concurrency 1, synthetic CPU hardware allocation, fixture runtime, grader versions, rubric, and load schedule. Keep every case exactly once in both nonempty result sets. Only the declared candidate variables differ: artifact digest, template digest, quantization, and configuration digest. Any other condition drift invalidates attribution. Report integer numerators and denominators, severity, uncertainty, disagreements, latency distributions, resource use, and failures by slice. MLPerf Inference demonstrates why a performance result is specific to a defined workload, scenario, and measured system. It does not prove that this application's claims, accessibility, safety, or recovery behavior passes. Docker documents that containers have no resource constraints by default, so resource limits must be configured or recorded rather than assumed. Investigate every critical regression and every unexpected improvement. A faster quantized build can alter quality. A safer refusal policy can create false blocks. An aggregate can conceal harm to a smaller group or rare workflow.

Visual alternative: Baseline and candidate are compared under the same case, grader, sampling, runtime, hardware, and load conditions, except for declared build variables.

Sources:

- <https://mlcommons.org/benchmarks/inference-datacenter/>
- <https://docs.docker.com/engine/containers/resource_constraints/>
- <https://platform.claude.com/docs/en/test-and-evaluate/develop-tests>
- <https://developers.openai.com/api/docs/guides/evaluation-best-practices>

## Demonstration: Worked Dossier Demonstration

Work the fixture arithmetic. The baseline passes 10 of 12 cases. Compute 10 divided by 12: that is 0.833333 repeating, or 83.33 percent when displayed to two decimal places. The candidate passes 11 of 12. Compute 11 divided by 12: that is 0.916666 repeating, or 91.67 percent. The candidate clears the aggregate threshold of 0.90. But C06, the critical authorization case, changes from one of one passing in the baseline to zero of one passing in the candidate, and the candidate performs an unauthorized write. Representative cases improve from one of two to two of two. Spanish remains one of one. Accessibility improves from zero of one to one of one. Failure, incident, overload, and both holdouts pass. The candidate latency observations, in milliseconds, are 82, 88, 94, 101, 109, 116, 123, 131, 144, 159, 177, and 196. Under the dossier's declared nearest-rank method, the p95 is 196 milliseconds, below the 220 millisecond objective. The candidate has zero crashes. Those service results do not cancel C06. The correct predeployment disposition is REJECT. If C06 were observed after promotion, the disposition would be ROLL BACK. Do not report the obsolete result of 21 passes and 3 failures. The authoritative fixture result is 11 of 12 for the candidate, with C06 failed.

Visual alternative: The candidate reaches 91.67 percent overall and 196 milliseconds p95, but fails critical authorization case C06 and must be rejected.

Sources:

- <https://mlcommons.org/benchmarks/inference-datacenter/>
- <https://developers.openai.com/api/docs/guides/evaluation-best-practices>

## Learner Prompt: Release Prediction Prompt

Predict the release result before reading the repair lab. The starter gate prints PASS aggregate=91.67% criticalFailures=1 and exits with code 0, even though C06 has an unauthorized write. After a correct repair, predict the exact output and exit code. Also predict what should happen when a changed valid dossier has all twelve cases passing, complete evidence, matching identity, both service objectives, and successful recovery.

Learner action: Record predictions for the starter, repaired candidate, and all-pass changed dossier before viewing the answer.

Sources:

- <https://nodejs.org/api/process.html>
- <https://nodejs.org/api/test.html>

## Pause: Release Prediction Pause

## Demonstration: Repair Lab Demonstration

This second lab repairs a release gate. It uses strict local parsing and validation. Malformed, empty, unknown, mistyped, unbound, or arithmetically false dossier data must be rejected before the gate predicate runs. This is fixture simulation. It is not a live model evaluation, cloud execution, or approval decision.

The deliberate defect is only in gate dot js. The starter decides from aggregate pass rate alone. That lets an aggregate of ninety-one point sixty-seven percent pass even when one critical check fails. Edit only gate dot js. Preserve the parser and validator.

The correct decision combines independent conditions. Identity must match exactly. Baseline and candidate results must be present and nonempty. Evidence must be complete. Denominators must be truthful. The aggregate must reach ninety percent. There must be no critical failure. Both service objectives must pass, and recovery must succeed. The gate fails closed when any one of these conditions fails.

Do not reject every input, inspect a fixture name, or hard-code check C zero six. Those shortcuts would hide defects and fail the valid all-pass case. The starter output is pass with an aggregate of ninety-one point sixty-seven percent and one critical failure. The repaired output is reject with the same aggregate, one critical failure, and the reason critical failure C zero six. The repaired process exit code is two, while the starter process exit code is zero.

Install the starter and predict the test result before looking at the answer. Sixteen of twenty-four tests pass, so the process exits with code one. The failures identify the causal gaps: a critical failure was averaged away, exact output and exit behavior were wrong, identity mismatch was accepted, denominators were mismatched, evidence was incomplete, the aggregate was too low, a service failed, or recovery failed.

Now apply the focused repair. Run the independent learner tests. Then compare them with the independent reference implementation. Both should pass all twenty-four tests and exit with code zero. Timing fields in Node test output can vary, so compare the meaningful result, counts, and exit code. Restore the starter when you need to repeat the exercise. These tests show gate behavior on supplied dossiers. They do not establish a real release approval.

Visual alternative: The lab repairs only src/gate.js and tests whether independent conditions fail closed without rejecting valid all-pass input.

Sources:

- <https://nodejs.org/api/esm.html>
- <https://nodejs.org/api/process.html>
- <https://nodejs.org/api/fs.html>
- <https://nodejs.org/api/test.html>
- <https://nodejs.org/api/child_process.html>

## Feedback: Repair Causal Feedback

The causal answer is that aggregate-only logic answers the wrong question. Eleven ordinary passes cannot compensate for an unauthorized write. The repair composes independent conditions and reports the failed condition. Identity mutations produce identity-mismatch. Omitted evidence produces evidence-incomplete. A declared denominator inconsistent with records produces denominator-mismatch. Aggregate, service, and recovery failures produce their own reasons. Empty identities, a missing baseline, or a recovery label that has no bound evidence are validation errors, not PASS inputs. The validator also rejects unknown fields, type errors, malformed schema versions, condition drift, duplicate evidence, wrongly bound evidence, and false arithmetic. The decision must use parsed content. Renaming a generated file or changing a noncritical case while recomputing its denominator must not alter the logic. A filename check or memorized answer would therefore be wrong. The lab proves gate behavior over trusted synthetic records only. It does not scan, attest, benchmark, approve, or observe a live model or endpoint.

If correct: Correct if you identified independent fail-closed conditions and rejected filename checks or deny-all logic.

If retrying: The repair must block each failed condition while accepting a valid changed all-pass dossier. Do not hard-code a case or reject every input.

Sources:

- <https://nodejs.org/api/fs.html>
- <https://nodejs.org/api/test.html>
- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Learner Prompt: Changed Valid Case Prompt

Now complete the changed-input task. Imagine the candidate record is changed so all twelve cases pass, every bound evidence record remains present, identity still matches, both service objectives pass, and recovery passes. The input is valid, but its filename is changed. Before viewing the answer, state the aggregate numerator and denominator, critical failure count, exact expected output, exit code, and why deny-all is not a valid repair. Also explain what happens if a noncritical case changes while its integer denominator is recomputed consistently.

Learner action: Answer the changed valid case separately from the original candidate and explain why content-based evaluation must accept it.

Sources:

- <https://nodejs.org/api/process.html>
- <https://nodejs.org/api/test.html>

## Pause: Changed Valid Case Pause

## Feedback: Changed Valid Case Feedback

The changed valid dossier has 12 of 12 passing cases. Twelve divided by twelve is 1.00, or 100.00 percent. It has zero critical failures. The exact output is PASS aggregate=100.00% criticalFailures=0 followed by a newline, and the exit code is 0. A renamed file must receive the same decision because the gate reads validated content, not a filename. A changed noncritical case can still pass when its record, evidence, and recomputed integer denominator remain truthful and all other conditions hold. Deny-all is not a repair because the gate must distinguish a dossier with a critical failure from a valid positive control. The all-pass variation demonstrates that the predicate is selective and fail-closed, not universally negative.

If correct: Correct. You separated the changed valid all-pass result from the original C06 failure and rejected deny-all logic.

If retrying: The positive control is 12/12, 100.00 percent, zero critical failures, PASS, and exit code 0. Its filename must not matter.

Sources:

- <https://nodejs.org/api/process.html>
- <https://nodejs.org/api/test.html>

## Narration: Release Disposition Narration

Issue one explicit disposition and preserve the evidence. Link every claim to cases, results, graders, and thresholds. Record exact baseline and candidate identities, critical findings, uncertainty, exceptions, compensating controls, intended reviewers and authority, monitoring, expiry, stop conditions, and rollback criteria. The signed-paper disposition in this fixture says REJECT, but every listed signature is explicitly fictional and unperformed. It is a teaching record, not an approval. If identity or evidence were missing, the correct disposition would be HOLD FOR EVIDENCE rather than PASS. If C06 appeared after promotion, the correct disposition would be ROLL BACK. A future authorized deployment would monitor unauthorized tool attempts, policy denials, secret-pattern alerts, p95 latency under the declared method, crash rate, dependency recovery, and slice regressions. Re-run the full gate after any artifact, tokenizer, template, adapter, runtime, quantization, hardware, policy, configuration, data, traffic, case-set, or grader change, and no later than evidence expiry. Roll back on a critical prohibited effect, persistent service-objective breach for the declared window, failed recovery test, or identity drift. Kubernetes security guidance is configuration guidance, not proof that a deployed control is enforced.

Visual alternative: The fixture disposition is not approval; human authorization, monitoring, expiry, and rollback criteria remain necessary.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>
- <https://kubernetes.io/docs/concepts/security/security-checklist/>

## Learner Prompt: Activity Transition

Now create the exact-build release gate. Define one synthetic immutable serving build, five supported claims, three prohibited effects, two service objectives, and one recovery claim. Use the supplied twelve cases: C01 and C02 representative grounded answers, C03 Spanish, C04 short context, C05 prompt injection, C06 critical authorization, C07 accessibility, C08 dependency failure, C09 incident, C10 overload, and C11 and C12 sealed holdouts. Assign deterministic, blinded human, or calibrated model-assisted graders. Compare nonempty baseline and candidate results under the same explicit conditions. Report exact integer arithmetic by slice and distribution. Then issue pass, bounded pilot, hold, reject, or rollback with evidence links, authority, monitoring, expiry, and regression additions. Remember that the activity uses synthetic fixture records and does not invoke an endpoint.

Learner action: Complete the versioned claims, governed cases, grader assignments, baseline-candidate comparison, changed-input reasoning, critical-failure handling, and evidence-linked human disposition.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>
- <https://mlcommons.org/benchmarks/inference-datacenter/>
- <https://platform.claude.com/docs/en/test-and-evaluate/develop-tests>
- <https://developers.openai.com/api/docs/guides/evaluation-best-practices>

## Pause: Activity Work Time

## Assessment Handoff: Assessment Handoff

Begin the knowledge check when you can identify the exact evaluation target, protect holdout independence, bound model-assisted grading, preserve a must-not-regress gate, explain slice reporting, distinguish the original C06 failure from the changed all-pass case, and name the authorized human release decision. The check starts only when you choose Begin knowledge check.

## Closing: Class Closing

Remember the central rule: evaluate the immutable system you will deploy, not a family label or unrelated benchmark. Write claims before evidence, keep holdouts independent, preserve exact case and identity bindings, keep every grader bounded, expose critical slices, reject malformed and incomplete dossiers, and never average away a prohibited effect. In this synthetic dossier, 11 of 12 and 91.67 percent still means REJECT because C06 performs an unauthorized write. A valid changed dossier with 12 of 12 and 100.00 percent can pass because the gate is not deny-all. Evidence supports the decision, but accountable humans decide promotion, pilot, hold, rejection, or rollback.

Visual alternative: Critical failures block release even when aggregate quality improves, while valid all-pass content can pass.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>
