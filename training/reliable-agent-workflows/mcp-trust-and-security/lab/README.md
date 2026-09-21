# MCP trust-boundary repair lab

This is a deterministic offline policy exercise for Node.js 22 native ESM. It uses no dependencies, API keys, network, live model, live MCP server, OAuth exchange, token signature, user approval, or downstream write. All identities and claim objects are synthetic.

Inspecting `tokenClaims.aud` does not authenticate a caller. In production, these facts must come from trusted cryptographic and transport validation using the selected OAuth implementation.

## Repair

`policy.mjs` checks that an approved identity exists but does not compare it with the requesting identity. Repair only that predicate. Do not modify `policy-core.mjs`, `fixtures.json`, or `test.mjs`. Deny-all is invalid.

From the repository root:

    node training/reliable-agent-workflows/mcp-trust-and-security/lab/test.mjs training/reliable-agent-workflows/mcp-trust-and-security/lab/policy.mjs

Reference:

    node training/reliable-agent-workflows/mcp-trust-and-security/lab/test.mjs training/reliable-agent-workflows/mcp-trust-and-security/lab/reference/policy.mjs

Variation:

    node training/reliable-agent-workflows/mcp-trust-and-security/lab/variation.mjs training/reliable-agent-workflows/mcp-trust-and-security/lab/policy.mjs

## Exact starter stdout

    PASS baseline-authorized expected=ALLOW actual=ALLOW
    PASS prompt-injection expected=CONTAIN_UNTRUSTED_OUTPUT actual=CONTAIN_UNTRUSTED_OUTPUT
    PASS audience-mismatch expected=REJECT_AUDIENCE actual=REJECT_AUDIENCE
    FAIL confused-deputy-consent expected=REJECT_CONSENT_MISMATCH actual=ALLOW
    PASS wildcard-scope expected=REJECT_SCOPE actual=REJECT_SCOPE
    PASS changed-tool-contract expected=REJECT_TOOL_DRIFT actual=REJECT_TOOL_DRIFT
    PASS ambiguous-timeout-after-write expected=CONTAIN_VERIFY_POSTCONDITION actual=CONTAIN_VERIFY_POSTCONDITION
    PASS missing-audience-and-server expected=REJECT_MALFORMED_INPUT actual=REJECT_MALFORMED_INPUT
    PASS missing-both-digests expected=REJECT_MALFORMED_INPUT actual=REJECT_MALFORMED_INPUT
    PASS token-grants-no-scopes expected=REJECT_MALFORMED_INPUT actual=REJECT_MALFORMED_INPUT
    PASS unknown-post-write-state expected=CONTAIN_VERIFY_POSTCONDITION actual=CONTAIN_VERIFY_POSTCONDITION
    PASS null-input expected=REJECT_MALFORMED_INPUT actual=REJECT_MALFORMED_INPUT
    PASS array-input expected=REJECT_MALFORMED_INPUT actual=REJECT_MALFORMED_INPUT
    PASS server-id-wrong-type expected=REJECT_MALFORMED_INPUT actual=REJECT_MALFORMED_INPUT
    PASS empty-consent-identity expected=REJECT_MALFORMED_INPUT actual=REJECT_MALFORMED_INPUT
    PASS scope-not-array expected=REJECT_MALFORMED_INPUT actual=REJECT_MALFORMED_INPUT
    PASS empty-required-scopes expected=REJECT_MALFORMED_INPUT actual=REJECT_MALFORMED_INPUT
    PASS duplicate-requested-scope expected=REJECT_MALFORMED_INPUT actual=REJECT_MALFORMED_INPUT
    PASS duplicate-token-scope expected=REJECT_MALFORMED_INPUT actual=REJECT_MALFORMED_INPUT
    PASS token-missing-required-grant expected=REJECT_SCOPE actual=REJECT_SCOPE
    PASS invalid-dispatch-state expected=REJECT_MALFORMED_INPUT actual=REJECT_MALFORMED_INPUT
    PASS invalid-response-enum expected=REJECT_MALFORMED_INPUT actual=REJECT_MALFORMED_INPUT
    PASS invalid-postcondition-enum expected=REJECT_MALFORMED_INPUT actual=REJECT_MALFORMED_INPUT
    PASS confirmed-after-write-timeout expected=ALLOW actual=ALLOW
    PASS completed-confirmed expected=ALLOW actual=ALLOW
    SUMMARY 24/25

Exit code: `1`.

## Exact repaired stdout

The repaired output has the same order, with this corrected fourth line:

    PASS confused-deputy-consent expected=REJECT_CONSENT_MISMATCH actual=REJECT_CONSENT_MISMATCH

Every other line is identical to the starter output, and the final line is:

    SUMMARY 25/25

Exit code: `0`.

## Exact variation stdout

    PASS changed-overbroad-scope expected=REJECT_SCOPE actual=REJECT_SCOPE
    PASS changed-client-mismatch expected=REJECT_CONSENT_MISMATCH actual=REJECT_CONSENT_MISMATCH
    PASS changed-authorized-client expected=ALLOW actual=ALLOW
    SUMMARY 3/3

Exit code: `0`.

## Answer and causal feedback

The repaired predicate is:

    consent => consent.approvedClientId === consent.requestingClientId

If only the confused-deputy case fails, the policy checks consent presence without identity equality. If authorized cases fail, the repair is too broad or hard-coded. If malformed regressions fail, shared validation was changed.

## Recovery

Restore the starter from the repository root:

    cp training/reliable-agent-workflows/mcp-trust-and-security/lab/policy.starter.mjs training/reliable-agent-workflows/mcp-trust-and-security/lab/policy.mjs

On systems without `cp`, replace `policy.mjs` with `policy.starter.mjs`. Compare with `reference/policy.mjs` to restore the repaired state.

Never recover an ambiguous `AFTER_WRITE` timeout by blindly retrying. Verify the postcondition independently. If it remains unknown, escalate and preserve the correlation ID, operation ID, approval, request digest, dispatch phase, and state-query evidence.

Passing this lab proves only deterministic policy behavior. It does not prove MCP or OAuth conformance, cryptographic validation, server trustworthiness, approval, execution, or downstream state.
