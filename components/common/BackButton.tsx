"use client";

import React from "react";
import { IconButton, Box, SxProps, Theme } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { COLORS } from "@/constants/colors";

interface BackButtonProps {
  onClick?: () => void;
  sx?: SxProps<Theme>;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick, sx }) => {
  const router = useRouter();

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
          backgroundColor: COLORS.WHITE,
          boxShadow: "0px 4px 12px " + COLORS.BORDER.DEFAULT, // Soft shadow
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          "&:hover": {
            backgroundColor: COLORS.WHITE + " / 50%",
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
