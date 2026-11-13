"use client";
import React, { useRef } from "react";
import { Box, ButtonBase } from "@mui/material";
import { motion, useReducedMotion } from "framer-motion";
import { COLORS } from "@/constants/colors";
import { FEED_SPRING } from "../feedMotion";

export interface FeedTab<T extends string> {
  id: T;
  label: string;
}

interface FeedTabsProps<T extends string> {
  tabs: ReadonlyArray<FeedTab<T>>;
  value: T;
  onChange: (id: T) => void;
  ariaLabel: string;
  /** Rendered at the right end of the row (the phone "+" button). */
  trailing?: React.ReactNode;
}

/**
 * The feed's tab bar: one violet pill that slides to the selected tab. Arrow keys, Home and End move
 * the selection (roving tab stop), as the tabs pattern expects. Under reduced motion the pill jumps.
 */
export default function FeedTabs<T extends string>({ tabs, value, onChange, ariaLabel, trailing }: FeedTabsProps<T>) {
  const reduce = useReducedMotion() === true;
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  const move = (to: number) => {
    const next = (to + tabs.length) % tabs.length;
    onChange(tabs[next].id);
    refs.current[next]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowRight") move(index + 1);
    else if (e.key === "ArrowLeft") move(index - 1);
    else if (e.key === "Home") move(0);
    else if (e.key === "End") move(tabs.length - 1);
    else return;
    e.preventDefault();
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: { xs: 1.5, sm: 0 }, py: { xs: 1.5, sm: 0 }, mb: { xs: 0, sm: 2 } }}>
      <Box
        role="tablist"
        aria-label={ariaLabel}
        sx={{ display: "inline-flex", gap: 0.25, p: 0.5, borderRadius: "999px", bgcolor: COLORS.NEW_UI.SURFACE_SOFT_LIGHT, border: `1px solid ${COLORS.NEW_UI.CARD_BORDER_LIGHT}` }}
      >
        {tabs.map((t, i) => {
          const selected = t.id === value;
          return (
            <ButtonBase
              key={t.id}
              ref={(el: HTMLButtonElement | null) => {
                refs.current[i] = el;
              }}
              id={`feed-tab-${t.id}`}
              role="tab"
              aria-selected={selected}
              aria-controls="feed-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(t.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              sx={{
                position: "relative",
                height: 40,
                minWidth: 76,
                px: 2.25,
                borderRadius: "999px",
                fontSize: "0.86rem",
                fontWeight: 700,
                color: selected ? COLORS.WHITE : "text.primary",
                transition: "color 160ms ease",
                "&:hover": selected ? {} : { color: COLORS.PRIMARY_PURPLE },
                "&.Mui-focusVisible": { outline: `3px solid ${COLORS.PURPLE_ALPHA_30}`, outlineOffset: 2 },
                "@media (prefers-reduced-motion: reduce)": { transition: "none" },
              }}
            >
              {selected && (
                <motion.span
                  layoutId="feed-tab-pill"
                  transition={reduce ? { duration: 0 } : FEED_SPRING}
                  style={{ position: "absolute", inset: 0, borderRadius: 999, background: COLORS.PRIMARY_PURPLE, boxShadow: "0 4px 12px rgba(94, 24, 233, 0.3)" }}
                />
              )}
              <Box component="span" sx={{ position: "relative", zIndex: 1 }}>
                {t.label}
              </Box>
            </ButtonBase>
          );
        })}
      </Box>
      {trailing}
    </Box>
  );
}
