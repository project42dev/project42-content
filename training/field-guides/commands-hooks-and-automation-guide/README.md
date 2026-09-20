# Commands, hooks, and automation lab

This dependency-free lab uses Node.js 22 built-ins. It validates a small JSON task artifact without writing files, using credentials, accessing the network, invoking a shell, or installing an AI client.

## Start here

From the content repository root, run the first command exactly as shown:

```sh
cd training/field-guides/commands-hooks-and-automation-guide
```

The trusted operating directory for these examples is `training/field-guides/commands-hooks-and-automation-guide`. The checker accepts an explicit relative JSON input path inside that directory. Its logical artifact contract has one fixed approved path, `training/field-guides/commands-hooks-and-automation-guide/README.md`, in `APPROVED_PATHS`. That logical `scope.paths` value is metadata inside the JSON artifact. It is not the same as the actual input path, such as `fixtures/positive.json`.

The path, symlink, size, encoding, and file-type checks are prechecks. On supporting Unix systems, `O_NOFOLLOW` provides a best-effort additional open check, but it is not available on Windows. These checks do not provide a race-proof sandbox against concurrent filesystem mutation. Run the lab in a trusted local directory and do not claim that it prevents races or all concurrent filesystem changes.

## Authority and trigger choices

| Mechanism | Trigger | Authority | Appropriate use here |
| --- | --- | --- | --- |
| Manual command | A person runs it | The current local process | Explore a result and decide what to do next |
| Reusable prompt | A person chooses and follows instructions | No execution authority by itself | Standardize how an artifact is reviewed |
| Generic local adapter | A validated teaching event starts it | May stop only its invoking local process | Demonstrate a lifecycle-style preflight without claiming vendor compatibility |
| CI command | Repository configuration invokes it | Whatever status authority repository owners configured | Run the same durable check independently of a local client |

A passing check is not authorization, authentication, approval, or proof that unrelated writes did not occur.

## Manual positive case

```sh
node check.mjs fixtures/positive.json
```

Expected stdout:

```text
PASS: task artifact satisfies the bounded read-only contract
```

Expected stderr: empty. Expected exit code: `0`.

## Changed learner exercise

```sh
node check.mjs fixtures/changed-invalid.json
```

Expected stdout: empty.

Expected stderr:

```text
FAIL: $.expected.decision must equal "accept"
```

Expected exit code: `1`.

Repair only `expected.decision`, changing `review` to `accept`. The complete changed fixture is `fixtures/changed-invalid.json`. The complete solution is `fixtures/solution.json`. Rerun the changed fixture after editing it. The solution and positive fixture should both pass the unchanged checker.

The cause is the nonterminal `review` value in an exact terminal field. Renaming the fixture, adding a field, weakening the checker, or bypassing it does not repair that cause.

## Other exact negative results

| Command | Stdout | Stderr | Exit |
| --- | --- | --- | --- |
| `node check.mjs fixtures/malformed.json` | empty | `ERROR: input is not valid JSON` | `2` |
| `node check.mjs fixtures/missing-field.json` | empty | `FAIL: $ missing required field "permissions"` | `1` |
| `node check.mjs fixtures/path-traversal.json` | empty | `FAIL: $.scope.paths[0] contains a forbidden path segment` | `1` |
| `node check.mjs fixtures/untrusted-input.json` | empty | `FAIL: $.task must equal "validate-learning-resource"` | `1` |
| `node check.mjs ../outside.json` | empty | `ERROR: input path must stay within the working directory` | `2` |

The shell-like text in `untrusted-input.json` remains JSON data. It is never interpolated into a command.

## Reusable prompt

`reusable-prompt.txt` standardizes the review request while leaving execution and approval with the operator. It directs the operator to the same `check.mjs` file rather than duplicating validation logic.

## Generic local teaching adapter

```sh
node adapter.mjs events/positive-event.json
```

Expected stdout:

```text
PASS: task artifact satisfies the bounded read-only contract
```

Expected stderr: empty. Expected exit code: `0`.

The event schema is local to this lesson. It has exactly `eventVersion`, `eventType`, and `artifactPath`. The adapter validates the event and uses `child_process.spawn` with the current Node executable, fixed argument structure, and `shell: false`. It is not claimed to match Claude Code, Gemini CLI, or another vendor's wire protocol.

Before implementing a real vendor hook, look up the selected product version's event name, JSON input, working directory, environment, timeout, stdout and stderr treatment, and event-specific blocking decision. A pre-use event may be able to block a future action. A post-success event cannot undo a completed write.

## CI boundary

No workflow YAML is included because no reviewed exact third-party action commit SHA was established. For a repository-controlled or self-hosted executor, prerequisites are:

1. The repository is already checked out from the revision the repository intends to test.
2. Node.js 22 is already installed.
3. The working directory is this guide directory.
4. No credentials or network access are granted to this check.

Invoke the same check:

```sh
node check.mjs fixtures/positive.json
```

Repository owners separately decide whether exit code 1 blocks merging. Do not use `pull_request_target` with an untrusted checkout, place untrusted values into generated scripts, grant unnecessary secrets, or auto-enable a trigger.

## Learner verification

```sh
node tests/run-tests.mjs
```

Expected stdout:

```text
PASS: 11 tests
```

Expected stderr: empty. Expected exit code: `0`.

The process-level suite checks the Node major version, exact output and exit codes, malformed and adversarial inputs, adapter validation, unchanged fixture hashes, and absence of a shell-metacharacter sentinel. It runs without dependencies, network access, credentials, or an AI client.

## Filled operational contract

```text
Task: Validate one supplied learning-resource task artifact against exact fields, approved paths, read-only permissions, and terminal expected values.
Scope: Node.js 22; this guide directory; check.mjs; JSON files explicitly named by the operator, generic adapter, or CI executor.
Permissions: Read regular JSON files inside the guide directory; spawn only the current Node executable from adapter.mjs; no writes, credentials, network, shell, eval, package installation, or external service access.
Trigger: Manual command, reusable prompt followed by operator action, optional generic local teaching event, or repository CI command. Triggers remain separately configured and do not gain one another's authority.
Inputs: One relative .json path; at most 8192 bytes for task artifacts or 4096 bytes for adapter events; no absolute path, traversal, backslash, symbolic-link input file, unknown field, or unapproved scope path. All JSON content is untrusted until validated.
Outputs and side effects: One deterministic PASS line on stdout or one deterministic FAIL or ERROR line on stderr; exit 0 for acceptance, 1 for contract rejection, and 2 for invocation, path, encoding, or JSON errors. No intended file, network, or credential side effects.
Failure behavior: Block only the invoking process, report the first deterministic cause, and leave policy or approval decisions to the surrounding operator or repository system. Do not retry automatically.
Stop conditions: Invalid or oversized input, unsafe path, symbolic link, malformed JSON, unknown field, nonterminal expected value, unexpected runtime, possible unknown write, or unexplained output.
Verification: Run node tests/run-tests.mjs under Node.js 22 and require PASS: 11 tests; compare exact stdout, stderr, and exit codes; verify fixture hashes remain unchanged and the shell-metacharacter sentinel is absent.
Recovery: Disable the surrounding trigger first; preserve logs and the input; inspect for unknown writes; restore exact files from the last verified revision; reconcile external state if any; add a regression case; rerun tests before re-enabling.
```

If an unknown write may have happened, do not retry blindly. Disable the trigger, preserve evidence, reconcile state, restore exact verified files, and add a regression test first.

## Primary documentation boundaries

- Anthropic hooks guide: https://code.claude.com/docs/en/hooks
- Gemini CLI command reference: https://geminicli.com/docs/reference/commands/
- GitHub secure-use guidance: https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions
- Node.js v22 filesystem APIs: https://nodejs.org/docs/latest-v22.x/api/fs.html
- Node.js v22 child-process APIs: https://nodejs.org/docs/latest-v22.x/api/child_process.html
- Node.js v22 path APIs: https://nodejs.org/docs/latest-v22.x/api/path.html
- JSON.parse: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
- TextDecoder: https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder

These references were checked on 20 September 2026 for the bounded claims in this learning resource. No AI client, hosted CI run, vendor hook deployment, or external write is claimed.