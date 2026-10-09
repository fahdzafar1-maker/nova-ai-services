"use client";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";

const L = () => <div className="card grid h-[420px] place-items-center text-sm text-silver-400">Loading demo…</div>;
export const DEMO_COMPONENTS: Record<string, ComponentType> = {
  "skyline-voice-receptionist": dynamic(() => import("./VoiceReceptionist").then((m) => m.VoiceReceptionist), { loading: L }),
  "skyline-whatsapp-bot": dynamic(() => import("./SkylineWhatsApp").then((m) => m.SkylineWhatsApp), { loading: L }),
  "clinic-ai-receptionist": dynamic(() => import("./ClinicReceptionist").then((m) => m.ClinicReceptionist), { loading: L }),
  "client-hunter": dynamic(() => import("./ClientHunter").then((m) => m.ClientHunter), { loading: L }),
  "facebook-auto-reply": dynamic(() => import("./FacebookAutoReply").then((m) => m.FacebookAutoReply), { loading: L }),
  "web-design-showcase": dynamic(() => import("./WebDesign").then((m) => m.WebDesignShowcase), { loading: L }),
  "web-app-admin": dynamic(() => import("./WebDesign").then((m) => m.WebAppAdmin), { loading: L }),
  "appointment-booking": dynamic(() => import("./BookingDemo").then((m) => m.BookingDemo), { loading: L }),
  "ecommerce-support": dynamic(() => import("./EcommerceSupport").then((m) => m.EcommerceSupport), { loading: L }),
  "lead-crm-automation": dynamic(() => import("./LeadCrm").then((m) => m.LeadCrm), { loading: L }),
  "social-media-workflow": dynamic(() => import("./SocialWorkflow").then((m) => m.SocialWorkflow), { loading: L }),
  "analytics-dashboard": dynamic(() => import("./AnalyticsDemo").then((m) => m.AnalyticsDemo), { loading: L }),
};

export function DemoStage({ slug }: { slug: string }) {
  const C = DEMO_COMPONENTS[slug];
  if (!C) return <div className="card p-10 text-center text-silver-400">This demo is being prepared. <a className="text-cyan underline" href="/contact">Ask us for a walkthrough</a>.</div>;
  return <C />;
}
