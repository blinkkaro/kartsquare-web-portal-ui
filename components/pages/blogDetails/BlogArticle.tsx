"use client";

import React from "react";
import Link from "next/link";
import { Box, Typography } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { COLORS } from "@/constants/colors";
import type { BlogPost } from "@/data/blogs";
import type { TocEntry } from "@/lib/blog/article";

export interface RelatedCard {
  href: string;
  title: string;
  category: string;
  displayDate: string;
  coverImage: string;
}

interface Props {
  blog: BlogPost;
  html: string;
  toc: TocEntry[];
  coverCredit: string | null;
  readingMinutes: number;
  displayDate: string;
  canonicalUrl: string;
  related: RelatedCard[];
}

const INK = COLORS.NEW_UI.INK;
const MUTED = COLORS.TEXT.SECONDARY_LIGHT;
const LINE = COLORS.NEW_UI.CARD_BORDER_LIGHT;
const READ = 880;
const focusRing = { "&:focus-visible": { outline: `2px solid ${COLORS.PRIMARY_PURPLE}`, outlineOffset: 3, borderRadius: "6px" } } as const;
const eyebrow = { fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: MUTED } as const;

/** Thin violet line at the very top that fills as you read. Transform only, so it never causes layout work. */
function ReadingProgress({ target }: { target: React.RefObject<HTMLElement | null> }) {
  const bar = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = target.current;
      if (!el || !bar.current) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 1;
      bar.current.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(frame); };
  }, [target]);
  return (
    <Box aria-hidden sx={{ position: "fixed", top: 0, left: 0, right: 0, height: 3, zIndex: 1400, pointerEvents: "none" }}>
      <Box ref={bar} sx={{ height: "100%", bgcolor: COLORS.PRIMARY_PURPLE, transform: "scaleX(0)", transformOrigin: "0 50%" }} />
    </Box>
  );
}

/** The last section heading that has scrolled past the top of the reading area. */
function useActiveSection(ids: string[]) {
  const [active, setActive] = React.useState(ids[0] ?? "");
  React.useEffect(() => {
    if (!ids.length) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 140) current = id;
      }
      setActive(current);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(frame); };
  }, [ids]);
  return active;
}

function Contents({ toc, active }: { toc: TocEntry[]; active: string }) {
  return (
    <Box component="ol" sx={{ listStyle: "none", m: 0, p: 0, borderLeft: `1px solid ${LINE}` }}>
      {toc.map((t) => {
        const on = t.id === active;
        return (
          <li key={t.id}>
            <Box component="a" href={`#${t.id}`} aria-current={on ? "location" : undefined} sx={{ display: "block", py: 0.75, pl: 2, ml: "-1px", borderLeft: "2px solid", borderColor: on ? COLORS.PRIMARY_PURPLE : "transparent", color: on ? INK : MUTED, fontWeight: on ? 600 : 400, fontSize: "0.85rem", lineHeight: 1.45, textDecoration: "none", transition: "color 150ms ease-out, border-color 150ms ease-out", "&:hover": { color: INK }, ...focusRing }}>
              {t.label}
            </Box>
          </li>
        );
      })}
    </Box>
  );
}

function ShareButtons({ url, title, vertical = false }: { url: string; title: string; vertical?: boolean }) {
  const [copied, setCopied] = React.useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };
  const btn = { width: 44, height: 44, borderRadius: "50%", display: "grid", placeItems: "center", border: `1px solid ${LINE}`, bgcolor: COLORS.WHITE, color: INK, cursor: "pointer", transition: "border-color 150ms ease-out, color 150ms ease-out", "&:hover": { borderColor: COLORS.PRIMARY_PURPLE, color: COLORS.PRIMARY_PURPLE }, ...focusRing } as const;
  return (
    <Box sx={{ display: "flex", flexDirection: vertical ? "column" : "row", gap: 1, alignItems: "center" }}>
      <Box component="button" type="button" onClick={copy} aria-label={copied ? "Link copied" : "Copy link"} sx={btn}>
        {copied ? <CheckRoundedIcon sx={{ fontSize: 20, color: COLORS.PRIMARY_PURPLE }} /> : <LinkRoundedIcon sx={{ fontSize: 20 }} />}
      </Box>
      <Box component="a" href={`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp" sx={btn}>
        <WhatsAppIcon sx={{ fontSize: 20 }} />
      </Box>
      <Typography component="span" role="status" sx={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>{copied ? "Link copied" : ""}</Typography>
    </Box>
  );
}

/** Typography for the post's own HTML. One reading measure, generous rhythm, brand violet used sparingly. */
const prose = {
  color: INK,
  fontSize: { xs: "1.0625rem", md: "1.1875rem" },
  lineHeight: 1.8,
  "& > :first-of-type": { mt: 0 },
  "& p": { m: 0, mb: 3, color: COLORS.TEXT.PRIMARY_LIGHT },
  "& h2": { fontSize: { xs: "1.5rem", md: "1.75rem" }, fontWeight: 700, lineHeight: 1.25, letterSpacing: "-0.01em", color: INK, mt: { xs: 7, md: 9 }, mb: 2.5, scrollMarginTop: 96 },
  "& h3": { fontSize: { xs: "1.15rem", md: "1.25rem" }, fontWeight: 600, lineHeight: 1.35, color: INK, mt: 5, mb: 1.5, scrollMarginTop: 96 },
  "& h4": { fontSize: "1.05rem", fontWeight: 600, mt: 4, mb: 1 },
  "& strong": { fontWeight: 600, color: INK },
  "& em": { fontStyle: "italic" },
  "& a": { color: COLORS.PRIMARY_PURPLE, textDecoration: "underline", textDecorationThickness: "1px", textUnderlineOffset: "3px", textDecorationColor: COLORS.PURPLE_ALPHA_30, transition: "text-decoration-color 150ms ease-out", "&:hover": { textDecorationColor: COLORS.PRIMARY_PURPLE } },
  "& ul, & ol": { m: 0, mb: 3, pl: 0, listStyle: "none" },
  "& li": { position: "relative", pl: 4, mb: 1.5, color: COLORS.TEXT.PRIMARY_LIGHT },
  "& ul > li::before": { content: '""', position: "absolute", left: 10, top: "0.78em", width: 6, height: 6, borderRadius: "50%", bgcolor: COLORS.PRIMARY_PURPLE },
  "& ol": { counterReset: "item" },
  "& ol > li": { counterIncrement: "item" },
  "& ol > li::before": { content: "counter(item, decimal-leading-zero)", position: "absolute", left: 0, top: "0.2em", fontSize: "0.78rem", fontWeight: 700, color: COLORS.PRIMARY_PURPLE, letterSpacing: "0.04em" },
  "& blockquote": { m: 0, my: 5, pl: 3, borderLeft: `2px solid ${COLORS.PRIMARY_PURPLE}`, fontSize: { xs: "1.2rem", md: "1.35rem" }, lineHeight: 1.55, color: INK, fontWeight: 500 },
  "& small": { fontSize: "0.85rem", color: MUTED },
  "& hr": { border: 0, borderTop: `1px solid ${LINE}`, my: 6 },
  // The opening paragraph reads as a lede.
  "& > p:first-of-type": { fontSize: { xs: "1.15rem", md: "1.25rem" }, lineHeight: 1.7, color: INK },
} as const;

export default function BlogArticle({ blog, html, toc, coverCredit, readingMinutes, displayDate, canonicalUrl, related }: Props) {
  const articleRef = React.useRef<HTMLElement>(null);
  const ids = React.useMemo(() => toc.map((t) => t.id), [toc]);
  const active = useActiveSection(ids);
  const showToc = toc.length >= 3;

  return (
    <Box sx={{ bgcolor: COLORS.NEW_UI.PAGE_BG_LIGHT, mt: -2, pb: { xs: 10, md: 18 } }}>
      <ReadingProgress target={articleRef} />

      {/* Header: centred, quiet, type does the work */}
      <Box component="header" sx={{ maxWidth: 860, mx: "auto", px: 2, pt: { xs: 4, md: 8 }, textAlign: { md: "center" } }}>
        <Box component={Link} href="/blogs" sx={{ display: "inline-flex", alignItems: "center", gap: 0.75, minHeight: 44, color: MUTED, fontSize: "0.9rem", fontWeight: 500, textDecoration: "none", "&:hover": { color: INK }, ...focusRing }}>
          <ArrowBackRoundedIcon sx={{ fontSize: 18 }} /> All articles
        </Box>
        <Box sx={{ mt: { xs: 3, md: 4 }, display: "flex", flexWrap: "wrap", gap: 1.25, alignItems: "center", justifyContent: { md: "center" } }}>
          <Typography component="span" sx={{ ...eyebrow, color: COLORS.PRIMARY_PURPLE }}>{blog.category}</Typography>
          <Box component="span" aria-hidden sx={{ width: 4, height: 4, borderRadius: "50%", bgcolor: COLORS.NEW_UI.OUTLINE_LIGHT }} />
          <Typography component="span" sx={eyebrow}>{readingMinutes} min read</Typography>
        </Box>
        <Typography component="h1" sx={{ mt: 2.5, fontSize: { xs: "2.125rem", sm: "2.75rem", md: "3.5rem" }, fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.02em", color: INK, textWrap: "balance" }}>
          {blog.title}
        </Typography>
        {blog.excerpt && (
          <Typography sx={{ mt: 3, mx: { md: "auto" }, maxWidth: 640, fontSize: { xs: "1.1rem", md: "1.25rem" }, lineHeight: 1.6, color: MUTED, textWrap: "pretty" }}>{blog.excerpt}</Typography>
        )}
        <Box sx={{ mt: 4, display: "flex", alignItems: "center", gap: 1.5, justifyContent: { md: "center" } }}>
          <Box aria-hidden sx={{ width: 40, height: 40, borderRadius: "50%", display: "grid", placeItems: "center", bgcolor: INK, color: COLORS.WHITE, fontWeight: 700, fontSize: "0.95rem" }}>k</Box>
          <Box sx={{ textAlign: "left" }}>
            <Typography sx={{ fontWeight: 600, fontSize: "0.95rem", color: INK, lineHeight: 1.3 }}>{blog.author}</Typography>
            <Typography component="time" dateTime={blog.date} sx={{ display: "block", fontSize: "0.85rem", color: MUTED }}>{displayDate}</Typography>
          </Box>
        </Box>
      </Box>

      {/* Cover */}
      {blog.coverImage && (
        <Box component="figure" sx={{ m: 0, mt: { xs: 5, md: 12 }, mx: "auto", maxWidth: 1260, px: { xs: 2, md: 3 } }}>
          <Box sx={{ position: "relative", aspectRatio: { xs: "4 / 3", sm: "16 / 9", md: "21 / 9" }, borderRadius: { xs: "20px", md: "32px" }, overflow: "hidden", bgcolor: COLORS.NEW_UI.SURFACE_SOFT_LIGHT }}>
            {/* Plain img: covers come from several hosts and public/; the page is static. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={blog.coverImage} alt="" fetchPriority="high" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          </Box>
          {coverCredit && (
            <Box component="figcaption" sx={{ mt: 1.5, textAlign: "center", fontSize: "0.8rem", color: MUTED, "& a": { color: "inherit", textUnderlineOffset: "2px" } }} dangerouslySetInnerHTML={{ __html: coverCredit }} />
          )}
        </Box>
      )}

      {/* Body: contents rail | reading column | share rail */}
      <Box sx={{ mt: { xs: 6, md: 14 }, mx: "auto", maxWidth: 1460, px: { xs: 2, md: 8 }, display: "grid", gap: { lg: 2 }, gridTemplateColumns: { xs: "minmax(0, 1fr)", lg: `200px minmax(0, ${READ}px) 200px` }, justifyContent: "center" }}>
        <Box component="aside" aria-label="On this page" sx={{ display: { xs: "none", lg: showToc ? "block" : "none" } }}>
          <Box sx={{ position: "sticky", top: 96 }}>
            <Typography sx={{ ...eyebrow, mb: 2 }}>On this page</Typography>
            <Contents toc={toc} active={active} />
          </Box>
        </Box>

        <Box sx={{ minWidth: 0 }}>
          {showToc && (
            <Box component="details" sx={{ display: { lg: "none" }, mb: 5, borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}`, "& summary::-webkit-details-marker": { display: "none" }, "&[open] .toc-sign": { transform: "rotate(45deg)" } }}>
              <Box component="summary" sx={{ listStyle: "none", cursor: "pointer", minHeight: 52, display: "flex", alignItems: "center", justifyContent: "space-between", ...eyebrow, ...focusRing }}>
                On this page
                <Box component="span" className="toc-sign" aria-hidden sx={{ fontSize: "1.25rem", fontWeight: 400, color: INK, transition: "transform 200ms ease-out", "@media (prefers-reduced-motion: reduce)": { transition: "none" } }}>+</Box>
              </Box>
              <Box sx={{ pb: 2 }}><Contents toc={toc} active={active} /></Box>
            </Box>
          )}

          <Box component="article" ref={articleRef} sx={prose} dangerouslySetInnerHTML={{ __html: html }} />

          {/* Close: share + a single, quiet next step */}
          <Box sx={{ mt: 8, pt: 4, borderTop: `1px solid ${LINE}`, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
            <Typography sx={{ fontWeight: 600, color: INK }}>Found this useful? Share it with someone in Jaipur.</Typography>
            <ShareButtons url={canonicalUrl} title={blog.title} />
          </Box>

          <Box sx={{ mt: 5, p: { xs: 3, md: 4 }, borderRadius: "24px", bgcolor: INK, color: COLORS.WHITE, display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 3, alignItems: { sm: "center" }, justifyContent: "space-between" }}>
            <Box>
              <Typography component="p" sx={{ fontWeight: 700, fontSize: { xs: "1.2rem", md: "1.35rem" }, lineHeight: 1.3 }}>Need a hand with this?</Typography>
              <Typography sx={{ mt: 0.75, color: COLORS.NEW_UI.EDITORIAL_LILAC, lineHeight: 1.6 }}>Find a local provider in Jaipur, read their profile and send them your request.</Typography>
            </Box>
            <Box component={Link} href="/explore-services" sx={{ flex: "0 0 auto", display: "inline-flex", alignItems: "center", gap: 1, minHeight: 48, px: 3, borderRadius: 999, bgcolor: COLORS.WHITE, color: INK, fontWeight: 600, textDecoration: "none", transition: "background-color 150ms ease-out", "&:hover": { bgcolor: COLORS.NEW_UI.EDITORIAL_TINT }, ...focusRing }}>
              Explore services <ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: { xs: "none", lg: "block" } }}>
          <Box sx={{ position: "sticky", top: 96, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 1.5 }}>
            <Typography sx={eyebrow}>Share</Typography>
            <ShareButtons url={canonicalUrl} title={blog.title} vertical />
          </Box>
        </Box>
      </Box>

      {/* Keep reading */}
      {related.length > 0 && (
        <Box component="section" aria-labelledby="keep-reading" sx={{ mt: { xs: 10, md: 14 }, mx: "auto", maxWidth: 1360, px: { xs: 2, md: 3 } }}>
          <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 2, pb: 2.5, mb: 4, borderBottom: `1px solid ${LINE}` }}>
            <Typography id="keep-reading" component="h2" sx={{ fontSize: { xs: "1.5rem", md: "1.75rem" }, fontWeight: 700, letterSpacing: "-0.01em", color: INK }}>Keep reading</Typography>
            <Box component={Link} href="/blogs" sx={{ color: MUTED, fontSize: "0.9rem", fontWeight: 500, textDecoration: "none", minHeight: 44, display: "inline-flex", alignItems: "center", gap: 0.5, "&:hover": { color: INK }, ...focusRing }}>
              All articles <ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />
            </Box>
          </Box>
          <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: { xs: 4, md: 3 }, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", md: "repeat(3, minmax(0, 1fr))" } }}>
            {related.map((r) => (
              <li key={r.href}>
                <Box component={Link} href={r.href} sx={{ display: "block", color: INK, textDecoration: "none", "&:hover img": { transform: "scale(1.03)" }, "@media (prefers-reduced-motion: reduce)": { "& img": { transition: "none" }, "&:hover img": { transform: "none" } }, "&:hover .rel-title": { color: COLORS.PRIMARY_PURPLE }, ...focusRing }}>
                  <Box sx={{ position: "relative", aspectRatio: "3 / 2", borderRadius: "18px", overflow: "hidden", bgcolor: COLORS.NEW_UI.SURFACE_SOFT_LIGHT }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={r.coverImage} alt="" loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transition: "transform 400ms ease-out" }} />
                  </Box>
                  <Typography sx={{ ...eyebrow, mt: 2, fontSize: "0.7rem" }}>{r.category} · {r.displayDate}</Typography>
                  <Typography className="rel-title" component="span" sx={{ display: "block", mt: 1, fontWeight: 600, fontSize: "1.1rem", lineHeight: 1.4, transition: "color 150ms ease-out" }}>{r.title}</Typography>
                </Box>
              </li>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}
