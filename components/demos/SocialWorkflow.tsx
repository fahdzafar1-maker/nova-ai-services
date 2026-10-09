"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Icon } from "@/components/Icon";
import { track } from "@/lib/track";

const TOPICS = {
  "Missed calls cost money": ["Your phone rings after closing time…", "Each missed call can be a lost customer", "An AI receptionist answers 24/7", "It books, qualifies and alerts you", "Never miss a lead again →"],
  "5 tasks to automate today": ["5 tasks every business should automate", "1. Replying to common questions", "2. Appointment reminders", "3. Lead follow-ups", "4–5. Reports & review requests →"],
  "WhatsApp for clinics": ["Your patients already use WhatsApp", "Let them book in 30 seconds", "Automatic reminders cut no-shows", "Medical questions go to staff", "Start with one simple flow →"],
} as const;
type Topic = keyof typeof TOPICS;
const CHANNELS = ["LinkedIn", "Instagram", "Facebook"];

/** Idea → AI carousel → human approval → scheduled publishing. Content is illustrative. */
export function SocialWorkflow() {
  const [topic, setTopic] = useState<Topic | null>(null);
  const [stage, setStage] = useState(0); // 0 pick, 1 drafting, 2 review, 3 publishing, 4 done
  const [slide, setSlide] = useState(0);
  const [published, setPublished] = useState<string[]>([]);

  const pick = (t: Topic) => {
    setTopic(t); setStage(1); setSlide(0); setPublished([]);
    track("demo_start", { slug: "social-media-workflow" });
    setTimeout(() => setStage(2), 1800);
  };
  const approve = () => {
    setStage(3);
    CHANNELS.forEach((c, i) => setTimeout(() => {
      setPublished((p) => [...p, c]);
      if (i === CHANNELS.length - 1) { setStage(4); track("demo_complete", { slug: "social-media-workflow" }); }
    }, 700 * (i + 1)));
  };
  const slides = topic ? TOPICS[topic] : [];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="space-y-3">
        {["Choose an idea", "AI writes & designs", "You approve", "Auto-publish"].map((s, i) => (
          <div key={s} className={`card flex items-center gap-3 p-4 transition ${stage >= i + (i === 0 ? 0 : 1) && (i > 0 || topic) ? "!border-cyan/40" : ""}`}>
            <span className={`grid h-9 w-9 place-items-center rounded-lg font-mono text-sm ${stage > i ? "bg-emerald-400/20 text-emerald-200" : stage === i ? "bg-electric/25 text-cyan" : "bg-white/[0.04] text-silver-600"}`}>{stage > i ? "✓" : i + 1}</span>
            <p className={`text-sm ${stage >= i ? "text-white" : "text-silver-400"}`}>{s}</p>
          </div>
        ))}
        <div className="card p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-silver">Pick today's topic</p>
          <div className="mt-3 flex flex-col gap-2">
            {(Object.keys(TOPICS) as Topic[]).map((t) => <button key={t} onClick={() => pick(t)} className={`rounded-xl border px-3 py-2.5 text-left text-sm transition ${topic === t ? "border-cyan/60 bg-cyan/10 text-white" : "border-white/10 text-silver hover:border-white/25"}`}>{t}</button>)}
          </div>
        </div>
      </div>

      <div className="card p-6">
        {stage === 0 && <div className="grid h-full min-h-[380px] place-items-center text-center text-silver-400"><div><Icon name="pen" className="mx-auto h-10 w-10 text-cyan" /><p className="mt-3">Pick a topic to generate a 5-slide carousel.</p></div></div>}
        {stage === 1 && (
          <div className="grid min-h-[380px] place-items-center text-center">
            <div><div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-cyan/30 border-t-cyan" /><p className="mt-4 text-silver">AI is writing the hook, the slides and the caption…</p><p className="mt-1 text-xs text-silver-600">Brand colours and fonts applied automatically</p></div>
          </div>
        )}
        {stage >= 2 && topic && (
          <div>
            <div className="mx-auto aspect-square w-full max-w-[380px] overflow-hidden rounded-2xl bg-gradient-to-br from-night-700 via-night-800 to-[#0a1a3a] p-7 ring-1 ring-white/10">
              <AnimatePresence mode="wait">
                <motion.div key={slide} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="flex h-full flex-col">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-cyan">Fahd AI Services · {slide + 1}/5</p>
                  <p className="mt-auto font-display text-2xl font-semibold leading-snug text-white sm:text-3xl">{slides[slide]}</p>
                  <div className="mt-auto flex gap-1.5 pt-6">{slides.map((_, i) => <span key={i} className={`h-1 flex-1 rounded ${i <= slide ? "bg-cyan" : "bg-white/15"}`} />)}</div>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="mt-3 flex justify-center gap-2">
              <button className="btn-ghost !py-2" onClick={() => setSlide((s) => Math.max(0, s - 1))} aria-label="Previous slide">‹</button>
              <button className="btn-ghost !py-2" onClick={() => setSlide((s) => Math.min(4, s + 1))} aria-label="Next slide">›</button>
            </div>
            <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-silver"><b className="text-white">Caption:</b> {slides[0]} Swipe to see how automation fixes it. #automation #smallbusiness #AI</div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {stage === 2 && <><button onClick={approve} className="btn-primary">Approve & schedule</button><button onClick={() => pick(topic)} className="btn-ghost">Regenerate</button></>}
              {CHANNELS.map((c) => <span key={c} className={`rounded-full px-3 py-1 text-xs ${published.includes(c) ? "bg-emerald-400/15 text-emerald-300" : stage === 3 ? "bg-amber-400/10 text-amber-200" : "bg-white/[0.04] text-silver-600"}`}>{published.includes(c) ? `✓ ${c} scheduled` : c}</span>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
