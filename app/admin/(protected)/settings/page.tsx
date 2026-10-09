import { requireAdmin } from "@/lib/admin";
import { PageTitle, Badge, fmtDate } from "@/components/admin/ui";
import { serverEnv, env } from "@/lib/env";

export const metadata = { title: "Settings" };
export default async function Settings() {
  const { db } = await requireAdmin();
  const e = serverEnv();
  const checks = [
    { name: "Supabase (database & auth)", ok: Boolean(env.supabaseUrl && env.supabaseAnonKey), env: "NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY" },
    { name: "Server writes (forms, AI leads, analytics)", ok: Boolean(e.serviceRoleKey), env: "SUPABASE_SERVICE_ROLE_KEY" },
    { name: "Gemini AI assistant", ok: Boolean(e.geminiKey), env: `GEMINI_API_KEY (model: ${e.geminiModel})` },
    { name: "n8n lead webhook", ok: Boolean(e.n8nWebhookUrl), env: "N8N_WEBHOOK_URL, N8N_WEBHOOK_SECRET" },
    { name: "Webhook signing secret", ok: Boolean(e.n8nWebhookSecret), env: "N8N_WEBHOOK_SECRET" },
    { name: "Analytics hash salt", ok: e.hashSalt !== "change-me-in-production", env: "ANALYTICS_HASH_SALT" },
    { name: "Google Analytics 4 (optional)", ok: Boolean(env.gaId), env: "NEXT_PUBLIC_GA_ID" },
  ];
  const [profiles, notes, logs] = await Promise.all([
    db.from("site_profiles").select("email, role, created_at").order("created_at"),
    db.from("site_notification_log").select("kind, ref, status, attempts, error, created_at").order("created_at", { ascending: false }).limit(30),
    db.from("site_admin_logs").select("action, entity, entity_id, created_at").order("created_at", { ascending: false }).limit(30),
  ]);
  return (
    <>
      <PageTitle title="Settings" sub="Integration status (values are never shown), admins, notification and activity logs." />
      <div className="card p-5">
        <p className="mb-3 font-medium text-white">Integrations</p>
        <ul className="divide-y divide-white/[0.05]">
          {checks.map((c) => (
            <li key={c.name} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm">
              <div><p className="text-white">{c.name}</p><p className="font-mono text-[11px] text-silver-600">{c.env}</p></div>
              <Badge tone={c.ok ? "good" : "warn"}>{c.ok ? "Configured" : "Needs setup"}</Badge>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <div className="card p-5">
          <p className="mb-3 font-medium text-white">Users</p>
          <ul className="space-y-2 text-sm">{(profiles.data ?? []).map((p) => <li key={p.email} className="flex justify-between"><span className="text-silver">{p.email}</span><Badge tone={p.role === "admin" ? "info" : "default"}>{p.role}</Badge></li>)}</ul>
          <p className="mt-3 text-xs text-silver-600">To add an admin: add their email to <code>site_admin_allowlist</code>, then create the user in Supabase → Authentication → Users. They become admin on first sign-in.</p>
        </div>
        <div className="card p-5">
          <p className="mb-3 font-medium text-white">n8n notifications</p>
          <ul className="max-h-72 space-y-2 overflow-y-auto text-xs">
            {(notes.data ?? []).map((n, i) => (
              <li key={i} className="flex items-start justify-between gap-3 rounded-lg bg-white/[0.02] p-2">
                <div><p className="text-silver">{n.kind} · <span className="font-mono">{n.ref}</span></p>{n.error && <p className="text-rose-300">{n.error}</p>}<p className="text-silver-600">{fmtDate(n.created_at)} · attempts {n.attempts}</p></div>
                <Badge tone={n.status === "sent" ? "good" : n.status === "failed" ? "bad" : "default"}>{n.status}</Badge>
              </li>
            ))}
            {!notes.data?.length && <li className="text-silver-600">No notifications yet.</li>}
          </ul>
        </div>
      </div>
      <div className="mt-4 card p-5">
        <p className="mb-3 font-medium text-white">Admin activity</p>
        <ul className="space-y-1.5 text-xs text-silver">{(logs.data ?? []).map((l, i) => <li key={i}><span className="text-silver-600">{fmtDate(l.created_at)}</span> · {l.action} · {l.entity} <span className="font-mono text-silver-600">{l.entity_id}</span></li>)}{!logs.data?.length && <li className="text-silver-600">No activity yet.</li>}</ul>
      </div>
    </>
  );
}
