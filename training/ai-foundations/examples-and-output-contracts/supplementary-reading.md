# Examples and Output Contracts

Examples are one of the most useful ways to guide an AI system, but they are also easy to misuse. An example shows what one answer looked like. It does not automatically explain why that answer was correct. If the governing rule is missing, a model may copy the surface pattern while missing the intended behavior.

Suppose you want an assistant to classify customer messages by priority. A simple example might show:

> “The service is down for every user” → `high`

That example is helpful, but it leaves important questions unanswered. Is every service problem high priority? What if only one person is affected? What if the message sounds angry but describes a minor issue? What if the message does not contain enough information to decide?

A stronger example set makes the decision rule visible:

- Choose `high` when an issue blocks essential work for multiple people or raises a credible security or safety concern.
- Choose `medium` when one person is seriously affected and has no practical workaround.
- Choose `low` for informational, cosmetic, or workable problems.
- Choose `unknown` when the available information is not enough to classify safely.
- Do not infer priority from tone alone.

The examples then demonstrate the rule rather than replacing it. This is the same idea whether your labels are `high`, `medium`, `low`, and `unknown`, or a simpler pair such as `urgent` and `not urgent`. The labels may change, but the need for an explicit rule does not.

## Examples should earn their place

An example is valuable when it clarifies a decision, a transformation, or a constraint. Before adding one, ask: “What behavior does this example teach?” If you cannot answer, the example may be decorative rather than instructional.

Examples can accidentally hide requirements. If every sample output contains short sentences, a learner may conclude that brevity is mandatory even when the actual rule is only “include the requested facts.” If every example contains three items, a learner may infer that every answer must contain exactly three items.

Vary unimportant details while preserving the governing rule. Change names, wording, dates, and order when those differences should not affect the result. Keep the important property consistent. This helps separate the rule from the accidental appearance of one sample.

Useful example sets often include:

- a clear case that obviously follows the rule;
- a counterexample that looks similar but should receive a different result;
- a boundary case where two labels might seem plausible;
- an uncertainty case that demonstrates when not to guess.

The uncertainty example is especially important. It teaches the system what to do when evidence is missing, rather than encouraging it to invent a confident answer.

## Three levels of output requirements

Output instructions are not all equally strict.

A **formatting request** describes appearance or organization in ordinary language. “Use bullet points,” “start with a short summary,” or “put the fields in this order” gives a presentation target. It may help a person read the answer, but a parser might not care about it.

**Valid JSON** is a structural requirement. JSON has rules about quotation marks, commas, braces, arrays, and values. Text that looks organized is not necessarily JSON. A response can contain the right information and still fail to parse because of a trailing comma, an unquoted key, or an explanation outside the JSON value.

A **schema-constrained output** adds stronger requirements about the shape and meaning of the data. A contract may require a top-level object, specific property names, particular data types, allowed values, maximum lengths, and no additional properties. Valid JSON can still fail the schema. For example:

{"priority":3}

is valid JSON, but it fails a contract that requires `priority` to be one of the strings `"low"`, `"medium"`, or `"high"` and also requires a `reason` field.

These levels solve different problems. Formatting helps people read an answer. JSON helps software parse it. A schema helps software determine whether the parsed data has the expected shape and meaning.

## A contract should describe success and uncertainty

An output contract is a shared agreement between the requester, the AI system, and whoever uses the result. A human-readable contract might say:

> Return one priority label, one short reason, and one recommended action. Use only the labels `high`, `medium`, `low`, or `unknown`. Use `unknown` when the message does not contain enough information to classify safely.

The fallback rule is not an optional extra. A contract is incomplete if it explains only how to handle clear inputs and says nothing about missing, conflicting, or ambiguous information. Without a fallback, the system may guess simply because it must return one of the normal labels.

A useful contract identifies required fields, allowed values, data types, and limits that matter. It should also explain how to handle uncertainty and conflicting signals. Every requirement should serve a real reader, decision, or downstream process. Do not add restrictions merely because they look formal.

## Parsing is not the end of validation

Validation happens in stages. First, determine whether the response can be parsed as the requested structure. If JSON parsing fails, structural validation cannot begin. After parsing succeeds, check the contract: required fields, allowed values, types, length limits, and extra fields.

Then perform **content validation**. A response may have the correct shape but still make a false claim, omit an important qualification, misclassify an edge case, or recommend an unsafe action.

A simple beginner technique is to compare the `reason` field directly with the facts in the input message:

1. Underline the facts stated in the input.
2. Read the output’s reason.
3. Check whether every claim in the reason is supported by an explicit fact or a stated governing rule.
4. Mark the response as a content failure if the reason introduces an unsupported fact.

For example, if the input says, “The dashboard is slow, but refreshing works,” a reason saying “The issue blocks all users” is not supported. The fields may be present and correctly typed, but the content is wrong.

Finally, test edge cases: empty input, missing information, conflicting clues, unusually long text, and values at the boundary of an allowed range. If an edge case exposes a gap in the contract, revise the contract. Good validation does not merely find failures; it improves the agreement that defines success.

---