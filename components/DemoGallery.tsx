"use client";
import { useState } from "react";
import type { Demo } from "@/lib/catalog";
import { DemoCard } from "./DemoCard";

const GROUPS: { id: string; label: string; match: (d: Demo) => boolean }[] = [
  { id: "all", label: "All demos", match: () => true },
  { id: "agents", label: "AI agents", match: (d) => /voice|whatsapp|healthcare|e-commerce|booking/i.test(d.category) },
  { id: "automation", label: "Automation", match: (d) => /n8n|crm|social|content|lead/i.test(d.category) },
  { id: "web", label: "Web & software", match: (d) => /web|analytics/i.test(d.category) },
];

export function DemoGallery({ demos }: { demos: Demo[] }) {
  const [g, setG] = useState("all");
  const list = demos.filter(GROUPS.find((x) => x.id === g)!.match);
  return (
    <div>
      <div role="tablist" aria-label="Demo categories" className="flex flex-wrap gap-2">
        {GROUPS.map((x) => (
          <button key={x.id} role="tab" aria-selected={g === x.id} onClick={() => setG(x.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${g === x.id ? "bg-white text-night-950" : "border border-white/10 text-silver hover:text-white"}`}>
            {x.label} <span className="ml-1 opacity-60">{demos.filter(x.match).length}</span>
          </button>
        ))}
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((d) => <DemoCard key={d.slug} demo={d} />)}
      </div>
    </div>
  );
}
