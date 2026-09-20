# Choose a Provider Deliberately: offline lab

This dependency-free Node 22 lab ranks synthetic candidates only after required gates pass. It is a decision aid, not a model evaluation, benchmark, price comparison, license determination, or security assessment. Candidate labels and numbers are independently authored synthetic data. No API, paid account, model download, GPU, package installation, or network access is required.

The public lab is available at:

https://github.com/project42dev/project42-content/tree/main/training/providers-in-practice/choose-a-provider/lab

## Requirements and commands from the repository root

Use a repository checkout and Node 22. From the repository root, run:

```powershell
node --version
Set-Location training/providers-in-practice/choose-a-provider/lab
node src/cli.js --engine=learner
node tests/run-tests.mjs
node src/cli.js --engine=reference
node src/grade-samples.js
```

The learner evaluator is deliberately expected to exit 1 before the repair. Do not configure the shell to stop on that expected baseline result, and continue to the test command. The baseline has 4 of 6 tests passing and 2 failing. After the repair, the learner evaluator should exit 0 and the test runner should report 6 of 6 passing. The reference engine and sample grader are separate checks.

## Learner task

The starter in `src/learner.js` contains one meaningful order defect: it allows candidates with complete metric rows into the ranking before enforcing hard-gate eligibility. Inspect `src/core.js` and the surrounding learner pipeline. Repair the pipeline so candidates are filtered by gate eligibility before they are scored and sorted.

Add this filter before the existing `unknownMetrics` filter:

```js
.filter(candidate => gateById.get(candidate.id).eligible)
```

Change `src/learner.js` only for the repair. Do not edit tests, fixtures, the reference implementation, or expected outputs. The intended repair is not a change to the synthetic data.

## Inputs and outputs

`fixtures/candidates.json` contains synthetic candidate gates and normalized metrics. `fixtures/requirements.json` defines required gates, weights, and fail-closed UNKNOWN handling. `fixtures/case-results.json` contains the exact expected selection output plus human-authored task-output grading answers.

Gate values are `PASS`, `FAIL`, or `UNKNOWN`. Every required gate must be `PASS` before ranking. An eligible candidate with an `UNKNOWN` weighted metric is reported as `insufficientEvidence`, not scored. Metrics must otherwise be finite numbers from 0 through 100. Weights must be finite numbers from 0 through 1 and sum to 1.

The score is the sum of `metric × weight`, rounded to four decimal places. Ties are resolved by candidate ID so output is deterministic. Labels are data, not special names, and the implementation contains no fixture-name branching.

## Comparable task-output evidence

Run `node src/grade-samples.js`. The command computes totals from the human answer-key dimension scores in `fixtures/case-results.json`. Read each prompt, source fact, synthetic output, and rationale. In a real evaluation, use the same cases and rubric for every eligible candidate, preserve raw outputs, and have qualified reviewers assign scores. The supplied dimension scores are answers for practice, not measurements of any model.

The supplied sample-grader result is 100 and 15 pass. The raw JSON used for that result is in `fixtures/case-results.json`.

## Synthetic reference evidence

The reference comparison is not the learner repair. Keep the reference implementation and learner implementation separate.

With synthetic weights of quality 0.50, latency 0.20, cost 0.20, and operations 0.10, the reference evidence is:

- Maple: 83, eligible.
- Cedar: 79, eligible.
- Quartz: excluded because its license gate is `FAIL`.
- Fog: excluded because access is `UNKNOWN`.
- Alder: unscored because quality is `UNKNOWN`.

These values are synthetic decision practice, not provider measurements. Hard gates are applied before weighted ranking. A numeric score cannot make a failed or unresolved required gate eligible.

## Broader provider-choice teaching scope

The lab is one exercise within a broader provider-choice process. For a real workflow:

1. Define representative inputs, required outputs, a quality rubric, data classification, allowed tools, latency target, budget boundary, deployment constraints, and operating responsibilities.
2. Separate hard gates from preferences. Verify the exact model identifier, modality, license or use policy, hardware fit, regional or account access, data controls, context limits, tools, deployment location, and security controls.
3. Compare provider families and deployment surfaces without treating a family name or API compatibility as proof of identical capabilities, semantics, controls, limits, or policies.
4. Record dated documentation evidence separately from account checks and controlled task runs. Mark unavailable facts `UNKNOWN`; do not replace missing observations with estimates presented as fact.
5. Run the same representative cases for eligible candidates, preserve raw outputs, use a human-reviewed rubric and known-answer checks, and record disagreements and shared errors.
6. Compute weighted scores only after gates pass. Recompute scores under changed weights and requirements. Report when the winner depends on stakeholder priorities.
7. Define fallback and re-evaluation triggers, such as lost access, changed terms, failed data controls, task-quality regression, operational incidents, a new modality requirement, or a changed workload.

The lab does not evaluate a model, discover a license, measure security, measure vendor pricing, or prove output correctness. Its scorer is a practice aid for synthetic normalized inputs.

## Rubric

Full credit requires all of the following:

1. Hard gates are assessed before scoring or sorting, and `FAIL` and `UNKNOWN` gates are excluded from ranking.
2. The learner changes `src/learner.js`, not tests, fixtures, the reference implementation, or expected outputs.
3. `node tests/run-tests.mjs` reports every positive, negative, boundary, and changed-input check and exits 0 after the repair.
4. `node src/cli.js --engine=learner` matches the exact fixture result and exits 0 after the repair.
5. The learner can explain why Quartz and Fog are disqualified, why Alder is unscored, and why changed metrics can change the winner.

Partial credit: correct eligibility but incorrect arithmetic or UNKNOWN handling earns at most 3 of 5 criteria. Editing expected answers to hide a defect earns no credit for criteria 2 through 4.

## Solution and safe recovery

Try the repair before reading `solution/SOLUTION.md`. A separate complete reference implementation is in `solution/reference.js` and can be run with:

```powershell
node src/cli.js --engine=reference
```

Preserve your work before recovery. From the lab directory, the explicit recovery command is:

```powershell
Copy-Item recovery/learner-starter.js src/learner.js
```

This copies only the deliberately flawed learner starter to `src/learner.js`. It does not alter tests, fixtures, the reference implementation, or expected outputs. Rerun:

```powershell
node src/cli.js --engine=learner
node tests/run-tests.mjs
```

After recovery, the deliberate baseline failure should return: the evaluator exits 1 and 4 of 6 tests pass. Do not use recovery to erase work without first preserving or reviewing it. No dependency cleanup or npm uninstall step is needed because the lab uses Node built-ins and requires no installed dependencies.
