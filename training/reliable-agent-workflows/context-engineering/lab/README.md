# Context Engineering Reliability Lab

This offline lab builds and tests a context package for a fictional consequential workflow. It uses only Node.js built-ins, native ECMAScript modules, fixture records, and deterministic simulated size units. A size unit is a fixture-defined teaching measure. It is not a token count and must not be described as one.

## Learning goals

1. Separate governing policy, user goal, trusted state, evidence, untrusted retrieved data, prior decisions, tool contracts, output requirements, budget, and missing information.
2. Select the smallest sufficient package while considering relevance, authority, freshness, and disconfirming evidence.
3. Remove or summarize material without losing source identity, verification date, transformation records, or exact-source rehydration.
4. test injection, contradiction, omission, stale state, overload, safety, idempotency, and recovery.

## Fictional decision

The fixtures concern a fictional change-control service deciding whether to change a record from `reviewed` to `approved`. The names, policies, records, and revisions are invented. The implementation is not keyed to those names. It processes generic contracts, claims, revisions, mutations, and records.

## Run

```text
node --version
npm test
npm run lab
npm run exercise
```

Node.js 22 or later is required by `package.json`. Native ESM is documented at https://nodejs.org/api/esm.html. The built-in test runner is documented at https://nodejs.org/api/test.html, and assertions at https://nodejs.org/api/assert.html.

No install step, network, credentials, model provider, or paid call is used.

## Context contract

The trusted contract, not evidence, supplies authoritative source IDs, freshness rules, required claims, exact-claim rules, role vocabulary, and tool authority. Evidence cannot promote itself by writing `trust: trusted`. Retrieved text and tool text remain untrusted data even when they contain useful factual claims.

Budgeting reserves instructions, request, tool schemas, output, and expected results before evidence. Mandatory control slots must exist independently of the evidence capacity. If required evidence or required disconfirming evidence cannot fit, qualification fails closed with `ESCALATE`.

Selection uses portable fixture predicates such as `relevant`, `ageDays`, `claimId`, and source membership. These predicates make the exercise reproducible. They are not semantic AI truth, do not prove a source is correct, and do not establish certainty from age or citation quality.

## Learner workflow

1. Run `npm run lab` and compare the generated lines with `expected-cli-results.txt`.
2. Open `fixtures/scenarios.json`. Trace how trusted contract data stays separate from candidate claims.
3. Run `npm test`. Read each negative test and explain which observable control fails.
4. Edit `exercise/learner-case.json` as directed in `exercise/README.md`.
5. Run `npm run exercise`, record the changed result, and complete `exercise/artifact-template.md`.
6. Compare only after attempting the task with `exercise/SOLUTION.md` and use its causal rubric.

## Transfer limits

The lab is model- and provider-neutral. Its manifest, provenance, and tool gates can surround local or open-weight models and hosted models. Provider transports, caches, hidden state, role handling, tool APIs, and retention behavior differ. Passing this deterministic lab does not establish that any model or provider will resist semantic prompt injection, interpret evidence correctly, or behave safely in production. Those properties require system-specific evaluation.

