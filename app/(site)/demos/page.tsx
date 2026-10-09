import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { DemoGallery } from "@/components/DemoGallery";
import { getDemos } from "@/lib/data";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Live Demos",
  description: "Interactive demos: AI voice receptionist, WhatsApp AI chatbot, clinic receptionist, n8n lead engine, Facebook auto-replies, websites and dashboards.",
  alternates: { canonical: "/demos" },
};

export default async function DemosPage() {
  const demos = await getDemos();
  return (
    <>
      <PageHero eyebrow="Demos" title={<>Experience the systems <span className="text-gradient">before you buy them</span></>}
        intro="Every demo runs in an isolated sandbox with synthetic sample data. No real customer information, credentials or production systems are ever exposed." />
      <section className="wrap"><DemoGallery demos={demos} /></section>
    </>
  );
}
