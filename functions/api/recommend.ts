import { GoogleGenerativeAI } from "@google/generative-ai";
import { getFallbackRecommendations } from "../../src/lib/recommendations";

export async function onRequestPost(context: any) {
  let body: any = {};

  try {
    body = await context.request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const apiKey = context.env.GEMINI_API_KEY || context.env.VITE_GEMINI_API_KEY || "";
  const geminiModel = context.env.GEMINI_MODEL || "gemini-2.5-flash";
  const type = body.type || "ball";
  const freetext = body.freetext || "";
  const quickFilter = body.quickFilter || "";
  const advanced = body.advanced || {};

  const fallbackResults = getFallbackRecommendations(
    type,
    freetext,
    quickFilter,
    advanced,
  );

  if (!apiKey) {
    return Response.json({ results: fallbackResults, source: "fallback" });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: geminiModel,
      generationConfig: { responseMimeType: "application/json" },
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
      const results = Array.isArray(jsonResults)
        ? jsonResults
        : jsonResults.results || [];
      
      if (results.length > 0) {
        return Response.json({ results, source: "gemini" });
      }
    } catch (e) {
      console.error("Failed to parse Gemini JSON in worker:", text, e);
    }
  } catch (error) {
    console.error("Worker Recommendation Error:", error);
  }

  return Response.json({ results: fallbackResults, source: "fallback" });
}
