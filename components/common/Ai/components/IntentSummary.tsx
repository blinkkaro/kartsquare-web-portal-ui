import React, { useState } from "react";
import { Box, Chip, Typography } from "@mui/material";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import SwapHorizRoundedIcon from "@mui/icons-material/SwapHorizRounded";
import { COLORS } from "@/constants/colors";
import { AIAlternative, AIUnderstanding } from "@/services/ai/aiInterface";
import { fadeUp, MIN_TOUCH } from "./motion";

interface Props {
  understanding: AIUnderstanding;
  alternatives: AIAlternative[];
  locationChip: React.ReactNode;
  onChangeService: (a: AIAlternative) => void;
  disabled?: boolean;
}

/** "What I understood": service, problem, place - with one-tap corrections. */
export default function IntentSummary({ understanding: u, alternatives, locationChip, onChangeService, disabled }: Props) {
  const [showAlts, setShowAlts] = useState(false);
  const place = [u.location.locality, u.location.city].filter(Boolean).join(", ");
  const medium = u.tier === "medium";

  return (
    <Box
      sx={{
        ...fadeUp,
        p: 1.5,
        borderRadius: 3,
        bgcolor: COLORS.PURPLE_ALPHA_04,
        border: `1px solid ${COLORS.PURPLE_ALPHA_10}`,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
        <AutoAwesomeRoundedIcon sx={{ fontSize: 16, color: COLORS.PRIMARY_PURPLE }} />
        <Typography sx={{ fontWeight: 700, fontSize: "0.95rem" }}>{u.label}</Typography>
      </Box>
      {(u.problem || medium) && (
        <Typography sx={{ fontSize: "0.78rem", color: "text.secondary", mt: 0.25 }}>
          {u.problem}
          {u.problem && medium ? " · " : ""}
          {medium && (u.fuzzy ? "Corrected spelling — not what you meant?" : "Not what you meant?")}
        </Typography>
      )}

      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1, mt: 1 }} aria-label={place ? `Searching in ${place}` : undefined}>
        {locationChip}
        {alternatives.length > 0 && (
          <Chip
            icon={<SwapHorizRoundedIcon sx={{ fontSize: 16 }} />}
            label="Change service"
            clickable
            disabled={disabled}
            onClick={() => setShowAlts((v) => !v)}
            aria-expanded={showAlts}
            sx={{
              height: 32,
              fontWeight: 600,
              fontSize: "0.78rem",
              position: "relative",
              "&::after": { content: '""', position: "absolute", inset: `-${(MIN_TOUCH - 32) / 2}px 0` },
            }}
          />
        )}
      </Box>

      {showAlts && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mt: 1 }}>
          {alternatives.map((a) => (
            <Chip
              key={a.key}
              label={a.label}
              clickable
              disabled={disabled}
              onClick={() => {
                setShowAlts(false);
                onChangeService(a);
              }}
              sx={{ height: 34, fontWeight: 600, bgcolor: "background.paper", border: `1px solid ${COLORS.PURPLE_ALPHA_20}` }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
