# Multi-Agent Orchestration and Consensus Lab

This dependency-free Node 22 lab uses deterministic local fixtures. It does not call a live provider, reproduce BrowseComp, reproduce any published benchmark, or claim compatibility with ADK or another vendor protocol.

The lab teaches four boundaries: multi-agent capacity is not automatically quality, self-consistency agreement is not correctness, debate convergence is not correctness, and a worker count is not required-worker completeness. It includes actual asynchronous joins, immutable inputs, identity, tenant, revision, budget, deadline, and failure validation.

No execution is claimed by this README. The lines below are expected results for the supplied deterministic fixtures.

## Commands

Run from this directory:

    npm run demo
    npm test
    node learner/learner.test.js
    node learner/changed-input.test.js
    node test/consensus-pair.test.js

`npm run demo` is expected to print eleven demonstration lines: four vote lines, two debate lines, and five join lines.

Do not edit `src/core.js`, `test/main.test.js`, `learner/learner.test.js`, `learner/changed-input.test.js`, or `test/consensus-pair.test.js` for the learner repair. The strict runtime is unchanged. Edit only the `hasRequiredWorkers` function in `learner/join-policy.js`. A reference solution is available at `learner/reference/join-policy.solution.js` after you attempt the repair.

## Expected learner failure and repair

The shipped learner policy is deliberately broken. It checks whether the number of valid results is at least the number of required IDs.

The immutable learner test configures required workers `alpha`, `beta`, and `gamma`, plus optional worker `delta`. Beta is configured, so strict pre-invocation validation accepts the configuration. Beta then returns a stale revision and its envelope is rejected. Alpha, gamma, and delta remain valid. There are three valid results and three required IDs, but beta is missing.

Before the repair, expect:

    FAIL learner repair: required worker beta is absent but broken policy returned complete=true
    CAUSE: three valid envelopes matched the required count, but delta did not satisfy required identity beta

Repair `hasRequiredWorkers` by forming a set of `validResults.workerId` values and requiring every `requiredWorkerId` to be present. Do not weaken strict runtime validation and do not change the worker configuration to hide the defect.

After the repair, expect:

    PASS learner repair: required identities enforced

The same test contains a positive control. Beta is valid while optional delta is invalid, leaving the same number of valid envelopes. This case must be complete. Together, the cases show why returning false unconditionally is not a valid repair.

Next run the independently changed extra-worker case. It replaces delta with epsilon and makes beta fail tenant validation rather than revision validation. After the repair, expect:

    PASS changed input: impostor epsilon cannot replace required beta

Before the repair, that command is expected to fail with causal feedback because the count-only rule again sees three valid envelopes.

A general scratch case with required `north,south,west` and supplied `north,south,east` must be false. Replacing east with west must be true.

## Main regression and asynchronous assertions

The expected main regression line is:

    PASS main regressions: 22 assertions

The count is explicit: 8 self-consistency assertions, 6 ordinary debate assertions, 1 never-resolving debate timeout assertion, and 7 join assertions.

Use `await assert.rejects(...)` for rejected promises from async `runJoin` and `runDebate` calls. `assert.throws` checks a synchronous throw during a function call. An async function returns a promise, so its later rejection must be awaited. See the standard Node.js documentation:

https://nodejs.org/api/assert.html#assert_throw_s_fn_error_errorcode_message

https://nodejs.org/api/assert.html#assert_rejects_promise_error_errorcode_message

The deadline regression uses responders that never settle. `runDebate` must reject through its timeout path instead of waiting forever.

## Separate equality regression

Run:

    node test/consensus-pair.test.js

Expected after the separately dispatched runtime repair:

    PASS equality regression: position and artifact compared as a pair

This regression supplies two different `(position, artifact)` pairs whose delimiter-based string encodings can collide. Convergence must compare the two fields as a pair. The corresponding runtime change is not part of this learner delivery, so do not edit `core.js` during the learner activity.

## Worked examples and causal feedback

### Required-worker identity

Required IDs are `alpha,beta,gamma`. Configured workers are `alpha,beta,gamma,delta`. Beta returns a revision-mismatched envelope, while alpha, gamma, and delta return valid envelopes. The valid result count is three, equal to the required count, but the join is incomplete because beta is absent.

The causal diagnosis is precise: counting envelopes verifies quantity, while set inclusion verifies identity coverage. More workers or debate rounds cannot repair the wrong predicate. Replacing delta with epsilon preserves the negative result. Making beta valid and delta invalid preserves the count but changes the result to complete.

### Agreement and correctness

Votes `yes=4`, `no=2`, and `unclear=1` produce agreement `4/7`, approximately `0.571`, and escalate under the illustrative `0.8` rule. Five identical `yes` votes produce agreement `1.0`, but an external record can still establish that `no` is correct.

### Debate and correctness

One deterministic trace revises toward `42` and passes an external arithmetic check. Another converges on `41` and fails that check. Convergence decides when to stop. It does not establish truth.

## Safety invariants

`selfConsistency` rejects empty, duplicate, or non-string answer values, empty samples, non-finite thresholds, and thresholds outside 0 through 1. Invalid samples are represented explicitly and cause escalation. A threshold is a routing policy, not proof.

`runDebate` rejects duplicate or invalid agent identities, requires bounded rounds and explicit per-round and overall timeouts, and checks both position and artifact for convergence. A timeout prevents the orchestrator from waiting forever. JavaScript promises cannot be forcibly cancelled by this lab, so a noncooperative callback may continue in the background. The lab makes no external-cancellation claim and never accepts a result after its deadline.

`runJoin` rejects empty or duplicate worker and required-ID lists, requires every required ID to be configured, and requires nonempty tenant and revision values. It validates budget and deadline before invocation, records failures, validates each returned identity, tenant, revision, and evidence field, sorts valid results by identity, and passes them to the selected quorum policy. Empty configuration can never produce `complete=true`.

The learner test does not request an unknown worker. Beta is configured and invoked, then rejected because its returned envelope is invalid. This preserves strict runtime validation and ensures the learner policy is actually reached.

## Causal diagnosis

The count-only learner defect is MAST `incorrect verification`: a verification check ran, but counting envelopes did not establish that the required identities participated. More agents or more debate rounds cannot repair that predicate. The structural repair is identity-set inclusion followed by negative, positive-control, and changed-input regressions.

MAST source: https://arxiv.org/abs/2503.13657

## Sources used by the module

Anthropic, scoped multi-agent BrowseComp analysis: https://www.anthropic.com/engineering/multi-agent-research-system

Self-consistency: https://arxiv.org/abs/2203.11171

Multi-agent debate: https://arxiv.org/abs/2305.14325

MAST failure taxonomy: https://arxiv.org/abs/2503.13657

Parallel workflow documentation used only for the general observation that parallel branches need explicit joins: https://adk.dev/agents/workflow-agents/parallel-agents/

Node.js asynchronous assertion documentation: https://nodejs.org/api/assert.html
