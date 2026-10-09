import "server-only";
import { createHmac } from "crypto";
import { serverEnv } from "@/lib/env";
import { supabaseService } from "@/lib/supabase/server";

type Payload = { event: string; ref: string; data: Record<string, unknown> };

/**
 * Sends an authenticated event to n8n. Never throws: the original submission is already saved,
 * and every outcome (sent / failed / skipped) is written to site_notification_log for the admin.
 * Headers: X-Fahd-Signature = HMAC-SHA256(body, N8N_WEBHOOK_SECRET), Idempotency-Key = ref.
 */
export async function notifyN8n(payload: Payload) {
  const { n8nWebhookUrl, n8nWebhookSecret } = serverEnv();
  const db = supabaseService();
  const log = async (status: "sent" | "failed" | "skipped", attempts: number, error?: string) => {
    if (!db) return;
    await db.from("site_notification_log").insert({ kind: payload.event, ref: payload.ref, target: "n8n", status, attempts, error: error?.slice(0, 500) ?? null });
  };
  if (!n8nWebhookUrl) { await log("skipped", 0, "N8N_WEBHOOK_URL not configured"); return { ok: false, skipped: true }; }

  const body = JSON.stringify({ ...payload, sentAt: new Date().toISOString() });
  const signature = n8nWebhookSecret ? createHmac("sha256", n8nWebhookSecret).update(body).digest("hex") : "";
  let lastError = "";
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 8000);
      const res = await fetch(n8nWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Fahd-Signature": signature, "Idempotency-Key": payload.ref },
        body,
        signal: ctrl.signal,
      });
      clearTimeout(timer);
      if (res.ok) { await log("sent", attempt); return { ok: true }; }
      lastError = `HTTP ${res.status}`;
      if (res.status >= 400 && res.status < 500 && res.status !== 429) break; // don't retry client errors
    } catch (e) {
      lastError = e instanceof Error ? e.message : "network error";
    }
    await new Promise((r) => setTimeout(r, attempt * 600));
  }
  await log("failed", 3, lastError);
  console.error("[n8n] notification failed", payload.event, payload.ref, lastError);
  return { ok: false };
}
