import type { Metadata } from "next";

/** Normalized site origin (no trailing slash). */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://kartsquare.com"
).replace(/\/$/, "");

function brandTitle(title: string): string {
  const s = title.trim();
  if (!s) return "KartSquare";
  if (/\|\s*KartSquare\s*$/i.test(s)) return s;
  if (/^KartSquare(\s|$|–|-)/i.test(s)) return s;
  return `${s} | KartSquare`;
}

function normalizePath(path: string): string {
  if (path === "/" || path === "") return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

/**
 * Indexable marketing/content pages: canonical, Open Graph, Twitter, robots.
 */
export function seoPublic(opts: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string;
  ogType?: "website" | "article";
  /** Override Open Graph / Twitter title (e.g. from DB SEO) */
  ogTitle?: string;
  /** Override Open Graph / Twitter description */
  ogDescription?: string;
}): Metadata {
  const path = normalizePath(opts.path);
  const canonical = path === "/" ? SITE_URL : `${SITE_URL}${path}`;
  const absoluteTitle = brandTitle(opts.title);
  const ogTitleResolved = opts.ogTitle
    ? brandTitle(opts.ogTitle)
    : absoluteTitle;
  const ogDescResolved = opts.ogDescription ?? opts.description;
  const image = opts.image;
  const ogType = opts.ogType ?? "website";

  return {
    title: { absolute: absoluteTitle },
    description: opts.description,
    ...(opts.keywords?.length ? { keywords: opts.keywords } : {}),
    alternates: { canonical },
    openGraph: {
      title: ogTitleResolved,
      description: ogDescResolved,
      url: canonical,
      siteName: "KartSquare",
      type: ogType,
      locale: "en_IN",
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: ogTitleResolved,
      description: ogDescResolved,
      ...(image ? { images: [image] } : {}),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

/** Authenticated or utility UI: do not index; allow following links (e.g. from email). */
export function seoAuth(opts: { title: string; description: string }): Metadata {
  return {
    title: { absolute: brandTitle(opts.title) },
    description: opts.description,
    robots: {
      index: false,
      follow: true,
      googleBot: { index: false, follow: true },
    },
  };
}

/** Dashboards and account areas: noindex, nofollow. */
export function seoPrivate(opts: { title: string; description: string }): Metadata {
  return {
    title: { absolute: brandTitle(opts.title) },
    description: opts.description,
    robots: {
      index: false,
      follow: false,
      googleBot: { index: false, follow: false },
    },
  };
}

/**
 * Title + description only (e.g. under a parent layout that sets robots).
 */
export function pageTab(title: string, description: string): Metadata {
  return {
    title: { absolute: brandTitle(title) },
    description,
  };
}
