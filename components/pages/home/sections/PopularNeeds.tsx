"use client";
import React from "react";
import Link from "next/link";
import { Box, Typography } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CategoryIcon from "@/components/common/CategoryIcon";
import { COLORS } from "@/constants/colors";
import { SITUATIONS } from "@/data/services/hubCopy";
import { editorialEyebrow, editorialFocus, editorialSection, editorialTitle, HAIRLINE } from "./editorialStyles";
import { Section } from "./shared";

/** The eight problems people bring most, picked from the hub's list so both pages link to the same guides. */
const HOME_SITUATIONS = SITUATIONS.filter((s) =>
  ["AC is not cooling", "Switch sparks or the MCB keeps tripping", "Tap leaking or a blocked drain", "Phone screen cracked", "Laptop is slow or overheating", "Car or bike due for a service", "Photographer for a function", "A pandit for a puja"].includes(s.label),
);

/** Common problems set as an index: ruled rows instead of boxed cards, so the words carry the section. */
export default function PopularNeeds() {
  return (
    <Section id="popular-needs" sx={editorialSection}>
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 3, mb: { xs: 4, md: 6 } }}>
        <Box sx={{ maxWidth: 680 }}>
          <Typography sx={editorialEyebrow}>Start with the problem</Typography>
          <Typography component="h2" sx={{ ...editorialTitle, mt: 1.25 }}>What people in Jaipur come to us for</Typography>
        </Box>
        <Box component={Link} href="/explore-services" sx={{ display: "inline-flex", alignItems: "center", gap: 1, minHeight: 48, px: 3, borderRadius: 999, border: "1px solid", borderColor: COLORS.NEW_UI.INK, color: COLORS.NEW_UI.INK, fontWeight: 600, fontSize: "0.95rem", textDecoration: "none", transition: "background-color 150ms ease-out, color 150ms ease-out", "&:hover": { bgcolor: COLORS.NEW_UI.INK, color: COLORS.WHITE }, ...editorialFocus }}>
          See every service and guide <ArrowForwardRoundedIcon aria-hidden sx={{ fontSize: 18 }} />
        </Box>
      </Box>

      <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", columnGap: { md: 8 }, gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "repeat(2, minmax(0, 1fr))" } }}>
        {HOME_SITUATIONS.map((s) => (
          <Box component="li" key={s.label} sx={{ borderBottom: HAIRLINE, "&:first-of-type": { borderTop: HAIRLINE }, "&:nth-of-type(2)": { borderTop: { md: HAIRLINE } } }}>
            <Box
              component={Link}
              href={s.href}
              sx={{ display: "flex", alignItems: "center", gap: { xs: 2, md: 2.5 }, py: 2.75, minHeight: 92, color: COLORS.NEW_UI.INK, textDecoration: "none", "& .need-title, & .need-arrow": { transition: "color 150ms ease-out, background-color 150ms ease-out, transform 150ms ease-out" }, "&:hover .need-title": { color: COLORS.PRIMARY_PURPLE }, "&:hover .need-arrow": { bgcolor: COLORS.PRIMARY_PURPLE, borderColor: COLORS.PRIMARY_PURPLE, color: COLORS.WHITE, transform: "translateX(4px)" }, "@media (prefers-reduced-motion: reduce)": { "& .need-title, & .need-arrow": { transition: "none" }, "&:hover .need-arrow": { transform: "none" } }, ...editorialFocus }}
            >
              <CategoryIcon icon={s.icon} size={28} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography component="span" className="need-title" sx={{ display: "block", fontWeight: 600, fontSize: { xs: "1.05rem", md: "1.2rem" }, lineHeight: 1.35 }}>{s.label}</Typography>
                <Typography component="span" sx={{ display: "block", mt: 0.5, fontSize: "0.9rem", color: "text.secondary" }}>{s.hint}</Typography>
              </Box>
              <Box component="span" aria-hidden className="need-arrow" sx={{ flex: "0 0 auto", width: 40, height: 40, borderRadius: "50%", display: "grid", placeItems: "center", border: "1px solid", borderColor: COLORS.NEW_UI.OUTLINE_LIGHT }}>
                <ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Section>
  );
}
