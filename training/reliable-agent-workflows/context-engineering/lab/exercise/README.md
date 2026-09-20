# Independent changed-input exercise

Do not invent a new scenario. Edit `learner-case.json`.

## Starting observation

Run `npm run exercise`. The context escalates because required claim `safety` has no evidence from an authoritative ID. The forum text cannot self-promote, and its embedded instruction cannot grant authority.

## Task

Add one fictional current safety record that:

- uses source ID `safety-register`, which is already supplied by the trusted contract;
- has role `evidence`, a unique revision and digest, and no `trust: trusted` label;
- carries claim ID `safety`, value `clear`, age of at most seven fixture days, relevance `true`, and size 4 units;
- fits after the protected reservations;
- does not delete the untrusted forum record.

Then run:

```text
npm run exercise
npm test
```

Explain why the status changed, why the forum did not become authority, and what would happen if the new source used a non-authoritative ID. Complete `artifact-template.md` with the manifest, ranking table, bounded package, provenance map, omissions, and test observations.

Do not open `SOLUTION.md` until you have produced and explained a changed result.
