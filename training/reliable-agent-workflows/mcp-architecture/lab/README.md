# MCP architecture lab: limited 2025-11-25 teaching profile

## Scope and prerequisites

Use Node.js 24 or later. Run commands from the directory containing this README. The lab uses only built-in Node.js modules and local child processes. It requires no network, credentials, model provider, SDK, or paid service.

This is a limited teaching profile, not a complete MCP implementation, production sandbox, authentication system, durable store, or proof of provider compatibility. The lab uses newline-delimited JSON for its local stdio framing. That framing rule is supplied by this fixture, not by JSON-RPC itself.

The profile covers selected MCP lifecycle and tools behavior, JSON-RPC 2.0 request and response shape, local process isolation, capability negotiation, scope, approval, bounded timeouts, reconciliation, and cleanup.

Authoritative sources, checked 2026-09-20:

- MCP lifecycle 2025-11-25: https://modelcontextprotocol.io/specification/2025-11-25/basic/lifecycle
- MCP tools 2025-11-25: https://modelcontextprotocol.io/specification/2025-11-25/server/tools
- MCP architecture 2025-11-25: https://modelcontextprotocol.io/specification/2025-11-25/architecture
- JSON-RPC 2.0: https://www.jsonrpc.org/specification
- Node.js child processes: https://nodejs.org/api/child_process.html
- Node.js readline: https://nodejs.org/api/readline.html

## Learning objectives

1. Explain host, client, and server responsibilities without collapsing trust boundaries.
2. Trace initialization, version agreement, capability negotiation, the client-sent initialized notification, operation gating, and stdio shutdown.
3. Distinguish prompts, resources, and tools by who controls them and what risks they introduce.
4. Design a narrow tool contract with typed inputs, typed outputs, separate error channels, exact scope, approval, timeouts, reconciliation, and postcondition checks.

## Workflow

Run the demo first:

```text
node src/demo.mjs
```

The demo's eight output lines are:

```text
READY curriculum,assessment profile=2025-11-25 isolatedSessions=2
QUALIFIED curriculum::create_training_draft
QUALIFIED assessment::create_training_draft
CREATED UNPUBLISHED curriculum:1
DENIED Workspace denied by trusted host scope: ws_aaaaaaaa
STATE curriculum=1 assessment=0
PROMPT A user-selected review template, not authorization.
SHUTDOWN close-stdin,bounded-wait
```

Then edit `src/scope-policy.broken.mjs`. The unauthorized test input is intentional and explicit:

```text
allowed workspace:   ws_aaaa
requested workspace: ws_aaaaaaaa
```

Both strings satisfy the server input schema. The requested value is not an exact member of the trusted allowlist.

Run the learner test:

```text
npm run learner:test
```

Before repair, it is expected to fail because the broken prefix comparator permits the unauthorized workspace and creates a real child-server effect. After replacing the comparator with exact membership, run the same command again. It must pass and prove denial plus zero effects. The accepted repair is:

```js
export function workspaceAllowed(allowedWorkspaces, requestedWorkspace) {
  return allowedWorkspaces.includes(requestedWorkspace);
}
```

Only after `learner:test` passes, run the full regression suite:

```text
npm test
```

The full suite includes the fixed intentional baseline and security regressions. It does not run the intentionally failing learner baseline. This drafting environment did not execute Node.js, so no runtime pass is claimed here.

`learner:solution` is reference-only. It runs tests against `src/scope-policy.solution.mjs`; it is not the learner's repair and should not be used as evidence that the editable file was fixed:

```text
npm run learner:solution
```

## Lifecycle and trust boundaries

The initialize request and result both use the exact wire key `capabilities`. After accepting the result, the client sends `notifications/initialized`. That notification has no `id`, so the server sends no response. The server does not send an initialized notification.

The server gates operations until that notification arrives. Each configured identity runs in a separate child process with separate lifecycle state, capabilities, identity, and in-memory drafts. Duplicate identities are rejected before spawning. Tool names are qualified as `SERVER::TOOL` before host selection.

Discovery is not approval. Schemas constrain shape, not ownership or consent. Prompt text, resource data, tool descriptions, and tool results are untrusted. The trusted host owns workspace scope, exact comparison, approval binding, timeout policy, and receipt validation.

Prompts are user-selected templates. Resources are context the application elects to read. Tools may be proposed by a model, but the host decides whether a call is exposed and authorized.

## Errors, effects, and cleanup

The lab distinguishes JSON-RPC parse errors, invalid requests, method-not-found errors, invalid parameters, and valid tool results with `isError: true`. A timeout has outcome `UNKNOWN`, is not blindly retried, and is reconciled through the read-only state resource. Late responses for expired IDs are quarantined. The quarantine is bounded at 64 entries. An unrelated response ID is fatal.

Shutdown closes child stdin to signal EOF, waits within a bound, then escalates through SIGTERM and SIGKILL when needed. Tests await child cleanup and check termination. These are deterministic teaching values, not production recommendations.

## Provider and model limitations

The lab exercises local Node.js child processes only. Local-model, open-weight-model, and hosted-provider adapters are NOT TESTED. Provider compatibility, model behavior, authentication, rate limits, deployment isolation, and production security require separate validation against dated first-party documentation. No provider or model call is made by this lab.

## Qualification

Qualification requires completing the workflow in order: edit the actual comparator, make `learner:test` pass, run `npm test`, and explain the wire direction, trust boundaries, zero-effect denials, timeout outcome `UNKNOWN`, and the three independent security regressions: approval collision rejection, zero child spawn for an invalid second definition, and quarantine bounded at 64 entries.

## ASSUMPTIONS

- The repository contains the source and test files named above.
- The learner can run local Node.js 24 or later child processes.
- The supplied MCP research findings accurately describe the dated specification pages.

## OMITTED

Nothing requested was omitted from this README. Runtime success is not claimed because the drafting environment did not execute the test commands.
