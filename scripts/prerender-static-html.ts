import fs from "node:fs/promises";
import path from "node:path";
import {
  absoluteUrl,
  categoryPages,
  findCategoryPage,
  findGuidePage,
  getSeoForPath,
  guidePages,
  pageSeo,
  SITE,
  SOCIAL_LINKS,
} from "../src/lib/site";

type StaticPage = {
  path: string;
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  paragraphs: string[];
  links: Array<{ href: string; label: string }>;
};

const distDir = path.resolve("dist");
const gscVerification = process.env.VITE_GSC_VERIFICATION || "";

const utilityPages: Record<string, StaticPage> = {
  "/": {
    path: "/",
    title: pageSeo["/"].title,
    description: pageSeo["/"].description,
    eyebrow: "Bowling gear decision engine",
    h1: "Smarter bowling gear decisions",
    paragraphs: [
      "BowlerProShop.com helps league, returning, and casual bowlers find the right gear fast.",
      "Search bowling balls, bags, shoes, grips, tape, towels, and accessories by fit, lane condition, skill level, and budget.",
      "Start with the gear finder, compare practical bowling guides, then move from product hype to a shortlist that fits how you bowl.",
    ],
    links: [
      { href: "/find-my-gear", label: "Find my gear" },
      { href: "/tools/bowling-ball-selector", label: "Bowling ball selector" },
      { href: "/guides/how-to-choose-a-bowling-ball", label: "How to choose a bowling ball" },
      { href: "/best/bowling-shoes-for-beginners", label: "Best bowling shoes for beginners" },
      { href: "/disclosure", label: "Affiliate disclosure" },
    ],
  },
  "/find-my-gear": {
    path: "/find-my-gear",
    title: pageSeo["/find-my-gear"].title,
    description: pageSeo["/find-my-gear"].description,
    eyebrow: "Gear finder",
    h1: "Find bowling gear by fit and lane condition",
    paragraphs: [
      "The BowlerProShop gear finder shortlists bowling balls and shoes by skill level, lane condition, budget, and bowling style.",
      "The interactive selector loads with JavaScript. This crawl-visible page preserves the core topic, internal links, and production metadata for search engines and link preview tools.",
      "For production crawlability, the static HTML also points crawlers toward the ball selector, shoe selector, buying guides, and affiliate disclosure before the interactive app hydrates.",
    ],
    links: [
      { href: "/tools/bowling-ball-selector", label: "Use the bowling ball selector" },
      { href: "/tools/bowling-shoe-selector", label: "Use the bowling shoe selector" },
      { href: "/guides", label: "Read practical bowling gear guides" },
    ],
  },
  "/tools/bowling-ball-selector": {
    path: "/tools/bowling-ball-selector",
    title: pageSeo["/tools/bowling-ball-selector"].title,
    description: pageSeo["/tools/bowling-ball-selector"].description,
    eyebrow: "Bowling ball selector",
    h1: "Match bowling balls by lane condition and skill",
    paragraphs: [
      "Find bowling ball recommendations based on average, rev rate, lane condition, budget, and bowling goals.",
      "Use this route for first reactive ball decisions, league-night upgrades, spare ball planning, and arsenal gaps.",
      "The selector experience runs in the browser, while this static fallback keeps the route understandable for search crawlers, social preview systems, and affiliate-network review tools.",
    ],
    links: [
      { href: "/guides/how-to-choose-a-bowling-ball", label: "How to choose a bowling ball" },
      { href: "/best/bowling-ball-cleaner", label: "Bowling ball cleaner guide" },
      { href: "/find-my-gear", label: "Find my gear" },
    ],
  },
  "/tools/bowling-shoe-selector": {
    path: "/tools/bowling-shoe-selector",
    title: pageSeo["/tools/bowling-shoe-selector"].title,
    description: pageSeo["/tools/bowling-shoe-selector"].description,
    eyebrow: "Bowling shoe selector",
    h1: "Choose bowling shoes by slide, support, and fit",
    paragraphs: [
      "Compare bowling shoe options by bowling frequency, foot width, slide foot, support, and budget.",
      "This route helps bowlers decide when rental shoes are limiting consistency and what upgrade tier makes sense.",
      "The production page supports beginner rental upgrades, athletic-style shoes, performance soles, and handedness-aware decisions after the interactive app loads.",
    ],
    links: [
      { href: "/best/bowling-shoes-for-beginners", label: "Best bowling shoes for beginners" },
      { href: "/find-my-gear", label: "Find my gear" },
      { href: "/guides", label: "Bowling gear guides" },
    ],
  },
  "/guides": {
    path: "/guides",
    title: pageSeo["/guides"].title,
    description: pageSeo["/guides"].description,
    eyebrow: "Bowling gear guides",
    h1: "Practical decisions before checkout",
    paragraphs: [
      "Start with fit, lane condition, and skill level before product names. BowlerProShop guides cover first balls, shoe upgrades, accessories, maintenance, and league-night setup.",
      "These guides are written as crawlable decision support for bowlers and affiliate review teams.",
    ],
    links: guidePages.map((guide) => ({
      href: guide.path,
      label: guide.title.replace(` | ${SITE.name}`, ""),
    })),
  },
  "/partners": {
    path: "/partners",
    title: pageSeo["/partners"].title,
    description: pageSeo["/partners"].description,
    eyebrow: "Partners",
    h1: "Partner with BowlerProShop.com",
    paragraphs: [
      "BowlerProShop.com is preparing affiliate, product data, pro shop, bowling center, and media collaboration lanes.",
      "Contact connect@bowlerproshop.com for partner and business inquiries.",
      "Partner routes are intentionally crawl-visible so bowling centers, local pro shops, manufacturers, retailers, and affiliate managers can understand the site purpose without relying on JavaScript rendering.",
    ],
    links: [
      { href: "/contact", label: "Contact BowlerProShop" },
      { href: "/disclosure", label: "Affiliate disclosure" },
      { href: "/privacy", label: "Privacy policy" },
    ],
  },
  "/contact": {
    path: "/contact",
    title: pageSeo["/contact"].title,
    description: pageSeo["/contact"].description,
    eyebrow: "Contact",
    h1: "Contact BowlerProShop.com",
    paragraphs: [
      "Reach BowlerProShop.com for affiliate, partner, media, and bowling industry collaboration inquiries.",
      "Primary contact: connect@bowlerproshop.com.",
    ],
    links: [
      { href: "/partners", label: "Partner with BowlerProShop" },
      { href: "/disclosure", label: "Affiliate disclosure" },
    ],
  },
  "/disclosure": {
    path: "/disclosure",
    title: pageSeo["/disclosure"].title,
    description: pageSeo["/disclosure"].description,
    eyebrow: "Affiliate disclosure",
    h1: "How BowlerProShop.com earns commissions",
    paragraphs: [
      "BowlerProShop.com may earn commissions when visitors buy through merchant links, including Amazon Associate links and future affiliate networks.",
      "Affiliate relationships do not change the price paid by the visitor. Recommendations are based on practical fit criteria, product data, and clearly stated research criteria.",
      "The site may link to retailers, marketplaces, manufacturers, and product search pages. Commission status, availability, prices, and product claims should be verified with the merchant before purchase.",
    ],
    links: [
      { href: "/guides", label: "Bowling gear guides" },
      { href: "/privacy", label: "Privacy policy" },
    ],
  },
  "/privacy": {
    path: "/privacy",
    title: pageSeo["/privacy"].title,
    description: pageSeo["/privacy"].description,
    eyebrow: "Privacy",
    h1: "Privacy basics for BowlerProShop.com",
    paragraphs: [
      "BowlerProShop.com may use selector inputs, email signup details, analytics, and affiliate tracking to improve recommendations and site operations.",
      "Visitors can request data updates or deletion after production launch by contacting the site operator.",
      "Selector inputs are intended to produce practical gear recommendations and are not a substitute for professional fitting, drilling, coaching, or pro shop advice. Analytics and affiliate tools should be configured with production privacy settings before paid traffic.",
    ],
    links: [
      { href: "/disclosure", label: "Affiliate disclosure" },
      { href: "/find-my-gear", label: "Find my gear" },
    ],
  },
};

const aliases: Record<string, string> = {
  "/tools": "/tools/bowling-ball-selector",
  "/start-here": "/guides",
  "/bowling-alleys": "/partners",
  "/pro-shops": "/partners",
  "/affiliate-disclosure": "/disclosure",
  "/privacy-policy": "/privacy",
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function stripManagedHead(html: string) {
  return html
    .replace(/<title>[\s\S]*?<\/title>/i, "")
    .replace(/<meta\s+name=["']description["'][^>]*>\s*/gi, "")
    .replace(/<meta\s+property=["']og:[^"']+["'][^>]*>\s*/gi, "")
    .replace(/<meta\s+name=["']twitter:[^"']+["'][^>]*>\s*/gi, "")
    .replace(/<link\s+rel=["']canonical["'][^>]*>\s*/gi, "")
    .replace(/<script\s+type=["']application\/ld\+json["'][\s\S]*?<\/script>\s*/gi, "");
}

function graphForPage(page: StaticPage) {
  const guide = findGuidePage(page.path);
  const category = findCategoryPage(page.path);
  const canonical = absoluteUrl(page.path);
  const graph: Array<Record<string, unknown>> = [
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
        ...(page.path === "/"
          ? []
          : [
              {
                "@type": "ListItem",
                position: 2,
                name: guide ? "Guides" : category ? "Gear" : page.h1,
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
    graph.push({
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
      graph.push({
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
      graph.push({
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

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

function headForPage(page: StaticPage) {
  const title = escapeHtml(page.title);
  const description = escapeHtml(page.description);
  const canonical = absoluteUrl(page.path);
  const seo = getSeoForPath(page.path);

  return [
    `    <title>${title}</title>`,
    `    <meta name="description" content="${description}" />`,
    `    <meta name="robots" content="${seo.noindex ? "noindex, follow" : "index, follow"}" />`,
    `    <link rel="canonical" href="${canonical}" />`,
    `    <meta property="og:type" content="${findGuidePage(page.path) ? "article" : "website"}" />`,
    `    <meta property="og:title" content="${title}" />`,
    `    <meta property="og:description" content="${description}" />`,
    `    <meta property="og:url" content="${canonical}" />`,
    `    <meta property="og:image" content="${SITE.defaultImage}" />`,
    `    <meta property="og:site_name" content="${SITE.name}" />`,
    `    <meta name="twitter:card" content="summary_large_image" />`,
    `    <meta name="twitter:title" content="${title}" />`,
    `    <meta name="twitter:description" content="${description}" />`,
    `    <meta name="twitter:image" content="${SITE.defaultImage}" />`,
    `    <meta name="twitter:site" content="${SOCIAL_LINKS.find((link) => link.id === "x")?.handle || SITE.shortName}" />`,
    ...(gscVerification
      ? [`    <meta name="google-site-verification" content="${escapeHtml(gscVerification)}" />`]
      : []),
    `    <script type="application/ld+json">${JSON.stringify(graphForPage(page))}</script>`,
  ].join("\n");
}

function renderRichText(body: string) {
  return body
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const lines = block
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      if (lines.every((line) => line.startsWith("- "))) {
        const items = lines.map((line) => `<li>${escapeHtml(line.replace(/^- /, ""))}</li>`).join("");
        return `<ul>${items}</ul>`;
      }

      return `<p>${escapeHtml(block)}</p>`;
    })
    .join("");
}

function bodyForPage(page: StaticPage) {
  const links = page.links
    .map((link) => `<li><a href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a></li>`)
    .join("");
  const guide = findGuidePage(page.path);

  if (guide) {
    const sections = guide.sections
      .map(
        (section) =>
          `<section><h2>${escapeHtml(section.heading)}</h2>${renderRichText(section.body)}</section>`,
      )
      .join("");
    const faqs = guide.faqs?.length
      ? `<section><h2>FAQ</h2>${guide.faqs
          .map(
            (faq) =>
              `<article><h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p></article>`,
          )
          .join("")}</section>`
      : "";
    const sources = guide.sources?.length
      ? `<section><h2>Sources and further reading</h2><ul>${guide.sources
          .map(
            (source) =>
              `<li><a href="${escapeHtml(source.url)}">${escapeHtml(source.label)}</a></li>`,
          )
          .join("")}</ul></section>`
      : "";

    return [
      `<main data-static-crawl-fallback="true">`,
      `<p>${escapeHtml(page.eyebrow)}</p>`,
      `<h1>${escapeHtml(page.h1)}</h1>`,
      `<p>${escapeHtml(guide.intro)}</p>`,
      sections,
      faqs,
      sources,
      `<nav aria-label="Related BowlerProShop pages"><ul>${links}</ul></nav>`,
      `</main>`,
    ].join("");
  }

  return [
    `<main data-static-crawl-fallback="true">`,
    `<p>${escapeHtml(page.eyebrow)}</p>`,
    `<h1>${escapeHtml(page.h1)}</h1>`,
    ...page.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`),
    `<nav aria-label="Related BowlerProShop pages"><ul>${links}</ul></nav>`,
    `</main>`,
  ].join("");
}

function pageFromGuide(pathname: string): StaticPage | null {
  const guide = findGuidePage(pathname);
  if (!guide) return null;
  const relatedGuide =
    guidePages.find((candidate) => candidate.path !== guide.path && candidate.category === guide.category) ||
    guidePages.find((candidate) => candidate.path !== guide.path);

  return {
    path: guide.path,
    title: guide.title,
    description: guide.description,
    eyebrow: guide.category,
    h1: guide.title.replace(` | ${SITE.name}`, ""),
    paragraphs: [
      guide.intro,
      ...guide.sections.map((section) => `${section.heading}: ${section.body}`),
      ...(guide.faqs?.length
        ? guide.faqs.map((faq) => `${faq.question}: ${faq.answer}`)
        : []),
      ...(guide.sources?.length
        ? [`Sources: ${guide.sources.map((source) => source.label).join(", ")}.`]
        : []),
    ],
    links: [
      { href: "/guides", label: "All bowling gear guides" },
      { href: guide.ctaPath, label: guide.ctaLabel },
      ...(relatedGuide
        ? [{ href: relatedGuide.path, label: relatedGuide.title.replace(` | ${SITE.name}`, "") }]
        : []),
      { href: "/disclosure", label: "Affiliate disclosure" },
    ],
  };
}

function pageFromCategory(pathname: string): StaticPage | null {
  const category = findCategoryPage(pathname);
  if (!category) return null;

  const relatedLinks = category.relatedGuidePaths
    .map((guidePath) => guidePages.find((guide) => guide.path === guidePath))
    .filter((guide): guide is (typeof guidePages)[number] => Boolean(guide))
    .map((guide) => ({
      href: guide.path,
      label: guide.title.replace(` | ${SITE.name}`, ""),
    }));

  return {
    path: category.path,
    title: category.title,
    description: category.description,
    eyebrow: category.eyebrow,
    h1: category.title.split(" | ")[0],
    paragraphs: [
      category.intro,
      `Best for: ${category.bestFor.join(", ")}.`,
      `Starter kit: ${category.starterKit.map((item) => `${item.item} for ${item.reason}`).join(" ")}`,
      "BowlerProShop may earn from merchant links. Use this category page to narrow the decision, then confirm fit, drilling, and surface choices with a local pro shop before final purchase.",
    ],
    links: [
      { href: category.primaryCta.path, label: category.primaryCta.label },
      ...relatedLinks,
      { href: "/disclosure", label: "Affiliate disclosure" },
    ],
  };
}

function pageForPath(pathname: string): StaticPage {
  if (utilityPages[pathname]) return utilityPages[pathname];

  const guide = pageFromGuide(pathname);
  if (guide) return guide;

  const category = pageFromCategory(pathname);
  if (category) return category;

  const target = aliases[pathname];
  if (target) {
    const base = pageForPath(target);
    const seo = pageSeo[pathname] || getSeoForPath(target);
    return {
      ...base,
      path: seo.path,
      title: seo.title,
      description: seo.description,
    };
  }

  const seo = getSeoForPath(pathname);
  return {
    path: pathname,
    title: seo.title,
    description: seo.description,
    eyebrow: "BowlerProShop.com",
    h1: seo.title.replace(` | ${SITE.name}`, ""),
    paragraphs: [seo.description],
    links: [
      { href: "/", label: "BowlerProShop.com home" },
      { href: "/find-my-gear", label: "Find my gear" },
      { href: "/guides", label: "Bowling gear guides" },
    ],
  };
}

function renderPage(template: string, page: StaticPage) {
  const cleaned = stripManagedHead(template);
  return cleaned
    .replace("</head>", `${headForPage(page)}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${bodyForPage(page)}</div>`);
}

async function writeRoute(template: string, pathname: string) {
  const page = pageForPath(pathname);
  const html = renderPage(template, page);
  const target =
    pathname === "/"
      ? path.join(distDir, "index.html")
      : path.join(distDir, `${pathname.replace(/^\//, "")}.html`);

  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, html, "utf8");
  console.log(`prerendered ${pathname}`);
}

async function main() {
  const template = await fs.readFile(path.join(distDir, "index.html"), "utf8");
  const paths = new Set<string>([
    ...Object.keys(pageSeo),
    ...guidePages.map((guide) => guide.path),
    ...categoryPages.map((category) => category.path),
    ...Object.keys(aliases),
  ]);

  for (const pathname of paths) {
    await writeRoute(template, pathname);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
