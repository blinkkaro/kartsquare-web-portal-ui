"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Box, Typography } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { COLORS } from "@/constants/colors";
import { editorialBody, editorialEyebrow, editorialFocus, editorialSection, editorialTitle, HAIRLINE } from "./editorialStyles";
import { Section } from "./shared";

const ABOUT_IMAGE = "/images/home/hawa-mahal.jpg";

// Every point describes behaviour the product has today (see the FAQ comment in FaqSection).
const POINTS = [
  "Search in English, Hindi or Hinglish and see providers listed near you",
  "Read real customer reviews, or “No reviews yet” when there are none",
  "Call or WhatsApp the provider directly from the listing",
] as const;

/** Guides people open most from the home page. Every link is a page in data/services. */
const GUIDE_LINKS = [
  { href: "/services/c/home-services", label: "Home repairs" },
  { href: "/services/c/mobile-electronics-repair/mobile-phone-repair", label: "Mobile phone repair" },
  { href: "/services/c/mobile-electronics-repair/laptop-repair", label: "Laptop repair" },
  { href: "/services/c/mobile-electronics-repair/screen-replacement", label: "Screen replacement" },
  { href: "/services/c/automotive", label: "Car and bike service" },
] as const;

const textLink = {
  color: COLORS.NEW_UI.INK,
  textDecoration: "underline",
  textDecorationColor: COLORS.PURPLE_ALPHA_30,
  textUnderlineOffset: "5px",
  transition: "color 150ms ease-out, text-decoration-color 150ms ease-out",
  "&:hover": { color: COLORS.PRIMARY_PURPLE, textDecorationColor: COLORS.PRIMARY_PURPLE },
  ...editorialFocus,
} as const;

/** Brand section: what Kartsquare is, in plain keyword-bearing copy, beside a Jaipur photo framed as an arch. */
export default function AboutKartsquare() {
  return (
    <Section id="about-kartsquare" sx={editorialSection}>
      <Box sx={{ display: "grid", alignItems: "center", gap: { xs: 5, md: 8, lg: 12 }, gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 5fr) minmax(0, 7fr)" } }}>
        {/* Arched like a jharokha window: the one decorative move in the section. */}
        <Box component="figure" sx={{ m: 0, width: "100%", maxWidth: 440, justifySelf: { xs: "center", md: "end" } }}>
          <Box sx={{ position: "relative", aspectRatio: "4 / 5", borderRadius: "999px 999px 24px 24px", overflow: "hidden", bgcolor: COLORS.NEW_UI.EDITORIAL_TINT }}>
            <Image src={ABOUT_IMAGE} alt="The windows of Hawa Mahal in Jaipur" fill sizes="(max-width: 900px) 90vw, 440px" style={{ objectFit: "cover", objectPosition: "60% 70%" }} />
          </Box>
          <Typography component="figcaption" sx={{ mt: 1.5, textAlign: "center", fontSize: "0.8rem", color: "text.secondary" }}>Hawa Mahal, Jaipur</Typography>
        </Box>

        <Box sx={{ maxWidth: 640 }}>
          <Typography sx={editorialEyebrow}>About Kartsquare</Typography>
          <Typography component="h2" sx={{ ...editorialTitle, mt: 1.25 }}>Your local services app for Jaipur</Typography>
          <Typography sx={{ ...editorialBody, mt: 3, fontSize: { xs: "1.0625rem", md: "1.1875rem" }, color: COLORS.TEXT.PRIMARY_LIGHT }}>
            Kartsquare is a local services marketplace for Jaipur. When the AC stops cooling, the phone screen cracks or
            you need a photographer for a family function, you can look up people who do that work near you, see what
            they offer and contact them yourself. No middle desk, no reassigned jobs: you talk to the provider directly.
          </Typography>
          <Typography sx={{ ...editorialBody, mt: 2 }}>
            Not sure what to ask? Our service guides explain what each kind of job involves, what usually changes the
            price and what to tell a provider in your first message. And if you run a local business, you can create a
            free profile and show your work to customers nearby.
          </Typography>

          <Box component="ul" sx={{ listStyle: "none", m: 0, mt: 4, p: 0, borderTop: HAIRLINE }}>
            {POINTS.map((p, i) => (
              <Box component="li" key={p} sx={{ display: "flex", gap: 2.5, py: 1.75, borderBottom: HAIRLINE }}>
                <Typography component="span" aria-hidden sx={{ pt: "3px", fontSize: "0.75rem", fontWeight: 700, color: COLORS.PRIMARY_PURPLE, fontVariantNumeric: "tabular-nums" }}>{`0${i + 1}`}</Typography>
                <Typography component="span" sx={{ fontSize: "0.98rem", lineHeight: 1.6, color: COLORS.NEW_UI.INK, fontWeight: 500 }}>{p}</Typography>
              </Box>
            ))}
          </Box>

          <Box sx={{ mt: 4, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 3 }}>
            <Box component={Link} href="/explore-services" sx={{ display: "inline-flex", alignItems: "center", gap: 1, minHeight: 52, px: 3.5, borderRadius: 999, bgcolor: COLORS.NEW_UI.INK, color: COLORS.WHITE, fontWeight: 600, textDecoration: "none", transition: "background-color 150ms ease-out", "&:hover": { bgcolor: COLORS.PRIMARY_PURPLE }, ...editorialFocus }}>
              Explore services <ArrowForwardRoundedIcon aria-hidden sx={{ fontSize: 18 }} />
            </Box>
            <Box component={Link} href="/about-us" sx={{ ...textLink, display: "inline-flex", alignItems: "center", minHeight: 44, fontWeight: 600 }}>Learn more about us</Box>
          </Box>

          <Box sx={{ mt: 4, display: "flex", flexWrap: "wrap", alignItems: "center", columnGap: 2.5 }}>
            <Typography component="span" sx={{ fontSize: "0.85rem", color: "text.secondary" }}>Popular guides</Typography>
            <Box component="ul" aria-label="Service guides" sx={{ display: "flex", flexWrap: "wrap", columnGap: 2.5, listStyle: "none", m: 0, p: 0 }}>
              {GUIDE_LINKS.map((g) => (
                <li key={g.href}>
                  <Box component={Link} href={g.href} sx={{ ...textLink, display: "inline-flex", alignItems: "center", minHeight: 44, fontSize: "0.88rem", fontWeight: 500 }}>{g.label}</Box>
                </li>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Section>
  );
}
