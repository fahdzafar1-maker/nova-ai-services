-- Fahd AI Services platform schema.
-- All tables are prefixed site_ so they live safely next to existing tables (e.g. the Skyline "leads" table).
-- Security model:
--   * RLS is enabled on every table.
--   * The public (anon) role can only READ published services and demos. It cannot read or write anything else.
--   * All public writes (forms, AI leads, analytics) go through Next.js server routes that use the service-role key,
--     validate input and rate-limit first. The service-role key never reaches the browser.
--   * Admins are authenticated Supabase users whose profile role is 'admin'. Admin access is enforced by RLS.

create extension if not exists pgcrypto;

-- ---------- Profiles & roles ----------
create table if not exists public.site_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'viewer' check (role in ('admin','viewer')),
  created_at timestamptz not null default now()
);

create table if not exists public.site_admin_allowlist (
  email text primary key,
  created_at timestamptz not null default now()
);

create or replace function public.site_is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.site_profiles p where p.id = auth.uid() and p.role = 'admin');
$$;

-- Admin profiles are provisioned by the app on first login (see app/admin/actions.ts):
-- if the signed-in email is in site_admin_allowlist, a site_profiles row with role 'admin' is created
-- using the server-side service role. No trigger on auth.users is needed.

-- ---------- Catalog (admin-editable) ----------
create table if not exists public.site_services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]{2,80}$'),
  category text not null check (category in ('ai-automation','ai-agents','web-software','growth-automation')),
  title text not null check (char_length(title) between 2 and 120),
  summary text not null check (char_length(summary) <= 600),
  benefits text[] not null default '{}',
  demo_slug text,
  icon text not null default 'spark',
  sort_order int not null default 100,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists site_services_order_idx on public.site_services (published, sort_order);

create table if not exists public.site_demos (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]{2,80}$'),
  title text not null,
  category text not null,
  summary text not null,
  use_case text not null default '',
  tags text[] not null default '{}',
  featured boolean not null default false,
  sort_order int not null default 100,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists site_demos_order_idx on public.site_demos (published, sort_order);

-- ---------- Leads & requests ----------
create table if not exists public.site_leads (
  id uuid primary key default gen_random_uuid(),
  ref text not null unique,
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone text check (phone is null or char_length(phone) <= 32),
  company text check (company is null or char_length(company) <= 160),
  service text,
  budget text,
  message text check (message is null or char_length(message) <= 4000),
  source text not null default 'form' check (source in ('form','ai','booking','order')),
  status text not null default 'New' check (status in ('New','Contacted','Qualified','Proposal Sent','Won','Lost')),
  notes text,
  assigned_to uuid references public.site_profiles(id) on delete set null,
  consent boolean not null default false,
  ip_hash text,
  dedupe_key text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists site_leads_created_idx on public.site_leads (created_at desc);
create index if not exists site_leads_status_idx on public.site_leads (status);
create index if not exists site_leads_email_idx on public.site_leads (lower(email));
create unique index if not exists site_leads_dedupe_idx on public.site_leads (dedupe_key) where dedupe_key is not null;

create table if not exists public.site_inquiries (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.site_leads(id) on delete cascade,
  ref text not null unique,
  kind text not null default 'inquiry' check (kind in ('inquiry','consultation')),
  service text,
  message text,
  status text not null default 'open' check (status in ('open','answered','closed')),
  created_at timestamptz not null default now()
);
create index if not exists site_inquiries_created_idx on public.site_inquiries (created_at desc);

create table if not exists public.site_booking_requests (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.site_leads(id) on delete cascade,
  ref text not null unique,
  service text,
  preferred_date date,
  preferred_time text,
  timezone text,
  -- 'requested' until a human (or a real calendar integration) confirms it. Never auto-confirmed.
  status text not null default 'requested' check (status in ('requested','confirmed','declined','cancelled')),
  created_at timestamptz not null default now()
);
create index if not exists site_booking_created_idx on public.site_booking_requests (created_at desc);

create table if not exists public.site_order_requests (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.site_leads(id) on delete cascade,
  ref text not null unique,
  items jsonb not null default '[]',
  notes text,
  -- 'pending' until payment / acceptance is verified by a human.
  status text not null default 'pending' check (status in ('pending','accepted','in_progress','completed','cancelled')),
  created_at timestamptz not null default now()
);
create index if not exists site_order_created_idx on public.site_order_requests (created_at desc);

create table if not exists public.site_lead_activity (
  id bigserial primary key,
  lead_id uuid not null references public.site_leads(id) on delete cascade,
  actor uuid references public.site_profiles(id) on delete set null,
  action text not null,
  details jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create index if not exists site_lead_activity_lead_idx on public.site_lead_activity (lead_id, created_at desc);

-- ---------- Analytics (first-party, no personal data) ----------
create table if not exists public.site_events (
  id bigserial primary key,
  event text not null check (event ~ '^[a-z0-9_]{2,48}$'),
  path text,
  visitor_id text not null,   -- salted hash of a random first-party cookie id; never an IP or email
  session_id text,
  props jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create index if not exists site_events_created_idx on public.site_events (created_at desc);
create index if not exists site_events_event_idx on public.site_events (event, created_at desc);

create table if not exists public.site_ai_conversations (
  id uuid primary key default gen_random_uuid(),
  session_id text not null unique,
  visitor_id text,
  message_count int not null default 0,
  intent text,
  lead_id uuid references public.site_leads(id) on delete set null,
  escalated boolean not null default false,
  started_at timestamptz not null default now(),
  last_at timestamptz not null default now()
);
create index if not exists site_ai_conv_started_idx on public.site_ai_conversations (started_at desc);

-- ---------- Ops ----------
create table if not exists public.site_admin_logs (
  id bigserial primary key,
  actor uuid references public.site_profiles(id) on delete set null,
  action text not null,
  entity text,
  entity_id text,
  details jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.site_notification_log (
  id bigserial primary key,
  kind text not null,
  ref text,
  target text not null,
  status text not null check (status in ('sent','failed','skipped')),
  attempts int not null default 1,
  error text,
  created_at timestamptz not null default now()
);
create index if not exists site_notification_created_idx on public.site_notification_log (created_at desc);

create table if not exists public.site_rate_hits (
  id bigserial primary key,
  bucket text not null,
  created_at timestamptz not null default now()
);
create index if not exists site_rate_hits_idx on public.site_rate_hits (bucket, created_at desc);

-- Shared rate-limit counter used by server routes. Only the service role is counted; anyone else gets "true"
-- and cannot use it to write. Old rows can be purged with supabase/manual/maintenance.sql.
create or replace function public.site_rate_hit(p_bucket text, p_max int, p_window_seconds int)
returns boolean
language plpgsql security definer set search_path = public
as $$
declare n int;
begin
  if coalesce(auth.role(), '') <> 'service_role' then return true; end if;
  select count(*) into n from public.site_rate_hits
    where bucket = p_bucket and created_at > now() - make_interval(secs => p_window_seconds);
  if n >= p_max then return false; end if;
  insert into public.site_rate_hits(bucket) values (p_bucket);
  return true;
end;
$$;

-- updated_at helper
create or replace function public.site_touch_updated_at() returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;
drop trigger if exists site_services_touch on public.site_services;
create trigger site_services_touch before update on public.site_services for each row execute function public.site_touch_updated_at();
drop trigger if exists site_demos_touch on public.site_demos;
create trigger site_demos_touch before update on public.site_demos for each row execute function public.site_touch_updated_at();
drop trigger if exists site_leads_touch on public.site_leads;
create trigger site_leads_touch before update on public.site_leads for each row execute function public.site_touch_updated_at();

-- ---------- Admin dashboard aggregate (admin only) ----------
create or replace function public.site_dashboard_stats(p_from timestamptz, p_to timestamptz)
returns jsonb
language plpgsql stable security definer set search_path = public
as $$
declare result jsonb;
begin
  if not public.site_is_admin() then
    raise exception 'not authorized' using errcode = '42501';
  end if;
  select jsonb_build_object(
    'page_views', (select count(*) from site_events where event = 'page_view' and created_at between p_from and p_to),
    'unique_visitors', (select count(distinct visitor_id) from site_events where created_at between p_from and p_to),
    'sessions', (select count(distinct session_id) from site_events where created_at between p_from and p_to),
    'visitors_today', (select count(distinct visitor_id) from site_events where created_at >= date_trunc('day', now())),
    'services_views', (select count(*) from site_events where event = 'page_view' and path like '/services%' and created_at between p_from and p_to),
    'service_detail_views', (select count(*) from site_events where event = 'service_view' and created_at between p_from and p_to),
    'demo_views', (select count(*) from site_events where event = 'demo_view' and created_at between p_from and p_to),
    'demo_interactions', (select count(*) from site_events where event in ('demo_start','demo_complete','demo_interact') and created_at between p_from and p_to),
    'form_starts', (select count(*) from site_events where event = 'form_start' and created_at between p_from and p_to),
    'form_submissions', (select count(*) from site_inquiries where created_at between p_from and p_to),
    'ai_opens', (select count(*) from site_events where event = 'ai_open' and created_at between p_from and p_to),
    'ai_conversations', (select count(*) from site_ai_conversations where started_at between p_from and p_to),
    'leads', (select count(*) from site_leads where created_at between p_from and p_to),
    'qualified_leads', (select count(*) from site_leads where status in ('Qualified','Proposal Sent','Won') and created_at between p_from and p_to),
    'won_leads', (select count(*) from site_leads where status = 'Won' and created_at between p_from and p_to),
    'booking_requests', (select count(*) from site_booking_requests where created_at between p_from and p_to),
    'order_requests', (select count(*) from site_order_requests where created_at between p_from and p_to),
    'notification_failures', (select count(*) from site_notification_log where status = 'failed' and created_at between p_from and p_to),
    'daily', (
      select coalesce(jsonb_agg(d order by d->>'day'), '[]'::jsonb) from (
        select jsonb_build_object(
          'day', to_char(g.day, 'YYYY-MM-DD'),
          'views', (select count(*) from site_events e where e.event = 'page_view' and e.created_at >= g.day and e.created_at < g.day + interval '1 day'),
          'visitors', (select count(distinct visitor_id) from site_events e where e.created_at >= g.day and e.created_at < g.day + interval '1 day'),
          'leads', (select count(*) from site_leads l where l.created_at >= g.day and l.created_at < g.day + interval '1 day')
        ) d
        from generate_series(date_trunc('day', p_from), date_trunc('day', p_to), interval '1 day') as g(day)
      ) x
    ),
    'top_services', (
      select coalesce(jsonb_agg(t), '[]'::jsonb) from (
        select props->>'slug' as slug, count(*) as views from site_events
        where event = 'service_view' and created_at between p_from and p_to and props ? 'slug'
        group by 1 order by 2 desc limit 8
      ) t
    ),
    'top_demos', (
      select coalesce(jsonb_agg(t), '[]'::jsonb) from (
        select props->>'slug' as slug, count(*) as views from site_events
        where event = 'demo_view' and created_at between p_from and p_to and props ? 'slug'
        group by 1 order by 2 desc limit 8
      ) t
    ),
    'lead_sources', (
      select coalesce(jsonb_agg(t), '[]'::jsonb) from (
        select source, count(*) as n from site_leads where created_at between p_from and p_to group by 1 order by 2 desc
      ) t
    ),
    'demo_to_lead', (select count(*) from site_events where event = 'demo_lead' and created_at between p_from and p_to)
  ) into result;
  return result;
end;
$$;
revoke all on function public.site_dashboard_stats(timestamptz, timestamptz) from public, anon;
grant execute on function public.site_dashboard_stats(timestamptz, timestamptz) to authenticated;

-- ---------- Row Level Security ----------
alter table public.site_profiles enable row level security;
alter table public.site_admin_allowlist enable row level security;
alter table public.site_services enable row level security;
alter table public.site_demos enable row level security;
alter table public.site_leads enable row level security;
alter table public.site_inquiries enable row level security;
alter table public.site_booking_requests enable row level security;
alter table public.site_order_requests enable row level security;
alter table public.site_lead_activity enable row level security;
alter table public.site_events enable row level security;
alter table public.site_ai_conversations enable row level security;
alter table public.site_admin_logs enable row level security;
alter table public.site_notification_log enable row level security;
alter table public.site_rate_hits enable row level security;

-- Profiles: a user can read their own profile; admins can read all. Nobody can change roles through the API.
drop policy if exists "own profile" on public.site_profiles;
create policy "own profile" on public.site_profiles for select to authenticated using (id = auth.uid() or public.site_is_admin());

-- Catalog: public reads published rows; admins manage everything.
drop policy if exists "public read services" on public.site_services;
create policy "public read services" on public.site_services for select to anon, authenticated using (published or public.site_is_admin());
drop policy if exists "admin write services" on public.site_services;
create policy "admin write services" on public.site_services for all to authenticated using (public.site_is_admin()) with check (public.site_is_admin());

drop policy if exists "public read demos" on public.site_demos;
create policy "public read demos" on public.site_demos for select to anon, authenticated using (published or public.site_is_admin());
drop policy if exists "admin write demos" on public.site_demos;
create policy "admin write demos" on public.site_demos for all to authenticated using (public.site_is_admin()) with check (public.site_is_admin());

-- Private business data: admins only. (No anon policies = anon has no access at all.)
do $$
declare t text;
begin
  foreach t in array array['site_leads','site_inquiries','site_booking_requests','site_order_requests','site_lead_activity',
                           'site_events','site_ai_conversations','site_admin_logs','site_notification_log']
  loop
    execute format('drop policy if exists "admin read %1$s" on public.%1$I', t);
    execute format('create policy "admin read %1$s" on public.%1$I for select to authenticated using (public.site_is_admin())', t);
  end loop;
end $$;

drop policy if exists "admin update leads" on public.site_leads;
create policy "admin update leads" on public.site_leads for update to authenticated using (public.site_is_admin()) with check (public.site_is_admin());
drop policy if exists "admin update inquiries" on public.site_inquiries;
create policy "admin update inquiries" on public.site_inquiries for update to authenticated using (public.site_is_admin()) with check (public.site_is_admin());
drop policy if exists "admin update bookings" on public.site_booking_requests;
create policy "admin update bookings" on public.site_booking_requests for update to authenticated using (public.site_is_admin()) with check (public.site_is_admin());
drop policy if exists "admin update orders" on public.site_order_requests;
create policy "admin update orders" on public.site_order_requests for update to authenticated using (public.site_is_admin()) with check (public.site_is_admin());
drop policy if exists "admin insert activity" on public.site_lead_activity;
create policy "admin insert activity" on public.site_lead_activity for insert to authenticated with check (public.site_is_admin() and actor = auth.uid());
drop policy if exists "admin insert logs" on public.site_admin_logs;
create policy "admin insert logs" on public.site_admin_logs for insert to authenticated with check (public.site_is_admin() and actor = auth.uid());
-- site_admin_allowlist and site_rate_hits: no policies -> only the service role / SQL editor can touch them.
