# Review Agent Results Against Evidence

This offline lab uses fictional, reversible support workflows for synthetic tenants. It performs no network requests, uses no credentials or paid provider calls, and causes no external effects. Fixture observations are classroom records, not production claims.

## Requirements

Use Node.js 22 or later. The lab uses native ECMAScript modules and Node.js built-ins only. Node.js documents package `type` behavior at https://nodejs.org/api/packages.html#packages_type, the test runner at https://nodejs.org/api/test.html, file promises at https://nodejs.org/api/fs.html#fspromisesreadfilepath-options, and child-process APIs at https://nodejs.org/api/child_process.html#child_processspawnsynccommand-args-options.

## Learner task

1. Read the work order and all criteria before trusting the agent summary.
2. Inspect both material baseline claims against bounded source excerpts, revisions, effective dates, provenance, and quoted content.
3. Inspect the consequential action against identity, operation, target, tenant, authorization, trace, and independently observed postcondition.
4. Run an actual check and copy its derived output into a review packet.
5. Label direct observations separately from inferences.
6. Give every criterion relevant evidence and a next action.
7. Choose `accept`, `request_changes`, or `escalate` without averaging away failed or unknown criteria.

Citation presence is not source support. A current authoritative excerpt can contradict a confident answer that cites an older source. Passing tests establish only their declared scope. They do not establish natural-language truth, authorization, or a real postcondition.

## Files

- `fixtures/baseline-dossier.json`: substantive Orion work order, sources, claims, authorization, trace, tests, observed state, and checks.
- `submissions/starter.json`: packet for the learner to complete.
- `submissions/solution.json`: complete worked packet.
- `submissions/flawed.json`: mechanically valid blanket acceptance that fails policy validation.
- `fixtures/changed-dossier.json`: independent Lyra case.
- `submissions/changed-solution.json`: changed-case solution.
- `rubrics/answer-rubric.md`: human semantic rubric and causal feedback.
- `checker.js`: generic data-driven checker.
- `test/checker.test.js`: positive and meaningful negative tests.

## Reproduce a check

Run:

`node checker.js inspect fixtures/baseline-dossier.json check-draft-state`

Exact output derived from `state-ticket@state-orion-2026-09-20-r4`:

```text
CHECK check-draft-state
revision state-orion-2026-09-20-r4
observed draft_present=true
result PASS
```

The checker does not replay the documented `exactOutput`. It reads the referenced evidence, renders the actual field value, and compares that value with the check expectation. If the observation changes to `false`, the command prints `result FAIL` and exits nonzero. The stored `exactOutput` is checked only as documentation and must remain synchronized with derived output.

## Validate the worked baseline packet

Run:

`node checker.js validate fixtures/baseline-dossier.json submissions/solution.json`

Exact output:

```text
STRUCTURAL PASS
POLICY PASS
DECISION escalate
CRITERIA verified=2 failed=2 unknown=1
RESULT PASS
```

## Diagnose the flawed packet

Run:

`node checker.js validate fixtures/baseline-dossier.json submissions/flawed.json`

Exact output:

```text
STRUCTURAL PASS
POLICY FAIL
- criterion C1 packet=verified evidence=failed
- criterion C4 packet=verified evidence=unknown
- decision packet=accept evidence=escalate
RESULT FAIL
```

The command exits with status 1. The packet has complete, relevant references and human claim-review records, but its verdicts misuse the evidence.

## Independent changed-input exercise

Review `fixtures/changed-dossier.json` without copying the baseline decision. Its policy, operation, authorization, trace, target, tenant, and state are independent inputs. Create your own packet before opening `submissions/changed-solution.json`.

Run:

`node checker.js validate fixtures/changed-dossier.json submissions/changed-solution.json`

Exact output:

```text
STRUCTURAL PASS
POLICY PASS
DECISION accept
CRITERIA verified=5 failed=0 unknown=0
RESULT PASS
```

## Tests

Run `node --test`.

The suite covers both solutions, the flawed policy decision, changed observations, empty and unrelated criterion evidence, dangling references, wrong source revisions, tenant mismatches, different actors, malformed rules, stale reproduced output, and CRLF input.

## Automation and human judgment

Structural validation checks IDs, revisions, evidence kinds, rule references, exact bindings, claim-review coverage, criterion-relevant references, and derived check output. Policy validation compares the packet with machine-readable dossier rules. The checker does not understand natural-language truth. A human must compare each claim with the bounded excerpt, evaluate freshness and authority, distinguish observation from inference, and challenge incorrect dossier annotations.

The fixture does not demonstrate production authorization, message delivery, durability, tenant isolation, or provider quality. The method applies to local models, open-weight models, and hosted providers without ranking them.

## Public references

- NIST AI Risk Management Framework: https://www.nist.gov/itl/ai-risk-management-framework
- OWASP LLM06:2025 Excessive Agency: https://genai.owasp.org/llmrisk/llm062025-excessive-agency/
