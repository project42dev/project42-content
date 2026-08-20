# Lab: Build a Verified Quick-Start Guide

## Objective

Create a short, trustworthy quick-start guide for a real, low-risk process you know. Examples include preparing for a recurring meeting, submitting a routine request, onboarding a volunteer, or organizing a personal study session.

You will:

- Select a bounded objective.
- Identify source and authority limits.
- Create a reproducible prompt or workflow plan.
- Define acceptance criteria.
- Collect source, tool, output, and verification evidence.
- Recover from a meaningful failure or document a tested recovery path.
- Present and reflect on the result.

Do not use confidential, personal, regulated, or sensitive information.

## Prerequisites

- Access to an AI system approved for your learning environment.
- A browser or another way to view your selected sources.
- A text editor or document space.
- Two or three trustworthy, non-sensitive sources about the process.
- Permission to use those sources.
- A folder for saving evidence.

If you cannot identify suitable sources, use publicly available guidance from an official organization or create a fictional but realistic process. Do not proceed with private material.

## Step 1: Choose and bound the scenario

Choose a process that is useful but low risk. Write a one-sentence objective using this pattern:

> Create a [length and format] guide for [audience] to complete [specific process], using only [approved sources], for [specific context].

Add three limits:

- The guide must not make decisions for a person.
- The guide must not include private or confidential information.
- A human must review it before use.

**If this step fails:** If the process is too broad, reduce it to one audience and one outcome. If it involves health, legal, financial, employment, safety, access, or personal data, choose a lower-risk scenario.

## Step 2: Record sources and authority

Create an evidence file with this table:

| Source | Creator or owner | Date or currency note | What it supports | Authority limit |
|---|---|---|---|---|

Read each source and note the specific facts you expect to use. In the **authority limit** column, write what the source cannot decide or approve. For example: “This checklist describes the usual process, but it does not approve a request,” or “This informal guide gives suggestions, but an official policy would take priority.”

Do not treat an informal explanation as an official rule unless its authority is clear.

**If this step fails:** If a source is inaccessible, outdated, contradictory, or unclear about ownership, do not silently substitute another source. Mark it as unusable, find an authoritative replacement, or narrow the guide so that the disputed claim is excluded. If you cannot explain a source’s authority limit, ask a human reviewer or leave the claim out.

## Step 3: Define acceptance criteria

Write at least six criteria before generating anything. Include criteria such as:

- The guide is no longer than one page.
- It is written for the named audience.
- Every required step appears in the correct order.
- Important claims can be traced to a source.
- Uncertainty is labeled instead of guessed.
- The guide contains no private information or unsupported promises.
- A human reviewer can approve or revise it.

Mark each criterion as a checkbox.

**If this step fails:** If a criterion uses words such as “good,” “clear,” or “professional” without explaining how to check it, rewrite it as an observable condition.

## Step 4: Create the workflow instruction

Write a reusable instruction that includes:

1. The role and task.
2. The audience and output format.
3. The allowed sources.
4. The authority limits.
5. The acceptance criteria.
6. A request to mark unsupported or uncertain claims.
7. A request for a source note beside each important claim.

Save this instruction before running it. You may use stages—such as extracting facts, organizing them, and drafting the guide—instead of one large instruction.

**If this step fails:** If the instruction becomes too long or confusing, split it into stages. Keep the same source and authority limits in each stage.

## Step 5: Generate the first result

Provide only the approved, non-sensitive source material or references. Save the complete initial result without editing it. Record:

- Date of the run
- The AI system used, if your environment displays it
- The instruction
- The sources provided
- The result

Do not ask the system to perform an action outside the objective, such as contacting someone or approving the guide.

**If this step fails:** If the system refuses, returns an incomplete result, or produces an error, save the visible message. Retry once with a shorter instruction and the same boundaries. If it still fails, use the staged workflow from Step 4 and record the recovery.

## Step 6: Test the result

Use the acceptance checklist. For every important claim, compare the guide with the original source. Record the source location and whether the claim is accurate, incomplete, or unsupported.

Perform one adversarial check by asking:

- What could a reader misunderstand?
- Which step could cause harm if it were wrong?
- Did the guide add a deadline, requirement, or permission not present in the sources?
- Did it omit an exception?
- Could the guide’s structure cause an unsafe or unauthorized action even if individual claims are accurate?

**If this step fails:** If a claim cannot be verified, remove it or label it as needing confirmation. If the guide omits a required step, return to the source and revise the workflow rather than adding a guess. If the guide could cause harm, expose information, or prompt an unauthorized action, stop use and publication immediately. Preserve the artifact, record the hazard, and ask an appropriate human reviewer whether to redesign or abandon the task.

## Step 7: Recover from a meaningful failure

Use either a meaningful failure that occurred during Steps 5–6 or a safe, controlled test of the recovery path. For a controlled test, work from a copy and temporarily remove one required source or change the audience. Do not use real sensitive information or create a high-risk scenario. Keep the failed or test output and label it accurately.

Document:

1. What failed.
2. How you detected it.
3. Why it mattered.
4. What instruction, source, or boundary you changed.
5. The corrected result.
6. Which acceptance checks passed afterward.
7. Whether the recovery is safe to reuse.

**If this step fails:** If no natural failure occurred and the controlled test produces no meaningful difference, choose a clearer but still safe test, such as omitting a required source or changing the audience. If the failure reveals a safety or authority problem that cannot be corrected, stop and document the tested recovery path instead of proceeding.

## Step 8: Prepare the final package

Save these items:

- Objective and boundaries
- Source and authority table
- Reusable instruction or workflow
- Initial output
- Failed or test output
- Corrected output
- Verification checklist and notes
- Final approved guide
- Short reflection

In the reflection, answer:

- Was the result correct?
- What evidence supports it?
- What remained uncertain?
- What was outside the AI’s authority?
- Could another person reproduce the process?
- What would you change next time?

**If this step fails:** If an item is missing, label it missing rather than reconstructing it from memory. Explain how you would capture it in a future run.

## Expected output

A completed evidence folder containing the materials above and a final one-page quick-start guide that a human reviewer could approve.

## Troubleshooting summary

- **The output sounds plausible but has no support:** Compare each claim with the source and remove unsupported content.
- **The output is too broad:** Narrow the audience, process, or format.
- **The format is inconsistent:** State the exact structure and check each section separately.
- **The system invents details:** Add an explicit “do not guess” instruction and require uncertainty labels.
- **Sources disagree:** Preserve both claims, identify the authority difference, and request human resolution.
- **The guide could cause harm:** Stop publication or use, preserve the evidence, record the hazard, and seek human review.
- **You cannot reproduce the result:** Save the exact instruction, inputs, output, and review notes; do not rely on memory.

---