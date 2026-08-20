# Understand MCP Architecture and Contracts: text-only class

This route contains the complete teaching content, learner actions, feedback,
and assessment handoff without requiring audio, video, or animation.

## Welcome: Welcome And Outcomes

Welcome. This class gives you a reliable mental model for Model Context Protocol. You will separate host, client, and server responsibilities, trace lifecycle negotiation, distinguish prompts, resources, and tools, design narrow tool contracts, and keep application policy portable when providers expose different MCP integration surfaces.

## Narration: Host Client Server

Start with three roles. The host is the AI application. It owns the user experience, consent, policy, model access, aggregation, and decisions about what crosses boundaries. The host creates one MCP client for each server connection. A client maintains session and negotiated-capability state, routes protocol messages, and isolates that connection from others. A server exposes a focused set of prompts, resources, or tools. It may be a local process or a remote service. Local does not automatically mean safe, and remote does not automatically mean untrusted. Assess identity, code or service provenance, credentials, data flow, and actions. One server must not observe another server's data merely because the host can access both.

Visual alternative: The host owns users, consent, model, policy, and aggregation. Client A connects only to Server A, and Client B connects only to Server B.

Sources:

- <https://modelcontextprotocol.io/specification/2025-11-25/architecture>

## Demonstration: Role Demonstration

Consider a learning assistant connected to a file server and a ticket server. The file client negotiates resource and read-tool capabilities. The ticket client negotiates search and comment tools. A ticket result must not flow to the file server unless the host makes an explicit, authorized decision. Each server receives only the context required for its operation. If the ticket server fails, the file session can remain healthy. If one server changes tools, only its capability state changes. This separation makes data movement, failure, authorization, and incident response inspectable instead of creating one invisible pool of tools and context.

Visual alternative: File lookup stays on the file connection. Ticket comment stays on the ticket connection. The host alone authorizes any cross-connection use.

Sources:

- <https://modelcontextprotocol.io/specification/2025-11-25/architecture>

## Narration: Lifecycle Negotiation

Negotiate before operating. During initialization, client and server exchange protocol revision and capabilities. Only after initialization completes may normal operations use the features both sides support. Treat negotiated state as runtime evidence. A configured tool name does not prove the connected server currently exposes tools, supports notifications, or implements the expected revision. Record server identity, requested and agreed protocol, advertised client and server capabilities, and fallback behavior. If a required capability is absent, fail closed or degrade through a declared path. Do not invent support, call an unnegotiated operation, or silently substitute a more powerful capability.

Visual alternative: Client and server initialize, agree on revision and capabilities, acknowledge readiness, operate within the agreement, and shut down.

Sources:

- <https://modelcontextprotocol.io/specification/2025-11-25/basic/lifecycle>

## Narration: Primitives Control

Prompts, resources, and tools have different control models. Prompts are commonly user-selected templates. Resources are application-selected context. Tools are functions the model may propose calling. These labels help design the interface, but none creates authorization. A resource can contain stale facts, malicious instructions, or sensitive data. A tool result can attempt to redirect the model. A discovered tool can still be denied by host policy. The host decides which servers and primitives are exposed, what context is sent, what requires user confirmation, and which trusted executor may act. Protocol compatibility enables exchange. It does not certify the server, validate content, grant permission, or prove a side effect.

Visual alternative: Users select prompts, applications select resources, and models may select tools, but host policy and trusted execution authorize every consequential operation.

Sources:

- <https://modelcontextprotocol.io/specification/2025-11-25/architecture>
- <https://modelcontextprotocol.io/specification/2025-11-25/server/tools>

## Narration: Tool Contract

Make a tool narrow and inspectable. Give it a stable name and a decision-oriented description that distinguishes it from similar tools. Constrain inputs with required fields, explicit types, enums, formats, bounds, and rejected additional properties. Where supported, publish an output schema and return structured success and error variants. Separately document side effects, data sent, identity and object authorization, approval rule, idempotency, limits, postcondition, retryability, and recovery. A schema can prove that workspace ID has the expected form. It cannot prove the workspace belongs to the caller. An output schema can make a result parseable. It cannot prove the draft was created in the real system.

Visual alternative: Name, description, input, output, and errors define exchange; side effects, authorization, approval, idempotency, postcondition, limits, and recovery define safe operation.

Sources:

- <https://modelcontextprotocol.io/specification/2025-11-25/server/tools>

## Narration: Provider Adapters

Keep the product contract above provider adapters. Define the required capability, approved server identity, allowed primitive and tool set, data policy, approval rule, stable result, telemetry, and recovery once. Then map provider SDK objects, request fields, remote connector identifiers, supported transports, approval surfaces, beta status, limitations, and errors in replaceable adapters. Different providers and frameworks may expose MCP in different products or maturity stages. Do not claim identical behavior from a shared acronym. Verify each adapter against current first-party documentation and the same application tests. Unsupported behavior must be explicit, not emulated silently when it changes safety or user control. Record the exact adapter version, verified feature subset, test date, and rollback route so later changes can be reproduced and compared.

Visual alternative: Capability, server identity, tools, data, approval, results, telemetry, and recovery stay portable while SDK and transport details remain in adapters.

Sources:

- <https://modelcontextprotocol.io/specification/2025-11-25/architecture>
- <https://modelcontextprotocol.io/specification/2025-11-25/basic/lifecycle>
- <https://modelcontextprotocol.io/specification/2025-11-25/server/tools>

## Learner Prompt: Learner Mcp Prompt

Sketch one host with two MCP servers. For each connection, name the client, server identity, required capability, data sent, tool exposed, approval point, postcondition, and fallback when negotiation fails.

Learner action: Create a two-server architecture that preserves connection, capability, data, and approval boundaries.

## Pause: Learner Work Time

## Checkpoint: Capability Checkpoint

Checkpoint. Configuration lists a write tool, but the connected server did not advertise tool capability during initialization. Should the client call that tool because configuration says it exists?

Learner action: Do not call an operation that was not negotiated; use the declared fallback or fail closed.

Sources:

- <https://modelcontextprotocol.io/specification/2025-11-25/basic/lifecycle>

## Pause: Checkpoint Response Time

## Feedback: Capability Feedback

Do not call it. Configuration describes intent, while initialization records what this session supports. Use the declared no-tool fallback or stop with missing-capability evidence. If you chose to try the call, move capability validation before operation. If you assumed the server was unsafe, refine the conclusion: absence may be version, configuration, or server behavior, but the safe operational result is still no unnegotiated call.

If correct: You treated negotiated capability as runtime evidence and followed a declared fallback.

If retrying: Compare desired configuration with the capability state actually agreed for the current session.

Sources:

- <https://modelcontextprotocol.io/specification/2025-11-25/basic/lifecycle>

## Transition: Activity Transition

Open the MCP contract activity. Draw the host and two isolated connections, record initialization and fallback behavior, define one read and one write tool, and map the portable contract into one provider adapter. Retain the architecture, lifecycle record, contracts, and adapter assumptions.

## Pause: Activity Work Time

## Assessment Handoff: Assessment Handoff

When ready, begin the knowledge check. You will identify host policy ownership, enforce negotiated capabilities, separate schema from authorization, preserve one client per server, and choose a portable adapter boundary. The assessment begins only when you choose Begin knowledge check.

## Closing: Class Closing

Keep roles separate, negotiate before use, treat primitives as untrusted inputs or proposals, own policy in the host, and verify every adapter.
