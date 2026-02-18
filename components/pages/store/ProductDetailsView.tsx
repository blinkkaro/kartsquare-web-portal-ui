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

              gstNumber: apiProd.supplier?.gst_in

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

