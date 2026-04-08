import MainLayout from "@/app/mainLayout";
import ProductDetailsView from "@/components/pages/store/ProductDetailsView";
import type { Metadata } from "next";
import { productService } from "@/services/product/product.service";
import { SITE_URL } from "@/lib/seo/buildMetadata";
import { buildBreadcrumbJsonLd, BREADCRUMBS } from "@/lib/seo/breadcrumbs";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const base = SITE_URL;

  try {
    const product = await productService.getProductById(id);
    const productName = product.product_name || (product as any).name || "Product";
    
    // Access brand and supplier name based on available interface properties
    const brand = product.brand_name;
    const supplierName = (product as any).supplier?.name || (product as any).business_name;
    
    // Dynamic branded title: "Product by Business | KartSquare"
    const titleText = brand 
      ? `Buy ${productName} by ${brand} | KartSquare`
      : supplierName
        ? `Buy ${productName} from ${supplierName} | KartSquare`
        : `${productName} | KartSquare`;

    const productDesc =
      product.product_description ||
      (product as any).description ||
      `Buy ${productName} from ${supplierName || "verified suppliers"} on KartSquare. Discover quality products with clear pricing and secure business checkout.`;
    
    const productImages = product.product_images || (product as any).images || [];
    const mainImage =
      (Array.isArray(productImages) && productImages[0]) ||
      (product as any).image ||
      "";
    const canonical = `${base}/store/product/${id}`;

    return {
      title: { absolute: titleText },
      description: productDesc.slice(0, 160),
      alternates: { canonical },
      openGraph: {
        title: titleText,
        description: productDesc.slice(0, 200),
        url: canonical,
        siteName: "KartSquare",
        type: "website",
        locale: "en_IN",
        ...(mainImage ? { images: [{ url: String(mainImage) }] } : {}),
      },
      twitter: {
        card: mainImage ? "summary_large_image" : "summary",
        title: titleText,
        description: productDesc.slice(0, 200),
        ...(mainImage ? { images: [String(mainImage)] } : {}),
      },
      robots: { index: true, follow: true },
    };
  } catch {
    return {
      title: { absolute: "Product | KartSquare" },
      description: "Browse products from verified suppliers on KartSquare.",
      robots: { index: false, follow: true },
    };
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let jsonLd: string | null = null;
  try {
    const product = await productService.getProductById(id);
    const productName = product.product_name || (product as any).name || "Product";
    const productDesc =
      product.product_description || (product as any).description || "";
    const productImages = product.product_images || (product as any).images || [];
    const mainImage =
      (Array.isArray(productImages) && productImages[0]) ||
      (product as any).image ||
      "";
    
    const supplierName = (product as any).supplier?.name || (product as any).business_name;
    const brand = product.brand_name;

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: productName,
      image: mainImage || undefined,
      description: productDesc,
      brand: brand ? { "@type": "Brand", name: brand } : undefined,
      offers: {
        "@type": "Offer",
        url: `${SITE_URL}/store/product/${id}`,
        priceCurrency: product.currency || "INR",
        price: product.price || undefined,
        availability: "https://schema.org/InStock",
      },
    };
    const breadcrumbJsonLd = buildBreadcrumbJsonLd([
      ...BREADCRUMBS.STORE,
      { name: productName, item: `/store/product/${id}` },
    ]);

    jsonLd = JSON.stringify(structuredData);
    return (
      <MainLayout>
        {jsonLd ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: jsonLd }}
          />
        ) : null}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }}
        />
        <ProductDetailsView productId={id} />
      </MainLayout>
    );
  } catch {
    jsonLd = null;
    return (
      <MainLayout>
        <ProductDetailsView productId={id} />
      </MainLayout>
    );
  }
}
