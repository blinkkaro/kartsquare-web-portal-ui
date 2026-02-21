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
import { Storefront, LocationOn } from "@mui/icons-material";
import { COLORS } from "@/constants/colors";
import { useRouter } from "next/navigation";
import type { MapStoreItem } from "@/services/map/mapInterface";

const STORE_ACCENT = COLORS.PRIMARY_BLUE;

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
  const isSmall = size === "small";
  const details = store.store_details;
  const address = details?.store_address;
  const name = details?.store_name || "Store";
  const hasLocation =
    address?.latitude != null &&
    address?.longitude != null &&
    Number(address.latitude) &&
    Number(address.longitude);

  const handleClick = () => {
    if (onCardClick) {
      onCardClick(store);
    } else {
      router.push("/store");
    }
  };

  const locationText = [address?.address, address?.city_town, address?.state]
    .filter(Boolean)
    .join(", ");

  const bannerUrl = details?.banner_url;

  return (
    <Card
      onClick={handleClick}
      sx={{
        cursor: "pointer",
        borderRadius: "12px",
        backgroundColor:
          theme.palette.mode === "dark"
            ? COLORS.BACKGROUND.PAPER_DARK
            : COLORS.WHITE,
        boxShadow: selected
          ? `0 4px 16px ${STORE_ACCENT}40`
          : "0 2px 8px rgba(0, 0, 0, 0.1)",
        border: selected ? `2px solid ${STORE_ACCENT}` : "2px solid transparent",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
          transform: "translateY(-2px)",
        },
        width: isSmall ? "280px" : "100%",
        minWidth: isSmall ? "280px" : "auto",
        overflow: "hidden",
      }}
    >
      {bannerUrl && !isSmall && (
        <Box
          sx={{
            width: "100%",
            height: 72,
            overflow: "hidden",
            bgcolor: `${STORE_ACCENT}15`,
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
            }}
          />
        </Box>
      )}
      <CardContent sx={{ p: isSmall ? 1.5 : 2, "&:last-child": { pb: isSmall ? 1.5 : 2 } }}>
        <Box sx={{ display: "flex", gap: isSmall ? 1.5 : 2 }}>
          <Avatar
            src={details?.logo_url || undefined}
            alt={name}
            variant="rounded"
            sx={{
              width: isSmall ? 48 : 64,
              height: isSmall ? 48 : 64,
              border: `2px solid ${STORE_ACCENT}`,
              bgcolor: `${STORE_ACCENT}20`,
              flexShrink: 0,
            }}
          >
            <Storefront sx={{ color: STORE_ACCENT, fontSize: isSmall ? 28 : 36 }} />
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
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
                {name}
              </Typography>
              {details?.is_verified && (
                <Chip
                  label="Verified"
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: "0.65rem",
                    bgcolor: `${COLORS.SUCCESS_GREEN}20`,
                    color: COLORS.SUCCESS_GREEN,
                  }}
                />
              )}
            </Box>
            {locationText && (
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
                  mt: 0.5,
                  color:
                    theme.palette.mode === "dark"
                      ? COLORS.TEXT.SECONDARY_DARK
                      : COLORS.TEXT.SECONDARY_LIGHT,
                  lineHeight: 1.35,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {details.description}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StoreCard;
