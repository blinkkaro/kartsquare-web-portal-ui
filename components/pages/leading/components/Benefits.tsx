"use client";

import React from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  useTheme,
} from "@mui/material";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { COLORS } from "@/constants/colors";

const benefitsData = [
  {
    title: "Pay supplier invoices",
    description: "Our goal is to streamline SMB trade, making it easier and faster than ever.",
    colSpan: { xs: 12, md: 8 },
  },
  {
    title: "Pay supplier invoices",
    description: "Our goal is to streamline SMB trade, making it easier and faster than ever.",
    colSpan: { xs: 12, md: 4 },
  },
  {
    title: "Pay supplier invoices",
    description: "Our goal is to streamline SMB trade, making it easier and faster than ever.",
    colSpan: { xs: 12, md: 4 },
  },
  {
    title: "Pay supplier invoices",
    description: "Our goal is to streamline SMB trade, making it easier and faster than ever.",
    colSpan: { xs: 12, md: 8 },
  },
];

const Benefits = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        bgcolor: isDark ? COLORS.BACKGROUND.PRIMARY_DARK : "#ffffff",
      }}
    >
      <Container maxWidth="xl" sx={{ position: "relative" }}>
        {/* Optional left arrow from the design, absolutely positioned if needed */}
        {/*
        <Box
          sx={{
            position: "absolute",
            left: -16,
            top: "50%",
            transform: "translateY(-50%)",
            bgcolor: "#1e1e1e",
            color: "#fff",
            width: 40,
            height: 40,
            borderRadius: 2,
            display: { xs: "none", xl: "flex" },
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 2,
            "&:hover": { bgcolor: "#333" },
          }}
        >
          <KeyboardArrowLeftIcon />
        </Box>
        */}

        <Grid container spacing={3}>
          {benefitsData.map((data, index) => (
            <Grid size={data.colSpan as any} key={index}>
              <Box
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: 3,
                  bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : "#f3f4f6",
                  height: "100%",
                  minHeight: { xs: 240, md: 300 },
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "transform 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <PersonOutlineOutlinedIcon
                  sx={{
                    fontSize: 28,
                    color: isDark ? COLORS.TEXT.PRIMARY_DARK : "#333",
                  }}
                />

                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 500,
                      fontSize: "1.125rem",
                      color: isDark ? COLORS.TEXT.PRIMARY_DARK : "#111827",
                      mb: 1,
                    }}
                  >
                    {data.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: isDark ? COLORS.TEXT.SECONDARY_DARK : "#6b7280",
                      lineHeight: 1.6,
                      fontSize: "0.95rem",
                    }}
                  >
                    {data.description}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Benefits;
