"use client";

import React from "react";
import { Box, Typography, Divider, useTheme, Chip } from "@mui/material";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";

interface ProductDetailInfoProps {
  price: number;
  currency: string;
  description: string;
  category: string;
  status: string;
  rejectedReason?: string;
}

const ProductDetailInfo: React.FC<ProductDetailInfoProps> = ({
  price,
  currency,
  description,
  category,
  status,
  rejectedReason,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { t } = useTranslate();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "#4CAF50";
      case "inactive":
        return "#FF9800";
      case "rejected":
        return "#F44336";
      default:
        return COLORS.PRIMARY_PURPLE;
    }
  };

  return (
    <Box
      sx={{
        bgcolor: isDark ? "rgba(255, 255, 255, 0.04)" : "white",
        borderRadius: "16px",
        p: { xs: 2, sm: 3 },
        border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)"}`,
      }}
    >
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Box>
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            {t("price")}
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: isDark ? COLORS.ACCENT_BLUE_DARK : COLORS.PRIMARY_PURPLE,
              mt: 0.5,
            }}
          >
            {currency === "INR" ? "₹" : "$"} {price}
          </Typography>
        </Box>
        <Chip
          label={status}
          sx={{
            bgcolor: `${getStatusColor(status)}20`,
            color: getStatusColor(status),
            fontWeight: 700,
            textTransform: "capitalize",
          }}
        />
      </Box>

      {status.toLowerCase() === "rejected" && rejectedReason && (
        <Box
          sx={{
            mb: 3,
            p: 2,
            borderRadius: "12px",
            bgcolor: "#fff1f0",
            border: "1px solid #ffa39e",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: "#cf1322",
              fontWeight: 700,
              textTransform: "uppercase",
              display: "block",
              mb: 0.5,
            }}
          >
            {t("rejection_reason")}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#cf1322",
              lineHeight: 1.5,
            }}
          >
            {rejectedReason}
          </Typography>
        </Box>
      )}

      <Divider sx={{ mb: 3, opacity: 0.6 }} />

      <Box sx={{ mb: 3 }}>
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            fontWeight: 600,
            textTransform: "uppercase",
          }}
        >
          {t("category")}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5 }}>
          {category}
        </Typography>
      </Box>

      <Box>
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            fontWeight: 600,
            textTransform: "uppercase",
          }}
        >
          {t("description")}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            mt: 1,
            lineHeight: 1.6,
            whiteSpace: "pre-line",
          }}
        >
          {description || "No description provided."}
        </Typography>
      </Box>
    </Box>
  );
};

export default ProductDetailInfo;
