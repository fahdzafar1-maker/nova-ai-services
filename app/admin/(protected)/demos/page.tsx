import { requireAdmin } from "@/lib/admin";
import { PageTitle, Empty, Badge } from "@/components/admin/ui";
import { DemoForm } from "@/components/admin/CatalogForms";
import { RowControls } from "@/components/admin/RowControls";

export const metadata = { title: "Demos" };
export default async function AdminDemos() {
  const { db } = await requireAdmin();
  const { data, error } = await db.from("site_demos").select("*").order("sort_order");
  return (
    <>
      <PageTitle title="Demos" sub="Manage the demo gallery: titles, descriptions, order, featured on the home page and visibility." />
      <details className="card mb-4 p-5"><summary className="cursor-pointer font-medium text-white">+ Add a new demo</summary><div className="mt-4"><DemoForm /></div></details>
      {error && <p className="mb-4 text-sm text-rose-300">{error.message}</p>}
      {!data?.length ? <Empty>No demos in the database yet.</Empty> : (
        <ul className="space-y-2">
          {data.map((d) => (
            <li key={d.id} className="card p-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="w-10 font-mono text-xs text-silver-600">{d.sort_order}</span>
                <div className="min-w-0 flex-1"><p className="font-medium text-white">{d.title} {d.featured && <Badge tone="info">Featured</Badge>}</p><p className="text-xs text-silver-400">{d.category} · <a className="text-cyan hover:underline" href={`/demos/${d.slug}`} target="_blank" rel="noopener">/demos/{d.slug}</a></p></div>
                <RowControls table="site_demos" id={d.id} published={d.published} />
              </div>
              <details className="mt-3"><summary className="cursor-pointer text-xs text-cyan">Edit</summary><div className="mt-3"><DemoForm demo={d} /></div></details>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
