# Safe durable-memory boundaries lab

This offline Node.js lab demonstrates a governed lifecycle for synthetic memory. Trusted code supplies tenant, subject, and purpose identity, evaluates current policy, creates record IDs, and controls five independent simulated copies: authoritative store, index, summary, cache, and backup.

## Run it

From the repository root:

```sh
cd training/reliable-agent-workflows/memory-boundaries/lab
npm test
npm run demo
```

The lab requires Node.js 22 or later, uses native ECMAScript modules, has no third-party dependencies, and uses the built-in `node:test` runner. Node documents ECMAScript modules at https://nodejs.org/api/esm.html and the test runner at https://nodejs.org/api/test.html.

The test command defines exactly 19 tests. Test-runner timing and formatting can vary, so `expected/demo.txt` is the exact repeatable application output. Compare it with:

```sh
node src/cli.js demo > actual.txt
diff -u expected/demo.txt actual.txt
```

The project uses native ECMAScript modules through `type: module`, the built-in `node:test` runner, and `structuredClone` for defensive copies. See the Node.js documentation for ECMAScript modules at https://nodejs.org/api/esm.html, the test runner at https://nodejs.org/api/test.html, and filesystem URL resolution at https://nodejs.org/api/fs.html#fspromisesreadfilepath-options. The cloning API is documented at https://developer.mozilla.org/en-US/docs/Web/API/structuredClone.

## Boundaries enforced

Every read checks current authorization, the requested tenant, subject, and purpose, the authoritative record, deletion state, supersession, freshness, current eligible source policy, and current sensitivity policy. A derived copy is never the source of truth for value or provenance. If cache data is altered, the read returns the canonical store value. If canonical freshness metadata is malformed, the record is not readable.

Context fields reject the `|` delimiter because the supplied policy fixture uses that delimiter in consent keys. This prevents ambiguous boundary-key collisions while retaining compatibility with the fixture.

Request IDs bind the operation, complete boundary, and exact operation payload. Authorization runs before receipt reuse. A changed payload or boundary conflicts rather than reusing another request's result. Correction and expiration retries are checked for their prior receipt before state checks, so an exact safe retry remains idempotent. A current policy revocation still denies the retry.

Expiration creates value-free tombstone metadata and a deletion record while retaining the backup copy until the governed synthetic purge time. A later deletion request can reconcile that expired record. Receipts report actual copy state, distinguish active removal from backup pending, and contain no deleted value.

The injection detector is only a regular-expression heuristic. It can miss subtle attacks and reject benign text. This in-memory simulation does not prove process durability, secure erasure, encryption, distributed concurrency safety, production security, privacy compliance, or legal compliance. The retention interval comes from the synthetic fixture and is not a provider recommendation.

The general risk-management context is described in NIST's Generative AI Profile: https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence.

## Changed-input exercise

Read `exercise/README.md`. Work only from `exercise/starter.mjs` and `exercise/artifact-template.json` at first. The separate worked answer is in `exercise/solution.mjs`, and causal scoring guidance is in `exercise/rubric.md`.
