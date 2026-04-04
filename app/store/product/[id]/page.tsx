import MainLayout from "@/app/mainLayout";
import ProductDetailsView from "@/components/pages/store/ProductDetailsView";
import type { Metadata } from "next";
import { productService } from "@/services/product/product.service";
import { SITE_URL } from "@/lib/seo/buildMetadata";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const base = SITE_URL;

  try {
    const product = await productService.getProductById(id);
    const productName = product.product_name || product.name || "Product";
    const productDesc =
      product.product_description ||
      product.description ||
      `Buy ${productName} from verified suppliers on KartSquare — quality products with clear pricing and secure checkout.`;
    const productImages = product.product_images || product.images || [];
    const mainImage =
      (Array.isArray(productImages) && productImages[0]) ||
      product.image ||
      "";
    const canonical = `${base}/store/product/${id}`;
    const titleText = `${productName} | KartSquare`;

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
    const productName = product.product_name || product.name || "Product";
    const productDesc =
      product.product_description || product.description || "";
    const productImages = product.product_images || product.images || [];
    const mainImage =
      (Array.isArray(productImages) && productImages[0]) ||
      product.image ||
      "";
    const canonical = `${SITE_URL}/store/product/${id}`;
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: productName,
      image: mainImage || undefined,
      description: productDesc,
      offers: {
        "@type": "Offer",
        url: canonical,
        availability: "https://schema.org/InStock",
      },
    };
    jsonLd = JSON.stringify(structuredData);
  } catch {
    jsonLd = null;
  }

  return (
    <MainLayout>
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      ) : null}
      <ProductDetailsView productId={id} />
    </MainLayout>
  );
}
