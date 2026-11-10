-- BookFlow: limits that stop spam bookings. Run after the schema migration.
-- The booking Server Action calls public.booking_allowed() before it saves anything.

-- 1. Recent booking attempts, by an anonymous key ------------------------------
-- The key is an HMAC of the visitor's IP address made on the server:
-- the same visitor gets the same key, but the IP itself is never stored.
create table public.booking_attempts (
  id bigint generated always as identity primary key,
  client_key text not null check (client_key ~ '^[0-9a-f]{64}$'),
  created_at timestamptz not null default now()
);

comment on table public.booking_attempts is 'Booking attempts per anonymous visitor key, kept for one day.';

create index booking_attempts_key_time_idx
  on public.booking_attempts (client_key, created_at desc);

-- Only the server's secret key may touch it: RLS on, and no policies for anyone else.
alter table public.booking_attempts enable row level security;
revoke all on public.booking_attempts from anon, authenticated;
grant all on public.booking_attempts to service_role;

-- 2. The check ------------------------------------------------------------------
-- 'ok' records the attempt and lets the booking through.
-- 'too_many_attempts': this visitor tried 5 times in the last hour.
-- 'too_many_pending': this phone number already has 3 upcoming bookings waiting.
create or replace function public.booking_allowed(p_client_key text, p_phone text)
returns text
language plpgsql
security invoker
set search_path = ''
as $$
declare
  recent_attempts integer;
  pending_bookings integer;
begin
  -- Forget attempts older than a day, so the table stays small.
  delete from public.booking_attempts where created_at < now() - interval '1 day';

  select count(*) into recent_attempts
  from public.booking_attempts
  where client_key = p_client_key
    and created_at > now() - interval '1 hour';

  if recent_attempts >= 5 then
    return 'too_many_attempts';
  end if;

  select count(*) into pending_bookings
  from public.bookings
  where customer_phone = p_phone
    and status = 'pending'
    and starts_at > now();

  if pending_bookings >= 3 then
    return 'too_many_pending';
  end if;

  insert into public.booking_attempts (client_key) values (p_client_key);
  return 'ok';
end;
$$;

revoke all on function public.booking_allowed(text, text) from public, anon, authenticated;
grant execute on function public.booking_allowed(text, text) to service_role;
