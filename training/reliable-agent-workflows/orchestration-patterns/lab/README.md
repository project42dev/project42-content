# Reliable orchestration patterns lab

This dependency-free Node.js 22-or-later lab compares seven executable orchestration patterns: direct, sequential, router, manager, handoff, parallel, and evaluator. Trusted deterministic local fixtures make no network requests, call no language model, and do not execute learner-supplied code.

## Start here

```text
cd training/reliable-agent-workflows/orchestration-patterns/lab
node --version
npm run regression
npm run learner:test
```

`node --version` must report Node.js 22 or later. Node.js documents the native test runner at https://nodejs.org/api/test.html.

The initial `npm run regression` command runs only `test/executor.test.mjs` and should pass 23 tests. It is the regression baseline and is independent of the editable learner graph. The initial `npm run learner:test` command is expected to fail because `src/learner.mjs` intentionally gives `review` the false dependency `research`.

Now repair the learner graph:

1. Open `src/learner.mjs`.
2. Find the `review` node.
3. Change only its dependency list from `['research']` to `[]`.
4. Do not change the parent dependency list. The parent must still depend on `research`, `review`, and `validate`.
5. Save the file.
6. Run `npm run learner:test` again. It should pass.
7. Run `npm test`. It runs both the regression suite and the learner test and should pass 24 tests after the repair.
8. Run `npm run learner` to view the assessment and causal feedback.
9. Compare `src/solution.mjs` only after attempting the edit.

The repair must change the actual exported `learnerGraph`. Do not weaken assertions, change tests, alter fixture delays or labels, remove parent dependencies, or copy solution output without editing the graph.

## Other commands

```text
npm run demo
npm run trace
npm run trace -- router
npm run trace -- evaluator
npm run solution
```

## Expected seven-demo output

A successful run of `npm run demo` prints exactly:

```text
direct     terminal=success used=1 evidence=1
sequential terminal=success used=5 evidence=3
router     terminal=success used=5 evidence=3 route=specialist
manager    terminal=success used=4 evidence=2
handoff    terminal=success used=4 evidence=3
parallel   terminal=success used=8 evidence=5
evaluator  terminal=success used=7 evidence=5 revisions=2
```

These are deterministic local fixture results. The cost values are fictional budget units, not tokens, money, latency, or measured compute.

## What each pattern executes

| Pattern | Executable behavior | Terminal rule |
| --- | --- | --- |
| Direct | One parent fixture performs one bounded publish action. | Its validated parent result succeeds. |
| Sequential | Draft runs before validation, then parent aggregation runs. | Approval requires current validation evidence. |
| Router | Classification selects exactly one worker from `specialist` or `direct`; the other is skipped. | Approval requires current evidence from the selected worker. |
| Manager | Research returns typed evidence to the parent. | The parent retains synthesis and approval control. |
| Handoff | Parent transfers ownership under a trusted contract; the specialist explicitly returns it. | Approval requires ownership to return to parent. |
| Parallel | Research, review, and validation start independently and overlap. | Every required current-revision result must succeed at the parent join. |
| Evaluator | Evaluation reports unmet criteria, revision changes the artifact, and evaluation repeats. | Only an evaluator with no unmet criteria approves; limits escalate. |

Anthropic describes routing and evaluator-optimizer workflows at https://www.anthropic.com/engineering/building-effective-agents. OpenAI distinguishes manager-style agents-as-tools from handoffs at https://openai.github.io/openai-agents-js/guides/multi-agent/. Google ADK documents sequential, loop, and parallel workflow structures at https://adk.dev/agents/workflow-agents/.

## Router input experiment

The supplied input has `risk: 'high'`, so `npm run trace -- router` includes a selected specialist route, a skipped `directWorker`, and no dispatch for `directWorker`. The final line is:

```text
FINAL success route=specialist used=5
```

To inspect the alternate route, use the low-risk override in the router regression test or temporarily change `risk` from `high` to `low` in a local copy of the input. Run the router test and observe that only `directWorker` is invoked while `specialistWorker` is skipped. Restore the supplied input afterward. A missing or unknown route fails with `ROUTE_INVALID` before either worker runs or approval occurs.

## Parallel trace evidence

Run:

```text
npm run trace
```

The first three dispatches are research, review, and validate. Their settlement order can vary with host timer scheduling. The final line is:

```text
FINAL success aggregation=research,review,validate used=8
```

Tests count simultaneously active fixtures and require a maximum of three, proving actual overlap. The parent joins evidence by dependency ID. A required branch failure prevents approval, cancels pending work, and causes late completion to be ignored.

The learner graph has three actual independent branch boundaries: research, review, and validate each starts with an empty dependency list after repair. The required parent join remains a separate boundary because it requires all three dependency IDs. Regression tests retain the checks for concurrency and for the required join. The learner test additionally checks that all three branch starts occur before the parent and that parent aggregation contains all three IDs.

## Evaluator trace evidence

Run:

```text
npm run trace -- evaluator
```

The starting artifact is missing `signed release records` and `verified rollback owner`. The trace evaluates revision zero, revises the artifact, evaluates revision one, revises again, and then evaluates revision two. The final line is:

```text
FINAL success revisions=2 used=7
```

A reviser cannot approve. An evaluator cannot approve while reporting unmet criteria. Reaching the revision, budget, timeout, or deadline bound escalates instead of succeeding.

## Assessment output

Before repair, `npm run learner` reports:

```text
assessment pass=false independent=false requiredJoin=true
execution terminal=success used=7
feedback=Review depends on research, so it cannot overlap research. The parent still joins all three branches, but the false edge lengthens the execution path.
```

After the actual edit and save, it reports:

```text
assessment pass=true independent=true requiredJoin=true
execution terminal=success used=7
feedback=Remove the false review dependency while retaining all three parent dependencies. The runtime can now overlap the independent branches without weakening final evidence requirements.
```

`npm run solution` prints the passing assessment and solution feedback. It does not replace running the learner test against the editable file.

## Preserved security and semantic boundaries

The regression suite retains tests for:

- unknown dependencies, duplicate IDs, self-dependencies, cycles, and multiple final nodes;
- final nodes that lack transitive dependencies on required work;
- tenant, principal, role, allowed-action, approval, revision, and contract enforcement;
- trusted handoff source, destination, transition, acceptance, and explicit return;
- closed router maps, excluded-route nonexecution, and selected-evidence validation;
- actual overlap, concurrency limits, required partial failure, cancellation, and ignored late completion;
- conflicting writes, retry caps, operation timeouts, deadlines, and a never-settling fixture;
- evaluator criteria consistency, actual artifact changes, revision caps, budget caps, and terminal evaluator approval.

These are local executable checks. They do not prove that a production deployment has the same security properties. Timer handles and cooperative cancellation follow the Node.js APIs documented at https://nodejs.org/api/timers.html#timeoutref and https://nodejs.org/api/globals.html#class-abortcontroller.

## Fixture boundary

The `effects` array contains in-memory records accepted after validation. The lab proves that rejected and post-terminal results cannot enter that array. It does not prove rollback of arbitrary external effects performed before a fixture returns. Production integrations require their own durable identity, commit protocol, idempotency controls, audit storage, provider-specific validation, and cancellation tests.

## Sources

- Node.js test runner: https://nodejs.org/api/test.html
- Anthropic, effective agent patterns: https://www.anthropic.com/engineering/building-effective-agents
- OpenAI Agents SDK, multi-agent patterns: https://openai.github.io/openai-agents-js/guides/multi-agent/
- Google ADK, workflow agents: https://adk.dev/agents/workflow-agents/

ASSUMPTIONS.

- The supplied package scripts, tests, source files, fixture outputs, and class-segment text are the authoritative lab contents.
- The stated 23-test baseline and 24-test repaired total are expected results from the supplied repository, not independently executed here.

OMITTED.

- No files outside the requested learner workflow, README, and conflicting class segment were changed or reproduced.