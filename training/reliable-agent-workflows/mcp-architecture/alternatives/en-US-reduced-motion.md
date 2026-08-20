# Understand MCP Architecture and Contracts: reduced-motion presentation

Present every visual as a complete static composition. Do not make completion
depend on animation timing, autoplay, or pointer gestures.

## host-client-server

Present all roles and boundaries in one static architecture diagram.

Text alternative: The host owns users, consent, model, policy, and aggregation. Client A connects only to Server A, and Client B connects only to Server B.

## role-demonstration

Show both operations as separate static rows.

Text alternative: File lookup stays on the file connection. Ticket comment stays on the ticket connection. The host alone authorizes any cross-connection use.

## lifecycle-negotiation

Present the entire sequence as a static message table.

Text alternative: Client and server initialize, agree on revision and capabilities, acknowledge readiness, operate within the agreement, and shut down.

## primitives-control

Show primitives and authorization in a static two-layer table.

Text alternative: Users select prompts, applications select resources, and models may select tools, but host policy and trusted execution authorize every consequential operation.

## tool-contract

Show both contracts side by side without animated construction.

Text alternative: Name, description, input, output, and errors define exchange; side effects, authorization, approval, idempotency, postcondition, limits, and recovery define safe operation.

## provider-adapters

Display the portable row and adapter differences as a static matrix.

Text alternative: Capability, server identity, tools, data, approval, results, telemetry, and recovery stay portable while SDK and transport details remain in adapters.
