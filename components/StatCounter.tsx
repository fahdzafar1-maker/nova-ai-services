"use client";
import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
export function StatCounter({ value, suffix = "", label }: { value: number; suffix?: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, value, { duration: 1.6, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, value]);
  return (
    <div ref={ref} className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6">
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-electric/10 blur-2xl" />
      <div className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
        <span aria-hidden="true">{n}{suffix}</span><span className="sr-only">{value}{suffix}</span>
      </div>
      <p className="mt-2 text-sm leading-snug text-silver-400">{label}</p>
    </div>
  );
}
