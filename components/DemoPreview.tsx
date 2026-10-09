/* Lightweight illustrated previews for demo cards (pure CSS/SVG, no screenshots required). */
import Image from "next/image";

function Bubble({ side, children, tone = "ai" }: { side: "l" | "r"; children: React.ReactNode; tone?: "ai" | "user" | "wa" }) {
  const cls = tone === "user" ? "bg-electric text-white" : tone === "wa" ? "bg-[#1f3b2f] text-emerald-100" : "bg-white/[0.07] text-silver";
  return <div className={`max-w-[78%] rounded-xl px-2.5 py-1.5 text-[10px] leading-snug ${cls} ${side === "r" ? "ml-auto rounded-br-sm" : "rounded-bl-sm"}`}>{children}</div>;
}

export function DemoPreview({ slug }: { slug: string }) {
  switch (slug) {
    case "skyline-voice-receptionist":
      return (
        <div className="flex h-full flex-col items-center justify-center gap-3">
          <div className="relative grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-electric to-cyan/70 shadow-glow">
            <span className="absolute inset-0 animate-pulseRing rounded-full ring-2 ring-cyan/50" />
            <svg viewBox="0 0 24 24" className="h-7 w-7 text-white" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg>
          </div>
          <div className="flex h-8 items-end gap-1">{[5, 12, 20, 9, 24, 14, 28, 11, 18, 7, 22, 10, 15].map((h, i) => <span key={i} className="w-1 rounded-full bg-cyan/80" style={{ height: h, animation: `float ${1 + (i % 4) * 0.3}s ease-in-out infinite` }} />)}</div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-silver-400">Incoming call · 00:42</p>
        </div>
      );
    case "skyline-whatsapp-bot":
      return (
        <div className="mx-auto flex h-full w-[70%] flex-col gap-1.5 rounded-2xl border border-white/10 bg-[#0b1a14] p-2.5">
          <div className="mb-1 flex items-center gap-1.5 text-[10px] text-emerald-200"><span className="h-4 w-4 rounded-full bg-emerald-500" /> Skyline Properties</div>
          <Bubble side="r" tone="wa">2-bed in Dubai Marina under 2M?</Bubble>
          <Bubble side="l">I found 3 options. Want photos or a viewing?</Bubble>
          <Bubble side="r" tone="wa">Viewing Saturday please</Bubble>
          <Bubble side="l">Requested ✓ An agent will confirm.</Bubble>
        </div>
      );
    case "clinic-ai-receptionist":
    case "appointment-booking":
      return (
        <div className="grid h-full grid-cols-[1fr_1.1fr] gap-2 p-1">
          <div className="space-y-1.5">
            <Bubble side="r" tone="user">Book a skin consult</Bubble>
            <Bubble side="l">Which day suits you?</Bubble>
            <Bubble side="r" tone="user">Thursday evening</Bubble>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2">
            <div className="mb-1.5 text-[9px] uppercase tracking-widest text-silver-400">Thu · open slots</div>
            <div className="grid grid-cols-2 gap-1">{["4:00", "4:30", "5:30", "6:00", "6:30", "7:00"].map((t, i) => <span key={t} className={`rounded-md py-1 text-center text-[10px] ${i === 3 ? "bg-electric text-white" : "bg-white/[0.05] text-silver"}`}>{t}</span>)}</div>
          </div>
        </div>
      );
    case "client-hunter":
      return (
        <svg viewBox="0 0 300 150" className="h-full w-full">
          {[["Trigger", 20, 65], ["Maps", 75, 30], ["Filter", 75, 100], ["Scrape", 130, 65], ["AI", 185, 65], ["Sheet", 240, 35], ["Gmail", 240, 95]].map(([l, x, y], i) => (
            <g key={String(l)}>
              <rect x={Number(x)} y={Number(y)} width="44" height="26" rx="7" fill="#0B2147" stroke={i === 4 ? "#3DD8FF" : "#2B8FFF"} strokeOpacity={i === 4 ? 1 : 0.5} />
              <text x={Number(x) + 22} y={Number(y) + 17} textAnchor="middle" fontSize="9" fill="#C9D4E5">{String(l)}</text>
            </g>
          ))}
          <path d="M64 78 L75 43 M64 78 L75 113 M119 43 L130 78 M119 113 L130 78 M174 78 L185 78 M229 78 L240 48 M229 78 L240 108" stroke="#3DD8FF" strokeOpacity=".6" strokeDasharray="3 3" fill="none" />
        </svg>
      );
    case "facebook-auto-reply":
      return (
        <div className="mx-auto h-full w-[62%] space-y-1.5 rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
          <div className="h-12 rounded-lg bg-gradient-to-br from-electric/40 to-cyan/20" />
          {["Price please?", "Is delivery free?"].map((c) => (
            <div key={c} className="space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] text-silver"><span className="h-3.5 w-3.5 rounded-full bg-silver-600" /><span className="blur-name">Hidden Name</span> {c}</div>
              <div className="ml-5 rounded-lg bg-electric/20 px-2 py-1 text-[9.5px] text-cyan-300">Page · Sent you the details in DM 💬</div>
            </div>
          ))}
        </div>
      );
    case "web-design-showcase":
      return (
        <div className="relative h-full">
          <Image src="/demos/sites/northbrook.jpg" alt="" fill sizes="(max-width:768px) 90vw, 380px" className="rounded-lg object-cover object-top opacity-90" />
          <Image src="/demos/sites/aurelle.jpg" alt="" width={150} height={100} className="absolute -bottom-1 right-1 w-[45%] rounded-md border border-white/20 object-cover object-top shadow-2xl" />
        </div>
      );
    case "web-app-admin":
    case "analytics-dashboard":
      return (
        <div className="grid h-full grid-cols-3 gap-1.5 p-1">
          {["Leads 164", "Booked 41", "Reply 4s"].map((k) => <div key={k} className="rounded-lg border border-white/10 bg-white/[0.04] p-1.5 text-[9px] text-silver">{k.split(" ")[0]}<b className="block text-sm text-white">{k.split(" ")[1]}</b></div>)}
          <div className="col-span-3 flex items-end gap-1 rounded-lg border border-white/10 bg-white/[0.03] p-2">
            {[30, 45, 38, 60, 52, 75, 68, 90, 80, 96].map((h, i) => <span key={i} className="flex-1 rounded-sm bg-gradient-to-t from-electric to-cyan" style={{ height: `${h * 0.55}px` }} />)}
          </div>
        </div>
      );
    case "ecommerce-support":
      return (
        <div className="space-y-1.5 p-1">
          <Bubble side="r" tone="user">Where is order #4821?</Bubble>
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-2 text-[10px] text-silver">
            <div className="flex justify-between"><span>Order #4821</span><span className="text-emerald-300">Shipped</span></div>
            <div className="mt-1.5 h-1 rounded bg-white/10"><div className="h-1 w-3/4 rounded bg-gradient-to-r from-electric to-cyan" /></div>
            <div className="mt-1 text-[9px] text-silver-400">Arrives Thursday · tracking sent</div>
          </div>
        </div>
      );
    case "lead-crm-automation":
      return (
        <div className="grid h-full grid-cols-4 gap-1.5 p-1">
          {["New", "Contacted", "Qualified", "Won"].map((c, i) => (
            <div key={c} className="rounded-lg bg-white/[0.03] p-1">
              <div className="mb-1 text-[8.5px] uppercase tracking-wider text-silver-400">{c}</div>
              {Array.from({ length: 3 - (i > 1 ? 1 : 0) }).map((_, j) => <div key={j} className={`mb-1 h-4 rounded ${i === 3 ? "bg-emerald-400/30" : "bg-electric/25"}`} />)}
            </div>
          ))}
        </div>
      );
    case "social-media-workflow":
      return (
        <div className="flex h-full items-center justify-between gap-1 px-1">
          {["Idea", "AI draft", "Design", "Approve", "Publish"].map((s, i) => (
            <div key={s} className="flex flex-1 flex-col items-center gap-1">
              <span className={`grid h-8 w-8 place-items-center rounded-lg text-[10px] font-bold ${i === 3 ? "bg-amber-400/20 text-amber-200" : "bg-electric/20 text-cyan"}`}>{i + 1}</span>
              <span className="text-center text-[9px] text-silver">{s}</span>
            </div>
          ))}
        </div>
      );
    default:
      return <div className="grid h-full place-items-center text-silver-400">Demo</div>;
  }
}
