# Endpoint Identity, Network, and Secrets Security: reduced-motion presentation

Present every visual as a complete static composition. Do not make completion
depend on animation timing, autoplay, or pointer gestures.

## trust-boundary-narration

Display the complete flow and table without animation; highlight one row with a border.

Text alternative: Clients connect to a gateway, then authorization and limits, then an inference runtime and artifact. Separate rows show telemetry, management, secret rotation, and recovery flows.

## boundary-demonstration

Present allowed and denied paths in a static table.

Text alternative: Serving and management paths are separate. The public serving path cannot configure service, the runtime cannot promote artifacts, and telemetry cannot read raw prompts.

## identity-authorization-narration

Show the sequence as a numbered static checklist.

Text alternative: Prompt text and model output are outside the trusted decision boundary. They may request an action but cannot authorize it.

## worked-authorization-demonstration

Show the complete code artifact as static selectable text.

Text alternative: Selectable code shows validated resource binding and a scope mismatch denial before the resource limit and allow path.

## network-management-narration

Show every matrix cell at once with Allowed or Denied text.

Text alternative: Authorized clients reach authenticated inference, operators use a separate management path, and prohibited management and egress paths are denied.

## secrets-resources-narration

Present lifecycle, arithmetic, and malformed-input examples as static selectable text.

Text alternative: The worksheet shows 9 greater than 8, so admission denies the request for resource_limit. Infinity fails structural validation. Secrets do not enter prompts, artifacts, or logs.

## test-and-revoke-narration

Use a static matrix and numbered recovery steps.

Text alternative: Each test records safe denial, no unauthorized side effect, bounded cost, redacted evidence, containment, restoration, and owner.

## lab-executable-entry

Display commands and transcripts as static selectable text with no simulated execution.

Text alternative: The card provides starter, reference, and reset commands and identifies which results are local fixture evidence rather than live infrastructure evidence.

## class-closing

Show the complete checklist as static text.

Text alternative: The checklist states: verify principal, compare scope, bound action, protect data, record safely, revoke, reconcile, and recover.
