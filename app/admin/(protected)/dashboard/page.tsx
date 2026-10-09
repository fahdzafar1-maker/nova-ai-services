import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { PageTitle, Stat, RangeFilter, Badge, statusTone, parseDays, rangeFor, fmtDate } from "@/components/admin/ui";
import { LineArea, HBars, DataTable } from "@/components/charts";
import { DEFAULT_DEMOS, DEFAULT_SERVICES } from "@/lib/catalog";

export const metadata = { title: "Dashboard" };
type Stats = Record<string, number> & { daily: { day: string; views: number; visitors: number; leads: number }[]; top_services: { slug: string; views: number }[]; top_demos: { slug: string; views: number }[]; lead_sources: { source: string; n: number }[] };

export default async function Dashboard({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const days = parseDays(sp.days);
  const { db } = await requireAdmin();
  const { from, to } = rangeFor(days);
  const [statsRes, recent] = await Promise.all([
    db.rpc("site_dashboard_stats", { p_from: from, p_to: to }),
    db.from("site_leads").select("id, ref, name, service, source, status, created_at").order("created_at", { ascending: false }).limit(8),
  ]);
  const s = (statsRes.data ?? {}) as Stats;
  const n = (k: string) => Number(s[k] ?? 0);
  const conv = n("unique_visitors") ? ((n("leads") / n("unique_visitors")) * 100).toFixed(1) + "%" : "—";
  const label = (d: string) => new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const svcName = (slug: string) => DEFAULT_SERVICES.find((x) => x.slug === slug)?.title ?? slug;
  const demoName = (slug: string) => DEFAULT_DEMOS.find((x) => x.slug === slug)?.title ?? slug;

  return (
    <>
      <PageTitle title="Dashboard" sub="Live numbers from your website. Page views, sessions and unique visitors are counted separately.">
        <RangeFilter base="/admin/dashboard" current={days} />
      </PageTitle>
      {statsRes.error && <p className="mb-4 rounded-xl border border-rose-400/30 bg-rose-400/10 p-3 text-sm text-rose-200">Could not load statistics: {statsRes.error.message}</p>}
      {n("notification_failures") > 0 && <Link href="/admin/settings" className="mb-4 block rounded-xl border border-amber-300/30 bg-amber-300/10 p-3 text-sm text-amber-100">⚠ {n("notification_failures")} n8n notification(s) failed in this period. Submissions are saved — open Settings to review.</Link>}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">
        <Stat label="Unique visitors" value={n("unique_visitors")} hint={`${n("visitors_today")} today`} />
        <Stat label="Page views" value={n("page_views")} hint={`${n("sessions")} sessions`} />
        <Stat label="Services page views" value={n("services_views")} hint={`${n("service_detail_views")} service detail opens`} />
        <Stat label="Demo views" value={n("demo_views")} hint={`${n("demo_interactions")} interactions`} />
        <Stat label="Contact submissions" value={n("form_submissions")} hint={`${n("form_starts")} form starts`} />
        <Stat label="AI conversations" value={n("ai_conversations")} hint={`${n("ai_opens")} assistant opens`} />
        <Stat label="Leads generated" value={n("leads")} hint={`${n("qualified_leads")} qualified · ${n("won_leads")} won`} />
        <Stat label="Booking requests" value={n("booking_requests")} />
        <Stat label="Order requests" value={n("order_requests")} />
        <Stat label="Lead conversion" value={conv} hint="leads ÷ unique visitors" />
        <Stat label="Demo → lead" value={n("demo_to_lead")} hint="submissions after a demo" />
        <Stat label="Failed notifications" value={n("notification_failures")} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <div className="card p-5">
          <p className="font-medium text-white">Unique visitors per day</p>
          <div className="mt-3"><LineArea data={(s.daily ?? []).map((d) => ({ x: label(d.day), y: d.visitors }))} label="Visitors" /></div>
          <DataTable cols={[{ key: "day", label: "Day" }, { key: "visitors", label: "Visitors" }, { key: "views", label: "Page views" }, { key: "leads", label: "Leads" }]} rows={s.daily ?? []} />
        </div>
        <div className="card p-5">
          <p className="font-medium text-white">Leads per day</p>
          <div className="mt-3"><LineArea data={(s.daily ?? []).map((d) => ({ x: label(d.day), y: d.leads }))} label="Leads" height={180} /></div>
          <p className="mt-4 text-sm font-medium text-white">Lead sources</p>
          <div className="mt-2">{(s.lead_sources ?? []).length ? <HBars rows={s.lead_sources.map((r) => ({ label: r.source === "ai" ? "AI assistant" : r.source, value: r.n }))} /> : <p className="text-sm text-silver-600">No leads in this period yet.</p>}</div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <div className="card p-5">
          <p className="mb-3 font-medium text-white">Top services (detail opens)</p>
          {(s.top_services ?? []).length ? <HBars rows={s.top_services.map((r) => ({ label: svcName(r.slug), value: r.views }))} /> : <p className="text-sm text-silver-600">No data yet.</p>}
        </div>
        <div className="card p-5">
          <p className="mb-3 font-medium text-white">Top demos</p>
          {(s.top_demos ?? []).length ? <HBars rows={s.top_demos.map((r) => ({ label: demoName(r.slug), value: r.views }))} /> : <p className="text-sm text-silver-600">No data yet.</p>}
        </div>
        <div className="card p-5">
          <div className="mb-3 flex items-center justify-between"><p className="font-medium text-white">Recent leads</p><Link href="/admin/leads" className="text-xs text-cyan hover:underline">All leads</Link></div>
          <ul className="divide-y divide-white/[0.05]">
            {(recent.data ?? []).map((l) => (
              <li key={l.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <div className="min-w-0"><p className="truncate text-white">{l.name}</p><p className="truncate text-xs text-silver-600">{l.service || "—"} · {l.source} · {fmtDate(l.created_at)}</p></div>
                <Badge tone={statusTone(l.status)}>{l.status}</Badge>
              </li>
            ))}
            {!recent.data?.length && <li className="py-6 text-center text-sm text-silver-600">No leads yet. They appear here as soon as the form or AI assistant saves one.</li>}
          </ul>
        </div>
      </div>
    </>
  );
}
