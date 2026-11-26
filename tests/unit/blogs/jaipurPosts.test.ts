import fs from "fs";
import path from "path";
import { blogs } from "@/data/blogs";
import { findBannedClaims } from "@/lib/services/claims";
import { getCategoryContent } from "@/lib/services/content";

/** Posts written to the content rules in docs/01. Older posts predate the rules and are not checked here. */
const CHECKED = ["10", "11", "12"];
const posts = blogs.filter((b) => CHECKED.includes(b.id));

describe("Jaipur blog posts", () => {
  it("exist with unique slugs and ids", () => {
    expect(posts).toHaveLength(CHECKED.length);
    expect(new Set(blogs.map((b) => b.slug)).size).toBe(blogs.length);
    expect(new Set(blogs.map((b) => b.id)).size).toBe(blogs.length);
  });

  it.each(posts.map((p) => [p.slug, p] as const))("%s: no banned claims, sane metadata, real internal links", (_slug, p) => {
    const text = p.content.replace(/<[^>]+>/g, " ");
    expect(findBannedClaims([p.title, p.excerpt, p.description, p.metaTitle, p.metaDescription, text].join(" "))).toEqual([]);
    expect(`${p.metaTitle} | kartsquare`.length).toBeLessThanOrEqual(60);
    expect(p.metaDescription.length).toBeGreaterThanOrEqual(70);
    expect(p.metaDescription.length).toBeLessThanOrEqual(160);
    expect(text.split(/\s+/).filter(Boolean).length).toBeGreaterThan(1000);
    expect(p.content).not.toMatch(/<h1[ >]/);
    expect(p.content).not.toMatch(/\[cite/);
    for (const [, slug] of p.content.matchAll(/href="\/services\/c\/([^"/#]+)/g)) expect(getCategoryContent(slug)).toBeDefined();
    for (const [, attrs] of p.content.matchAll(/<a ([^>]*href="https?:[^>]*)>/g)) expect(attrs).toContain('rel="noopener noreferrer"');
  });

  it("local covers exist, are under 500 KB and are credited in the post", () => {
    for (const p of posts.filter((x) => x.coverImage.startsWith("/"))) {
      const file = path.join(process.cwd(), "public", p.coverImage);
      expect(fs.existsSync(file)).toBe(true);
      expect(fs.statSync(file).size).toBeLessThan(500 * 1024);
      expect(p.content).toMatch(/Cover photo:.*(CC BY|CC0|Public domain)/);
    }
  });
});
