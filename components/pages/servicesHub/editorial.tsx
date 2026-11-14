"use client";

import React from "react";
import Link from "next/link";
import { alpha, Box, Typography } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import Button from "@/components/common/Button";
import CategoryIcon from "@/components/common/CategoryIcon";
import { HOME_GUTTER, HOME_MAX_WIDTH } from "@/components/pages/home/sections/shared";
import { COLORS } from "@/constants/colors";
import { PLAY_STORE_URL } from "@/constants/app";
import type { CategoryMedia } from "@/lib/services/coverage";
import type { FaqItem } from "@/lib/services/types";
import { Breadcrumbs, CategoryVisual, type Crumb } from "./ContentBlocks";
import { SearchPersonIllustration } from "./illustrations";

const PAPER = COLORS.NEW_UI.PAGE_BG_LIGHT;
const TINT = COLORS.NEW_UI.EDITORIAL_TINT;
const INK = COLORS.NEW_UI.INK;
const LILAC = COLORS.NEW_UI.EDITORIAL_LILAC;
const bigTitle = { fontSize: { xs: "2rem", md: "2.75rem" }, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.1 } as const;
const eyebrowSx = { fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: COLORS.PRIMARY_PURPLE } as const;
const focusRing = { "&:focus-visible": { outline: `3px solid ${COLORS.PRIMARY_PURPLE}`, outlineOffset: 2 } } as const;

/** Full-width band. `tone` picks the background; content sits in the shared page width. */
export function Band({ tone = "paper", children, id, labelledBy }: { tone?: "paper" | "tint" | "ink"; children: React.ReactNode; id?: string; labelledBy?: string }) {
  const bg = tone === "ink" ? INK : tone === "tint" ? TINT : PAPER;
  return (
    <Box component="section" id={id} aria-labelledby={labelledBy} sx={{ bgcolor: bg, color: tone === "ink" ? COLORS.WHITE : "text.primary", scrollMarginTop: 80 }}>
      <Box sx={{ maxWidth: HOME_MAX_WIDTH, mx: "auto", px: HOME_GUTTER, py: { xs: 5, md: 8 } }}>{children}</Box>
    </Box>
  );
}

export function Heading({ id, eyebrow, title, lead, onDark }: { id: string; eyebrow?: string; title: string; lead?: string; onDark?: boolean }) {
  return (
    <Box sx={{ mb: { xs: 3, md: 4 }, maxWidth: 720 }}>
      {eyebrow && <Typography sx={{ ...eyebrowSx, color: onDark ? LILAC : COLORS.PRIMARY_PURPLE, mb: 1 }}>{eyebrow}</Typography>}
      <Typography id={id} component="h2" sx={bigTitle}>{title}</Typography>
      {lead && <Typography sx={{ mt: 1.5, lineHeight: 1.65, color: onDark ? "rgba(255,255,255,0.75)" : "text.secondary" }}>{lead}</Typography>}
    </Box>
  );
}

/** Brand-violet hero: white text, crumbs, label, big H1, optional italic tagline, lead, then `children` (actions) and `aside`. */
export function EditorialHero({ crumbs, eyebrow, title, tagline, lead, children, aside }: { crumbs: Crumb[]; eyebrow: string; title: string; tagline?: string; lead?: string; children?: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <Box sx={{ position: "relative", overflow: "hidden", color: COLORS.WHITE, mt: -2, background: `linear-gradient(135deg, ${COLORS.PURPLE_DEEP} 0%, ${COLORS.PURPLE_HOVER} 55%, ${COLORS.PRIMARY_PURPLE} 100%)` }}>
      <Box aria-hidden sx={{ position: "absolute", right: -140, top: -160, width: 460, height: 460, borderRadius: "50%", background: `radial-gradient(circle, ${COLORS.SECONDARY_ORANGE}40 0%, transparent 70%)` }} />
      <Box sx={{ position: "relative", maxWidth: HOME_MAX_WIDTH, mx: "auto", px: HOME_GUTTER, pt: { xs: 3, md: 4 }, pb: { xs: 5, md: 7 } }}>
        <Breadcrumbs items={crumbs} onDark />
        <Box sx={{ display: "grid", gap: { xs: 3, md: 6 }, alignItems: "center", gridTemplateColumns: aside ? { xs: "1fr", md: "1.2fr 1fr" } : "1fr" }}>
          <Box>
            <Typography sx={{ ...eyebrowSx, color: LILAC, mb: 1.5 }}>{eyebrow}</Typography>
            <Typography component="h1" sx={{ ...bigTitle, color: COLORS.WHITE, fontSize: { xs: "2.5rem", md: "4rem" }, maxWidth: 820 }}>{title}</Typography>
            {tagline && <Typography sx={{ mt: 1.5, fontStyle: "italic", fontWeight: 500, fontSize: { xs: "1rem", md: "1.2rem" }, color: COLORS.WHITE, maxWidth: 620 }}>{tagline}</Typography>}
            {lead && <Typography sx={{ mt: 2, lineHeight: 1.7, color: "rgba(255,255,255,0.88)", maxWidth: 620, fontSize: { xs: "1rem", md: "1.08rem" } }}>{lead}</Typography>}
            {children && <Box sx={{ mt: 3.5, display: "flex", flexWrap: "wrap", gap: 1.5, alignItems: "center" }}>{children}</Box>}
          </Box>
          {aside}
        </Box>
      </Box>
    </Box>
  );
}

/** Opens the Kartsquare listing on Google Play in a new tab. */
export function PlayStoreButton({ onDark = false }: { onDark?: boolean }) {
  return (
    <Button variant="contained" size="large" onClick={() => window.open(PLAY_STORE_URL, "_blank", "noopener,noreferrer")} sx={onDark ? { bgcolor: COLORS.WHITE, color: COLORS.PRIMARY_PURPLE, "&:hover": { bgcolor: TINT } } : { bgcolor: INK, color: COLORS.WHITE, "&:hover": { bgcolor: COLORS.TEXT.PRIMARY_LIGHT } }}>
      Get it on Google Play
    </Button>
  );
}

export function PillLink({ href, children, onDark = false }: { href: string; children: React.ReactNode; onDark?: boolean }) {
  return (
    <Button component={Link} href={href} variant="outlined" size="large" endIcon={<ArrowForwardRoundedIcon />} sx={onDark ? { color: COLORS.WHITE, borderColor: "rgba(255,255,255,0.7)", bgcolor: "rgba(255,255,255,0.12)", "&:hover": { borderColor: COLORS.WHITE, bgcolor: "rgba(255,255,255,0.22)" } } : { bgcolor: COLORS.WHITE }}>
      {children}
    </Button>
  );
}

export function ServiceChip({ children }: { children: React.ReactNode }) {
  return (
    <Box component="span" sx={{ display: "inline-flex", alignItems: "center", px: 2, minHeight: 44, borderRadius: "14px", bgcolor: COLORS.WHITE, border: "1px solid", borderColor: COLORS.NEW_UI.CARD_BORDER_LIGHT, fontWeight: 600, fontSize: "0.95rem" }}>
      {children}
    </Box>
  );
}

/** Square tile: big icon (or photo) over a small label and an arrow. One link per tile. */
export function CategoryTile({ href, name, media, note }: { href: string; name: string; media?: CategoryMedia; note?: string }) {
  return (
    <Box component={Link} href={href} sx={{ display: "flex", flexDirection: "column", gap: 1.5, p: 1.5, borderRadius: "20px", bgcolor: COLORS.WHITE, border: "1px solid", borderColor: COLORS.NEW_UI.CARD_BORDER_LIGHT, color: "text.primary", textDecoration: "none", transition: "border-color 150ms ease-out, transform 150ms ease-out", "&:hover": { borderColor: COLORS.PRIMARY_PURPLE, transform: "translateY(-2px)" }, "@media (prefers-reduced-motion: reduce)": { transition: "none", "&:hover": { transform: "none" } }, ...focusRing }}>
      <CategoryVisual media={media} height={{ xs: 112, md: 132 }} radius="14px" iconSize={52} />
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1, px: 0.5, pb: 0.5 }}>
        <Box>
          <Typography component="span" sx={{ display: "block", fontWeight: 600, fontSize: "0.95rem", lineHeight: 1.3 }}>{name}</Typography>
          {note && <Typography component="span" sx={{ display: "block", mt: 0.25, fontSize: "0.8rem", color: COLORS.PRIMARY_PURPLE, fontWeight: 600 }}>{note}</Typography>}
        </Box>
        <ArrowForwardRoundedIcon aria-hidden sx={{ fontSize: 18, color: "text.secondary", flex: "0 0 auto", mt: 0.25 }} />
      </Box>
    </Box>
  );
}

/** `fiveUp` locks five columns on large screens, so a full set of ten fills two even rows. */
export function TileGrid({ children, fiveUp = false }: { children: React.ReactNode; fiveUp?: boolean }) {
  return <Box sx={{ display: "grid", gap: { xs: 1.5, md: 2 }, gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(auto-fill, minmax(180px, 1fr))", ...(fiveUp ? { lg: "repeat(5, 1fr)" } : {}) } }}>{children}</Box>;
}

/** A list with a tick or a cross marker. Crosses are for what a provider or Kartsquare does not do. */
export function MarkList({ items, kind }: { items: string[]; kind: "yes" | "no" }) {
  const Mark = kind === "yes" ? CheckRoundedIcon : CloseRoundedIcon;
  return (
    <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "flex", flexDirection: "column", gap: 1.5 }}>
      {items.map((t) => (
        <Box component="li" key={t} sx={{ display: "flex", gap: 1.5, lineHeight: 1.6 }}>
          <Box aria-hidden sx={{ flex: "0 0 auto", width: 24, height: 24, mt: 0.25, borderRadius: "50%", display: "grid", placeItems: "center", bgcolor: kind === "yes" ? COLORS.PURPLE_ALPHA_10 : alpha(COLORS.ERROR_RED, 0.1), color: kind === "yes" ? COLORS.PRIMARY_PURPLE : COLORS.ERROR_RED }}>
            <Mark sx={{ fontSize: 16 }} />
          </Box>
          <Typography component="span">{t}</Typography>
        </Box>
      ))}
    </Box>
  );
}

/** Numbered vertical steps joined by a thin line. The order matters, so the numbers mean something. */
export function StepTimeline({ items }: { items: string[] }) {
  return (
    <Box component="ol" sx={{ listStyle: "none", m: 0, p: 0 }}>
      {items.map((t, i) => (
        <Box component="li" key={t} sx={{ display: "flex", gap: 2, position: "relative", pb: i === items.length - 1 ? 0 : 3 }}>
          {i < items.length - 1 && <Box aria-hidden sx={{ position: "absolute", left: 17, top: 36, bottom: 0, width: "2px", bgcolor: COLORS.NEW_UI.CARD_BORDER_LIGHT }} />}
          <Box aria-hidden sx={{ flex: "0 0 auto", width: 36, height: 36, borderRadius: "50%", display: "grid", placeItems: "center", bgcolor: COLORS.PRIMARY_PURPLE, color: COLORS.WHITE, fontWeight: 700, zIndex: 1 }}>{i + 1}</Box>
          <Typography sx={{ pt: 0.5, lineHeight: 1.65 }}>{t}</Typography>
        </Box>
      ))}
    </Box>
  );
}

/** Example request, written like a note. Nothing here is sent or stored. */
export function RequestNote({ items }: { items: string[] }) {
  return (
    <Box sx={{ p: { xs: 2.5, md: 3.5 }, borderRadius: "20px", bgcolor: COLORS.WHITE, border: "1px dashed", borderColor: COLORS.NEW_UI.OUTLINE_LIGHT }}>
      <Typography sx={{ ...eyebrowSx, mb: 2 }}>Example request</Typography>
      <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "flex", flexDirection: "column", gap: 1.5 }}>
        {items.map((t) => (
          <Box component="li" key={t} sx={{ pb: 1.5, borderBottom: "1px solid", borderColor: COLORS.NEW_UI.CARD_BORDER_LIGHT, lineHeight: 1.55 }}>{t}</Box>
        ))}
      </Box>
      <Typography sx={{ mt: 2, fontSize: "0.85rem", color: "text.secondary" }}>This is a guide to what to write. Nothing is sent from this page.</Typography>
    </Box>
  );
}

/** Native details/summary cards: keyboard and screen-reader friendly, no script. The plus turns into a cross when open. */
export function FaqAccordion({ items }: { items: FaqItem[] }) {
  // One answer open at a time: opening a question closes the previous one. The first starts open.
  const [openIndex, setOpenIndex] = React.useState(0);
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      {items.map((f, i) => (
        <Box
          component="details"
          key={f.q}
          open={openIndex === i}
          sx={{
            borderRadius: "20px",
            bgcolor: COLORS.WHITE,
            border: "1px solid",
            borderColor: COLORS.NEW_UI.CARD_BORDER_LIGHT,
            transition: "border-color 150ms ease-out",
            "&:hover": { borderColor: COLORS.NEW_UI.OUTLINE_LIGHT },
            "&[open]": { borderColor: COLORS.PRIMARY_PURPLE },
            "& summary::-webkit-details-marker": { display: "none" },
            "&[open] .faq-icon": { transform: "rotate(45deg)", bgcolor: COLORS.PRIMARY_PURPLE, color: COLORS.WHITE },
            "@media (prefers-reduced-motion: reduce)": { transition: "none", "& .faq-icon": { transition: "none" } },
          }}
        >
          <Box component="summary" onClick={(e: React.MouseEvent) => { e.preventDefault(); setOpenIndex(openIndex === i ? -1 : i); }} sx={{ listStyle: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, px: { xs: 2.5, md: 3 }, py: 2, minHeight: 64, borderRadius: "20px", ...focusRing }}>
            <Typography component="h3" sx={{ fontWeight: 600, fontSize: "1.05rem", lineHeight: 1.4 }}>{f.q}</Typography>
            <Box aria-hidden className="faq-icon" sx={{ flex: "0 0 auto", width: 36, height: 36, borderRadius: "50%", display: "grid", placeItems: "center", bgcolor: TINT, color: COLORS.PRIMARY_PURPLE, transition: "transform 200ms ease-out, background-color 200ms ease-out" }}>
              <AddRoundedIcon sx={{ fontSize: 20 }} />
            </Box>
          </Box>
          <Typography sx={{ px: { xs: 2.5, md: 3 }, pb: 2.5, pr: { md: 8 }, color: "text.secondary", lineHeight: 1.75 }}>{f.a}</Typography>
        </Box>
      ))}
    </Box>
  );
}

/** One provider's listing: name, who lists it, one link. */
export function ProviderRow({ href, title, by }: { href: string; title: string; by: string }) {
  return (
    <Box component={Link} href={href} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, p: 2.5, borderRadius: "16px", bgcolor: COLORS.WHITE, border: "1px solid", borderColor: COLORS.NEW_UI.CARD_BORDER_LIGHT, color: "text.primary", textDecoration: "none", "&:hover": { borderColor: COLORS.PRIMARY_PURPLE }, ...focusRing }}>
      <Box>
        <Typography component="span" sx={{ display: "block", fontWeight: 700 }}>{title}</Typography>
        <Typography component="span" sx={{ display: "block", fontSize: "0.9rem", color: "text.secondary" }}>Listed by {by}</Typography>
      </Box>
      <Typography component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, color: COLORS.PRIMARY_PURPLE, fontWeight: 600, whiteSpace: "nowrap" }}>
        View profile <ArrowForwardRoundedIcon aria-hidden sx={{ fontSize: 18 }} />
      </Typography>
    </Box>
  );
}

export function EmptyProviderState({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap", p: 3, borderRadius: "16px", border: "1px dashed", borderColor: COLORS.NEW_UI.OUTLINE_LIGHT, bgcolor: COLORS.WHITE, color: "text.secondary", lineHeight: 1.7 }}>
      <SearchPersonIllustration />
      <Box sx={{ flex: "1 1 260px" }}>{children}</Box>
    </Box>
  );
}

/* ---------- Illustrated phone panels (illustrations, not live data) ---------- */

function Bubble({ me, children }: { me?: boolean; children: React.ReactNode }) {
  return (
    <Box sx={{ alignSelf: me ? "flex-end" : "flex-start", maxWidth: "88%", px: 1.5, py: 1, fontSize: "0.8rem", lineHeight: 1.45, fontWeight: 500, borderRadius: me ? "14px 14px 4px 14px" : "14px 14px 14px 4px", bgcolor: me ? COLORS.PRIMARY_PURPLE : COLORS.WHITE, color: me ? COLORS.WHITE : "text.primary", boxShadow: me ? "none" : "0 1px 2px rgba(0,0,0,0.08)" }}>{children}</Box>
  );
}

/** Top of a phone, cropped by its panel. Decorative: the step text beside it says the same in words. */
function Phone({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box aria-hidden sx={{ width: "78%", maxWidth: 260, mx: "auto", mt: 4, height: 300, border: `6px solid ${INK}`, borderBottom: 0, borderRadius: "32px 32px 0 0", bgcolor: COLORS.BACKGROUND.PAPER_LIGHT, color: "text.primary", overflow: "hidden" }}>
      <Box sx={{ px: 1.75, py: 1.25, bgcolor: COLORS.WHITE, borderBottom: "1px solid", borderColor: "divider", display: "flex", alignItems: "center", gap: 1 }}>
        <AutoAwesomeRoundedIcon sx={{ fontSize: 16, color: COLORS.PRIMARY_PURPLE }} />
        <Typography component="span" sx={{ fontWeight: 700, fontSize: "0.8rem" }}>{title}</Typography>
      </Box>
      <Box sx={{ p: 1.5, display: "flex", flexDirection: "column", gap: 1 }}>{children}</Box>
    </Box>
  );
}

export interface SampleCategory { name: string; media?: CategoryMedia }

/** Three-step band on dark: each step is a violet panel with a cropped phone, and the words below. */
export function HowItWorksBand({ steps, samples }: { steps: { title: string; text: string }[]; samples: SampleCategory[] }) {
  const phones = [
    <Phone key="a" title="Kart AI">
      <Bubble me>Mera AC thanda nahi kar raha</Bubble>
      <Bubble>Samajh gayi. AC repair ki service dhoondhne mein help karti hoon. Aap kis area mein hain?</Bubble>
    </Phone>,
    <Phone key="b" title="Matching categories">
      {samples.slice(0, 3).map((s) => (
        <Box key={s.name} sx={{ display: "flex", alignItems: "center", gap: 1, p: 1, borderRadius: "12px", bgcolor: COLORS.WHITE, fontSize: "0.8rem", fontWeight: 600 }}>
          <CategoryIcon icon={s.media?.icon} color={s.media?.color} size={18} tile={30} radius="8px" />
          {s.name}
        </Box>
      ))}
    </Phone>,
    <Phone key="c" title="Send a request">
      {["What do you need?", "Your locality", "Preferred time"].map((l) => (
        <Box key={l}>
          <Typography component="span" sx={{ display: "block", fontSize: "0.7rem", color: "text.secondary", mb: 0.25 }}>{l}</Typography>
          <Box sx={{ height: 26, borderRadius: "8px", bgcolor: COLORS.WHITE, border: "1px solid", borderColor: "divider" }} />
        </Box>
      ))}
    </Phone>,
  ];
  return (
    <>
      <Box component="ol" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" } }}>
        {steps.map((s, i) => (
          <Box component="li" key={s.title}>
            <Box sx={{ borderRadius: "24px", bgcolor: COLORS.PRIMARY_PURPLE, overflow: "hidden", height: 340 }}>{phones[i]}</Box>
            <Typography sx={{ mt: 2, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", color: LILAC }}>STEP {i + 1}</Typography>
            <Typography component="h3" sx={{ mt: 0.5, fontWeight: 700, fontSize: "1.25rem" }}>{s.title}</Typography>
            <Typography sx={{ mt: 0.75, lineHeight: 1.65, color: "rgba(255,255,255,0.75)" }}>{s.text}</Typography>
          </Box>
        ))}
      </Box>
      <Typography sx={{ mt: 3, fontSize: "0.8rem", color: "rgba(255,255,255,0.55)" }}>Screens are illustrations of how the app works, not live results.</Typography>
    </>
  );
}
