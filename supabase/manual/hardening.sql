-- Recommended hardening (run once in Supabase → SQL editor). Data is already protected by RLS;
-- these statements additionally hide private tables/functions from the public API schema.

-- Functions: only signed-in admins (stats) and the server (rate limit) need them.
revoke execute on function public.site_dashboard_stats(timestamptz, timestamptz) from anon, public;
revoke execute on function public.site_rate_hit(text, int, int) from anon, authenticated, public;
revoke execute on function public.site_is_admin() from anon, public;
drop function if exists public.site_rate_check(text, int, int);

-- Tables: the public site only needs to read services and demos.
revoke all on public.site_leads, public.site_inquiries, public.site_booking_requests, public.site_order_requests,
              public.site_lead_activity, public.site_events, public.site_ai_conversations, public.site_admin_logs,
              public.site_notification_log, public.site_rate_hits, public.site_admin_allowlist, public.site_profiles
  from anon;
revoke all on public.site_rate_hits, public.site_admin_allowlist from authenticated;

-- Also recommended in the dashboard: Authentication → Policies → enable "Leaked password protection",
-- and Authentication → Sign In / Providers → disable "Allow new users to sign up" (admins are added manually).
