# Writing and Transformation Workflow

Package: `writing-and-transformation-workflow-class` 1.0.0

> This is the canonical text equivalent of an AI-assisted virtual-instructor
> class. It remains usable without synthesized audio, video, animation, or a
> player runtime.

## Welcome: Welcome And Outcomes

Welcome. In this class, you will transform permitted material without inventing facts. You will prepare a brief, extract evidence, draft within constraints, audit meaning, recover from drift, and document review status. Our fictional Saturday Repair Lab case makes every date, fee, condition, quotation, and unknown visible. Success means that the intended meaning survives and another person can inspect the work.

## Narration: Writing Prepare Narration

Begin with a transformation brief, before you rewrite a single sentence. The brief identifies the audience, purpose, channel, transformation type, source of truth, exact facts and quotations to preserve, changes that are allowed, additions that are forbidden, known unknowns, review owner, and review status. These are not decorative fields. They establish the boundary between editing and factual invention. For the Saturday Repair Lab, the audience is North Harbor residents interested in basic repair skills, and the purpose is a short accessible announcement. The transformation is to condense and simplify without changing meaning. The source of truth is the fictional passage titled Saturday Repair Lab, version 1. The brief permits changes to order, headings, sentence length, and reading level. It does not permit a new address, website, closing date, amenities, accepted-item list, or repair guarantee. It records whether a waiver request will be granted as UNKNOWN. The review owner is the workshop coordinator, and the status is PENDING. No approval is asserted. A good brief makes later auditing possible because every important output choice has a stated rule.

Sources:

- <https://ai.google.dev/gemini-api/docs/prompting-strategies>

## Narration: Writing Source Narration

Now read the source as evidence, not as promotional copy. It says that the North Harbor Community Workshop will hold the Saturday Repair Lab on May 16, 2026, from 10:00 a.m. to 1:00 p.m. The source also calls it a three-hour session. It is for North Harbor residents who want to learn basic repair skills for small household items. It is a teaching session, not a drop-off repair service. Participants may practice on one small item they bring, and the workshop has 30 places with registration required. The baseline materials fee is "$8 per participant." The source states, exactly, "Residents age 60 or older may attend free." It also states, exactly, "Residents who cannot pay may request a fee waiver when registering." That is a request, not a promise that the request will be granted. Registration opens April 20, 2026, through the registration desk. Mina Ortiz's quotation must remain exactly: "Bring curiosity, not confidence; we will learn by trying." The source deliberately omits an address, telephone number, web address, closing date, amenities, accepted-item list, and repair guarantee. Those omissions are evidence too. They mean UNKNOWN, not an invitation to guess.

Sources:

- <https://ai.google.dev/gemini-api/docs/prompting-strategies>

## Narration: Writing Extract Narration

Extract a fact ledger before drafting. A ledger should quote the source, explain what the quotation means, and state how the draft must handle it. For example, the row for the schedule can quote "10:00 a.m. to 1:00 p.m." and "three-hour session," then require both endpoints and the duration to remain consistent. The eligibility row quotes "North Harbor residents" and says not to broaden that group to everyone. The service-limit row quotes "not a drop-off repair service" and forbids a promise that staff will repair an item. The participation row records "may practice on one small item they bring," preserving both the one-item scope and the optional word may. The payment rows must remain separate. One row records "$8 per participant." A second records "Residents age 60 or older may attend free." A third copies exactly, "Residents who cannot pay may request a fee waiver when registering." The ledger must also record the source's explanation that a waiver request is not a guarantee. Finally, it should mark absent details as UNKNOWN: address, telephone number, web address, closing date, tools, replacement parts, food, parking, childcare, accepted or prohibited items, and repair outcome. This process prevents a fluent sentence from silently becoming a new fact.

Sources:

- <https://developers.openai.com/api/docs/guides/prompt-engineering>

## Narration: Writing Flawed Narration

The supplied flawed draft is a teaching artifact for comparison. It is not an actual model execution, and it is not a recommended announcement. Read its sentences against the source one at a time. Its heading says, "Free Saturday Repair Lab for Everyone." That heading already changes the fee and eligibility. It changes the source schedule from May 16, 2026, 10:00 a.m. to 1:00 p.m. into 10:00 a.m. to 2:00 p.m. It changes 30 places into "the first 40 people," adding both a new number and a first-come condition. It changes North Harbor residents into everyone. It changes the $8 fee and age condition into free attendance for all residents. It changes a request for a waiver into a statement that waivers are available to anyone who asks. It changes a teaching session into staff repairing an item for the participant. It promises tools, replacement parts, refreshments, parking, and childcare even though the source does not promise them. It invents an online address and a May 1 deadline. The quotation is copied accurately, but one accurate quotation cannot repair the surrounding false claims. Audit every claim, not just the sentence that sounds most obviously wrong.

Sources:

- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices>

## Narration: Writing Verify Narration

A useful audit records source wording, draft wording, the type of drift, and its consequence. First, the source says "10:00 a.m. to 1:00 p.m." while the flawed draft says "10:00 a.m. to 2:00 p.m." The consequence is an extra hour. Second, "30 places" becomes "first 40 people." That changes capacity and invents a first-come condition. Third, "North Harbor residents" becomes "Everyone can attend." That removes the stated residency condition. Fourth, "$8 per participant" becomes "free for all residents." That removes the fee. The separate source sentence saying residents age 60 or older may attend free is also erased, so the age condition is lost. Fifth, "may request a fee waiver" becomes "fee waivers are available to anyone who asks." This broadens eligibility and changes a conditional request into language that implies receipt. Sixth, the source says the event is a teaching session, not a drop-off repair service, while the draft says staff will repair the item. That creates a service and an outcome guarantee. Finally, the draft adds tools, parts, refreshments, parking, childcare, a web address, and a deadline. Because the source does not establish those details, each must be deleted, not merely marked as likely. The quotation passes its own exactness check, including punctuation, but the surrounding announcement still fails.

Sources:

- <https://ai.google.dev/gemini-api/docs/prompting-strategies>

## Narration: Writing Corrected Narration

The corrected baseline announcement repairs the drift sentence by sentence. It restores May 16, 2026, and the exact schedule, 10:00 a.m. to 1:00 p.m. It identifies North Harbor residents and describes learning basic repair skills for small household items. It keeps the limitation that this is a teaching session, not a drop-off repair service. It says a participant may practice on one small item, while avoiding a repair guarantee. It restores 30 places and required registration. It restores the baseline payment rules without merging them: the fee is $8 per participant, residents age 60 or older may attend free, and residents who cannot pay may request a fee waiver when registering. The exact waiver sentence is copied with its final period, then the draft says, "A request is not guaranteed." Registration opens April 20, 2026, through the registration desk. Mina Ortiz's quotation is preserved exactly as, "Bring curiosity, not confidence; we will learn by trying." The draft does not supply an address, phone number, web address, or closing date. It says review is pending rather than claiming approval. This is an example of changing presentation while preserving evidence and uncertainty.

Sources:

- <https://developers.openai.com/api/docs/guides/prompt-engineering>

## Narration: Writing Traceability Narration

Traceability turns a correction into something another person can inspect. In the baseline record, O1 links the date and schedule to the first output sentence. O2 links North Harbor residents and basic repair skills to the audience and purpose sentence. O3 links the teaching-only limitation to the third sentence. O4 links the one-small-item scope and absence of a promised outcome to the fourth sentence. O5 links 30 places and required registration to the fifth sentence. O6 links the $8 fee to the sixth sentence. O7 links the age-60 free-attendance condition to the seventh sentence. O8 links the exact sentence "Residents who cannot pay may request a fee waiver when registering." to the eighth sentence. O9 supports the statement that a request is not guaranteed. O10 supports the April 20 opening date and registration desk. O11 links the exact Mina Ortiz quotation, including punctuation. O12 records missing contact details as unknown. O13 records PENDING review. Notice the difference between evidence and interpretation. The source supports the facts. The trace record documents how the writer used them. It does not claim that an external reviewer approved the result or that a tool executed it.

Sources:

- <https://developers.openai.com/api/docs/guides/prompt-engineering>

## Narration: Writing Recover Narration

Recover only the affected content. Return to the source and brief, remove invented logistics, restore changed conditions, and rerun the local audit. The recovery record names the workshop coordinator as review owner but keeps status PENDING. Its root-cause statement is an instructional hypothesis, not evidence of an actual model run.

Sources:

- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices>

## Narration: Writing Safety Narration

Protect people and source material by minimizing sensitive data, confirming permission, preserving attribution, checking quotations, and following approved handling. This lesson uses fictional artifacts. No model execution, reviewer approval, or media render is claimed. Document versions, limitations, disclosure policy, and actual review status. Prompting techniques can organize work, but source comparison remains necessary.

Sources:

- <https://ai.google.dev/gemini-api/docs/prompting-strategies>

## Narration: Writing Execute Narration

Execute in visible passes. First extract the exact source, ledger, unknowns, and brief. Then draft only within the brief, keeping evidence separate from wording. The supplied prompt asks for FACT LEDGER, DRAFT, and AUDIT sections and explicitly forbids invented facts, approval, execution, and review completion. It is offline practice, not a claim that a tool ran.

Sources:

- <https://developers.openai.com/api/docs/guides/prompt-engineering>

## Demonstration: Writing Execute Demonstration

Here is the offline worked demonstration. First, the brief says to announce one workshop for North Harbor beginners and to preserve the baseline date, schedule, 30 places, required registration, $8 fee, age-60 free-attendance condition, exact waiver sentence, registration opening, and exact quotation. Second, the ledger records the source quotations and marks the address, web address, closing date, amenities, accepted-item list, and repair guarantee as UNKNOWN or prohibited. Third, we inspect the flawed sentence, "The workshop is free for all residents, and fee waivers are available to anyone who asks." The source gives us three separate facts instead: "$8 per participant"; "Residents age 60 or older may attend free"; and "Residents who cannot pay may request a fee waiver when registering." The corrected draft must keep those rules distinct. A person age 60 or older may attend free under the stated condition. A resident who cannot pay may request a waiver, but the source does not say the request will be granted. We cannot replace either rule with free attendance for everyone. Fourth, we repair the schedule, capacity, service limitation, unsupported logistics, and quotation context. Fifth, we map each output sentence to evidence and mark review PENDING. This is a worked comparison for learning. It is not an actual model execution, external review, approval, or publication.

Sources:

- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices>

## Learner Prompt: Writing Execute Prompt

Complete this offline task before looking at feedback. From the supplied baseline source, write three ledger entries. First, copy one quotation exactly, including punctuation. Second, copy one payment condition exactly and state whether it is unconditional or conditional. Third, write UNKNOWN for one detail that the source does not establish. For each entry, add one sentence explaining how a draft must handle it. Your response should make the difference between the two baseline payment rules visible: residents age 60 or older may attend free, while residents who cannot pay may request a fee waiver when registering. Do not turn either statement into a broader claim. You may write on paper or in a text editor. This is a learner exercise, not a claim that a model ran or that a reviewer has checked your answer.

Expected learner action: Record one exact quotation, one payment condition with its conditional status, and one source omission marked UNKNOWN, with handling instructions for each.

## Pause: Writing Execute Pause

## Checkpoint: Writing Verify Checkpoint

Checkpoint question: In the baseline source, what does the phrase “may request a fee waiver when registering” tell you about the result of the request? Write your answer before continuing. Do not use the answer key yet.

Expected learner action: Explain what can and cannot be concluded from the conditional waiver wording.

## Pause: Writing Verify Checkpoint Response Time

## Feedback: Writing Verify Feedback

The source says, exactly, "Residents who cannot pay may request a fee waiver when registering." The word "may" permits a request. It does not say that the request will be approved, and the source explicitly says whether it will be granted is not stated. Therefore, the corrected announcement may preserve the exact request sentence and may add that a request is not guaranteed. It must not say that a waiver is available to anyone who asks, that the person will receive free attendance, or that approval has occurred. If your answer treated requesting as receiving, compare those two meanings in your ledger and repair only the affected payment sentence. If your answer distinguished them, you identified the important modal condition. This same audit habit applies beyond fees: words such as may, must, only, not, and age thresholds can change eligibility, obligation, or certainty.

Correct feedback: A request is permitted, but approval is not established. The source does not guarantee free attendance.

Retry feedback: Compare “may request” with “will receive,” then return to the payment rows in the fact ledger and revise only the affected sentence.

## Narration: Writing Practice Changed Narration

The next exercise is a separate changed-input case. Do not combine its facts with the Saturday baseline. For this variation, the authoritative date is Sunday, June 7, 2026, from 1:30 p.m. to 3:30 p.m., and the session is two hours. The audience is North Harbor residents age 16 or older. Capacity is 24 places, registration is required, and the fee is $12 per participant. Registration opens May 1, 2026, through the registration desk. These values replace the baseline date, time, duration, age information, capacity, fee, and April 20 opening date. The changed payment sentence is exactly: "Residents age 70 or older may request a fee waiver when registering; a waiver is not automatic." This sentence supersedes both baseline payment rules. Do not also include the baseline statement that residents age 60 or older may attend free, and do not include the baseline inability-to-pay waiver sentence. The teaching-only limitation, one-small-item activity, no repair guarantee, and Mina Ortiz quotation remain available in the changed input. The address, phone number, web address, closing date, amenities, accepted-item list, and whether a waiver request will be granted remain UNKNOWN. Use only the changed facts for this task.

Sources:

- <https://ai.google.dev/gemini-api/docs/prompting-strategies>

## Learner Prompt: Writing Practice Prompt

Now write before viewing the key. Draft a 100 to 150 word announcement using only the changed input. Then write a short audit identifying at least four changed facts from the baseline. Copy the changed payment sentence exactly: "Residents age 70 or older may request a fee waiver when registering; a waiver is not automatic." Also copy the required quotation exactly: "Bring curiosity, not confidence; we will learn by trying." Finally, name one supplied detail that you deliberately leave unknown. Check that your draft does not reuse Saturday, May 16, 10:00 a.m. to 1:00 p.m., three hours, 30 places, $8, age 60, or April 20. Do not include a venue, link, deadline, amenity, accepted-item list, successful repair, or waiver approval that the changed input does not establish.

Expected learner action: Write a 100 to 150 word changed-input announcement, preserve both exact sentences, audit at least four changes, and identify one deliberate UNKNOWN.

## Pause: Writing Practice Pause

## Narration: Writing Practice Answer Narration

Only after completing your own draft, compare it with the answer key. One acceptable response uses Sunday, June 7, 2026, from 1:30 p.m. to 3:30 p.m., and identifies the session as two hours. It says North Harbor residents age 16 or older, 24 places, registration required, and a $12 fee. It uses the exact changed sentence, "Residents age 70 or older may request a fee waiver when registering; a waiver is not automatic." It does not include the baseline age-60 free-attendance rule or the baseline inability-to-pay waiver rule. It opens registration on May 1, 2026, and keeps the teaching-only limitation, one-small-item activity, and no-repair-guarantee language. It preserves Mina Ortiz's quotation exactly: "Bring curiosity, not confidence; we will learn by trying." It leaves the address, phone number, web address, closing date, and other omitted logistics unknown. Treat this as one acceptable response, not the only possible wording. Compare meaning and evidence, not just surface similarity.

Sources:

- <https://developers.openai.com/api/docs/guides/prompt-engineering>

## Checkpoint: Writing Practice Feedback Checkpoint

Checkpoint question: In the changed-input answer, which baseline payment information must be removed before the answer can be considered faithful to the new source? Write both items in your response before continuing.

Expected learner action: Identify the two superseded baseline payment rules without receiving the answer in advance.

## Pause: Writing Practice Feedback Checkpoint Response Time

## Narration: Writing Practice Feedback Narration

Use the changed-input audit to repair stale facts locally. Check the day and date first: Saturday, May 16, 2026, must become Sunday, June 7, 2026. Check the schedule and duration: 10:00 a.m. to 1:00 p.m. and three hours must become 1:30 p.m. to 3:30 p.m. and two hours. Check eligibility: the changed input explicitly says North Harbor residents age 16 or older. Check capacity: 30 becomes 24. Check cost: $8 becomes $12. Check registration: April 20 becomes May 1. Most importantly, delete both superseded baseline payment rules and preserve the changed age-70 sentence exactly. If your draft says that a waiver will be granted, it changes a request into a guarantee. If it says free attendance, it has lost the changed fee rule. Also delete any invented address, link, closing date, amenity, accepted-item list, or successful repair. Keep the audit tied to observable evidence. Do not guess a score, claim that a tool executed, or claim that a reviewer approved the exercise.

Sources:

- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices>

## Assessment Handoff: Writing Assessment Handoff

When you are ready, begin the five-question knowledge check. Use the source, brief, fact ledger, flawed-draft audit, corrected draft, changed-input task, answer key, and feedback as evidence. The check tests whether you can identify the purpose of a brief, separate extraction from transformation, repair changed meaning, handle source material responsibly, and preserve a reproducible correction record. A pending review status means review has not been documented as complete. It is not approval. Likewise, an answer key is a teaching reference, not proof that your own work was executed or reviewed by an external person.

## Closing: Class Closing

Keep the boundary visible: transform presentation, not evidence. Preserve conditions, verify meaning, retain unknowns, repair locally, and document truthful review status. Good writing is inspectable writing.
