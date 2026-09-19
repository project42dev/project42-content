# Verification and Iterative Improvement: text-only class

This route contains the complete teaching content, learner actions, feedback,
and assessment handoff without requiring audio, video, or animation.

## Welcome: Welcome And Outcomes

Welcome to Verification and Iterative Improvement.  We will test claims rather than trust fluent answers.  You will match evidence to each claim type.  You will separate missing context from calculation errors.  You will compare workflow versions using fixed cases and rubrics.

Visual alternative: The class moves from claims through evidence and diagnosis to a bounded decision.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Narration: Verify By Claim Narration

Begin by splitting an answer into checkable units.  Check quotations against their original wording and context.  Check source facts against the applicable authoritative version.  Check interpretations separately from prices or entitlements.  Check calculations by exposing inputs, operations, and results.  Check recommendations only after supporting evidence passes.  Confidence, fluency, and repetition are not evidence.  In this exercise, fictional transit bulletins are authoritative only inside the exercise.

Visual alternative: Quotations use original text, facts use authoritative sources, calculations use recomputation, and actions use passed evidence.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Demonstration: Verify By Claim Demonstration

Consider the flawed transit response before judging its confidence. Its alleged quotation is not Source A's wording: it says, “Adult rides are $3.00 and reduced-card riders pay $2.50.” Source A's exact requested sentence is: “Standard adult single ride: $3.00.” The flawed response also invents a reduced-fare amount. A valid card establishes eligibility, not a price. Its arithmetic uses an unsupported input and multiplies incorrectly: 4 × $2.50 is $10.00, not $9.00. The requested standard-price calculation uses the controlling Source A input: 4 × $3.00 = $12.00. The corrected response therefore quotes “Standard adult single ride: $3.00.” exactly, shows the inputs and operation, and releases only the requested $12.00 standard-price total. It does not claim that $12.00 is the reduced fare or recommend a reduced-fare purchase.

Visual alternative: The flawed response misquotes Source A, invents a reduced fare, and miscalculates; the corrected response quotes the exact sentence, recomputes four times three dollars, and limits release to the standard-price total.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Learner Prompt: Verify By Claim Prompt

Use this supplied paragraph for offline practice. Do not choose or generate another paragraph. Read it, split it into at least three claims, and complete the claim-to-evidence fields: Claim, Type, Evidence, Result, and Remaining Uncertainty. Supplied paragraph: “Source A is the controlling Fare Bulletin for the normal case. It states, ‘Standard adult single ride: $3.00.’ A rider with a valid reduced-fare card can be charged $2.50 per ride. Four standard rides therefore cost 4 × $3.00 = $12.00.” Mark the quotation by comparing it character by character with Source A. Check the source-selection claim against the source metadata. Check the reduced-fare price claim and record UNKNOWN because no supplied source states a reduced-fare amount. Recompute the arithmetic independently. Do not merge the supported standard-price result with the unsupported reduced-fare claim.

Learner action: Mark at least three claims from the supplied paragraph, verify the quotation and calculation, identify the unsupported reduced-fare amount as UNKNOWN, and record the remaining uncertainty before viewing feedback.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Checkpoint: Verify By Claim Checkpoint

Why can correct arithmetic remain unsupported?  Because the operation may be correct while its input lacks evidence.  State that distinction before continuing.

Learner action: Explain that correct operations do not validate unsupported inputs.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Narration: Scale Checks To Risk Narration

Verification effort should rise with consequence and uncertainty.  Low-consequence brainstorming may need usefulness and obvious-defect review.  A purchase estimate needs authoritative source comparison and arithmetic recomputation.  High-consequence work may require current evidence, independent review, expertise, authorization, and recovery planning.  Define pass criteria before evaluating answers.  If a required input is absent, HOLD rather than guess.  HOLD passes when the rubric requires withholding unsupported results.  Prompt changes still require individual claim checks.

Visual alternative: Low consequence uses review, moderate consequence adds source and arithmetic checks, and high consequence adds independent expertise and approval.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>
- <https://developers.openai.com/api/docs/guides/prompt-engineering>

## Learner Prompt: Scale Checks To Risk Prompt

For a released fare total, identify the required evidence.  Name the applicable source, quantity, arithmetic, and release boundary.  If quantity is missing, explain why the total must remain HOLD.  Do not substitute a typical quantity from another case.  State what information would release the decision.

Learner action: List source, quantity, arithmetic, and release authority, then apply HOLD when quantity is absent.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Narration: Source Corpus Narration

Read the complete fictional Harbor Transit corpus before solving cases. Source A is version 3.2, effective January 1, 2026, and controlling for the normal and missing-data cases. Its exact text is: “Standard adult single ride: $3.00. A day pass costs $10.00. Reduced fares are available only to riders with a valid reduced-fare card.” Source B is version 3.1, effective January 1, 2025, and superseded by Source A for those cases. Source B therefore does not create an unresolved conflict where A controls. Sources C and D are both version 1.0, effective July 1, 2026, and are equally authoritative and applicable to the separate Harbor Festival conflict. Source C states, “East Pier single ride during the Harbor Festival: $3.00.” Source D states, “East Pier single ride during the Harbor Festival: $2.75.” No supplied rule gives either source precedence. No source states a reduced-fare amount.

Visual alternative: Source A controls over superseded Source B; Sources C and D have equal authority and conflicting exact prices; no reduced-fare amount is supplied.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Demonstration: Source Corpus Demonstration

Apply the source rules carefully to three distinctions.  A valid card establishes eligibility, not a reduced-fare amount.  Source A controls rather than conflicting with superseded Source B.  Sources C and D remain unresolved because both are equally authoritative and applicable.  A normal standard-price calculation can release when its quantity is supplied.  A missing quantity requires HOLD.  The equal-authority festival conflict also requires HOLD.  These outcomes follow the supplied corpus only.

Visual alternative: Eligibility does not provide price, supersession selects A, and equal conflict produces HOLD.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Checkpoint: Source Corpus Checkpoint

Explain supersession versus equal-authority conflict.  Supersession supplies a selection rule.  Equal authority without precedence leaves selection unresolved.  Which situation requires HOLD?

Learner action: State that unresolved equal authority requires HOLD, while supersession selects the controlling source.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Narration: Diagnose The Miss Narration

The normal case asks for Source A's exact standard sentence and four rides. The flawed authored response says, “Adult rides are $3.00 and reduced-card riders pay $2.50.” That is not an exact quotation from Source A and invents a reduced-fare value. Source A's exact sentence is: “Standard adult single ride: $3.00.” The valid card establishes eligibility for reduced fares, but no supplied source states the reduced-fare amount. The flawed arithmetic also fails: 4 × $2.50 = $10.00, not $9.00. For the requested standard-price calculation, the controlling input is $3.00, so 4 × $3.00 = $12.00. The recommendation to buy four rides for $9.00 is unsupported because both its price input and its total fail. The bounded correction quotes the exact standard sentence, exposes the four and three-dollar inputs, calculates $12.00, and releases that standard-price total only. It does not assert a reduced fare. These are observable defects. Whether prompt wording, model behavior, tools, or review caused them remains UNKNOWN because no actual execution or review record is supplied.

Visual alternative: The audit distinguishes the exact Source A sentence from the flawed quotation, separates eligibility from price, recomputes the total, and leaves causes unknown.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Feedback: Diagnose The Miss Feedback

A strong diagnosis describes observable defects first.  It does not claim that a model ignored instructions without an actual run.  Missing reduced-fare context is a context limitation.  Incorrect multiplication is a calculation defect.  The unsupported recommendation is downstream.  Prompt wording might be a hypothesis, but this artifact cannot establish it.  Preserve that uncertainty during review.

If correct: You separated observable output defects from unproven causes and preserved uncertainty.

If retrying: Name what the artifact proves, then label any prompt or model cause as unknown.

Sources:

- <https://developers.openai.com/api/docs/guides/prompt-engineering>

## Narration: Improve With Cases Narration

Workflow version one says answer from supplied material and explain.  Version two adds one verification gate.  The gate records source metadata, selects controlling sources, holds unresolved conflicts, holds missing inputs, forbids invention, recomputes totals, and releases only after checks pass.  The corpus, three cases, and R1 through R5 rubric stay fixed.  Normal v2 releases twelve dollars.  Missing-data v2 holds.  Conflict v2 holds after quoting both sources.  These are authored artifacts, not executions.

Visual alternative: Version two adds verification while the source corpus, cases, and R1 through R5 remain fixed.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>
- <https://developers.openai.com/api/docs/guides/prompt-engineering>

## Demonstration: Improve With Cases Demonstration

Use the fixed rubric to compare cases fairly.  R1 checks source selection.  R2 checks exact evidence and supported facts.  R3 checks visible inputs and arithmetic.  R4 checks missing data and conflicts.  R5 checks the final action.  A case passes only when every applicable check passes.  Correct HOLD is a pass when release conditions remain unresolved.  A regression means v1 passed a requirement that v2 failed.

Visual alternative: The rubric covers source, evidence, calculation, uncertainty handling, and action.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Checkpoint: Improve With Cases Checkpoint

What is a regression here?  It is a rubric requirement that passed in version one but failed in version two.  Did the supplied comparison report one?  No.

Learner action: Define regression and state that none is reported in the supplied comparison.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Narration: Reusable Template Narration

The worksheet turns review into a repeatable record.  Begin with case, source title, version, date, authority, applicability, and supplied inputs.  Then record the claim, type, consequence, exact evidence, method, and result.  Record observable defects and diagnosis separately.  Show calculation inputs and recomputed results.  List conflicting sources and precedence.  Finish with RELEASE, HOLD, or ESCALATE, plus the reason and remaining uncertainty.  Copy evidence exactly rather than paraphrasing it.

Visual alternative: The worksheet records source, claim, evidence, result, diagnosis, conflicts, calculation, action, and uncertainty.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Learner Prompt: Reusable Template Prompt

Practice with the blank worksheet structure.  Identify one exact quotation and one calculation.  Record the verification method for each.  If a required field is absent, write HOLD and state what would release it.  Keep unknown as an information state, separate from the resulting action.

Learner action: Complete evidence, verification, result, and missing-data fields without inventing values.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Narration: Changed Input Task Narration

Now change exactly one input from the normal case.  The rider takes five rides instead of four.  The valid card remains unchanged.  Source A version 3.2 remains controlling.  The request still asks for the exact standard sentence and standard-price total.  Write the quotation exactly, show five times three dollars, distinguish eligibility from reduced-fare amount, choose RELEASE or HOLD, and score R1 through R5.  Do not reuse twelve dollars.

Visual alternative: Only the quantity changes from four rides to five rides; the standard price remains three dollars.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Learner Prompt: Changed Input Task Prompt

Write your complete five-ride response now.  Include the exact standard-price sentence.  Show the multiplication visibly.  Explain the card limitation.  Choose the bounded action.  Then score each applicable rubric item before reading the key.

Learner action: Write and self-score a five-ride response before viewing the answer key.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Pause: Changed Input Task Pause

## Narration: Changed Input Answer Key Narration

The answer key quotes Source A exactly: “Standard adult single ride: $3.00.” Source A version 3.2 is controlling, and the five-ride quantity is supplied. At that stated standard price, the visible calculation is 5 × $3.00 = $15.00. The valid reduced-fare card establishes eligibility, but no supplied source states a reduced-fare amount. Therefore RELEASE $15.00 as the requested standard-price total only. Do not present $15.00 as the rider's reduced fare. R1 passes because Source A is the controlling applicable source. R2 passes because the requested sentence is quoted exactly and no unsupported reduced-fare value is claimed. R3 passes because both inputs and the operation are visible and recompute to $15.00. R4 passes because the requested standard-price calculation has complete inputs, and Source B is superseded rather than an equal-authority conflict. R5 passes because the release is bounded to the supported standard-price total. This is an authored answer key, not an actual model run or review record.

Visual alternative: The exact Source A sentence supports five rides at three dollars each, producing a released standard-price total of fifteen dollars while the reduced-fare amount remains unknown.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Feedback: Changed Input Answer Key Feedback

If you wrote twelve dollars, you reused the old quantity.  If you wrote fifteen without showing multiplication, the visible-calculation requirement failed.  If you called fifteen dollars the reduced fare, you converted eligibility into price.  If you chose HOLD solely because the reduced amount is unknown, you held too broadly.  The requested standard calculation has complete inputs.  This key is authored, not an actual model run.

If correct: You applied the changed quantity, visible arithmetic, eligibility limitation, and bounded release correctly.

If retrying: Check quantity, visible operation, price limitation, and whether the requested calculation itself has complete inputs.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Narration: Limits And Transfer Narration

The three cases expose version errors, invented values, arithmetic errors, missing quantities, and unresolved conflicts.  They do not establish a model success rate or production reliability.  Broader reliability is UNKNOWN because no actual run dataset exists.  A broader evaluation needs fixed inputs, preserved outputs, identified systems, stable rubric, and recorded review results.  Provider guidance differs across OpenAI, Anthropic, Google, and Qwen.  Guidance motivates testing, not assumptions of transfer.  Authored examples demonstrate method only.

Visual alternative: The cases demonstrate a method under one rubric, not general reliability, model success, or provider transfer.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>
- <https://developers.openai.com/api/docs/guides/prompt-engineering>
- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview>
- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices>
- <https://ai.google.dev/gemini-api/docs/prompting-strategies>
- <https://huggingface.co/Qwen/Qwen3-0.6B/raw/main/README.md>

## Checkpoint: Limits And Transfer Checkpoint

Which conclusion is justified?  The authored version two artifacts pass these supplied cases under their rubric.  Which conclusion is not justified?  General production reliability.

Learner action: Distinguish the bounded authored finding from an unsupported general reliability claim.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Assessment Handoff: Assessment Handoff

Begin the knowledge check when ready.  It covers evidence, consequence, missing data, fair workflow comparison, and limits of authored evaluation.  Review the class or activity first if needed.  Choose Begin only when prepared to answer all five questions.

## Closing: Class Closing

Verify claims with direct evidence.  Scale checks to consequence.  Diagnose before changing.  Compare versions on identical cases.  Never invent missing values or hide uncertainty.
