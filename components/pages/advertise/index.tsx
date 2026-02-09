"use client";
import ProfileWrapper from "@/components/common/profile/profileWrapper";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import { Box, Typography, useTheme } from "@mui/material";
import React from "react";

function AdvertiseView() {
  const { t } = useTranslate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  return (
    <ProfileWrapper showBackButton>
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
            fontWeight: "500",
            color: isDark
              ? COLORS.TEXT.PRIMARY_DARK
              : COLORS.TEXT.PRIMARY_LIGHT,
          }}
        >
          {t("advertisement")}
        </Typography>
      </Box>
    </ProfileWrapper>
  );
}

export default AdvertiseView;
