import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { PageTitle, Badge, Empty, statusTone, fmtDate } from "@/components/admin/ui";
import { StatusForm } from "@/components/admin/StatusForm";

export const metadata = { title: "Inquiries & bookings" };
type Lead = { name: string; email: string; phone: string | null; company: string | null } | null;

export default async function Inquiries({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const tab = ["inquiry", "consultation", "booking"].includes(sp.tab || "") ? sp.tab! : "inquiry";
  const { db } = await requireAdmin();
  const tabs = [["inquiry", "Inquiries"], ["consultation", "Consultation requests"], ["booking", "Booking requests"]];
  let rows: { id: string; ref: string; created_at: string; status: string; service: string | null; detail: string; lead: Lead }[] = [];
  let error: string | undefined;
  if (tab === "booking") {
    const r = await db.from("site_booking_requests").select("id, ref, created_at, status, service, preferred_date, preferred_time, lead:site_leads(name, email, phone, company)").order("created_at", { ascending: false }).limit(200);
    error = r.error?.message;
    rows = (r.data ?? []).map((b) => ({ id: b.id, ref: b.ref, created_at: b.created_at, status: b.status, service: b.service, detail: `Preferred: ${b.preferred_date ?? "any day"} ${b.preferred_time ?? ""}`, lead: b.lead as unknown as Lead }));
  } else {
    const r = await db.from("site_inquiries").select("id, ref, created_at, status, service, message, lead:site_leads(name, email, phone, company)").eq("kind", tab).order("created_at", { ascending: false }).limit(200);
    error = r.error?.message;
    rows = (r.data ?? []).map((i) => ({ id: i.id, ref: i.ref, created_at: i.created_at, status: i.status, service: i.service, detail: i.message ?? "", lead: i.lead as unknown as Lead }));
  }
  const table = tab === "booking" ? "site_booking_requests" : "site_inquiries";
  const options = tab === "booking" ? ["requested", "confirmed", "declined", "cancelled"] : ["open", "answered", "closed"];
  return (
    <>
      <PageTitle title="Inquiries & bookings" sub="Booking requests stay 'requested' until you confirm the time with the customer." />
      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map(([k, l]) => <Link key={k} href={`/admin/inquiries?tab=${k}`} aria-current={tab === k ? "page" : undefined} className={`rounded-full px-4 py-2 text-sm ${tab === k ? "bg-white text-night-950" : "border border-white/10 text-silver hover:text-white"}`}>{l}</Link>)}
      </div>
      {error && <p className="mb-4 text-sm text-rose-300">{error}</p>}
      {!rows.length ? <Empty>Nothing here yet.</Empty> : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-white/[0.06] text-[11px] uppercase tracking-wider text-silver-400"><tr>{["Reference", "Customer", "Service", "Details", "Received", "Status", ""].map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-white/[0.05] align-top">
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-3 font-mono text-xs text-silver">{r.ref}</td>
                  <td className="px-4 py-3 text-xs"><p className="text-sm text-white">{r.lead?.name}</p><a href={`mailto:${r.lead?.email}`} className="text-cyan hover:underline">{r.lead?.email}</a>{r.lead?.phone && <p className="text-silver-400">{r.lead.phone}</p>}</td>
                  <td className="px-4 py-3 text-xs text-silver">{r.service || "—"}</td>
                  <td className="max-w-xs px-4 py-3 text-xs text-silver"><p className="line-clamp-3 whitespace-pre-wrap">{r.detail}</p></td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-silver-400">{fmtDate(r.created_at)}</td>
                  <td className="px-4 py-3"><Badge tone={statusTone(r.status)}>{r.status}</Badge></td>
                  <td className="px-4 py-3"><StatusForm table={table} id={r.id} status={r.status} options={options} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
