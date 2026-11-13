"use client";

import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { ContentCopyRounded, WhatsApp } from "@mui/icons-material";
import toast from "react-hot-toast";
import { COLORS } from "@/constants/colors";
import { SITE_URL } from "@/lib/seo/buildMetadata";
import { useTranslate } from "@/hooks/useTranslate";
import { publicProfilePath } from "@/lib/providerDashboard";

interface ShareKitProps {
  username: string | null;
}

const ShareKit: React.FC<ShareKitProps> = ({ username }) => {
  const { t } = useTranslate();
  const path = publicProfilePath(username);
  if (!path) return null;
  const url = `${SITE_URL}${path}`;
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(t("pd_share_message", { url }))}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success(t("pd_link_copied"));
    } catch {
      // Clipboard blocked: the URL stays visible and selectable below.
      toast.error(t("pd_link_copy_failed"));
    }
  };

  return (
    <Box
      component="section"
      aria-labelledby="share-kit-title"
      sx={{
        borderRadius: "16px",
        p: 3,
        bgcolor: "background.paper",
        border: `1px solid ${COLORS.NEW_UI.CARD_BORDER_LIGHT}`,
        boxShadow: COLORS.NEW_UI.CARD_SHADOW_LIGHT,
      }}
    >
      <Typography id="share-kit-title" variant="h6" component="h2">
        {t("pd_share_title")}
      </Typography>
      <Typography variant="body2" sx={{ color: COLORS.TEXT.SECONDARY_LIGHT, mt: 0.5, mb: 2 }}>
        {t("pd_share_sub")}
      </Typography>
      <Box
        sx={{
          px: 2,
          py: 1.5,
          mb: 2,
          borderRadius: "12px",
          bgcolor: COLORS.NEW_UI.SURFACE_SOFT_LIGHT,
          border: `1px dashed ${COLORS.NEW_UI.CARD_BORDER_HOVER_LIGHT}`,
          typography: "body2",
          overflowWrap: "anywhere",
          userSelect: "all",
        }}
      >
        {url}
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
        <Button
          onClick={copy}
          variant="outlined"
          startIcon={<ContentCopyRounded />}
          sx={{
            flex: 1,
            minWidth: 140,
            minHeight: 48,
            borderRadius: "12px",
            fontWeight: 700,
            textTransform: "none",
            borderColor: COLORS.PRIMARY_PURPLE,
            color: COLORS.PRIMARY_PURPLE,
          }}
        >
          {t("pd_copy_link")}
        </Button>
        <Button
          component="a"
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          variant="contained"
          startIcon={<WhatsApp />}
          sx={{
            flex: 1,
            minWidth: 140,
            minHeight: 48,
            borderRadius: "12px",
            fontWeight: 700,
            textTransform: "none",
            bgcolor: COLORS.SUCCESS_GREEN,
            color: COLORS.TEXT.PRIMARY_LIGHT,
            "&:hover": { bgcolor: COLORS.SUCCESS_GREEN, filter: "brightness(0.95)" },
          }}
        >
          {t("pd_share_whatsapp")}
        </Button>
      </Box>
    </Box>
  );
};

export default ShareKit;
