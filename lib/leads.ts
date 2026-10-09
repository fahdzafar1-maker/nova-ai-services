import "server-only";
import { supabaseService } from "@/lib/supabase/server";
import { makeRef, hash } from "@/lib/security";
import { after } from "next/server";
import { notifyN8n } from "@/lib/n8n";

type LeadCore = {
  name: string; email: string; phone?: string | null; company?: string | null;
  service?: string | null; budget?: string | null; message?: string | null;
  source: "form" | "ai" | "booking" | "order"; consent: boolean; ip: string;
};

export type SaveResult =
  | { ok: true; ref: string; leadId: string; duplicate?: boolean }
  | { ok: false; reason: "not_configured" | "db_error" };

/**
 * Saves a lead + its request row. Only returns ok:true after the database confirmed the insert.
 * Duplicate protection: the same email + service + message within the same hour reuses the existing reference.
 */
export async function saveLead(
  core: LeadCore,
  request:
    | { type: "inquiry"; kind: "inquiry" | "consultation" }
    | { type: "booking"; preferred_date?: string | null; preferred_time?: string | null; timezone?: string | null }
    | { type: "order"; items: unknown[]; notes?: string | null }
    | { type: "none" },
): Promise<SaveResult & { requestRef?: string }> {
  const db = supabaseService();
  if (!db) return { ok: false, reason: "not_configured" };

  const hour = new Date().toISOString().slice(0, 13);
  const dedupe = hash(`${core.email.toLowerCase()}|${core.service ?? ""}|${(core.message ?? "").slice(0, 200)}|${request.type}|${hour}`);

  const existing = await db.from("site_leads").select("id, ref").eq("dedupe_key", dedupe).maybeSingle();
  if (existing.data) return { ok: true, ref: existing.data.ref, leadId: existing.data.id, duplicate: true };

  const ref = makeRef("LEAD");
  const ins = await db.from("site_leads").insert({
    ref, name: core.name, email: core.email, phone: core.phone || null, company: core.company || null,
    service: core.service || null, budget: core.budget || null, message: core.message || null,
    source: core.source, consent: core.consent, ip_hash: hash(core.ip), dedupe_key: dedupe,
  }).select("id, ref").single();
  if (ins.error || !ins.data) { console.error("[leads] insert failed", ins.error?.message); return { ok: false, reason: "db_error" }; }
  const leadId = ins.data.id as string;

  let requestRef: string | undefined;
  if (request.type === "inquiry") {
    requestRef = makeRef("INQ");
    const r = await db.from("site_inquiries").insert({ lead_id: leadId, ref: requestRef, kind: request.kind, service: core.service, message: core.message });
    if (r.error) { await db.from("site_leads").delete().eq("id", leadId); return { ok: false, reason: "db_error" }; }
  } else if (request.type === "booking") {
    requestRef = makeRef("BKG");
    const r = await db.from("site_booking_requests").insert({ lead_id: leadId, ref: requestRef, service: core.service, preferred_date: request.preferred_date || null, preferred_time: request.preferred_time || null, timezone: request.timezone || null });
    if (r.error) { await db.from("site_leads").delete().eq("id", leadId); return { ok: false, reason: "db_error" }; }
  } else if (request.type === "order") {
    requestRef = makeRef("ORD");
    const r = await db.from("site_order_requests").insert({ lead_id: leadId, ref: requestRef, items: request.items, notes: request.notes || null });
    if (r.error) { await db.from("site_leads").delete().eq("id", leadId); return { ok: false, reason: "db_error" }; }
  }

  await db.from("site_lead_activity").insert({ lead_id: leadId, action: "created", details: { source: core.source, request: request.type, requestRef } });

  // Runs after the response is sent; every outcome is logged. The lead is already safe in the database.
  after(() => notifyN8n({
    event: request.type === "none" ? "lead.created" : `${request.type}.created`,
    ref: requestRef || ref,
    data: { leadRef: ref, requestRef, name: core.name, email: core.email, phone: core.phone, company: core.company, service: core.service, budget: core.budget, message: core.message, source: core.source },
  }));

  return { ok: true, ref, leadId, requestRef };
}
