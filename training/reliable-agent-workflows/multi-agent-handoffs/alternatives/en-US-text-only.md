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
- <https://adk.dev/agents/workflow-agents/>

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

## Narration: Handoff Invariants Lab Narration

The shared validator checks packet and policy objects before either learner or reference authorization logic runs. A null policy returns invalid_policy rather than throwing. Policy bounds maxDepth and maxTurns are mandatory nonnegative or positive integers, so deleting them cannot turn depth 999 into an accepted transition. Identifiers and action names are trimmed, nonempty strings. Arrays contain values of the documented type. Events are restricted to normal and ambiguous-timeout. Receiver decisions are restricted to accept and reject, and a rejection requires a nonempty reason. Context keys must be a subset of policy.contextAllowlist and the packet schema allowlist. Context facts carry nonempty claim and sourceRef values. Context artifacts are strings. Context facts and artifacts must exactly match their top-level duplicates, preventing the receiver from consuming data that passed a weaker check elsewhere. For every accepted transition, preserve the original goal, constraints, completed-side-effect ledger, and trace identity. The application copies these values into the transition result instead of asking a model to reconstruct them. Visual cue: picture two gates. The validation gate checks structure, provenance, consistency, recipient, event, depth, and budget. The authorization gate calculates the action intersection. Only then may activation occur. Checkpoint: explain why shared validation leaves exactly one learner defect. Starter and reference receive the same validated input; only their effectiveActions calculation differs.

Sources:

- <https://openai.github.io/openai-agents-js/guides/handoffs/>

## Narration: Worked Handoff Example Lab Narration

Triage receives the goal Review four claims and constraint Do not publish. It has recorded save-draft-7 as completed. The packet targets curriculum-reviewer, carries trace-authority, requests read and publish, and has three turns. First, validate packet and policy types. The recipient equals policy.expectedRecipient. Required identifiers are nonblank. The event is normal. Top-level and context facts and artifacts match, and every receiver-consumed fact has provenance. Second, validate the context boundary. Its keys are goal, constraints, traceId, completedSideEffects, facts, and artifacts, all of which appear in the policy allowlist. No untrustedInstruction field reaches the receiver. Third, calculate authority: [read, publish] intersect [read, comment] gives [read]. Removing denied [publish, delete] still gives [read]. Fourth, calculate budget: 3 incoming turns minus 1 transition turn equals 2 remaining receiver turns. Depth 1 does not exceed maxDepth 2. The receiver decision is accept, so the result is status accepted, activeAgent curriculum-reviewer, effectiveActions [read], remainingTurns 2, and traceId trace-authority. Goal, constraints, and completed side effects are copied unchanged. No publication or external approval occurred. Visual cue: use columns labeled Packet, Policy, and Result. Draw read through both gates, stop publish at the policy gate, and show two receiver work turns. Checkpoint: if the result contains publish, the causal defect is that sender-requested authority was copied rather than intersected with recipient policy.

Sources:

- <https://openai.github.io/openai-agents-js/guides/handoffs/>

## Narration: Eight Scenario Traces Lab Narration

correct-transfer is accepted with read and comment. Its result preserves the goal, constraints, completed-side-effect ledger, and trace ID. wrong-recipient is rejected with recipient_mismatch before activation. missing-provenance is rejected because both packet and consumed context contain a fact without sourceRef. excessive-permission is accepted only after [read, publish] is narrowed to [read]. It exposes the deliberate starter defect. poisoned-context is rejected because untrustedInstruction is outside the context allowlist; the validator never interprets that text. timeout returns escalate with reason ambiguous_timeout, next human, and mayRepeatSideEffects false while preserving the ledger. recursive-bounce is rejected because depth 3 exceeds maxDepth 2. rejected-handoff escalates to a human because the receiver explicitly returns reject with evidence_scope_unclear. These traces demonstrate acceptance, rejection, containment, recursion bounds, and human escalation. They do not simulate model quality, network timing, credential issuance, provider approval, or external side effects. Visual cue: group accepted traces in green, rejected traces in red, and escalated traces in amber. Show activeAgent only in the accepted group. Checkpoint: only correct-transfer and excessive-permission activate the specialist among these eight fixtures.

Sources:

- <https://openai.github.io/openai-agents-js/guides/handoffs/>

## Narration: Node22 Repair Lab Lab Narration

The starter has exactly one deliberate defect in src/handoff.mjs: it copies packet.allowedActions. Replace that expression with a filter that retains actions found in policy.recipientAllowed and not found in packet.deniedActions. Do not edit shared validation, fixtures, tests, or reference code. The suite contains the preserved ten cases plus twelve boundary cases. Before repair, exact stdout reports REFERENCE 22/22 and LEARNER 20/22, followed by the two authority failures and RESULT FAIL; exit code is 1. After repair it reports REFERENCE 22/22, LEARNER 22/22, and RESULT PASS; exit code is 0. Independent boundary tests reject an unproven receiver-context fact, null constraint, null return condition, unknown event, absent policy bounds with depth 999, null policy, whitespace identifier, nonstring action, mismatched facts, mismatched artifacts, and negative budget. A zero-work-turn packet pauses without activation. The changed valid packet requests comment and delete. It must remain accepted with comment only, so a deny-all patch fails causally. Visual cue: highlight the single DELIBERATE DEFECT line and draw requested actions and recipient policy into an intersection symbol, followed by subtraction of denied actions. Checkpoint: after repair, explain why excessive-permission and changed-authority-input pass while malformed and inconsistent packets still fail closed.

Sources:

- <https://openai.github.io/openai-agents-js/guides/handoffs/>

## Narration: Recovery And Variation Lab Narration

If an edit causes a syntax error or unrelated failures, copy src/handoff.starter.mjs back to src/handoff.mjs and rerun the root-relative command. After an honest attempt, compare the learner file with reference/handoff.mjs. Do not replace or edit the test driver. For the changed variation, requested [comment, delete] intersected with recipient policy [read, comment] equals [comment]. Removing denied [publish, delete] leaves [comment]. Returning [comment, delete] means the sender widened authority. Returning [] means valid comment work was unnecessarily removed. The expected [comment] distinguishes the intended intersection from both faulty strategies. A zero remaining budget is different from negative budget. Zero produces status paused, activeAgent null, and next parent-or-human because the transition is valid but no receiver turn is available. Negative remaining budget is rejected as budget_exhausted. Recovery after an ambiguous runtime timeout is also different from local code recovery. Preserve the idempotency ledger and escalate without replaying the side effect. Visual cue: split recovery into local-code recovery and runtime recovery. The first restores a file; the second preserves operational evidence and avoids replay.

Sources:

- <https://openai.github.io/openai-agents-js/guides/handoffs/>

## Narration: Ecosystem Transfer Lab Narration

Keep model family, runtime, API, agent adapter, and application policy as separate layers. Meta Llama, Qwen, DeepSeek, Mistral, and Microsoft Phi identify model families or associated projects. A local runtime or hosted API determines inference transport, while an agent framework may add tool or routing abstractions. Do not infer a common native handoff capability from a model-family name. Place the validator and authorization policy in application code unless a separately verified system enforces the same contract. For OpenAI Agents SDK, map typed handoff input and history filtering to the packet while retaining application authorization tests. For Google ADK, map it to the selected workflow structure. For Anthropic-oriented orchestrator-worker designs, preserve typed acceptance and return behavior while distinguishing delegation from user-facing transfer. For Llama, Qwen, DeepSeek, Mistral, or Phi deployments, write an adapter for the actual runtime or API in use. Test serialization, role mapping, authentication, errors, cancellation, and observed tool results separately from fixture policy. Visual cue: draw layers labeled Model family, Runtime or API, Agent adapter, and Application handoff policy. Place permission intersection and idempotency in the application layer. Checkpoint: changing model families must not change the expected permission-intersection result.

Sources:

- <https://openai.github.io/openai-agents-js/guides/handoffs/>

## Narration: Activity Rubric Lab Narration

A complete submission defines triage, specialist, reviewer, and human roles and states why each may receive control. It includes the versioned packet, policy, acceptance response, return result, rejection result, paused result, and escalation result. Full credit requires all eight named scenario traces, recipient validation, context allowlisting, provenance on receiver-consumed facts, duplicate-data consistency, permission intersection, budget arithmetic, maximum recursion, event whitelisting, policy bounds, and fail-closed malformed input. Accepted traces must visibly preserve goal, constraints, completed side effects, and trace identity. Timeout must prohibit replay. Explicit receiver rejection must escalate rather than loop. Zero remaining budget must not activate the receiver. The repair earns credit only when unchanged tests exit 0 and changed-authority-input retains comment while removing delete. A deny-all patch, fixture edit, skipped test, fake execution claim, or copied output without a passing run is insufficient. Separate fixture claims from live-system claims. The learner may report deterministic local results actually observed. The learner may not report provider approval, model behavior, or external action completion because the lab performs none. Visual cue: use a checklist grouped into contract, eight traces, repair, boundary tests, and fixture-versus-live limits. Checkpoint: require one concrete artifact or trace for every rubric claim.

Sources:

- <https://openai.github.io/openai-agents-js/guides/handoffs/>

## Assessment Handoff: Assessment Handoff

When ready, begin the knowledge check. You will distinguish delegation from handoff, identify the packet contract, minimize recipient authority, respond to rejected transfers, and preserve product invariants across provider frameworks.

## Closing: Class Closing

Transfer a validated contract, not a history dump. Preserve intent and trace, narrow context and authority, require acknowledgment, bound failure, and verify every return.
