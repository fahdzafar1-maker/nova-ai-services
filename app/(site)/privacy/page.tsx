import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { SITE } from "@/lib/site";
export const metadata: Metadata = { title: "Privacy", description: "How Fahd AI Services handles your data.", alternates: { canonical: "/privacy" } };
export default function Privacy() {
  return (
    <>
      <PageHero eyebrow="Privacy" title="Your data, handled carefully" />
      <section className="wrap max-w-3xl space-y-5 text-silver">
        <p><b className="text-white">What we collect.</b> When you submit the contact form or agree to share details with our AI assistant, we store your name, email, phone (optional), company, the service you're interested in and your message, so we can reply.</p>
        <p><b className="text-white">AI assistant.</b> Conversations are processed by Google Gemini to generate replies. We do not store chat transcripts; we only keep basic metadata (message count, topic, whether a request was submitted). Your contact details are saved only after you say yes.</p>
        <p><b className="text-white">Analytics.</b> Only if you click “Allow”, we record anonymous page and demo views using a random identifier stored in a first-party cookie. We never store IP addresses or personal details in analytics. You can decline and the site works the same.</p>
        <p><b className="text-white">Sharing.</b> We don't sell data. Inquiry details may be passed to our own automation tools (such as n8n) to notify us and manage follow-ups.</p>
        <p><b className="text-white">Your rights.</b> To see, correct or delete your data, email <a className="text-cyan underline" href={`mailto:${SITE.email}`}>{SITE.email}</a>.</p>
      </section>
    </>
  );
}
