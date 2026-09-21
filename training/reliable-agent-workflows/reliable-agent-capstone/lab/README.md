# Reliable agent evidence-binding repair lab

Public repository entry link: UNKNOWN. The public repository URL was not supplied. Once committed, this directory is the root-relative lesson entry.

Requires Node.js 22. Uses native ESM, built-in modules, deterministic fixtures, no dependencies, no API keys, no network, no model, no real approval, and no external write. Node.js ESM uses `import` and `export`; local module references use ordinary relative imports such as `../../shared/package-validation.mjs`. Do not replace them with absolute shared-module URLs. See the Node.js ESM documentation: https://nodejs.org/api/esm.html and relative imports documentation: https://nodejs.org/api/esm.html#relative-imports.

## What is being repaired

All package rules for required files, manifest shape, exact criterion IDs, integer points, maxima, declared sums, safe local references, and file existence live in the repository's real `shared/package-validation.mjs`. Both starter and reference validators import that module. `validatePackageCore` requires a binding callback for evidence checks. The starter has one deliberate defect: it does not provide evidence-binding validation. The repair must preserve the package schema, stable criterion and case IDs, version and outcome fields, provider metadata, all eight required artifacts, and the existing scoring rules.

This lab tests a real repository integration between each validator and the shared module. The JSON packages under `fixtures/` are deterministic synthetic inputs for the offline test, not a simulation that replaces shared validation. The runner does not inject permissive validation logic and does not mock the shared module.

## Concrete worked example

A manifest can require `attemptId=attempt-1`, while the first line of `architecture-and-state-model.md` contains a binding with `attemptId=attempt-0`. The file exists, so a file-existence-only validator can incorrectly accept it. The repaired validator reads that first Markdown line, requires the `Evidence-Binding: ` prefix, parses its JSON, and compares `attemptId`, `version`, `caseId`, and `outcome` with the manifest. The first mismatch is therefore causal and deterministic: `E_BINDING architecture-and-state-model.md:attemptId`. If the attempt ID is corrected but the version is changed, the next result names `version`; if all four values match, validation continues to the ordinary criterion, points, sum, and reference checks.

## Reproduce from the repository root

```sh
node training/reliable-agent-workflows/reliable-agent-capstone/lab/starter/cli.mjs training/reliable-agent-workflows/reliable-agent-capstone/lab/fixtures/failed
```

Exact stdout: `VALID score=80 pass=true`

Exit code: 0

```sh
node training/reliable-agent-workflows/reliable-agent-capstone/lab/test/run-tests.mjs starter/validator.mjs
```

Exact final stdout line: `TESTS total=8 passed=7 failed=1`

Exit code: 1

The only starter failure is stale evidence binding. Unknown criterion, malformed points, and bad sum are rejected by the actual shared validator. This is the important integration distinction: do not make the learner's validator correct only when a test runner supplies different rules.

## Learner task

Edit only `starter/validator.mjs`. Do not edit shared logic, tests, or fixtures. Keep `validatePackage` as the exported API. Import the canonical shared module with the project's normal relative ESM import, call `validatePackageCore`, and supply a binding callback that:

1. Uses `evaluation.binding` for `evaluation-set-and-rubric.json`.
2. Reads the first line of Markdown evidence.
3. Requires the `Evidence-Binding: ` prefix and valid JSON.
4. Compares `attemptId`, `version`, `caseId`, and `outcome` with the manifest.
5. Returns `E_BINDING <ref>:missing` for absent or malformed binding.
6. Returns `E_BINDING <ref>:<key>` for the first mismatched key.

File existence is necessary but insufficient. A deny-all repair is invalid because revised, complete, and changed valid packages must pass. Do not hard-code `support-017` or any other case ID. The generated changed case tests value comparison rather than a case-specific exception.

## Independent variation and causal feedback

Before looking at the reference, copy the revised fixture directory to a separate learner workspace without editing the supplied fixtures. Change exactly one binding value in one of its eight Markdown artifacts. Run the starter test command against your repaired validator. The altered artifact should produce one binding failure naming the changed key, while the remaining valid artifacts and structural rules continue to pass. Restore that value and the package should return to a valid result. This variation tests the cause of the failure independently of the supplied stale package and checks that the validator compares manifest values rather than merely checking that a binding exists.

## Reference, recovery, and exact results

Inspect the answer without overwriting your attempt:

```sh
node training/reliable-agent-workflows/reliable-agent-capstone/lab/reference/cli.mjs training/reliable-agent-workflows/reliable-agent-capstone/lab/fixtures/failed
```

Exact stdout: `INVALID E_BINDING architecture-and-state-model.md:attemptId`

Exit code: 1

```sh
node training/reliable-agent-workflows/reliable-agent-capstone/lab/reference/cli.mjs training/reliable-agent-workflows/reliable-agent-capstone/lab/fixtures/revised
```

Exact stdout: `VALID score=80 pass=true`

Exit code: 0

```sh
node training/reliable-agent-workflows/reliable-agent-capstone/lab/test/run-tests.mjs reference/validator.mjs
```

Exact final stdout line: `TESTS total=8 passed=8 failed=0`

Exit code: 0

To recover the original starter:

```sh
cp training/reliable-agent-workflows/reliable-agent-capstone/lab/starter/validator.original.mjs training/reliable-agent-workflows/reliable-agent-capstone/lab/starter/validator.mjs
```

The test runner copies all eight revised artifacts and generates `support-099` as an independent changed input. These results qualify an offline structural validator only. They do not run or approve a live agent, assess model quality, judge substantive safety, or represent a human signature.

## Explained answer key

The defect is not missing file checks. The failed package contains every required filename. The defect is not score parsing in the canonical shared logic. The real shared validator rejects invalid criterion IDs, point types, sums, and references. The missing rule is equality between each referenced artifact binding and the manifest binding. The reference supplies this callback to `validatePackageCore`. The stale package then fails at the first referenced file, `architecture-and-state-model.md`, because its `attemptId` is `attempt-0` while the manifest requires `attempt-1`. The revised package passes because all eight artifacts use `attempt-2`, version `1.1.0`, case `support-017`, and outcome `passed`. The generated `support-099` package passes because the validator compares values rather than hard-coding a case.

The implementation pattern follows Node.js native ESM behavior. `import.meta.url` can support a self-invocation check, and `pathToFileURL` converts a filesystem path to an import URL when such a conversion is specifically needed. Neither is a reason to use absolute URLs for ordinary local imports. Sources: https://nodejs.org/api/esm.html and https://nodejs.org/api/url.html#pathtofileurlpath.