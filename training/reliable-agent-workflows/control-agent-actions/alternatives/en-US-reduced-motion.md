# Design Typed Tool Contracts and Action Controls: reduced-motion presentation

Present every visual as a complete static composition. Do not make completion
depend on animation timing, autoplay, or pointer gestures.

## action-risk-ladder

Present all six levels and their controls as a static table.

Text alternative: Read, local reversible edit, external send, production change, permission change, and destruction receive progressively stronger scope, approval, verification, and recovery controls.

## typed-contract

Show the four stages and result variants simultaneously.

Text alternative: Schema validation accepts shape, application validation checks meaning, authorization checks the caller and resolved target, and execution returns a stable result union.

## contract-demonstration

Present the three attempts as static rows with their decision evidence.

Text alternative: The first targets another workspace and is denied. The second mismatches approval and is denied. The third matches caller, target, operation, approval, and postcondition.

## approval-before-impact

Show the approval fields and match decision in a static form.

Text alternative: Execution is allowed only when the current resolved action exactly matches the still-valid approval envelope.

## idempotency-and-unknown

Display every reconciliation branch at once.

Text alternative: After timeout, the controller reconciles real state and chooses prior success, bounded retry after confirmed absence, or unknown and escalation.

## trusted-executor

Present the pipeline as a numbered static checklist.

Text alternative: Authentication, validation, resolution, authorization, approval, limits, idempotency, execution, postcondition, audit, and stable result surround the tool implementation.
