// Centralised, validated access to environment variables.
// Server-only secrets are read lazily so a missing optional integration never crashes the site.
export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://fahdaiservices.com",
  gaId: process.env.NEXT_PUBLIC_GA_ID || "",
};

export function serverEnv() {
  if (typeof window !== "undefined") throw new Error("serverEnv() must not be called in the browser");
  return {
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    geminiKey: process.env.GEMINI_API_KEY || "",
    geminiModel: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    n8nWebhookUrl: process.env.N8N_WEBHOOK_URL || "",
    n8nWebhookSecret: process.env.N8N_WEBHOOK_SECRET || "",
    hashSalt: process.env.ANALYTICS_HASH_SALT || "change-me-in-production",
  };
}

export const isSupabaseConfigured = () => Boolean(env.supabaseUrl && env.supabaseAnonKey);
