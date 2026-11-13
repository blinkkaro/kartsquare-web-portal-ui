"use client";
import React from "react";
import { AddRounded } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import Button from "@/components/common/Button";
import PageTitle from "@/components/common/PageTitle";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";

interface ProviderServicesHeaderProps {
  title: string;
  /** Second line under the title, for example "12 listed · 9 active". */
  subtitle?: string;
  /** Providers get the primary action; everyone else sees only the title. */
  onAdd?: () => void;
}

/** Page title, a plain-language summary, and the one primary action. */
const ProviderServicesHeader = ({ title, subtitle, onAdd }: ProviderServicesHeaderProps) => {
  const { t } = useTranslate();
  return (
    <Box
      component="header"
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "stretch", sm: "center" },
        justifyContent: "space-between",
        gap: 2,
        mb: { xs: 2, md: 3 },
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <PageTitle subtitle={subtitle} subtitleProps={{ variant: "body2", sx: { mt: 0.5 } }}>
          {title}
        </PageTitle>
      </Box>
      {onAdd && (
        <Button
          onClick={onAdd}
          startIcon={<AddRounded />}
          sx={{ minHeight: 44, px: 3, whiteSpace: "nowrap" }}
        >
          {t("sv_add")}
        </Button>
      )}
    </Box>
  );
};

export default ProviderServicesHeader;
