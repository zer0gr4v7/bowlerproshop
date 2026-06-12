# Multi-Input Search + Affiliate Results — Future Feature Spec
## BowlerProShop.com | v1.0 | May 2026

---

Status note, 2026-06-09: this remains useful product thinking, but the active
BF-310 implementation decision is now in `../docs/BF-310_SEARCH_ENGINE_DECISION.md`.
Do not treat this file as approval to import the generic ION search shell before
the provider-backed product search contract exists.

## Overview

This document defines the UX framework, AI prompt architecture, and affiliate integration strategy for BowlerProShop.com's core decision tools. The pattern is modeled after the "multi-input search → affiliate results" framework pioneered by aidomaingenius.com, adapted for bowling gear discovery.

The core insight: **bowlers don't know what they need — they know how they bowl.** The tools translate bowling behavior into specific product recommendations with direct Amazon affiliate buy links.

---

## The Framework Pattern (from aidomaingenius.com reverse engineering)

The reference site uses this 5-part architecture:
1. **Primary freetext input** — auto-expanding textarea (CSS grow-wrap trick, no JS)
2. **Style radio toggles** — quick-select personality for the result type
3. **Collapsible advanced options panel** — slider, keyword, dropdown filters
4. **Affiliate selector dropdown** — user picks their preferred retailer (built client-side)
5. **Results table** — dynamically injected rows with affiliate "Buy now" links + favorites/localStorage

For BowlerProShop.com, this maps to:
1. **"How do you bowl?" prompt** (freetext or structured)
2. **Skill level / goal radio pills**
3. **Advanced panel** — score, rev rate, lane condition, budget
4. **Buy from dropdown** — Amazon, BowlingBall.com, Storm Direct
5. **Results cards** — Match Score + affiliate links

---

## AI Prompt Architecture

### Master System Prompt (for all gear tools)

```
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
- coverstock_type: (balls only) "plastic" | "urethane" | "reactive-solid" | "reactive-pearl" | "reactive-hybrid"
- core_type: (balls only) "symmetrical" | "asymmetrical"

Return exactly 5–8 results, sorted by match_score descending.
```

---

## Tool 1: Bowling Ball Selector

### UX Flow

```
STEP 1 — HERO INPUT (always visible)
┌─────────────────────────────────────────────────────────────┐
│  How would you describe your bowling style?                  │
│  [I'm a league bowler with a medium hook, about 165 avg...] │
│                                              [FIND MY BALL →]│
└─────────────────────────────────────────────────────────────┘

STEP 2 — QUICK FILTERS (radio pills, below input, always visible)
  ○ Just Starting    ● League Bowler    ○ Sport Bowler    ○ Tournament

STEP 3 — ADVANCED OPTIONS (collapsed by default, "Advanced options ▾")
  ┌─────────────────────────┐  ┌──────────────────────────────┐
  │ Average Score            │  │ Rev Rate                     │
  │ [────●──────────] 165   │  │ ○ Low   ● Medium   ○ High    │
  └─────────────────────────┘  └──────────────────────────────┘
  ┌─────────────────────────┐  ┌──────────────────────────────┐
  │ Typical Lane Condition   │  │ Budget                       │
  │ ○ Dry  ● Medium  ○ Oily  │  │ ○ Under $100  ● $100–$200   │
  │                          │  │ ○ $200+  ○ No limit          │
  └─────────────────────────┘  └──────────────────────────────┘
  ┌─────────────────────────────────────────────────────────────┐
  │ Buy from:  [Amazon ▾]    (also: BowlingBall.com / Ebonite) │
  └─────────────────────────────────────────────────────────────┘

STEP 4 — RESULTS (injected below, same page)
  ┌────────────────────────────────────────────────────────────┐
  │ #  │ Ball                    │ Match │ Coverstock │ Buy    │
  ├────┼─────────────────────────┼───────┼────────────┼────────┤
  │ ★  │ Storm Phaze II          │  94   │ R-Pearl    │ $159 → │
  │ ★  │ Roto Grip Hustle RAW    │  88   │ R-Solid    │ $109 → │
  │ ☆  │ Brunswick Rhino         │  82   │ Reactive   │  $79 → │
  │ ☆  │ Hammer Black Widow 2.0  │  79   │ R-Solid    │ $199 → │
  │ ☆  │ Motiv Trident Nemesis   │  74   │ R-Hybrid   │ $189 → │
  └────────────────────────────────────────────────────────────┘
       [★ Save to My Bag]   [Generate More Options →]
```

### AI Prompt (Ball Selector — sent with each request)

```
Bowler profile:
- Description: {freetext_input}
- Skill level: {skill_level}
- Average score: {avg_score}
- Rev rate: {rev_rate}
- Typical lane condition: {lane_condition}
- Budget: {budget}
- Preferred retailer: {retailer}

Return 6 bowling ball recommendations as a JSON array matching the schema in your system prompt. Prioritize match_score accuracy — a 165-average league bowler on medium oil should NOT receive high-end asymmetric tournament balls as top results.
```

---

## Tool 2: Bowling Shoe Selector

### UX Flow

```
STEP 1 — HERO INPUT
┌─────────────────────────────────────────────────────────────┐
│  Tell us about your bowling and shoe needs:                  │
│  [I rent shoes now, bowl twice a week, have wide feet...]   │
│                                           [FIND MY SHOES →] │
└─────────────────────────────────────────────────────────────┘

STEP 2 — QUICK FILTERS (radio pills)
  ○ First Pair Ever    ● Upgrading Rentals    ○ Performance    ○ Athletic Style

STEP 3 — ADVANCED OPTIONS
  ┌─────────────────────────┐  ┌──────────────────────────────┐
  │ Bowling Frequency        │  │ Foot Width                   │
  │ ○ Casual (< 1x/week)    │  │ ○ Narrow  ● Standard  ○ Wide │
  │ ● Regular (1–2x/week)   │  └──────────────────────────────┘
  │ ○ Serious (3x+/week)    │  ┌──────────────────────────────┐
  └─────────────────────────┘  │ Slide Foot                   │
  ┌─────────────────────────┐  │ ● Right   ○ Left   ○ Both    │
  │ Budget                   │  └──────────────────────────────┘
  │ ○ Under $50  ● $50–$100  │
  │ ○ $100–$150  ○ $150+     │
  └─────────────────────────┘
  ┌─────────────────────────────────────────────────────────────┐
  │ Buy from:  [Amazon ▾]                                       │
  └─────────────────────────────────────────────────────────────┘

STEP 4 — RESULTS
  ┌────────────────────────────────────────────────────────────┐
  │ #  │ Shoe                       │ Match │ Type    │ Buy    │
  ├────┼────────────────────────────┼───────┼─────────┼────────┤
  │ ★  │ BSI Sport 540               │  92   │ Athletic│  $65 → │
  │ ★  │ Dexter Ricky IV             │  87   │ Classic │  $59 → │
  │ ☆  │ Storm Gust                  │  84   │ Perf.   │  $89 → │
  │ ☆  │ Dexter SST 8 Pro            │  78   │ Perf.   │ $129 → │
  │ ☆  │ KR Strikeforce Flyer        │  71   │ Athletic│  $49 → │
  └────────────────────────────────────────────────────────────┘
```

### AI Prompt (Shoe Selector)

```
Bowler profile:
- Description: {freetext_input}
- Upgrade intent: {upgrade_level}
- Bowling frequency: {frequency}
- Foot width: {foot_width}
- Slide foot: {slide_foot}
- Budget: {budget}

Return 6 bowling shoe recommendations as a JSON array. For shoes, replace coverstock_type and core_type fields with:
- sole_type: "rubber" | "microfiber-slide" | "interchangeable"
- style: "athletic" | "classic" | "performance"
- handedness_specific: true | false

Prioritize fit, frequency of use, and budget alignment. Do not recommend interchangeable-sole performance shoes to casual bowlers.
```

---

## Amazon Affiliate Integration

### Why Amazon

- Commission: 3–4% on Sports & Outdoors (bowling gear category)
- Average ball price: ~$150 → ~$5–6 per conversion
- Average shoe price: ~$80 → ~$3 per conversion
- Cookie window: 24 hours (session) / 90 days (add to cart)
- Advantage: near-100% product availability, Prime eligibility shown, trusted checkout
- Signup: Amazon Associates Program (associates.amazon.com)

### Link Construction (client-side, no server needed)

```javascript
// affiliate-links.js
const AFFILIATES = {
  amazon: {
    baseUrl: 'https://www.amazon.com/s',
    tag: 'YOUR_ASSOCIATE_TAG-20',  // replace with real tag
    getLink: (searchQuery) =>
      `https://www.amazon.com/s?k=${encodeURIComponent(searchQuery)}&tag=YOUR_ASSOCIATE_TAG-20`
  },
  bowlingball: {
    baseUrl: 'https://www.bowlingball.com',
    getLink: (searchQuery) =>
      `https://www.bowlingball.com/search?q=${encodeURIComponent(searchQuery)}`
  }
};

function getAffiliateLink(retailer, product) {
  return AFFILIATES[retailer].getLink(product.amazon_search_query);
}
```

### Disclosure (Required by FTC + Amazon TOS)

Place in footer of every results page:
> "BowlerProShop.com is a participant in the Amazon Services LLC Associates Program. We earn a small commission on qualifying purchases at no extra cost to you."

---

## Favorites / "My Bag" Feature

Mirrors aidomaingenius.com's favorites panel. Stored in localStorage, no login required.

```javascript
// my-bag.js
const BAG_KEY = 'bowlerproshop_bag';

const MyBag = {
  add: (product) => {
    const bag = MyBag.getAll();
    if (!bag.find(p => p.product_name === product.product_name)) {
      bag.push(product);
      localStorage.setItem(BAG_KEY, JSON.stringify(bag));
    }
  },
  remove: (productName) => {
    const bag = MyBag.getAll().filter(p => p.product_name !== productName);
    localStorage.setItem(BAG_KEY, JSON.stringify(bag));
  },
  getAll: () => JSON.parse(localStorage.getItem(BAG_KEY) || '[]'),
  clear: () => localStorage.removeItem(BAG_KEY),
};
```

**"Buy All" CTA:** Copy all product names + Amazon links to clipboard, redirect to Amazon multi-search or open all in tabs.

---

## Analytics Events (GA4)

Track these events to understand the funnel:

| Event | Trigger |
|---|---|
| `tool_started` | User opens a selector tool |
| `form_submitted` | User clicks Find My Ball/Shoes |
| `results_shown` | Results render (include result_count) |
| `affiliate_click` | User clicks any Buy link (include product_name, retailer, match_score) |
| `item_saved` | User stars/saves a product to My Bag |
| `bag_opened` | User opens My Bag panel |

---

## Implementation Priority

1. **Ball Selector** — highest search volume, highest AOV (~$150), clearest differentiation
2. **Shoe Selector** — second highest volume, strong repeat purchase signal
3. **Bag Selector** — lower urgency, but gift purchase potential is high
4. **Accessory Kit Builder** — bundle play, increases cart value per session

---

## Gemini Prompt to Implement This Feature

Use this prompt in AI Studio to build the feature:

```
Build the Multi-Input Search + Affiliate Results feature for BowlerProShop.com based on the MULTI_INPUT_SEARCH_AFFILIATE.md spec.

Implement the following:

1. A reusable GearSelectorTool React component that accepts a toolConfig prop defining:
   - toolName, heroPlaceholder, quickFilters[], advancedOptions[], and resultSchema

2. Wire the Ball Selector at /tools/ball-selector using the Ball Selector toolConfig from the spec

3. Wire the Shoe Selector at /tools/shoe-selector using the Shoe Selector toolConfig from the spec

4. Each tool should:
   - Have a freetext textarea (auto-expand with CSS, no JS)
   - Show quick-filter radio pills below the input
   - Have a collapsible Advanced Options panel (toggle on click)
   - Include a Buy From dropdown (Amazon / BowlingBall.com) that updates all links on change
   - POST to /api/recommend with the structured profile payload
   - Render results as a dark-themed table with: rank number, star/save button, product name, match score badge, price tier, and affiliate Buy button
   - Show a My Bag slide-in panel on the right (localStorage-persisted)
   - Include FTC affiliate disclosure below results

5. The affiliate link function should use: https://www.amazon.com/s?k={encoded_query}&tag=bowlerproshop-20

6. Add GA4 events: tool_started, form_submitted, results_shown, affiliate_click, item_saved

Match the existing dark navy + amber + teal design system. Use Tailwind CSS. Keep the component under 400 lines by extracting the affiliate link logic and localStorage logic into separate utility files.
```

---

*Document generated May 2026 — BowlerProShop.com internal spec*
*Pattern analysis: aidomaingenius.com (GQueues, 2024)*
