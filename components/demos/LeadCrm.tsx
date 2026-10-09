"use client";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import { track } from "@/lib/track";

type Stage = "New" | "Contacted" | "Qualified" | "Won";
type Lead = { id: number; name: string; source: string; icon: string; need: string; score: number; stage: Stage };
const STAGES: Stage[] = ["New", "Contacted", "Qualified", "Won"];
const POOL = [
  { name: "Bright Dental (sample)", source: "WhatsApp", icon: "whatsapp", need: "Booking assistant" },
  { name: "Oakline Realty (sample)", source: "Website form", icon: "globe", need: "Lead follow-up" },
  { name: "Café Mira (sample)", source: "Instagram", icon: "share", need: "DM auto-replies" },
  { name: "FixRight HVAC (sample)", source: "Missed call", icon: "phone", need: "Voice receptionist" },
  { name: "Lumen Clinic (sample)", source: "Facebook ad", icon: "share", need: "Comment replies" },
  { name: "Urban Nest (sample)", source: "Email", icon: "mail", need: "CRM setup" },
  { name: "PeakFit Gym (sample)", source: "Website chat", icon: "chat", need: "Membership bot" },
  { name: "Sterling Law (sample)", source: "Website form", icon: "globe", need: "Intake automation" },
];

/** Live pipeline: leads arrive from different channels, get scored and move through stages automatically. */
export function LeadCrm() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [feed, setFeed] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const n = useRef(0);
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setLeads((cur) => {
        const next = cur.map((l) => ({ ...l }));
        // advance one lead per tick
        const movable = next.filter((l) => l.stage !== "Won" && (l.stage !== "Qualified" || l.score >= 7));
        if (movable.length && Math.random() < 0.7) {
          const l = movable[Math.floor(Math.random() * movable.length)];
          const s = STAGES[STAGES.indexOf(l.stage) + 1];
          l.stage = s;
          setFeed((f) => [`${l.name.replace(" (sample)", "")} → ${s}${s === "Contacted" ? " · AI follow-up sent" : s === "Qualified" ? " · Slack alert to sales" : s === "Won" ? " · deal closed 🎉" : ""}`, ...f].slice(0, 8));
        }
        if (next.length < 8 && Math.random() < 0.6) {
          const p = POOL[n.current % POOL.length]; n.current++;
          const lead: Lead = { id: n.current, ...p, score: 4 + ((n.current * 7) % 6), stage: "New" };
          setFeed((f) => [`New lead from ${p.source}: ${p.name.replace(" (sample)", "")} · score ${lead.score}/10`, ...f].slice(0, 8));
          next.push(lead);
        }
        if (next.length >= 8 && next.every((l) => l.stage === "Won" || (l.stage === "Qualified" && l.score < 7))) { setRunning(false); track("demo_complete", { slug: "lead-crm-automation" }); }
        return next;
      });
    }, 1100);
    return () => clearInterval(t);
  }, [running]);

  const start = () => { setLeads([]); setFeed([]); n.current = 0; setRunning(true); track("demo_start", { slug: "lead-crm-automation" }); };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <button onClick={start} className="btn-primary"><Icon name="play" className="h-4 w-4" />{leads.length ? "Restart simulation" : "Start lead flow"}</button>
        <button onClick={() => setRunning((r) => !r)} disabled={!leads.length} className="btn-ghost">{running ? "Pause" : "Resume"}</button>
        <span className="text-sm text-silver-400">{leads.length} leads · {leads.filter((l) => l.stage === "Won").length} won · sample data</span>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_300px]">
        <LayoutGroup>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {STAGES.map((s) => (
              <div key={s} className="card min-h-[340px] p-3">
                <div className="mb-3 flex items-center justify-between px-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-silver">{s}</p>
                  <span className="rounded-full bg-white/[0.06] px-2 text-[11px] text-silver-400">{leads.filter((l) => l.stage === s).length}</span>
                </div>
                <div className="space-y-2">
                  <AnimatePresence>
                    {leads.filter((l) => l.stage === s).map((l) => (
                      <motion.div layout layoutId={`lead-${l.id}`} key={l.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 26 }}
                        className={`rounded-xl border p-2.5 ${s === "Won" ? "border-emerald-300/30 bg-emerald-300/[0.06]" : "border-white/10 bg-white/[0.03]"}`}>
                        <p className="truncate text-[13px] font-medium text-white">{l.name}</p>
                        <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-silver-400"><Icon name={l.icon} className="h-3 w-3" />{l.source}</p>
                        <div className="mt-2 flex items-center justify-between text-[11px]"><span className="text-silver">{l.need}</span><span className={`rounded px-1.5 ${l.score >= 7 ? "bg-emerald-400/20 text-emerald-200" : "bg-white/[0.06] text-silver"}`}>{l.score}/10</span></div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        </LayoutGroup>
        <div className="card p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-silver">Automation feed</p>
          <ul className="mt-3 space-y-2 text-[12.5px]">
            {feed.length === 0 ? <li className="text-silver-600">Start the flow to watch leads arrive from WhatsApp, forms, calls and social.</li> :
              feed.map((f, i) => <motion.li key={f + i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="rounded-lg bg-white/[0.03] px-3 py-2 text-silver"><span className="text-cyan">●</span> {f}</motion.li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}
