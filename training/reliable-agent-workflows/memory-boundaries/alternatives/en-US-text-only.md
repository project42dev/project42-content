# Design Safe Agent Memory Boundaries: text-only class

This route contains the complete teaching content, learner actions, feedback,
and assessment handoff without requiring audio, video, or animation.

## Welcome: Welcome And Outcomes

Welcome. In this class, you will stop treating memory as one feature. You will distinguish five state categories, define a governed durable record, enforce writes and reads in trusted code, and observe correction, expiration, and deletion. Then you will use an offline lab to test poisoning, cross-subject access, revoked consent, canonical-copy trust, exact retries, supersession, and backup-pending deletion. The goal is not maximum recall. The goal is justified, authorized, current evidence that cannot silently expand an agent's authority.

## Narration: Memory Types

Begin by naming the state. Conversation history supports the current exchange and may be resent or referenced by a provider. A cache reuses input or computation for performance. Neither a cache hit nor repeated text proves that a fact is current. Scratch state tracks one active run, such as a tool-call identifier or retry checkpoint, and normally expires with that run. Retrieval reads an external source, so its authority, publication context, and freshness should remain visible. Durable memory persists selected facts, preferences, decisions, or procedures across sessions. A current price belongs in retrieval. A temporary tool identifier belongs in scratch. A confirmed writing preference may qualify as durable memory. Provider features can combine these categories, but do not infer equivalent retention, deletion, security, or behavior. Preserve the application boundary and verify each provider's actual controls.

Visual alternative: Conversation supports an exchange, cache reuses work, scratch serves one run, retrieval reads an external source, and durable memory persists selected information.

Sources:

- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool>
- <https://ai.google.dev/gemini-api/docs/zdr>
- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Narration: Record Contract

A durable value needs identity and lifecycle metadata. Give it a stable identifier, tenant, subject, purpose, value, source, creation time, verification time, sensitivity, expiration, supersession link, and deletion state. An application can add author, confidence, or policy version when needed. Trusted execution context supplies tenant, subject, and purpose. Never derive those boundaries from the proposed value. Store explicit facts, confirmed preferences, decisions, and reusable procedures only when future benefit exceeds privacy and staleness risk. Avoid secrets, hidden reasoning, broad raw conversations, and unsupported sensitive inferences. Provenance tells you where a claim came from, not whether it is true. Verification time supports freshness, not permanent validity. Metadata enables policy checks, but metadata does not replace them. Current authorization must still run whenever the record is written, read, corrected, expired, or deleted.

Visual alternative: The record includes a stable ID, tenant, subject, purpose, source, timestamps, sensitivity, expiration, supersession, and deletion state.

Sources:

- <https://github.com/project42dev/project42-content/blob/b644206/training/reliable-agent-workflows/memory-boundaries/lab/src/memory.js>
- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Narration: Guard Writes

The model may propose a memory, but trusted application code decides whether it persists. The gate checks authenticated context, tenant, subject, allowed purpose, current consent, eligible source, sensitivity, verification time, expiration, minimization, and prohibited content. In the lab, trusted fixture context supplies the boundary. That demonstrates separation between data and control, but it is not production authentication. The lab also uses a regular expression to detect a few instruction-like phrases. It can miss subtle attacks and reject benign matches, so it is not a semantic safety proof. A repeated unsupported claim does not become true through confidence. Return explicit stored, denied, poisoned, conflict, or failed results. Do not let a controller assume that a proposal persisted merely because a model generated it.

Visual alternative: A proposed value is stored only after current context, consent, purpose, source, sensitivity, freshness, and content checks.

Sources:

- <https://github.com/project42dev/project42-content/blob/b644206/training/reliable-agent-workflows/memory-boundaries/lab/src/memory.js>
- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Narration: Guard Reads And Replay

Reads enforce the complete boundary before returning content. Check current tenant, subject, purpose, consent, eligible source, sensitivity, freshness, supersession, and deletion. Current policy matters even when a record was allowed yesterday. A revoked consent must block a cache read today. The authoritative store is the canonical copy. Indexes, summaries, caches, and backups are derived. If a cache value is tampered with, the lab still resolves the authoritative record and returns its canonical value and provenance. If canonical freshness metadata is malformed, the record is unreadable. Treat every result as evidence, never as policy or permission. Request identity has a similar boundary. A request ID binds the operation, full tenant-subject-purpose boundary, and exact payload. An exact retry can return the same receipt only after current authorization succeeds. A changed payload or boundary produces a conflict. This prevents accidental replay from borrowing another operation's identity.

Visual alternative: Authorization precedes receipt reuse; derived copies point to canonical records; changed boundaries or payloads conflict.

Sources:

- <https://github.com/project42dev/project42-content/blob/b644206/training/reliable-agent-workflows/memory-boundaries/lab/src/memory.js>

## Narration: Correct Expire Delete

Correction appends instead of silently overwriting. The new record names the old record in its supersedes field, while every old copy is marked superseded and excluded from normal retrieval. This preserves an auditable causal history without returning stale values. Expiration is also observable. Once policy says a record is expired, remove active copies, create value-free tombstone and deletion metadata, and retain any governed backup only until its purge time. Deletion then has two distinct states. Active removed means the store, index, summary, and cache no longer support retrieval. Pending backup means a backup copy still physically exists in this simulation but has no retrieval authority because the canonical active record and authorization path are gone. A correct deletion request does not prove that backup deletion finished. A receipt must report actual copy states and omit deleted values. Only reconciliation after inspecting real state can report completed.

Visual alternative: The old record becomes superseded; active copies become false; backup remains true until purge; completion follows actual backup removal.

Sources:

- <https://github.com/project42dev/project42-content/blob/b644206/training/reliable-agent-workflows/memory-boundaries/lab/src/memory.js>
- <https://ai.google.dev/gemini-api/docs/zdr>

## Demonstration: Lab Setup And Tests

Now use the offline lab. Start at the repository root and enter the lab directory. Run the main test command. It defines nineteen tests. Then run the demo directly. The supplied qualification record reports those nineteen tests and one separate solution test passing under Node version twenty-four point eighteen point zero, plus the exact demo and five independent probes. Test-runner decorations and timing can vary, so compare the application's demo lines with the expected demo file. The implementation uses five independent in-memory maps: store, index, summary, cache, and backup. Its clock is fixed at September twentieth, twenty twenty-six, twelve hundred UTC. Backup retention comes from a synthetic fixture, not a provider promise or legal standard.

Visual alternative: The learner enters the lab directory, runs nineteen main tests, and runs the deterministic demo.

Sources:

- <https://github.com/project42dev/project42-content/blob/b644206/training/reliable-agent-workflows/memory-boundaries/lab/src/memory.js>
- <https://nodejs.org/api/esm.html>
- <https://nodejs.org/api/test.html>

## Demonstration: Demo Trace

Read the trace in order. Write creates record zero zero one at the fixed clock. Read returns its short-paragraph preference as evidence, with user-confirmed provenance and timestamps. Correct creates record zero zero two, which supersedes the first. Current retrieval returns only the corrected preference. Delete reports pending backup. Store, index, summary, and cache are false, while backup remains true. Lookup returns an empty list because a retained backup is not authorized retrieval evidence after active deletion. Early reconciliation receives a false caller claim, inspects actual state, and remains pending. At September twenty-four, twelve hundred UTC, final reconciliation removes the backup and reports completed with every copy false. Notice what is not in either receipt: neither deleted preference value. The receipt retains state and provenance, not content.

Visual alternative: The trace moves from mem_001 to superseding mem_002, removes active copies, blocks lookup, resists a false completion claim, and completes after backup purge.

Sources:

- <https://github.com/project42dev/project42-content/blob/b644206/training/reliable-agent-workflows/memory-boundaries/lab/src/memory.js>

## Checkpoint: Deletion Checkpoint

Checkpoint. The deletion request succeeded, and every active lookup is empty, but the receipt says backup true. Is deletion completed? Pause and answer with the observed state that determines your conclusion.

Learner action: Answer that active removal succeeded but deletion remains pending because the actual backup copy exists.

Sources:

- <https://github.com/project42dev/project42-content/blob/b644206/training/reliable-agent-workflows/memory-boundaries/lab/src/memory.js>

## Pause: Deletion Response Time

## Feedback: Deletion Feedback

The honest answer is pending backup. Empty lookup proves that active retrieval paths are closed. It does not prove that a backup copy is gone. Request acceptance also does not prove erasure. Completion occurs only when reconciliation observes every governed copy as absent after the synthetic purge time. If your answer was completed, separate request handling, active removal, and backup removal into distinct states. If your answer relied on the caller's claim, make reconciliation inspect controlled state instead.

If correct: You distinguished active retrieval removal from actual backup completion.

If retrying: An accepted request and empty lookup do not establish that a retained backup has been purged.

Sources:

- <https://github.com/project42dev/project42-content/blob/b644206/training/reliable-agent-workflows/memory-boundaries/lab/src/memory.js>

## Learner Prompt: Changed Input Exercise

Now attempt the changed-input exercise before looking at the solution. Use the restricted notification preference. Capture IDs returned by write and correction rather than assuming literal memory IDs. Cause another subject to be denied. Revoke consent after writing and prove a cache read fails. Restore consent, append a correction, and prove normal retrieval excludes the old ID. Request deletion, submit a false completion claim, and prove the receipt stays pending while backup lookup returns no content. Verify receipts contain provenance but neither value. Advance the explicit clock to the purge time and verify every copy is false. Record why each changed input caused its result.

Learner action: Implement and explain the notification-preference lifecycle using returned operation IDs and observable policy changes.

Sources:

- <https://github.com/project42dev/project42-content/blob/b644206/training/reliable-agent-workflows/memory-boundaries/lab/src/memory.js>

## Pause: Exercise Work Time

## Demonstration: Solution And Rubric

After your attempt, run the separate solution test and compare its operations, not just its assertions. Score ten points causally. Trusted changed setup and generated IDs earn two. Subject isolation and live revocation earn two. Restored-consent correction and exclusion of the superseded ID earn two. Active removal, empty backup lookup, and pending status despite a false claim earn two. Clock-driven completion, all copy states false, value-free receipts, and retained provenance earn one. Honest heuristic and simulation limits earn one. Editing internal maps, hardcoding the first memory ID, or asserting expected constants without invoking lifecycle operations caps the score at five. Returning pending-deletion content from any layer cannot pass.

Visual alternative: Points cover trusted setup, isolation and revocation, correction, pending deletion, completion and minimization, and honest limits.

Sources:

- <https://github.com/project42dev/project42-content/blob/b644206/training/reliable-agent-workflows/memory-boundaries/lab/src/memory.js>
- <https://nodejs.org/api/test.html>

## Narration: Limits And Transfer

Transfer the pattern carefully. The fixture's tenant, subject, purpose, and consent values are controlled test inputs, not evidence of production identity assurance. The delimiter check is specific to its synthetic consent-key format. The injection regex can miss semantic attacks. Five in-memory maps do not establish process durability, encryption, secure erasure, distributed concurrency safety, backup behavior, privacy compliance, or legal compliance. The retention interval is synthetic. Provider documentation can describe a provider feature, but this lab does not prove equivalence among providers. In production, validate identity, authorization, storage, indexes, summaries, caches, replicas, exports, backups, retention, audit access, and deletion evidence against the systems actually deployed. Preserve the core rule: generated content is data, current trusted policy governs use, canonical state outranks derived state, and receipts describe only what has actually been observed.

Visual alternative: The lab demonstrates policy logic and observable states but does not guarantee production durability, security, erasure, compliance, or provider equivalence.

Sources:

- <https://github.com/project42dev/project42-content/blob/b644206/training/reliable-agent-workflows/memory-boundaries/lab/src/memory.js>
- <https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool>
- <https://ai.google.dev/gemini-api/docs/zdr>
- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Transition: Activity Transition

Open activity memory governance. Submit your state-classification matrix, complete lifecycle policy, exact demo trace, changed-input test, causal artifact, and rubric score. Include one do-not-store rule and one escalation rule for poisoned, stale, conflicting, or privacy-sensitive evidence.

## Assessment Handoff: Assessment Handoff

When ready, begin the five-question knowledge check: q memory boundaries one, q memory boundaries two, q memory boundaries three, q memory boundaries four, and q memory boundaries five. You will distinguish cache from durable memory, place storage authority in trusted policy, reject injected instructions, apply supersession, and report backup-pending deletion honestly. Begin only when you choose the knowledge check.

## Closing: Class Closing

Classify state before storing it. Bind durable records to trusted boundaries and provenance. Evaluate current policy on every read. Trust canonical state over derived copies. Replay only exact authorized operations. Correct by superseding, expire visibly, and distinguish active removal from backup completion. Treat memory as evidence, not authority, and claim only what your observations prove.
