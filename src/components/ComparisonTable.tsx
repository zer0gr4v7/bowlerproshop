import { trackEvent } from "../lib/analytics";

export interface ComparisonRow {
  item: string;
  bestFor: string;
  priceTier: string;
  beginnerFriendly: boolean;
  fitRisk: "Low" | "Medium" | "High";
  maintenanceNeed: "Low" | "Medium" | "High";
  merchants: Array<{ name: string; goPath: string }>;
}

function handleMerchantClick(merchant: string, item: string, sourcePage: string) {
  trackEvent({
    event: "merchant_compare_click",
    merchant,
    product_slug: item.toLowerCase().replace(/\s+/g, "-"),
    source_page: sourcePage,
    placement: "comparison_table",
  });
}

export default function ComparisonTable({
  rows,
  sourcePage,
  caption,
}: {
  rows: ComparisonRow[];
  sourcePage: string;
  caption?: string;
}) {
  if (!rows.length) return null;

  return (
    <section className="mt-10 mb-8 overflow-x-auto" data-module="comparison-table">
      {caption && (
        <h2 className="text-2xl font-bold text-bone-100 mb-4">{caption}</h2>
      )}
      <table className="w-full text-sm text-left border border-slate-700/50 rounded-sm overflow-hidden">
        <thead className="bg-[#0c1018] text-teal-400 text-[10px] uppercase tracking-wider">
          <tr>
            <th className="px-4 py-3">Item</th>
            <th className="px-4 py-3">Best for</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3 text-center">Beginner</th>
            <th className="px-4 py-3 text-center">Fit risk</th>
            <th className="px-4 py-3 text-center">Maintenance</th>
            <th className="px-4 py-3">Compare</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/30">
          {rows.map((row) => (
            <tr key={row.item} className="bg-[#0a0d13] hover:bg-slate-800/30">
              <td className="px-4 py-3 font-medium text-bone-100">{row.item}</td>
              <td className="px-4 py-3 text-slate-300">{row.bestFor}</td>
              <td className="px-4 py-3 text-slate-400">{row.priceTier}</td>
              <td className="px-4 py-3 text-center">
                {row.beginnerFriendly ? (
                  <span className="text-green-400">Yes</span>
                ) : (
                  <span className="text-slate-500">No</span>
                )}
              </td>
              <td className="px-4 py-3 text-center">
                <span
                  className={
                    row.fitRisk === "Low"
                      ? "text-green-400"
                      : row.fitRisk === "Medium"
                        ? "text-amber-400"
                        : "text-red-400"
                  }
                >
                  {row.fitRisk}
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                <span
                  className={
                    row.maintenanceNeed === "Low"
                      ? "text-green-400"
                      : row.maintenanceNeed === "Medium"
                        ? "text-amber-400"
                        : "text-red-400"
                  }
                >
                  {row.maintenanceNeed}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className="flex flex-wrap gap-1">
                  {row.merchants.map((m) => (
                    <a
                      key={m.name}
                      href={m.goPath}
                      rel="sponsored noopener nofollow"
                      onClick={() => handleMerchantClick(m.name, row.item, sourcePage)}
                      className="inline-block bg-amber-500 hover:bg-amber-400 text-navy-900 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider"
                    >
                      {m.name}
                    </a>
                  ))}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-[11px] text-slate-500">
        Verify size, handedness, return policy, and current price with the merchant before buying.
      </p>
    </section>
  );
}
