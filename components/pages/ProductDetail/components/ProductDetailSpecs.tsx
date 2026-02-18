"use client";

import React from "react";
import { Box, Typography, Grid, useTheme } from "@mui/material";
import { useTranslate } from "@/hooks/useTranslate";
import { COLORS } from "@/constants/colors";
import { ProductSpecification } from "@/services/product/product.interface";

interface ProductDetailSpecsProps {
  specifications: {
    product_specifications_id: string;
    product_specifications_name: string;
    product_specifications_value_type: string;
    product_specifications_entered_value: string[];
  }[];
  isAvailable: boolean;
  origin: string;
}

const ProductDetailSpecs: React.FC<ProductDetailSpecsProps> = ({
  specifications,
  isAvailable,
  origin,
}) => {
  const { t } = useTranslate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        mt: 4,
        bgcolor: isDark ? "rgba(255, 255, 255, 0.04)" : "white",
        borderRadius: "16px",
        p: { xs: 2, sm: 3 },
        border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)"}`,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          mb: 3,
          color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
        }}
      >
        {t("specifications")}
      </Typography>

      <Grid container spacing={2}>
        {/* Availability Box */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Box
            sx={{
              p: 2,
              borderRadius: "12px",
              bgcolor: isDark ? "rgba(255, 255, 255, 0.02)" : "#F9FAFB",
              border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.04)" : "#F3F4F6"}`,
              height: "100%",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontWeight: 600,
                textTransform: "uppercase",
                display: "block",
                mb: 0.5,
              }}  
            >
              {t("availability")}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: isAvailable ? COLORS.PRIMARY_PURPLE : "#FF4444",
              }}
            >
              {isAvailable ? t("in_stock") : t("out_of_stock")}
            </Typography>
          </Box>
        </Grid>

        {/* Origin Box */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Box
            sx={{
              p: 2,
              borderRadius: "12px",
              bgcolor: isDark ? "rgba(255, 255, 255, 0.02)" : "#F9FAFB",
              border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.04)" : "#F3F4F6"}`,
              height: "100%",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontWeight: 600,
                textTransform: "uppercase",
                display: "block",
                mb: 0.5,
              }}
            >
              {t("product_origin")}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {origin || "N/A"}
            </Typography>
          </Box>
        </Grid>

        {specifications.map((spec, index) => (
          <Grid size={{ xs: 12, sm: 6 }} key={index}>
            <Box
              sx={{
                p: 2,
                borderRadius: "12px",
                bgcolor: isDark ? "rgba(255, 255, 255, 0.02)" : "#F9FAFB",
                border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.04)" : "#F3F4F6"}`,
                height: "100%",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  display: "block",
                  mb: 0.5,
                }}
              >
                {spec.product_specifications_name}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {spec.product_specifications_entered_value?.join(", ") || "N/A"}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductDetailSpecs;
