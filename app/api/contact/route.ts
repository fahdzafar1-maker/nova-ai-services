import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation";
import { clientIp, rateLimit, sameOrigin, clean } from "@/lib/security";
import { saveLead } from "@/lib/leads";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!(await sameOrigin())) return NextResponse.json({ ok: false, error: "Invalid origin." }, { status: 403 });
  const ip = await clientIp();
  if (!(await rateLimit("contact", ip, 5, 600))) {
    return NextResponse.json({ ok: false, error: "Too many submissions. Please try again in a few minutes or message us on WhatsApp." }, { status: 429 });
  }

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 }); }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] ??= issue.message;
    return NextResponse.json({ ok: false, error: "Please check the highlighted fields.", fieldErrors }, { status: 422 });
  }
  const d = parsed.data;
  // Spam signals: honeypot filled, or submitted faster than a human could type.
  if (d.website || (d.startedAt && Date.now() - d.startedAt < 2500)) {
    return NextResponse.json({ ok: false, error: "Submission blocked. If you are human, please try again." }, { status: 400 });
  }

  const result = await saveLead(
    { name: clean(d.name, 120), email: d.email, phone: clean(d.phone, 32), company: clean(d.company, 160) || null,
      service: clean(d.service, 120), budget: clean(d.budget, 60) || null, message: clean(d.message, 4000),
      source: "form", consent: true, ip },
    { type: "inquiry", kind: d.kind },
  );

  if (!result.ok) {
    const msg = result.reason === "not_configured"
      ? "Our form is being set up. Please contact us on WhatsApp or email for now."
      : "We couldn't save your request. Please try again, or contact us on WhatsApp.";
    return NextResponse.json({ ok: false, error: msg }, { status: 503 });
  }
  return NextResponse.json({ ok: true, reference: result.requestRef ?? result.ref, duplicate: Boolean(result.duplicate) });
}
