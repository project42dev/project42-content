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

## serving-practical-run-pinned-cpu-service-pause

Keep the pin table and three answer fields static. Use text labels for pause, extend, and continue.

Text alternative: Keep the pin table and three answer fields static. Use text labels for pause, extend, and continue.

## serving-practical-diagnose-contract-failures-pause

Show the timeout event, reconnect event, and three static answer columns. Do not animate a request lifecycle.

Text alternative: Show the timeout event, reconnect event, and three static answer columns. Do not animate a request lifecycle.

## serving-practical-compare-two-adapters-pause

Present the candidate comparison as a static table with no animated arrows. Keep the causal answer fields visible.

Text alternative: Present the candidate comparison as a static table with no animated arrows. Keep the causal answer fields visible.

## serving-practical-practice-changed-contract-pause

Show the request fields and expected output as static text. Do not imply live code execution or automatic test feedback.

Text alternative: Show the request fields and expected output as static text. Do not imply live code execution or automatic test feedback.

## serving-practical-rehearse-owned-recovery-pause

Show the recorded and observed PID, path, start time, and port in a static comparison table.

Text alternative: Show the recorded and observed PID, path, start time, and port in a static comparison table.

## activity-work-time

Display the evidence checklist and named files as static text. Controls are represented by labels for pause, extend, save, and continue, without animated UI claims.

# Reduced-motion practical equivalent

All activities can be completed from static text, tables, transcript, and learner-entered notes. No animated server diagram, live dashboard, automatic test result, or imagined control is required. Use the named module and assets, but do not reproduce command blocks. Keep exact 64-character hashes in static tables or learner records, not in spoken narration.

## Static field mapping and evidence table

| Exercise stage | Inputs or evidence | Learner action | Boundary to preserve |
|---|---|---|---|
| Pinned setup | Runtime archive and model names, hashes, revisions, complete DLL tree | Compare recorded values and mark ready only after exact evidence | Alias and open port do not prove artifact identity |
| Live client | Nine named observations plus separate missing-key 401 | Record observed result and limitation | One qualifying run is not a benchmark |
| Timeout | Client deadline and later request receipt | Separate client fact, server unknown, and recovery evidence | Timeout does not prove cancellation |
| Lifecycle | PID, executable path, startTimeUtc, port, and caller-held key | Stop only an owned process within one-second start tolerance | Refuse unrelated PID or path |
| Adapter matrix | Six rows, three fixtures, two fictional adapters | Compare normalized semantic outcomes | Wire differences are acceptable only when behavior is preserved |
| Changed task | Actual Boolean, account-recovery category, derived label | Implement and test ChangedAdapter | Original adapter rejection is ContractError, not model failure |
| Mutation task | Practice copies and unchanged canonical tests | Remove one guard, observe failure, restore, run all eight | Never edit canonical tests |
| Rollback | Prior immutable-style reference and every original fixture | Restore and rerun all fixtures | `OFFLINE_ELIGIBLE` is never deployment authorization |

## Static checkpoints

### Checkpoint 1: readiness
A port responds and the alias matches, but the model hash is absent. **Answer after attempting:** live may be supported; readiness and routing are held until model and runtime hashes, revisions, complete-tree verification, and authenticated identity evidence exist.

### Checkpoint 2: timeout
A client deadline expires and a later request succeeds. **Answer after attempting:** the deadline and later receipt are observations. Server cancellation and absence of first-request work remain unknown. Obtain server-owned cancellation evidence before claiming cancellation.

### Checkpoint 3: adapters
B changes wire fields but preserves all four semantic fields. C drops explanation and reports a matching alias. **Answer after attempting:** B can be `OFFLINE_ELIGIBLE` only within complete synthetic gates. C is `HOLD` because a required outcome was lost. Neither authorizes deployment.

### Checkpoint 4: ownership
A different executable owns the expected port and the recorded PID is gone. **Answer after attempting:** refuse to stop. Preserve evidence, resolve the conflict outside the helper, create a newly owned service, obtain a fresh receipt, and retry ownership-checked recovery.

## Learner work sequence

1. Verify Windows x64, PowerShell 7.6.6 or later, .NET 10.0.12, Python 3.13.9, pinned assets, hashes, revisions, and full runtime tree.
2. Start the loopback service on 11842, collect identity and client v5 evidence, and record every unknown boundary.
3. Run lifecycle negatives and the start, identity, stop, restart, identity, stop sequence.
4. Run both fictional adapters over the same three fixtures and inspect normalized results, six matrix rows, exact identities, metrics, evidence label, and rollback rerun.
5. Create the new practice folder, perform the exact missing-`DONE` mutation and restoration, then implement ChangedAdapter and pass the protected changed tests. The original adapter's expected ContractError is a passing contract-test result, not a substitute for passing the changed implementation.
6. Exercise port 11901 and retain fresh receipt and ownership evidence.
7. Submit the evidence table and debrief, including that TLS, multiuser authentication, gateway rate limits, production audit, and server-side cancellation are outside observed scope.

## Expected evidence and answers

The live receipt should retain the nine named observations, with server-side cancellation marked not observed. The adapter exercise should produce six matrix rows, three fixtures, six adapter runs, HOLD for the flawed candidate, OFFLINE_ELIGIBLE for the corrected candidate when all synthetic gates pass, and rollback with rerun count three. The changed task must show actual Boolean validation, derived confidential account-recovery transport labeling, four-field normalized output without a confidential field, original base-case preservation, and the original adapter's expected ContractError. The mutation exercise must show expected failure after removing only the exact guard and all eight tests after restoration.

**Sources:** [pinned llama.cpp server documentation](https://github.com/ggml-org/llama.cpp/blob/b29c606e28a01b1bc8c1351026a0fa6e616bf6c4/tools/server/README.md), [Qwen3 model page](https://huggingface.co/Qwen/Qwen3-0.6B), [Python unittest](https://docs.python.org/3/library/unittest.html), [Python deepcopy](https://docs.python.org/3/library/copy.html), and [Python isfinite](https://docs.python.org/3/library/math.html#math.isfinite).

Text alternative: Display the evidence checklist and named files as static text. Controls are represented by labels for pause, extend, save, and continue, without animated UI claims.

# Reduced-motion practical equivalent

All activities can be completed from static text, tables, transcript, and learner-entered notes. No animated server diagram, live dashboard, automatic test result, or imagined control is required. Use the named module and assets, but do not reproduce command blocks. Keep exact 64-character hashes in static tables or learner records, not in spoken narration.

## Static field mapping and evidence table

| Exercise stage | Inputs or evidence | Learner action | Boundary to preserve |
|---|---|---|---|
| Pinned setup | Runtime archive and model names, hashes, revisions, complete DLL tree | Compare recorded values and mark ready only after exact evidence | Alias and open port do not prove artifact identity |
| Live client | Nine named observations plus separate missing-key 401 | Record observed result and limitation | One qualifying run is not a benchmark |
| Timeout | Client deadline and later request receipt | Separate client fact, server unknown, and recovery evidence | Timeout does not prove cancellation |
| Lifecycle | PID, executable path, startTimeUtc, port, and caller-held key | Stop only an owned process within one-second start tolerance | Refuse unrelated PID or path |
| Adapter matrix | Six rows, three fixtures, two fictional adapters | Compare normalized semantic outcomes | Wire differences are acceptable only when behavior is preserved |
| Changed task | Actual Boolean, account-recovery category, derived label | Implement and test ChangedAdapter | Original adapter rejection is ContractError, not model failure |
| Mutation task | Practice copies and unchanged canonical tests | Remove one guard, observe failure, restore, run all eight | Never edit canonical tests |
| Rollback | Prior immutable-style reference and every original fixture | Restore and rerun all fixtures | `OFFLINE_ELIGIBLE` is never deployment authorization |

## Static checkpoints

### Checkpoint 1: readiness
A port responds and the alias matches, but the model hash is absent. **Answer after attempting:** live may be supported; readiness and routing are held until model and runtime hashes, revisions, complete-tree verification, and authenticated identity evidence exist.

### Checkpoint 2: timeout
A client deadline expires and a later request succeeds. **Answer after attempting:** the deadline and later receipt are observations. Server cancellation and absence of first-request work remain unknown. Obtain server-owned cancellation evidence before claiming cancellation.

### Checkpoint 3: adapters
B changes wire fields but preserves all four semantic fields. C drops explanation and reports a matching alias. **Answer after attempting:** B can be `OFFLINE_ELIGIBLE` only within complete synthetic gates. C is `HOLD` because a required outcome was lost. Neither authorizes deployment.

### Checkpoint 4: ownership
A different executable owns the expected port and the recorded PID is gone. **Answer after attempting:** refuse to stop. Preserve evidence, resolve the conflict outside the helper, create a newly owned service, obtain a fresh receipt, and retry ownership-checked recovery.

## Learner work sequence

1. Verify Windows x64, PowerShell 7.6.6 or later, .NET 10.0.12, Python 3.13.9, pinned assets, hashes, revisions, and full runtime tree.
2. Start the loopback service on 11842, collect identity and client v5 evidence, and record every unknown boundary.
3. Run lifecycle negatives and the start, identity, stop, restart, identity, stop sequence.
4. Run both fictional adapters over the same three fixtures and inspect normalized results, six matrix rows, exact identities, metrics, evidence label, and rollback rerun.
5. Create the new practice folder, perform the exact missing-`DONE` mutation and restoration, then implement ChangedAdapter and pass the protected changed tests. The original adapter's expected ContractError is a passing contract-test result, not a substitute for passing the changed implementation.
6. Exercise port 11901 and retain fresh receipt and ownership evidence.
7. Submit the evidence table and debrief, including that TLS, multiuser authentication, gateway rate limits, production audit, and server-side cancellation are outside observed scope.

## Expected evidence and answers

The live receipt should retain the nine named observations, with server-side cancellation marked not observed. The adapter exercise should produce six matrix rows, three fixtures, six adapter runs, HOLD for the flawed candidate, OFFLINE_ELIGIBLE for the corrected candidate when all synthetic gates pass, and rollback with rerun count three. The changed task must show actual Boolean validation, derived confidential account-recovery transport labeling, four-field normalized output without a confidential field, original base-case preservation, and the original adapter's expected ContractError. The mutation exercise must show expected failure after removing only the exact guard and all eight tests after restoration.

**Sources:** [pinned llama.cpp server documentation](https://github.com/ggml-org/llama.cpp/blob/b29c606e28a01b1bc8c1351026a0fa6e616bf6c4/tools/server/README.md), [Qwen3 model page](https://huggingface.co/Qwen/Qwen3-0.6B), [Python unittest](https://docs.python.org/3/library/unittest.html), [Python deepcopy](https://docs.python.org/3/library/copy.html), and [Python isfinite](https://docs.python.org/3/library/math.html#math.isfinite).
