import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Layout from "../components/Layout";
import ProductModule from "../components/ProductModule";
import { findGuidePage, guidePages } from "../lib/site";

function RenderBody({ body }: { body: string }) {
  const blocks = body.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);

  return (
    <div className="space-y-4 text-lg leading-relaxed text-slate-400">
      {blocks.map((block) => {
        const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
        const isList = lines.every((line) => line.startsWith("- "));

        if (isList) {
          return (
            <ul key={block} className="space-y-2 pl-5">
              {lines.map((line) => (
                <li key={line} className="list-disc marker:text-teal-500">
                  {line.replace(/^- /, "")}
                </li>
              ))}
            </ul>
          );
        }

        return <p key={block}>{block}</p>;
      })}
    </div>
  );
}

export default function Guides() {
  const { pathname } = useLocation();
  const guide = findGuidePage(pathname);
  const relatedGuide = guidePages.find(
    (candidate) => candidate.path !== guide?.path && candidate.category === guide?.category,
  ) || guidePages.find((candidate) => candidate.path !== guide?.path);

  if (guide) {
    return (
      <Layout>
        <article className="px-4 md:px-8 py-20 bg-navy-900">
          <div className="container mx-auto max-w-4xl">
            <Link
              to="/guides"
              className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-teal-500 mb-10"
            >
              Back to guides
            </Link>
            <p className="text-[10px] font-bold tracking-[0.35em] uppercase text-teal-500 mb-4">
              {guide.category}
            </p>
            <h1 className="headline text-5xl md:text-7xl text-bone-100 mb-6">
              {guide.title.replace(" | BowlerProShop.com", "")}
            </h1>
            <div className="flex flex-wrap gap-3 mb-10 text-[10px] font-bold uppercase tracking-[0.2em]">
              <span className="bg-teal-500/15 text-teal-400 px-3 py-2 border border-teal-500/20">
                Updated {guide.lastUpdated}
              </span>
              <span className="bg-amber-500/15 text-amber-300 px-3 py-2 border border-amber-500/20">
                {guide.difficulty}
              </span>
              <span className="bg-white/5 text-slate-300 px-3 py-2 border border-white/10">
                {guide.monetization}
              </span>
            </div>
            <p className="text-xl text-slate-300 leading-relaxed mb-12">
              {guide.intro}
            </p>
            {guide.path.startsWith("/best/") && (
              <ProductModule
                slug={guide.path.replace("/best/", "")}
                sourcePage={guide.path}
              />
            )}
            <div className="space-y-10">
              {guide.sections.map((section) => (
                <section key={section.heading} className="border-t border-slate-800 pt-8">
                  <h2 className="headline text-3xl text-bone-100 mb-4">
                    {section.heading}
                  </h2>
                  <RenderBody body={section.body} />
                </section>
              ))}
            </div>
            {guide.faqs?.length ? (
              <section className="mt-14 border-t border-slate-800 pt-8">
                <h2 className="headline mb-6 text-4xl text-bone-100">FAQ</h2>
                <div className="space-y-4">
                  {guide.faqs.map((faq) => (
                    <article key={faq.question} className="rounded-sm border border-teal-500/15 bg-[#111318] p-5">
                      <h3 className="mb-2 text-base font-bold text-bone-100">{faq.question}</h3>
                      <p className="leading-relaxed text-slate-400">{faq.answer}</p>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}
            {guide.sources?.length ? (
              <section className="mt-10 rounded-sm border border-slate-800 bg-[#080A10] p-5">
                <h2 className="mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">
                  Sources and further reading
                </h2>
                <ul className="space-y-2 text-sm text-slate-400">
                  {guide.sources.map((source) => (
                    <li key={source.url}>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-400 hover:text-teal-300"
                      >
                        {source.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
            <div className="mt-14 border border-amber-500/20 bg-amber-500/10 p-6">
              <p className="text-sm text-amber-100 leading-relaxed mb-5">
                As an Amazon Associate I earn from qualifying purchases. Merchant links
                may earn commissions, but recommendations are based on practical fit criteria.
              </p>
              <Link
                to={guide.ctaPath}
                className="inline-flex items-center gap-2 bg-amber-500 text-navy-900 px-6 py-3 rounded font-bold uppercase tracking-widest text-xs"
              >
                {guide.ctaLabel}
                <ChevronRight size={16} />
              </Link>
            </div>
            {relatedGuide && (
              <aside className="mt-8 rounded-sm border border-teal-500/20 bg-teal-500/10 p-6">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-teal-400">
                  Related guide
                </p>
                <Link to={relatedGuide.path} className="group inline-flex items-start gap-4">
                  <span>
                    <span className="block font-display text-2xl text-bone-100 group-hover:text-amber-500">
                      {relatedGuide.title.replace(" | BowlerProShop.com", "")}
                    </span>
                    <span className="mt-2 block text-sm leading-relaxed text-slate-400">
                      {relatedGuide.description}
                    </span>
                  </span>
                  <ChevronRight className="mt-2 shrink-0 text-teal-500" size={18} />
                </Link>
              </aside>
            )}
          </div>
        </article>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="px-4 md:px-8 py-20 bg-navy-900">
        <div className="container mx-auto">
          <div className="max-w-3xl mb-14">
            <p className="text-[10px] font-bold tracking-[0.35em] uppercase text-teal-500 mb-4">
              Bowler Gear Guides
            </p>
            <h1 className="headline text-5xl md:text-7xl text-bone-100 mb-6">
              Practical decisions before checkout
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed">
              Start with fit, lane condition, and skill level. Then shortlist products.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guidePages.map((guide) => (
              <Link
                key={guide.title}
                to={guide.path}
                className="glass p-8 rounded-sm hover:bg-white/5 transition-colors group"
              >
                <h2 className="headline text-3xl text-bone-100 mb-4 group-hover:text-amber-500">
                  {guide.title.replace(" | BowlerProShop.com", "")}
                </h2>
                <p className="text-slate-400 mb-8 leading-relaxed">{guide.description}</p>
                <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-teal-500">
                  Read guide <ChevronRight size={16} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
