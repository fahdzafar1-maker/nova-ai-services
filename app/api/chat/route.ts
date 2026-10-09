import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { chatSchema, leadFromAiSchema } from "@/lib/validation";
import { clientIp, rateLimit, sameOrigin, hash, clean } from "@/lib/security";
import { serverEnv } from "@/lib/env";
import { getServices, getDemos } from "@/lib/data";
import { buildSystemPrompt, RESPONSE_SCHEMA, offlineReply, type AssistantOutput } from "@/lib/assistant";
import { saveLead } from "@/lib/leads";
import { supabaseService } from "@/lib/supabase/server";
import { SITE } from "@/lib/site";

export const runtime = "nodejs";
export const maxDuration = 30;

async function callGemini(system: string, messages: { role: "user" | "assistant"; content: string }[]): Promise<AssistantOutput | null> {
  const { geminiKey, geminiModel } = serverEnv();
  if (!geminiKey) return null;
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(geminiModel)}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": geminiKey },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: messages.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] })),
      generationConfig: { temperature: 0.4, maxOutputTokens: 900, responseMimeType: "application/json", responseSchema: RESPONSE_SCHEMA },
    }),
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) { console.error("[chat] gemini http", res.status); throw new Error("ai_unavailable"); }
  const json = await res.json();
  const text: string | undefined = json?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("");
  if (!text) throw new Error("ai_empty");
  return JSON.parse(text) as AssistantOutput;
}

/** Guard against leaking secrets or the prompt, and keep replies short. */
function sanitizeReply(reply: string) {
  const { geminiKey, serviceRoleKey, n8nWebhookSecret } = serverEnv();
  let out = String(reply || "").slice(0, 1500);
  for (const secret of [geminiKey, serviceRoleKey, n8nWebhookSecret]) if (secret && secret.length > 8) out = out.split(secret).join("[hidden]");
  if (/APPROVED COMPANY FACTS|STRICT RULES|YOUR JOB:/i.test(out)) out = "I can't share my internal setup, but I'm happy to help with your project.";
  return out;
}

export async function POST(req: Request) {
  if (!(await sameOrigin())) return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  const ip = await clientIp();
  if (!(await rateLimit("chat", ip, 25, 300))) {
    return NextResponse.json({ reply: `You're sending messages very quickly. Please wait a minute, or reach us on WhatsApp: ${SITE.whatsappLink}`, suggestions: [] }, { status: 429 });
  }
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const parsed = chatSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid message." }, { status: 400 });

  const messages = parsed.data.messages.map((m) => ({ role: m.role, content: clean(m.content, 2000) })).slice(-20);
  while (messages.length && messages[0].role === "assistant") messages.shift(); // Gemini expects the user to speak first
  if (!messages.length) return NextResponse.json({ error: "Invalid message." }, { status: 400 });
  const userText = messages.filter((m) => m.role === "user").map((m) => m.content).join("\n");
  const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";

  const [services, demos] = await Promise.all([getServices(), getDemos()]);
  let out: AssistantOutput;
  let mode: "ai" | "offline" = "ai";
  try {
    const ai = await callGemini(buildSystemPrompt(services, demos), messages);
    if (ai) out = ai; else { out = offlineReply(lastUser, services); mode = "offline"; }
  } catch {
    out = { reply: `I'm having trouble answering right now. You can reach ${SITE.founder} directly on WhatsApp (${SITE.whatsappLink}) or use the form at /contact.`, intent: "handoff", action: "handoff", consent_given: false, lead: {}, suggestions: ["Open contact form"] };
    mode = "offline";
  }

  let reply = sanitizeReply(out.reply);
  let reference: string | undefined;
  let saved = false;
  let leadId: string | null = null;

  const wantsSave = out.action === "save_lead" || out.action === "booking_request" || out.action === "order_request";
  if (wantsSave) {
    const lead = leadFromAiSchema.safeParse(out.lead ?? {});
    // Server-side checks the model cannot bypass: explicit consent, and contact details the visitor actually typed.
    const consentWords = /\b(yes|yeah|yep|sure|ok|okay|go ahead|please do|agree|confirm|haan|ji)\b/i.test(lastUser);
    const typedByUser = lead.success && userText.toLowerCase().includes(lead.data.email.toLowerCase()) && userText.toLowerCase().includes(lead.data.name.toLowerCase().split(" ")[0]);
    if (!lead.success || !out.consent_given || !consentWords || !typedByUser) {
      reply = lead.success && !(out.consent_given && consentWords)
        ? `${reply}\n\nBefore I submit anything: may I save your details so ${SITE.founder} can contact you? Please reply "yes" to confirm.`
        : reply;
    } else {
      const l = lead.data;
      const message = [l.problem && `Problem: ${l.problem}`, l.business_type && `Business: ${l.business_type}`, l.timeline && `Timeline: ${l.timeline}`, l.order_items && `Order: ${l.order_items}`].filter(Boolean).join("\n");
      const request =
        out.action === "booking_request" ? { type: "booking" as const, preferred_date: l.preferred_date || null, preferred_time: l.preferred_time || null, timezone: null }
        : out.action === "order_request" ? { type: "order" as const, items: [{ description: l.order_items || l.service || "Service request" }], notes: l.problem || null }
        : { type: "inquiry" as const, kind: "consultation" as const };
      const result = await saveLead({ name: l.name, email: l.email, phone: l.phone || null, company: l.company || l.business_type || null, service: l.service || null, budget: l.budget || null, message, source: "ai", consent: true, ip }, request);
      if (result.ok) {
        saved = true; leadId = result.leadId; reference = result.requestRef ?? result.ref;
        const what = out.action === "booking_request" ? "booking request (the team will confirm the exact time with you)" : out.action === "order_request" ? "order request (status: pending, nothing has been charged)" : "consultation request";
        reply = `${reply}\n\n✅ Your ${what} has been saved. Reference: ${reference}. ${SITE.founder} will contact you by email${l.phone ? " or WhatsApp" : ""}, usually within one business day.`;
      } else {
        reply = `${reply}\n\nI couldn't save your details just now, so nothing was submitted. Please message us on WhatsApp (${SITE.whatsappLink}) or use /contact.`;
      }
    }
  }
  if (out.action === "handoff" && !reply.includes("wa.me")) reply += `\n\nYou can talk to a human on WhatsApp: ${SITE.whatsappLink}`;

  // Conversation metadata only (no transcripts stored).
  const db = supabaseService();
  if (db) {
    const store = await cookies();
    const vid = store.get("fai_vid")?.value;
    const consentDenied = store.get("fai_consent")?.value === "denied";
    const sessionId = hash(parsed.data.sessionId);
    const existing = await db.from("site_ai_conversations").select("id, lead_id, escalated").eq("session_id", sessionId).maybeSingle();
    const row = {
      session_id: sessionId,
      visitor_id: vid && !consentDenied ? hash(vid) : null,
      message_count: messages.filter((m) => m.role === "user").length,
      intent: out.intent,
      lead_id: leadId ?? existing.data?.lead_id ?? null,
      escalated: Boolean(existing.data?.escalated) || out.action === "handoff",
      last_at: new Date().toISOString(),
    };
    if (existing.data) await db.from("site_ai_conversations").update(row).eq("id", existing.data.id);
    else await db.from("site_ai_conversations").insert(row);
  }

  return NextResponse.json({ reply, suggestions: (out.suggestions || []).slice(0, 3).map((s) => clean(s, 60)), saved, reference, mode });
}
