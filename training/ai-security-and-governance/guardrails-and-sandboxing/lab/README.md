# Guarded internal-API repair lab

Public entry: https://github.com/project42dev/project42-content/tree/main/training/ai-security-and-governance/guardrails-and-sandboxing/lab/

## Scope

This offline Node.js 22 lab simulates a guardrail, authenticated session store, execution policy, synthetic customer API, budget, output validator, and redacted audit stream. It does not call a model or real service, execute supplied code, or create an OS sandbox. Passing it is fixture-policy evidence only.

Real integration must preserve all of these controls: obtain the authenticated session from trusted middleware rather than model text; keep credentials outside prompts and tool arguments; bind subject, tenant, roles, actions, approvals, and budgets at execution time; authorize the resolved resource at the bridge; use fixed endpoints and allow-listed schemas; validate downstream results; return secret failure messages; redact audit events; and place any generated-code worker behind an actual approved isolation boundary with host-enforced egress and resources.

## Requirements

* Node.js 22.x
* No npm install and no network access
* Run commands from the repository root
* Scratch output only under `training/ai-security-and-governance/guardrails-and-sandboxing/lab/test-scratch/`

Check Node:

`node --version`

Expected shape: `v22.x.x`. Any other major version is unsupported and must be reported as SKIP, not PASS.

## Reset

`node training/ai-security-and-governance/guardrails-and-sandboxing/lab/reset.mjs`

Exact stdout:

`RESET lab starter and test-scratch`

Exit code: 0.

## Observe the planted defect

`node training/ai-security-and-governance/guardrails-and-sandboxing/lab/tests/run-tests.mjs starter`

Exact initial stdout:

```text
PASS valid own-tenant read
PASS forged subject rejected
PASS forged tenant rejected
FAIL action substitution denied
PASS result leakage removed
PASS exhausted budget denied
FAIL guardrail miss denied and logged
FAIL revoked approval denied
SUMMARY 5 passed, 3 failed
```

Exit code: 1.

The guardrail deliberately misses the wording `neighboring account`. That classifier miss is a test condition, not the repair defect. The one repair defect is in `src/bridge.mjs`: authorization runs only when the guardrail denies. This wrongly treats an allow decision as authorization.

## Repair

Edit only `src/bridge.mjs`. Make execution-time authorization unconditional after validation, guardrail evaluation, and budget reservation, but before `executeInternal`. Do not edit tests, fixtures, contracts, policies, or the reference.

Run the starter command again. Exact repaired stdout:

```text
PASS valid own-tenant read
PASS forged subject rejected
PASS forged tenant rejected
PASS action substitution denied
PASS result leakage removed
PASS exhausted budget denied
PASS guardrail miss denied and logged
PASS revoked approval denied
SUMMARY 8 passed, 0 failed
```

Exit code: 0.

## Independent reference

`node training/ai-security-and-governance/guardrails-and-sandboxing/lab/tests/run-tests.mjs reference`

Expected stdout is the same 8-pass transcript above. Exit code: 0. The reference has its own bridge sequence and does not import the starter bridge.

## Independent changed-input variation

`node training/ai-security-and-governance/guardrails-and-sandboxing/lab/tests/variation.mjs starter`

Before repair, exact stdout:

```text
FAIL variation changed tenant denied
FAIL variation changed revoked approval denied
SUMMARY 0 passed, 2 failed
```

Exit code: 1.

After repair, exact stdout:

```text
PASS variation changed tenant denied
PASS variation changed revoked approval denied
SUMMARY 2 passed, 0 failed
```

Exit code: 0.

The variation uses different sessions, customers, wording, and approval records. It checks the authorization invariant rather than the original literals.

## Causal feedback

* Forged subject or tenant failure means model-controlled identity was accepted. Proposal contracts must reject those unknown properties.
* Action substitution failure means the requested action was dispatched without checking the server-side session action set.
* Result leakage failure means downstream fields bypassed output validation and redaction.
* Budget failure means the bridge performed work after its bounded server-side quota was exhausted.
* Guardrail-miss failure means a content classification was mistaken for resource authorization. The bridge must compare trusted session tenant with resolved customer tenant and log a redacted denial.
* Revoked-approval failure means export ran without a currently valid, non-revoked server-side approval.

## Rubric

10 points total: 4 unconditional authorization before operation; 2 preserved tenant, action, and approval checks; 1 strict contracts and output redaction; 1 budgets and redacted denial logging; 1 changed-input variation; 1 accurate fixture-versus-sandbox explanation. Tests are immutable learning evidence. Disabling or changing them does not satisfy the task.

See `HOST-ISOLATION.md` for optional host probes. Their status is UNVERIFIED until actually run.