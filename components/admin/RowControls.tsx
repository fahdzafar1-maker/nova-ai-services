import { moveItem, togglePublished } from "@/app/admin/actions";
export function RowControls({ table, id, published }: { table: "site_services" | "site_demos"; id: string; published: boolean }) {
  return (
    <div className="flex items-center gap-1">
      {(["up", "down"] as const).map((dir) => (
        <form key={dir} action={moveItem}><input type="hidden" name="table" value={table} /><input type="hidden" name="id" value={id} /><input type="hidden" name="dir" value={dir} />
          <button className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-silver hover:text-white" aria-label={`Move ${dir}`}>{dir === "up" ? "↑" : "↓"}</button></form>
      ))}
      <form action={togglePublished}><input type="hidden" name="table" value={table} /><input type="hidden" name="id" value={id} /><input type="hidden" name="published" value={String(!published)} />
        <button className={`rounded-lg px-2.5 py-1.5 text-xs ${published ? "bg-emerald-400/15 text-emerald-300" : "bg-white/[0.06] text-silver"}`}>{published ? "Published" : "Hidden"}</button></form>
    </div>
  );
}
