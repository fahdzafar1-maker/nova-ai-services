"use client";
import { useCallback, useState } from "react";
import { ChatFlow, type Script } from "./ChatFlow";
import { PipelinePanel, type PNode } from "./PipelinePanel";

const Listing = ({ t, p, d }: { t: string; p: string; d: string }) => (
  <div className="mt-1 w-56 overflow-hidden rounded-xl bg-[#111b21]">
    <div className="h-20 bg-gradient-to-br from-sky-700/60 via-indigo-800/50 to-amber-500/30" />
    <div className="p-2"><p className="text-[12.5px] font-semibold">{t}</p><p className="text-[11px] text-[#8696a0]">{d}</p><p className="mt-0.5 text-[12px] font-semibold text-[#00d4a6]">{p}</p></div>
  </div>
);

const SCRIPT: Script = {
  start: {
    bot: ["Hello 👋 Welcome to Skyline Properties, Dubai. I'm the Skyline AI assistant.", "Are you looking to buy, rent, or sell a property?"],
    options: [{ label: "Buy", next: "area" }, { label: "Rent", next: "area" }, { label: "Sell my property", next: "sell" }],
    event: "received",
  },
  area: {
    bot: ["Great choice. Which area do you prefer?"],
    options: [{ label: "Dubai Marina", next: "budget" }, { label: "Downtown", next: "budget" }, { label: "JVC", next: "budget" }],
    event: "ai",
  },
  budget: {
    bot: ["And your budget range (AED)?"],
    options: [{ label: "Under 1.5M", next: "results" }, { label: "1.5M – 3M", next: "results" }, { label: "3M+", next: "results" }],
  },
  results: {
    bot: [
      "I searched our current listings. Here are the best matches:",
      <Listing key="a" t="2BR · Marina Crest (sample)" d="1,350 sq ft · Sea view · Ready" p="AED 2.45M" />,
      <Listing key="b" t="2BR · Bayview Residences (sample)" d="1,180 sq ft · Marina view" p="AED 2.10M" />,
      "Would you like to book a viewing, or get the brochure first?",
    ],
    options: [{ label: "Book a viewing", next: "name" }, { label: "Send brochure", next: "brochure" }],
    event: "search",
  },
  brochure: {
    bot: ["Done ✅ The brochures are on their way to this chat. Would you also like a viewing?"],
    options: [{ label: "Yes, book a viewing", next: "name" }, { label: "Not now", next: "later" }],
  },
  name: { bot: ["Perfect. May I have your name?"], input: { placeholder: "Type your name (demo)", next: "when", store: "name" } },
  when: {
    bot: ["Thanks {name}. Which day suits you for the viewing?"],
    options: [{ label: "This Saturday", next: "done" }, { label: "Sunday", next: "done" }, { label: "Next week", next: "done" }],
  },
  done: {
    bot: [
      "Thank you {name}! I've sent your viewing request to our agent Layla. She will confirm the exact time with you shortly.",
      "Is there anything else I can help you with?",
    ],
    options: [{ label: "Payment plans?", next: "plans" }, { label: "That's all, thanks", next: "bye" }],
    event: "lead",
  },
  plans: { bot: ["Most developers offer 2–5 year payment plans. Layla will share the exact plan for this unit when she confirms your viewing. 👍"], end: true, event: "followup" },
  sell: { bot: ["We'd love to help. A senior agent will call you for a free valuation. What's your name?"], input: { placeholder: "Type your name (demo)", next: "done", store: "name" } },
  later: { bot: ["No problem. I'll check in with you in a couple of days. Have a great day! 🌇"], end: true, event: "followup" },
  bye: { bot: ["You're welcome {name}! Have a wonderful day. 🌇"], end: true, event: "followup" },
};

const NODES: PNode[] = [
  { id: "received", label: "WhatsApp webhook", sub: "Message received via WhatsApp Business API", icon: "whatsapp" },
  { id: "ai", label: "AI agent", sub: "Understands intent, keeps conversation memory", icon: "spark" },
  { id: "search", label: "Listings knowledge base", sub: "Vector search over current listings", icon: "search" },
  { id: "lead", label: "Lead saved + team alerted", sub: "Google Sheet · Slack #leads · Gmail summary", icon: "crm" },
  { id: "followup", label: "Follow-up scheduled", sub: "Reminder if the client goes quiet", icon: "calendar" },
];
const LOGS: Record<string, string> = {
  received: "webhook realestate-webhook ← inbound message (200 OK)",
  ai: "AI agent: intent=property_search, language=en",
  search: "vector search: 2 matches returned in 180ms",
  lead: "Sheets: Leads row appended · Slack #leads posted · Gmail sent",
  followup: "follow-up timer set: +48h if no reply",
};

export function SkylineWhatsApp() {
  const [done, setDone] = useState<string[]>([]);
  const [log, setLog] = useState<string[]>([]);
  const onEvent = useCallback((e: string, mem: Record<string, string>) => {
    if (e === "reset") { setDone([]); setLog([]); return; }
    setDone((d) => (d.includes(e) ? d : [...d, e]));
    setLog((l) => [...l, e === "lead" && mem.name ? `${LOGS.lead} (lead: ${mem.name.slice(0, 20)})` : LOGS[e]]);
  }, []);
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
      <div className="mx-auto w-full max-w-[420px] rounded-[40px] border border-white/10 bg-black p-2.5 shadow-2xl">
        <ChatFlow slug="skyline-whatsapp-bot" script={SCRIPT} theme="whatsapp" title="Skyline Properties" subtitle="Business account · replies instantly" onEvent={onEvent} height={600}
          avatar={<span className="grid h-full w-full place-items-center bg-gradient-to-br from-sky-500 to-indigo-600 text-xs font-bold text-white">SP</span>} />
      </div>
      <PipelinePanel title="Behind the scenes · n8n workflow" nodes={NODES} done={done} log={log} />
    </div>
  );
}
