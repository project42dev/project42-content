\set ON_ERROR_STOP on
DROP TABLE IF EXISTS public.lab_orders;
DROP ROLE IF EXISTS support_tool;
CREATE ROLE support_tool LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOBYPASSRLS;
ALTER ROLE support_tool SET statement_timeout = '2s';
CREATE TABLE public.lab_orders (
  account_id text NOT NULL,
  order_number text NOT NULL,
  status text NOT NULL,
  updated_at timestamptz NOT NULL,
  internal_note text NOT NULL,
  PRIMARY KEY (account_id, order_number)
);
ALTER TABLE public.lab_orders OWNER TO postgres;
INSERT INTO public.lab_orders VALUES
  ('acct-a', '1042', 'packed', '2026-09-20T10:00:00Z', 'private-a'),
  ('acct-b', '1042', 'shipped', '2026-09-20T11:00:00Z', 'private-b'),
  ('acct-b', '9001', 'processing', '2026-09-20T12:00:00Z', 'private-b2');
REVOKE ALL ON public.lab_orders FROM PUBLIC;
GRANT USAGE ON SCHEMA public TO support_tool;
GRANT SELECT (account_id, order_number, status, updated_at) ON public.lab_orders TO support_tool;
ALTER TABLE public.lab_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_orders FORCE ROW LEVEL SECURITY;
CREATE POLICY lab_orders_account_select ON public.lab_orders
  FOR SELECT TO support_tool
  USING (account_id = current_setting('app.account_id', true));
