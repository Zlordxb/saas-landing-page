-- BookFlow database tests: double bookings, Row Level Security and the spam limits.
-- Run with scripts/test-db.sh (it creates a throwaway database first).
-- Any failed check raises an error, and the run stops with a non-zero exit code.

\set ON_ERROR_STOP on
\set QUIET on

-- Test data -------------------------------------------------------------------
insert into auth.users (id, email) values
  ('00000000-0000-4000-8000-000000000001', 'owner@nefer.example'),
  ('00000000-0000-4000-8000-000000000002', 'visitor@nefer.example');

insert into public.admin_users (user_id) values ('00000000-0000-4000-8000-000000000001');

-- Two days from now, 14:00 to 14:30, chair busy until 14:45 (the 15-minute buffer).
create temporary table t (starts timestamptz);
insert into t values (date_trunc('day', now()) + interval '2 days 14 hours');

insert into public.bookings
  (reference, service_id, customer_name, customer_phone, starts_at, ends_at, blocked_until, price_egp)
select 'BF-AAAAAA', id, 'Mona Adel', '01012345678',
       t.starts, t.starts + interval '30 minutes', t.starts + interval '45 minutes', price_egp
from public.services, t
where slug = 'check-up-and-consultation';

grant select on t to anon, authenticated, service_role;

-- 1. Double bookings ------------------------------------------------------------
do $$
begin
  insert into public.bookings
    (reference, service_id, customer_name, customer_phone, starts_at, ends_at, blocked_until, price_egp)
  select 'BF-BBBBBB', id, 'Karim Samy', '01112345678',
         t.starts + interval '30 minutes', t.starts + interval '60 minutes',
         t.starts + interval '75 minutes', price_egp
  from public.services, t where slug = 'check-up-and-consultation';
  raise exception 'FAIL: a booking inside the sterilization buffer was accepted';
exception when exclusion_violation then
  raise notice 'ok - a time that overlaps another booking (or its buffer) is refused';
end;
$$;

do $$
begin
  insert into public.bookings
    (reference, service_id, customer_name, customer_phone, starts_at, ends_at, blocked_until, price_egp)
  select 'BF-CCCCCC', id, 'Karim Samy', '01112345678',
         t.starts + interval '45 minutes', t.starts + interval '75 minutes',
         t.starts + interval '90 minutes', price_egp
  from public.services, t where slug = 'check-up-and-consultation';
  raise notice 'ok - the next booking can start right after the buffer';
end;
$$;

do $$
begin
  insert into public.bookings
    (reference, service_id, customer_name, customer_phone, starts_at, ends_at, blocked_until, price_egp)
  select 'BF-DDDDDD', id, 'Bad Phone', '12345',
         t.starts + interval '3 hours', t.starts + interval '210 minutes',
         t.starts + interval '225 minutes', price_egp
  from public.services, t where slug = 'check-up-and-consultation';
  raise exception 'FAIL: an invalid phone number was saved';
exception when check_violation then
  raise notice 'ok - phone numbers must be 11-digit Egyptian mobiles';
end;
$$;

-- 2. Visitors (anon) --------------------------------------------------------------
begin;
set local role anon;
do $$
begin
  if (select count(*) from public.services) = 0 then
    raise exception 'FAIL: visitors cannot see the services';
  end if;
  raise notice 'ok - visitors can read active services';
end;
$$;
do $$
begin
  perform count(*) from public.bookings;
  raise exception 'FAIL: visitors can read bookings';
exception when insufficient_privilege then
  raise notice 'ok - visitors cannot read bookings';
end;
$$;
do $$
begin
  insert into public.bookings (reference) values ('BF-EEEEEE');
  raise exception 'FAIL: visitors can insert bookings directly';
exception when insufficient_privilege then
  raise notice 'ok - visitors cannot write bookings directly';
end;
$$;
do $$
begin
  perform public.booking_allowed(repeat('a', 64), '01012345678');
  raise exception 'FAIL: visitors can call the spam check themselves';
exception when insufficient_privilege then
  raise notice 'ok - only the server can run the spam check';
end;
$$;
rollback;

-- 3. A signed-in account that isn't an admin ---------------------------------------
begin;
set local role authenticated;
set local request.jwt.claims = '{"sub": "00000000-0000-4000-8000-000000000002"}';
do $$
declare
  changed integer;
begin
  if (select count(*) from public.bookings) <> 0 then
    raise exception 'FAIL: a non-admin can see bookings';
  end if;
  update public.bookings set status = 'confirmed';
  get diagnostics changed = row_count;
  if changed <> 0 then
    raise exception 'FAIL: a non-admin changed a booking';
  end if;
  raise notice 'ok - a signed-in non-admin sees and changes nothing';
end;
$$;
rollback;

-- 4. The clinic owner (admin) -------------------------------------------------------
begin;
set local role authenticated;
set local request.jwt.claims = '{"sub": "00000000-0000-4000-8000-000000000001"}';
do $$
declare
  changed integer;
begin
  if (select count(*) from public.bookings) < 2 then
    raise exception 'FAIL: the admin cannot see bookings';
  end if;
  update public.bookings set status = 'confirmed' where reference = 'BF-AAAAAA';
  get diagnostics changed = row_count;
  if changed <> 1 then
    raise exception 'FAIL: the admin could not confirm a booking';
  end if;
  raise notice 'ok - the admin can read bookings and confirm them';
end;
$$;
do $$
begin
  update public.bookings set customer_name = 'Someone Else' where reference = 'BF-AAAAAA';
  raise exception 'FAIL: the admin can rewrite patient details';
exception when insufficient_privilege then
  raise notice 'ok - the admin can change the status only, not patient details';
end;
$$;
rollback;

-- 5. Cancelling frees the time ------------------------------------------------------
do $$
begin
  update public.bookings set status = 'cancelled' where reference = 'BF-AAAAAA';
  insert into public.bookings
    (reference, service_id, customer_name, customer_phone, starts_at, ends_at, blocked_until, price_egp)
  select 'BF-FFFFFF', id, 'Yasmin Ali', '01212345678',
         t.starts, t.starts + interval '30 minutes', t.starts + interval '45 minutes', price_egp
  from public.services, t where slug = 'check-up-and-consultation';
  raise notice 'ok - a cancelled booking frees its time for someone else';
end;
$$;

-- 6. Spam limits (run as the server would, with the secret key) -----------------------
begin;
set local role service_role;
do $$
declare
  key text := repeat('b', 64);
  verdict text;
begin
  for attempt in 1..5 loop
    verdict := public.booking_allowed(key, '01099999999');
    if verdict <> 'ok' then
      raise exception 'FAIL: attempt % was refused (%)', attempt, verdict;
    end if;
  end loop;
  verdict := public.booking_allowed(key, '01099999999');
  if verdict <> 'too_many_attempts' then
    raise exception 'FAIL: a sixth attempt in an hour was allowed (%)', verdict;
  end if;
  if public.booking_allowed(repeat('c', 64), '01099999999') <> 'ok' then
    raise exception 'FAIL: another visitor was blocked by someone else''s attempts';
  end if;
  raise notice 'ok - 5 attempts an hour per visitor, counted separately for each visitor';
end;
$$;
do $$
declare
  verdict text;
begin
  insert into public.bookings
    (reference, service_id, customer_name, customer_phone, starts_at, ends_at, blocked_until, price_egp)
  select 'BF-GGGGG' || n, id, 'Many Bookings', '01055555555',
         t.starts + make_interval(days => n), t.starts + make_interval(days => n, mins => 30),
         t.starts + make_interval(days => n, mins => 45), price_egp
  from public.services, t, generate_series(2, 4) as n
  where slug = 'check-up-and-consultation';
  verdict := public.booking_allowed(repeat('d', 64), '01055555555');
  if verdict <> 'too_many_pending' then
    raise exception 'FAIL: a fourth pending booking for one phone was allowed (%)', verdict;
  end if;
  raise notice 'ok - one phone number can hold 3 pending bookings at most';
end;
$$;
rollback;

begin;
set local role authenticated;
set local request.jwt.claims = '{"sub": "00000000-0000-4000-8000-000000000001"}';
do $$
begin
  perform count(*) from public.booking_attempts;
  raise exception 'FAIL: signed-in users can read booking attempts';
exception when insufficient_privilege then
  raise notice 'ok - booking attempts are hidden from everyone but the server';
end;
$$;
rollback;

\echo 'All database checks passed.'
