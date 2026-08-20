# Lab: Build a Reliable Event Brief

## Objective

Create a short event brief using selected text and visual information while practicing:

- Choosing relevant context instead of supplying everything available
- Checking the quality and accessibility of multimodal inputs
- Handling source boundaries and conflicting information
- Preserving important information outside a long conversation

## Prerequisites

- Access to an AI assistant that accepts text and images
- A text editor
- One fictional or non-sensitive event flyer or screenshot
- Three short text sources, such as:
  - An approved event announcement
  - A venue or logistics note
  - An unrelated background note
- A way to save your final brief and handoff notes

Do not upload private, confidential, or sensitive information.

## Instructions

### 1. Define the task and boundaries

Write this task statement in a text file:

> Create a 150-word event brief for a first-time attendee. Use the approved announcement for event name, date, and purpose. Use the logistics note only for accessibility and arrival information. Treat the background note as out of scope. If sources conflict, identify the conflict rather than guessing.

List the expected output fields:

- Event name
- Date and time
- Location
- Purpose
- Arrival information
- Accessibility information
- One unresolved question, if needed

Label the sources:

| Source label | Use |
|---|---|
| `approved-announcement` | Event name, date, and purpose |
| `logistics-note` | Accessibility and arrival information |
| `background-note` | Out of scope; do not use |

**If this step fails:** If the task feels too broad, reduce it to one audience and one output. If you cannot identify source boundaries, label each source as `approved-announcement`, `logistics-note`, or `background-note` before continuing. If a source seems to fit more than one category, record the ambiguity and exclude it until the boundary is resolved.

### 2. Inspect the source material

Read the three text sources and inspect the flyer. Record only relevant facts in this table:

| Required field | Fact or value | Source label | Exact wording or visual description | Status | Confidence |
|---|---|---|---|---|---|
| Event name |  |  |  | confirmed / conflicting / missing | high / medium / low |
| Date and time |  |  |  | confirmed / conflicting / missing | high / medium / low |
| Location |  |  |  | confirmed / conflicting / missing | high / medium / low |
| Purpose |  |  |  | confirmed / conflicting / missing | high / medium / low |
| Arrival information |  |  |  | confirmed / conflicting / missing | high / medium / low |
| Accessibility information |  |  |  | confirmed / conflicting / missing | high / medium / low |

When a source provides only part of a field, record the parts separately. For example, do not mark “date and time” as confirmed if only the date is clear. Record the date as confirmed and the time as missing or conflicting.

**If this step fails:** If the flyer is blurry, cropped, rotated, or too small to read, obtain a clearer copy or transcribe the visible text manually. Mark any unreadable field as unknown; do not fill it in from memory. If two sources disagree, create separate rows or mark the field `conflicting` rather than choosing one silently.

### 3. Check the multimodal input

Before using the flyer, check:

- Is all important text visible?
- Are dates, times, and addresses readable?
- Are colors or symbols carrying essential meaning?
- Is there an accessible text description?
- Could a person using a screen reader understand the same information?

Write a two- or three-sentence description of the flyer. Include any uncertainty and identify which details came from the image.

**If this step fails:** If the image contains essential information with no text equivalent, create a transcription or detailed description. If the image and transcription disagree, preserve both versions and flag the disagreement for review. If the AI assistant cannot accept the image, use the transcription and description instead.

### 4. Select a compact context and request a structured output

Prepare a prompt using this template:

> **Task:** Create a 150-word event brief for a first-time attendee.  
>
> **Required fields:** Event name; date and time; location; purpose; arrival information; accessibility information; one unresolved question if needed.  
>
> **Allowed sources and boundaries:**  
> - Use `approved-announcement` only for event name, date, and purpose.  
> - Use `logistics-note` only for accessibility and arrival information.  
> - Do not use `background-note`.  
> - If sources conflict, show the conflict instead of guessing.  
> - If information is missing, write “not provided.”  
>
> **Selected facts:** Paste the relevant rows from the fact table.  
>
> **Flyer evidence:** Attach the flyer or paste its accessible description and transcription.  
>
> **Output format:**  
> 1. `Event brief` — approximately 150 words.  
> 2. `Verification notes` — a table with columns `Brief claim`, `Source label`, `Supported wording`, and `Status`.  
> 3. `Unresolved questions` — list conflicts or missing information, or write `None`.

Do not include the unrelated background note.

**If this step fails:** If the assistant cannot access the image, provide the transcription and description instead. If the response does not use the requested headings, send a follow-up instruction: “Reformat the existing answer into exactly the three headings Event brief, Verification notes, and Unresolved questions. Do not add new facts.” If the assistant uses the out-of-scope source, repeat the source boundary and remove that source from the prompt. If it invents a missing detail, ask it to replace the detail with “not provided.”

### 5. Test the result

Check the response against the original sources.

Verify that:

- Every date, time, and location is supported
- Each required field has the correct source boundary
- The brief is close to 150 words
- The event audience can understand it
- Accessibility information is not omitted
- Uncertainty is visible
- No out-of-scope information appears
- Each verification note matches the exact claim in the brief

Compare values, not just source names. A source label alone does not prove that the claim is correct.

**If this step fails:** If a fact cannot be verified, remove it or label it unresolved. If only part of a fact is supported, split the claim or remove the unsupported part. If the brief is too long, ask for a shorter version without removing required fields. If the answer hides a disagreement, ask for a source-by-source comparison. If the verification table does not match the brief, request a regenerated table based only on the final brief, then check it yourself.

### 6. Create a handoff record

Save a file containing:

- The final approved brief
- Source names and boundaries
- Confirmed facts
- Conflicting or unresolved questions
- Decisions made during the lab
- The next action
- The date or version of the source materials, if available

Start a new conversation, provide only the handoff record and the task, and ask the assistant to continue. Compare the new response with the approved brief and record.

**If this step fails:** If the new conversation changes a confirmed fact, compare it with the handoff record and correct the response. If the handoff is too long, shorten it into facts, constraints, uncertainties, source labels, and next actions rather than copying the entire conversation. If the new assistant cannot interpret the handoff, rewrite it as a small table with one fact per row.

## Expected output

Submit:

1. A source-and-fact table
2. An accessible description or transcription of the flyer
3. The compact prompt or context plan
4. A 150-word event brief with verification notes
5. A handoff record for continuing the work later

## Troubleshooting

- **The assistant gives a generic brief:** Add the required fields and provide the selected facts in a compact table.
- **The assistant treats guesses as facts:** Require “not provided” for missing information and request source labels for every claim.
- **The assistant misses image details:** Supply a clearer image and a text description; do not rely on visual interpretation alone.
- **The assistant mixes sources:** Label each source and state which sources are allowed for each field.
- **The assistant produces the wrong format:** Provide the output template and request reformatting without adding facts.
- **A field is partly supported:** Split it into smaller claims and mark each claim separately.
- **The conversation becomes unwieldy:** Save a handoff summary, start a new conversation, and provide only the information needed to continue.

---