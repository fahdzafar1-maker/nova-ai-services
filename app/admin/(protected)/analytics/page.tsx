import { requireAdmin } from "@/lib/admin";
import { PageTitle, RangeFilter, Stat, parseDays, rangeFor } from "@/components/admin/ui";
import { Bars, HBars, DataTable } from "@/components/charts";

export const metadata = { title: "Analytics" };

export default async function Analytics({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const days = parseDays(sp.days);
  const { db } = await requireAdmin();
  const { from, to } = rangeFor(days);
  const [stats, events] = await Promise.all([
    db.rpc("site_dashboard_stats", { p_from: from, p_to: to }),
    db.from("site_events").select("event, path").gte("created_at", from).lte("created_at", to).order("created_at", { ascending: false }).limit(20000),
  ]);
  const s = (stats.data ?? {}) as Record<string, number> & { daily?: { day: string; views: number }[] };
  const n = (k: string) => Number(s[k] ?? 0);
  const ev = events.data ?? [];
  const byEvent = Object.entries(ev.reduce<Record<string, number>>((a, e) => ((a[e.event] = (a[e.event] || 0) + 1), a), {})).sort((a, b) => b[1] - a[1]);
  const byPage = Object.entries(ev.filter((e) => e.event === "page_view").reduce<Record<string, number>>((a, e) => ((a[e.path || "/"] = (a[e.path || "/"] || 0) + 1), a), {})).sort((a, b) => b[1] - a[1]).slice(0, 12);
  const funnel = [
    { label: "Unique visitors", value: n("unique_visitors") }, { label: "Viewed a demo", value: n("demo_views") },
    { label: "Started a form", value: n("form_starts") }, { label: "Submitted", value: n("form_submissions") },
    { label: "Qualified lead", value: n("qualified_leads") }, { label: "Won", value: n("won_leads") },
  ];
  return (
    <>
      <PageTitle title="Analytics" sub="First-party, consent-based analytics. Only visitors who allowed analytics are counted."><RangeFilter base="/admin/analytics" current={days} /></PageTitle>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Page views" value={n("page_views")} hint="every page load" />
        <Stat label="Sessions" value={n("sessions")} hint="30-minute rolling visits" />
        <Stat label="Unique visitors" value={n("unique_visitors")} hint="anonymous visitor IDs" />
        <Stat label="AI assistant opens" value={n("ai_opens")} />
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <div className="card p-5"><p className="mb-3 font-medium text-white">Conversion funnel</p><HBars rows={funnel} /></div>
        <div className="card p-5"><p className="mb-3 font-medium text-white">Top pages</p>{byPage.length ? <HBars rows={byPage.map(([label, value]) => ({ label, value }))} /> : <p className="text-sm text-silver-600">No page views recorded yet.</p>}</div>
      </div>
      <div className="mt-4 card p-5">
        <p className="font-medium text-white">Page views per day</p>
        <div className="mt-3"><Bars data={(s.daily ?? []).map((d) => ({ x: new Date(d.day + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }), y: d.views }))} label="Page views" width={1200} height={260} /></div>
      </div>
      <div className="mt-4 card p-5">
        <p className="mb-3 font-medium text-white">Events</p>
        {byEvent.length ? <HBars rows={byEvent.map(([label, value]) => ({ label, value }))} /> : <p className="text-sm text-silver-600">No events yet.</p>}
        <DataTable cols={[{ key: "event", label: "Event" }, { key: "count", label: "Count" }]} rows={byEvent.map(([event, count]) => ({ event, count }))} />
      </div>
    </>
  );
}
