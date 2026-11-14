"use client";

import React from "react";
import Image from "next/image";
import { Box, Typography } from "@mui/material";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import Button from "@/components/common/Button";
import { COLORS } from "@/constants/colors";
import { APP_SCREENS, type AppScreen } from "@/constants/app";
import { useAppDispatch } from "@/store/hooks";
import { openAiWithQuery } from "@/features/ui/uiSlice";
import { Band, Heading, PlayStoreButton, StepTimeline } from "./editorial";

const STEPS = [
  "Tell Kart AI the problem in Hindi, Hinglish or English. Type it or say it out loud.",
  "See the services and categories that fit, around your location.",
  "Open a provider's profile and send a request. You agree the details with the provider directly.",
];

/** Real phrases the home page already shows to customers. */
export const TRY_ASKING = ["Mera AC thanda nahi kar raha", "Nal se pani leak ho raha hai", "Fridge thanda nahi kar raha", "Meri car start nahi ho rahi"];

function Bubble({ me, children }: { me?: boolean; children: React.ReactNode }) {
  return (
    <Box sx={{ alignSelf: me ? "flex-end" : "flex-start", maxWidth: "86%", px: 1.75, py: 1.1, fontSize: "0.875rem", lineHeight: 1.5, fontWeight: 500, borderRadius: me ? "16px 16px 4px 16px" : "16px 16px 16px 4px", bgcolor: me ? COLORS.PRIMARY_PURPLE : COLORS.WHITE, color: me ? COLORS.WHITE : "text.primary", boxShadow: me ? "none" : "0 1px 2px rgba(0,0,0,0.08)" }}>{children}</Box>
  );
}

/** Phone-shaped illustration of one Kart AI chat. An example, not a live request. */
function ChatPhone() {
  return (
    <Box role="img" aria-label="Example Kart AI chat: a customer says their geyser is broken and Kart AI asks which area they are in" sx={{ width: "100%", maxWidth: 290, mx: "auto", p: 0.75, borderRadius: "34px", bgcolor: COLORS.NEW_UI.INK, boxShadow: "0 24px 48px rgba(37,10,100,0.22)" }}>
      <Box sx={{ borderRadius: "28px", overflow: "hidden", bgcolor: COLORS.BACKGROUND.PAPER_LIGHT }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, px: 2, py: 1.5, bgcolor: COLORS.WHITE, borderBottom: "1px solid", borderColor: "divider" }}>
          <Box sx={{ width: 30, height: 30, borderRadius: "50%", display: "grid", placeItems: "center", bgcolor: COLORS.PRIMARY_PURPLE, color: COLORS.WHITE }}><AutoAwesomeRoundedIcon sx={{ fontSize: 17 }} /></Box>
          <Box>
            <Typography component="span" sx={{ display: "block", fontWeight: 700, fontSize: "0.875rem", lineHeight: 1.2 }}>Kart AI</Typography>
            <Typography component="span" sx={{ display: "block", fontSize: "0.75rem", color: "text.secondary" }}>Example conversation</Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25, p: 2, minHeight: 240 }}>
          <Bubble>Namaste! Aapko kya help chahiye?</Bubble>
          <Bubble me>Mera geyser kharab ho gaya hai</Bubble>
          <Bubble>Samajh gayi. Geyser repair ki service dhoondhne mein help karti hoon. Aap kis area mein hain?</Bubble>
        </Box>
      </Box>
    </Box>
  );
}

interface KartAiHowItWorksProps {
  /** Override the screenshots (defaults to APP_SCREENS). The strip is hidden when there are none. */
  screens?: AppScreen[];
  /** Optional line under the heading, e.g. naming the category. */
  intro?: string;
}

/** Shared "How Kart AI works" band: a tinted panel with steps, tap-to-ask phrases, the Play Store link and an example chat. */
const KartAiHowItWorks: React.FC<KartAiHowItWorksProps> = ({ screens = APP_SCREENS, intro }) => {
  const dispatch = useAppDispatch();
  return (
    <Band id="kart-ai" labelledBy="kart-ai-title">
      <Box sx={{ display: "grid", gap: { xs: 4, md: 6 }, gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr" }, alignItems: "center", p: { xs: 3, md: 6 }, borderRadius: "32px", bgcolor: COLORS.NEW_UI.EDITORIAL_TINT }}>
        <Box>
          <Heading id="kart-ai-title" eyebrow="Kart AI" title="How Kart AI works" lead={intro ?? "Describe what is wrong in your own words and Kart AI points you to the right kind of service."} />
          <StepTimeline items={STEPS} />
          <Typography sx={{ mt: 4, mb: 1, fontSize: "0.875rem", fontWeight: 700 }}>Try asking</Typography>
          <Box component="ul" sx={{ display: "flex", flexWrap: "wrap", gap: 1, listStyle: "none", m: 0, p: 0 }}>
            {TRY_ASKING.map((q) => (
              <li key={q}><Button variant="outlined" size="small" sx={{ bgcolor: COLORS.WHITE }} onClick={() => dispatch(openAiWithQuery(q))}>{q}</Button></li>
            ))}
          </Box>
          <Box sx={{ mt: 3, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 2 }}>
            <PlayStoreButton />
            <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>Kart AI is also in the Kartsquare Android app.</Typography>
          </Box>
        </Box>
        <ChatPhone />
      </Box>
      {screens.length > 0 && (
        <Box component="ul" aria-label="App screenshots" sx={{ display: "flex", gap: 2, listStyle: "none", m: 0, mt: 3, p: 0, overflowX: "auto", pb: 1 }}>
          {screens.map((sc) => (
            <Box component="li" key={sc.src} sx={{ flex: "0 0 auto", width: 200 }}>
              <Box sx={{ position: "relative", aspectRatio: "9 / 19", borderRadius: "24px", overflow: "hidden", border: "1px solid", borderColor: "divider", bgcolor: "background.paper" }}>
                <Image src={sc.src} alt={sc.alt} fill sizes="200px" style={{ objectFit: "cover", objectPosition: "top" }} />
              </Box>
              <Typography sx={{ mt: 1, fontSize: "0.875rem", color: "text.secondary" }}>{sc.caption}</Typography>
            </Box>
          ))}
        </Box>
      )}
    </Band>
  );
};

export default KartAiHowItWorks;
