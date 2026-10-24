"use client";
import React, { useCallback } from "react";
import Link from "next/link";
import { Box, Skeleton, useTheme } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { COLORS } from "@/constants/colors";
import { useTopSuggestions } from "@/hooks/useTopSuggestions";
import { useAppDispatch } from "@/store/hooks";
import { openDrawer } from "@/features/ui/profileDrawerSlice";
import { TopService } from "@/services/topSuppliers/topSupplires.interfaces";
import { Section, SectionHeader } from "./shared";
import ServiceCard from "./ServiceCard";

/** Phones swipe a snap carousel (peeking next card); tablets+ get a real grid. */
const cardTrack = {
  display: "grid",
  gridAutoFlow: { xs: "column", sm: "row" },
  gridAutoColumns: { xs: "min(280px, 74vw)", sm: "auto" },
  gridTemplateColumns: { sm: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" },
  gap: { xs: 1.5, md: 2.5 },
  overflowX: { xs: "auto", sm: "visible" },
  scrollSnapType: { xs: "x mandatory", sm: "none" },
  scrollbarWidth: "none",
  "&::-webkit-scrollbar": { display: "none" },
  mx: { xs: -2, sm: 0 },
  px: { xs: 2, sm: 0 },
  scrollPaddingInline: { xs: "16px", sm: 0 },
  pb: { xs: 1, sm: 0 },
  "& > *": { scrollSnapAlign: "start" },
} as const;

/**
 * Top services straight from the ranking endpoint (providers are reachable from each card).
 * A rating is shown only when the service has real reviews - the endpoint's raw average can be a default.
 */
export default function TopPros() {
  const dark = useTheme().palette.mode === "dark";
  const dispatch = useAppDispatch();
  const { servicer, isLoading } = useTopSuggestions("8");

  const openProvider = useCallback((userId: string) => dispatch(openDrawer({ userId })), [dispatch]);

  const services: TopService[] = servicer ?? [];

  if (!isLoading && services.length === 0) return null;

  return (
    <Section id="top-pros" sx={{ pb: { xs: 3, md: 8 }, px: { xs: 2, md: 5 } }}>
      <SectionHeader
        title="Trusted professionals near you"
        subtitle="Top-ranked services on Kartsquare right now"
        action={
          <Box
            component={Link}
            href="/cus/servicesList"
            sx={{ display: { xs: "none", sm: "inline-flex" }, alignItems: "center", gap: 0.75, minHeight: 44, flexShrink: 0, fontSize: "0.9rem", fontWeight: 700, color: dark ? "#d6b8ff" : COLORS.PRIMARY_PURPLE, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
          >
            See all <ArrowForwardRoundedIcon sx={{ fontSize: 17 }} />
          </Box>
        }
      />

      {isLoading ? (
        <Box sx={cardTrack}>
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rounded" sx={{ height: 340, borderRadius: 4.5 }} />
          ))}
        </Box>
      ) : (
        <>
          {services.length > 0 && (
            <Box sx={cardTrack}>
              {services.map((s) => (
                <ServiceCard key={s.id} service={s} onOpenProvider={openProvider} />
              ))}
            </Box>
          )}

        </>
      )}
    </Section>
  );
}
