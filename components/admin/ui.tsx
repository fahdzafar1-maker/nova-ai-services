import Link from "next/link";

export function PageTitle({ title, sub, children }: { title: string; sub?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div><h1 className="font-display text-2xl font-semibold text-white">{title}</h1>{sub && <p className="mt-1 text-sm text-silver-400">{sub}</p>}</div>
      {children}
    </div>
  );
}

export function Stat({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="card p-4">
      <p className="text-[11px] font-medium uppercase tracking-wider text-silver-400">{label}</p>
      <p className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-white">{typeof value === "number" ? value.toLocaleString("en-US") : value}</p>
      {hint && <p className="mt-0.5 text-xs text-silver-600">{hint}</p>}
    </div>
  );
}

export function RangeFilter({ base, current, extra = "" }: { base: string; current: number; extra?: string }) {
  return (
    <div className="flex rounded-xl border border-white/10 bg-white/[0.03] p-1" role="group" aria-label="Date range">
      {[1, 7, 30, 90].map((d) => (
        <Link key={d} href={`${base}?days=${d}${extra}`} aria-current={current === d ? "true" : undefined}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium ${current === d ? "bg-white text-night-950" : "text-silver hover:text-white"}`}>
          {d === 1 ? "Today" : `${d} days`}
        </Link>
      ))}
    </div>
  );
}

export function Badge({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "good" | "warn" | "bad" | "info" }) {
  const t = { default: "bg-white/[0.06] text-silver", good: "bg-emerald-400/15 text-emerald-300", warn: "bg-amber-400/15 text-amber-200", bad: "bg-rose-400/15 text-rose-200", info: "bg-electric/15 text-cyan-300" }[tone];
  return <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${t}`}>{children}</span>;
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <div className="card p-10 text-center text-sm text-silver-400">{children}</div>;
}

export const statusTone = (s: string): "default" | "good" | "warn" | "bad" | "info" =>
  ["Won", "confirmed", "completed", "answered", "accepted"].includes(s) ? "good"
  : ["Lost", "declined", "cancelled", "closed"].includes(s) ? "bad"
  : ["Qualified", "Proposal Sent", "in_progress"].includes(s) ? "info"
  : ["New", "open", "requested", "pending"].includes(s) ? "warn" : "default";

export function parseDays(v: string | string[] | undefined, def = 30) {
  const n = Number(Array.isArray(v) ? v[0] : v);
  return [1, 7, 30, 90].includes(n) ? n : def;
}
export function rangeFor(days: number) {
  const to = new Date();
  const from = new Date(to);
  if (days === 1) from.setHours(0, 0, 0, 0); else from.setDate(from.getDate() - (days - 1)), from.setHours(0, 0, 0, 0);
  return { from: from.toISOString(), to: to.toISOString() };
}
export const fmtDate = (s: string) => new Date(s).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
