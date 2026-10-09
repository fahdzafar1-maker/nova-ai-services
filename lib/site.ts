// Single source of truth for approved company facts.
// The AI assistant is only allowed to state facts that appear in this file
// (plus the published services list). Edit here, redeploy, and every page + the AI update together.

export const SITE = {
  name: "Fahd AI Services",
  shortName: "Fahd AI",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://fahdaiservices.com",
  tagline: "Build Smarter. Automate Faster. Grow Without Limits.",
  description:
    "We build intelligent AI agents, automated workflows, custom websites, and business systems that help companies save time, improve customer experience, and scale their operations.",
  founder: "Fahd Zafar",
  email: "fahdzafar73@gmail.com",
  whatsapp: "+92 346 6998833",
  whatsappLink: "https://wa.me/923466998833",
  location: "Pakistan · serving clients worldwide",
  // Company milestones — confirmed by the owner (Oct 2026). Update here when they change.
  stats: [
    { value: 2, suffix: "", label: "Years delivering AI services" },
    { value: 8, suffix: "", label: "International clients on monthly services" },
    { value: 10, suffix: "", label: "Automation products delivered (one-time projects)" },
    { value: 24, suffix: "/7", label: "Systems that answer while you sleep" },
  ],
} as const;

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Products & Services" },
  { href: "/demos", label: "Demos" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
] as const;

export const INDUSTRIES = [
  "Real estate",
  "Clinics & hospitals",
  "Aesthetics & skin care",
  "Restaurants & cafés",
  "Home services & HVAC",
  "E-commerce & retail",
  "Pharmacies",
  "Hotels & bookings",
  "Agencies & consultants",
  "Education & coaching",
] as const;

export const BUDGETS = ["Not sure yet", "Under $500", "$500 – $1,500", "$1,500 – $5,000", "$5,000+", "Monthly retainer"] as const;
