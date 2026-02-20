"use client";
import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Avatar,
  Stack,
  useTheme,
  Zoom,
} from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  Verified,
  LocationOn,
  Business,
  WhatsApp,
} from "@mui/icons-material";
import { COLORS } from "@/constants/colors";
import CommonButton from "@/components/common/Button";
import { Product } from "./index";

interface ProductCardProps {
  product: Product;
  isFavorite?: boolean;
  onToggleFavorite?: (productId: string, e: React.MouseEvent) => void;
  onProductClick: (productId: string) => void;
  onInquiry: (product: Product, e: React.MouseEvent) => void;
  onWhatsApp: (product: Product, e: React.MouseEvent) => void;
  index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isFavorite = false,
  onToggleFavorite,
  onProductClick,
  onInquiry,
  onWhatsApp,
  index = 0,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [hovered, setHovered] = useState(false);

  const getSupplierYears = (yearEstablished: number) => {
    return new Date().getFullYear() - yearEstablished;
  };

  return (
    <Zoom in={true} style={{ transitionDelay: `${index * 50}ms` }}>
      <Card
        elevation={0}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: "16px",
          border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT}`,
          bgcolor: isDark ? "rgba(255,255,255,0.02)" : "white",
          cursor: "pointer",
          position: "relative",
          overflow: "hidden",
          boxShadow: isDark
            ? "0 4px 20px rgba(0, 0, 0, 0.3)"
            : "0 4px 20px rgba(0,0,0,0.05)",
          transition: "box-shadow 0.2s, transform 0.2s",
          "&:hover": {
            boxShadow: isDark
              ? "0px 8px 30px rgba(94, 24, 233, 0.3)"
              : "0px 8px 25px rgba(94, 24, 233, 0.15)",
          },
        }}
        onClick={() => onProductClick(product.id)}
      >
        {/* Favorite Button */}
        {onToggleFavorite && (
          <IconButton
            onClick={(e) => onToggleFavorite(product.id, e)}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              zIndex: 3,
              bgcolor: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(4px)",
              width: 32,
              height: 32,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              "&:hover": {
                bgcolor: "white",
                transform: "scale(1.1)",
              },
            }}
            size="small"
          >
            {isFavorite ? (
              <Favorite sx={{ fontSize: 16, color: "#ff1744" }} />
            ) : (
              <FavoriteBorder sx={{ fontSize: 16, color: "#666" }} />
            )}
          </IconButton>
        )}

        {/* Image Container */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            paddingTop: "75%",
            bgcolor: isDark ? "rgba(255,255,255,0.01)" : "#f8f9fc",
            overflow: "hidden",
          }}
        >
          <Box
            component="img"
            src={product.image}
            alt={product.name}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

          {/* Top Left Badge: Verified */}
          <Box
            sx={{
              position: "absolute",
              top: 10,
              left: 10,
              bgcolor: "rgba(29, 78, 216, 0.95)",
              color: "white",
              padding: "3px 8px",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              backdropFilter: "blur(4px)",
              zIndex: 1,
              boxShadow: "0 2px 8px rgba(29, 78, 216, 0.2)",
            }}
          >
            <Verified sx={{ fontSize: 12 }} />
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                fontSize: "0.6rem",
                letterSpacing: "0.02em",
              }}
            >
              VERIFIED
            </Typography>
          </Box>
        </Box>

        {/* Product Info */}
        <CardContent
          sx={{
            p: 2,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          <Box>
            {/* Product Name */}
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 800,
                lineHeight: 1.2,
                // height: 28,
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                color: isDark ? "white" : "#1a1a2e",
                fontSize: "0.85rem",
              }}
            >
              {product.name}
            </Typography>

            {/* Supplier Attribution */}
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}
            >
              <Avatar
                src={product.supplier.logo}
                sx={{ width: 26, height: 26, borderRadius: "6px" }}
              >
                {product.supplier.name.charAt(0)}
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    lineHeight: 1,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      fontSize: "0.7rem",
                      fontWeight: 500,
                    }}
                  >
                    by
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: isDark ? "white" : COLORS.TEXT.PRIMARY_LIGHT,
                      fontWeight: 700,
                      fontSize: "0.7rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {product.supplier.name}
                  </Typography>
                  {product.supplier.trustSeal && (
                    <Verified sx={{ fontSize: 13, color: "#1D4ED8" }} />
                  )}
                </Box>
                {product.supplier.trustSeal && (
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      bgcolor: isDark
                        ? "rgba(29, 78, 216, 0.15)"
                        : "rgba(29, 78, 216, 0.08)",
                      color: "#1D4ED8",
                      px: 0.6,
                      py: 0.1,
                      borderRadius: "4px",
                      mt: 0.2,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: "0.55rem",
                        fontWeight: 900,
                        letterSpacing: "0.03em",
                        textTransform: "uppercase",
                      }}
                    >
                      Verified Supplier
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>

          {/* Price */}
          <Box
            sx={{ display: "flex", alignItems: "baseline", gap: 0.5, mt: 1 }}
          >
            <Typography
              variant="h6"
              color={COLORS.PRIMARY_PURPLE}
              fontWeight={800}
              sx={{ lineHeight: 1, fontSize: "1.1rem" }}
            >
              {product.price}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={600}
            >
              / {product.unit}
            </Typography>
          </Box>

          {/* Supplier Details (Location, Years) */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <LocationOn sx={{ fontSize: 12, color: "text.secondary" }} />
              <Typography
                variant="caption"
                sx={{ fontSize: "0.65rem", color: "text.secondary" }}
              >
                {product.supplier.location}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Business sx={{ fontSize: 12, color: "text.secondary" }} />
              <Typography
                variant="caption"
                sx={{ fontSize: "0.65rem", color: "text.secondary" }}
              >
                {getSupplierYears(product.supplier.yearEstablished)}+ Yrs
              </Typography>
            </Box>
          </Stack>

          {/* Primary CTA Buttons */}
          <Stack direction="row" spacing={1} sx={{ mt: "auto", pt: 1.5 }}>
            <CommonButton
              variant="contained"
              size="small"
              onClick={(e) => onInquiry(product, e)}
              fullWidth
              sx={{
                py: 0.8,
                fontSize: "0.75rem",
                fontWeight: 800,
                borderRadius: 2,
                textTransform: "none",
                boxShadow: "none",
                background: COLORS.PRIMARY_PURPLE,
                "&:hover": {
                  background: COLORS.PURPLE_HOVER,
                },
              }}
            >
              Get Best Quote
            </CommonButton>
            <IconButton
              onClick={(e) => onWhatsApp(product, e)}
              sx={{
                bgcolor: "#25D366",
                color: "white",
                borderRadius: 2,
                width: 36,
                height: 36,
                flexShrink: 0,
                "&:hover": {
                  bgcolor: "#1ebe57",
                },
              }}
            >
              <WhatsApp sx={{ fontSize: 18 }} />
            </IconButton>
          </Stack>
        </CardContent>
      </Card>
    </Zoom>
  );
};

export default ProductCard;
