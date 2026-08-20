# Expose a Model Service without Hiding Its Contract: reduced-motion presentation

Present every visual as a complete static composition. Do not make completion
depend on animation timing, autoplay, or pointer gestures.

## serving-layers-narration

Display all layers simultaneously as a static table and highlight the current row with text and a border.

Text alternative: The public contract sits above an application adapter, gateway, inference server, and runtime. Each row lists owned and forbidden responsibilities.

## layer-demonstration

Show the two mappings side by side as a static field table.

Text alternative: Both adapters preserve required application behavior; a runtime that cannot support a required cancellation or evidence field is labeled unavailable rather than treated as equivalent.

## health-identity-narration

Present all lifecycle rows statically with Ready, Not ready, or Not applicable written in each cell.

Text alternative: During startup, pressure, update, and rollback, each health state has a separate result. A live process with the wrong model is not ready.

## inference-contract-narration

Use a static contract table with required, optional, rejected, and unavailable labels.

Text alternative: Unsupported fields are rejected or explicitly transformed, and every timeout, cancellation, overload, and error has stable semantics.

## compatibility-narration

Keep baseline and candidate columns visible and identify differences with text rather than animation.

Text alternative: Paths, roles, tools, structured output, streaming, usage, errors, limits, and extensions can differ; each required behavior receives an explicit status and test.

## adapter-cutover-narration

Show the baseline, candidate, gates, canary, stop, and rollback states as numbered static panels.

Text alternative: A bounded canary compares exact identities and stops on contract, quality, security, latency, capacity, or observability regression while preserving rollback.
