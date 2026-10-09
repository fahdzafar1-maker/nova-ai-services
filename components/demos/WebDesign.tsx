"use client";
import Image from "next/image";
import { useState } from "react";
import { Icon } from "@/components/Icon";
import { track } from "@/lib/track";

export const SITES = [
  { id: "northbrook", name: "Northbrook Properties", type: "Real estate portal", img: "/demos/sites/northbrook.jpg", href: "/demos/sites/northbrook.html",
    features: ["Dusk-skyline animated hero", "Search by city, type, beds & budget", "Currency + area-unit switcher", "Installment calculator", "AI agent “Nora” + admin dashboard"] },
  { id: "aurelle", name: "Aurelle Aesthetics", type: "Luxury skin & aesthetics clinic", img: "/demos/sites/aurelle.jpg", href: "/demos/sites/aurelle.html",
    features: ["Living “serum” canvas hero", "Bento treatment grid", "Priced menu with currency switch", "4-step guided online booking", "AI concierge “Aria” + CRM dashboard"] },
  { id: "noor", name: "Noor Skin Studio", type: "Editorial dermatology clinic", img: "/demos/sites/noor.jpg", href: "/demos/sites/noor.html",
    features: ["Editorial serif design", "Filterable treatment & price menu", "Skin-concern finder quiz", "Doctor profiles", "Appointment request form"] },
];

export function WebDesignShowcase() {
  const [active, setActive] = useState(SITES[0].id);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const site = SITES.find((s) => s.id === active)!;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {SITES.map((s) => (
          <button key={s.id} onClick={() => { setActive(s.id); track("demo_interact", { slug: "web-design-showcase" }); }} aria-pressed={active === s.id}
            className={`card group overflow-hidden text-left transition ${active === s.id ? "!border-cyan/50 ring-1 ring-cyan/30" : "hover:border-white/20"}`}>
            <div className="relative aspect-[16/10] overflow-hidden"><Image src={s.img} alt={`${s.name} homepage`} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover object-top transition duration-500 group-hover:scale-[1.03]" /></div>
            <div className="p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-silver-400">{s.type}</p>
              <p className="mt-1 font-display font-semibold text-white">{s.name}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b border-white/[0.07] px-4 py-3">
          <span className="flex gap-1.5"><i className="h-3 w-3 rounded-full bg-rose-400/70" /><i className="h-3 w-3 rounded-full bg-amber-300/70" /><i className="h-3 w-3 rounded-full bg-emerald-400/70" /></span>
          <span className="truncate rounded-lg bg-white/[0.05] px-3 py-1 text-xs text-silver">{site.name.toLowerCase().replace(/\s+/g, "")}.demo</span>
          <div className="ml-auto flex items-center gap-1 rounded-lg bg-white/[0.04] p-1">
            {(["desktop", "mobile"] as const).map((d) => <button key={d} onClick={() => setDevice(d)} aria-pressed={device === d} className={`rounded-md px-3 py-1 text-xs capitalize ${device === d ? "bg-white text-night-950" : "text-silver"}`}>{d}</button>)}
          </div>
          <a href={site.href} target="_blank" rel="noopener" onClick={() => track("demo_complete", { slug: "web-design-showcase" })} className="btn-primary !py-1.5 !text-xs">Open full site <Icon name="external" className="h-3.5 w-3.5" /></a>
        </div>
        <div className="grid place-items-center bg-night-950 p-3 sm:p-5">
          <iframe key={site.id + device} src={site.href} title={`${site.name} live demo`} loading="lazy"
            className={`rounded-xl border border-white/10 bg-white transition-all ${device === "mobile" ? "h-[680px] w-[390px] max-w-full" : "h-[640px] w-full"}`} />
        </div>
        <div className="grid gap-4 border-t border-white/[0.07] p-5 sm:grid-cols-[1fr_auto] sm:items-center">
          <ul className="flex flex-wrap gap-2">{site.features.map((f) => <li key={f} className="chip !text-xs">{f}</li>)}</ul>
          <p className="text-xs text-silver-600">Demo website · sample content · built by Fahd AI Services</p>
        </div>
      </div>
    </div>
  );
}

export function WebAppAdmin() {
  const [which, setWhich] = useState<"aurelle" | "northbrook">("aurelle");
  const href = `/demos/sites/${which}.html#dashboard`;
  return (
    <div className="card overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 border-b border-white/[0.07] px-4 py-3">
        <p className="text-sm font-medium text-white">Custom admin app</p>
        <div className="flex items-center gap-1 rounded-lg bg-white/[0.04] p-1">
          {([["aurelle", "Clinic front desk"], ["northbrook", "Real estate CRM"]] as const).map(([k, l]) => <button key={k} onClick={() => setWhich(k)} aria-pressed={which === k} className={`rounded-md px-3 py-1 text-xs ${which === k ? "bg-white text-night-950" : "text-silver"}`}>{l}</button>)}
        </div>
        <a href={href} target="_blank" rel="noopener" className="btn-ghost ml-auto !py-1.5 !text-xs">Open in new tab <Icon name="external" className="h-3.5 w-3.5" /></a>
      </div>
      <iframe key={which} src={href} title="Admin dashboard demo" loading="lazy" className="h-[720px] w-full bg-white" />
      <p className="border-t border-white/[0.07] px-5 py-3 text-xs text-silver-600">KPIs, CRM sheet with search/sort, conversation drawer and automatic reminders · generated sample data.</p>
    </div>
  );
}
