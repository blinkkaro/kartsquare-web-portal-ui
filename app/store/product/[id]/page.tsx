import MainLayout from "@/app/mainLayout";
import ProductDetailsView from "@/components/pages/store/ProductDetailsView";
import type { Metadata } from "next";
import { productService } from "@/services/product/product.service";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const product = await productService.getProductById(id);
    const productName = product.product_name || product.name || "Product";
    const productDesc = product.product_description || product.description || "View detailed product information on Kartsquare.";
    const productImages = product.product_images || product.images || [];
    const mainImage = productImages[0] || product.image || "";

    const structuredData = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": productName,
      "image": mainImage,
      "description": productDesc,
      "offers": {
        "@type": "Offer",
        "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://kartsquare.com'}/store/product/${id}`,
        "availability": "https://schema.org/InStock",
      }
    };

    return {
      title: `${productName} | Kartsquare`,
      description: productDesc,
      openGraph: {
        title: productName,
        description: productDesc,
        images: mainImage ? [mainImage] : [],
      },
      other: {
        "script:ld+json": JSON.stringify(structuredData),
      },
    };
  } catch (error) {
    return {
      title: "Product Details | Kartsquare Store",
      description: "View detailed product information from verified suppliers",
    };
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <MainLayout>
      <ProductDetailsView productId={id} />
    </MainLayout>
  );
}
