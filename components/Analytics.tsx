"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { track, hasConsent } from "@/lib/track";
import { env } from "@/lib/env";

const YEAR = 60 * 60 * 24 * 365;
function setCookie(name: string, value: string, maxAge: number) {
  document.cookie = `${name}=${value}; Max-Age=${maxAge}; Path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
}
function getCookie(name: string) {
  return document.cookie.split("; ").find((c) => c.startsWith(name + "="))?.split("=")[1];
}
function ensureIds() {
  if (!getCookie("fai_vid")) setCookie("fai_vid", crypto.randomUUID(), YEAR);
  // rolling 30-minute session
  setCookie("fai_sid", getCookie("fai_sid") || crypto.randomUUID(), 60 * 30);
}
function loadGA() {
  if (!env.gaId || document.getElementById("ga4")) return;
  const s = document.createElement("script");
  s.id = "ga4"; s.async = true; s.src = `https://www.googletagmanager.com/gtag/js?id=${env.gaId}`;
  document.head.appendChild(s);
  const w = window as unknown as { dataLayer: unknown[] };
  w.dataLayer = w.dataLayer || [];
  window.gtag = function gtag() { w.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", env.gaId, { anonymize_ip: true });
}

export function Analytics() {
  const path = usePathname();
  const [choice, setChoice] = useState<"unknown" | "granted" | "denied" | null>(null);

  useEffect(() => {
    const c = getCookie("fai_consent");
    setChoice(c === "granted" || c === "denied" ? c : "unknown");
  }, []);

  useEffect(() => {
    if (choice !== "granted" || path.startsWith("/admin")) return;
    ensureIds();
    loadGA();
    track("page_view");
  }, [path, choice]);

  const decide = (v: "granted" | "denied") => {
    setCookie("fai_consent", v, YEAR);
    if (v === "denied") { setCookie("fai_vid", "", 0); setCookie("fai_sid", "", 0); }
    setChoice(v);
  };

  if (choice !== "unknown" || path.startsWith("/admin")) return null;
  return (
    <div role="dialog" aria-live="polite" aria-label="Privacy choices" className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-xl rounded-2xl border border-white/10 bg-night-900/95 p-4 text-sm text-silver shadow-2xl backdrop-blur sm:bottom-5">
      <p>
        We use privacy-friendly, first-party analytics (no ads, no selling data) to see which pages and demos are useful.
        Allow anonymous analytics? <Link className="text-cyan underline" href="/privacy">Privacy</Link>
      </p>
      <div className="mt-3 flex gap-2">
        <button className="btn-primary !py-2" onClick={() => decide("granted")}>Allow</button>
        <button className="btn-ghost !py-2" onClick={() => decide("denied")}>Decline</button>
      </div>
    </div>
  );
}
export { hasConsent };
