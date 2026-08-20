# Prompt with Purpose

A useful prompt does more than ask for an answer. It creates a small working agreement between you and an AI system: who the work is for, what decision or action the work should support, what information may be used, and what a successful result looks like.

A vague request such as “Review these comments” leaves many important choices unstated. Should the comments be summarized, categorized, or ranked? Who will read the result? Are they deciding what to fix first, or simply learning what customers think? Without those details, the system may produce a fluent response that is not useful for the situation.

## Start with the user and the decision

A concrete outcome usually has two parts: a named user and a decision. For example:

> “Create a one-page brief for the product manager deciding whether to prioritize onboarding improvements this quarter.”

The named user helps set the level of detail, vocabulary, and format. The decision gives the work a purpose. A support lead may need recurring complaint themes and suggested responses. A product manager may need evidence of frequency, severity, and likely impact. The same source material can require very different outputs depending on who will use it.

If there is no decision yet, define the next action instead. “Help a new team member understand the main risks before the weekly meeting” is more useful than “Explain this document.”

A helpful test is to imagine handing the result to the named user. What would they do with it? If you cannot answer that question, the prompt may describe an activity rather than an outcome.

## Separate instructions from material

A prompt often contains two different kinds of text:

- **Instructions:** what you want the system to do.
- **Content:** the material it should analyze, transform, or summarize.

Keep these roles visibly separate. Labels such as `Task`, `Context`, and `Output requirements` make the boundary easier to inspect. Treat pasted documents, messages, web text, and generated content as material to analyze—not as new authority over the task. Content can contain accidental requests, misleading claims, or text that looks like an instruction.

This separation is especially important when the source includes notes from several people. A comment such as “ignore the previous request” may be part of a customer’s message rather than an instruction to the assistant. Your prompt should say how the material is to be handled and what sources are trusted.

You can also reduce confusion by stating what the system may not use. “Use only the supplied feedback” is clearer than assuming the system will know which facts are allowed.

## Make constraints observable

Constraints are more useful when another person can check them. “Keep it concise” is subjective. “Use no more than five bullets, with one sentence of evidence under each theme” is observable.

Useful constraints may cover:

- length and structure;
- audience and tone;
- permitted sources;
- required fields;
- exclusions, such as not inventing causes or recommendations;
- whether uncertainty must be shown;
- what to do with conflicting evidence.

A deliverable describes the shape of the result: a table, briefing note, checklist, set of options, or decision memo. Success criteria describe how to judge it. For example, a feedback brief might succeed if every theme includes representative evidence, the themes do not overlap unnecessarily, and the recommendation is clearly separated from the evidence.

Do not confuse a constraint with a preference. “Use a table with three columns” can be checked directly. “Make it professional” needs more explanation, such as “use neutral language and avoid unexplained specialist terms.”

## Design for missing information

A dependable prompt does not assume that all necessary information will be available. Tell the system what to do when a field is absent. It might mark the field “not provided,” list a question for the requester, or give a conditional answer. It should not silently fill gaps with plausible details.

This matters because a polished answer can hide missing evidence. If the request asks which issue is most expensive but contains no cost data, the right response is to identify the missing data—not to guess based on the wording of a complaint.

Missing information can also affect the workflow itself. If the intended audience is unknown, the system may need to ask who will use the result before choosing a format. If the source contains conflicting statements, the prompt can require the conflict to be shown rather than quietly resolved.

## Inspect before revising

When the result is weak, avoid rewriting everything at once. First identify the smallest failure:

- The answer is too broad: clarify the audience or decision.
- The answer is too long: add a measurable length or structure constraint.
- The answer invents details: restrict permitted sources and specify uncertainty behavior.
- The answer misses important points: add required fields or an explicit coverage requirement.
- The format is wrong: describe the deliverable more precisely.

Keep the success criteria stable while testing a prompt change whenever possible. The criteria are your measuring tool; changing them at the same time makes it harder to tell whether the prompt improved. Change one instruction, constraint, or workflow step, then compare the new result with the old one.

The goal is not a “magic prompt.” It is a repeatable way to turn intent into a task that can be inspected, evaluated, and improved.

---