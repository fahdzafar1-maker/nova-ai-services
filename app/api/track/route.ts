import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { trackSchema } from "@/lib/validation";
import { clientIp, hash, rateLimit } from "@/lib/security";
import { supabaseService } from "@/lib/supabase/server";

export const runtime = "nodejs";

/**
 * First-party analytics. Stores only: event name, path, a salted hash of a random cookie id, session id and
 * small non-personal props. Respects the visitor's consent choice (cookie fai_consent=denied => nothing stored).
 */
export async function POST(req: Request) {
  const store = await cookies();
  if (store.get("fai_consent")?.value === "denied") return new NextResponse(null, { status: 204 });
  const vid = store.get("fai_vid")?.value;
  const sid = store.get("fai_sid")?.value;
  if (!vid || !/^[a-f0-9-]{16,64}$/.test(vid)) return new NextResponse(null, { status: 204 });

  const ip = await clientIp();
  if (!(await rateLimit("track", ip, 120, 60))) return new NextResponse(null, { status: 204 });

  let body: unknown;
  try { body = await req.json(); } catch { return new NextResponse(null, { status: 400 }); }
  const parsed = trackSchema.safeParse(body);
  if (!parsed.success) return new NextResponse(null, { status: 400 });

  const db = supabaseService();
  if (db) {
    const path = parsed.data.path?.split("?")[0]?.slice(0, 300) ?? null; // never store query strings
    await db.from("site_events").insert({ event: parsed.data.event, path, visitor_id: hash(vid), session_id: sid ? hash(sid) : null, props: parsed.data.props ?? {} });
  }
  return new NextResponse(null, { status: 204 });
}
