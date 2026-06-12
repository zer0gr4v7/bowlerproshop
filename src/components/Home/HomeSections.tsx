import { Link } from "react-router-dom";
import { useState } from "react";
import { ArrowRight, ChevronRight, Search, Sparkles } from "lucide-react";
import { guidePages } from "../../lib/site";
import { trackEmailSignup } from "../../lib/analytics";

const categoryChips = [
  { label: "Bowling Balls", href: "/gear/bowling-balls" },
  { label: "Bags", href: "/gear/bowling-bags" },
  { label: "Shoes", href: "/gear/bowling-shoes" },
  { label: "Accessories", href: "/gear/bowling-accessories" },
  { label: "Grips & Tape", href: "/best/bowling-accessories-for-beginners" },
];

export function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-76px)] overflow-hidden bg-navy-900">
      <img
        src="/brand/bps-neon-hero.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-70"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#050507_0%,rgba(5,5,7,0.9)_34%,rgba(5,5,7,0.44)_74%,#050507_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 lane-gradient opacity-50" />

      <div className="container relative z-10 mx-auto px-4 py-20 md:px-8 lg:py-28">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-caution/40 bg-caution/10 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.28em] text-bone-100 shadow-[0_0_26px_rgba(255,37,24,0.2)]">
            <Sparkles size={14} className="text-caution" />
            Search bowling gear deals
          </div>

          <h1 className="headline mb-6 max-w-2xl text-6xl leading-[0.92] text-bone-100 md:text-8xl">
            Find the Right <span className="neon-red">Gear Fast</span>
          </h1>

          <p className="mb-9 max-w-2xl text-lg leading-relaxed text-slate-500 md:text-2xl">
            Compare bowling balls, shoes, bags, grips, tape, towels, and accessories by fit, budget, and lane condition.
          </p>

          <form
            className="mb-6 max-w-2xl rounded-[18px] border-2 bg-[#080A10]/92 p-2 neon-blue-border"
            onSubmit={(event) => event.preventDefault()}
          >
            <label className="sr-only" htmlFor="homepage-gear-search">
              Search bowling gear
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="flex min-h-14 flex-1 items-center gap-3 rounded-xl px-4">
                <Search size={22} className="shrink-0 text-caution" />
                <input
                  id="homepage-gear-search"
                  type="search"
                  placeholder="Search bowling balls, shoes, bags..."
                  className="w-full bg-transparent text-base text-bone-100 outline-none placeholder:text-slate-500"
                />
              </div>
              <Link
                to="/find-my-gear"
                className="neon-red-button inline-flex min-h-14 items-center justify-center gap-2 rounded-full px-7 text-xs font-black uppercase tracking-[0.18em]"
              >
                Find My Gear
                <ArrowRight size={16} />
              </Link>
            </div>
          </form>

          <div className="flex max-w-3xl flex-wrap gap-3">
            {categoryChips.map((chip, index) => (
              <Link
                key={chip.label}
                to={chip.href}
                className={`rounded-full border px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em] transition-all ${
                  index % 2 === 0
                    ? "border-teal-500/60 bg-teal-500/10 text-teal-500 hover:bg-teal-500 hover:text-navy-900"
                    : "border-caution/60 bg-caution/10 text-bone-100 hover:bg-caution"
                }`}
              >
                {chip.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function AudiencePathways() {
  const pathways = [
    { title: "Balls", desc: "Match hook, oil, and budget", link: "/gear/bowling-balls" },
    { title: "Shoes", desc: "Upgrade from rentals cleanly", link: "/gear/bowling-shoes" },
    { title: "Bags", desc: "Plan league-night storage", link: "/gear/bowling-bags" },
    { title: "Accessories", desc: "Build the maintenance kit", link: "/gear/bowling-accessories" },
  ];

  return (
    <section className="border-y border-slate-800 bg-[#020205]">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {pathways.map((path) => (
          <Link
            key={path.title}
            to={path.link}
            className="group border-b border-slate-800 p-6 transition-all hover:bg-teal-500/5 sm:border-r lg:border-b-0"
          >
            <h2 className="headline mb-2 text-3xl text-bone-100 group-hover:text-teal-500">{path.title}</h2>
            <p className="text-sm text-slate-500">{path.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function DecisionEngineSection() {
  return (
    <section className="bg-navy-900 px-4 py-24 md:px-8">
      <div className="container mx-auto grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="mb-4 text-[10px] font-extrabold uppercase tracking-[0.32em] text-teal-500">
            Product discovery
          </p>
          <h2 className="headline mb-6 text-5xl leading-[0.96] text-bone-100 md:text-7xl">
            Start with your game, <span className="text-caution">then shop.</span>
          </h2>
          <p className="mb-8 max-w-xl text-lg leading-relaxed text-slate-500">
            Tell the selector how you bowl, where the ball misses, and what you want to spend. It turns that into a practical shortlist, then reminds you what still needs a local pro shop check.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              to="/tools/bowling-ball-selector"
              className="neon-red-button inline-flex items-center justify-center gap-3 rounded-full px-7 py-4 text-xs font-black uppercase tracking-[0.18em]"
            >
              Bowling Ball Selector
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/tools/bowling-shoe-selector"
              className="inline-flex items-center justify-center gap-3 rounded-full border border-teal-500/70 px-7 py-4 text-xs font-black uppercase tracking-[0.18em] text-teal-500 hover:bg-teal-500 hover:text-navy-900"
            >
              Shoe Selector
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-teal-500/20 bg-[#111318] shadow-[0_0_42px_rgba(11,73,255,0.2)]">
          <img
            src="/brand/bps-gear-banner.png"
            alt="Neon-lit bowling gear on a pro shop counter"
            className="aspect-[16/9] w-full object-cover"
          />
          <div className="grid gap-3 p-5 sm:grid-cols-3">
            {["Fit first", "Lane aware", "Budget clear"].map((item) => (
              <div key={item} className="rounded border border-slate-800 bg-navy-900/70 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function FeaturedGuides() {
  const guides = guidePages.slice(0, 6);

  return (
    <section className="border-y border-slate-800 bg-[#020205] px-4 py-24 md:px-8">
      <div className="container mx-auto">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.32em] text-caution">
              Buying guides
            </p>
            <h2 className="headline text-5xl text-bone-100 md:text-6xl">Practical before checkout</h2>
          </div>
          <Link
            to="/guides"
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-teal-500"
          >
            View all guides
            <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => (
            <Link
              key={guide.path}
              to={guide.path}
              className="glass group rounded-lg p-6 transition-all hover:-translate-y-1 hover:border-teal-500/50"
            >
              <p className="mb-4 text-[10px] font-black uppercase tracking-[0.26em] text-teal-500">
                {guide.category}
              </p>
              <h3 className="headline mb-4 text-2xl leading-tight text-bone-100 group-hover:text-amber-500">
                {guide.title.replace(" | BowlerProShop.com", "")}
              </h3>
              <p className="text-sm leading-relaxed text-slate-500">{guide.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BrandStory() {
  return (
    <section className="bg-navy-900 px-4 py-24 md:px-8">
      <div className="container mx-auto grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
        <div>
          <p className="mb-4 text-[10px] font-extrabold uppercase tracking-[0.32em] text-teal-500">
            Useful before checkout
          </p>
          <h2 className="headline mb-7 max-w-3xl text-5xl leading-[0.95] text-bone-100 md:text-7xl">
            Built for the bowler between casual and committed.
          </h2>
          <p className="max-w-2xl text-lg leading-relaxed text-slate-500">
            Most gear advice assumes you already speak pro shop language. BowlerProShop translates coverstock, slide soles, ball weight, bags, cleaner, and tape into decisions a league or returning bowler can act on.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            ["Fit", "Span, slide, support"],
            ["Lane", "Oil and friction"],
            ["Budget", "Buy once, buy right"],
            ["Proof", "Sources and caveats"],
          ].map(([label, value]) => (
            <div key={label} className="glass rounded-lg p-6">
              <p className="headline mb-2 text-4xl text-bone-100">{label}</p>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function B2BSection() {
  return (
    <section className="border-y border-slate-800 bg-[#020205] px-4 py-20 md:px-8">
      <div className="container mx-auto text-center">
        <h2 className="headline mb-5 text-5xl text-bone-100 md:text-6xl">For alleys and pro shops</h2>
        <p className="mx-auto mb-9 max-w-3xl text-lg leading-relaxed text-slate-500">
          Use BowlerProShop.com as a search and education layer for bowler onboarding, league-night gear planning, and pro shop discovery.
        </p>
        <Link
          to="/pro-shops"
          className="inline-flex items-center gap-3 rounded-full border border-teal-500/70 px-8 py-4 text-xs font-black uppercase tracking-[0.18em] text-teal-500 hover:bg-teal-500 hover:text-navy-900"
        >
          View Pro Shop Resources
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}

export function EmailCapture() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="bg-navy-900 px-4 py-20 md:px-8">
      <div className="container mx-auto">
        <div className="grid gap-8 rounded-lg border border-caution/25 bg-[#111318] p-8 shadow-[0_0_34px_rgba(255,37,24,0.12)] md:grid-cols-[1fr_0.9fr] md:p-12">
          <div>
            <p className="mb-4 text-[10px] font-black uppercase tracking-[0.32em] text-caution">
              Free resource
            </p>
            <h2 className="headline mb-5 text-5xl text-bone-100 md:text-6xl">Beginner gear checklist</h2>
            <p className="max-w-xl text-lg leading-relaxed text-slate-500">
              Get the core items every league-ready bowler should understand before buying a full setup.
            </p>
          </div>

          <form
            className="rounded-lg border border-teal-500/20 bg-navy-900 p-5"
            onSubmit={async (event) => {
              event.preventDefault();
              trackEmailSignup({ sourcePage: "/", gearNeed: "beginner_checklist" });
              await fetch("/api/email-signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, gearNeed: "beginner_checklist" }),
              }).catch(() => undefined);
              setEmail("");
              setSubmitted(true);
            }}
          >
            <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              Email address
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="min-h-12 flex-1 rounded-full border border-slate-800 bg-[#080A10] px-4 text-sm text-bone-100 outline-none focus:border-teal-500"
                required
              />
              <button type="submit" className="neon-red-button rounded-full px-6 py-3 text-xs font-black uppercase tracking-[0.18em]">
                Get checklist
              </button>
            </div>
            {submitted && (
              <p className="mt-3 text-xs font-semibold text-teal-400">
                Request received. We will use this list for the next gear checklist send.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
