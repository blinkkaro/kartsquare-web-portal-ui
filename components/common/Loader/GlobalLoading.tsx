"use client";

import React from "react";
import { Box, Typography, useTheme, Backdrop } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import LogoLoader from "./LogoLoader";
import { COLORS } from "../../../constants/colors";

interface GlobalLoadingProps {
  open: boolean;
  message?: string;
}

const GlobalLoading: React.FC<GlobalLoadingProps> = ({ open, message }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <AnimatePresence>
      {open && (
        <Backdrop
          open={open}
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1000,
            bgcolor: isDark ? "rgba(0, 0, 0, 0.85)" : "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(8px)",
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <LogoLoader size={80} />
          
          {message && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  background: "linear-gradient(45deg, #5E18E9, #B06AB3)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "0.05em",
                }}
              >
                {message}
              </Typography>
            </motion.div>
          )}

          <Box
            sx={{
              position: "absolute",
              bottom: 40,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              Kartsquare
            </Typography>
          </Box>
        </Backdrop>
      )}
    </AnimatePresence>
  );
};

export default GlobalLoading;
