"use client";
import { motion } from "framer-motion";
import { Icon } from "@/components/Icon";

export type PNode = { id: string; label: string; sub: string; icon: string };

/** Shows the "behind the scenes" automation: each node lights up as the demo triggers it. */
export function PipelinePanel({ title, nodes, done, log }: { title: string; nodes: PNode[]; done: string[]; log: string[] }) {
  return (
    <div className="card flex h-full flex-col p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-white">{title}</h3>
        <span className="flex items-center gap-1.5 text-[11px] text-silver-400"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />Live simulation</span>
      </div>
      <ol className="relative mt-5 space-y-2.5">
        <span className="absolute bottom-4 left-[19px] top-4 w-px bg-white/10" aria-hidden="true" />
        {nodes.map((n) => {
          const on = done.includes(n.id);
          return (
            <li key={n.id} className="relative flex items-center gap-3">
              <motion.span animate={on ? { scale: [1, 1.15, 1] } : {}} transition={{ duration: 0.5 }}
                className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-xl border transition-colors duration-500 ${on ? "border-cyan/60 bg-cyan/15 text-cyan shadow-glow" : "border-white/10 bg-night-950 text-silver-600"}`}>
                <Icon name={n.icon} className="h-4.5 w-4.5 h-[18px] w-[18px]" />
              </motion.span>
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-medium ${on ? "text-white" : "text-silver-400"}`}>{n.label}</p>
                <p className="truncate text-[11px] text-silver-600">{n.sub}</p>
              </div>
              <span className={`text-[11px] font-semibold ${on ? "text-emerald-300" : "text-silver-600"}`}>{on ? "✓ done" : "waiting"}</span>
            </li>
          );
        })}
      </ol>
      <div className="mt-5 flex-1 rounded-xl border border-white/[0.06] bg-night-950/80 p-3 font-mono text-[11px] leading-relaxed text-silver-400">
        <p className="mb-1 text-[10px] uppercase tracking-widest text-silver-600">Execution log</p>
        {log.length === 0 ? <p className="text-silver-600">Start the conversation to see the automation run…</p> : log.slice(-7).map((l, i) => <p key={i}><span className="text-cyan">›</span> {l}</p>)}
      </div>
    </div>
  );
}
