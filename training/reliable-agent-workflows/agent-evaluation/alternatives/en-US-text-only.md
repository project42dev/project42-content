# Evaluate Agent Behavior with Evidence: text-only class

This route contains the complete teaching content, learner actions, feedback,
and assessment handoff without requiring audio, video, or animation.

## Welcome: Welcome And Outcomes

Welcome. This class replaces impressive agent demos with repeatable release evidence. You will define testable behavior claims, build representative and adversarial cases, score outcomes and trajectories, compare a candidate with a baseline, and turn production failures into governed regression tests.

## Narration: Evaluation Contract

An evaluation is a repeatable experiment, not a guided demonstration. Start with a claim that evidence can confirm or reject. Identify the workflow and configuration version, target population, expected outcome, unacceptable behavior, scoring rules, sample, environment, budgets, and release threshold before running the candidate. Separate task success from style, safety, policy compliance, efficiency, and user experience. A pleasant answer may violate authority. A safe trajectory may still produce an unusable result. One average cannot express both. Give every case a stable identifier, slice, versioned input fixture, observable expected outcome, allowed tool trajectory, forbidden behavior, rubric, and latency, cost, turn, or retry budget. Predeclared claims and thresholds reduce the temptation to redefine success after seeing results.

Visual alternative: Each case has a stable ID and slice plus versioned inputs, observable outcomes, permitted tools, prohibited behavior, scoring criteria, and resource limits.

Sources:

- <https://developers.openai.com/api/docs/guides/evaluation-best-practices>
- <https://www.nist.gov/itl/ai-risk-management-framework>

## Narration: Representative And Adversarial Set

Build a set that reflects the product, not merely what is easy to pass. Include common tasks, important user journeys, supported languages and modalities, high-impact groups, difficult long-tail cases, and actual data distributions. Preserve a holdout set so repeated tuning does not overfit every known example. Add boundaries and adversarial conditions: ambiguous intent, prompt injection, missing permission, stale or conflicting evidence, malformed tool output, timeouts, unsafe requests, and policy conflicts. Every confirmed production incident should yield the smallest reproducing case after privacy review. Synthetic generation can broaden coverage, but a human must decide whether each synthetic case represents a real product behavior or risk. Track source, consent, transformation, retention, and slice membership so a case remains governed and interpretable.

Visual alternative: Four representative, two boundary, two adversarial, and two prior-failure cases cover important journeys and critical risks.

Sources:

- <https://developers.openai.com/api/docs/guides/evaluation-best-practices>
- <https://platform.claude.com/docs/en/test-and-evaluate/develop-tests>
- <https://adk.dev/evaluate/>

## Narration: Score Outcome And Trajectory

Score both what happened and how it happened. Deterministic graders fit schemas, exact constraints, calculations, permission decisions, tool arguments, postconditions, terminal states, and latency or cost budgets. Human reviewers fit nuanced usefulness, clarity, and context-dependent judgment when guided by an explicit rubric and blinded to candidate identity. Model graders can add scalable signals, but they are not ground truth. Calibrate them against human-labeled examples, version their prompts and models, measure agreement by slice, and route material disagreement for review. For agent runs, inspect tool choice, input validation, approvals, authority, retry count, evidence preservation, handoffs, verification, and final state. A correct final sentence can hide a forbidden tool call or duplicate write. An imperfect but safely contained run may reveal a recoverable product defect instead of a safety failure.

Visual alternative: Deterministic checks, blinded human review, and calibrated model signals contribute separate evidence to a scored run.

Sources:

- <https://developers.openai.com/api/docs/guides/evaluation-best-practices>
- <https://platform.claude.com/docs/en/test-and-evaluate/develop-tests>
- <https://adk.dev/evaluate/>

## Demonstration: Grader Demonstration

Consider an agent that creates a correct support summary. The final-answer grader awards full points. The trajectory check finds that the agent queried an unrelated customer record, skipped approval, and retried a write after an unknown timeout. Permission and postcondition checks fail, so the case is a critical failure despite the polished summary. A second run asks for clarification, stays within one account, records approval, and stops after a provider error. It earns fewer usefulness points but passes safety and recovery criteria. This comparison shows why one overall impression is not a release gate.

Visual alternative: The polished run fails permission, approval, and retry checks. The bounded run requests clarification, preserves authority, and stops safely.

Sources:

- <https://developers.openai.com/api/docs/guides/evaluation-best-practices>
- <https://www.nist.gov/itl/ai-risk-management-framework>

## Narration: Compare And Gate

Compare baseline and candidate on identical case versions, fixtures, environment, budgets, grader definitions, and sampling rules. Report pass rate and score distribution by slice, not only a global mean. Include critical failures, grader disagreement, latency percentiles, cost per successful task, retries, and uncertainty. Before the run, declare must-not-regress slices and the minimum practical improvement that justifies change. A higher average cannot excuse a new permission bypass, cross-tenant disclosure, uncontrolled purchase, or unreconciled write. Investigate changed cases individually and record whether the difference comes from model behavior, prompt, tool, retrieval, policy, orchestration, or infrastructure. The release decision is ship, hold, or rollback with named evidence, reviewer, residual risk, and follow-up work. Safety, authority, and high-impact behavior require accountable human sign-off.

Visual alternative: Candidate improvements are accepted only when must-not-regress safety and permission slices pass and practical improvement exceeds the declared threshold.

Sources:

- <https://developers.openai.com/api/docs/guides/evaluation-best-practices>
- <https://adk.dev/evaluate/>
- <https://www.nist.gov/itl/ai-risk-management-framework>

## Narration: Continuous Evaluation

Make evaluation a controlled learning loop. Privacy-reviewed production traces, explicit feedback, escalations, and incidents can reveal cases the offline set missed. Remove or transform sensitive content while preserving the behavior that caused failure. Apply consent, access, retention, deletion, and provenance requirements before adding anything to the corpus. Version the case, fixture, expected behavior, rubric, deterministic checks, model-grader configuration, workflow, tools, policies, environment, and results. Keep prior versions so release and rollback decisions remain reproducible. Monitor case duplication, slice balance, label quality, grader drift, and holdout contamination. A dashboard score without the inputs and decision rules that produced it is an observation, not durable release evidence.

Visual alternative: Incident evidence is minimized, reviewed, versioned, added to the proper slice, and protected from holdout contamination.

Sources:

- <https://developers.openai.com/api/docs/guides/evaluation-best-practices>
- <https://platform.claude.com/docs/en/test-and-evaluate/develop-tests>
- <https://www.nist.gov/itl/ai-risk-management-framework>

## Learner Prompt: Learner Evaluation Prompt

Choose one agent workflow. Write the release claim, one must-not-regress slice, its observable threshold, and one trajectory failure that a final-answer score would miss.

Learner action: Create a predeclared evaluation claim and critical trajectory gate.

## Pause: Learner Work Time

## Checkpoint: Critical Slice Checkpoint

Checkpoint. The candidate improves the average score but fails one critical permission case. May the team ship because the aggregate improved?

Learner action: Hold or fix the release because a predeclared critical gate failed.

Sources:

- <https://developers.openai.com/api/docs/guides/evaluation-best-practices>

## Pause: Checkpoint Response Time

## Feedback: Critical Slice Feedback

Do not ship on the average. Honor the must-not-regress permission gate, inspect the failed case, and record a hold or rollback until the violation is corrected and retested. If you chose to adjust the case weight after the result, return to the predeclared threshold; post-hoc weighting makes the decision untrustworthy. If you rejected every candidate regression, refine the rule: noncritical tradeoffs may be accepted when thresholds, uncertainty, reviewer approval, and residual risk are explicit.

If correct: You preserved the predeclared critical-slice gate instead of rationalizing an unsafe average.

If retrying: Check whether any must-not-regress behavior failed before considering aggregate improvement.

Sources:

- <https://developers.openai.com/api/docs/guides/evaluation-best-practices>
- <https://www.nist.gov/itl/ai-risk-management-framework>

## Transition: Activity Transition

Open the agent evaluation activity. Build ten versioned cases, a 100-point rubric, and deterministic checks for schema, permissions, postconditions, turns, latency, and cost. Blind-score baseline and candidate, review disagreement by slice, choose ship, hold, or rollback using predeclared thresholds, and add one failure to the regression set.

## Pause: Activity Work Time

## Narration: Validate Evidence Before Aggregation Lab Narration

A release gate is only meaningful over a defined numeric domain. JavaScript addition can concatenate strings, comparisons with NaN are false, and malformed string thresholds can make every comparison false. A generic mean function must therefore require a non-empty array of finite numbers rather than relying on coercion. The prior defective boundary behavior was measured explicitly. A string total of not-a-score produced a NaN average but still yielded SHIP. A total of 101 exceeded the 100-point rubric but still yielded SHIP. String thresholds caused zero-score cases to yield SHIP. A negative total happened to produce HOLD, but the decision did not make the malformed input valid. All four inputs must now be rejected before release aggregation. Validation checks each fixed ID and its corresponding slice, required strings, non-empty string trajectories, Boolean critical flags, finite score fields, component ranges, total range, exact score sum, nonnegative finite latency and cost evidence, human and model scores in the 0 to 100 domain, unique IDs, finite threshold ranges, and maxCriticalPolicyFailures exactly equal to zero. When the full contract is requested, it also requires all ten stable IDs and all four slices. The starter and reference gates share schema-validation.mjs. This is intentional. The learner is repairing only the release decision, not rediscovering input validation. The sole starter defect is that detected critical failures are not added to the reasons array. Failing closed means malformed evidence cannot produce SHIP. The evaluator throws a validation error, and the command-line wrapper catches it, prints a validation HOLD, and exits 1. Tests pass only when a specified malformed input is rejected with a matching validation error. An unexpected exception is a failed test, not a pass.

Sources:

- <https://developers.openai.com/api/docs/guides/evaluation-best-practices>

## Narration: Decision Practice Lab Narration

After the worked repair, evaluate the independent recovery fixture without changing the original ten cases. It overrides only ADV-01 candidate evidence. The unsafe account write is replaced by escalate_to_human, policy rises from 0 to 20, the total rises from 80 to 100, and the critical flag becomes false. Predict the result before running it. Representative remains 93.00, boundary remains 87.00, adversarial becomes 95.00, regression remains 90.00, and the overall mean becomes 91.60. Because validation passes, all numeric gates pass, and there are no critical failures, the result must be SHIP with exit 0. This supplies causal feedback. If the original and recovery both HOLD, the repair may be deny-all. If both SHIP, the zero-tolerance condition is still absent. If malformed evidence SHIPs, validation is incomplete. Only HOLD for the original, SHIP for recovery, and rejection of malformed variants demonstrates the intended behavior. Create a second learner-owned variation by lowering both adversarial totals to 79 while raising the other eight valid totals to 100. Keep component sums valid. Its overall mean is 95.80, but its adversarial mean is 79.00. Predict HOLD. This proves that a strong overall score does not override a weak required slice.

Sources:

- <https://developers.openai.com/api/docs/guides/evaluation-best-practices>

## Assessment Handoff: Assessment Handoff

When ready, begin the knowledge check. You will place thresholds before results, score agent trajectories, calibrate model graders, enforce critical slices, and identify the versions required for reproducibility.

## Closing: Class Closing

Predeclare the claim, cover reality and failure, score outcome and trajectory, compare identical cases, honor critical gates, and preserve every version needed to reproduce the decision.
