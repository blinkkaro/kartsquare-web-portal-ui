import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kartsquare.com';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5500/api/v1";

  // Static routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/store`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contactUs`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/freeListing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    }
  ];

  try {
    // Fetch products
    const productsRes = await fetch(`${apiUrl}/products?limit=1000`, { next: { revalidate: 3600 } });
    if (productsRes.ok) {
      const { data } = await productsRes.json();
      const products = data?.products || data || [];
      const productRoutes: MetadataRoute.Sitemap = products.map((product: any) => ({
        url: `${baseUrl}/store/product/${product.id}`,
        lastModified: new Date(product.updated_at || product.created_at || new Date()),
        changeFrequency: 'weekly',
        priority: 0.8,
      }));
      routes.push(...productRoutes);
    }

    // Fetch services
    const servicesRes = await fetch(`${apiUrl}/services?limit=1000`, { next: { revalidate: 3600 } });
    if (servicesRes.ok) {
      const { data } = await servicesRes.json();
      const services = data?.services || data || [];
      const serviceRoutes: MetadataRoute.Sitemap = services.map((service: any) => ({
        url: `${baseUrl}/services/${service.id}`,
        lastModified: new Date(service.updated_at || service.created_at || new Date()),
        changeFrequency: 'weekly',
        priority: 0.8,
      }));
      routes.push(...serviceRoutes);
    }
  } catch (error) {
    console.error("Error generating sitemap:", error);
  }

  return routes;
}
