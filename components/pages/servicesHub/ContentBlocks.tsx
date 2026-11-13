"use client";

import React from "react";
import Link from "next/link";
import { Box, Button, Container, Typography } from "@mui/material";
import { COLORS } from "@/constants/colors";
import type { FaqItem } from "@/lib/services/types";

export interface Crumb {
  name: string;
  href?: string;
}

/** Visible breadcrumb trail. The matching JSON-LD is emitted by the page. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <Box component="nav" aria-label="Breadcrumb" sx={{ mb: 2 }}>
      <Box component="ol" sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, listStyle: "none", m: 0, p: 0, fontSize: "0.875rem", color: "text.secondary" }}>
        {items.map((c, i) => (
          <Box component="li" key={c.name} sx={{ display: "flex", gap: 0.75 }}>
            {c.href && i < items.length - 1 ? (
              <Box component={Link} href={c.href} sx={{ color: "inherit", textDecoration: "none", "&:hover": { color: COLORS.PRIMARY_PURPLE, textDecoration: "underline" } }}>
                {c.name}
              </Box>
            ) : (
              <Box component="span" aria-current={i === items.length - 1 ? "page" : undefined} sx={{ color: "text.primary", fontWeight: 600 }}>
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

/** One titled section. Content is always visible: no tabs, no accordions. */
export function Section({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <Box component="section" aria-labelledby={id} sx={{ py: { xs: 3, md: 5 } }}>
      <Typography id={id} component="h2" sx={{ fontSize: { xs: "1.4rem", md: "1.75rem" }, fontWeight: 700, lineHeight: 1.25, mb: 2 }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

export function Paragraphs({ items }: { items: string[] }) {
  return (
    <>
      {items.map((p) => (
        <Typography key={p} sx={{ fontSize: { xs: "1rem", md: "1.0625rem" }, lineHeight: 1.7, color: "text.secondary", maxWidth: 720, mb: 1.5 }}>
          {p}
        </Typography>
      ))}
    </>
  );
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <Box component="ul" sx={{ m: 0, pl: 2.5, maxWidth: 720, color: "text.secondary", lineHeight: 1.7, "& li": { mb: 0.75, pl: 0.5 } }}>
      {items.map((i) => (
        <li key={i}>{i}</li>
      ))}
    </Box>
  );
}

/** FAQ shown in full, as plain headings and answers. */
export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <Box sx={{ display: "grid", gap: 2.5, maxWidth: 720 }}>
      {items.map((f) => (
        <Box key={f.q}>
          <Typography component="h3" sx={{ fontSize: "1.0625rem", fontWeight: 700, mb: 0.5 }}>
            {f.q}
          </Typography>
          <Typography sx={{ color: "text.secondary", lineHeight: 1.7 }}>{f.a}</Typography>
        </Box>
      ))}
    </Box>
  );
}

/** Flat bordered card used for category and provider grids. */
export function LinkCard({ href, title, children }: { href: string; title: string; children?: React.ReactNode }) {
  return (
    <Box
      component={Link}
      href={href}
      sx={{
        display: "block",
        p: 3,
        borderRadius: "24px",
        border: `1px solid ${COLORS.NEW_UI.CARD_BORDER_LIGHT}`,
        bgcolor: "background.paper",
        color: "text.primary",
        textDecoration: "none",
        transition: "border-color 140ms ease",
        "&:hover, &:focus-visible": { borderColor: COLORS.PRIMARY_PURPLE },
        "&:focus-visible": { outline: `2px solid ${COLORS.PRIMARY_PURPLE}`, outlineOffset: 2 },
      }}
    >
      <Typography component="span" sx={{ display: "block", fontWeight: 700, fontSize: "1.0625rem", mb: children ? 0.5 : 0 }}>
        {title}
      </Typography>
      {children && <Typography component="span" sx={{ display: "block", fontSize: "0.9rem", color: "text.secondary", lineHeight: 1.6 }}>{children}</Typography>}
    </Box>
  );
}

export function CardGrid({ children }: { children: React.ReactNode }) {
  return <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" } }}>{children}</Box>;
}

/** Closing call to action. Every button leads to a page that exists. */
export function CtaBand({ title, text, primary, secondary }: { title: string; text: string; primary: { label: string; href: string }; secondary?: { label: string; href: string } }) {
  return (
    <Box sx={{ my: { xs: 3, md: 5 }, p: { xs: 3, md: 5 }, borderRadius: "24px", bgcolor: COLORS.PURPLE_ALPHA_10 }}>
      <Typography component="h2" sx={{ fontSize: { xs: "1.4rem", md: "1.75rem" }, fontWeight: 700, mb: 1 }}>
        {title}
      </Typography>
      <Typography sx={{ color: "text.secondary", maxWidth: 640, mb: 3, lineHeight: 1.7 }}>{text}</Typography>
      <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
        <Button component={Link} href={primary.href} variant="contained" disableElevation sx={{ borderRadius: 9999, px: 3, minHeight: 44, textTransform: "none", fontWeight: 600, bgcolor: COLORS.PRIMARY_PURPLE }}>
          {primary.label}
        </Button>
        {secondary && (
          <Button component={Link} href={secondary.href} variant="outlined" sx={{ borderRadius: 9999, px: 3, minHeight: 44, textTransform: "none", fontWeight: 600, borderColor: COLORS.PRIMARY_PURPLE, color: COLORS.PRIMARY_PURPLE }}>
            {secondary.label}
          </Button>
        )}
      </Box>
    </Box>
  );
}

export function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <Container maxWidth="lg" sx={{ px: { xs: 2, md: 3 }, py: { xs: 2, md: 4 } }}>
      {children}
    </Container>
  );
}

/** Page heading block: one H1, optional lead text. */
export function PageHeader({ title, lead }: { title: string; lead?: string }) {
  return (
    <Box sx={{ pt: { xs: 1, md: 3 }, pb: { xs: 1, md: 2 } }}>
      <Typography component="h1" sx={{ fontSize: { xs: "2rem", md: "3rem" }, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em", maxWidth: 820 }}>
        {title}
      </Typography>
      {lead && <Typography sx={{ mt: 2, fontSize: { xs: "1.05rem", md: "1.2rem" }, lineHeight: 1.6, color: "text.secondary", maxWidth: 720 }}>{lead}</Typography>}
    </Box>
  );
}
