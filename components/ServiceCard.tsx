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
} from "@mui/icons-material";
import { COLORS } from "../constants/colors";
import { Service } from "../services/serviceList/listInteraface";
import { useRouter } from "next/navigation";
import { getUserRole, getUserId, UserRole } from "../utils/auth";

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const theme = useTheme();
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const isDark = theme.palette.mode === "dark";

  // Use first image or placeholder
  const images = service.image_urls && service.image_urls.length > 0
    ? service.image_urls
    : ["https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"];

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleCardClick = () => {
    const userRole = getUserRole();
    const userId = getUserId();

    // If service provider viewing their own service, go to provider details page
    if (userRole === UserRole.SERVICE_PROVIDER && service.provider_id === userId) {
      router.push(`/spr/services/${service.service_id}`);
    } else {
      // Otherwise (customer or provider viewing other services), go to customer details page
      router.push(`/services/${service.service_id}`);
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
        bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : COLORS.BACKGROUND.PAPER_LIGHT,
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
            bgcolor: isDark ? COLORS.BACKGROUND.SECONDARY_DARK : COLORS.BACKGROUND.SECONDARY_LIGHT,
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
          }}
        >
          <Star sx={{ fontSize: 14, color: "#FFC107" }} />
          <Typography variant="caption" sx={{ fontWeight: "bold", fontSize: "0.75rem" }}>
            {service.avg_service_rating ? Number(service.avg_service_rating).toFixed(1) : "0.0"}
          </Typography>
        </Box>

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
            bgcolor: isDark ? COLORS.BACKGROUND.PRIMARY_DARK : COLORS.BACKGROUND.PRIMARY_LIGHT,
            color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
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
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar
              src={service.provider_image_url || undefined}
              sx={{ width: 24, height: 24 }}
            >
              {service.provider_name.charAt(0).toUpperCase()}
            </Avatar>
            <Typography
              variant="caption"
              sx={{
                color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT
              }}
            >
              by <Box
                component="span"
                sx={{
                  color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                  fontWeight: 500
                }}
              >
                {service.provider_name}
              </Box>
            </Typography>
          </Box>

          {service.is_price_required && service.price !== null && (
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{ color: COLORS.PRIMARY_PURPLE }}
            >
              <Typography
                variant="body2"
                component="span"
                sx={{
                  color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                  mr: 0.5,
                  fontSize: "0.85rem",
                }}
              >
                {service.currency}
              </Typography>
              {service.price.toFixed(2)}
            </Typography>
          )}
        </Box>

        {/* Title */}
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 700,
            fontSize: "1rem",
            mb: 0.5,
            lineHeight: 1.2,
            color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
          }}
        >
          {service.service_name}
        </Typography>

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
            color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
          }}
        >
          {service.service_desc || "No description available"}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;

