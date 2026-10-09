"use client";
import { useActionState, useState } from "react";
import { updateLead, type ActionState } from "../../actions";
import { LEAD_STATUSES } from "@/lib/validation";

export function LeadEditor({ id, status, notes }: { id: string; status: string; notes: string | null }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(updateLead, {});
  const [s, setS] = useState(status);
  return (
    <form action={action} className="flex flex-col gap-2">
      <input type="hidden" name="id" value={id} />
      <label className="sr-only" htmlFor={`st-${id}`}>Status</label>
      <select id={`st-${id}`} name="status" value={s} onChange={(e) => setS(e.target.value)} className="field !py-1.5 !text-xs">
        {LEAD_STATUSES.map((x) => <option key={x}>{x}</option>)}
      </select>
      <label className="sr-only" htmlFor={`nt-${id}`}>Notes</label>
      <textarea id={`nt-${id}`} name="notes" defaultValue={notes ?? ""} rows={2} maxLength={4000} placeholder="Notes…" className="field !py-1.5 !text-xs" />
      <div className="flex items-center gap-2">
        <button className="btn-primary !px-3 !py-1.5 !text-xs" disabled={pending}>{pending ? "Saving…" : "Save"}</button>
        {state.ok && <span className="text-xs text-emerald-300">{state.message}</span>}
        {state.error && <span className="text-xs text-rose-300">{state.error}</span>}
      </div>
    </form>
  );
}
