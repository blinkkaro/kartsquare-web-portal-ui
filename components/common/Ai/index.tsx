import React from "react";
import { useTheme } from "@mui/material";
import RightDrawer from "../RightDrawer";
import { useTranslate } from "@/hooks/useTranslate";
import { COLORS } from "@/constants/colors";
import ChatInterface from "./components/ChatInterface";

function Ai({ open, onClose }: { open: boolean; onClose: () => void }) {
  const {t} = useTranslate();
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";

  return (
    <RightDrawer
      open={open}
      onClose={onClose}
      title={t("kartAi")}
      width={420}
      titleStyle={{
        color: dark ? "#fff" : "#1e293b",
        fontSize: "1.1rem",
        fontWeight: 700
      }}
      headerStyle={{
        backgroundColor: dark ? "#0a0a0a" : "#fff",
        borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "#e2e8f0"}`,
        padding: "12px 16px"
      }}
    >
      <ChatInterface />
    </RightDrawer>
  );
}

export default Ai;
