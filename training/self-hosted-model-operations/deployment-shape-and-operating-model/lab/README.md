# Deployment shape selector repair lab

This focused repair uses Node 22 native ESM, built-in modules only, deterministic fixtures, no dependencies, no API keys, and no network. The fixtures represent previously collected decision evidence. They do not run a model, test infrastructure, establish privacy or availability, or approve a production deployment.

[Module repository entry](../)

## Learner task

Edit only `selector.mjs`. Its single intentional defect ranks all options before applying mandatory data-boundary, recovery, and owner constraints. Preserve validation and scoring. Filter eligible options first, reject a zero-eligible decision, then rank by descending score and ascending option ID.

Unknown boundary or owner evidence and null recovery evidence are valid incomplete inputs, but they do not meet a mandatory constraint. Negative, non-finite, incorrectly typed, missing, duplicate, or unsupported values are malformed and must be rejected.

Do not edit `validation.mjs`, `reference.mjs`, `tests.mjs`, or the fixtures. Do not deny all options, hardcode an ID, inspect filenames, or return canned output.

## Predict before running

Baseline prediction: cloud scores 92 but is ineligible. On-premises and hybrid are eligible, scoring 78 and 73, so on-premises must win.

Changed-input prediction: the required boundary becomes `cloud-region-verified`; cloud obtains matching boundary evidence, RTO 60, RPO 15, and a qualified owner; hybrid also matches the boundary. Cloud must win 92 to 73. This checks changed evidence, not a preferred ID.

## Repository-root commands

Run from the repository root:

```sh
node training/self-hosted-model-operations/deployment-shape-and-operating-model/lab/cli.mjs training/self-hosted-model-operations/deployment-shape-and-operating-model/lab/workload.json
node training/self-hosted-model-operations/deployment-shape-and-operating-model/lab/tests.mjs
```

Before repair, the baseline CLI stdout is exactly:

```text
{"selected":"cloud-service","eligible":false,"reason":"mandatory-constraints-not-met"}
```

Its exit code is `0` because the starter exposes its wrong decision as output. Before repair, the test stdout is exactly:

```text
FAIL 19/27 failed=base-selection,reference-base,unknown-boundary-fallback,tie-policy,unknown-recovery-fallback,zero-eligible,cli-root,cli-lab
```

The test exit code is `1`.

After repair, the baseline CLI stdout is exactly:

```text
{"selected":"on-premises-service","eligible":true,"reason":"eligible"}
```

The CLI exit code is `0`. Repaired test stdout is exactly:

```text
PASS 27/27
```

The repaired test exit code is `0`.

Run the independent changed input from the repository root:

```sh
node training/self-hosted-model-operations/deployment-shape-and-operating-model/lab/cli.mjs training/self-hosted-model-operations/deployment-shape-and-operating-model/lab/changed.json
```

Its repaired stdout is exactly:

```text
{"selected":"cloud-service","eligible":true,"reason":"eligible"}
```

Its exit code is `0`.

## Lab-directory commands

Run from this lab directory:

```sh
node cli.mjs workload.json
node tests.mjs
node cli.mjs changed.json
```

These produce the same corresponding results. The tests invoke the CLI once from the repository root and once from this directory to check path behavior.

## What the 27 tests cover

The tests cover baseline selection, positive changed-input selection, agreement with an independent reference on both fixtures, unknown-boundary fallback, tie ordering, unknown-recovery fallback, zero eligible options, invalid option boundary, invalid workload boundary, wrong options type, missing ID, duplicate ID, invalid `requiredOwner`, negative workload recovery, negative option recovery, non-finite score, non-finite recovery, score above its criterion weight, invalid owner, CLI execution from the repository root, CLI execution from the lab directory, deterministic repeated selection, an extra option, a recovery value with the wrong type, a missing score criterion, and acceptance of explicit unknown evidence by validation.

Failure names are causal clues. A `base-selection` failure usually means ranking happened before eligibility. `unknown-boundary-fallback` or `unknown-recovery-fallback` means incomplete evidence was counted as met. `tie-policy` means equal totals were not resolved by ascending ID. `zero-eligible` means an ineligible choice was returned instead of stopping. `cli-root` or `cli-lab` indicates inconsistent CLI or path behavior.

## Expected repair

The intended control flow is:

1. Validate the whole decision with the shared strict validator.
2. Filter using `isEligibleForMandatoryConstraints`.
3. Throw `no eligible option` if the filtered list is empty.
4. Sort eligible options by descending calculated score.
5. Resolve equal totals by ascending lexicographic option ID.
6. Return the first eligible option.

`reference.mjs` uses the same validator but an independently written eligibility predicate and selection function. It does not import the learner selector.

## Recovery

From the repository root:

```sh
cp training/self-hosted-model-operations/deployment-shape-and-operating-model/lab/starter.mjs training/self-hosted-model-operations/deployment-shape-and-operating-model/lab/selector.mjs
```

From the lab directory:

```sh
cp starter.mjs selector.mjs
```

This safely restores only the deliberately defective learner file. Tests do not write to the operating-system temporary directory or modify fixtures.
