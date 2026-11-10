-- Test setup ONLY. Never run this on a real Supabase project.
--
-- Supabase gives every database the roles anon, authenticated and service_role,
-- an auth schema with auth.users, and auth.uid() that reads the signed-in user
-- from the request's JWT. This file creates a tiny stand-in for those on plain
-- PostgreSQL, so the migrations and their security rules can be tested in CI.

do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then
    create role anon nologin;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then
    create role authenticated nologin;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'service_role') then
    create role service_role nologin bypassrls;
  end if;
end;
$$;

create schema if not exists auth;

create table if not exists auth.users (
  id uuid primary key default gen_random_uuid(),
  email text unique
);

-- Like Supabase: the user id is the "sub" claim of the JWT for this request.
create or replace function auth.uid()
returns uuid
language sql
stable
as $$
  select nullif(
    coalesce(current_setting('request.jwt.claims', true), '{}')::jsonb ->> 'sub',
    ''
  )::uuid;
$$;

grant usage on schema auth to anon, authenticated, service_role;
grant execute on function auth.uid() to anon, authenticated, service_role;
grant usage on schema public to anon, authenticated, service_role;
