"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { ContentCopyRounded, WhatsApp } from "@mui/icons-material";
import toast from "react-hot-toast";
import Button from "@/components/common/Button";
import { COLORS } from "@/constants/colors";
import { SITE_URL } from "@/lib/seo/buildMetadata";
import { useTranslate } from "@/hooks/useTranslate";
import { publicProfilePath } from "@/lib/providerDashboard";
import { DASHBOARD_BUTTON_SX } from "./buttonSx";

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
        bgcolor: COLORS.WHITE,
        border: `1px solid ${COLORS.NEW_UI.CARD_BORDER_LIGHT}`,
        boxShadow: COLORS.NEW_UI.CARD_SHADOW_LIGHT,
      }}
    >
      <Box
        sx={{
          display: "grid",
          gap: { xs: 2, md: 3 },
          alignItems: "center",
          gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 1fr) auto" },
        }}
      >
        <Box sx={{ minWidth: 0 }}>
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
        </Box>
        {/* One column on a phone, side by side from small screens up; both the same size. */}
        <Box
          sx={{
            display: "grid",
            gap: 1.5,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              md: "repeat(2, 200px)",
            },
          }}
        >
          <Button
            variant="outlined"
            onClick={copy}
            startIcon={<ContentCopyRounded />}
            fullWidth
            sx={DASHBOARD_BUTTON_SX}
          >
            {t("pd_copy_link")}
          </Button>
          <Button
            onClick={() => window.open(whatsappHref, "_blank", "noopener,noreferrer")}
            startIcon={<WhatsApp />}
            fullWidth
            sx={DASHBOARD_BUTTON_SX}
          >
            {t("pd_share_whatsapp")}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ShareKit;
