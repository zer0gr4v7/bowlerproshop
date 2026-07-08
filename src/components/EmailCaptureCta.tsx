import type { FormEvent } from "react";
import { useState } from "react";
import { trackEmailSignup } from "../lib/analytics";

export default function EmailCaptureCta({
  sourcePage,
  headline = "Free League Night Gear Checklist",
  description = "Get a printable checklist of everything you need for league night — gear, supplies, and pre-game prep.",
}: {
  sourcePage: string;
  headline?: string;
  description?: string;
}) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    trackEmailSignup({
      sourcePage,
      gearNeed: "checklist",
    });

    // Placeholder: replace with actual email service integration
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="border border-teal-500/25 bg-navy-900 p-6 rounded-sm my-8 text-center">
        <p className="text-teal-400 font-bold text-sm">Thanks! Check your inbox.</p>
        <p className="text-slate-400 text-xs mt-2">
          If you do not see it, check spam. The checklist arrives within a few minutes.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-teal-500/25 bg-navy-900 p-6 rounded-sm my-8">
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-teal-400 mb-1">
        Free resource
      </p>
      <h3 className="text-xl font-bold text-bone-100 mb-2">{headline}</h3>
      <p className="text-sm text-slate-400 mb-4 leading-relaxed">{description}</p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 px-4 py-2 bg-navy-900 border border-slate-700/60 rounded text-sm text-bone-100 placeholder:text-slate-600 focus:border-teal-500 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-amber-500 hover:bg-amber-400 text-navy-900 px-5 py-2 rounded text-[11px] font-bold uppercase tracking-wider whitespace-nowrap"
        >
          Send me the checklist
        </button>
      </form>
      <p className="text-[10px] text-slate-600 mt-3">
        No spam. Unsubscribe anytime. We send one email with the checklist, then occasional gear tips.
      </p>
    </div>
  );
}
