import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Icon } from "@/components/Icon";
import { POSTS } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description: "Practical guides on AI receptionists, WhatsApp chatbots, n8n automation and business websites: costs, setup and what actually works for small businesses.",
  alternates: { canonical: "/blog" },
};

const fmt = (d: string) => new Date(`${d}T00:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });

export default function BlogPage() {
  return (
    <>
      <PageHero eyebrow="Blog" title={<>Guides on AI and automation, <span className="text-gradient">in plain language</span></>}
        intro="What things cost, how they work and how to decide. Written from real builds, with sources." />
      <section className="wrap">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="card group flex h-full flex-col p-6 transition hover:-translate-y-1 hover:border-cyan/30">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-silver-400"><time dateTime={p.date}>{fmt(p.date)}</time> · {p.readMins} min read</p>
              <h2 className="mt-2 font-display text-lg font-semibold text-white">{p.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-silver-400">{p.excerpt}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan">Read article <Icon name="arrow" className="h-4 w-4 transition group-hover:translate-x-1" /></span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
