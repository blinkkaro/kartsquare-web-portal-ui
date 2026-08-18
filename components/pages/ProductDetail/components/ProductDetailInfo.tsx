"use client";

import React, { useState } from "react";
import { Box, Typography, Divider, useTheme, Chip, Button } from "@mui/material";
import { Verified } from "@mui/icons-material";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";

interface ProductDetailInfoProps {
  productName: string;
  price: number;
  currency: string;
  description: string;
  category: string;
  status: string;
  rejectedReason?: string;
  gstNumber?: string;
}

const ProductDetailInfo: React.FC<ProductDetailInfoProps> = ({
  productName,
  price,
  currency,
  description,
  category,
  status,
  rejectedReason,
  gstNumber,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { t } = useTranslate();
  const [isExpanded, setIsExpanded] = useState(false);

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

  const showContinueReading = description && description.length > 50;

  return (
    <Box
      sx={{
        bgcolor: isDark ? "rgba(255, 255, 255, 0.04)" : "white",
        borderRadius: "16px",
        p: { xs: 1.5, sm: 2.5, md: 3 },
        border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)"}`,
      }}
    >
      <Box sx={{ py: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1, gap: 2, flexWrap: "wrap" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: isDark ? COLORS.ACCENT_BLUE_DARK : COLORS.PRIMARY_PURPLE,
              }}
            >
              {currency === "INR" ? "₹" : "$"} {price}
            </Typography>
            <Chip
              label={category}
              size="small"
              sx={{
                bgcolor: isDark
                  ? "rgba(255, 255, 255, 0.08)"
                  : "rgba(255, 255, 255, 0.9)",
                color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                fontWeight: 600,
                border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)"}`,
              }}
            />
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
      </Box>

      {status.toLowerCase() === "rejected" && rejectedReason && (
        <Box
          sx={{
            mb: 2,
            p: 2,
            borderRadius: "12px",
            bgcolor: "#fff1f0",
            border: "1px solid #ffa39e",
            mt: 2,
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
          <Typography variant="body2" sx={{ color: "#cf1322", lineHeight: 1.5 }}>
            {rejectedReason}
          </Typography>
        </Box>
      )}

      <Divider sx={{ opacity: 0.6, my: 2 }} />

      <Box sx={{ py: 1 }}>
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              mb: 1.5,
              color: isDark ? COLORS.ACCENT_BLUE_DARK : COLORS.PRIMARY_PURPLE,
              lineHeight: 1.2,
            }}
          >
            {productName}
          </Typography>

          {/* Badges */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                color: "#1D4ED8",
                fontWeight: 800,
                cursor: "default",
              }}
            >
              <Verified sx={{ fontSize: "16px" }} />
              <Typography
                sx={{
                  fontWeight: 900,
                  fontSize: "0.75rem",
                  fontStyle: "italic",
                  textTransform: "uppercase",
                  letterSpacing: "0.02em",
                }}
              >
                Verified Product
              </Typography>
            </Box>

            {gstNumber && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  color: "#059669",
                  fontWeight: 800,
                  cursor: "default",
                }}
              >
                <Verified sx={{ fontSize: "16px" }} />
                <Typography
                  sx={{
                    fontWeight: 900,
                    fontSize: "0.75rem",
                    fontStyle: "italic",
                    textTransform: "uppercase",
                    letterSpacing: "0.02em",
                  }}
                >
                  GST Registered
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        <Typography
          variant="body1"
          sx={{
            mb: 1,
            lineHeight: 1.6,
            color: isDark
              ? COLORS.TEXT.SECONDARY_DARK
              : COLORS.TEXT.SECONDARY_LIGHT,
            display: isExpanded ? "block" : "-webkit-box",
            WebkitLineClamp: isExpanded ? "unset" : 10,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "pre-line",
          }}
        >
          {description || "No description available"}
        </Typography>

        {showContinueReading && !isExpanded && (
          <Button
            onClick={() => setIsExpanded(true)}
            sx={{
              textTransform: "none",
              color: isDark ? COLORS.ACCENT_BLUE_DARK : COLORS.PRIMARY_PURPLE,
              p: 0,
              mb: 3,
              "&:hover": {
                bgcolor: "transparent",
                textDecoration: "underline",
              },
            }}
          >
            Continue Reading
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default ProductDetailInfo;
