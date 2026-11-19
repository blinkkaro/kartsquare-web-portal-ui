"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { keyframes } from "@mui/material/styles";
import { COLORS } from "@/constants/colors";

interface LogoLoaderProps {
  size?: number;
  showText?: boolean;
}

const spin = keyframes`to { transform: rotate(360deg); }`;
const spinBack = keyframes`to { transform: rotate(-360deg); }`;
const rise = keyframes`from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: none; }`;

/**
 * Two counter-rotating rings. Pure CSS (it used to need framer-motion, which then shipped with
 * every page that shows a spinner). The rings keep turning under reduced motion on purpose: a
 * spinner is the loading feedback itself, and a frozen one reads as a broken page.
 */
const LogoLoader: React.FC<LogoLoaderProps> = ({ size = 60, showText = size >= 50 }) => {
  return (
    <Box
      role="status"
      aria-label="Loading"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: size,
          height: size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Main rotating ring */}
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            border: "3px solid transparent",
            borderTopColor: COLORS.PRIMARY_PURPLE,
            borderRightColor: COLORS.PRIMARY_PURPLE,
            animation: `${spin} 1.5s linear infinite`,
          }}
        />
        {/* Inner counter-rotating ring */}
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            width: "75%",
            height: "75%",
            borderRadius: "50%",
            border: "2px solid transparent",
            borderBottomColor: COLORS.PRIMARY_BLUE,
            borderLeftColor: COLORS.PRIMARY_BLUE,
            opacity: 0.6,
            animation: `${spinBack} 2s linear infinite`,
          }}
        />
      </Box>

      {showText && (
        <Box sx={{ animation: `${rise} 0.5s ease-out both` }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: "text.secondary",
              letterSpacing: 1.5,
              textTransform: "uppercase",
              fontSize: "0.75rem",
            }}
          >
            Hold on !!
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default LogoLoader;
