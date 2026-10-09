import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/PageHero";
import { ContactForm } from "@/components/ContactForm";
import { Icon } from "@/components/Icon";
import { getServices } from "@/lib/data";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Tell us about your project. Get a clear recommendation and a fixed quote for AI agents, automation, websites or custom software.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const services = await getServices();
  const options = services.map((s) => ({ value: s.slug, label: s.title }));
  return (
    <>
      <PageHero eyebrow="Contact us" title={<>Let's build something that <span className="text-gradient">works while you sleep</span></>}
        intro="Share a few details about your business and what you'd like to automate or build. You'll receive a reference number instantly and a personal reply soon after." />
      <section className="wrap grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <Suspense fallback={<div className="card h-[640px] animate-pulse" />}><ContactForm services={options} /></Suspense>
        <aside className="space-y-4">
          <div className="card p-6">
            <h2 className="font-display text-lg font-semibold text-white">Prefer a direct line?</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li><a className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-white hover:border-emerald-300/40" href={SITE.whatsappLink} target="_blank" rel="noopener noreferrer"><span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-400/15 text-emerald-300"><Icon name="whatsapp" className="h-4 w-4" /></span><span><span className="block text-xs text-silver-400">WhatsApp</span>{SITE.whatsapp}</span></a></li>
              <li><a className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-white hover:border-cyan/40" href={`mailto:${SITE.email}`}><span className="grid h-9 w-9 place-items-center rounded-lg bg-electric/15 text-cyan"><Icon name="mail" className="h-4 w-4" /></span><span><span className="block text-xs text-silver-400">Email</span>{SITE.email}</span></a></li>
            </ul>
          </div>
          <div className="card p-6">
            <h2 className="font-display text-lg font-semibold text-white">What happens next</h2>
            <ol className="mt-4 space-y-3 text-sm text-silver">
              {["You get a reference number right away.", "We review your request and reply, usually within one business day.", "A short async call or written Q&A to understand your needs.", "You receive a clear plan and fixed quote. No obligation."].map((t, i) => (
                <li key={t} className="flex gap-3"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-electric/20 font-mono text-[11px] text-cyan">{i + 1}</span>{t}</li>
              ))}
            </ol>
          </div>
          <div className="card flex items-start gap-3 p-5 text-xs text-silver-400"><Icon name="lock" className="h-4 w-4 shrink-0 text-cyan" />Your details are stored securely and only used to reply to this request. See our <a className="text-cyan underline" href="/privacy">privacy note</a>.</div>
        </aside>
      </section>
    </>
  );
}
