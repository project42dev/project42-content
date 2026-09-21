# Function-calling and tools repair lab

Canonical lab URL: https://github.com/project42dev/project42-content/tree/main/training/developer-and-practitioner-ai/function-calling-and-tools/lab/

## What this lab proves

The offline Node.js tests exercise deterministic fixture behavior: closed argument contracts, authenticated tenant context, provider correlation IDs, bounded API routes, independent approval, at-most-once effects, and budgets. They do not prove PostgreSQL RLS, database privileges, network containment, TLS, remote API authorization, or production sandboxing.

The separate `psql` integration test exercises a real PostgreSQL role, column grants, FORCE RLS, transaction-local account context, and context reset. No live provider key or external API credential is used.

## Prerequisites

Offline core: Node.js 22 and a POSIX shell. There are no package dependencies and `npm install` is unnecessary.

PostgreSQL proof: Docker with permission to start a local disposable container, or PostgreSQL 15 or later plus `psql`. Port 55432 must be unused for the supplied container commands.

## Run from the repository root

```sh
cd training/developer-and-practitioner-ai/function-calling-and-tools/lab
npm test
```

The starter has exactly one deliberate defect: the order data lookup omits trusted tenant scoping. Expected starter stdout is exactly:

```text
PASS openai correlation
PASS claude correlation
PASS gemini correlation
PASS unknown argument rejected
PASS model identity rejected
PASS malformed order rejected
PASS tenant A overlapping order
FAIL tenant B overlapping order: lookup must follow authenticated account, not the first overlapping ID
FAIL changed-input isolation: tenant A must not see tenant B order 9001
PASS unknown tool is an error
PASS independent approval and mutation
PASS at-most-once retry
PASS call budget
SUMMARY pass=11 fail=2 skip=0
```

Expected starter exit code: `1`.

## Focused repair

Open `src/bridge.mjs`. In `lookupOrder`, change the single `find` predicate so it matches both `candidate.account_id === authenticated.accountId` and the order number. Do not add identity to model arguments and do not edit tests.

After repair, `npm test` prints the same test names with every line beginning `PASS`, followed by:

```text
SUMMARY pass=13 fail=0 skip=0
```

Expected exit code: `0`. `npm run test:reference` has the same 13-pass summary and exit code 0. Exceptions are failures. Unsupported checks must be explicit skips and are never counted as passes. This suite has zero expected skips.

Reset the starter with:

```sh
npm run reset
```

Expected stdout is `Reset src/bridge.mjs to the deliberate tenant-scoping defect.` and exit code 0. The reset writes only inside this lab. Test scratch data, if added, must remain under `test-scratch/`; do not use the operating system temporary directory.

## Real PostgreSQL integration

Start a disposable local PostgreSQL container:

```sh
docker rm -f p42-tools-pg >/dev/null 2>&1 || true
docker run --name p42-tools-pg -e POSTGRES_HOST_AUTH_METHOD=trust -p 55432:5432 -d postgres:17-alpine
until docker exec p42-tools-pg pg_isready -U postgres >/dev/null 2>&1; do sleep 1; done
npm run test:postgres
```

The script applies `sql/setup.sql` as the administrator, then opens actual sessions as `support_tool`. Its expected stdout is exactly:

```text
SETUP ok
OWN acct-a 1042|packed
OTHER hidden 0
NO_CONTEXT 0
POOL first=1 next=0
ROLE super=f bypass=f inherit=f timeout=2s
POSTGRES_SUMMARY pass=6 fail=0 skip=0
```

Expected exit code: `0`. The tested SELECT intentionally has no application tenant predicate. PostgreSQL RLS supplies the filter. The pool case uses two transactions in one `psql` session and verifies that transaction-local identity is absent in the second transaction.

Cleanup:

```sh
docker rm -f p42-tools-pg
```

If Docker or PostgreSQL is unavailable, record the integration as `NOT RUN`. Do not report the offline array tests as database evidence.

## Real deployment requirements not simulated here

Use a dedicated non-owner, non-superuser, NOBYPASSRLS role; inspect inherited privileges and all policies; retain column-level grants and role-level timeout; set account context transaction-locally on the same pooled connection; and reset or discard failed transactions. For HTTP, use a trusted configured origin, scoped server-side credentials, downstream authorization, TLS, explicit time and response-size limits, safe logging, approval persistence, and a durable idempotency ledger. The fixture route table does not establish those production controls.
