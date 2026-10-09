"use client";
import { useMemo, useState } from "react";
import { LineArea, Bars, HBars, DataTable } from "@/components/charts";
import { track } from "@/lib/track";

// Seeded synthetic data so every visitor sees the same believable sample.
function rng(seed: number) { return () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }
function series(days: number) {
  const r = rng(days * 97 + 13);
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (days - 1 - i));
    const trend = 18 + i * (40 / days);
    const wk = d.getDay() === 0 ? 0.55 : d.getDay() === 6 ? 0.8 : 1;
    const leads = Math.round((trend + r() * 10) * wk);
    return { x: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }), leads, bookings: Math.round(leads * (0.24 + r() * 0.08)), revenue: Math.round(leads * (0.24 + r() * 0.08)) * 85 };
  });
}

export function AnalyticsDemo() {
  const [range, setRange] = useState<7 | 30 | 90>(30);
  const data = useMemo(() => series(range), [range]);
  const tot = data.reduce((a, d) => ({ leads: a.leads + d.leads, bookings: a.bookings + d.bookings, revenue: a.revenue + d.revenue }), { leads: 0, bookings: 0, revenue: 0 });
  const hours = useMemo(() => { const r = rng(5); return Array.from({ length: 24 }, (_, h) => ({ x: `${h}:00`, y: Math.round((h >= 18 || h < 1 ? 26 : h >= 9 && h <= 13 ? 18 : h < 7 ? 3 : 10) + r() * 6) })); }, []);
  const money = (n: number) => `$${n.toLocaleString("en-US")}`;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><p className="font-display text-lg font-semibold text-white">Owner dashboard · Glow Studio (sample)</p><p className="text-sm text-silver-400">Every number below is synthetic demo data.</p></div>
        <div className="flex rounded-xl border border-white/10 bg-white/[0.03] p-1" role="group" aria-label="Date range">
          {([7, 30, 90] as const).map((r) => <button key={r} onClick={() => { setRange(r); track("demo_interact", { slug: "analytics-dashboard" }); }} aria-pressed={range === r} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${range === r ? "bg-white text-night-950" : "text-silver"}`}>Last {r} days</button>)}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[["Leads", tot.leads.toLocaleString()], ["Bookings", tot.bookings.toLocaleString()], ["Booking rate", `${Math.round((tot.bookings / tot.leads) * 100)}%`], ["Est. revenue", money(tot.revenue)]].map(([k, v]) => (
          <div key={k} className="card p-4"><p className="text-xs uppercase tracking-wider text-silver-400">{k}</p><p className="mt-1 font-display text-2xl font-semibold text-white sm:text-3xl">{v}</p></div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="card p-5">
          <p className="font-medium text-white">New leads per day</p>
          <p className="text-xs text-silver-400">All channels combined</p>
          <div className="mt-3"><LineArea data={data.map((d) => ({ x: d.x, y: d.leads }))} label="Leads" /></div>
          <DataTable cols={[{ key: "x", label: "Day" }, { key: "leads", label: "Leads" }, { key: "bookings", label: "Bookings" }]} rows={data} />
        </div>
        <div className="card p-5">
          <p className="font-medium text-white">From enquiry to booking</p>
          <p className="mb-4 text-xs text-silver-400">Last {range} days</p>
          <HBars rows={[{ label: "Enquiries", value: tot.leads }, { label: "AI replied", value: tot.leads }, { label: "Qualified", value: Math.round(tot.leads * 0.52) }, { label: "Booked", value: tot.bookings }]} />
          <p className="mt-4 text-xs text-silver-400">Median first-reply time: <b className="text-white">4 seconds</b> (AI) vs. 3h 20m before automation (sample).</p>
        </div>
      </div>
      <div className="card p-5">
        <p className="font-medium text-white">Messages by hour of day</p>
        <p className="text-xs text-silver-400">Most enquiries arrive after closing time — exactly when the AI covers the front desk.</p>
        <div className="mt-3"><Bars data={hours} label="Messages" height={260} width={1200} /></div>
      </div>
    </div>
  );
}
