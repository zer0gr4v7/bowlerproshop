import { spawn } from "node:child_process";
import { chromium } from "playwright";
import http from "node:http";

const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}`;

const PAGES = [
  "/guides",
  "/guides/how-to-choose-a-bowling-ball",
  "/best/bowling-shoes-for-beginners",
  "/best/bowling-accessories-for-beginners",
  "/best/bowling-ball-cleaner",
  "/best/2-ball-bowling-bag",
  "/guides/first-reactive-bowling-ball",
  "/guides/bowling-ball-weight-and-fit",
  "/guides/beginner-bowling-shoe-comparison",
  "/guides/league-night-gear-checklist",
  "/guides/bowling-ball-cleaner-towel-maintenance",
  "/guides/used-bowling-ball-buying-checklist",
];

// Helper to check if server is up
function waitServerReady(url: string, retries = 20): Promise<void> {
  return new Promise((resolve, reject) => {
    const check = (remaining: number) => {
      http
        .get(url, (res) => {
          if (res.statusCode === 200) {
            resolve();
          } else {
            if (remaining <= 0) reject(new Error("Server returned non-200 status."));
            else setTimeout(() => check(remaining - 1), 200);
          }
        })
        .on("error", () => {
          if (remaining <= 0) reject(new Error("Server timeout."));
          else setTimeout(() => check(remaining - 1), 200);
        });
    };
    check(retries);
  });
}

interface AuditLink {
  pageUrl: string;
  anchorText: string;
  href: string;
  rel: string;
  retailer: string;
  isValid: boolean;
  violationType?: string;
}

interface PageAuditResult {
  url: string;
  links: AuditLink[];
  hasDisclosure: boolean;
  hasRawRetailerUrls: boolean;
  rawUrlMatches: string[];
}

async function runAudit() {
  console.log("Starting production build server in background...");
  const serverProc = spawn("node", ["dist/server.cjs"], {
    env: { ...process.env, PORT: String(PORT), NODE_ENV: "production" },
    stdio: "inherit",
  });

  try {
    await waitServerReady(BASE_URL);
    console.log("Server is ready on port " + PORT + ". Launching browser...");

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    const results: PageAuditResult[] = [];

    for (const pathname of PAGES) {
      const pageUrl = `${BASE_URL}${pathname}`;
      console.log(`Auditing page: ${pathname}...`);

      await page.goto(pageUrl, { waitUntil: "networkidle" });

      // 1. Audit /go/ links
      const linksData = await page.evaluate(() => {
        const anchors = Array.from(document.querySelectorAll("a"));
        return anchors
          .map((a) => {
            const href = a.getAttribute("href") || "";
            const text = a.innerText.trim();
            const rel = a.getAttribute("rel") || "";
            return { href, text, rel };
          })
          .filter((a) => a.href.includes("/go/"));
      });

      // 2. Audit FTC disclosure presence
      const textContent = await page.innerText("body");
      const hasDisclosure =
        textContent.includes("Amazon Associate") ||
        textContent.includes("earns commissions") ||
        textContent.includes("qualifying purchases");

      // 3. Check for raw retailer URLs in rendered HTML
      const htmlContent = await page.content();
      const rawRetailerRegex = /(amazon\.com|amzn\.to|bowlersmart\.com)/gi;
      const rawUrlMatches: string[] = [];
      let match;
      while ((match = rawRetailerRegex.exec(htmlContent)) !== null) {
        // Exclude schema.org references or other safe mentions if any, but capture everything for audit
        // Wait, standard hrefs or links might have them
        rawUrlMatches.push(match[0]);
      }

      // Filter matches to remove any organization social links or legitimate domain links that are not raw affiliate anchors
      // (e.g. if the footer has "instagram.com/bowlerproshop", that is fine, but we are looking for retailer domains)
      const uniqueRawMatches = Array.from(new Set(rawUrlMatches));

      const auditedLinks: AuditLink[] = linksData.map((link) => {
        const urlParts = link.href.split("/");
        // Format of /go/ links: /go/retailer/slug
        const goIndex = urlParts.indexOf("go");
        const retailer = goIndex !== -1 && urlParts[goIndex + 1] ? urlParts[goIndex + 1] : "unknown";

        const hasSponsored = link.rel.includes("sponsored");
        const hasNofollow = link.rel.includes("nofollow");
        const isValid = hasSponsored && hasNofollow;

        let violationType: string | undefined;
        if (!isValid) {
          if (!hasSponsored && !hasNofollow) violationType = "Missing both sponsored and nofollow";
          else if (!hasSponsored) violationType = "Missing sponsored";
          else violationType = "Missing nofollow";
        }

        return {
          pageUrl: pathname,
          anchorText: link.text,
          href: link.href,
          rel: link.rel,
          retailer,
          isValid,
          violationType,
        };
      });

      results.push({
        url: pathname,
        links: auditedLinks,
        hasDisclosure,
        hasRawRetailerUrls: uniqueRawMatches.length > 0,
        rawUrlMatches: uniqueRawMatches,
      });
    }

    await browser.close();

    console.log("Audit complete. Writing markdown report...");
    generateReport(results);

  } catch (error) {
    console.error("Audit error:", error);
  } finally {
    console.log("Shutting down background server...");
    serverProc.kill("SIGTERM");
  }
}

function generateReport(results: PageAuditResult[]) {
  const allLinks = results.flatMap((r) => r.links);
  const violations = allLinks.filter((l) => !l.isValid);
  const rawRetailerPages = results.filter((r) => r.hasRawRetailerUrls);
  const pagesWithLinks = results.filter((r) => r.links.length > 0);
  const missingDisclosurePages = pagesWithLinks.filter((r) => !r.hasDisclosure);

  const lines: string[] = [];
  lines.push("# BowlerProShop Affiliate Link Audit (FLO-680)");
  lines.push("");
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push("");
  lines.push("## Audit Summary");
  lines.push("");
  lines.push(`- **Total content pages audited**: ${results.length}`);
  lines.push(`- **Total /go/ links found**: ${allLinks.length}`);
  lines.push(`- **Total /go/ link rel violations**: ${violations.length}`);
  lines.push(`- **Total pages with raw retailer URLs**: ${rawRetailerPages.length}`);
  lines.push(`- **Total pages missing FTC disclosure block (where links exist)**: ${missingDisclosurePages.length}`);
  lines.push("");

  lines.push("## Detailed Page Audit Table");
  lines.push("");
  lines.push("| Page URL | /go/ Link Count | Has FTC Disclosure | Raw Retailer Domains Found | Status |");
  lines.push("| --- | --- | --- | --- | --- |");
  for (const page of results) {
    const status = (page.links.every(l => l.isValid) && (page.links.length === 0 || page.hasDisclosure) && !page.hasRawRetailerUrls) 
      ? "✅ PASS" 
      : "❌ FAIL";
    const rawRetailers = page.rawUrlMatches.length > 0 ? `\`${page.rawUrlMatches.join(", ")}\`` : "None";
    lines.push(`| \`${page.url}\` | ${page.links.length} | ${page.hasDisclosure ? "Yes" : "No"} | ${rawRetailers} | ${status} |`);
  }
  lines.push("");

  lines.push("## Audited /go/ Links");
  lines.push("");
  if (allLinks.length === 0) {
    lines.push("No `/go/` links were found on any pages.");
  } else {
    lines.push("| Source Page | Anchor Text | Target Href | Rel Attribute | Retailer | Status |");
    lines.push("| --- | --- | --- | --- | --- | --- |");
    for (const link of allLinks) {
      const status = link.isValid ? "✅ OK" : `❌ FAIL (${link.violationType})`;
      lines.push(`| \`${link.pageUrl}\` | \`${link.anchorText}\` | \`${link.href}\` | \`${link.rel}\` | ${link.retailer} | ${status} |`);
    }
  }
  lines.push("");

  if (violations.length > 0) {
    lines.push("## Rel Attribute Violations");
    lines.push("");
    for (const link of violations) {
      lines.push(`- **Page**: \`${link.pageUrl}\``);
      lines.push(`  - **Anchor**: "${link.anchorText}"`);
      lines.push(`  - **Href**: \`${link.href}\``);
      lines.push(`  - **Current Rel**: \`${link.rel}\``);
      lines.push(`  - **Error**: ${link.violationType}`);
      lines.push("");
    }
  }

  if (rawRetailerPages.length > 0) {
    lines.push("## Raw Retailer URL Matches");
    lines.push("");
    lines.push("> [!WARNING]");
    lines.push("> Raw retailer domains (like \`amazon.com\`) were detected in the rendered HTML of these pages. They should be verified to make sure they are not raw affiliate tracking links bypassing the \`/go/\` redirection system.");
    lines.push("");
    for (const page of rawRetailerPages) {
      lines.push(`- **Page**: \`${page.url}\` (Matches: \`${page.rawUrlMatches.join(", ")}\`)`);
    }
    lines.push("");
  }

  if (missingDisclosurePages.length > 0) {
    lines.push("## Missing FTC Disclosures");
    lines.push("");
    for (const page of missingDisclosurePages) {
      lines.push(`- **Page**: \`${page.url}\` has monetized links but is missing the FTC disclosure block.`);
    }
    lines.push("");
  }

  console.log(lines.join("\n"));
}

runAudit();
