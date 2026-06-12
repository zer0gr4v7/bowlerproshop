# Cloudways Deployment Notes

## Environment
- **Platform:** Cloudways (DigitalOcean / Vultr / Linode)
- **Application Type:** Custom PHP (for WordPress) or Node.js (for standalone ION)
- **Hosting Strategy:**
  - Option A: Primary site on WordPress, ION tool embedded as an iframe or subdirectory.
  - Option B: Full Node.js deployment using Cloudways "Custom App" or "Cloudways Autoscale".

## PHP / WordPress Configuration
- Use `wp-rocket` for caching.
- Use `ShortPixel` for image optimization.
- Ensure `allow_url_fopen` is ON for data fetching if needed.

## Node.js Configuration
- Reverse proxy (Nginx) should handle SSL.
- Use PM2 for process management.
- Set `NODE_ENV=production`.
