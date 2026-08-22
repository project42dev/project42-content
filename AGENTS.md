# Project 42 Content — Agent Instructions

## What this repo is
This public repository is the canonical data source for Project 42 curriculum, learning paths, assessed modules, and field-guide resources. It contains schema-validated JSON/Markdown data with zero hosting bias and zero frontend code.

## Start here
Use the HCS Governance MCP server as the standards source of truth:
```text
bootstrap(repo="project42-content", client="<client>")
```

## Hard rules
1. Never commit secrets, private tokens, or proprietary credentials.
2. All module and path additions must validate against canonical JSON schemas (`npm test`).
3. Markdown content must be clean and free of UI framework dependencies.
4. Source citations must reference resolvable public HTTPS URLs with verified dates.
5. Commit format: `type(scope): description (AB#<id>)`.
