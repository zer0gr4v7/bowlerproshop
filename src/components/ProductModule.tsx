import productsData from "../data/products.json";
import { trackEvent } from "../lib/analytics";

interface Merchant {
  name: string;
  go_path: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price_band: string;
  fit: string;
  best_for: string;
  merchants: Merchant[];
}

interface ProductsData {
  modules: Record<string, Product[]>;
}

const data = productsData as ProductsData;

function handleAffiliateClick(retailer: string, productId: string, sourcePage: string) {
  trackEvent({ event: "affiliate_click", retailer, product_id: productId, source_page: sourcePage });
}

export default function ProductModule({ slug, sourcePage }: { slug: string; sourcePage: string }) {
  const products = data.modules[slug];
  if (!products || products.length === 0) return null;

  return (
    <section
      className="mt-12 border border-teal-500/25 bg-[#0c1018] p-6 md:p-8 rounded-sm"
      data-module="product-picks"
      data-slug={slug}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-teal-400 mb-2">
        Quick picks
      </p>
      <h2 className="headline text-3xl text-bone-100 mb-6">Compare these picks</h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {products.map((p) => (
          <li
            key={p.id}
            className="rounded-sm border border-slate-700/60 bg-[#0a0d13] p-5 flex flex-col"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-400 mb-1">
              {p.category}
            </p>
            <h3 className="text-xl font-bold text-bone-100 mb-2">{p.name}</h3>
            <p className="text-sm text-slate-400 mb-3 leading-relaxed">{p.best_for}</p>
            <dl className="grid grid-cols-2 gap-2 text-xs text-slate-500 mb-4">
              <dt className="text-slate-600">Price band</dt>
              <dd className="text-slate-300">{p.price_band}</dd>
              <dt className="text-slate-600">Fit</dt>
              <dd className="text-slate-300">{p.fit}</dd>
            </dl>
            <div className="mt-auto flex flex-wrap gap-2">
              {p.merchants.map((m) => (
                <a
                  key={m.name}
                  href={m.go_path}
                  rel="sponsored noopener nofollow"
                  onClick={() => handleAffiliateClick(m.name, p.id, sourcePage)}
                  className="inline-flex items-center gap-1 bg-amber-500 hover:bg-amber-400 text-navy-900 px-3 py-2 rounded text-[11px] font-bold uppercase tracking-wider"
                >
                  Check {m.name}
                </a>
              ))}
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-[11px] text-slate-500 leading-relaxed">
        BowlerProShop earns commissions on qualifying purchases. We recommend based on
        published fit criteria — not on commission rate. Verify size, handedness, return
        policy, and current price with the merchant before buying.
      </p>
    </section>
  );
}
