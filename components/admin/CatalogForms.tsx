"use client";
import { useActionState } from "react";
import { saveService, saveDemo, type ActionState } from "@/app/admin/actions";
import { CATEGORIES } from "@/lib/catalog";

type Svc = { id?: string; slug?: string; title?: string; summary?: string; category?: string; benefits?: string[]; demo_slug?: string | null; icon?: string; sort_order?: number; published?: boolean };
type Dm = { id?: string; slug?: string; title?: string; category?: string; summary?: string; use_case?: string; tags?: string[]; sort_order?: number; published?: boolean; featured?: boolean };

function Status({ s, pending }: { s: ActionState; pending: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <button className="btn-primary !py-2" disabled={pending}>{pending ? "Saving…" : "Save"}</button>
      {s.ok && <span className="text-xs text-emerald-300">{s.message}</span>}
      {s.error && <span className="text-xs text-rose-300">{s.error}</span>}
    </div>
  );
}

export function ServiceForm({ svc = {}, demoSlugs }: { svc?: Svc; demoSlugs: string[] }) {
  const [s, action, pending] = useActionState<ActionState, FormData>(saveService, {});
  const id = svc.id || "new";
  return (
    <form action={action} className="grid gap-3 sm:grid-cols-2">
      <input type="hidden" name="id" value={svc.id || ""} />
      <div><label className="label" htmlFor={`t-${id}`}>Title</label><input id={`t-${id}`} name="title" defaultValue={svc.title} required className="field" /></div>
      <div><label className="label" htmlFor={`s-${id}`}>Slug (URL id)</label><input id={`s-${id}`} name="slug" defaultValue={svc.slug} required pattern="[a-z0-9-]{2,80}" className="field" /></div>
      <div className="sm:col-span-2"><label className="label" htmlFor={`m-${id}`}>Description</label><textarea id={`m-${id}`} name="summary" defaultValue={svc.summary} rows={2} required className="field" /></div>
      <div className="sm:col-span-2"><label className="label" htmlFor={`b-${id}`}>Business benefits (one per line)</label><textarea id={`b-${id}`} name="benefits" defaultValue={(svc.benefits || []).join("\n")} rows={3} className="field" /></div>
      <div><label className="label" htmlFor={`c-${id}`}>Category</label><select id={`c-${id}`} name="category" defaultValue={svc.category || "ai-automation"} className="field">{CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}</select></div>
      <div><label className="label" htmlFor={`d-${id}`}>Related demo</label><select id={`d-${id}`} name="demo_slug" defaultValue={svc.demo_slug || ""} className="field"><option value="">None</option>{demoSlugs.map((d) => <option key={d}>{d}</option>)}</select></div>
      <div><label className="label" htmlFor={`i-${id}`}>Icon</label><input id={`i-${id}`} name="icon" defaultValue={svc.icon || "spark"} className="field" /></div>
      <div><label className="label" htmlFor={`o-${id}`}>Sort order</label><input id={`o-${id}`} name="sort_order" type="number" defaultValue={svc.sort_order ?? 500} className="field" /></div>
      <label className="flex items-center gap-2 text-sm text-silver"><input type="checkbox" name="published" defaultChecked={svc.published ?? true} className="accent-[#2B8FFF]" /> Published</label>
      <div className="sm:col-span-2"><Status s={s} pending={pending} /></div>
    </form>
  );
}

export function DemoForm({ demo = {} }: { demo?: Dm }) {
  const [s, action, pending] = useActionState<ActionState, FormData>(saveDemo, {});
  const id = demo.id || "new";
  return (
    <form action={action} className="grid gap-3 sm:grid-cols-2">
      <input type="hidden" name="id" value={demo.id || ""} />
      <div><label className="label" htmlFor={`dt-${id}`}>Title</label><input id={`dt-${id}`} name="title" defaultValue={demo.title} required className="field" /></div>
      <div><label className="label" htmlFor={`ds-${id}`}>Slug</label><input id={`ds-${id}`} name="slug" defaultValue={demo.slug} required pattern="[a-z0-9-]{2,80}" className="field" /></div>
      <div><label className="label" htmlFor={`dc-${id}`}>Category label</label><input id={`dc-${id}`} name="category" defaultValue={demo.category} required className="field" /></div>
      <div><label className="label" htmlFor={`dg-${id}`}>Tags (comma separated)</label><input id={`dg-${id}`} name="tags" defaultValue={(demo.tags || []).join(", ")} className="field" /></div>
      <div className="sm:col-span-2"><label className="label" htmlFor={`dm-${id}`}>Summary</label><textarea id={`dm-${id}`} name="summary" defaultValue={demo.summary} rows={2} required className="field" /></div>
      <div className="sm:col-span-2"><label className="label" htmlFor={`du-${id}`}>Use case</label><textarea id={`du-${id}`} name="use_case" defaultValue={demo.use_case} rows={2} className="field" /></div>
      <div><label className="label" htmlFor={`do-${id}`}>Sort order</label><input id={`do-${id}`} name="sort_order" type="number" defaultValue={demo.sort_order ?? 500} className="field" /></div>
      <div className="flex items-end gap-5 pb-2 text-sm text-silver">
        <label className="flex items-center gap-2"><input type="checkbox" name="published" defaultChecked={demo.published ?? true} className="accent-[#2B8FFF]" /> Published</label>
        <label className="flex items-center gap-2"><input type="checkbox" name="featured" defaultChecked={demo.featured ?? false} className="accent-[#2B8FFF]" /> Featured on home</label>
      </div>
      <p className="text-xs text-silver-600 sm:col-span-2">New demos appear in the gallery. An interactive experience needs a matching component in code (components/demos/registry.tsx); otherwise a "walkthrough on request" card is shown.</p>
      <div className="sm:col-span-2"><Status s={s} pending={pending} /></div>
    </form>
  );
}
