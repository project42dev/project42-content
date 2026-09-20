# MCP 2026-07-28 local stdio lab

## Purpose and limits

This dependency-free Node.js 24 lab starts two real child servers and gives the host one client and one stdio connection per server. It demonstrates a limited MCP 2026-07-28 teaching profile with `server/discover`, namespaced request metadata, tools, resources, prompts, server identity validation, operation-specific authorization, structured approvals, bounded discovery caching, output limits, deadlines, reconciliation, bounded framing, bounded diagnostics, and bounded shutdown.

It is not an MCP SDK, protocol conformance suite, benchmark reproduction, live-provider evaluation, or proof of Streamable HTTP compatibility. Newline-delimited JSON is this lab's local framing convention. The lab makes no network request, uses no credentials or dependencies, and does not call an LLM provider.

Official references:

- MCP architecture: https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture
- MCP server concepts: https://modelcontextprotocol.io/docs/2026-07-28/learn/server-concepts
- JSON-RPC 2.0: https://www.jsonrpc.org/specification
- Node.js child processes: https://nodejs.org/api/child_process.html#optionsstdio

## Run

Use Node.js 24 and run commands from this directory. No package installation is needed.

```sh
node host.mjs
node regressions.mjs
node learner-test.mjs
```

Expected `node host.mjs` output:

```text
clients=2
discover=filesystem,issues
issueTools=4
fsResources=1,templates=0,read=Local demonstration content.
issuePrompts=1,prompt=Triage the selected issue.
toolResult=created:Demo
```

Expected `node regressions.mjs` output:

```text
PASS two isolated clients and primitive families
PASS discovery is not authorization
PASS operation-specific prompt and create approvals
PASS wrong protocol version rejected
PASS forged client identity rejected
PASS caller metadata override rejected before send
PASS claimed item mismatch rejected
PASS structured approvals resist delimiter collision
PASS cross-server discovery identity rejected
PASS cache is bounded, isolated, and revalidated on hit
PASS oversized operation result rejected
PASS malformed JSON-RPC request receives invalid request
PASS malformed response fails closed
PASS result and error together fail closed
PASS unknown response id fails closed
PASS oversized response frame rejected
PASS stderr diagnostics are bounded
PASS early child exit rejects pending request
PASS side-effect timeout is reconciled without replay
PASS shutdown is bounded and leaves no live child
RESULT 20/20 regressions passed
```

## Learner repair

Before repair, `node learner-test.mjs` exits unsuccessfully. The first line starts with:

```text
FAIL learner repair: APPROVAL_MISMATCH:
```

The immutable test constructs the approval from the validated operation. Open `policy.broken.json` and change only the nested `approval.item` value from `issues.search` to `issues.create`. Do not edit `learner-test.mjs`, the fixture, or the regressions.

The complete binding is a typed JSON object containing:

- `server`
- `method`
- the actual `item` derived from the validated request
- exact `args`
- `policyIdentity`
- `clientIdentity`

It is not a delimiter-joined string. Structured comparison prevents delimiter collisions. The host also rejects a separately claimed item if it differs from the item derived from `fields.name` or `fields.uri`, and it rejects caller-supplied `fields._meta` before sending anything.

After the one-value repair, expected output is:

```text
PASS learner repair: exact structured issue-create approval accepted
```

`policy.solution.json` is reference-only. Compare it only after attempting the repair.

## Why the original failure occurred

The earlier fixture had one approval binding for `issues.create` but reused the same server rule for `prompts/get`. A prompt request therefore failed with `APPROVAL_MISMATCH`. The repaired design stores a separate rule and approval object for every protected operation. Approval for `issues.create` cannot authorize `prompts/get`, another tool, different arguments, another policy, or another client.

Discovery cannot repair this failure because discovery advertises capabilities but does not authorize an operation. Increasing a timeout or output cap also cannot repair an identity or approval mismatch.

## Negative cases and causal feedback

| Boundary | Expected result | Cause |
|---|---|---|
| Discovered but unauthorized tool | `DENIED` | Availability is not authority. |
| Wrong protocol version | `RPC_-32602` | Every request is validated against the supported profile. |
| Forged client metadata | `RPC_-32602` | Connection-bound client identity does not match. |
| Supplied `_meta` in operation fields | `UNTRUSTED_META` | Untrusted fields may not replace host metadata. |
| Claimed item differs from `name` or `uri` | `ITEM_MISMATCH` | Authorization uses the validated actual request item. |
| Delimiter-shaped forged approval | `APPROVAL_MISMATCH` | Structured fields are compared without string concatenation. |
| Wrong discovered server identity | `CROSS_SERVER_IDENTITY` | Cache and connection identity must remain aligned. |
| Tampered cached identity | `CROSS_SERVER_IDENTITY` | Cache hits are revalidated rather than trusted blindly. |
| Oversized operation result | `OUTPUT_LIMIT` | Approval does not waive the operation output cap. |
| Invalid request envelope | `RPC_-32600` | JSON-RPC request shape is invalid. |
| Malformed response JSON | `MALFORMED_RESPONSE` | The client fails closed instead of ignoring it. |
| Response with both result and error | `INVALID_RESPONSE` | JSON-RPC responses must contain exactly one. |
| Unknown response ID | `UNKNOWN_RESPONSE_ID` | Unmatched responses are not silently accepted. |
| Late response for a timed-out ID | Ignored only while ID is quarantined | A bounded quarantine distinguishes a known late response from an unknown one. |
| Oversized stdout frame | `FRAME_LIMIT` | Input framing has a byte bound. |
| Excessive stderr | `DIAGNOSTIC_LIMIT` | Diagnostics cannot grow without limit. |
| Child exits with work pending | `CHILD_EXIT` | All pending operations are rejected. |
| Side-effect timeout | `UNKNOWN_OUTCOME` | Timeout does not prove whether the side effect occurred. |
| Hung child during shutdown | Forced bounded termination | Shutdown cannot wait forever or leak the process. |

## Meaningful reconciliation

`issues.slowCreate` stores the issue record before delaying its response. The host times out after 20 ms and does not replay that operation. After the delayed response is quarantined, the host calls `issues.reconcile` with the operation key `slow-1`. The returned authoritative server record proves that the issue exists. The test counts one slow-create request and one separate reconciliation request. It does not mistake sent-message counts for proof of side-effect state.

The discovery startup deadline is 600 ms and is separate from the 20 ms slow-create deadline. A short tool deadline therefore does not accidentally become the process startup budget.

## Four-server worked policy

| Server | Scope | Approval | Timeout | Output cap | Capability-specific reason |
|---|---|---|---:|---:|---|
| Read-only filesystem | local | None for one named read | 500 ms | 512 bytes | File reads can disclose local data, so paths and output remain bounded. |
| Team issue tracker | project | Exact structured approval for each write | 800 ms | 1024 bytes | Writes change shared records and need operation keys for reconciliation. |
| External email | user | Exact structured approval for every send | 800 ms | 512 bytes | Sending can disclose content to an external recipient. |
| Ad hoc teammate server | local | Exact approval for every operation | 300 ms | 256 bytes | Provenance and behavior have not been established. |

If the issue tracker changes from search to creating and closing issues, project scope may remain appropriate, but authorization must add separate structured bindings for create and close. Each binding should include exact arguments and an operation key. Timeout and output bounds remain independent controls. Moving the declaration to local scope would not make a destructive call safe.

Highest risk in this example is external email because its send capability can transmit content outside the system. Scope determines who sees a declaration, trust determines which operation may run, and bounds limit resource use. None replaces the other two.
