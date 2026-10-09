"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CATEGORIES, type Service } from "@/lib/catalog";
import { Icon } from "./Icon";
import { track } from "@/lib/track";

export function ServicesExplorer({ services, demoTitles }: { services: Service[]; demoTitles: Record<string, string> }) {
  const params = useSearchParams();
  const router = useRouter();
  const initial = params.get("category") || "all";
  const [cat, setCat] = useState<string>(CATEGORIES.some((c) => c.id === initial) ? initial : "all");
  const [q, setQ] = useState("");
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return services.filter((s) => (cat === "all" || s.category === cat) && (!t || `${s.title} ${s.summary} ${s.benefits.join(" ")}`.toLowerCase().includes(t)));
  }, [services, cat, q]);

  const choose = (id: string) => {
    setCat(id);
    router.replace(id === "all" ? "/services" : `/services?category=${id}`, { scroll: false });
    track("service_filter", { category: id });
  };

  return (
    <div>
      <div className="sticky top-[72px] z-30 -mx-4 border-b border-white/[0.06] bg-night-950/85 px-4 py-4 backdrop-blur-xl sm:mx-0 sm:rounded-2xl sm:border sm:px-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div role="tablist" aria-label="Service categories" className="flex gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            {[{ id: "all", label: "All" }, ...CATEGORIES].map((c) => (
              <button key={c.id} role="tab" aria-selected={cat === c.id} onClick={() => choose(c.id)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${cat === c.id ? "bg-white text-night-950" : "border border-white/10 text-silver hover:border-white/25 hover:text-white"}`}>
                {c.label}
              </button>
            ))}
          </div>
          <label className="relative lg:ml-auto lg:w-72">
            <span className="sr-only">Search services</span>
            <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-silver-600" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search services…" className="field !rounded-full !py-2.5 !pl-10" />
          </label>
        </div>
      </div>

      <p className="mt-6 text-sm text-silver-400" aria-live="polite">{list.length} {list.length === 1 ? "service" : "services"}{cat !== "all" ? ` in ${CATEGORIES.find((c) => c.id === cat)?.label}` : ""}{q ? ` matching “${q}”` : ""}</p>

      <motion.div layout className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {list.map((s) => {
            const open = openSlug === s.slug;
            return (
              <motion.article layout key={s.slug} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.25 }}
                className="card flex flex-col p-6">
                <div className="flex items-start gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-electric/30 to-cyan/10 text-cyan ring-1 ring-cyan/20"><Icon name={s.icon} className="h-6 w-6" /></span>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-silver-600">{CATEGORIES.find((c) => c.id === s.category)?.label}</p>
                    <h2 className="mt-1 font-display text-lg font-semibold leading-snug text-white">{s.title}</h2>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-silver-400">{s.summary}</p>
                <button onClick={() => { const n = open ? null : s.slug; setOpenSlug(n); if (n) track("service_view", { slug: s.slug }); }}
                  aria-expanded={open} className="mt-4 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-silver hover:text-white">
                  {open ? "Hide benefits" : "Business benefits"} <span className={`transition ${open ? "rotate-90" : ""}`}><Icon name="arrow" className="h-3.5 w-3.5" /></span>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="mt-3 space-y-2">
                        {s.benefits.map((b) => <li key={b} className="flex items-start gap-2 text-sm text-silver"><Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />{b}</li>)}
                      </div>
                    </motion.ul>
                  )}
                </AnimatePresence>
                <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
                  <Link href={`/contact?service=${s.slug}`} onClick={() => track("service_request_click", { slug: s.slug })} className="btn-primary !py-2.5">Request This Service</Link>
                  {s.demo_slug && demoTitles[s.demo_slug] && (
                    <Link href={`/demos/${s.demo_slug}`} className="btn-ghost !py-2.5" title={demoTitles[s.demo_slug]}><Icon name="play" className="h-3.5 w-3.5 text-cyan" /> See demo</Link>
                  )}
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </motion.div>
      {list.length === 0 && (
        <div className="card mt-6 p-10 text-center text-silver-400">
          No services match that search. <button className="text-cyan underline" onClick={() => { setQ(""); choose("all"); }}>Clear filters</button> or <Link className="text-cyan underline" href="/contact">tell us what you need</Link>.
        </div>
      )}
    </div>
  );
}
