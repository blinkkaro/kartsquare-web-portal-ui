"use client";
import React, { useState } from "react";
import { Box, Button, Chip, InputBase, Typography } from "@mui/material";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import MicNoneRoundedIcon from "@mui/icons-material/MicNoneRounded";
import { useAppDispatch } from "@/store/hooks";
import { openAiWithQuery } from "@/features/ui/uiSlice";
import { Section, sectionTitleSx } from "./shared";
import Marquee from "./Marquee";

// Real symptoms the assistant maps to a service (see backend intent taxonomy).
const SYMPTOMS = [
  "Mera AC thanda nahi kar raha",
  "Nal se pani leak ho raha hai",
  "Light bar bar ja rahi hai",
  "Fridge thanda nahi kar raha",
  "Meri car start nahi ho rahi",
];

export default function AiAssist() {
  const dispatch = useAppDispatch();
  const [text, setText] = useState("");
  const go = (q: string) => q.trim() && dispatch(openAiWithQuery(q.trim()));

  return (
    <Section id="ai">
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 5,
          p: { xs: 2, md: 3 },
          color: "#fff",
          background: "linear-gradient(135deg, #450fa2 0%, #5e18e9 55%, #6c38cc 100%)",
          boxShadow: "0 18px 40px rgba(94,24,233,0.28)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 1.5 }}>
          <Box sx={{ width: 38, height: 38, borderRadius: 3, bgcolor: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <AutoAwesomeRoundedIcon />
          </Box>
          <Box>
            <Typography sx={{ fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.85 }}>Kart AI</Typography>
            <Typography component="h2" sx={sectionTitleSx}>Not sure what to search? Describe the problem.</Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 1.25 }}>
          <Marquee label="Common problems" duration={36} fade={false}>
            {SYMPTOMS.map((s) => (
              <Chip
                key={s}
                label={s}
                clickable
                onClick={() => go(s)}
                sx={{ height: 38, fontWeight: 600, color: "#fff", bgcolor: "rgba(255,255,255,0.16)", border: "1px solid rgba(255,255,255,0.28)", "&:hover": { bgcolor: "rgba(255,255,255,0.28)" } }}
              />
            ))}
          </Marquee>
        </Box>

        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            go(text);
          }}
          sx={{ display: "flex", alignItems: "center", gap: 1, p: 0.75, pl: 1.75, borderRadius: 4, bgcolor: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.25)" }}
        >
          <MicNoneRoundedIcon sx={{ opacity: 0.8 }} />
          <InputBase
            fullWidth
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g. washing machine kharab hai"
            inputProps={{ "aria-label": "Describe your problem", style: { fontSize: 16, color: "#fff" } }}
            sx={{ minHeight: 44, "& input::placeholder": { color: "rgba(255,255,255,0.7)", opacity: 1 } }}
          />
          <Button
            type="submit"
            disableElevation
            variant="contained"
            sx={{ minHeight: 44, px: 2.25, borderRadius: 3, textTransform: "none", fontWeight: 800, bgcolor: "#fff", color: "#450fa2", flexShrink: 0, "&:hover": { bgcolor: "#f0e8ff" } }}
          >
            Match me
          </Button>
        </Box>
      </Box>
    </Section>
  );
}
