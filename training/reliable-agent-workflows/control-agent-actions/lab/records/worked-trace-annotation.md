# Worked trace annotation

This file explains `worked-trace.json`. It is intentionally separate so the exact generated record is not confused with a paraphrase.

1. `trace[0]` labels both model-selected action data and adapter output as untrusted. The string is recorded as data only.
2. `validation` accepts the exact five-field action and supported action name.
3. `trusted-context-validation` checks the separately supplied actor, policy, approval, limits, usage, charge, clock, and bounded tool-output string.
4. `idempotency` binds the new operation key to the complete canonical fingerprint before mutation.
5. `authorization` proves both object-level actor scope and policy scope for the same tenant and resource.
6. `approval` binds the actor, tenant, action, target, intended status, expected version, and operation key.
7. `budget` shows deterministic time and simulated preflight arithmetic. These are offline teaching units, not production accounting.
8. `effect-intent` records the exact planned state transition before mutation.
9. `effect-observed` distinguishes one mutation, cumulative mutation count, one receipt, and updated usage.
10. `postcondition` independently queries the ticket and every receipt under the operation key. Acceptance requires one exact receipt and the expected ticket status and version.

The final result reports `effects` and `callMutations` as 1. `effects` is a compatibility alias for per-call mutation count. It is not receipt count. The executable comparison in `tests/trace.test.js` ensures this annotation's companion record remains the exact deterministic result structure.
