"use client";
import React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Avatar,
  useTheme,
  Chip,
} from "@mui/material";
import { motion } from "framer-motion";
import { ShoppingBag, LocationOn, Verified } from "@mui/icons-material";
import { COLORS } from "@/constants/colors";
import { useRouter } from "next/navigation";
import type { MapStoreItem } from "@/services/map/mapInterface";
import { useAutoGeolocation } from "@/hooks/useGeolocation";
import { calculateDistance } from "@/helper/helper";

const STORE_ACCENT = COLORS.PRIMARY_BLUE;
const MotionCard = motion(Card);

interface StoreCardProps {
  store: MapStoreItem;
  size?: "small" | "large";
  selected?: boolean;
  onCardClick?: (store: MapStoreItem) => void;
}

const StoreCard: React.FC<StoreCardProps> = ({
  store,
  size = "large",
  selected = false,
  onCardClick,
}) => {
  const theme = useTheme();
  const router = useRouter();
  const { coordinates } = useAutoGeolocation();
  const isSmall = size === "small";
  const details = store.store_details;
  const address = details?.store_address;
  const name = details?.store_name || "Store";
  // const dis

  const handleClick = () => {
    if (onCardClick) {
      onCardClick(store);
    } else {
      router.push("/store");
    }
  };

  const nameClick = () => {
    
  };

  const locationText = [address?.address, address?.city_town, address?.state]
    .filter(Boolean)
    .join(", ");

  const bannerUrl = details?.banner_url;

    const getDistance = () => {
      if (
        coordinates?.latitude &&
        coordinates?.longitude &&
        address?.latitude &&
        address?.longitude
      ) {
        const dist = calculateDistance(
          coordinates.latitude,
          coordinates.longitude,
          address?.latitude,
          address?.longitude,
        );
        return `${dist.toFixed(1)} km`;
      }
      return null;
    };

  return (
    <MotionCard
      onClick={handleClick}
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
          ? `0 20px 40px -12px ${STORE_ACCENT}30, 0 8px 16px -8px ${STORE_ACCENT}20`
          : "0 10px 30px -10px rgba(0, 0, 0, 0.12), 0 4px 10px -5px rgba(0, 0, 0, 0.04)",
        border: selected ? `2px solid ${STORE_ACCENT}` : "1px solid rgba(0,0,0,0.04)",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: `0 20px 40px -12px ${STORE_ACCENT}25, 0 8px 16px -8px ${STORE_ACCENT}15`,
          borderColor: `${STORE_ACCENT}40`,
        },
        width: isSmall ? "260px" : "100%",
        minWidth: isSmall ? "260px" : "auto",
        height: isSmall ? "125px" : "auto",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Decorative Banner Background */}
      {bannerUrl && !isSmall ? (
        <Box
          sx={{
            width: "100%",
            height: 90,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            component="img"
            src={bannerUrl}
            alt=""
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.9)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "40%",
              background: "linear-gradient(to top, rgba(0,0,0,0.2), transparent)",
            }}
          />
        </Box>
      ) : (
        <Box
          sx={{
            height: "4px",
            width: "100%",
            background: `linear-gradient(90deg, ${STORE_ACCENT} 0%, ${STORE_ACCENT}80 100%)`,
          }}
        />
      )}

      <CardContent sx={{ p: isSmall ? 1.5 : 2.5, "&:last-child": { pb: isSmall ? 1.5 : 2.5 } }}>
        {getDistance() && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              mb: .5,
            }}
          >
            <Box
              sx={{
                bgcolor: "rgba(0,0,0,0.03)",
                px: 1,
                py: 0.25,
                borderRadius: "20px",
              }}
            >
              <LocationOn
                sx={{ fontSize: 14, color: COLORS.TEXT.SECONDARY_LIGHT }}
              />
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
          </Box>
        )}
        <Box sx={{ display: "flex", gap: 1.5, alignItems: isSmall ? "center" : "flex-start", mt: bannerUrl && !isSmall ? -4 : 0 }}>
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Box
              sx={{
                padding: "2px",
                borderRadius: "12px",
                background: COLORS.WHITE,
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              }}
            >
              <Avatar
                src={details?.logo_url || undefined}
                alt={name}
                variant="rounded"
                sx={{
                  width: isSmall ? 48 : 72,
                  height: isSmall ? 48 : 72,
                  bgcolor: `${STORE_ACCENT}10`,
                  border: `1px solid ${STORE_ACCENT}20`,
                }}
              >
                <ShoppingBag sx={{ color: STORE_ACCENT, fontSize: isSmall ? 24 : 36 }} />
              </Avatar>
            </Box>
          </Box>

          <Box sx={{ flex: 1, minWidth: 0, mt: bannerUrl && !isSmall ? 4 : 0 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
              <Typography
                variant={isSmall ? "subtitle2" : "h6"}
                sx={{
                  fontWeight: 800,
                  color:
                    theme.palette.mode === "dark"
                      ? COLORS.TEXT.PRIMARY_DARK
                      : COLORS.TEXT.PRIMARY_LIGHT,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {name}
              </Typography>
              {details?.is_verified && (
                <Verified sx={{ fontSize: 16, color: COLORS.SUCCESS_GREEN }} titleAccess="Verified Store" />
              )}
            </Box>

            {locationText && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <LocationOn
                  sx={{
                    fontSize: 14,
                    color: COLORS.TEXT.SECONDARY_LIGHT,
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: COLORS.TEXT.SECONDARY_LIGHT,
                    fontWeight: 500,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {locationText}
                </Typography>
              </Box>
            )}

            {!isSmall && details?.description && (
              <Typography
                variant="caption"
                sx={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  mt: 1.5,
                  color: COLORS.TEXT.SECONDARY_LIGHT,
                  lineHeight: 1.4,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  opacity: 0.8,
                }}
              >
                {details.description}
              </Typography>
            )}

            {/* View Store Badge */}
            {!isSmall && (
              <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    color: STORE_ACCENT,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    cursor: "pointer",
                    "&:hover": { textDecoration: "underline" }
                  }}
                >
                  Visit Store <ShoppingBag sx={{ fontSize: 12 }} />
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </CardContent>
    </MotionCard>
  );
};

export default StoreCard;
