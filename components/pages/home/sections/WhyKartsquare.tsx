import React from "react";
import { Box, Typography } from "@mui/material";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import PhotoLibraryOutlinedIcon from "@mui/icons-material/PhotoLibraryOutlined";
import BalanceRoundedIcon from "@mui/icons-material/BalanceRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import { COLORS } from "@/constants/colors";
import { PANEL_PX, Section, SectionTitle } from "./shared";

const REASONS = [
  { icon: GridViewRoundedIcon, title: "Local businesses in one place", body: "Services, shops and professionals in your city, searchable from one page." },
  { icon: PhotoLibraryOutlinedIcon, title: "See real work first", body: "Photos, reels and portfolios before you decide who to call." },
  { icon: BalanceRoundedIcon, title: "Compare with ease", body: "Consistent profiles make it simple to weigh options side by side." },
  { icon: ChatBubbleOutlineRoundedIcon, title: "Connect directly", body: "Call or send an enquiry, and book where it's offered." },
] as const;

/** Static value props. Server component: no client JS. Replaces the old "How it works" steps. */
export default function WhyKartsquare() {
  return (
    <Section sx={{ pb: { xs: 4, md: 8 } }}>
      <Box sx={{ px: PANEL_PX, py: { xs: 0, md: 5 }, borderRadius: { xs: 0, md: 6 }, bgcolor: { xs: "transparent", md: "background.paper" } }}>
        <SectionTitle>Why Kartsquare?</SectionTitle>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" }, gap: { xs: 2.5, md: 4.5 }, mt: { xs: 2.5, md: 4 } }}>
          {REASONS.map(({ icon: Icon, title, body }) => (
            <Box key={title} sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
              <Box sx={{ width: 44, height: 44, borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: COLORS.PURPLE_ALPHA_10, color: COLORS.PRIMARY_PURPLE }}>
                <Icon sx={{ fontSize: 22 }} />
              </Box>
              <Typography component="h3" sx={{ mt: 0.75, fontSize: { xs: "0.95rem", md: "1.05rem" }, fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1.3 }}>{title}</Typography>
              <Typography sx={{ fontSize: { xs: "0.82rem", md: "0.92rem" }, lineHeight: 1.5, color: "text.secondary" }}>{body}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Section>
  );
}
