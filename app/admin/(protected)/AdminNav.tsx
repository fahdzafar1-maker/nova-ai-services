"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { Icon } from "@/components/Icon";
import { signOut } from "../actions";

const LINKS = [
  ["/admin/dashboard", "Dashboard", "chart"], ["/admin/leads", "Leads", "user"], ["/admin/inquiries", "Inquiries & bookings", "inbox"],
  ["/admin/orders", "Order requests", "cart"], ["/admin/services", "Services", "grid"], ["/admin/demos", "Demos", "play"],
  ["/admin/analytics", "Analytics", "eye"], ["/admin/settings", "Settings", "settings"],
] as const;

export function AdminNav({ email }: { email: string }) {
  const path = usePathname();
  return (
    <aside className="border-b border-white/[0.06] bg-night-900/70 lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-col gap-1 p-4">
        <div className="mb-4 hidden lg:block"><Logo /></div>
        <nav aria-label="Admin" className="flex gap-1 overflow-x-auto lg:flex-col">
          {LINKS.map(([href, label, icon]) => {
            const on = path.startsWith(href);
            return (
              <Link key={href} href={href} aria-current={on ? "page" : undefined}
                className={`flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition ${on ? "bg-electric/15 text-white ring-1 ring-electric/30" : "text-silver-400 hover:bg-white/[0.04] hover:text-white"}`}>
                <Icon name={icon} className="h-4 w-4" />{label}
              </Link>
            );
          })}
          <form action={signOut} className="lg:hidden"><button className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-300"><Icon name="logout" className="h-4 w-4" />Sign out</button></form>
        </nav>
        <div className="mt-auto hidden border-t border-white/[0.06] pt-4 lg:block">
          <p className="truncate text-xs text-silver-400">{email}</p>
          <div className="mt-2 flex gap-2">
            <Link href="/" className="text-xs text-silver hover:text-white">View site</Link>
            <form action={signOut}><button className="flex items-center gap-1 text-xs text-rose-300 hover:text-rose-200"><Icon name="logout" className="h-3.5 w-3.5" />Sign out</button></form>
          </div>
        </div>
      </div>
    </aside>
  );
}
