export type RecommendationType = "ball" | "shoe";

export interface RecommendationResult {
  product_name: string;
  brand: string;
  category: string;
  amazon_search_query: string;
  match_score: number;
  match_reason: string;
  skill_fit: string;
  price_tier: string;
  coverstock_type?: string;
  core_type?: string;
  sole_type?: string;
  style?: string;
}

type AdvancedValues = Record<string, string | number | boolean | undefined>;

const ballRecommendations: RecommendationResult[] = [
  {
    product_name: "Storm Phaze II",
    brand: "Storm",
    category: "ball",
    amazon_search_query: "Storm Phaze II bowling ball 15lb",
    match_score: 94,
    match_reason: "Benchmark motion with control on medium oil.",
    skill_fit: "intermediate",
    price_tier: "premium",
    coverstock_type: "reactive-solid",
    core_type: "symmetrical",
  },
  {
    product_name: "Hammer Black Widow 3.0",
    brand: "Hammer",
    category: "ball",
    amazon_search_query: "Hammer Black Widow 3.0 bowling ball 15lb",
    match_score: 91,
    match_reason: "Strong asymmetric read for heavier volume.",
    skill_fit: "advanced",
    price_tier: "premium",
    coverstock_type: "reactive-solid",
    core_type: "asymmetrical",
  },
  {
    product_name: "Roto Grip Hustle M+M",
    brand: "Roto Grip",
    category: "ball",
    amazon_search_query: "Roto Grip Hustle M M bowling ball 15lb",
    match_score: 88,
    match_reason: "Clean value option for dry to medium lanes.",
    skill_fit: "all",
    price_tier: "mid",
    coverstock_type: "reactive-pearl",
    core_type: "symmetrical",
  },
  {
    product_name: "Motiv Venom Shock",
    brand: "Motiv",
    category: "ball",
    amazon_search_query: "Motiv Venom Shock bowling ball 15lb",
    match_score: 86,
    match_reason: "Predictable control with dependable backend shape.",
    skill_fit: "intermediate",
    price_tier: "mid",
    coverstock_type: "reactive-solid",
    core_type: "symmetrical",
  },
  {
    product_name: "Brunswick Rhino",
    brand: "Brunswick",
    category: "ball",
    amazon_search_query: "Brunswick Rhino bowling ball 15lb",
    match_score: 82,
    match_reason: "Friendly first reactive ball for lighter oil.",
    skill_fit: "beginner",
    price_tier: "budget",
    coverstock_type: "reactive-pearl",
    core_type: "symmetrical",
  },
  {
    product_name: "Storm Mix",
    brand: "Storm",
    category: "ball",
    amazon_search_query: "Storm Mix spare bowling ball 15lb",
    match_score: 76,
    match_reason: "Reliable spare control for any arsenal.",
    skill_fit: "all",
    price_tier: "budget",
    coverstock_type: "plastic",
    core_type: "symmetrical",
  },
];

const shoeRecommendations: RecommendationResult[] = [
  {
    product_name: "Dexter SST 8 Power Frame BOA",
    brand: "Dexter",
    category: "shoe",
    amazon_search_query: "Dexter SST 8 Power Frame BOA bowling shoes",
    match_score: 93,
    match_reason: "Interchangeable soles for serious league play.",
    skill_fit: "advanced",
    price_tier: "premium",
    sole_type: "interchangeable",
    style: "performance",
  },
  {
    product_name: "KR Strikeforce Flyer Mesh",
    brand: "KR Strikeforce",
    category: "shoe",
    amazon_search_query: "KR Strikeforce Flyer Mesh bowling shoes",
    match_score: 89,
    match_reason: "Lightweight upgrade from rentals at fair cost.",
    skill_fit: "beginner",
    price_tier: "budget",
    sole_type: "microfiber-slide",
    style: "athletic",
  },
  {
    product_name: "Brunswick Avalanche",
    brand: "Brunswick",
    category: "shoe",
    amazon_search_query: "Brunswick Avalanche bowling shoes",
    match_score: 86,
    match_reason: "Stable universal slide for regular league use.",
    skill_fit: "intermediate",
    price_tier: "mid",
    sole_type: "microfiber-slide",
    style: "classic",
  },
  {
    product_name: "Dexter Turbo Tour",
    brand: "Dexter",
    category: "shoe",
    amazon_search_query: "Dexter Turbo Tour bowling shoes",
    match_score: 84,
    match_reason: "Athletic fit with dependable slide control.",
    skill_fit: "intermediate",
    price_tier: "mid",
    sole_type: "microfiber-slide",
    style: "athletic",
  },
  {
    product_name: "3G Racer",
    brand: "3G",
    category: "shoe",
    amazon_search_query: "3G Racer bowling shoes",
    match_score: 81,
    match_reason: "Comfort-focused option for frequent bowlers.",
    skill_fit: "all",
    price_tier: "mid",
    sole_type: "microfiber-slide",
    style: "athletic",
  },
  {
    product_name: "BSI Basic #521",
    brand: "BSI",
    category: "shoe",
    amazon_search_query: "BSI basic bowling shoes 521",
    match_score: 74,
    match_reason: "Simple entry pair for occasional bowling.",
    skill_fit: "beginner",
    price_tier: "budget",
    sole_type: "rubber",
    style: "classic",
  },
];

export function getFallbackRecommendations(
  type: RecommendationType,
  _freetext = "",
  quickFilter = "",
  advanced: AdvancedValues = {},
): RecommendationResult[] {
  const source = type === "shoe" ? shoeRecommendations : ballRecommendations;
  const laneCondition = String(advanced.laneCondition || "").toLowerCase();
  const budget = String(advanced.budget || "").toLowerCase();
  const quick = quickFilter.toLowerCase();

  return source
    .map((item) => {
      let score = item.match_score;

      if (type === "ball") {
        if (laneCondition.includes("oily") && item.core_type === "asymmetrical") score += 4;
        if (laneCondition.includes("dry") && item.price_tier !== "premium") score += 3;
        if (quick.includes("just") && item.skill_fit === "beginner") score += 5;
        if (quick.includes("tournament") && item.skill_fit === "advanced") score += 5;
      }

      if (type === "shoe") {
        if (quick.includes("first") && item.price_tier === "budget") score += 5;
        if (quick.includes("performance") && item.sole_type === "interchangeable") score += 5;
        if (String(advanced.width || "").toLowerCase().includes("wide") && item.style === "athletic") score += 2;
      }

      if (budget.includes("under") && item.price_tier === "budget") score += 4;
      if (budget.includes("no limit") && item.price_tier === "premium") score += 3;

      return { ...item, match_score: Math.min(score, 99) };
    })
    .sort((a, b) => b.match_score - a.match_score)
    .slice(0, 6);
}
