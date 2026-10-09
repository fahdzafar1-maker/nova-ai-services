"use client";
import { useMemo, useRef, useState } from "react";

/* Small, dependency-free charts. Single-series by design (one hue: electric blue), hairline grid,
   2px lines with a 10% wash, bars capped at 24px with 4px rounded data-ends, hover tooltips. */

const MARK = "#2B8FFF";
const GRID = "rgba(148,179,230,.12)";
const AXIS_TEXT = "#93A4BF";

const niceMax = (v: number) => {
  if (v <= 0) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p;
};
const fmtN = (n: number) => n.toLocaleString("en-US");

export function LineArea({ data, height = 220, label, format = fmtN, width = 640 }: { data: { x: string; y: number }[]; height?: number; label: string; format?: (n: number) => string; width?: number }) {
  const W = width, H = height, PL = 40, PR = 14, PT = 14, PB = 26;
  const [hover, setHover] = useState<number | null>(null);
  const ref = useRef<SVGSVGElement>(null);
  const max = niceMax(Math.max(1, ...data.map((d) => d.y)));
  const xs = (i: number) => PL + (data.length <= 1 ? 0 : (i * (W - PL - PR)) / (data.length - 1));
  const ys = (v: number) => PT + (1 - v / max) * (H - PT - PB);
  const path = data.map((d, i) => `${i ? "L" : "M"}${xs(i).toFixed(1)} ${ys(d.y).toFixed(1)}`).join(" ");
  const area = data.length ? `${path} L${xs(data.length - 1)} ${H - PB} L${xs(0)} ${H - PB} Z` : "";
  const ticks = [0, 0.5, 1].map((f) => f * max);
  const step = Math.max(1, Math.ceil(data.length / 6));
  const onMove = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * W;
    const i = Math.round(((x - PL) / (W - PL - PR)) * (data.length - 1));
    setHover(Math.max(0, Math.min(data.length - 1, i)));
  };
  const last = data[data.length - 1];
  return (
    <div className="relative">
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="block w-full touch-none" role="img" aria-label={`${label} line chart`} onPointerMove={onMove} onPointerLeave={() => setHover(null)}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PL} x2={W - PR} y1={ys(t)} y2={ys(t)} stroke={GRID} strokeWidth="1" />
            <text x={PL - 8} y={ys(t) + 4} textAnchor="end" fontSize="11" fill={AXIS_TEXT}>{format(Math.round(t))}</text>
          </g>
        ))}
        {data.map((d, i) => (i % step === 0 || i === data.length - 1) && <text key={d.x} x={xs(i)} y={H - 6} textAnchor="middle" fontSize="11" fill={AXIS_TEXT}>{d.x}</text>)}
        <path d={area} fill={MARK} fillOpacity=".1" />
        <path d={path} fill="none" stroke={MARK} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {last && <circle cx={xs(data.length - 1)} cy={ys(last.y)} r="4.5" fill={MARK} stroke="#071631" strokeWidth="2" />}
        {last && hover === null && <text x={xs(data.length - 1) - 8} y={ys(last.y) - 10} textAnchor="end" fontSize="12" fontWeight="600" fill="#EAF2FF">{format(last.y)}</text>}
        {hover !== null && data[hover] && (
          <g>
            <line x1={xs(hover)} x2={xs(hover)} y1={PT} y2={H - PB} stroke="rgba(234,242,255,.35)" strokeWidth="1" />
            <circle cx={xs(hover)} cy={ys(data[hover].y)} r="5" fill={MARK} stroke="#071631" strokeWidth="2" />
          </g>
        )}
      </svg>
      {hover !== null && data[hover] && (
        <div className="pointer-events-none absolute top-1 rounded-lg border border-white/10 bg-night-950/95 px-2.5 py-1.5 text-xs shadow-xl"
          style={{ left: `clamp(0px, calc(${(xs(hover) / W) * 100}% - 50px), calc(100% - 110px))` }}>
          <p className="text-silver-400">{data[hover].x}</p>
          <p className="font-semibold text-white">{format(data[hover].y)} <span className="font-normal text-silver-400">{label.toLowerCase()}</span></p>
        </div>
      )}
    </div>
  );
}

export function Bars({ data, height = 220, label, format = fmtN, width = 640 }: { data: { x: string; y: number }[]; height?: number; label: string; format?: (n: number) => string; width?: number }) {
  const W = width, H = height, PL = 40, PR = 10, PT = 18, PB = 26;
  const [hover, setHover] = useState<number | null>(null);
  const max = niceMax(Math.max(1, ...data.map((d) => d.y)));
  const band = (W - PL - PR) / Math.max(1, data.length);
  const bw = Math.min(24, band * 0.6);
  const ys = (v: number) => PT + (1 - v / max) * (H - PT - PB);
  const step = Math.max(1, Math.ceil(data.length / 8));
  const peak = useMemo(() => data.reduce((m, d, i) => (d.y > (data[m]?.y ?? -1) ? i : m), 0), [data]);
  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" role="img" aria-label={`${label} bar chart`}>
        {[0, 0.5, 1].map((f) => (
          <g key={f}>
            <line x1={PL} x2={W - PR} y1={ys(f * max)} y2={ys(f * max)} stroke={GRID} />
            <text x={PL - 8} y={ys(f * max) + 4} textAnchor="end" fontSize="11" fill={AXIS_TEXT}>{format(Math.round(f * max))}</text>
          </g>
        ))}
        {data.map((d, i) => {
          const x = PL + i * band + (band - bw) / 2, y = ys(d.y), h = H - PB - y, r = Math.min(4, h / 2);
          return (
            <g key={d.x} onPointerEnter={() => setHover(i)} onPointerLeave={() => setHover(null)}>
              <rect x={PL + i * band} y={PT} width={band} height={H - PT - PB} fill="transparent" />
              {h > 0 && <path d={`M${x} ${H - PB} V${y + r} Q${x} ${y} ${x + r} ${y} H${x + bw - r} Q${x + bw} ${y} ${x + bw} ${y + r} V${H - PB} Z`} fill={MARK} fillOpacity={hover === null || hover === i ? 1 : 0.45} />}
              {i === peak && hover === null && d.y > 0 && <text x={x + bw / 2} y={y - 6} textAnchor="middle" fontSize="11" fontWeight="600" fill="#EAF2FF">{format(d.y)}</text>}
              {(i % step === 0) && <text x={x + bw / 2} y={H - 6} textAnchor="middle" fontSize="11" fill={AXIS_TEXT}>{d.x}</text>}
            </g>
          );
        })}
      </svg>
      {hover !== null && data[hover] && (
        <div className="pointer-events-none absolute top-0 rounded-lg border border-white/10 bg-night-950/95 px-2.5 py-1.5 text-xs shadow-xl"
          style={{ left: `clamp(0px, calc(${((PL + hover * band + band / 2) / W) * 100}% - 50px), calc(100% - 110px))` }}>
          <p className="text-silver-400">{data[hover].x}</p>
          <p className="font-semibold text-white">{format(data[hover].y)} <span className="font-normal text-silver-400">{label.toLowerCase()}</span></p>
        </div>
      )}
    </div>
  );
}

/** Horizontal funnel / ranking bars with values at the tip (text in ink, not series color). */
export function HBars({ rows, format = fmtN }: { rows: { label: string; value: number }[]; format?: (n: number) => string }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <ul className="space-y-2.5">
      {rows.map((r) => (
        <li key={r.label} className="grid grid-cols-[120px_1fr_56px] items-center gap-3 text-sm" title={`${r.label}: ${format(r.value)}`}>
          <span className="truncate text-silver">{r.label}</span>
          <span className="h-3 rounded-r-[4px] bg-[#2B8FFF]" style={{ width: `${Math.max(2, (r.value / max) * 100)}%` }} />
          <span className="text-right font-medium tabular-nums text-white">{format(r.value)}</span>
        </li>
      ))}
    </ul>
  );
}

/** Accessible table alternative for any chart. */
export function DataTable({ rows, cols }: { rows: Record<string, string | number>[]; cols: { key: string; label: string }[] }) {
  return (
    <details className="mt-3 text-xs text-silver-400">
      <summary className="cursor-pointer select-none hover:text-white">Show data table</summary>
      <div className="mt-2 max-h-56 overflow-auto rounded-lg border border-white/[0.06]">
        <table className="w-full text-left">
          <thead className="sticky top-0 bg-night-900"><tr>{cols.map((c) => <th key={c.key} className="px-3 py-2 font-medium">{c.label}</th>)}</tr></thead>
          <tbody>{rows.map((r, i) => <tr key={i} className="border-t border-white/[0.05]">{cols.map((c) => <td key={c.key} className="px-3 py-1.5 tabular-nums text-silver">{r[c.key]}</td>)}</tr>)}</tbody>
        </table>
      </div>
    </details>
  );
}
