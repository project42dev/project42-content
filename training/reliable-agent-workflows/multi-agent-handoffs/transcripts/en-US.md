# Build Auditable Multi-Agent Handoffs

Package: `multi-agent-handoffs-class` 1.0.0

> This is the canonical text equivalent of an AI-assisted virtual-instructor
> class. It remains usable without synthesized audio, video, animation, or a
> player runtime.

## Welcome: Welcome And Outcomes

Welcome. This class turns multi-agent handoffs into explicit, testable transfers. You will distinguish delegation from a transfer of control, create a versioned handoff packet, filter context and authority, require acceptance and return evidence, and test failures without depending on a provider. The central rule is simple: transfer a validated contract, not an unexamined history dump. We will also use an offline deterministic lab. Its fixtures are data. They do not prove that a model, provider, tool, approval service, or external action ran.

## Narration: Delegate Or Transfer

First decide whether control should move. In delegation, the parent remains responsible for the user-facing result. It gives a specialist a bounded subtask, receives a typed artifact, validates that artifact, and performs final synthesis. Research, classification, review, and generation often fit this pattern. In a handoff, active control moves. The specialist continues the next user-facing phase under its own instructions. Use that transfer when the specialist must own the next phase and the user can understand the transition. A framework operation that invokes another agent does not, by itself, decide authorization, safe context, budgets, idempotency, or whether a side effect can be repeated. Those are application guarantees. Record who owns the result before and after the operation, who may speak to the user, who validates the output, and when control returns. If the parent must approve and synthesize the specialist artifact, call it delegation. If the specialist becomes the active user-facing role, record an explicit handoff.

Sources:

- <https://openai.github.io/openai-agents-js/guides/handoffs/>
- <https://openai.github.io/openai-agents-js/guides/multi-agent/>
- <https://www.anthropic.com/engineering/building-effective-agents>

## Narration: Handoff Packet Demonstration

Build a packet, not a conversation dump. A triage agent routes four claims to a curriculum reviewer. The packet names schema version one point zero, the run and parent, sender and intended recipient, routing reason, user goal, accepted constraints, and claims with source references. It lists current artifacts, completed actions with idempotency records, unresolved questions, allowed actions, denied actions, a three-turn budget, success criteria, and return conditions. The compact packet is portable because it describes work rather than depending on a particular model or framework. The receiver validates required fields, freshness, recipient match, contract version, and authority before accepting. A stale, incomplete, misrouted, or over-privileged packet is rejected with a reason. Versioning makes the interface inspectable and lets the application change its contract deliberately instead of treating prose history as an accidental API.

Sources:

- <https://openai.github.io/openai-agents-js/guides/handoffs/>

## Demonstration: Handoff Validation Demonstration

Here is a worked validation contrast. Packet A names the reviewer, carries four sourced claims, permits read and comment, denies publish and delete, and defines three return states. It is accepted. Packet B names the wrong recipient, omits provenance, requests excessive authority, and has no return condition. It is rejected before receiver work begins. The rejection is not a model opinion. It is a deterministic contract result. The sender can repair the recipient, evidence, authority, or terminal conditions, or escalate with the failure history. Never convert rejection into silent activation.

Sources:

- <https://openai.github.io/openai-agents-js/guides/handoffs/>

## Narration: Filter And Reauthorize

Minimize what crosses the boundary. Do not forward hidden reasoning, unrelated personal data, secrets, every prior tool result, or the whole conversation merely because the parent saw it. Select the facts, constraints, artifacts, and source labels that the specialist needs. Separate trusted application instructions from quoted user material, retrieved text, and other untrusted data. Preserve provenance so the receiver can distinguish a supported fact from an unresolved claim. Then re-evaluate authority for the recipient. Sender-requested actions are input, not authorization. Effective authority is requested actions intersected with recipient-allowed actions, minus explicitly denied actions. For requested read and publish, recipient policy read and comment, and denied publish and delete, the result is read. Checking only that an action is not denied is insufficient. The action must also be affirmatively allowed for the resolved recipient. Do not conceal a defect with deny-all. A valid request for comment and delete must retain comment when the recipient allows it. A handoff may narrow authority. It must never silently widen it.

Sources:

- <https://openai.github.io/openai-agents-js/guides/handoffs/>
- <https://openai.github.io/openai-agents-js/guides/multi-agent/>

## Learner Prompt: Learner Handoff Prompt

Choose one workflow with triage, specialist, reviewer, and human roles. Decide which transitions are delegation and which transfer active control. Draft the packet fields, recipient validation, context filter, authority map, budget, success criteria, and return states. For each role, state why it may receive control and what must remain with the parent or human.

Expected learner action: Create a bounded handoff contract that preserves intent and evidence while narrowing context and authority.

## Pause: Learner Work Time

## Checkpoint: Authority Checkpoint

Checkpoint. The parent may publish content, but the reviewer only needs to read evidence and comment. Should the handoff include the parent's publish authority? Explain your answer using the requested, allowed, and denied sets.

Expected learner action: Give the reviewer only read and comment authority under its own identity.

Sources:

- <https://openai.github.io/openai-agents-js/guides/handoffs/>

## Pause: Checkpoint Response Time

## Feedback: Authority Feedback

Do not forward publish authority. Resolve the reviewer under its own identity and grant only read and comment access to required objects. Record publish and delete as denied actions. If the reviewer proposes publication, return the proposal to the authorized parent or a human approval path. Removing an action from visible instructions is not enough if a broad credential still permits it. The application must enforce the recipient policy. The causal rule is requested intersected with allowed, followed by subtraction of denied. This preserves valid comment work while removing unauthorized publication.

Correct feedback: You re-evaluated authority for the recipient instead of copying the parent's permissions.

Retry feedback: Grant only actions and objects required by the reviewer's assigned task.

Sources:

- <https://openai.github.io/openai-agents-js/guides/handoffs/>
- <https://openai.github.io/openai-agents-js/guides/multi-agent/>

## Narration: Accept Return And Escalate

Both sides must acknowledge the transfer. The receiver accepts or rejects with a reason. Acceptance records the active agent and granted budget. A return contains a typed outcome, changed artifacts, evidence, tool actions, postconditions, remaining uncertainty, and the next requested decision. Return, rejection, pause, and escalation are distinct. A valid packet with no receiver work turn pauses without activation. A malformed or misrouted packet is rejected. An explicit receiver rejection escalates rather than looping. Bound recursive delegation, repeated bounce-backs, and revision loops. A transition consumes budget before receiver work begins. With three incoming turns and a transition cost of one, three minus one equals two receiver work turns. With one incoming turn and a cost of one, zero work turns remain, so the specialist cannot activate. An ambiguous timeout is not proof that a side effect failed. Preserve the completed-side-effect ledger and idempotency record, prohibit replay, and escalate for human review or a separately verified status lookup.

Sources:

- <https://openai.github.io/openai-agents-js/guides/handoffs/>
- <https://www.anthropic.com/engineering/building-effective-agents>

## Narration: Provider Mappings And Tests

Keep the portable contract above provider adapters. OpenAI's Agents SDK documents handoffs represented as tools, typed handoff input, and history filtering. Google ADK documents workflow-agent structures. Anthropic describes orchestrator-worker and evaluator-optimizer patterns. These are related mechanisms, not identical authorization or lifecycle guarantees. Test application invariants independently: recipient identity, minimal validated context, authority intersection, trace continuity, bounded recursion, deterministic failure, and verified return artifacts. Then add adapter tests for the selected integration, including serialization, provider errors, cancellation, streaming, authentication, and observed tool results. The offline lab calls none of these systems. Its fixture side effects are supplied data, not proof that an action occurred. Portability means equivalent contract outcomes and evidence, not matching method names.

Sources:

- <https://openai.github.io/openai-agents-js/guides/handoffs/>
- <https://openai.github.io/openai-agents-js/guides/multi-agent/>
- <https://www.anthropic.com/engineering/building-effective-agents>
- <https://adk.dev/agents/workflow-agents/>

## Narration: Handoff Invariants Lab Narration

The shared validator runs before learner or reference authorization logic. A null policy returns invalid policy instead of throwing. Policy bounds for maximum depth and maximum turns are mandatory, so deleting them cannot make depth nine hundred ninety acceptable. Identifiers and action names must be trimmed, nonempty strings. Events are limited to normal and ambiguous timeout. Receiver decisions are accept or reject, and rejection requires a reason. Context keys must be allowed. Receiver-consumed facts need nonempty claims and source references. Artifacts must be strings. Context facts and artifacts must exactly equal their top-level copies, preventing weaker validation in one representation from reaching the receiver. Accepted transitions preserve the original goal, constraints, completed-side-effect ledger, and trace identity. Picture two gates: validation checks structure, provenance, consistency, recipient, event, depth, and budget; authorization calculates the action intersection. Only then can activation occur. Shared validation leaves one learner defect because starter and reference receive the same validated input. Their effective-action calculation differs.

Sources:

- <https://openai.github.io/openai-agents-js/guides/handoffs/>

## Narration: Worked Handoff Example Lab Narration

Now work through the accepted transfer. Triage receives the goal Review four claims and the constraint Do not publish. It has recorded save-draft-7 as completed. The packet targets curriculum-reviewer, carries trace-authority, requests read and publish, and has three turns. First, the recipient equals the policy recipient. Required identifiers are nonblank, the event is normal, duplicate facts and artifacts match, and every consumed fact has provenance. Second, the context keys are goal, constraints, trace identity, completed side effects, facts, and artifacts. They all appear in the allowlist. No untrusted instruction field reaches the receiver. Third, calculate authority. Requested read and publish intersected with allowed read and comment gives read. Removing denied publish and delete still gives read. Fourth, calculate budget. Three incoming turns minus one transition turn equals two receiver work turns. Depth one does not exceed maximum depth two. The result is status accepted, active agent curriculum reviewer, effective actions read, remaining turns two, and trace identity trace-authority. Goal, constraints, and completed side effects are copied unchanged. No publication or external approval occurred. If publish appears in the result, the causal defect is copied sender authority rather than intersected authority.

Sources:

- <https://openai.github.io/openai-agents-js/guides/handoffs/>

## Narration: Eight Scenario Traces Lab Narration

Interpret all eight traces. Correct transfer is accepted with read and comment, preserving goal, constraints, completed side effects, and trace identity. Wrong recipient is rejected before activation with recipient mismatch. Missing provenance is rejected because a packet and consumed context fact lack a source reference. Excessive permission is accepted only after read and publish narrow to read, exposing the starter defect. Poisoned context is rejected because an unallowed field never passes validation. Timeout escalates with ambiguous timeout, next human, and replay prohibited while preserving the side-effect ledger. Recursive bounce is rejected because depth three exceeds maximum depth two. Rejected handoff escalates because the receiver explicitly returns reject with evidence scope unclear. Among these eight, only correct transfer and excessive permission activate the specialist. These traces do not simulate model quality, network timing, credential issuance, provider approval, or external side effects.

Sources:

- <https://openai.github.io/openai-agents-js/guides/handoffs/>

## Narration: Node22 Repair Lab Lab Narration

The repair lab is offline and uses Node.js twenty-two native modules and standard-library APIs. Run the supplied root-relative test command. The starter has exactly one deliberate defect: it copies packet allowed actions instead of applying recipient policy. Replace that expression with a filter retaining actions found in policy recipient allowed and absent from packet denied actions. Edit only the learner source file. Do not edit shared validation, fixtures, tests, reference code, or the test driver. The exact starter output is Reference twenty-two out of twenty-two, Learner twenty out of twenty-two, then excessive permission expected read but got read and publish, changed authority input expected comment but got comment and delete, Result Fail. The starter exit code is one. The repaired output is Reference twenty-two out of twenty-two, Learner twenty-two out of twenty-two, Result Pass. The repaired exit code is zero. Boundary tests still reject unproven context facts, null constraints, null return conditions, unknown events, absent policy bounds with depth nine hundred ninety, null policy, whitespace identifiers, nonstring actions, mismatched facts, mismatched artifacts, and negative budget. Zero work turns pauses without activation.

Sources:

- <https://nodejs.org/api/esm.html>
- <https://openai.github.io/openai-agents-js/guides/handoffs/>

## Learner Prompt: Changed Authority Input Task

Now solve the changed valid case before viewing feedback. The requested actions are comment and delete. The recipient policy allows read and comment. The denied actions are publish and delete. What effective actions should the repaired implementation return? Write the set and explain each operation. Your answer must distinguish a valid narrowing from denying every action.

Expected learner action: Answer that the effective action set is comment and show intersection followed by denied-action subtraction.

## Pause: Changed Authority Pause

## Feedback: Changed Authority Feedback

The exact calculation is requested comment and delete intersected with allowed read and comment, which gives comment. Subtracting denied publish and delete leaves comment. Returning comment and delete means the sender widened authority because delete was not allowed. Returning an empty set means the implementation rejected valid comment work and is not the required repair. This is causal feedback: the expected result tests both affirmative recipient permission and explicit denial. A deny-all patch can hide the original excessive-permission failure, but it fails this changed valid input.

Correct feedback: You preserved comment through the recipient-policy intersection and removed denied delete.

Retry feedback: Recompute the intersection first. Do not use the denied set as the only authorization rule.

## Narration: Recovery And Variation Lab Narration

If an edit causes a syntax error or unrelated failures, restore the learner source from the supplied starter file and rerun the root-relative command. After an honest attempt, compare with the reference implementation. Do not replace or edit the test driver. Local code recovery is different from runtime recovery. After an ambiguous timeout, preserve the idempotency ledger, prohibit replay, and escalate or verify status separately. A zero remaining budget is also different from a negative budget. Zero is a valid transition with no receiver work, so status is paused, active agent is null, and the next action goes to the parent or a human. Negative remaining budget is rejected as budget exhausted. The learner may edit only the designated handoff source file. Do not claim a test result unless it was actually observed in the deterministic lab.

Sources:

- <https://nodejs.org/api/esm.html>

## Narration: Ecosystem Transfer Lab Narration

Keep model family, runtime, API, agent adapter, and application policy as separate layers. Llama, Qwen, DeepSeek, Mistral, and Phi identify model families or associated projects. A runtime or hosted API determines inference transport. An agent framework may add tools or routing abstractions. Do not infer a common native handoff capability from a model-family name. Keep validation and authorization in application code unless another system is separately verified to enforce the same contract. Map typed handoff input and history filtering to the OpenAI adapter, workflow structure to the Google adapter, and typed acceptance and return behavior to an Anthropic-oriented orchestrator-worker design. For other deployments, test the actual adapter's serialization, role mapping, authentication, errors, cancellation, and observed tool results. Changing model families must not change the expected permission calculation. The fixture policy remains application behavior, not a property inferred from the model name.

Sources:

- <https://openai.github.io/openai-agents-js/guides/handoffs/>
- <https://www.anthropic.com/engineering/building-effective-agents>
- <https://adk.dev/agents/workflow-agents/>
- <https://github.com/meta-llama/llama-models>
- <https://github.com/QwenLM/Qwen3>
- <https://github.com/deepseek-ai/DeepSeek-V3>
- <https://github.com/mistralai/mistral-inference>
- <https://github.com/microsoft/PhiCookBook>

## Narration: Activity Rubric Lab Narration

Evaluate evidence rather than presentation. A complete submission defines triage, specialist, reviewer, and human roles and explains why each may receive control. It includes the versioned packet, policy, acceptance response, return result, rejection result, paused result, and escalation result. Full credit requires all eight named traces, recipient validation, context allowlisting, provenance on consumed facts, duplicate-data consistency, permission intersection, budget arithmetic, maximum recursion, event whitelisting, policy bounds, and fail-closed malformed input. Accepted traces preserve goal, constraints, completed side effects, and trace identity. Timeout prohibits replay. Explicit receiver rejection escalates rather than loops. Zero remaining budget does not activate the receiver. The repair earns credit only when unchanged tests exit zero and the changed case retains comment while removing delete. A deny-all patch, fixture edit, skipped test, fake execution claim, or copied output without a passing run is insufficient. Separate deterministic fixture claims from live-system claims. This lab performs no provider approval, model call, or external action.

Sources:

- <https://openai.github.io/openai-agents-js/guides/handoffs/>

## Transition: Activity Transition

Open the handoff contract activity. Define the four roles, create packet and return schemas, filter context, map permissions, and run the eight scenarios: correct transfer, wrong recipient, missing provenance, excessive permission, poisoned context, timeout, recursive bounce, and rejected handoff. Record acceptance, rejection, pause, return, containment, retry, and escalation traces. Include the exact starter and repaired outputs only when observed, and include a fixture-versus-live statement.

## Pause: Activity Work Time

## Assessment Handoff: Assessment Handoff

When ready, begin the knowledge check. You will distinguish delegation from handoff, identify the packet contract, calculate effective authority, validate consumed context, handle zero budget and ambiguous timeout, and preserve invariants across provider adapters. The check contains eight questions and requires eighty percent for a pass.

## Closing: Class Closing

Transfer a validated contract, not a history dump. Preserve intent, provenance, completed side effects, and trace identity. Filter context, reauthorize actions for the recipient, require acknowledgment, bound recursion and budget, distinguish rejection from pause and escalation, prohibit replay after ambiguous timeout, and verify every return. If you cannot show the evidence, do not claim the transition succeeded.
