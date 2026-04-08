import type { MetadataRoute } from "next";
import type { BlogPost } from "@/data/blogs";

const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://kartsquare.com"
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

export function blogPostSitemapEntry(blog: BlogPost): any {
  const slug = blog.slug?.trim() || slugFromBlogTitle(blog.title);
  if (!slug) return null;

  const url = `${BASE_URL}/blogs/${slug}`;
  const lastModified = blog.date ? new Date(blog.date) : new Date();
  const cover =
    blog.coverImage && /^https?:\/\//i.test(blog.coverImage.trim())
      ? blog.coverImage.trim()
      : undefined;

  return {
    url,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.78,
    // Custom property for our specialized XML generator (app/sitemap.xml/route.ts)
    // to include <image:image> tags.
    cover: cover || null,
  };
}
