"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { BUDGETS, SITE } from "@/lib/site";
import { Icon } from "./Icon";
import { track } from "@/lib/track";

type Option = { value: string; label: string };
type Errors = Partial<Record<string, string>>;

function validate(f: Record<string, string | boolean>): Errors {
  const e: Errors = {};
  if (String(f.name).trim().length < 2) e.name = "Please enter your full name";
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(f.email).trim())) e.email = "Please enter a valid email address";
  if (!/^\+?[0-9][0-9\s\-()]{6,20}$/.test(String(f.phone).trim())) e.phone = "Include your country code, e.g. +1 555 123 4567";
  if (!String(f.service)) e.service = "Please choose a service";
  if (String(f.message).trim().length < 10) e.message = "Tell us a little more (at least 10 characters)";
  if (!f.consent) e.consent = "Please allow us to contact you about this request";
  return e;
}

export function ContactForm({ services }: { services: Option[] }) {
  const params = useSearchParams();
  const preService = services.find((s) => s.value === params.get("service"))?.label ?? "";
  const isConsult = params.get("type") === "consultation";
  const [f, setF] = useState<Record<string, string | boolean>>({
    name: "", email: "", phone: "", company: "", service: preService || (isConsult ? "Free consultation" : ""), budget: "", message: "", consent: false, website: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [serverMsg, setServerMsg] = useState("");
  const [reference, setReference] = useState("");
  const started = useRef<number | null>(null);
  const firstField = useRef<HTMLInputElement>(null);

  useEffect(() => { if (preService || isConsult) firstField.current?.focus({ preventScroll: true }); }, [preService, isConsult]);

  const set = (k: string, v: string | boolean) => {
    if (!started.current) { started.current = Date.now(); track("form_start"); }
    setF((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }));
  };

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate(f);
    setErrors(e);
    if (Object.keys(e).length) {
      document.getElementById(`f-${Object.keys(e)[0]}`)?.focus();
      return;
    }
    setState("sending"); setServerMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, kind: isConsult || f.service === "Free consultation" ? "consultation" : "inquiry", startedAt: started.current ?? undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok && data.reference) {
        setReference(data.reference); setState("done");
        track("form_submit", { service: String(f.service).slice(0, 60) });
        try { const d = sessionStorage.getItem("fai_last_demo"); if (d) track("demo_lead", { slug: d }); } catch { /* ignore */ }
      } else {
        if (data.fieldErrors) setErrors(data.fieldErrors);
        setServerMsg(data.error || "Something went wrong. Please try again."); setState("error");
      }
    } catch {
      setServerMsg("Network error. Your request was not sent — please try again or contact us on WhatsApp."); setState("error");
    }
  }

  if (state === "done") {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="card p-8 text-center sm:p-12" role="status">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-300/30"><Icon name="check" className="h-8 w-8" /></div>
        <h2 className="mt-6 font-display text-2xl font-semibold text-white">Request received</h2>
        <p className="mx-auto mt-3 max-w-md text-silver">Thank you, {String(f.name).split(" ")[0]}. Your request has been saved and {SITE.founder} will reply by email{f.phone ? " or WhatsApp" : ""}, usually within one business day.</p>
        <div className="mx-auto mt-6 w-fit rounded-xl border border-cyan/30 bg-cyan/[0.06] px-5 py-3">
          <p className="text-[11px] uppercase tracking-[0.2em] text-silver-400">Your reference number</p>
          <p className="mt-1 font-mono text-lg font-semibold text-cyan-300">{reference}</p>
        </div>
        <p className="mt-6 text-sm text-silver-400">Need it faster? <a href={SITE.whatsappLink} className="text-cyan underline" target="_blank" rel="noopener noreferrer">Message us on WhatsApp</a> and mention your reference.</p>
      </motion.div>
    );
  }

  const err = (k: string) => errors[k] ? <p id={`e-${k}`} className="mt-1.5 text-xs text-rose-300">{errors[k]}</p> : null;
  const aria = (k: string) => ({ "aria-invalid": Boolean(errors[k]) || undefined, "aria-describedby": errors[k] ? `e-${k}` : undefined });

  return (
    <form onSubmit={submit} noValidate className="card space-y-5 p-6 sm:p-8" aria-describedby="form-note">
      <div className="grid gap-5 sm:grid-cols-2">
        <div><label htmlFor="f-name" className="label">Full name *</label><input ref={firstField} id="f-name" autoComplete="name" className="field" value={String(f.name)} onChange={(e) => set("name", e.target.value)} {...aria("name")} />{err("name")}</div>
        <div><label htmlFor="f-email" className="label">Email address *</label><input id="f-email" type="email" autoComplete="email" className="field" value={String(f.email)} onChange={(e) => set("email", e.target.value)} {...aria("email")} />{err("email")}</div>
        <div><label htmlFor="f-phone" className="label">Phone with country code *</label><input id="f-phone" type="tel" autoComplete="tel" placeholder="+971 50 123 4567" className="field" value={String(f.phone)} onChange={(e) => set("phone", e.target.value)} {...aria("phone")} />{err("phone")}</div>
        <div><label htmlFor="f-company" className="label">Company name (optional)</label><input id="f-company" autoComplete="organization" className="field" value={String(f.company)} onChange={(e) => set("company", e.target.value)} /></div>
        <div>
          <label htmlFor="f-service" className="label">Service of interest *</label>
          <select id="f-service" className="field" value={String(f.service)} onChange={(e) => set("service", e.target.value)} {...aria("service")}>
            <option value="">Choose a service…</option>
            <option>Free consultation</option>
            {services.map((s) => <option key={s.value} value={s.label}>{s.label}</option>)}
            <option>Something else</option>
          </select>{err("service")}
        </div>
        <div>
          <label htmlFor="f-budget" className="label">Project budget (optional)</label>
          <select id="f-budget" className="field" value={String(f.budget)} onChange={(e) => set("budget", e.target.value)}>
            <option value="">Prefer not to say</option>
            {BUDGETS.map((b) => <option key={b}>{b}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="f-message" className="label">Message or project requirements *</label>
        <textarea id="f-message" rows={5} maxLength={4000} className="field resize-y" placeholder="What does your business do, and what would you like to automate or build?" value={String(f.message)} onChange={(e) => set("message", e.target.value)} {...aria("message")} />
        {err("message")}
      </div>
      {/* Honeypot: hidden from people, visible to bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="f-website">Website</label><input id="f-website" tabIndex={-1} autoComplete="off" value={String(f.website)} onChange={(e) => set("website", e.target.value)} />
      </div>
      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-silver">
          <input id="f-consent" type="checkbox" className="mt-0.5 h-4 w-4 rounded border-white/20 bg-night-950 accent-[#2B8FFF]" checked={Boolean(f.consent)} onChange={(e) => set("consent", e.target.checked)} {...aria("consent")} />
          <span>I agree that {SITE.name} may store these details and contact me about this request by email, phone or WhatsApp.</span>
        </label>
        {err("consent")}
      </div>
      {state === "error" && <div role="alert" className="rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{serverMsg}</div>}
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <button type="submit" disabled={state === "sending"} className="btn-primary !px-7 !py-3.5">
          {state === "sending" ? (<><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> Sending…</>) : (<>Send request <Icon name="send" className="h-4 w-4" /></>)}
        </button>
        <p id="form-note" className="text-xs text-silver-600">We only show a confirmation after your request is safely saved.</p>
      </div>
    </form>
  );
}
