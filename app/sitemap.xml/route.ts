import { NextResponse } from "next/server";
import { blogs } from "@/data/blogs";
import { blogPostSitemapEntry } from "@/lib/seo/blogSitemap";

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://kartsquare.com").replace(/\/$/, "");
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5500/api/v1";

/**
 * Escapes special XML characters in a string.
 */
function escapeXml(unsafe: string): string {
  if (!unsafe) return "";
  return unsafe.replace(/[<>&"']/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "\"": return "&quot;";
      case "'": return "&apos;";
      default: return c;
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
    { url: "/", priority: "1.0", changefreq: "daily" },
    // NOTE: /services removed — app/services/page.tsx does not exist (only /services/[id]).
    // A 404 URL in the sitemap signals bad quality to Google and wastes crawl budget.
    { url: "/store", priority: "0.95", changefreq: "daily" },
    { url: "/store/products", priority: "0.9", changefreq: "daily" },
    { url: "/search", priority: "0.85", changefreq: "weekly" },
    { url: "/map", priority: "0.75", changefreq: "weekly" },
    { url: "/contact-us", priority: "0.7", changefreq: "monthly" },
    { url: "/business-listing", priority: "0.8", changefreq: "weekly" },
    { url: "/blogs", priority: "0.88", changefreq: "weekly" },
    { url: "/careers", priority: "0.6", changefreq: "weekly" },
    // Legal & policy
    { url: "/terms-conditions", priority: "0.5", changefreq: "monthly" },
    { url: "/privacy-policy", priority: "0.5", changefreq: "monthly" },
    { url: "/cookie-policy", priority: "0.5", changefreq: "monthly" },
    // NOTE: /cus/reels removed — /cus/ is disallowed in robots.txt.
    // Having a disallowed URL in the sitemap is a direct contradiction that confuses Googlebot.
    // NOTE: /External/* removed — these are thin-content webview pages for the mobile app.
    // They are marked noindex in their page metadata; including them in the sitemap is misleading.
  ];

  // 2. Fetch Dynamic Data
  const [productRes, serviceRes, profileRes] = await Promise.all([
    fetch(`${API_URL}/products?limit=5000`).then(r => r.json()).catch(() => ({ data: [] })),
    fetch(`${API_URL}/services/sitemap`).then(r => r.json()).catch(() => ({ data: [] })),
    fetch(`${API_URL}/profile/sitemap`).then(r => r.json()).catch(() => ({ data: [] })),
  ]);

  const products = productRes?.data?.products || productRes?.data || [];
  const services = serviceRes?.data?.services || serviceRes?.data || [];
  const profiles = profileRes?.data?.profiles || profileRes?.data || [];

  // Build the XML header with namespaces
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

  // Helper to add mapping to XML
  const addUrl = (loc: string, lastmod: string, changefreq: string, priority: string, image?: string) => {
    xml += `
  <url>
    <loc>${escapeXml(loc.startsWith("http") ? loc : `${BASE_URL}${loc}`)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${image ? `
    <image:image>
      <image:loc>${escapeXml(image)}</image:loc>
    </image:image>` : ""}
  </url>`;
  };

  // Add Static
  staticRoutes.forEach(r => addUrl(r.url, now, r.changefreq, r.priority));

  // Add Blogs
  blogs.forEach(blog => {
    const entry = blogPostSitemapEntry(blog);
    if (entry) {
      addUrl(entry.url, (entry.lastModified instanceof Date ? entry.lastModified.toISOString() : now), "monthly", "0.78", entry.cover);
    }
  });

  // Add Products
  if (Array.isArray(products)) {
    products.forEach((p: any) => {
      const url = `${BASE_URL}/store/product/${p.product_id || p.id}`;
      const lastmod = p.updated_at || p.created_at || now;
      const images = p.product_images || p.images || [];
      const mainImage = Array.isArray(images) ? images[0] : (p.image || null);
      addUrl(url, new Date(lastmod).toISOString(), "weekly", "0.8", mainImage);
    });
  }

  // Add Services
  if (Array.isArray(services)) {
    services.forEach((s: any) => {
      const pathSeg = (s.slug && String(s.slug).trim()) || s.service_id || "";
      if (pathSeg) {
        const url = `${BASE_URL}/services/${pathSeg}`;
        const lastmod = s.updated_at || s.created_at || now;
        const mainImage = s.og_image || (Array.isArray(s.image_urls) ? s.image_urls[0] : null);
        addUrl(url, new Date(lastmod).toISOString(), "weekly", "0.82", mainImage);
      }
    });
  }

  // Add Profiles
  if (Array.isArray(profiles)) {
    profiles.forEach((p: any) => {
      const url = `${BASE_URL}/in/${p.username}`;
      const lastmod = p.updated_at || now;
      addUrl(url, new Date(lastmod).toISOString(), "daily", "0.9");
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
