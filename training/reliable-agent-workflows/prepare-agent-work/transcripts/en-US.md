# Design a Bounded Agent Loop

Package: `prepare-agent-work-class` 1.1.0

> This is the canonical text equivalent of an AI-assisted virtual-instructor
> class. It remains usable without synthesized audio, video, animation, or a
> player runtime.

## Welcome: Welcome And Outcomes

Welcome. You will decide whether the receipt task needs a model-directed loop, define its work order, separate trusted authority from proposals, inspect versioned transitions, run all five terminal cases, modify a learner-owned input, and reconcile an unknown outcome without a blind retry.

## Narration: Workflow Or Agent

Start with the simplest design that can meet the outcome. A fixed workflow for this receipt task can validate the input, check whether write_receipt is allowed, check any required matching approval, preflight one action invocation, write once, and independently verify the receipt. Code owns every next step. A model-directed loop becomes reasonable only when representative observations contain necessary variation that makes the next permitted action difficult to enumerate. Even then, the model proposes rather than authorizes. The offline fixture does not test model reasoning and does not prove that agents outperform fixed workflows. It tests whether the surrounding controller preserves authority, budgets, state, evidence, terminals, and recovery.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>

## Narration: Work Order Contract

Read the completed work order. The outcome is exactly one in-memory receipt containing APPROVED colon prepare-agent-work and its operation key. Scope includes only the controller's in-memory receipt array, state, trace, and bounded ledger. Trusted inputs are the work order, policy, limits, verifier contract, initial revision, and separate approval records. There is no network, credential, paid-model, filesystem, or duplicate-write authority. Completion requires the verifier to inspect the receipt text and operation key. Stop only at COMPLETE, NEEDS_HUMAN, BUDGET_EXHAUSTED, POLICY_BLOCKED, or FAILED_WITH_RECOVERY_EVIDENCE. This contract removes hidden decisions before any proposal is evaluated.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>

## Narration: Trust Boundary

Observations and decisions are untrusted data. They may request an action, but they cannot add it to policy, increase a budget, choose a state revision, or approve themselves. When approval is required, the separate trusted record must exactly match action, resource, operationKey, and stateVersion. A forged approvedByHuman field has no authority. Also distinguish policy from approval. Policy answers whether an action is permitted at all. Approval answers whether a particular permitted operation at a particular revision has human authorization. The built-in success scenario requires no approval. The changed practice scenario requires the existing matching trusted approval.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>

## Narration: State And Transition

Represent the run as state rather than conversation. One iteration inspects, decides, authorizes, preflights, acts, verifies, and records. In the success fixture, beforeState has revision one and no receipt. The decision proposes write_receipt with expectedStateVersion one. Authorization checks the decision kind, implemented action, policy, current revision, and any required approval. Preflight checks the next fixture-time, fixture-token, turn, and action charges. The write invocation is charged, creates one receipt, and advances revision to two. Verification independently checks the receipt text and operation key. A fluent finish proposal cannot replace that evidence.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>

## Narration: Budget And Validation

Budget accounting happens before the next charge. maxActions counts every implemented act invocation, including a noop or an unsuccessful attempt. It is not limited to successful or consequential writes. A requested invocation that would move used actions from zero to one is blocked when maxActions is zero. Missing, negative, NaN, or Infinity costs are malformed and produce POLICY_BLOCKED with zero effects. Fixture time and token cost are deterministic accounting units, not measurements of wall-clock time or provider tokens.

Sources:

- <https://nodejs.org/api/test.html>

## Narration: Terminal Outcomes

Use exactly five lesson terminals. COMPLETE means the independent postcondition passed. NEEDS_HUMAN follows the third semantic no-progress transition. BUDGET_EXHAUSTED means a preflight charge would exceed a configured limit. POLICY_BLOCKED means malformed or unauthorized input was rejected before an effect. FAILED_WITH_RECOVERY_EVIDENCE means a consequential invocation has an unknown outcome and may already have changed the environment. These labels preserve causal evidence. Missing policy is not a budget failure. A stale approval is not no-progress. An unknown write result is not proof of failure and must not be retried blindly.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>

## Demonstration: Runtime Demonstration

From the lab directory, run node --version and confirm Node.js twenty-two or later. Run node --test and inspect the report from your environment. The supplied independent verification used version twenty-four point eighteen point zero and reported eighteen passing tests. Run node controller.js --all and compare its five lines byte-for-byte with expected-summary.txt. The cases must map to COMPLETE, NEEDS_HUMAN, BUDGET_EXHAUSTED, POLICY_BLOCKED, and FAILED_WITH_RECOVERY_EVIDENCE. Run node controller.js --scenario success --trace and compare the JSON with worked-trace.json. Confirm revision one before the write, revision two after, one action charge, one ledger record, one receipt, no approval requirement, and verifier acceptance.

Sources:

- <https://nodejs.org/api/packages.html>
- <https://nodejs.org/api/esm.html>
- <https://nodejs.org/api/test.html>

## Demonstration: Practice Demonstration

Run node controller.js --input practice.json. The expected line is: practice: POLICY_BLOCKED | action write_receipt is not allowed by trusted policy | effects=0. Copy practice.json to my-practice.json. Add write_receipt to policy.allowedActions and change limits.maxActions from zero to one. Keep the existing trusted approval unchanged. Do not add approvedByHuman. Run node controller.js --input my-practice.json. The expected line is: practice: COMPLETE | independent verifier accepted exactly one receipt | effects=1. Inspect the trace and confirm final revision two.

## Learner Prompt: Learner Diagnosis Prompt

Before editing, predict three variants. What happens if you correct only policy? What happens if you correct only maxActions? What happens if policy and budget are correct but the required approval has the wrong stateVersion? Record the terminal, effect count, and failed control for each.

Expected learner action: Predict BUDGET_EXHAUSTED for policy-only, POLICY_BLOCKED for budget-only, and POLICY_BLOCKED with zero effects for stale approval.

## Pause: Diagnosis Response Time

## Feedback: Diagnosis Feedback

Correcting only policy lets authorization proceed until the action preflight, where maxActions zero produces BUDGET_EXHAUSTED before invocation. Correcting only maxActions does not grant permission, so the result remains POLICY_BLOCKED with zero effects. With policy and budget corrected, a stale required approval still produces POLICY_BLOCKED with zero effects because stateVersion is part of the approval binding. The same result applies to mismatched action, resource, or operationKey. Separate checks make the cause visible and prevent one trusted input from silently replacing another.

Correct feedback: You distinguished policy permission, action capacity, and exact approval binding.

Retry feedback: Find the first controller check that fails. Approval cannot replace policy, budget cannot add permission, and stale authorization cannot act on a new revision.

## Demonstration: Unknown Outcome Recovery

Run node controller.js --scenario uncertain --recover. The write fixture creates a receipt but reports an unknown result. The original terminal remains FAILED_WITH_RECOVERY_EVIDENCE. Recovery looks up the operation key before considering a retry, finds one effect, and reports retryPerformed=false. This avoids a duplicate write. The ledger is bounded to thirty-two in-memory records and disappears when the process exits. It is not durable idempotency, distributed concurrency control, production security, or compliance evidence.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>

## Narration: Independent Checks

Passing tests are necessary evidence, but they can miss an authority flaw when the implementation and tests share the same mistaken assumption. Independent checks should rename scenarios so outcomes do not depend on fixture labels, mutate each approval binding, test malformed and nonfinite costs, confirm zero effects on pre-effect blocks, and verify that budgets remain bounded. The supplied independent checks did those things for this fixture. They still do not establish production adapter behavior, model reasoning, persistent recovery, access control, or universal agent superiority.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>

## Transition: Activity Transition

Begin the lab. Retain your test report, exact five-line summary, success trace, learner-owned changed input, changed result, three-variant diagnosis, and uncertain recovery result. For every case, identify state before and after, the first failed or successful controller check, the effect count, budget use, terminal reason, and evidence supporting that terminal.

## Pause: Activity Work Time

## Feedback: Activity Debrief

Debrief your results. The built-in success trace reaches COMPLETE without a human approval requirement. The unchanged practice input is POLICY_BLOCKED because policy omits write_receipt. The changed practice input reaches COMPLETE only after policy permits the action and maxActions permits one invocation, while its existing required approval remains an exact match. Three rejected finish proposals lead to NEEDS_HUMAN. A preflight overspend leads to BUDGET_EXHAUSTED. Malformed or unauthorized input leads to POLICY_BLOCKED. The uncertain write preserves FAILED_WITH_RECOVERY_EVIDENCE, reconciles one effect by operation key, and does not retry.

Correct feedback: Your evidence distinguishes independent completion, no-progress, preflight budget exhaustion, policy denial, and uncertain-outcome reconciliation.

Retry feedback: Return to the first failed controller check and the environment effect count. Do not infer authority or completion from decision text.

## Assessment Handoff: Assessment Handoff

Begin the knowledge check when you can explain the fixed-workflow alternative, approval binding, stale revision block, action-invocation budget, no-progress threshold, independent verifier, and recovery record. Review the class or return to the activity before submitting. The assessment opens only when you choose Begin knowledge check.

## Closing: Class Closing

Prefer fixed code when the path is known. When necessary variation justifies a model-directed loop, bind it with trusted authority, versioned state, preflight budgets, independent evidence, truthful terminals, and reconciliation before retry.
