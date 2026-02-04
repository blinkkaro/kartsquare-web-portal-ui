import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Button,
  useTheme,
  Chip,
  Dialog,
  IconButton,
} from "@mui/material";
import {
  Description,
  Download,
  Close,
  ArrowBackIosNew,
  ArrowForwardIos,
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
}

const CustomerServicePricing: React.FC<CustomerServicePricingProps> = ({
  pricingType,
  priceCatalogUrls,
  priceItems,
  currency = "INR",
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { t } = useTranslate();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const headerText = () => (
    <Typography
      variant="subtitle1"
      fontWeight={700}
      sx={{
        mb: 2,
        color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
      }}
    >
      {t("priceCatalog")}
    </Typography>
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
        {headerText()}

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
              alt={`Catalog ${index + 1}`}
              onClick={() => {
                setLightboxOpen(true);
                setSelectedImageIndex(index);
              }}
              sx={{
                width: "10rem",
                height: "10rem",
                borderRadius: 2,
                border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)"}`,
                objectFit: "cover",
                cursor: "pointer",
                "&:hover": {
                  opacity: 0.8,
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
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {headerText()}
          {priceItems.map((item, index) => (
            <Paper
              key={index}
              variant="outlined"
              sx={{
                p: 2,
                bgcolor: isDark
                  ? "transparent"
                  : COLORS.BACKGROUND.SECONDARY_LIGHT,
                borderColor: isDark
                  ? "rgba(255, 255, 255, 0.12)"
                  : "rgba(0, 0, 0, 0.08)",
                borderRadius: 2,
              }}
            >
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  sx={{
                    color: isDark
                      ? COLORS.TEXT.PRIMARY_DARK
                      : COLORS.TEXT.PRIMARY_LIGHT,
                  }}
                >
                  {item.service_name}
                </Typography>
                <Typography
                  variant="subtitle2"
                  fontWeight={700}
                  sx={{ color: COLORS.PRIMARY_PURPLE }}
                >
                  {currency} {item.price}
                </Typography>
              </Box>
              {item.service_desc && (
                <Typography
                  variant="body2"
                  sx={{
                    color: isDark
                      ? COLORS.TEXT.SECONDARY_DARK
                      : COLORS.TEXT.SECONDARY_LIGHT,
                    fontSize: "0.875rem",
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
