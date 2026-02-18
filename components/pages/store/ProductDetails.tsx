"use client";

import React, { useState, useEffect } from "react";

import {
  Box,
  Container,
  Typography,
  Divider,
  IconButton,
  useTheme,
} from "@mui/material";

import { Bookmark, Share } from "@mui/icons-material";

import { useRouter } from "next/navigation";

import { COLORS } from "../../../constants/colors";

import InquiryModal from "./InquiryModal";

import { Product } from "./index";

import ProductStoreLocationMap from "./ProductStoreLocationMap";

import ProductDetailsBreadcrumb from "./ProductDetailsBreadcrumb";

import ProductDetailsHeader from "./ProductDetailsHeader";

import ProductDetailsInfo from "./ProductDetailsInfo";

import ProductDetailsActions from "./ProductDetailsActions";

import ProductDetailsSpecs from "./ProductDetailsSpecs";

import ServiceImageCarousel from "../../ServiceImageCarousel";

import ProviderInfoCard from "../../ProviderInfoCard";

import DescriptionDrawer from "../provider/serviceDetails/DescriptionDialog";

interface ProductDetailsProps {
  product: Product | null;

  onBack: () => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, onBack }) => {
  const theme = useTheme();

  const isDark = theme.palette.mode === "dark";

  const [inquiryOpen, setInquiryOpen] = useState(false);

  const [descriptionDrawerOpen, setDescriptionDrawerOpen] = useState(false);

  if (!product) return null;

  return (
    <Box
      sx={{
        bgcolor: isDark
          ? COLORS.BACKGROUND.PRIMARY_DARK
          : COLORS.BACKGROUND.SECONDARY_LIGHT,

        minHeight: "100vh",

        pt: { xs: 2, sm: 4, md: 4 },

        pb: { xs: 8, sm: 8, md: 4 },

        px: { xs: 0.5, sm: 1, md: 2 },

        width: "100%",
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
        <ProductDetailsBreadcrumb productName={product.name} />

        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",

              md: "1fr 1fr",

              lg: "1fr 1fr auto",
            },

            gap: { xs: 2, sm: 3, md: 4 },

            alignItems: "start",
          }}
        >
          {/* Left Column - Image Carousel */}

          <Box
            sx={{
              position: { xs: "static", md: "sticky" },

              top: { md: 80 },

              order: { xs: 1, md: 1 },

              width: "100%",
            }}
          >
            <ServiceImageCarousel
              images={product.images}
              serviceName={product.name}
            />

            {/* Store Location Map */}

            <ProductStoreLocationMap
              location={product.supplier.location}
              storeName={product.supplier.name}
              storeAddress={product.supplier.address}
              storePhone={product.supplier.mobile}
              storeLogo={product.supplier.logo}
            />
          </Box>

          {/* Middle Column - Details */}

          <Box
            sx={{
              order: { xs: 2, md: 2 },

              bgcolor: isDark ? "rgba(255, 255, 255, 0.04)" : "white",

              borderRadius: "16px",

              p: { xs: 1.5, sm: 2.5, md: 3 },

              border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)"}`,

              width: "100%",
            }}
          >
            <Box sx={{ py: 2 }}>
              <ProductDetailsHeader
                price={product.price}
                category={product.category}
                gst={product.gst}
              />
            </Box>

            <Divider sx={{ opacity: 0.6 }} />

            <Box sx={{ py: 2 }}>
              <ProductDetailsInfo
                productName={product.name}
                description={product.description}
                onContinueReading={() => setDescriptionDrawerOpen(true)}
                showContinueReading={
                  !!(product.description && product.description.length > 50)
                }
                gstNumber={product.supplier.gstNumber}
              />

              {/* Supplier Highlights Grid - IndiaMart Style */}

              <Box sx={{ mt: 3, display: "flex", flexWrap: "wrap", gap: 2 }}>
                <Box
                  sx={{
                    flex: "1 1 45%",
                    bgcolor: isDark ? "rgba(255,255,255,0.03)" : "#f8f9fa",
                    p: 1.5,
                    borderRadius: 2,
                    border: "1px solid rgba(0,0,0,0.03)",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 600,
                      display: "block",
                    }}
                  >
                    YEAR ESTABLISHED
                  </Typography>

                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {product.supplier.yearEstablished}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    flex: "1 1 45%",
                    bgcolor: isDark ? "rgba(255,255,255,0.03)" : "#f8f9fa",
                    p: 1.5,
                    borderRadius: 2,
                    border: "1px solid rgba(0,0,0,0.03)",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 600,
                      display: "block",
                    }}
                  >
                    BUSINESS TYPE
                  </Typography>

                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {product.supplier.businessType}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    flex: "1 1 45%",
                    bgcolor: isDark ? "rgba(255,255,255,0.03)" : "#f8f9fa",
                    p: 1.5,
                    borderRadius: 2,
                    border: "1px solid rgba(0,0,0,0.03)",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 600,
                      display: "block",
                    }}
                  >
                    RESPONSE RATE
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 700, color: COLORS.PRIMARY_PURPLE }}
                  >
                    {product.supplier.responseRate}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    flex: "1 1 45%",
                    bgcolor: isDark ? "rgba(255,255,255,0.03)" : "#f8f9fa",
                    p: 1.5,
                    borderRadius: 2,
                    border: "1px solid rgba(0,0,0,0.03)",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 600,
                      display: "block",
                    }}
                  >
                    LOCATION
                  </Typography>

                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {product.supplier.location}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ opacity: 0.6 }} />

            <Box sx={{ py: 2 }}>
              <ProductDetailsActions
                onGetQuote={() => setInquiryOpen(true)}
                onTalkToUs={() => {
                  /* TODO: Implement Talk to Us */
                }}
                supplierPhone={product.supplier.mobile}
              />
            </Box>

            <Divider sx={{ opacity: 0.6 }} />

            <Box sx={{ py: 2 }}>
              <ProductDetailsSpecs specs={product.specs} />
            </Box>

            <Divider sx={{ opacity: 0.6 }} />

            <Box sx={{ py: 3 }}>
              <ProviderInfoCard
                providerId={product.categoryId}
                providerName={product.supplier.name}
                providerImageUrl={product.supplier.logo}
                isHotSeller={true}
                providerPhoneNumber={product.supplier.mobile}
                businessName={product.supplier.name}
                isFollowing={false}
                gstNumber={product.supplier.gstNumber}
              />
            </Box>
          </Box>

          {/* Right Column - Icons */}

          <Box
            sx={{
              display: "flex",

              flexDirection: { xs: "row", lg: "column" },

              gap: { xs: 1, sm: 2 },

              justifyContent: { xs: "flex-start", lg: "flex-start" },

              order: { xs: 3, md: 3 },

              pt: { xs: 0, lg: 1 },

              mb: { xs: 2, lg: 0 },

              width: { xs: "100%", lg: "auto" },
            }}
          >
            <IconButton
              sx={{
                bgcolor: isDark
                  ? "rgba(255, 255, 255, 0.08)"
                  : "rgba(255, 255, 255, 0.9)",

                border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)"}`,

                color: isDark
                  ? COLORS.TEXT.PRIMARY_DARK
                  : COLORS.TEXT.PRIMARY_LIGHT,

                "&:hover": {
                  bgcolor: isDark
                    ? "rgba(255, 255, 255, 0.12)"
                    : "rgba(255, 255, 255, 1)",
                },

                width: { xs: 40, sm: 44 },

                height: { xs: 40, sm: 44 },
              }}
            >
              <Bookmark fontSize="small" />
            </IconButton>

            <IconButton
              sx={{
                bgcolor: isDark
                  ? "rgba(255, 255, 255, 0.08)"
                  : "rgba(255, 255, 255, 0.9)",

                border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)"}`,

                color: isDark
                  ? COLORS.TEXT.PRIMARY_DARK
                  : COLORS.TEXT.PRIMARY_LIGHT,

                "&:hover": {
                  bgcolor: isDark
                    ? "rgba(255, 255, 255, 0.12)"
                    : "rgba(255, 255, 255, 1)",
                },

                width: { xs: 40, sm: 44 },

                height: { xs: 40, sm: 44 },
              }}
            >
              <Share fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Container>

      <InquiryModal
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        productName={product.name}
        supplierName={product.supplier.name}
        productImage={product.image}
        productPrice={product.price}
      />

      <DescriptionDrawer
        open={descriptionDrawerOpen}
        onClose={() => setDescriptionDrawerOpen(false)}
        description={product.description || ""}
      />
    </Box>
  );
};

export default ProductDetails;
