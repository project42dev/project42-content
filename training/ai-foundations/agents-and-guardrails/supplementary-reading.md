# From Responses to Reliable Agents

An AI system can appear helpful while operating in very different ways. A single model response answers one request. A deterministic workflow follows steps chosen in advance. An agentic loop repeatedly observes information, decides what to do next, and takes actions until it reaches a defined stopping point.

The difference matters because each approach has a different risk profile.

A model response is usually the smallest unit of interaction: input goes in, output comes out. For example, a model might summarize a customer message. It may be useful, but it has no authority to change a customer record unless another system uses its output to do so.

A deterministic workflow is more predictable. It may check whether a request contains required information, retrieve a record, and route the request according to fixed rules. The workflow can still fail, but its possible paths are easier to inspect and test.

An agentic loop is more flexible. It can choose among available capabilities, revise its plan, and respond to new information. That flexibility is useful when the path cannot be known in advance. It also creates additional responsibilities: the system needs clear goals, limited permissions, a way to remember relevant state, and conditions that tell it when to stop.

## Design the boundary before the behavior

Before deciding what an agent should do, define what it must not do. A useful design starts with the boundary:

- **Goal:** What outcome is the system trying to achieve?
- **State:** What facts, decisions, and pending work must be carried between steps?
- **Tools:** Which actions or information sources are available?
- **Permissions:** Which actions are allowed, and under what conditions?
- **Exit conditions:** When is the task complete, blocked, or ready for a person?
- **Budget:** How much time, money, data, or number of actions may be used?
- **Human handoff:** What information must be delivered to a person when the system cannot safely continue?

These are not merely implementation details. They are part of the system’s behavior. For example, “help with a refund” is too broad to be a safe goal. A narrower goal might be “verify whether a refund request meets the stated policy and prepare the next approved step.” That goal separates investigation from authorization.

State also needs careful treatment. Not every model-generated statement should become a fact. A system should distinguish between verified information, user-provided claims, tentative conclusions, and completed actions. If these categories are mixed together, an assumption can be carried forward as if it were true.

For example, “the customer says the package has shipped” is a claim. “The shipment record says the carrier has not received it” is a verified record. “Cancellation is probably allowed” is a conclusion that still needs to be checked against the policy. These items may all be stored in state, but they should retain their different labels.

## Guardrails should be enforceable

A reminder such as “be careful” is not a strong guardrail. An enforceable guardrail explicitly allows, blocks, filters, limits, or routes an input, output, state change, or action. It changes the path the system is allowed to take.

Input guardrails can reject missing or malformed information. Permission guardrails can limit access to only the records needed for the task. Action guardrails can require confirmation before an external side effect, such as changing a record or sending a message. Output guardrails can prevent the system from presenting an unverified conclusion as a completed result. State guardrails can stop untrusted content from becoming an authoritative instruction.

Layered controls are important because no single check is perfect. A request may pass input validation but still ask for an unsafe action. A response may look correct while the underlying state is incomplete. A permission check may allow access to a record but not authorize changing it.

A useful question for every guardrail is: **What happens when the check fails?** The answer should be observable and specific: reject the request, ask for missing information, block the action, label the result as unconfirmed, or require human approval. If the only outcome is “the system should be careful,” the control is not enforceable enough.

## Recovery is part of the design

An agent should not continue simply because it has not finished. Repeatedly attempting the same action is looping. Taking increasingly unrelated actions is drift. Performing an irreversible action without the required approval is an unsafe action. Stopping without explaining what is missing creates an incomplete handoff.

A recovery plan makes these cases predictable. The system can count repeated attempts, compare the current task with the original goal, check whether required evidence exists, and stop when a budget is reached.

A useful handoff includes:

- the original goal;
- relevant verified facts;
- customer claims that remain unverified;
- actions attempted and whether they completed;
- the reason for stopping;
- unresolved questions or missing information; and
- a recommended next step.

This gives a person enough context to continue without starting over. It also prevents a failed agent run from being mistaken for a completed task.

The strongest agent designs do not maximize autonomy. They maximize useful progress within a clearly controlled boundary. A smaller system that knows when to ask, stop, and explain is often more dependable than a more capable system that acts without limits.

---