"use client";
import { motion } from "framer-motion";
import { Robot } from "./Robot";
import { Icon } from "./Icon";

const NODES = [
  { label: "WhatsApp", icon: "whatsapp", x: 8, y: 18 },
  { label: "Voice calls", icon: "phone", x: 8, y: 54 },
  { label: "Website chat", icon: "chat", x: 18, y: 80 },
  { label: "CRM", icon: "crm", x: 86, y: 14 },
  { label: "n8n workflows", icon: "nodes", x: 90, y: 50 },
  { label: "Calendar", icon: "calendar", x: 82, y: 80 },
];

/** Hero visual: the robot as the AI core, connected to the channels and systems it automates. */
export function SystemViz() {
  return (
    <div className="relative mx-auto aspect-[1/1] w-full max-w-[560px]">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id="sv-line" x1="0" x2="1"><stop offset="0" stopColor="#3DD8FF" stopOpacity=".05" /><stop offset=".5" stopColor="#3DD8FF" stopOpacity=".55" /><stop offset="1" stopColor="#2B8FFF" stopOpacity=".05" /></linearGradient>
        </defs>
        <circle cx="50" cy="50" r="30" fill="none" stroke="#2B8FFF" strokeOpacity=".18" strokeWidth=".3" strokeDasharray="1 1.5" />
        <circle cx="50" cy="50" r="44" fill="none" stroke="#3DD8FF" strokeOpacity=".1" strokeWidth=".3" />
        {NODES.map((n, i) => {
          const d = `M${n.x} ${n.y} Q ${(n.x + 50) / 2 + (n.x < 50 ? 6 : -6)} ${(n.y + 50) / 2} 50 50`;
          return (
            <g key={n.label}>
              <path d={d} fill="none" stroke="url(#sv-line)" strokeWidth=".35" />
              <circle r=".9" fill="#8BE9FF">
                <animateMotion dur="2.6s" repeatCount="indefinite" begin={`${i * 0.45}s`} path={d} keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines=".4 0 .2 1" />
              </circle>
            </g>
          );
        })}
      </svg>
      <div className="absolute inset-[16%] grid place-items-center">
        <div className="absolute inset-[8%] rounded-full bg-electric/20 blur-3xl" />
        <Robot className="relative h-full w-full" />
      </div>
      {NODES.map((n, i) => (
        <motion.div key={n.label}
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 + i * 0.1 }}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${n.x}%`, top: `${n.y}%` }}>
          <div className="glass flex items-center gap-2 !rounded-xl px-2.5 py-1.5 text-[11px] font-medium text-white sm:px-3 sm:py-2 sm:text-xs">
            <span className="grid h-6 w-6 place-items-center rounded-lg bg-electric/20 text-cyan"><Icon name={n.icon} className="h-3.5 w-3.5" /></span>
            <span className="hidden whitespace-nowrap sm:inline">{n.label}</span>
          </div>
        </motion.div>
      ))}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
        className="glass absolute -bottom-[4%] left-1/2 w-[min(290px,80%)] -translate-x-1/2 px-3.5 py-2.5 text-xs">
        <div className="flex items-center gap-2 text-silver-400"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Example automation</div>
        <p className="mt-1 text-white">WhatsApp enquiry → AI qualifies → lead saved in CRM → viewing request sent</p>
      </motion.div>
    </div>
  );
}
