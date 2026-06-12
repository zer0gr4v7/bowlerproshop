/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Info } from "lucide-react";

export default function AffiliateDisclosure() {
  return (
    <div className="bg-bone-100/5 border border-teal-500/10 p-4 mb-8 rounded-sm">
      <div className="flex items-start gap-3">
        <Info className="text-teal-500 shrink-0 mt-1" size={18} />
        <p className="text-xs md:text-sm text-bone-100/70 leading-relaxed italic">
          <span className="font-semibold text-bone-100 not-italic">Disclosure:</span> BowlerProShop.com may earn a commission when you buy through links on this page. We recommend products based on available specs, retailer data, and clearly stated research criteria.
        </p>
      </div>
    </div>
  );
}
