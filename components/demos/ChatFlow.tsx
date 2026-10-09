"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { track } from "@/lib/track";

/**
 * Scripted, branching chat engine used by several demos.
 * Runs entirely in the browser with synthetic data — nothing is sent anywhere.
 */
export type Step = {
  bot: (ReactNode | string)[];
  options?: { label: string; next: string }[];
  input?: { placeholder: string; next: string; store: string };
  event?: string; // fired to the side panel when this step is shown
  end?: boolean;
};
export type Script = Record<string, Step>;
type Line = { from: "bot" | "user"; content: ReactNode };

export function ChatFlow({
  script, start = "start", theme = "web", title, subtitle, avatar, onEvent, slug, height = 520,
}: {
  script: Script; start?: string; theme?: "web" | "whatsapp"; title: string; subtitle: string; avatar: ReactNode;
  onEvent?: (e: string, memory: Record<string, string>) => void; slug: string; height?: number;
}) {
  const [lines, setLines] = useState<Line[]>([]);
  const [step, setStep] = useState<string>(start);
  const [typing, setTyping] = useState(false);
  const [ready, setReady] = useState(false);
  const [value, setValue] = useState("");
  const memory = useRef<Record<string, string>>({});
  const logRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  const timers = useRef<number[]>([]);

  const fill = (s: ReactNode) => (typeof s === "string" ? s.replace(/\{(\w+)\}/g, (_, k) => memory.current[k] || "") : s);

  const play = useCallback((id: string) => {
    const st = script[id];
    if (!st) return;
    setStep(id); setReady(false);
    let delay = 350;
    st.bot.forEach((b, i) => {
      timers.current.push(window.setTimeout(() => setTyping(true), delay));
      delay += 650 + Math.min(900, typeof b === "string" ? b.length * 12 : 500);
      timers.current.push(window.setTimeout(() => {
        setTyping(false);
        setLines((l) => [...l, { from: "bot", content: fill(b) }]);
        if (i === st.bot.length - 1) {
          setReady(true);
          if (st.event) onEvent?.(st.event, { ...memory.current });
          if (st.end) track("demo_complete", { slug });
        }
      }, delay));
      delay += 120;
    });
  }, [script, onEvent, slug]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { play(start); const t = timers.current; return () => t.forEach(clearTimeout); }, [play, start]);
  useEffect(() => { logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" }); }, [lines, typing]);

  const choose = (label: string, next: string) => {
    if (!started.current) { started.current = true; track("demo_start", { slug }); }
    track("demo_interact", { slug });
    setLines((l) => [...l, { from: "user", content: label }]);
    setReady(false);
    play(next);
  };
  const submit = () => {
    const st = script[step];
    if (!st?.input || !value.trim()) return;
    memory.current[st.input.store] = value.trim().slice(0, 80);
    choose(value.trim().slice(0, 80), st.input.next);
    setValue("");
  };
  const restart = () => {
    timers.current.forEach(clearTimeout); timers.current = [];
    memory.current = {}; setLines([]); onEvent?.("reset", {}); play(start);
  };

  const st = script[step];
  const wa = theme === "whatsapp";
  return (
    <div className={`flex flex-col overflow-hidden rounded-[28px] border ${wa ? "border-white/10 bg-[#0b141a]" : "border-white/10 bg-night-900"}`} style={{ height }}>
      <div className={`flex items-center gap-3 px-4 py-3 ${wa ? "bg-[#1f2c34]" : "border-b border-white/[0.07] bg-gradient-to-r from-electric/20 to-transparent"}`}>
        <div className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full">{avatar}</div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">{title}</p>
          <p className={`truncate text-[11px] ${typing ? "text-emerald-300" : "text-silver-400"}`}>{typing ? "typing…" : subtitle}</p>
        </div>
        <button onClick={restart} className="ml-auto rounded-lg px-2 py-1 text-[11px] text-silver-400 hover:bg-white/10 hover:text-white">Restart</button>
      </div>
      <div ref={logRef} className={`flex-1 space-y-2 overflow-y-auto px-3 py-4 ${wa ? "bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,.025)_0,transparent_40%)]" : ""}`} aria-live="polite">
        <AnimatePresence initial={false}>
          {lines.map((l, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${l.from === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[84%] rounded-2xl px-3 py-2 text-[13px] leading-relaxed ${
                l.from === "user"
                  ? wa ? "rounded-tr-sm bg-[#005c4b] text-white" : "rounded-br-sm bg-gradient-to-br from-electric to-electric-600 text-white"
                  : wa ? "rounded-tl-sm bg-[#1f2c34] text-[#e9edef]" : "rounded-bl-sm border border-white/[0.06] bg-white/[0.05] text-silver"}`}>
                {l.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {typing && (
          <div className={`flex w-fit gap-1 rounded-2xl px-3.5 py-3 ${wa ? "bg-[#1f2c34]" : "bg-white/[0.05]"}`}>
            {[0, 1, 2].map((d) => <motion.span key={d} className="h-1.5 w-1.5 rounded-full bg-silver" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.15 }} />)}
          </div>
        )}
      </div>
      <div className={`px-3 pb-3 pt-2 ${wa ? "bg-[#0b141a]" : ""}`}>
        {ready && st?.options && (
          <div className="flex flex-wrap gap-1.5">
            {st.options.map((o) => (
              <button key={o.label} onClick={() => choose(o.label, o.next)} className={`rounded-full px-3 py-1.5 text-[12.5px] font-medium transition ${wa ? "border border-[#00a884]/50 text-[#00d4a6] hover:bg-[#00a884]/10" : "border border-cyan/40 text-cyan-300 hover:bg-cyan/10"}`}>{o.label}</button>
            ))}
          </div>
        )}
        {ready && st?.input && (
          <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="flex gap-2">
            <input value={value} onChange={(e) => setValue(e.target.value)} placeholder={st.input.placeholder} maxLength={80} className={`field !rounded-full !py-2.5 ${wa ? "!border-transparent !bg-[#1f2c34]" : ""}`} autoFocus />
            <button className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${wa ? "bg-[#00a884]" : "bg-electric"} text-white`} aria-label="Send">➤</button>
          </form>
        )}
        {ready && st?.end && (
          <button onClick={restart} className="mt-2 w-full rounded-full border border-white/10 py-2 text-xs text-silver hover:text-white">Run the demo again</button>
        )}
        {!ready && <div className="h-9" />}
      </div>
    </div>
  );
}
