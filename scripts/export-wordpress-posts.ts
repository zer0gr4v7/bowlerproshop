import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { guidePages } from "../src/lib/site";
import { toWordPressPost } from "../src/lib/wordpress";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputDir = join(__dirname, "../../exports/wordpress");

function frontmatter(post: ReturnType<typeof toWordPressPost>) {
  return [
    "---",
    `post_type: ${post.postType}`,
    `status: ${post.status}`,
    `slug: ${post.slug}`,
    `title: "${post.title.replace(/"/g, '\\"')}"`,
    `excerpt: "${post.excerpt.replace(/"/g, '\\"')}"`,
    `canonical_url: ${post.canonicalUrl}`,
    `author: ${post.authorSlug}`,
    `categories: [${post.categories.map((category) => `"${category}"`).join(", ")}]`,
    `tags: [${post.tags.map((tag) => `"${tag}"`).join(", ")}]`,
    `template_id: ${post.meta.templateId}`,
    `cta_label: "${post.meta.ctaLabel.replace(/"/g, '\\"')}"`,
    `cta_path: ${post.meta.ctaPath}`,
    `monetization: ${post.meta.monetization}`,
    `difficulty: ${post.meta.difficulty}`,
    `last_updated: ${post.meta.lastUpdated}`,
    "---",
    "",
  ].join("\n");
}

await mkdir(outputDir, { recursive: true });

const posts = guidePages.map(toWordPressPost);

await writeFile(
  join(outputDir, "bowlerproshop-wordpress-posts.json"),
  `${JSON.stringify(posts, null, 2)}\n`,
);

await Promise.all(
  posts.map((post) =>
    writeFile(join(outputDir, `${post.slug}.wp.md`), `${frontmatter(post)}${post.content}\n`),
  ),
);

console.log(`Exported ${posts.length} WordPress-ready posts to ${outputDir}`);
