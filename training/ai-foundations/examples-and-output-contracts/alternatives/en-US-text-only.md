# Examples and Output Contracts: text-only class

This route contains the complete teaching content, learner actions, feedback,
and assessment handoff without requiring audio, video, or animation.

## Welcome: Welcome And Outcomes

Welcome. This class is about making AI output inspectable before anyone depends on it. You will choose examples that reveal a rule instead of hiding it. You will define an output contract for either a person or an application. You will distinguish requested formatting, valid JSON, and schema-constrained output. Then you will validate facts, business rules, and edge cases after the structure passes. The result is not a promise that a model will always be correct. It is a workflow that makes different kinds of failure visible.

## Narration: Examples And Rules Explanation

Examples can demonstrate tone, classification boundaries, field population, and handling of unusual inputs. They are most useful when the governing rule is also stated. If you show only one easy example, a model may imitate accidental features: the length, wording, order, or label balance. A reviewer may also be unable to tell which feature was intentional. Start with the rule, then choose a small set that challenges it. For a support-ticket classifier, include a normal billing case, a boundary between billing and account access, and a missing-information case that must be escalated. Explain why each expected label follows from the rule. Avoid examples containing secrets or personal data merely because they are realistic. Replace sensitive details with safe, representative fixtures. Finally, keep examples independent from evaluation cases. If every test repeats the examples, you only learn that the system can reproduce what it has already seen.

Visual alternative: The rule appears first. Three varied examples expose how it applies, while a separate evaluation set tests behavior without copying the examples.

Sources:

- <https://developers.openai.com/api/docs/guides/structured-outputs>
- <https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/increase-consistency>
- <https://ai.google.dev/gemini-api/docs/structured-output>

## Demonstration: Example Selection Demonstration

Suppose the rule is: label a request account-access only when the user cannot authenticate or cannot reach an authorized account; label a request billing when access works but the charge, invoice, or payment is disputed; escalate when both are present or essential facts are missing. A weak example set contains three obvious password-reset requests. A stronger set includes: I cannot sign in after changing phones, expected account-access; I can sign in but the invoice shows the wrong quantity, expected billing; and I cannot sign in and need to dispute a charge, expected escalation. The third example demonstrates the conflict rule rather than forcing one convenient label. I also add a case with no description and expect escalation for missing evidence. Now a reviewer can inspect whether the examples cover the rule instead of merely sharing vocabulary. The examples guide behavior, but the written rule remains the authority.

Visual alternative: The weak set repeats password resets. The stronger set covers account access, billing, a conflicting request that escalates, and an empty request that escalates.

Sources:

- <https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/increase-consistency>

## Narration: Output Contract Explanation

An output contract defines what a usable result contains before generation begins. Name the purpose and who consumes it. Choose prose, a table, or a named schema. List required fields or sections, allowed values, evidence requirements, ordering, length limits, and behavior when a value is unknown. For a human reader, headings and a checklist may be sufficient. For an application, define stable field names, types, enumerated values, null behavior, and versioning. Keep portable meaning separate from provider configuration. The business contract might require category, confidence band, evidence excerpt, and escalation reason. One provider may enforce that contract through structured-output settings; another may support a different schema subset. The application still owns validation and authorization. Unknown handling deserves special care. Null, omitted, unknown, and not applicable have different meanings. Pick one deliberately instead of letting an absent value become a convincing default.

Visual alternative: The contract names the user, format, fields, allowed values, evidence, unknown behavior, ordering, and validation while provider settings remain a replaceable adapter.

Sources:

- <https://developers.openai.com/api/docs/guides/structured-outputs>
- <https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/increase-consistency>
- <https://ai.google.dev/gemini-api/docs/structured-output>

## Learner Prompt: Contract Drafting Prompt

Choose a recurring task such as issue triage, meeting-summary extraction, or product comparison. Write the result's user and purpose. Then list three required fields, one allowed-value rule, one evidence requirement, and the exact representation of an unknown value. Pause before deciding which model or API feature will produce it.

Learner action: Draft the consumer, purpose, required fields, allowed values, evidence rule, and unknown-value behavior for one recurring task.

Sources:

- <https://developers.openai.com/api/docs/guides/structured-outputs>

## Pause: Contract Drafting Work Time

## Narration: Structure Levels Explanation

Formatting, parseable data, and schema adherence are different guarantees. A prompt may request JSON, yet the response can include commentary, omit fields, or change types. A mode that guarantees syntactically valid JSON establishes that a JSON parser can read the text. It does not necessarily prove that required fields exist or match your business schema. A supported schema-constrained feature is designed to enforce the declared structure and allowed types, but providers and models differ in supported schema keywords, refusal behavior, limits, and interfaces. Test the exact deployment you will use. Even perfect schema adherence does not prove factual correctness, source support, completeness for the real decision, or permission to act. Treat the gates as layers: transport received a response; parsing produced data; schema validation established shape; business validation checked meaning; evidence validation checked support; authorization decided whether any consequence may follow. Log which layer failed without exposing sensitive content.

Visual alternative: A response must separately pass transport, JSON parsing, schema shape, business rules, evidence support, and authorization. Passing an earlier layer does not imply later success.

Sources:

- <https://developers.openai.com/api/docs/guides/structured-outputs>
- <https://ai.google.dev/gemini-api/docs/structured-output>

## Checkpoint: Validation Layer Checkpoint

Checkpoint. A response parses as JSON and matches the declared schema, but its evidence excerpt comes from the wrong source and its recommended action exceeds the user's authority. Which validation layers passed, which failed, and may the application perform the action?

Learner action: State that parsing and schema passed, evidence and authorization failed, and the action must not execute.

Sources:

- <https://developers.openai.com/api/docs/guides/structured-outputs>
- <https://ai.google.dev/gemini-api/docs/structured-output>

## Pause: Validation Layer Response Time

## Feedback: Validation Layer Feedback

The JSON parser and schema validator passed. The evidence layer failed because the excerpt does not support the claim, and the authorization layer failed because the user cannot approve the action. The application must not perform it. It should preserve a safe error record, return a reviewable failure, and route the case according to policy. If you answered that schema success made the object valid, revise your language: schema-valid describes shape only. If you proposed replacing the evidence with a fabricated value, stop. Missing or invalid evidence must remain visible rather than becoming authoritative-looking data.

If correct: You separated structural success from evidence and authorization failure and prevented the consequence.

If retrying: Name each validation layer independently and remember that no structured response can grant authority the user does not have.

Sources:

- <https://developers.openai.com/api/docs/guides/structured-outputs>

## Narration: Beyond Shape Explanation

Content validation begins after parsing. Check required business relationships, not only individual fields. A start date may be valid text but precede the request date. A confidence value may be a valid number but outside the allowed range. A cited source may exist but not support the claim. A classification may be allowed but contradict the supplied evidence. Test normal, boundary, missing, conflicting, refusal, truncated, and malicious-input cases. Handle each failure explicitly. A refusal is not a malformed success record. An incomplete response is not permission to invent required fields. A parse error is not a reason to retry forever. Bound retries, preserve the original safe evidence, and route unresolved cases to a person or recovery path. Validate downstream consequences too. Spreadsheet formulas, markup, URLs, commands, and tool arguments need context-specific safety checks even when their container is valid. The output contract tells you what to inspect; it does not transfer responsibility to the model.

Visual alternative: Normal and boundary cases are validated; missing, conflict, refusal, truncation, and malicious cases follow explicit failure or review paths without fabricated defaults.

Sources:

- <https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/increase-consistency>
- <https://developers.openai.com/api/docs/guides/structured-outputs>
- <https://ai.google.dev/gemini-api/docs/structured-output>

## Demonstration: Two Pass Validation Demonstration

Consider an issue-triage object with category, urgency, evidence, and next action. The sample parses and matches the schema. First pass: all fields exist, category is one of incident, request, question, or unknown, and urgency is an integer from one to five. Structure passes. Second pass: the evidence says the user is asking how a feature works, but category is incident and urgency is five. The next action says disable the production service, although the workflow only permits drafting a support response. Content consistency and authorization fail. The correct result is a rejected candidate with reasons, not an automatic incident and not a repaired object invented by the validator. I add this case to the held-out evaluation set. The example teaches that validators should preserve evidence and make failure inspectable rather than silently forcing data into an allowed shape.

Visual alternative: Field and enum checks pass, but a how-to question is mislabeled as a critical incident and requests an unauthorized production shutdown, so no action occurs.

Sources:

- <https://developers.openai.com/api/docs/guides/structured-outputs>
- <https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/increase-consistency>

## Narration: Repaired Contract Policy Narration

This lesson uses the synthetic Northstar Library support desk. The contract is a teaching fixture, not a live incident workflow and not a claim about any model or provider. The output must contain exactly status, category, priority, summary, evidence, next_action, and reasons. Evidence must cite an input source and an exact contiguous quote from that source. Duplicate keys, extra fields, unknown source identifiers, and altered quotes are rejected. The classification policy is deliberately bounded. Automatic completion is permitted only for the authored normal fixture with case_id N-001, the exact supplied message, category billing, priority normal, and the stated evidence. The boundary, missing-information, conflict, refusal, and all other cases require information or human review. This fixture-bound policy does not claim that words prove the truth of a natural-language classification. Priority is not inferred from urgency words. In this lesson, normal is supported only by the exact normal fixture. low and high are never automatically assigned. An unsupported or invented priority is rejected. This transparent limit prevents a plausible-looking priority from becoming authorization. The verifier checks parsing, shape, source binding, business policy, and authorization as distinct layers. Only a complete result that matches the bounded policy and requests draft_reply may proceed. A parseable object is not automatically a truthful or authorized object.

Sources:

- <https://developers.openai.com/api/docs/guides/structured-outputs>

## Narration: Repaired Examples And Expected Results Narration

The normal fixture is the sole automatic-completion example. Its exact input, evidence, category, and priority are all checked against the bounded policy. The boundary fixture contains both access and billing evidence. It must not be forced into the first category mentioned. The expected result preserves unknown category and priority and blocks authorization. The missing fixture contains no category-supporting issue evidence. It must request information without inventing a category, priority, customer, or severity. These examples illustrate the policy, but they do not replace it.

Sources:

- <https://developers.openai.com/api/docs/guides/structured-outputs>

## Narration: Repaired Offline Verifier Narration

A complete result must match the exact fixture input, status, category, priority, summary, evidence, next_action, and reasons. An invented refund summary, an empty reasons array, and an unsupported defamatory reason are therefore rejected rather than authorized. The reasons check now requires at least one nonempty string for every status. The refusal and needs_information branches still enforce their cross-field rules, and incomplete or refused results remain blocked at authorization. The original malformed, duplicate-key, type, extra-field, source, category, priority, and action cases remain present. The semantic checks are intentionally fixture-bound. They demonstrate validation of this fictional contract and do not validate arbitrary natural-language claims, determine whether a customer statement is true, or establish model or provider behavior. New or paraphrased inputs, including the independent exercise, require human verification rather than automated acceptance. For provider documentation about structured outputs, see https://developers.openai.com/api/docs/guides/structured-outputs and https://ai.google.dev/gemini-api/docs/structured-output. The self-test compares complete result objects for the patched cases, including the new summary and reasons negatives. Save the code as verifier.py and run it with Python to perform the self-test.

Sources:

- <https://developers.openai.com/api/docs/guides/structured-outputs>

## Narration: Independent Task Narration

Before viewing feedback, produce one contract-compliant output for the changed synthetic input below and a short decision trace. Keep the task and answer separate. Copy evidence exactly if you use it, represent unsupported values explicitly, and decide whether a downstream action is authorized. Submit your answer before opening the feedback section. This changed input is not one of the authored automatic fixtures, so it requires human verification and must not be treated as an automated acceptance case.

Sources:

- <https://developers.openai.com/api/docs/guides/structured-outputs>

## Learner Prompt: Independent Contract Prompt

Before viewing feedback, produce one contract-compliant output for the changed synthetic input below and a short decision trace. Keep the task and answer separate. Copy evidence exactly if you use it, represent unsupported values explicitly, and decide whether a downstream action is authorized.

Learner action: Work independently. Return one contract-compliant output and a short decision trace. Do not reveal or infer an answer key from this task.

## Narration: Independent Feedback Narration

A suitable answer preserves uncertainty because the changed message contains two distinct issue signals. The result is not eligible for downstream drafting under the bounded policy. This answer is a review reference for the exercise, not an automated acceptance rule for arbitrary new text. The decision trace is parsing pass, shape pass, source pass, business pass for the needs_information branch, and authorization blocked. The quoted evidence is copied exactly from the supplied input. Human review is still required for this new or paraphrased case.

Sources:

- <https://developers.openai.com/api/docs/guides/structured-outputs>

## Transition: Activity Transition

Open the output-contract activity. Choose issue triage, meeting extraction, product comparison, or another recurring task. Define purpose, consumer, required fields, allowed values, evidence, unknown handling, ordering, and validation. Create a normal example, a boundary example, and a missing-information example tied to an explicit rule. Then review a sample response twice: first for parsing and schema, then for factual support, business consistency, consequences, and authority. Save the contract, three examples, and the two-part checklist.

Sources:

- <https://developers.openai.com/api/docs/guides/structured-outputs>

## Pause: Activity Work Time

## Assessment Handoff: Assessment Handoff

When you are ready, begin the knowledge check. You will choose varied examples, identify output-contract elements, distinguish valid JSON from schema and content validity, handle refusals or incomplete output, and diagnose evidence failure inside a schema-valid response. Review the class or activity before submitting. The assessment opens only when you choose Begin knowledge check.

## Closing: Class Closing

Keep the layers separate: examples illustrate a rule, contracts define a usable shape, parsers and schemas test structure, and accountable validation tests truth, consequences, and authority.
