"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { COLORS } from "@/constants/colors";

interface LogoLoaderProps {
  size?: number;
  showText?: boolean;
}

const LogoLoader: React.FC<LogoLoaderProps> = ({ 
  size = 60, 
  showText = size >= 50 
}) => {
  const ringSize = size;

  return (
    <Box
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
          width: ringSize,
          height: ringSize,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Main Rotating Ring */}
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            border: "3px solid transparent",
            borderTopColor: COLORS.PRIMARY_PURPLE,
            borderRightColor: COLORS.PRIMARY_PURPLE,
          }}
        />

        {/* Inner Counter-Rotating Ring */}
        <motion.div
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            width: "75%",
            height: "75%",
            borderRadius: "50%",
            border: "2px solid transparent",
            borderBottomColor: COLORS.PRIMARY_BLUE || "#3B82F6",
            borderLeftColor: COLORS.PRIMARY_BLUE || "#3B82F6",
            opacity: 0.6,
          }}
        />

        {/* Center space is now empty, showing only rings */}
      </Box>

      {showText && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
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
        </motion.div>
      )}
    </Box>
  );
};

export default LogoLoader;

