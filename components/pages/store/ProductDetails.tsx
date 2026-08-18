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
import { useTranslationContext } from "../../../features/i18n/TranslationContext";
import InquiryModal from "./InquiryModal";
import ProductDetailsBreadcrumb from "./ProductDetailsBreadcrumb";
import ProductDetailsHeader from "./ProductDetailsHeader";
import ProductDetailsInfo from "./ProductDetailsInfo";
import ProductDetailsActions from "./ProductDetailsActions";
import ProductDetailsSpecs from "./ProductDetailsSpecs";
import ServiceImageCarousel from "../../ServiceImageCarousel";
import ProviderInfoCard from "../../ProviderInfoCard";
import DescriptionDrawer from "../provider/serviceDetails/DescriptionDialog";
import ProductMap from "./ProductMap";
import ProductCard from "./ProductCard";
import { AppUserType } from "@/services/auth/auth.interface";
import { Product } from "@/hooks/useSearchSuggestions";

interface ProductDetailsProps {
  product: Product | null;
  onBack: () => void;
  similarProducts?: Product[];
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  onBack,
  similarProducts = [],
}) => {
  const { t } = useTranslationContext();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [descriptionDrawerOpen, setDescriptionDrawerOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(product);
  const [animatingContact, setAnimatingContact] = useState<string | null>(null);
  const router = useRouter();

  if (!product) return null;

  const handleProductClick = (productId: string) => {
    router.push(`/store/product/${productId}`);
  };

  const handleInquiry = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setAnimatingContact(product.id);
    setTimeout(() => {
      setActiveProduct(product);
      setInquiryOpen(true);
      setAnimatingContact(null);
    }, 600);
  };

  const handleWhatsApp = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setAnimatingContact(`whatsapp-${product.id}`);
    setTimeout(() => {
      const cleanPhone =
        `${product.whatsapp_country_code || "91"}${product.whatsapp_number || ""}`.replace(
          /\D/g,
          "",
        );
      const message = `Hi, I found your listing for ${product.name} on kartsquare. I am interested to know more.`;
      const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");
      setAnimatingContact(null);
    }, 600);
  };

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
          {/* Left Column - Image Carousel & Map */}
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

            {/* Map View */}
            <Box sx={{ mt: 7 }}>
              <ProductMap
                latitude={product.supplier.latitude || 26.9124}
                longitude={product.supplier.longitude || 75.7873}
                storeName={product.supplier.name}
              />
            </Box>
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
                    {t("yearEstablishedLabel")}
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
                    {t("business_type").toUpperCase()}
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
                    {t("responseRateLabel")}
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
                    {t("locationLabel")}
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
                onGetQuote={(e) => handleInquiry(product, e)}
                onWhatsApp={(e) => handleWhatsApp(product, e)}
                isAnimatingInquiry={animatingContact === product.id}
                isAnimatingWhatsApp={
                  animatingContact === `whatsapp-${product.id}`
                }
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
                username={product.supplier.username || ""}
                role={AppUserType.SUPPLIER}
              />
            </Box>
          </Box>

          {/* Right Column - Icons */}
          {/* <Box
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
          </Box> */}
        </Box>

        {/* Similar Products Section */}
        {similarProducts.length > 0 && (
          <Box sx={{ mt: 10, mb: 4 }}>
            <Box
              sx={{ display: "flex", alignItems: "baseline", mb: 4, gap: 2 }}
            >
              <Typography
                variant="h4"
                fontWeight={900}
                sx={{
                  color: isDark ? "text.primary" : "#1a1a2e",
                  letterSpacing: "-0.5px",
                  textTransform: "uppercase",
                }}
              >
                {t("similar")}{" "}
                <span style={{ color: COLORS.PRIMARY_PURPLE }}>
                  {t("products")}
                </span>
              </Typography>
              <Box
                sx={{
                  bgcolor: COLORS.PRIMARY_PURPLE,
                  color: "white",
                  px: 1.5,
                  py: 0.5,
                  borderRadius: "20px",
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  letterSpacing: "1px",
                  display: { xs: "none", sm: "block" },
                }}
              >
                {t("newArrivals")}
              </Box>
            </Box>

            <Typography
              variant="subtitle1"
              sx={{
                mb: 4,
                mt: -3,
                color: "text.secondary",
                fontWeight: 500,
                maxWidth: "600px",
              }}
            >
              {t("similarProductsDescription")}
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, 1fr)",
                  sm: "repeat(3, 1fr)",
                  md: "repeat(4, 1fr)",
                  lg: "repeat(5, 1fr)",
                },
                gap: { xs: 2, md: 3 },
              }}
            >
              {similarProducts.map((simProduct, index) => (
                <ProductCard
                  key={simProduct.id}
                  product={simProduct}
                  index={index}
                />
              ))}
            </Box>
          </Box>
        )}
      </Container>

      {activeProduct && (
        <InquiryModal
          open={inquiryOpen}
          onClose={() => setInquiryOpen(false)}
          productName={activeProduct.name}
          supplierName={activeProduct.supplier.name}
          productImage={activeProduct.image}
          productPrice={activeProduct.price}
          supplierId={activeProduct?.supplier_id}
          productId={activeProduct.id}
        />
      )}
      <DescriptionDrawer
        open={descriptionDrawerOpen}
        onClose={() => setDescriptionDrawerOpen(false)}
        description={product.description || ""}
      />
    </Box>
  );
};

export default ProductDetails;
