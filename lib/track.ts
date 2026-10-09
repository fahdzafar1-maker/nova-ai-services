"use client";
// Client-side event helper. Sends to first-party /api/track (and GA4 when enabled + consented).
type Props = Record<string, string | number | boolean>;
declare global { interface Window { gtag?: (...a: unknown[]) => void } }

export function hasConsent() {
  if (typeof document === "undefined") return false;
  return /(?:^|; )fai_consent=granted/.test(document.cookie);
}

export function track(event: string, props?: Props) {
  if (!hasConsent()) return;
  try {
    const body = JSON.stringify({ event, path: location.pathname, props });
    if (navigator.sendBeacon) navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
    else fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true });
    window.gtag?.("event", event, props || {});
  } catch { /* analytics must never break the page */ }
}
