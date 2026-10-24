// Blog posts are JSON files in /content/posts/<slug>.json (one file = one article).
// New posts are added automatically by the n8n blog workflow (GitHub commit → Vercel deploy),
// or by hand: copy an existing JSON file, change the content, commit.
// Inline formatting inside text: **bold** and [link text](/path or https://...).
// Rule: only real facts. No invented clients, reviews or statistics.
import "server-only";
import fs from "node:fs";
import path from "node:path";

export type Block =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "table"; head: string[]; rows: string[][]; caption?: string }
  | { type: "callout"; text: string };

export type Post = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  date: string; // YYYY-MM-DD
  updated?: string;
  readMins: number;
  tags: string[];
  solutionSlug: string; // landing page this post supports
  demoSlug: string;
  blocks: Block[];
  faqs: { q: string; a: string }[];
  sources: { title: string; url: string }[];
  showSources?: boolean; // false = sources kept for fact-checking only, not shown on the page
};

const DIR = path.join(process.cwd(), "content", "posts");
const BLOCK_TYPES = new Set(["h2", "h3", "p", "ul", "table", "callout"]);

// A broken file must never break the whole site build, so invalid posts are skipped.
function isValid(p: unknown): p is Post {
  const x = p as Post;
  return !!x && typeof x.slug === "string" && /^[a-z0-9-]+$/.test(x.slug)
    && typeof x.title === "string" && typeof x.metaTitle === "string" && typeof x.metaDescription === "string"
    && typeof x.excerpt === "string" && /^\d{4}-\d{2}-\d{2}$/.test(x.date ?? "")
    && Array.isArray(x.blocks) && x.blocks.length > 0 && x.blocks.every((b) => b && BLOCK_TYPES.has(b.type))
    && Array.isArray(x.faqs) && Array.isArray(x.tags);
}

function load(): Post[] {
  let files: string[] = [];
  try { files = fs.readdirSync(DIR).filter((f) => f.endsWith(".json")); } catch { return []; }
  const posts: Post[] = [];
  for (const f of files) {
    try {
      const p: unknown = JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8"));
      if (isValid(p)) posts.push({ ...p, readMins: p.readMins || 6, sources: p.sources ?? [], solutionSlug: p.solutionSlug ?? "", demoSlug: p.demoSlug ?? "" });
      else console.warn(`[posts] skipped invalid post file: ${f}`);
    } catch { console.warn(`[posts] could not parse: ${f}`); }
  }
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

export const POSTS: Post[] = load();
export const getPost = (slug: string) => POSTS.find((p) => p.slug === slug);
