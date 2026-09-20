# MCP 2026-07-28 local stdio lab

## Purpose and limits

This dependency-free Node.js 24 lab starts two child servers and gives the host one client and one stdio connection per server. It demonstrates a limited MCP 2026-07-28 teaching profile with `server/discover`, request metadata, tools, resources, prompts, operation-specific authorization, structured approvals, bounded discovery caching, deadlines, reconciliation, framing limits, diagnostic limits, and bounded shutdown.

It is not an MCP SDK, protocol conformance suite, benchmark reproduction, live-provider evaluation, or proof of Streamable HTTP compatibility. Newline-delimited JSON is the lab's local framing convention. The lab makes no provider call.

The official caching utility defines only two `cacheScope` values: `public` and `private`. This lab's discovery result is identical and non-user-specific, so `server.mjs` emits `public`. The former value `server` was invented and is rejected. The host still keys cached entries by controlled server connection, client identity, and trusted policy identity. Accepting both protocol-defined values does not merge those local isolation boundaries.

`io.modelcontextprotocol/serverInfo` is self-reported display and debugging metadata. It is never authentication evidence or security authority. A name mismatch in this fixture is retained as a routing and configuration diagnostic. Authorization comes from trusted host policy, the host-controlled local child launch, the selected connection, and exact operation approval. A server cannot gain authority by choosing a trusted-looking `serverInfo.name`.

Official references, checked 2026-09-20:

- MCP discovery: https://modelcontextprotocol.io/specification/2026-07-28/server/discover
- MCP caching utilities: https://modelcontextprotocol.io/specification/2026-07-28/server/utilities/caching
- JSON-RPC 2.0: https://www.jsonrpc.org/specification
- Node.js child-process stdio: https://nodejs.org/api/child_process.html#optionsstdio

## Run

Use Node.js 24 and run commands from this directory. No package installation is needed.

```sh
node host.mjs
node regressions.mjs
node cache-scope-regression.mjs
node learner-test.mjs
```

Expected cache-scope regression output:

```text
PASS cacheScope public accepted
PASS cacheScope private accepted
PASS invented cacheScope server rejected
PASS server, client, and policy cache-key isolation retained
PASS serverInfo mismatch remains a routing diagnostic
```

Expected existing regression result:

```text
RESULT 20/20 regressions passed
```

## Learner repair

Before repair, `node learner-test.mjs` must fail with a line beginning:

```text
FAIL learner repair: APPROVAL_MISMATCH:
```

Open `policy.broken.json` and change only `operations[0].approval.item` from `issues.search` to `issues.create`. Do not edit the immutable test, fixture, or regressions. Run the learner test again. Expected output:

```text
PASS learner repair: exact structured issue-create approval accepted
```

Then rerun `node regressions.mjs` and `node cache-scope-regression.mjs`.

The failure is causal. The validated request calls `issues.create`, but the policy approval names `issues.search`. Discovery, `cacheScope`, `serverInfo`, a longer timeout, a larger output cap, a delimiter-joined approval string, or approval for `prompts/get` cannot change the actual requested operation. The repair must align the exact structured approval with the validated request.

## Negative cases and expected causes

| Case | Expected result | Cause |
|---|---|---|
| `cacheScope: "public"` | accepted | It is defined by the caching utility. |
| `cacheScope: "private"` | accepted | It is defined by the caching utility. |
| `cacheScope: "server"` | `BAD_DISCOVERY` | It is not a defined value. |
| Different server, client, or policy identity | different cache key | Local cache isolation remains explicit. |
| Unexpected `serverInfo.name` | `CROSS_SERVER_IDENTITY` diagnostic | The fixture may be routed or configured incorrectly. This is not authentication. |
| Discovered but unauthorized tool | `DENIED` | Availability is not authority. |
| Wrong protocol metadata | `RPC_-32602` | Request metadata does not match the taught profile. |
| Caller-supplied `_meta` | `UNTRUSTED_META` | Operation fields cannot replace host metadata. |
| Claimed item differs from request | `ITEM_MISMATCH` | Authorization uses the validated request item. |
| Wrong structured approval | `APPROVAL_MISMATCH` | Exact operation and identity fields do not match. |
| Oversized result | `OUTPUT_LIMIT` | Approval does not waive output bounds. |
| Side-effect deadline expires | `UNKNOWN_OUTCOME` | Timeout does not establish whether state changed. |
| Malformed or ambiguous response | fail closed | JSON-RPC responses require exactly one of `result` or `error`. |

For an uncertain side effect, do not replay blindly. Reconcile authoritative state using the operation key. Scope controls discovery visibility, authorization controls operations, and bounds control resource use. None replaces another.
