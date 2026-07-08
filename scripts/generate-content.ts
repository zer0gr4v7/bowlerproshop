import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";

type ContentFrontmatter = {
  order: number;
  path: string;
  type: "article" | "website";
  category: string;
  difficulty: string;
  lastUpdated: string;
  monetization: string;
  author?: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaPath: string;
};

type ContentPage = ContentFrontmatter & {
  intro: string;
  sections: Array<{
    heading: string;
    body: string;
  }>;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  sources?: Array<{
    label: string;
    url: string;
  }>;
};

const rootDir = process.cwd();
const contentDir = join(rootDir, "content");
const generatedPath = join(rootDir, "src", "generated", "content.ts");
const sitemapPath = join(rootDir, "public", "sitemap.xml");
const siteOrigin = "https://bowlerproshop.com";

const requiredFrontmatter: Array<keyof ContentFrontmatter> = [
  "order",
  "path",
  "type",
  "category",
  "difficulty",
  "lastUpdated",
  "monetization",
  "title",
  "description",
  "ctaLabel",
  "ctaPath",
];

function listContentFiles() {
  return ["guides", "best"]
    .flatMap((folder) => {
      const dir = join(contentDir, folder);
      if (!existsSync(dir)) return [];
      return readdirSync(dir)
        .filter((file) => file.endsWith(".mdx"))
        .map((file) => join(dir, file));
    })
    .sort();
}

function parseFrontmatter(source: string, filePath: string) {
  if (!source.startsWith("---\n")) {
    throw new Error(`${relative(rootDir, filePath)} is missing frontmatter`);
  }

  const end = source.indexOf("\n---", 4);
  if (end === -1) {
    throw new Error(`${relative(rootDir, filePath)} has unterminated frontmatter`);
  }

  const frontmatterSource = source.slice(4, end).trim();
  const body = source.slice(end + 5).trim();
  const frontmatter: Record<string, string | number> = {};

  for (const line of frontmatterSource.split("\n")) {
    const separator = line.indexOf(":");
    if (separator === -1) continue;
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();
    frontmatter[key] = key === "order" ? Number(value) : value;
  }

  for (const key of requiredFrontmatter) {
    if (!frontmatter[key] && frontmatter[key] !== 0) {
      throw new Error(`${relative(rootDir, filePath)} is missing frontmatter field: ${key}`);
    }
  }

  if (!String(frontmatter.path).startsWith("/")) {
    throw new Error(`${relative(rootDir, filePath)} path must start with /`);
  }

  if (!/^\d{4}-\d{2}$/.test(String(frontmatter.lastUpdated))) {
    throw new Error(`${relative(rootDir, filePath)} lastUpdated must be YYYY-MM`);
  }

  return {
    frontmatter: frontmatter as ContentFrontmatter,
    body,
  };
}

function parseSections(body: string, filePath: string) {
  const headingRegex = /^##\s+(.+)$/gm;
  const matches = [...body.matchAll(headingRegex)];
  if (matches.length === 0) {
    throw new Error(`${relative(rootDir, filePath)} must include at least one ## section`);
  }

  const intro = body.slice(0, matches[0].index).trim();
  if (!intro) {
    throw new Error(`${relative(rootDir, filePath)} must include an intro paragraph before sections`);
  }

  const sections = matches.map((match, index) => {
    const next = matches[index + 1];
    const start = Number(match.index) + match[0].length;
    const end = next ? Number(next.index) : body.length;
    const sectionBody = body.slice(start, end).trim();
    if (!sectionBody) {
      throw new Error(`${relative(rootDir, filePath)} has an empty section: ${match[1]}`);
    }

    return {
      heading: match[1].trim(),
      body: sectionBody,
    };
  });

  const contentSections = sections.filter((section) => !["faq", "sources"].includes(section.heading.toLowerCase()));
  const faqSection = sections.find((section) => section.heading.toLowerCase() === "faq");
  const sourceSection = sections.find((section) => section.heading.toLowerCase() === "sources");

  const faqs = faqSection ? parseFaqs(faqSection.body, filePath) : undefined;
  const sources = sourceSection ? parseSources(sourceSection.body) : undefined;

  return { intro, sections: contentSections, faqs, sources };
}

function parseFaqs(body: string, filePath: string) {
  const headingRegex = /^###\s+(.+)$/gm;
  const matches = [...body.matchAll(headingRegex)];
  if (matches.length === 0) {
    throw new Error(`${relative(rootDir, filePath)} FAQ section must use ### question headings`);
  }

  return matches.map((match, index) => {
    const next = matches[index + 1];
    const start = Number(match.index) + match[0].length;
    const end = next ? Number(next.index) : body.length;
    const answer = body.slice(start, end).trim();
    if (!answer) {
      throw new Error(`${relative(rootDir, filePath)} has an empty FAQ answer: ${match[1]}`);
    }
    return {
      question: match[1].trim(),
      answer,
    };
  });
}

function parseSources(body: string) {
  const sources = body
    .split("\n")
    .map((line) => line.trim())
    .map((line) => line.match(/^-?\s*\[([^\]]+)\]\((https?:\/\/[^)]+)\)/))
    .filter((match): match is RegExpMatchArray => Boolean(match))
    .map((match) => ({
      label: match[1],
      url: match[2],
    }));

  return sources.length ? sources : undefined;
}

function readContentPage(filePath: string): ContentPage {
  const source = readFileSync(filePath, "utf8").replace(/\r\n/g, "\n");
  const { frontmatter, body } = parseFrontmatter(source, filePath);
  const { intro, sections, faqs, sources } = parseSections(body, filePath);

  return {
    ...frontmatter,
    intro,
    sections,
    ...(faqs?.length ? { faqs } : {}),
    ...(sources?.length ? { sources } : {}),
  };
}

function toGeneratedTypeScript(pages: ContentPage[]) {
  const payload = JSON.stringify(
    pages.map(({ order: _order, ...page }) => page),
    null,
    2,
  );

  return `import type { GuidePage } from "../lib/site";

// Generated by scripts/generate-content.ts. Edit content/*.mdx instead.
export const generatedGuidePages: GuidePage[] = ${payload};
`;
}

function dateForSitemap(lastUpdated?: string) {
  return lastUpdated ? `${lastUpdated}-01` : "2026-06-01";
}

function toSitemap(pages: ContentPage[]) {
  const staticUrls = [
    { loc: "/", priority: "1.0" },
    { loc: "/find-my-gear", priority: "0.9" },
    { loc: "/tools/bowling-ball-selector", priority: "0.9" },
    { loc: "/tools/bowling-shoe-selector", priority: "0.8" },
    { loc: "/guides", priority: "0.8" },
    { loc: "/gear/bowling-balls", priority: "0.8" },
    { loc: "/gear/bowling-shoes", priority: "0.8" },
    { loc: "/gear/bowling-bags", priority: "0.7" },
    { loc: "/gear/bowling-accessories", priority: "0.7" },
    { loc: "/partners", priority: "0.5" },
  ];

  // Hub pages are defined in content files and will appear via contentUrls.
  // No need to duplicate them here — they flow through the normal content pipeline.

  const contentUrls = pages.map((page) => ({
    loc: page.path,
    lastmod: dateForSitemap(page.lastUpdated),
    priority: page.path.startsWith("/guides/") ? "0.8" : "0.7",
  }));

  const urls = [...staticUrls.map((url) => ({ ...url, lastmod: "2026-06-01" })), ...contentUrls];
  const body = urls
    .map(
      (url) => `  <url>
    <loc>${siteOrigin}${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${url.priority}</priority>
  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

function assertUniquePaths(pages: ContentPage[]) {
  const seen = new Set<string>();
  for (const page of pages) {
    if (seen.has(page.path)) {
      throw new Error(`Duplicate content path: ${page.path}`);
    }
    seen.add(page.path);
  }
}

const pages = listContentFiles()
  .map(readContentPage)
  .sort((a, b) => a.order - b.order || a.path.localeCompare(b.path));

assertUniquePaths(pages);
mkdirSync(dirname(generatedPath), { recursive: true });
writeFileSync(generatedPath, toGeneratedTypeScript(pages));
writeFileSync(sitemapPath, toSitemap(pages));

console.log(`Generated ${relative(rootDir, generatedPath)} and ${relative(rootDir, sitemapPath)} from ${pages.length} content files.`);
