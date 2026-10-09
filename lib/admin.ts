import "server-only";
import { redirect } from "next/navigation";
import { supabaseUser, supabaseService } from "@/lib/supabase/server";

/**
 * Server-side authorization for every admin page, action and export.
 * Returns a client bound to the signed-in user, so Row Level Security also applies to every query.
 */
export async function requireAdmin() {
  const db = await supabaseUser();
  if (!db) redirect("/admin/login?e=config");
  const { data: { user } } = await db.auth.getUser();
  if (!user) redirect("/admin/login");

  let { data: profile } = await db.from("site_profiles").select("id, email, role, full_name").eq("id", user.id).maybeSingle();
  if (!profile) {
    // First login: provision a profile. Only allow-listed emails become admins.
    const svc = supabaseService();
    if (svc && user.email) {
      const { data: allowed } = await svc.from("site_admin_allowlist").select("email").eq("email", user.email.toLowerCase()).maybeSingle();
      await svc.from("site_profiles").upsert({ id: user.id, email: user.email.toLowerCase(), role: allowed ? "admin" : "viewer" }, { onConflict: "id", ignoreDuplicates: true });
      ({ data: profile } = await db.from("site_profiles").select("id, email, role, full_name").eq("id", user.id).maybeSingle());
    }
  }
  if (profile?.role !== "admin") redirect("/admin/login?e=forbidden");
  return { db, user, profile };
}

export async function logAdmin(action: string, entity: string, entityId: string, details: Record<string, unknown> = {}) {
  const { db, user } = await requireAdmin();
  await db.from("site_admin_logs").insert({ actor: user.id, action, entity, entity_id: entityId, details });
}
