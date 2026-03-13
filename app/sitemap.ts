import { MetadataRoute } from 'next';
import { blogs } from '@/data/blogs';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kartsquare.com';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5500/api/v1';

/** Static public routes – include all indexable pages for maximum discoverability */
function getStaticRoutes(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: BASE_URL, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/store`, lastModified: now, changeFrequency: 'daily', priority: 0.95 },
    { url: `${BASE_URL}/store/products`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/services`, lastModified: now, changeFrequency: 'daily', priority: 0.95 },
    { url: `${BASE_URL}/contactUs`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/business-listing`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/businessInfo`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/blogs`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/careers`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE_URL}/map`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/search`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/termsConditions`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/privacyPolicy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/cookie-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];
}

/** Blog post URLs from static data */
function getBlogRoutes(): MetadataRoute.Sitemap {
  return blogs.map((blog) => ({
    url: `${BASE_URL}/blogs/${blog.id}`,
    lastModified: blog.date ? new Date(blog.date) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }));
}

/** Fetch product URLs from API – critical for marketplace visibility */
async function getProductRoutes(): Promise<MetadataRoute.Sitemap> {
  try {
    const res = await fetch(`${API_URL}/products?limit=5000`, {
      next: { revalidate: 3600 },
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) return [];
    const json = await res.json();
    const products = json?.data?.products ?? json?.data ?? json?.products ?? [];
    if (!Array.isArray(products)) return [];
    return products.slice(0, 10000).map((p: { id: string; updated_at?: string; created_at?: string }) => ({
      url: `${BASE_URL}/store/product/${p.id}`,
      lastModified: p.updated_at || p.created_at ? new Date(p.updated_at || p.created_at!) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch {
    return [];
  }
}

/** Fetch service URLs from API */
async function getServiceRoutes(): Promise<MetadataRoute.Sitemap> {
  try {
    const res = await fetch(`${API_URL}/services?limit=5000`, {
      next: { revalidate: 3600 },
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) return [];
    const json = await res.json();
    const services = json?.data?.services ?? json?.data ?? json?.services ?? [];
    if (!Array.isArray(services)) return [];
    return services.slice(0, 10000).map((s: { id: string; updated_at?: string; created_at?: string }) => ({
      url: `${BASE_URL}/services/${s.id}`,
      lastModified: s.updated_at || s.created_at ? new Date(s.updated_at || s.created_at!) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [productRoutes, serviceRoutes] = await Promise.all([
    getProductRoutes(),
    getServiceRoutes(),
  ]);

  return [
    ...getStaticRoutes(),
    ...getBlogRoutes(),
    ...productRoutes,
    ...serviceRoutes,
  ];
}
