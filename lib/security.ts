import "server-only";
import { createHash, randomBytes } from "crypto";
import { headers } from "next/headers";
import { serverEnv } from "@/lib/env";
import { supabaseService } from "@/lib/supabase/server";

export function hash(value: string) {
  return createHash("sha256").update(serverEnv().hashSalt + "|" + value).digest("hex").slice(0, 32);
}

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
/** Human-friendly reference numbers, e.g. FAI-INQ-7K2M9Q */
export function makeRef(kind: "INQ" | "LEAD" | "BKG" | "ORD") {
  const bytes = randomBytes(6);
  let s = "";
  for (const b of bytes) s += ALPHABET[b % ALPHABET.length];
  return `FAI-${kind}-${s}`;
}

export async function clientIp() {
  const h = await headers();
  return (h.get("x-forwarded-for")?.split(",")[0] || h.get("x-real-ip") || "0.0.0.0").trim();
}

/** Same-origin check for state-changing requests (basic CSRF defence). */
export async function sameOrigin() {
  const h = await headers();
  const origin = h.get("origin");
  const host = h.get("x-forwarded-host") || h.get("host");
  if (!origin) return true; // non-browser clients; still rate-limited
  try { return new URL(origin).host === host; } catch { return false; }
}

// In-memory limiter: fast first line of defence per server instance.
const memory = new Map<string, number[]>();
function memoryAllow(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const hits = (memory.get(key) || []).filter((t) => now - t < windowMs);
  if (hits.length >= max) { memory.set(key, hits); return false; }
  hits.push(now);
  memory.set(key, hits);
  if (memory.size > 5000) memory.clear();
  return true;
}

/** Two-layer rate limit: per-instance memory + shared database counter. */
export async function rateLimit(scope: string, ip: string, max: number, windowSeconds: number) {
  const key = `${scope}:${hash(ip)}`;
  if (!memoryAllow(key, max, windowSeconds * 1000)) return false;
  const db = supabaseService();
  if (!db) return true;
  const { data, error } = await db.rpc("site_rate_hit", { p_bucket: key, p_max: max, p_window_seconds: windowSeconds });
  if (error) return true; // fail open on limiter errors, never lose a real customer
  return data === true;
}

/** Strip control characters and trim. */
export function clean(s: unknown, max = 4000) {
  return String(s ?? "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, max);
}
