# Verification and Iterative Improvement

Package: `verification-and-iterative-improvement-class` 1.0.0

> This is the canonical text equivalent of an AI-assisted virtual-instructor
> class. It remains usable without synthesized audio, video, animation, or a
> player runtime.

## Welcome: Welcome And Outcomes

Welcome. Generation produces a candidate; verification earns trust. In this class, you will break polished output into checkable claims, match each claim with appropriate evidence, scale checks to consequence and change, diagnose failures before editing a prompt, and compare revisions on the same representative cases. The goal is not to eliminate uncertainty. It is to make evidence, failures, changes, and remaining uncertainty visible enough for an accountable decision.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Narration: Verify By Claim Explanation

Do not verify a response as one block. Decompose it. A factual claim needs an authoritative source with matching date, version, and scope. A calculation needs the original inputs, units, formula, and independent recomputation. A quotation needs the exact original passage and surrounding context. A classification needs a defined label, representative examples, and an error review. Code behavior needs execution, tests, and observed postconditions. A recommendation needs traceable evidence, assumptions, tradeoffs, and qualified judgment. A claimed action needs target-system evidence that it happened once, on the correct target, without forbidden effects. Confidence, fluency, length, and citation-shaped text are not evidence. A second model can help identify claims or challenge reasoning, but agreement between generated answers does not replace the nearest primary evidence. Record each check as pass, fail, unknown, or not applicable. Preserve the unsupported parts instead of blending them into a confident paragraph.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Demonstration: Mixed Claim Demonstration

Consider this generated statement: the current service limit is ten thousand requests per minute, the proposed workload uses only sixty percent of capacity, the documentation says scaling is automatic, and migration is therefore low risk. That sentence contains at least four claims. Open the current official documentation for the limit and confirm the account tier and region. Recompute workload divided by the applicable limit, including peaks rather than averages. Compare the quotation with the exact source and conditions. Treat low risk as a judgment, not a fact; examine dependencies, quotas, failure modes, rollback, and domain review. One bad source or calculation does not make every clause false, but one correct number does not prove the conclusion. The verification table keeps each result separate and shows which decision inputs remain unknown.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Learner Prompt: Claim Mapping Prompt

Choose one AI-generated paragraph. Mark at least three claim types. For each, name the nearest evidence that could prove or disprove it. If no practical evidence is available, record unknown rather than inventing a check.

Expected learner action: Create three claim-to-evidence rows and preserve unsupported claims as unknown.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Pause: Claim Mapping Work Time

## Checkpoint: Volatile Claim Checkpoint

Checkpoint. Two models agree that a product currently supports a particular feature. Both cite the same undated community post. The feature controls a production release. Is that enough evidence to proceed?

Expected learner action: Do not proceed; check current authoritative scoped documentation and directly observe the capability when practical.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Pause: Volatile Claim Response Time

## Feedback: Volatile Claim Feedback

Do not proceed on that evidence. The answers are not independent when they rely on the same weak source, and agreement does not make the post current or authoritative. Open the provider's current documentation, confirm model or product version, region, account tier, interface, and release status, then perform a bounded direct test when possible. If the evidence remains ambiguous, mark the capability unknown and stop the production decision. If you accepted two-model agreement as fact-checking, revise the rule: independent generation is useful for challenge, but primary evidence and observation prove volatile product claims.

Correct feedback: You required current scoped primary evidence and direct observation for a volatile production claim.

Retry feedback: Ask whether two answers using one undated community post are independent current evidence. They are not.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Narration: Scale Checks To Risk Explanation

Plan verification before generation. Start with how the output will be used and what happens if it is wrong. Low-consequence brainstorming may need a usefulness and safety review. Current factual work needs authoritative sources and claim mapping. Calculations need independent reconciliation. Code needs type, build, test, behavior, and security checks appropriate to its exposure. Consequential medical, legal, financial, employment, access, security, safety, or production decisions need current evidence, domain expertise, independent review, authorization, audit, and recovery. Increase verification when facts change quickly, model performance is uncertain, affected people have little recourse, exposure is wide, or actions are difficult to reverse. Human review only counts when the reviewer has the evidence, expertise, time, authority, and ability to reject. Define pass criteria and failure action in advance. A check without a response to failure is only an observation.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Narration: Diagnose The Miss Explanation

When a check fails, diagnose the system rather than blaming the prompt by default. A task failure means the objective or decision was unclear or unsuitable. A context failure means required evidence was missing, stale, conflicting, poisoned, or outside scope. A prompt failure means instructions, constraints, examples, or the output contract were ambiguous or contradictory. A model failure concerns capability, consistency, language, modality, or behavior on this task. A tool failure includes wrong parameters, permissions, execution, timeout, partial success, or an unverified postcondition. A review failure means the test, rubric, sample, reviewer, or approval process could not detect the real problem. Record the observed failure and evidence before assigning a cause. Choose the smallest change that addresses the likely cause while keeping safety and approval boundaries fixed. More instructions cannot create missing source data. A stronger model cannot repair an unauthorized tool. A prettier rubric cannot recover an action that already harmed the wrong target.

Sources:

- <https://developers.openai.com/api/docs/guides/prompt-engineering>
- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview>

## Checkpoint: Wrong Fix Checkpoint

Checkpoint. A summary omits a policy exception because the supplied document ended before the exception page. The prompt was clear. What should change first: the prompt wording, the model, or the context?

Expected learner action: Fix and verify the context boundary first, then repeat the same check.

Sources:

- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview>

## Pause: Diagnosis Response Time

## Feedback: Wrong Fix Feedback

Fix the context first. Confirm the authoritative document is complete, includes the exception page, and matches the required version and scope. Then rerun the same prompt and claim check. Changing wording cannot reveal text that was never supplied. Switching models may produce a confident guess, which would hide rather than solve the failure. If the complete source is unavailable, record the policy exception as unknown and escalate to its owner. If you selected prompt or model first, revise the diagnostic rule: observed missing evidence points to context before generation quality.

Correct feedback: You matched the missing-evidence symptom to a context remedy and preserved uncertainty when the source is unavailable.

Retry feedback: Ask whether prompt wording can recover a page that was never supplied. It cannot.

Sources:

- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview>

## Narration: Improve With Cases Explanation

One corrected example is not measured improvement. Build a small representative set. Include normal work, a boundary case, missing data, conflicting sources, privacy-sensitive content, and adversarial-like instructions when relevant. Preserve the original cases. Version the prompt, context recipe, output contract, model or product, tools, and evaluator. Change one controllable element when practical. Run old and new versions on the same cases with the same rubric. Record passes, failures, latency or cost when material, improvements, regressions, and remaining uncertainty. A revision is better only when it improves the intended criterion without unacceptable loss elsewhere. If safety improves but useful requests are blocked, measure that tradeoff. If average quality rises but one high-consequence boundary fails, do not hide it in the average. Decide whether to accept, revise, roll back, narrow scope, or stop. Keep the evidence so later model or product changes can be retested.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>
- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview>

## Transition: Activity Transition

Open the verify-and-improve activity. Choose a response with at least three claim types. Record consequence and nearest evidence for each claim, then mark pass, fail, unknown, or not applicable. Classify every failure as task, context, prompt, model, tool, or review. Select one controllable change without weakening safety or approval. Rerun the original case and two boundary cases using the same checks. Record improvements, regressions, remaining uncertainty, and a final decision to accept, revise, roll back, narrow, or stop.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Pause: Activity Work Time

## Assessment Handoff: Assessment Handoff

When you are ready, begin the knowledge check. You will choose evidence for a current product claim, scale verification to consequence, diagnose missing context, compare revisions fairly, and distinguish a measured gain from one persuasive answer. Review the class or return to the activity before submitting. The assessment begins only when you choose Begin knowledge check.

## Closing: Class Closing

Verify claims with the nearest evidence. Scale checks to consequence. Diagnose before changing. Compare versions on the same cases, and never hide a regression or unknown.
