import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Icon } from "@/components/Icon";
import { SOLUTIONS } from "@/lib/solutions";

export const metadata: Metadata = {
  title: "Solutions by Industry",
  description: "AI receptionists, WhatsApp chatbots, voice agents, n8n automation, CRM follow-up and websites with AI, built for clinics, real estate, home services, restaurants and small businesses.",
  alternates: { canonical: "/solutions" },
};

export default function SolutionsPage() {
  return (
    <>
      <PageHero eyebrow="Solutions" title={<>AI and automation <span className="text-gradient">built for your industry</span></>}
        intro="Pick the problem you want solved. Each solution comes with a live demo you can try before talking to us." />
      <section className="wrap">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SOLUTIONS.map((s) => (
            <Link key={s.slug} href={`/solutions/${s.slug}`} className="card group flex h-full flex-col p-6 transition hover:-translate-y-1 hover:border-cyan/30">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-electric/15 text-cyan ring-1 ring-cyan/20"><Icon name={s.icon} /></span>
              <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-silver-400">{s.eyebrow}</p>
              <h2 className="mt-1.5 font-display text-lg font-semibold text-white">{s.h1}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-silver-400">{s.metaDescription}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan">Learn more <Icon name="arrow" className="h-4 w-4 transition group-hover:translate-x-1" /></span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
