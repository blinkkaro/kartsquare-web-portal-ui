import { NextResponse } from "next/server";
import { blogs } from "@/data/blogs";
import { blogPostSitemapEntry } from "@/lib/seo/blogSitemap";

const BASE_URL = String(
  process.env.NEXT_PUBLIC_SITE_URL || "https://kartsquare.com"
).replace(/\/$/, "");
const API_URL = "https://api.kartsquare.com/api/v1";

/**
 * Escapes special XML characters in a string.
 */
function escapeXml(unsafe: string): string {
  if (!unsafe) return "";
  return unsafe.replace(/[<>&"']/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case '"':
        return "&quot;";
      case "'":
        return "&apos;";
      default:
        return c;
    }
  });
}

/**
 * Custom GET handler for /sitemap.xml
 * Supports Google Image Sitemap extensions for "MNC-level" discovery.
 */
export async function GET() {
  const now = new Date().toISOString();

  // 1. Static Routes
  const staticRoutes = [
    { url: "/" },
    { url: "/store" },
    { url: "/store/products" },
    { url: "/map" },
    { url: "/contact-us" },
    { url: "/business-listing" },
    { url: "/blogs" },
    { url: "/careers" },
    // Legal & policy
    { url: "/terms-conditions" },
    { url: "/privacy-policy" },
    { url: "/cookie-policy" },
  ];

  // 2. Fetch Dynamic Data
  const fetchJson = async (label: string, url: string) => {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.error(
          `[sitemap] ${label} fetch failed: ${res.status} ${res.statusText} (${url})`
        );
        return { data: [] };
      }
      return await res.json();
    } catch (err) {
      console.error(`[sitemap] ${label} fetch threw:`, err, `(${url})`);
      return { data: [] };
    }
  };

  const [productRes, serviceRes, profileRes] = await Promise.all([
    fetchJson("products", `${API_URL}/products?limit=5000`),
    fetchJson("services", `${API_URL}/services/sitemap`),
    fetchJson("profiles", `${API_URL}/profile/sitemap`),
  ]);

  const products = productRes?.data?.products || productRes?.data || [];
  const services = serviceRes?.data?.services || serviceRes?.data || [];
  const profiles = profileRes?.data?.profiles || profileRes?.data || [];

  // Build the XML header with namespaces
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

  // Helper to add mapping to XML
  const addUrl = (
    loc: string,
    lastmod?: string,
    image?: string
  ) => {
    xml += `
  <url>
    <loc>${escapeXml(loc.startsWith("http") ? loc : `${BASE_URL}${loc}`)}</loc>${
      lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""
    }${
      image
        ? `
    <image:image>
      <image:loc>${escapeXml(image)}</image:loc>
    </image:image>`
        : ""
    }
  </url>`;
  };

  // Add Static
  staticRoutes.forEach((r) => addUrl(r.url));

  // Add Blogs
  blogs.forEach((blog) => {
    const entry = blogPostSitemapEntry(blog);
    if (entry) {
      addUrl(
        entry.url,
        entry.lastModified instanceof Date
          ? entry.lastModified.toISOString()
          : undefined,
        entry.cover
      );
    }
  });

  // Add Products
  if (Array.isArray(products)) {
    products.forEach((p: any) => {
      const url = `${BASE_URL}/store/product/${p.product_id || p.id}`;
      const lastmod = p.updated_at || p.created_at;
      const images = p.product_images || p.images || [];
      const mainImage = Array.isArray(images) ? images[0] : p.image || null;
      addUrl(url, lastmod ? new Date(lastmod).toISOString() : undefined, mainImage);
    });
  }

  // Add Services
  if (Array.isArray(services)) {
    services.forEach((s: any) => {
      const pathSeg = (s.slug && String(s.slug).trim()) || s.service_id || "";
      if (pathSeg) {
        const url = `${BASE_URL}/services/${pathSeg}`;
        const lastmod = s.updated_at || s.created_at;
        const mainImage =
          s.og_image || (Array.isArray(s.image_urls) ? s.image_urls[0] : null);
        addUrl(
          url,
          lastmod ? new Date(lastmod).toISOString() : undefined,
          mainImage
        );
      }
    });
  }

  // Add Profiles
  if (Array.isArray(profiles)) {
    profiles.forEach((p: any) => {
      const url = `${BASE_URL}/in/${p.username}`;
      const lastmod = p.updated_at;
      addUrl(url, lastmod ? new Date(lastmod).toISOString() : undefined);
    });
  }

  xml += `
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=59",
    },
  });
}
