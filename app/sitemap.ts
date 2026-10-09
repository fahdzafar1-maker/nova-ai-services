import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { DEFAULT_DEMOS } from "@/lib/catalog";
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = ["", "/services", "/demos", "/about", "/contact", "/privacy"].map((p) => ({ url: `${SITE.url}${p}`, lastModified: now, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.8 }));
  const demos = DEFAULT_DEMOS.map((d) => ({ url: `${SITE.url}/demos/${d.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 }));
  return [...pages, ...demos];
}
