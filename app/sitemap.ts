import { MetadataRoute } from "next";
import { blogs } from "@/data/blogs";
import { blogPostSitemapEntry } from "@/lib/seo/blogSitemap";

const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://kartsquare.com"
).replace(/\/$/, "");
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5500/api/v1";

/** Deduplicate by URL (last occurrence wins — prefer dynamic/API entries over static if duplicated). */
function dedupeSitemapByUrl(
  entries: MetadataRoute.Sitemap,
): MetadataRoute.Sitemap {
  const map = new Map<string, MetadataRoute.Sitemap[0]>();
  for (const e of entries) {
    if (e?.url) map.set(e.url, e);
  }
  return [...map.values()];
}

/**
 * Core marketing & discovery URLs (must match real `app/` routes).
 * `/services` redirects to `/cus/servicesList` — list the canonical path here only.
 */
function getStaticRoutes(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: BASE_URL, lastModified: now, changeFrequency: "daily", priority: 1 },
    {
      url: `${BASE_URL}/cus/servicesList`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/cus/reels`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/store`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/store/products`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/search`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/map`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.75,
    },
    {
      url: `${BASE_URL}/contactUs`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/business-listing`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blogs`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.88,
    },
    {
      url: `${BASE_URL}/careers`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/termsConditions`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacyPolicy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/cookie-policy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/businessInfo`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.55,
    },
  ];
}

/** Blog posts: slug from CMS, or derived from title; optional cover image for Google image discovery. */
function getBlogRoutes(): MetadataRoute.Sitemap {
  const out: MetadataRoute.Sitemap = [];
  for (const blog of blogs) {
    const entry = blogPostSitemapEntry(blog);
    if (entry) out.push(entry);
  }
  return out;
}

async function getProductRoutes(): Promise<MetadataRoute.Sitemap> {
  try {
    const res = await fetch(`${API_URL}/products?limit=5000`, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return [];
    const json = await res.json();
    const products =
      json?.data?.products ??
      json?.data ??
      json?.products ??
      (Array.isArray(json) ? json : []);
    if (!Array.isArray(products)) return [];
    return products
      .slice(0, 10000)
      .map(
        (p: {
          id?: string;
          product_id?: string;
          updated_at?: string;
          created_at?: string;
        }) => ({
          url: `${BASE_URL}/store/product/${p.product_id || p.id}`,
          lastModified:
            p.updated_at || p.created_at
              ? new Date(p.updated_at || p.created_at!)
              : new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        }),
      );
  } catch {
    return [];
  }
}

/** Approved active services — slug preferred (matches `/services/[id]` canonical). */
async function getServiceRoutes(): Promise<MetadataRoute.Sitemap> {
  try {
    const res = await fetch(`${API_URL}/services/sitemap`, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return [];
    const json = await res.json();
    const services =
      json?.data?.services ??
      json?.services ??
      (Array.isArray(json?.data) ? json.data : []);
    if (!Array.isArray(services)) return [];
    const entries: MetadataRoute.Sitemap = [];
    for (const s of services.slice(0, 20000) as Array<{
      service_id?: string;
      slug?: string | null;
      updated_at?: string;
      created_at?: string;
    }>) {
      const pathSeg =
        (s.slug && String(s.slug).trim()) || s.service_id || "";
      if (!pathSeg) continue;
      entries.push({
        url: `${BASE_URL}/services/${pathSeg}`,
        lastModified:
          s.updated_at || s.created_at
            ? new Date(s.updated_at || s.created_at!)
            : new Date(),
        changeFrequency: "weekly",
        priority: 0.82,
      });
    }
    return entries;
  } catch {
    return [];
  }
}

/** Public provider + supplier profiles (`/in/:username`). */
async function getProfileRoutes(): Promise<MetadataRoute.Sitemap> {
  try {
    const res = await fetch(`${API_URL}/profile/sitemap`, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return [];
    const json = await res.json();
    const profiles =
      json?.data?.profiles ??
      json?.data ??
      json?.profiles ??
      (Array.isArray(json) ? json : []);
    if (!Array.isArray(profiles)) return [];
    return profiles.slice(0, 20000).map(
      (p: { username: string; updated_at?: string }) => ({
        url: `${BASE_URL}/in/${p.username}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
        changeFrequency: "daily" as const,
        priority: 0.9,
      }),
    );
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [productRoutes, serviceRoutes, profileRoutes] = await Promise.all([
    getProductRoutes(),
    getServiceRoutes(),
    getProfileRoutes(),
  ]);

  const combined = [
    ...getStaticRoutes(),
    ...getBlogRoutes(),
    ...productRoutes,
    ...serviceRoutes,
    ...profileRoutes,
  ];

  return dedupeSitemapByUrl(combined);
}
