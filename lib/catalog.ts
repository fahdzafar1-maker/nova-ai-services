// Default catalog. The live site reads services and demos from Supabase
// (tables site_services / site_demos) so the admin can edit them without code.
// This file is the fallback when the database is not configured, and the seed source.

export type ServiceCategory = "ai-automation" | "ai-agents" | "web-software" | "growth-automation";

export const CATEGORIES: { id: ServiceCategory; label: string; blurb: string }[] = [
  { id: "ai-automation", label: "AI Automation", blurb: "Workflows that move data, follow up and report on their own." },
  { id: "ai-agents", label: "AI Agents", blurb: "Assistants that talk to customers by chat, WhatsApp and phone." },
  { id: "web-software", label: "Website & Software", blurb: "Premium websites, portals and custom business systems." },
  { id: "growth-automation", label: "Business Growth", blurb: "Content, social media and sales pipelines on autopilot." },
];

export type Service = {
  slug: string;
  category: ServiceCategory;
  title: string;
  summary: string;
  benefits: string[];
  demo_slug: string | null;
  icon: string;
  sort_order: number;
  published?: boolean;
};

export const DEFAULT_SERVICES: Service[] = [
  // A. AI Automation
  { slug: "workflow-automation", category: "ai-automation", icon: "flow", sort_order: 10, demo_slug: "lead-crm-automation",
    title: "Business Workflow Automation", summary: "We map the repetitive work in your business and turn it into reliable automated workflows.",
    benefits: ["Hours of manual work removed every week", "Fewer copy-paste mistakes", "Every step logged and traceable"] },
  { slug: "n8n-development", category: "ai-automation", icon: "nodes", sort_order: 20, demo_slug: "client-hunter",
    title: "n8n Workflow Development", summary: "Production-grade n8n workflows with retries, error alerts and clean documentation.",
    benefits: ["Self-hosted or n8n Cloud", "Error handling built in from day one", "Handover docs so your team can maintain it"] },
  { slug: "crm-automation", category: "ai-automation", icon: "crm", sort_order: 30, demo_slug: "lead-crm-automation",
    title: "CRM Automation & Integrations", summary: "Connect your CRM, forms, inbox, sheets and calendar so data updates itself.",
    benefits: ["One source of truth for every lead", "Automatic status updates", "Works with HubSpot, Sheets, Airtable, Supabase and more"] },
  { slug: "lead-followup", category: "ai-automation", icon: "target", sort_order: 40, demo_slug: "client-hunter",
    title: "Lead Collection & Follow-up", summary: "Capture every enquiry and follow up automatically until the lead replies or opts out.",
    benefits: ["No lead left without a reply", "Polite, timed follow-ups", "Opt-out handling respected"] },
  { slug: "reporting", category: "ai-automation", icon: "chart", sort_order: 50, demo_slug: "analytics-dashboard",
    title: "Automated Reporting & Notifications", summary: "Daily and weekly reports delivered to email, Slack or WhatsApp without anyone building them.",
    benefits: ["Decisions on fresh numbers", "Alerts the moment something changes", "No spreadsheet wrangling"] },
  { slug: "monitoring", category: "ai-automation", icon: "shield", sort_order: 60, demo_slug: null,
    title: "Error Handling & Workflow Monitoring", summary: "Global error handlers, inbox safety nets and alerts so nothing fails silently.",
    benefits: ["Failures surfaced within minutes", "Customer messages never lost", "Clear logs for every run"] },
  // B. AI Agents
  { slug: "business-assistant", category: "ai-agents", icon: "spark", sort_order: 70, demo_slug: "clinic-ai-receptionist",
    title: "Gemini-powered Business Assistants", summary: "An AI assistant trained on your approved business information that answers accurately.",
    benefits: ["Answers from your own knowledge", "Hands over to a human when unsure", "Never invents prices or facts"] },
  { slug: "support-agent", category: "ai-agents", icon: "chat", sort_order: 80, demo_slug: "ecommerce-support",
    title: "AI Customer Support Agents", summary: "Resolve common questions instantly on your website, WhatsApp and social inboxes.",
    benefits: ["Replies in seconds, 24/7", "Consistent tone in many languages", "Escalation to your team"] },
  { slug: "lead-qualification", category: "ai-agents", icon: "filter", sort_order: 90, demo_slug: "skyline-whatsapp-bot",
    title: "AI Lead Qualification", summary: "The agent asks the right questions, scores the lead and routes hot buyers to your sales team.",
    benefits: ["Sales time spent on serious buyers", "Structured lead data in your CRM", "Instant Slack or email alerts"] },
  { slug: "appointment-agent", category: "ai-agents", icon: "calendar", sort_order: 100, demo_slug: "appointment-booking",
    title: "AI Appointment Booking", summary: "Customers pick a real free slot, get a confirmation and an automatic reminder.",
    benefits: ["Fewer no-shows", "Bookings outside office hours", "Synced with your calendar"] },
  { slug: "voice-receptionist", category: "ai-agents", icon: "phone", sort_order: 110, demo_slug: "skyline-voice-receptionist",
    title: "AI Voice Receptionists", summary: "A natural-sounding phone agent that answers calls, qualifies callers and books visits.",
    benefits: ["No missed calls", "Call summaries in your CRM", "Transfers to a human on request"] },
  { slug: "messaging-assistant", category: "ai-agents", icon: "whatsapp", sort_order: 120, demo_slug: "skyline-whatsapp-bot",
    title: "Website & Messaging Assistants", summary: "One AI brain across your website chat, WhatsApp Business, Instagram and Facebook.",
    benefits: ["Same answers on every channel", "Official WhatsApp Business API", "Lead capture built in"] },
  // C. Website & Software
  { slug: "business-websites", category: "web-software", icon: "globe", sort_order: 130, demo_slug: "web-design-showcase",
    title: "Premium Business Websites", summary: "Fast, beautiful, mobile-first websites that are built to convert visitors into enquiries.",
    benefits: ["Designed for your audience", "SEO-ready structure", "AI chat and booking built in"] },
  { slug: "ecommerce", category: "web-software", icon: "cart", sort_order: 140, demo_slug: "ecommerce-support",
    title: "E-commerce Platforms", summary: "Online stores with automated order updates, support and inventory sync.",
    benefits: ["Order status answered automatically", "Inventory alerts", "Payment-provider ready"] },
  { slug: "web-apps", category: "web-software", icon: "code", sort_order: 150, demo_slug: "web-app-admin",
    title: "Custom Web Applications", summary: "Bespoke tools for the way your team works, from intake forms to full platforms.",
    benefits: ["Built around your process", "Secure logins and roles", "Scales as you grow"] },
  { slug: "crm-erp", category: "web-software", icon: "grid", sort_order: 160, demo_slug: "web-app-admin",
    title: "CRM & ERP Systems", summary: "Lightweight CRM and ERP systems for leads, customers, stock and invoices.",
    benefits: ["Only the features you need", "Automations connected", "Reports in one click"] },
  { slug: "hospital-management", category: "web-software", icon: "plus", sort_order: 170, demo_slug: "clinic-ai-receptionist",
    title: "Hospital & Clinic Management Systems", summary: "Patients, appointments, reminders and front-desk AI in one system.",
    benefits: ["Front desk load reduced", "Reminders cut no-shows", "Role-based access to records"] },
  { slug: "portals-dashboards", category: "web-software", icon: "layout", sort_order: 180, demo_slug: "analytics-dashboard",
    title: "Customer Portals & Admin Dashboards", summary: "Secure portals for customers and live dashboards for owners.",
    benefits: ["Customers self-serve", "Owners see the numbers daily", "Data protected by row-level security"] },
  // D. Growth automation
  { slug: "social-automation", category: "growth-automation", icon: "share", sort_order: 190, demo_slug: "facebook-auto-reply",
    title: "Social Media Workflow Automation", summary: "Auto-replies to comments and DMs, scheduled posting and lead capture from social.",
    benefits: ["Every comment answered", "Leads moved to DMs and CRM", "Consistent brand voice"] },
  { slug: "content-pipelines", category: "growth-automation", icon: "pen", sort_order: 200, demo_slug: "social-media-workflow",
    title: "Content Generation & Publishing", summary: "AI-assisted content pipelines that draft, design, approve and publish on schedule.",
    benefits: ["Weeks of content prepared in hours", "Human approval step", "Published to all channels"] },
  { slug: "inquiry-management", category: "growth-automation", icon: "inbox", sort_order: 210, demo_slug: "lead-crm-automation",
    title: "Customer Inquiry Management", summary: "Every enquiry from every channel in one inbox, tagged, prioritised and answered.",
    benefits: ["Nothing slips through", "Faster first response", "Clear ownership"] },
  { slug: "sales-pipeline", category: "growth-automation", icon: "funnel", sort_order: 220, demo_slug: "client-hunter",
    title: "Sales Pipeline Automation", summary: "Prospecting, personalised outreach and follow-up sequences that run every day.",
    benefits: ["A steady flow of qualified prospects", "Personalised at scale", "Daily sending limits for deliverability"] },
  { slug: "email-messaging", category: "growth-automation", icon: "mail", sort_order: 230, demo_slug: null,
    title: "Email & Messaging Integrations", summary: "Gmail, Outlook, WhatsApp Business, Slack and SMS connected to your workflows.",
    benefits: ["Messages sent from the right inbox", "Templates with personalisation", "Delivery tracked"] },
];

export type Demo = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  use_case: string;
  tags: string[];
  featured: boolean;
  sort_order: number;
  published?: boolean;
};

export const DEFAULT_DEMOS: Demo[] = [
  { slug: "skyline-voice-receptionist", title: "Skyline AI Voice Receptionist", category: "Voice AI · Real estate", featured: true, sort_order: 10,
    summary: "A phone agent for Skyline Properties (Dubai) that answers calls, qualifies buyers and books viewings.",
    use_case: "Agencies that miss calls after hours or during viewings. The agent answers in seconds, asks budget, area and timeline, books a viewing and posts the lead to the CRM and Slack.",
    tags: ["Vapi", "n8n", "Google Sheets", "Slack"] },
  { slug: "skyline-whatsapp-bot", title: "Skyline WhatsApp AI Chatbot", category: "WhatsApp · Real estate", featured: true, sort_order: 20,
    summary: "The Skyline Properties WhatsApp agent: searches listings, qualifies the lead and alerts the sales team.",
    use_case: "Property enquiries arrive on WhatsApp at all hours. The agent answers from the listings knowledge base, qualifies the buyer and saves the lead.",
    tags: ["WhatsApp Business API", "n8n", "Pinecone", "Gmail"] },
  { slug: "clinic-ai-receptionist", title: "Clinic AI Receptionist", category: "Healthcare", featured: true, sort_order: 30,
    summary: "A front-desk assistant for clinics that books appointments, answers FAQs and routes medical questions to staff.",
    use_case: "Clinics lose patients when phones ring out. The assistant books, reschedules and reminds, while anything medical goes to a human.",
    tags: ["Booking", "Reminders", "Human handoff"] },
  { slug: "client-hunter", title: "Client Hunter: n8n Lead Engine", category: "Lead generation · n8n", featured: true, sort_order: 40,
    summary: "Our real n8n workflow that finds businesses, researches them, writes a personalised email and fills the outreach sheet.",
    use_case: "Agencies and B2B sellers who need a steady, quality list of prospects every morning without manual research.",
    tags: ["n8n", "Google Maps data", "OpenAI", "Google Sheets", "Gmail"] },
  { slug: "facebook-auto-reply", title: "Facebook Auto-Comment Reply", category: "Social media", featured: true, sort_order: 50,
    summary: "A 5-second short: comments on a post get an instant, on-brand reply and the lead moves to DM.",
    use_case: "Pages running ads get hundreds of 'price?' comments. Every comment gets a helpful reply and a private message in seconds.",
    tags: ["Meta Graph API", "n8n", "AI replies"] },
  { slug: "web-design-showcase", title: "Website Design Showcase", category: "Web design", featured: true, sort_order: 60,
    summary: "Three live demo websites we designed: a real estate portal and two skin clinics, each with AI built in.",
    use_case: "Businesses that need a modern website that books, answers and captures leads, not just a brochure.",
    tags: ["Responsive", "SEO", "AI chat", "Booking"] },
  { slug: "web-app-admin", title: "Web Development: AI Front-Desk Admin", category: "Web development", featured: false, sort_order: 70,
    summary: "A custom admin app with KPIs, CRM sheet, reminders and conversation history.",
    use_case: "Owners who want to see every conversation, booking and follow-up in one secure dashboard.",
    tags: ["Dashboard", "CRM", "Reminders"] },
  { slug: "appointment-booking", title: "Appointment Booking Automation", category: "Booking", featured: false, sort_order: 80,
    summary: "Pick a service, a real free slot and get a confirmation plus reminder automatically.",
    use_case: "Salons, clinics and consultants who want bookings 24/7 without double-booking.",
    tags: ["Calendar", "Reminders", "WhatsApp"] },
  { slug: "ecommerce-support", title: "E-commerce Customer Support", category: "E-commerce", featured: false, sort_order: 90,
    summary: "Order tracking, returns and product questions answered instantly with a handoff to staff.",
    use_case: "Online stores drowning in 'where is my order' messages.",
    tags: ["Order lookup", "Returns", "Handoff"] },
  { slug: "lead-crm-automation", title: "Lead Generation & CRM Automation", category: "CRM", featured: false, sort_order: 100,
    summary: "Leads from every channel land in one pipeline, get scored and move stage by stage automatically.",
    use_case: "Teams whose leads are scattered across WhatsApp, forms and inboxes.",
    tags: ["Pipeline", "Scoring", "Alerts"] },
  { slug: "social-media-workflow", title: "Automated Social Media Workflow", category: "Content", featured: false, sort_order: 110,
    summary: "Idea to published post: AI drafts, designs, waits for approval and publishes to every channel.",
    use_case: "Founders with no time to post consistently on LinkedIn, Instagram and Facebook.",
    tags: ["Carousels", "Approval", "Scheduling"] },
  { slug: "analytics-dashboard", title: "Business Analytics Dashboard", category: "Analytics", featured: false, sort_order: 120,
    summary: "A live owner dashboard: leads, bookings, revenue and response times on one screen.",
    use_case: "Owners who want daily numbers without opening five tools.",
    tags: ["KPIs", "Funnels", "Daily report"] },
];
