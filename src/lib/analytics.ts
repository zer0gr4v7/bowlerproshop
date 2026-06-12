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
