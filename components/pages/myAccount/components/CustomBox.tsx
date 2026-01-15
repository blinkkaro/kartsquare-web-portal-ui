"use client";

import React from "react";
import { Box, Typography, useTheme, Stack } from "@mui/material";
import Link from "next/link";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { COLORS } from "@/constants/colors";
import GradientIcon from "@/components/common/GradientIcon";

interface CustomBoxProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  onClick?: () => void;
}

const CustomBox: React.FC<CustomBoxProps> = ({
  icon,
  label,
  path,
  onClick,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const boxContent = (
    <Box
      sx={{
        p: 2,
        borderRadius: 4,
        bgcolor: isDark
          ? COLORS.BACKGROUND.PRIMARY_DARK
          : COLORS.BACKGROUND.PRIMARY_LIGHT, // Using paper background
        border: `1px solid ${
          isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT
        }`,
        minWidth: { xs: "auto", sm: 160 }, // Minimum width to look good
        transition: "all 0.3s ease",
        cursor: "pointer",
        "&:hover": {
          borderColor: COLORS.BORDER.HOVER_LIGHT,
          transform: "translateY(-2px)",
          boxShadow: COLORS.SHADOW.DEFAULT,
        },
        height: { xs: 110, sm: 120 },
      }}
    >
      <Stack spacing={{ xs: 1.5, sm: 2 }}>
        {/* Top Row: Icon and Arrow */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            height: { xs: "2rem", sm: "2.5rem" },
            background: isDark
              ? COLORS.SWITCH.TRACK_DARK
              : `linear-gradient(to right, ${COLORS.WHITE} 20%, ${COLORS.LIGHT_GRAY} 80%)`,
            borderRadius: 50,
          }}
        >
          {/* Icon Wrapper (Thumb) */}
          <Box
            sx={{
              width: { xs: 28, sm: 32 },
              height: { xs: 28, sm: 32 },
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: isDark
                ? COLORS.BACKGROUND.PAPER_DARK
                : COLORS.BACKGROUND.PAPER_LIGHT,
              boxShadow: COLORS.SHADOW.DEFAULT,
            }}
          >
            <GradientIcon sx={{ fontSize: { xs: 14, sm: 16 } }}>
              {icon}
            </GradientIcon>
          </Box>

          {/* Arrow Icon */}
          <Box sx={{ pr: 1, display: "flex", alignItems: "center" }}>
            <ChevronRightIcon
              sx={{
                fontSize: { xs: 16, sm: 20 },
                bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : COLORS.WHITE,
                borderRadius: "50%",
                //   p:2,
                color: isDark
                  ? COLORS.TEXT.PRIMARY_DARK
                  : COLORS.TEXT.PRIMARY_LIGHT,
              }}
            />
          </Box>
        </Box>

        {/* Bottom Row: Label */}
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
            color: isDark
              ? COLORS.TEXT.PRIMARY_DARK
              : COLORS.TEXT.PRIMARY_LIGHT,
          }}
        >
          {label}
        </Typography>
      </Stack>
    </Box>
  );

  // If onClick is provided, use a div wrapper; otherwise use Link
  if (onClick) {
    return (
      <Box onClick={onClick} sx={{ textDecoration: "none" }}>
        {boxContent}
      </Box>
    );
  }

  return (
    <Link href={path} style={{ textDecoration: "none" }}>
      {boxContent}
    </Link>
  );
};

export default CustomBox;
