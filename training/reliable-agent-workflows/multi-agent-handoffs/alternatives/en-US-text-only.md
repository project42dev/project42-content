# Build Auditable Multi-Agent Handoffs: text-only class

This route contains the complete teaching content, learner actions, feedback,
and assessment handoff without requiring audio, video, or animation.

## Welcome: Welcome And Outcomes

Welcome. This class turns multi-agent handoffs into explicit, testable transfers. You will decide between delegation and control transfer, build a versioned packet, minimize context and authority, require acceptance and return evidence, and test failures without depending on one provider framework.

## Narration: Delegate Or Transfer

First decide whether control should move. In delegation, the parent remains responsible for the user-facing outcome. It gives a specialist a bounded subtask, receives a typed artifact, validates that artifact, and performs final synthesis. Research, classification, generation, and review often fit this pattern. In a handoff, the specialist becomes the active agent and continues the next phase under its own instructions. Use that transfer when the specialist must interact directly, the phase has a distinct responsibility, and the transition is understandable to the user. A tool call that invokes another agent may implement either behavior, so SDK syntax is not the definition. Name the control owner before and after the operation, who may speak to the user, who validates the result, and exactly when control returns. If those answers are unclear, keep the parent active.

Visual alternative: Delegation keeps the parent active and returns a typed artifact. Handoff makes the specialist active until a declared return or escalation condition.

Sources:

- <https://openai.github.io/openai-agents-js/guides/handoffs/>
- <https://openai.github.io/openai-agents-js/guides/multi-agent/>
- <https://www.anthropic.com/engineering/building-effective-agents>

## Narration: Handoff Packet Demonstration

Build a packet, not a conversation dump. A curriculum triage agent routes four claims to a source reviewer. The packet identifies the schema version, run and parent span, sender and intended recipient role, routing reason, user goal, accepted constraints, and four claims with source references. It lists the current draft artifact, completed actions and idempotency keys, unresolved questions, allowed read and comment actions, denied publish and delete actions, a three-turn budget, success criteria, and return states for review complete, evidence missing, or policy blocked. The receiver validates required fields, freshness, recipient match, contract version, and permitted authority before accepting. An incomplete packet is rejected with a reason. This makes a transfer reproducible and prevents conversational history from becoming an accidental, ambiguous interface.

Visual alternative: The packet contains schema, trace, sender, recipient, reason, goal, constraints, facts, sources, artifacts, actions, permissions, budget, success, and return states.

Sources:

- <https://openai.github.io/openai-agents-js/guides/handoffs/>

## Demonstration: Handoff Validation Demonstration

Watch the reviewer validate two packets. Packet A names the reviewer role, carries four sourced claims, permits read and comment, denies publication, and defines three return states. It is accepted. Packet B targets a publisher, omits provenance, includes a broad credential, and has no return condition. It is rejected before any model work begins. The rejection records recipient mismatch, missing evidence, excessive authority, and an unsupported terminal contract so the sender can repair or escalate deliberately.

Visual alternative: Packet A has the correct recipient, sourced claims, narrow actions, denied publication, and return states. Packet B fails recipient, provenance, authority, and terminal checks.

Sources:

- <https://openai.github.io/openai-agents-js/guides/handoffs/>

## Narration: Filter And Reauthorize

Minimize what crosses the boundary. Do not forward hidden reasoning, unrelated personal data, secrets, every tool result, or the entire conversation merely because the parent saw it. Select the facts, constraints, artifacts, and source labels the recipient needs. Separate trusted instructions from quoted user material, retrieved text, and other untrusted content. Preserve provenance so the specialist can distinguish a verified fact from an unresolved claim. Then re-evaluate authority for the recipient. Parent credentials do not flow downhill. Resolve the recipient identity and tenant, issue a scoped credential when needed, enforce object-level authorization, and deny tools outside the assigned role. If the specialist changes the target, side effect, data disclosure, or requested scope, require fresh approval. A handoff may narrow authority. It must never silently widen it. Deleting context is not enough if an overpowered credential still allows unrelated action.

Visual alternative: Only required facts and artifacts pass the context filter. The recipient receives read and comment permissions instead of the parent's publish and delete permissions.

Sources:

- <https://openai.github.io/openai-agents-js/guides/handoffs/>
- <https://openai.github.io/openai-agents-js/guides/multi-agent/>

## Narration: Accept Return And Escalate

Require acknowledgment on both sides. The receiver either accepts the packet or rejects it with a typed reason such as wrong recipient, missing provenance, stale artifact, unsupported contract, or excessive permission. Acceptance records the active agent, time, trace, packet hash, and granted budget. Return is also a contract. It contains the outcome state, changed artifacts, evidence produced, tool actions and postconditions, remaining uncertainty, budget used, and requested next decision. The parent validates that result before synthesis or another transfer. Bound repeated bounce-backs, recursive delegation, and revision loops. Track depth and visited roles, cap retries, and reject a transfer that would create a cycle beyond policy. If no eligible recipient accepts, evidence is unavailable, authority conflicts, or time expires, escalate the packet and failure history to a human or deterministic failure path. Do not guess, erase the rejection, or invent success.

Visual alternative: Validated packets may be accepted or rejected. Accepted work returns a typed result. Rejections may be repaired within limits or escalated with history.

Sources:

- <https://openai.github.io/openai-agents-js/guides/handoffs/>
- <https://www.anthropic.com/engineering/building-effective-agents>

## Narration: Provider Mappings And Tests

Keep the portable contract above provider adapters. OpenAI's Agents SDK can represent handoffs as tools, attach typed input, and filter history. Google ADK supplies workflow and agent-team structures. Anthropic describes orchestrator-worker and evaluator-optimizer patterns. These ideas overlap, but they do not promise identical lifecycle, context, guardrail, or authority behavior. Define product invariants independently: correct recipient, minimal context, unchanged or narrower authority, continuous trace, bounded recursion, deterministic rejection, verified side effects, and a typed return artifact. Test a correct transfer plus wrong recipient, missing provenance, excessive permission, poisoned context, timeout, recursive bounce, and unsafe output. Then run adapter tests for each selected provider implementation, including unsupported features and fallback behavior. Portability is proven by equivalent contract outcomes and evidence, not common vocabulary or matching SDK method names.

Visual alternative: Recipient, context, authority, trace, recursion, failure, side-effect, and return invariants remain constant while provider mechanisms differ.

Sources:

- <https://openai.github.io/openai-agents-js/guides/handoffs/>
- <https://openai.github.io/openai-agents-js/guides/multi-agent/>
- <https://www.anthropic.com/engineering/building-effective-agents>
- <https://google.github.io/adk-docs/agents/workflow-agents/>

## Learner Prompt: Learner Handoff Prompt

Choose one workflow with triage, specialist, reviewer, and human roles. Decide which transitions are delegation and which transfer active control. Draft the packet fields, recipient validation, context filter, authority map, budget, and return states.

Learner action: Create a bounded handoff contract that preserves intent and evidence while narrowing context and authority.

## Pause: Learner Work Time

## Checkpoint: Authority Checkpoint

Checkpoint. The parent may publish content, but the reviewer only needs to read evidence and comment. Should the handoff include the parent's publish credential?

Learner action: Give the reviewer only read and comment authority under its own identity.

Sources:

- <https://openai.github.io/openai-agents-js/guides/handoffs/>

## Pause: Checkpoint Response Time

## Feedback: Authority Feedback

Do not forward publish authority. Resolve the reviewer under its own identity and grant only read and comment access to the required objects. Record publish and delete as denied actions. If the reviewer later proposes publication, return that proposal to the authorized parent or a human approval path. If you focused only on removing the publish tool from the prompt, check the credential too; hidden or accidental calls must still fail authorization. Context filtering and permission enforcement must agree.

If correct: You re-evaluated authority for the recipient instead of copying the parent's permissions.

If retrying: Grant only the actions and objects required by the reviewer's assigned task.

Sources:

- <https://openai.github.io/openai-agents-js/guides/handoffs/>
- <https://openai.github.io/openai-agents-js/guides/multi-agent/>

## Transition: Activity Transition

Open the handoff contract activity. Define four roles, create packet and return schemas, filter context, map permissions, and run eight scenarios: correct transfer, wrong recipient, missing provenance, excessive permission, poisoned context, timeout, recursive bounce, and rejection. Save every acceptance, containment, retry, and escalation trace.

## Pause: Activity Work Time

## Assessment Handoff: Assessment Handoff

When ready, begin the knowledge check. You will distinguish delegation from handoff, identify the packet contract, minimize recipient authority, respond to rejected transfers, and preserve product invariants across provider frameworks.

## Closing: Class Closing

Transfer a validated contract, not a history dump. Preserve intent and trace, narrow context and authority, require acknowledgment, bound failure, and verify every return.
