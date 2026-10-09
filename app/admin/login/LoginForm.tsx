"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { isSupabaseConfigured } from "@/lib/env";

const ERR: Record<string, string> = {
  config: "Supabase is not configured yet. Add the environment variables (see README).",
  forbidden: "This account does not have admin access.",
};

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(ERR[params.get("e") || ""] || "");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!isSupabaseConfigured()) { setError(ERR.config); return; }
    setBusy(true); setError("");
    const sb = supabaseBrowser();
    if (params.get("e") === "forbidden") await sb.auth.signOut();
    const { error } = await sb.auth.signInWithPassword({ email: email.trim(), password });
    if (error) { setError("Incorrect email or password."); setBusy(false); return; }
    const next = params.get("next");
    router.replace(next && next.startsWith("/admin/") ? next : "/admin/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="card space-y-4 p-7">
      <div>
        <h1 className="font-display text-xl font-semibold text-white">Admin sign in</h1>
        <p className="mt-1 text-sm text-silver-400">Fahd AI Services control panel</p>
      </div>
      <div><label className="label" htmlFor="a-email">Email</label><input id="a-email" type="email" autoComplete="username" required className="field" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
      <div><label className="label" htmlFor="a-pass">Password</label><input id="a-pass" type="password" autoComplete="current-password" required className="field" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
      {error && <p role="alert" className="rounded-lg border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-sm text-rose-200">{error}</p>}
      <button className="btn-primary w-full" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
    </form>
  );
}
