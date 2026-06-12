import { GuidePage, SITE, absoluteUrl } from "./site";

export interface WordPressPostTemplate {
  templateId: string;
  postType: "post";
  status: "draft" | "publish";
  defaultAuthorSlug: string;
  defaultCategory: string;
  defaultTags: string[];
  requiredBlocks: string[];
}

export interface WordPressPostExport {
  postType: "post";
  status: "draft" | "publish";
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  canonicalUrl: string;
  categories: string[];
  tags: string[];
  authorSlug: string;
  meta: {
    description: string;
    templateId: string;
    ctaLabel: string;
    ctaPath: string;
    monetization: string;
    difficulty: string;
    lastUpdated: string;
  };
}

export const wordpressPostTemplates: Record<string, WordPressPostTemplate> = {
  affiliateGuide: {
    templateId: "affiliate-guide-v1",
    postType: "post",
    status: "draft",
    defaultAuthorSlug: "bowlerproshop",
    defaultCategory: "Bowling Gear Guides",
    defaultTags: ["bowling gear", "buying guide", "affiliate-ready"],
    requiredBlocks: [
      "intro",
      "buying-context",
      "decision-criteria",
      "pro-shop-note",
      "affiliate-disclosure",
      "selector-cta",
    ],
  },
};

export function slugFromPath(path: string) {
  return path.replace(/^\/+/, "").split("/").pop() || "post";
}

export function toWordPressPost(guide: GuidePage): WordPressPostExport {
  const template = wordpressPostTemplates.affiliateGuide;
  const slug = slugFromPath(guide.path);

  return {
    postType: template.postType,
    status: template.status,
    slug,
    title: guide.title.replace(" | BowlerProShop.com", ""),
    excerpt: guide.description,
    content: renderWordPressBlocks(guide),
    canonicalUrl: absoluteUrl(guide.path),
    categories: [template.defaultCategory, guide.category],
    tags: Array.from(
      new Set([
        ...template.defaultTags,
        guide.category.toLowerCase(),
        guide.difficulty.toLowerCase(),
      ]),
    ),
    authorSlug: template.defaultAuthorSlug,
    meta: {
      description: guide.description,
      templateId: template.templateId,
      ctaLabel: guide.ctaLabel,
      ctaPath: guide.ctaPath,
      monetization: guide.monetization,
      difficulty: guide.difficulty,
      lastUpdated: guide.lastUpdated,
    },
  };
}

export function renderWordPressBlocks(guide: GuidePage) {
  const disclosure =
    "As an Amazon Associate I earn from qualifying purchases. Merchant links may earn commissions, but recommendations are based on practical fit criteria.";

  const blocks = [
    wpParagraph(guide.intro),
    wpSeparator(),
    ...guide.sections.flatMap((section) => [
      wpHeading(section.heading, 2),
      wpParagraph(section.body),
    ]),
    wpSeparator(),
    wpHeading("Before you buy", 2),
    wpParagraph(disclosure),
    wpButton(guide.ctaLabel, `${SITE.origin}${guide.ctaPath}`),
  ];

  return blocks.join("\n\n");
}

function wpHeading(text: string, level: 2 | 3) {
  return `<!-- wp:heading {\"level\":${level}} -->\n<h${level}>${escapeHtml(text)}</h${level}>\n<!-- /wp:heading -->`;
}

function wpParagraph(text: string) {
  return `<!-- wp:paragraph -->\n<p>${escapeHtml(text)}</p>\n<!-- /wp:paragraph -->`;
}

function wpSeparator() {
  return `<!-- wp:separator -->\n<hr class=\"wp-block-separator has-alpha-channel-opacity\"/>\n<!-- /wp:separator -->`;
}

function wpButton(label: string, href: string) {
  return `<!-- wp:buttons -->\n<div class=\"wp-block-buttons\"><!-- wp:button -->\n<div class=\"wp-block-button\"><a class=\"wp-block-button__link wp-element-button\" href=\"${escapeHtml(href)}\">${escapeHtml(label)}</a></div>\n<!-- /wp:button --></div>\n<!-- /wp:buttons -->`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
