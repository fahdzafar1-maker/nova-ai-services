"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import { track } from "@/lib/track";

/* A faithful replica of the real n8n workflow "Client Hunter - Daily Leads + Messages" (19 nodes incl. guide note).
   Node names and wiring match production; execution data below is synthetic. */

type Kind = "schedule" | "manual" | "code" | "sheets" | "http" | "gmail";
type N = { id: string; name: string; kind: Kind; col: number; row: number; items: number; note: string };

const NODES: N[] = [
  { id: "t1", name: "Daily 9 AM", kind: "schedule", col: 0, row: 0, items: 1, note: "Schedule trigger fired at 09:00" },
  { id: "t2", name: "Run Manually", kind: "manual", col: 0, row: 0.62, items: 0, note: "" },
  { id: "cfg", name: "Config", kind: "code", col: 1, row: 0, items: 1, note: "Today: med spa · Toronto, Canada · English · send limit 5" },
  { id: "read", name: "Read Existing Leads", kind: "sheets", col: 2, row: 0, items: 214, note: "214 existing rows loaded for de-duplication" },
  { id: "maps", name: "Find Businesses (Maps)", kind: "http", col: 3, row: 0, items: 20, note: "20 places returned from Google Maps data" },
  { id: "filter", name: "Filter & Dedupe", kind: "code", col: 4, row: 0, items: 12, note: "Removed: 3 no website, 2 duplicates, 2 chains, 1 social-only" },
  { id: "fetch", name: "Fetch Website", kind: "http", col: 5, row: 0, items: 12, note: "12 homepages fetched (11 OK, 1 timeout handled)" },
  { id: "extract", name: "Extract Homepage", kind: "code", col: 0, row: 1.35, items: 12, note: "Emails, socials, chat & booking tools detected" },
  { id: "fetch2", name: "Fetch Contact/About Page", kind: "http", col: 1, row: 1.35, items: 12, note: "Contact/About pages fetched" },
  { id: "merge", name: "Merge Page Data", kind: "code", col: 2, row: 1.35, items: 12, note: "Signals merged, owner search query built" },
  { id: "li", name: "Search Owner on LinkedIn", kind: "http", col: 3, row: 1.35, items: 12, note: "Public owner profiles searched (5 matched)" },
  { id: "build", name: "Build AI Request", kind: "code", col: 4, row: 1.35, items: 12, note: "Research + copywriting prompt prepared" },
  { id: "ai", name: "Ask AI", kind: "http", col: 5, row: 1.35, items: 12, note: "12 analyses + personalised emails written" },
  { id: "row", name: "Build Sheet Row", kind: "code", col: 0, row: 2.7, items: 12, note: "Scores, channels and messages mapped to 33 columns" },
  { id: "mark", name: "Mark To Send", kind: "code", col: 1, row: 2.7, items: 12, note: "Top 5 by score with an email marked 'Email Sent'" },
  { id: "save", name: "Save to Google Sheet", kind: "sheets", col: 2, row: 2.7, items: 12, note: "12 rows appended to Leads sheet" },
  { id: "pick", name: "Pick Emails To Send", kind: "code", col: 3, row: 2.7, items: 5, note: "5 emails selected (daily limit)" },
  { id: "send", name: "Send Email", kind: "gmail", col: 4, row: 2.7, items: 5, note: "5 personalised emails sent from the outreach inbox" },
];
const ORDER = NODES.filter((n) => n.id !== "t2").map((n) => n.id);
const EDGES: [string, string][] = [["t1", "cfg"], ["t2", "cfg"], ["cfg", "read"], ["read", "maps"], ["maps", "filter"], ["filter", "fetch"], ["fetch", "extract"], ["extract", "fetch2"], ["fetch2", "merge"], ["merge", "li"], ["li", "build"], ["build", "ai"], ["ai", "row"], ["row", "mark"], ["mark", "save"], ["save", "pick"], ["pick", "send"]];

const KIND: Record<Kind, { color: string; label: string; glyph: React.ReactNode }> = {
  schedule: { color: "#ff6d5a", label: "Schedule Trigger", glyph: <path d="M12 6v6l4 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z" /> },
  manual: { color: "#909298", label: "Manual Trigger", glyph: <path d="M9 4v10l3-2 2 5 2-1-2-5h4z" /> },
  code: { color: "#ff9922", label: "Code", glyph: <path d="M8 8l-4 4 4 4M16 8l4 4-4 4" /> },
  sheets: { color: "#0f9d58", label: "Google Sheets", glyph: <path d="M6 3h9l4 4v14H6zM9 11h7M9 15h7M12 11v8" /> },
  http: { color: "#7b61ff", label: "HTTP Request", glyph: <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" /> },
  gmail: { color: "#ea4335", label: "Gmail", glyph: <path d="M3 6h18v12H3zM3 7l9 6 9-6" /> },
};

const W = 1240, H = 560, CW = 196, NW = 150, NH = 64, X0 = 52, Y0 = 70, RH = 140;
const pos = (n: N) => ({ x: X0 + n.col * CW, y: Y0 + n.row * RH });

// Synthetic output: invented businesses, contact details hidden.
const LEADS = [
  { b: "Lumen & Co. Aesthetics", rating: "4.8 (212)", owner: "Dr. A. Bennett", channel: "Email", score: 9, status: "Email Sent", idea: "AI receptionist for after-hours booking enquiries" },
  { b: "Northline Med Spa", rating: "4.6 (98)", owner: "Not found", channel: "Email", score: 8, status: "Email Sent", idea: "WhatsApp booking assistant + reminders" },
  { b: "Verdant Skin Studio", rating: "4.9 (341)", owner: "M. Laurent", channel: "Email", score: 8, status: "Email Sent", idea: "Website chat that books consultations" },
  { b: "Harbourview Laser Clinic", rating: "4.4 (57)", owner: "Not found", channel: "Email", score: 7, status: "Email Sent", idea: "Missed-call text-back + follow-ups" },
  { b: "Aurora Glow Wellness", rating: "4.7 (130)", owner: "S. Patel", channel: "Email", score: 7, status: "Email Sent", idea: "Review requests + rebooking automation" },
  { b: "Cedar Lane Aesthetics", rating: "4.5 (76)", owner: "Not found", channel: "Instagram DM", score: 6, status: "No Email", idea: "DM auto-replies with booking link" },
  { b: "Maple Ridge Skin Bar", rating: "4.3 (44)", owner: "J. Moreau", channel: "LinkedIn (manual)", score: 6, status: "No Email", idea: "Online booking + reminder flow" },
  { b: "Bloom Facial House", rating: "4.8 (189)", owner: "Not found", channel: "Facebook Page", score: 5, status: "No Email", idea: "Comment + DM auto-replies for ad campaigns" },
  { b: "Pure Form Body Clinic", rating: "4.2 (31)", owner: "Not found", channel: "Website form / call", score: 4, status: "No Email", idea: "New website with built-in booking" },
  { b: "Silk Avenue Spa", rating: "4.6 (65)", owner: "K. Novak", channel: "Email", score: 6, status: "New", idea: "CRM + automatic follow-ups" },
  { b: "Radiant Path Clinic", rating: "4.1 (22)", owner: "Not found", channel: "Instagram DM", score: 4, status: "No Email", idea: "Instagram lead capture to CRM" },
  { b: "Golden Hour Med Spa", rating: "4.7 (154)", owner: "L. Chen", channel: "Email", score: 5, status: "New", idea: "Voice agent for overflow calls" },
];

function Edge({ a, b, state }: { a: N; b: N; state: "idle" | "done" | "flow" }) {
  const p = pos(a), q = pos(b);
  const x1 = p.x + NW, y1 = p.y + NH / 2, x2 = q.x, y2 = q.y + NH / 2;
  let d: string;
  if (x2 > x1) { const mx = (x1 + x2) / 2; d = `M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`; }
  else { const my = q.y - 20; d = `M${x1} ${y1} C${x1 + 44} ${y1} ${x1 + 44} ${my} ${x1} ${my} L${x2} ${my} C${x2 - 34} ${my} ${x2 - 34} ${y2} ${x2} ${y2}`; }
  const color = state === "idle" ? "#4a5068" : "#34d399";
  return (
    <g>
      <path d={d} fill="none" stroke={color} strokeWidth="2" opacity={state === "idle" ? 0.8 : 1} />
      {state === "flow" && <circle r="4" fill="#34d399"><animateMotion dur="0.6s" repeatCount="indefinite" path={d} /></circle>}
      <circle cx={x2} cy={y2} r="3.5" fill={color} />
    </g>
  );
}

export function ClientHunter({ imageMode = false }: { imageMode?: boolean }) {
  const [phase, setPhase] = useState<"idle" | "running" | "done">(imageMode ? "idle" : "idle");
  const [current, setCurrent] = useState(-1);
  const [log, setLog] = useState<string[]>([]);
  const [open, setOpen] = useState<number | null>(null);
  const [sel, setSel] = useState<string | null>(null);
  const cancel = useRef(false);
  const logRef = useRef<HTMLDivElement>(null);
  useEffect(() => () => { cancel.current = true; }, []);
  useEffect(() => { logRef.current?.scrollTo({ top: logRef.current.scrollHeight }); }, [log]);

  async function run() {
    cancel.current = false; setPhase("running"); setLog([]); setCurrent(-1); setSel(null);
    track("demo_start", { slug: "client-hunter" });
    const t0 = Date.now();
    for (let i = 0; i < ORDER.length; i++) {
      if (cancel.current) return;
      setCurrent(i);
      const n = NODES.find((x) => x.id === ORDER[i])!;
      await new Promise((r) => setTimeout(r, n.kind === "http" ? 700 : 420));
      const ts = ((Date.now() - t0) / 1000).toFixed(1).padStart(4, "0");
      setLog((l) => [...l, `[${ts}s] ✓ ${n.name} — ${n.items} item${n.items === 1 ? "" : "s"} · ${n.note}`]);
    }
    setCurrent(ORDER.length);
    setPhase("done");
    track("demo_complete", { slug: "client-hunter" });
  }

  const nodeState = (id: string) => {
    if (id === "t2") return "idle";
    const i = ORDER.indexOf(id);
    if (phase === "idle") return "idle";
    if (i < current) return "done";
    if (i === current && phase === "running") return "running";
    return phase === "done" ? "done" : "idle";
  };
  const edgeState = (a: string, b: string): "idle" | "done" | "flow" => {
    if (a === "t2") return "idle";
    const ia = ORDER.indexOf(a), ib = ORDER.indexOf(b);
    if (phase === "idle") return "idle";
    if (ib < current || phase === "done") return "done";
    if (ia < current && ib === current) return "flow";
    return "idle";
  };
  const selected = NODES.find((n) => n.id === sel);

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#1f1f28]" id="client-hunter-canvas">
        <div className="flex flex-wrap items-center gap-3 border-b border-white/10 bg-[#2a2a35] px-4 py-2.5">
          <span className="grid h-6 w-6 place-items-center rounded bg-[#ea4b71] text-[10px] font-bold text-white">n8n</span>
          <span className="text-sm font-medium text-white">Client Hunter - Daily Leads + Messages</span>
          <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] text-silver">19 nodes</span>
          {!imageMode && <a href="/demos/client-hunter-workflow.png" download className="text-[11px] text-cyan hover:underline">Download workflow image</a>}
          {!imageMode && (
            <div className="ml-auto flex items-center gap-2">
              {phase === "done" && <span className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-[11px] font-medium text-emerald-300">Workflow executed successfully</span>}
              <button onClick={run} disabled={phase === "running"} className="inline-flex items-center gap-2 rounded-lg bg-[#ff6d5a] px-3.5 py-1.5 text-xs font-semibold text-white disabled:opacity-60">
                {phase === "running" ? <><span className="h-3 w-3 animate-spin rounded-full border-2 border-white/40 border-t-white" />Executing…</> : <><Icon name="play" className="h-3.5 w-3.5" />{phase === "done" ? "Run again" : "Execute workflow"}</>}
              </button>
            </div>
          )}
        </div>
        <div className="overflow-x-auto">
          <svg viewBox={`0 0 ${W} ${H}`} className="block min-w-[980px]" style={{ backgroundImage: "radial-gradient(#3a3a48 1px, transparent 1px)", backgroundSize: "20px 20px" }} role="img" aria-label="n8n workflow diagram: Client Hunter">
            {EDGES.map(([a, b]) => <Edge key={a + b} a={NODES.find((n) => n.id === a)!} b={NODES.find((n) => n.id === b)!} state={edgeState(a, b)} />)}
            {NODES.map((n) => {
              const p = pos(n), st = nodeState(n.id), k = KIND[n.kind];
              const isTrigger = n.kind === "schedule" || n.kind === "manual";
              return (
                <g key={n.id} transform={`translate(${p.x} ${p.y})`} className="cursor-pointer" onClick={() => setSel(n.id)}>
                  <rect width={NW} height={NH} rx={isTrigger ? 28 : 10} ry={isTrigger ? 28 : 10} fill="#2e2e3a"
                    stroke={st === "done" ? "#34d399" : st === "running" ? "#ff9922" : sel === n.id ? "#8BE9FF" : "#4a5068"} strokeWidth={st === "idle" && sel !== n.id ? 1.5 : 2.5} />
                  {st === "running" && <rect width={NW} height={NH} rx={10} fill="none" stroke="#ff9922" strokeWidth="2" opacity=".5"><animate attributeName="opacity" values=".1;.8;.1" dur="0.9s" repeatCount="indefinite" /></rect>}
                  <rect x="10" y="14" width="36" height="36" rx="8" fill={k.color} fillOpacity=".18" />
                  <svg x="16" y="20" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={k.color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">{k.glyph}</svg>
                  <foreignObject x="52" y="8" width={NW - 58} height={NH - 16}>
                    <div style={{ display: "flex", height: "100%", alignItems: "center", fontSize: 11.5, lineHeight: 1.2, color: "#e8e8ee", fontWeight: 500, fontFamily: "Inter, system-ui, sans-serif" }}>{n.name}</div>
                  </foreignObject>
                  {st === "done" && n.items > 0 && (
                    <g transform={`translate(${NW - 4} -8)`}>
                      <rect x="-40" width="44" height="18" rx="9" fill="#065f46" />
                      <text x="-18" y="12.5" textAnchor="middle" fontSize="10" fill="#a7f3d0" fontFamily="Inter, sans-serif">{n.items} item{n.items === 1 ? "" : "s"}</text>
                    </g>
                  )}
                  {st === "done" && <circle cx="10" cy="0" r="8" fill="#34d399"><title>success</title></circle>}
                  {st === "done" && <path d="M6 0l3 3 5-5" transform="translate(0 0)" stroke="#06281d" strokeWidth="2" fill="none" />}
                  <text x={NW / 2} y={NH + 15} textAnchor="middle" fontSize="9.5" fill="#8b8fa3" fontFamily="Inter, sans-serif">{k.label}</text>
                </g>
              );
            })}
            {/* setup guide sticky note */}
            <g transform={`translate(${X0 + 5 * CW - 6} ${Y0 + 2.6 * RH})`}>
              <rect width="200" height="96" rx="8" fill="#3b3520" stroke="#d9b54a" strokeOpacity=".6" />
              <foreignObject x="10" y="8" width="180" height="84">
                <div style={{ fontSize: 10, lineHeight: 1.35, color: "#f3e6b5", fontFamily: "Inter, sans-serif" }}>
                  <b>Client Hunter (v2)</b><br />Every day at 9 AM: one of 20 cities, 12 businesses checked, AI writes in the local language, all saved to Google Sheet, top 5 emailed. Starts at 5 emails/day.
                </div>
              </foreignObject>
            </g>
          </svg>
        </div>
        {!imageMode && (
          <div className="grid border-t border-white/10 md:grid-cols-[1fr_1.1fr]">
            <div className="border-b border-white/10 p-4 md:border-b-0 md:border-r">
              <p className="text-[10px] uppercase tracking-widest text-[#8b8fa3]">Node details</p>
              {selected ? (
                <div className="mt-2 text-sm">
                  <p className="font-semibold text-white">{selected.name}</p>
                  <p className="text-xs text-[#8b8fa3]">{KIND[selected.kind].label}</p>
                  <p className="mt-2 text-silver">{selected.note || "Alternative trigger used for testing."}</p>
                </div>
              ) : <p className="mt-2 text-sm text-[#8b8fa3]">Click any node to see what it does.</p>}
            </div>
            <div ref={logRef} className="max-h-48 overflow-y-auto bg-[#17171f] p-4 font-mono text-[11px] leading-relaxed text-[#b8bccb]">
              <p className="mb-1 text-[10px] uppercase tracking-widest text-[#8b8fa3]">Execution log</p>
              {log.length === 0 ? <p className="text-[#6b6f80]">Press “Execute workflow” to run today's prospecting.</p> : log.map((l, i) => <p key={i}>{l}</p>)}
            </div>
          </div>
        )}
      </div>

      {!imageMode && (
        <AnimatePresence>
          {phase === "done" && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] p-5">
                <div>
                  <h3 className="font-display text-lg font-semibold text-white">Today's outreach list · Leads sheet</h3>
                  <p className="text-sm text-silver-400">Med spas · Toronto, Canada · 12 researched · 5 emailed automatically · sample data, contact details hidden</p>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-emerald-300">5 Email Sent</span>
                  <span className="rounded-full bg-amber-400/15 px-2.5 py-1 text-amber-200">5 No Email</span>
                  <span className="rounded-full bg-electric/15 px-2.5 py-1 text-cyan-300">2 New</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[920px] text-left text-sm">
                  <thead className="bg-white/[0.03] text-[11px] uppercase tracking-wider text-silver-400">
                    <tr>{["#", "Business", "Rating", "Owner", "Email", "Best channel", "Score", "Status", "AI message"].map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.05]">
                    {LEADS.map((l, i) => (
                      <motion.tr key={l.b} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="hover:bg-white/[0.02]">
                        <td className="px-4 py-3 text-silver-600">{i + 1}</td>
                        <td className="px-4 py-3"><p className="font-medium text-white">{l.b}</p><p className="text-xs text-silver-600">{l.idea}</p></td>
                        <td className="px-4 py-3 text-silver">★ {l.rating}</td>
                        <td className="px-4 py-3">{l.owner === "Not found" ? <span className="text-silver-600">Not found</span> : <span className="blur-name text-silver">{l.owner}</span>}</td>
                        <td className="px-4 py-3">{l.channel === "Email" ? <span className="blur-name text-silver">info@hidden-domain.ca</span> : <span className="text-silver-600">—</span>}</td>
                        <td className="px-4 py-3 text-silver">{l.channel}</td>
                        <td className="px-4 py-3"><span className={`inline-grid h-7 w-7 place-items-center rounded-lg text-xs font-bold ${l.score >= 8 ? "bg-emerald-400/20 text-emerald-200" : l.score >= 6 ? "bg-amber-400/15 text-amber-200" : "bg-white/[0.06] text-silver"}`}>{l.score}</span></td>
                        <td className="px-4 py-3"><span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs ${l.status === "Email Sent" ? "bg-emerald-400/15 text-emerald-300" : l.status === "New" ? "bg-electric/15 text-cyan-300" : "bg-amber-400/10 text-amber-200"}`}>{l.status}</span></td>
                        <td className="px-4 py-3"><button onClick={() => setOpen(i)} className="text-xs font-semibold text-cyan hover:underline">View</button></td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <AnimatePresence>
        {open !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] grid place-items-center bg-black/70 p-4" onClick={() => setOpen(null)}>
            <motion.div initial={{ scale: 0.96, y: 10 }} animate={{ scale: 1, y: 0 }} className="card max-h-[85vh] w-full max-w-lg overflow-y-auto p-6" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="AI-written email">
              <div className="flex items-start justify-between gap-4">
                <div><p className="text-[11px] uppercase tracking-widest text-silver-400">AI-written email (sample)</p><h3 className="mt-1 font-display text-lg font-semibold text-white">{LEADS[open].b}</h3></div>
                <button onClick={() => setOpen(null)} className="rounded-lg p-1 text-silver hover:text-white" aria-label="Close"><Icon name="close" /></button>
              </div>
              <div className="mt-4 rounded-xl border border-white/[0.07] bg-night-950/70 p-4 text-sm leading-relaxed text-silver">
                <p className="text-xs text-silver-400">Subject: <span className="text-white">A quick idea for {LEADS[open].b}</span></p>
                <div className="mt-3 space-y-3">
                  <p>Hi {LEADS[open].b} team,</p>
                  <p>I came across your clinic while looking at top-rated med spas in Toronto — your reviews speak for themselves. I could not see an online booking option outside office hours, which is often when new clients reach out.</p>
                  <p>I help clinics automate their front desk end to end, and I also build websites and custom software. For a clinic like yours, that could include:</p>
                  <ul className="list-none space-y-1">
                    <li>- {LEADS[open].idea}</li><li>- Automatic appointment reminders</li><li>- A simple CRM with follow-ups</li><li>- Replies to Instagram DMs and comments</li>
                  </ul>
                  <p>If you're open to it, reply to this email and we can have a short chat about your needs, a plan and pricing. If it looks useful, great; if not, no problem at all.</p>
                  <p className="whitespace-pre-line text-silver-400">Fahd Zafar{"\n"}AI Automation | n8n + AI Agents{"\n"}fahdaiservices.com</p>
                  <p className="text-xs text-silver-600">If this is not relevant, just reply “no” and I won't contact you again.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
