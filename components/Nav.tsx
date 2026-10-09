"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV } from "@/lib/site";
import { Logo } from "./Logo";
import { Icon } from "./Icon";

export function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const active = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));
  return (
    <header className={`sticky top-0 z-50 transition-all ${scrolled ? "border-b border-white/[0.06] bg-night-950/80 backdrop-blur-xl" : "bg-transparent"}`}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:text-night-950">Skip to content</a>
      <nav className="wrap flex h-[72px] items-center gap-6" aria-label="Main">
        <Logo />
        <ul className="ml-auto hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <li key={n.href}>
              <Link href={n.href} aria-current={active(n.href) ? "page" : undefined}
                className={`relative rounded-lg px-3.5 py-2 text-sm font-medium transition ${active(n.href) ? "text-white" : "text-silver-400 hover:text-white"}`}>
                {n.label}
                {active(n.href) && <span className="absolute inset-x-3 -bottom-0.5 h-px bg-gradient-to-r from-transparent via-cyan to-transparent" />}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/contact?type=consultation" className="btn-primary ml-auto hidden !py-2.5 sm:inline-flex lg:ml-2">Book a Consultation</Link>
        <button className="ml-auto grid h-10 w-10 place-items-center rounded-lg border border-white/10 text-white sm:ml-0 lg:hidden" aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((o) => !o)}>
          <Icon name={open ? "close" : "menu"} />
        </button>
      </nav>
      {open && (
        <div id="mobile-nav" className="border-t border-white/[0.06] bg-night-950/95 backdrop-blur-xl lg:hidden">
          <ul className="wrap flex flex-col py-3">
            {NAV.map((n) => (
              <li key={n.href}><Link href={n.href} aria-current={active(n.href) ? "page" : undefined} className={`block rounded-lg px-3 py-3 text-base ${active(n.href) ? "bg-white/[0.05] text-white" : "text-silver"}`}>{n.label}</Link></li>
            ))}
            <li className="pt-2"><Link href="/contact?type=consultation" className="btn-primary w-full">Book a Consultation</Link></li>
          </ul>
        </div>
      )}
    </header>
  );
}
