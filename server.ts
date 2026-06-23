import express from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { getFallbackRecommendations } from "./src/lib/recommendations";
import { MERCHANT_INVENTORY, Retailer, getAffiliateLink, isEnabledRetailer } from "./src/lib/affiliate";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const SECURITY_HEADERS: Record<string, string> = {
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  "Content-Security-Policy-Report-Only": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://analytics.google.com https://www.clarity.ms https://*.clarity.ms https://c.bing.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "report-uri /csp-report",
  ].join("; "),
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), interest-cohort=()",
};

function robotsHeaderForPath(pathname: string) {
  const cleanPath = pathname.replace(/\/+$/, "") || "/";
  if (["/disclosure", "/privacy"].includes(cleanPath)) return "noindex, follow";
  if (cleanPath.startsWith("/go/") || cleanPath.startsWith("/api/") || cleanPath === "/csp-report") {
    return "noindex, nofollow";
  }
  return "";
}

function resolveDistPath() {
  const candidates = [
    path.resolve(process.cwd(), "dist"),
    path.resolve(process.cwd()),
    process.argv[1] ? path.dirname(process.argv[1]) : "",
  ].filter(Boolean);

  return (
    candidates.find((candidate) => fs.existsSync(path.join(candidate, "index.html"))) ||
    path.resolve(process.cwd(), "dist")
  );
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use((_, res, next) => {
    Object.entries(SECURITY_HEADERS).forEach(([header, value]) => res.setHeader(header, value));
    next();
  });
  app.use((req, res, next) => {
    const robotsHeader = robotsHeaderForPath(req.path);
    if (robotsHeader) {
      res.setHeader("X-Robots-Tag", robotsHeader);
    }
    next();
  });
  app.use(express.json());

  // --- API ROUTES ---

  // Affiliate Redirect System
  // Pattern: /go/{retailer}/{product-slug}/
  app.get("/go/:retailer/:slug", (req, res) => {
    const { retailer, slug } = req.params;
    const source = String(req.query.source || 'direct');
    const query = String(req.query.q || slug).replace(/-/g, " ").trim();
    const normalizedRetailer = retailer.toLowerCase() as Retailer;

    if (!isEnabledRetailer(normalizedRetailer) || !query) {
      return res.status(404).json({
        error: "affiliate_destination_not_configured",
        message: "That merchant destination is not configured yet.",
      });
    }

    const targetUrl = getAffiliateLink(normalizedRetailer, query);

    console.log(
      JSON.stringify({
        event: "affiliate_click",
        retailer: normalizedRetailer,
        merchant_name: MERCHANT_INVENTORY[normalizedRetailer]?.name,
        approval_status: MERCHANT_INVENTORY[normalizedRetailer]?.approvalStatus,
        slug,
        query,
        source,
      }),
    );

    res.redirect(302, targetUrl);
  });

  // Email Capture
  app.post("/api/email-signup", (req, res) => {
    const { email, bowlerType, gearNeed } = req.body;
    console.log(`New Email Signup: ${email}, Type: ${bowlerType}, Need: ${gearNeed}`);
    
    // Future production hook: send signup event to CRM or analytics endpoint.
    // analytics.track('email_signup', { email, bowlerType });

    res.json({ success: true, message: "Welcome to the pro shop." });
  });

  app.post("/csp-report", (req, res) => {
    console.log(JSON.stringify({ event: "csp_report", source: "express" }));
    res.status(204).end();
  });

  // B2B Lead Form
  app.post("/api/b2b-lead", (req, res) => {
    const { name, email, businessType, message } = req.body;
    console.log(`B2B Lead: ${name}, Business: ${businessType}`);
    res.json({ success: true });
  });

  // Gear Recommendation AI
  app.post("/api/recommend", async (req, res) => {
    const { type, freetext, quickFilter, advanced } = req.body;
    const fallbackResults = getFallbackRecommendations(type, freetext, quickFilter, advanced);
    
    if (!process.env.GEMINI_API_KEY) {
      return res.json({ results: fallbackResults, source: "fallback" });
    }

    try {
      const model = genAI.getGenerativeModel({ 
        model: GEMINI_MODEL,
        generationConfig: { responseMimeType: "application/json" }
      });

      const systemPrompt = `
You are the BowlerProShop Pro Shop Intelligence engine. You are a world-class virtual pro shop operator with deep knowledge of bowling ball technology, lane play, coverstock science, and equipment fitting.

Your job is to analyze a bowler's profile and return ONLY a structured JSON array of product recommendations — no explanations, no markdown, no extra text. Just the JSON.

Each recommendation must include:
- product_name: Full manufacturer + model name (e.g., "Storm Phaze II")
- brand: manufacturer name
- category: "ball" | "shoe" | "bag" | "accessory"
- amazon_search_query: Optimized search string for Amazon (e.g., "Storm Phaze II bowling ball 15lb")
- match_score: Integer 1–100 (how well it fits this bowler's profile)
- match_reason: One sentence explaining why this is the right pick (max 12 words)
- skill_fit: "beginner" | "intermediate" | "advanced" | "all"
- price_tier: "budget" | "mid" | "premium"
${type === 'ball' ? `
- coverstock_type: "plastic" | "urethane" | "reactive-solid" | "reactive-pearl" | "reactive-hybrid"
- core_type: "symmetrical" | "asymmetrical"
` : `
- sole_type: "rubber" | "microfiber-slide" | "interchangeable"
- style: "athletic" | "classic" | "performance"
- handedness_specific: true | false
`}

Return exactly 6 results, sorted by match_score descending.
`;

      const userPrompt = `
Bowler profile for ${type} selection:
- Description: ${freetext}
- Context/Skill: ${quickFilter}
- Advanced Data: ${JSON.stringify(advanced)}

Return 6 ${type} recommendations as a JSON array matching the schema in your system prompt.
`;

      const result = await model.generateContent([systemPrompt, userPrompt]);
      const response = await result.response;
      const text = response.text();
      
      try {
        const jsonResults = JSON.parse(text);
        res.json({ results: Array.isArray(jsonResults) ? jsonResults : (jsonResults.results || []) });
      } catch (e) {
        console.error("Failed to parse Gemini JSON:", text);
        res.json({ results: fallbackResults, source: "fallback" });
      }

    } catch (error) {
      console.error("Recommendation Error:", error);
      res.json({ results: fallbackResults, source: "fallback" });
    }
  });

  // --- VITE MIDDLEWARE ---

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = resolveDistPath();
    const canonicalAliases: Record<string, string> = {
      "/affiliate-disclosure": "/disclosure",
      "/privacy-policy": "/privacy",
    };

    app.use((req, res, next) => {
      const isAssetRequest = /\.[a-z0-9]+$/i.test(req.path);
      const cleanPath = req.path.replace(/\/$/, "") || "/";
      const canonicalPath = canonicalAliases[cleanPath];
      const prerenderedCandidates =
        cleanPath === "/"
          ? [path.join(distPath, "index.html")]
          : [
              path.join(distPath, `${cleanPath.replace(/^\/+/, "")}.html`),
              path.join(distPath, cleanPath.replace(/^\/+/, ""), "index.html"),
            ];
      const prerenderedPath = prerenderedCandidates.find((candidate) => fs.existsSync(candidate));

      if (
        (req.method === "GET" || req.method === "HEAD") &&
        !isAssetRequest &&
        !req.path.startsWith("/api/") &&
        !req.path.startsWith("/go/") &&
        (canonicalPath || prerenderedPath)
      ) {
        if (canonicalPath) {
          return res.redirect(308, canonicalPath);
        }

        if (req.path.length > 1 && req.path.endsWith("/")) {
          return res.redirect(308, cleanPath);
        }

        return res.sendFile(prerenderedPath);
      }

      next();
    });
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`BowlerProShop ION Backend running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
