import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { SITE } from "@/lib/site";
export const metadata: Metadata = { title: "Terms of Service", description: "Terms for using the Fahd AI Services website and services.", alternates: { canonical: "/terms" } };

const UPDATED = "5 November 2026";
const mail = <a className="text-cyan underline" href={`mailto:${SITE.email}`}>{SITE.email}</a>;

export default function Terms() {
  return (
    <>
      <PageHero eyebrow="Terms of Service" title="Clear terms, no surprises" />
      <section className="wrap max-w-3xl space-y-5 text-silver">
        <p className="text-sm text-silver-400">Last updated: {UPDATED}</p>
        <p><b className="text-white">Who we are.</b> These terms are between you and {SITE.legal.name} (SECP LLP Reg. No. {SITE.legal.secpNo}, NTN {SITE.legal.ntn}), {SITE.legal.address}, trading as {SITE.name}. Contact: {mail}, {SITE.whatsapp}.</p>

        <h2 className="pt-4 font-display text-xl font-semibold text-white">1. Our services</h2>
        <p>We design, build and operate AI agents, WhatsApp assistants, website chat, AI phone receptionists, automated workflows, websites and custom software. The scope, price and timeline of each project are agreed in writing (proposal, quote or message) before work starts. Those written terms take priority over this page.</p>

        <h2 className="pt-4 font-display text-xl font-semibold text-white">2. WhatsApp Business Platform</h2>
        <p>When you connect your WhatsApp Business account to our application, you remain the owner of your account, phone number and customer relationships. You agree to follow the WhatsApp Business Terms of Service, the WhatsApp Business Messaging Policy and Meta's Commerce Policy, and to message only people who have agreed to hear from you. Meta charges for conversations directly to the payment method on your own WhatsApp Business account. You can disconnect our application at any time in Meta Business Settings.</p>

        <h2 className="pt-4 font-display text-xl font-semibold text-white">3. AI limitations and human handoff</h2>
        <p>AI assistants can make mistakes. They are set up to answer routine questions and handle bookings, and to hand anything sensitive (for example medical advice, complaints or payments) to your staff. AI assistants do not give medical, legal or financial advice. You are responsible for checking the information the assistant is allowed to share and for keeping it up to date.</p>

        <h2 className="pt-4 font-display text-xl font-semibold text-white">4. Your responsibilities</h2>
        <p>Use our services lawfully, have the consents your customers' data requires, keep your login details safe, and tell us quickly about any problem. Do not use our services for spam, fraud or unlawful content.</p>

        <h2 className="pt-4 font-display text-xl font-semibold text-white">5. Data</h2>
        <p>We handle personal data as described in our <a className="text-cyan underline" href="/privacy">Privacy Policy</a>. For data we process for your business, we act on your instructions as your service provider.</p>

        <h2 className="pt-4 font-display text-xl font-semibold text-white">6. Payment and cancellation</h2>
        <p>Fees and payment dates are set in your proposal or quote. Monthly services can be cancelled with 30 days' written notice unless your agreement says otherwise. Third-party costs (for example Meta conversation fees, phone numbers, AI usage) are billed as agreed or paid by you directly to the provider.</p>

        <h2 className="pt-4 font-display text-xl font-semibold text-white">7. Liability</h2>
        <p>We work with care and fix errors we are responsible for. To the extent the law allows, our total liability for any claim is limited to the fees you paid us for the affected service in the three months before the claim, and we are not liable for indirect losses or for outages of third-party platforms such as Meta, telephony or AI providers.</p>

        <h2 className="pt-4 font-display text-xl font-semibold text-white">8. Website content and demos</h2>
        <p>Website content belongs to us. Demos use synthetic sample data and show how a system can work; they are not a promise of specific results.</p>

        <h2 className="pt-4 font-display text-xl font-semibold text-white">9. Governing law</h2>
        <p>These terms are governed by the laws of Pakistan. We will first try to resolve any dispute by talking with you.</p>

        <h2 className="pt-4 font-display text-xl font-semibold text-white">10. Changes</h2>
        <p>We may update these terms and will show the date at the top. Questions: {mail}.</p>
      </section>
    </>
  );
}
