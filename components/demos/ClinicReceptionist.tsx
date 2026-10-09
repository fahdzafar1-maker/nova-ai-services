"use client";
import { useCallback, useState } from "react";
import { ChatFlow, type Script } from "./ChatFlow";
import { PipelinePanel, type PNode } from "./PipelinePanel";
import { RobotHead } from "@/components/Robot";

const Slots = () => (
  <div className="mt-1 grid grid-cols-3 gap-1.5">
    {["4:00 pm", "4:30 pm", "5:30 pm", "6:00 pm", "6:30 pm", "7:00 pm"].map((t, i) => (
      <span key={t} className={`rounded-lg px-2 py-1.5 text-center text-[11px] ${i === 1 || i === 4 ? "bg-white/[0.04] text-silver-600 line-through" : "bg-electric/20 text-cyan-300"}`}>{t}</span>
    ))}
  </div>
);

const SCRIPT: Script = {
  start: {
    bot: ["Hi! Welcome to CarePoint Clinic (demo). I'm the virtual front desk.", "How can I help you today?"],
    options: [{ label: "Book an appointment", next: "dept" }, { label: "Clinic timings", next: "hours" }, { label: "I have a medical question", next: "medical" }],
    event: "chat",
  },
  hours: { bot: ["We're open Monday to Saturday, 9 am to 9 pm, and Sunday 10 am to 2 pm. Would you like to book a visit?"], options: [{ label: "Yes, book a visit", next: "dept" }, { label: "No, thanks", next: "bye" }], event: "ai" },
  dept: { bot: ["Sure. Which department?"], options: [{ label: "General physician", next: "day" }, { label: "Dermatology", next: "day" }, { label: "Dental", next: "day" }], event: "ai" },
  day: { bot: ["Which day works best for you?"], options: [{ label: "Today", next: "slots" }, { label: "Tomorrow", next: "slots" }, { label: "Thursday", next: "slots" }] },
  slots: {
    bot: ["Here are the open slots I can see in the calendar:", <Slots key="s" />, "Which time should I request?"],
    options: [{ label: "4:00 pm", next: "name" }, { label: "5:30 pm", next: "name" }, { label: "7:00 pm", next: "name" }],
    event: "calendar",
  },
  name: { bot: ["Great. What's the patient's full name?"], input: { placeholder: "Patient name (demo)", next: "confirm", store: "name" } },
  confirm: {
    bot: [
      "Thank you, {name}. Your appointment request has been sent to the front desk. You'll get a WhatsApp confirmation once it's approved, and a reminder 24 hours before your visit.",
      "Reference: CP-48213 (demo). Anything else?",
    ],
    options: [{ label: "What should I bring?", next: "bring" }, { label: "That's all", next: "bye" }],
    event: "booked",
  },
  bring: { bot: ["Please bring a photo ID, any previous reports and a list of current medicines. Arrive 10 minutes early. See you soon! 🙂"], end: true, event: "reminder" },
  medical: {
    bot: ["I'm not able to give medical advice, but I can connect you with our nursing team right away.", "What's your name so they can reach you?"],
    input: { placeholder: "Your name (demo)", next: "handoff", store: "name" },
    event: "ai",
  },
  handoff: {
    bot: ["Thanks {name}. I've passed your question to the duty nurse, who will reply here within 15 minutes during clinic hours. If it's an emergency, please call your local emergency number now."],
    end: true, event: "handoff",
  },
  bye: { bot: ["Take care! We're here 24/7 if you need anything. 🙂"], end: true, event: "reminder" },
};

const NODES: PNode[] = [
  { id: "chat", label: "Website chat widget", sub: "Visitor opens chat on the clinic website", icon: "chat" },
  { id: "ai", label: "AI receptionist", sub: "FAQs, routing, safe-handoff rules", icon: "spark" },
  { id: "calendar", label: "Calendar availability", sub: "Reads real free slots before offering them", icon: "calendar" },
  { id: "booked", label: "Booking request saved", sub: "Clinic system + front-desk notification", icon: "crm" },
  { id: "reminder", label: "Reminder scheduled", sub: "WhatsApp reminder 24h before the visit", icon: "whatsapp" },
  { id: "handoff", label: "Staff handoff", sub: "Medical questions go to a human, never AI", icon: "user" },
];
const LOGS: Record<string, string> = {
  chat: "widget session started (no personal data yet)",
  ai: "intent detected, policy: no medical advice",
  calendar: "calendar: 4 of 6 slots free",
  booked: "booking_request created · status=requested",
  reminder: "reminder job queued: T-24h",
  handoff: "ticket created → nursing team (priority: normal)",
};

export function ClinicReceptionist() {
  const [done, setDone] = useState<string[]>([]);
  const [log, setLog] = useState<string[]>([]);
  const onEvent = useCallback((e: string) => {
    if (e === "reset") { setDone([]); setLog([]); return; }
    setDone((d) => (d.includes(e) ? d : [...d, e]));
    setLog((l) => [...l, LOGS[e]]);
  }, []);
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,440px)_1fr]">
      <div className="relative">
        <div className="mb-3 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs text-silver-400">
          <span className="flex gap-1"><i className="h-2.5 w-2.5 rounded-full bg-rose-400/70" /><i className="h-2.5 w-2.5 rounded-full bg-amber-300/70" /><i className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" /></span>
          carepoint-clinic.example · website chat
        </div>
        <ChatFlow slug="clinic-ai-receptionist" script={SCRIPT} title="CarePoint Front Desk" subtitle="AI receptionist · online" onEvent={onEvent} height={580}
          avatar={<span className="grid h-full w-full place-items-center bg-night-950"><RobotHead className="h-7 w-7" /></span>} />
      </div>
      <PipelinePanel title="Behind the scenes · clinic automation" nodes={NODES} done={done} log={log} />
    </div>
  );
}
