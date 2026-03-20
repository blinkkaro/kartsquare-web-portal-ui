import React from "react";
import { useTranslate } from "@/hooks/useTranslate";
import { Box, Typography, Grid } from "@mui/material";
import LogoLoader from "@/components/common/Loader/LogoLoader";
import { COLORS } from "@/constants/colors";
import { ProductListItem } from "@/services/profile/profileInterface";
import ProductCard from "@/components/pages/store/ProductCard";

interface ProfileProductsProps {
  products: ProductListItem[];
  isLoading?: boolean;
}

export default function ProfileProducts({
  products,
  isLoading = false,
}: ProfileProductsProps) {
  const { t } = useTranslate();

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <LogoLoader />
      </Box>
    );
  }

  if (!isLoading && products.length === 0) {
    return (
      <Box
        sx={{ textAlign: "center", mt: 4, color: COLORS.TEXT.SECONDARY_LIGHT }}
      >
        <Typography>{t("noProductsFound")}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        {products.map((product, index) => (
          <Grid size={{ xs: 12, sm: 6 }} key={product.product_id}>
            <ProductCard
              product={{
                id: product.product_id,
                name: product.product_name,
                price: `${product.currency === "INR" ? "₹" : "$"} ${product.price}`,
                unit: "Unit", // Default unit
                image: product.product_images?.[0] || "",
                images: product.product_images || [],
                description: product.product_description,
                gst: "0%", // Placeholder
                category: "General", // Placeholder
                categoryId: "", // Placeholder
                supplier_id: product.supplier_id || "", // Corrected mapping
                specs: {},
                supplier: {
                  name: product.supplier?.store_name || "",
                  location: product.supplier?.store_address?.city_town || "",
                  rating: product.supplier?.user_rating || 0,
                  reviews: 0,
                  yearEstablished: parseInt(
                    product.supplier?.establishment_year || "2024",
                  ),
                  gstVerified: !!product.supplier?.verification_status,
                  trustSeal: product.supplier?.is_verified || false,
                  responseRate: "100%",
                  businessType: "Supplier",
                  address: product.supplier?.store_address?.address || "",
                },
              }}
              index={index}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
