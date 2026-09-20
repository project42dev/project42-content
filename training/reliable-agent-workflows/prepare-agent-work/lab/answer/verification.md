# Practice verification

The solution changes two trusted controls:

1. It adds `write_receipt` to `policy.allowedActions`.
2. It changes `limits.maxActions` from `0` to `1`.

It preserves the separate trusted approval. That approval matches the action, resource, operation key, and state revision. No approval field is added to the model decision.

Run:

```text
node controller.js --input answer/practice-solution.json --trace
```

Expected summary:

```text
practice: COMPLETE | independent verifier accepted exactly one receipt | effects=1
```

The trace should show trusted approval matching, action usage changing from zero to one, state revision changing from 1 to 2, one confirmed ledger record, one receipt, and independent verifier acceptance.

Changing only policy exposes `BUDGET_EXHAUSTED` because the action limit remains zero. Changing only budget remains `POLICY_BLOCKED` because policy still omits the action. Removing or mismatching the trusted approval also remains blocked. Adding `approvedByHuman: true` to the decision cannot replace the trusted approval.

The terminal is derived by the controller. It is not selected by an input terminal field.