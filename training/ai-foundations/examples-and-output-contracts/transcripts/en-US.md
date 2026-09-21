# Examples and Output Contracts

Package: `examples-and-output-contracts-class` 1.1.0

> This is the canonical text equivalent of an AI-assisted virtual-instructor
> class. It remains usable without synthesized audio, video, animation, or a
> player runtime.

## Welcome: Welcome And Outcomes

Welcome. This class is about making AI output inspectable before anyone depends on it. You will learn to choose examples that reveal a rule instead of hiding it. You will define an output contract for a person or an application. You will distinguish requested formatting, valid JSON, and schema-constrained output. Then you will validate facts, evidence, business rules, and edge cases after the structure passes. This class does not promise that a model is always correct. It gives you a workflow that makes different kinds of failure visible.

## Narration: Examples And Rules Explanation

Examples can demonstrate tone, classification boundaries, field population, and how unusual inputs should be handled. They work best when the desired rule is also stated explicitly. If you show only one easy case, a system may imitate accidental features such as wording, length, order, or a repeated label. A reviewer may then be unable to tell which feature was intentional. Start by stating the rule. Next, choose relevant and varied examples that exercise different parts of it. For a support task, include a normal case, a boundary case, and a case with missing information. Explain why each expected result follows from the rule. Avoid exposing personal or secret information merely to make examples realistic. Use safe synthetic fixtures instead. Keep examples separate from held-out evaluation cases. An example illustrates the rule; it should not be the only place the rule exists.

Sources:

- <https://developers.openai.com/api/docs/guides/structured-outputs>
- <https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/increase-consistency>
- <https://ai.google.dev/gemini-api/docs/structured-output>

## Demonstration: Example Selection Demonstration

Here is a worked example. Suppose the rule says: label a request access only when the user cannot authenticate or cannot reach an authorized account; label it billing when access works but a charge or invoice is disputed; and request more information when both signals are present or essential facts are missing. A weak set repeats three password-reset requests. A stronger set includes these distinct cases. First: I cannot sign in after changing phones. That exercises access. Second: I can sign in, but the invoice shows two seats when we bought one. That exercises billing. Third: I cannot sign in after changing phones, and I need to dispute a charge. That exercises the conflict rule, so it must not be forced into whichever category appears first. A fourth case, Hello, I need help, exercises missing evidence. The examples are useful because they expose the boundaries, but the stated rule remains the authority. Notice also that the exact wording and source identifiers can be preserved when an output contract requires evidence.

Sources:

- <https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/increase-consistency>

## Learner Prompt: Examples Learner Pause

Pause and inspect your own example set. Can you point to one normal case, one boundary case, and one missing-information case? For each, write the governing rule it tests. If you cannot explain the rule without pointing only to the example, the contract is underspecified.

Expected learner action: Identify three varied examples and state the rule each example exercises.

## Pause: Examples Silent Pause

## Narration: Output Contract Explanation

An output contract defines what a usable result contains before generation begins. Name the deliverable's purpose and who uses it. Choose prose, a table, or a named schema. List required fields or sections, allowed values, evidence requirements, ordering, length limits, and behavior when data is unknown. For a human reader, headings and a checklist may be enough. For an application, define stable field names, types, enumerated values, and versioning. Decide whether an unknown value is null, omitted, or explicitly described. These choices are not interchangeable. Keep the portable business meaning separate from provider-specific configuration. A provider may offer structured-output features, but the application still owns content validation and authorization. A useful template is: Deliverable purpose, Format, Required fields or sections, Allowed values, Evidence, Unknown values, Ordering and limits, and Validation. Validation should name both structural checks and content checks.

Sources:

- <https://developers.openai.com/api/docs/guides/structured-outputs>
- <https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/increase-consistency>
- <https://ai.google.dev/gemini-api/docs/structured-output>

## Learner Prompt: Contract Drafting Prompt

Choose a recurring task such as issue triage, meeting-summary extraction, or product comparison. Write who uses the result and why. Then specify at least three required fields, one allowed-value rule, one evidence requirement, and the exact representation of an unknown value. Do this before choosing a model or API feature.

Expected learner action: Draft a provider-neutral contract with purpose, consumer, fields, allowed values, evidence, and unknown handling.

Sources:

- <https://developers.openai.com/api/docs/guides/structured-outputs>

## Pause: Contract Drafting Work Time

## Narration: Structure Levels Explanation

Formatting, parseable data, and schema adherence are different guarantees. A prompt can request a layout, but the response may still include commentary, omit fields, or change types. A JSON mode or equivalent feature can establish that a parser can read the text as JSON. That alone does not prove that required fields exist or match your business contract. Schema-constrained output is designed to enforce a supported schema, but provider capabilities, supported keywords, refusal behavior, limits, models, and interfaces vary. Keep the portable contract separate from provider settings, and test the exact model and interface you deploy. Think in layers: a response was received; parsing succeeded; structural or schema validation succeeded; business rules were checked; evidence was checked; and authorization was decided. Passing an earlier layer does not imply that a later layer passed.

Sources:

- <https://developers.openai.com/api/docs/guides/structured-outputs>
- <https://ai.google.dev/gemini-api/docs/structured-output>

## Checkpoint: Validation Layer Checkpoint

Checkpoint. A response parses as JSON and matches the declared schema, but its evidence excerpt comes from the wrong source and its recommended action exceeds the user's authority. Which layers passed? Which layers failed? May the application perform the action?

Expected learner action: State that parsing and schema passed, evidence and authorization failed, and the action must not execute.

Sources:

- <https://developers.openai.com/api/docs/guides/structured-outputs>
- <https://ai.google.dev/gemini-api/docs/structured-output>

## Pause: Validation Layer Response Time

## Feedback: Validation Layer Feedback

Parsing and schema validation passed. Evidence validation failed because the excerpt does not support the claim. Authorization failed because the user cannot approve the action. The application must not perform it. Preserve a safe failure record and route the case according to policy. If you answered that schema success made the object valid, revise that wording: schema-valid describes shape, not truth or permission. Never replace invalid evidence with a fabricated value.

Correct feedback: You separated structural success from evidence and authorization failure and prevented the consequence.

Retry feedback: Name each layer independently. A structured response cannot create evidence or grant authority.

Sources:

- <https://developers.openai.com/api/docs/guides/structured-outputs>

## Narration: Beyond Shape Explanation

A valid shape can still contain a bad answer. After parsing, check required business relationships, source support, allowed values, cross-field consistency, completeness, and downstream consequences. A date can have a valid format but be impossible in context. A cited source can exist but fail to support the claim. A category can be allowed but contradict the supplied evidence. Test normal, boundary, missing, conflicting, refusal, truncated, and malicious-input cases. Handle refusals, incomplete outputs, and validation errors explicitly. Do not convert a parse failure into fabricated defaults. Do not treat a refusal as a malformed success record. Do not retry forever. Bound retries and route unresolved cases to recovery or human review. Commands, URLs, markup, spreadsheet formulas, and tool arguments need context-specific safety checks even when their container is structurally valid. Schema-valid is not truth-valid.

Sources:

- <https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/increase-consistency>
- <https://developers.openai.com/api/docs/guides/structured-outputs>
- <https://ai.google.dev/gemini-api/docs/structured-output>

## Demonstration: Two Pass Validation Demonstration

Here is a second worked demonstration. Imagine an issue-triage object with category, urgency, evidence, and next action. The object parses. All fields exist. The category is one of the allowed values, and urgency is an integer from one through five. The structural pass succeeds. Now inspect content. The evidence says the person is asking how a feature works, but the category says critical incident and urgency is five. The next action says to disable a production service, although this workflow permits only drafting a support response. The content, evidence-consistency, and authorization checks fail. The correct result is a rejected candidate with visible reasons. Do not silently force it into an allowed category, and do not invent a repaired object that looks authoritative. The source and the consequence must remain inspectable.

Sources:

- <https://developers.openai.com/api/docs/guides/structured-outputs>
- <https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/increase-consistency>

## Narration: Repaired Contract Policy Narration

Now we use the synthetic Northstar Library support desk. This is a teaching fixture, not a live incident workflow and not a claim about any model or provider. The output must contain exactly these fields: status, category, priority, summary, evidence, next_action, and reasons. Evidence must identify an input source and copy an exact contiguous quote from that source. Duplicate keys, extra fields, unknown source identifiers, and altered quotes are rejected. The policy is deliberately bounded. Automatic completion is allowed only for case_id N-001, with the exact supplied message, category billing, priority normal, and the stated evidence. Boundary, missing-information, conflict, refusal, and all other cases require information or human review. Priority is not inferred from urgency words. Normal is allowed only for that exact N-001 fixture. Low and high are never automatically assigned. This fixture-bound policy does not establish natural-language truth. It only demonstrates distinct validation and authorization layers.

Sources:

- <https://developers.openai.com/api/docs/guides/structured-outputs>

## Narration: Repaired Examples And Expected Results Narration

Here are the exact authored fixtures. The normal input is case_id N-001 with source_id msg-1 and text: I can sign in, but the invoice shows two seats when we bought one. The expected output is status complete, category billing, priority normal, summary The requester disputes the number of seats on an invoice, evidence source_id msg-1 with exact_quote the invoice shows two seats when we bought one, next_action draft_reply, and reasons This exact authored fixture supports billing and normal priority. It is accepted at authorization. The boundary input is B-001, source_id msg-2, text: I cannot sign in after changing phones, and I need to dispute a charge. Its expected status is needs_information, category unknown, priority unknown, the summary says the request contains both an access problem and a billing dispute, evidence copies the full msg-2 quote, next_action is request_information, and authorization is blocked. The missing input is M-001, source_id msg-3, text: Hello, I need help. Its expected category and priority are unknown, evidence is an empty array, next_action is request_information, and its reason is No category-supporting evidence was supplied. These examples illustrate the rule but do not replace it.

Sources:

- <https://developers.openai.com/api/docs/guides/structured-outputs>

## Narration: Repaired Offline Verifier Narration

The supplied offline verifier checks five layers in order: parsing with duplicate-key rejection, shape and type checks, source and exact-quote checks, fixture-bound business and cross-field checks, and authorization. Its self-test contains fourteen named cases. One is accepted: normal. Thirteen are rejected: boundary, missing, unsupported-category, high-priority, wrong-action, wrong-evidence, extra-field, bool-priority, invented-summary, empty-reasons, unsupported-reasons, malformed, and duplicate-key. That is exact arithmetic: one plus thirteen equals fourteen. The normal case must match the complete input and output, including source_id msg-1, the invoice quote, summary, next_action, and reasons. Boundary and missing cases reach authorization and are rejected because downstream action is blocked. Wrong evidence fails the source layer. Extra fields, a Boolean priority, empty reasons, malformed JSON, and duplicate keys fail earlier checks. Unsupported category, high priority, wrong action, invented summary, and unsupported reasons fail the bounded business policy. Save the supplied code as verifier.py and run it offline if you choose. This lesson does not claim that it was run here. The verifier is only for the fictional fixtures; arbitrary language still needs human verification.

Sources:

- <https://developers.openai.com/api/docs/guides/structured-outputs>
- <https://ai.google.dev/gemini-api/docs/structured-output>

## Narration: Independent Task Narration

Now complete the changed-input task before viewing feedback. The exact input is case_id I-001 with one item: source_id msg-9 and text How do I export a report? The export button is broken. Return one contract-compliant output and a short decision trace. Keep the task and answer separate. Copy evidence exactly if you use it. Represent unsupported values explicitly. Decide whether a downstream action is authorized. This case is not one of the authored automatic fixtures, so it must not be treated as an automated acceptance case.

Sources:

- <https://developers.openai.com/api/docs/guides/structured-outputs>

## Learner Prompt: Independent Contract Prompt

Write your answer now. Use status needs_information if you preserve the conflict, category unknown, priority unknown, the exact msg-9 quote as evidence, next_action request_information, and a reason that explains why more information is required. Also include a decision trace. Do not open the feedback section until you have submitted your attempt.

Expected learner action: Submit one contract-compliant answer for I-001 before viewing feedback.

## Pause: Independent Answer Pause

## Narration: Independent Feedback Narration

The expected review answer is status needs_information, category unknown, priority unknown, summary The request combines a how-to question with a possible defect, evidence with source_id msg-9 and the exact quote How do I export a report? The export button is broken., next_action request_information, and reasons How-to and defect evidence conflict; the contract requires more information. The decision trace is parse:pass, shape:pass, source:pass, business:pass because the bounded conflict rule maps to needs_information, and authorization:blocked. The evidence is copied exactly. This is a review reference, not an automated acceptance rule for arbitrary new text. Because I-001 is new, human verification remains required.

Sources:

- <https://developers.openai.com/api/docs/guides/structured-outputs>

## Transition: Activity Transition

Open the activity when ready. Choose issue triage, meeting-summary extraction, product comparison, or another recurring task. Define purpose, required fields, allowed values, evidence, unknown-value behavior, ordering, and validation. Create normal, boundary, and missing-information examples tied to an explicit rule. Review a sample twice: first for structure, then for factual support, business consistency, consequences, and authority. Record a two-part checklist. Complete the independent changed-input attempt before opening its feedback, and record parsing, shape, source, business, and authorization results separately for the supplied fixtures.

Sources:

- <https://developers.openai.com/api/docs/guides/structured-outputs>

## Pause: Activity Work Time

## Checkpoint: Knowledge Check Checkpoint

Before the knowledge check, recall the central distinction: examples demonstrate a rule, contracts define a usable deliverable, parsing and schemas test structure, and content and authorization checks test whether any consequence is justified. If a response is refused or incomplete, handle that branch explicitly rather than inventing fields.

Expected learner action: State the difference between examples, contracts, structural validation, content validation, and authorization.

## Assessment Handoff: Assessment Handoff

When you are ready, begin the knowledge check. It covers varied examples, output-contract elements, the difference between valid JSON and schema adherence, handling refusals or incomplete output, and evidence failure inside a schema-valid response. Review the class or return to the activity before submitting. The assessment opens only when you choose Begin knowledge check.

## Closing: Class Closing

Keep the layers separate. Examples illustrate a rule. Contracts define a usable shape and its unknown behavior. Parsers and schemas test structure. Content checks test evidence, consistency, and usefulness. Authorization checks whether a consequence may follow. A plausible-looking output is not enough. Make the rule, the evidence, the failure layer, and the next safe action visible.
