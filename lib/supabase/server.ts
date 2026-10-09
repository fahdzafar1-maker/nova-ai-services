import "server-only";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { env, serverEnv, isSupabaseConfigured } from "@/lib/env";

// Never let a slow database stall a page or API call.
const timedFetch: typeof fetch = (input, init) => fetch(input, { ...init, signal: init?.signal ?? AbortSignal.timeout(5000) });

/** Cookie-bound client: acts as the signed-in user, so Row Level Security applies. */
export async function supabaseUser() {
  if (!isSupabaseConfigured()) return null;
  const store = await cookies();
  return createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try { list.forEach(({ name, value, options }) => store.set(name, value, options)); } catch { /* called from a Server Component */ }
      },
    },
  });
}

/** Anonymous read-only client for public catalog data (RLS: published rows only). */
export function supabasePublic() {
  if (!isSupabaseConfigured()) return null;
  return createClient(env.supabaseUrl, env.supabaseAnonKey, { auth: { persistSession: false }, global: { fetch: timedFetch } });
}

/** Privileged client. Server-only. Used after validation + rate limiting for public writes. */
export function supabaseService() {
  const { serviceRoleKey } = serverEnv();
  if (!env.supabaseUrl || !serviceRoleKey) return null;
  return createClient(env.supabaseUrl, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: timedFetch } });
}
