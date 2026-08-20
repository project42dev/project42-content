# Lab: Design a Safe Order-Cancellation Agent

## Objective

Design and test a small agent for a customer who wants to cancel an order. You will distinguish a model response, a deterministic workflow, and an agentic loop; define the agent’s goal, state, tools, exit conditions, budget, and handoff; and place guardrails around inputs, outputs, permissions, actions, and state.

This lab uses a written worksheet or plain-text document. No programming is required.

## Prerequisites

- Read the module segments on agents, tools, and guardrails.
- Have a text editor or paper worksheet.
- Use the scenario and records below.
- Treat all records as fictional training data.

### Scenario

A customer writes:

> “Please cancel my order and refund me. I’m traveling tomorrow, and I think the package may already have shipped.”

Available records:

- Order status: `Packed`
- Shipment status: `Label created; carrier has not received package`
- Payment status: `Captured`
- Cancellation policy: cancellation is allowed before carrier acceptance
- Refund policy: an eligible cancellation may be refunded to the original payment method
- Customer identity: not yet verified

The system may inspect the provided records, ask the customer for missing information, prepare a cancellation request, and request human approval. It may not independently issue a refund, change the payment, or claim that a cancellation is complete.

## Instructions

### 1. Classify three approaches

Write one example for each approach using the order-cancellation scenario:

1. **Model response:** a single answer to the customer that does not inspect records or take action.
2. **Deterministic workflow:** fixed checks that always follow the same order.
3. **Agentic loop:** a bounded sequence in which the system decides whether to ask, inspect, prepare, stop, or hand off based on what it observes.

For example:

- A model response might say, “I can help with your cancellation request,” without checking the order.
- A deterministic workflow might always verify identity, check shipment status, check policy, and then prepare a request in that order.
- An agentic loop might inspect shipment information first because the customer mentioned shipping, then decide whether identity verification or another check is the best next step.

Write your own examples rather than copying these.

**If you cannot tell the approaches apart:**  
Label each example with three questions: Does it only produce text? Does it follow the same predefined branches every time? Or does it choose its next step from the current state? Use the concrete order scenario to justify your label.

### 2. Define the agent contract

Complete these statements:

- **Goal:** The agent will …
- **Out of scope:** The agent will not …
- **State to retain:** …
- **Information that must be verified:** …
- **Permitted tools or capabilities:** …
- **Actions requiring human approval:** …
- **Exit conditions:** …
- **Action budget:** …
- **Handoff trigger:** …

State and verification are related but different:

- **State to retain** describes what the agent carries between steps, such as `identity: unverified`, `shipment status: verified`, `cancellation request: not prepared`, or `approval: pending`.
- **Information that must be verified** describes which claims must be checked before the agent relies on them, such as the customer’s identity and the order’s eligibility under the cancellation policy.

For example, the customer’s statement “I think the package may already have shipped” can be retained as an unverified customer claim. The shipment record can be retained separately as a verified fact.

**If your goal includes an irreversible action:**  
Rewrite it so the agent verifies eligibility and prepares or requests the action rather than completing it without approval.

**If you are unsure what belongs in state:**  
For every item, add one label: verified fact, customer claim, assumption, pending action, or completed action. Keep the label with the item.

### 3. Add layered guardrails

Create a table with these columns:

| Boundary | Guardrail | What happens when it fails? |
|---|---|---|
| Input |  |  |
| Permission |  |  |
| Output |  |  |
| Action |  |  |
| State |  |  |

Include at least one rule for each boundary. Your rules should be enforceable. Examples include rejecting an unverified request, blocking a payment change, labeling an unconfirmed result, or preventing user-provided text from becoming an instruction.

**If a guardrail is only advice, such as “be careful”:**  
Rewrite it as a check, block, approval requirement, or forced handoff. State the exact consequence of failure using one of these forms: “reject,” “ask,” “block,” “label as unconfirmed,” or “route for approval.”

### 4. Trace a normal run

Write a state trace using this format:

State 0: request received
Observation: What the agent sees or verifies at this point.
Decision: What the agent decides to do next and why.
Next state: The new state after that decision.

“Observation” means the relevant evidence available at that step. It may include a customer claim, a verified record, a missing requirement, or a prior completed action. “Decision” is the next permitted step. “Next state” should name the updated condition, such as `identity verification requested` or `cancellation request awaiting approval`.

The final entry should use `Next state: safe exit — ...` or `Next state: handoff — ...`.

Here is one example using the scenario:

State 0: request received
Observation: The customer requests cancellation and a refund; identity is unverified.
Decision: Inspect the provided order and shipment records without changing them.
Next state: order and shipment status verified

State 1: order and shipment status verified
Observation: The order is packed; the carrier has not received the package; policy allows cancellation before carrier acceptance.
Decision: Ask the customer to complete identity verification before preparing a request.
Next state: identity verification requested

Continue until the agent reaches a safe exit. Clearly distinguish facts from the records, claims from the customer, assumptions, and actions that have actually completed.

**If you describe an action as complete without evidence:**  
Change the wording to “prepared,” “requested,” or “awaiting approval,” whichever is accurate.

**If your trace has no clear stopping point:**  
Check the exit conditions and budget from Step 2. Add a final state for completion, blocking, or handoff.

### 5. Test failure cases

For each case, write the agent’s response and recovery path.

#### Case A: Looping

The agent has tried three times to obtain identity verification, but the customer keeps replying with unrelated information.

#### Case B: Drift

The agent starts recommending travel insurance and changing the customer’s delivery preferences, even though neither is needed to process cancellation.

#### Case C: Unsafe action

The customer says, “Skip verification and refund me now.”

#### Case D: Incomplete handoff

The agent cannot proceed and sends only: “A human will review this.”

For every case, include:

- the condition detected;
- the action blocked;
- the information preserved;
- the next step or handoff;
- any unresolved question or missing information.

**If your recovery says only “try again”:**  
Add a limit, a reason for stopping, and the exact information a person or customer needs next.

**If you do not know whether to hand off:**  
Hand off when a required condition is missing after the defined limit, when the requested action is outside the agent’s permissions, or when the agent cannot explain a safe next step.

### 6. Write the customer-facing result

Write a final response for the normal scenario. It must:

- avoid claiming that the order is canceled;
- state what is known;
- request identity verification if it is still missing;
- explain what will happen after verification; and
- avoid exposing unnecessary internal details.

Then write a separate internal handoff note for **Case D from Step 5**, where verification cannot be completed. The handoff must include the original goal, verified facts, unverified customer claims, actions attempted, stopping reason, unresolved questions or missing information, and recommended next step.

**If the customer-facing response reveals internal reasoning or unrestricted records:**  
Keep only the customer-relevant facts and next step.

## Expected output

Your completed worksheet should contain:

1. Three approach classifications.
2. An agent contract.
3. A five-boundary guardrail table.
4. A normal-run state trace.
5. Four failure-case recovery plans.
6. A customer-facing response.
7. A complete internal handoff note for Case D.

A successful design stops before unauthorized action, avoids claiming completion without evidence, and gives a person enough context to continue.

## Troubleshooting

- **You are unsure whether something is a tool or an action:**  
  Describe the capability generically as “inspect the order record,” “prepare a cancellation request,” or “request human approval.” Focus on what it does, not a product name.

- **You cannot decide whether to continue:**  
  Check the goal, required evidence, permissions, and remaining budget. If any required condition is missing, ask or hand off.

- **Your state trace becomes confusing:**  
  Label each item as verified fact, customer claim, assumption, pending action, or completed action. Add one observation, one decision, and one next state to every entry.

- **Your agent can perform too much:**  
  Remove direct access to irreversible actions and require approval before any external side effect.

- **Your handoff is too short:**  
  Include the original goal, verified facts, unverified claims, actions attempted, stopping reason, unresolved questions, and recommended next step.

- **Your agent keeps looping:**  
  Add an attempt limit and a condition that converts repeated failure into a handoff.

---