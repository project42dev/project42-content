# Prompt Anatomy and Success Criteria

Package: `prompt-anatomy-and-success-criteria-class` 1.0.0

> This is the canonical text equivalent of an AI-assisted virtual-instructor
> class. It remains usable without synthesized audio, video, animation, or a
> player runtime.

## Welcome: Welcome And Outcomes

Welcome. In this class, you will turn vague requests into prompts that another person can inspect, reuse, and improve. We will separate purpose, inputs, instructions, constraints, deliverable, and verification. We will write observable success criteria before asking a model to generate. We will distinguish requirements from preferences and examples. Finally, you will rewrite one ambiguous request as a reusable template. These techniques apply across model providers because they clarify the work itself, not a vendor-specific trick.

## Narration: Purpose And User Explanation

Begin with the useful outcome and the person who will use it. A topic is not yet a task. The request, customer feedback, leaves the model and the reviewer to guess whether the goal is a summary, a sentiment count, a product decision, or a response to each customer. A stronger purpose says, group the supplied comments so the support lead can choose three fixes. Now the material, user, action, and decision are visible. Purpose also helps you decide whether AI assistance is suitable. A private, high-impact, or irreversible use needs stricter data boundaries, evidence, review, and stop conditions than a reversible brainstorming draft. Before adding detail, ask: who uses the result, what will they do with it, and what consequence follows if it is incomplete or wrong? A clear answer keeps later prompt choices aligned with a real need instead of producing polished text with no defined use.

Sources:

- <https://developers.openai.com/api/docs/guides/prompt-engineering>
- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices>
- <https://ai.google.dev/gemini-api/docs/prompting-strategies>

## Demonstration: Purpose Rewrite Demonstration

Watch a purpose rewrite. The original request is, make a plan for training. I will not begin by adding decorative adjectives. I ask who needs the plan and which decision it supports. Suppose the user is a team lead deciding how to onboard six analysts next month. I ask what evidence is available: role requirements, current skills, schedule, and approved learning resources. I ask what a usable result looks like: a four-week table with outcomes, activities, owners, and evidence of completion. I also name the consequence of uncertainty: missing availability must be flagged rather than invented. The revised purpose becomes, use the supplied role requirements, skills summary, schedule, and approved resources to draft a four-week onboarding plan that helps the team lead assign work and verify readiness. This rewrite has not solved the task, but it has removed several hidden decisions and made the next questions obvious.

Sources:

- <https://developers.openai.com/api/docs/guides/prompt-engineering>
- <https://ai.google.dev/gemini-api/docs/prompting-strategies>

## Narration: Inputs And Instructions Explanation

Next, name the trusted inputs and separate them from instructions. Inputs are the material the response may analyze: a policy, dataset, meeting notes, code, or examples. Instructions say what to do with that material. Use clear boundaries so quoted documents, web pages, and user-supplied text are treated as data rather than commands that can change the task. State which sources are authoritative and what to do when they conflict. Use ordered steps when sequence matters. For example: first extract requirements from the approved policy; second map each proposed action to one requirement; third list gaps without filling them from memory. Constraints name must, must not, privacy, scope, and tool limits. The deliverable names format and useful detail. Verification names the checks that occur after generation. If required information is missing, choose an explicit behavior: ask a question, flag an assumption, return an evidence gap, or stop. Those labels make the prompt easier to review and reduce silent improvisation.

Sources:

- <https://developers.openai.com/api/docs/guides/prompt-engineering>
- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices>

## Learner Prompt: Anatomy Markup Prompt

Take a prompt you have used or invent a simple one. Mark its purpose, input, instruction, constraint, deliverable, verification, and missing-information behavior. If an element is absent, write missing beside it. Do not improve the prompt yet. The goal is to see which decisions the current wording leaves hidden. Pause while you mark it.

Expected learner action: Mark the seven prompt elements and identify every missing element without rewriting the request.

Sources:

- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices>

## Pause: Anatomy Markup Work Time

## Narration: Observable Success Explanation

Define success before generation so quality does not depend on confidence or taste alone. An observable criterion is something a reviewer can inspect: every required field exists, each factual claim maps to supplied evidence, calculations reproduce, links resolve, prohibited data is absent, or a stated rubric threshold is met. Make it excellent is not observable. Concise is incomplete unless you define a limit that still preserves required content. Separate hard requirements from preferences. A hard requirement can fail the result, such as using only the supplied policy or returning all five required fields. A preference guides style when it does not conflict, such as using short sentences or a friendly tone. Examples demonstrate desired behavior, but the governing rule should remain explicit; otherwise one easy example may teach an accidental pattern. A useful review reads the result twice: first against hard requirements and evidence, then against preferences. This ordering prevents an attractive style from hiding a missing fact or unsupported decision.

Sources:

- <https://developers.openai.com/api/docs/guides/prompt-engineering>
- <https://ai.google.dev/gemini-api/docs/prompting-strategies>

## Checkpoint: Success Criteria Checkpoint

Checkpoint. A prompt says, write a brilliant comparison of three tools. Replace brilliant with two observable success criteria and identify one preference. Your criteria must let another reviewer decide whether the result passed without guessing your taste.

Expected learner action: Write two inspectable requirements, such as comparing the same supported criteria with cited evidence, plus one non-blocking style preference.

Sources:

- <https://developers.openai.com/api/docs/guides/prompt-engineering>

## Pause: Success Criteria Response Time

## Feedback: Success Criteria Feedback

A strong answer uses criteria such as: compare all three tools against the same four named requirements, and cite a supplied source for every current capability claim. A preference might be, use a compact table followed by a short recommendation. The first two can fail independently of style. If your criteria used words like best, comprehensive, or professional without defining evidence, revise them into a count, field, mapping, test, or rubric that another person can inspect. If you made the table format mandatory, explain why the user or downstream workflow requires it; otherwise it may be a preference.

Correct feedback: Your criteria identify inspectable coverage and evidence, while the preference guides presentation only after requirements pass.

Retry feedback: Replace subjective adjectives with fields, counts, mappings, tests, or rubric evidence that a second reviewer can inspect.

Sources:

- <https://developers.openai.com/api/docs/guides/prompt-engineering>
- <https://ai.google.dev/gemini-api/docs/prompting-strategies>

## Narration: Uncertainty Policy Explanation

A reusable prompt defines how uncertainty becomes visible. Required context can be missing, sources can conflict, or the task can require a choice the user did not authorize. Decide which branch applies. Ask a clarifying question when the answer changes the task and the user can provide it. State a bounded assumption when stakes are low, the assumption is visible, and the reviewer can replace it. Return not supported by the supplied evidence when a factual claim lacks support. Stop when continuing would cross a privacy, permission, safety, or consequence boundary. Prompt detail improves the probability of useful work; it does not guarantee truth. Verification still compares the generated result with original evidence, recalculates important values, tests executable output, and keeps consequential action behind appropriate authorization. Design the failure path with the same care as the happy path. A polished answer that hides an unsupported choice is less useful than a clear request for missing information.

Sources:

- <https://developers.openai.com/api/docs/guides/prompt-engineering>
- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices>
- <https://ai.google.dev/gemini-api/docs/prompting-strategies>

## Demonstration: Complete Rewrite Demonstration

Now I will finish the training-plan rewrite. Purpose: help the team lead assign a four-week analyst onboarding plan. Inputs: only the supplied role requirements, skills summary, schedule, and approved resources. Instructions: identify gaps, sequence activities, assign an owner, and map each activity to a role requirement. Constraints: do not infer personal performance or add unapproved resources. Deliverable: a table with week, outcome, activity, owner, evidence, and dependency. Hard success criteria: all required role capabilities appear, every activity maps to a supplied requirement, and schedule conflicts are flagged. Preference: use plain language. Missing-information rule: ask if the start date or required roles are absent; otherwise mark unknown availability rather than inventing it. Verification: the team lead checks mappings and schedule against the originals. Notice that the example is reusable because its decisions are labeled. A different user can replace the bracketed inputs without rediscovering the contract.

Sources:

- <https://developers.openai.com/api/docs/guides/prompt-engineering>
- <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices>

## Transition: Activity Transition

Open the rewrite activity. Choose a vague request such as summarize this, make a plan, or compare these tools. Record the original wording. Identify the user, decision, trusted inputs, hard constraints, and observable success criteria. Rewrite the request with purpose, inputs, instructions, constraints, deliverable, verification, and missing-information behavior. Then ask another person, or use the supplied reviewer checklist, to name one ambiguity removed and one assumption that remains. Save both versions and the review as your evidence.

Sources:

- <https://developers.openai.com/api/docs/guides/prompt-engineering>

## Pause: Activity Work Time

## Assessment Handoff: Assessment Handoff

When you are ready, begin the knowledge check. You will identify a clear purpose, protect the boundary between source text and instructions, choose observable success criteria, define behavior for missing context, and explain why prompt quality does not replace verification. Review the transcript or revise your activity before submitting. The assessment opens only when you select Begin knowledge check.

## Closing: Class Closing

Remember this rule: expose the decisions before asking for the answer. Name the purpose, evidence, requirements, uncertainty behavior, deliverable, and verification so useful work can be reviewed and improved.
