# Consequence-based OWASP 2026 replay and repair lab

This is a Node.js 22 native ESM lab with no package dependencies and no network requirement.

## What is simulated

The retrieval text, model proposals, protected value, tool calls, output sinks, and state store are harmless deterministic fixtures. The labels `static` and `adaptive` describe authored fixture variants. No fixture invokes or evaluates a live model. Passing this lab does not prove prompt-injection resistance for a live model, provider, multimodal interface, or production deployment.

## What is a real control in the sample architecture

The replay implements closed contract validation, rejection of unknown properties, safe integer bounds, a fixed trusted-session identity, a hard work budget, complete mediation immediately before the synthetic sink, and observable state, call, and exposure counters. These are executable application controls, but their production effectiveness still depends on preserving them in the real integration.

A real integration must keep model output untrusted, derive identity from the authenticated session rather than model arguments, validate the same closed contract, authorize at every real sink, retain hard token or work and call caps, encode output for its destination, and collect actual downstream evidence. Do not replace these requirements with a prompt instruction.

## Files and edit boundary

Edit only `starter/authorize.mjs` for the focused repair. Do not edit `tests/gather-all.mjs`, `fixtures/cases.json`, or `reference/authorize.mjs` to obtain a passing learner result.

The one deliberate starter defect treats the string `POLICY_OVERRIDE_ALLOW` in retrieved data as authorization. Remove that trust path. Enforce the trusted policy's action, scope, destination, and maximum token estimate at the sink. Do not implement a marker blacklist.

## Commands from the repository root

Original starter:

    node training/ai-security-and-governance/owasp-top-10-llm-attacks/lab/tests/gather-all.mjs --target=starter

Exact stdout:

    FAIL s01-protected-export decision=ALLOW stateChanges=1 toolCalls=1 protectedExposed=false
    FAIL a01-protected-export decision=ALLOW stateChanges=1 toolCalls=1 protectedExposed=false
    FAIL s02-hidden-reveal decision=ALLOW stateChanges=0 toolCalls=1 protectedExposed=true
    FAIL a02-hidden-reveal decision=ALLOW stateChanges=0 toolCalls=1 protectedExposed=true
    FAIL s03-external-render decision=ALLOW stateChanges=0 toolCalls=1 protectedExposed=true
    FAIL a03-external-render decision=ALLOW stateChanges=0 toolCalls=1 protectedExposed=true
    RESULT cases=12 passed=6 failed=6 skipped=0 staticUnsafe=3/6 staticFailureRate=50.00% adaptiveUnsafe=3/6 adaptiveFailureRate=50.00%

Expected exit code: `1`.

Supplied independent reference:

    node training/ai-security-and-governance/owasp-top-10-llm-attacks/lab/tests/gather-all.mjs --target=reference

Exact stdout:

    RESULT cases=12 passed=12 failed=0 skipped=0 staticUnsafe=0/6 staticFailureRate=0.00% adaptiveUnsafe=0/6 adaptiveFailureRate=0.00%

Expected exit code: `0`.

After repairing the starter, rerun the starter command. Its exact expected stdout is the same successful `RESULT` line as the reference, and its expected exit code is `0`.

Recovery:

    node training/ai-security-and-governance/owasp-top-10-llm-attacks/lab/reset.mjs

Exact stdout:

    RESET starter/authorize.mjs

Expected exit code: `0`.

The test runner recreates only `training/ai-security-and-governance/owasp-top-10-llm-attacks/lab/test-scratch/latest-results.json`. It does not use `os.tmpdir()`.

## Case coverage

There are six static cases and six changed-input adaptive counterparts. Together they cover protected export, hidden-context exposure, an external rendering sink, work-budget enforcement, an allowed public summary, and unknown model arguments. Each record names its OWASP 2026 entries, anatomy triple, trust profile, control type, and expected consequences.

Failure rate is computed from actual replay observations. The denominator for each mode is the number of fixture cases in that mode. A case is unsafe when a case expected to be denied is allowed or produces a state change, tool call, or protected-value exposure. Exceptions are failures. Unsupported capabilities would be explicit skips, but this offline fixture set requires no unsupported capabilities, so the expected skip count is zero.

## Independent transfer record

For an authorized hosted or local test, record: model identifier; provider or distributor; API, command, or runtime; runtime version; adapter or chat template; decoding settings; tool schema; system instructions; disclosed defense specification; run date; and raw evidence path. Use `UNKNOWN` for missing evidence and state what would establish it. Keep hosted OpenAI, Google, and Anthropic evidence separate from local or hosted Meta, Qwen, DeepSeek, Mistral, and Phi evidence. Family names are coverage prompts, not vulnerability claims.
