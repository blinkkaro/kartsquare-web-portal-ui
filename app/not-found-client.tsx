"use client";

import React from "react";
import { Box, Typography, Button, Container, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";
import MainLayout from "./mainLayout";
import { useTranslate } from "@/hooks/useTranslate";
import { COLORS } from "@/constants/colors";
import HomeIcon from "@mui/icons-material/Home";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

/**
 * Client-side 404 interactive UI.
 * Kept as a separate client component so not-found.tsx can be a server
 * component and export proper metadata for Googlebot.
 */
export default function NotFoundClient() {
  const router = useRouter();
  const { t } = useTranslate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <MainLayout>
      <Container maxWidth="md">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "calc(100vh - 200px)",
            textAlign: "center",
            py: { xs: 4, md: 6 },
            px: { xs: 2, md: 3 },
          }}
        >
          {/* 404 Error Code */}
          <Box
            sx={{
              position: "relative",
              mb: 4,
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "120px", sm: "150px", md: "180px" },
                fontWeight: 800,
                lineHeight: 1,
                background: isDark
                  ? `linear-gradient(135deg, ${COLORS.PRIMARY_PURPLE} 0%, ${COLORS.PRIMARY_BLUE} 100%)`
                  : `linear-gradient(135deg, ${COLORS.PRIMARY_PURPLE} 0%, ${COLORS.SECONDARY_ORANGE} 100%)`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 2,
                opacity: 0.9,
              }}
            >
              {t("error_404")}
            </Typography>

            {/* Icon Overlay */}
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                opacity: 0.1,
              }}
            >
              <ErrorOutlineIcon
                sx={{
                  fontSize: { xs: "80px", sm: "100px", md: "120px" },
                  color: COLORS.PRIMARY_PURPLE,
                }}
              />
            </Box>
          </Box>

          {/* Title */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: isDark
                ? COLORS.TEXT.PRIMARY_DARK
                : COLORS.TEXT.PRIMARY_LIGHT,
              mb: 2,
              fontSize: { xs: "24px", sm: "28px", md: "32px" },
            }}
          >
            {t("page_not_found")}
          </Typography>

          {/* Description */}
          <Typography
            variant="body1"
            sx={{
              color: isDark
                ? COLORS.TEXT.SECONDARY_DARK
                : COLORS.TEXT.SECONDARY_LIGHT,
              mb: 4,
              maxWidth: "500px",
              fontSize: { xs: "14px", sm: "16px" },
              lineHeight: 1.6,
            }}
          >
            {t("page_not_found_description")}
          </Typography>

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: { xs: "column", sm: "row" },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            <Button
              variant="contained"
              startIcon={<HomeIcon />}
              onClick={handleGoHome}
              sx={{
                bgcolor: COLORS.PRIMARY_PURPLE,
                color: COLORS.WHITE,
                px: 4,
                py: 1.5,
                fontSize: { xs: "14px", sm: "16px" },
                fontWeight: 600,
                textTransform: "none",
                borderRadius: 2,
                boxShadow: `0 4px 14px 0 ${COLORS.PRIMARY_PURPLE}40`,
                "&:hover": {
                  bgcolor: COLORS.PURPLE_HOVER,
                  boxShadow: `0 6px 20px 0 ${COLORS.PRIMARY_PURPLE}50`,
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
                minWidth: { xs: "100%", sm: "200px" },
              }}
            >
              {t("go_back_home")}
            </Button>

            <Button
              variant="outlined"
              onClick={() => router.back()}
              sx={{
                borderColor: isDark
                  ? COLORS.BORDER.DEFAULT_DARK
                  : COLORS.BORDER.DEFAULT_LIGHT,
                color: isDark
                  ? COLORS.TEXT.PRIMARY_DARK
                  : COLORS.TEXT.PRIMARY_LIGHT,
                px: 4,
                py: 1.5,
                fontSize: { xs: "14px", sm: "16px" },
                fontWeight: 600,
                textTransform: "none",
                borderRadius: 2,
                "&:hover": {
                  borderColor: COLORS.PRIMARY_PURPLE,
                  bgcolor: isDark
                    ? COLORS.PURPLE_ALPHA_10
                    : COLORS.PURPLE_ALPHA_04,
                },
                transition: "all 0.3s ease",
                minWidth: { xs: "100%", sm: "200px" },
              }}
            >
              {t("go_back")}
            </Button>
          </Box>
        </Box>
      </Container>
    </MainLayout>
  );
}
