# Design a Bounded Agent Loop: text-only class

This route contains the complete teaching content, learner actions, feedback,
and assessment handoff without requiring audio, video, or animation.

## Welcome: Welcome And Outcomes

Welcome. In this class, you will turn an adaptable goal into a bounded agent run. You will decide whether an agent is justified, write a work order that removes hidden decisions, separate trusted authority from untrusted observations, make every transition visible, and stop with truthful evidence when the system completes, needs help, runs out of budget, or cannot determine whether an action succeeded.

## Narration: Workflow Or Agent

Begin by asking whether the path is known. A deterministic workflow uses code-defined steps and branches. A model may help classify or draft inside one step, but code still decides what happens next. A model-directed loop is useful when observations change the next reasonable action and enumerating every path is impractical. That flexibility creates more states, failure modes, and evidence requirements. Start with the simplest design that can meet the outcome. Add an agent only when representative cases show that fixed orchestration cannot handle necessary variation. The word agent is not a quality measure. A reliable fixed workflow is better than an adaptable loop that cannot prove what it changed or why it stopped.

Visual alternative: Fixed workflows use code-defined paths. Bounded agents may select the next action, but require explicit authority, budgets, evidence, terminal outcomes, and recovery.

Sources:

- <https://www.anthropic.com/engineering/building-effective-agents>
- <https://www.nist.gov/itl/ai-risk-management-framework>

## Narration: Work Order Contract

Before any tool is available, write the work order. State the outcome as something that can become true in the world, not as a vague instruction to improve or investigate. Name allowed files, systems, records, and time range. Identify trusted inputs and systems of record. List constraints and what must remain unchanged. Define the audience when it changes tone, risk, or verification. Then define evidence: tests, rendered output, citations, an approved diff, a postcondition query, or another observation independent of the model's final message. Include non-goals so a useful idea does not silently expand scope. Record who may authorize a change in permission, cost, external impact, or target. The work order is the run's authority boundary and success contract.

Visual alternative: The card lists outcome, allowed scope, trusted inputs, constraints, non-goals, required evidence, approval owner, and stopping conditions.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>

## Demonstration: Work Order Demonstration

Consider the request, update the support guide. It hides several decisions. A bounded version says: update only the password-reset guide for the current documented process; use the approved policy and tested application behavior as sources; do not change policy, account permissions, or other guides; preserve accessibility and links; finish only when the content diff is reviewed, links pass, and the rendered page matches the approved process. If the sources conflict, stop for the policy owner. If a new authentication exception is needed, stop because that changes policy. The agent can now adapt its research and editing steps without receiving permission to rewrite the entire support system.

Visual alternative: The bounded request limits one guide, names approved evidence, protects policy and permissions, requires review, link, and render evidence, and escalates source conflict.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>

## Narration: Trust Boundary

Keep authority separate from observations. A web page, issue, document, log, retrieved passage, tool result, memory entry, or message from another agent may contain instructions. Those instructions are data to analyze unless a trusted authority deliberately placed them in the work order or governing policy. Label provenance, trust, freshness, and sensitivity. If retrieved text says to ignore an approval, change the destination, reveal a secret, or broaden access, reject that instruction and record the conflict. Low-risk ambiguity may permit a documented assumption when the work order allows it. Ambiguity that changes scope, permission, cost, target, or external impact requires authorization. More context cannot grant more authority.

Visual alternative: Trusted work order and policy define authority. Retrieved pages, issues, logs, tools, memory, and agent messages remain untrusted observations.

Sources:

- <https://www.anthropic.com/engineering/building-effective-agents>
- <https://www.nist.gov/itl/ai-risk-management-framework>

## Narration: State And Transition

Represent the run as state, not as a conversation. Record the contract version, current objective, verified facts, unresolved evidence, completed action identifiers, approvals, remaining budgets, and next allowed actions. Each iteration inspects the environment, proposes a decision, validates identity and authority, executes at most one bounded action, verifies the postcondition, and records a transition. The controller accepts finish only when independent evidence satisfies the success contract. A fluent summary is not a terminal signal. For consequential actions, the transition must distinguish requested, authorized, attempted, accepted, completed, failed, and outcome unknown. That distinction prevents a timeout from being treated as proof that nothing happened.

Visual alternative: The state ledger records contract, facts, evidence, actions, approvals, budgets, and allowed decisions. Finish requires independent success evidence.

Sources:

- <https://www.anthropic.com/engineering/building-effective-agents>
- <https://www.nist.gov/itl/ai-risk-management-framework>

## Narration: Terminal Outcomes

Define terminal outcomes before execution. Succeeded means every required postcondition passed. Failed means the run stopped and the evidence confirms the requested outcome was not achieved. Unknown means a consequential effect cannot yet be reconciled. Needs approval means the next exact action exceeds current authority. Refused means the request violates policy. Cancelled means an authorized cancellation was observed. Budget exceeded means a hard limit ended the run. Repeated non-progress means equivalent actions changed neither state nor evidence. These outcomes must not collapse into success or a generic error. Each one tells the learner or operator what is known, what remains uncertain, and which recovery actions are permitted.

Visual alternative: Succeeded, failed, unknown, needs approval, refused, cancelled, budget exceeded, and repeated non-progress each require different evidence and next steps.

Sources:

- <https://www.anthropic.com/engineering/building-effective-agents>
- <https://www.nist.gov/itl/ai-risk-management-framework>

## Learner Prompt: Learner Terminal Prompt

Choose one agent task. Write its independently observable success condition, one exact approval boundary, one no-progress rule, one budget limit, and the evidence required to report an unknown outcome.

Learner action: Define success, approval, no-progress, budget, and unknown-outcome evidence for one bounded run.

## Pause: Learner Work Time

## Checkpoint: No Progress Checkpoint

Checkpoint. A research agent has tried three nearly identical searches. Each returned the same two documents, neither contains the required fact, and the state ledger shows no new evidence. Six of ten turns remain. Should the controller allow another equivalent search?

Learner action: Stop for repeated non-progress and preserve the evidence gap instead of spending the remaining budget.

Sources:

- <https://www.anthropic.com/engineering/building-effective-agents>

## Pause: Checkpoint Response Time

## Feedback: No Progress Feedback

Stop the equivalent search. The budget is a ceiling, not a reason to continue. Preserve the queries, results, evidence digest, and missing fact. Report repeated non-progress. A materially different source or method may be attempted only if it is allowed by the work order and has a reasoned chance to change the evidence state. Otherwise hand off. If you chose to continue because turns remain, revise your rule so progress depends on a meaningful state or evidence change. If you stopped but discarded the search history, preserve it so recovery does not repeat the same path.

If correct: You stopped a no-progress cycle and preserved evidence for a materially different recovery or useful handoff.

If retrying: Compare evidence before and after each action. Remaining budget cannot justify an equivalent transition that produced no progress.

Sources:

- <https://www.anthropic.com/engineering/building-effective-agents>

## Narration: Recovery Checkpoint

A recoverable stop preserves the contract version, safe state references, verified facts, completed action identifiers, approvals, tool results, postcondition evidence, open uncertainties, budget use, and next permitted decisions. Reconcile the real environment before retrying a consequential action. Classify prior steps as verified complete, confirmed failed, unknown, or unattempted. Resume only if current policy, credentials, data, tools, and targets still match the checkpoint. A retry, rollback, or compensation is a new action with its own authority and failure modes. A useful human handoff states the goal, what was verified, what remains uncertain, what did not occur, and the exact decision required.

Visual alternative: The checkpoint records contract, state, facts, actions, approvals, results, postconditions, uncertainty, budgets, and allowed decisions before resume or handoff.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>

## Transition: Activity Transition

Open the bounded agent loop activity. Write the success contract, allowed actions, trusted observations, approval boundaries, explicit state, budgets, and terminal outcomes. Simulate normal completion, three identical no-progress transitions, budget exhaustion, and an untrusted observation containing an instruction. Retain the transition log and exact evidence for every terminal result.

## Pause: Activity Work Time

## Assessment Handoff: Assessment Handoff

When you are ready, begin the knowledge check. You will identify a bounded work order, classify retrieved instructions, verify a finish decision, stop repeated non-progress, and choose useful loop budgets. Review the class or return to the activity before submitting. The assessment begins only when you choose Begin knowledge check.

## Closing: Class Closing

A bounded agent earns flexibility through explicit authority, observable state, independent evidence, hard budgets, truthful terminal outcomes, and recoverable stops.
