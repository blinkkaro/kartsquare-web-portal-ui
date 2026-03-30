"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductDetails from "./ProductDetails";
import { storeService } from "@/services/store/store.service";
import { Box, Container } from "@mui/material";
import CenteredLoader from "@/components/common/Loader/CenteredLoader";
import { Product } from "@/hooks/useSearchSuggestions";

interface ProductDetailsViewProps {
  productId: string;
}

const ProductDetailsView: React.FC<ProductDetailsViewProps> = ({ productId }) => {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Fetch single product - you may need to adjust this based on your API
        const response = await storeService.getProductDetails(productId);

        if (response.status === "success" && response.data) {
          const apiProd = response.data as any;
          const mappedProduct: Product = {
            id: apiProd.product_id || productId,
            name: apiProd.product_name,
            price: `${apiProd.currency === "INR" ? "₹" : "$"} ${apiProd.price}`,
            unit: "Piece",
            image: apiProd.product_images?.[0] || "",
            images: apiProd.product_images || [],
            description: apiProd.product_description,
            gst: "18%",
            category: apiProd.category_name || "General",
            categoryId: apiProd.supplier_id || apiProd.product_id || "",
            specs:
              apiProd.specifications?.reduce((acc: any, spec: any) => {
                acc[spec.name] = spec.value.join(", ");
                return acc;
              }, {}) || {},
            supplier_id: apiProd.supplier_id,
            supplier: {
              name: apiProd.supplier?.store_name || "Verified Supplier",
              location: apiProd.supplier?.store_address?.city_town || apiProd.product_origin || "Multiple Locations",
              rating: apiProd.supplier?.user_rating || 0,
              reviews: Math.floor(Math.random() * 50) + 10,
              yearEstablished: parseInt(apiProd.supplier?.establishment_year) || 2024,
              gstVerified: !!apiProd.supplier?.gst_in,
              trustSeal: apiProd.supplier?.is_verified || apiProd.supplier?.verification_status === "APPROVED",
              responseRate: "98%",
              businessType: apiProd.supplier?.business_type || "Wholesaler",
              address: apiProd.supplier?.store_address?.address || "India",
              logo: apiProd.supplier?.logo_url,
              mobile: apiProd.supplier?.primary_mobile,
              gstNumber: apiProd.supplier?.gst_in,
              latitude: parseFloat(apiProd.supplier?.store_address?.lat) || 0,
              longitude: parseFloat(apiProd.supplier?.store_address?.long) || 0,
              id: apiProd.supplier_id,
              username: apiProd.supplier?.username,
            },
          };
          setProduct(mappedProduct);

          // Map Similar Products
          if (apiProd.similar_products && Array.isArray(apiProd.similar_products)) {
            const mappedSimilar: Product[] = apiProd.similar_products.map((sim: any) => ({
              id: sim.product_id,
              name: sim.product_name,
              price: `${sim.currency === "INR" ? "₹" : "$"} ${sim.price}`,
              unit: "Piece",
              image: sim.product_images?.[0] || "",
              images: sim.product_images || [],
              description: sim.product_description,
              gst: "18%",
              category: sim.category_name || "General",
              categoryId: sim.product_category_id || "",
              specs: {},
              supplier: {
                name: sim.supplier?.store_name || "Verified Supplier",
                location: sim.supplier?.store_address?.city_town || "India",
                rating: sim.supplier?.user_rating || 0,
                reviews: 10,
                yearEstablished: 2024,
                gstVerified: !!sim.supplier?.gst_in,
                trustSeal: sim.supplier?.is_verified || false,
                responseRate: "95%",
                businessType: "Wholesaler",
                address: sim.supplier?.store_address?.address || "",
                logo: sim.supplier?.logo_url,
                id: sim.supplier_id || "",
              },
              supplier_id: sim.supplier_id || "",
            }));
            setSimilarProducts(mappedSimilar);
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return <CenteredLoader size={60} minHeight="100vh" />;
  }

  return <ProductDetails product={product} onBack={handleBack} similarProducts={similarProducts} />;
};

export default ProductDetailsView;
