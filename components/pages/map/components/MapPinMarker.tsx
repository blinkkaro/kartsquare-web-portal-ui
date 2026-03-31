"use client";
import React from "react";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import {
  ShoppingBag,
  HomeRepairService,
  NorthEast,
  Close,
} from "@mui/icons-material";
import { COLORS } from "@/constants/colors";
import type { SelectedItem } from "@/services/map/mapInterface";
import { AppUserType } from "@/services/auth/auth.interface";
import { useDispatch } from "react-redux";
import { openDrawer } from "@/features/ui/profileDrawerSlice";

const PIN_BUBBLE_SIZE = 42;
const PIN_POINT_HEIGHT = 14;
const PIN_WIDTH = 36;

export interface MapPinMarkerProps {
  type: "service" | "store";
  color: string;
  imageUrl?: string | null;
  name: string;
  selected?: boolean;
  onClick?: () => void;
  showPopup?: boolean;
  directionsUrl?: string;
  size?: "default" | "compact";
  setSelectedItem: React.Dispatch<React.SetStateAction<SelectedItem | null>>;
  role: AppUserType;
  id: string;
  username?: string;
}

const MapPinMarker: React.FC<MapPinMarkerProps> = ({
  type,
  color,
  imageUrl,
  name,
  selected = false,
  onClick,
  showPopup = true,
  directionsUrl,
  size = "default",
  setSelectedItem,
  role,
  id,
  username,
}) => {
  const Icon = type === "store" ? ShoppingBag : HomeRepairService;
  const bubbleSize = size === "compact" ? 32 : PIN_BUBBLE_SIZE;
  const pointHeight = size === "compact" ? 12 : PIN_POINT_HEIGHT;
  const pinWidth = size === "compact" ? 30 : PIN_WIDTH;
  const theme = useTheme();
  const dispatch = useDispatch();

  const handleDirections = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (directionsUrl)
      window.open(directionsUrl, "_blank", "noopener,noreferrer");
  };

  const handleOpenDrawer = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(
      openDrawer({
        userId: id,
        role: role,
        username: username || "",
      }),
    );
  };

  return (
    <Box
      onClick={onClick}
      title={name}
      sx={{
        position: "relative",
        cursor: onClick ? "pointer" : "default",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transform: "translate(-50%, -100%)",
        transition: "transform 0.2s ease",
        "&:hover": onClick
          ? { transform: "translate(-50%, -100%) scale(1.1)" }
          : {},
        zIndex: selected ? 100 : 1,
      }}
    >
      {/* Pulse ring when selected — centered on pin bubble */}
      {selected && (
        <Box
          sx={{
            position: "absolute",
            bottom: pointHeight + bubbleSize / 2,
            left: "50%",
            transform: "translate(-50%, 50%)",
            width: bubbleSize + 24,
            height: bubbleSize + 24,
            borderRadius: "50%",
            bgcolor: `${color}40`,
            animation: "pinPulse 2s ease-out infinite",
            pointerEvents: "none",
            "@keyframes pinPulse": {
              "0%": { transform: "translate(-50%, 50%) scale(1)", opacity: 1 },
              "100%": {
                transform: "translate(-50%, 50%) scale(1.6)",
                opacity: 0,
              },
            },
          }}
        />
      )}

      {/* Popup card above pin */}
      {selected && showPopup && (
        <Box
          onClick={(e) => e.stopPropagation()}
          sx={{
            mb: 1,
            minWidth: 160,
            maxWidth: 220,
            px: 1.5,
            py: 1.25,
            borderRadius: 2.5,
            bgcolor: COLORS.WHITE,
            boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
            border: `1.5px solid ${color}30`,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: -8,
              left: "50%",
              transform: "translateX(-50%)",
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderTop: `8px solid ${COLORS.WHITE}`,
            },
          }}
        >
          <IconButton
            onClick={() => setSelectedItem(null)}
            // size="small"
            sx={{
              position: "absolute",
              top: -5,
              right: -5,
              zIndex: 20,
              fontSize: "15px",
              width: "20px",
              height: "20px",
              backgroundColor:
                theme.palette.mode === "light"
                  ? COLORS.WHITE
                  : COLORS.BACKGROUND.PAPER_DARK,
              boxShadow: `0 2px 8px ${COLORS.SHADOW.DEFAULT}`,
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "light"
                    ? "#f5f5f5"
                    : COLORS.BACKGROUND.PAPER_DARK,
                boxShadow: `0 4px 12px ${COLORS.SHADOW.DEFAULT}`,
              },
            }}
          >
            <Close fontSize="inherit" />
          </IconButton>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: `${color}15`,
              color: color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              overflow: "hidden",
              border: `1px solid ${color}20`,
            }}
          >
            {imageUrl ? (
              <Box
                component="img"
                src={imageUrl}
                alt=""
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <Icon sx={{ fontSize: 22 }} />
            )}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              onClick={handleOpenDrawer}
              variant="body2"
              sx={{
                fontWeight: 800,
                color: COLORS.TEXT.PRIMARY_LIGHT,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontSize: "0.85rem",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {name}
            </Typography>
            {directionsUrl && (
              <Box
                component="button"
                type="button"
                onClick={handleDirections}
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.5,
                  mt: 0.5,
                  p: 0,
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  color: color,
                  fontWeight: 700,
                  fontSize: "0.7rem",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Directions
                <NorthEast sx={{ fontSize: 12 }} />
              </Box>
            )}
          </Box>
        </Box>
      )}

      {/* Teardrop pin: bubble + point */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.3))",
        }}
      >
        {/* Bubble (circle) */}
        <Box
          sx={{
            width: bubbleSize,
            height: bubbleSize,
            borderRadius: "50%",
            border: `3px solid ${COLORS.WHITE}`,
            bgcolor: color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "visible",
            flexShrink: 0,
            boxShadow: `0 0 0 1px ${color}40`, // Subtle outer ring
          }}
        >
          {imageUrl ? (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                overflow: "hidden",
                bgcolor: COLORS.WHITE,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                component="img"
                src={imageUrl}
                alt={name}
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
          ) : (
            <Icon
              sx={{
                fontSize: size === "compact" ? 18 : 24,
                color: COLORS.WHITE,
              }}
            />
          )}

          {/* Type Badge Overlay */}
          <Box
            sx={{
              position: "absolute",
              top: -8,
              right: -8,
              width: 24,
              height: 24,
              borderRadius: "50%",
              bgcolor: color,
              border: `2px solid ${COLORS.WHITE}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 8px rgba(0,0,0,0.4)",
              zIndex: 10,
            }}
          >
            <Icon sx={{ fontSize: 13, color: COLORS.WHITE }} />
          </Box>
        </Box>
        {/* Point (triangle) */}
        <Box
          sx={{
            width: 0,
            height: 0,
            borderLeft: `${pinWidth / 2}px solid transparent`,
            borderRight: `${pinWidth / 2}px solid transparent`,
            borderTop: `${pointHeight}px solid ${color}`,
            mt: -0.25,
            position: "relative",
            zIndex: 1,
            // Inline glow effect for the triangle tip
            "&::after": {
              content: '""',
              position: "absolute",
              top: -pointHeight,
              left: -pinWidth / 2,
              width: pinWidth,
              height: 2,
              bgcolor: color,
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default MapPinMarker;
