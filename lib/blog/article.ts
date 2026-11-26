import type { BlogPost } from "@/data/blogs";

export interface TocEntry {
  id: string;
  label: string;
}

export interface PreparedArticle {
  /** Article HTML with an id on every h2, and the cover credit taken out. */
  html: string;
  toc: TocEntry[];
  /** The "Cover photo: ..." credit as HTML, shown as the cover's caption. Null when the post has none. */
  coverCredit: string | null;
  readingMinutes: number;
  /** "26 Nov 2026", formatted on the server so client and server render the same text. */
  displayDate: string;
}

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'", apos: "'", nbsp: " " };

/** Plain text from a fragment of our own HTML, with the common entities decoded for display. */
const stripTags = (html: string) =>
  html
    .replace(/<[^>]+>/g, " ")
    .replace(/&(amp|lt|gt|quot|#39|apos|nbsp);/g, (_m, e: string) => ENTITIES[e])
    .replace(/\s+/g, " ")
    .trim();

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64) || "section";

/** Words per minute for an unhurried reader. */
const WPM = 220;

/**
 * Prepares a post's static HTML for the article page. Content is our own typed data (data/blogs.ts),
 * so this only adds anchors and pulls the credit out; it does not sanitise untrusted input.
 */
export function prepareArticle(blog: BlogPost): PreparedArticle {
  let html = blog.content;

  // The cover credit sits at the end of the post; show it under the photo instead.
  let coverCredit: string | null = null;
  html = html.replace(/<p>\s*<small>\s*(Cover photo:[\s\S]*?)<\/small>\s*<\/p>/i, (_m, inner: string) => {
    coverCredit = inner.trim();
    return "";
  });

  const toc: TocEntry[] = [];
  const used = new Set<string>();
  html = html.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/gi, (_m, attrs: string, inner: string) => {
    const label = stripTags(inner);
    let id = slugify(label);
    for (let n = 2; used.has(id); n++) id = `${slugify(label)}-${n}`;
    used.add(id);
    toc.push({ id, label });
    const clean = attrs.replace(/\s*id="[^"]*"/i, "");
    return `<h2 id="${id}"${clean}>${inner}</h2>`;
  });

  const words = stripTags(html).split(" ").filter(Boolean).length;
  return { html, toc, coverCredit, readingMinutes: Math.max(1, Math.round(words / WPM)), displayDate: formatBlogDate(blog.date) };
}

/** "26 Nov 2026". Fixed to UTC so the server and the browser print the same day. */
export function formatBlogDate(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(date);
}

/** Other posts to read next: same category first, then the newest, never the post itself. */
export function relatedPosts(blog: BlogPost, all: BlogPost[], count = 3): BlogPost[] {
  const others = all.filter((b) => b.id !== blog.id);
  const byDate = (a: BlogPost, b: BlogPost) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0);
  const same = others.filter((b) => b.category === blog.category).sort(byDate);
  const rest = others.filter((b) => b.category !== blog.category).sort(byDate);
  return [...same, ...rest].slice(0, count);
}

export const blogPath = (b: Pick<BlogPost, "slug" | "id">) => `/blogs/${b.slug || b.id}`;
