"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Box, Button, Typography } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CategoryIcon, { sameOrigin } from "@/components/common/CategoryIcon";
import { HOME_GUTTER, HOME_MAX_WIDTH, sectionEyebrowSx, sectionSubtitleSx, sectionTitleSx, tappableCard } from "@/components/pages/home/sections/shared";
import { COLORS } from "@/constants/colors";
import cloudinaryLoader, { isCloudinaryUrl } from "@/lib/cloudinaryLoader";
import type { CategoryMedia } from "@/lib/services/coverage";
import type { FaqItem } from "@/lib/services/types";

export interface Crumb {
  name: string;
  href?: string;
}

const PHOTO_HOSTS = /^https:\/\/(res\.cloudinary\.com|images\.unsplash\.com)\//;
/** A photo next/image may load, or null so the tile falls back to its icon. */
export const photoSrc = (url?: string | null): string | null => {
  const src = sameOrigin(url);
  return src && ((src.startsWith("/") && !src.startsWith("//")) || PHOTO_HOSTS.test(src)) ? src : null;
};

const HERO_BG = `linear-gradient(135deg, ${COLORS.PURPLE_DEEP} 0%, ${COLORS.PURPLE_HOVER} 55%, ${COLORS.PRIMARY_PURPLE} 100%)`;
const pill = { borderRadius: 9999, px: 3, minHeight: 44, textTransform: "none", fontWeight: 700, boxShadow: "none" } as const;

/** Width and side padding shared with the home page, so these pages line up with it. */
export function PageContainer({ children }: { children: React.ReactNode }) {
  return <Box sx={{ maxWidth: HOME_MAX_WIDTH, mx: "auto", width: "100%", px: HOME_GUTTER, py: { xs: 2, md: 3 } }}>{children}</Box>;
}

/** Visible breadcrumb trail. The matching JSON-LD is emitted by the page. */
export function Breadcrumbs({ items, onDark = false }: { items: Crumb[]; onDark?: boolean }) {
  const muted = onDark ? "rgba(255,255,255,0.75)" : "text.secondary";
  return (
    <Box component="nav" aria-label="Breadcrumb" sx={{ mb: 2 }}>
      <Box component="ol" sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, listStyle: "none", m: 0, p: 0, fontSize: "0.85rem", color: muted }}>
        {items.map((c, i) => (
          <Box component="li" key={c.name} sx={{ display: "flex", gap: 0.75 }}>
            {c.href && i < items.length - 1 ? (
              <Box component={Link} href={c.href} sx={{ color: "inherit", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
                {c.name}
              </Box>
            ) : (
              <Box component="span" aria-current={i === items.length - 1 ? "page" : undefined} sx={{ color: onDark ? COLORS.WHITE : "text.primary", fontWeight: 600 }}>
                {c.name}
              </Box>
            )}
            {i < items.length - 1 && <span aria-hidden>/</span>}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

/** Full-width violet band with the page's H1, like the home page's hero. `aside` sits to the right on large screens. */
export function HeroBand({ crumbs, eyebrow, title, lead, actions, aside }: { crumbs: Crumb[]; eyebrow?: string; title: string; lead?: string; actions?: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <Box sx={{ mt: -2, position: "relative", overflow: "hidden", color: COLORS.WHITE, background: HERO_BG }}>
      <Box aria-hidden sx={{ position: "absolute", width: 420, height: 420, right: -120, top: -160, borderRadius: "50%", background: `radial-gradient(circle, ${COLORS.SECONDARY_ORANGE}40 0%, transparent 68%)`, pointerEvents: "none" }} />
      <Box sx={{ position: "relative", maxWidth: HOME_MAX_WIDTH, mx: "auto", px: HOME_GUTTER, pt: { xs: 3, md: 5 }, pb: { xs: 4, md: 6 } }}>
        <Breadcrumbs items={crumbs} onDark />
        <Box sx={{ display: "grid", gap: { xs: 3, md: 5 }, alignItems: "center", gridTemplateColumns: aside ? { xs: "1fr", lg: "1.2fr 1fr" } : "1fr" }}>
          <Box>
            {eyebrow && <Typography sx={{ ...sectionEyebrowSx, color: "rgba(255,255,255,0.8)", mb: 1 }}>{eyebrow}</Typography>}
            <Typography component="h1" sx={{ fontSize: "clamp(2rem, 1.4rem + 2.4vw, 3.5rem)", fontWeight: 700, lineHeight: 1.12, letterSpacing: "-0.02em", maxWidth: 760 }}>
              {title}
            </Typography>
            {lead && <Typography sx={{ mt: 2, fontSize: { xs: "1rem", md: "1.15rem" }, lineHeight: 1.6, color: "rgba(255,255,255,0.88)", maxWidth: 620 }}>{lead}</Typography>}
            {actions && <Box sx={{ mt: 3, display: "flex", gap: 1.5, flexWrap: "wrap" }}>{actions}</Box>}
          </Box>
          {aside}
        </Box>
      </Box>
    </Box>
  );
}

/** White pill for the dark hero, outlined pill for the light page. */
export function HeroButton({ href, children, variant = "solid" }: { href: string; children: React.ReactNode; variant?: "solid" | "ghost" }) {
  return (
    <Button
      component={Link}
      href={href}
      variant="contained"
      disableElevation
      endIcon={<ArrowForwardRoundedIcon />}
      sx={{ ...pill, ...(variant === "solid" ? { bgcolor: COLORS.WHITE, color: COLORS.PRIMARY_PURPLE, "&:hover": { bgcolor: COLORS.PURPLE_ALPHA_10 } } : { bgcolor: "rgba(255,255,255,0.14)", color: COLORS.WHITE, border: "1px solid rgba(255,255,255,0.4)", "&:hover": { bgcolor: "rgba(255,255,255,0.22)" } }) }}
    >
      {children}
    </Button>
  );
}

/** Category photo, or a tinted icon tile when there is none. Decorative: the name is always beside it. */
export function CategoryVisual({ media, height, radius = "20px", iconSize = 56 }: { media?: CategoryMedia; height: number | Record<string, number>; radius?: string; iconSize?: number }) {
  const img = photoSrc(media?.image);
  return (
    <Box sx={{ position: "relative", height, borderRadius: radius, overflow: "hidden", bgcolor: COLORS.PURPLE_ALPHA_10, display: "grid", placeItems: "center" }}>
      {img ? (
        <Image src={img} loader={isCloudinaryUrl(img) ? cloudinaryLoader : undefined} alt="" fill sizes="(max-width: 900px) 100vw, 560px" style={{ objectFit: "cover" }} />
      ) : (
        <CategoryIcon icon={media?.icon} color={media?.color} size={iconSize} />
      )}
    </Box>
  );
}

/** Section heading in the home page's scale: small violet eyebrow, then the title. */
export function SectionHead({ id, eyebrow, title, subtitle }: { id?: string; eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <Box sx={{ mb: 2 }}>
      {eyebrow && <Typography sx={{ ...sectionEyebrowSx, color: COLORS.PRIMARY_PURPLE }}>{eyebrow}</Typography>}
      <Typography id={id} component="h2" sx={sectionTitleSx}>
        {title}
      </Typography>
      {subtitle && <Typography sx={sectionSubtitleSx}>{subtitle}</Typography>}
    </Box>
  );
}

/** One titled section. Content is always visible: no tabs, no accordions. */
export function Section({ id, eyebrow, title, children }: { id: string; eyebrow?: string; title: string; children: React.ReactNode }) {
  return (
    <Box component="section" aria-labelledby={id} sx={{ py: { xs: 2.5, md: 3.5 }, scrollMarginTop: 80 }}>
      <SectionHead id={id} eyebrow={eyebrow} title={title} />
      {children}
    </Box>
  );
}

export function Paragraphs({ items }: { items: string[] }) {
  return (
    <>
      {items.map((p) => (
        <Typography key={p} sx={{ fontSize: { xs: "1rem", md: "1.0625rem" }, lineHeight: 1.75, color: "text.secondary", maxWidth: 760, mb: 1.5 }}>
          {p}
        </Typography>
      ))}
    </>
  );
}

/** Items as rows with a violet check, inside one bordered card. */
export function CheckList({ items }: { items: string[] }) {
  return (
    <Box component="ul" sx={{ m: 0, p: { xs: 2, md: 3 }, listStyle: "none", display: "grid", gap: 1.5, borderRadius: 4, border: "1px solid", borderColor: "divider", bgcolor: "background.paper" }}>
      {items.map((i) => (
        <Box component="li" key={i} sx={{ display: "flex", gap: 1.5, alignItems: "flex-start", color: "text.secondary", lineHeight: 1.65 }}>
          <CheckCircleRoundedIcon aria-hidden sx={{ color: COLORS.PRIMARY_PURPLE, fontSize: 22, mt: "1px", flexShrink: 0 }} />
          <span>{i}</span>
        </Box>
      ))}
    </Box>
  );
}

/** The same rows, on a soft violet card with an info mark, for what is not promised. */
export function NoticeList({ items }: { items: string[] }) {
  return (
    <Box component="ul" sx={{ m: 0, p: { xs: 2, md: 3 }, listStyle: "none", display: "grid", gap: 1.5, borderRadius: 4, bgcolor: COLORS.PURPLE_ALPHA_04, border: "1px solid", borderColor: COLORS.PURPLE_ALPHA_20 }}>
      {items.map((i) => (
        <Box component="li" key={i} sx={{ display: "flex", gap: 1.5, alignItems: "flex-start", color: "text.secondary", lineHeight: 1.65 }}>
          <InfoOutlinedIcon aria-hidden sx={{ color: COLORS.PRIMARY_PURPLE, fontSize: 22, mt: "1px", flexShrink: 0 }} />
          <span>{i}</span>
        </Box>
      ))}
    </Box>
  );
}

/** Bullet list kept for plain lists. */
export function BulletList({ items }: { items: string[] }) {
  return <CheckList items={items} />;
}

/** FAQ shown in full as cards, never collapsed. */
export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" } }}>
      {items.map((f) => (
        <Box key={f.q} sx={{ p: { xs: 2, md: 3 }, borderRadius: 4, border: "1px solid", borderColor: "divider", bgcolor: "background.paper" }}>
          <Typography component="h3" sx={{ fontSize: "1.0625rem", fontWeight: 700, lineHeight: 1.35, mb: 0.75 }}>
            {f.q}
          </Typography>
          <Typography sx={{ color: "text.secondary", lineHeight: 1.7 }}>{f.a}</Typography>
        </Box>
      ))}
    </Box>
  );
}

/** Category card: photo (or icon tile) on top, name and a short line below. */
export function CategoryCard({ href, name, text, media }: { href: string; name: string; text?: string; media?: CategoryMedia }) {
  return (
    <Box component={Link} href={href} sx={{ ...tappableCard, display: "block", p: 1.25, color: "text.primary", textDecoration: "none", "&:focus-visible": { outline: `2px solid ${COLORS.PRIMARY_PURPLE}`, outlineOffset: 2 } }}>
      <CategoryVisual media={media} height={{ xs: 130, md: 150 }} radius="14px" iconSize={48} />
      <Box sx={{ px: 1, pt: 1.5, pb: 1 }}>
        <Typography component="span" sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, fontWeight: 700, fontSize: "1.0625rem" }}>
          {name}
          <ArrowForwardRoundedIcon aria-hidden sx={{ color: COLORS.PRIMARY_PURPLE, fontSize: 20 }} />
        </Typography>
        {text && <Typography component="span" sx={{ display: "block", mt: 0.5, fontSize: "0.9rem", color: "text.secondary", lineHeight: 1.55 }}>{text}</Typography>}
      </Box>
    </Box>
  );
}

/** Compact card for a provider's service. */
export function LinkCard({ href, title, children }: { href: string; title: string; children?: React.ReactNode }) {
  return (
    <Box component={Link} href={href} sx={{ ...tappableCard, display: "block", p: 2.5, color: "text.primary", textDecoration: "none", "&:focus-visible": { outline: `2px solid ${COLORS.PRIMARY_PURPLE}`, outlineOffset: 2 } }}>
      <Typography component="span" sx={{ display: "block", fontWeight: 700, fontSize: "1.0625rem", mb: children ? 0.5 : 0 }}>
        {title}
      </Typography>
      {children && <Typography component="span" sx={{ display: "block", fontSize: "0.9rem", color: "text.secondary", lineHeight: 1.6 }}>{children}</Typography>}
    </Box>
  );
}

export function CardGrid({ children, min = 260 }: { children: React.ReactNode; min?: number }) {
  return <Box sx={{ display: "grid", gap: { xs: 1.5, md: 2 }, gridTemplateColumns: { xs: "1fr", sm: `repeat(auto-fill, minmax(${min}px, 1fr))` } }}>{children}</Box>;
}

/** Closing call to action in the hero's violet. Every button leads to a page that exists. */
export function CtaBand({ title, text, primary, secondary }: { title: string; text: string; primary: { label: string; href: string }; secondary?: { label: string; href: string } }) {
  return (
    <Box sx={{ my: { xs: 3, md: 5 }, p: { xs: 3, md: 5 }, borderRadius: 5, color: COLORS.WHITE, background: HERO_BG }}>
      <Typography component="h2" sx={{ ...sectionTitleSx, color: COLORS.WHITE, mb: 1 }}>
        {title}
      </Typography>
      <Typography sx={{ color: "rgba(255,255,255,0.85)", maxWidth: 620, mb: 3, lineHeight: 1.7 }}>{text}</Typography>
      <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
        <HeroButton href={primary.href}>{primary.label}</HeroButton>
        {secondary && (
          <HeroButton href={secondary.href} variant="ghost">
            {secondary.label}
          </HeroButton>
        )}
      </Box>
    </Box>
  );
}

/** Sticky side card on large screens: the one action, plus a few related links. */
export function SideCard({ title, text, action, children }: { title: string; text: string; action: { label: string; href: string }; children?: React.ReactNode }) {
  return (
    <Box component="aside" sx={{ position: { lg: "sticky" }, top: { lg: 88 }, p: 3, borderRadius: 5, border: "1px solid", borderColor: "divider", bgcolor: "background.paper", display: "grid", gap: 2 }}>
      <Typography component="h2" sx={{ fontSize: "1.25rem", fontWeight: 700, lineHeight: 1.3 }}>
        {title}
      </Typography>
      <Typography sx={{ color: "text.secondary", lineHeight: 1.65 }}>{text}</Typography>
      <Button component={Link} href={action.href} variant="contained" disableElevation endIcon={<ArrowForwardRoundedIcon />} sx={{ ...pill, bgcolor: COLORS.PRIMARY_PURPLE, "&:hover": { bgcolor: COLORS.PURPLE_HOVER } }}>
        {action.label}
      </Button>
      {children}
    </Box>
  );
}
