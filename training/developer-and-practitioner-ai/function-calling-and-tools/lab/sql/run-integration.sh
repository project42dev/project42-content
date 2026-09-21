#!/bin/sh
set -eu
HOST=${PGHOST:-127.0.0.1}
PORT=${PGPORT:-55432}
DB=${PGDATABASE:-postgres}
ADMIN=${PGADMIN:-postgres}
base="psql -X -qAt -h $HOST -p $PORT -d $DB"
$base -U "$ADMIN" -f sql/setup.sql >/dev/null
printf '%s\n' 'SETUP ok'

own=$($base -U support_tool <<'SQL'
BEGIN;
SELECT set_config('app.account_id','acct-a',true) IS NOT NULL;
SELECT order_number || '|' || status FROM public.lab_orders ORDER BY order_number;
COMMIT;
SQL
)
own=$(printf '%s\n' "$own" | grep '|' | tail -n 1)
[ "$own" = "1042|packed" ] || { printf 'OWN fail %s\n' "$own"; exit 1; }
printf 'OWN acct-a %s\n' "$own"

other=$($base -U support_tool <<'SQL'
BEGIN;
SELECT set_config('app.account_id','acct-a',true) IS NOT NULL;
SELECT count(*) FROM public.lab_orders WHERE status = 'shipped';
COMMIT;
SQL
)
other=$(printf '%s\n' "$other" | grep -E '^[0-9]+$' | tail -n 1)
[ "$other" = "0" ] || exit 1
printf 'OTHER hidden %s\n' "$other"

none=$($base -U support_tool -c "SELECT count(*) FROM public.lab_orders")
[ "$none" = "0" ] || exit 1
printf 'NO_CONTEXT %s\n' "$none"

pool=$($base -U support_tool <<'SQL'
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
[ "$first" = "1" ] && [ "$next" = "0" ] || exit 1
printf 'POOL first=%s next=%s\n' "$first" "$next"

role=$($base -U "$ADMIN" -c "SELECT 'super='||rolsuper||' bypass='||rolbypassrls||' inherit='||rolinherit||' timeout='||replace(unnest(rolconfig),'statement_timeout=','') FROM pg_roles WHERE rolname='support_tool'")
[ "$role" = "super=false bypass=false inherit=false timeout=2s" ] && role="super=f bypass=f inherit=f timeout=2s"
[ "$role" = "super=f bypass=f inherit=f timeout=2s" ] || { printf 'ROLE fail %s\n' "$role"; exit 1; }
printf 'ROLE %s\n' "$role"
printf '%s\n' 'POSTGRES_SUMMARY pass=6 fail=0 skip=0'
