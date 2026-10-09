import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import { AdminNav } from "./AdminNav";
export const metadata: Metadata = { title: { default: "Admin", template: "%s · Admin" }, robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireAdmin();
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <AdminNav email={profile?.email ?? ""} />
      <main className="min-w-0 px-4 py-6 sm:px-8 lg:py-8">{children}</main>
    </div>
  );
}
