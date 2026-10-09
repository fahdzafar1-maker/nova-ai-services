import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDemos, getServices } from "@/lib/data";
import { DEFAULT_DEMOS } from "@/lib/catalog";
import { DemoStage } from "@/components/demos/registry";
import { DemoViewTracker } from "@/components/demos/DemoViewTracker";
import { DemoCard } from "@/components/DemoCard";
import { Icon } from "@/components/Icon";

export const revalidate = 300;
export function generateStaticParams() { return DEFAULT_DEMOS.map((d) => ({ slug: d.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const d = (await getDemos()).find((x) => x.slug === slug);
  if (!d) return { title: "Demo not found" };
  return { title: `${d.title} — Live Demo`, description: d.summary, alternates: { canonical: `/demos/${d.slug}` }, openGraph: { title: `${d.title} · Live demo`, description: d.summary } };
}

export default async function DemoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [demos, services] = await Promise.all([getDemos(), getServices()]);
  const demo = demos.find((d) => d.slug === slug);
  if (!demo) notFound();
  const related = services.filter((s) => s.demo_slug === slug).slice(0, 3);
  const more = demos.filter((d) => d.slug !== slug && d.featured).slice(0, 3);
  return (
    <>
      <DemoViewTracker slug={slug} />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(43,143,255,.16),transparent_65%)]" />
        <div className="wrap relative pb-8 pt-10">
          <nav aria-label="Breadcrumb" className="text-sm text-silver-400"><Link href="/demos" className="hover:text-white">Demos</Link> <span className="mx-1.5">/</span> <span className="text-silver">{demo.title}</span></nav>
          <div className="mt-6 grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end">
            <div>
              <p className="eyebrow">{demo.category}</p>
              <h1 className="h-display mt-3 text-4xl leading-[1.05] sm:text-5xl">{demo.title}</h1>
              <p className="mt-4 max-w-2xl text-lg text-silver">{demo.summary}</p>
            </div>
            <div className="card p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-silver-400">Use case</p>
              <p className="mt-2 text-sm leading-relaxed text-silver">{demo.use_case}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">{demo.tags.map((t) => <span key={t} className="chip">{t}</span>)}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap">
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-amber-300/20 bg-amber-300/[0.05] px-4 py-2.5 text-xs text-amber-100/90">
          <Icon name="shield" className="h-4 w-4 shrink-0" /> Isolated demo · synthetic sample data · nothing you type here is stored or sent.
        </div>
        <DemoStage slug={slug} />
      </section>

      <section className="wrap mt-16">
        <div className="relative overflow-hidden rounded-3xl border border-cyan/20 bg-gradient-to-br from-electric/20 via-night-800 to-night-900 p-8 sm:p-10">
          <div className="grid items-center gap-6 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <h2 className="h-display text-2xl sm:text-3xl">Want this for your business?</h2>
              <p className="mt-2 text-silver">We tailor it to your brand, your tools and your customers{related.length ? `: ${related.map((r) => r.title).join(", ")}` : ""}.</p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link href={`/contact?service=${related[0]?.slug ?? ""}`} className="btn-primary">Request This Service</Link>
              <Link href="/contact?type=consultation" className="btn-ghost">Book a Consultation</Link>
            </div>
          </div>
        </div>
      </section>

      {more.length > 0 && (
        <section className="wrap mt-20">
          <h2 className="h-display text-2xl">More demos</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{more.map((d) => <DemoCard key={d.slug} demo={d} />)}</div>
        </section>
      )}
    </>
  );
}
