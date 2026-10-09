"use client";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { RobotHead } from "./Robot";
import { Icon } from "./Icon";
import { track } from "@/lib/track";

type Msg = { role: "user" | "assistant"; content: string; ref?: string };
const KEY = "fai_chat_v1";
const GREETING: Msg = {
  role: "assistant",
  content: "Hi, I'm Nova, the Fahd AI assistant. Tell me what your business does and what takes too much of your time, and I'll point you to the right solution and demo.",
};
const STARTERS = ["What can you automate?", "I need an AI receptionist", "Show me a live demo", "Book a consultation"];

/** Turns /paths and https links into clickable links; everything else stays plain text (no HTML injection). */
function linkify(text: string): ReactNode[] {
  const parts = text.split(/(https?:\/\/[^\s)]+|\s\/[a-z0-9\-/]+)/gi);
  return parts.map((p, i) => {
    if (/^https?:\/\//i.test(p)) return <a key={i} href={p} target="_blank" rel="noopener noreferrer" className="text-cyan underline underline-offset-2">{p.replace(/^https?:\/\//, "")}</a>;
    const m = p.match(/^(\s)(\/[a-z0-9\-/]+)$/i);
    if (m) return <span key={i}>{m[1]}<Link href={m[2]} className="text-cyan underline underline-offset-2">{m[2]}</Link></span>;
    return <span key={i}>{p}</span>;
  });
}

export function ChatAssistant() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([GREETING]);
  const [suggestions, setSuggestions] = useState<string[]>(STARTERS);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(KEY) || "null");
      if (saved?.msgs?.length) setMsgs(saved.msgs);
      setSessionId(saved?.sessionId || crypto.randomUUID().replace(/-/g, ""));
    } catch { setSessionId(crypto.randomUUID().replace(/-/g, "")); }
    const openHandler = () => setOpen(true);
    window.addEventListener("fai:open-chat", openHandler);
    return () => window.removeEventListener("fai:open-chat", openHandler);
  }, []);
  useEffect(() => {
    if (!sessionId) return;
    try { sessionStorage.setItem(KEY, JSON.stringify({ sessionId, msgs: msgs.slice(-30) })); } catch { /* storage unavailable */ }
  }, [msgs, sessionId]);
  useEffect(() => { logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" }); }, [msgs, busy, open]);
  useEffect(() => { if (open) { track("ai_open"); setTimeout(() => inputRef.current?.focus(), 150); } }, [open]);

  if (path.startsWith("/admin")) return null;

  async function send(text: string) {
    const content = text.trim().slice(0, 2000);
    if (!content || busy) return;
    const next: Msg[] = [...msgs, { role: "user", content }];
    setMsgs(next); setInput(""); setBusy(true); setSuggestions([]);
    track("ai_message", { n: next.filter((m) => m.role === "user").length });
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, page: path, messages: next.filter((m) => m.content !== GREETING.content).slice(-20).map(({ role, content }) => ({ role, content })) }),
      });
      const data = await res.json().catch(() => ({}));
      const reply: string = data.reply || "Sorry, something went wrong. You can reach us on WhatsApp: https://wa.me/923466998833";
      setMsgs((m) => [...m, { role: "assistant", content: reply, ref: data.reference }]);
      setSuggestions(Array.isArray(data.suggestions) ? data.suggestions : []);
      if (data.saved) track("ai_lead", { ref_type: String(data.reference || "").split("-")[1] || "LEAD" });
    } catch {
      setMsgs((m) => [...m, { role: "assistant", content: "I couldn't reach the server. Please check your connection, or message us on WhatsApp: https://wa.me/923466998833" }]);
    } finally { setBusy(false); }
  }

  function reset() {
    setMsgs([GREETING]); setSuggestions(STARTERS);
    const id = crypto.randomUUID().replace(/-/g, "");
    setSessionId(id);
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.section
            role="dialog" aria-label="Chat with Nova, the Fahd AI assistant" aria-modal="false"
            initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.97 }} transition={{ duration: 0.22 }}
            className="fixed bottom-24 right-3 z-[70] flex h-[min(620px,calc(100dvh-120px))] w-[min(400px,calc(100vw-24px))] flex-col overflow-hidden rounded-3xl border border-white/10 bg-night-900/95 shadow-[0_30px_80px_-20px_rgba(0,0,0,.8)] backdrop-blur-xl sm:right-6"
          >
            <header className="relative flex items-center gap-3 border-b border-white/[0.07] bg-gradient-to-r from-electric/20 via-transparent to-cyan/10 px-4 py-3.5">
              <span className="relative grid h-10 w-10 place-items-center rounded-2xl bg-night-950 ring-1 ring-cyan/30"><RobotHead className="h-8 w-8" /></span>
              <div className="min-w-0">
                <p className="font-display text-sm font-semibold text-white">Nova · AI assistant</p>
                <p className="flex items-center gap-1.5 text-[11px] text-silver-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Answers from approved company info</p>
              </div>
              <div className="ml-auto flex items-center gap-1">
                <button onClick={reset} className="rounded-lg px-2 py-1 text-[11px] text-silver-400 hover:bg-white/5 hover:text-white" aria-label="Start a new conversation">New</button>
                <button onClick={() => setOpen(false)} className="grid h-8 w-8 place-items-center rounded-lg text-silver hover:bg-white/5 hover:text-white" aria-label="Minimise chat"><span className="block h-0.5 w-3.5 rounded bg-current" /></button>
                <button onClick={() => { setOpen(false); reset(); }} className="grid h-8 w-8 place-items-center rounded-lg text-silver hover:bg-white/5 hover:text-white" aria-label="Close chat and clear conversation"><Icon name="close" className="h-4 w-4" /></button>
              </div>
            </header>

            <div ref={logRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[86%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed ${m.role === "user" ? "rounded-br-md bg-gradient-to-br from-electric to-electric-600 text-white" : "rounded-bl-md border border-white/[0.06] bg-white/[0.04] text-silver"}`}>
                    {linkify(m.content)}
                  </div>
                </div>
              ))}
              {busy && (
                <div className="flex gap-1.5 rounded-2xl rounded-bl-md border border-white/[0.06] bg-white/[0.04] px-4 py-3 w-fit" aria-label="Nova is typing">
                  {[0, 1, 2].map((d) => <motion.span key={d} className="h-1.5 w-1.5 rounded-full bg-cyan" animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }} transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.15 }} />)}
                </div>
              )}
            </div>

            {suggestions.length > 0 && !busy && (
              <div className="flex flex-wrap gap-1.5 px-4 pb-2">
                {suggestions.map((s) => (
                  <button key={s} onClick={() => send(s)} className="rounded-full border border-cyan/30 bg-cyan/[0.06] px-3 py-1.5 text-[12px] text-cyan-300 hover:bg-cyan/10">{s}</button>
                ))}
              </div>
            )}

            <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-end gap-2 border-t border-white/[0.07] p-3">
              <label htmlFor="nova-input" className="sr-only">Message Nova</label>
              <textarea id="nova-input" ref={inputRef} rows={1} value={input} maxLength={2000}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
                placeholder="Type your message…" className="field max-h-28 min-h-[44px] resize-none !py-2.5" />
              <button type="submit" disabled={busy || !input.trim()} className="btn-primary h-11 w-11 !p-0" aria-label="Send message"><Icon name="send" className="h-4 w-4" /></button>
            </form>
            <p className="px-4 pb-3 text-center text-[10.5px] text-silver-600">AI can make mistakes. Nothing is saved without your permission.</p>
          </motion.section>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Hide AI assistant" : "Open AI assistant"}
        aria-expanded={open}
        className="group fixed bottom-5 right-4 z-[70] flex items-center gap-2 rounded-full border border-cyan/30 bg-night-900/90 p-1.5 pr-4 text-sm font-semibold text-white shadow-glow backdrop-blur-xl transition hover:-translate-y-0.5 sm:right-6"
      >
        <span className="relative grid h-11 w-11 place-items-center rounded-full bg-night-950 ring-1 ring-cyan/40">
          <span className="absolute inset-0 animate-pulseRing rounded-full ring-2 ring-cyan/40" />
          <RobotHead className="h-8 w-8" />
        </span>
        <span className="hidden sm:inline">{open ? "Close" : "Ask Nova"}</span>
      </button>
    </>
  );
}
