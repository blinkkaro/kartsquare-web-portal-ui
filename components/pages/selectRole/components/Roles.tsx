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
        width: "100%",
        padding: { xs: "1rem", sm: "1.5rem" },
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        border: `1px solid ${COLORS.BORDER.DEFAULT}`,
        borderRadius: "16px",
        bgcolor: COLORS.WHITE,
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        height: "auto",
        minHeight: { xs: "auto", lg: "auto" },
        "&:hover": {
          borderColor: COLORS.BORDER.HOVER,
          boxShadow: `0 10px 25px -5px ${COLORS.SHADOW.HOVER}, 0 8px 10px -6px ${COLORS.SHADOW.DEFAULT}`,
          transform: "translateY(-2px)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: { xs: "0.75rem", sm: "1.25rem" },
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
            width: { xs: "48px", sm: "56px" },
            height: { xs: "48px", sm: "56px" },
            padding: "12px",
            boxShadow: `inset 0 2px 4px 0 ${COLORS.SHADOW.DEFAULT}`,
            flexShrink: 0,
          }}
        >
          <Image
            src={`/icons/${rolesData.icon}.svg`}
            alt={rolesData.name}
            width={32}
            height={32}
            style={{ width: "100%", height: "auto" }}
          />
        </Box>

        {/* Text Container */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: "0", sm: "0.3rem" },
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "center",
          }}
        >
          <Typography
            variant={isMobile ? "body2" : "h6"}
            component="span"
            sx={{
              color: COLORS.TEXT_GRAY,
              fontWeight: 400,
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
              color: COLORS.TEXT_DARK,
              lineHeight: { xs: 1.2, sm: 1.6 },
            }}
          >
            {t(rolesData.name as TranslationKey)}
          </Typography>
        </Box>
      </Box>

      {/* Arrow Button */}
      <Box sx={{ pl: 1 }}>
        <Box
          sx={{
            bgcolor: COLORS.PRIMARY_PURPLE,
            color: COLORS.WHITE,
            borderRadius: "50%",
            width: { xs: "32px", sm: "40px" },
            height: { xs: "32px", sm: "40px" },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease",
          }}
        >
          <ChevronRightIcon sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem" } }} />
        </Box>
      </Box>
    </Box>
  );
}

export default Roles;
