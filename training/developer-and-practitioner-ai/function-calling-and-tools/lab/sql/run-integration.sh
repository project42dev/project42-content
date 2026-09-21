#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
LAB_DIR=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)
CONTAINER_NAME="p42-tools-pg-$(date +%s)-$$"
CONTAINER_ID=''
CREATED=0

cleanup() {
  status=$?
  trap - EXIT HUP INT TERM
  if [ "$CREATED" -eq 1 ] && [ -n "$CONTAINER_ID" ]; then
    if ! docker rm -f "$CONTAINER_ID" >/dev/null 2>&1; then
      printf '%s\n' "CLEANUP failed for created container $CONTAINER_ID" >&2
      status=1
    fi
  fi
  exit "$status"
}

trap cleanup EXIT
trap 'exit 129' HUP
trap 'exit 130' INT
trap 'exit 143' TERM

CONTAINER_ID=$(docker run \
  --name "$CONTAINER_NAME" \
  --network none \
  --env POSTGRES_HOST_AUTH_METHOD=trust \
  --mount "type=bind,src=$LAB_DIR,dst=/lab,readonly" \
  -d \
  postgres:18)
CREATED=1

[ -n "$CONTAINER_ID" ] || {
  printf '%s\n' 'Docker did not return a container ID.' >&2
  exit 1
}

network_mode=$(docker inspect -f '{{.HostConfig.NetworkMode}}' "$CONTAINER_ID")
[ "$network_mode" = 'none' ] || {
  printf 'ISOLATION fail network=%s\n' "$network_mode" >&2
  exit 1
}

lab_mount_rw=$(docker inspect -f '{{range .Mounts}}{{if eq .Destination "/lab"}}{{.RW}}{{end}}{{end}}' "$CONTAINER_ID")
[ "$lab_mount_rw" = 'false' ] || {
  printf 'ISOLATION fail lab_mount_rw=%s\n' "$lab_mount_rw" >&2
  exit 1
}

ready=0
attempt=0
while [ "$attempt" -lt 60 ]; do
  if docker exec "$CONTAINER_ID" pg_isready -U postgres -d postgres >/dev/null 2>&1; then
    ready=1
    break
  fi
  attempt=$((attempt + 1))
  sleep 1
done

[ "$ready" -eq 1 ] || {
  printf '%s\n' 'PostgreSQL did not become ready within 60 seconds.' >&2
  docker logs "$CONTAINER_ID" >&2 || true
  exit 1
}

psql_admin() {
  docker exec -i "$CONTAINER_ID" psql -X -qAt -v ON_ERROR_STOP=1 -U postgres -d postgres "$@"
}

psql_role() {
  docker exec -i "$CONTAINER_ID" psql -X -qAt -v ON_ERROR_STOP=1 -U support_tool -d postgres "$@"
}

expect_role_failure() {
  expected_state=$1
  sql_text=$2

  set +e
  failure_output=$(printf '\\set VERBOSITY sqlstate\n%s\n' "$sql_text" | psql_role 2>&1)
  failure_status=$?
  set -e

  [ "$failure_status" -ne 0 ] || {
    printf 'EXPECTED_FAILURE unexpectedly succeeded: %s\n' "$sql_text" >&2
    return 1
  }

  printf '%s\n' "$failure_output" | grep -Eq "(^|[^0-9A-Z])${expected_state}([^0-9A-Z]|$)" || {
    printf 'EXPECTED_FAILURE wrong error, wanted SQLSTATE %s:\n%s\n' "$expected_state" "$failure_output" >&2
    return 1
  }
}

psql_admin -f /lab/sql/setup.sql >/dev/null
printf '%s\n' 'SETUP ok'

own=$(psql_role <<'SQL'
BEGIN;
SELECT set_config('app.account_id','acct-a',true) IS NOT NULL;
SELECT order_number || '|' || status FROM public.lab_orders ORDER BY order_number;
COMMIT;
SQL
)
own=$(printf '%s\n' "$own" | grep '|' | tail -n 1)
[ "$own" = '1042|packed' ] || {
  printf 'OWN fail %s\n' "$own" >&2
  exit 1
}
printf 'OWN acct-a %s\n' "$own"

other=$(psql_role <<'SQL'
BEGIN;
SELECT set_config('app.account_id','acct-a',true) IS NOT NULL;
SELECT count(*) FROM public.lab_orders WHERE status = 'shipped';
COMMIT;
SQL
)
other=$(printf '%s\n' "$other" | grep -E '^[0-9]+$' | tail -n 1)
[ "$other" = '0' ] || {
  printf 'OTHER fail %s\n' "$other" >&2
  exit 1
}
printf 'OTHER hidden %s\n' "$other"

none=$(psql_role -c 'SELECT count(*) FROM public.lab_orders')
[ "$none" = '0' ] || {
  printf 'NO_CONTEXT fail %s\n' "$none" >&2
  exit 1
}
printf 'NO_CONTEXT %s\n' "$none"

pool=$(psql_role <<'SQL'
BEGIN;
SELECT set_config('app.account_id','acct-a',true) IS NOT NULL;
SELECT 'first=' || count(*) FROM public.lab_orders;
COMMIT;
BEGIN;
SELECT 'next=' || count(*) FROM public.lab_orders;
COMMIT;
SQL
)
first=$(printf '%s\n' "$pool" | grep '^first=' | cut -d= -f2)
next=$(printf '%s\n' "$pool" | grep '^next=' | cut -d= -f2)
[ "$first" = '1' ] && [ "$next" = '0' ] || {
  printf 'POOL fail first=%s next=%s\n' "$first" "$next" >&2
  exit 1
}
printf 'POOL first=%s next=%s\n' "$first" "$next"

role=$(psql_admin -c "SELECT 'super=' || rolsuper || ' bypass=' || rolbypassrls || ' inherit=' || rolinherit || ' timeout=' || coalesce((SELECT split_part(config, '=', 2) FROM unnest(coalesce(rolconfig, ARRAY[]::text[])) AS config WHERE config LIKE 'statement_timeout=%'), '') FROM pg_roles WHERE rolname = 'support_tool'")
[ "$role" = 'super=f bypass=f inherit=f timeout=2s' ] || {
  printf 'ROLE fail %s\n' "$role" >&2
  exit 1
}
printf 'ROLE %s\n' "$role"

expect_role_failure 42501 'SELECT internal_note FROM public.lab_orders;'
printf '%s\n' 'INTERNAL_NOTE denied sqlstate=42501'

expect_role_failure 42501 "INSERT INTO public.lab_orders (account_id, order_number, status, updated_at, internal_note) VALUES ('acct-a', '7777', 'new', now(), 'forbidden');"
expect_role_failure 42501 "UPDATE public.lab_orders SET status = 'changed' WHERE account_id = 'acct-a' AND order_number = '1042';"
printf '%s\n' 'WRITE insert=denied update=denied sqlstate=42501'

expect_role_failure 57014 'SELECT pg_sleep(3);'
printf '%s\n' 'TIMEOUT enforced sqlstate=57014'

session_role=$(psql_role -c "SELECT session_user || '|' || current_user")
table_owner=$(psql_admin -c "SELECT pg_get_userbyid(relowner) FROM pg_class WHERE oid = 'public.lab_orders'::regclass")
[ "$session_role" = 'support_tool|support_tool' ] || {
  printf 'NONOWNER fail session=%s\n' "$session_role" >&2
  exit 1
}
[ "$table_owner" = 'postgres' ] || {
  printf 'NONOWNER fail owner=%s\n' "$table_owner" >&2
  exit 1
}
[ "$table_owner" != 'support_tool' ] || {
  printf '%s\n' 'NONOWNER fail support_tool owns the table' >&2
  exit 1
}
printf '%s\n' 'NONOWNER session=support_tool owner=postgres'

printf '%s\n' 'POSTGRES_SUMMARY pass=10 fail=0 skip=0'
