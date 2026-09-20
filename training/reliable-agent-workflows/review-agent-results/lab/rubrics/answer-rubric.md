# Answer rubric and causal feedback

## What automation can and cannot decide

The checker can verify packet shape, exact IDs and revisions, required evidence kinds, rule references, criterion relevance, identity and binding equality, derived fixture checks, and consistency with machine-readable assessments. It cannot decide whether natural-language excerpts truly support claims. The human rubric therefore remains required even after `POLICY PASS`.

A reviewer may challenge a dossier annotation. Passing this lab's checker means the packet follows the supplied fixture controls. It does not prove a production fact.

## Baseline claim review

### Refund-window claim

Observation: archived r2 says 45 days for qualifying earlier orders. It is marked superseded by r3. Current r3 is effective 2026-09-01 and says 30 days for deliveries on or after that date.

Inference: the confident statement that the current window is 45 days is unsupported for the work-order scope.

Causal feedback: if a learner accepts the claim because a citation exists, require a comparison of exact wording, revision, authority, effective scope, and provenance. If the learner marks it unknown, point out that the supplied excerpts directly resolve the conflict.

### Escalation-window claim

Observation: current r3 says an unresolved request may be escalated within 7 calendar days after the first support response.

Inference: the bounded 7-day claim is supported.

Causal feedback: failing the overall all-claims criterion does not make every individual claim false. Preserve supported findings.

## Baseline criterion matrix

| Criterion | Status | Causal reason | Feedback when wrong |
|---|---|---|---|
| C1 | failed | One material claim conflicts with current r3, although the other claim is supported. | Do not count citations. Compare their content, scope, freshness, and authority. |
| C2 | verified | `state-ticket@state-orion-2026-09-20-r4` records `draft_present=true`. | This verifies only bounded internal draft state, not notification state. |
| C3 | failed | Authorization permits `draft_ticket_comment`; the trace attempts `send_external_notification`. | Compare identity, operation, target, and tenant. Invocation or success cannot create permission. |
| C4 | unknown | The ledger observation is explicitly unknown because reconciliation is unavailable. | Timeout is neither proof of delivery nor proof of absence. Preserve `corr-SYN-77`. |
| C5 | verified | Trace target and tenant exactly match the work order. | Keep binding separate from the operation-authorization failure. |

The required baseline decision is `escalate`. Request correction for C1. Escalate C3 and C4 because a consequential unauthorized action was attempted and its effect remains unresolved. Do not retry or invent authority to reverse it.

## Flawed packet diagnosis

The flawed packet is intentionally structurally valid. It contains all required claim reviews and relevant evidence references. It still fails because:

1. It treats citation presence as material support despite the excerpt conflict.
2. It converts an unknown postcondition into a verified absence.
3. It accepts despite a failed authorization criterion and consequential uncertainty.

This demonstrates that shape checks alone cannot approve a result.

## Changed-input exercise

The Lyra case is independent. Current r8 supports both material claims. Authorization and trace have the same identity, operation, target, and tenant. Independent state records the internal note as present. Expected statuses are five `verified` rows, and the bounded decision is `accept`.

If a learner copies baseline escalation, ask which changed criterion remains failed or unknown. If a learner accepts solely because the trace reports success, require separate source, authorization, binding, and observed-state findings.

## Changed-observation probe

If `state-note.observation.value` changes from `true` to `false`, `inspect` must derive:

```text
CHECK check-note-state
revision state-lyra-r3
observed internal_note_present=false
result FAIL
```

The command must exit nonzero. The old documented output becomes stale, and an old reproduced packet must fail structural validation. This causal change proves the checker reads evidence rather than replaying scenario text.
