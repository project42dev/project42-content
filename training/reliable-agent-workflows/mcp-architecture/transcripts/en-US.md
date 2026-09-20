# Understand MCP Architecture and Contracts

Package: `mcp-architecture-class` 1.1.0

> This is the canonical text equivalent of an AI-assisted virtual-instructor
> class. It remains usable without synthesized audio, video, animation, or a
> player runtime.

## Welcome: Welcome And Outcomes

Welcome. In this class, you will run a local MCP teaching fixture rather than watching a simulated diagram. The fixture starts two real Node.js child processes and requires Node.js 24 or later. It uses no network, model, provider SDK, credential, or paid service. You will use it to separate host, client, and server responsibilities, trace the pinned 2025-11-25 initialization sequence, compare prompts, resources, and tools, repair an authorization defect, and reason about timeouts and shutdown. Keep one limitation in view: success here demonstrates the fixture's architecture and policy tests. It does not establish compatibility with any hosted provider or with a later MCP revision.

Sources:

- <https://modelcontextprotocol.io/specification/2025-11-25/architecture>
- <https://nodejs.org/api/child_process.html>

## Narration: Host Client Server

Start with the host. The host is the AI application coordinating user intent, consent, policy, model access, and results from multiple connections. It creates one MCP client per server. Each client owns an isolated session, including negotiated capabilities, request identifiers, deadlines, and failure state. The server exposes focused prompts, resources, or tools. In our fixture, curriculum and assessment are separate child processes. Each has its own identity, lifecycle, capability record, and in-memory drafts. If assessment fails, curriculum does not lose its session state. If both advertise create_training_draft, the host qualifies the names with server identity. It must not merge them into one ambiguous permission. Local placement does not create trust. The host still evaluates code provenance, credentials, data flow, side effects, and exact authorization. Invalid definitions and duplicate identities are rejected during initialized-session setup, while an invalid constructor creates no child.

Sources:

- <https://modelcontextprotocol.io/specification/2025-11-25/architecture>
- <https://nodejs.org/api/child_process.html>

## Demonstration: Role Demonstration

Open a terminal at the repository root. First run cd training slash reliable-agent-workflows slash mcp-architecture slash lab. Check that node dash-dash-version reports major version 24 or later. Then run node src slash demo dot mjs. Read the eight lines as evidence. READY names curriculum and assessment, pins profile 2025-11-25, and reports two isolated sessions. The two QUALIFIED lines show that the same unqualified tool name belongs to different server identities. CREATED reports one unpublished curriculum receipt. DENIED shows that assessment cannot act in curriculum's workspace, even when given text claiming approval. STATE confirms curriculum has one draft and assessment has zero. PROMPT says the user-selected template is not authorization. SHUTDOWN describes transport cleanup. Notice what the output does not prove. It does not prove remote authentication, provider support, durable persistence, or compatibility with specifications after the pinned revision.

Sources:

- <https://modelcontextprotocol.io/specification/2025-11-25/architecture>
- <https://nodejs.org/api/child_process.html>

## Pause: Demo Observation Pause

## Narration: Lifecycle Negotiation

Now trace the lifecycle precisely. The client sends a JSON-RPC initialize request. Its params include protocolVersion set to 2025-11-25, capabilities as an object, and clientInfo. The server response uses the same id and returns protocolVersion, capabilities, and serverInfo. Both sides use the exact wire key capabilities. After accepting that result, the client sends notifications slash initialized with no id. Because it is a notification, the server returns no response. The server does not send its own initialized notification. This fixture has uninitialized, awaiting-initialized-notification, and ready states. It blocks tools and other operations until the client notification arrives. Duplicate or out-of-order initialized notifications close the fixture transport. Capability state is runtime evidence for this session. A configured tool is not callable when tools capability was not advertised. The correct response is a declared fallback or a closed failure, not invented support. During shutdown, the host closes stdin, waits within a bound, escalates signals if needed, and awaits cleanup. It sends no JSON-RPC shutdown request.

Sources:

- <https://modelcontextprotocol.io/specification/2025-11-25/basic/lifecycle>
- <https://www.jsonrpc.org/specification>
- <https://nodejs.org/api/child_process.html>

## Checkpoint: Lifecycle Checkpoint

Checkpoint. Configuration names create_training_draft, but the initialize result has no tools capability. Should the client call the configured tool? State your answer and the causal reason. Also identify who sends notifications slash initialized and whether that message receives a response.

Expected learner action: Block the tool call, identify the client as notification sender, and expect no notification response.

Sources:

- <https://modelcontextprotocol.io/specification/2025-11-25/basic/lifecycle>

## Pause: Lifecycle Response Pause

## Feedback: Lifecycle Feedback

Do not call the tool. Configuration expresses desired behavior, while initialization records what the connected session supports. Use the declared no-tool path or stop with missing-capability evidence. The client sends notifications slash initialized after accepting the initialize response. It omits id, so the server sends no response. If you proposed retrying initialization until tools appears, separate availability policy from protocol truth. A reconnect may be allowed by application policy, but it cannot manufacture a capability. If you called before the notification, move readiness gating ahead of every operation.

Correct feedback: You used negotiated state and correct notification direction as causal evidence.

Retry feedback: Separate desired configuration from capabilities agreed for this specific session.

Sources:

- <https://modelcontextprotocol.io/specification/2025-11-25/basic/lifecycle>

## Narration: Primitives Control

Prompts, resources, and tools differ by control model. A prompt is a template the user selects. A resource is context the application elects to read. A tool is a function the model may propose calling. These labels describe initiation, not permission. Prompt text can contain misleading instructions. Resource data can be stale, sensitive, or adversarial. Tool descriptions and results can attempt to influence later decisions. Discovery and valid schemas do not make any of them trusted. The host decides which servers and primitives are exposed, what context crosses a boundary, what requires confirmation, and which trusted executor may act. In the demo, SERVER SAYS APPROVED is only untrusted text. It does not match a host-created approval bound to identity and scope. Protocol compatibility enables communication, but it does not authenticate a principal, establish ownership, grant consent, or prove a real-world effect.

Sources:

- <https://modelcontextprotocol.io/specification/2025-11-25/architecture>
- <https://modelcontextprotocol.io/specification/2025-11-25/server/tools>

## Narration: Tool Contract

Build the write contract in two layers. The protocol-facing definition has a stable name, a description that says it creates one unpublished draft, and a strict input schema. Workspace identity must match caret ws underscore, four through twelve lowercase letters or digits, dollar sign. Title length is three through one hundred twenty. Both fields are required, and additional properties are rejected. That establishes shape only. The host-facing policy separately checks exact server identity, exact tool name, workspace identity that is an exact member of the trusted allowlist, title within bounds, and an approval value bound to those preceding values. The fixture serializes that value exactly as JSON.stringify of an array containing the fixed APPROVE sentinel, expected identity, tool name, workspace, and title. That is exactly five elements, not a circular token field and not a cryptographic security token. A token for another server, workspace, tool, or title must fail. Valid call shape with invalid tool input returns a normal tool result with isError true. Unknown tool names and malformed tools slash call requests use JSON-RPC invalid params, code negative thirty-two six zero two. After success, the host validates receipt identity, workspace, title, status, and postcondition before reporting success.

Sources:

- <https://modelcontextprotocol.io/specification/2025-11-25/server/tools>
- <https://www.jsonrpc.org/specification>

## Narration: Timeout And Reconciliation

Timeouts require a separate outcome model. If a read fails before reaching the server, you may know it was not applied. If a write times out after transmission, its outcome is UNKNOWN. The child may have created the draft while the response was delayed. Do not replay automatically. This fixture places the expired request id in quarantine, records a matching late response as quarantined, and prevents that response from satisfying a new request. The diagnostic history is bounded to 64 identifiers and 5,000 milliseconds. An unrelated response id remains a fatal protocol error. Reconcile deliberately through the read-only state resource, then decide whether policy permits another attempt. On shutdown, close stdin and wait 200 milliseconds. If needed, send SIGTERM and wait 200 more. Finally send SIGKILL and wait no more than 500 milliseconds. Await cleanup and reject pending requests. These exact limits teach bounded behavior; they are not production timing advice.

Sources:

- <https://nodejs.org/api/child_process.html>
- <https://www.jsonrpc.org/specification>

## Narration: Provider Adapters

Transfer these lessons without making vendor claims. Keep the application invariants provider-neutral: one isolated session per server, negotiated capabilities, approved server identity, allowed tools, exact workspace scope, explicit approval, stable error mapping, timeout classification, reconciliation, postcondition validation, and cleanup. Then create replaceable adapters for a hosted provider, a local-model runtime, an open-weight stack, or another framework. For each adapter, verify transport, supported MCP revision, SDK request objects, credential handling, approval surface, error behavior, streaming behavior, and fallback against dated first-party documentation. Run integration tests that exercise the same invariants. The local fixture has tested none of those adapters. Therefore say not tested until that evidence exists. Do not treat the pinned 2025-11-25 profile as latest-spec compatibility, and do not infer remote authorization from a local in-memory allowlist.

Sources:

- <https://modelcontextprotocol.io/specification/2025-11-25/architecture>
- <https://modelcontextprotocol.io/specification/2025-11-25/basic/lifecycle>
- <https://modelcontextprotocol.io/specification/2025-11-25/server/tools>

## Learner Prompt: Learner Exercise Prompt

Now repair a defect that changes a real child-process outcome. Confirm Node.js 24 or later. Run npm test and record its actual result as the full runtime suite, without attributing independent qualification probes to those cases. Run npm run learner:test. The baseline test imports test/learner-scope.test.mjs, which imports src/scope-policy.broken.mjs. It intentionally fails because allowed workspace ws_aaaa is treated as a prefix of requested workspace ws_aaaaaaaa. Both strings satisfy the schema, but only the shorter identity belongs to the allowlist. The test's host call must demonstrate denial and zero effects. Open src/scope-policy.broken.mjs. Replace startsWith logic with allowedWorkspaces.includes(requestedWorkspace). Then rerun npm run learner:test. This rerun imports the edited file and proves that exact repaired implementation. Next make a meaningful changed-input assertion in test/learner-scope.test.mjs: use schema-valid unauthorized ws_aaaab while leaving the allowlist as ws_aaaa. Expect host.callDraft denial and state.drafts.length equal to 0. Do not change only the requested ID to an authorized value while leaving denial assertions. Run npm run learner:test again and save the actual result. Then run npm test again after your edit and save the actual full-regression result, including the reported 23-test result only if the command output confirms it. Finally run npm run learner:solution separately. It imports scope-policy.solution.mjs, so it is reference comparison, not proof of your edit. Its supplied cases deny ws_aaaaaaaa with zero effects and permit exact ws_aaaa with receipt exercise-ok:1. Finish by explaining separate child sessions, initialize and the client-sent initialized notification, primitive control labels, schema validity versus authority, the exact five-element approval serialization, UNKNOWN timeout outcomes, reconciliation, bounded diagnostics, awaited shutdown, and what a provider adapter would still need to test.

Expected learner action: Run the baseline, edit the broken implementation, rerun the same learner test, make the changed-input assertion, and separately compare with the reference solution.

Sources:

- <https://modelcontextprotocol.io/specification/2025-11-25/server/tools>
- <https://nodejs.org/api/child_process.html>

## Pause: Learner Work Time

## Feedback: Exercise Feedback

Check the cause, not merely the green test. The broken startsWith comparison asks whether one string begins with another. That relation is useful for text prefixes but wrong for workspace identity. Exact authorization asks whether the complete requested identity is a member of a trusted set. Array includes performs that exact string comparison here. A complete result has denial and zero effects for ws_aaaaaaaa, denial and zero effects for your changed unauthorized ws_aaaab, and, in the separate reference comparison, one effect and receipt exercise-ok colon one for exact ws_aaaa. If you fixed only a test expectation, the child could still create an unauthorized draft. If you tightened the schema to reject the longer identity, you hid the policy defect. If you added the longer identity to the allowlist, you changed policy to match the attack. The causal repair belongs in the trusted comparator. The host enforces exact scope before tools slash call, while the child schema remains responsible only for input shape.

Correct feedback: Your rerun imports the edited implementation, denies both unauthorized inputs with zero effects, and preserves the authorized reference case.

Retry feedback: Verify that exact allowlist membership is checked before the child receives tools slash call.

Sources:

- <https://modelcontextprotocol.io/specification/2025-11-25/server/tools>

## Transition: Activity Transition

Save the exact demo transcript, actual runtime-suite outcome, independent qualification evidence when available, repaired function, changed-input result, and causal explanation. Your explanation should connect all four objectives to observed process behavior: isolated children for roles, initialize and the client notification for lifecycle, prompt text that lacks authority for primitives, and exact scope plus five-element approval binding for the tool contract. Add UNKNOWN timeout handling, reconciliation, bounded diagnostics, awaited shutdown, and a list of provider-adapter tests still missing.

## Assessment Handoff: Quiz Handoff

When your evidence is saved, begin the knowledge check. Question q-mcp-architecture-1 asks who owns consent and cross-connection policy. Question q-mcp-architecture-2 asks what missing negotiated tools capability causes. Question q-mcp-architecture-3 separates schema-valid workspace shape from authority. Question q-mcp-architecture-4 asks how to handle an UNKNOWN timed-out write. Question q-mcp-architecture-5 asks how to transfer the design without inventing provider compatibility. Read each explanation, including the causal feedback for incorrect choices. The check opens only when you choose Begin knowledge check.

## Closing: Class Closing

Close with six rules. Keep one isolated client session per server. Negotiate version and capabilities before operation. Remember that primitive control labels are not authorization. Validate shape, then enforce exact identity, scope, and five-element approval binding in separate host policy. Treat a timed-out write as UNKNOWN until reconciliation, and await bounded shutdown. Finally, preserve these invariants across provider adapters while testing every adapter separately. The local profile is valuable evidence for these lessons, but it is neither a production security claim nor proof of latest-spec or provider compatibility.

Sources:

- <https://modelcontextprotocol.io/specification/2025-11-25/architecture>
- <https://modelcontextprotocol.io/specification/2025-11-25/basic/lifecycle>
- <https://modelcontextprotocol.io/specification/2025-11-25/server/tools>
