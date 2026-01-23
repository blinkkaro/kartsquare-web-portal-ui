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
  Rating,
  Chip,
} from "@mui/material";
import { OpenInFull, Star, PersonAdd, PersonRemove } from "@mui/icons-material";
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
  onCardClick?: (service: Service) => void;
}

const ServiceProviderCard: React.FC<ServiceProviderCardProps> = ({
  service,
  size = "large",
  onExpandClick,
  showExpandIcon = true,
  onCardClick,
}) => {
  const theme = useTheme();
  const router = useRouter();
  const isSmall = size === "small";
  const { t } = useTranslate();
  const { coordinates } = useAutoGeolocation();

  const handleCardClick = () => {
    if (onCardClick) {
      // Use custom click handler if provided
      onCardClick(service);
    } else {
      // Default behavior: navigate to service provider profile
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

  const formatDistance = (radius: number) => {
    return `${radius}km`;
  };

  const getDistance = () => {
    if (
      coordinates?.latitude &&
      coordinates?.longitude &&
      service.service_provider_latitude &&
      service.service_provider_longitude
    ) {
      const dist = calculateDistance(
        coordinates.latitude,
        coordinates.longitude,
        service.service_provider_latitude,
        service.service_provider_longitude,
      );
      return `${dist.toFixed(1)} km`;
    }
    return null;
  };

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        cursor: "pointer",
        borderRadius: "12px",
        backgroundColor:
          theme.palette.mode === "dark"
            ? COLORS.BACKGROUND.PAPER_DARK
            : COLORS.WHITE,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
          transform: "translateY(-2px)",
        },
        width: isSmall ? "280px" : "100%",
        minWidth: isSmall ? "280px" : "auto",
      }}
    >
      <CardContent
        sx={{ p: isSmall ? 1.5 : 2, "&:last-child": { pb: isSmall ? 1.5 : 2 } }}
      >
        <Box sx={{ display: "flex", gap: isSmall ? 1.5 : 2 }}>
          {/* Provider Avatar */}
          <Avatar
            src={service.provider_image_url || undefined}
            alt={service.provider_name}
            sx={{
              width: isSmall ? 48 : 64,
              height: isSmall ? 48 : 64,
              border: `2px solid ${COLORS.PRIMARY_PURPLE}`,
            }}
          />

          {/* Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Header with expand icon */}
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
                  variant={isSmall ? "body2" : "subtitle1"}
                  sx={{
                    fontWeight: 600,
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
                <Typography
                  variant="caption"
                  sx={{
                    color:
                      theme.palette.mode === "dark"
                        ? COLORS.TEXT.SECONDARY_DARK
                        : COLORS.TEXT.SECONDARY_LIGHT,
                    display: "block",
                  }}
                >
                  {service.provider_name}
                </Typography>
              </Box>

              {/* Expand Icon (only for small size) */}
              {isSmall && showExpandIcon && (
                <IconButton
                  size="small"
                  onClick={handleExpandIconClick}
                  sx={{
                    ml: 1,
                    color: COLORS.PRIMARY_PURPLE,
                    "&:hover": {
                      backgroundColor: COLORS.PURPLE_ALPHA_10,
                    },
                  }}
                >
                  <OpenInFull fontSize="small" />
                </IconButton>
              )}
            </Box>

            {/* Rating and Reviews */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                mb: isSmall ? 0.5 : 1,
              }}
            >
              {service?.review_count && service?.review_count > 0 ? (
                <>
                  <Rating
                    value={service.avg_service_rating}
                    precision={0.1}
                    size={isSmall ? "small" : "medium"}
                    readOnly
                    sx={{
                      "& .MuiRating-iconFilled": {
                        color: "#FFB800",
                      },
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      color:
                        theme.palette.mode === "dark"
                          ? COLORS.TEXT.SECONDARY_DARK
                          : COLORS.TEXT.SECONDARY_LIGHT,
                      fontWeight: 500,
                    }}
                  >
                    {service.avg_service_rating} ({service.review_count})
                  </Typography>
                </>
              ) : (
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 500,
                    backgroundColor: COLORS.BACKGROUND.PAPER_DARK,
                    color: COLORS.WHITE,
                    borderRadius: "25px",
                    padding: "2px 4px",
                  }}
                >
                  {t("newServiceProvider")}
                </Typography>
              )}
            </Box>

            {/* Price and Distance */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              <Chip
                label={service.currency + " " + service.price}
                size="small"
                sx={{
                  backgroundColor: COLORS.PRIMARY_PURPLE,
                  color: COLORS.WHITE,
                  fontWeight: 600,
                  fontSize: isSmall ? "0.7rem" : "0.75rem",
                  height: isSmall ? 20 : 24,
                }}
              />
              {getDistance() && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.3 }}>
                  <LocationOn
                    sx={{
                      fontSize: isSmall ? 14 : 16,
                      color:
                        theme.palette.mode === "dark"
                          ? COLORS.TEXT.SECONDARY_DARK
                          : COLORS.TEXT.SECONDARY_LIGHT,
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      color:
                        theme.palette.mode === "dark"
                          ? COLORS.TEXT.SECONDARY_DARK
                          : COLORS.TEXT.SECONDARY_LIGHT,
                      fontSize: isSmall ? "0.7rem" : "0.75rem",
                    }}
                  >
                    {getDistance()}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Category (only for large size) */}
            {!isSmall && (
              <Typography
                variant="caption"
                sx={{
                  color:
                    theme.palette.mode === "dark"
                      ? COLORS.TEXT.SECONDARY_DARK
                      : COLORS.TEXT.SECONDARY_LIGHT,
                  display: "block",
                  mt: 0.5,
                }}
              >
                {service.category_name}
                {service.sub_category_name && ` • ${service.sub_category_name}`}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ServiceProviderCard;
