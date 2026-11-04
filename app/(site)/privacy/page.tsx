import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { SITE } from "@/lib/site";
export const metadata: Metadata = { title: "Privacy Policy", description: "How Fahd AI Services (Zafar Ullah Khan and Sons LLP) handles your data, including WhatsApp and Meta data.", alternates: { canonical: "/privacy" } };

const UPDATED = "5 November 2026";
const mail = <a className="text-cyan underline" href={`mailto:${SITE.email}`}>{SITE.email}</a>;

export default function Privacy() {
  return (
    <>
      <PageHero eyebrow="Privacy Policy" title="Your data, handled carefully" />
      <section className="wrap max-w-3xl space-y-5 text-silver">
        <p className="text-sm text-silver-400">Last updated: {UPDATED}</p>
        <p><b className="text-white">Who we are.</b> {SITE.name} is a trade name of {SITE.legal.name} (SECP LLP Reg. No. {SITE.legal.secpNo}, NTN {SITE.legal.ntn}), {SITE.legal.address}. In this policy “we” and “us” mean {SITE.legal.name}. Contact: {mail}, {SITE.whatsapp}.</p>

        <h2 className="pt-4 font-display text-xl font-semibold text-white">1. This website</h2>
        <p><b className="text-white">What we collect.</b> When you submit the contact form or agree to share details with our AI assistant, we store your name, email, phone (optional), company, the service you're interested in and your message, so we can reply.</p>
        <p><b className="text-white">AI assistant.</b> Conversations are processed by Google Gemini to generate replies. We do not store chat transcripts; we only keep basic metadata (message count, topic, whether a request was submitted). Your contact details are saved only after you say yes.</p>
        <p><b className="text-white">Analytics.</b> Only if you click “Allow”, we record anonymous page and demo views using a random identifier stored in a first-party cookie. We never store IP addresses or personal details in analytics. You can decline and the site works the same.</p>

        <h2 className="pt-4 font-display text-xl font-semibold text-white">2. WhatsApp and other services we run for businesses</h2>
        <p>We build and operate AI assistants for businesses such as clinics: WhatsApp assistants (through the WhatsApp Business Platform by Meta), website chat and AI phone receptionists. When a business connects its WhatsApp Business account to our application, we process data <b className="text-white">on behalf of that business</b>. The business decides why the data is used and remains responsible for its own customers; we act as its service provider.</p>
        <p><b className="text-white">Data we receive from Meta and the business.</b> WhatsApp Business Account and phone number identifiers, the business display name, message templates, and the messages exchanged with the business's customers (phone number, profile name, message text, media and delivery status). For phone assistants: caller number, call transcript and, where the business enables it, the call recording.</p>
        <p><b className="text-white">How we use it.</b> Only to provide the service the business asked for: answering questions, booking or changing appointments, sending reminders the customer agreed to, handing conversations to the business's staff, and fixing errors. We do not use this data for advertising, we do not sell it, and we do not use it to train AI models.</p>
        <p><b className="text-white">Sub-processors.</b> Meta Platforms (WhatsApp Business Platform), AI model providers (OpenAI, Google) to generate replies, our automation and hosting providers (n8n on Railway, Supabase, Vercel), voice providers (Vapi, ElevenLabs, speech-to-text providers) for phone assistants, and the business's own tools it asks us to connect (for example Google Calendar, Google Sheets, Gmail). Each receives only what it needs to do its part.</p>
        <p><b className="text-white">Retention.</b> Conversation history is kept only as long as the business needs it to serve its customers, and no longer than 12 months unless the business asks for a different period or the law requires it. When a business stops using our service or disconnects its WhatsApp account, we delete its data within 30 days.</p>

        <h2 className="pt-4 font-display text-xl font-semibold text-white">3. Security</h2>
        <p>Access tokens and secrets are kept server-side and encrypted at rest by our providers. Access to data is limited to the people who operate the service. Data is sent over encrypted connections (HTTPS).</p>

        <h2 className="pt-4 font-display text-xl font-semibold text-white">4. Your rights and data deletion</h2>
        <p>You can ask to see, correct or delete your data. Email {mail} with the subject “Data deletion”, and include your phone number or email and the business you contacted. We confirm and complete the request within 30 days. If you are a customer of a business that uses our service, you can also contact that business directly; we will help it fulfil your request.</p>
        <p>A business can disconnect its WhatsApp account from our application at any time in Meta Business Settings, and ask us to delete all of its data.</p>

        <h2 className="pt-4 font-display text-xl font-semibold text-white">5. Changes</h2>
        <p>We will update this page when our practices change and show the date at the top.</p>
      </section>
    </>
  );
}
