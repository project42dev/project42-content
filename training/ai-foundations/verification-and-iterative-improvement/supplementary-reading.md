# Verification Is a Design Decision

Verification is not a final inspection that you add after an answer is complete. It is part of designing the task. Before asking whether an answer is “correct,” decide what kind of claim the answer will make, how quickly that claim could change, and what would happen if it were wrong.

A **claim** is a statement that could be checked. For example:

- “The meeting is on Tuesday.”
- “This process has three stages.”
- “The policy requires manager approval.”
- “This recommendation will reduce costs.”
- “The attached table contains 42 records.”

These claims do not all need the same kind of verification. A stable definition from a trusted reference may need only a quick comparison. A current policy, price, deadline, or statistic needs a recent source. A claim that could affect safety, money, legal compliance, or someone’s access should receive stronger review than a low-consequence wording suggestion.

## Use one claim-type vocabulary

For this module, use six claim types:

- **Fact:** A statement presented as directly true, such as an event location.
- **Interpretation:** An explanation of what evidence may mean.
- **Calculation:** A result produced from stated inputs and a method.
- **Prediction:** A statement about what may happen in the future.
- **Recommendation:** Advice about what someone should do.
- **Summary:** A condensed account of supplied information.

A schedule is usually a **fact**: “The event opens at 10:00.” A sentence can contain more than one type. For example, “The event opens at 10:00, so arrive early” contains a fact and a recommendation. Split them before checking them.

When an interpretation is needed, make its status visible in the wording. For example:

- Evidence: “The note says volunteers have limited capacity.”
- Interpretation: “This may mean visitors could experience a queue.”
- Recommendation: “Visitors should allow extra time.”

The labels do not have to appear in the final public message. They are useful in a claim table or review notes. In the final message, careful wording such as “may,” “suggests,” or “based on the supplied note” can show that a statement is an interpretation rather than a confirmed fact.

## Match effort to risk

A useful starting point is to assess each claim along three dimensions:

1. **Claim type:** What kind of statement is it?
2. **Volatility:** How likely is it to change? A historical date is usually stable. A schedule, price, or policy may change quickly.
3. **Consequence:** What is the cost of acting on an incorrect claim?

The combination determines verification strength. A stable, low-consequence fact might need one nearby source. A volatile, high-consequence claim may require a current primary source, an explicit date, a repeatable calculation, and a second-person review.

Do not confuse confidence with evidence. A fluent answer can sound certain without being well supported. Verification asks, “What would let another person check this claim?” It does not ask, “Does this answer sound reasonable?”

## Keep evidence close to the claim

Evidence is most useful when it sits near the statement it supports. If a paragraph contains five claims and has one citation at the end, the reader may not know which claims the citation supports. A better structure is to separate the claims, attach the relevant evidence to each one, and identify whether the statement is a fact, interpretation, calculation, prediction, recommendation, or summary.

A practical claim record can include:

- the exact claim;
- its type;
- its volatility;
- its consequence if wrong;
- the nearest supporting evidence;
- its verification status;
- the reviewer or next action.

If a sentence cannot be connected to a source, calculation, observation, or supplied record, it may need to be softened, removed, or investigated. “The records show…” reports evidence. “This probably means…” offers an interpretation. Neither should be presented as a confirmed fact without suitable support.

## Diagnose the whole workflow

When an answer misses the mark, blaming the model is often too early. The failure may have entered at several points:

- **Task:** The request was ambiguous or asked for an impossible level of certainty.
- **Context:** Important definitions, source material, audience information, or constraints were missing or misused.
- **Prompt:** The instructions did not specify the desired format, evidence standard, or handling of uncertainty.
- **Model:** The system misunderstood, omitted, or invented information despite adequate instructions.
- **Tool or source:** A search result, calculation, extraction, or connected source was incomplete or outdated.
- **Review:** The output was not tested against representative cases, or the reviewer accepted fluent wording as proof.

These layers can interact. For example, a model may combine a planning-meeting date with an event date and invent a publication date. The immediate error is a model failure to keep source claims separate. If a reviewer had the references but did not catch it, the review process also failed. Record the primary cause and any contributing cause rather than treating the categories as mutually exclusive.

## Compare versions, not impressions

Prompt improvement works best as a small experiment. Keep a set of representative cases that includes ordinary examples, edge cases, ambiguous requests, conflicting information, and cases where the correct response is to ask a question or decline to guess. Run the original prompt and the revised prompt against the same cases. Compare the results using the same criteria.

Change one meaningful instruction at a time when possible. Record what changed, which cases improved, which regressed, and what new failure modes appeared. A prompt that improves one example but harms three common cases is not an improvement.

The goal is not to make every answer longer or more cautious. The goal is to make the system reliably produce the right kind of answer for the task: supported when it should be supported, qualified when uncertainty matters, and concise when the claim is simple and low risk.

---