# OpenClaw Task Prompts

## 1. SEO_SCOUT
**Mission:** 
Find low-competition, high-intent bowling gear queries for:
- Bowling accessories for beginners
- Bowling shoe slide issues
- Best 2-ball roller bags for travel
- How to choose first hooking ball
**Output:** Content queue entries with Search Intent and Monetization Path.

## 2. AFFILIATE_SCOUT
**Mission:** 
Verify terms for:
- Amazon Associates
- BowlersMart Affiliate
- bowlingball.com / Bowlifi
- BowlerX / Bowling.com
**Output:** Updated `AffiliatePrograms` data entries.

## 3. PRODUCT_RESEARCHER
**Mission:** 
Build comparison matrices using source-labeled specs.
**Constraint:** No fake testing. No invented ratings. Use manufacturer RG/Differential data.
**Output:** JSON spec objects for the `Products` CPT.

## 4. CONTENT_ARCHITECT
**Mission:** 
Convert SEO opportunities into briefs.
**Required:** Internal links, schema type, disclosure placement, and specific product recommendations.

## 5. ANALYTICS_AUDITOR
**Mission:** 
Validate GTM/GA4 events.
**Target Events:** `affiliate_click`, `selector_submit`, `email_signup`.

## 6. COMPLIANCE_QA
**Mission:** 
Check for:
- Missing disclosures.
- Unsupported claims.
- Fake reviews/ratings.
- Source verification labels.
