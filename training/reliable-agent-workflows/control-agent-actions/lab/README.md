# Control agent actions lab

This provider-neutral executable lab controls one consequential action: changing an in-memory support ticket from `OPEN` to `RESOLVED`. The base scope is tenant `tenant_acme`, resource `ticket_12345678`, and that single transition.

Model-selected action arguments and tool-output text are untrusted. Authenticated actor scope, tenant, policy, approval, limits, accumulated usage, simulated charge, deterministic fixture clock, and tool behavior are supplied separately as trusted fixture inputs. A request cannot grant itself authority.

This is an offline teaching fixture, not production authentication, authorization, security, accounting, logging, transaction processing, or durable idempotency. It uses no network, credentials, external effects, dependencies, or paid model calls. The boundary is transferable to local, open-weight, and hosted model adapters, but this fixture is not a provider comparison and cannot establish which model is best.

## Requirements and commands

From the `project42-content` repository root, use Node.js 22 or later with the repository's native ESM configuration:

```sh
node training/reliable-agent-workflows/control-agent-actions/lab/run.js --all
node training/reliable-agent-workflows/control-agent-actions/lab/run.js --case timeout-after-success --trace --recover
node --test training/reliable-agent-workflows/control-agent-actions/lab/tests/contract.test.js
node --test training/reliable-agent-workflows/control-agent-actions/lab/tests/trace.test.js
node --test training/reliable-agent-workflows/control-agent-actions/lab/tests/exercise.test.js
```

The unsafe starter is a deliberate negative control. This command is expected to fail because the starter mutates before checking tenant authority:

```sh
node --test training/reliable-agent-workflows/control-agent-actions/lab/tests/starter.test.js
```

CLI options are `--all`, `--case ID`, `--trace`, and `--recover`. Choose exactly one of `--all` or `--case ID`. `--trace` prints the full result. `--recover` reconciles uncertain results without retrying. Duplicate, unknown, or incomplete options produce exit code 2.

## Expected CLI summaries

`--all` emits these lines in order:

```text
happy-path: success callMutations=1 cumulativeMutations=1 receipts=1
malformed-arguments: invalid callMutations=0 cumulativeMutations=0 receipts=0
unauthorized-target: denied callMutations=0 cumulativeMutations=0 receipts=0
injected-tool-output: success callMutations=1 cumulativeMutations=1 receipts=1
timeout-after-success: uncertain callMutations=1 cumulativeMutations=1 receipts=1
duplicate-call: success callMutations=0 cumulativeMutations=1 receipts=1
stale-approval: denied callMutations=0 cumulativeMutations=0 receipts=0
mismatched-approval: denied callMutations=0 cumulativeMutations=0 receipts=0
same-key-changed-payload: conflict callMutations=0 cumulativeMutations=1 receipts=1
failed-postcondition: uncertain callMutations=1 cumulativeMutations=1 receipts=0
```

The test runner emits TAP metadata whose numbering and timing can vary. Grade exit status and assertions, not byte-identical TAP output. `.gitattributes` forces LF for lab text, and the trace test normalizes CRLF.

## Mutation, receipt, and result semantics

Every result has a stable `kind`: `success`, `invalid`, `denied`, `conflict`, or `uncertain`.

The counters are deliberately distinct:

* `callMutations` counts ticket mutations attempted by this executor call. A normal edit reports 1. A deduplicated call reports 0.
* `cumulativeMutations` is the environment's trusted in-memory mutation counter across calls.
* `receiptCount` is the current number of receipts. A receipt is evidence, not the mutation itself.
* `effects` is retained as an alias for `callMutations`, never for receipt count.

Therefore `failed-postcondition` changes the ticket from `OPEN` version 7 to `RESOLVED` version 8 and reports `callMutations=1`, `cumulativeMutations=1`, but `receiptCount=0`. Missing evidence does not mean zero mutation. Its result remains `uncertain`.

A normal edit changes exactly one ticket status and increments its version once. There is no model-callable generic no-op. A same-key, same-request duplicate is the only successful no-op. Before returning cached success, the executor revalidates the current actor, tenant, resource, policy, approval, and budget, then verifies independent state. Revoked scope or cross-tenant context cannot reuse cached authority. Legitimate duplicates are not rejected merely because the ticket is now version 8.

`invalid` means malformed action, context, environment, evidence, or unsupported behavior. `denied` means current authority, transition, approval, or simulated budget does not permit the request. `conflict` covers stale revision, changed input under an existing key, divergent prior state, and conflicting recovery evidence. `uncertain` means a mutation may have occurred but exact success has not been established.

Approval binds actor, tenant, action, target, intended status, expected version, and operation key. The idempotency fingerprint binds the same request. A reused key with an altered target or payload conflicts before transition checks.

## Validation and budgets

`contract.js` provides JSDoc types plus runtime validation. Exact own-property checks reject missing, extra, inherited, and prototype-polluting fields. Unsupported actions cannot fall through. Semantic checks restrict identifiers, status, transition, and revisions. Finite nonnegative checks reject missing, negative, `NaN`, and infinite limits, usage, charges, and deterministic clock values.

Budget units are simulations. `steps`, `costUnits`, and `rateActions` are not production billing or security metrics. Usage is accumulated in the trusted context after each attempted mutation. Consecutive distinct operations sharing a context therefore consume the same offline fixture budget. The deterministic fixture clock defines the rate window. When `nowMs` is outside the configured window, preflight denies the action rather than silently resetting usage.

## Uncertain outcomes and recovery

`timeout_after_write` and `omit_receipt` are trusted simulation settings, not action fields. A timeout preserves the original uncertain operation, exact operation key, fingerprint, expected version, intended mutation, and original run record.

`reconcileOperation` validates all tickets, operations, and receipts before querying. It rejects malformed evidence rather than throwing. It examines every receipt for the operation key. Any malformed, extra, or contradictory receipt makes the outcome `conflicting`; it cannot be hidden by selecting one matching receipt. The query result is `zero`, `one`, or `conflicting`. Reconciliation never retries and never fabricates certainty.

For `timeout-after-success --recover`, expected recovery is `query=one`, `retryPerformed=false`, `callMutations=0`, `cumulativeMutations=1`, and `receipts=1`.

Tool-output prompt injection remains bounded untrusted string data in the trace. It cannot modify trusted actor scope, policy, approval, state, or limits.

## Worked record

`records/worked-trace.json` is the exact pretty-printed result produced by a fresh happy-path execution. `records/worked-trace-annotation.md` explains it separately. Keep the record current with:

```sh
node --test training/reliable-agent-workflows/control-agent-actions/lab/tests/trace.test.js
```

If this test fails, regenerate only from the deterministic fixture after reviewing the behavioral change. Do not hand-edit the exact record to make a mismatch disappear.

## Changed policy and target exercise

The assigned task is fixed: authorize `actor_learner` to resolve `ticket_87654321` in `tenant_beta`, starting at version 4, with operation key `op_beta_resolve_0001`. Edit only `exercise/changed-input.js`. Align the trusted actor resource list, policy target, and every exact approval binding. Do not edit the executor or tests.

Run:

```sh
node --test training/reliable-agent-workflows/control-agent-actions/lab/tests/exercise.test.js
```

The original starter has exactly two correctly configured bindings, so the base success and stale-revision tests fail, while changed-target and forged-authority rejection already pass. This 2-of-4 state is deliberate. The separate solution passes all four checks. Objective grading requires one mutation, version 5, status `RESOLVED`, an accepted approval ledger entry, and zero mutations for stale, changed-target, and forged-authority variants. Subtest names and assertion messages provide per-variant causal feedback.

## Files

* `contract.js`: runtime contract, executor, verifier, and reconciler.
* `fixtures.js`: threat, safety, idempotency, and recovery fixtures.
* `run.js`: strict fixture CLI.
* `tests/contract.test.js`: independent mutation, authorization, budget, evidence, and recovery checks.
* `tests/trace.test.js`: executable comparison of the exact worked trace.
* `starter/unsafe-executor.js` and `tests/starter.test.js`: intentional failing control.
* `exercise/changed-input.js`: deliberate learner repair.
* `solution/executor.js` and `solution/changed-input.js`: separate solution.
* `records/workorder.json`, `records/worked-trace.json`, and `records/worked-trace-annotation.md`: completed records.

## References

Official Node.js documentation for ESM, the test runner, `structuredClone`, and object globals:

* https://nodejs.org/api/esm.html#packages
* https://nodejs.org/api/test.html
* https://nodejs.org/api/globals.html#structuredclone
* https://nodejs.org/api/globals.html

JSON Schema documents required properties and additional-property control. This lab performs application validation because shape validation is not an authorization grant:

* https://json-schema.org/draft/2020-12/json-schema-validation.html#rfc.section.10.2
* https://json-schema.org/draft/2020-12/json-schema-validation.html#rfc.section.10.3.1.1
* https://json-schema.org/draft/2020-12/json-schema-core.html#rfc.section.4.3.5
