import React from "react";
import RightDrawer from "../RightDrawer";
import { useTranslate } from "@/hooks/useTranslate";
import { COLORS } from "@/constants/colors";
import ChatInterface from "./components/ChatInterface";

function Ai({ open, onClose }: { open: boolean; onClose: () => void }) {
  const {t} = useTranslate();
  return (
    <RightDrawer
      open={open}
      onClose={onClose}
      title={t("kartAi")}
      width={600}
      titleStyle={{
        color: COLORS.PRIMARY_PURPLE,
      }}
    >
      <ChatInterface />
    </RightDrawer>
  );
}

export default Ai;
