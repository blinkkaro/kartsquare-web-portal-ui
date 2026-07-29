import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import RightDrawer from "../RightDrawer";
import { useTranslate } from "@/hooks/useTranslate";
import { COLORS } from "@/constants/colors";
import ChatInterface from "./components/ChatInterface";

function Ai({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslate();
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";

  return (
    <RightDrawer
      open={open}
      onClose={onClose}
      title={t("kartAi")}
      width={420}
      headerStyle={{
        background: `linear-gradient(135deg, ${COLORS.ICON_GRADIENT.Light.START} 0%, ${COLORS.ICON_GRADIENT.Light.END} 100%)`,
        borderBottom: "none",
        padding: "16px 20px",
      }}
      closeButtonStyle={{
        backgroundColor: "rgba(255,255,255,0.9)",
      }}
      titleContent={
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 0 }}>
          <Box
            sx={{
              flexShrink: 0,
              width: 36,
              height: 36,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(255,255,255,0.18)",
              border: "1px solid rgba(255,255,255,0.35)",
            }}
          >
            <AutoAwesomeRoundedIcon sx={{ fontSize: 18, color: "#fff" }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 700, fontSize: "1.05rem", color: "#fff", lineHeight: 1.2 }}>
              {t("kartAi")}
            </Typography>
            <Typography sx={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.2 }}>
              {t("ai_powered_assistant")}
            </Typography>
          </Box>
        </Box>
      }
    >
      <ChatInterface />
    </RightDrawer>
  );
}

export default Ai;
