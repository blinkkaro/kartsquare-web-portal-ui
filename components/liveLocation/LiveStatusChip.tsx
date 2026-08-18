"use client";

import React, { useEffect, useState } from "react";
import { Box, Chip, Tooltip, Typography, keyframes } from "@mui/material";
import { useAppSelector } from "@/store/hooks";
import { selectLiveLocation } from "@/features/ui/liveLocationSlice";
import { useTranslate } from "@/hooks/useTranslate";

const pulse = keyframes`
  0%   { opacity: 1; }
  50%  { opacity: 0.35; }
  100% { opacity: 1; }
`;

/** Formats the remaining lease as a short countdown. */
function remaining(expiresAt: string | null, now: number): string | null {
  if (!expiresAt) return null;
  const ms = Date.parse(expiresAt) - now;
  if (!Number.isFinite(ms) || ms <= 0) return null;
  const mins = Math.floor(ms / 60_000);
  if (mins >= 60) {
    const h = Math.floor(mins / 60);
    return `${h}h ${mins % 60}m`;
  }
  if (mins >= 1) return `${mins}m`;
  return `${Math.floor(ms / 1000)}s`;
}

/**
 * Always-visible indicator that the provider is broadcasting.
 *
 * Being live is a state a provider must never be able to forget they are in,
 * so this belongs in the dashboard shell rather than only on the settings
 * screen where the toggle lives.
 */
export default function LiveStatusChip() {
  const { isBroadcasting, expiresAt, areaLabel } =
    useAppSelector(selectLiveLocation);
  const { t } = useTranslate();
  const [now, setNow] = useState(() => Date.now());

  // Ticks only while live, so an idle dashboard is not re-rendering every second.
  useEffect(() => {
    if (!isBroadcasting) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [isBroadcasting]);

  if (!isBroadcasting) return null;

  const left = remaining(expiresAt, now);

  return (
    <Tooltip
      title={
        <Box>
          <Typography variant="caption" display="block">
            {t("liveLocationChipTooltip")}
          </Typography>
          {left && (
            <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
              {t("liveLocationExpiresIn")} {left}
            </Typography>
          )}
        </Box>
      }
    >
      <Chip
        size="small"
        color="error"
        variant="filled"
        aria-live="polite"
        icon={
          <Box
            component="span"
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: "currentColor",
              ml: 1,
              animation: `${pulse} 2s ease-in-out infinite`,
              "@media (prefers-reduced-motion: reduce)": {
                animation: "none",
              },
            }}
          />
        }
        label={
          <Typography variant="caption" fontWeight={700}>
            {t("liveLocationLive")}
            {areaLabel ? ` · ${areaLabel}` : ""}
            {left ? ` · ${left}` : ""}
          </Typography>
        }
        sx={{ fontWeight: 700 }}
      />
    </Tooltip>
  );
}
