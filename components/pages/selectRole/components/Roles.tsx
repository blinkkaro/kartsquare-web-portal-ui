"use client";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import React from "react";
import { RolesData } from "./data";
import Image from "next/image";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useTranslate } from "@/hooks/useTranslate";
import { TranslationKey } from "@/features/i18n/TranslationContext";
import { COLORS } from "@/constants/colors";

function Roles({ rolesData }: { rolesData: RolesData }) {
  const theme = useTheme();
  const { t } = useTranslate();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        padding: { xs: "0.875rem", sm: "1.25rem", md: "1.5rem" },
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        border: `1px solid`,
        borderColor: "divider",
        borderRadius: { xs: "12px", sm: "14px", md: "16px" },
        bgcolor: "background.paper",
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        height: "auto",
        minHeight: { xs: "auto", lg: "auto" },
        minWidth: { xs: "auto", lg: "30rem" },
        width: "100%",
        "&:hover": {
          borderColor:
            theme.palette.mode === "light"
              ? COLORS.BORDER.HOVER_LIGHT
              : COLORS.BORDER.HOVER_DARK,
          boxShadow: `0 10px 25px -5px ${COLORS.SHADOW.HOVER}, 0 8px 10px -6px ${COLORS.SHADOW.DEFAULT}`,
          transform: "translateY(-2px)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: { xs: "0.75rem", sm: "1rem", md: "1.25rem" },
        }}
      >
        {/* Icon Container */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: COLORS.PURPLECYAN,
            borderRadius: "50%",
            width: { xs: "44px", sm: "52px", md: "56px" },
            height: { xs: "44px", sm: "52px", md: "56px" },
            padding: { xs: "10px", sm: "11px", md: "12px" },
            boxShadow: `inset 0 2px 4px 0 ${COLORS.SHADOW.DEFAULT}`,
            flexShrink: 0,
          }}
        >
          <Image
            src={`/icons/${rolesData.icon}.svg`}
            alt={rolesData.name}
            width={56}
            height={56}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </Box>

        {/* Text Container */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: "0.1rem", sm: "0.3rem", md: "0.4rem" },
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "center",
          }}
        >
          <Typography
            variant={isMobile ? "body2" : "h6"}
            component="span"
            sx={{
              color: "text.secondary",
              fontWeight: 400,
              fontSize: { xs: "0.813rem", sm: "0.938rem", md: "1.063rem" },
              whiteSpace: "nowrap",
            }}
          >
            {t("continue_as")}
          </Typography>
          <Typography
            variant={isMobile ? "body1" : "h6"}
            component="span"
            sx={{
              fontWeight: 600,
              color: "text.primary",
              fontSize: { xs: "0.938rem", sm: "1.063rem", md: "1.188rem" },
              lineHeight: { xs: 1.2, sm: 1.4, md: 1.6 },
              whiteSpace: "nowrap",
            }}
          >
            {t(rolesData.name as TranslationKey)}
          </Typography>
        </Box>
      </Box>

      {/* Arrow Button */}
      <Box sx={{ pl: { xs: "0.5rem", sm: "0.75rem", md: "1rem" } }}>
        <Box
          sx={{
            bgcolor: "primary.main",
            color: "common.white",
            borderRadius: "50%",
            width: { xs: "30px", sm: "36px", md: "40px" },
            height: { xs: "30px", sm: "36px", md: "40px" },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease",
            flexShrink: 0,
          }}
        >
          <ChevronRightIcon
            sx={{
              fontSize: { xs: "1.125rem", sm: "1.375rem", md: "1.5rem" },
              transition: "transform 0.3s ease",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default Roles;
