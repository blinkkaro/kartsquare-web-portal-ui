import React, { useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  IconButton,
  useTheme,
} from "@mui/material";
import {
  Star,
  ArrowBackIos,
  ArrowForwardIos,
  Verified,
  Bolt,
} from "@mui/icons-material";
import { COLORS } from "../constants/colors";
import { Service, ServiceStatus } from "../services/serviceList/listInteraface";
import { useRouter } from "next/navigation";
import { getUserRole, getUserId, UserRole } from "../utils/auth";
import { useTranslate } from "@/hooks/useTranslate";
import { useDispatch } from "react-redux";
import { closeDrawer } from "@/features/ui/profileDrawerSlice";

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const theme = useTheme();
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { t } = useTranslate();
  const dispatch = useDispatch();

  const isDark = theme.palette.mode === "dark";

  // Use first image or placeholder
  const images =
    service.image_urls && service.image_urls.length > 0
      ? service.image_urls
      : [
          "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        ];

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const userRole = getUserRole();
  const userId = getUserId();
  const isOwner =
    userRole === UserRole.SERVICE_PROVIDER && service.provider_id === userId;

  const handleCardClick = () => {
    // If service provider viewing their own service, go to provider details page
    dispatch(closeDrawer());
    if (isOwner) {
      router.push(`/spr/services/${service.service_id}`);
    } else {
      // Otherwise (customer or provider viewing other services), go to customer details page
      router.push(`/services/${service.service_id}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return {
          bg: "hsl(142deg 99.14% 41.59% / 71%)", // vivid but not neon green
          text: "#ffffff",
        };
      case "INACTIVE":
        return {
          bg: "hsl(0deg 100% 50% / 71%)", // vivid but not neon green
          text: "#ffffff",
        };
      case "PENDING_APPROVAL":
        return {
          bg: COLORS.BACKGROUND.PAPER_DARK,
          text: "#ffffff",
        };
      default:
        return {
          bg: "rgba(158, 158, 158, 0.9)", // Grey
          text: "#ffffff",
        };
    }
  };

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        borderRadius: "16px",
        boxShadow: isDark
          ? "0px 4px 20px rgba(0, 0, 0, 0.3)"
          : "0px 4px 20px rgba(0, 0, 0, 0.05)",
        border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT}`,
        bgcolor: isDark
          ? COLORS.BACKGROUND.PAPER_DARK
          : COLORS.BACKGROUND.PAPER_LIGHT,
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "pointer",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: isDark
            ? "0px 8px 30px rgba(94, 24, 233, 0.3)"
            : "0px 8px 25px rgba(94, 24, 233, 0.15)",
        },
      }}
    >
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="200"
          image={images[currentImageIndex]}
          alt={service.service_name}
          sx={{
            borderRadius: "16px 16px 0 0",
            objectFit: "cover",
            bgcolor: isDark
              ? COLORS.BACKGROUND.SECONDARY_DARK
              : COLORS.BACKGROUND.SECONDARY_LIGHT,
          }}
        />

        {/* Rating Badge */}
        <Box
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            bgcolor: "rgba(30, 30, 30, 0.85)",
            color: "white",
            padding: "4px 10px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            backdropFilter: "blur(8px)",
            zIndex: 1,
          }}
        >
          <Star sx={{ fontSize: 14, color: "#FFC107" }} />
          <Typography
            variant="caption"
            sx={{ fontWeight: "bold", fontSize: "0.75rem" }}
          >
            {service.avg_service_rating
              ? Number(service.avg_service_rating).toFixed(1)
              : "0.0"}
          </Typography>
        </Box>

        {/* Verified Badge (For all users when service is approved/active) */}
        {!isOwner &&
          (service.status === "APPROVED" || service.status === "ACTIVE") && (
            <Box
              sx={{
                position: "absolute",
                top: 12,
                right: 12,
                bgcolor: "rgba(29, 78, 216, 0.95)",
                color: "white",
                padding: "4px 10px",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                backdropFilter: "blur(8px)",
                zIndex: 1,
                boxShadow: "0 2px 8px rgba(29, 78, 216, 0.3)",
              }}
            >
              <Verified sx={{ fontSize: 14 }} />
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  fontSize: "0.7rem",
                  letterSpacing: "0.02em",
                }}
              >
                {t("verified")}
              </Typography>
            </Box>
          )}

        {/* Status Badge (Only for Provider's own services) */}
        {isOwner && service.status && (
          <Box
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              bgcolor: getStatusColor(service.status).bg,
              color: getStatusColor(service.status).text,
              padding: "4px 12px",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              backdropFilter: "blur(8px)",
              zIndex: 1,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                fontSize: "0.7rem",
                textTransform: "capitalize",
                letterSpacing: "0.02em",
              }}
            >
              {service.status === ServiceStatus.PENDING_APPROVAL
                ? t("waitingForApproval")
                : service.status.replace("_", " ").toLowerCase()}
            </Typography>
          </Box>
        )}

        {/* Navigation Arrows - only show if multiple images */}
        {images.length > 1 && (
          <>
            <IconButton
              size="small"
              onClick={handlePrevImage}
              sx={{
                position: "absolute",
                top: "50%",
                left: 8,
                transform: "translateY(-50%)",
                bgcolor: "rgba(255,255,255,0.3)",
                color: "white",
                "&:hover": { bgcolor: "rgba(255,255,255,0.5)" },
                width: 28,
                height: 28,
              }}
            >
              <ArrowBackIos sx={{ fontSize: 14, ml: 0.5 }} />
            </IconButton>
            <IconButton
              size="small"
              onClick={handleNextImage}
              sx={{
                position: "absolute",
                top: "50%",
                right: 8,
                transform: "translateY(-50%)",
                bgcolor: "rgba(255,255,255,0.3)",
                color: "white",
                "&:hover": { bgcolor: "rgba(255,255,255,0.5)" },
                width: 28,
                height: 28,
              }}
            >
              <ArrowForwardIos sx={{ fontSize: 14 }} />
            </IconButton>
          </>
        )}

        {/* Category Badge */}
        <Chip
          label={service.category_name}
          size="small"
          sx={{
            position: "absolute",
            bottom: 12,
            left: 12,
            bgcolor: isDark
              ? COLORS.BACKGROUND.PRIMARY_DARK
              : COLORS.BACKGROUND.PRIMARY_LIGHT,
            color: isDark
              ? COLORS.TEXT.PRIMARY_DARK
              : COLORS.TEXT.PRIMARY_LIGHT,
            fontWeight: 600,
            fontSize: "0.7rem",
            height: "24px",
            borderRadius: "12px",
            border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT}`,
          }}
        />
      </Box>

      <CardContent sx={{ pt: 1.5, pb: "16px !important" }}>
        {/* Provider and Price Row */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar
              src={service.provider_image_url}
              sx={{ width: 24, height: 24 }}
            >
              {/* {service?.provider_name.charAt(0).toUpperCase()} */}
            </Avatar>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography
                variant="caption"
                sx={{
                  color: isDark
                    ? COLORS.TEXT.PRIMARY_DARK
                    : COLORS.TEXT.PRIMARY_LIGHT,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  lineHeight: 1.2,
                }}
              >
                {service.business_name}
                <Box
                  component="span"
                  sx={{
                    color: "#1D4ED8",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Verified sx={{ fontSize: "12px" }} />
                </Box>
              </Typography>
              {
                <Typography
                  variant="caption"
                  sx={{
                    color: isDark
                      ? COLORS.TEXT.SECONDARY_DARK
                      : COLORS.TEXT.SECONDARY_LIGHT,
                    fontSize: "0.7rem",
                    lineHeight: 1.2,
                  }}
                >
                  {t("by")} {service.provider_name}
                </Typography>
              }
            </Box>
          </Box>

          {service.is_price_required ? (
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{ color: COLORS.PRIMARY_PURPLE }}
            >
              <Typography
                variant="body2"
                component="span"
                sx={{
                  color: isDark
                    ? COLORS.TEXT.SECONDARY_DARK
                    : COLORS.TEXT.SECONDARY_LIGHT,
                  mr: 0.5,
                  fontSize: "0.85rem",
                }}
              >
                {service.currency}
              </Typography>
              {service.price}
            </Typography>
          ) : (
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{ color: COLORS.PRIMARY_PURPLE }}
            >
              <Typography
                variant="body2"
                component="span"
                sx={{
                  color: isDark
                    ? COLORS.TEXT.SECONDARY_DARK
                    : COLORS.TEXT.SECONDARY_LIGHT,
                  mr: 0.5,
                  fontSize: "0.85rem",
                }}
              >
                {t("getQuote")}
              </Typography>
            </Typography>
          )}
        </Box>

        {/* Title & Success Badge Row */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 0.5,
            flexWrap: "wrap",
          }}
        >
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 800,
              fontSize: "1rem",
              lineHeight: 1.2,
              color: COLORS.PRIMARY_PURPLE,
            }}
          >
            {service.service_name}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.3,
              bgcolor: "#ECFDF5",
              color: "#059669",
              px: 0.6,
              py: 0.1,
              borderRadius: "4px",
              border: "1px solid #10B98130",
            }}
          >
            <Bolt sx={{ fontSize: "10px" }} />
            <Typography
              sx={{
                fontWeight: 900,
                fontSize: "0.55rem",
              }}
            >
              HIGH SUCCESS
            </Typography>
          </Box>
        </Box>

        {/* Description */}
        <Typography
          variant="body2"
          sx={{
            fontSize: "0.8rem",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: 1.4,
            color: isDark
              ? COLORS.TEXT.SECONDARY_DARK
              : COLORS.TEXT.SECONDARY_LIGHT,
          }}
        >
          {service.service_desc || "No description available"}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
