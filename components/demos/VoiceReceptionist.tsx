"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import { track } from "@/lib/track";

type Line = { who: "agent" | "caller"; text: string; fill?: [string, string][]; action?: string };

// Synthetic call script (Skyline Properties is our demo brand; caller details are fictional).
const CALL: Line[] = [
  { who: "agent", text: "Good evening, thank you for calling Skyline Properties. This is Sara, the virtual assistant. How can I help you today?" },
  { who: "caller", text: "Hi, I saw a two bedroom apartment in Dubai Marina on your website. Is it still available?" },
  { who: "agent", text: "Yes, we have two-bedroom units available in Dubai Marina. Are you looking to buy or to rent?", fill: [["Interest", "2BR apartment · Dubai Marina"]] },
  { who: "caller", text: "To buy. My budget is around two and a half million dirhams." },
  { who: "agent", text: "Perfect, that fits a few of our current listings. When are you planning to move?", fill: [["Intent", "Buy"], ["Budget", "AED 2.5M"]] },
  { who: "caller", text: "Within the next three months, ideally." },
  { who: "agent", text: "Great. I can arrange a viewing with one of our agents. Would Saturday morning or Sunday afternoon suit you better?", fill: [["Timeline", "Within 3 months"], ["Lead score", "Hot · 9/10"]] },
  { who: "caller", text: "Saturday morning works. My name is Daniel." },
  { who: "agent", text: "Thank you Daniel. I've requested a Saturday morning viewing, and an agent will call you to confirm the exact time. I'm also sending the brochure to your WhatsApp. Anything else I can help with?", fill: [["Caller", "Daniel (demo)"], ["Next step", "Viewing request · Saturday AM"]], action: "booking" },
  { who: "caller", text: "No, that's all. Thanks!" },
  { who: "agent", text: "You're welcome, Daniel. Have a lovely evening!", action: "end" },
];

const ACTIONS = [
  { id: "crm", label: "Lead saved to Google Sheet CRM", icon: "crm" },
  { id: "slack", label: "Hot lead alert posted to Slack #leads", icon: "bolt" },
  { id: "wa", label: "Brochure sent on WhatsApp", icon: "whatsapp" },
  { id: "mail", label: "Call summary emailed to the sales team", icon: "mail" },
];

export function VoiceReceptionist() {
  const [state, setState] = useState<"idle" | "ringing" | "live" | "ended">("idle");
  const [idx, setIdx] = useState(-1);
  const [sound, setSound] = useState(false);
  const [fields, setFields] = useState<[string, string][]>([]);
  const [actions, setActions] = useState<string[]>([]);
  const [secs, setSecs] = useState(0);
  const cancelled = useRef(false);
  const logRef = useRef<HTMLDivElement>(null);
  const [canSpeak, setCanSpeak] = useState(false);
  useEffect(() => { setCanSpeak("speechSynthesis" in window); }, []);

  useEffect(() => { logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" }); }, [idx]);
  useEffect(() => {
    if (state !== "live") return;
    const t = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [state]);
  useEffect(() => () => { cancelled.current = true; if ("speechSynthesis" in window) window.speechSynthesis.cancel(); }, []);

  const say = (line: Line) => new Promise<void>((resolve) => {
    const ms = 900 + line.text.length * 38;
    if (!sound || !canSpeak) { setTimeout(resolve, ms); return; }
    const u = new SpeechSynthesisUtterance(line.text);
    const voices = window.speechSynthesis.getVoices().filter((v) => v.lang.startsWith("en"));
    const female = voices.find((v) => /female|samantha|zira|aria|jenny|google uk english female/i.test(v.name)) || voices[0];
    const male = voices.find((v) => /male|daniel|david|guy|google uk english male/i.test(v.name) && v !== female) || voices[1] || voices[0];
    u.voice = (line.who === "agent" ? female : male) || null;
    u.rate = line.who === "agent" ? 1.02 : 1.08; u.pitch = line.who === "agent" ? 1.1 : 0.9;
    u.onend = () => resolve(); u.onerror = () => resolve();
    window.speechSynthesis.speak(u);
    setTimeout(resolve, ms + 6000); // safety
  });

  async function start() {
    cancelled.current = false; setFields([]); setActions([]); setIdx(-1); setSecs(0);
    setState("ringing"); track("demo_start", { slug: "skyline-voice-receptionist" });
    await new Promise((r) => setTimeout(r, 1600));
    if (cancelled.current) return;
    setState("live");
    for (let i = 0; i < CALL.length; i++) {
      if (cancelled.current) return;
      setIdx(i);
      const line = CALL[i];
      await say(line);
      if (line.fill) setFields((f) => [...f.filter(([k]) => !line.fill!.some(([n]) => n === k)), ...line.fill!]);
      if (line.action === "booking") for (const a of ACTIONS.slice(0, 3)) { await new Promise((r) => setTimeout(r, 350)); setActions((x) => [...x, a.id]); }
      await new Promise((r) => setTimeout(r, 250));
    }
    setActions((x) => [...x, "mail"]);
    setState("ended"); track("demo_complete", { slug: "skyline-voice-receptionist" });
  }
  function hangup() { cancelled.current = true; if (canSpeak) window.speechSynthesis.cancel(); setState("ended"); }

  const speaking = state === "live" && idx >= 0 ? CALL[idx].who : null;
  const mmss = `${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}`;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="card relative overflow-hidden p-6 sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(43,143,255,.18),transparent_60%)]" />
        <div className="relative flex flex-col items-center text-center">
          <p className="text-[11px] uppercase tracking-[0.25em] text-silver-400">{state === "idle" ? "AI receptionist · ready" : state === "ringing" ? "Incoming call…" : state === "live" ? `On call · ${mmss}` : `Call ended · ${mmss}`}</p>
          <div className="relative mt-6 grid h-28 w-28 place-items-center">
            {(state === "ringing" || state === "live") && <><span className="absolute inset-0 animate-pulseRing rounded-full ring-2 ring-cyan/50" /><span className="absolute inset-0 animate-pulseRing rounded-full ring-2 ring-electric/40 [animation-delay:1.1s]" /></>}
            <div className="grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-electric to-cyan/70 text-white shadow-glow">
              <Icon name={state === "live" ? "mic" : "phone"} className="h-10 w-10" />
            </div>
          </div>
          <p className="mt-4 font-display text-xl font-semibold text-white">Skyline Properties · AI line</p>
          <p className="text-sm text-silver-400">Caller: +971 •• ••• ••42 (synthetic)</p>
          <div className="mt-5 flex h-12 items-center gap-1" aria-hidden="true">
            {Array.from({ length: 28 }).map((_, i) => (
              <motion.span key={i} className={`w-1 rounded-full ${speaking === "caller" ? "bg-emerald-300" : "bg-cyan"}`}
                animate={speaking ? { height: [6, 8 + ((i * 37) % 34), 6] } : { height: 4 }}
                transition={{ duration: 0.5 + (i % 5) * 0.1, repeat: speaking ? Infinity : 0 }} />
            ))}
          </div>
          <p className="mt-1 h-4 text-[11px] text-silver-400">{speaking === "agent" ? "AI receptionist speaking" : speaking === "caller" ? "Caller speaking" : ""}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {state === "idle" || state === "ended" ? (
              <button onClick={start} className="btn-primary !px-6"><Icon name="play" className="h-4 w-4" /> {state === "ended" ? "Replay call" : "Start demo call"}</button>
            ) : (
              <button onClick={hangup} className="btn !bg-rose-500/90 text-white hover:!bg-rose-500">End call</button>
            )}
            {canSpeak && (
              <button onClick={() => setSound((s) => !s)} aria-pressed={sound} className={`btn-ghost ${sound ? "!border-cyan/60 text-cyan" : ""}`}>
                <Icon name="volume" className="h-4 w-4" /> Voice {sound ? "on" : "off"}
              </button>
            )}
          </div>
          {canSpeak && <p className="mt-2 text-[11px] text-silver-600">Turn voice on to hear the call (uses your browser's built-in voices; the real agent uses a natural neural voice).</p>}
        </div>
        <div ref={logRef} className="relative mt-6 max-h-64 space-y-2 overflow-y-auto rounded-2xl border border-white/[0.06] bg-night-950/70 p-4" aria-live="polite">
          {idx < 0 ? <p className="text-center text-sm text-silver-600">Live transcript appears here.</p> : CALL.slice(0, idx + 1).map((l, i) => (
            <motion.p key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-[13px] leading-relaxed">
              <span className={`mr-2 font-semibold ${l.who === "agent" ? "text-cyan" : "text-emerald-300"}`}>{l.who === "agent" ? "AI" : "Caller"}</span>
              <span className="text-silver">{l.text}</span>
            </motion.p>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="card p-5">
          <h3 className="font-display text-sm font-semibold text-white">Live call insights</h3>
          <p className="text-xs text-silver-400">Extracted automatically while the caller speaks.</p>
          <dl className="mt-4 divide-y divide-white/[0.06]">
            {["Caller", "Interest", "Intent", "Budget", "Timeline", "Lead score", "Next step"].map((k) => {
              const v = fields.find(([n]) => n === k)?.[1];
              return (
                <div key={k} className="flex items-center justify-between gap-4 py-2.5 text-sm">
                  <dt className="text-silver-400">{k}</dt>
                  <dd className={`text-right ${v ? "text-white" : "text-silver-600"}`}>
                    <AnimatePresence mode="wait">{v ? <motion.span key={v} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className={k === "Lead score" ? "rounded-full bg-rose-400/15 px-2 py-0.5 text-rose-200" : ""}>{v}</motion.span> : <span>—</span>}</AnimatePresence>
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
        <div className="card p-5">
          <h3 className="font-display text-sm font-semibold text-white">Automations triggered (n8n)</h3>
          <ul className="mt-3 space-y-2">
            {ACTIONS.map((a) => {
              const on = actions.includes(a.id);
              return (
                <li key={a.id} className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition ${on ? "border-emerald-300/30 bg-emerald-300/[0.06] text-white" : "border-white/[0.06] text-silver-600"}`}>
                  <Icon name={on ? "check" : a.icon} className={`h-4 w-4 ${on ? "text-emerald-300" : ""}`} />{a.label}
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-[11px] text-silver-600">Stack: Vapi voice agent · n8n · Google Sheets · Slack · Gmail · WhatsApp Business API.</p>
        </div>
      </div>
    </div>
  );
}
