import Layout from "../components/Layout";

export default function Disclosure() {
  return (
    <Layout>
      <section className="px-4 md:px-8 py-20 bg-navy-900">
        <div className="container mx-auto max-w-3xl">
          <p className="text-[10px] font-bold tracking-[0.35em] uppercase text-teal-500 mb-4">
            Affiliate Disclosure
          </p>
          <h1 className="headline text-5xl md:text-7xl text-bone-100 mb-8">
            How BowlerProShop.com earns
          </h1>
          <div className="space-y-6 text-slate-300 leading-relaxed">
            <p>
              BowlerProShop.com may earn a commission when visitors buy through links to retailers,
              marketplaces, or manufacturer sites. These commissions do not change the price you pay.
            </p>
            <p>
              Recommendations are based on bowler inputs, product specifications, common pro shop
              criteria, and available retailer data. Affiliate relationships do not guarantee placement
              or a higher match score.
            </p>
            <p>
              Outbound merchant links should be treated as sponsored links. Amazon links may earn
              qualifying commissions through the Amazon Associates program.
            </p>
            <p>
              As an Amazon Associate I earn from qualifying purchases.
            </p>
            <p>
              For drilling, fit, or balance decisions, use the selector as a research aid and consult a
              qualified local pro shop before making irreversible equipment changes.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
