# BowlerProShop WordPress Migration and Make Content Pipeline Plan

Date: 2026-09-24
Status: planning only
Owner lane: ION website deployments and system hardening
Current live site: https://bowlerproshop.com
Repository: zer0gr4v7/bowlerproshop

## What Exists

BowlerProShop is currently live and reachable on Cloudflare Pages. A live read on 2026-09-24 returned HTTP 200 for the apex domain and a reachable `/sitemap.xml`.

The current production model is a React/Vite/TypeScript decision-layer site with repo-owned MDX content, generated sitemap output, and a WordPress export path. The local app root is `hostinger-site/`.

Current local content inventory observed on 2026-09-24:

- 11 guide posts under `hostinger-site/content/guides/`
- 5 best-of posts under `hostinger-site/content/best/`
- Existing export command: `npm run export:wordpress`
- Existing WordPress-ready artifacts path: `exports/wordpress/`

Relevant existing scripts:

```text
npm run content:generate
npm run build
npm run export:wordpress
npm run smoke:prod
npm run deploy:preview
npm run deploy:prod
```

## Planning Position

This is not a same-day DNS cutover. Treat the WordPress migration as a staged replacement with live parity gates.

The current Cloudflare Pages site remains the production source of truth until all of these are true:

1. Cloudways WordPress target is provisioned and audited.
2. WordPress staging has content, theme, redirects, analytics, and affiliate disclosure parity.
3. `/find-my-gear` has a working WordPress-compatible path.
4. Make content pipeline creates drafts only, with approval evidence.
5. Production backup and rollback are recorded.
6. DNS/canonical cutover has explicit human approval.

## Goals

1. Migrate BowlerProShop from the React/Cloudflare Pages implementation to a Cloudways-hosted WordPress site without losing crawlability, affiliate tracking, or the Find My Gear conversion path.
2. Create the first Make content pipeline using Firecrawl as a research tool and a writer-role agent based on the `Agent Assignment = Base Agent + Role Overlay + Assignment Context` model from the referenced `agent-role-fit` work.
3. Keep the first automation draft-only. No unattended publishing.
4. Leave GitHub as the source of implementation plans, schemas, prompts, and migration evidence.

## Non-Goals

- Do not delete, replace, or disable the Cloudflare Pages production site during planning.
- Do not publish WordPress posts automatically in the first pipeline.
- Do not use generic scraping output as finished content.
- Do not use Cloudways MCP for automation loops. For future automated Cloudways reporting use direct Cloudways API tokens; use MCP for interactive audits and operator-assisted actions.
- Do not reuse retired `bw` / `BW_SESSION` secret flows. Use Bitwarden Secrets Manager names only.

## Architecture Decision

### Hosting

Target WordPress host: Cloudways WordPress application.

Cloudways actions must follow impact gates:

- Read-only account/app/server inventory: safe to run.
- App creation, staging clone, backup, cache controls, SSL, DNS, or production cutover: requires explicit approval.
- Delete, destructive restore, certificate revocation, staging push-to-live, or access revocation: blocked unless explicitly confirmed with backup/recovery state.

### WordPress Role

WordPress becomes the editorial and publishing system of record after cutover.

The React/Cloudflare Pages repo remains valuable as:

- Migration source content.
- Schema and redirect map reference.
- Prior UX reference for Find My Gear.
- Export tooling reference.
- Rollback/static fallback until WordPress is proven.

### Make Role

Make should be the visible orchestration layer for the content workflow:

- intake
- Firecrawl research
- writer-agent call
- quality gates
- WordPress draft creation
- Slack/Linear/GitHub evidence

Make should not be the evaluation authority and should not publish without human approval. The first version should run manually or on demand, then graduate to scheduled draft generation after accepted canary runs.

### Firecrawl Role

Firecrawl is the research extractor, not the writer.

Use it to collect source notes, product/category claims, competitor SERP context, and source URLs. The writer agent must transform this into original BowlerProShop content with citations/internal notes, not copy page text.

A small Firecrawl probe on 2026-09-24 returned source candidates for bowling ball buyer-guide research, including:

- Storm Bowling buyer guide
- BowlersMart bowling ball buyer guide
- Bowling.com performance-level guide

Those are seed examples only. Every pipeline run should capture its own research sources and URLs.

## Make Workspace Readback

Observed Make connection on 2026-09-24:

- Zone: `us1.make.com`
- Organization: `SEO Holdings` (`organizationId=34342`)
- Team: `SEO Holdings` (`teamId=13446`)
- Candidate folder: `SEO.HOLDINGS Growth Loop` (`folderId=323754`)
- No existing scenario matched `BowlerProShop` by name.

Make app discovery confirmed these relevant native modules exist:

- `firecrawl:Search`
- `firecrawl:Scrape`
- `firecrawl:Crawl`
- `firecrawl:Extract`
- `wordpress:createPost`
- `wordpress:updatePost`
- `wordpress:searchPosts`
- `gateway:CustomWebHook`
- `scenario-service:StartSubscenario`
- `scenario-service:ReturnData`
- flow-control router/iterator/aggregator modules

Before building, call `module_spec` for the exact modules and verify live connection availability. Do not guess field names or credentials.

## Blog Writer Role Contract

Use the referenced `agent-role-fit` model:

```text
Agent Assignment = Base Agent + Role Overlay + Assignment Context
```

### Base Agent Requirements

The base writer agent must have:

- Stable brand voice instruction set.
- Access to Firecrawl research payloads.
- Access to BowlerProShop brand/monetization rules.
- No authority to publish.
- No authority to change DNS, Cloudways, WordPress plugins, affiliate IDs, or analytics.
- Ability to produce structured draft output, not freeform chat only.

### Role Overlay: BowlerProShop Blog Content Writer

Responsibilities:

- Turn research into original buyer-guide drafts.
- Maintain BowlerProShop voice: practical, direct, pro-shop-aware, trust-first, affiliate-transparent.
- Prioritize reader fit, lane condition, skill level, budget, and safety/fit caveats.
- Include a commercial disclosure and final-fit reminder.
- Link toward `/find-my-gear` or equivalent WordPress conversion route.
- Emit WordPress-ready block markup or structured JSON for the WordPress create-draft module.

Hard limits:

- Never claim live prices, stock, warranties, or exact specs unless the source payload proves them.
- Never copy source page language wholesale.
- Never publish or schedule posts.
- Never change affiliate tags or merchant routing.

### Assignment Context

Each run must include:

- topic
- target keyword/search intent
- target reader stage
- source URLs and source summaries
- internal link target
- affiliate disclosure text
- draft status: always `draft`
- canonical policy: preserve current route until cutover plan says otherwise

## Proposed First Make Pipeline

Name: `BowlerProShop - Firecrawl Research to WordPress Draft v0`
Folder: `SEO.HOLDINGS Growth Loop` (`323754`) unless the operator chooses a new BowlerProShop folder.
Status: create inactive first.
Trigger: on-demand scenario or webhook intake, not a schedule for v0.

### v0 Flow

```text
1. Intake
   - Webhook or StartSubscenario input.
   - Required fields: topic, targetKeyword, readerStage, preferredAngle, internalLinkTarget.

2. Guardrails
   - Reject empty topic or broad/duplicative topics.
   - Check topic against existing WordPress drafts/posts once WordPress connection exists.
   - Check topic against repo content index during migration.

3. Firecrawl research
   - Use `firecrawl:Search` for SERP/source candidates.
   - Use `firecrawl:Scrape` for 3-5 approved sources.
   - Store source URL, title, summary, and extracted claims.
   - Prefer authoritative manufacturer, retailer, rule/education, and pro-shop style sources.

4. Research normalization
   - Aggregate source notes.
   - Separate confirmed facts from editorial interpretation.
   - Flag unsupported claims for exclusion.

5. Writer-agent call
   - Pass normalized research to the BowlerProShop Blog Content Writer role.
   - Require structured output:
     - title
     - slug
     - excerpt
     - categories
     - tags
     - blockContent
     - sourceNotes
     - internalLinks
     - disclosureIncluded boolean
     - confidence and gaps

6. Quality gate
   - Reject if disclosure is missing.
   - Reject if no `/find-my-gear` or replacement conversion link is included.
   - Reject if article is thin.
   - Reject if unsupported price/stock/spec claims appear.
   - Reject if source URLs are missing.

7. WordPress draft
   - Use `wordpress:createPost` with `status=draft` only.
   - Apply categories/tags.
   - Preserve source notes in a private/custom field or GitHub evidence artifact, not in the public post body unless editorial policy says otherwise.

8. Evidence and notification
   - Write a GitHub evidence file or issue comment with topic, sources, draft URL/ID, run ID, and quality-gate result.
   - Notify Slack/Linear for human review.
   - Return output: draftPostId, draftUrl, sourceUrls, status, humanReviewNeeded.
```

## WordPress Migration Plan

### Phase 0 - Decision and Inventory

Deliverables:

- Cloudways account/app/server read-only inventory.
- Confirm target app is a dedicated WordPress app, not a shared/ambiguous app.
- Confirm backup schedule, PHP version, object cache, Varnish, SSL path, and team access.
- Confirm whether Cloudflare remains DNS/WAF/CDN front door.
- Confirm WordPress admin/auth method through BWS names, not raw secrets.

Stop rules:

- No app creation or DNS changes without explicit approval.
- No use of shared master credentials for agent publishing.
- No migration into an app that hosts unrelated production sites unless blast radius is accepted.

### Phase 1 - WordPress Staging Foundation

Deliverables:

- Cloudways WordPress staging app.
- Minimal block theme or child theme matching BowlerProShop brand.
- Required plugins only:
  - SEO plugin for title/meta/canonicals/schema control.
  - Redirect manager if not handled at Cloudflare.
  - Cache-compatible table/block support if needed.
  - Application-password or scoped publishing user for Make.
- WP REST API reachable from Make.
- Draft-only author user for automation.

Acceptance:

- WordPress staging home page loads.
- `/wp-json/wp/v2` responds.
- Draft creation with a non-production test post works.
- Agent user cannot publish.

### Phase 2 - Content Migration

Deliverables:

- Run `npm run export:wordpress` from current source.
- Import current guides/best posts as drafts first.
- Preserve slugs for `/guides/*` and `/best/*` where possible.
- Create redirect/canonical map for any route that changes.
- Validate title, excerpt, disclosure, categories, tags, and internal links.

Acceptance:

- All current content exists in WordPress as drafts or private staging posts.
- No post is auto-published.
- Canonical and redirect plan is reviewed before public indexing.

### Phase 3 - Find My Gear Parity

Options:

1. Embed current React finder as a WordPress-hosted widget.
2. Build a small WordPress plugin/shortcode wrapper around the existing recommendation API pattern.
3. Keep `/find-my-gear` on Cloudflare temporarily and route WordPress content CTAs there until a WordPress-native implementation is proven.

Recommended first path: option 3 for migration safety, then option 1 or 2 after content and SEO parity.

Acceptance:

- WordPress articles link to a working finder path.
- Finder submits and returns results.
- Affiliate disclosure remains visible.
- Affiliate links/tags are preserved.

### Phase 4 - Make v0 Draft Pipeline

Deliverables:

- Inactive Make scenario in the selected folder.
- Module specs captured for Firecrawl and WordPress modules.
- Draft-only WordPress connection verified.
- One test topic creates one WordPress draft and one evidence artifact.

Acceptance:

- Scenario run creates exactly one draft.
- Draft is not published or scheduled.
- Firecrawl source URLs are retained.
- Human review notification fires.
- Failed quality gates stop before WordPress createPost.

### Phase 5 - SEO, Analytics, and Cutover Readiness

Deliverables:

- GA4/GTM/Clarity parity.
- Search Console ownership verified for WordPress target.
- XML sitemap reviewed.
- Robots/canonical rules reviewed.
- Redirect map tested.
- Cloudways/WordPress backup and rollback point recorded.
- Cloudflare DNS change plan prepared.

Acceptance:

- Staging crawl has no missing title/meta/canonical/H1 for migrated pages.
- Top existing routes return either matching content or correct redirects.
- Performance is acceptable with cache on.
- Explicit cutover approval is captured.

### Phase 6 - Cutover

Cutover requires a separate approval block. This plan does not authorize it.

Minimum cutover steps:

1. Freeze new content changes.
2. Export final content delta.
3. Create backup/snapshot.
4. Apply DNS/CNAME/Cloudflare route change.
5. Verify apex, `www`, sitemap, robots, canonical, key posts, finder, affiliate links, analytics.
6. Monitor Search Console and server logs.
7. Keep Cloudflare Pages rollback target intact through the first validation window.

## Suggested Backlog

### FLO Tasks

- `FLO`: Cloudways WordPress target read-only inventory and staging recommendation.
- `FLO`: WordPress migration content/export/import dry run.
- `FLO`: Find My Gear WordPress parity decision and proof of concept.
- `FLO`: Make Firecrawl-to-draft scenario build, inactive by default.
- `FLO`: Draft quality gate and evidence artifact writer.
- `FLO`: SEO/canonical/redirect validation crawl before cutover.

### BF Tasks

- `BF`: Approve Cloudways account/app target and any new app cost.
- `BF`: Provide/confirm BWS secret names for WordPress application password, Cloudways token, and Firecrawl/Make credentials if needed.
- `BF`: Approve first WordPress draft publishing policy.
- `BF`: Approve DNS/canonical cutover after staging evidence.

## First Canary Topic

Recommended canary topic:

```text
How to choose a bowling ball for medium oil if you are a league bowler moving beyond house balls
```

Why:

- It maps cleanly to Find My Gear.
- It has enough source material.
- It avoids volatile price/stock claims.
- It tests reader-fit voice, lane-condition research, disclosure, and CTA handling.

Expected Firecrawl source mix:

- manufacturer education page
- retailer buying guide
- general bowling education/performance-level page
- optional product category page only if claims are treated conservatively

## Evidence Required Before Calling v0 Complete

- GitHub plan merged or linked.
- Make scenario exists inactive.
- Module specs/readback captured.
- One canary run creates a WordPress draft only.
- Firecrawl source list retained.
- Writer output contains disclosure, local pro-shop caveat, and Find My Gear CTA.
- Human review notification received.
- No publish action occurred.

## Risks

| Risk | Mitigation |
|---|---|
| Losing current SEO routes | Preserve slugs or create redirect map before cutover. |
| WordPress becomes slower than Cloudflare Pages | Validate caching, Varnish, object cache, and page speed before DNS. |
| Make publishes too early | Draft-only connection/user, quality gate before createPost, no publish module in v0. |
| Firecrawl content becomes plagiarism input | Store source notes, force original synthesis, reject copied phrasing. |
| Writer agent overclaims product facts | Require source-backed claims and conservative language. |
| Finder breaks during migration | Keep current `/find-my-gear` live until WordPress parity is proven. |
| Cloudways account ambiguity | Identify the exact account/app before every live operation. |

## What Would Make This Plan Wrong

- The business needs WordPress only for a blog while keeping the decision engine on Cloudflare permanently.
- Cloudways is not the final hosting target.
- The Make WordPress connection cannot be scoped to draft-only.
- Firecrawl module auth is unavailable or cost-prohibitive.
- The operator chooses n8n as the deterministic publisher and Make only for intake/approval.

If any of those become true, revise the plan before implementation.
