import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "../lib/analytics";

const GTM_ID = import.meta.env.VITE_GTM_ID || "";
const GA4_ID = import.meta.env.VITE_GA4_ID || "";
const CLARITY_ID = import.meta.env.VITE_CLARITY_ID || "";

export default function AnalyticsTags() {
  const location = useLocation();

  useEffect(() => {
    if (!GTM_ID && !GA4_ID && !CLARITY_ID) return;

    const trackedWindow = window as Window & {
      dataLayer?: Array<Record<string, unknown>>;
      gtag?: (...args: unknown[]) => void;
    };

    trackedWindow.dataLayer = trackedWindow.dataLayer || [];

    if (GTM_ID && !document.querySelector(`script[data-gtm-id="${GTM_ID}"]`)) {
      const script = document.createElement("script");
      script.async = true;
      script.dataset.gtmId = GTM_ID;
      script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GTM_ID)}`;
      document.head.appendChild(script);
      trackedWindow.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    }

    if (GA4_ID && !document.querySelector(`script[data-ga4-id="${GA4_ID}"]`)) {
      const script = document.createElement("script");
      script.async = true;
      script.dataset.ga4Id = GA4_ID;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA4_ID)}`;
      document.head.appendChild(script);

      trackedWindow.gtag = (...args: unknown[]) => {
        trackedWindow.dataLayer?.push(args as unknown as Record<string, unknown>);
      };
      trackedWindow.gtag("js", new Date());
      trackedWindow.gtag("config", GA4_ID, { send_page_view: false });
    }

    if (CLARITY_ID && !document.querySelector(`script[data-clarity-id="${CLARITY_ID}"]`)) {
      const script = document.createElement("script");
      script.async = true;
      script.dataset.clarityId = CLARITY_ID;
      script.innerHTML = `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script","${CLARITY_ID}");`;
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    trackPageView(`${location.pathname}${location.search}`, document.title);
  }, [location.pathname, location.search]);

  return null;
}
