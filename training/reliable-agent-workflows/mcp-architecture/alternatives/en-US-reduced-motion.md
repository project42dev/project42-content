# Understand MCP Architecture and Contracts: reduced-motion presentation

Present every visual as a complete static composition. Do not make completion
depend on animation timing, autoplay, or pointer gestures.

## host-client-server

Show the complete architecture as one static labeled diagram.

Text alternative: The host owns policy. Curriculum client connects only to curriculum child, and assessment client connects only to assessment child.

## role-demonstration

Use a static transcript table with one annotation per line.

Text alternative: READY and QUALIFIED describe sessions, CREATED and DENIED show policy, STATE shows isolation, PROMPT rejects implied authority, and SHUTDOWN shows cleanup.

## lifecycle-negotiation

Present every message and state transition in a static sequence table.

Text alternative: Client sends initialize, server returns capabilities, client sends initialized without an id, and operations begin only after that notification.

## primitives-control

Use a static two-layer control and authorization table.

Text alternative: Users select prompts, applications select resources, and models may propose tools, while the host independently authorizes exposure and execution.

## tool-contract

Display schema, policy, error channels, and receipt checks in a static table.

Text alternative: Schema validates shape. Host policy checks server, tool, exact workspace, title, and five-element approval binding before validating the returned receipt.

## timeout-and-reconciliation

Show the complete timeout and shutdown decision tree statically.

Text alternative: A timed-out write becomes UNKNOWN, its id is quarantined, state is reconciled, and shutdown cleanup is awaited.

## provider-adapters

Use a static invariant-to-adapter verification matrix.

Text alternative: Architecture, policy, errors, and recovery stay neutral; each transport and SDK adapter is tested independently.
