import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { LEAD_STATUSES } from "@/lib/validation";

export const dynamic = "force-dynamic";
const csvCell = (v: unknown) => {
  let s = v === null || v === undefined ? "" : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; // prevent spreadsheet formula injection
  return `"${s.replace(/"/g, '""')}"`;
};

/** Admin-only CSV export (authorization checked server-side + RLS). */
export async function GET(req: Request) {
  const { db, user } = await requireAdmin();
  const url = new URL(req.url);
  const status = url.searchParams.get("status") || "";
  const source = url.searchParams.get("source") || "";
  let q = db.from("site_leads").select("ref, created_at, name, email, phone, company, service, budget, source, status, notes, message").order("created_at", { ascending: false }).limit(5000);
  if (LEAD_STATUSES.includes(status as never)) q = q.eq("status", status);
  if (["form", "ai", "booking", "order"].includes(source)) q = q.eq("source", source);
  const { data, error } = await q;
  if (error) return NextResponse.json({ error: "Export failed" }, { status: 500 });
  await db.from("site_admin_logs").insert({ actor: user.id, action: "leads.export", entity: "site_leads", entity_id: "csv", details: { rows: data.length, status, source } });
  const cols = ["ref", "created_at", "name", "email", "phone", "company", "service", "budget", "source", "status", "notes", "message"] as const;
  const csv = [cols.join(","), ...data.map((r) => cols.map((c) => csvCell(r[c])).join(","))].join("\n");
  return new NextResponse(csv, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"`, "Cache-Control": "no-store" } });
}
