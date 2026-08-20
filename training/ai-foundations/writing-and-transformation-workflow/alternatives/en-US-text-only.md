# Writing and Transformation Workflow: text-only class

This route contains the complete teaching content, learner actions, feedback,
and assessment handoff without requiring audio, video, or animation.

## Welcome: Welcome And Outcomes

Welcome. This class treats AI-assisted writing as a controlled transformation, not permission to invent. You will define what may change, what must remain exact, and who accepts the result. You will separate source extraction from rewriting, compare the output with the original, correct drift without destabilizing the whole document, and protect authors, subjects, and readers. The test of success is not whether the new text sounds polished. It is whether the intended meaning survives and the result can be reviewed.

## Narration: Transformation Brief Explanation

Begin with a transformation brief. Name the audience, purpose, channel, length, reading level, and review owner. Identify the transformation: summarization, restructuring, translation, editing, or new drafting. Point to the source of truth. List names, dates, numbers, quotations, obligations, technical terms, conclusions, and voice elements that must remain exact. List structure, length, tone, or vocabulary that should change. State what the output must not add. Define acceptance checks for meaning, evidence, accessibility, permission, and approval. Remove personal, confidential, licensed, or restricted material that the task does not need. Confirm that the selected service and reviewers are authorized to handle what remains. A useful brief creates two visible boundaries: freedom to improve presentation inside the brief, and no authority to change protected meaning or manufacture facts.

Visual alternative: The brief names audience and purpose, transformation type, source of truth, exact material to preserve, requested changes, prohibited additions, and verification checks.

Sources:

- <https://ai.google.dev/gemini-api/docs/prompting-strategies>
- <https://developers.openai.com/api/docs/guides/prompt-engineering>

## Demonstration: Brief Demonstration

Suppose I need to turn a technical incident summary into a short customer update. The source says service was unavailable for twenty-three minutes, recovery completed at fourteen thirty UTC, and the cause remains under investigation. I preserve the duration, timestamp, status, and uncertainty exactly. I may replace internal headings, shorten implementation detail, and explain unfamiliar terms. I prohibit a root-cause claim, apology on behalf of a named executive, or promise about future reliability unless an authorized source supplies it. The owner of customer communications reviews the result. This brief allows clearer language while preventing a plausible but unsupported sentence such as, the issue was caused by a network failure and cannot happen again.

Visual alternative: Duration, recovery time, status, and uncertainty are protected. Structure and explanations may change. Root cause and future guarantees cannot be added.

Sources:

- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices>

## Narration: Visible Passes Explanation

Execute in visible passes. In pass one, extract source facts, required terms, quoted language, structure, and explicit unknowns. Do not improve the prose yet. In pass two, transform only within the brief. Keep source-derived statements separate from proposed additions. If an addition could help, label it Proposed and require evidence or owner approval before it enters the draft. For long work, process bounded sections and keep a change log that records what moved, shortened, clarified, or remained exact. Provide enough neighboring context to preserve meaning, but not unrelated sensitive material. Do not ask a model to imitate a living person's distinctive voice. Describe approved voice characteristics such as direct, calm, concise, or instructional. Visible passes make it easier to locate where an unsupported detail entered and to compare the output without relying on memory.

Visual alternative: Pass one extracts facts and unknowns. Pass two rewrites within constraints. Proposed additions remain in a separate review column.

Sources:

- <https://ai.google.dev/gemini-api/docs/prompting-strategies>
- <https://developers.openai.com/api/docs/guides/prompt-engineering>
- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices>

## Learner Prompt: Preservation Rule Prompt

Choose a permitted source passage. Mark one sentence, value, or obligation that must remain exact. Mark one structural or stylistic element that may change. Write one detail the model must not add.

Learner action: Define one exact preservation rule, one permitted transformation, and one prohibited addition.

Sources:

- <https://developers.openai.com/api/docs/guides/prompt-engineering>

## Pause: Preservation Rule Work Time

## Narration: Meaning Audit Explanation

Verify the transformation against both source and brief. Compare every name, date, number, quotation, obligation, condition, exception, and conclusion. Check whether simplification changed who must act, what is allowed, when a rule applies, or how certain the source was. Map any new factual statement to evidence. Remove citation-shaped text until the original has been opened and checked. Read as the intended audience. Confirm logical heading order, meaningful links, defined abbreviations, plain language, inclusive terminology, keyboard and screen-reader clarity, and any required disclosure of AI assistance. Read difficult passages aloud or use text-to-speech to catch missing words and overloaded sentences. For consequential legal, policy, safety, financial, or reputational language, route the exact source and transformed passage to the accountable reviewer. Readability is valuable, but it cannot override meaning.

Visual alternative: The audit checks exact facts, preserved meaning, evidence, audience fit, accessibility, disclosure, and accountable review.

Sources:

- <https://ai.google.dev/gemini-api/docs/prompting-strategies>
- <https://developers.openai.com/api/docs/guides/prompt-engineering>

## Checkpoint: Changed Obligation Checkpoint

Checkpoint. The source says an administrator must approve access before use. The plain-language draft says an administrator can review access after use. The second sentence is shorter. Is it acceptable, and what should happen next?

Learner action: Reject the draft because it changes timing and obligation, restore the source meaning, and route consequential wording to the responsible reviewer.

Sources:

- <https://developers.openai.com/api/docs/guides/prompt-engineering>

## Pause: Changed Obligation Response Time

## Feedback: Changed Obligation Feedback

Reject the draft. Must approve before use is an obligation and timing condition. Can review after use changes both. Return to the exact source passage, restate the preservation rule, correct only the affected section, and obtain the responsible review. If you accepted the rewrite because it was easier to read, revise your criterion: plain language must preserve who acts, what is required, and when. If you regenerated the entire document, consider the smaller repair. A bounded correction reduces the chance of introducing new drift elsewhere.

If correct: You detected the changed obligation and timing, restored the source meaning, and kept accountable review in the workflow.

If retrying: Compare who acts, whether the action is required, and whether it happens before or after use.

Sources:

- <https://developers.openai.com/api/docs/guides/prompt-engineering>

## Narration: Drift Recovery Explanation

Recover from drift without hiding it. Place the accepted source and current output side by side. Identify the smallest affected section and classify the failure: changed meaning, invented detail, omitted limitation, altered voice, unsupported quotation, or sensitive-data exposure. Return to the exact source passage and brief rule. Correct only the affected section, then rerun the local audit and any dependent cross-document checks. Record the detected drift, likely cause, correction, and reviewer. If an invented detail entered because the brief was silent, add an explicit prohibited-addition rule. If source material was inappropriate to process, stop, remove it from the workflow according to policy, and involve the data owner. Escalate claims whose legal, safety, policy, or reputational meaning cannot be resolved by the writing team.

Visual alternative: Detected drift maps to its source passage and brief rule, then to a local correction, repeated audit, and reviewer record.

Sources:

- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices>

## Narration: Authors Subjects Readers Explanation

Protect authors, subjects, and readers. Minimize sensitive material before generation and confirm permission, confidentiality, copyright, license, translation, and attribution requirements. Do not treat public availability as permission for every reuse. Avoid deceptive impersonation and undisclosed synthetic quotations. Never publish a generated quotation or citation without checking the original. Preserve attribution when the transformation depends on another person's work. Record the source version, brief version, generated draft, accepted changes, limitations, reviewer, and final disposition. Delete or retain intermediate material according to policy rather than convenience. Disclose AI assistance when policy, context, or reader expectations require it. A reproducible correction record should show what drifted, why it mattered, how it was fixed, and who accepted the result. Transformation is successful only when meaning, permission, and accountability survive.

Visual alternative: The checklist covers permission, minimum data, attribution, verified quotations, disclosure, version records, retention, and accountable approval.

Sources:

- <https://ai.google.dev/gemini-api/docs/prompting-strategies>
- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices>

## Transition: Activity Transition

Open the reviewed transformation activity. Choose a permitted three-hundred-to-five-hundred-word source. Define audience, purpose, transformation type, exact preservation rules, permitted changes, and prohibited additions. Build pass one as extracted facts and structure, then pass two as audience-ready prose. Audit meaning, evidence, accessibility, attribution, and sensitive data. Introduce one deliberate drift error, detect it, correct only the affected section, and save the cause, fix, and reviewer record.

Sources:

- <https://developers.openai.com/api/docs/guides/prompt-engineering>

## Pause: Activity Work Time

## Assessment Handoff: Assessment Handoff

When you are ready, begin the knowledge check. You will identify a complete transformation brief, explain visible writing passes, respond to a changed obligation, protect sensitive source material, and recognize a reproducible correction record. Review the class or return to the activity before submitting. The assessment begins only when you choose Begin knowledge check.

## Closing: Class Closing

Keep the boundary visible: transform presentation, not evidence or obligation. Preserve meaning, verify every consequential change, and leave a correction record another reviewer can reconstruct.
