# Secure the Endpoint around the Model: reduced-motion presentation

Present every visual as a complete static composition. Do not make completion
depend on animation timing, autoplay, or pointer gestures.

## trust-boundary-narration

Display the complete table at once and emphasize the current row with text and a border.

Text alternative: Rows connect clients, gateway, inference server, artifact store, secret store, telemetry, and administration. Each row names a principal and policy enforcement point.

## boundary-demonstration

Present allowed and denied flows in a static table rather than animating connections.

Text alternative: The public inference path and private management path are separate. Deny labels prevent inference from promoting artifacts, telemetry from reading prompts, and public clients from changing configuration.

## identity-authorization-narration

Show the policy sequence as a numbered static checklist.

Text alternative: Prompts and model output are shown outside the trusted decision. They can request an action but cannot authorize it.

## network-management-narration

Show all path results simultaneously with Allowed or Denied written in every cell.

Text alternative: Public clients can reach authenticated inference but not management. Operators reach management through an approved path. Unrelated egress and metadata access are denied.

## secrets-resources-narration

Present the lifecycle as numbered text and the resource controls as a static table.

Text alternative: Secrets never enter prompts or artifacts. Body, context, output, rate, concurrency, queue, compute, memory, and time limits each have an enforcement point and observed result.

## negative-tests-recovery-narration

Use a static test matrix and numbered containment-to-restoration steps.

Text alternative: Each negative case must deny safely, produce no unauthorized side effect, keep cost bounded, preserve redacted evidence, and name an approved recovery.
