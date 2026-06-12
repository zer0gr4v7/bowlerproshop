# Analytics Event Map (GTM/GA4)

| Event Name | Source | Parameters | Description |
|------------|--------|------------|-------------|
| `affiliate_click` | `/go/` Redirect | `retailer`, `product_id`, `source_page` | Fired on outbound redirect |
| `selector_start` | Selectors | `selector_type` | User starts a tool |
| `selector_submit` | Selectors | `selector_type`, `responses_json` | User completes a tool |
| `email_signup` | Forms | `form_location`, `bowler_type` | Newsletter/Checklist signup |
| `lead_form_submit` | B2B Pages | `business_type` | Alley/Shop inquiry |
| `guide_cta_click` | Guides | `cta_text`, `target_guide` | Internal traffic movement |

## Implementation Notes
- Use `dataLayer.push()` for client-side events.
- Server-side redirects should ideally ping GA4 Measurement Protocol or log to a database for audit.
