"use client";
import { useEffect, useRef, useState } from "react";

/* Deterministic 5-second "short": every frame is a pure function of t (ms),
   so the same component renders the on-page animation and the exported MP4. */

export const SHORT_MS = 5000;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (x: number) => 1 - Math.pow(1 - clamp(x), 3);
const appear = (t: number, at: number, dur = 280) => ease((t - at) / dur);

const COMMENTS = [
  { at: 350, text: "Price please? 😍", reply: "Hi! We've sent the price and this week's offer to your inbox 💬", replyAt: 900, initials: "AK", tone: "#f472b6" },
  { at: 1500, text: "Available this Saturday?", reply: "Yes! Saturday has open slots. Check your DM to book in 1 tap ✅", replyAt: 2050, initials: "MR", tone: "#60a5fa" },
  { at: 2650, text: "Interested! Location?", reply: "We're in Gulberg, Lahore. Directions + booking link sent to you 📍", replyAt: 3200, initials: "SH", tone: "#34d399" },
];

export function AutoReplyShort({ t, className = "" }: { t: number; className?: string }) {
  const answered = COMMENTS.filter((c) => t >= c.replyAt + 200).length;
  const end = appear(t, 4050, 420);
  return (
    <div className={`relative aspect-[9/16] w-full overflow-hidden rounded-[28px] bg-[#0b1020] font-sans text-white ${className}`} style={{ fontFamily: "var(--font-body), Inter, system-ui, sans-serif" }}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_0%,rgba(43,143,255,.35),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(61,216,255,.18),transparent_50%)]" />
      {/* header */}
      <div className="relative flex items-center justify-between px-[5%] pt-[6%]" style={{ opacity: appear(t, 0, 300) }}>
        <div>
          <p className="font-semibold uppercase tracking-[0.2em] text-cyan-300" style={{ fontSize: "clamp(9px,2.6cqw,14px)" }}>AI Auto-Reply</p>
          <p className="font-display font-semibold" style={{ fontSize: "clamp(14px,5.2cqw,30px)" }}>Facebook comments</p>
        </div>
        <span className="rounded-full bg-emerald-400/15 px-[3%] py-[1.2%] font-semibold text-emerald-300" style={{ fontSize: "clamp(9px,2.8cqw,15px)" }}>● LIVE</span>
      </div>

      {/* post card */}
      <div className="relative mx-[5%] mt-[4%] overflow-hidden rounded-[18px] bg-white text-[#050505] shadow-2xl" style={{ transform: `translateY(${(1 - appear(t, 80, 400)) * 30}px)`, opacity: appear(t, 80, 400) }}>
        <div className="flex items-center gap-[3%] p-[3.5%]">
          <span className="grid aspect-square w-[11%] place-items-center rounded-full bg-gradient-to-br from-fuchsia-500 to-orange-400 font-bold text-white" style={{ fontSize: "clamp(9px,3cqw,16px)" }}>GS</span>
          <div style={{ fontSize: "clamp(10px,3.2cqw,17px)" }}>
            <p className="font-semibold leading-tight">Glow Studio <span className="font-normal text-[#65676b]">(demo page)</span></p>
            <p className="leading-tight text-[#65676b]" style={{ fontSize: "0.82em" }}>Sponsored · 🌐</p>
          </div>
        </div>
        <p className="px-[4%] pb-[2.5%]" style={{ fontSize: "clamp(10px,3.3cqw,17px)" }}>✨ HydraFacial offer this week only. Limited slots!</p>
        <div className="relative aspect-[16/6] bg-gradient-to-br from-rose-300 via-fuchsia-300 to-sky-300">
          <div className="absolute inset-0 grid place-items-center font-display font-bold text-white/90" style={{ fontSize: "clamp(16px,7cqw,40px)", textShadow: "0 4px 20px rgba(0,0,0,.25)" }}>-30% OFF</div>
        </div>
        <div className="flex justify-between border-b border-[#e4e6eb] px-[4%] py-[2%] text-[#65676b]" style={{ fontSize: "clamp(9px,2.8cqw,15px)" }}>
          <span>👍❤️ 248</span><span>{3 + Math.min(3, COMMENTS.filter((c) => t >= c.at).length) * 1} comments</span>
        </div>

        {/* comments */}
        <div className="space-y-[2.5%] px-[4%] py-[3%]" style={{ fontSize: "clamp(9.5px,3.05cqw,16px)" }}>
          {COMMENTS.map((c, idx) => {
            const a = appear(t, c.at), r = appear(t, c.replyAt);
            // keep the frame uncluttered: the first thread slides away when the third arrives
            const out = idx === 0 ? appear(t, COMMENTS[2].at - 150, 350) : 0;
            const typing = t >= c.at + 250 && t < c.replyAt;
            if (a <= 0) return null;
            return (
              <div key={c.at} style={{ opacity: a * (1 - out), transform: `translateY(${(1 - a) * 12}px)`, maxHeight: out ? `${(1 - out) * 220}px` : undefined, overflow: out ? "hidden" : undefined }}>
                <div className="flex items-start gap-[2.5%]">
                  <span className="grid aspect-square w-[9%] shrink-0 place-items-center rounded-full font-bold text-white" style={{ background: c.tone, fontSize: "0.75em", filter: "blur(2.5px)" }}>{c.initials}</span>
                  <div className="rounded-[14px] bg-[#f0f2f5] px-[3.5%] py-[2%]">
                    <p className="font-semibold leading-tight" style={{ filter: "blur(4px)" }}>Hidden Name</p>
                    <p className="leading-snug">{c.text}</p>
                  </div>
                </div>
                {typing && (
                  <div className="ml-[11.5%] mt-[1.5%] flex items-center gap-[1.5%] text-[#65676b]" style={{ fontSize: "0.85em" }}>
                    <span className="inline-flex gap-[3px]">{[0, 1, 2].map((d) => <i key={d} className="inline-block h-[5px] w-[5px] rounded-full bg-[#1877f2]" style={{ opacity: 0.3 + 0.7 * Math.abs(Math.sin((t / 160) + d)) }} />)}</span>
                    AI is replying…
                  </div>
                )}
                {r > 0 && (
                  <div className="ml-[11.5%] mt-[1.5%] flex items-start gap-[2.5%]" style={{ opacity: r, transform: `translateX(${(1 - r) * 14}px)` }}>
                    <span className="grid aspect-square w-[8%] shrink-0 place-items-center rounded-full bg-gradient-to-br from-fuchsia-500 to-orange-400 font-bold text-white" style={{ fontSize: "0.65em" }}>GS</span>
                    <div className="rounded-[14px] bg-[#e7f3ff] px-[3.5%] py-[2%]">
                      <p className="font-semibold leading-tight">Glow Studio <span className="rounded bg-[#1877f2] px-1 text-[0.72em] text-white">Author</span></p>
                      <p className="leading-snug">{c.reply}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* stats bar */}
      <div className="absolute inset-x-[5%] bottom-[5%] grid grid-cols-3 gap-[2.5%] text-center" style={{ opacity: appear(t, 600, 300) }}>
        {[["Replied in", `${answered ? "2.1" : "—"}s`], ["Answered", `${answered}/3`], ["Moved to DM", `${answered}`]].map(([k, v]) => (
          <div key={k} className="rounded-[14px] border border-white/10 bg-white/[0.06] py-[4%]">
            <p className="font-display font-semibold text-white" style={{ fontSize: "clamp(13px,4.6cqw,26px)" }}>{v}</p>
            <p className="text-silver-400" style={{ fontSize: "clamp(8px,2.5cqw,13px)" }}>{k}</p>
          </div>
        ))}
      </div>

      {/* end card */}
      {end > 0 && (
        <div className="absolute inset-0 grid place-items-center bg-[#030b1e]/85 px-[8%] text-center backdrop-blur-sm" style={{ opacity: end }}>
          <div style={{ transform: `scale(${0.92 + end * 0.08})` }}>
            <p className="font-display font-semibold leading-tight" style={{ fontSize: "clamp(18px,7.4cqw,44px)" }}>Every comment.<br /><span className="bg-gradient-to-r from-cyan-300 to-electric-400 bg-clip-text text-transparent">Answered in seconds.</span></p>
            <p className="mt-[5%] text-silver" style={{ fontSize: "clamp(10px,3.4cqw,18px)" }}>AI replies + DM follow-up, 24/7</p>
            <p className="mt-[8%] inline-block rounded-full bg-electric px-[6%] py-[2.5%] font-semibold" style={{ fontSize: "clamp(10px,3.4cqw,18px)" }}>fahdaiservices.com</p>
          </div>
        </div>
      )}
      <p className="absolute bottom-[1.6%] left-0 right-0 text-center text-white/40" style={{ fontSize: "clamp(7px,2.1cqw,11px)" }}>Demo · names blurred · sample page</p>
    </div>
  );
}

/** Looping player for the website (uses the same deterministic frames). */
export function AutoReplyPlayer({ className = "" }: { className?: string }) {
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(true);
  const start = useRef<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    const tick = (now: number) => {
      if (start.current === null) start.current = now - t;
      const el = (now - start.current) % (SHORT_MS + 1200);
      setT(Math.min(el, SHORT_MS));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); start.current = null; };
  }, [playing]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div ref={ref} className={className} style={{ containerType: "inline-size" }}>
      <AutoReplyShort t={t} />
      <button onClick={() => setPlaying((p) => !p)} className="mt-3 w-full rounded-full border border-white/10 py-2 text-xs text-silver hover:text-white">{playing ? "Pause animation" : "Play animation"}</button>
    </div>
  );
}
