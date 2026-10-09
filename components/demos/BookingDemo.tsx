"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Icon } from "@/components/Icon";
import { track } from "@/lib/track";

const SERVICES = [
  { id: "consult", name: "Consultation", mins: 30, price: "$40" },
  { id: "facial", name: "Signature facial", mins: 60, price: "$85" },
  { id: "laser", name: "Laser session", mins: 45, price: "$120" },
  { id: "follow", name: "Follow-up visit", mins: 20, price: "$25" },
];
const TIMES = ["09:30", "10:00", "11:30", "13:00", "14:30", "16:00", "17:30", "18:00"];

/** Booking flow with a seeded "busy" calendar. Shows the confirmation + reminder that the real system sends. */
export function BookingDemo() {
  const days = useMemo(() => Array.from({ length: 10 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i + 1); return d; }), []);
  const [step, setStep] = useState(0);
  const [svc, setSvc] = useState<string | null>(null);
  const [day, setDay] = useState<number | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const busy = (d: number, t: string) => ((d * 7 + t.charCodeAt(1) + t.charCodeAt(3)) % 3 === 0);
  const closed = (d: Date) => d.getDay() === 0;
  const fmt = (d: Date) => d.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" });
  const service = SERVICES.find((s) => s.id === svc);
  const go = (n: number) => { setStep(n); track("demo_interact", { slug: "appointment-booking" }); };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="card p-6 sm:p-8">
        <ol className="mb-6 flex gap-2" aria-label="Booking steps">
          {["Service", "Date & time", "Details", "Done"].map((s, i) => (
            <li key={s} className="flex-1"><div className={`h-1 rounded-full ${i <= step ? "bg-gradient-to-r from-electric to-cyan" : "bg-white/10"}`} /><p className={`mt-2 text-[11px] ${i <= step ? "text-white" : "text-silver-600"}`}>{s}</p></li>
          ))}
        </ol>
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
            {step === 0 && (
              <div>
                <h3 className="font-display text-xl font-semibold text-white">Choose a service</h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {SERVICES.map((s) => (
                    <button key={s.id} onClick={() => { setSvc(s.id); go(1); if (step === 0) track("demo_start", { slug: "appointment-booking" }); }}
                      className={`rounded-2xl border p-4 text-left transition hover:border-cyan/50 ${svc === s.id ? "border-cyan/60 bg-cyan/[0.06]" : "border-white/10 bg-white/[0.02]"}`}>
                      <p className="font-medium text-white">{s.name}</p><p className="mt-1 text-sm text-silver-400">{s.mins} min · {s.price}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {step === 1 && (
              <div>
                <h3 className="font-display text-xl font-semibold text-white">Pick a date and a free slot</h3>
                <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                  {days.map((d, i) => (
                    <button key={i} disabled={closed(d)} onClick={() => { setDay(i); setTime(null); }}
                      className={`min-w-[74px] rounded-xl border px-3 py-2.5 text-center text-sm transition disabled:cursor-not-allowed disabled:opacity-30 ${day === i ? "border-cyan/60 bg-cyan/10 text-white" : "border-white/10 text-silver hover:border-white/25"}`}>
                      <span className="block text-[11px] text-silver-400">{d.toLocaleDateString("en-US", { weekday: "short" })}</span>
                      <span className="font-semibold">{d.getDate()}</span>
                    </button>
                  ))}
                </div>
                {day !== null && (
                  <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {TIMES.map((t) => {
                      const b = busy(day, t);
                      return <button key={t} disabled={b} onClick={() => setTime(t)} className={`rounded-xl border py-2.5 text-sm transition ${b ? "border-white/5 text-silver-600 line-through" : time === t ? "border-electric bg-electric text-white" : "border-white/10 text-silver hover:border-cyan/50"}`}>{t}</button>;
                    })}
                  </div>
                )}
                <p className="mt-3 text-xs text-silver-600">Greyed slots are already booked in the calendar, so double-booking is impossible.</p>
                <div className="mt-6 flex gap-2"><button className="btn-ghost" onClick={() => go(0)}>Back</button><button className="btn-primary" disabled={day === null || !time} onClick={() => go(2)}>Continue</button></div>
              </div>
            )}
            {step === 2 && (
              <form onSubmit={(e) => { e.preventDefault(); if (name.trim().length > 1) { go(3); track("demo_complete", { slug: "appointment-booking" }); } }}>
                <h3 className="font-display text-xl font-semibold text-white">Your details</h3>
                <label className="label mt-4" htmlFor="bk-name">Name (demo only, not stored)</label>
                <input id="bk-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={40} className="field" placeholder="e.g. Sarah" autoFocus />
                <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-silver">
                  <p><b className="text-white">{service?.name}</b> · {service?.mins} min</p>
                  <p className="mt-1">{day !== null && fmt(days[day])} at {time}</p>
                </div>
                <div className="mt-6 flex gap-2"><button type="button" className="btn-ghost" onClick={() => go(1)}>Back</button><button className="btn-primary" disabled={name.trim().length < 2}>Request booking</button></div>
              </form>
            )}
            {step === 3 && (
              <div className="text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-400/15 text-emerald-300"><Icon name="check" className="h-8 w-8" /></div>
                <h3 className="mt-4 font-display text-xl font-semibold text-white">Booking request sent</h3>
                <p className="mx-auto mt-2 max-w-sm text-sm text-silver-400">In the live system the slot is held, the business confirms in one tap, and the customer gets the messages on the right automatically.</p>
                <button className="btn-ghost mt-6" onClick={() => { setStep(0); setSvc(null); setDay(null); setTime(null); setName(""); }}>Book another</button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.2em] text-silver-400">What the customer receives</p>
        {[
          { at: 3, title: "Instant confirmation", body: `Hi ${name || "there"}, your ${service?.name?.toLowerCase() || "appointment"} request for ${day !== null ? fmt(days[day]) : "your chosen day"} at ${time || "--:--"} is received. We'll confirm shortly.` },
          { at: 3, title: "Confirmed by the team", body: "Great news, your booking is confirmed ✅ Reply 1 to add it to your calendar." },
          { at: 3, title: "Reminder · 24 hours before", body: "Reminder: see you tomorrow. Reply R to reschedule." },
          { at: 3, title: "After the visit", body: "Thanks for visiting! Would you rate us? It takes 10 seconds ⭐" },
        ].map((m, i) => (
          <motion.div key={m.title} animate={{ opacity: step >= m.at ? 1 : 0.35 }} transition={{ delay: step >= m.at ? i * 0.35 : 0 }} className="rounded-2xl border border-white/10 bg-[#0b141a] p-4">
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-emerald-300"><Icon name="whatsapp" className="h-3.5 w-3.5" />{m.title}</p>
            <p className="mt-2 rounded-xl rounded-tl-sm bg-[#1f2c34] p-3 text-[13px] text-[#e9edef]">{m.body}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
