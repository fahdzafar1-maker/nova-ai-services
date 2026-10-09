import Link from "next/link";
import { NAV, SITE } from "@/lib/site";
import { Logo } from "./Logo";
import { Icon } from "./Icon";

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-white/[0.06] bg-night-950">
      <div className="wrap grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-silver-400">{SITE.description}</p>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-silver-600">Explore</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {NAV.map((n) => <li key={n.href}><Link className="text-silver hover:text-white" href={n.href}>{n.label}</Link></li>)}
            <li><Link className="text-silver hover:text-white" href="/privacy">Privacy</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-silver-600">Contact</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li><a className="flex items-center gap-2 text-silver hover:text-white" href={SITE.whatsappLink} target="_blank" rel="noopener noreferrer"><Icon name="whatsapp" className="h-4 w-4 text-cyan" /> {SITE.whatsapp}</a></li>
            <li><a className="flex items-center gap-2 text-silver hover:text-white" href={`mailto:${SITE.email}`}><Icon name="mail" className="h-4 w-4 text-cyan" /> {SITE.email}</a></li>
            <li className="flex items-center gap-2 text-silver-400"><Icon name="globe" className="h-4 w-4 text-cyan" /> {SITE.location}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/[0.05]">
        <div className="wrap flex flex-col justify-between gap-2 py-5 text-xs text-silver-600 sm:flex-row">
          <span>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</span>
          <span>Demos use synthetic sample data. No real customer information is shown.</span>
        </div>
      </div>
    </footer>
  );
}
