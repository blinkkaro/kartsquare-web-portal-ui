"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductDetails from "./ProductDetails";
import { Product } from "./index";
import { storeService } from "@/services/store/store.service";
import { Box, CircularProgress, Container } from "@mui/material";

interface ProductDetailsViewProps {
  productId: string;
}

const ProductDetailsView: React.FC<ProductDetailsViewProps> = ({ productId }) => {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Fetch single product - you may need to adjust this based on your API
        const response = await storeService.getProducts({
          page: 1,
          limit: 1,
          product_id: productId,
        });

        if (response.status === "success" && response.data?.products?.[0]) {
          const apiProd = response.data.products[0];
          const mappedProduct: Product = {
            id: apiProd.product_id,
            name: apiProd.product_name,
            price: `${apiProd.currency === "INR" ? "₹" : "$"} ${apiProd.price}`,
            unit: "Piece",
            image: apiProd.product_images?.[0] || "",
            images: apiProd.product_images || [],
            description: apiProd.product_description,
            gst: "18%",
            category: "General",
            categoryId: "",
            specs:
              apiProd.specifications?.reduce((acc: any, spec) => {
                acc[spec.name] = spec.value.join(", ");
                return acc;
              }, {}) || {},
            supplier: {
              name: "Premium Supplier",
              location: apiProd.product_origin || "Multiple Locations",
              rating: 4.5,
              reviews: 120,
              yearEstablished: 2015,
              gstVerified: true,
              trustSeal: true,
              responseRate: "95%",
              businessType: "Manufacturer",
              address: "Industrial Area, Phase 1, India",
            },
          };
          setProduct(mappedProduct);
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
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return <ProductDetails product={product} onBack={handleBack} />;
};

export default ProductDetailsView;
