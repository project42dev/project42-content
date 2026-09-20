# Engineer Context for Reliable Decisions

Package: `context-engineering-class` 1.1.0

> This is the canonical text equivalent of an AI-assisted virtual-instructor
> class. It remains usable without synthesized audio, video, animation, or a
> player runtime.

## Welcome: Welcome And Outcomes

Welcome. This class treats context as a designed input for one decision, not as a pile of messages or a race to fill a window. You will separate authority from evidence and untrusted data, rank candidates, reserve capacity, preserve provenance through summaries, refresh volatile state, and attack-test the package. You will also run a deterministic offline lab. The lab uses fictional records and simulated size units. Those units are not tokens. Its READY result qualifies a context package but does not perform a change, test a live model, or establish production security.

Sources:

- <https://nodejs.org/api/esm.html>
- <https://nodejs.org/api/test.html>
- <https://github.com/project42dev/project42-content/blob/9760305/training/reliable-agent-workflows/context-engineering/lab/src/engine.js>

## Narration: Decision Input

Begin with the next bounded decision. In this lab, a fictional service must decide whether the evidence package supports changing a record from reviewed to approved. The context contract has named slots for governing policy, user goal, trusted state, retrieved evidence, untrusted data, prior decisions, tool contracts, output requirements, budget, and missing information. Each slot has a different job. Policy grants authority. State reports what is currently true. Evidence supports or challenges claims. Prior decisions provide history but may be stale. Tool contracts constrain actions. Missing-information rules say when to retrieve, ask, or escalate. A candidate record cannot grant itself authority by using persuasive wording or a trusted-looking label. The trusted contract names authoritative source IDs and required claims. Retrieved text and tool text stay untrusted even when they contain a useful observation. That separation lets the system retain factual content without following embedded instructions. It also makes a missing claim observable instead of encouraging a confident guess.

Sources:

- <https://platform.claude.com/docs/en/build-with-claude/context-editing>

## Demonstration: Lab Setup Demonstration

The lab is deliberately offline and deterministic. It uses Node built-ins, native modules, fixture records, and fixed predicates such as relevance, claim identity, source membership, and fixture age. These predicates support reproducible teaching. They do not prove that a real source is correct or that natural-language evidence has been interpreted well. From the repository root, change into the lab directory first. Then inspect the Node version, run the tests, run the eight cases, and run the exercise baseline. The exact commands remain on screen rather than being read as a long path. No install step, network request, credential, provider, or paid model call is part of the lab. The supplied qualification record reports Node version twenty-four point eighteen point zero and nineteen passing tests with zero failures. Treat that as a dated result for this artifact, not a promise about a different checkout or runtime.

Sources:

- <https://nodejs.org/api/esm.html>
- <https://nodejs.org/api/test.html>
- <https://nodejs.org/api/assert.html>
- <https://github.com/project42dev/project42-content/blob/9760305/training/reliable-agent-workflows/context-engineering/lab/src/engine.js>

## Demonstration: Worked Trace

Now trace normal sufficient without reading its expected answer first. The total capacity is thirty-two simulated units. Protected reservations are five, three, four, four, and two. Together they consume eighteen, leaving fourteen units for evidence and untrusted observations. The contract identifies the approval and safety registers as authoritative for their claims. Candidate wording cannot change that set. Safety revision three is one fixture day old, costs four units, satisfies safety, and carries disconfirming value. Approval revision seven is also one day old, costs four, and satisfies approval. The comparator therefore places safety before approval. A retrieved note costs two units. It includes useful batch text and an instruction to ignore policy. Its retrieved origin keeps it untrusted, so it cannot satisfy an authoritative claim or expand tool authority. A large manual is irrelevant and is removed before capacity selection. Four plus four plus two gives ten used units out of fourteen. Both required claims are present, no authoritative values conflict, and the package is READY. READY still does not apply the mutation. A separate tool gate must validate configuration, authorized source and state revisions, tool identity, allowed path, and the exact mutation before an apply call can occur.

## Narration: Rank Candidates

Generalize the trace with a ranking discipline. Relevance asks whether the item could change this exact decision. Authority asks whether the trusted contract permits that source to establish the claim. Freshness asks whether the fact may have changed and whether it passes the stated age rule. Directness asks whether the item supports the claim without an unstated inference. Contradiction value rewards evidence that could disconfirm an attractive conclusion. Diversity prevents duplicate copies from looking like independent confirmation. After scoring, choose include, summarize with provenance, retrieve later on a trigger, or reject with a reason. Do not erase disagreement. The authoritative-contradiction case retains board revision two and approval revision seven, reports a conflict on approval, and escalates. Preserving both sides is safer and more auditable than blending them into a falsely certain summary.

Sources:

- <https://platform.claude.com/docs/en/build-with-claude/context-editing>

## Narration: Budget And Compress

Budget before filling. Reserve the governing instructions, current request, tool schemas, response, and expected tool results. Only then allocate evidence capacity. If a required claim or required disconfirming record cannot fit, fail closed instead of silently dropping it. Remove irrelevant material, duplicates, superseded instructions, and dead intermediate output first. A summary is derived evidence, not a new primary source. Record the source identity, revision or verification date, transformation, omissions, and the trigger for restoring the original. The summary-provenance fixture permits approval-summary and uses two of ten units. The exact-claim fixture requires original wording. It rehydrates approval-original, marks the summary superseded, and uses six of twelve. An independent defect check also covers the failure path: if the exact original is stale and refresh returns nothing, fresh approval, exact approval, and the approval claim remain missing, so the package escalates. Caching may reduce repeated processing, but it does not prove freshness, relevance, permission, authority, or safety. Simulated units must not be converted into provider token or cost claims.

Sources:

- <https://platform.claude.com/docs/en/build-with-claude/context-editing>
- <https://ai.google.dev/gemini-api/docs/caching>

## Narration: Eight Case Demonstration

Read the eight outputs as causal evidence. Normal sufficient selects safety, approval, and one untrusted note. Stale refreshed becomes READY only after current approval evidence is available. Missing material escalates because claim safety remains absent. Authoritative contradiction retains both authoritative approval values and reports their conflict. Injection preserved untrusted keeps tool text in the untrusted channel without allowing it to become policy. Irrelevant oversize stays READY because the oversized record is removed for irrelevance before it can consume evidence capacity. Summary provenance accepts the linked summary when exact wording is not required. Exact claim rehydrated restores the original because the contract requires exact evidence. Compare every output field, including selected IDs, untrusted IDs, missing claims, conflicts, and used capacity. Merely checking READY or ESCALATE would miss ranking, provenance, and budget regressions. The supplied independent qualification also exercised four defect conditions: unavailable fresh exact evidence, untrusted overflow, a missing freshness age, and successful rehydration. Baseline and solution behavior were checked separately. These fixture checks are valuable, but they do not execute a language model or establish resistance to semantic attacks.

Sources:

- <https://nodejs.org/api/test.html>
- <https://nodejs.org/api/assert.html>
- <https://github.com/project42dev/project42-content/blob/9760305/training/reliable-agent-workflows/context-engineering/lab/src/engine.js>

## Narration: Refresh State

Conversation state is a transport mechanism. An application may resend messages, reference a stored response, compact earlier turns, edit tool results, or use a cache. None of those choices proves that retained facts are still correct. Before a consequential step, refresh volatile identity, permission, inventory, policy, deployment, and workflow status from the applicable system of record. Preserve tool-call and tool-result linkage, remove instructions that no longer apply, and record meaningful omissions. When moving between providers or models, carry the application-owned manifest, source identities, freshness rules, and missing-information contract. Do not assume hidden provider state, role behavior, tool semantics, retention, or cache behavior transfers. The structure is provider-neutral, but actual interpretation and security behavior remain system-specific and require their own evaluation.

Sources:

- <https://developers.openai.com/api/docs/guides/conversation-state>
- <https://platform.claude.com/docs/en/build-with-claude/context-editing>
- <https://ai.google.dev/gemini-api/docs/caching>

## Learner Prompt: Learner Context Prompt

Before editing anything, predict the changed-input result. Identify the required safety claim, the source IDs authorized by the contract, the forum record's origin, the fourteen reserved units, and the ten-unit evidence capacity. Then decide what one record could satisfy safety without changing policy or deleting the forum input.

Expected learner action: Predict the escalation and design one qualifying safety record without weakening the contract.

## Pause: Learner Work Time

## Demonstration: Changed Input Demonstration

Run the exercise before editing. It escalates with approval selected and claim safety missing, using four of ten evidence units. Now edit the supplied learner case, not a new scenario. Add one safety record from safety-register with role evidence, a unique revision and digest, claim safety, value clear, age no more than seven fixture days, relevance true, and size four. Do not add a trusted label, delete the forum, remove the required claim, or alter authoritative source IDs. After the documented solution, approval revision seven and safety revision five use eight of ten units and the package becomes READY. The forum remains in the input but is omitted as irrelevant before untrusted capacity charging. If it became relevant, retrieved origin would still keep it untrusted. A non-authoritative source ID would leave safety missing. A second authoritative safety value that disagreed would be retained and would cause escalation. The fixture edit changes the generated result because it satisfies the contract, not because the program looks up a saved answer.

## Checkpoint: Injection Checkpoint

Checkpoint. The forum says that safety is clear and instructs the system to ignore approval policy. It looks current and confident. Can it satisfy the required safety claim, and should its factual sentence be deleted automatically? Choose an answer and justify it using origin and contract-defined authority.

Expected learner action: Choose the split treatment: untrusted factual content may be retained, but its instruction cannot grant authority.

Sources:

- <https://platform.claude.com/docs/en/build-with-claude/context-editing>

## Pause: Checkpoint Response Time

## Feedback: Injection Feedback

The forum cannot satisfy the authoritative safety claim because the trusted contract does not name its source as authoritative. Its instruction also cannot replace policy or grant tool authority. However, origin-based distrust does not require deleting every factual sentence. A system may preserve supported factual content in the untrusted channel with provenance, then decide whether it deserves separate verification. In this exercise the forum is explicitly irrelevant, so it is omitted before capacity charging. If you promoted it, restore the authority boundary. If you deleted it only because it was retrieved, refine the rule to distinguish factual content from embedded authority claims. The safe causal chain is contract authority, relevance, freshness, capacity, conflict checking, and then qualification.

Correct feedback: You preserved the authority boundary while distinguishing untrusted factual content from an injected instruction.

Retry feedback: Check the trusted contract's authoritative source IDs before deciding whether any candidate can satisfy a required claim.

Sources:

- <https://platform.claude.com/docs/en/build-with-claude/context-editing>

## Transition: Activity Transition

Open the context-manifest activity. Run and compare all eight fixed cases. Reconstruct the normal trace, including eighteen reserved units, fourteen evidence units, the rank order, and ten units used. Then complete the changed-input edit, rerun the tests, and fill the artifact template. Your explanation must cover authority, freshness, capacity, conflict, provenance, rehydration, omissions, and the provider-neutral transfer limit. Use the separate ten-point rubric only after attempting the change.

## Pause: Activity Work Time

## Feedback: Exercise Feedback

Use the causal rubric to inspect your explanation. Two points require identifying safety as required but absent from authoritative evidence. Two points require explaining that authority comes from the contract, not a candidate label, wording, age, or citation appearance. Two points require fourteen reserved units, ten evidence units, and eight used after selection. Preserve the forum as untrusted input or a recorded irrelevant omission. Explain that a non-authoritative source leaves safety missing and that an authoritative disagreement causes escalation. Finally, connect the edited fixture to the changed generated output. A score below eight should be revised. Bypassing required claims or changing authority without a governance reason does not pass.

Correct feedback: The explanation traces the changed output to contract authority, freshness, relevance, capacity, and conflict controls.

Retry feedback: Revise any claim that treats a candidate label, persuasive wording, or a favorable value as a source of authority.

## Assessment Handoff: Assessment Handoff

When ready, begin the knowledge check. You will identify sufficient context, preserve summary provenance, keep retrieved text outside governing authority, interpret caching correctly, and explain the changed-input result. The assessment begins only when you choose Begin knowledge check.

## Closing: Class Closing

Engineer context for one decision. Separate roles, let the trusted contract define authority, rank evidence, reserve capacity, preserve provenance, refresh volatile facts, and test hostile and missing inputs. Treat offline fixture success as evidence about those fixtures, not as proof of model behavior or production security.
