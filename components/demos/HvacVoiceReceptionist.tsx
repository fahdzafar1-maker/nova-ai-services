"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import { track } from "@/lib/track";

type Line = { who: "agent" | "caller"; text: string; fill?: [string, string][]; action?: string };

// Synthetic call script (Evergreen Heating & Cooling is our demo brand; caller details are fictional).
const CALL: Line[] = [
  { who: "agent", text: "Thank you for calling Evergreen Heating and Cooling. This is Sam, the virtual assistant. How can I help you today?" },
  { who: "caller", text: "Hi, my air conditioner stopped cooling this afternoon, and it is really hot in the house." },
  { who: "agent", text: "I'm sorry to hear that. Let's get a technician out to you. First, a quick safety check: do you smell gas or burning, or see any smoke or water around the unit?", fill: [["Issue", "AC blowing warm air"]] },
  { who: "caller", text: "No, nothing like that. It is just blowing warm air." },
  { who: "agent", text: "Thank you, that helps. Is it a central air system, and roughly how old is it?", fill: [["Safety check", "No gas, smoke or leak"]] },
  { who: "caller", text: "It is central air, about eight years old." },
  { who: "agent", text: "Got it. What is the address for the visit?", fill: [["Equipment", "Central AC · about 8 years old"]] },
  { who: "caller", text: "It's 42 Maple Street, in Riverside." },
  { who: "agent", text: "Thank you. We have a technician available today between 6 and 8 pm, or tomorrow morning between 8 and 10. Which would you prefer?", fill: [["Address", "42 Maple Street, Riverside"]] },
  { who: "caller", text: "Today would be great. My name is Mark." },
  { who: "agent", text: "Thank you, Mark. I've booked a technician for today between 6 and 8 pm. You will get a text confirmation, and the technician will call you when they are on the way. Is there anything else I can help with?", fill: [["Caller", "Mark (demo)"], ["Priority", "Urgent · same day"], ["Next step", "Visit booked · today 6 to 8 pm"]], action: "booking" },
  { who: "caller", text: "No, that's all. Thank you." },
  { who: "agent", text: "You're welcome, Mark. Stay cool, and have a good evening!", action: "end" },
];

const ACTIONS = [
  { id: "cal", label: "Service visit booked in the calendar", icon: "calendar" },
  { id: "sms", label: "SMS alert sent to the on-call technician", icon: "bolt" },
  { id: "sheet", label: "Job details saved to the job sheet", icon: "crm" },
  { id: "mail", label: "Call summary emailed to the office", icon: "mail" },
];

// Browser voices rarely say their gender, so we match known names. "female" must be excluded explicitly: /male/ also matches it.
const FEMALE = /female|woman|samantha|zira|aria|jenny|libby|sonia|susan|hazel|karen|moira|tessa|fiona|victoria|ava|allison|joanna|kendra|kimberly|salli|ivy/i;
const MALE = /(^|[^a-z])male|david|mark|guy|ryan|james|george|daniel|alex|fred|thomas|oliver|aaron|rishi|brian|matthew|joey|justin|kevin|arthur/i;

export function HvacVoiceReceptionist() {
  const [state, setState] = useState<"idle" | "ringing" | "live" | "ended">("idle");
  const [idx, setIdx] = useState(-1);
  const [sound, setSound] = useState(true);
  const soundRef = useRef(true); // read live inside the call loop (state would be stale there)
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

  // Voices are chosen once and reused, so no line waits for the browser to look them up again.
  const voicesRef = useRef<{ agent?: SpeechSynthesisVoice; caller?: SpeechSynthesisVoice; sameVoice: boolean } | null>(null);

  const loadVoices = () => new Promise<void>((resolve) => {
    if (voicesRef.current) return resolve();
    const pick = () => {
      const all = window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith("en"));
      if (!all.length) return;
      const pool = all.some((v) => v.localService) ? all.filter((v) => v.localService) : all; // local voices start faster than network voices
      const label = (v: SpeechSynthesisVoice) => `${v.name} ${v.voiceURI}`;
      const isFemale = (v: SpeechSynthesisVoice) => FEMALE.test(label(v));
      const agent = pool.find(isFemale) || pool[0];
      const caller = pool.find((v) => v !== agent && !isFemale(v) && MALE.test(label(v)));
      voicesRef.current = { agent, caller: caller || agent, sameVoice: !caller };
    };
    pick();
    if (voicesRef.current) return resolve();
    const done = () => { pick(); resolve(); };
    window.speechSynthesis.addEventListener("voiceschanged", done, { once: true });
    setTimeout(done, 1200); // some browsers never fire the event
  });

  useEffect(() => { if ("speechSynthesis" in window) void loadVoices(); }, []);

  const say = (line: Line) => new Promise<void>((resolve) => {
    const ms = 500 + line.text.length * 30;
    if (!soundRef.current || !("speechSynthesis" in window)) { setTimeout(resolve, ms); return; }
    if (cancelled.current) return resolve();
    const vs = voicesRef.current;
    const isAgent = line.who === "agent";
    const voice = isAgent ? vs?.agent : vs?.caller;
    const u = new SpeechSynthesisUtterance(line.text);
    if (voice) u.voice = voice;
    u.lang = voice?.lang || "en-US";
    u.rate = isAgent ? 1.08 : 1.12;
    u.pitch = isAgent ? 1.1 : vs?.sameVoice ? 0.55 : 0.9; // if the phone has one voice only, a low pitch makes the caller sound male
    let finished = false;
    const end = () => { if (!finished) { finished = true; resolve(); } };
    u.onend = end; u.onerror = end;
    window.speechSynthesis.resume(); // Chrome sometimes starts paused
    window.speechSynthesis.speak(u);
    setTimeout(end, 3000 + line.text.length * 90); // safety if the browser never reports the end
  });

  const toggleSound = () => {
    const next = !soundRef.current;
    soundRef.current = next; setSound(next);
    if (!next && "speechSynthesis" in window) window.speechSynthesis.cancel();
  };

  async function start() {
    cancelled.current = false; setFields([]); setActions([]); setIdx(-1); setSecs(0);
    setState("ringing"); track("demo_start", { slug: "hvac-voice-receptionist" });
    await Promise.all(["speechSynthesis" in window ? loadVoices() : Promise.resolve(), new Promise((r) => setTimeout(r, 900))]);
    if (cancelled.current) return;
    setState("live");
    for (let i = 0; i < CALL.length; i++) {
      if (cancelled.current) return;
      setIdx(i);
      const line = CALL[i];
      if (line.fill) setFields((f) => [...f.filter(([k]) => !line.fill!.some(([n]) => n === k)), ...line.fill!]);
      await say(line);
      if (line.action === "booking") for (const a of ACTIONS.slice(0, 3)) { await new Promise((r) => setTimeout(r, 200)); setActions((x) => [...x, a.id]); }
      await new Promise((r) => setTimeout(r, 60));
    }
    setActions((x) => [...x, "mail"]);
    setState("ended"); track("demo_complete", { slug: "hvac-voice-receptionist" });
  }
  function hangup() { cancelled.current = true; if (canSpeak) window.speechSynthesis.cancel(); setState("ended"); }

  const speaking = state === "live" && idx >= 0 ? CALL[idx].who : null;
  const mmss = `${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}`;

  return (
    <>
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
          <p className="mt-4 font-display text-xl font-semibold text-white">Evergreen Heating &amp; Cooling · AI line</p>
          <p className="text-sm text-silver-400">Caller: +1 ••• ••• ••42 (synthetic)</p>
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
              <button onClick={toggleSound} aria-pressed={sound} className={`btn-ghost ${sound ? "!border-cyan/60 text-cyan" : ""}`}>
                <Icon name="volume" className="h-4 w-4" /> Voice {sound ? "on" : "off"}
              </button>
            )}
          </div>
          {canSpeak && <p className="mt-2 text-[11px] text-silver-600">Simulation uses your browser's built-in voices (check your volume). A production agent uses a natural neural voice.</p>}
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
            {["Caller", "Issue", "Safety check", "Equipment", "Address", "Priority", "Next step"].map((k) => {
              const v = fields.find(([n]) => n === k)?.[1];
              return (
                <div key={k} className="flex items-center justify-between gap-4 py-2.5 text-sm">
                  <dt className="text-silver-400">{k}</dt>
                  <dd className={`text-right ${v ? "text-white" : "text-silver-600"}`}>
                    <AnimatePresence mode="wait">{v ? <motion.span key={v} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className={k === "Priority" ? "rounded-full bg-rose-400/15 px-2 py-0.5 text-rose-200" : ""}>{v}</motion.span> : <span>—</span>}</AnimatePresence>
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
          <p className="mt-3 text-[11px] text-silver-600">Typical stack for this build: Vapi voice agent · n8n · Google Calendar · Google Sheets · SMS and email alerts.</p>
        </div>
      </div>
    </div>
    </>
  );
}
