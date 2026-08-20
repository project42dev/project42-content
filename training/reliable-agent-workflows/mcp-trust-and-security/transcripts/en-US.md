# Secure MCP Trust Boundaries

Package: `mcp-trust-and-security-class` 1.0.0

> This is the canonical text equivalent of an AI-assisted virtual-instructor
> class. It remains usable without synthesized audio, video, animation, or a
> player runtime.

## Welcome: Welcome And Outcomes

Welcome. This class treats every MCP connection as a security and data decision. You will evaluate server trust, keep returned content untrusted, bind authorization to the intended server and user decision, minimize permissions, design truthful approval and audit surfaces, detect drift, and recover from suspected compromise.

## Narration: Explicit Server Trust

Evaluate each server independently. Record operator, code or service provenance, package or endpoint identity, transport, authentication method, requested scopes, data destinations, retention terms, downstream services, update path, and incident contact. Inventory what the host may send, what the server may return, and what external actions it can perform. An official-looking name, familiar tool description, local process, or valid protocol exchange is not certification. Review the exact deployment you connect to. Reapprove when ownership, URL, certificate, package digest, tool inventory, scopes, storage behavior, or destination changes. The smallest safe decision may be to expose only one read operation rather than approving the whole server.

Sources:

- <https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices>
- <https://developers.openai.com/api/docs/guides/tools-connectors-mcp>
- <https://platform.claude.com/docs/en/agents-and-tools/mcp-connector>

## Demonstration: Trust Demonstration

A server called Official Tickets requests read, comment, delete, and administrator scopes. The workflow only searches one project and drafts comments for approval. The name proves nothing, and the requested authority is excessive. Verify the actual operator and endpoint, allow only project-scoped search, and withhold comment execution until the user approves an exact draft and target. Reject delete and administrator access. Record the accepted tool-list digest and scope. If a later session adds a bulk-delete tool or requests a new audience, pause the connection for review instead of treating change as routine discovery.

Sources:

- <https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices>

## Narration: Untrusted Content

Prompt injection can arrive through resources, tool results, prompts, errors, metadata, or downstream content. A server can return text that asks the model to reveal secrets, call another tool, conceal activity, change a target, or ignore policy. Keep returned material in a data channel with source and server provenance. Minimize what reaches the model, redact secrets before exposure, and validate structured content. Returned text cannot alter permissions or approvals. If a result proposes a different action, resolve and authorize it as a new request. Review consequential inputs before sending and verify outputs before they affect later actions. A tool result is an observation, not a trusted instruction or proof.

Sources:

- <https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices>
- <https://developers.openai.com/api/docs/guides/tools-connectors-mcp>
- <https://platform.claude.com/docs/en/agents-and-tools/mcp-connector>

## Narration: Authorization Boundary

For protected HTTP servers, use the MCP authorization flow and established OAuth libraries. Validate transport and server identity, token signature, issuer, expiration, audience, scopes, subject, tenant when applicable, and the protected resource. Never accept an upstream access token and pass it through merely because the client supplied it. A token issued for another audience is not valid for this server. A proxy serving many clients can become a confused deputy if it loses the requesting client or user decision. Preserve per-client consent, validate redirect URI and state, bind authorization to client, server, resource, and minimal scopes, and reject wildcard or mismatched grants.

Sources:

- <https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization>
- <https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices>

## Narration: Least Privilege Approval

Start with read-only discovery or the smallest baseline scope. Elevate only for one concrete operation, accept down-scoped tokens, separate administrative tools, and expire temporary access. Allowlists reduce accidental exposure but do not replace per-call authorization. At the point of impact, show the server identity, tool, resolved target, arguments or data being sent, expected side effect, requested scope, cost, and reversibility. Approval must occur before impact and bind to that exact action. Sensitive data, external writes, purchases, permission changes, publishing, and destruction normally require explicit confirmation. If the target or arguments change, approval must be renewed.

Sources:

- <https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices>
- <https://developers.openai.com/api/docs/guides/tools-connectors-mcp>
- <https://platform.claude.com/docs/en/agents-and-tools/mcp-connector>

## Narration: Observe Drift Recover

Record secret-safe evidence: server identity, endpoint or package version, negotiated protocol, tool-list digest, token decision without token value, scope, approval decision, sanitized request, result class, postcondition, and correlation identifier. Alert on new or changed tools, changed destinations, unusual data volume, repeated authorization failure, denials, session anomalies, or output that attempts to steer policy. On suspected compromise, stop the connection, revoke or rotate credentials, invalidate sessions, preserve evidence, inspect downstream effects, and notify the responsible people. Restore from a reviewed configuration and require explicit approval before reconnecting. Maintain a last-known-approved manifest and a tested disable path so operators can compare drift, isolate one server without disabling unrelated connections, and restore only the capabilities whose identity, behavior, and data boundaries were reverified. Do not let the model decide that drift or a security incident is harmless.

Sources:

- <https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices>

## Learner Prompt: Learner Security Prompt

Choose one MCP server. Name its operator and identity evidence, data sent, downstream action, minimum scope, exact approval fields, one drift signal, and one containment action.

Expected learner action: Create a minimal trust, approval, drift, and containment record for one server.

## Pause: Learner Work Time

## Checkpoint: Audience Checkpoint

Checkpoint. A client supplies a valid, unexpired access token, but its audience names a different API. May the MCP server accept or pass through that token?

Expected learner action: Reject the mismatched token and require the defined authorization flow for this protected resource.

Sources:

- <https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization>

## Pause: Checkpoint Response Time

## Feedback: Audience Feedback

Reject it. A valid signature and current expiry do not make a token valid for every service. Audience and resource binding prevent token passthrough and confused-deputy behavior. Use the authorization flow to obtain a token intended for this server and requested resource. If you accepted it because it was valid, add audience and resource checks. If you passed it downstream, stop that pattern and preserve the original client and user consent boundaries.

Correct feedback: You bound the token to the intended server and resource instead of treating validity as universal authority.

Retry feedback: Check who issued the token, for which audience and resource, and whether this server is the intended recipient.

Sources:

- <https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization>

## Transition: Activity Transition

Open the MCP threat-model activity. Draw the data flow, remove unjustified tools and scopes, then test injected output, mismatched audience, confused-deputy consent, wildcard scope, unannounced tool change, and timeout after a write. Retain prevention, detection, containment, recovery, and evidence for each.

## Pause: Activity Work Time

## Assessment Handoff: Assessment Handoff

When ready, begin the knowledge check. You will evaluate server trust, reject injected authority, validate token audience, choose minimum scope, and contain drift. The assessment begins only when you choose Begin knowledge check.

## Closing: Class Closing

Trust the exact server deliberately, keep content untrusted, bind tokens and consent, minimize scope, approve before impact, detect drift, and recover under human authority.
