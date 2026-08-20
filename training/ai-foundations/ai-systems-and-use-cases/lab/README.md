# Lab: Design a Safe AI-Assisted Request-Triage Workflow

## Objective

Design a workflow in which AI assists with internal service-request triage without making final safety, security, access, or authorization decisions.

You will:

- Distinguish AI, machine learning, a model, and a complete AI system.
- Match capabilities to suitable tasks.
- Identify the people, data, software, and controls surrounding a model.
- Apply data minimization.
- Separate an AI-generated flag from a human decision.
- Define evaluation measures using an independent review process.

## Prerequisites

- Completion of the AI Systems and Useful Work lesson.
- A text editor or document editor.
- The fictional sample requests below.
- Familiarity with basic workplace service requests.
- Do not enter real personal, medical, financial, password, or confidential information.

Paper is acceptable if you do not have a text editor. A plain-text document is acceptable if you cannot use a spreadsheet.

## Scenario

A small organization receives internal service requests by email. Requests may concern:

- Access
- Equipment
- Software
- Facilities
- Safety
- Other

The organization wants assistance sorting requests so coordinators can respond more quickly. The proposed system may:

- Extract details explicitly stated in a request.
- Suggest a category.
- Suggest an urgency flag.
- Prepare a short handoff summary.
- Draft a response for review.

The system must not:

- Determine the final safety or security condition.
- Deny access or change permissions.
- Decide that a request is genuine or fraudulent.
- Send a response about a safety, security, or access matter without human approval.
- Use information that is unnecessary for triage.

A flag means “send this item for attention.” It does not mean that the model has made the final safety or security determination.

Use these fictional requests:

1. “My monitor has stopped working. I can still work from my laptop, but it is difficult to read.”
2. “I cannot enter the building because my access card stopped working this morning.”
3. “There is water on the floor near the rear exit.”
4. “Can someone install the approved design application on my work computer?”
5. “The team room projector shows a blank screen.”
6. “I received a message asking me to share my password to restore access.”

## Instructions

### 1. Define the work and data boundary

Write a one-sentence description of the proposed AI-assisted task. Include the human checkpoint.

Example:

> “The system uses only the request text and approved category definitions to extract stated details, suggest a category and urgency flag, and prepare a handoff; an authorized coordinator verifies the result before action.”

Then list:

- Information the system needs.
- Information it must not request or use.
- What happens if a request contains a password or other sensitive information.

A suitable response might say that the password is not needed for triage, should not be copied into the workflow, and should be escalated according to the organization’s security process.

**If you cannot identify the data boundary:** start with the requested output and work backward. For each possible input, ask, “Would the coordinator need this to check the output?” Exclude anything unnecessary. If you included real sensitive information, remove it immediately and replace it with fictional text.

### 2. Separate the four terms

Create four headings:

- Artificial intelligence
- Machine learning
- Model
- Complete AI system

Under each heading, explain how the term applies to this scenario in one or two sentences.

Include this distinction: the model produces an output, while the complete system includes the model, allowed inputs, instructions, filters, access controls, review queue, coordinator, records, and escalation process. A built-in model guardrail may be one control inside the system; it does not replace the organization’s surrounding controls.

**If the terms seem interchangeable:** draw a boundary around the complete system. Put the model inside it, then add the people, data rules, workflow, review, and controls required to use the output safely. If you are unsure whether a feature belongs to the model or the system, label it “model behavior” or “system control” and explain what it does. The important question is who can configure, check, and override it.

### 3. Match capabilities to tasks

Complete this table with one scenario example in each row:

| Capability | Suitable task | Not suitable as the final decision |
|---|---|---|
| Classification | Suggest a request category | Decide whether a request is genuine or authorize an action |
| Summarization | Produce a short handoff from the request | Replace reading important evidence |
| Extraction | Identify a stated location, device, or time | Treat an ambiguous, missing, or contradictory detail as verified |
| Generation | Draft a reply for review | Send a high-impact decision automatically |

Then describe one possible sequence using more than one capability, such as:

> Extract the stated location → suggest a category → flag possible urgency → summarize for review.

**If you are unsure whether a capability fits:** identify the exact output and compare it with the original request. If the capability would need to invent, infer, or authorize something, narrow its role or add a human review step.

### 4. Create a request-triage table

For each sample request, complete:

| Request | Stated evidence | Suggested category | Suggested urgency flag | Missing or uncertain information | Human review needed? | Final human action |
|---|---|---|---|---|---|---|

Use only information stated in the request. Do not invent a person’s identity, cause, severity, or location beyond what is written.

The water near the exit and the password request must receive immediate human attention. The system may flag them for escalation, but the authorized person determines the actual safety or security response.

For the access-card request, distinguish between:

- The system flagging that access-related attention may be needed.
- An authorized person deciding whether access should be restored or changed.

**If a request has too little or conflicting information:** record the uncertainty, do not guess, and route it to a person for clarification. If you cannot decide whether a flag is appropriate, mark the item for review rather than treating “not flagged” as “safe.”

### 5. Identify the surrounding system

List at least two items in each category and give each item a purpose:

- **People:** coordinator, subject-matter reviewer, system owner.
- **Data:** request text, approved category list, correction history.
- **Software or workflow:** intake channel, model, review queue, decision record.
- **Controls:** data minimization, access limits, sensitive-information handling, evidence display, review requirement, escalation path, monitoring.

Add at least one control that operates **before** the model runs and one that operates **after** it runs.

Examples:

- Before: remove unnecessary information and restrict the input to the request text and category definitions.
- After: show the original request beside the suggestion and require an authorized person to approve the next action.

**If you cannot identify a control:** ask what could go wrong if the model is incorrect, unavailable, exposed to unnecessary data, or used without review. Turn each risk into a control.

### 6. Decide what remains human

For each action, choose one:

- AI may perform it automatically.
- AI may suggest it, but a person must approve it.
- Do not automate this action.

Evaluate these recommended boundaries:

| Action | Recommended boundary |
|---|---|
| Suggest a category | AI may suggest; person confirms |
| Extract stated details | AI may suggest; person checks against the request |
| Summarize a request | AI may suggest; person checks |
| Flag possible urgency | AI may flag for triage; person determines the actual response |
| Decide whether a safety risk exists | Do not delegate the final determination |
| Decide whether a security incident exists | Do not delegate the final determination |
| Send a safety or security response | Authorized person approves |
| Deny access or change permissions | Do not automate without an authorized process and human approval |

For every “AI may suggest” decision, explain what the reviewer checks and what happens when the output is wrong.

**If you disagree with a recommendation:** describe the consequence of an incorrect result, whether meaningful intervention is possible, whether the data is adequate, and who is accountable. A low-confidence flag can be useful as a review trigger; it must not silently become an authorization or final finding.

### 7. Define an evaluation and error-handling plan

Choose at least three observable measures:

1. Agreement between the suggested category and the final category after an independent reviewer examines disagreements.
2. The proportion of known urgent examples that receive a review flag.
3. Review time compared with the current process, without an increase in harmful or missed errors.
4. The rate at which extracted details match the source request.
5. The rate of outputs routed to a person because information is missing or contradictory.

Do not assume that the coordinator’s first decision is always correct. Define a ground-truth process, such as having an independent authorized reviewer examine disagreements and establish the reference decision.

Describe what happens when the system is wrong. Include correction, escalation, review of recent outputs, and temporary removal from the workflow if necessary.

**If a measure cannot be checked:** replace it with an observable event, such as “an independent reviewer records the final category” or “a flagged item receives a documented human disposition.”

## Expected output

Submit one document containing:

1. A one-sentence task definition and data boundary.
2. The four-term explanation.
3. The capability-to-task table and a multi-capability sequence.
4. The completed request-triage table.
5. The people, data, software, and controls list.
6. The human-review and no-automation decisions.
7. Three or more evaluation measures, an independent review process, and an error-handling plan.

A successful submission shows that the model provides bounded assistance, the system limits data and access, and authorized people remain responsible for consequential actions.

## Troubleshooting

- **The workflow feels too broad:** limit it to extraction, categorization, urgency flagging, and a handoff summary.
- **You are making assumptions about a request:** record only explicit evidence and route uncertainty to a person.
- **You are treating a flag as a final decision:** label it as a review trigger and separately record the authorized person’s determination.
- **You are treating the model as the whole system:** add users, allowed data, workflow steps, controls, records, and accountability.
- **You included too much data:** remove fields not needed to produce or check the output. Never use real passwords or confidential information.
- **You cannot decide whether review is needed:** consider consequence, checkability, data adequacy, explainability, and whether a person can intervene before action. If any critical condition is missing, redesign the task or require human review.
- **You want to automate a safety, security, or access action:** keep the final determination and authorization with an appropriately authorized human, and document escalation.
- **The table becomes confusing:** use one row per request and separate suggested output, evidence, uncertainty, flag, and final action.
- **The evaluation gives misleading results:** do not treat one coordinator’s decision as unquestionable ground truth; use independent review for disagreements.
- **You used real sensitive information:** remove it immediately and replace it with fictional text.

---