# Prompt Anatomy and Success Criteria

A prompt becomes more reliable when you treat it as a small specification rather than as a casual request. A specification explains the intended outcome, the information available, the work to perform, the boundaries, the output form, and the checks that determine whether the result is usable.

The **purpose** explains why the work is needed. For example, “brief the project sponsor before Friday’s review” is a purpose. It describes the practical outcome, not the steps the AI should take.

The **inputs** are the materials the AI may use: meeting notes, a policy, a list of products, or a customer message. For a reusable prompt, identify which inputs will change each time. Put those changing materials in placeholders such as `[MEETING NOTES]` or `[PRODUCT LIST]`. Also identify what the inputs cannot provide. Notes may contain decisions but no confirmed due dates. A prompt should tell the AI how to handle those gaps instead of encouraging it to guess.

The **instructions** describe the work the AI must perform. They are the actions that turn inputs into the intended outcome. For example:

1. Read the notes.
2. Identify decisions, action items, and open questions.
3. Separate those categories.
4. Preserve names and dates exactly as written.

Purpose and instructions work together, but they are not interchangeable. Purpose answers “Why?” Instructions answer “What should happen to the inputs?”

**Constraints** set boundaries around the instructions. They can cover length, audience, tone, source use, format, or prohibited behavior. Conflicting constraints should be resolved directly. “Use no more than five bullets” and “include every detail” may not both be possible. Decide which content has priority, or split the result into a short summary and a fuller section. Do not expect the AI to invent a sensible compromise when the prompt leaves the conflict unresolved.

The **deliverable** names the form of the answer. A request for “something useful” could produce a paragraph, table, email, or checklist. Instead, specify headings, ordering, fields, and limits. For example, require the headings `Summary`, `Decisions`, `Action items`, and `Open questions`, in that order. A defined format makes the result easier to compare across repeated uses.

It helps to distinguish three kinds of prompt language:

- **Hard requirements** are conditions that must be met, such as “include a Decisions heading.”
- **Preferences** guide flexible choices, such as “prefer plain language.”
- **Examples** show a possible style or structure, but do not automatically create a rule.

Use visible signals such as “must,” “do not,” “prefer,” and “for example.” If an example contains a detail that must always be present, state that separately as a requirement. Otherwise, the AI may copy the example too literally or treat an important rule as optional.

A success criterion should be something a reviewer can check using the prompt, its inputs, and the resulting answer. “Every decision is included” is difficult to verify if decisions are not independently marked in the source. A stronger criterion can identify evidence and structure: “The output has a Decisions heading, and each item under it is supported by a sentence or passage in the supplied notes.” This still requires comparison with the notes, but it tells the reviewer exactly what evidence to inspect. Other useful checks include an exact heading order, a maximum number of bullets, required fields, or an explicit label for missing information.

Verification can happen in two stages. First, ask the AI to check its draft against the criteria. Second, review important results yourself. An AI’s statement that it passed a check is not proof that it did. Human review is especially important when the source is incomplete or an incorrect result could cause harm.

A reusable template should produce predictable results when its placeholders are replaced with new inputs. Test it with more than one example. If it only works for one meeting, customer, or document, locate the fixed details and replace them with placeholders. Keep stable instructions outside the placeholders so each run follows the same workflow.

A useful template is not necessarily a long one. Its purpose is to make repeated work consistent: the same categories are extracted, the same boundaries are applied, the same missing-data rule is used, and the same checks can be performed. Another person should be able to run the template with new inputs and understand what a successful result looks like without having to guess.

---