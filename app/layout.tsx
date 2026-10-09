import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SITE } from "@/lib/site";

// Self-hosted variable fonts (faster, private, no third-party request).
const display = localFont({ src: "./fonts/sora.woff2", variable: "--font-display", weight: "100 800", display: "swap" });
const body = localFont({ src: "./fonts/inter.woff2", variable: "--font-body", weight: "100 900", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} — AI Agents, Automation & Custom Software`, template: `%s · ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: ["AI automation", "n8n developer", "AI agents", "AI voice receptionist", "WhatsApp chatbot", "web development", "custom software", "CRM automation"],
  openGraph: { type: "website", siteName: SITE.name, title: `${SITE.name} — ${SITE.tagline}`, description: SITE.description, url: SITE.url, images: [{ url: "/og.png", width: 1200, height: 630, alt: SITE.name }] },
  twitter: { card: "summary_large_image", title: `${SITE.name} — ${SITE.tagline}`, description: SITE.description, images: ["/og.png"] },
  icons: { icon: "/icon.svg" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = { themeColor: "#030B1E", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
