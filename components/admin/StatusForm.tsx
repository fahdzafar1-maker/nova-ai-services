import { updateRequestStatus } from "@/app/admin/actions";
export function StatusForm({ table, id, status, options }: { table: string; id: string; status: string; options: string[] }) {
  return (
    <form action={updateRequestStatus} className="flex items-center gap-1.5">
      <input type="hidden" name="table" value={table} /><input type="hidden" name="id" value={id} />
      <select name="status" defaultValue={status} className="field !w-36 !py-1.5 !text-xs" aria-label="Status">{options.map((o) => <option key={o} value={o}>{o.replace("_", " ")}</option>)}</select>
      <button className="btn-ghost !px-2.5 !py-1.5 !text-xs">Update</button>
    </form>
  );
}
