-- BookFlow database schema
-- Run in the Supabase SQL editor (or with `supabase db push`). Safe to read top to bottom.

-- 1. Booking status -----------------------------------------------------------
create type public.booking_status as enum ('pending', 'confirmed', 'cancelled');

-- 2. Services: what the clinic offers -----------------------------------------
create table public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null check (char_length(name) between 2 and 80),
  description text not null default '',
  duration_minutes integer not null check (duration_minutes between 5 and 480),
  price_egp integer not null check (price_egp >= 0),
  price_unit text not null default 'per visit',
  is_popular boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

comment on table public.services is 'Treatments patients can book. Anyone can read the active ones.';

-- 3. Bookings -----------------------------------------------------------------
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique
    check (reference ~ '^BF-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{6}$'),
  service_id uuid not null references public.services (id) on delete restrict,
  customer_name text not null check (char_length(customer_name) between 3 and 60),
  customer_phone text not null check (customer_phone ~ '^01[0125][0-9]{8}$'),
  customer_email text check (customer_email is null or char_length(customer_email) <= 254),
  notes text check (notes is null or char_length(notes) <= 500),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  -- ends_at + the sterilization buffer: the chair is busy until then.
  blocked_until timestamptz not null,
  -- The price when the patient booked, so later price changes don't rewrite history.
  price_egp integer not null check (price_egp >= 0),
  status public.booking_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bookings_times_in_order check (starts_at < ends_at and ends_at <= blocked_until),
  -- The database itself refuses double bookings: two active bookings can never overlap,
  -- even when two people press "Confirm" in the same millisecond.
  constraint bookings_no_overlap exclude using gist (
    tstzrange(starts_at, blocked_until, '[)') with &&
  ) where (status <> 'cancelled')
);

comment on table public.bookings is 'Appointments. Only the server (secret key) inserts; only admins read and update.';

create index bookings_starts_at_idx on public.bookings (starts_at);
create index bookings_service_id_idx on public.bookings (service_id);

-- Keep updated_at current on every change.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger bookings_set_updated_at
before update on public.bookings
for each row execute function public.set_updated_at();

-- 4. Admins: who can open the dashboard ----------------------------------------
create table public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

comment on table public.admin_users is 'Clinic staff allowed into /admin. Add the owner after creating their user.';

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- 5. Privileges and Row Level Security -----------------------------------------
-- Privileges say WHAT a role may do; RLS policies say on WHICH rows.
alter table public.services enable row level security;
alter table public.bookings enable row level security;
alter table public.admin_users enable row level security;

revoke all on public.services, public.bookings, public.admin_users from anon, authenticated;
grant select on public.services to anon, authenticated;
grant select on public.bookings to authenticated;
grant update (status) on public.bookings to authenticated;
grant select on public.admin_users to authenticated;
grant all on public.services, public.bookings, public.admin_users to service_role;

create policy "Anyone can read active services"
  on public.services for select to anon
  using (is_active);

create policy "Signed-in users read active services, admins read all"
  on public.services for select to authenticated
  using (is_active or (select public.is_admin()));

create policy "Admins read bookings"
  on public.bookings for select to authenticated
  using ((select public.is_admin()));

create policy "Admins update booking status"
  on public.bookings for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Admins see their own admin row"
  on public.admin_users for select to authenticated
  using (user_id = (select auth.uid()));
