"use client";
import { useEffect } from "react";
import { track } from "@/lib/track";
export function DemoViewTracker({ slug }: { slug: string }) {
  useEffect(() => { track("demo_view", { slug }); try { sessionStorage.setItem("fai_last_demo", slug); } catch { /* ignore */ } }, [slug]);
  return null;
}
