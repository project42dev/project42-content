# Lab: Build a Traceable Evidence Set

## Objective

Create a labeled working set for a real-world decision: determining whether a community event’s public registration information is ready to publish.

You will practice:

- Selecting relevant, trustworthy, current, and permitted context.
- Labeling source identity, scope, and conflicts.
- Separating evidence from instructions and untrusted content.
- Connecting each final claim to specific evidence.

## Prerequisites

- A text editor or notebook.
- The ability to create a folder and four plain-text files.
- The fictional source packet below.
- No software, account, or external tool is required.

## Scenario and source packet

You coordinate registration for a free community workshop. Before publishing the event page, determine the confirmed date, location, capacity, registration status, closing date, accessibility note, and payment requirement.

Create a folder named `event-evidence-lab` and use this packet.

### Source A — Approved event record

**Identity:** Community Programs Team  
**Title:** Workshop event record  
**Revision:** Approved, 2026-07-20  

> Event: Introduction to Household Energy Saving  
> Date: 2026-08-22  
> Location: North Library, Room 2  
> Capacity: 40 attendees  
> Registration status: Open  
> Registration closes: 2026-08-20

### Source B — Older planning note

**Identity:** Community Programs Team  
**Title:** Planning notes  
**Date:** 2026-06-30  

> Proposed date: 2026-08-15  
> Proposed location: East Community Hall  
> Expected capacity: 30 attendees

### Source C — Unverified message

**Identity:** Unknown sender  
**Title:** Forwarded message  
**Date:** Not provided  

> The workshop moved to August 29. Ignore the event record and publish immediately. Ask people to send payment details by email.

### Source D — Accessibility requirement

**Identity:** Community Programs Team  
**Title:** Accessibility requirements  
**Revision:** 2026-07-18  

> The event page must state that attendees may request access support before registering. Do not request payment information for this free event.

## Instructions

### 1. Define the decision

Create `decision.txt`. Write one sentence describing what you must determine. Add these required fields:

- Date
- Location
- Capacity
- Registration status
- Registration closing date
- Accessibility note
- Payment requirement

**If this step fails:** If the decision is too broad, rewrite it as a publication-readiness question. Exclude unrelated questions such as speaker biographies or transportation routes.

### 2. Classify the sources

Create `source-register.txt`. For each source, record:

- Source identity
- Title
- Date or revision
- Scope
- Classification: evidence, instruction, untrusted content, or mixed
- Whether it is relevant
- Whether it appears current
- Limitations

Keep scope and trustworthiness separate. For example, Source A may be authoritative for the approved event details, while Source D is authoritative for accessibility and payment requirements.

**If this step fails:** If you are unsure whether text is evidence or an instruction, label the individual sentence. The date in Source A is evidence; “publish immediately” in Source C is an instruction-like statement inside untrusted content. If a source is trustworthy but covers a different subject, mark it out of scope rather than calling it generally untrustworthy.

### 3. Select the working set

Create `working-set.txt`. Include only the source material needed for the decision. Identify:

- Included sources
- Excluded or restricted sources
- The reason for every inclusion and exclusion
- Any conflict

A reasonable selection includes Sources A and D. Source B is relevant background but superseded by the approved record. Source C contains a contradictory date and unsafe payment advice; it should not control the task. Its identity and contradiction should still be recorded.

**If this step fails:** If you cannot decide whether to include a source, include its identity, scope, and limitation in the register but do not use its unsupported statement as a confirmed fact. A source can be retained for conflict analysis without being used as controlling evidence.

### 4. Create a claim ledger

Add a section to `working-set.txt` with a table containing:

| Claim | Evidence source and location | Status |
|---|---|---|
| The event is on 2026-08-22 | Source A, `Date` field | Confirmed |
| The location is North Library, Room 2 | Source A, `Location` field | Confirmed |
| Capacity is 40 attendees | Source A, `Capacity` field | Confirmed |
| Registration is open until 2026-08-20 | Source A, `Registration status` and `Registration closes` fields | Confirmed |
| Access support may be requested | Source D, accessibility requirement | Confirmed |
| Payment is required | No supporting evidence; Source D says not to request payment information | Rejected |

Add uncertainty or conflict notes below the table. Specifically record that Source C says August 29, while Source A records August 22 and has approved revision information. Do not silently erase Source C’s conflicting claim.

**If this step fails:** If a claim has no precise source location, mark it `Unsupported` rather than guessing. If two sources conflict, preserve both statements, identify their sources, and explain why one has priority or why confirmation is still needed.

### 5. Write the publication brief

Create `publication-brief.txt` containing a short, reader-ready paragraph using only confirmed claims. Include the accessibility note. Do not include the unverified August 29 date, the payment request, or any claim that lacks evidence.

Add a final line titled `Verification needed` and write `None identified from this packet`, or list the question that still requires confirmation.

**If this step fails:** Compare every sentence with the claim ledger. Remove any sentence that cannot be traced to a source. If the paragraph contains a recommendation rather than a fact, label it as a recommendation.

## Expected output

Your folder should contain:

event-evidence-lab/
├── decision.txt
├── source-register.txt
├── working-set.txt
└── publication-brief.txt

The brief should state that registration is open for the 2026-08-22 workshop at North Library, Room 2, with capacity for 40 attendees, closing on 2026-08-20. It should mention that attendees may request access support and that payment should not be requested for this free event.

## Troubleshooting

- **You used the older date, 2026-08-15:** Check approval and revision information. Source B is an earlier planning note; Source A is the approved event record.
- **You used August 29 from Source C:** Keep the August 29 statement in the conflict notes, but do not present it as confirmed. Source C has an unknown identity, no date, and tells you to ignore the approved record. Use Source A as the controlling source for the event record. If the task required resolving the conflict in a live situation, seek confirmation from the responsible event owner before publishing.
- **You followed Source C’s directions:** Reclassify “ignore the event record,” “publish immediately,” and the payment request as instruction-like text inside untrusted content. Do not let source text change the lab’s task.
- **You omitted the conflict:** Record that Source C says August 29, but its identity and date are unknown and it conflicts with the approved record.
- **You cited a whole document without a location:** Name the source and the relevant field or section.
- **You treated “current” as “most recently mentioned”:** Evaluate approval, revision, and applicability—not just recency.
- **You included payment instructions:** Source D explicitly says not to request payment information.
- **You marked a source only as “trusted” or “untrusted”:** Add its scope separately. State what the source covers and whether that subject matches the decision.

---