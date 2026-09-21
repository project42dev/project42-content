# Function-calling and tools repair lab

Canonical lab URL: https://github.com/project42dev/project42-content/tree/main/training/developer-and-practitioner-ai/function-calling-and-tools/lab/

## Learning goals

In this lab, you will:

1. Repair a cross-tenant data lookup without trusting identity supplied by a model.
2. Preserve provider call correlation across OpenAI, Anthropic Claude, and Google Gemini envelopes.
3. Distinguish deterministic fixture tests from evidence produced by real PostgreSQL 18.
4. Verify real row-level security, restricted columns, denied writes, transaction-local identity, role attributes, and statement timeout enforcement.
5. Run PostgreSQL in a disposable container with no published host ports, no container network, a read-only lab mount, and exact-container cleanup.

## What the two test suites prove

### Offline Node.js fixture suite

The offline suite uses the in-repository arrays in `fixtures/data.mjs`. It exercises closed argument contracts, authenticated tenant context, provider correlation IDs, bounded routes, independent approval, at-most-once effects, and call budgets.

These tests are deterministic simulations. They do not prove PostgreSQL RLS, database grants, network containment, TLS, remote API authorization, or production sandboxing. Passing `npm test` is not database evidence.

The adapters retain the provider metadata needed to correlate a tool result with its call:

- OpenAI `call_id` becomes `function_call_output.call_id`.
- Anthropic `id` becomes `tool_result.tool_use_id`.
- Google `id` becomes `function_result.call_id`.

The stable tool names are `orders_get_status` and `helpdesk_tickets`. The order tool schema accepts only `order_number`. In particular, it does not accept `account_id` from model output. Identity comes from the already authenticated principal.

Provider documentation describes the corresponding function-calling and tool-use mechanisms:

- OpenAI function calling: https://platform.openai.com/docs/guides/function-calling
- Anthropic tool use: https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/overview
- Google Gemini function calling: https://ai.google.dev/gemini-api/docs/function-calling

### Real PostgreSQL 18 integration suite

`npm run test:postgres` starts `postgres:18` and executes SQL through `docker exec`. It applies `sql/setup.sql` as `postgres`, then opens actual sessions as the nonowner `support_tool` role.

The integration suite verifies:

- rows for `acct-a` are visible when that account is set in the transaction;
- another account's row remains hidden even without an application tenant predicate;
- no account context produces zero visible rows;
- transaction-local context disappears after commit on the same session;
- the role is non-superuser, `NOBYPASSRLS`, `NOINHERIT`, and configured with a two-second statement timeout;
- the session role does not own `public.lab_orders`;
- selecting `internal_note` is denied by an executed query;
- `INSERT` and `UPDATE` are each denied by executed queries; and
- `pg_sleep(3)` is canceled with SQLSTATE `57014`, proving runtime enforcement of the role timeout.

The setup uses `current_setting('app.account_id', true)` in the RLS policy and transaction-local `set_config(..., true)` for account context. PostgreSQL documents transaction-local settings and row security here:

- `SET` and transaction-local settings: https://www.postgresql.org/docs/18/sql-set.html
- Row security and `FORCE ROW LEVEL SECURITY`: https://www.postgresql.org/docs/18/ddl-rowsecurity.html#DDL-ROWSECURITY-FORCE
- Role attributes including `BYPASSRLS`: https://www.postgresql.org/docs/18/role-attributes.html
- Column privileges: https://www.postgresql.org/docs/18/ddl-priv.html

A prior observed PostgreSQL 18 run passed the original six integration checks. This replacement expands the suite to ten checks. The expected expanded result below is a test oracle, not a claim that this replacement was executed during drafting.

## Prerequisites

### Offline suite

- Node.js 22 or later
- npm

There are no package dependencies. Do not run `npm install` unless your environment requires it for unrelated repository tooling.

### PostgreSQL suite

- Docker Engine with permission to start and remove a local container
- A POSIX `sh` environment for `sql/run-integration.sh`
- The `postgres:18` image locally available or permission for Docker to pull it

No host PostgreSQL client and no unused host port are required. The container publishes no ports.

Docker documents the `none` network driver and read-only bind mounts here:

- None network driver: https://docs.docker.com/engine/network/drivers/none/
- Bind mounts and the read-only option: https://docs.docker.com/engine/storage/bind-mounts/

## Run from the stable public training path

From the repository root:

```sh
cd training/developer-and-practitioner-ai/function-calling-and-tools/lab
npm test
```

npm runs package scripts as documented at https://docs.npmjs.com/cli/v11/using-npm/scripts.

## Worked example: diagnose the starter defect

The fixture contains order number `1042` for both `acct-a` and `acct-b`. The starter lookup checks only the order number, so JavaScript's `find` returns the first matching row regardless of the authenticated account.

The starter therefore has exactly two deliberate failures. Expected stdout is exactly:

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

Expected exit code: `1`.

The two failures have different inputs but the same cause. The lookup omits trusted tenant context. The first failure observes the wrong tenant's status for an overlapping order number. The second changes the order number and demonstrates that tenant A can find an order belonging only to tenant B.

## Focused learner repair

Open `src/bridge.mjs`. In `lookupOrder`, change only the single `find` predicate so it requires both:

```js
candidate.account_id === authenticated.accountId
```

and:

```js
candidate.order_number === args.order_number
```

The repaired predicate is:

```js
return fixture.orders.find(
  (candidate) => candidate.account_id === authenticated.accountId && candidate.order_number === args.order_number
);
```

Do not add identity to model arguments. Do not change the stable tool names, provider envelope fields, fixture IDs, schemas, or tests.

Run:

```sh
npm test
```

After the repair, all thirteen named lines begin with `PASS`, followed by exactly:

```text
SUMMARY pass=13 fail=0 skip=0
```

Expected exit code: `0`.

Exceptions are failures. Unsupported checks must be explicit skips and must never be counted as passes. This suite has zero expected skips.

## Independent learner variation: test the causal explanation

After obtaining the 13-pass result, save your correct predicate and temporarily replace its `&&` with `||`:

```js
(candidate) => candidate.account_id === authenticated.accountId || candidate.order_number === args.order_number
```

Before running the suite, predict the result. With `||`, any row from the authenticated account or any row with the requested number can match. That recreates both cross-tenant failures.

Run:

```sh
npm test
```

Expected summary and exit code are:

```text
SUMMARY pass=11 fail=2 skip=0
```

Expected exit code: `1`.

The causal feedback is the return of the same two tenant-isolation failures. This shows that checking two conditions is insufficient unless both must be true. Restore `&&`, run `npm test` again, and confirm:

```text
SUMMARY pass=13 fail=0 skip=0
```

Expected exit code: `0`.

## Independent reference

Run the maintained reference implementation without changing your learner file:

```sh
npm run test:reference
```

The script uses a Node.js runner rather than shell-specific environment-variable assignment, so this command works through npm on Windows and POSIX systems.

All thirteen named lines begin with `PASS`, followed by exactly:

```text
SUMMARY pass=13 fail=0 skip=0
```

Expected exit code: `0`.

The reference result establishes the expected fixture behavior independently of `src/bridge.mjs`. It still does not establish PostgreSQL behavior.

## Recovery

Restore the deliberate starter defect with:

```sh
npm run reset
```

Expected stdout is exactly:

```text
Reset src/bridge.mjs to the deliberate tenant-scoping defect.
```

Expected exit code: `0`.

The reset writes only `src/bridge.mjs` inside this lab. Test scratch data, if added, must remain under `test-scratch/`; do not use the operating system temporary directory.

After reset, `npm test` again has the expected starter summary:

```text
SUMMARY pass=11 fail=2 skip=0
```

Expected exit code: `1`.

## Run the isolated PostgreSQL 18 proof

From the lab directory, run:

```sh
npm run test:postgres
```

The script performs the complete container lifecycle. Do not start or delete a fixed-name container manually.

For each invocation, the script:

1. Constructs a process-specific container name.
2. Starts `postgres:18` with `--network none` and no `-p` or `--publish` option.
3. mounts this lab at `/lab` read-only;
4. records the container ID only after `docker run` succeeds;
5. executes `psql` inside that exact container;
6. passes `ON_ERROR_STOP=1` to every `psql` call;
7. treats expected denials as passes only when `psql` fails with the required SQLSTATE; and
8. removes only the exact recorded container ID on success, test failure, interruption, or timeout.

If a generated name somehow conflicts with a preexisting resource, `docker run` fails before the script records ownership. Cleanup therefore does not remove the conflicting resource.

Expected stdout is exactly:

```text
SETUP ok
OWN acct-a 1042|packed
OTHER hidden 0
NO_CONTEXT 0
POOL first=1 next=0
ROLE super=f bypass=f inherit=f timeout=2s
INTERNAL_NOTE denied sqlstate=42501
WRITE insert=denied update=denied sqlstate=42501
TIMEOUT enforced sqlstate=57014
NONOWNER session=support_tool owner=postgres
POSTGRES_SUMMARY pass=10 fail=0 skip=0
```

Expected exit code: `0`.

Any unexpected SQL success, wrong SQLSTATE, malformed result, container readiness failure, or cleanup failure produces a nonzero exit. The script never converts a failed assertion into a passing summary.

If Docker or the image is unavailable, record the integration as `NOT RUN`. Do not substitute the offline array tests and do not report them as database evidence.

## Why the SQL checks behave this way

`support_tool` receives `SELECT` only on `account_id`, `order_number`, `status`, and `updated_at`. It receives no privilege on `internal_note` and no table write privileges. PostgreSQL must therefore reject the restricted-column query and both write statements with insufficient-privilege SQLSTATE `42501`.

The RLS policy compares each row's `account_id` with transaction-local `app.account_id`. Supplying `true` as the third `set_config` argument makes the setting local to the current transaction. Once that transaction commits, a following transaction on the same session has no retained account value and sees zero rows.

The role-level `statement_timeout` is two seconds. `SELECT pg_sleep(3)` exceeds that limit and must be canceled with query-canceled SQLSTATE `57014`. Merely reading `rolconfig` would show configuration, but the sleep assertion independently proves runtime enforcement.

## Real deployment requirements not simulated here

A production system still needs a dedicated nonowner, non-superuser, `NOBYPASSRLS` role; review of inherited privileges and every applicable policy; restricted column grants; account context set transaction-locally on the same pooled connection; and reset or discard handling for failed transactions.

For HTTP tools, use trusted configured origins, scoped server-side credentials, downstream authorization, TLS, explicit request timeouts, response-size limits, safe logging, persisted approval state, and a durable idempotency ledger. The fixture route table does not establish these controls.

The isolated container exercise also does not establish host hardening, image provenance, production network policy, backup policy, monitoring, or deployment approval.

## ASSUMPTIONS

- Docker supports `--network none`, bind mounts, `docker exec`, and Go-template formatting in `docker inspect`.
- The official `postgres:18` image permits local Unix-socket administration and login-role connections under its initialized local authentication configuration.
- Commands are run from the checked-out lab through the stable path shown above.

## OMITTED

Nothing requested by this work item was intentionally omitted.
