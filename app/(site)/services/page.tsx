import type { Metadata } from "next";
import { Suspense } from "react";
import { getServices, getDemos } from "@/lib/data";
import { ServicesExplorer } from "@/components/ServicesExplorer";
import { PageHero } from "@/components/PageHero";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Products & Services",
  description: "AI automation, AI agents, website & software development and business growth automation. Explore every service and its live demo.",
  alternates: { canonical: "/services" },
};

export default async function ServicesPage() {
  const [services, demos] = await Promise.all([getServices(), getDemos()]);
  const demoTitles = Object.fromEntries(demos.map((d) => [d.slug, d.title]));
  return (
    <>
      <PageHero eyebrow="Products & Services" title={<>Everything you need to <span className="text-gradient">run on autopilot</span></>}
        intro="Four practice areas, one standard: reliable systems with error handling, security-conscious implementation and long-term support. Filter by category or search for what you need." />
      <section className="wrap mt-4">
        <Suspense fallback={null}><ServicesExplorer services={services} demoTitles={demoTitles} /></Suspense>
      </section>
    </>
  );
}
