"use client";

import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  useTheme,
} from "@mui/material";
import {
  Edit,
  Delete,
  Visibility,
  TouchApp,
  CalendarToday,
} from "@mui/icons-material";
import { COLORS } from "@/constants/colors";
import {
  AdvertiseProviderAd,
  ad_status_type,
} from "@/services/advertise/advertise.intreface";
import { useTranslate } from "@/hooks/useTranslate";
import { useRouter } from "next/navigation";

interface AdCardProps {
  ad: AdvertiseProviderAd;
  onEdit?: (ad: AdvertiseProviderAd) => void;
  onDelete?: (ad: AdvertiseProviderAd) => void;
}

const AdCard: React.FC<AdCardProps> = ({ ad, onEdit, onDelete }) => {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslate();
  const isDark = theme.palette.mode === "dark";

  const getStatusColor = (status: ad_status_type) => {
    switch (status) {
      case ad_status_type.ACTIVE:
        return {
          bg: "hsl(142deg 99.14% 41.59% / 71%)",
          text: "#ffffff",
        };
      case ad_status_type.INACTIVE:
        return {
          bg: "hsl(0deg 100% 50% / 71%)",
          text: "#ffffff",
        };
      case ad_status_type.PENDING:
        return {
          bg: "hsl(45deg 100% 51% / 71%)",
          text: "#ffffff",
        };
      case ad_status_type.REJECTED:
        return {
          bg: "hsl(0deg 84% 60% / 71%)",
          text: "#ffffff",
        };
      default:
        return {
          bg: "rgba(158, 158, 158, 0.9)",
          text: "#ffffff",
        };
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(ad);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(ad);
  };

  return (
    <Card
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
          image={
            ad.image_url ||
            "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800"
          }
          alt={ad.title || "Advertisement"}
          sx={{
            borderRadius: "16px 16px 0 0",
            objectFit: "cover",
            bgcolor: isDark
              ? COLORS.BACKGROUND.SECONDARY_DARK
              : COLORS.BACKGROUND.SECONDARY_LIGHT,
          }}
        />

        {/* Status Badge */}
        <Box
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            bgcolor: getStatusColor(ad.ad_status).bg,
            color: getStatusColor(ad.ad_status).text,
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
            {ad.ad_status}
          </Typography>
        </Box>

        {/* Service Name Badge */}
        <Chip
          label={ad.service_name}
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
        {/* Title */}
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 800,
            lineHeight: 1.2,
            color: COLORS.PRIMARY_PURPLE,
            mb: 0.5,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {ad.title || t("untitled_advertisement")}
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
            color: isDark
              ? COLORS.TEXT.SECONDARY_DARK
              : COLORS.TEXT.SECONDARY_LIGHT,
            mb: 1.5,
            minHeight: "2.24rem",
          }}
        >
          {ad.description || t("no_description_available")}
        </Typography>

        {/* Metrics Row */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 1.5,
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Visibility
              sx={{
                fontSize: 16,
                color: isDark
                  ? COLORS.TEXT.SECONDARY_DARK
                  : COLORS.TEXT.SECONDARY_LIGHT,
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: isDark
                  ? COLORS.TEXT.SECONDARY_DARK
                  : COLORS.TEXT.SECONDARY_LIGHT,
                fontWeight: 600,
              }}
            >
              {ad.impressions_count} {t("ad_views")}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <TouchApp
              sx={{
                fontSize: 16,
                color: isDark
                  ? COLORS.TEXT.SECONDARY_DARK
                  : COLORS.TEXT.SECONDARY_LIGHT,
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: isDark
                  ? COLORS.TEXT.SECONDARY_DARK
                  : COLORS.TEXT.SECONDARY_LIGHT,
                fontWeight: 600,
              }}
            >
              {ad.clicks_count} {t("ad_clicks")}
            </Typography>
          </Box>
        </Box>

        {/* Date Range */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            mb: 1.5,
          }}
        >
          <CalendarToday
            sx={{
              fontSize: 14,
              color: isDark
                ? COLORS.TEXT.SECONDARY_DARK
                : COLORS.TEXT.SECONDARY_LIGHT,
            }}
          />
          <Typography
            variant="caption"
            sx={{
              color: isDark
                ? COLORS.TEXT.SECONDARY_DARK
                : COLORS.TEXT.SECONDARY_LIGHT,
              fontSize: "0.7rem",
            }}
          >
            {formatDate(ad.start_at)} - {formatDate(ad.expires_at)}
          </Typography>
        </Box>

        {/* Rejection Reason */}
        {ad.ad_status === ad_status_type.REJECTED && ad.ad_reject_reason && (
          <Box
            sx={{
              bgcolor: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "8px",
              p: 1,
              mb: 1.5,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "#EF4444",
                fontSize: "0.7rem",
                fontWeight: 600,
              }}
            >
              {t("ad_rejection_reason")} {ad.ad_reject_reason}
            </Typography>
          </Box>
        )}

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            justifyContent: "flex-end",
          }}
        >
          <IconButton
            size="small"
            onClick={handleEdit}
            sx={{
              bgcolor: isDark
                ? COLORS.BACKGROUND.SECONDARY_DARK
                : COLORS.PURPLE_ALPHA_10,
              color: COLORS.PRIMARY_PURPLE,
              "&:hover": {
                bgcolor: COLORS.PURPLE_ALPHA_20,
              },
            }}
          >
            <Edit sx={{ fontSize: 18 }} />
          </IconButton>
          <IconButton
            size="small"
            onClick={handleDelete}
            sx={{
              bgcolor: isDark
                ? COLORS.BACKGROUND.SECONDARY_DARK
                : "rgba(239, 68, 68, 0.1)",
              color: "#EF4444",
              "&:hover": {
                bgcolor: "rgba(239, 68, 68, 0.2)",
              },
            }}
          >
            <Delete sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AdCard;
