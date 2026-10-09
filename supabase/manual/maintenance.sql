-- Optional maintenance. Run in the Supabase SQL editor.

-- 1) Remove an older helper created during setup (replaced by site_rate_hit).
drop function if exists public.site_rate_check(text, int, int);

-- 2) Purge old rate-limit rows (safe any time). Consider scheduling with pg_cron daily.
delete from public.site_rate_hits where created_at < now() - interval '1 day';

-- 3) Data retention for analytics (example: keep 13 months).
delete from public.site_events where created_at < now() - interval '13 months';

-- 4) Make another user an admin (they must have signed in once, or add them to the allowlist first).
-- insert into public.site_admin_allowlist (email) values ('someone@example.com') on conflict do nothing;
