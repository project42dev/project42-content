# Lab: Transform a Research Note into a Public Update

## Objective

Create a short, accessible public update from an approved source note. You will prepare a writing brief, build an evidence trail, transform the note, and review the result for meaning, evidence, voice, accessibility, and disclosure.

## Prerequisites

You need:

- A text editor.
- The files in this lab directory:
  - `source-note.txt`
  - `brief-template.md`
  - `acceptance-checklist.md`
- Basic ability to copy, edit, and save text files.

If the support files are missing, create them using the sample content below.

### Sample source note

Save the following as `source-note.txt`:

Document title: Community Garden Water Study — approved observation note
Document status: Approved for public-summary drafting
Record date: May 20, 2025
Owner: City Horticulture Office

The Community Garden Water Study ran from April 3 through May 12, 2025.
It observed watering practices at three gardens. The study recorded lower
average water use at two gardens after drip lines were installed, but it did
not compare crop yields or establish that drip lines caused the difference.
The observation team included staff from the City Horticulture Office.

The title, status, record date, and owner provide provenance. They help distinguish this approved note from an unconfirmed draft.

## Instructions

### 1. Inspect and authenticate the source

Read the complete source note once without rewriting it. Confirm that it has an approved status, record date, and owner.

Record:

- dates,
- locations or groups,
- quantities,
- observed results,
- limitations,
- attribution,
- facts that are not provided,
- provenance information.

**If this step fails:** If the file is missing, incomplete, unreadable, or lacks approval information, stop and request the approved source. Do not substitute memory, a search result, or an earlier draft. If the owner or status is unclear, record that as an open question.

### 2. Prepare your own writing brief

Use `brief-template.md` as a set of prompts, not as an answer key. Create `brief.md` and make your own decisions for:

- Audience
- Purpose
- Source of truth, including document title, status, record date, and owner
- Format and approximate length
- Voice
- Accessibility needs
- Disclosure requirement
- Acceptance criteria

For this exercise, the content owner has supplied these constraints:

- The audience is residents with no specialist background.
- The purpose is to inform residents, not to make a recommendation.
- The output must be 120–160 words.
- The final text must state that AI assistance was used and a person reviewed it.

Your brief must also require preservation of the dates, quantities, study limitation, causation warning, and attribution.

**If this step fails:** If your audience, purpose, or source of truth is vague, compare it with the supplied constraints and rewrite it. If you cannot decide what the audience needs, record the uncertainty and ask the content owner before drafting. Do not proceed with an untestable brief.

### 3. Extract supported points and open questions

Create `evidence.md` as a table. For every point you plan to use, record its source wording or location and classify it as `Supported` or `Transformed`.

Include at least these points:

| Point | Source wording or location | Treatment |
|---|---|---|
| Study dates | First body sentence | Preserve |
| Three gardens observed | Second body sentence | Preserve |
| Lower average use at two gardens | Third body sentence | Preserve |
| Drip lines installed | Third body sentence | Preserve |
| No crop-yield comparison | Third body sentence | Preserve as limitation |
| Causation not established | Third body sentence | Preserve explicitly |
| City Horticulture Office staff participated | Fourth body sentence | Attribute |
| Approved status and record date | Header | Use to identify the source |

Add a section titled `Open questions`. List any unresolved issue, such as the unit used for “water use.” If there are none, write `None identified for this exercise`.

**If this step fails:** If a proposed statement cannot be traced to `source-note.txt`, classify it as `Needs review` or `Unsupported`; do not silently include it. If you identify an open question, carry it into `review.md` and either ask the content owner, omit the detail, or state the limitation without guessing.

### 4. Draft from the evidence table

Using `evidence.md` and the decisions in `brief.md`, write `public-update.md`.

Use a descriptive heading and short paragraphs. Change sentence structure, vocabulary, and organization as needed for residents. Do not add recommendations, causes, benefits, named people, units, or background details absent from the source.

Use the evidence table as a checklist while drafting. Every factual sentence should have a corresponding evidence row. Every limitation that the brief requires should appear in the update.

A safe sentence is:

> The study found lower average water use at two gardens after drip lines were installed, but it did not establish that the drip lines caused the difference.

**If this step fails:** If the draft contains a new number, date, named person, outcome, recommendation, or causal explanation, remove it or trace it to the source. If the update is below 120 words, add only distinct, source-supported context. If it is above 160 words, remove repetition before removing a required limitation or attribution.

### 5. Run the acceptance review

Check `public-update.md` against every criterion in `brief.md` and record the results in `review.md`.

Use this format:

# Review

- Meaning: Pass
- Evidence: Pass
- Voice: Pass
- Accessibility: Pass
- Disclosure: Pass
- Word count: [number]
- Information density: Pass
- Open questions: [resolved, omitted, or escalated]
- Reviewer notes: [brief notes]

For **information density**, check that each paragraph contributes a distinct, source-supported point. Do not repeat a sentence or pad the word count with empty language.

For **voice**, ask whether a reasonable reader could mistake the update for praise, a recommendation, or a promise. For **accessibility**, check that unfamiliar terms are understandable in context and that the heading describes the content.

**If this step fails:** Mark the criterion `Fail`, quote the affected sentence, identify the appropriate fix, revise, and review again. Meaning and evidence problems should be rebuilt from `evidence.md`; voice problems should be revised against the brief; accessibility problems should be simplified or explained; disclosure problems should be corrected against the stated requirement. If a judgment remains borderline, ask a reviewer or content owner and record the decision.

### 6. Resolve open questions and compare versions

Review the `Open questions` section in `evidence.md`.

- If an answer is required to make a factual claim, ask the content owner and record the answer.
- If the answer is unavailable, omit the detail or state what the source does not establish.
- Do not invent a unit, benefit, cause, or recommendation.

Then read the source and final update side by side. Look for:

- changed meaning,
- omitted limitations,
- unsupported details,
- altered numbers or dates,
- missing attribution,
- accidental changes in certainty.

Save the approved version only after all differences are intentional and supported.

**If this step fails:** If a difference cannot be explained as a permitted transformation, revert that passage and rewrite it from the evidence table. If provenance cannot be confirmed, pause approval and escalate to the source owner.

## Expected output

The lab directory should contain:

brief.md
evidence.md
public-update.md
review.md

The public update should be 120–160 words, contain distinct source-supported information, preserve the study’s limitation and attribution, use accessible language, and disclose AI assistance and human review.

## Troubleshooting

- **The source is not clearly approved:** Stop and request a versioned or owner-confirmed source.
- **The brief feels like a copy of the prompt:** Rewrite each field as a decision about this audience, purpose, source, and output.
- **The draft is too short:** Add distinct source-supported explanation, such as what was observed and what was not measured. Do not repeat sentences.
- **The draft is too long:** Remove repetition and secondary wording; do not remove the limitation or attribution.
- **The word count is met through repetition:** Delete repeated material and replace it only with a distinct supported point. A target length never overrides meaning.
- **The tone sounds promotional:** Remove praise, promises, and implied benefits. Describe the observation neutrally.
- **A source sentence is ambiguous:** Preserve the ambiguity or request clarification. Do not resolve it by guessing.
- **An open question remains:** Omit the unsupported detail or escalate it to the source owner.
- **The disclosure feels awkward:** Keep it brief and accurate: “AI assistance was used to prepare this update; a person reviewed the final text.”

---