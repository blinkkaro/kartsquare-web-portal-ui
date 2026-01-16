"use client";

import React from "react";
import { IconButton, Box, SxProps, Theme, useTheme } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { COLORS } from "@/constants/colors";

interface BackButtonProps {
  onClick?: () => void;
  sx?: SxProps<Theme>;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick, sx }) => {
  const router = useRouter();
  const theme = useTheme();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.back();
    }
  };

  return (
    <Box
      sx={{
        ...sx,
      }}
    >
      <IconButton
        onClick={handleClick}
        sx={{
          backgroundColor: theme.palette.mode === "dark" ? COLORS.BACKGROUND.PRIMARY_DARK : COLORS.BACKGROUND.PRIMARY_LIGHT,
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Soft shadow
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          "&:hover": {
            backgroundColor: theme.palette.mode === "dark" ? COLORS.BACKGROUND.PAPER_DARK : COLORS.BACKGROUND.PAPER_LIGHT,
          },
        }}
        aria-label="back"
      >
        <ArrowBackIcon sx={{ color: "text.primary" }} />
      </IconButton>
    </Box>
  );
};

export default BackButton;
