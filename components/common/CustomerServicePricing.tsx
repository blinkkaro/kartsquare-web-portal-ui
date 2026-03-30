import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  useTheme,
  Dialog,
  IconButton,
  Button,
} from "@mui/material";
import {
  Description,
  Close,
  ArrowBackIosNew,
  ArrowForwardIos,
  RequestQuote,
} from "@mui/icons-material";
import { COLORS } from "../../constants/colors";
import {
  PricingType,
  ServicePriceItem,
} from "@/services/serviceList/listInteraface";
import { useTranslate } from "@/hooks/useTranslate";

interface CustomerServicePricingProps {
  pricingType: PricingType;
  priceCatalogUrls?: string[];
  priceItems?: ServicePriceItem[];
  currency?: string;
  onGetQuote?: () => void;
}

const CustomerServicePricing: React.FC<CustomerServicePricingProps> = ({
  pricingType,
  priceCatalogUrls,
  priceItems,
  currency = "INR",
  onGetQuote,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { t } = useTranslate();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const textPrimary = isDark
    ? COLORS.TEXT.PRIMARY_DARK
    : COLORS.TEXT.PRIMARY_LIGHT;
  const textSecondary = isDark
    ? COLORS.TEXT.SECONDARY_DARK
    : COLORS.TEXT.SECONDARY_LIGHT;
  const borderColor = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)";

  const renderSectionHeader = (
    subtitleKey: "price_catalog_subtitle" | "price_catalog_list_subtitle",
  ) => (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 2,
        border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT}`,
        bgcolor: isDark ? COLORS.PURPLE_ALPHA_10 : COLORS.PURPLE_ALPHA_04,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2,
            bgcolor: isDark ? COLORS.ACCENT_BLUE_DARK : COLORS.PRIMARY_PURPLE,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <RequestQuote sx={{ color: COLORS.WHITE, fontSize: 24 }} />
        </Box>
        <Box>
          <Typography
            variant="subtitle1"
            fontWeight={700}
            sx={{ color: textPrimary, mb: 0.5, fontSize: "1.05rem" }}
          >
            {t("priceCatalog")}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: textSecondary, fontSize: "0.875rem", lineHeight: 1.4 }}
          >
            {t(subtitleKey)}
          </Typography>
        </Box>
        {onGetQuote && (
          <Box sx={{ ml: "auto", alignSelf: "center" }}>
            <Button
              onClick={onGetQuote}
              sx={{
                bgcolor: isDark ? COLORS.PRIMARY_PURPLE : COLORS.WHITE,
                color: isDark ? COLORS.WHITE : COLORS.PRIMARY_PURPLE,
                fontWeight: 700,
                fontSize: "0.75rem",
                textTransform: "none",
                px: 2,
                py: 0.75,
                borderRadius: 1.5,
                border: `1px solid ${isDark ? "transparent" : COLORS.PRIMARY_PURPLE}`,
                "&:hover": {
                  bgcolor: isDark ? COLORS.PURPLE_HOVER : COLORS.PURPLE_ALPHA_10,
                },
              }}
            >
              {t("getQuote") || "Get Quote"}
            </Button>
          </Box>
        )}
      </Box>
    </Paper>
  );

  if (pricingType === PricingType.SINGLE) {
    return null;
  }

  if (
    pricingType === PricingType.CATALOG &&
    priceCatalogUrls &&
    priceCatalogUrls.length > 0
  ) {
    return (
      <Box sx={{ mt: 3 }}>
        {renderSectionHeader("price_catalog_subtitle")}

        <Typography
          variant="caption"
          sx={{
            display: "block",
            mb: 1.5,
            color: textSecondary,
            fontWeight: 500,
          }}
        >
          {t("tap_to_view_full")}
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          {priceCatalogUrls.map((url, index) => (
            <Box
              key={index}
              component="img"
              src={url}
              alt={t("priceCatalog") + ` ${index + 1}`}
              onClick={() => {
                setLightboxOpen(true);
                setSelectedImageIndex(index);
              }}
              sx={{
                width: "10rem",
                height: "10rem",
                borderRadius: 2,
                border: `2px solid ${borderColor}`,
                objectFit: "cover",
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                  opacity: 0.9,
                  borderColor: COLORS.PRIMARY_PURPLE,
                  boxShadow: `0 4px 12px ${COLORS.PURPLE_ALPHA_20}`,
                },
              }}
            />
          ))}
        </Box>
        <Dialog
          open={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: "transparent",
              boxShadow: "none",
              overflow: "hidden",
              width: "100%",
              height: "100%",
              maxWidth: "none",
              margin: 0,
            },
          }}
        >
          <Box
            sx={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
            }}
          >
            <Box
              component="img"
              src={priceCatalogUrls[selectedImageIndex]}
              alt={`Catalog Full ${selectedImageIndex + 1}`}
              sx={{
                maxHeight: "90vh",
                maxWidth: "90vw",
                objectFit: "contain",
                borderRadius: 2,
              }}
            />
            {priceCatalogUrls.length > 1 && (
              <>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex((prev) =>
                      prev > 0 ? prev - 1 : priceCatalogUrls.length - 1,
                    );
                  }}
                  sx={{
                    position: "absolute",
                    left: { xs: 10, md: 40 },
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "white",
                    bgcolor: "rgba(255,255,255,0.1)",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                    zIndex: 10,
                    width: 48,
                    height: 48,
                  }}
                >
                  <ArrowBackIosNew />
                </IconButton>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex((prev) =>
                      prev < priceCatalogUrls.length - 1 ? prev + 1 : 0,
                    );
                  }}
                  sx={{
                    position: "absolute",
                    right: { xs: 10, md: 40 },
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "white",
                    bgcolor: "rgba(255,255,255,0.1)",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                    zIndex: 10,
                    width: 48,
                    height: 48,
                  }}
                >
                  <ArrowForwardIos />
                </IconButton>
              </>
            )}
            <IconButton
              onClick={() => setLightboxOpen(false)}
              sx={{
                position: "absolute",
                top: 20,
                right: 20,
                color: "white",
                bgcolor: "rgba(255,255,255,0.1)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                zIndex: 10,
              }}
            >
              <Close />
            </IconButton>
          </Box>
        </Dialog>
      </Box>
    );
  }

  if (
    pricingType === PricingType.MULTIPLE &&
    priceItems &&
    priceItems.length > 0
  ) {
    return (
      <Box sx={{ mt: 3 }}>
        {renderSectionHeader("price_catalog_list_subtitle")}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {priceItems.map((item, index) => (
            <Paper
              key={index}
              variant="outlined"
              sx={{
                p: 2,
                bgcolor: isDark
                  ? "transparent"
                  : COLORS.BACKGROUND.SECONDARY_LIGHT,
                borderLeft: `4px solid ${COLORS.PRIMARY_PURPLE}`,
                borderColor: borderColor,
                borderRadius: 2,
                transition: "box-shadow 0.2s ease",
                "&:hover": {
                  boxShadow: isDark
                    ? "0 2px 12px rgba(0,0,0,0.2)"
                    : `0 2px 12px ${COLORS.PURPLE_ALPHA_10}`,
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: item.service_desc ? 1 : 0,
                  gap: 1,
                }}
              >
                <Typography
                  variant="subtitle2"
                  fontWeight={700}
                  sx={{ color: textPrimary, fontSize: "0.95rem" }}
                >
                  {item.service_name}
                </Typography>
                <Typography
                  variant="subtitle2"
                  fontWeight={700}
                  sx={{
                    color: COLORS.PRIMARY_PURPLE,
                    fontSize: "0.95rem",
                    flexShrink: 0,
                  }}
                >
                  {currency} {item.price}
                </Typography>
              </Box>
              {item.service_desc && (
                <Typography
                  variant="body2"
                  sx={{
                    color: textSecondary,
                    fontSize: "0.875rem",
                    lineHeight: 1.45,
                  }}
                >
                  {item.service_desc}
                </Typography>
              )}
            </Paper>
          ))}
        </Box>
      </Box>
    );
  }

  return null;
};

export default CustomerServicePricing;
