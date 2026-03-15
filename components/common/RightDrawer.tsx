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
  children,
  width = 1000,
  titleStyle,
  headerStyle,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: number;
  titleStyle?: SxProps<Theme>;
  headerStyle?: SxProps<Theme>;
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
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color:
              theme.palette.mode === "dark"
                ? COLORS.TEXT.PRIMARY_DARK
                : COLORS.TEXT.PRIMARY_LIGHT,
            ...titleStyle,
          }}
        >
          {title}
        </Typography>
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
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "dark"
                  ? COLORS.BACKGROUND.PRIMARY_DARK
                  : COLORS.LIGHT_GRAY,
            },
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
