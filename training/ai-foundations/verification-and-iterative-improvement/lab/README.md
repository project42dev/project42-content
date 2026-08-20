# Lab: Build and Test a Verified Briefing

## Objective

Create a short public briefing from a supplied scenario while:

- matching verification strength to claim type, volatility, and consequence;
- decomposing the briefing into individual claims;
- attaching the nearest practical evidence to each claim;
- diagnosing the source of a response failure;
- comparing two prompt versions against representative cases.

## Prerequisites

- A text editor or document editor.
- The ability to copy, label, and compare text.
- No external software or coding knowledge is required.
- Use only the case packets supplied in this lab. Do not add facts from memory or outside sources.

## Shared claim types

Use this vocabulary throughout the lab:

- **Fact:** directly stated information.
- **Interpretation:** an explanation of what evidence may mean.
- **Calculation:** a result derived from inputs and a method.
- **Prediction:** a statement about what may happen.
- **Recommendation:** advice about what someone should do.
- **Summary:** a shortened account of supplied information.

A schedule or event time is classified as a **fact**, not as a separate claim type.

## Case packet

A community center is preparing a public notice.

**Reference A — Event record**

> Event: Neighborhood Repair Café  
> Date: 14 September  
> Opening time: 10:00  
> Closing time: 14:00  
> Location: North Hall  
> Registration: Not required  
> The event is free.  
> Visitors may bring small household items for volunteer repair.  
> Volunteers cannot accept hazardous materials or large appliances.

**Reference B — Draft internal note**

> The center usually posts public notices about one week before an event.  
> The next staff planning meeting is on 5 September.  
> The repair volunteers have limited capacity, so visitors should expect a queue.

**Reference C — Deliberately flawed generated response**

> The free Neighborhood Repair Café will take place on Saturday, 14 September, from 10:00 to 14:00 in North Hall. Visitors should register online in advance and can bring any broken household appliance. The center expects more than 100 visitors, so the event may reach capacity. Staff will publish the notice on 5 September.

The final sentence incorrectly turns the planning-meeting date in Reference B into a publication date. The packet does not say that staff will publish the notice on 5 September. This is a source-use or context-confusion error in the response. If a reviewer had the packet and failed to catch it, the review process also contributed.

## Steps

### 1. Define the task

Write a one-sentence task statement for the briefing. Specify the audience, purpose, length, source restrictions, and acceptable uncertainty.

**If this step fails:** If your statement includes several purposes, separate them into two sentences. If the audience is unclear, choose one audience and record the assumption. If you cannot state what to do with unsupported claims, add “Do not present unsupported claims as facts.”

**Expected output:** For example:

> Write a 100-word public notice for neighborhood residents using only the case packet, and do not present unsupported attendance or capacity claims as facts.

### 2. Decompose the flawed response into claims

Copy the flawed response and number every independently checkable claim. Split compound sentences when necessary.

**If this step fails:** Look for dates, times, places, requirements, quantities, predictions, recommendations, and restrictions. Separate facts from predictions and recommendations. For example, “The event may reach capacity” is separate from “The center expects more than 100 visitors.”

**Expected output:** At least ten claims, including claims about the event name, cost, date, time, location, registration, acceptable items, attendance, capacity, and publication timing.

### 3. Classify and risk-rank the claims

Create a table with these columns:

| Claim | Type | Volatility | Consequence if wrong | Verification strength |
|---|---|---|---|---|

Use:

- **Type:** fact, interpretation, calculation, prediction, recommendation, or summary.
- **Volatility:** low, medium, or high.
- **Consequence:** low, medium, or high.
- **Verification strength:** light check, direct source check, or direct source check plus review.

**If this step fails:** Treat event details, registration requirements, and prohibited-item guidance as higher priority than descriptive wording. Treat unsupported visitor numbers as a prediction, not a fact. When uncertain between two ratings, choose the higher verification level and explain why.

**Expected output:** Date, time, location, cost, registration status, acceptable items, and restrictions are checked directly against Reference A. Attendance and capacity claims are marked unsupported. The 5 September publication claim is also unsupported; the source only states that a planning meeting occurs on that date.

### 4. Attach the nearest evidence

For each claim, record the closest supporting text from Reference A, B, or C. Use “No support in packet” when appropriate.

**If this step fails:** Do not use the existence of a claim in Reference C as evidence that the claim is true. If a source supports only part of a claim, split the claim or mark the unsupported part. Keep the planning-meeting date and any publication claim as separate claims.

**Expected output:** A claim-evidence table in which every factual claim has a source or an explicit unsupported status.

### 5. Produce a corrected briefing

Write a public notice of no more than 100 words. Use only supported facts. You may include the queue warning from Reference B, but label it clearly as an expectation rather than a guarantee. Do not include the unsupported visitor count, capacity claim, online registration, or publication date as confirmed facts.

Before submitting, check every sentence against the claim table. Confirm that dates, times, requirements, and item restrictions match the references.

**If this step fails:** First compare every sentence with the claim table and correct or remove any factual error, including a reversed registration requirement or an incorrect date. Remove unsupported claims or rewrite them as clearly labeled uncertainty. If the notice exceeds 100 words, remove repetition before removing evidence labels. If a claim cannot be checked, leave it out rather than guessing.

**Expected output:** A concise notice containing the event name, date, time, location, free admission, no-registration detail, acceptable item guidance, and relevant limitations.

### 6. Diagnose the flawed response

For each error in the generated response, assign the most likely failure layer:

- task;
- context;
- prompt;
- model;
- tool or source;
- review process.

Give one sentence of justification. You may identify a primary cause and a contributing cause.

**If this step fails:** Ask what information was available and whether the response kept source claims separate. If the correct information was present in Reference A but contradicted in the response, classify the primary miss as model or review. If the response turns the 5 September planning-meeting date into a publication date, classify the primary miss as model/source-use or context-confusion, and identify review as a contributing cause if appropriate. If information was absent, classify the problem as context or task ambiguity rather than assuming the model could know it.

**Expected output:** For example:

> Online registration: model or review miss; Reference A explicitly says registration is not required.  
> Publication on 5 September: model source-use error; Reference B gives a planning-meeting date, not a publication date. A review should also have caught the unsupported conversion.

### 7. Create two prompt versions

Write:

- **Prompt V1:** a basic instruction to write the notice.
- **Prompt V2:** the same instruction plus claim decomposition, source restriction, uncertainty handling, and a final evidence check.

Keep the audience, purpose, case packet, and word limit identical in both prompts.

**If this step fails:** Remove unrelated changes from V2. It should improve verification instructions, not introduce a new audience or a different writing goal. State what the response should do when information is missing or conflicting.

**Expected output:** V2 explicitly says to use only supplied references, avoid unsupported claims, distinguish facts from interpretations and predictions, ask for clarification when needed, and check each factual statement before finalizing.

### 8. Test representative cases

Use these four precisely defined packets with both prompts:

1. **Complete packet:** The supplied event packet, unchanged.
2. **Missing-location packet:** Reference A contains the event name, date, times, cost, registration status, item guidance, and restrictions, but the location line is removed. References B and C are not included.
3. **Conflicting-time packet:** Reference A states an opening time of 10:00 and a closing time of 14:00. A second supplied record states a closing time of 16:00. No source is identified as more current.
4. **Missing-registration packet:** Reference A contains the event name, date, times, cost, location, item guidance, and restrictions, but contains no registration statement. No other source mentions registration.

For each response, record whether it:

- uses only supplied facts;
- asks for clarification when a required detail is missing or conflicting;
- labels uncertainty;
- preserves important restrictions;
- avoids inventing numbers or requirements;
- accurately reports whether registration is known.

For Case 4, score “registration status accurately reported” as successful if the response says registration information is not supplied, asks the organizer to confirm, or omits a registration claim while clearly avoiding an assertion that registration is or is not required. Do not require the response to say that registration is unnecessary.

**If this step fails:** If a response cannot be judged, mark it “insufficient information” and state what evidence would make it judgeable. If a prompt asserts a missing detail, mark that as an invented claim even if the rest of the notice is accurate. If the two closing times conflict, do not treat either time as confirmed without clarification.

**Expected output:** A comparison table such as:

| Case | Version | Supplied facts only | Clarifies missing/conflicting data | Labels uncertainty | Preserves restrictions | Registration status handled correctly | Notes |
|---|---|---:|---:|---:|---:|---:|---|

Use “yes,” “no,” or “not applicable,” with a short note for each no.

### 9. Select the better version

Use the Step 8 criteria as six scored behaviors:

1. uses only supplied facts;
2. clarifies missing or conflicting information;
3. labels uncertainty;
4. preserves important restrictions;
5. avoids invented numbers or requirements;
6. handles registration status accurately.

Give each behavior one point when successful. A behavior is worth one point only; do not count one error twice. Then apply a safety rule: any unsupported access requirement, prohibited-item instruction, or other high-consequence error is a serious failure even if the total score is high.

Write a short conclusion:

- Which prompt performed better overall?
- On which case did it fail?
- What single revision would you test next?
- What evidence would count as improvement?

**If this step fails:** Do not choose based on fluency or length. Use the same scoring method for both versions. If scores tie, prefer the version with fewer serious failures, then identify another revision to test. Do not claim improvement from one successful case alone.

**Expected output:** A conclusion that reports the scores, identifies regressions, and proposes one testable change, such as adding a specific instruction to ask for clarification when two supplied values conflict.

## Final submission

Submit:

1. the claim table;
2. the corrected briefing;
3. the failure diagnosis;
4. Prompt V1 and Prompt V2;
5. the four-case comparison;
6. the scores and next-change recommendation.

---