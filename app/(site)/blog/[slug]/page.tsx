import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Icon";
import { DemoCard } from "@/components/DemoCard";
import { POSTS, getPost, type Block } from "@/lib/posts";
import { getSolution } from "@/lib/solutions";
import { DEFAULT_DEMOS } from "@/lib/catalog";
import { SITE } from "@/lib/site";

export const dynamicParams = false;
export function generateStaticParams() { return POSTS.map((p) => ({ slug: p.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) return { title: "Not found" };
  return {
    title: { absolute: p.metaTitle },
    description: p.metaDescription,
    alternates: { canonical: `/blog/${p.slug}` },
    openGraph: { type: "article", title: p.metaTitle, description: p.metaDescription, url: `/blog/${p.slug}`, publishedTime: p.date, modifiedTime: p.updated ?? p.date, images: [{ url: "/og.png", width: 1200, height: 630, alt: SITE.name }] },
  };
}

// Renders **bold** and [text](href) inside a string.
function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**")) return <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
        const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (m) {
          const [, label, href] = m;
          return href.startsWith("/")
            ? <Link key={i} href={href} className="text-cyan underline underline-offset-2 hover:text-white">{label}</Link>
            : <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="text-cyan underline underline-offset-2 hover:text-white">{label}</a>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

function BlockView({ b }: { b: Block }) {
  switch (b.type) {
    case "h2": return <h2 className="h-display mt-12 text-2xl sm:text-3xl">{b.text}</h2>;
    case "h3": return <h3 className="mt-8 font-display text-lg font-semibold text-white">{b.text}</h3>;
    case "p": return <p className="mt-4 leading-relaxed text-silver"><Rich text={b.text} /></p>;
    case "ul": return <ul className="mt-4 space-y-2.5">{b.items.map((it) => <li key={it.slice(0, 40)} className="flex gap-2.5 leading-relaxed text-silver"><span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan" /><span><Rich text={it} /></span></li>)}</ul>;
    case "callout": return <div className="card mt-6 border-cyan/25 p-5 leading-relaxed text-silver"><Rich text={b.text} /></div>;
    case "table": return (
      <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[560px] text-left text-sm">
          {b.caption && <caption className="px-4 pt-4 text-left text-xs font-semibold uppercase tracking-[0.15em] text-silver-400">{b.caption}</caption>}
          <thead><tr className="border-b border-white/10">{b.head.map((h) => <th key={h} scope="col" className="px-4 py-3 font-semibold text-white">{h}</th>)}</tr></thead>
          <tbody>{b.rows.map((r) => <tr key={r[0]} className="border-b border-white/[0.05] last:border-0">{r.map((c, i) => <td key={i} className={`px-4 py-3 align-top ${i === 0 ? "font-medium text-white" : "text-silver"}`}>{c}</td>)}</tr>)}</tbody>
        </table>
      </div>
    );
  }
}

const fmt = (d: string) => new Date(`${d}T00:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) notFound();
  const solution = getSolution(p.solutionSlug);
  const demo = DEFAULT_DEMOS.find((d) => d.slug === p.demoSlug);
  const base = SITE.url.replace(/\/$/, "");
  const wa = `${SITE.whatsappLink}?text=${encodeURIComponent(`Hi, I read "${p.title}" and have a question.`)}`;

  const jsonLd = [
    {
      "@context": "https://schema.org", "@type": "BlogPosting",
      headline: p.title, description: p.metaDescription, datePublished: p.date, dateModified: p.updated ?? p.date,
      mainEntityOfPage: `${base}/blog/${p.slug}`, image: `${base}/og.png`,
      author: { "@type": "Person", name: SITE.founder }, publisher: { "@type": "Organization", name: SITE.name, url: base },
    },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: p.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    {
      "@context": "https://schema.org", "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: base },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${base}/blog` },
        { "@type": "ListItem", position: 3, name: p.title, item: `${base}/blog/${p.slug}` },
      ],
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="wrap max-w-3xl pt-10">
        <nav aria-label="Breadcrumb" className="text-sm text-silver-400">
          <Link href="/" className="hover:text-white">Home</Link> <span className="mx-1.5">/</span>
          <Link href="/blog" className="hover:text-white">Blog</Link>
        </nav>
        <div className="mt-6 flex flex-wrap gap-1.5">{p.tags.map((t) => <span key={t} className="chip">{t}</span>)}</div>
        <h1 className="h-display mt-4 text-3xl leading-[1.1] sm:text-5xl">{p.title}</h1>
        <p className="mt-4 text-sm text-silver-400">By {SITE.founder} · <time dateTime={p.date}>{fmt(p.date)}</time>{p.updated && <> · Updated <time dateTime={p.updated}>{fmt(p.updated)}</time></>} · {p.readMins} min read</p>

        <div className="mt-6">{p.blocks.map((b, i) => <BlockView key={i} b={b} />)}</div>

        <h2 className="h-display mt-14 text-2xl sm:text-3xl">Frequently asked questions</h2>
        <div className="mt-6 space-y-3">
          {p.faqs.map((f) => (
            <details key={f.q} className="card group p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display font-semibold text-white">
                <h3 className="text-base">{f.q}</h3><span className="text-cyan transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-silver">{f.a}</p>
            </details>
          ))}
        </div>

        {p.showSources !== false && p.sources.length > 0 && (
          <section className="mt-12 border-t border-white/[0.06] pt-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-silver-400">Sources</h2>
            <ul className="mt-3 space-y-1.5 text-sm">{p.sources.map((s) => <li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer" className="text-silver-400 underline underline-offset-2 hover:text-white">{s.title}</a></li>)}</ul>
          </section>
        )}
      </article>

      <section className="wrap mt-16 grid max-w-5xl gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-start">
        <div className="relative overflow-hidden rounded-3xl border border-cyan/20 bg-gradient-to-br from-electric/20 via-night-800 to-night-900 p-8">
          <h2 className="h-display text-2xl">Want this working in your business?</h2>
          <p className="mt-2 text-silver">Tell us how your business works today. You get a clear plan and a fixed quote, with no obligation.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-primary"><Icon name="whatsapp" className="h-4 w-4" /> WhatsApp us</a>
            {solution && <Link href={`/solutions/${solution.slug}`} className="btn-ghost">{solution.h1}</Link>}
          </div>
        </div>
        {demo && <div><p className="eyebrow mb-3">Try it live</p><DemoCard demo={demo} /></div>}
      </section>
    </>
  );
}
