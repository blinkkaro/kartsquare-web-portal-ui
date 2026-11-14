import React from "react";
import {
  Box,
  Typography,
  Paper,
  useTheme,
  Button,
} from "@mui/material";
import {
  RequestQuote,
} from "@mui/icons-material";
import { stripMarkdown } from "@/utils/plainText";
import {
  PricingType,
  type ServicePriceItem,
} from "@/services/serviceList/listInteraface";
import { useTranslate } from "@/hooks/useTranslate";
import { COLORS } from "../../constants/colors";
import ServiceCatalogFiles from "./ServiceCatalogFiles";

interface CustomerServicePricingProps {
  pricingType: PricingType;
  priceCatalogUrls?: string[];
  priceItems?: ServicePriceItem[];
  currency?: string;
  onGetQuote?: () => void;
  hideHeader?: boolean;
}

const CustomerServicePricing: React.FC<CustomerServicePricingProps> = ({
  pricingType,
  priceCatalogUrls,
  priceItems,
  currency = "INR",
  onGetQuote,
  hideHeader = false,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { t } = useTranslate();

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
      <Box sx={{ mt: hideHeader ? 0 : 3 }}>
        {!hideHeader && renderSectionHeader("price_catalog_subtitle")}

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
        <ServiceCatalogFiles urls={priceCatalogUrls} />
      </Box>
    );
  }

  if (
    pricingType === PricingType.MULTIPLE &&
    priceItems &&
    priceItems.length > 0
  ) {
    const currencySymbol = currency === "INR" ? "₹" : `${currency} `;

    return (
      <Box sx={{ mt: hideHeader ? 0 : 3 }}>
        {!hideHeader && renderSectionHeader("price_catalog_list_subtitle")}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
          {priceItems.map((item, index) => (
            <Box
              key={index}
              sx={{
                p: 2,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 2,
                bgcolor: isDark ? "rgba(255,255,255,0.03)" : "white",
                border: `1px solid ${borderColor}`,
                borderRadius: "14px",
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: isDark
                    ? "0 4px 16px rgba(0,0,0,0.25)"
                    : `0 4px 16px ${COLORS.PURPLE_ALPHA_10}`,
                  borderColor: isDark ? "rgba(255,255,255,0.16)" : COLORS.PURPLE_ALPHA_20,
                },
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  fontWeight={700}
                  sx={{ color: textPrimary, fontSize: "0.95rem", mb: item.service_desc ? 0.4 : 0 }}
                >
                  {item.service_name}
                </Typography>
                {item.service_desc && (
                  <Typography
                    sx={{
                      color: textSecondary,
                      fontSize: "0.82rem",
                      lineHeight: 1.45,
                    }}
                  >
                    {stripMarkdown(item.service_desc)}
                  </Typography>
                )}
              </Box>
              <Box
                sx={{
                  flexShrink: 0,
                  bgcolor: isDark ? "rgba(130, 72, 247, 0.14)" : COLORS.PURPLE_ALPHA_10,
                  color: isDark ? COLORS.ACCENT_BLUE_DARK : COLORS.PRIMARY_PURPLE,
                  borderRadius: "10px",
                  px: 1.4,
                  py: 0.6,
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  whiteSpace: "nowrap",
                }}
              >
                {currencySymbol}
                {item.price}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  return null;
};

export default CustomerServicePricing;
