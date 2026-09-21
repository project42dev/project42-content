# Structured Outputs Mastery Repair Lab

This is a deterministic Node 22 native ESM exercise. It has no dependencies, needs no API key, and makes no network request. Response envelopes are application-owned fixtures. They do not establish the behavior of OpenAI, Anthropic, Google, or any live model.

## Run

From the repository root:

```sh
cd training/developer-and-practitioner-ai/structured-outputs-mastery/lab
npm test
```

The expected starter aggregate is 23 tests, with 20 passing and 3 failing. The command exits 1. The failures are the ordinary, Unicode-escaped, and nested duplicate-key cases. TAP timing is not specified because it varies by machine.

These are expected results. This deliverable does not claim that its author executed the commands.

## Single intended defect

`src/gate.mjs` contains the only learner defect. Its `parseUniqueJson` function immediately calls `JSON.parse`, which accepts duplicate object keys and retains the last value.

`src/policy.mjs` already implements exact-key validation, trusted-context type validation, positive safe-integer domains, request binding, checks for every cited evidence record, unique cited and registry evidence IDs, explicit one-transaction amount semantics, and independent authorization. Do not weaken or edit that file.

## Worked attack

```sh
node src/cli.mjs fixtures/duplicate-action.json
```

Expected starter stdout, followed by a newline:

```text
APPROVE refund request=req-100 subject=acct-7 amount=25 USD evidence=tx-9
```

Expected starter exit code: `0`.

The response text contains both `"action":"deny"` and `"action":"refund"`. `JSON.parse` discards the first value, so every later check sees only `refund`.

After repair, expected stdout is:

```text
REJECT duplicate_key path=$.action
```

Expected repaired exit code: `2`.

## Independent changed case

```sh
node src/cli.mjs fixtures/valid-changed.json
```

Expected stdout for both a correct learner repair and the reference:

```text
APPROVE refund request=req-101 subject=acct-7 amount=40 USD evidence=tx-10
```

Expected exit code: `0`.

This case changes the request ID, amount, and evidence ID. A deny-all repair or a solution hard-coded to the worked fixture fails it.

## Repair requirements

1. Compare decoded object member names before calling `JSON.parse`.
2. Give each nested object its own set of names.
3. Treat `"action"` and `"act\u0069on"` as the same key.
4. Preserve all shared policy checks.
5. Do not edit `test/gate.test.mjs`, fixtures, or `src/policy.mjs`.

After a correct repair, `npm test` has the expected aggregate of 23 tests, 23 passing and 0 failing, and exits 0.

## Recovery

Restore the defective starter:

```sh
npm run reset
```

Install the complete reference parser:

```sh
npm run solution
npm test
```

These commands copy local files only. They do not install packages, call a provider, or execute a refund.

## Real integration remains separate

A live integration must map the chosen provider's documented refusal, truncation, and content fields into the normalized fixture shape. Record the exact provider API, model, and version. Do not place API keys in this lab, and do not describe deterministic fixture results as live provider results.
