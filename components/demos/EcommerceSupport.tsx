"use client";
import { useCallback, useState } from "react";
import { ChatFlow, type Script } from "./ChatFlow";
import { PipelinePanel, type PNode } from "./PipelinePanel";
import { RobotHead } from "@/components/Robot";

const Order = ({ id, status, eta, pct }: { id: string; status: string; eta: string; pct: number }) => (
  <div className="mt-1 w-60 rounded-xl border border-white/10 bg-night-950/70 p-3">
    <div className="flex justify-between text-[12px]"><span className="text-white">Order {id}</span><span className="text-emerald-300">{status}</span></div>
    <div className="mt-2 h-1.5 rounded bg-white/10"><div className="h-1.5 rounded bg-gradient-to-r from-electric to-cyan" style={{ width: `${pct}%` }} /></div>
    <p className="mt-1.5 text-[11px] text-silver-400">{eta}</p>
  </div>
);

const SCRIPT: Script = {
  start: {
    bot: ["Hi! I'm the Nova Store assistant (demo). I can track orders, handle returns and answer product questions.", "What can I help with?"],
    options: [{ label: "Where is my order?", next: "ask" }, { label: "Return an item", next: "return" }, { label: "Product question", next: "product" }],
    event: "chat",
  },
  ask: { bot: ["Sure. What's your order number? (try 4821)"], input: { placeholder: "Order number (demo)", next: "track", store: "order" }, event: "ai" },
  track: {
    bot: ["Found it ✅", <Order key="o" id="#4821 (sample)" status="Shipped" eta="Out for delivery tomorrow · courier tracking sent by SMS" pct={78} />, "Anything else about this order?"],
    options: [{ label: "Change address", next: "address" }, { label: "No, thanks", next: "bye" }],
    event: "lookup",
  },
  address: { bot: ["Address changes after shipping need a human check. I've passed this to our support team with your order details; they'll reply here within 30 minutes."], end: true, event: "handoff" },
  return: { bot: ["No problem. Items can be returned within 30 days. What's the reason?"], options: [{ label: "Wrong size", next: "rlabel" }, { label: "Damaged item", next: "damaged" }, { label: "Changed my mind", next: "rlabel" }], event: "ai" },
  rlabel: { bot: ["Done. I've created a return request and emailed you a prepaid label. Refunds are issued within 3–5 days of us receiving the item."], end: true, event: "returnreq" },
  damaged: { bot: ["I'm sorry about that. Please reply with a photo of the item; I've opened a priority ticket so our team can send a replacement first."], end: true, event: "handoff" },
  product: { bot: ["Ask me anything, e.g. 'Is the travel kit waterproof?'"], input: { placeholder: "Your question (demo)", next: "panswer", store: "q" }, event: "ai" },
  panswer: { bot: ["From the product catalog: the travel kit is water-resistant (IPX4), so it's fine in the rain but not for swimming. Want me to add it to your cart?"], options: [{ label: "Yes, add to cart", next: "cart" }, { label: "Not now", next: "bye" }], event: "lookup" },
  cart: { bot: ["Added 🛒 Here's your checkout link (demo). Payment is handled securely by the store's checkout."], end: true, event: "returnreq" },
  bye: { bot: ["Happy to help. Have a great day!"], end: true },
};

const NODES: PNode[] = [
  { id: "chat", label: "Store chat / WhatsApp", sub: "Same assistant on every channel", icon: "chat" },
  { id: "ai", label: "AI support agent", sub: "Intent detection + store policies", icon: "spark" },
  { id: "lookup", label: "Order & catalog lookup", sub: "Shopify / WooCommerce API (read-only)", icon: "search" },
  { id: "returnreq", label: "Action completed", sub: "Return label, cart or update created", icon: "cart" },
  { id: "handoff", label: "Human handoff", sub: "Ticket with full context to support team", icon: "user" },
];
const LOGS: Record<string, string> = {
  chat: "session started", ai: "intent classified", lookup: "store API: order/catalog found (120ms)",
  returnreq: "action created + confirmation email queued", handoff: "helpdesk ticket opened · priority set",
};

export function EcommerceSupport() {
  const [done, setDone] = useState<string[]>([]);
  const [log, setLog] = useState<string[]>([]);
  const onEvent = useCallback((e: string) => {
    if (e === "reset") { setDone([]); setLog([]); return; }
    setDone((d) => (d.includes(e) ? d : [...d, e])); setLog((l) => [...l, LOGS[e]]);
  }, []);
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,440px)_1fr]">
      <ChatFlow slug="ecommerce-support" script={SCRIPT} title="Nova Store Support" subtitle="AI assistant · replies instantly" onEvent={onEvent} height={580}
        avatar={<span className="grid h-full w-full place-items-center bg-night-950"><RobotHead className="h-7 w-7" /></span>} />
      <PipelinePanel title="Behind the scenes · support automation" nodes={NODES} done={done} log={log} />
    </div>
  );
}
