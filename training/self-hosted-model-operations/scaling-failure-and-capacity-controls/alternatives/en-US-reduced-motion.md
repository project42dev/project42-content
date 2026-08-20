# Scale the Bottleneck without Scaling the Failure: reduced-motion presentation

Present every visual as a complete static composition. Do not make completion
depend on animation timing, autoplay, or pointer gestures.

## scale-bottleneck-narration

Display the entire comparison as a static table and emphasize the current row with text and a border.

Text alternative: Each scaling pattern lists the constraint it can address and tradeoffs in quality, latency, isolation, startup, cost, and complexity.

## scaling-choice-demonstration

Present baseline and candidates side by side in a static decision table.

Text alternative: Queue delay, first-output latency, placement, quality, shared dependency, and cost jointly determine the scale choice.

## admission-backpressure-narration

Show the controls as a numbered static policy table.

Text alternative: Work that cannot finish safely is rejected early; retries and fallback remain bounded and do not bypass security or quality gates.

## placement-warmup-narration

Present placement as a static checklist and lifecycle states as numbered text.

Text alternative: Removal stops new work, drains bounded in-flight requests, preserves evidence, revokes routing, and then reclaims the resource.

## failure-isolation-narration

Show the complete failure matrix as a static table.

Text alternative: Each failure records affected requests and infrastructure, unsafe capacity removal, retry behavior, state reconciliation, exact identity, recovery, and residual shared dependencies.

## autoscaling-change-narration

Provide traffic and decision results as labeled static tables rather than animated graphs.

Text alternative: The candidate must preserve objectives, quality, isolation, cost, startup, recovery, and rollback while respecting safe floors and ceilings.
