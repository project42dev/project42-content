# Bounded agent loop lab

This lab runs a deterministic, provider-neutral controller using native ECMAScript modules. The repository root declares `"type": "module"`, so the supplied `.js` files use `import` and `export`. Do not change the repository root configuration.

The model, observation, costs, and tool are fixtures. `timeMs` and `tokenCost` are deterministic scenario-accounting units. They are not measurements of wall-clock duration or actual provider tokens. The environment, trace, state, approvals, and bounded operation ledger exist only in memory.

The controller derives exactly five lesson terminals:

* `COMPLETE`
* `NEEDS_HUMAN`
* `BUDGET_EXHAUSTED`
* `POLICY_BLOCKED`
* `FAILED_WITH_RECOVERY_EVIDENCE`

Do not claim the tests passed until you run them and inspect Node's report.

## Requirements

Use Node.js 22 or later:

```text
node --version
```

The implementation uses native ESM and Node's built-in test runner. Node.js documentation describes ESM behavior at https://nodejs.org/api/esm.html and package type behavior at https://nodejs.org/api/packages.html. The repaired candidate was not claimed to have been executed on Node.js 22 before delivery.

## Run from the cloned content repository

Common shells:

```text
cd training/reliable-agent-workflows/prepare-agent-work/lab
node --test
node controller.js --all
node controller.js --scenario success --trace
node controller.js --scenario uncertain --recover
```

PowerShell 7:

```text
Set-Location training/reliable-agent-workflows/prepare-agent-work/lab
node --test
node controller.js --all
node controller.js --scenario success --trace
node controller.js --scenario uncertain --recover
```

`node controller.js --all` must match `expected-summary.txt` byte-for-byte. `worked-trace.json` contains the exact result structure expected from the successful scenario. Compare it with the JSON printed after the success summary by the `--trace` command.

## Trust and revision rules

Observations and decisions are untrusted. A decision field such as `approvedByHuman` is ignored for authority. Human approval must be supplied separately in `trustedApprovals` and must match all of these fields:

* `action`
* `resource`
* `operationKey`
* `stateVersion`

An act decision also supplies `expectedStateVersion`. It must equal the controller's current revision. A write invocation advances the revision. Stale decisions and stale or mismatched approvals stop with `POLICY_BLOCKED` before any effect.

Only `noop` and `write_receipt` are implemented fixture actions. Unknown actions do not execute even if accidentally listed in `policy.allowedActions`. Unsupported kinds, malformed decisions, empty operation keys, and missing, negative, infinite, or NaN fixture costs are rejected predictably with zero effects.

## Worked example

The `success` scenario begins at revision 1 with no receipt. The decision proposes `write_receipt`, expects revision 1, and identifies resource `receipt:prepare-agent-work` and operation key `op-success-001`. Policy allows the action, and no human approval is required in this scenario.

Preflight accounting confirms that the deterministic fixture charges fit. The tool creates one in-memory receipt, the controller advances to revision 2, and the independent verifier checks both text and operation key. The terminal is `COMPLETE` only after that inspection.

Open `worked-trace.json` and follow:

1. `beforeState` and `beforeBudget`
2. `observation` and `decision`
3. `authorization`
4. `effect`
5. `verifier`
6. `afterState` and `afterBudget`
7. `terminalReason`, `ledger`, and `environment`

## Changed-input exercise

Run the supplied input:

```text
node controller.js --input practice.json
```

Expected summary:

```text
practice: POLICY_BLOCKED | action write_receipt is not allowed by trusted policy | effects=0
```

Create a learner-owned copy:

```text
cp practice.json my-practice.json
```

PowerShell 7:

```text
Copy-Item practice.json my-practice.json
```

Edit only `my-practice.json`:

1. Add `write_receipt` to `policy.allowedActions`.
2. Change `limits.maxActions` from `0` to `1`.
3. Keep the separate trusted approval unchanged.
4. Do not add `approvedByHuman` to the decision.

Run:

```text
node controller.js --input my-practice.json
```

Expected summary:

```text
practice: COMPLETE | independent verifier accepted exactly one receipt | effects=1
```

The successful trace must end at revision 2. Changing only policy exposes `BUDGET_EXHAUSTED`. Changing only budget remains `POLICY_BLOCKED`. Removing, staling, or mismatching the trusted approval also remains `POLICY_BLOCKED` with zero effects.

After attempting the exercise, compare with `answer/practice-solution.json` and `answer/verification.md`.

## Unknown outcomes and persistence boundary

Run:

```text
node controller.js --scenario uncertain --recover
```

The write fixture creates a receipt but reports an unknown result. The original terminal remains `FAILED_WITH_RECOVERY_EVIDENCE`. Recovery inspects by operation key before any retry, finds one effect, and reports `retryPerformed=false`.

The operation ledger is bounded to 32 in-memory records and disappears at process exit. It does not provide process durability, distributed idempotency, production security, or compliance.