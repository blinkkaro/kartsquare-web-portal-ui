"use client";

import React from "react";
import Link from "next/link";
import { Box, Typography } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import Button from "@/components/common/Button";
import { editorialBody, editorialEyebrow, editorialFocus, editorialTitle, HAIRLINE } from "@/components/pages/home/sections/editorialStyles";
import { HOME_GUTTER, HOME_MAX_WIDTH } from "@/components/pages/home/sections/shared";
import { COLORS } from "@/constants/colors";
import { PLAY_STORE_URL } from "@/constants/app";
import type { CategoryMedia } from "@/lib/services/coverage";
import type { FaqItem } from "@/lib/services/types";
import { Breadcrumbs, CategoryVisual, type Crumb } from "./ContentBlocks";
import { SearchPersonIllustration } from "./illustrations";

const PAPER = COLORS.NEW_UI.PAGE_BG_LIGHT;
const INK = COLORS.NEW_UI.INK;
const LILAC = COLORS.NEW_UI.EDITORIAL_LILAC;
const focusRing = editorialFocus;
const pill = { borderRadius: 999, minHeight: 52, px: 3.5, textTransform: "none", fontWeight: 600, boxShadow: "none" } as const;

const VIOLET = `linear-gradient(160deg, ${COLORS.PURPLE_HOVER} 0%, ${COLORS.PURPLE_DEEP} 100%)`;
/** The home page hero's gradient. */
const HERO_VIOLET = `linear-gradient(135deg, ${COLORS.PURPLE_DEEP} 0%, ${COLORS.PURPLE_HOVER} 55%, ${COLORS.PRIMARY_PURPLE} 100%)`;
const BAND_BG = { paper: PAPER, tint: COLORS.NEW_UI.EDITORIAL_TINT, ink: VIOLET, night: INK } as const;

/** Soft orange glow in a dark panel's corner, as on the home page's violet bands. */
function Glow() {
  return <Box aria-hidden sx={{ position: "absolute", width: 520, height: 520, right: -180, top: -220, borderRadius: "50%", background: `radial-gradient(circle, ${COLORS.SECONDARY_ORANGE}40 0%, transparent 68%)`, pointerEvents: "none" }} />;
}

export type BandTone = keyof typeof BAND_BG;

/** Full-width band. Alternate tones down a page: `paper` and lavender `tint` are light, `ink` (violet) and `night` are dark. */
export function Band({ tone = "paper", children, id, labelledBy }: { tone?: BandTone; children: React.ReactNode; id?: string; labelledBy?: string }) {
  const dark = tone === "ink" || tone === "night";
  return (
    <Box component="section" id={id} aria-labelledby={labelledBy} sx={{ position: "relative", overflow: dark ? "hidden" : "visible", color: dark ? COLORS.WHITE : "text.primary", scrollMarginTop: 132, background: BAND_BG[tone] }}>
      {dark && <Glow />}
      <Box sx={{ position: "relative", maxWidth: HOME_MAX_WIDTH, mx: "auto", px: HOME_GUTTER, py: { xs: 6, md: 10 } }}>{children}</Box>
    </Box>
  );
}

export function Heading({ id, eyebrow, title, lead, onDark }: { id: string; eyebrow?: string; title: string; lead?: string; onDark?: boolean }) {
  return (
    <Box sx={{ mb: { xs: 4, md: 5 }, maxWidth: 720 }}>
      {eyebrow && <Typography sx={{ ...editorialEyebrow, mb: 1.25, ...(onDark && { color: LILAC }) }}>{eyebrow}</Typography>}
      <Typography id={id} component="h2" sx={{ ...editorialTitle, ...(onDark && { color: COLORS.WHITE }) }}>{title}</Typography>
      {lead && <Typography sx={{ ...editorialBody, mt: 1.5, ...(onDark && { color: "rgba(255,255,255,0.82)" }) }}>{lead}</Typography>}
    </Box>
  );
}

/** Violet hero, as on the home page: crumbs, label, large H1, tagline, lead and actions; `aside` on the right, `strip` along the bottom. */
export function EditorialHero({ crumbs, eyebrow, title, tagline, lead, children, aside, strip }: { crumbs: Crumb[]; eyebrow: string; title: string; tagline?: string; lead?: string; children?: React.ReactNode; aside?: React.ReactNode; strip?: React.ReactNode }) {
  return (
    <Box sx={{ mt: -2, position: "relative", overflow: "hidden", color: COLORS.WHITE, background: HERO_VIOLET }}>
      <Glow />
      <Box sx={{ position: "relative", maxWidth: HOME_MAX_WIDTH, mx: "auto", px: HOME_GUTTER, pt: { xs: 3, md: 5 }, pb: { xs: 6, md: 9 } }}>
        <Breadcrumbs items={crumbs} onDark />
        <Box sx={{ mt: { xs: 3, md: 5 }, display: "grid", gap: { xs: 5, md: 8 }, alignItems: "center", gridTemplateColumns: aside ? { xs: "minmax(0, 1fr)", md: "minmax(0, 7fr) minmax(0, 5fr)" } : "minmax(0, 1fr)" }}>
          <Box>
            <Typography sx={{ ...editorialEyebrow, color: LILAC }}>{eyebrow}</Typography>
            <Typography component="h1" sx={{ mt: 2.5, maxWidth: 760, fontSize: { xs: "2.25rem", sm: "2.875rem", lg: "3.5rem" }, fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1.08, color: COLORS.WHITE, textWrap: "balance" }}>{title}</Typography>
            {tagline && <Typography sx={{ mt: 2.5, maxWidth: 600, fontWeight: 500, fontSize: { xs: "1.0625rem", md: "1.25rem" }, lineHeight: 1.55, color: COLORS.WHITE }}>{tagline}</Typography>}
            {lead && <Typography sx={{ ...editorialBody, mt: 2, maxWidth: 600, color: "rgba(255,255,255,0.82)" }}>{lead}</Typography>}
            {children && <Box sx={{ mt: 4, display: "flex", flexWrap: "wrap", gap: 1.5, alignItems: "center" }}>{children}</Box>}
          </Box>
          {aside}
        </Box>
      </Box>
      {strip && <Box sx={{ position: "relative", maxWidth: HOME_MAX_WIDTH, mx: "auto", px: HOME_GUTTER }}>{strip}</Box>}
    </Box>
  );
}

/** Opens the Kartsquare listing on Google Play in a new tab. */
export function PlayStoreButton({ onDark = false }: { onDark?: boolean }) {
  return (
    <Button variant="contained" size="large" onClick={() => window.open(PLAY_STORE_URL, "_blank", "noopener,noreferrer")} sx={{ ...pill, ...(onDark ? { bgcolor: COLORS.WHITE, color: INK, "&:hover": { bgcolor: COLORS.NEW_UI.EDITORIAL_TINT, boxShadow: "none" } } : { bgcolor: INK, color: COLORS.WHITE, "&:hover": { bgcolor: COLORS.PRIMARY_PURPLE, boxShadow: "none" } }) }}>
      Get it on Google Play
    </Button>
  );
}

export function PillLink({ href, children, onDark = false }: { href: string; children: React.ReactNode; onDark?: boolean }) {
  return (
    <Button component={Link} href={href} variant="outlined" size="large" endIcon={<ArrowForwardRoundedIcon />} sx={{ ...pill, ...(onDark ? { color: COLORS.WHITE, borderColor: "rgba(255,255,255,0.6)", "&:hover": { borderColor: COLORS.WHITE, bgcolor: "rgba(255,255,255,0.12)" } } : { color: INK, borderColor: INK, "&:hover": { borderColor: INK, bgcolor: INK, color: COLORS.WHITE } }) }}>
      {children}
    </Button>
  );
}

export function ServiceChip({ children }: { children: React.ReactNode }) {
  return (
    <Box component="span" sx={{ display: "inline-flex", alignItems: "center", px: 2.25, minHeight: 44, borderRadius: 999, border: "1px solid", borderColor: COLORS.NEW_UI.OUTLINE_LIGHT, color: INK, fontWeight: 500, fontSize: "0.95rem" }}>
      {children}
    </Box>
  );
}

/** A photo (or icon tile) with its name underneath. No card chrome: the picture is the surface. One link per tile. */
export function CategoryTile({ href, name, media, note }: { href: string; name: string; media?: CategoryMedia; note?: string }) {
  return (
    <Box component={Link} href={href} sx={{ display: "flex", flexDirection: "column", gap: 1.5, color: INK, textDecoration: "none", "& .tile-photo > div": { transition: "transform 200ms ease-out" }, "&:hover .tile-photo > div": { transform: "scale(1.04)" }, "&:hover .tile-name": { color: COLORS.PRIMARY_PURPLE }, "&:hover .tile-arrow": { color: COLORS.PRIMARY_PURPLE, transform: "translateX(4px)" }, "@media (prefers-reduced-motion: reduce)": { "& .tile-photo > div, & .tile-arrow": { transition: "none" }, "&:hover .tile-photo > div, &:hover .tile-arrow": { transform: "none" } }, ...focusRing }}>
      <Box className="tile-photo" sx={{ borderRadius: "18px", overflow: "hidden" }}>
        <CategoryVisual media={media} height={{ xs: 128, md: 176 }} radius="0px" iconSize={48} />
      </Box>
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1 }}>
        <Box>
          <Typography component="span" className="tile-name" sx={{ display: "block", fontWeight: 600, fontSize: "1rem", lineHeight: 1.35, transition: "color 150ms ease-out" }}>{name}</Typography>
          {note && <Typography component="span" sx={{ display: "block", mt: 0.5, fontSize: "0.8rem", color: "text.secondary" }}>{note}</Typography>}
        </Box>
        <ArrowForwardRoundedIcon aria-hidden className="tile-arrow" sx={{ fontSize: 18, color: "text.secondary", flex: "0 0 auto", mt: 0.25, transition: "transform 150ms ease-out, color 150ms ease-out" }} />
      </Box>
    </Box>
  );
}

/** `fiveUp` locks five columns on large screens, so a full set of ten fills two even rows. */
export function TileGrid({ children, fiveUp = false }: { children: React.ReactNode; fiveUp?: boolean }) {
  return <Box sx={{ display: "grid", columnGap: { xs: 1.5, md: 3 }, rowGap: { xs: 3, md: 4 }, gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", sm: "repeat(auto-fill, minmax(200px, 1fr))", ...(fiveUp ? { lg: "repeat(5, minmax(0, 1fr))" } : {}) } }}>{children}</Box>;
}

/** A ruled list with a tick or a cross marker. Crosses are for what a provider or Kartsquare does not do. */
export function MarkList({ items, kind }: { items: string[]; kind: "yes" | "no" }) {
  const Mark = kind === "yes" ? CheckRoundedIcon : CloseRoundedIcon;
  return (
    <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, borderTop: HAIRLINE }}>
      {items.map((t) => (
        <Box component="li" key={t} sx={{ display: "flex", gap: 2, py: 2, borderBottom: HAIRLINE, lineHeight: 1.65 }}>
          <Mark aria-hidden sx={{ flex: "0 0 auto", fontSize: 20, mt: "3px", color: kind === "yes" ? COLORS.PRIMARY_PURPLE : COLORS.TEXT.SECONDARY_LIGHT }} />
          <Typography component="span" sx={{ lineHeight: 1.65, color: INK }}>{t}</Typography>
        </Box>
      ))}
    </Box>
  );
}

/** Numbered, ruled steps. The order matters, so the numbers mean something. */
export function StepTimeline({ items }: { items: string[] }) {
  return (
    <Box component="ol" sx={{ listStyle: "none", m: 0, p: 0, borderTop: HAIRLINE }}>
      {items.map((t, i) => (
        <Box component="li" key={t} sx={{ display: "flex", gap: 2.5, py: 2, borderBottom: HAIRLINE }}>
          <Typography component="span" aria-hidden sx={{ flex: "0 0 auto", pt: "4px", fontSize: "0.75rem", fontWeight: 700, color: COLORS.PRIMARY_PURPLE, fontVariantNumeric: "tabular-nums" }}>{String(i + 1).padStart(2, "0")}</Typography>
          <Typography sx={{ lineHeight: 1.65, color: INK }}>{t}</Typography>
        </Box>
      ))}
    </Box>
  );
}

/** Example request, set like a sheet of paper. Nothing here is sent or stored. */
export function RequestNote({ items }: { items: string[] }) {
  return (
    <Box sx={{ p: { xs: 3, md: 5 }, borderRadius: "24px", bgcolor: COLORS.WHITE, border: "1px solid", borderColor: COLORS.NEW_UI.CARD_BORDER_LIGHT, boxShadow: COLORS.NEW_UI.CARD_SHADOW_LIGHT }}>
      <Typography sx={{ ...editorialEyebrow, mb: 2 }}>Example request</Typography>
      <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0 }}>
        {items.map((t) => (
          <Box component="li" key={t} sx={{ py: 1.75, borderBottom: HAIRLINE, lineHeight: 1.6, color: INK }}>{t}</Box>
        ))}
      </Box>
      <Typography sx={{ mt: 2, fontSize: "0.85rem", color: "text.secondary" }}>This is a guide to what to write. Nothing is sent from this page.</Typography>
    </Box>
  );
}

/** Native details/summary rows: keyboard and screen-reader friendly. The plus turns into a cross when open. */
export function FaqAccordion({ items }: { items: FaqItem[] }) {
  // One answer open at a time: opening a question closes the previous one. The first starts open.
  const [openIndex, setOpenIndex] = React.useState(0);
  return (
    <Box sx={{ borderTop: HAIRLINE }}>
      {items.map((f, i) => (
        <Box
          component="details"
          key={f.q}
          open={openIndex === i}
          sx={{
            borderBottom: HAIRLINE,
            "& summary::-webkit-details-marker": { display: "none" },
            "&[open] .faq-icon": { transform: "rotate(45deg)", bgcolor: INK, borderColor: INK, color: COLORS.WHITE },
            "@media (prefers-reduced-motion: reduce)": { "& .faq-icon": { transition: "none" } },
          }}
        >
          <Box component="summary" onClick={(e: React.MouseEvent) => { e.preventDefault(); setOpenIndex(openIndex === i ? -1 : i); }} sx={{ listStyle: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, py: 2.5, minHeight: 72, ...focusRing }}>
            <Typography component="h3" sx={{ fontWeight: 600, fontSize: "1.125rem", lineHeight: 1.4, color: INK }}>{f.q}</Typography>
            <Box aria-hidden className="faq-icon" sx={{ flex: "0 0 auto", width: 36, height: 36, borderRadius: "50%", display: "grid", placeItems: "center", border: "1px solid", borderColor: COLORS.NEW_UI.OUTLINE_LIGHT, color: INK, transition: "transform 200ms ease-out, background-color 200ms ease-out" }}>
              <AddRoundedIcon sx={{ fontSize: 20 }} />
            </Box>
          </Box>
          <Typography sx={{ ...editorialBody, pb: 3, pr: { md: 8 } }}>{f.a}</Typography>
        </Box>
      ))}
    </Box>
  );
}

/** One provider's listing: name, who lists it, one link. */
export function ProviderRow({ href, title, by }: { href: string; title: string; by: string }) {
  return (
    <Box component={Link} href={href} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, py: 2.5, minHeight: 88, borderBottom: HAIRLINE, color: INK, textDecoration: "none", "&:hover .row-title": { color: COLORS.PRIMARY_PURPLE }, ...focusRing }}>
      <Box>
        <Typography component="span" className="row-title" sx={{ display: "block", fontWeight: 600, fontSize: "1.125rem" }}>{title}</Typography>
        <Typography component="span" sx={{ display: "block", mt: 0.25, fontSize: "0.9rem", color: "text.secondary" }}>Listed by {by}</Typography>
      </Box>
      <Typography component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, color: COLORS.PRIMARY_PURPLE, fontWeight: 600, whiteSpace: "nowrap" }}>
        View profile <ArrowForwardRoundedIcon aria-hidden sx={{ fontSize: 18 }} />
      </Typography>
    </Box>
  );
}

export function EmptyProviderState({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap", maxWidth: 820, py: 3, borderTop: HAIRLINE, borderBottom: HAIRLINE, color: "text.secondary", lineHeight: 1.7 }}>
      <SearchPersonIllustration />
      <Box sx={{ flex: "1 1 260px" }}>{children}</Box>
    </Box>
  );
}

/** Three steps as ruled columns. */
export function HowItWorksBand({ steps }: { steps: { title: string; text: string }[] }) {
  return (
    <Box component="ol" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", columnGap: 5, gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "repeat(3, minmax(0, 1fr))" } }}>
      {steps.map((step, n) => (
        <Box component="li" key={step.title} sx={{ py: 3.5, borderTop: `1px solid ${INK}` }}>
          <Typography component="span" aria-hidden sx={{ display: "block", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.12em", color: COLORS.PRIMARY_PURPLE }}>{String(n + 1).padStart(2, "0")}</Typography>
          <Typography component="h3" sx={{ mt: 2, fontWeight: 600, fontSize: "1.25rem", color: INK }}>{step.title}</Typography>
          <Typography sx={{ ...editorialBody, mt: 1 }}>{step.text}</Typography>
        </Box>
      ))}
    </Box>
  );
}
