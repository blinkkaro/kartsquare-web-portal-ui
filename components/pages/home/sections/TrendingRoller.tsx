"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import NorthEastRoundedIcon from "@mui/icons-material/NorthEastRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import AcUnitRoundedIcon from "@mui/icons-material/AcUnitRounded";
import PlumbingRoundedIcon from "@mui/icons-material/PlumbingRounded";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import CleaningServicesRoundedIcon from "@mui/icons-material/CleaningServicesRounded";
import ContentCutRoundedIcon from "@mui/icons-material/ContentCutRounded";
import { COLORS } from "@/constants/colors";

const ROLL_MS = 600;
const HOLD_MS = 2800;
const ORANGE = "#f97316";
const NO_MOTION = "@media (prefers-reduced-motion: reduce)";

type IconType = typeof AcUnitRoundedIcon;

/** Suggestion text -> icon, so each suggestion signals its service at a glance. Unknown text gets the sparkle. */
const SUGGESTION_ICONS: ReadonlyArray<readonly [RegExp, IconType]> = [
  [/\b(ac|cooler|fridge)\b/i, AcUnitRoundedIcon],
  [/plumb|nal|pipe|leak/i, PlumbingRoundedIcon],
  [/photo|video|wedding|shaadi/i, CameraAltRoundedIcon],
  [/car|bike|auto|mechanic/i, DirectionsCarRoundedIcon],
  [/electric|light|wiring|bijli/i, BoltRoundedIcon],
  [/clean|safai|maid|pest/i, CleaningServicesRoundedIcon],
  [/salon|makeup|beauty|hair|parlou?r/i, ContentCutRoundedIcon],
];
const iconFor = (text: string): IconType => SUGGESTION_ICONS.find(([re]) => re.test(text))?.[1] ?? AutoAwesomeRoundedIcon;

/** [soft tint, ink] per slot - rotates so consecutive suggestions never share a colour. */
const TINTS: ReadonlyArray<readonly [string, string]> = [
  [COLORS.PURPLE_ALPHA_10, COLORS.PRIMARY_PURPLE],
  ["rgba(249,115,22,0.14)", "#c2410c"],
  ["rgba(13,148,136,0.14)", "#0f766e"],
  ["rgba(225,29,116,0.12)", "#be185d"],
];

interface Props {
  suggestions: string[];
  /** Called with the suggestion text when the user taps it. */
  onPick: (text: string) => void;
}

/**
 * One suggestion at a time, rolling like a rotating drum: the current one flips up and away
 * while the next flips up from below. Auto-advances, pauses on hover/focus/touch, and dots let
 * the user jump. With prefers-reduced-motion it never auto-rotates and swaps without animation.
 */
export default function TrendingRoller({ suggestions, onPick }: Props) {
  const [idx, setIdx] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const clearPrev = useRef<ReturnType<typeof setTimeout> | null>(null);
  const count = suggestions.length;

  const idxRef = useRef(0);
  const goTo = useCallback((next: number) => {
    const cur = idxRef.current;
    if (next === cur) return;
    idxRef.current = next;
    setPrev(cur);
    setIdx(next);
    if (clearPrev.current) clearTimeout(clearPrev.current);
    clearPrev.current = setTimeout(() => setPrev(null), ROLL_MS);
  }, []);

  useEffect(() => {
    if (paused || count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => goTo((idx + 1) % count), HOLD_MS);
    return () => clearInterval(t);
  }, [paused, count, idx, goTo]);
  useEffect(() => () => { if (clearPrev.current) clearTimeout(clearPrev.current); }, []);

  if (count === 0) return null;
  const safeIdx = idx % count;

  const renderChip = (i: number, state: "in" | "out" | "idle") => {
    const text = suggestions[i];
    const Icon = iconFor(text);
    const [tint, ink] = TINTS[i % TINTS.length];
    const live = state !== "out";
    return (
      <Box
        key={`${i}-${state}`}
        component={live ? "button" : "div"}
        type={live ? "button" : undefined}
        onClick={live ? () => onPick(text) : undefined}
        aria-hidden={live ? undefined : true}
        tabIndex={live ? 0 : -1}
        sx={{
          position: state === "out" ? "absolute" : "relative",
          inset: state === "out" ? "0 auto auto 0" : undefined,
          display: "flex",
          alignItems: "center",
          gap: 1.25,
          maxWidth: "100%",
          minHeight: 52,
          pl: 0.875,
          pr: 2,
          border: 0,
          borderRadius: 99,
          cursor: live ? "pointer" : "default",
          font: "inherit",
          fontSize: { xs: "0.88rem", md: "0.95rem" },
          fontWeight: 700,
          color: "text.primary",
          bgcolor: "background.paper",
          boxShadow: `0 6px 20px ${tint}, 0 0 0 1px ${tint}`,
          transformOrigin: "50% 50%",
          backfaceVisibility: "hidden",
          pointerEvents: live ? "auto" : "none",
          animation: state === "in" ? `ksRollIn ${ROLL_MS}ms cubic-bezier(.2,.8,.2,1) both` : state === "out" ? `ksRollOut ${ROLL_MS}ms cubic-bezier(.6,0,.8,.4) both` : "none",
          transition: "box-shadow 180ms ease",
          "&:hover": { boxShadow: `0 10px 26px ${tint}, 0 0 0 1.5px ${ink}` },
          "&:hover .arrow": { transform: "translate(2px,-2px)" },
          "&:focus-visible": { outline: `3px solid ${COLORS.PRIMARY_PURPLE}`, outlineOffset: 2 },
          [NO_MOTION]: { animation: "none", transition: "none" },
        }}
      >
        <Box aria-hidden sx={{ width: 36, height: 36, flexShrink: 0, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: tint, color: ink }}>
          <Icon sx={{ fontSize: 20 }} />
        </Box>
        <Box component="span" sx={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{text}</Box>
        <NorthEastRoundedIcon className="arrow" aria-hidden sx={{ ml: "auto", flexShrink: 0, fontSize: 18, color: ink, transition: "transform 180ms ease" }} />
      </Box>
    );
  };

  return (
    <Box
      sx={{
        mt: 2.5,
        maxWidth: 440,
        "@keyframes ksRollIn": {
          from: { opacity: 0, transform: "perspective(500px) translateY(70%) rotateX(-75deg)" },
          to: { opacity: 1, transform: "perspective(500px) translateY(0) rotateX(0)" },
        },
        "@keyframes ksRollOut": {
          from: { opacity: 1, transform: "perspective(500px) translateY(0) rotateX(0)" },
          to: { opacity: 0, transform: "perspective(500px) translateY(-70%) rotateX(75deg)" },
        },
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 1.25 }}>
        <LocalFireDepartmentRoundedIcon sx={{ fontSize: 18, color: ORANGE }} />
        <Typography component="span" sx={{ fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "text.secondary" }}>
          Trending near you
        </Typography>
      </Box>

      {/* the slot clips the drum so chips appear to roll out of / into it */}
      <Box sx={{ position: "relative", overflow: "hidden", py: 0.75, mx: -0.5, px: 0.5 }}>
        {prev !== null && prev % count !== safeIdx && renderChip(prev % count, "out")}
        {renderChip(safeIdx, prev !== null ? "in" : "idle")}
      </Box>

      {count > 1 && (
        <Box role="group" aria-label="Choose a suggestion" sx={{ display: "flex", alignItems: "center", gap: 0.25, mt: 0.5 }}>
          {suggestions.map((s, i) => {
            const on = i === safeIdx;
            return (
              <Box
                key={s}
                component="button"
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Show suggestion ${i + 1}: ${s}`}
                aria-current={on}
                sx={{ width: 28, height: 28, p: 0, border: 0, bgcolor: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", "&:focus-visible": { outline: `3px solid ${COLORS.PRIMARY_PURPLE}`, borderRadius: 2 } }}
              >
                <Box aria-hidden sx={{ width: on ? 22 : 7, height: 7, borderRadius: 4, bgcolor: on ? COLORS.PRIMARY_PURPLE : COLORS.PURPLE_ALPHA_30, transition: "width 260ms cubic-bezier(.2,.7,.2,1), background-color 200ms ease", [NO_MOTION]: { transition: "none" } }} />
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
