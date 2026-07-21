import type { Metadata } from "next";
import { seoPublic } from "./buildMetadata";

const API_BASE = process.env.NEXT_PUBLIC_API_URL as string;

export type SitePageSeoApiRow = {
  page_key: string;
  path: string;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
};

/**
 * Uses DB-backed SEO from `GET /api/v1/seo/pages/:pageKey` when meta_title + meta_description exist.
 * Otherwise returns `fallback` (build-time defaults).
 */
export async function sitePageSeoOrFallback(
  pageKey: string,
  fallback: Metadata,
): Promise<Metadata> {
  try {
    const res = await fetch(`${API_BASE}/seo/pages/${encodeURIComponent(pageKey)}`, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      return fallback;
    }
    const json = (await res.json()) as { data?: SitePageSeoApiRow };
    const row = json?.data;
    if (
      !row?.meta_title?.trim() ||
      !row?.meta_description?.trim() ||
      !row.path?.trim()
    ) {
      return fallback;
    }
    const keywords = row.meta_keywords
      ? row.meta_keywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean)
      : undefined;
    // Accept relative paths too — seoPublic will absolutize via SITE_URL fallback
    const image = row.og_image?.trim() || undefined;

    return seoPublic({
      title: row.meta_title.trim(),
      description: row.meta_description.trim(),
      path: row.path.trim(),
      ...(keywords?.length ? { keywords } : {}),
      ...(image ? { image } : {}),
      ...(row.og_title?.trim() ? { ogTitle: row.og_title.trim() } : {}),
      ...(row.og_description?.trim()
        ? { ogDescription: row.og_description.trim() }
        : {}),
    });
  } catch {
    return fallback;
  }
}
