import { generatedGuidePages } from "../generated/content";

export const SITE = {
  name: "BowlerProShop.com",
  shortName: "BowlerProShop",
  origin: "https://bowlerproshop.com",
  description:
    "BowlerProShop.com helps league, returning, and casual bowlers choose bowling balls, shoes, bags, and accessories by fit, lane condition, budget, and skill level.",
  defaultImage: "https://bowlerproshop.com/brand/bowler-pro-shop-social-profile.png",
};

export const SOCIAL_LINKS = [
  {
    id: "youtube",
    name: "YouTube",
    handle: "@BowlerProShop",
    url: "https://www.youtube.com/@BowlerProShop",
  },
  {
    id: "tiktok",
    name: "TikTok",
    handle: "@BowlerProShop",
    url: "https://www.tiktok.com/@BowlerProShop",
  },
  {
    id: "x",
    name: "X",
    handle: "@BowlerProShop",
    url: "https://x.com/BowlerProShop",
  },
  {
    id: "instagram",
    name: "Instagram",
    handle: "@BowlerProShop",
    url: "https://www.instagram.com/BowlerProShop/",
  },
  {
    id: "facebook",
    name: "Facebook",
    handle: "@BowlerProShop",
    url: "https://www.facebook.com/BowlerProShop",
  },
] as const;

export interface PageSeo {
  path: string;
  title: string;
  description: string;
  type?: "website" | "article";
  noindex?: boolean;
}

export interface GuidePage extends PageSeo {
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  lastUpdated: string;
  monetization: string;
  author?: string;
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
  ctaLabel: string;
  ctaPath: string;
}

export interface CategoryPage extends PageSeo {
  eyebrow: string;
  intro: string;
  bestFor: string[];
  starterKit: Array<{
    item: string;
    reason: string;
  }>;
  relatedGuidePaths: string[];
  primaryCta: {
    label: string;
    path: string;
  };
}

export const pageSeo: Record<string, PageSeo> = {
  "/": {
    path: "/",
    title: "Search Bowling Equipment Deals Online | BowlerProShop.com",
    description:
      "Search bowling equipment deals online and compare balls, shoes, bags, grips, tape, towels, and accessories by fit, lane condition, skill level, and budget.",
  },
  "/find-my-gear": {
    path: "/find-my-gear",
    title: "Find My Bowling Gear | BowlerProShop.com",
    description:
      "Use the BowlerProShop gear finder to shortlist bowling balls and shoes by skill level, lane condition, budget, and bowling style.",
  },
  "/tools": {
    path: "/tools/bowling-ball-selector",
    title: "Bowling Gear Tools | Ball and Shoe Selectors",
    description:
      "Use BowlerProShop tools to match bowling balls and shoes by lane condition, fit, bowling frequency, and budget.",
  },
  "/tools/bowling-ball-selector": {
    path: "/tools/bowling-ball-selector",
    title: "Bowling Ball Selector | Match by Lane Condition and Skill",
    description:
      "Find bowling ball recommendations based on your average, rev rate, lane condition, budget, and bowling goals.",
  },
  "/tools/bowling-shoe-selector": {
    path: "/tools/bowling-shoe-selector",
    title: "Bowling Shoe Selector | Rental Upgrade and Performance Fit",
    description:
      "Compare bowling shoe options by bowling frequency, foot width, slide foot, support, and budget.",
  },
  "/guides": {
    path: "/guides",
    title: "Bowling Gear Guides | Balls, Shoes, Bags, and Accessories",
    description:
      "Practical bowling gear guides for first balls, shoe upgrades, accessory kits, ball cleaner, and league night setup.",
  },
  "/gear/bowling-balls": {
    path: "/gear/bowling-balls",
    title: "Bowling Balls | Selector, Fit, and Lane Condition Guide",
    description:
      "Choose bowling balls by coverstock, weight, lane condition, skill level, and drilling considerations before buying.",
  },
  "/gear/bowling-shoes": {
    path: "/gear/bowling-shoes",
    title: "Bowling Shoes | Rental Upgrade and Performance Fit",
    description:
      "Compare bowling shoes by slide foot, support, fit, bowling frequency, and beginner-to-performance upgrade needs.",
  },
  "/gear/bowling-bags": {
    path: "/gear/bowling-bags",
    title: "Bowling Bags | League Night Storage and 2-Ball Transport",
    description:
      "Plan bowling bag upgrades by wheel quality, shoe storage, accessory pockets, handle stability, and league-night transport.",
  },
  "/gear/bowling-accessories": {
    path: "/gear/bowling-accessories",
    title: "Bowling Accessories | Cleaner, Towels, Tape, and League Kit",
    description:
      "Build a practical bowling accessory kit with cleaner, towel, tape, shoe covers, and maintenance basics.",
  },
  "/start-here": {
    path: "/start-here",
    title: "Start Here | BowlerProShop Beginner Gear Guide",
    description:
      "Start with the BowlerProShop guide path for first bowling balls, shoe upgrades, accessories, and gear selectors.",
  },
  "/bowling-alleys": {
    path: "/bowling-alleys",
    title: "Bowling Alley Partnerships | BowlerProShop.com",
    description:
      "Partner with BowlerProShop.com on bowling center gear resources, league-night education, and bowler recommendation tools.",
  },
  "/pro-shops": {
    path: "/pro-shops",
    title: "Pro Shop Partnerships | BowlerProShop.com",
    description:
      "Explore BowlerProShop.com collaboration paths for local pro shops, product education, fitting resources, and affiliate programs.",
  },
  "/partners": {
    path: "/partners",
    title: "Partner With BowlerProShop | Contact connect@bowlerproshop.com",
    description:
      "Contact BowlerProShop.com about affiliate programs, product data, pro shop resources, bowling center collaborations, and media partnerships.",
  },
  "/contact": {
    path: "/contact",
    title: "Contact BowlerProShop | Partner and Business Inquiries",
    description:
      "Reach BowlerProShop.com for affiliate, partner, media, and bowling industry collaboration inquiries.",
  },
  "/disclosure": {
    path: "/disclosure",
    title: "Affiliate Disclosure | BowlerProShop.com",
    description:
      "How BowlerProShop.com earns commissions from merchant links and how affiliate relationships affect recommendations.",
    noindex: true,
  },
  "/affiliate-disclosure": {
    path: "/disclosure",
    title: "Affiliate Disclosure | BowlerProShop.com",
    description:
      "How BowlerProShop.com earns commissions from merchant links and how affiliate relationships affect recommendations.",
    noindex: true,
  },
  "/privacy": {
    path: "/privacy",
    title: "Privacy Policy | BowlerProShop.com",
    description:
      "Privacy basics for BowlerProShop.com visitors, selector inputs, email resources, analytics, and affiliate tracking.",
    noindex: true,
  },
  "/privacy-policy": {
    path: "/privacy",
    title: "Privacy Policy | BowlerProShop.com",
    description:
      "Privacy basics for BowlerProShop.com visitors, selector inputs, email resources, analytics, and affiliate tracking.",
    noindex: true,
  },
};

export const guidePages: GuidePage[] = generatedGuidePages;

export const categoryPages: CategoryPage[] = [
  {
    ...pageSeo["/gear/bowling-balls"],
    eyebrow: "Bowling balls",
    intro:
      "Choose bowling balls by the job they need to do: spare shooting, first hook, medium-oil league play, or a specific arsenal gap.",
    bestFor: ["First reactive ball", "House-shot league play", "Spare ball planning", "Used ball evaluation"],
    starterKit: [
      { item: "Benchmark reactive ball", reason: "Readable motion for learning lane transition." },
      { item: "Plastic spare ball", reason: "Keeps corner-pin shooting simple and repeatable." },
      { item: "Microfiber towel and cleaner", reason: "Maintains surface reaction across a set." },
    ],
    relatedGuidePaths: [
      "/guides/how-to-choose-a-bowling-ball",
      "/guides/first-reactive-bowling-ball",
      "/guides/bowling-ball-weight-and-fit",
      "/guides/used-bowling-ball-buying-checklist",
    ],
    primaryCta: {
      label: "Use the ball selector",
      path: "/tools/bowling-ball-selector",
    },
  },
  {
    ...pageSeo["/gear/bowling-shoes"],
    eyebrow: "Bowling shoes",
    intro:
      "Start with fit, slide consistency, and handedness. The best shoe is the one that makes your approach predictable every frame.",
    bestFor: ["Rental shoe upgrades", "Beginner league bowlers", "Athletic comfort", "Performance sole planning"],
    starterKit: [
      { item: "Fixed-slide beginner shoe", reason: "Predictable upgrade from rentals without extra tuning." },
      { item: "Shoe covers", reason: "Protects slide soles away from the approach." },
      { item: "Dry towel", reason: "Keeps moisture off hands and shoe edges." },
    ],
    relatedGuidePaths: [
      "/best/bowling-shoes-for-beginners",
      "/guides/beginner-bowling-shoe-comparison",
      "/guides/league-night-gear-checklist",
    ],
    primaryCta: {
      label: "Use the shoe selector",
      path: "/tools/bowling-shoe-selector",
    },
  },
  {
    ...pageSeo["/gear/bowling-bags"],
    eyebrow: "Bowling bags",
    intro:
      "Plan bag size around how you actually bowl: single-ball casual trips, two-ball league nights, or multi-ball tournament travel.",
    bestFor: ["Two-ball league setups", "Shoe and accessory storage", "Parking-lot transport", "Starter kit bundles"],
    starterKit: [
      { item: "2-ball roller", reason: "Carries strike and spare balls without shoulder strain." },
      { item: "Accessory pouch", reason: "Keeps tape, cleaner, and towels easy to find." },
      { item: "Shoe compartment", reason: "Separates soles from towels and grips." },
    ],
    relatedGuidePaths: [
      "/best/2-ball-bowling-bag",
      "/guides/league-night-gear-checklist",
      "/best/bowling-accessories-for-beginners",
    ],
    primaryCta: {
      label: "Plan my gear setup",
      path: "/find-my-gear",
    },
  },
  {
    ...pageSeo["/gear/bowling-accessories"],
    eyebrow: "Bowling accessories",
    intro:
      "Build accessories around consistency: clean ball surface, predictable grip, protected shoes, and a league-night kit that is easy to pack.",
    bestFor: ["Cleaner and towels", "Grip tape", "Shoe covers", "Beginner league kits"],
    starterKit: [
      { item: "Microfiber towel", reason: "Removes oil before each shot." },
      { item: "Approved ball cleaner", reason: "Supports consistent coverstock reaction after play." },
      { item: "Bowling tape", reason: "Adjusts grip as hand size changes during a set." },
    ],
    relatedGuidePaths: [
      "/best/bowling-accessories-for-beginners",
      "/best/bowling-ball-cleaner",
      "/guides/bowling-ball-cleaner-towel-maintenance",
      "/guides/league-night-gear-checklist",
    ],
    primaryCta: {
      label: "Build my setup",
      path: "/find-my-gear",
    },
  },
];

export function findGuidePage(pathname: string) {
  const normalizedPath = pathname.replace(/\/$/, "") || "/";
  return guidePages.find((guide) => guide.path === normalizedPath);
}

export function findCategoryPage(pathname: string) {
  const normalizedPath = pathname.replace(/\/$/, "") || "/";
  return categoryPages.find((category) => category.path === normalizedPath);
}

export function getSeoForPath(pathname: string): PageSeo {
  const normalizedPath = pathname.replace(/\/$/, "") || "/";
  return findGuidePage(normalizedPath) || findCategoryPage(normalizedPath) || pageSeo[normalizedPath] || pageSeo["/"];
}

export function absoluteUrl(path: string) {
  return `${SITE.origin}${path === "/" ? "/" : path}`;
}
