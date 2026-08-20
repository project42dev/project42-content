# Choose Reliable Orchestration Patterns: text-only class

This route contains the complete teaching content, learner actions, feedback,
and assessment handoff without requiring audio, video, or animation.

## Welcome: Welcome And Outcomes

Welcome. This class helps you choose an orchestration pattern because the task requires it, not because multiple agents sound impressive. You will compare direct execution, deterministic workflows, managers, handoffs, parallel branches, and review loops while preserving observable routes, budgets, state, and terminal outcomes.

## Narration: Simplest Sufficient Pattern

Begin with the simplest structure that handles the real uncertainty. If one bounded model call followed by validation can finish the task, use it. If the steps and branches are already known, encode them in deterministic application logic. Add model-directed routing only when selecting the next step requires semantic judgment that fixed rules cannot express economically. For every proposed agent boundary, write the benefit and the new cost. A specialist may reduce prompt conflict, permission breadth, or evaluation ambiguity. It also adds latency, state transfer, another failure surface, and another place where instructions or authority can drift. More agents create more boundaries; they do not automatically create better work. If you cannot name the distinct responsibility, evidence contract, and terminal behavior of an agent, remove it or make it a deterministic function.

Visual alternative: The funnel asks whether one call works, whether control flow is known, and whether semantic routing is necessary before introducing an agent.

Sources:

- <https://www.anthropic.com/engineering/building-effective-agents>

## Narration: Deterministic Workflow Demonstration

Consider a curriculum update. Intake validates the source record. Classification chooses direct review, specialist review, or human escalation. A specialist produces a typed claim table. Verification either accepts it, permits one revision, or escalates. The application owns this graph. Models perform bounded nodes; they do not invent edges. Each edge records the input version, output version, route reason, remaining budget, and next allowed states. A sequential path handles dependencies. A conditional path uses validated state. A bounded loop permits one measurable improvement. A deterministic terminal state ends in accept, escalate, cancel, or fail with evidence. Google ADK exposes sequential, loop, and parallel workflow agents, but the portable principle is broader: keep known control flow in code and place uncertain model work inside explicit contracts.

Visual alternative: Intake leads to classification, optional specialist work, verification, one bounded revision, and explicit accept or escalate outcomes.

Sources:

- <https://google.github.io/adk-docs/agents/workflow-agents/>

## Demonstration: Pattern Selection Demonstration

Now compare two implementations. Design A lets an agent decide whether to research, write, verify, retry, or publish until it feels finished. Design B fixes intake, research, writing, two independent verification judgments, human approval, and publication as governed states. Models choose evidence and language inside bounded nodes, but cannot skip approval or invent a terminal state. Design B exposes failure, cost, and recovery, so it is the reliable starting point.

Visual alternative: The open loop can choose and repeat any step. The governed graph requires intake, research, writing, two verification judgments, human approval, and publication.

Sources:

- <https://www.anthropic.com/engineering/building-effective-agents>
- <https://google.github.io/adk-docs/agents/workflow-agents/>

## Narration: Manager And Handoff

Choose a manager when one agent should retain responsibility for the user-facing result. The manager calls specialists as tools, validates their artifacts, combines evidence, applies shared guardrails, and owns the final answer. This centralizes synthesis and budget control, but it can become a bottleneck and must be able to judge specialist output. Choose a handoff when a specialist should take over the next phase under a narrower instruction set. A handoff can reduce prompt conflict and support direct specialist interaction, but it transfers active control. The transfer must preserve user intent, trusted facts, unresolved questions, allowed actions, completed side effects, budget, return conditions, and trace continuity. Delegation returns an artifact to the manager. A handoff changes who is active. Do not use the labels interchangeably, and do not let framework syntax decide the product behavior.

Visual alternative: In delegation the manager remains active and receives a typed artifact. In handoff the specialist becomes active under a transfer contract.

Sources:

- <https://www.anthropic.com/engineering/building-effective-agents>
- <https://openai.github.io/openai-agents-js/guides/multi-agent/>

## Narration: Parallelism And Joins

Parallelize only proven independence. Two branches are not independent when one needs the other's result, both mutate the same object, or both consume a shared scarce limit without coordination. Give each safe branch its own input snapshot, scope, permission set, budget, idempotency key, timeout, and evidence contract. Then design the join before starting the branches. Name which results are required, which are optional, how long the join waits, who cancels unfinished work, who owns retries, and what happens when evidence conflicts. Define whether a partial result may be shown and how it is labeled. A fast branch does not authorize a missing required branch. A late branch does not silently overwrite accepted evidence. If two reviewers disagree, preserve both judgments and route to a declared adjudication or human decision. Concurrency is an execution choice; the join is the product decision.

Visual alternative: Each branch has isolated scope and budget. The join checks required results, timeout, conflict, cancellation, retry, and partial-failure policy.

Sources:

- <https://www.anthropic.com/engineering/building-effective-agents>
- <https://google.github.io/adk-docs/agents/workflow-agents/>

## Narration: Observe And Limit

Make every route reconstructable. Record a run identifier, parent and child span, active agent, route reason, input and output contract versions, approved tools, decisions, retries, budget consumption, and terminal state. Keep secrets and unnecessary personal data out of telemetry; retain safe hashes and governed references when full content is not appropriate. Bound turns, tokens, cost, elapsed time, tool calls, revisions, and recursive transfers. A limit needs an owner and an outcome when exhausted. OpenAI documents managers and handoffs, Anthropic describes workflow and agent patterns, and Google ADK provides workflow structures. Those are implementation options, not identical guarantees. Define product-level invariants first, map each framework through an adapter, and run the same route, budget, failure, and terminal-state tests. Portability means preserving behavior and evidence, not pretending every SDK uses the same objects.

Visual alternative: Run, route, contract, budget, approval, retry, and terminal-state requirements stay constant across Anthropic, OpenAI, and Google implementation mappings.

Sources:

- <https://www.anthropic.com/engineering/building-effective-agents>
- <https://openai.github.io/openai-agents-js/guides/multi-agent/>
- <https://google.github.io/adk-docs/agents/workflow-agents/>

## Learner Prompt: Learner Pattern Prompt

Choose a real workflow. Identify the one decision, if any, that truly requires semantic routing. Compare a direct call, deterministic graph, manager, and handoff using quality, risk, latency, cost, and debuggability.

Learner action: Select the smallest justified pattern and document why each retained agent boundary exists.

## Pause: Learner Work Time

## Checkpoint: Shared Mutation Checkpoint

Checkpoint. Two proposed branches edit the same curriculum document. Should they run concurrently merely because different models perform the work?

Learner action: Reject default parallel execution because shared mutation requires coordination or serialization.

Sources:

- <https://www.anthropic.com/engineering/building-effective-agents>

## Pause: Checkpoint Response Time

## Feedback: Shared Mutation Feedback

Do not parallelize those writes by default. Different models do not make shared state independent. Serialize the edits, partition the document into nonoverlapping owned regions, or have branches return proposals that a deterministic join reconciles. If you chose concurrency for speed, add the missing state and conflict analysis. If you rejected all parallel work, refine the answer: independent read-only evidence collection may still run concurrently when the join defines required results, disagreement, timeout, and partial failure.

If correct: You recognized that independence is a data and side-effect property, not a model property.

If retrying: Check whether either branch depends on or mutates state used by the other.

Sources:

- <https://www.anthropic.com/engineering/building-effective-agents>
- <https://google.github.io/adk-docs/agents/workflow-agents/>

## Transition: Activity Transition

Open the orchestration design activity. Compare four patterns, create the smallest typed graph, justify any parallel branch, define its join, and simulate normal completion, bad routing, conflicting evidence, specialist timeout, repeated revision, and human escalation. Save the graph and six trace records.

## Pause: Activity Work Time

## Assessment Handoff: Assessment Handoff

When ready, begin the knowledge check. You will choose deterministic control for known steps, distinguish managers from handoffs, reject unsafe parallel mutation, define explicit joins, and explain why route reasons and contract versions belong in traces.

## Closing: Class Closing

Keep known control flow deterministic, justify every agent boundary, parallelize only independence, govern the join, and make every route and ending observable.
