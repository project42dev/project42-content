# Scale the Bottleneck without Scaling the Failure: reduced-motion presentation

Present every visual as a complete static composition. Do not make completion
depend on animation timing, autoplay, or pointer gestures.

## welcome-and-outcomes

Show the entire decision path as a static numbered list.

Text alternative: The lesson moves from measured demand to bounded admission, verified capacity, failure testing, scale gates, and rollback.

## scale-bottleneck-narration

Use a static table and text arithmetic instead of animation.

Text alternative: Four ready replicas provide eight units. Demand of thirteen leaves five units, a queue holds two, and three are rejected. Each alternative has a stated tradeoff.

## scaling-choice-demonstration

Present all candidates side by side in a static table.

Text alternative: Queue delay, first-output latency, placement, quality, shared dependency, and cost jointly determine the choice.

## admission-backpressure-narration

Show controls as a numbered static policy table.

Text alternative: Unsafe or late work is rejected early. Retries, queues, circuits, shedding, and degraded behavior remain bounded and do not bypass security or quality controls.

## placement-warmup-narration

Present the lifecycle as numbered text states.

Text alternative: Only verified, warmed, ready, non-draining capacity counts. Warming, draining, and failed capacity count as zero.

## lab-demonstration

Use static code and output panels only.

Text alternative: The simulator incorrectly counts nominal capacity. Repairing the ready non-draining capacity calculation changes the baseline rejection and makes eight tests pass.

## failure-isolation-narration

Show the complete matrix as a static table.

Text alternative: Each case records what is removed, how load is contained, how identity is preserved, and how recovery is evidenced.

## gate-autoscaling-and-change-narration

Use labeled static tables instead of animated graphs.

Text alternative: The candidate is judged by service, quality, cost, isolation, startup, recovery, and rollback gates across five traffic patterns.

## class-closing

Show the closing checklist without animation.

Text alternative: Scale measured constraints, bound demand, count verified capacity, test failure domains, apply gates, and preserve rollback.
