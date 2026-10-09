import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { PageTitle, Badge, Empty, statusTone, fmtDate } from "@/components/admin/ui";
import { LEAD_STATUSES } from "@/lib/validation";
import { LeadEditor } from "./LeadEditor";

export const metadata = { title: "Leads" };
const PER = 25;

export default async function Leads({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const { db } = await requireAdmin();
  const q = (sp.q || "").trim().slice(0, 80);
  const status = LEAD_STATUSES.includes(sp.status as never) ? sp.status! : "";
  const source = ["form", "ai", "booking", "order"].includes(sp.source || "") ? sp.source! : "";
  const page = Math.max(1, Number(sp.page) || 1);
  let query = db.from("site_leads").select("id, ref, name, email, phone, company, service, budget, message, source, status, notes, created_at, assigned_to", { count: "exact" }).order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);
  if (source) query = query.eq("source", source);
  if (q) { const safe = q.replace(/[%,()]/g, " "); query = query.or(`name.ilike.%${safe}%,email.ilike.%${safe}%,company.ilike.%${safe}%,ref.ilike.%${safe}%,service.ilike.%${safe}%`); }
  const { data, count, error } = await query.range((page - 1) * PER, page * PER - 1);
  const pages = Math.max(1, Math.ceil((count || 0) / PER));
  const qs = (p: Record<string, string | number>) => "?" + new URLSearchParams({ q, status, source, page: String(page), ...Object.fromEntries(Object.entries(p).map(([k, v]) => [k, String(v)])) }).toString();

  return (
    <>
      <PageTitle title="Leads" sub={`${count ?? 0} total · from the contact form and the AI assistant`}>
        <a href={`/admin/export?type=leads&status=${status}&source=${source}`} className="btn-ghost !py-2 !text-xs">Export CSV</a>
      </PageTitle>
      <form className="mb-4 flex flex-wrap gap-2" role="search">
        <input name="q" defaultValue={q} placeholder="Search name, email, company, reference…" className="field !w-72 !py-2" aria-label="Search leads" />
        <select name="status" defaultValue={status} className="field !w-40 !py-2" aria-label="Status"><option value="">All statuses</option>{LEAD_STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
        <select name="source" defaultValue={source} className="field !w-36 !py-2" aria-label="Source"><option value="">All sources</option><option value="form">Form</option><option value="ai">AI assistant</option><option value="booking">Booking</option><option value="order">Order</option></select>
        <button className="btn-primary !py-2">Filter</button>
        {(q || status || source) && <Link href="/admin/leads" className="btn-ghost !py-2">Clear</Link>}
      </form>
      {error && <p className="mb-4 text-sm text-rose-300">Could not load leads: {error.message}</p>}
      {!data?.length ? <Empty>No leads match these filters.</Empty> : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="border-b border-white/[0.06] text-[11px] uppercase tracking-wider text-silver-400">
              <tr>{["Lead", "Contact", "Interested in", "Source", "Created", "Status", "Update"].map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05] align-top">
              {data.map((l) => (
                <tr key={l.id}>
                  <td className="px-4 py-3"><p className="font-medium text-white">{l.name}</p><p className="font-mono text-[11px] text-silver-600">{l.ref}</p>{l.company && <p className="text-xs text-silver-400">{l.company}</p>}</td>
                  <td className="px-4 py-3 text-xs"><a className="text-cyan hover:underline" href={`mailto:${l.email}`}>{l.email}</a>{l.phone && <p className="mt-0.5"><a className="text-silver hover:text-white" href={`https://wa.me/${l.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">{l.phone}</a></p>}</td>
                  <td className="max-w-[260px] px-4 py-3 text-xs text-silver"><p className="text-white">{l.service || "—"}</p>{l.budget && <p className="text-silver-400">Budget: {l.budget}</p>}{l.message && <details className="mt-1"><summary className="cursor-pointer text-silver-400">Message</summary><p className="mt-1 whitespace-pre-wrap">{l.message}</p></details>}</td>
                  <td className="px-4 py-3"><Badge tone={l.source === "ai" ? "info" : "default"}>{l.source === "ai" ? "AI assistant" : l.source}</Badge></td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-silver-400">{fmtDate(l.created_at)}</td>
                  <td className="px-4 py-3"><Badge tone={statusTone(l.status)}>{l.status}</Badge></td>
                  <td className="w-60 px-4 py-3"><LeadEditor id={l.id} status={l.status} notes={l.notes} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {pages > 1 && (
        <nav className="mt-4 flex items-center justify-between text-sm" aria-label="Pagination">
          <span className="text-silver-400">Page {page} of {pages}</span>
          <div className="flex gap-2">
            {page > 1 && <Link className="btn-ghost !py-1.5" href={qs({ page: page - 1 })}>Previous</Link>}
            {page < pages && <Link className="btn-ghost !py-1.5" href={qs({ page: page + 1 })}>Next</Link>}
          </div>
        </nav>
      )}
    </>
  );
}
