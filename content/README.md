# BowlerProShop Content Source

This folder is the repo-owned source of truth for guide and best-of content.
The production app, static prerender output, sitemap, and WordPress export all
read from generated data built from these files.

## Edit Flow

1. Edit an existing `.mdx` file or add a new file under `guides/` or `best/`.
2. Keep the frontmatter fields complete.
3. Run `npm run content:generate` from `hostinger-site`.
4. Run `npm run lint` and `npm run build`.

## Required Frontmatter

- `order`: Sort order for featured guide lists.
- `path`: Canonical route, for example `/guides/how-to-choose-a-bowling-ball`.
- `type`: Usually `article`.
- `category`: Human-facing grouping.
- `difficulty`: Beginner, Intermediate, or Advanced.
- `lastUpdated`: `YYYY-MM`.
- `monetization`: Disclosure-ready monetization status.
- `title`: SEO title.
- `description`: Meta description and article summary.
- `ctaLabel`: Button label used on guide pages.
- `ctaPath`: Internal destination for the guide CTA.

## Body Format

The first body paragraph becomes the guide intro. Each `## Heading` block after
that becomes a guide section. Keep product claims conservative unless price,
availability, and merchant source have been verified.
