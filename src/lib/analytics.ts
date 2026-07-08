type DataLayerEvent = Record<string, unknown> & {
  event: string;
};

function getDataLayer() {
  if (typeof window === "undefined") {
    return undefined;
  }

  const trackedWindow = window as Window & {
    dataLayer?: DataLayerEvent[];
  };

  trackedWindow.dataLayer = trackedWindow.dataLayer || [];
  return trackedWindow.dataLayer;
}

export function trackEvent(event: DataLayerEvent) {
  getDataLayer()?.push(event);
}

export function trackPageView(path: string, title: string) {
  trackEvent({
    event: "page_view",
    page_path: path,
    page_title: title,
  });
}

export function trackRecommendationResultView(payload: {
  selectorType: string;
  resultCount: number;
  source?: string;
}) {
  trackEvent({
    event: "recommendation_result_view",
    selector_type: payload.selectorType,
    result_count: payload.resultCount,
    recommendation_source: payload.source || "unknown",
  });
}

export function trackEmailSignup(payload: {
  sourcePage: string;
  bowlerType?: string;
  gearNeed?: string;
}) {
  trackEvent({
    event: "email_signup",
    source_page: payload.sourcePage,
    bowler_type: payload.bowlerType || "unknown",
    gear_need: payload.gearNeed || "checklist",
  });
}

export function trackGuideCta(payload: {
  sourcePage: string;
  ctaText: string;
  targetPath: string;
  guideSlug?: string;
}) {
  trackEvent({
    event: "guide_cta_click",
    source_page: payload.sourcePage,
    cta_text: payload.ctaText,
    target_path: payload.targetPath,
    guide_slug: payload.guideSlug || "unknown",
  });
}

export function trackProductCardClick(payload: {
  merchant: string;
  productSlug: string;
  sourcePage: string;
  placement: string;
  category?: string;
}) {
  trackEvent({
    event: "product_card_click",
    merchant: payload.merchant,
    product_slug: payload.productSlug,
    source_page: payload.sourcePage,
    placement: payload.placement,
    product_category: payload.category || "unknown",
  });
}

export function trackSelectorRecommendation(payload: {
  selectorType: string;
  productSlug: string;
  merchant: string;
  skillLevel?: string;
  budgetBucket?: string;
}) {
  trackEvent({
    event: "selector_recommendation_click",
    selector_type: payload.selectorType,
    product_slug: payload.productSlug,
    merchant: payload.merchant,
    skill_level: payload.skillLevel || "unknown",
    budget_bucket: payload.budgetBucket || "unknown",
  });
}

// --- Device + context helpers for rich conversion tracking ---

function getDeviceCategory(): string {
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

function getPageType(path: string): string {
  if (path.startsWith("/tools/") || path === "/find-my-gear") return "selector";
  if (path.startsWith("/best/")) return "buying_guide";
  if (path.startsWith("/guides/")) return "guide";
  if (path.startsWith("/gear/")) return "category";
  if (["/bowling-equipment", "/bowling-supplies", "/online-bowling-pro-shop"].includes(path)) return "hub";
  if (path === "/") return "homepage";
  return "other";
}

const ITEM_TYPE_WEIGHTS: Record<string, number> = {
  ball: 10,
  shoe: 8,
  bag: 6,
  accessory: 4,
  cleaner: 3,
  cover: 3,
  tape: 2,
  towel: 2,
};

function inferItemCategory(searchQuery: string): string {
  const q = searchQuery.toLowerCase();
  if (/ball|phaze|hustle|widow|storm|hammer|motiv|roto|brunswick.*ball/i.test(q)) return "ball";
  if (/shoe|ricky|aviator|kicks|dexter|kr.*strike/i.test(q)) return "shoe";
  if (/bag|roller|cruiser/i.test(q)) return "bag";
  if (/clean|reacta|foam|gel/i.test(q)) return "cleaner";
  if (/cover|shield/i.test(q)) return "cover";
  if (/tape|insert/i.test(q)) return "tape";
  if (/towel|microfiber/i.test(q)) return "towel";
  return "accessory";
}

const SESSION_CLICK_KEY = "bps_session_clicks";

function getSessionClickCount(): number {
  try {
    return parseInt(sessionStorage.getItem(SESSION_CLICK_KEY) || "0", 10);
  } catch { return 0; }
}

function incrementSessionClicks(): number {
  const count = getSessionClickCount() + 1;
  try { sessionStorage.setItem(SESSION_CLICK_KEY, String(count)); } catch {}
  return count;
}

/**
 * Quality score: item_weight * engagement_multiplier
 * Range: 1-20 (higher = more valuable click)
 * item_weight: ball=10, shoe=8, bag=6, accessory=4, cleaner/cover=3, tape/towel=2
 * engagement_multiplier: 1.0 + (session_clicks * 0.1), capped at 2.0
 */
function calculateQualityScore(itemCategory: string, sessionClicks: number): number {
  const baseWeight = ITEM_TYPE_WEIGHTS[itemCategory] || 3;
  const engagementMultiplier = Math.min(2.0, 1.0 + sessionClicks * 0.1);
  return Math.round(baseWeight * engagementMultiplier * 10) / 10;
}

export interface AffiliateClickContext {
  quickFilter?: string;
  selectorSettings?: Record<string, unknown>;
  productCategory?: string;
  productSlug?: string;
  placement?: string;
}

/**
 * Rich affiliate click event with device, search context, and quality score.
 * Designed for GA4 custom dimensions + conversion tracking via GTM.
 */
export function trackRichAffiliateClick(
  retailer: string,
  merchantName: string,
  searchQuery: string,
  sourcePage: string,
  context?: AffiliateClickContext,
) {
  const sessionClicks = incrementSessionClicks();
  const itemCategory = context?.productCategory || inferItemCategory(searchQuery);
  const qualityScore = calculateQualityScore(itemCategory, sessionClicks);

  trackEvent({
    event: "affiliate_click",
    // Core
    retailer,
    merchant_name: merchantName,
    search_query: searchQuery,
    source_page: sourcePage,
    // Device
    device_category: getDeviceCategory(),
    screen_resolution: `${window.screen.width}x${window.screen.height}`,
    viewport_size: `${window.innerWidth}x${window.innerHeight}`,
    // Page context
    page_type: getPageType(sourcePage),
    // Product context
    item_category: itemCategory,
    product_slug: context?.productSlug || searchQuery.toLowerCase().replace(/\s+/g, "-").slice(0, 60),
    placement: context?.placement || "unknown",
    // Search context (custom dimensions)
    quick_filter: context?.quickFilter || "none",
    selector_settings: context?.selectorSettings ? JSON.stringify(context.selectorSettings) : "none",
    // Quality score (custom metric)
    click_quality_score: qualityScore,
    session_click_number: sessionClicks,
  });
}
