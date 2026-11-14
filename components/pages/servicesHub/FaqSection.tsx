"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import Button from "@/components/common/Button";
import { COLORS } from "@/constants/colors";
import { openAiNewChat } from "@/features/ui/uiSlice";
import { useAppDispatch } from "@/store/hooks";
import type { FaqItem } from "@/lib/services/types";
import { Band, FaqAccordion, Heading } from "./editorial";
import { AvatarStack } from "./illustrations";

interface FaqSectionProps {
  items: FaqItem[];
  title?: string;
  intro?: string;
}

/** FAQ band: heading and a "still unsure" card on the left, the questions on the right. Stacks on small screens. */
const FaqSection: React.FC<FaqSectionProps> = ({ items, title = "Questions people ask", intro = "Short answers to what customers ask before they send a request." }) => {
  const dispatch = useAppDispatch();
  return (
    <Band tone="tint" id="faq" labelledBy="faq-title">
      <Box sx={{ display: "grid", gap: { xs: 4, md: 8 }, gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) minmax(0, 1.7fr)" }, alignItems: "start" }}>
        <Box sx={{ position: { md: "sticky" }, top: { md: 96 } }}>
          <Heading id="faq-title" eyebrow="FAQ" title={title} lead={intro} />
          <Box sx={{ p: 3, borderRadius: "20px", bgcolor: COLORS.WHITE, border: "1px solid", borderColor: COLORS.NEW_UI.CARD_BORDER_LIGHT }}>
            <AvatarStack />
            <Typography component="h3" sx={{ mt: 2, fontWeight: 700, fontSize: "1.05rem" }}>Still not sure?</Typography>
            <Typography sx={{ mt: 0.5, mb: 2, color: "text.secondary", lineHeight: 1.65 }}>Ask Kart AI in Hindi, Hinglish or English and it will point you to the right service.</Typography>
            <Button variant="outlined" onClick={() => dispatch(openAiNewChat())}>Ask Kart AI</Button>
          </Box>
        </Box>
        <FaqAccordion items={items} />
      </Box>
    </Band>
  );
};

export default FaqSection;
