"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Box, Typography } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CategoryIcon from "@/components/common/CategoryIcon";
import { editorialBody, editorialFocus, HAIRLINE } from "@/components/pages/home/sections/editorialStyles";
import { HOME_GUTTER, HOME_MAX_WIDTH } from "@/components/pages/home/sections/shared";
import { COLORS } from "@/constants/colors";
import cloudinaryLoader, { isCloudinaryUrl } from "@/lib/cloudinaryLoader";
import type { GuideSection, Symptom } from "@/lib/services/types";

const focusRing = editorialFocus;
const INK = COLORS.NEW_UI.INK;
const still = "@media (prefers-reduced-motion: reduce)";

export interface TocItem {
  id: string;
  label: string;
}

/** "On this page" jump links: a quiet sticky row of text. Plain anchors, so they work without script. */
export function GuideToc({ items }: { items: TocItem[] }) {
  return (
    <Box component="nav" aria-label="On this page" sx={{ position: "sticky", top: { xs: 56, md: 64 }, zIndex: 10, bgcolor: COLORS.NEW_UI.PAGE_BG_LIGHT, borderTop: HAIRLINE, borderBottom: HAIRLINE }}>
      <Box component="ul" sx={{ display: "flex", gap: { xs: 3, md: 4.5 }, overflowX: "auto", listStyle: "none", m: 0, mx: "auto", px: HOME_GUTTER, py: 0, maxWidth: HOME_MAX_WIDTH, scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}>
        {items.map((t) => (
          <Box component="li" key={t.id} sx={{ flex: "0 0 auto" }}>
            <Box component="a" href={`#${t.id}`} sx={{ display: "inline-flex", alignItems: "center", minHeight: 52, fontSize: "0.9rem", fontWeight: 500, color: "text.secondary", textDecoration: "none", borderBottom: "2px solid transparent", transition: "color 150ms ease-out, border-color 150ms ease-out", "&:hover": { color: INK, borderColor: INK }, ...focusRing }}>
              {t.label}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

/** Long-form copy: ruled columns, each an H3 and plain paragraphs at a readable line length. */
export function GuideArticle({ sections }: { sections: GuideSection[] }) {
  return (
    <Box sx={{ display: "grid", columnGap: { md: 8 }, rowGap: { xs: 4, md: 6 }, gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "repeat(2, minmax(0, 1fr))" } }}>
      {sections.map((s) => (
        <Box component="article" key={s.heading} sx={{ pt: 3, borderTop: `1px solid ${INK}`, maxWidth: 640 }}>
          <Typography component="h3" sx={{ fontWeight: 600, fontSize: "1.25rem", lineHeight: 1.35, mb: 1.5, color: INK }}>{s.heading}</Typography>
          {s.paragraphs.map((p) => (
            <Typography key={p} sx={{ ...editorialBody, "& + &": { mt: 1.5 } }}>{p}</Typography>
          ))}
        </Box>
      ))}
    </Box>
  );
}

/** What a customer notices, and what it often points to. A numbered, ruled grid. */
export function SymptomGrid({ items }: { items: Symptom[] }) {
  return (
    <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", columnGap: 5, gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(2, minmax(0, 1fr))", lg: "repeat(3, minmax(0, 1fr))" } }}>
      {items.map((s, i) => (
        <Box component="li" key={s.sign} sx={{ py: 3.5, borderTop: HAIRLINE }}>
          <Typography component="span" aria-hidden sx={{ display: "block", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", color: COLORS.PRIMARY_PURPLE }}>{String(i + 1).padStart(2, "0")}</Typography>
          <Typography component="h3" sx={{ mt: 1.5, fontWeight: 600, fontSize: "1.125rem", lineHeight: 1.4, color: INK }}>{s.sign}</Typography>
          <Typography sx={{ ...editorialBody, mt: 1, fontSize: "0.95rem" }}>{s.meaning}</Typography>
        </Box>
      ))}
    </Box>
  );
}

const arrowCircle = { flex: "0 0 auto", width: 40, height: 40, borderRadius: "50%", display: "grid", placeItems: "center", border: "1px solid", borderColor: COLORS.NEW_UI.OUTLINE_LIGHT, transition: "background-color 150ms ease-out, color 150ms ease-out, transform 150ms ease-out" } as const;
const arrowHover = {
  "&:hover .go-title": { color: COLORS.PRIMARY_PURPLE },
  "&:hover .go-arrow": { bgcolor: COLORS.PRIMARY_PURPLE, borderColor: COLORS.PRIMARY_PURPLE, color: COLORS.WHITE, transform: "translateX(4px)" },
  [still]: { "& .go-arrow": { transition: "none" }, "&:hover .go-arrow": { transform: "none" } },
} as const;

/** A service guide: icon, name, one line, one link for the whole block. */
export function GuideCard({ href, name, text, icon, color, card = false }: { href: string; name: string; text: string; icon: string; color?: string | null; card?: boolean }) {
  return (
    <Box component={Link} href={href} sx={{ display: "flex", flexDirection: "column", height: "100%", color: INK, textDecoration: "none", ...(card ? { p: { xs: 3, md: 3.5 }, borderRadius: "24px", bgcolor: COLORS.WHITE } : { py: 3.5, borderTop: `1px solid ${INK}` }), ...arrowHover, ...focusRing, ...(card && { "&:focus-visible": { outline: `3px solid ${COLORS.SECONDARY_ORANGE}`, outlineOffset: 3 } }) }}>
      <CategoryIcon icon={icon} color={color} size={32} {...(card && { size: 28, tile: 56, radius: "16px" })} />
      <Typography component="span" className="go-title" sx={{ display: "block", mt: 2.5, fontWeight: 600, fontSize: "1.25rem", lineHeight: 1.3 }}>{name}</Typography>
      <Typography component="span" sx={{ display: "block", mt: 1, flex: 1, fontSize: "0.95rem", color: "text.secondary", lineHeight: 1.65 }}>{text}</Typography>
      <Box sx={{ mt: 3, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
        <Typography component="span" sx={{ fontWeight: 600, fontSize: "0.9rem" }}>Read the guide</Typography>
        <Box component="span" aria-hidden className="go-arrow" sx={arrowCircle}><ArrowForwardRoundedIcon sx={{ fontSize: 18 }} /></Box>
      </Box>
    </Box>
  );
}

export function GuideGrid({ children, cards = false }: { children: React.ReactNode; cards?: boolean }) {
  return <Box sx={{ display: "grid", columnGap: cards ? 2.5 : 5, rowGap: cards ? 2.5 : 2, gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(2, minmax(0, 1fr))", lg: "repeat(3, minmax(0, 1fr))" } }}>{children}</Box>;
}

/** A pill that is a link. Same look as ServiceChip, with a hover state and focus ring. */
export function ChipLink({ href, children, onDark = false }: { href: string; children: React.ReactNode; onDark?: boolean }) {
  return (
    <Box component={Link} href={href} sx={{ display: "inline-flex", alignItems: "center", gap: 0.75, px: 2.25, minHeight: 44, borderRadius: 999, fontWeight: 500, fontSize: "0.92rem", textDecoration: "none", border: "1px solid", transition: "border-color 150ms ease-out, color 150ms ease-out, background-color 150ms ease-out", ...(onDark ? { color: COLORS.WHITE, borderColor: "rgba(255,255,255,0.4)", "&:hover": { bgcolor: "rgba(255,255,255,0.14)" } } : { color: INK, borderColor: COLORS.NEW_UI.OUTLINE_LIGHT, "&:hover": { borderColor: INK } }), ...focusRing }}>
      {children}
      <ArrowForwardRoundedIcon aria-hidden sx={{ fontSize: 16 }} />
    </Box>
  );
}

/** Problems in the customer's own words, set as an index of ruled rows. */
export function SituationGrid({ items, color }: { items: { label: string; hint: string; href: string; icon: string }[]; color?: string | null }) {
  return (
    <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", columnGap: 6, gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(2, minmax(0, 1fr))", xl: "repeat(4, minmax(0, 1fr))" } }}>
      {items.map((s) => (
        <Box component="li" key={s.label} sx={{ borderTop: HAIRLINE }}>
          <Box component={Link} href={s.href} sx={{ display: "flex", alignItems: "center", gap: 2, py: 2.5, minHeight: 92, height: "100%", color: INK, textDecoration: "none", ...arrowHover, ...focusRing }}>
            <CategoryIcon icon={s.icon} color={color} size={28} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography component="span" className="go-title" sx={{ display: "block", fontWeight: 600, fontSize: "1.0625rem", lineHeight: 1.35 }}>{s.label}</Typography>
              <Typography component="span" sx={{ display: "block", mt: 0.5, fontSize: "0.875rem", color: "text.secondary", lineHeight: 1.45 }}>{s.hint}</Typography>
            </Box>
            <Box component="span" aria-hidden className="go-arrow" sx={arrowCircle}><ArrowForwardRoundedIcon sx={{ fontSize: 18 }} /></Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

/** The year in Jaipur as one ruled line. Made for the violet band. */
export function SeasonTimeline({ items }: { items: { months: string; title: string; text: string; links: { label: string; href: string }[] }[] }) {
  return (
    <Box component="ol" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", columnGap: 3, rowGap: 5, gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "repeat(2, minmax(0, 1fr))", lg: "repeat(3, minmax(0, 1fr))", xl: "repeat(5, minmax(0, 1fr))" } }}>
      {items.map((s) => (
        <Box component="li" key={s.months} sx={{ position: "relative", pt: 3.5, display: "flex", flexDirection: "column", "&::before": { content: '""', position: "absolute", top: 0, left: 0, right: 0, height: "1px", bgcolor: "rgba(255,255,255,0.25)" }, "&::after": { content: '""', position: "absolute", top: -5, left: 0, width: 11, height: 11, borderRadius: "50%", bgcolor: COLORS.SECONDARY_ORANGE } }}>
          <Typography component="span" sx={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: COLORS.NEW_UI.EDITORIAL_LILAC }}>{s.months}</Typography>
          <Typography component="h3" sx={{ mt: 1, fontWeight: 600, fontSize: "1.2rem", lineHeight: 1.3, color: COLORS.WHITE }}>{s.title}</Typography>
          <Typography sx={{ mt: 1.25, flex: 1, fontSize: "0.95rem", lineHeight: 1.7, color: "rgba(255,255,255,0.8)" }}>{s.text}</Typography>
          <Box component="ul" sx={{ listStyle: "none", m: 0, mt: 2, p: 0 }}>
            {s.links.map((l) => (
              <li key={l.label}>
                <Box component={Link} href={l.href} sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, minHeight: 36, color: COLORS.WHITE, fontWeight: 600, fontSize: "0.9rem", textDecoration: "none", "&:hover": { textDecoration: "underline" }, "&:focus-visible": { outline: `2px solid ${COLORS.SECONDARY_ORANGE}`, outlineOffset: 2 } }}>
                  {l.label} <ArrowForwardRoundedIcon aria-hidden sx={{ fontSize: 16 }} />
                </Box>
              </li>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
}

/** Public sources for factual lines on a page. Opens in a new tab. Takes its colour from the band. */
export function SourcesNote({ items }: { items: { label: string; href: string }[] }) {
  return (
    <Typography sx={{ mt: 5, fontSize: "0.82rem", color: "inherit", opacity: 0.75, lineHeight: 1.7 }}>
      Sources:{" "}
      {items.map((s, i) => (
        <React.Fragment key={s.href}>
          <Box component="a" href={s.href} target="_blank" rel="noopener noreferrer" sx={{ color: "inherit", textDecoration: "underline", ...focusRing }}>{s.label}</Box>
          {i < items.length - 1 ? "; " : "."}
        </React.Fragment>
      ))}
    </Typography>
  );
}

/** Commitments as numbered, ruled columns. */
export function CommitmentGrid({ items, onDark = false }: { items: { title: string; text: string }[]; onDark?: boolean }) {
  return (
    <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", columnGap: 5, gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(2, minmax(0, 1fr))", lg: "repeat(4, minmax(0, 1fr))" } }}>
      {items.map((c, i) => (
        <Box component="li" key={c.title} sx={{ py: 3.5, borderTop: `1px solid ${onDark ? "rgba(255,255,255,0.4)" : INK}` }}>
          <Typography component="span" aria-hidden sx={{ display: "block", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.12em", color: onDark ? COLORS.SECONDARY_ORANGE : COLORS.PRIMARY_PURPLE }}>{String(i + 1).padStart(2, "0")}</Typography>
          <Typography component="h3" sx={{ mt: 2, fontWeight: 600, fontSize: "1.2rem", color: onDark ? COLORS.WHITE : INK }}>{c.title}</Typography>
          <Typography sx={{ ...editorialBody, mt: 1, fontSize: "0.95rem", ...(onDark && { color: "rgba(255,255,255,0.82)" }) }}>{c.text}</Typography>
        </Box>
      ))}
    </Box>
  );
}

/** Four real category photos in two offset columns; the outer corners are arched like jharokha windows. */
export function PhotoCollage({ photos }: { photos: string[] }) {
  const [a, b, c, d] = photos;
  const tile = (src: string, height: number, radius: string, priority: boolean) => (
    <Box key={src} sx={{ position: "relative", height, borderRadius: radius, overflow: "hidden", bgcolor: COLORS.NEW_UI.EDITORIAL_TINT }}>
      <Image src={src} loader={isCloudinaryUrl(src) ? cloudinaryLoader : undefined} alt="" fill sizes="260px" priority={priority} style={{ objectFit: "cover" }} />
    </Box>
  );
  return (
    <Box aria-hidden sx={{ display: { xs: "none", md: "grid" }, gridTemplateColumns: "1fr 1fr", gap: 2, maxWidth: 520, ml: "auto", width: "100%", alignItems: "start" }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>{tile(a, 260, "999px 999px 18px 18px", true)}{tile(c, 180, "18px", false)}</Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 6 }}>{tile(b, 180, "18px", true)}{tile(d, 260, "18px 18px 999px 999px", false)}</Box>
    </Box>
  );
}
