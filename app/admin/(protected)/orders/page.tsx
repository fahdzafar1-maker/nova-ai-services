import { requireAdmin } from "@/lib/admin";
import { PageTitle, Badge, Empty, statusTone, fmtDate } from "@/components/admin/ui";
import { StatusForm } from "@/components/admin/StatusForm";

export const metadata = { title: "Order requests" };
type Lead = { name: string; email: string; phone: string | null } | null;

export default async function Orders() {
  const { db } = await requireAdmin();
  const { data, error } = await db.from("site_order_requests").select("id, ref, created_at, status, items, notes, lead:site_leads(name, email, phone)").order("created_at", { ascending: false }).limit(200);
  return (
    <>
      <PageTitle title="Order requests" sub="Orders are requests with status 'pending' until you accept them. No payment is taken by the website." />
      {error && <p className="mb-4 text-sm text-rose-300">{error.message}</p>}
      {!data?.length ? <Empty>No order requests yet.</Empty> : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="border-b border-white/[0.06] text-[11px] uppercase tracking-wider text-silver-400"><tr>{["Reference", "Customer", "Items", "Notes", "Received", "Status", ""].map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-white/[0.05] align-top">
              {data.map((o) => {
                const lead = o.lead as unknown as Lead;
                const items = Array.isArray(o.items) ? (o.items as { description?: string }[]).map((i) => i.description).filter(Boolean).join(", ") : "";
                return (
                  <tr key={o.id}>
                    <td className="px-4 py-3 font-mono text-xs text-silver">{o.ref}</td>
                    <td className="px-4 py-3 text-xs"><p className="text-sm text-white">{lead?.name}</p><a href={`mailto:${lead?.email}`} className="text-cyan hover:underline">{lead?.email}</a></td>
                    <td className="px-4 py-3 text-xs text-silver">{items || "—"}</td>
                    <td className="max-w-xs px-4 py-3 text-xs text-silver">{o.notes || "—"}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-silver-400">{fmtDate(o.created_at)}</td>
                    <td className="px-4 py-3"><Badge tone={statusTone(o.status)}>{o.status.replace("_", " ")}</Badge></td>
                    <td className="px-4 py-3"><StatusForm table="site_order_requests" id={o.id} status={o.status} options={["pending", "accepted", "in_progress", "completed", "cancelled"]} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
