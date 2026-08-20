# Lab: Map an AI Product Interaction

## Objective

Analyze one real interaction with an AI product and identify:

- the surrounding product components (instructions, context, retrieval, memory, tools, policy, agentic loop),
- three plausible failure modes,
- four risk factors,
- an appropriate disposition: **use, verify, redesign, or stop**.

## Prerequisites

- Access to an AI product you can use safely.
- One low- or medium-risk task, such as summarizing a public article, organizing notes, or explaining a general concept.
- A way to record observations.
- Do not use confidential, personal, regulated, or high-stakes information.

If you cannot safely access an AI product, use a recent interaction you already have permission to review. If no suitable interaction is available, use a public article and ask an AI product for a short summary; do not proceed with private or high-consequence material.

**Before starting Step 1:** Confirm your chosen task is suitable for failure analysis. It should involve:
- visible context (e.g., a document or clear prompt),
- a clear question or goal,
- no irreversible or external actions.

If your task does not meet these criteria, choose a different one.

## Step 1: Choose and record the interaction

Write down:

- the product and task,
- the exact prompt or request,
- any files, links, or other context supplied,
- the output you received,
- whether the product was allowed to perform any action.

**If the task is high-risk:** stop and choose a safer example. Do not use this lab to test medical, legal, financial, employment, safety-critical, or irreversible decisions.

## Step 2: Map the components

Complete this table.

| Component      | What to record                                                                                     |
|----------------|----------------------------------------------------------------------------------------------------|
| Product        | What interface, workflow, or service surrounds the model?                                         |
| Instructions   | What task, role, format, or restrictions were supplied? Include visible instructions only.        |
| Context        | What did you provide in the prompt, files, links, or conversation history?                        |
| Retrieval      | Did the product find information from documents or another collection? What evidence shows this?   |
| Memory         | Did it use information from earlier interactions or saved preferences? If unknown, mark "unknown." |
| Tools          | Did it search, calculate, browse, access data, or perform another external operation?             |
| Policy         | Were there visible rules (e.g., "do not answer medical questions")?                               |
| Agentic loop   | Did it plan, act, inspect results, and continue through multiple steps? If not, write "not observed." |

**If you cannot tell whether a component exists:** do not guess. Mark it "unknown," then look for visible citations, activity indicators, retrieved passages, action confirmations, or product documentation. If the evidence remains unavailable, retain "unknown."

## Step 3: Identify three plausible failures

Choose three different failure modes from the list below and describe a concrete way each could affect your interaction. For each, note what evidence you would check to detect it.

| Failure mode   | What could go wrong?                                                                               | Evidence check                                                                                     |
|----------------|----------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| Fabrication    | The system invents a detail, citation, or event that does not exist.                              | Locate claims in reliable sources.                                                                |
| Staleness      | The answer is outdated or no longer accurate.                                                     | Check dates and current authoritative information.                                                |
| Scope drift    | The system answers a different question than the one asked.                                       | Compare output with the original request.                                                         |
| Bias           | The output treats groups or viewpoints unfairly.                                                  | Test varied examples and seek affected perspectives.                                              |
| Inconsistency  | Similar inputs produce different answers without reason.                                          | Repeat comparable inputs and compare results.                                                     |
| Context failure| The system misreads or ignores supplied context.                                                  | Confirm supplied context was used correctly.                                                      |
| Tool uncertainty| A connected tool (e.g., search) returns incorrect or ambiguous results.                          | Inspect tool results and limitations.                                                             |
| Untested code  | Generated code contains defects or unsafe assumptions.                                            | Run tests and review behavior and safety.                                                         |

**If you cannot identify a plausible failure:** Choose a different task with clearer evidence (e.g., a summary with source material). Do not proceed with a task where failures are not detectable.

## Step 4: Rate the four risk factors

Rate each factor **low, medium, or high**, and explain why.

| Factor         | Rating | Reason                                                                                            |
|----------------|--------|---------------------------------------------------------------------------------------------------|
| Consequence    |        | What happens if the output is wrong?                                                              |
| Volatility     |        | How quickly can the relevant information change?                                                 |
| Uncertainty    |        | How difficult is correctness to establish?                                                       |
| Reversibility  |        | How easily can an error be undone?                                                               |

**If you are unsure about a rating:** Choose the higher rating and state what information is missing. Seek a knowledgeable reviewer before using the result.

## Step 5: Apply the verification ladder

Select checks that match your ratings. Possible checks include:

- compare claims with an authoritative source,
- confirm dates and version or publication information,
- test the output against several examples,
- compare the answer with the original request,
- inspect retrieved passages or tool results,
- ask a qualified person to review it,
- repeat the interaction to check consistency,
- preserve a human approval step before any external action.

Record the checks you performed and what they showed.

**If evidence conflicts or cannot be found:** Do not resolve the conflict by choosing the more confident answer. Escalate to a reliable source or reviewer. If that is not possible, stop.

**If a citation appears valid but does not support the claim:** Treat the claim as unverified. Do not assume the citation is correct just because it exists.

## Step 6: Decide what to do

Choose one disposition:

- **Use:** The task is low-risk and the output passed proportionate checks.
- **Verify:** The output may be useful, but it needs review before use.
- **Redesign:** Narrow the task, improve context, add authoritative retrieval, remove action permissions, or add approval.
- **Stop:** The risk is too high, evidence is inadequate, or the system is outside a reliable scope.

Write one sentence explaining your choice.

**If the product can take an external or irreversible action:** Do not allow that action during this lab. Redesign the interaction so the system produces a proposal for human approval instead.

## Expected output

Submit one completed analysis containing:

1. the interaction description,
2. the component map,
3. three failure analyses,
4. the four risk ratings,
5. verification checks and results,
6. the final disposition and justification.

A strong submission distinguishes what you observed from what you inferred, marks unknowns clearly, and explains why the evidence is sufficient—or insufficient—for the intended use.

## Troubleshooting

- **The product gives no model details:** Record the model as "not visible." The exercise is about boundaries, not product speculation.
- **No retrieval or tool use is visible:** Record "not observed." Do not infer hidden capabilities from the answer alone.
- **The output is too short to analyze:** Repeat with a slightly more specific, low-risk request and preserve both outputs. If repetition is not allowed, choose another interaction.
- **The output contains citations:** Open or independently check them. If a citation cannot be located or does not support the claim, treat the claim as unverified.
- **The product changes its answer:** Record both outputs and classify the difference as possible inconsistency or context failure; then verify externally.
- **The task includes private information:** Delete it from your notes, do not submit it, and repeat with public or synthetic information.
- **You cannot decide between "use" and "verify":** Choose "verify." Uncertainty is itself evidence that more checking is needed.

---