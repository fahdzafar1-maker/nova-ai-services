import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "./LoginForm";
import { Logo } from "@/components/Logo";
export const metadata: Metadata = { title: "Admin login", robots: { index: false, follow: false } };
export default function LoginPage() {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(43,143,255,.22),transparent_60%)]" />
      <div className="grid-bg absolute inset-0" />
      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex justify-center"><Logo /></div>
        <Suspense fallback={<div className="card h-80" />}><LoginForm /></Suspense>
        <p className="mt-6 text-center text-xs text-silver-600">Protected area. Access is logged.</p>
      </div>
    </main>
  );
}
