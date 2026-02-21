"use client";
import React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Avatar,
  IconButton,
  useTheme,
  Chip,
} from "@mui/material";
import { motion } from "framer-motion";
import { OpenInFull, Star, Verified, HomeRepairService } from "@mui/icons-material";
import { calculateDistance } from "@/helper/helper";
import { useAutoGeolocation } from "@/hooks/useGeolocation";
import { LocationOn } from "@mui/icons-material";
import { COLORS } from "@/constants/colors";
import { useRouter } from "next/navigation";
import { useTranslate } from "@/hooks/useTranslate";
import { Service } from "@/services/serviceList/listInteraface";

interface ServiceProviderCardProps {
  service: Service;
  size?: "small" | "large";
  onExpandClick?: () => void;
  showExpandIcon?: boolean;
  selected?: boolean;
  onCardClick?: (service: Service) => void;
}

const MotionCard = motion(Card);

const ServiceProviderCard: React.FC<ServiceProviderCardProps> = ({
  service,
  size = "large",
  onExpandClick,
  showExpandIcon = true,
  selected = false,
  onCardClick,
}) => {
  const theme = useTheme();
  const router = useRouter();
  const isSmall = size === "small";
  const { t } = useTranslate();
  const { coordinates } = useAutoGeolocation();

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(service);
    } else {
      router.push(`/profile/${service.provider_id}`);
    }
  };

  const handleExpandIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onExpandClick) {
      onExpandClick();
    } else {
      router.push("/map");
    }
  };

  const getDistance = () => {
    if (
      coordinates?.latitude &&
      coordinates?.longitude &&
      service?.service_address?.latitude &&
      service?.service_address?.longitude
    ) {
      const dist = calculateDistance(
        coordinates.latitude,
        coordinates.longitude,
        service?.service_address?.latitude,
        service?.service_address?.longitude,
      );
      return `${dist.toFixed(1)} km`;
    }
    return null;
  };

  const accentColor = COLORS.PRIMARY_PURPLE;

  return (
    <MotionCard
      onClick={handleCardClick}
      whileHover={{ y: -6, scale: 1.01 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      sx={{
        cursor: "pointer",
        borderRadius: "20px",
        backgroundColor:
          theme.palette.mode === "dark"
            ? COLORS.BACKGROUND.PAPER_DARK
            : COLORS.WHITE,
        boxShadow: selected
          ? `0 20px 40px -12px ${accentColor}30, 0 8px 16px -8px ${accentColor}20`
          : "0 10px 30px -10px rgba(0, 0, 0, 0.12), 0 4px 10px -5px rgba(0, 0, 0, 0.04)",
        border: selected ? `2px solid ${accentColor}` : "1px solid rgba(0,0,0,0.04)",
        transition: "box-shadow 0.3s ease, border-color 0.3s ease",
        "&:hover": {
          boxShadow: `0 20px 40px -12px ${accentColor}25, 0 8px 16px -8px ${accentColor}15`,
          borderColor: `${accentColor}40`,
        },
        width: isSmall ? "260px" : "100%",
        minWidth: isSmall ? "260px" : "auto",
        height: isSmall ? "125px" : "auto",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Box
        sx={{
          height: "4px",
          width: "100%",
          background: `linear-gradient(90deg, ${accentColor} 0%, ${accentColor}80 100%)`,
          opacity: 0.8,
        }}
      />

      <CardContent
        sx={{ p: isSmall ? 1.5 : 2.5, "&:last-child": { pb: isSmall ? 1.5 : 2.5 } }}
      >
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Box sx={{ position: "relative" }}>
            <Box
              sx={{
                padding: "2px",
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}40 100%)`,
                boxShadow: `0 4px 10px ${accentColor}25`,
              }}
            >
              <Avatar
                src={service.provider_image_url || undefined}
                alt={service.provider_name}
                sx={{
                  width: isSmall ? 48 : 72,
                  height: isSmall ? 48 : 72,
                  border: `2px solid ${theme.palette.mode === "dark" ? COLORS.BACKGROUND.PAPER_DARK : COLORS.WHITE}`,
                }}
              />
            </Box>
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 0.5,
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant={isSmall ? "subtitle2" : "h6"}
                  sx={{
                    fontWeight: 800,
                    lineHeight: 1.2,
                    color:
                      theme.palette.mode === "dark"
                        ? COLORS.TEXT.PRIMARY_DARK
                        : COLORS.TEXT.PRIMARY_LIGHT,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {service.service_name}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.25 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 600,
                      color: accentColor,
                      fontSize: "0.75rem",
                    }}
                  >
                    {service.provider_name}
                  </Typography>
                  <Verified sx={{ fontSize: 14, color: COLORS.PRIMARY_BLUE }} />
                </Box>
              </Box>

              {isSmall && showExpandIcon && (
                <IconButton
                  size="small"
                  onClick={handleExpandIconClick}
                  sx={{
                    ml: 1,
                    color: accentColor,
                    bgcolor: `${accentColor}10`,
                    "&:hover": {
                      backgroundColor: `${accentColor}20`,
                    },
                  }}
                >
                  <OpenInFull sx={{ fontSize: 16 }} />
                </IconButton>
              )}
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 1.5,
                mt: 1,
              }}
            >
              {service?.review_count && service?.review_count > 0 ? (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      bgcolor: "#FFB80015",
                      px: 0.75,
                      py: 0.25,
                      borderRadius: "6px",
                    }}
                  >
                    <Star sx={{ fontSize: 14, color: "#FFB800", mr: 0.25 }} />
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: 700, color: "#B88600" }}
                    >
                      {service.avg_service_rating}
                    </Typography>
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: COLORS.TEXT.SECONDARY_LIGHT,
                      fontWeight: 500,
                    }}
                  >
                    ({service.review_count} {t("reviews")})
                  </Typography>
                </>
              ) : (
                <Chip
                  label={t("newServiceProvider")}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    bgcolor: "rgba(0,0,0,0.05)",
                    color: COLORS.TEXT.SECONDARY_LIGHT,
                    borderRadius: "6px",
                  }}
                />
              )}
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 800, color: COLORS.TEXT.PRIMARY_LIGHT }}
                >
                  {service.currency} {service.price}
                </Typography>
                <Typography variant="caption" sx={{ color: COLORS.TEXT.SECONDARY_LIGHT }}>
                  / hr
                </Typography>
              </Box>

              {getDistance() && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    bgcolor: "rgba(0,0,0,0.03)",
                    px: 1,
                    py: 0.25,
                    borderRadius: "20px",
                  }}
                >
                  <LocationOn sx={{ fontSize: 14, color: COLORS.TEXT.SECONDARY_LIGHT }} />
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 600,
                      color: COLORS.TEXT.SECONDARY_LIGHT,
                      fontSize: "0.7rem",
                    }}
                  >
                    {getDistance()}
                  </Typography>
                </Box>
              )}
            </Box>

            {!isSmall && (
              <Box sx={{ mt: 1.5, pt: 1.5, borderTop: "1px dashed rgba(0,0,0,0.08)" }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: COLORS.TEXT.SECONDARY_LIGHT,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    fontWeight: 500,
                  }}
                >
                  <HomeRepairService sx={{ fontSize: 14, opacity: 0.6 }} />
                  {service.category_name}
                  {service.sub_category_name && (
                    <Box component="span" sx={{ opacity: 0.4 }}> • </Box>
                  )}
                  {service.sub_category_name}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </CardContent>
    </MotionCard>
  );
};

export default ServiceProviderCard;
