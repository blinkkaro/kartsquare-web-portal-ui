"use client";
import React from "react";
import { Box, Typography } from "@mui/material";
import { Storefront, BuildOutlined, NorthEast } from "@mui/icons-material";
import { COLORS } from "@/constants/colors";

const PIN_BUBBLE_SIZE = 36;
const PIN_POINT_HEIGHT = 12;
const PIN_WIDTH = 32;

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
}) => {
  const Icon = type === "store" ? Storefront : BuildOutlined;
  const bubbleSize = size === "compact" ? 28 : PIN_BUBBLE_SIZE;
  const pointHeight = size === "compact" ? 10 : PIN_POINT_HEIGHT;
  const pinWidth = size === "compact" ? 26 : PIN_WIDTH;

  const handleDirections = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (directionsUrl) window.open(directionsUrl, "_blank", "noopener,noreferrer");
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
        "&:hover": onClick ? { transform: "translate(-50%, -100%) scale(1.05)" } : {},
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
            width: bubbleSize + 20,
            height: bubbleSize + 20,
            borderRadius: "50%",
            bgcolor: `${color}35`,
            animation: "pinPulse 2s ease-out infinite",
            pointerEvents: "none",
            "@keyframes pinPulse": {
              "0%": { transform: "translate(-50%, 50%) scale(1)", opacity: 1 },
              "100%": { transform: "translate(-50%, 50%) scale(1.5)", opacity: 0 },
            },
          }}
        />
      )}

      {/* Popup card above pin */}
      {selected && showPopup && (
        <Box
          onClick={(e) => e.stopPropagation()}
          sx={{
            mb: 0.75,
            minWidth: 140,
            maxWidth: 200,
            px: 1.5,
            py: 1.25,
            borderRadius: 2,
            bgcolor: COLORS.WHITE,
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            border: `1px solid ${color}20`,
            display: "flex",
            alignItems: "center",
            gap: 1.25,
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 1.5,
              bgcolor: `${color}18`,
              color: color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              overflow: "hidden",
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
              <Icon sx={{ fontSize: 20 }} />
            )}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                color: COLORS.TEXT.PRIMARY_LIGHT,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
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
                  gap: 0.25,
                  mt: 0.25,
                  p: 0,
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  color: color,
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Directions
                <NorthEast sx={{ fontSize: 14 }} />
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
          filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.25))",
        }}
      >
        {/* Bubble (circle) */}
        <Box
          sx={{
            width: bubbleSize,
            height: bubbleSize,
            borderRadius: "50%",
            border: `2px solid ${COLORS.WHITE}`,
            bgcolor: color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          {imageUrl ? (
            <Box
              component="img"
              src={imageUrl}
              alt={name}
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <Icon sx={{ fontSize: size === "compact" ? 16 : 20, color: COLORS.WHITE }} />
          )}
        </Box>
        {/* Point (triangle) */}
        <Box
          sx={{
            width: 0,
            height: 0,
            borderLeft: `${pinWidth / 2}px solid transparent`,
            borderRight: `${pinWidth / 2}px solid transparent`,
            borderTop: `${pointHeight}px solid ${color}`,
            mt: -0.5,
          }}
        />
      </Box>
    </Box>
  );
};

export default MapPinMarker;
