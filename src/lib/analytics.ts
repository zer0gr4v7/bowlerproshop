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
