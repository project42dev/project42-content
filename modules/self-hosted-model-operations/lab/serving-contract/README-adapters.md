# Offline serving-adapter contract exercise

This is a straightforward fictional, application-owned exercise. It compares **two hypothetical, explicitly fictional adapters**. This Python standard-library exercise supplements the companion serving-contract lesson in this lab folder. Its fixed responses, latency values, error values, model artifact names, and bundle identities are synthetic fixtures. It does not contact, observe, or qualify two real servers. It does not replace lifecycle or conformance evidence from the Qwen and llama.cpp local serving lab.

An `OFFLINE_ELIGIBLE` result means only that the supplied classroom fixtures passed this offline decision function. It is never deployment authorization. A real rollout requires independently collected, non-fabricated operational evidence and an authorization process outside this exercise.

## Application-owned contract

The original request and normalized response contain exactly four fields:

* `requestId`: nonempty string, echoed exactly.
* `category`: exact member of `billing`, `technical`, `account_recovery`, or `access`.
* `explanation`: nonempty after trimming. Adapter B deliberately trims it.
* `modelArtifactId`: nonempty string, echoed and verified exactly.

Unsupported user-requested capabilities such as `tools` are rejected. They are never silently dropped. Fixed responses are test data, not claimed LLM generations.

## Two fictional mappings and completed matrix

| Application field | Application behavior | Fictional Adapter A field | A behavior | Fictional Adapter B field | B behavior |
|---|---|---|---|---|---|
| `requestId` | required | `ticket_id` | required exact | `id` | required exact |
| `category` | required exact | `kind` | required exact | `label` | required exact |
| `explanation` | required nonempty | `reason` | required nonempty | `description` | transformed: trim |
| `modelArtifactId` | required exact | `artifact` | required verified | `model_id` | required verified |
| `tools` | rejected: unsupported | `tools` | rejected: unsupported | `tools` | unavailable: error |
| `confidential` | unavailable in original contract | `confidential` | rejected: unsupported | `confidential` | unavailable: error |

The mappings are genuinely different wire schemas. Both validate exact shapes, deep-copy inputs, reject unknown fields, and check that caller-owned input was not mutated.

## Exact commands

Run from `modules/self-hosted-model-operations/lab/serving-contract/`:

```text
python adapter_exercise.py
python -m unittest -v test_adapter_exercise.py
python -m unittest -v test_adapter_changed.py
python -m unittest -v test_adapter_rollback_boundaries.py
python -m unittest -v test_adapter_exercise.py test_adapter_changed.py test_adapter_rollback_boundaries.py
```

The adapter suite contains 17 tests: 7 in `test_adapter_exercise.py`, 5 in `test_adapter_changed.py`, and 5 in `test_adapter_rollback_boundaries.py`. Running the first two files is a 12-test subset. The command naming all three files runs the complete 17-test adapter suite. Together with the 8 tests in `test_conformance.py`, all four Python test files contain 25 tests.

The exact standard output from `python adapter_exercise.py` is:

```text
MATRIX_ROWS=6
FIXTURES=3 ADAPTER_RUNS=6 PASS
FLAWED_CANDIDATE=HOLD
CORRECTED_CANDIDATE=OFFLINE_ELIGIBLE
ROLLBACK=OFFLINE_ELIGIBLE RERUN=3
{"deploymentAuthorization": false, "scope": "offline synthetic fictional adapters"}
```

The adapter program prints the six lines shown above. Those output lines are program results, not six additional tests. The unit-test commands end in `OK` when successful. `test_adapter_exercise.py` defines 7 tests, `test_adapter_changed.py` defines 5 tests, and `test_adapter_rollback_boundaries.py` defines 5 tests. The command naming all three adapter test files runs 17 tests. Timing text printed by `unittest` is environment-dependent and is not a performance result.

## Cutover and rollback

`cutover_gate` requires exact coverage of all fixture IDs. It rejects duplicate IDs, malformed nested results, missing normalized outputs, empty or incorrect identities, artifact mismatches, unknown case IDs, boolean metrics, missing metrics, negative metrics, nonfinite values, numeric overflow, a canary above 0.10, increased candidate errors, or candidate latency above 1.5 times baseline.

The evidence label must begin with `operator-reviewed:synthetic-fixture:` and include a nonempty note. This label records only a classroom fixture assertion. The code cannot establish that a real operator performed a review, so it cannot authorize real traffic.

`rollback_exercise` checks that the active reference is the candidate, restores an adapter whose exact identity matches the prior immutable-style reference, calls that restored adapter for every original fixture, normalizes each fixed response, and compares every result with its expected output. A malformed or failed rerun returns `HOLD`; it is not relabeled as a successful rollback.

## Flawed and corrected candidates

`BrokenCandidate` erases the required explanation. That causes `INVALID_EXPLANATION`, a consequential compatibility failure. A paired fixture with a changed category or artifact identity also makes the cutover gate return `HOLD`.

`AdapterB` is the corrected original-scope candidate. It retains explanation content, verifies both identities, and passes the same semantic cases as Adapter A despite using different wire fields.

## Changed task and separate answer

The independent changed requirement adds confidential account-recovery escalation. The original `AdapterB` rejects the added field, so it fails the changed requirement. `adapter_answer.py` supplies the complete separate `ChangedAdapter` answer:

* `confidential`, when present, must be an actual `bool`. Integers such as `1` are rejected.
* `confidential: true` is allowed only when the application category is `account_recovery`.
* Its transport label must become exactly `confidential_account_recovery`.
* The changed adapter's transport response must carry the same `confidential` Boolean flag and the escalated `confidential_account_recovery` label. The normalized application response remains the original exact four-field shape and has no `confidential` field.
* Unknown fields, an application request that directly supplies the escalated category, wrong IDs, wrong artifacts, and missing escalation all fail explicitly.
* Original four-field requests remain supported, so the original cases continue to pass without changing their contract.

The changed tests contain more than ten negative scenarios. They demonstrate that the original adapter fails the changed input, the separate answer passes it, original cases still pass through the answer, and gate and rollback failures remain closed. The changed transport response includes the `confidential` Boolean flag and the escalated category. Its normalized application response still has exactly four fields, uses `confidential_account_recovery` as the category, and contains no `confidential` field.

## Causal feedback

A transport accepting a request does not prove application compatibility. Erasing `explanation` changes a required user-visible outcome. Accepting `confidential` without escalating recovery would hide a consequential routing distinction. Failing to verify `modelArtifactId` could associate an output with the wrong artifact. These are behavioral failures, not mere differences in field spelling.

## Grading key

A complete submission must:

1. Explain and run both fictional mappings over the same semantic fixtures.
2. Preserve request and artifact identities exactly.
3. reject unsupported, unknown, malformed, or ambiguous input without fallback.
4. Demonstrate pure mapping and normalization.
5. Include required, transformed, rejected, and unavailable matrix behaviors.
6. Reject duplicate fixture IDs and boolean, nonfinite, negative, missing, or overflowing metrics.
7. Compare complete paired baseline and candidate coverage under exact identities.
8. Return `HOLD` for consequential output, identity, latency, error, evidence, or coverage regressions.
9. Return only `OFFLINE_ELIGIBLE` or `HOLD`, never deployment authorization.
10. Restore the previous adapter reference and actually rerun the same fixtures.
11. Show the original adapter failing confidential escalation and the separate answer passing it while preserving original cases.

## Sources and scope

The schema and acceptance rules are application-owned requirements for this fictional exercise. They are not descriptions of an external provider protocol.

Python standard-library behavior used by the exercise is documented in the official Python documentation:

* `unittest`: https://docs.python.org/3/library/unittest.html
* `copy.deepcopy`: https://docs.python.org/3/library/copy.html
* `math.isfinite`: https://docs.python.org/3/library/math.html#math.isfinite

For context only, the companion pinned real-runtime material in this lab folder uses official llama.cpp server documentation at https://github.com/ggml-org/llama.cpp/blob/b29c606e28a01b1bc8c1351026a0fa6e616bf6c4/tools/server/README.md . No result from that live lab is represented as evidence for these fictional adapters.
