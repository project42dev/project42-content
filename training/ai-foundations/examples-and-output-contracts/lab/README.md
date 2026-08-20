# Lab: Build and Test a Support-Triage Output Contract

## Objective

Create an output contract for a support-message classifier, write examples that demonstrate the governing rule, and validate sample responses for:

- requested formatting;
- valid JSON;
- schema shape and types;
- content correctness;
- uncertainty and edge cases.

You will also decide whether your edge-case tests reveal a gap that requires revising the contract.

## Prerequisites

- Basic familiarity with JSON objects and arrays.
- A plain-text editor.
- The ability to copy, edit, and compare text.
- No programming experience is required.

## Scenario

A support team wants to classify incoming messages. The result must help a human decide what to do next.

Use these governing rules:

- `high`: the issue blocks essential work for multiple people, or there is a credible security or safety concern.
- `medium`: the issue seriously affects one person or has no practical workaround, but it is not a broad outage or safety concern.
- `low`: the issue is informational, cosmetic, intermittent with a workaround, or a request for guidance.
- If the message does not contain enough information to classify safely, use `unknown`.
- A credible security or safety concern takes precedence over ordinary severity categories.
- Do not infer priority from an angry or polite tone.

## Steps

### 1. Write the contract in human-readable form

Create a note containing these requirements:

- The output is one JSON object.
- Required fields are `priority`, `reason`, and `next_action`.
- `priority` must be one of `high`, `medium`, `low`, or `unknown`.
- `reason` must be a string of no more than 25 words.
- `next_action` must be a string.
- Do not include additional fields.
- Use `unknown` when the message lacks enough information.
- If a security or safety concern is credible, do not downgrade it because another detail seems minor.

**If this step fails:** Return to the scenario rules and separate decision rules from presentation preferences. Include requirements that affect interpretation, downstream use, or safe handling. If two rules could conflict, write down which rule takes precedence.

### 2. Separate formatting from structure

Add two notes beneath the contract:

- Formatting preference: keep the JSON compact and place fields in the order `priority`, `reason`, `next_action`.
- Structural requirement: the response must parse as one JSON object with the required fields and allowed value types.

Explain in one sentence why field order is less important to a parser than valid JSON and required fields.

**If this step fails:** Ask whether a parser would reject the response. Field order may be a presentation preference; invalid JSON, a missing required field, or a wrong value type is a structural failure.

### 3. Create three governing examples

Write three input-and-output examples. Each output must follow your contract.

Use these inputs:

1. “The payment service is unavailable for every department, and customers cannot complete purchases.”
2. “The dashboard is slow for me, but refreshing usually works.”
3. “Please help. Something is wrong.”

For each example, make the reason identify the rule that led to the priority. Do not mention tone as evidence.

**If this step fails:** Check that the reason names facts from the input and connects them to a governing rule. If the third example lacks enough information, use `unknown` rather than guessing.

### 4. Add boundary examples and explain the contrast

Create two more examples:

1. “I am furious that the button color changed.”
2. “One employee cannot sign in, and there is no workaround.”

The first should show that emotional tone does not determine priority. The second should show why a serious individual problem is different from the broad outage in Example 1.

Under the second example, write two or three sentences explaining:

- it affects one employee rather than multiple departments;
- there is no workaround, so it is more serious than the dashboard example;
- it is not `high` under the stated rule unless additional facts indicate a broad outage or security or safety concern.

**If this step fails:** Remove emotional words from your reasoning and classify based on the facts. Compare the number of affected people, the presence of a workaround, and any security or safety concern.

### 5. Define a machine-readable shape

Represent the contract as a table in your notes. Use this template:

| Property | Type | Required? | Allowed values | Maximum words | Extra notes |
|---|---|---:|---|---:|---|
| `priority` |  |  |  | — |  |
| `reason` |  |  |  |  |  |
| `next_action` |  |  |  | — |  |

Add one separate row or note stating:

- Top-level value: object.
- Additional properties: not permitted.
- Missing or ambiguous classification: use `unknown`.

Your table is successful when another person can determine the required fields, types, allowed priority values, length limit, and extra-property rule without interpreting vague phrases.

**If this step fails:** Complete the table one property at a time. First write the exact property name, then its type, then whether it is required, then its allowed values or limits. Compare every entry with the human-readable contract and remove constraints that were never stated.

### 6. Test structural parsing

Evaluate these candidate responses:

**Candidate A**

{"priority":"high","reason":"A broad outage blocks purchases.","next_action":"Escalate to the incident owner."}

**Candidate B**

Here is the result:
{"priority":"low","reason":"A workaround exists.","next_action":"Ask the user to refresh."}

**Candidate C**

{"priority":"urgent","reason":"Many users are affected.","next_action":"Escalate."}

Record whether each complete response is valid JSON. Do not yet decide whether the content is correct.

**If this step fails:** Parse the complete response, not just the JSON-looking portion. Check quotation marks, commas, braces, and whether the response contains exactly one JSON value. Surrounding commentary causes Candidate B to fail a one-value JSON contract.

### 7. Test the contract after parsing

For every candidate that parses, check:

- Is the top-level value an object?
- Are all required properties present?
- Are the values strings where required?
- Is `priority` an allowed value?
- Is `reason` within the word limit?
- Are extra properties present?

Record each failure separately.

**If this step fails:** Do not stop after finding the first problem. Structural validation is a checklist. A response can be valid JSON and still fail because its priority value is not allowed or because a required field is missing.

### 8. Perform content validation

Write two additional candidate responses that are structurally valid but substantively wrong. For example:

- classify the broad payment outage as `low`;
- claim that a workaround exists when the input does not mention one.

For each response, explain why structural validation alone would not catch the error. Compare the `reason` directly with the facts in the input:

1. List the facts stated in the input.
2. List the claims made in the reason.
3. Mark any claim that is unsupported or contradicts the input.
4. Record the content-validation result.

**If this step fails:** Check meaning, not just field names and types. Required fields do not guarantee truthful content. A reason must be supported by the original message and the governing rules.

### 9. Test edge cases and revise the contract if needed

Evaluate your contract against these inputs:

- an empty message;
- a message that says “It affects everyone” but gives no description;
- a very long message containing several unrelated issues;
- a message that contains both a workaround and a security concern.

For each case, record:

- expected priority;
- reason the label is appropriate;
- what `next_action` should request or communicate;
- whether the current contract handles the case clearly.

Then answer:

> Did any edge case expose a gap, conflict, or unclear fallback rule? If yes, revise the human-readable contract and the machine-readable table, and explain what changed.

Apply the stated precedence rule when a security or safety concern conflicts with ordinary severity. Use `unknown` when the evidence does not support a safe decision.

**If this step fails:** Separate facts from assumptions. For an empty or underspecified message, use `unknown` and request more information. For multiple issues, state which issue controls the priority or revise the contract to explain that the highest applicable safety or security concern takes precedence.

## Expected output

Your completed notes should contain:

1. A human-readable contract, including an uncertainty and precedence rule.
2. A distinction between formatting and structural requirements.
3. Five examples, including clear, counterexample, uncertainty, and boundary cases.
4. A machine-readable table describing the output shape.
5. A parsing and structural-validation table.
6. Two content-validation failures with fact-by-fact comparisons.
7. An edge-case test table with expected handling.
8. A statement about whether edge cases required revising the contract, plus the revised contract if necessary.

A strong result makes it possible for another person to decide whether a response is correctly shaped and correctly reasoned.

## Troubleshooting

- **The response contains valid JSON plus an explanation:** Treat the complete response as failing a one-value JSON contract. Request only the JSON object.
- **The JSON parses but the priority is not allowed:** The response is structurally parseable but contract-invalid. Use a permitted value or revise the contract deliberately.
- **The fields are present but the reason is unsupported:** Mark content validation as failed. Compare each claim with the input facts.
- **Examples all look nearly identical:** Vary the facts while preserving the rule. Add a counterexample and an uncertainty case.
- **You are unsure whether a field is required:** Ask what the downstream reader needs to make the next decision. Require only information that serves that purpose.
- **A message matches multiple categories:** Apply the stated security and safety precedence rule. If no safe precedence rule applies, use `unknown` and request clarification.
- **An edge case reveals that the contract has no clear answer:** Revise the contract rather than silently inventing a classification rule. Update both the human-readable notes and the machine-readable table.

---