"use client";

import React from "react";
import { Drawer, IconButton, useTheme } from "@mui/material";
import { COLORS } from "@/constants/colors";
import { Box, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import { SxProps, Theme } from "@mui/material/styles";

const RightDrawer = ({
  open,
  onClose,
  title,
  titleContent,
  children,
  width = 1000,
  titleStyle,
  headerStyle,
  closeButtonStyle,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  titleContent?: React.ReactNode;
  children: React.ReactNode;
  width?: number;
  titleStyle?: SxProps<Theme>;
  headerStyle?: SxProps<Theme>;
  closeButtonStyle?: SxProps<Theme>;
}) => {
  const theme = useTheme();
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: { xs: "100%", md: width },
          bgcolor:
            theme.palette.mode === "dark"
              ? COLORS.BACKGROUND.PAPER_DARK
              : COLORS.BACKGROUND.PAPER_LIGHT,
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        },
      }}
    >
      <Box
        sx={{
          p: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pt: { xs: 2, md: 3 },
          position: "sticky",
          top: 0,
          zIndex: 1100,
          backgroundColor:
            theme.palette.mode === "dark"
              ? COLORS.BACKGROUND.PAPER_DARK
              : COLORS.BACKGROUND.PAPER_LIGHT,
          ...headerStyle,
        }}
      >
        {titleContent ?? (
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.15rem", sm: "1.5rem" },
              color:
                theme.palette.mode === "dark"
                  ? COLORS.TEXT.PRIMARY_DARK
                  : COLORS.TEXT.PRIMARY_LIGHT,
              ...titleStyle,
            }}
          >
            {title}
          </Typography>
        )}
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            backgroundColor:
              theme.palette.mode === "dark"
                ? COLORS.BACKGROUND.PAPER_DARK // Or slightly lighter than paper
                : COLORS.WHITE,
            boxShadow: COLORS.SHADOW.DEFAULT,
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            flexShrink: 0,
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "dark"
                  ? COLORS.BACKGROUND.PRIMARY_DARK
                  : COLORS.LIGHT_GRAY,
            },
            ...closeButtonStyle,
          }}
        >
          <Close
            fontSize="small"
            sx={{
              color:
                theme.palette.mode === "dark"
                  ? COLORS.TEXT.PRIMARY_DARK
                  : COLORS.TEXT.PRIMARY_LIGHT,
            }}
          />
        </IconButton>
      </Box>
      {children}
    </Drawer>
  );
};

export default RightDrawer;
