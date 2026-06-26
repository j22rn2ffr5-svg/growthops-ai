-- ============================================================
-- GrowthOps AI — Client Portal Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Client profiles (one per user — set up manually by admin)
create table public.client_profiles (
  id               uuid references auth.users(id) on delete cascade primary key,
  business_name    text,
  package          text,       -- e.g. 'Growth System'
  retainer         text,       -- e.g. 'Active Growth Retainer'
  account_manager  text default 'Chris Eyres',
  onboarded_at     date default current_date
);

alter table public.client_profiles enable row level security;

create policy "Clients can read their own profile"
  on public.client_profiles for select
  using (auth.uid() = id);

-- 2. Analytics dashboards (added by admin per client)
create table public.client_dashboards (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id) on delete cascade not null,
  name        text not null,        -- e.g. 'SEO Performance'
  embed_url   text not null,        -- Looker Studio embed URL
  created_at  timestamptz default now()
);

alter table public.client_dashboards enable row level security;

create policy "Clients can read their own dashboards"
  on public.client_dashboards for select
  using (auth.uid() = user_id);

-- 3. Tickets
create table public.tickets (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id) on delete cascade not null,
  title       text not null,
  description text not null,
  category    text not null,
  priority    text not null default 'normal'
                check (priority in ('low', 'normal', 'high', 'urgent')),
  status      text not null default 'open'
                check (status in ('open', 'in_progress', 'resolved')),
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

alter table public.tickets enable row level security;

create policy "Clients can read their own tickets"
  on public.tickets for select
  using (auth.uid() = user_id);

create policy "Clients can create their own tickets"
  on public.tickets for insert
  with check (auth.uid() = user_id);

-- Auto-update updated_at on ticket change
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger tickets_updated_at
  before update on public.tickets
  for each row execute function update_updated_at();

-- ============================================================
-- HOW TO ADD A CLIENT (run as admin in SQL Editor):
-- ============================================================
-- Step 1: Invite user via Supabase Dashboard
--   Authentication → Users → Invite user → enter their email
--   They receive an email to set their password.
--
-- Step 2: Create their profile (replace with actual user UUID):
--   insert into public.client_profiles (id, business_name, package, retainer)
--   values (
--     'paste-user-uuid-here',
--     'Acme Ltd',
--     'Growth System',
--     'Active Growth Retainer'
--   );
--
-- Step 3: Add their dashboard (optional):
--   insert into public.client_dashboards (user_id, name, embed_url)
--   values (
--     'paste-user-uuid-here',
--     'SEO & Traffic Dashboard',
--     'https://lookerstudio.google.com/embed/reporting/YOUR_REPORT_ID/page/PAGE_ID'
--   );
-- ============================================================
