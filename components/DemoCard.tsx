import Link from "next/link";
import type { Demo } from "@/lib/catalog";
import { DemoPreview } from "./DemoPreview";
import { Icon } from "./Icon";

export function DemoCard({ demo, priority = false }: { demo: Demo; priority?: boolean }) {
  return (
    <Link href={`/demos/${demo.slug}`} className="card group flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-cyan/30" data-priority={priority || undefined}>
      <div className="relative h-44 overflow-hidden border-b border-white/[0.06] bg-gradient-to-br from-night-700/60 to-night-950 p-4">
        <div className="grid-bg absolute inset-0 opacity-60" />
        <div className="relative h-full"><DemoPreview slug={demo.slug} /></div>
        <span className="absolute left-3 top-3 rounded-full bg-night-950/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-cyan ring-1 ring-cyan/20">Live demo</span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-silver-400">{demo.category}</p>
        <h3 className="mt-1.5 font-display text-lg font-semibold text-white">{demo.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-silver-400">{demo.summary}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">{demo.tags.slice(0, 4).map((t) => <span key={t} className="chip">{t}</span>)}</div>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan">Open demo <Icon name="arrow" className="h-4 w-4 transition group-hover:translate-x-1" /></span>
      </div>
    </Link>
  );
}
