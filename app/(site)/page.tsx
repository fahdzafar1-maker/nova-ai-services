import Link from "next/link";
import { NeuralBg } from "@/components/NeuralBg";
import { SystemViz } from "@/components/SystemViz";
import { StatCounter } from "@/components/StatCounter";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { DemoCard } from "@/components/DemoCard";
import { Icon } from "@/components/Icon";
import { SITE, INDUSTRIES } from "@/lib/site";
import { CATEGORIES } from "@/lib/catalog";
import { getServices, getDemos } from "@/lib/data";

export const revalidate = 300;

const FLOW = [
  { icon: "chat", title: "A customer reaches out", text: "A WhatsApp message, phone call, form, comment or email arrives — day or night." },
  { icon: "spark", title: "AI understands it", text: "The agent reads the request, answers from your approved information and asks the right questions." },
  { icon: "nodes", title: "Workflows take action", text: "n8n updates the CRM, requests a booking, sends follow-ups and alerts your team." },
  { icon: "chart", title: "You see the results", text: "Leads, bookings and errors land in your dashboard and daily report. Nothing fails silently." },
];

const PROCESS = [
  { n: "01", title: "Discovery", text: "A short written or video call about your business, tools and the work you want off your plate." },
  { n: "02", title: "Plan & quote", text: "A clear scope, timeline and fixed price. You approve before any work starts." },
  { n: "03", title: "Build & test", text: "We build in stages, test with real scenarios and share progress demos." },
  { n: "04", title: "Launch & support", text: "Go live with monitoring and error alerts, plus ongoing support and improvements." },
];

export default async function Home() {
  const [services, demos] = await Promise.all([getServices(), getDemos()]);
  const featured = demos.filter((d) => d.featured).slice(0, 6);

  return (
    <>
      {/* HERO */}
      <section className="relative -mt-[72px] overflow-hidden pt-[72px]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_20%,rgba(43,143,255,.22),transparent_60%),radial-gradient(ellipse_60%_50%_at_10%_80%,rgba(61,216,255,.10),transparent_60%)]" />
        <div className="grid-bg absolute inset-0" />
        <NeuralBg />
        <div className="wrap relative grid items-center gap-10 pb-20 pt-10 lg:grid-cols-[1.05fr_1fr] lg:pb-28 lg:pt-16">
          <div>
            <Reveal>
              <p className="eyebrow">AI automation · intelligent business systems</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="h-display mt-5 text-[42px] leading-[1.02] sm:text-6xl lg:text-[72px]">
                Build Smarter.<br />
                <span className="text-gradient">Automate Faster.</span><br />
                Grow Without Limits.
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-silver">{SITE.description}</p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/services" className="btn-primary !px-6 !py-3.5 text-[15px]">Explore Our Solutions <Icon name="arrow" className="h-4 w-4" /></Link>
                <Link href="/demos" className="btn-ghost !px-6 !py-3.5 text-[15px]"><Icon name="play" className="h-4 w-4 text-cyan" /> Experience Live Demos</Link>
              </div>
            </Reveal>
            <Reveal delay={0.24}>
              <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-silver-400">
                {[["shield", "Error-handled workflows"], ["lock", "Security-conscious builds"], ["user", "Human handoff built in"]].map(([i, t]) => (
                  <li key={t} className="flex items-center gap-2"><Icon name={i} className="h-4 w-4 text-cyan" />{t}</li>
                ))}
              </ul>
            </Reveal>
          </div>
          <Reveal delay={0.1}><SystemViz /></Reveal>
        </div>
      </section>

      {/* STATS */}
      <section className="wrap relative -mt-6" aria-label="Company milestones">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {SITE.stats.map((s) => <StatCounter key={s.label} {...s} />)}
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="wrap mt-28">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading eyebrow="What we build" title={<>One partner for AI agents, automation <span className="text-gradient">and software</span></>} intro="From a single WhatsApp agent to a complete business system, every build is designed to be reliable, measurable and easy to run." />
          <Link href="/services" className="btn-ghost shrink-0">All products & services <Icon name="arrow" className="h-4 w-4" /></Link>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {CATEGORIES.map((c, i) => {
            const items = services.filter((s) => s.category === c.id).slice(0, 4);
            return (
              <Reveal key={c.id} delay={i * 0.05}>
                <Link href={`/services?category=${c.id}`} className="card group block h-full p-6 transition hover:border-cyan/30 sm:p-7">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-cyan">0{i + 1}</span>
                    <Icon name="arrow" className="h-5 w-5 text-silver-600 transition group-hover:translate-x-1 group-hover:text-cyan" />
                  </div>
                  <h3 className="mt-4 font-display text-2xl font-semibold text-white">{c.label}</h3>
                  <p className="mt-2 text-sm text-silver-400">{c.blurb}</p>
                  <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                    {items.map((s) => (
                      <li key={s.slug} className="flex items-start gap-2 text-sm text-silver"><Icon name={s.icon} className="mt-0.5 h-4 w-4 shrink-0 text-electric-400" />{s.title}</li>
                    ))}
                  </ul>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* DEMOS */}
      <section className="wrap mt-28">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading eyebrow="Selected demos" title="Don't imagine it. Try it." intro="Interactive demos of real systems we build. Every demo uses synthetic sample data." />
          <Link href="/demos" className="btn-ghost shrink-0">Open the demo gallery <Icon name="arrow" className="h-4 w-4" /></Link>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((d, i) => <Reveal key={d.slug} delay={i * 0.05}><DemoCard demo={d} /></Reveal>)}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative mt-28 overflow-hidden border-y border-white/[0.06] bg-night-900/60 py-24">
        <div className="grid-bg absolute inset-0 opacity-50" />
        <div className="wrap relative">
          <SectionHeading center eyebrow="How business automation works" title="From message to result, without manual steps" />
          <ol className="relative mt-14 grid gap-5 md:grid-cols-4">
            <div aria-hidden="true" className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-cyan/40 to-transparent md:block" />
            {FLOW.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.08}>
                <li className="relative h-full">
                  <div className="relative mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-cyan/30 bg-night-950 text-cyan shadow-glow"><Icon name={f.icon} className="h-7 w-7" /></div>
                  <div className="card mt-5 h-[calc(100%-84px)] p-5 text-center">
                    <p className="font-mono text-[11px] text-silver-600">STEP {i + 1}</p>
                    <h3 className="mt-1 font-display text-lg font-semibold text-white">{f.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-silver-400">{f.text}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="wrap mt-28">
        <SectionHeading center eyebrow="Industries served" title="Built for businesses that talk to customers all day" />
        <ul className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-2.5">
          {INDUSTRIES.map((ind) => <li key={ind} className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-silver transition hover:border-cyan/40 hover:text-white">{ind}</li>)}
        </ul>
      </section>

      {/* PROCESS */}
      <section className="wrap mt-28">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading eyebrow="Simple onboarding" title="A clear path from idea to a working system" intro="You always know what is being built, what it costs and when it goes live. We work async-first, with written updates and recorded demos." />
          <ol className="grid gap-4 sm:grid-cols-2">
            {PROCESS.map((p, i) => (
              <Reveal key={p.n} delay={i * 0.06}>
                <li className="card h-full p-6">
                  <span className="font-display text-3xl font-semibold text-transparent [-webkit-text-stroke:1px_rgba(61,216,255,.6)]">{p.n}</span>
                  <h3 className="mt-3 font-display text-lg font-semibold text-white">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-silver-400">{p.text}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="wrap mt-28">
        <div className="relative overflow-hidden rounded-3xl border border-cyan/20 bg-gradient-to-br from-electric/25 via-night-800 to-night-900 p-8 sm:p-14">
          <NeuralBg density={24} className="opacity-60" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <h2 className="h-display text-3xl sm:text-4xl">Ready to put repetitive work on autopilot?</h2>
              <p className="mt-4 max-w-xl text-silver">Tell us about your business. You'll get a clear recommendation and a fixed quote, with no obligation.</p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link href="/contact?type=consultation" className="btn-primary !px-6 !py-3.5">Book a Consultation</Link>
              <a href={SITE.whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-ghost !px-6 !py-3.5"><Icon name="whatsapp" className="h-4 w-4 text-emerald-300" /> WhatsApp us</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
