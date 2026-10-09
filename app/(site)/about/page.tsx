import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { StatCounter } from "@/components/StatCounter";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { Robot } from "@/components/Robot";
import { Icon } from "@/components/Icon";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description: "Fahd AI Services is an AI automation and business technology company helping businesses worldwide reduce repetitive work and respond faster.",
  alternates: { canonical: "/about" },
};

const PRINCIPLES = [
  { icon: "shield", title: "Reliable by default", text: "Every workflow ships with error handling, retries, a global error handler and alerts. If something breaks, you hear about it before your customers do." },
  { icon: "lock", title: "Security-conscious", text: "Secrets stay server-side, data access is role-based, and personal data is only collected with consent and kept to what is needed." },
  { icon: "user", title: "Humans stay in control", text: "AI handles the routine. Anything sensitive — medical, legal, complaints, payments — is handed to a person." },
  { icon: "chart", title: "Measured, not guessed", text: "We track what matters: response time, leads, bookings and failures, so you can see the system working." },
];

const STEPS = [
  ["Understand", "We learn how your business works today and where time is lost."],
  ["Design", "A written plan of the system: channels, data, automations and handoffs."],
  ["Build in stages", "Small working pieces you can test, instead of one big reveal."],
  ["Harden", "Edge cases, error paths, logging and security checks before launch."],
  ["Support", "Monitoring, fixes and improvements as your business grows."],
];

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About us" title={<>We build the systems that <span className="text-gradient">answer, follow up and report</span> for you</>}
        intro={`${SITE.name} is an AI automation and business technology company serving clients internationally. We design and build AI agents, n8n workflows, websites and custom software for growing businesses.`} />

      <section className="wrap" aria-label="Company milestones">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {SITE.stats.map((s) => <StatCounter key={s.label} {...s} />)}
        </div>
      </section>

      <section className="wrap mt-24 grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <SectionHeading eyebrow="Our mission" title="Less repetitive work. Faster replies. Connected systems." />
          <div className="mt-6 space-y-4 text-base leading-relaxed text-silver">
            <p>Most businesses don't lose customers because of their product. They lose them because a message went unanswered, a call was missed or a follow-up never happened.</p>
            <p>Our mission is to help businesses reduce repetitive work, improve customer response, connect the tools they already use and operate more efficiently through intelligent automation — without losing the human touch where it matters.</p>
            <p>Founded by {SITE.founder}, we work async-first with clients across time zones: clear written plans, recorded demos and dependable support.</p>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-sm">
          <div className="absolute inset-10 rounded-full bg-electric/25 blur-3xl" />
          <Robot className="relative w-full" interactive={false} />
        </div>
      </section>

      <section className="wrap mt-24">
        <SectionHeading eyebrow="How we work" title="Principles behind every build" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {PRINCIPLES.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.05}>
              <div className="card h-full p-6">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-electric/15 text-cyan ring-1 ring-cyan/20"><Icon name={p.icon} /></span>
                <h3 className="mt-4 font-display text-lg font-semibold text-white">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-silver-400">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="wrap mt-24">
        <SectionHeading eyebrow="Development process" title="From first message to long-term support" />
        <ol className="mt-10 grid gap-3 md:grid-cols-5">
          {STEPS.map(([t, d], i) => (
            <li key={t} className="card relative p-5">
              <span className="font-mono text-xs text-cyan">0{i + 1}</span>
              <h3 className="mt-2 font-display font-semibold text-white">{t}</h3>
              <p className="mt-1.5 text-sm text-silver-400">{d}</p>
            </li>
          ))}
        </ol>
        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/contact?type=consultation" className="btn-primary">Book a Consultation</Link>
          <Link href="/demos" className="btn-ghost">See our demos</Link>
        </div>
      </section>
    </>
  );
}
