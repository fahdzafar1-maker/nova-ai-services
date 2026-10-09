"use server";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { LEAD_STATUSES } from "@/lib/validation";
import { CATEGORIES } from "@/lib/catalog";
import { supabaseUser } from "@/lib/supabase/server";

export type ActionState = { ok?: boolean; error?: string; message?: string };

export async function signOut() {
  const db = await supabaseUser();
  await db?.auth.signOut();
  redirect("/admin/login");
}

// ---------- Leads ----------
const leadUpdate = z.object({ id: z.string().uuid(), status: z.enum(LEAD_STATUSES), notes: z.string().max(4000).optional() });
export async function updateLead(_: ActionState, form: FormData): Promise<ActionState> {
  const { db, user } = await requireAdmin();
  const p = leadUpdate.safeParse({ id: form.get("id"), status: form.get("status"), notes: String(form.get("notes") ?? "") });
  if (!p.success) return { error: "Invalid lead update." };
  const before = await db.from("site_leads").select("status, notes").eq("id", p.data.id).single();
  const { error } = await db.from("site_leads").update({ status: p.data.status, notes: p.data.notes || null }).eq("id", p.data.id);
  if (error) return { error: "Could not save. Please try again." };
  const changes: Record<string, unknown> = {};
  if (before.data?.status !== p.data.status) changes.status = { from: before.data?.status, to: p.data.status };
  if ((before.data?.notes || "") !== (p.data.notes || "")) changes.notes = "updated";
  if (Object.keys(changes).length) {
    await db.from("site_lead_activity").insert({ lead_id: p.data.id, actor: user.id, action: "updated", details: changes });
    await db.from("site_admin_logs").insert({ actor: user.id, action: "lead.update", entity: "site_leads", entity_id: p.data.id, details: changes });
  }
  revalidatePath("/admin/leads");
  revalidatePath("/admin/dashboard");
  return { ok: true, message: "Saved" };
}

const reqUpdate = z.object({ table: z.enum(["site_inquiries", "site_booking_requests", "site_order_requests"]), id: z.string().uuid(), status: z.string().max(20) });
const ALLOWED: Record<string, string[]> = {
  site_inquiries: ["open", "answered", "closed"],
  site_booking_requests: ["requested", "confirmed", "declined", "cancelled"],
  site_order_requests: ["pending", "accepted", "in_progress", "completed", "cancelled"],
};
export async function updateRequestStatus(form: FormData) {
  const { db, user } = await requireAdmin();
  const p = reqUpdate.safeParse({ table: form.get("table"), id: form.get("id"), status: form.get("status") });
  if (!p.success || !ALLOWED[p.data.table].includes(p.data.status)) return;
  await db.from(p.data.table).update({ status: p.data.status }).eq("id", p.data.id);
  await db.from("site_admin_logs").insert({ actor: user.id, action: "request.status", entity: p.data.table, entity_id: p.data.id, details: { status: p.data.status } });
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin/orders");
}

// ---------- Catalog (services & demos) ----------
const slug = z.string().trim().regex(/^[a-z0-9-]{2,80}$/, "Slug: lowercase letters, numbers and dashes");
const serviceSchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  slug, title: z.string().trim().min(2).max(120), summary: z.string().trim().min(10).max(600),
  category: z.enum(CATEGORIES.map((c) => c.id) as [string, ...string[]]),
  benefits: z.string().max(2000), demo_slug: z.string().trim().max(80).optional(), icon: z.string().trim().max(30),
  sort_order: z.coerce.number().int().min(0).max(10000), published: z.boolean(),
});
export async function saveService(_: ActionState, form: FormData): Promise<ActionState> {
  const { db, user } = await requireAdmin();
  const p = serviceSchema.safeParse({ ...Object.fromEntries(form), published: form.get("published") === "on" });
  if (!p.success) return { error: p.error.issues[0]?.message || "Check the fields." };
  const { id, benefits, demo_slug, ...rest } = p.data;
  const row = { ...rest, demo_slug: demo_slug || null, benefits: benefits.split("\n").map((b) => b.trim()).filter(Boolean).slice(0, 8) };
  const res = id ? await db.from("site_services").update(row).eq("id", id) : await db.from("site_services").insert(row);
  if (res.error) return { error: res.error.code === "23505" ? "That slug is already used." : "Could not save the service." };
  await db.from("site_admin_logs").insert({ actor: user.id, action: id ? "service.update" : "service.create", entity: "site_services", entity_id: id || row.slug, details: { slug: row.slug } });
  revalidateTag("catalog"); revalidatePath("/admin/services"); revalidatePath("/services"); revalidatePath("/");
  return { ok: true, message: "Service saved" };
}

const demoSchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  slug, title: z.string().trim().min(2).max(120), category: z.string().trim().min(2).max(60), summary: z.string().trim().min(10).max(600),
  use_case: z.string().trim().max(1000), tags: z.string().max(300), sort_order: z.coerce.number().int().min(0).max(10000),
  published: z.boolean(), featured: z.boolean(),
});
export async function saveDemo(_: ActionState, form: FormData): Promise<ActionState> {
  const { db, user } = await requireAdmin();
  const p = demoSchema.safeParse({ ...Object.fromEntries(form), published: form.get("published") === "on", featured: form.get("featured") === "on" });
  if (!p.success) return { error: p.error.issues[0]?.message || "Check the fields." };
  const { id, tags, ...rest } = p.data;
  const row = { ...rest, tags: tags.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 8) };
  const res = id ? await db.from("site_demos").update(row).eq("id", id) : await db.from("site_demos").insert(row);
  if (res.error) return { error: res.error.code === "23505" ? "That slug is already used." : "Could not save the demo." };
  await db.from("site_admin_logs").insert({ actor: user.id, action: id ? "demo.update" : "demo.create", entity: "site_demos", entity_id: id || row.slug, details: { slug: row.slug } });
  revalidateTag("catalog"); revalidatePath("/admin/demos"); revalidatePath("/demos"); revalidatePath("/");
  return { ok: true, message: "Demo saved" };
}

export async function moveItem(form: FormData) {
  const { db } = await requireAdmin();
  const table = form.get("table") === "site_demos" ? "site_demos" : "site_services";
  const id = String(form.get("id")); const dir = form.get("dir") === "up" ? -1 : 1;
  const { data } = await db.from(table).select("id, sort_order").order("sort_order");
  if (!data) return;
  const i = data.findIndex((r) => r.id === id), j = i + dir;
  if (i < 0 || j < 0 || j >= data.length) return;
  await db.from(table).update({ sort_order: data[j].sort_order }).eq("id", data[i].id);
  await db.from(table).update({ sort_order: data[i].sort_order === data[j].sort_order ? data[i].sort_order + dir : data[i].sort_order }).eq("id", data[j].id);
  revalidateTag("catalog");
  revalidatePath(table === "site_demos" ? "/admin/demos" : "/admin/services");
  revalidatePath(table === "site_demos" ? "/demos" : "/services");
}

export async function togglePublished(form: FormData) {
  const { db, user } = await requireAdmin();
  const table = form.get("table") === "site_demos" ? "site_demos" : "site_services";
  const id = String(form.get("id")); const published = form.get("published") === "true";
  await db.from(table).update({ published }).eq("id", id);
  await db.from("site_admin_logs").insert({ actor: user.id, action: published ? "publish" : "unpublish", entity: table, entity_id: id });
  revalidateTag("catalog");
  revalidatePath(table === "site_demos" ? "/admin/demos" : "/admin/services");
  revalidatePath(table === "site_demos" ? "/demos" : "/services"); revalidatePath("/");
}
