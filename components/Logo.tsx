import Link from "next/link";
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-3" aria-label="Fahd AI Services home">
      <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-electric to-electric-600 shadow-glow">
        <svg viewBox="0 0 32 32" className="h-6 w-6" aria-hidden="true">
          <rect x="6" y="9" width="20" height="15" rx="6" fill="#F4F8FF" />
          <rect x="9" y="12" width="14" height="8" rx="4" fill="#040D22" />
          <rect x="11.5" y="14.5" width="3" height="3" rx="1.5" fill="#3DD8FF" />
          <rect x="17.5" y="14.5" width="3" height="3" rx="1.5" fill="#3DD8FF" />
          <path d="M16 4v5" stroke="#F4F8FF" strokeWidth="1.6" /><circle cx="16" cy="4" r="1.8" fill="#3DD8FF" />
        </svg>
      </span>
      {!compact && (
        <span className="leading-tight">
          <span className="block font-display text-[17px] font-semibold tracking-tight text-white">Fahd <span className="text-electric-400">AI</span> Services</span>
          <span className="block text-[10px] uppercase tracking-[0.24em] text-silver-400">Automate · Engage · Grow</span>
        </span>
      )}
    </Link>
  );
}
