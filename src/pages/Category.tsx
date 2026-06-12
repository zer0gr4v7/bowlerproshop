import { Link, useLocation } from "react-router-dom";
import { ArrowRight, CheckCircle2, Search, ShieldCheck } from "lucide-react";
import Layout from "../components/Layout";
import { findCategoryPage, guidePages } from "../lib/site";

export default function Category() {
  const { pathname } = useLocation();
  const category = findCategoryPage(pathname) || findCategoryPage("/gear/bowling-balls");
  const relatedGuides = guidePages.filter((guide) => category?.relatedGuidePaths.includes(guide.path));

  if (!category) return null;

  return (
    <Layout>
      <main className="bg-navy-900">
        <section className="border-b border-slate-800 px-4 py-20 md:px-8">
          <div className="container mx-auto grid gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <p className="mb-4 text-[10px] font-black uppercase tracking-[0.32em] text-teal-500">
                {category.eyebrow}
              </p>
              <h1 className="headline mb-6 max-w-3xl text-5xl leading-[0.95] text-bone-100 md:text-7xl">
                {category.title.split(" | ")[0]}
              </h1>
              <p className="mb-8 max-w-2xl text-lg leading-relaxed text-slate-400">
                {category.intro}
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  to={category.primaryCta.path}
                  className="neon-red-button inline-flex items-center justify-center gap-3 rounded-full px-7 py-4 text-xs font-black uppercase tracking-[0.18em]"
                >
                  {category.primaryCta.label}
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/disclosure"
                  className="inline-flex items-center justify-center gap-3 rounded-full border border-teal-500/60 px-7 py-4 text-xs font-black uppercase tracking-[0.18em] text-teal-500 hover:bg-teal-500 hover:text-navy-900"
                >
                  How links work
                </Link>
              </div>
            </div>

            <aside className="rounded-lg border border-teal-500/20 bg-[#111318] p-6 shadow-[0_0_36px_rgba(11,73,255,0.14)]">
              <div className="mb-6 flex items-center gap-3">
                <Search className="text-caution" size={22} />
                <h2 className="headline text-3xl text-bone-100">Best for</h2>
              </div>
              <ul className="grid gap-3">
                {category.bestFor.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="mt-0.5 shrink-0 text-teal-500" size={16} />
                    {item}
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </section>

        <section className="px-4 py-16 md:px-8">
          <div className="container mx-auto grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.32em] text-caution">
                Starter kit logic
              </p>
              <h2 className="headline mb-5 text-4xl text-bone-100 md:text-5xl">
                Build the setup before chasing deals.
              </h2>
              <p className="max-w-xl text-base leading-relaxed text-slate-500">
                These are category-level planning blocks, not a paid shopping cart. Merchant-specific bundles should wait until affiliate approvals and tracking IDs are fully documented.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {category.starterKit.map((kitItem) => (
                <article key={kitItem.item} className="rounded-lg border border-slate-800 bg-[#111318] p-5">
                  <h3 className="mb-3 text-sm font-black uppercase tracking-[0.14em] text-bone-100">
                    {kitItem.item}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-500">{kitItem.reason}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-slate-800 bg-[#020205] px-4 py-16 md:px-8">
          <div className="container mx-auto">
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="mb-3 text-[10px] font-black uppercase tracking-[0.32em] text-teal-500">
                  Related guides
                </p>
                <h2 className="headline text-4xl text-bone-100 md:text-5xl">Read before checkout</h2>
              </div>
              <Link to="/guides" className="text-xs font-black uppercase tracking-[0.18em] text-teal-500">
                View all guides
              </Link>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {relatedGuides.map((guide) => (
                <Link
                  key={guide.path}
                  to={guide.path}
                  className="glass rounded-lg p-6 transition-all hover:-translate-y-1 hover:border-teal-500/50"
                >
                  <p className="mb-3 text-[10px] font-black uppercase tracking-[0.24em] text-caution">
                    {guide.category}
                  </p>
                  <h3 className="headline mb-4 text-2xl leading-tight text-bone-100">
                    {guide.title.replace(" | BowlerProShop.com", "")}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-500">{guide.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-14 md:px-8">
          <div className="container mx-auto flex flex-col gap-4 rounded-lg border border-amber-500/20 bg-amber-500/10 p-6 md:flex-row md:items-center md:justify-between">
            <div className="flex max-w-3xl gap-4">
              <ShieldCheck className="mt-1 shrink-0 text-amber-300" size={24} />
              <p className="text-sm leading-relaxed text-amber-100">
                BowlerProShop may earn from merchant links. Use category pages to narrow the decision, then confirm fit, drilling, and surface choices with a local pro shop before final purchase.
              </p>
            </div>
            <Link
              to={category.primaryCta.path}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-xs font-black uppercase tracking-[0.18em] text-navy-900"
            >
              {category.primaryCta.label}
              <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}
