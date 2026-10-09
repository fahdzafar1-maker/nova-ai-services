import { requireAdmin } from "@/lib/admin";
import { PageTitle, Empty } from "@/components/admin/ui";
import { ServiceForm } from "@/components/admin/CatalogForms";
import { RowControls } from "@/components/admin/RowControls";
import { CATEGORIES } from "@/lib/catalog";

export const metadata = { title: "Services" };
export default async function AdminServices() {
  const { db } = await requireAdmin();
  const [{ data, error }, demos] = await Promise.all([
    db.from("site_services").select("*").order("sort_order"),
    db.from("site_demos").select("slug").order("sort_order"),
  ]);
  const demoSlugs = (demos.data ?? []).map((d) => d.slug);
  return (
    <>
      <PageTitle title="Services" sub="Add, edit, reorder, publish or hide services. Changes appear on the website within a few minutes." />
      <details className="card mb-4 p-5"><summary className="cursor-pointer font-medium text-white">+ Add a new service</summary><div className="mt-4"><ServiceForm demoSlugs={demoSlugs} /></div></details>
      {error && <p className="mb-4 text-sm text-rose-300">{error.message}</p>}
      {!data?.length ? <Empty>No services in the database yet. Run the seed migration (see README).</Empty> : (
        <ul className="space-y-2">
          {data.map((s) => (
            <li key={s.id} className="card p-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="w-10 font-mono text-xs text-silver-600">{s.sort_order}</span>
                <div className="min-w-0 flex-1"><p className="font-medium text-white">{s.title}</p><p className="text-xs text-silver-400">{CATEGORIES.find((c) => c.id === s.category)?.label} · /{s.slug}{s.demo_slug ? ` · demo: ${s.demo_slug}` : ""}</p></div>
                <RowControls table="site_services" id={s.id} published={s.published} />
              </div>
              <details className="mt-3"><summary className="cursor-pointer text-xs text-cyan">Edit</summary><div className="mt-3"><ServiceForm svc={s} demoSlugs={demoSlugs} /></div></details>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
