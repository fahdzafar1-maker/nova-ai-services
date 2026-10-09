import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { supabasePublic } from "@/lib/supabase/server";
import { DEFAULT_SERVICES, DEFAULT_DEMOS, type Service, type Demo } from "@/lib/catalog";

/** Published services from Supabase (admin-managed), cached 5 min. Falls back to the built-in catalog. */
const loadServices = unstable_cache(async (): Promise<Service[]> => {
  const db = supabasePublic();
  if (!db) return DEFAULT_SERVICES;
  const { data, error } = await db.from("site_services").select("slug, category, title, summary, benefits, demo_slug, icon, sort_order").eq("published", true).order("sort_order");
  if (error || !data || data.length === 0) return DEFAULT_SERVICES;
  return data as Service[];
}, ["site-services"], { revalidate: 300, tags: ["catalog"] });

const loadDemos = unstable_cache(async (): Promise<Demo[]> => {
  const db = supabasePublic();
  if (!db) return DEFAULT_DEMOS;
  const { data, error } = await db.from("site_demos").select("slug, title, category, summary, use_case, tags, featured, sort_order").eq("published", true).order("sort_order");
  if (error || !data || data.length === 0) return DEFAULT_DEMOS;
  return data as Demo[];
}, ["site-demos"], { revalidate: 300, tags: ["catalog"] });

export const getServices = cache(loadServices);
export const getDemos = cache(loadDemos);
