# GA4 + GTM Setup Guide — BowlerProShop.com

## IDs
- GTM Container: `GTM-MLHP4RF5`
- GA4 Property: `G-NKCCX535CK`
- Clarity: `x6quiweumi`

## Step 1: Import GTM Container

1. Go to GTM > Admin > Import Container
2. Choose `docs/gtm/GTM-MLHP4RF5-container-export.json`
3. Select "Merge" > "Rename conflicting tags"
4. Review and confirm

This creates:
- 5 tags (affiliate_click, page_view, selector_submit, email_signup, recommendation_result_view)
- 5 triggers (one per event, all Custom Event type)
- 20 Data Layer Variables (all DLV- prefixed)

## Step 2: GA4 Custom Dimensions (Admin > Custom definitions)

Create these in GA4 property settings:

### Event-scoped dimensions
| Parameter name | Display name | Scope |
|---------------|-------------|-------|
| retailer | Retailer | Event |
| merchant_name | Merchant Name | Event |
| search_query | Search Query | Event |
| source_page | Source Page | Event |
| device_category | Device Category | Event |
| screen_resolution | Screen Resolution | Event |
| viewport_size | Viewport Size | Event |
| page_type | Page Type | Event |
| item_category | Item Category | Event |
| product_slug | Product Slug | Event |
| placement | Placement | Event |
| quick_filter | Quick Filter | Event |
| selector_settings | Selector Settings | Event |

### Custom Metrics
| Parameter name | Display name | Unit |
|---------------|-------------|------|
| click_quality_score | Click Quality Score | Standard |
| session_click_number | Session Click Number | Standard |

## Step 3: Mark affiliate_click as Conversion

1. GA4 > Admin > Events
2. Find `affiliate_click`
3. Toggle "Mark as conversion" ON

## Step 4: Publish GTM

1. GTM > Submit > Publish
2. Name: "BowlerProShop analytics v2 — rich affiliate tracking"

## Quality Score Formula

```
quality_score = item_weight * engagement_multiplier

item_weight:
  ball=10, shoe=8, bag=6, accessory=4, cleaner/cover=3, tape/towel=2

engagement_multiplier:
  min(2.0, 1.0 + session_clicks * 0.1)

Range: 2-20 (higher = more valuable click)
```

Example: A user's 5th click on a bowling ball product:
- item_weight = 10
- engagement = min(2.0, 1.0 + 5*0.1) = 1.5
- quality_score = 10 * 1.5 = 15.0

## DataLayer Payload Example

When a user clicks "Buy" on a bowling ball result after selecting "League Bowler" with Medium rev rate:

```json
{
  "event": "affiliate_click",
  "retailer": "amazon",
  "merchant_name": "Amazon",
  "search_query": "Storm Phaze II bowling ball 15lb",
  "source_page": "/tools/bowling-ball-selector",
  "device_category": "desktop",
  "screen_resolution": "2560x1440",
  "viewport_size": "1420x900",
  "page_type": "selector",
  "item_category": "ball",
  "product_slug": "storm-phaze-ii",
  "placement": "selector_result",
  "quick_filter": "League Bowler",
  "selector_settings": "{\"avgScore\":165,\"revRate\":\"Medium\",\"laneCondition\":\"Medium\",\"budget\":\"$100-$200\"}",
  "click_quality_score": 12,
  "session_click_number": 2
}
```
