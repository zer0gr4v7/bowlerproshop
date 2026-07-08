/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { trackRichAffiliateClick, type AffiliateClickContext } from "./analytics";

export type MerchantApprovalStatus = "approved" | "pending" | "documented-placeholder" | "disabled";

export interface MerchantInventoryItem {
  id: string;
  name: string;
  network: string;
  approvalStatus: MerchantApprovalStatus;
  enabled: boolean;
  trackingId?: string;
  baseUrl: string;
  urlPattern: string;
  complianceNotes: string;
  sourcePages: string[];
  getLink: (searchQuery: string) => string;
}

export const MERCHANT_INVENTORY = {
  amazon: {
    id: "amazon",
    name: "Amazon",
    network: "Amazon Associates",
    approvalStatus: "approved",
    enabled: true,
    trackingId: "bowlerproshop-20",
    baseUrl: "https://www.amazon.com/s",
    urlPattern: "https://www.amazon.com/s?k={query}&tag={trackingId}",
    complianceNotes:
      "Use search-based links until PA-API/deep-link handling is approved and tested. Disclosure must remain visible near commercial CTAs.",
    sourcePages: ["/find-my-gear", "/tools/bowling-ball-selector", "/tools/bowling-shoe-selector", "/guides"],
    getLink: (searchQuery: string) =>
      `https://www.amazon.com/s?k=${encodeURIComponent(searchQuery)}&tag=bowlerproshop-20`,
  },
  bowlingball: {
    id: "bowlingball",
    name: "BowlingBall.com",
    network: "Direct / affiliate pending",
    approvalStatus: "documented-placeholder",
    enabled: true,
    baseUrl: "https://www.bowlingball.com/search",
    urlPattern: "https://www.bowlingball.com/search?q={query}",
    complianceNotes:
      "Search destination is enabled as a documented placeholder. Replace with approved deep links and tracking parameters after program approval.",
    sourcePages: ["/tools/bowling-ball-selector", "/gear/bowling-balls", "/guides"],
    getLink: (searchQuery: string) =>
      `https://www.bowlingball.com/search?q=${encodeURIComponent(searchQuery)}`,
  },
  bowlersmart: {
    id: "bowlersmart",
    name: "BowlersMart",
    network: "Direct / affiliate pending",
    approvalStatus: "documented-placeholder",
    enabled: true,
    baseUrl: "https://www.bowlersmart.com/search",
    urlPattern: "https://www.bowlersmart.com/search?type=product&q={query}",
    complianceNotes:
      "Search destination enabled as placeholder. Replace with approved affiliate links after program approval. BowlersMart is a primary target merchant due to bowling-specific inventory depth.",
    sourcePages: ["/tools/bowling-ball-selector", "/gear/bowling-balls", "/gear/bowling-shoes", "/guides", "/best"],
    getLink: (searchQuery: string) =>
      `https://www.bowlersmart.com/search?type=product&q=${encodeURIComponent(searchQuery)}`,
  },
  bowlingcom: {
    id: "bowlingcom",
    name: "Bowling.com",
    network: "Direct / affiliate pending",
    approvalStatus: "documented-placeholder",
    enabled: true,
    baseUrl: "https://www.bowling.com/search",
    urlPattern: "https://www.bowling.com/search?q={query}",
    complianceNotes:
      "Search destination enabled as placeholder. Replace with approved affiliate links after program approval.",
    sourcePages: ["/tools/bowling-ball-selector", "/gear/bowling-balls", "/gear/bowling-shoes", "/guides"],
    getLink: (searchQuery: string) =>
      `https://www.bowling.com/search?q=${encodeURIComponent(searchQuery)}`,
  },
  bowlerx: {
    id: "bowlerx",
    name: "BowlerX",
    network: "Direct / affiliate pending",
    approvalStatus: "documented-placeholder",
    enabled: true,
    baseUrl: "https://www.bowlerx.com",
    urlPattern: "https://www.bowlerx.com/search.php?search_query={query}",
    complianceNotes:
      "Search destination enabled as placeholder. Replace with approved affiliate links after program approval.",
    sourcePages: ["/tools/bowling-ball-selector", "/gear/bowling-balls", "/guides"],
    getLink: (searchQuery: string) =>
      `https://www.bowlerx.com/search.php?search_query=${encodeURIComponent(searchQuery)}`,
  },
} satisfies Record<string, MerchantInventoryItem>;

export const AFFILIATES = Object.fromEntries(
  Object.entries(MERCHANT_INVENTORY).filter(([, merchant]) => merchant.enabled),
) as Record<keyof typeof MERCHANT_INVENTORY, MerchantInventoryItem>;

export type Retailer = keyof typeof MERCHANT_INVENTORY;

export function isEnabledRetailer(retailer: string): retailer is Retailer {
  return retailer in MERCHANT_INVENTORY && MERCHANT_INVENTORY[retailer as Retailer].enabled;
}

export function getEnabledRetailers() {
  return Object.values(MERCHANT_INVENTORY).filter((merchant) => merchant.enabled);
}

export function getAffiliateLink(retailer: Retailer, searchQuery: string) {
  const merchant = MERCHANT_INVENTORY[retailer];
  if (!merchant?.enabled) return "";
  return merchant.getLink(searchQuery);
}

export function getAffiliateRedirectPath(retailer: Retailer, searchQuery: string) {
  const params = new URLSearchParams({
    q: searchQuery,
    source: typeof window === "undefined" ? "server" : window.location.pathname,
  });

  return `/go/${retailer}/search?${params.toString()}`;
}

export function trackAffiliateClick(
  retailer: Retailer,
  searchQuery: string,
  sourcePage: string,
  context?: AffiliateClickContext,
) {
  const merchant = MERCHANT_INVENTORY[retailer];
  trackRichAffiliateClick(
    retailer,
    merchant?.name || retailer,
    searchQuery,
    sourcePage,
    context,
  );
}
