import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { DEFAULT_DEMOS } from "@/lib/catalog";
import { SOLUTIONS } from "@/lib/solutions";
import { POSTS } from "@/lib/posts";
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = ["", "/services", "/solutions", "/blog", "/demos", "/about", "/contact", "/privacy"].map((p) => ({ url: `${SITE.url}${p}`, lastModified: now, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.8 }));
  const demos = DEFAULT_DEMOS.map((d) => ({ url: `${SITE.url}/demos/${d.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 }));
  const solutions = SOLUTIONS.map((s) => ({ url: `${SITE.url}/solutions/${s.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 }));
  const posts = POSTS.map((p) => ({ url: `${SITE.url}/blog/${p.slug}`, lastModified: new Date(p.updated ?? p.date), changeFrequency: "monthly" as const, priority: 0.7 }));
  return [...pages, ...solutions, ...posts, ...demos];
}
