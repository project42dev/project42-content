# Endpoint identity, network, and secrets repair lab

## Purpose

This is a focused Node.js 22 native ESM repair. The starter authenticates only through a trusted fixture flag, checks credential lifecycle state and role, and applies a resource limit. Its single authorization defect is that it does not compare the principal tenant with the requested resource tenant.

The lab has no network server, dependencies, API keys, real tokens, or live model. Synthetic `authenticated` and `credentialStatus` fields are fixture inputs, not results of cryptographic verification. A passing run proves only the local decision behavior covered by the tests.

Repository entry: [lab README](./training/self-hosted-model-operations/endpoint-identity-network-and-secrets/lab/README.md)

## Learner task

1. Use Node.js 22.
2. From the repository root, run the starter command below.
3. Predict the changed-input result before reading the reference: should active `user-blue` be allowed to invoke `endpoint-red`?
4. Edit only `starter/authorize.mjs`.
5. Preserve all validators, fixtures, reason names, audit redaction, valid allows, limits, and recovery behavior.
6. Re-run the starter command until all ten tests pass.
7. Run the independent reference command to confirm the test environment.

Do not special-case fixture IDs and do not deny every request. The required rule compares the validated principal tenant with the validated resource tenant. To make that comparison, bind the validated `resource` returned by `validateInputs` along with `principal` and `request`.

## Commands and exact results

Starter command from the repository root:

```text
node training/self-hosted-model-operations/endpoint-identity-network-and-secrets/lab/tests/run-tests.mjs training/self-hosted-model-operations/endpoint-identity-network-and-secrets/lab/starter/authorize.mjs
```

Exact starter stdout:

```text
PASS 01 valid allowed call
FAIL 02 cross-tenant request: expected deny scope_mismatch, got allow authorized
PASS 03 over-privileged action
PASS 04 exhaustion limit
PASS 05 injection remains data
PASS 06 audit leakage redaction
PASS 07 revoked credential
PASS 08 recovery sequence
PASS 09 malformed and unknown fields
FAIL 10 independent changed input: expected deny scope_mismatch, got allow authorized
RESULT 8 passed, 2 failed
```

Starter stderr is empty. Starter exit code is `1`.

After the repair, run the same command. Exact repaired stdout:

```text
PASS 01 valid allowed call
PASS 02 cross-tenant request
PASS 03 over-privileged action
PASS 04 exhaustion limit
PASS 05 injection remains data
PASS 06 audit leakage redaction
PASS 07 revoked credential
PASS 08 recovery sequence
PASS 09 malformed and unknown fields
PASS 10 independent changed input
RESULT 10 passed, 0 failed
```

Repaired stderr is empty. Repaired exit code is `0`.

Independent instructor reference command:

```text
node training/self-hosted-model-operations/endpoint-identity-network-and-secrets/lab/tests/run-tests.mjs training/self-hosted-model-operations/endpoint-identity-network-and-secrets/lab/reference/authorize.mjs
```

Its exact stdout is the repaired transcript above, stderr is empty, and exit code is `0`. The reference is a separate implementation and does not import the starter.

Reset command:

```text
node training/self-hosted-model-operations/endpoint-identity-network-and-secrets/lab/tools/reset.mjs
```

Exact reset stdout is:

```text
RESET starter/authorize.mjs restored; lab .work removed
```

Reset stderr is empty and exit code is `0`. Cleanup is restricted to this lab's `.work` directory.

## Causal feedback and answer key

The two starter failures are not authentication failures because both principals are marked authenticated and active. They are not role failures because both principals have the invoker role and invoke is a permitted role action. They are object-scope failures: the principal tenant and resource tenant differ, but the starter never compares them.

The usable minimal repair has two parts. First, destructure the validated `resource` returned by `validateInputs`:

```js
const { principal, request, resource } = validateInputs(principalInput, requestInput);
```

Then, after the role-to-action check and before the resource-limit check and allow path, add:

```js
if (principal.tenant !== resource.tenant) {
  return decision(false, "scope_mismatch", principal, request);
}
```

Keep the existing authentication, credential-status, role, resource-limit, and final allow logic unchanged. The validator has already resolved the request's known resource ID to the validated `resource` used by this comparison.

The changed input reverses the tenant direction. It prevents a patch that recognizes only `user-red` or `endpoint-blue`. Deny-all is also invalid because tests 01, 05, and the allowed recovery steps in test 08 require successful decisions.

Prompt injection is tested as inert content. The string asks for administrator authority, but authorization code never parses content for identity, role, tenant, or approval. Audit records omit content, so the synthetic marker does not leak into decision evidence.

## What this lab does not prove

It does not prove token signature, issuer, audience, expiry, device, user, or workload verification. It does not prove TLS, ingress, egress, DNS, proxy, service discovery, management-route isolation, secret delivery, container isolation, artifact integrity, production rate limiting, model-runtime behavior, log retention, or emergency approval. It executes no model and grants no real approval.

For a real integration, separately verify identity at the gateway, positive and negative serving and management reachability, allowed and denied egress, secret rotation followed by old-identity denial, production resource ceilings, telemetry redaction and deletion, audit completeness, in-flight reconciliation, scoped recovery, and emergency-route closure. Assign evidence to identity, network, secret-management, privacy, serving SRE, security operations, release governance, and incident-command owners.