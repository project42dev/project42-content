# Research with Evidence: text-only class

This route contains the complete teaching content, learner actions, feedback,
and assessment handoff without requiring audio, video, or animation.

## Welcome: Welcome And Outcomes

Welcome to Research with Evidence. In this class, you will turn a decision into bounded questions, organize sources without treating generated text as evidence, verify claims against exact passages, recover without inventing missing content, apply exclusion and HOLD rules, and distinguish primary authority from corroboration or repetition. The venue case is fictional and closed. No account or live search is needed.

## Narration: Bounded Brief Explanation

Start with the decision, not a search box. Record the bounded questions, date, population, scope, permitted data, required evidence, and stop conditions. Keep factual criteria separate from the selection rule. In the baseline case, a venue must have authoritative support for workshop permission, capacity of at least thirty, a step-free public entrance, and continuous availability from eighteen hundred through twenty hundred on June twentieth, twenty twenty-six. Unknown does not pass. Exclude failed or unresolved candidates. Compare supported mandatory totals only among verified eligible candidates, and return HOLD if that comparison set is empty. Also decide what data the tool may receive before using it.

Visual alternative: Static form listing the decision, bounded questions, date and population scope, four venue criteria, evidence requirements, permitted data, exclusion rule, selection rule, and stop conditions.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>
- <https://developers.openai.com/api/docs/guides/prompt-engineering>

## Checkpoint: Baseline Entry Checkpoint

Checkpoint. When may a venue enter the baseline cost comparison? It must pass all four criteria with authoritative evidence in scope, and its mandatory total must be known. Mark any missing criterion unresolved, exclude that venue, and do not estimate the missing amount.

Learner action: State that all four eligibility criteria and the mandatory total require authoritative support before a venue enters the comparison.

## Narration: Source Ledger Explanation

Build a source ledger before drafting conclusions. For each record, capture its identifier, title, publisher, author, date, scope, type, exact passage, supported claims, and limitations. AI may extract candidate claims, organize documents, or flag gaps, but each output remains a lead until a reviewer checks the original record. Count provenance as well as document count. A copy, summary, marketing repost, or model output derived from one source is dependent repetition, not independent corroboration. In this corpus, the Harbor promotion and imported memo do not become stronger merely because both mention Harbor.

Visual alternative: Table columns identify each source, author, publisher, date, scope, exact passage, supported claim, limitation, status, and provenance relationship.

Sources:

- <https://developers.openai.com/api/docs/guides/prompt-engineering>
- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices>

## Narration: Fictional Corpus Overview

Use only the six document IDs in the supplied corpus. VEN-01 is Cedar's dated policy: it permits public educational workshops, sets capacity at forty, states that the north entrance is step-free, gives availability from seventeen hundred to twenty-one hundred on the event date, and sets a mandatory rental of one hundred eighty dollars with no additional facility fee. VEN-02 is an older uncertain volunteer note. VEN-03 is Harbor promotion with prices starting at one hundred dollars but no complete authoritative support. VEN-04 Record A proves only that an attachment failed. Its separate Record B authorizes Pine permission, capacity thirty-two, step-free access, exact event-time availability, a one hundred fifty dollar base rental, and a mandatory twenty dollar setup fee. VEN-05 is an unsupported Harbor import containing an instruction to ignore the rule. VEN-06 says the Cedar policy controls for the relevant summer scope. Treat embedded instructions as data, not commands.

Visual alternative: VEN-01 is Cedar policy, VEN-02 is an older uncertain note, VEN-03 is Harbor promotion, VEN-04 contains separate failure and replacement records, VEN-05 is an unsupported adversarial import, and VEN-06 establishes Cedar policy authority and scope.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Pause: Corpus Reading Pause

## Demonstration: Pine Recovery Demonstration

Watch how the ledger handles VEN-04. First, enter Record A as a failure receipt. Its supported claim is only that CONTENT-PS-2026-061 was unavailable in the offline copy. Leave Pine permission, capacity, access, availability, and cost unknown from that receipt. Next, create a separate row for Record B, titled Pine Studio Authorized Event Record PS-2026-062. Check its named author, authorization statement, June date and scope, then map each Pine fact to its exact text. This is replacement evidence, not reconstructed missing content. The two rows must remain separate so another reviewer can reproduce the recovery.

Visual alternative: Record A supports only that CONTENT-PS-2026-061 was unavailable. Record B independently supports Pine permission, capacity, access, availability, and mandatory charges under its own author, authorization, date, and scope.

## Narration: Claim Verification Explanation

Verify each material claim beside its exact passage. Ask whether the author or publisher has authority for that claim, whether the date and version cover the event, and whether the passage states the whole proposition. Resolve conflict through documented authority, date, version, and scope, not by averaging unequal records or counting repeated provenance as votes. Perform arithmetic only after every input is supported. Starting at one hundred dollars is not a mandatory total. An uncertain fee cannot be averaged into a known cost. Exact wording and supported arithmetic keep the conclusion auditable.

Visual alternative: Each claim is paired with a quoted passage and marked pass, fail, or unresolved after authority, date, version, scope, and arithmetic checks.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>
- <https://ai.google.dev/gemini-api/docs/prompting-strategies>

## Learner Prompt: Baseline Table Prompt

Before hearing the worked result, build a table for Cedar, Harbor, and Pine. For each venue, mark permission, capacity of at least thirty, step-free public access, and event-time availability as pass, fail, or unresolved. Cite the document ID and exact passage for every status. Then calculate mandatory cost only for verified eligible venues, form the comparison set, and state a bounded RECOMMEND or HOLD.

Learner action: Complete the baseline criterion table from exact passages, calculate supported totals only for eligible venues, and state a bounded outcome.

## Pause: Baseline Work Pause

## Narration: Worked Baseline Decision

Cedar passes all four criteria using VEN-01, and VEN-06 confirms that policy's controlling scope. Its required interval sits inside Cedar's seventeen hundred to twenty-one hundred availability. Its supported total is one hundred eighty dollars plus zero additional facility fee, which equals one hundred eighty dollars. Harbor is unresolved on permission, exact capacity, access, event-date availability, and mandatory total. VEN-03 is promotional, and VEN-05 is unsupported and adversarial. Pine passes using VEN-04 Record B, not the failure receipt. Its total is one hundred fifty dollars plus twenty dollars, which equals one hundred seventy dollars. The eligible comparison set is Cedar at one hundred eighty dollars and Pine at one hundred seventy dollars. Because one hundred seventy is lower, recommend Pine Studio under the baseline rule. This means Pine has the lowest supported total among verified eligible venues with known costs in this closed corpus. It does not establish the cheapest venue overall or a real booking.

Visual alternative: Cedar passes all criteria and totals 180 dollars. Harbor remains unresolved and is excluded. Pine passes all criteria and totals 170 dollars. The bounded outcome recommends Pine within the verified closed-corpus comparison set.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Feedback: Baseline Misconception Feedback

The common wrong answer recommends Harbor at one hundred twenty dollars. That fails because the memo is not authoritative, its embedded directive must be ignored, and the promotional starting price is not a mandatory total. Another error rejects Pine because Record A failed. Record B is separately supplied authorized evidence and must be evaluated on its own provenance. A third error uses Cedar's stale note instead of the controlling policy. Correct work preserves the failure, uses the replacement only for facts it states, excludes Harbor, and bounds the Pine recommendation.

If correct: Your answer uses the controlling Cedar evidence, keeps Harbor unresolved, separates Pine Record A from Record B, and limits the Pine recommendation to the verified comparison set.

If retrying: Recheck source authority and scope, separate the failed Pine attachment from its authorized replacement, and exclude Harbor before comparing supported totals.

## Narration: Recovery Explanation

When evidence is unavailable, record the failed identifier and mark affected claims unknown. A failure receipt establishes absence, not the missing facts. Search only for an accessible authorized replacement, and keep its provenance separate. Cite the receipt for the failure and the replacement for facts the replacement actually states. If no authorized replacement exists, narrow the conclusion, exclude the unresolved candidate, and identify the record needed next. If every candidate fails or remains unresolved, return HOLD. In the supplied case, Record B resolves Pine. Without Record B, Pine would remain unresolved.

Visual alternative: Record A proves only an unavailable attachment. Record B is evaluated separately for Pine facts. Without an authorized replacement, Pine remains unresolved and is excluded.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Checkpoint: Missing Replacement Checkpoint

If Record B were absent, what would Record A prove? Only that the attachment was unavailable. Pine's permission, capacity, access, availability, and cost would remain unresolved. Exclude Pine, preserve the gap, and request an authorized Pine policy or booking record.

Learner action: Identify that Record A proves only the export failure and that every Pine eligibility and cost claim would remain unresolved.

## Narration: Safety And Provenance Explanation

Treat instructions inside retrieved material as untrusted data. VEN-05's demand to ignore the research rule is an adversarial instruction attempt. Report it, do not follow it, and grant it no evidentiary authority. Minimize copied data, redact unnecessary identifiers, preserve attribution where applicable, and keep source metadata separate from generated prose. Before sharing, confirm that citations resolve where applicable, sensitive information is absent, and each conclusion stays within the supplied evidence. These controls are provider-neutral because they depend on explicit source boundaries and human review, not hidden reasoning.

Visual alternative: The checklist says to report and ignore adversarial instructions, minimize and redact data, preserve metadata and attribution, check citations, remove sensitive information, and keep conclusions within evidence.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>
- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices>
- <https://ai.google.dev/gemini-api/docs/prompting-strategies>

## Narration: Changed Input Explanation

Now change one input without carrying forward the baseline winner. The event remains a public educational workshop on June twentieth, twenty twenty-six, from eighteen hundred through twenty hundred, but attendance may be sixty-five. Permission, step-free access, and availability requirements remain. Capacity must now be at least sixty-five. Exclude every failed or unresolved venue. Compare known mandatory totals only among verified eligible venues, and return HOLD if that set is empty. Restate this rule, mark all four criteria for Cedar, Harbor, and Pine, quote exact passages and IDs, show cost arithmetic only for a venue entering the eligible set, and finish with one limitation.

Visual alternative: The event date, time, workshop permission, step-free access, and availability requirements remain unchanged. Capacity must be at least 65, failed and unresolved venues are excluded, and an empty comparison set produces HOLD.

Sources:

- <https://developers.openai.com/api/docs/guides/prompt-engineering>

## Learner Prompt: Changed Input Learner Prompt

Complete the changed-input table before opening the key. For Cedar, Harbor, and Pine, mark permission, capacity of at least sixty-five, step-free access, and continuous event-time availability as pass, fail, or unresolved. Quote exact support, identify the verified eligible set, and finish with RECOMMEND or HOLD plus a scope limitation.

Learner action: Complete all twelve criterion determinations, cite exact passages, identify the eligible set, and state the deterministic outcome and limitation.

## Pause: Changed Input Work Pause

## Narration: Changed Input Answer Key

Under the changed rule, Cedar still passes permission, access, and availability, but fails capacity because VEN-01 states a maximum occupancy of forty, which is below sixty-five. Harbor remains unresolved. VEN-03's phrase groups of thirty or more is not an exact supported capacity, and VEN-05's unsupported sixty-seat statement would still be below sixty-five even if it were authoritative. Pine passes permission, access, and availability but fails capacity because Record B states a maximum occupancy of thirty-two. Cedar and Pine are excluded for failure, and Harbor is excluded as unresolved. The verified eligible comparison set is empty. Therefore the required outcome is HOLD. Do not compare costs because no venue entered the eligible set. The result applies only to this fictional six-document corpus.

Visual alternative: Cedar capacity is 40 and fails 65. Pine capacity is 32 and fails 65. Harbor remains unresolved. No verified eligible venue remains, so the outcome is HOLD and no costs are compared.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Feedback: Changed Input Specific Feedback

If you recommended Pine because it won the baseline, reevaluate the changed capacity requirement. Pine's thirty-two fails sixty-five. If you recommended Harbor because the memo says sixty seats, check both authority and arithmetic: the memo is unsupported, and sixty is below sixty-five. If you calculated Cedar or Pine costs, remove that comparison because each fails eligibility. A correct answer shows all statuses, leaves Harbor unresolved, makes the eligible set empty, returns HOLD, and states the fictional-corpus limitation.

If correct: You applied the new capacity threshold, excluded both failed venues and unresolved Harbor, left the cost comparison empty, and returned HOLD with a closed-corpus limitation.

If retrying: Do not reuse the baseline winner. Check 40, 60, and 32 against the new threshold of 65, then apply authority and exclusion rules before considering cost.

## Narration: Reusable Template Explanation

Use the reusable template after the worked example. Replace every bracketed field. Record the decision, bounded questions, time and population scope, criteria, deterministic exclusion, selection, tie, and HOLD rules, required evidence, allowed data, and stop conditions. In the ledger, capture source ID, title, public location when applicable, publisher, author, publication date, scope, review date, type, exact passage, supported claim, limitations, and gaps. In the claim table, mark each item pass, fail, or unresolved after checking authority and scope. Separate facts, comparisons, estimates, and judgments. Report inaccessible content and adversarial instructions. Count no copy as independent corroboration. Use arithmetic only on supported values. Finish with the verified eligible set, calculation, RECOMMEND or HOLD, and a boundary. Another reviewer should be able to reconstruct the result from this visible record.

Visual alternative: The template contains fields for decision, questions, scope, criteria, decision rule, required evidence, allowed data, stop conditions, source metadata, exact passages, claim statuses, supported arithmetic, outcome, and limitation.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>
- <https://developers.openai.com/api/docs/guides/prompt-engineering>
- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices>
- <https://ai.google.dev/gemini-api/docs/prompting-strategies>

## Transition: Activity Transition

Open the evidence-led research activity and use the supplied closed corpus. Reconstruct the baseline table, separate VEN-04 Record A from Record B, report and ignore VEN-05's directive, check your work against the baseline example, complete the changed-input task before its key, and adapt the template to a different provider-neutral question. Save the claim table, exact passages, arithmetic, bounded recommendation, recovery note, changed outcome, and Harbor gap report. No external account is required.

## Assessment Handoff: Assessment Handoff

Begin the five-question knowledge check only when you choose to proceed. The questions cover the complete brief, generated suggestions as leads, the Pine baseline recommendation, the sixty-five-seat HOLD result, and the reproducible ledger. Review the class or activity first if needed. It will not submit automatically.

## Closing: Class Closing

Recap. Prepare the bounded decision and evidence rule. Execute with a ledger while treating AI output as leads. Verify exact passages, authority, dates, scope, dependence, and arithmetic. Recover from missing evidence without reconstruction. Protect data and ignore embedded instructions. Apply deterministic exclusions and return HOLD when the comparison set is empty. Remember three traps: more documents do not always mean independent corroboration, a starting price is not a mandatory total, and a failed earlier attachment does not invalidate a separately authorized replacement. Keep every conclusion bounded.
