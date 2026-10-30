// SEO landing pages (/solutions/<slug>). One entry = one page.
// Rule: only real facts. No invented clients, reviews or statistics.

export type Solution = {
  slug: string;
  icon: string;
  eyebrow: string;
  h1: string; // primary keyword
  metaTitle: string;
  metaDescription: string;
  intro: string;
  demoSlug: string;
  demoNote?: string;
  serviceSlug: string;
  problem: { title: string; paragraphs: string[] };
  solution: { title: string; paragraphs: string[]; features: { title: string; text: string }[] };
  steps: { title: string; text: string }[];
  fit: string[];
  tools: string[];
  extra?: { title: string; paragraphs: string[] };
  faqs: { q: string; a: string }[];
  related: string[];
};

export const SOLUTIONS: Solution[] = [
  // 1 ─────────────────────────────────────────────
  {
    slug: "ai-receptionist-dental-clinic",
    icon: "plus",
    eyebrow: "Dental & medical clinics",
    h1: "AI Receptionist for Dental Clinics",
    metaTitle: "AI Receptionist for Dental Clinics — 24/7 Booking & Patient FAQs",
    metaDescription: "An AI receptionist for dental clinics that answers patients 24/7, books and reschedules appointments, sends reminders and hands clinical questions to your team.",
    intro: "Your front desk can't answer every call while treating patients. An AI receptionist answers instantly, books appointments into your calendar, sends reminders and passes anything clinical to your staff.",
    demoSlug: "clinic-ai-receptionist",
    serviceSlug: "appointment-agent",
    problem: {
      title: "Every missed call is a patient who may book somewhere else",
      paragraphs: [
        "Dental clinics are busy in a very specific way. The phone rings at the same moments your team is with a patient, sterilising instruments or handling payment at the desk. Calls go to voicemail, messages wait for hours and new patients who are comparing two or three clinics simply call the next one.",
        "After hours it gets worse. Many people only find time to book in the evening or on the weekend, exactly when nobody is there to answer. The same questions repeat all day: Do you take my insurance? How much is a cleaning? Are you open Saturday? Where do I park? Each one takes a few minutes of a trained person's time.",
        "Then there are no-shows and last-minute cancellations. Without reminders and an easy way to reschedule, chairs sit empty that could have been filled from a waiting list.",
      ],
    },
    solution: {
      title: "A front desk that never puts patients on hold",
      paragraphs: [
        "We build an AI receptionist trained on your clinic's real information: services, opening hours, team, location, insurance and payment policies, and the questions your front desk answers every day. It talks to patients on your website chat, WhatsApp or the phone, and it works around the clock.",
        "It is designed with clear limits. The assistant handles scheduling and general questions. Anything clinical, such as pain, swelling, medication or treatment advice, is never answered by the AI. It is passed to your staff with the conversation attached so nobody has to ask the patient again.",
      ],
      features: [
        { title: "Books, reschedules and cancels", text: "Checks real free slots in your calendar and confirms the appointment, so there is no double booking." },
        { title: "Answers common questions", text: "Hours, services, prices you choose to publish, insurance, parking and directions, answered the same way every time." },
        { title: "Reminders that reduce no-shows", text: "Automatic reminders before the visit with an easy link or reply to confirm or move the appointment." },
        { title: "Human handoff for anything clinical", text: "Medical questions and urgent cases go straight to your team with the full conversation." },
        { title: "New patient intake", text: "Collects name, contact details and reason for visit before the first appointment." },
        { title: "Every conversation logged", text: "Your team can see what was asked and booked in one place, including a daily summary." },
      ],
    },
    steps: [
      { title: "Share your clinic details", text: "We collect your services, hours, policies and the questions patients ask most, in writing." },
      { title: "We build and connect", text: "The assistant is set up on your chosen channels and connected to your calendar and notification tools." },
      { title: "You test it first", text: "You try it with real questions and we adjust wording and rules before it goes live." },
      { title: "Go live and monitor", text: "We watch conversations in the first weeks, fix gaps and keep improving the answers." },
    ],
    fit: ["Dental clinics with one or more chairs", "Orthodontic and cosmetic dental practices", "Multi-location clinics that share a booking team", "Medical and physiotherapy clinics with similar front-desk work"],
    tools: ["n8n", "Website chat", "WhatsApp Business API", "Voice agent", "Google Calendar or your booking system", "Email / SMS reminders"],
    faqs: [
      { q: "Will the AI give medical or dental advice?", a: "No. The assistant is built to handle booking and general clinic information only. Questions about symptoms, pain, medication or treatment are handed to your staff with the conversation attached." },
      { q: "Can it work with the booking system we already use?", a: "In most cases, yes. If your system has an API or calendar sync we connect to it directly. If it doesn't, we can use a shared calendar or another workflow. We confirm this before you commit." },
      { q: "Which channels can patients use?", a: "Website chat, WhatsApp and phone calls are all possible. Many clinics start with one channel, usually website chat or WhatsApp, and add voice later." },
      { q: "What happens if the AI doesn't know an answer?", a: "It says so honestly, takes the patient's details and alerts your team. It is designed not to guess." },
      { q: "How long does setup take?", a: "It depends on the channels and integrations. A focused first version is usually a matter of weeks, not months. You get a clear plan and timeline before we start." },
      { q: "How much does it cost?", a: "Pricing depends on the channels, call volume and integrations you need. Tell us about your clinic and we will send a fixed quote with no obligation." },
    ],
    related: ["med-spa-appointment-booking-ai", "ai-voice-receptionist-real-estate", "website-with-ai-chatbot"],
  },

  // 2 ─────────────────────────────────────────────
  {
    slug: "ai-voice-receptionist-real-estate",
    icon: "phone",
    eyebrow: "Real estate agencies",
    h1: "AI Voice Receptionist for Real Estate Agents",
    metaTitle: "AI Voice Receptionist for Real Estate Agents — Answer Every Buyer Call",
    metaDescription: "An AI voice receptionist for real estate agents that answers calls in seconds, qualifies buyers by budget, area and timeline, books viewings and sends leads to your CRM.",
    intro: "Buyers call when they see a listing, not when you are free. An AI voice receptionist picks up in seconds, qualifies the caller, books the viewing and sends the lead to your team.",
    demoSlug: "skyline-voice-receptionist",
    serviceSlug: "voice-receptionist",
    problem: {
      title: "The agent who answers first usually gets the client",
      paragraphs: [
        "Real estate leads are expensive. Portal listings, ads and signboards all push people to pick up the phone, and that call usually happens while you are driving, showing a property or in a meeting. If it goes to voicemail, the buyer often calls the next agent on the list.",
        "Evenings and weekends are when many buyers browse listings, which is also when agencies are least staffed. Even during office hours, a large share of calls are the same questions: Is it still available? What is the price? Can I see it this week?",
        "Hiring a full-time receptionist for every shift is costly, and call answering services usually take a message without qualifying the buyer or booking anything.",
      ],
    },
    solution: {
      title: "A voice agent that sounds natural and does the work",
      paragraphs: [
        "We build a voice receptionist that answers your agency's number, speaks naturally and follows your qualification process. It asks the questions your best agent would ask: what are they looking for, which area, what budget, cash or mortgage, and how soon they want to move.",
        "When the caller is ready, it books a viewing in the right agent's calendar and sends a summary to your CRM and team chat. Urgent or complex calls can be transferred to a person. You can try exactly this flow in our live Skyline Properties demo.",
      ],
      features: [
        { title: "Answers in seconds, 24/7", text: "No hold music and no voicemail, including evenings, weekends and holidays." },
        { title: "Qualifies every caller", text: "Budget, area, property type, timeline and financing captured in a consistent format." },
        { title: "Books viewings", text: "Checks agent availability and confirms the slot during the call." },
        { title: "Instant lead alerts", text: "A clear summary lands in your CRM, Google Sheets, Slack or WhatsApp right after the call." },
        { title: "Listing questions answered", text: "Can answer from your current listings so callers get real information, not a message." },
        { title: "Transfer to a human", text: "Hot leads or sensitive calls can be passed to an agent based on rules you set." },
      ],
    },
    steps: [
      { title: "Map your call flow", text: "We write down how your team qualifies buyers, sellers and tenants, and what should happen next." },
      { title: "Build the voice agent", text: "We set up the voice, script, listing knowledge and integrations with your CRM and calendar." },
      { title: "Test with real scenarios", text: "You call the number, try difficult questions and we refine the conversation." },
      { title: "Connect your number", text: "Calls are forwarded to the agent always, only after hours, or only when your line is busy." },
    ],
    fit: ["Independent agents and small agencies", "Brokerages running portal and social ads", "Off-plan and project sales teams", "Property management companies taking tenant calls"],
    tools: ["Vapi voice AI", "n8n", "Google Sheets or your CRM", "Google Calendar", "Slack / WhatsApp alerts"],
    faqs: [
      { q: "Will callers know they are speaking to an AI?", a: "The agent sounds natural, but we recommend being transparent, for example with a short greeting that mentions it is a virtual assistant. You decide the wording." },
      { q: "Can I keep my existing phone number?", a: "Yes. Your current number can forward calls to the voice agent all the time, only after hours, or only when nobody answers." },
      { q: "Which languages can it speak?", a: "Voice agents can work in many languages, including English and Arabic. We confirm voice quality for your language during testing." },
      { q: "Does it work with my CRM?", a: "If your CRM has an API or accepts webhooks, we can send leads to it directly. Google Sheets, Slack and email work out of the box." },
      { q: "What if a caller asks something it doesn't know?", a: "It takes their details and tells them an agent will follow up, then alerts your team. It is set up not to invent prices or availability." },
      { q: "How is pricing calculated?", a: "There is a one-time setup and a running cost that depends on call minutes. We send a fixed quote after understanding your call volume." },
    ],
    related: ["whatsapp-chatbot-real-estate", "crm-automation-small-business", "ai-answering-service-hvac"],
  },

  // 3 ─────────────────────────────────────────────
  {
    slug: "whatsapp-chatbot-real-estate",
    icon: "whatsapp",
    eyebrow: "Real estate · Dubai & UAE",
    h1: "WhatsApp Chatbot for Real Estate in Dubai & the UAE",
    metaTitle: "WhatsApp Chatbot for Real Estate (Dubai & UAE) — AI Lead Qualification",
    metaDescription: "A WhatsApp AI chatbot for real estate agencies in Dubai and the UAE that answers property enquiries 24/7, searches your listings, qualifies buyers and alerts your sales team.",
    intro: "In Dubai and across the UAE, property enquiries arrive on WhatsApp at every hour. An AI chatbot answers instantly from your listings, qualifies the buyer and passes ready leads to your agents.",
    demoSlug: "skyline-whatsapp-bot",
    serviceSlug: "messaging-assistant",
    problem: {
      title: "WhatsApp is where buyers ask, and where leads go cold",
      paragraphs: [
        "In the UAE, WhatsApp is the default way buyers and tenants contact agencies. Every portal listing, Instagram ad and website button leads to a chat, and international investors message across time zones, often in the middle of your night.",
        "Agents can't reply to every message within minutes. Chats pile up, the same questions about price, payment plan, handover date and service charges are answered again and again, and serious buyers wait while less serious ones take up the agent's time.",
        "Leads also get lost inside personal phones. When an agent is busy, on leave or leaves the company, the conversation history and the client often go with them.",
      ],
    },
    solution: {
      title: "An AI agent on your official WhatsApp Business number",
      paragraphs: [
        "We build a WhatsApp chatbot on the official WhatsApp Business API, connected to your listings. It understands normal questions, searches matching properties, shares details and photos, and asks the qualifying questions your agents care about.",
        "Qualified leads are saved to your CRM or sheet and your sales team is alerted with a clean summary, so the agent who picks up already knows the budget, area and timeline. Our live Skyline Properties demo shows this exact flow.",
      ],
      features: [
        { title: "Instant replies, any time zone", text: "Every enquiry gets an answer in seconds, including from overseas investors." },
        { title: "Searches your listings", text: "Answers from your own property data: price, size, location, payment plan and availability." },
        { title: "Qualifies the buyer", text: "Budget, purpose (living or investment), area, timeline and financing collected naturally in chat." },
        { title: "Books viewings and calls", text: "Offers available slots and confirms the appointment with the buyer." },
        { title: "Alerts the right agent", text: "Hot leads trigger a notification by email, Slack or WhatsApp with the full context." },
        { title: "Company-owned history", text: "Conversations and leads stay in your systems, not on one agent's phone." },
      ],
    },
    steps: [
      { title: "Connect WhatsApp Business API", text: "We help set up or connect your verified business number and message templates." },
      { title: "Load your listings", text: "Your properties and FAQs become the knowledge base the chatbot answers from." },
      { title: "Define qualification and routing", text: "We agree which questions to ask and which leads go to which agent." },
      { title: "Test, launch and improve", text: "You test real enquiries, we tune answers, then go live and review chats weekly." },
    ],
    fit: ["Real estate brokerages in Dubai, Abu Dhabi and Sharjah", "Off-plan sales teams handling investor enquiries", "Leasing and property management companies", "Agencies anywhere that sell mainly through WhatsApp"],
    tools: ["WhatsApp Business API", "n8n", "Pinecone vector search", "Google Sheets or your CRM", "Gmail / Slack alerts"],
    extra: {
      title: "Built for how the UAE market works",
      paragraphs: [
        "Buyers in the UAE often ask about payment plans, handover dates, service charges and Golden Visa eligibility thresholds. The chatbot answers these from information you provide and keep up to date, and it never invents figures. Anything that needs a licensed agent's judgement is passed to your team.",
        "We work async-first and in writing, which suits agencies with busy schedules and international clients. You get clear updates and can review progress at your own time.",
      ],
    },
    faqs: [
      { q: "Do I need the WhatsApp Business API?", a: "Yes, for an automated chatbot we use the official WhatsApp Business API rather than the normal app. We help you set it up or connect the number you already have." },
      { q: "Can the chatbot reply in Arabic?", a: "Yes. It can detect the language of the message and reply in English or Arabic. We test both before launch." },
      { q: "Where does it get property information from?", a: "From your own listings data, such as a sheet, your CRM or a feed. When listings change, the chatbot's answers change too." },
      { q: "Will my agents still talk to clients?", a: "Yes. The chatbot handles first replies and qualification. Your agents take over for viewings, negotiation and closing, with the full chat history." },
      { q: "Is this only for Dubai?", a: "No. The same setup works for any agency that gets enquiries on WhatsApp. Dubai and the UAE are simply where WhatsApp is most central to property sales." },
      { q: "How much does it cost?", a: "It depends on message volume, the number of listings and your CRM. We send a fixed setup quote plus clear running costs." },
    ],
    related: ["ai-voice-receptionist-real-estate", "crm-automation-small-business", "facebook-comment-auto-reply"],
  },

  // 4 ─────────────────────────────────────────────
  {
    slug: "ai-answering-service-hvac",
    icon: "phone",
    eyebrow: "HVAC, plumbing & home services",
    h1: "AI Answering Service for HVAC & Plumbing Companies",
    metaTitle: "AI Answering Service for HVAC Companies: 24/7 Call Booking",
    metaDescription: "AI answering service and voice assistant for HVAC and plumbing companies: answers every call 24/7, books jobs, flags emergencies and texts your on-call tech.",
    intro: "When an AC fails or a pipe bursts, the customer calls until someone answers. An AI answering service picks up every call, captures the job, books the visit and alerts your on-call tech for emergencies.",
    demoSlug: "skyline-voice-receptionist",
    demoNote: "This live demo is set up for a real estate agency, but it runs on the same voice technology and call flow we use for home-service companies.",
    serviceSlug: "voice-receptionist",
    problem: {
      title: "Missed calls in home services are missed jobs",
      paragraphs: [
        "HVAC, plumbing and electrical companies live on the phone. The calls come in while your techs are on a roof, under a sink or driving between jobs, and the office staff are already on another line.",
        "Emergency calls do not wait for business hours. A homeowner with no heat or a flooded kitchen at 10 pm will call companies until one picks up. Traditional answering services take a message, but they rarely book the job or capture the details your tech needs.",
        "During peak season the problem doubles. Every heatwave or cold snap brings a wave of calls exactly when you have the least time to answer them.",
      ],
    },
    solution: {
      title: "A voice agent that books jobs, not just messages",
      paragraphs: [
        "We build an AI answering service that answers your business line in your company's name. It asks the right questions for your trade: what is the problem, the address, the type of system, is anyone at risk, and when the customer is available.",
        "Routine work is booked into open slots. Emergencies are flagged by rules you define and sent straight to the on-call technician by text or call. The office gets a clean summary of every call in the morning. You can hear the same voice technology in our live demo.",
      ],
      features: [
        { title: "24/7 call answering", text: "Every call answered in seconds, including nights, weekends and peak season." },
        { title: "Job details captured", text: "Problem description, address, equipment type and access notes collected in a consistent format." },
        { title: "Emergency triage", text: "Your rules decide what counts as an emergency, and those calls go to the on-call tech immediately." },
        { title: "Books service visits", text: "Offers available windows and confirms the appointment with the customer." },
        { title: "Quotes and FAQs", text: "Answers questions about service areas, call-out fees and opening hours exactly as you publish them." },
        { title: "Daily summary", text: "A morning report of calls, bookings and missed opportunities for the office." },
      ],
    },
    steps: [
      { title: "Map your call types", text: "We list your services, service areas, emergency rules and booking windows." },
      { title: "Build the agent", text: "Voice, script and integrations with your calendar, job sheet or field-service tool." },
      { title: "Test real scenarios", text: "Emergency, routine and price-shopping calls are tested and refined with you." },
      { title: "Forward your line", text: "Use it after hours only, on overflow, or for every call." },
    ],
    fit: ["HVAC and air-conditioning contractors", "Plumbers and drain-cleaning companies", "Electricians and appliance repair", "Roofing, pest control and other home-service businesses"],
    tools: ["Vapi voice AI", "n8n", "Google Calendar or your scheduling tool", "Google Sheets / CRM", "SMS and WhatsApp alerts"],
    faqs: [
      { q: "Can it tell an emergency from a routine job?", a: "Yes, based on rules you set, such as gas smell, no heat in winter, active leak or electrical sparks. Those calls are escalated immediately to your on-call person." },
      { q: "Does it work with ServiceTitan, Jobber or Housecall Pro?", a: "If your tool offers an API or integrations, we can usually connect to it. If not, bookings can go to a calendar or sheet your team already uses. We check this before starting." },
      { q: "Can I use it only after hours?", a: "Yes. Many companies forward calls to the AI only at night and on weekends, or when the office line is busy." },
      { q: "Will it give prices?", a: "Only the prices or call-out fees you choose to publish. For anything that needs an inspection, it books a visit instead of guessing." },
      { q: "What areas do you serve?", a: "We build and run these systems remotely for businesses in the US, UK, Canada, Australia and elsewhere." },
      { q: "How much does it cost?", a: "There is a one-time setup and a running cost based on call minutes. Tell us your average call volume and we will send a fixed quote." },
    ],
    related: ["ai-voice-receptionist-real-estate", "crm-automation-small-business", "website-with-ai-chatbot"],
  },

  // 5 ─────────────────────────────────────────────
  {
    slug: "med-spa-appointment-booking-ai",
    icon: "calendar",
    eyebrow: "Med spas & aesthetic clinics",
    h1: "AI Booking Assistant for Med Spas & Aesthetic Clinics",
    metaTitle: "AI Booking Assistant for Med Spas & Aesthetic Clinics — 24/7 Appointments",
    metaDescription: "An AI booking assistant for med spas and aesthetic clinics that answers treatment questions, books consultations 24/7 across Instagram, WhatsApp and web, and reduces no-shows.",
    intro: "Clients discover your treatments on Instagram at night and want an answer now. An AI booking assistant replies instantly, explains your services, books the consultation and sends reminders.",
    demoSlug: "appointment-booking",
    serviceSlug: "appointment-agent",
    problem: {
      title: "High-value enquiries, slow replies",
      paragraphs: [
        "Med spas and aesthetic clinics get a constant stream of messages: How much is Botox? Do you do lip filler? Is laser hair removal painful? When is your next opening? Many of these come through Instagram DMs, WhatsApp and website chat, and often late in the evening.",
        "Every one of these is a potential client worth a lot over time, but replying properly takes staff time that is already spent with clients in treatment rooms. Slow replies mean the client books with the clinic that answered first.",
        "No-shows and last-minute cancellations hurt even more when each appointment slot is long and valuable.",
      ],
    },
    solution: {
      title: "A booking assistant that knows your treatment menu",
      paragraphs: [
        "We build an AI assistant trained on your treatments, prices you publish, aftercare information, policies and team. It answers questions in your clinic's tone and guides the client to book a consultation or treatment in an open slot.",
        "It knows its limits. Questions about medical suitability, side effects for a specific person or contraindications are passed to your practitioners. Reminders and easy rescheduling help keep your calendar full.",
      ],
      features: [
        { title: "Books 24/7", text: "Clients choose a treatment and a real free slot and get an instant confirmation." },
        { title: "Treatment questions answered", text: "Clear answers about what each treatment involves, using only information you approve." },
        { title: "Instagram, WhatsApp and web", text: "One assistant across the channels your clients actually use." },
        { title: "Deposit and policy reminders", text: "Shares your cancellation and deposit policy so expectations are clear before booking." },
        { title: "Reminders and rebooking", text: "Automatic reminders before visits and follow-ups when it is time for the next session." },
        { title: "Practitioner handoff", text: "Medical or suitability questions go to your team with the conversation attached." },
      ],
    },
    steps: [
      { title: "Collect your treatment menu", text: "Services, durations, published prices, policies and FAQs, provided in writing." },
      { title: "Connect your calendar", text: "We link the assistant to your booking system or calendar so slots are always real." },
      { title: "Test and refine tone", text: "You test real client questions and we adjust the voice to match your brand." },
      { title: "Launch and review", text: "Go live on your chosen channels and review conversations in the first weeks." },
    ],
    fit: ["Med spas and medical aesthetics clinics", "Skin and laser clinics", "Dermatology practices with cosmetic services", "Beauty salons with high-value treatments"],
    tools: ["n8n", "Instagram / Facebook Messenger", "WhatsApp Business API", "Website chat", "Google Calendar or your booking system"],
    faqs: [
      { q: "Will the AI advise clients on whether a treatment is right for them?", a: "No. It explains what treatments involve using information you approve, and passes questions about personal suitability, medical history or side effects to your practitioners." },
      { q: "Can it book directly into our booking software?", a: "If your booking software has an API or calendar sync, yes. Otherwise we can use a calendar your team checks. We confirm before starting." },
      { q: "Can it reply to Instagram DMs?", a: "Yes, through Meta's official messaging API for Instagram business accounts. It can also handle Facebook Messenger, WhatsApp and website chat." },
      { q: "Does it reduce no-shows?", a: "Automatic reminders and easy rescheduling usually help, because clients who can't attend move their slot instead of simply not showing up." },
      { q: "Can it match our brand's tone?", a: "Yes. We write its replies to sound like your clinic, whether that is warm and friendly or calm and clinical." },
      { q: "How much does it cost?", a: "It depends on the channels and your booking system. Share your setup and we will send a fixed quote." },
    ],
    related: ["ai-receptionist-dental-clinic", "facebook-comment-auto-reply", "website-with-ai-chatbot"],
  },

  // 6 ─────────────────────────────────────────────
  {
    slug: "restaurant-ai-ordering-chatbot",
    icon: "chat",
    eyebrow: "Restaurants, cafés & cloud kitchens",
    h1: "AI Ordering Chatbot for Restaurants",
    metaTitle: "AI Ordering Chatbot for Restaurants — Take Orders on WhatsApp & Web",
    metaDescription: "An AI ordering chatbot for restaurants that takes orders on WhatsApp and your website, answers menu questions, handles reservations and order status, and sends orders to your kitchen.",
    intro: "During the rush, nobody has time to answer chats. An AI ordering chatbot takes orders, answers menu questions and replies to 'where is my order?' while your staff focus on cooking and serving.",
    demoSlug: "ecommerce-support",
    demoNote: "This live demo shows our order-support assistant for an online store. A restaurant version uses the same flow: order questions, status lookups and handoff to staff.",
    serviceSlug: "support-agent",
    problem: {
      title: "Orders arrive exactly when you are busiest",
      paragraphs: [
        "Restaurants get most of their messages and calls during lunch and dinner, the moments when the team has no free hands. Orders on WhatsApp or Instagram wait, phone calls ring out and customers who wanted to order directly end up on a delivery app that takes a large commission.",
        "A big share of messages are simple: Are you open? Do you deliver to my area? Is this dish spicy? Do you have vegetarian options? Where is my order? Each one interrupts someone who should be cooking or serving.",
        "Mistakes in hand-typed orders also cost money: wrong items, missing addresses and orders that never reach the kitchen.",
      ],
    },
    solution: {
      title: "A chatbot that knows your menu and takes the order",
      paragraphs: [
        "We build an AI ordering assistant that knows your full menu, prices, add-ons, delivery areas and opening hours. Customers order in normal language on WhatsApp or your website, the assistant confirms the items, address and payment method, and the order is sent to your kitchen in a clean format.",
        "It also handles table reservations, allergy and ingredient questions using the information you provide, and order-status questions. Complaints and special cases are handed to a staff member.",
      ],
      features: [
        { title: "Takes orders in chat", text: "Items, quantities, add-ons, address and notes confirmed back to the customer before sending." },
        { title: "Menu questions answered", text: "Ingredients, spice levels and dietary options answered from your own menu data." },
        { title: "Orders straight to the kitchen", text: "Each confirmed order is sent to a printer, tablet, sheet or chat group your team uses." },
        { title: "Reservations", text: "Takes table bookings with party size and time and confirms them." },
        { title: "Order status", text: "Answers 'where is my order?' from your order data or alerts staff when it can't." },
        { title: "Promotions and repeat orders", text: "Can share current deals and make reordering a favourite meal easy." },
      ],
    },
    steps: [
      { title: "Send us your menu", text: "Menu, prices, add-ons, delivery areas, hours and policies." },
      { title: "Choose channels", text: "WhatsApp, website chat or both, and where orders should land for the kitchen." },
      { title: "Test real orders", text: "We run through busy-hour scenarios with you and fix every rough edge." },
      { title: "Launch and adjust", text: "Go live, then update the menu data as dishes and prices change." },
    ],
    fit: ["Restaurants taking direct delivery and takeaway orders", "Cafés and bakeries with WhatsApp ordering", "Cloud kitchens and multi-brand kitchens", "Catering businesses handling event enquiries"],
    tools: ["WhatsApp Business API", "Website chat", "n8n", "Google Sheets or your POS", "Kitchen notification (printer, tablet or chat)"],
    faqs: [
      { q: "Can customers pay inside the chat?", a: "The chatbot can share a payment link or confirm cash on delivery, depending on what your payment provider supports. We set this up based on your current payment methods." },
      { q: "Does it connect to my POS?", a: "If your POS has an API, we can send orders to it. If not, orders can go to a tablet, printer, sheet or chat group your kitchen already uses." },
      { q: "What about allergies?", a: "It answers allergy and ingredient questions only from information you provide, and suggests the customer confirms with staff for serious allergies." },
      { q: "Can it handle many orders at once?", a: "Yes. Unlike a person, it can reply to many customers at the same time during the rush." },
      { q: "Will it replace delivery apps?", a: "It doesn't have to. Many restaurants use it to grow direct orders alongside delivery apps, which can reduce commission costs on those orders." },
      { q: "How much does it cost?", a: "It depends on channels, order volume and integrations. Send us your menu and setup and we will reply with a fixed quote." },
    ],
    related: ["website-with-ai-chatbot", "facebook-comment-auto-reply", "crm-automation-small-business"],
  },

  // 7 ─────────────────────────────────────────────
  {
    slug: "facebook-comment-auto-reply",
    icon: "share",
    eyebrow: "Social media automation",
    h1: "Facebook & Instagram Comment Auto-Reply",
    metaTitle: "Facebook & Instagram Comment Auto-Reply with AI — Turn Comments into Leads",
    metaDescription: "AI auto-reply for Facebook and Instagram comments: every 'price?' comment gets an instant on-brand reply and a private DM, and interested people become leads in your CRM.",
    intro: "Ads and posts bring hundreds of 'price?' and 'details please' comments. AI auto-reply answers every comment in seconds, moves the conversation to DM and saves the lead.",
    demoSlug: "facebook-auto-reply",
    serviceSlug: "social-automation",
    problem: {
      title: "Unanswered comments are wasted ad spend",
      paragraphs: [
        "When you run ads or a post takes off, the comments arrive faster than anyone can reply. 'Price?', 'Location?', 'Is this available?', 'DM me'. People who comment are showing interest at that moment, and every hour without a reply lowers the chance they buy.",
        "Replying by hand is slow and inconsistent. Some comments are missed, some get short answers, and the team spends hours copying the same message. Meanwhile real questions and complaints get buried.",
        "Generic auto-reply tools often post the same robotic line under every comment, which looks spammy and does not move anyone toward buying.",
      ],
    },
    solution: {
      title: "Smart replies in public, real conversations in private",
      paragraphs: [
        "We build an AI workflow connected to your Facebook Page and Instagram business account through Meta's official API. When someone comments, the AI reads it, posts a short, relevant public reply and sends a private message with the details they asked for.",
        "The DM conversation can answer follow-up questions, share prices you publish, book appointments and collect contact details. Leads go into your CRM or sheet, and negative comments or complaints are flagged for a person instead of being auto-answered.",
      ],
      features: [
        { title: "Replies to every comment", text: "Each comment gets a fitting, varied reply within seconds, not one copy-pasted line." },
        { title: "Private DM follow-up", text: "Interested commenters receive details in a private message where the sale actually happens." },
        { title: "Answers real questions", text: "Price, location, availability and booking questions answered from your information." },
        { title: "Lead capture", text: "Names and contact details from DMs are saved to your CRM or Google Sheets." },
        { title: "Complaint detection", text: "Negative or sensitive comments are flagged for your team, not answered by AI." },
        { title: "Works on ads and organic posts", text: "Covers boosted posts, ad comments and normal posts on Facebook and Instagram." },
      ],
    },
    steps: [
      { title: "Connect your accounts", text: "We connect your Facebook Page and Instagram business account with the right permissions." },
      { title: "Write your reply rules", text: "Your tone, what to share publicly, what to send in DM and what to escalate." },
      { title: "Test on a live post", text: "We test with real comments and tune the replies until they feel natural." },
      { title: "Run and monitor", text: "The workflow runs 24/7 and you get a summary of comments, DMs and leads." },
    ],
    fit: ["Businesses running Facebook and Instagram ads", "Clinics, gyms and fitness studios", "E-commerce and retail pages", "Real estate, education and service businesses"],
    tools: ["Meta Graph API", "n8n", "OpenAI", "Google Sheets or CRM", "Slack / email alerts"],
    faqs: [
      { q: "Is auto-replying to comments allowed by Facebook?", a: "Yes, when it is done through Meta's official API with your Page's permission, which is how we build it. We avoid spammy behaviour such as identical replies on every comment." },
      { q: "Does it work on Instagram too?", a: "Yes, for Instagram business or creator accounts connected to a Facebook Page." },
      { q: "Will it reply to negative comments?", a: "By default, no. Complaints and sensitive comments are flagged for a person so your team can respond properly." },
      { q: "Can it reply in other languages?", a: "Yes. It can reply in the language the comment was written in, including Urdu, Arabic and English." },
      { q: "Can it work on comments on my ads?", a: "Yes, comments on ads and boosted posts are included, as long as they are on a Page you own." },
      { q: "How much does it cost?", a: "Usually a setup fee plus a small monthly running cost depending on comment volume. Tell us about your pages and we will send a fixed quote." },
    ],
    related: ["med-spa-appointment-booking-ai", "crm-automation-small-business", "whatsapp-chatbot-real-estate"],
  },

  // 8 ─────────────────────────────────────────────
  {
    slug: "n8n-automation-expert",
    icon: "nodes",
    eyebrow: "n8n development",
    h1: "Hire an n8n Automation Expert",
    metaTitle: "Hire an n8n Automation Expert & n8n Developer — Workflows That Run Reliably",
    metaDescription: "Hire an n8n automation expert to build, fix and host reliable n8n workflows: AI agents, CRM and lead automation, WhatsApp, email and reporting, with error handling and documentation.",
    intro: "n8n can run a large part of your business on autopilot, if the workflows are built properly. We design, build, fix and host n8n automations with error handling, logging and clear documentation.",
    demoSlug: "client-hunter",
    serviceSlug: "n8n-development",
    problem: {
      title: "Automations that break quietly cost more than no automation",
      paragraphs: [
        "Many businesses start with n8n because it is flexible and affordable. Then the workflows grow: a webhook here, a Google Sheet there, an AI step added later. Without structure, they become hard to understand and fail silently when an API changes or a field is empty.",
        "Common signs: leads that never reached the CRM, duplicate messages, executions that stopped weeks ago without anyone noticing, and only one person who knows how anything works.",
        "Other teams know n8n could save hours every week but don't have the time to learn it deeply, or need AI agents and integrations that go beyond simple templates.",
      ],
    },
    solution: {
      title: "Production-grade n8n workflows, built and documented",
      paragraphs: [
        "We have been building with n8n since 2024, including AI agents for voice, WhatsApp and web chat. Every workflow we deliver includes error handling, retries, a global error handler and alerts, so if something fails you hear about it before your customers do.",
        "You can see a real example in our Client Hunter demo: an n8n workflow that finds businesses, researches them, writes a personalised email and fills an outreach sheet every morning.",
      ],
      features: [
        { title: "New workflows", text: "From a single integration to complete systems connecting your CRM, forms, email, WhatsApp and AI." },
        { title: "AI agents in n8n", text: "Chatbots and voice agents with tools, memory, knowledge bases and human handoff." },
        { title: "Fix and refactor", text: "Audit of existing workflows, bug fixes, cleanup and performance improvements." },
        { title: "Self-hosting and setup", text: "n8n installed and configured on a cloud server you own, with backups and updates." },
        { title: "Error handling and alerts", text: "Retries, logging and notifications built into every workflow." },
        { title: "Documentation and handover", text: "Written notes on how each workflow works so your team is never stuck." },
      ],
    },
    steps: [
      { title: "Describe the process", text: "Tell us what happens today, step by step, and which tools you use." },
      { title: "Written plan", text: "You receive a clear plan of triggers, steps, data and edge cases before we build." },
      { title: "Build in stages", text: "Working pieces you can test early, instead of one big reveal at the end." },
      { title: "Harden and hand over", text: "Error paths, alerts and documentation, then ongoing support if you want it." },
    ],
    fit: ["Agencies that need a reliable n8n partner", "Small businesses automating sales and operations", "Teams migrating from Zapier or Make to n8n", "Founders who need AI agents built on n8n"],
    tools: ["n8n (cloud or self-hosted)", "OpenAI and other LLMs", "Google Workspace", "WhatsApp, Slack, Gmail", "CRMs, webhooks and REST APIs", "Supabase, Postgres, Pinecone"],
    faqs: [
      { q: "How long have you been working with n8n?", a: "We have been building with n8n since 2024, including AI agents for real estate, restaurants, clinics and social media across voice, WhatsApp and web chat." },
      { q: "Can you fix workflows someone else built?", a: "Yes. We start with an audit, explain what is wrong in plain language and then fix or rebuild the parts that need it." },
      { q: "Do you work with n8n Cloud or self-hosted?", a: "Both. We can also set up a self-hosted n8n instance on a server you own." },
      { q: "Can you migrate our Zapier or Make automations to n8n?", a: "Yes. We map each existing automation, rebuild it in n8n and run both in parallel until the new version is confirmed." },
      { q: "Do you offer ongoing support?", a: "Yes. Monitoring, fixes and improvements can be arranged as a monthly retainer or on demand." },
      { q: "How do you price n8n projects?", a: "Most projects get a fixed quote after a short written brief. Larger or ongoing work can be a monthly retainer." },
    ],
    related: ["crm-automation-small-business", "facebook-comment-auto-reply", "website-with-ai-chatbot"],
  },

  // 9 ─────────────────────────────────────────────
  {
    slug: "crm-automation-small-business",
    icon: "crm",
    eyebrow: "CRM & lead follow-up",
    h1: "CRM & Lead Follow-Up Automation for Small Business",
    metaTitle: "CRM & Lead Follow-Up Automation for Small Business — No Lead Left Behind",
    metaDescription: "CRM and lead follow-up automation for small businesses: capture leads from every channel, score them, send timely follow-ups and see your whole pipeline in one place.",
    intro: "Leads come from WhatsApp, forms, ads, calls and email, and many never get a second message. Lead follow-up automation captures every lead, follows up on time and keeps your pipeline up to date.",
    demoSlug: "lead-crm-automation",
    serviceSlug: "crm-automation",
    problem: {
      title: "Most lost sales are lost in follow-up",
      paragraphs: [
        "Small businesses rarely lack enquiries. The problem is what happens after. Leads are scattered across WhatsApp chats, website forms, Facebook messages, inboxes and notebooks. Some get a fast reply, many get one reply, and very few get the second and third follow-up that often closes the deal.",
        "Without a single pipeline, owners can't see how many leads came in this week, which ones are hot or who is supposed to call back. Staff spend time copying details between apps instead of selling.",
        "Expensive CRMs don't fix this on their own if nobody updates them. The data has to flow in automatically.",
      ],
    },
    solution: {
      title: "Every lead captured, scored and followed up automatically",
      paragraphs: [
        "We build an automation layer around the tools you already use. New leads from every channel land in one pipeline, whether that is HubSpot, another CRM or a well-structured Google Sheet, with source and details filled in.",
        "Leads are scored by rules you set, the right person is alerted, and follow-up messages go out on schedule by email or WhatsApp until the lead replies or a person takes over. Owners get a simple daily or weekly report.",
      ],
      features: [
        { title: "One pipeline for all channels", text: "Forms, WhatsApp, Facebook, calls and email leads collected in one place automatically." },
        { title: "Lead scoring", text: "Budget, timeline and interest turned into a simple score so hot leads come first." },
        { title: "Timed follow-ups", text: "Personal follow-up messages on a schedule you approve, stopped automatically when the lead replies." },
        { title: "Instant team alerts", text: "The right person is notified the moment a qualified lead arrives." },
        { title: "Stage updates", text: "Leads move through pipeline stages automatically based on actions and replies." },
        { title: "Owner reports", text: "Daily or weekly summary of new leads, follow-ups sent and deals moving forward." },
      ],
    },
    steps: [
      { title: "Map your lead sources", text: "We list every place leads come from today and what should happen to each." },
      { title: "Choose the pipeline", text: "Your existing CRM, or a simple setup we recommend for your size." },
      { title: "Build the automations", text: "Capture, scoring, alerts and follow-up sequences, tested with real examples." },
      { title: "Report and refine", text: "Reports go live and we adjust rules based on what converts." },
    ],
    fit: ["Service businesses with leads from many channels", "Real estate agents and brokers", "Clinics, coaches and consultants", "Small sales teams without a dedicated CRM admin"],
    tools: ["n8n", "HubSpot or your CRM", "Google Sheets", "WhatsApp Business API", "Gmail / Outlook", "Slack alerts"],
    faqs: [
      { q: "Do I need to buy a CRM first?", a: "No. If you already have one we connect to it. If not, we can start with a structured Google Sheet or recommend a CRM that fits your size and budget." },
      { q: "Can follow-ups be sent on WhatsApp?", a: "Yes, through the WhatsApp Business API with approved templates, and only to people who contacted you or opted in." },
      { q: "Will the follow-up messages sound robotic?", a: "We write them with you in your tone, and they can include the lead's name and what they asked about." },
      { q: "What happens when a lead replies?", a: "Automated follow-ups stop and the lead is passed to the right person with the full history." },
      { q: "Can I see results?", a: "Yes. You get a simple report of new leads, sources, follow-ups and stage changes." },
      { q: "How much does it cost?", a: "It depends on the number of lead sources and tools involved. Most projects get a fixed quote after a short brief." },
    ],
    related: ["n8n-automation-expert", "whatsapp-chatbot-real-estate", "facebook-comment-auto-reply"],
  },

  // 10 ────────────────────────────────────────────
  {
    slug: "website-with-ai-chatbot",
    icon: "globe",
    eyebrow: "Websites with AI built in",
    h1: "Business Website with AI Chatbot & Online Booking",
    metaTitle: "Business Website with AI Chatbot & Booking — Website Development in Pakistan & Worldwide",
    metaDescription: "A fast, modern business website with an AI chatbot and online booking built in. Website development from Pakistan for local and international businesses: SEO-ready and mobile-first.",
    intro: "Most websites are brochures that wait for visitors to call. We build fast, modern websites with an AI chatbot and online booking built in, so your site answers questions and books customers 24/7.",
    demoSlug: "web-design-showcase",
    serviceSlug: "business-websites",
    problem: {
      title: "A website that only shows information leaves money on the table",
      paragraphs: [
        "Visitors arrive with questions: How much? Are you available? Do you serve my area? If the answer is not on the page in seconds, most leave. A contact form that gets a reply tomorrow is too slow for many customers.",
        "Many small business websites are also slow on mobile, hard to update and not set up for search engines, so they bring few visitors in the first place.",
        "Adding a chatbot later as a separate widget often feels bolted on and doesn't connect to booking, the CRM or the team.",
      ],
    },
    solution: {
      title: "Design, speed, SEO and AI in one build",
      paragraphs: [
        "We design and build modern websites using current technology such as Next.js, with clean design, fast loading and mobile-first layouts. Every site is set up for search engines from day one: proper titles and descriptions, sitemap, structured data and fast performance.",
        "Built into the site is an AI assistant trained on your business. It answers visitor questions, recommends the right service, books appointments into your calendar and sends leads to your inbox or CRM. You can see three live examples in our design showcase: a real estate portal and two skin clinics.",
      ],
      features: [
        { title: "Modern, fast design", text: "Clean layouts that load quickly and look right on phones, tablets and desktops." },
        { title: "AI chatbot built in", text: "Answers questions from your own content and hands complex ones to your team." },
        { title: "Online booking", text: "Visitors pick a service and a real free slot and get confirmation and reminders." },
        { title: "SEO foundation", text: "Unique titles and descriptions, sitemap, structured data and clean headings on every page." },
        { title: "Lead capture and alerts", text: "Forms and chat leads go to email, WhatsApp or your CRM instantly." },
        { title: "Analytics", text: "Google Analytics and Search Console connected so you can see what works." },
      ],
    },
    steps: [
      { title: "Brief and content", text: "Your services, audience, examples you like and the content you already have." },
      { title: "Design direction", text: "Layout and style agreed before full development starts." },
      { title: "Build and integrate", text: "Pages, chatbot, booking, forms and analytics built and connected." },
      { title: "Launch and support", text: "Domain, hosting, Search Console setup and support after launch." },
    ],
    fit: ["Clinics and aesthetic practices", "Real estate agencies", "Restaurants and service businesses", "Consultants, coaches and agencies"],
    tools: ["Next.js", "Tailwind CSS", "Vercel hosting", "AI chatbot (OpenAI)", "Calendar booking", "Google Analytics & Search Console"],
    extra: {
      title: "Website development in Pakistan, for clients anywhere",
      paragraphs: [
        "Fahd AI Services is based in Dera Ismail Khan, Pakistan, and builds websites for businesses in Pakistan and internationally. Local businesses get a modern website with WhatsApp built in, which is how most Pakistani customers prefer to get in touch.",
        "International clients get the advantages of working with a Pakistan-based team, including competitive pricing and async, written communication across time zones, without compromising on technology or quality.",
      ],
    },
    faqs: [
      { q: "Can you add an AI chatbot to my existing website?", a: "Yes. If you are happy with your current site, we can add an AI assistant and booking to it instead of rebuilding." },
      { q: "Will the chatbot answer correctly about my business?", a: "It answers from content you approve, such as services, prices you publish and FAQs. When it doesn't know something, it takes the visitor's details and alerts your team." },
      { q: "Do you build websites for businesses in Pakistan?", a: "Yes. We build websites for local businesses in Pakistan as well as for clients in the US, UK, UAE, Canada, Australia and Europe." },
      { q: "Is the website SEO-friendly?", a: "Yes. Every site includes unique titles and meta descriptions, a sitemap, structured data, clean headings and fast performance, and we connect Google Search Console." },
      { q: "Can I edit the website myself?", a: "Yes. Depending on your needs we set up an easy way to update text, prices and services, or handle updates for you." },
      { q: "How much does a website cost?", a: "It depends on the number of pages and features such as booking and chatbot. Share your requirements and we will send a fixed quote." },
    ],
    related: ["ai-receptionist-dental-clinic", "restaurant-ai-ordering-chatbot", "n8n-automation-expert"],
  },
];

export const getSolution = (slug: string) => SOLUTIONS.find((s) => s.slug === slug);
