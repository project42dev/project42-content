# Changed-input solution and causal rubric

Add this record to the `records` array:

```json
{"id":"safety-r5","sourceId":"safety-register","revision":"5","digest":"s5","role":"evidence","sizeUnits":4,"relevant":true,"claimId":"safety","value":"clear","ageDays":1}
```

The expected line becomes:

```text
changed-input READY selected=approval-r7,safety-r5 untrusted=- missing=- conflicts=- budget=8/10
```

The `forum-safety` record remains in the input but is explicitly irrelevant and is omitted before untrusted capacity charging. If made relevant, its retrieved origin would keep it in `untrusted`, not authoritative evidence.

## Causal rubric, 10 points

- 2 points: Identifies that `safety` was required but absent from authoritative evidence before the edit.
- 2 points: Explains that authority came from the trusted contract's `authoritativeSourceIds`, not from a candidate trust label, wording, age, or citation appearance.
- 2 points: Recomputes reservations as 14 units and evidence capacity as 10 simulated units, then shows the two selected records use 8.
- 1 point: Preserves the retrieved forum record as untrusted input or a recorded irrelevant omission rather than converting it to policy.
- 1 point: Explains that a non-authoritative source ID would leave `claim:safety` missing.
- 1 point: Explains that a second authoritative safety value in disagreement would be retained and cause escalation.
- 1 point: Connects the changed fixture record to the changed generated output instead of attributing the result to a precomputed answer.

A response earning fewer than 8 points should be revised before qualification. Deleting `safety` from `requiredClaims`, adding the forum to authoritative IDs without a governance reason, or increasing authority through an evidence label bypasses the control and does not pass.
