import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { DemoCard } from "@/components/DemoCard";
import { Icon } from "@/components/Icon";
import { SOLUTIONS, getSolution } from "@/lib/solutions";
import { DEFAULT_DEMOS } from "@/lib/catalog";
import { SITE } from "@/lib/site";

export const dynamicParams = false;
export function generateStaticParams() { return SOLUTIONS.map((s) => ({ slug: s.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = getSolution(slug);
  if (!s) return { title: "Not found" };
  return {
    title: { absolute: s.metaTitle },
    description: s.metaDescription,
    alternates: { canonical: `/solutions/${s.slug}` },
    openGraph: { title: s.metaTitle, description: s.metaDescription, url: `/solutions/${s.slug}`, images: [{ url: "/og.png", width: 1200, height: 630, alt: SITE.name }] },
  };
}

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getSolution(slug);
  if (!s) notFound();
  const demo = DEFAULT_DEMOS.find((d) => d.slug === s.demoSlug);
  const related = s.related.map(getSolution).filter((x): x is NonNullable<typeof x> => Boolean(x));
  const wa = `${SITE.whatsappLink}?text=${encodeURIComponent(`Hi, I'm interested in: ${s.h1}`)}`;
  const base = SITE.url.replace(/\/$/, "");

  const jsonLd = [
    {
      "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: s.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
    {
      "@context": "https://schema.org", "@type": "Service",
      name: s.h1, description: s.metaDescription, url: `${base}/solutions/${s.slug}`, areaServed: "Worldwide",
      provider: { "@type": "Organization", name: SITE.name, url: base },
    },
    {
      "@context": "https://schema.org", "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: base },
        { "@type": "ListItem", position: 2, name: "Solutions", item: `${base}/solutions` },
        { "@type": "ListItem", position: 3, name: s.h1, item: `${base}/solutions/${s.slug}` },
      ],
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero eyebrow={s.eyebrow} title={s.h1} intro={s.intro}>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-primary"><Icon name="whatsapp" className="h-4 w-4" /> Chat on WhatsApp</a>
          <Link href={`/demos/${s.demoSlug}`} className="btn-ghost">Try the live demo</Link>
        </div>
        <nav aria-label="Breadcrumb" className="mt-8 text-sm text-silver-400">
          <Link href="/" className="hover:text-white">Home</Link> <span className="mx-1.5">/</span>
          <Link href="/solutions" className="hover:text-white">Solutions</Link> <span className="mx-1.5">/</span>
          <span className="text-silver">{s.h1}</span>
        </nav>
      </PageHero>

      {/* Problem */}
      <section className="wrap mt-6">
        <div className="max-w-3xl">
          <p className="eyebrow">The problem</p>
          <h2 className="h-display mt-3 text-3xl leading-[1.1] sm:text-4xl">{s.problem.title}</h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-silver">{s.problem.paragraphs.map((p) => <p key={p.slice(0, 30)}>{p}</p>)}</div>
        </div>
      </section>

      {/* Solution */}
      <section className="wrap mt-24">
        <div className="max-w-3xl">
          <p className="eyebrow">The solution</p>
          <h2 className="h-display mt-3 text-3xl leading-[1.1] sm:text-4xl">{s.solution.title}</h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-silver">{s.solution.paragraphs.map((p) => <p key={p.slice(0, 30)}>{p}</p>)}</div>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {s.solution.features.map((f) => (
            <div key={f.title} className="card h-full p-6">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-electric/15 text-cyan ring-1 ring-cyan/20"><Icon name={s.icon} className="h-5 w-5" /></span>
              <h3 className="mt-4 font-display text-lg font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-silver-400">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="wrap mt-24">
        <SectionHeading eyebrow="How it works" title="From first message to live system" />
        <ol className="mt-10 grid gap-3 md:grid-cols-4">
          {s.steps.map((st, i) => (
            <li key={st.title} className="card p-5">
              <span className="font-mono text-xs text-cyan">0{i + 1}</span>
              <h3 className="mt-2 font-display font-semibold text-white">{st.title}</h3>
              <p className="mt-1.5 text-sm text-silver-400">{st.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Demo + fit */}
      <section className="wrap mt-24 grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <div>
          <SectionHeading eyebrow="See it working" title="Try the live demo" intro="No sign-up. Synthetic sample data only." />
          {s.demoNote && <p className="mt-4 text-sm leading-relaxed text-silver-400">{s.demoNote}</p>}
          {demo && <div className="mt-6 max-w-md"><DemoCard demo={demo} /></div>}
        </div>
        <div className="space-y-4">
          <div className="card p-6">
            <h2 className="font-display text-lg font-semibold text-white">Who this is for</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-silver">
              {s.fit.map((f) => <li key={f} className="flex gap-2.5"><Icon name="shield" className="mt-0.5 h-4 w-4 shrink-0 text-cyan" />{f}</li>)}
            </ul>
          </div>
          <div className="card p-6">
            <h2 className="font-display text-lg font-semibold text-white">Tools we use</h2>
            <div className="mt-4 flex flex-wrap gap-1.5">{s.tools.map((t) => <span key={t} className="chip">{t}</span>)}</div>
          </div>
        </div>
      </section>

      {s.extra && (
        <section className="wrap mt-24">
          <div className="max-w-3xl">
            <h2 className="h-display text-3xl leading-[1.1] sm:text-4xl">{s.extra.title}</h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-silver">{s.extra.paragraphs.map((p) => <p key={p.slice(0, 30)}>{p}</p>)}</div>
          </div>
        </section>
      )}

      {/* FAQs */}
      <section className="wrap mt-24">
        <SectionHeading eyebrow="FAQ" title="Frequently asked questions" />
        <div className="mt-8 max-w-3xl space-y-3">
          {s.faqs.map((f) => (
            <details key={f.q} className="card group p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display font-semibold text-white">
                <h3 className="text-base">{f.q}</h3>
                <span className="text-cyan transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-silver">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="wrap mt-20">
        <div className="relative overflow-hidden rounded-3xl border border-cyan/20 bg-gradient-to-br from-electric/20 via-night-800 to-night-900 p-8 sm:p-10">
          <div className="grid items-center gap-6 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <h2 className="h-display text-2xl sm:text-3xl">Want this for your business?</h2>
              <p className="mt-2 text-silver">Tell us how you work today. You get a clear plan and a fixed quote, with no obligation.</p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-primary"><Icon name="whatsapp" className="h-4 w-4" /> WhatsApp us</a>
              <Link href={`/contact?service=${s.serviceSlug}`} className="btn-ghost">Send an enquiry</Link>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="wrap mt-20">
          <h2 className="h-display text-2xl">Related solutions</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <Link key={r.slug} href={`/solutions/${r.slug}`} className="card group p-6 transition hover:-translate-y-1 hover:border-cyan/30">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-silver-400">{r.eyebrow}</p>
                <h3 className="mt-1.5 font-display text-lg font-semibold text-white">{r.h1}</h3>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan">Learn more <Icon name="arrow" className="h-4 w-4 transition group-hover:translate-x-1" /></span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
