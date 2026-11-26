import type { BlogPost } from "@/data/blogs";

const BASE_URL = String(
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.kartsquare.com"
).replace(/\/$/, "");

/** URL-safe slug from title when `slug` is missing (keeps blog posts indexable by topic). */
export function slugFromBlogTitle(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96) || "post";
}

/** One blog URL for app/sitemap.xml/route.ts, which also writes `cover` as an <image:image> tag. */
export interface BlogSitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency: "monthly";
  priority: number;
  cover?: string;
}

export function blogPostSitemapEntry(blog: BlogPost): BlogSitemapEntry | null {
  const slug = blog.slug?.trim() || slugFromBlogTitle(blog.title);
  if (!slug) return null;

  const url = `${BASE_URL}/blogs/${slug}`;
  const lastModified = blog.date ? new Date(blog.date) : new Date();
  const raw = blog.coverImage?.trim();
  // Covers in public/ are site paths; the sitemap needs absolute URLs.
  const cover = raw && /^https?:\/\//i.test(raw) ? raw : raw?.startsWith("/") && !raw.startsWith("//") ? `${BASE_URL}${raw}` : undefined;

  return {
    url,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.78,
    // Custom property for our specialized XML generator (app/sitemap.xml/route.ts)
    // to include <image:image> tags.
    cover,
  };
}
