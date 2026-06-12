const baseUrl = process.env.BPS_BASE_URL || "https://bowlerproshop.com";
const allowFallback = process.env.ALLOW_FALLBACK === "1";

async function assertHead(path: string, expected: number | number[]) {
  const response = await fetch(`${baseUrl}${path}`, { method: "HEAD", redirect: "manual" });
  const expectedStatuses = Array.isArray(expected) ? expected : [expected];
  if (!expectedStatuses.includes(response.status)) {
    throw new Error(`${path} returned ${response.status}, expected ${expectedStatuses.join(" or ")}`);
  }
  return response;
}

async function assertText(path: string, patterns: RegExp[]) {
  const response = await fetch(`${baseUrl}${path}`);
  if (!response.ok) {
    throw new Error(`${path} returned ${response.status}`);
  }
  const text = await response.text();
  for (const pattern of patterns) {
    if (!pattern.test(text)) {
      throw new Error(`${path} is missing pattern ${pattern}`);
    }
  }
}

async function assertRecommendApi() {
  const response = await fetch(`${baseUrl}/api/recommend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "ball",
      freetext: "league bowler medium oil",
      quickFilter: "League Bowler",
      advanced: {
        laneCondition: "Medium",
        budget: "$100-$200",
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`/api/recommend returned ${response.status}`);
  }

  const payload = await response.json() as {
    source?: string;
    results?: Array<{ product_name?: string }>;
  };

  if (!Array.isArray(payload.results) || payload.results.length !== 6) {
    throw new Error(`/api/recommend returned ${payload.results?.length ?? 0} results`);
  }

  if (!allowFallback && payload.source !== "gemini") {
    throw new Error(`/api/recommend source is ${payload.source || "missing"}, expected gemini`);
  }

  return {
    source: payload.source || "missing",
    count: payload.results.length,
    first: payload.results[0]?.product_name || "unknown",
  };
}

await assertHead("/", 200);
await assertHead("/find-my-gear", 200);
await assertHead("/go/amazon/search?q=Storm%20Phaze%20II", 302);
await assertText("/sitemap.xml", [
  /\/find-my-gear/,
  /\/guides\/used-bowling-ball-buying-checklist/,
  /\/best\/2-ball-bowling-bag/,
]);
await assertText("/robots.txt", [
  /Disallow:\s+\/go\//,
  /Disallow:\s+\/api\//,
  /Allow:\s+\/llms\.txt/,
  /Sitemap:\s+https:\/\/bowlerproshop\.com\/sitemap\.xml/,
]);
await assertText("/llms.txt", [
  /# BowlerProShop\.com/,
  /Find My Gear/,
  /Bowling Gear Guides/,
]);
await assertText("/guides/how-to-choose-a-bowling-ball", [
  /data-static-crawl-fallback="true"/,
  /application\/ld\+json/,
  /How to Choose a Bowling Ball/,
]);
await assertText("/disclosure", [
  /<meta name="robots" content="noindex, follow"/,
  /Affiliate Disclosure/,
]);

const api = await assertRecommendApi();
console.log(JSON.stringify({ ok: true, baseUrl, api }, null, 2));
