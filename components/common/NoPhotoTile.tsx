"use client";
import React from "react";
import { Box } from "@mui/material";
import { COLORS } from "@/constants/colors";

/**
 * Fills a photo slot when a listing has no photo (or its photo fails to load).
 * Shows the business's initial on a soft tint, never a stock photo that could be
 * mistaken for the provider's own work.
 */
const NoPhotoTile = ({ name, size = "2.5rem" }: { name: string; size?: string }) => (
  <Box
    role="img"
    aria-label={`${name || "Listing"}: no photo yet`}
    sx={{
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      bgcolor: COLORS.PURPLE_ALPHA_10,
      color: COLORS.PRIMARY_PURPLE,
      fontWeight: 800,
      fontSize: size,
      userSelect: "none",
    }}
  >
    {(name.trim()[0] || "K").toUpperCase()}
  </Box>
);

export default NoPhotoTile;
