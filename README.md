# BowlerProShop.com Hostinger MVP

## Mission

BowlerProShop.com is a practical bowling gear decision engine. The launch MVP helps
bowlers choose balls and shoes by fit, lane condition, and skill level before a full
commerce stack is ready.

## Architecture

- Frontend: React + Vite.
- Runtime: Express server that serves the built SPA and API routes.
- Recommendation API: Gemini when `GEMINI_API_KEY` is configured; deterministic
  fallback recommendations when it is not.
- Monetization: affiliate-first MVP, with WooCommerce planned separately.

## Local Commands

```bash
npm ci
npm run lint
npm run build
npm start
```

Local production preview:

```bash
npm run preview:prod
```

## Hostinger Package

Generate the hPanel upload ZIP from this directory:

```bash
npm run pack:hostinger
```

Output:

`../deploy/bowlerproshop-hostinger-node.zip`

Use the settings in:

`../docs/HOSTINGER_GO_LIVE_RUNBOOK.md`

## Deployment Notes

- Hostinger Node version: 22.x or 24.x.
- Build command: `npm run build`.
- Start command: `npm start`.
- Output directory: `dist`.
- Entry file: `dist/server.cjs`.
- Optional env: `GEMINI_API_KEY`.
- Required before production DNS: fix the Cloudflare Error 1000 records documented
  in the go-live runbook.
