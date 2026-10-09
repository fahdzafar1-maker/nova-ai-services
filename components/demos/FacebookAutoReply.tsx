"use client";
import { AutoReplyPlayer } from "./AutoReplyShort";
import { Icon } from "@/components/Icon";

export function FacebookAutoReply() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,330px)_minmax(0,330px)_1fr]">
      <div>
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-silver-400">5-second short (MP4)</p>
        <video className="aspect-[9/16] w-full rounded-[28px] border border-white/10 bg-night-950 object-cover" src="/demos/facebook-auto-reply.mp4" poster="/demos/facebook-auto-reply.jpg" controls muted loop playsInline autoPlay preload="metadata" aria-label="5 second demo video: AI replies to Facebook comments; commenter names are blurred" />
        <a href="/demos/facebook-auto-reply.mp4" download className="mt-3 inline-flex items-center gap-1.5 text-xs text-cyan hover:underline">Download the short <Icon name="arrow" className="h-3.5 w-3.5 rotate-90" /></a>
      </div>
      <div>
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-silver-400">Live animation</p>
        <AutoReplyPlayer />
      </div>
      <div className="card p-6">
        <h3 className="font-display text-lg font-semibold text-white">How it works</h3>
        <ol className="mt-4 space-y-4 text-sm text-silver">
          {[
            ["Comment arrives", "Meta sends a webhook to n8n the moment someone comments on a post or ad."],
            ["AI writes the reply", "The AI reads the comment, checks your approved answers (prices, location, offers) and writes a short, on-brand public reply."],
            ["Private follow-up", "Details go to Messenger as a private reply, turning the commenter into a conversation."],
            ["Lead captured", "Interested people land in your CRM with the post they came from. Spam and abuse are hidden, complaints go to a human."],
          ].map(([t, d], i) => (
            <li key={t} className="flex gap-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-electric/20 font-mono text-xs text-cyan">{i + 1}</span><span><b className="text-white">{t}.</b> {d}</span></li>
          ))}
        </ol>
        <p className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs text-silver-400">Privacy: commenter names and photos are blurred in this demo. The page and comments are samples. Uses the official Meta Graph API.</p>
      </div>
    </div>
  );
}
