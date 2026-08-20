# Agents, Tools, and Guardrails: text-only class

This route contains the complete teaching content, learner actions, feedback,
and assessment handoff without requiring audio, video, or animation.

## Welcome: Welcome And Outcomes

Welcome. This class answers a deceptively simple question: what makes an AI system agentic? You will separate model responses from fixed workflows and model-directed loops, choose the simplest design that can satisfy a goal, bound state, tools, budgets, exits, and human handoffs, and evaluate both actions and outcomes. You will also stop and recover when a loop drifts, repeats, exceeds authority, or loses a reliable path to completion.

## Narration: System Types Explanation

Begin by classifying the system, not its brand. A single model call turns an input into an output without controlling a continuing workflow. A deterministic workflow uses code-defined steps and branches, even if a model performs one step. An agentic loop gives a model some control over what happens next: it observes state, chooses a tool or action, receives feedback, updates state, and continues toward a goal. A chat assistant, coding copilot, or named agent may use any of these patterns in different interactions, so the product label is not enough. Ask who selects the next action, whether tools can affect external state, what persists between steps, and who decides that the work is complete. Agentic behavior is a property of the run. It is not proof that the system is autonomous in every context or safe to grant broad authority.

Visual alternative: The comparison asks who controls the next step, whether tools affect systems, what state persists, whether execution loops, and how completion is decided.

Sources:

- <https://www.anthropic.com/engineering/building-effective-agents>
- <https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/>
- <https://adk.dev/agents/>

## Demonstration: Simplest Design Demonstration

Suppose a team wants AI to reset customer passwords. A single model response can explain the approved reset process but cannot perform it. A deterministic workflow can validate identity, issue one reset link, record the event, and stop. An agent might inspect the account, choose among recovery tools, request additional evidence, and adapt to exceptions. If the accepted process has fixed identity and issuance steps, the deterministic workflow is simpler to verify and should remain in control. Model assistance can help explain errors without choosing a weaker identity check. Use an agent only if legitimate cases require bounded adaptation that measured fixed flows cannot provide. Even then, keep reset issuance behind deterministic identity, target, rate, and audit controls. The useful design is not the one with the most autonomy. It is the least complex system that reliably meets the requirement.

Visual alternative: Model advice explains the process. A deterministic flow validates identity and issues one link. An adaptive agent is reserved for measured exceptions and cannot bypass identity controls.

Sources:

- <https://www.anthropic.com/engineering/building-effective-agents>
- <https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/>

## Narration: Bounded Loop Explanation

When an agent is justified, define a run contract before execution. State one bounded goal and observable completion criteria. Identify initial state, permitted memory, artifacts, and sources of truth. Give the agent the smallest tool set and scope each credential to the task. Separate read tools from consequential action tools. Define deterministic validation, exact-target approval, and postcondition checks around every effect. Set maximum turns, tool calls, elapsed time, cost, retries, and concurrent actions. Name success, ordinary failure, unsafe request, invalid state, repeated non-progress, budget exhaustion, uncertain outcome, and human-handoff exits. At each step expose the current goal, relevant state, selected tool, resolved target, expected effect, and next stopping test. Start with one agent. Add routing or specialist agents only when representative evaluations show a simpler design cannot reliably handle distinct tasks.

Visual alternative: The loop observes state, chooses an action, passes deterministic validation, uses a tool, verifies the postcondition, and stops, continues, or hands off under explicit limits.

Sources:

- <https://www.anthropic.com/engineering/building-effective-agents>
- <https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/>
- <https://adk.dev/agents/>

## Learner Prompt: Stop And Approval Prompt

Choose one possible agent task. Write one observable completion condition, one repeated non-progress stop, one maximum budget, one action requiring exact human approval, and one handoff condition.

Learner action: Define explicit completion, non-progress, budget, approval, and handoff boundaries for one agentic run.

Sources:

- <https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/>

## Pause: Stop And Approval Work Time

## Narration: Trajectory Evaluation Explanation

Evaluate the trajectory as well as the final answer. A plausible response can hide a wrong target, excessive permissions, duplicate action, unsupported claim, ignored denial, or unnecessary twenty-step loop. Record the goal and run contract version, state changes, tool choices, resolved arguments, approvals, results, retries, handoffs, stop decision, and final postcondition evidence without logging secrets or unnecessary personal data. Build representative cases for ordinary success, missing information, boundary values, permission denial, malicious retrieved instructions, tool errors, timeout after an external write, repeated non-progress, and recovery. Measure task completion, policy compliance, tool and target accuracy, duplicate or forbidden effects, unnecessary steps, latency, cost, escalation quality, and evidence coverage. Check the real system state independently. The agent's summary is one output to assess, not proof that the requested outcome occurred.

Visual alternative: Each step records state, tool, target, approval, result, postcondition, cost, and the decision to continue, stop, or hand off.

Sources:

- <https://www.anthropic.com/engineering/building-effective-agents>
- <https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/>

## Checkpoint: Non Progress Loop Checkpoint

Checkpoint. An agent searches for a required document, receives no result, rewrites the same query, receives no result, and proposes another nearly identical search. It has used eight of ten allowed turns and has no new evidence. Should the loop continue, and what should the system do?

Learner action: Stop on repeated non-progress, preserve the trajectory, report the missing evidence, and hand off or attempt only an authorized materially different recovery.

Sources:

- <https://www.anthropic.com/engineering/building-effective-agents>

## Pause: Non Progress Response Time

## Feedback: Non Progress Loop Feedback

Stop the loop. The last searches produced no new evidence, and another cosmetic rewrite has no justified path to success. Preserve the queries, results, state, and budget use. Report that the required document was not found. Hand control to a person or use a materially different source or method only if the run contract authorizes it. If you chose to spend the remaining turns, revise the criterion: a turn budget is an outer ceiling, not permission to continue without progress. If you declared failure without preserving the evidence gap, add the gap and attempted searches so recovery does not repeat the same path.

If correct: You stopped repeated non-progress before budget exhaustion and preserved enough evidence for a useful handoff or different recovery.

If retrying: Compare the last steps: if state and evidence did not improve, the remaining turn budget does not justify another equivalent action.

Sources:

- <https://www.anthropic.com/engineering/building-effective-agents>

## Narration: Recovery Explanation

Recover from verified state, not from the agent's narrative. Stop on denied authority, invalid or stale state, repeated non-progress, exceeded budgets, unsafe requests, failed checks, or unknown consequential outcomes. Persist a checkpoint containing the run contract version, safe state references, completed step identifiers, approvals, tool results, postcondition evidence, open uncertainties, and next permitted decisions. Reconcile the real system before resuming. Classify each step as verified complete, confirmed failed, unknown, or unattempted. Resume only after the checkpoint still matches current policy, tools, data, and target state. Compensation and rollback are new actions with their own authority and failure modes. Disable a tool when it exceeds tested behavior. Transfer control when the task needs judgment, credentials, cost, or consequence outside the run contract. A clean handoff says what the goal was, what happened, what remains uncertain, and what decision the person must make.

Visual alternative: The checkpoint records contract, state, approvals, results, postconditions, uncertainties, and next permitted decisions, then routes to resume, compensate, rollback, disable, or handoff.

Sources:

- <https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/>
- <https://adk.dev/agents/>

## Demonstration: Handoff Demonstration

Imagine a support agent may approve refunds below a policy threshold but finds conflicting order records. It has read the case, verified the customer identity, and made no financial change. The correct handoff does not say, refund failed. It states the goal, identifies the two conflicting records, lists the checks already completed, confirms that no refund was issued, records the remaining approval and reconciliation decision, and provides the safe case reference. The person can resolve the conflict without repeating identity work or guessing whether money moved. A handoff is a state contract, not a conversational apology.

Visual alternative: The handoff names the goal, conflicting records, completed checks, confirmed absence of a refund, open decision, and safe case reference.

Sources:

- <https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/>

## Narration: Layered Guardrails Explanation

Place guardrails around the model because the model cannot enforce its own authority. Authenticate the person and workload. Scope credentials to the smallest tool and task. Use allowlists and typed validation for tools, targets, arguments, and outputs. Minimize data and treat retrieved pages, tool results, memory, and messages from other agents as untrusted content. Apply exact approval to destructive, external, costly, privacy-sensitive, and permission-expanding actions. Enforce call, turn, time, cost, and concurrency limits. Sandbox code and file work. Record secret-safe audit evidence and verify postconditions independently. Layer content, policy, and deterministic business checks because no single prompt, classifier, model, or reviewer covers every failure. Test target substitution, stale state, prompt injection, permission denial, duplicate writes, limit exhaustion, and failed handoffs. Fail closed when identity, target, permission, or outcome is uncertain.

Visual alternative: Identity, minimum data, typed tools, exact action approval, budgets, audit, postcondition verification, and human handoff constrain the loop.

Sources:

- <https://www.anthropic.com/engineering/building-effective-agents>
- <https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/>
- <https://adk.dev/agents/>

## Transition: Activity Transition

Open the bounded agent loop activity. Choose one adaptable task and compare a model call, deterministic workflow, and agentic loop. Justify the simplest sufficient design. Complete the run contract with goal, state, tools, authority, checks, budgets, exits, handoff, and recovery. Trace one successful trajectory. Then challenge it with repeated non-progress, malicious instructions inside tool output, and a timeout after an external write. Save the postcondition, audit, stop, and recovery evidence for every case.

Sources:

- <https://www.anthropic.com/engineering/building-effective-agents>

## Pause: Activity Work Time

## Assessment Handoff: Assessment Handoff

When you are ready, begin the knowledge check. You will classify agentic behavior, choose when a deterministic workflow is sufficient, locate enforceable approval, stop a non-progressing loop, and explain why trajectory evidence matters. Review the class or return to the activity before submitting. The assessment begins only when you choose Begin knowledge check.

## Closing: Class Closing

Keep autonomy earned and bounded: choose the simplest system, expose the loop, enforce authority, evaluate every trajectory, and stop with a recoverable handoff.
