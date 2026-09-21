# Hardware, Runtime, and Capacity Planning: reduced-motion presentation

Present every visual as a complete static composition. Do not make completion
depend on animation timing, autoplay, or pointer gestures.

## compatibility-narration

Keep the complete matrix visible. Highlight one row at a time with a text label and no motion.

Text alternative: The exact stack is listed row by row. Each row says documented, measured, inferred, or unknown. Unknown compatibility prevents real deployment approval.

## estimate-memory-and-storage-narration

Use a static ledger table with formulas and evidence labels. Do not animate resource bars.

Text alternative: Weights, dynamic cache, workspace, host services, rollback, startup, and headroom are listed in separate ledgers. GB and GiB are not mixed.

## sizing-demonstration

Reveal the arithmetic as static lines with no animated counters.

Text alternative: Scenario A is 16 GiB and admitted. Scenario B is 22 GiB and admitted. Scenario C is 24 GiB and rejected against 23 GiB. Host is 18 of 24 GiB and storage is 54 of 80 GiB.

## measure-representative-load-narration

Present the entire table without animated charts or gauges.

Text alternative: The profile records request distributions, latency percentiles, throughput, queue time, internal errors, rejections, resources, and recovery. Zero admitted requests has an invalid error-rate denominator.

## find-saturation-and-protect-host-narration

Use a static table and text labels instead of an animated saturation curve.

Text alternative: Scenario B remains admitted at 22 GiB. Scenario C reaches 24 GiB and is rejected at the 23 GiB accelerator ceiling. Host recovery headroom remains separate.

## capacity-decision-narration

Show the complete decision record as a static form with explicit evidence labels.

Text alternative: The decision supports only the synthetic Scenario B slice. Real exact-stack compatibility is unknown, so the fixture does not approve deployment.

## class-closing

Keep the four rules on screen without animation.

Text alternative: Capacity decisions require exact compatibility evidence, complete ledgers, representative measurements, and explicit limits and re-benchmark triggers.
