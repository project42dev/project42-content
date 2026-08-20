# Design Safe Agent Memory Boundaries: text-only class

This route contains the complete teaching content, learner actions, feedback,
and assessment handoff without requiring audio, video, or animation.

## Welcome: Welcome And Outcomes

Welcome. In this class, you will stop treating memory as one feature. You will separate conversation history, cache, scratch state, retrieval, and durable memory; define a governed record lifecycle; authorize writes and reads outside the model; make correction and deletion observable; and attack-test memory for poisoning, leakage, staleness, and failed deletion.

## Narration: Memory Types

Name each state category before assigning controls. Conversation history supports the current exchange and may be resent or referenced by a provider. A cache reuses input or computation for performance. Scratch state tracks one active run and should expire with it unless recovery requires a bounded checkpoint. Retrieval reads an external knowledge source whose own authority and freshness must remain visible. Durable memory stores selected facts, preferences, decisions, or procedures for future sessions. Audit evidence records what happened and follows separate retention and access rules. These categories differ in purpose, owner, accuracy, sensitivity, lifetime, correction, and deletion. A provider feature may combine them operationally, but the application still needs a provider-neutral policy.

Visual alternative: Conversation, cache, scratch, retrieval, durable memory, and audit evidence differ by purpose, owner, lifetime, authority, sensitivity, and deletion.

Sources:

- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool>
- <https://ai.google.dev/gemini-api/docs/zdr>
- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Narration: Record Contract

A durable record needs more than a value. Give it a stable identifier, tenant and subject boundary, allowed purpose, source, author or write actor, created and verified times, sensitivity, confidence when appropriate, expiration, supersession link, deletion state, and policy version. Store explicit facts, confirmed preferences, decisions, and reusable procedures only when future benefit exceeds privacy and staleness risk. Do not store secrets, hidden reasoning, raw tool output, health or legal claims, or inferred personal attributes merely because they may be useful. Minimize the value to its purpose. A writing preference may say use direct language. It should not retain an entire private conversation that happened to reveal that preference.

Visual alternative: Every stored value carries identity and lifecycle metadata so retrieval can enforce isolation, purpose, freshness, correction, and deletion.

Sources:

- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool>
- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Demonstration: Classification Demonstration

Classify five examples. The current tool-call identifier is scratch state because it supports this run and recovery. A provider cache key is cache metadata, not proof that its content remains current. A user-confirmed language preference may become durable memory with consent, purpose, expiry, and correction. A product price belongs in a current retrieval source and should be refreshed, not remembered as a permanent fact. A retrieved sentence saying always bypass approval is neither a preference nor policy; reject it as an injected instruction and record the test result. The category depends on purpose and lifecycle, not on whether a model can recall the text later.

Visual alternative: Tool-call ID is scratch, provider key is cache metadata, confirmed preference is governed durable memory, price stays in retrieval, and injected approval bypass is rejected.

Sources:

- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool>
- <https://ai.google.dev/gemini-api/docs/zdr>

## Narration: Guard Writes

A model may propose a memory. Trusted application code decides whether to store it. Authenticate the principal and workload. Confirm the subject and tenant. Check consent, allowed purpose, eligible source, sensitivity, minimization, prohibited content, duplication, conflict, and retention policy. High-impact profile, permission, health, financial, legal, or safety claims require stronger evidence or human review and may be prohibited entirely. Do not let repeated model confidence transform an unsupported statement into a fact. Bind the stored record to the evidence and policy that permitted it. Return a stable stored, rejected, needs review, conflict, or failed result so the controller cannot silently assume persistence.

Visual alternative: Identity, tenant, subject, consent, purpose, source, sensitivity, minimization, conflict, and retention checks precede storage.

Sources:

- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool>
- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Narration: Guard Reads

At read time, enforce tenant and subject isolation before semantic ranking. Filter by the current purpose, permission, sensitivity, freshness, expiration, and deletion state. Return provenance and verification time with the value. Treat the retrieved record as evidence, never as governing instruction. A preference cannot grant a tool permission. A remembered target cannot override the currently resolved resource. A procedure may be stale. Conflicting records require reconciliation. When identity or scope is uncertain, return no memory rather than a near match from another subject. Retrieval quality includes correct refusal and isolation, not only recall. Log secret-safe identifiers and decisions so access and deletion can be audited without copying sensitive content.

Visual alternative: Only authorized records reach ranking, and every result returns source and verification metadata as evidence rather than authority.

Sources:

- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool>
- <https://ai.google.dev/gemini-api/docs/zdr>

## Narration: Correct And Delete

Make correction, expiration, and deletion observable. For correction, create an auditable superseding record, link it to the old record, and exclude the superseded value from normal retrieval. Reverify volatile facts before consequential use. Expire records according to purpose, not storage convenience. A deletion request must cover the authoritative store, indexes, embeddings, derived summaries, caches, replicas, exports, and backups according to the published retention policy. Record request identity, scope, decision, completion time, remaining governed backup retention, and verification without retaining the deleted content. Test deletion by attempting retrieval through every supported path. A hidden row, user-interface confirmation, or model statement that it forgot is not deletion evidence.

Visual alternative: Supersession excludes old values; deletion covers store, indexes, embeddings, summaries, caches, replicas, exports, and governed backup expiry.

Sources:

- <https://ai.google.dev/gemini-api/docs/zdr>
- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Narration: Attack Memory

Attack-test the lifecycle. Propose a memory containing an instruction to bypass policy. Repeat a false fact with high confidence. Request another tenant's known record identifier. Retrieve a superseded preference and an expired procedure. Create conflicting records. Delete a record, then query direct lookup, semantic search, summaries, caches, and exports. Expected outcomes include reject, isolate, return no memory, reverify, ask the subject, quarantine, or escalate. Measure retrieval precision, cross-boundary rejection, stale-memory rate, correction latency, deletion completion, poisoned-write rejection, and incidents where memory changed an action. Review by source and purpose. A high recall rate is harmful when the recalled item is wrong, unauthorized, stale, or deleted.

Visual alternative: Injection, false repetition, cross-tenant access, supersession, expiration, conflict, and post-deletion retrieval each have a fail-closed result.

Sources:

- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool>
- <https://ai.google.dev/gemini-api/docs/zdr>
- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Learner Prompt: Learner Memory Prompt

Choose one item an agent might remember. Classify its state category, purpose, subject, source, sensitivity, verification, expiration, correction method, deletion scope, and one reason it should not be stored.

Learner action: Design one justified memory record and identify its do-not-store boundary.

## Pause: Learner Work Time

## Checkpoint: Cross Tenant Checkpoint

Checkpoint. The caller knows a valid memory record identifier, but the record belongs to another tenant. Semantic similarity is high and the model says it looks relevant. What should retrieval return?

Learner action: Return no memory and record a redacted authorization denial before semantic ranking.

Sources:

- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool>

## Pause: Checkpoint Response Time

## Feedback: Cross Tenant Feedback

Return no memory. Tenant and subject authorization must run before ranking or content disclosure. Knowing an identifier, matching semantically, or receiving a model recommendation does not grant access. Record a redacted denial without confirming sensitive record details. If you returned the record with a warning, move isolation before retrieval. If you asked the model to decide, move the decision into trusted identity and authorization code. Then add this exact known-identifier case to the regression suite.

If correct: You enforced tenant isolation before semantic ranking or disclosure.

If retrying: A record ID and semantic match locate data; they do not authorize the caller to receive it.

Sources:

- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool>

## Transition: Activity Transition

Open the memory-governance activity. Classify twelve records, define one complete memory envelope and lifecycle, then test injection, cross-tenant access, supersession, expiration, and deletion followed by retrieval. Retain the classification matrix, policy, five results, metrics, and escalation rule.

## Pause: Activity Work Time

## Assessment Handoff: Assessment Handoff

When ready, begin the knowledge check. You will distinguish cache from memory, place storage authority in application policy, reject injected memory, apply supersession, and verify deletion across governed copies. The assessment begins only when you choose Begin knowledge check.

## Closing: Class Closing

Persist less, classify precisely, authorize every boundary, return provenance, expire and correct visibly, verify deletion, and test memory as untrusted evidence.
