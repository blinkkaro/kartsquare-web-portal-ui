"use client";
import React from "react";
import Link from "next/link";
import { Box, Typography } from "@mui/material";
import { COLORS } from "@/constants/colors";
import { HOME_GUIDE_INTRO, HOME_SEASON_LINES, SEASON_SOURCES } from "@/data/services/hubCopy";
import { editorialBody, editorialEyebrow, editorialSection, editorialTitle } from "./editorialStyles";
import { HOME_GUTTER, HOME_MAX_WIDTH, Section } from "./shared";

/** Months (0 = January) covered by each entry of HOME_SEASON_LINES, in the same order. February sits in two. */
const SEASON_MONTHS = [[1, 2], [3, 4, 5], [6, 7, 8], [9, 10], [11, 0, 1]];

/** Which season it is now. Set after mount so server and browser render the same first frame. */
function useCurrentSeason() {
  const [index, setIndex] = React.useState(-1);
  React.useEffect(() => {
    const month = new Date().getMonth();
    setIndex(SEASON_MONTHS.findIndex((m) => m.includes(month)));
  }, []);
  return index;
}

/* Colours for the violet band: the same gradient, glow and orange accent as the Top pros band. */
const SOFT_WHITE = "rgba(255,255,255,0.82)";
const FAINT_LINE = "rgba(255,255,255,0.2)";
const darkFocus = { "&:focus-visible": { outline: `2px solid ${COLORS.SECONDARY_ORANGE}`, outlineOffset: 3 } } as const;
const inlineLink = { color: COLORS.WHITE, fontWeight: 600, textUnderlineOffset: "4px", ...darkFocus } as const;

/** Keyword-bearing local guide for the home page, as a full-width violet band: word of mouth, then the year in Jaipur. */
export default function LocalGuide() {
  const now = useCurrentSeason();
  return (
    <Box sx={{ position: "relative", overflow: "hidden", color: COLORS.WHITE, background: `linear-gradient(160deg, ${COLORS.PURPLE_HOVER} 0%, ${COLORS.PURPLE_DEEP} 100%)` }}>
      <Box aria-hidden sx={{ position: "absolute", width: 520, height: 520, right: -180, top: -220, borderRadius: "50%", background: `radial-gradient(circle, ${COLORS.SECONDARY_ORANGE}40 0%, transparent 68%)`, pointerEvents: "none" }} />
      <Box sx={{ position: "relative", maxWidth: HOME_MAX_WIDTH, mx: "auto", px: HOME_GUTTER }}>
        <Section id="local-guide" sx={editorialSection}>
          <Box sx={{ display: "grid", gap: { xs: 3, md: 8, lg: 12 }, gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 5fr) minmax(0, 7fr)" }, alignItems: "start" }}>
            <Box>
              <Typography sx={{ ...editorialEyebrow, color: COLORS.NEW_UI.EDITORIAL_LILAC }}>Local services in Jaipur</Typography>
              <Typography component="h2" sx={{ ...editorialTitle, color: COLORS.WHITE, mt: 1.25 }}>Word of mouth, on one page</Typography>
            </Box>
            <Box sx={{ maxWidth: 660, pt: { md: 3.5 } }}>
              {HOME_GUIDE_INTRO.map((p, i) => (
                <Typography key={p} sx={{ ...editorialBody, color: SOFT_WHITE, mt: i === 0 ? 0 : 2.5, ...(i === 0 && { fontSize: { xs: "1.0625rem", md: "1.1875rem" }, color: COLORS.WHITE }), }}>{p}</Typography>
              ))}
            </Box>
          </Box>

          {/* The year as one ruled line: five stops, with the current season marked. */}
          <Box sx={{ mt: { xs: 6, md: 9 } }}>
            <Typography component="h3" sx={{ fontWeight: 600, fontSize: "1.125rem", color: COLORS.WHITE, mb: 3 }}>The year in Jaipur, for your home</Typography>
            <Box component="ol" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: { xs: 0, md: 3 }, gridTemplateColumns: { xs: "1fr", md: "repeat(5, minmax(0, 1fr))" } }}>
              {HOME_SEASON_LINES.map((s, i) => {
                const on = i === now;
                return (
                  <Box component="li" key={s.months} aria-current={on ? "date" : undefined} sx={{ position: "relative", pt: { xs: 0, md: 3.5 }, pl: { xs: 3.5, md: 0 }, pb: { xs: 3, md: 0 }, borderTop: { md: "1px solid" }, borderLeft: { xs: "1px solid", md: "none" }, borderColor: { xs: on ? COLORS.SECONDARY_ORANGE : FAINT_LINE, md: on ? COLORS.SECONDARY_ORANGE : FAINT_LINE } }}>
                    <Box aria-hidden sx={{ position: "absolute", top: { xs: 5, md: -6 }, left: { xs: -6, md: 0 }, width: 11, height: 11, borderRadius: "50%", bgcolor: on ? COLORS.SECONDARY_ORANGE : COLORS.PURPLE_DEEP, border: "1px solid", borderColor: on ? COLORS.SECONDARY_ORANGE : "rgba(255,255,255,0.55)", boxShadow: on ? `0 0 0 5px ${COLORS.SECONDARY_ORANGE}33` : "none" }} />
                    <Typography sx={{ fontWeight: 700, fontSize: "0.95rem", color: COLORS.WHITE }}>
                      {s.months}
                      {on && <Box component="span" sx={{ ml: 1, px: 1, py: 0.25, borderRadius: 999, bgcolor: COLORS.SECONDARY_ORANGE, color: COLORS.NEW_UI.INK, fontSize: "0.7rem", fontWeight: 700, verticalAlign: "middle" }}>Now</Box>}
                    </Typography>
                    <Typography sx={{ mt: 1, fontSize: "0.92rem", lineHeight: 1.65, color: on ? COLORS.WHITE : SOFT_WHITE, maxWidth: { md: 230 } }}>{s.text}</Typography>
                  </Box>
                );
              })}
            </Box>
            <Typography sx={{ mt: { xs: 1, md: 4 }, fontSize: "0.8rem", color: SOFT_WHITE }}>
              Weather from the{" "}
              <Box component="a" href={SEASON_SOURCES[0].href} target="_blank" rel="noopener noreferrer" sx={{ color: "inherit", ...darkFocus }}>IMD climate record for Jaipur</Box>
              .{" "}
              <Box component={Link} href="/explore-services#seasons" sx={inlineLink}>Read the full calendar</Box>
            </Typography>
          </Box>
        </Section>
      </Box>
    </Box>
  );
}
