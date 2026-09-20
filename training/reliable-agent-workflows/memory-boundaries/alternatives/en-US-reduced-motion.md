# Design Safe Agent Memory Boundaries: reduced-motion presentation

Present every visual as a complete static composition. Do not make completion
depend on animation timing, autoplay, or pointer gestures.

## memory-types

Present the complete comparison as a static table.

Text alternative: Conversation supports an exchange, cache reuses work, scratch serves one run, retrieval reads an external source, and durable memory persists selected information.

## record-contract

Show the envelope as a numbered static record.

Text alternative: The record includes a stable ID, tenant, subject, purpose, source, timestamps, sensitivity, expiration, supersession, and deletion state.

## guard-writes

Present the write checks as a static ordered list.

Text alternative: A proposed value is stored only after current context, consent, purpose, source, sensitivity, freshness, and content checks.

## guard-reads-and-replay

Display the read and replay pipeline as a static sequence.

Text alternative: Authorization precedes receipt reuse; derived copies point to canonical records; changed boundaries or payloads conflict.

## correct-expire-delete

Show every lifecycle state and copy flag in one static table.

Text alternative: The old record becomes superseded; active copies become false; backup remains true until purge; completion follows actual backup removal.

## lab-setup-and-tests

Show commands and expected status in a static terminal transcript.

Text alternative: The learner enters the lab directory, runs nineteen main tests, and runs the deterministic demo.

## demo-trace

Present the full exact output and causal annotations in a static table.

Text alternative: The trace moves from mem_001 to superseding mem_002, removes active copies, blocks lookup, resists a false completion claim, and completes after backup purge.

## solution-and-rubric

Show the complete rubric as a static scoring table.

Text alternative: Points cover trusted setup, isolation and revocation, correction, pending deletion, completion and minimization, and honest limits.

## limits-and-transfer

Present demonstrated and unproven claims in a static comparison.

Text alternative: The lab demonstrates policy logic and observable states but does not guarantee production durability, security, erasure, compliance, or provider equivalence.
