# Design Typed Tool Contracts and Action Controls: reduced-motion presentation

Present every visual as a complete static composition. Do not make completion
depend on animation timing, autoplay, or pointer gestures.

## action-risk-ladder

Display the full table without animation.

Text alternative: Read, reversible local change, external communication, production change, permission change, and destructive change receive distinct controls.

## runtime-input-contract

Show all mappings simultaneously.

Text alternative: The action name, ticket identifier, destination status, operation key, and expected revision each have a narrow validation rule.

## runtime-output-contract

Present all result branches as a static table.

Text alternative: Success confirms the effect, invalid rejects malformed data, denied rejects current permission or policy, conflict reports incompatible state, and uncertain requires reconciliation.

## exact-approval

Show both gates and their fields without motion.

Text alternative: Actor scope and policy authorize the resolved resource; approval separately matches actor, tenant, action, target, status, revision, and operation key.

## trusted-executor-sequence

Display the complete ordered checklist at once.

Text alternative: Validation, idempotency, authorization, revision, approval, limits, mutation, and independent verification occur in order.

## worked-state-transition

Present before and after states in adjacent static panels.

Text alternative: Before execution there are zero mutations and receipts. After verified execution there is one mutation, one matching receipt, and a success result.
