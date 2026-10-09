import { z } from "zod";

const phoneRe = /^\+?[0-9][0-9\s\-()]{6,20}$/;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(120),
  email: z.string().trim().toLowerCase().email("Please enter a valid email address").max(200),
  phone: z.string().trim().regex(phoneRe, "Include your country code, e.g. +1 555 123 4567"),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  service: z.string().trim().min(2, "Please choose a service").max(120),
  budget: z.string().trim().max(60).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Tell us a little more (at least 10 characters)").max(4000),
  consent: z.literal(true, { message: "Please allow us to contact you about this request" }),
  kind: z.enum(["inquiry", "consultation"]).default("inquiry"),
  // honeypot: real users never fill this hidden field
  website: z.string().max(500).optional().or(z.literal("")),
  startedAt: z.number().optional(),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const chatSchema = z.object({
  sessionId: z.string().regex(/^[a-zA-Z0-9_-]{8,64}$/),
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(2000) }))
    .min(1)
    .max(40),
  page: z.string().max(200).optional(),
});

export const leadFromAiSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email().max(200),
  phone: z.string().trim().regex(phoneRe).optional().or(z.literal("")),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  business_type: z.string().trim().max(160).optional().or(z.literal("")),
  service: z.string().trim().max(120).optional().or(z.literal("")),
  problem: z.string().trim().max(1500).optional().or(z.literal("")),
  budget: z.string().trim().max(60).optional().or(z.literal("")),
  timeline: z.string().trim().max(120).optional().or(z.literal("")),
  preferred_date: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal("")),
  preferred_time: z.string().trim().max(40).optional().or(z.literal("")),
  order_items: z.string().trim().max(1000).optional().or(z.literal("")),
});

export const trackSchema = z.object({
  event: z.string().regex(/^[a-z0-9_]{2,48}$/),
  path: z.string().max(300).optional(),
  props: z.record(z.string(), z.union([z.string().max(200), z.number(), z.boolean()])).optional(),
});

export const LEAD_STATUSES = ["New", "Contacted", "Qualified", "Proposal Sent", "Won", "Lost"] as const;
