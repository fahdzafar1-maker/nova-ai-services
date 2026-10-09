// Generates supabase/migrations/..._seed_catalog.sql from lib/catalog.ts
// Run: node --experimental-strip-types scripts/gen-seed.mts
import { writeFileSync } from "node:fs";
import { DEFAULT_SERVICES, DEFAULT_DEMOS } from "../lib/catalog.ts";
const q = (s: string | null) => (s === null ? "null" : `'${s.replace(/'/g, "''")}'`);
const arr = (a: string[]) => `array[${a.map(q).join(",")}]::text[]`;
let sql = "-- Seed the admin-editable catalog. Safe to re-run: existing rows (edited by the admin) are left untouched.\n";
sql += "insert into public.site_services (slug, category, title, summary, benefits, demo_slug, icon, sort_order) values\n";
sql += DEFAULT_SERVICES.map((s) => `  (${q(s.slug)}, ${q(s.category)}, ${q(s.title)}, ${q(s.summary)}, ${arr(s.benefits)}, ${q(s.demo_slug)}, ${q(s.icon)}, ${s.sort_order})`).join(",\n");
sql += "\non conflict (slug) do nothing;\n\n";
sql += "insert into public.site_demos (slug, title, category, summary, use_case, tags, featured, sort_order) values\n";
sql += DEFAULT_DEMOS.map((d) => `  (${q(d.slug)}, ${q(d.title)}, ${q(d.category)}, ${q(d.summary)}, ${q(d.use_case)}, ${arr(d.tags)}, ${d.featured}, ${d.sort_order})`).join(",\n");
sql += "\non conflict (slug) do nothing;\n\n";
sql += "-- Emails listed here become admins automatically when their Supabase Auth user is created.\n";
sql += "insert into public.site_admin_allowlist (email) values ('fahdzafar73@gmail.com') on conflict do nothing;\n";
writeFileSync(new URL("../supabase/migrations/20261009000002_seed_catalog.sql", import.meta.url), sql);
console.log("seed written:", DEFAULT_SERVICES.length, "services,", DEFAULT_DEMOS.length, "demos");
