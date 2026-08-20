# Lab: Turn an Ambiguous Request into a Reusable Prompt

## Objective

Transform an unclear workplace request into a reusable prompt with:

- A clear purpose and audience
- Identified inputs and placeholders
- Explicit instructions
- Hard requirements separated from preferences
- A defined deliverable
- Observable success criteria
- A missing-information rule
- A verification step
- A test and revision

## Prerequisites

- Access to an AI assistant or a text editor
- Basic ability to copy and edit text
- Either:
  - permission to use a short, non-sensitive document, or
  - the fictional notes supplied below

Do not paste confidential, personal, or restricted information into an AI assistant unless your organization explicitly permits it.

If you do not have suitable notes or permission, use this fictional dataset:

Weekly website project meeting — 6 May

The team agreed to move the homepage review to 14 May.
Mina will prepare three revised headline options.
The notes do not state when Mina's work is due.
Jordan reported that the accessibility test found two contrast issues.
The team discussed adding a newsletter sign-up, but no decision was recorded.

## Scenario

A colleague sends this request:

> “Can you clean up these meeting notes and make them useful for the team? Keep it short but don’t leave anything important out. Make it professional.”

The request has a general purpose, but its audience, format, length, and treatment of missing information are unclear.

## Instructions

### 1. Inspect the ambiguous request

Copy the scenario into a text editor. List what is missing under these six headings:

- Purpose
- Inputs
- Instructions
- Constraints
- Deliverable
- Verification

For each heading, write at least one question. Examples include:

- Who will use the result?
- What kind of notes will be supplied each time?
- Should decisions and action items be separated?
- What does “short” mean?
- What should happen when an owner or date is absent?
- How will someone decide whether the result is complete?

**If you cannot find a gap:** Compare the request with all six headings and write a question even if your answer is “not specified.”

### 2. Choose a use case and inputs

Choose one meeting type and one audience, such as a weekly project meeting for the project team. Decide whether you will use your own permitted notes or the fictional notes above.

Write down:

- The intended audience
- The purpose of the output
- The source material supplied on each run
- Details that may be missing from the source

**If you have no suitable document or permission:** Use the fictional notes above. Do not delay the lab while searching for real notes.

### 3. Separate hard requirements from preferences

Create two lists. Make each hard requirement specific enough to inspect.

Example hard requirements:

- The output must contain the headings `Summary`, `Decisions`, `Action items`, and `Open questions`, in that order.
- The Decisions section must include only decisions supported by the supplied notes.
- Each action item must include the action and an `Owner:` field.
- Each action item must include a `Due:` field.
- When an owner or due date is absent from the notes, the corresponding field must say `Not specified`.
- The output must not add facts that are absent from the notes.

Example preferences:

- Prefer plain, professional language.
- Prefer no more than five bullets in the Summary section.

**If you begin with vague items such as “include decisions”:** Rewrite them as observable requirements, for example, “Use a Decisions heading and place each supported decision beneath it.”

### 4. Define the deliverable

Specify the exact output structure. For example:

## Summary
- No more than five bullets

## Decisions
- One bullet per recorded decision

## Action items
- Action — Owner: [name or Not specified] — Due: [date or Not specified]

## Open questions
- Include topics discussed without a recorded decision

Choose a maximum length or count where useful.

**If the structure is vague:** Replace phrases such as “use a good format” with exact headings, field names, ordering, and limits.

### 5. Write observable success criteria

Write four to six checks that can be reviewed against the source notes and the requested format. For example:

- The output begins with `## Summary` and contains all four required headings in the stated order.
- The Summary contains no more than five bullets.
- Each recorded decision is represented under `## Decisions` and is supported by the supplied notes.
- Each action item uses the format `Action — Owner: ... — Due: ...`.
- Every missing owner or due date is shown as `Not specified`, rather than being inferred.
- No claim in the output is unsupported by the supplied notes.

**If a criterion uses “good,” “clear,” or “professional” without a test:** Replace it with a structural, countable, or source-based check.

### 6. Assemble the reusable prompt

Use this template:

Purpose:
[Why this output is needed]

Audience:
[Who will read or use it]

Inputs:
[MEETING NOTES]

Instructions:
1. Read only the supplied meeting notes.
2. Identify recorded decisions, action items, and topics without a recorded decision.
3. Preserve names, dates, and wording accurately.
4. Place each item in the appropriate section.

Hard requirements:
- [Exact requirement]
- [Exact requirement]
- [Exact requirement]

Preferences:
- [Flexible preference]
- [Flexible preference]

Deliverable:
[Exact headings, order, fields, and limits]

Missing-information rule:
If an owner or due date is absent from the notes, write “Not specified.”
Do not infer facts, decisions, owners, or dates.

Verification:
Before responding, check:
- [Observable criterion]
- [Observable criterion]
- [Observable criterion]

Replace meeting-specific details with placeholders such as `[MEETING NOTES]` and `[AUDIENCE]`.

**If the prompt repeats itself:** Keep rules about correctness, format, missing information, and safety. Remove duplicated explanations.

### 7. Test the prompt

Run the prompt with the fictional notes or another permitted, non-sensitive set of notes. Make sure at least one owner or due date is missing.

Compare the output with every success criterion. Record each as **Pass**, **Needs revision**, or **Not applicable**.

**If the response does not use the required format:** State the output contract more forcefully, including: “Your response must begin exactly with `## Summary` and use these headings in this order: ...” Then retest.

**If the assistant invents an owner, date, or decision:** Add “Use only information stated in the notes. If a detail is absent, write `Not specified`; never infer it.” Retest with the same notes.

**If an important item is omitted:** Add an explicit extraction instruction such as, “Scan every sentence and capture every recorded decision and action item, including items in the middle of a paragraph.” Retest.

**If the output is too long:** Add a measurable limit and specify what to prioritize, such as decisions and action items before background discussion. Retest.

**If a criterion cannot be checked:** Rewrite it to identify the required heading, field, count, or source evidence. Then apply the revised criterion to the output.

### 8. Revise and retest

Make at least one revision based on your test. Run the revised prompt with a different short set of notes or change the audience placeholder.

**If the prompt works only with the first notes:** Find fixed names, dates, or meeting details and replace them with placeholders. Retest with the new notes.

**If the second test exposes a conflict:** Resolve it in the prompt. For example, state whether the summary limit takes priority over background details.

## Expected output

Submit:

1. An anatomy analysis of the original ambiguous request
2. A completed reusable prompt template
3. Four to six observable success criteria
4. One test output
5. A pass/needs-revision review
6. One revised version of the prompt

## Completion check

The lab is complete when another person can supply new notes, understand what information is required, run the template, and judge the result using the success criteria without asking what “good” means.

---