import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { absoluteUrl, findGuidePage, getSeoForPath, SITE, SOCIAL_LINKS } from "../lib/site";

const GSC_VERIFICATION = import.meta.env.VITE_GSC_VERIFICATION || "";

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => element?.setAttribute(key, value));
}

function upsertLink(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLLinkElement>(selector);

  if (!element) {
    element = document.createElement("link");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => element?.setAttribute(key, value));
}

function upsertJsonLd(id: string, data: Record<string, unknown>) {
  let element = document.head.querySelector<HTMLScriptElement>(`#${id}`);

  if (!element) {
    element = document.createElement("script");
    element.id = id;
    element.type = "application/ld+json";
    document.head.appendChild(element);
  }

  element.textContent = JSON.stringify(data);
}

export default function Seo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const seo = getSeoForPath(pathname);
    const guide = findGuidePage(pathname);
    const canonical = absoluteUrl(seo.path);
    const title = seo.title;

    document.title = title;

    upsertMeta('meta[name="description"]', {
      name: "description",
      content: seo.description,
    });
    upsertMeta('meta[name="robots"]', {
      name: "robots",
      content: seo.noindex ? "noindex, follow" : "index, follow",
    });
    upsertMeta('meta[property="og:type"]', {
      property: "og:type",
      content: seo.type === "article" ? "article" : "website",
    });
    upsertMeta('meta[property="og:title"]', {
      property: "og:title",
      content: title,
    });
    upsertMeta('meta[property="og:description"]', {
      property: "og:description",
      content: seo.description,
    });
    upsertMeta('meta[property="og:url"]', {
      property: "og:url",
      content: canonical,
    });
    upsertMeta('meta[property="og:image"]', {
      property: "og:image",
      content: SITE.defaultImage,
    });
    upsertMeta('meta[property="og:site_name"]', {
      property: "og:site_name",
      content: SITE.name,
    });
    upsertMeta('meta[name="twitter:card"]', {
      name: "twitter:card",
      content: "summary_large_image",
    });
    upsertMeta('meta[name="twitter:image"]', {
      name: "twitter:image",
      content: SITE.defaultImage,
    });
    upsertMeta('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: title,
    });
    upsertMeta('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: seo.description,
    });
    upsertMeta('meta[name="twitter:site"]', {
      name: "twitter:site",
      content: SOCIAL_LINKS.find((link) => link.id === "x")?.handle || SITE.shortName,
    });
    if (GSC_VERIFICATION) {
      upsertMeta('meta[name="google-site-verification"]', {
        name: "google-site-verification",
        content: GSC_VERIFICATION,
      });
    }
    upsertLink('link[rel="canonical"]', {
      rel: "canonical",
      href: canonical,
    });

    const structuredData: Record<string, unknown>[] = [
      {
        "@type": "Organization",
        name: SITE.name,
        url: SITE.origin,
        description: SITE.description,
        sameAs: SOCIAL_LINKS.map((link) => link.url),
      },
      {
        "@type": "WebSite",
        name: SITE.name,
        alternateName: SITE.shortName,
        url: SITE.origin,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: absoluteUrl("/"),
          },
          ...(seo.path === "/"
            ? []
            : [
                {
                  "@type": "ListItem",
                  position: 2,
                  name: guide ? "Guides" : title.replace(` | ${SITE.name}`, ""),
                  item: guide ? absoluteUrl("/guides") : canonical,
                },
              ]),
          ...(guide
            ? [
                {
                  "@type": "ListItem",
                  position: 3,
                  name: guide.title,
                  item: canonical,
                },
              ]
            : []),
        ],
      },
    ];

    if (guide) {
      structuredData.push({
        "@type": "Article",
        headline: guide.title,
        description: guide.description,
        dateModified: `${guide.lastUpdated}-01`,
        author: {
          "@type": "Organization",
          name: guide.author || SITE.name,
        },
        publisher: {
          "@type": "Organization",
          name: SITE.name,
        },
        mainEntityOfPage: canonical,
      });

      if (guide.faqs?.length) {
        structuredData.push({
          "@type": "FAQPage",
          mainEntity: guide.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        });
      }

      if (guide.path.startsWith("/best/")) {
        structuredData.push({
          "@type": "ItemList",
          name: guide.title,
          itemListElement: guide.sections.map((section, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: section.heading,
          })),
        });
      }
    }

    upsertJsonLd("bowlerproshop-jsonld", {
      "@context": "https://schema.org",
      "@graph": structuredData,
    });
  }, [pathname]);

  return null;
}
