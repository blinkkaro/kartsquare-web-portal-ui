"use client";

import React from "react";
import Link from "next/link";
import { Box, Typography } from "@mui/material";
import MainLayout from "@/app/mainLayout";
import { COLORS } from "@/constants/colors";
import { categoryContentPath } from "@/lib/services/content";
import type { CategoryMedia } from "@/lib/services/coverage";
import type { CategoryContent } from "@/lib/services/types";
import { CardGrid, CategoryCard, CheckList, CtaBand, HeroBand, HeroButton, PageContainer, Paragraphs, Section } from "./ContentBlocks";

interface Props {
  categories: CategoryContent[];
  /** Live service counts by category slug in the coverage city. */
  coverage: Record<string, number>;
  /** Icon, colour and photo per category slug, from the API. Optional. */
  media?: Record<string, CategoryMedia>;
  cityName: string;
  citySlug: string;
}

const STEPS = [
  { title: "Explore", text: "Browse service categories and read what each one covers." },
  { title: "Review profiles", text: "Open a provider's profile to see what they list and where they work." },
  { title: "Send a request", text: "Describe what you need. The provider replies to you directly." },
];

const CHECKS = [
  "Does the profile list the exact service you need, not just a nearby one?",
  "Does the provider cover your locality?",
  "Have they said how a visit, a quote and the final price are worked out?",
  "Is it clear what is and is not included before work starts?",
  "Is everything you agree written down in the chat or a bill?",
];

const ServicesHubView: React.FC<Props> = ({ categories, coverage, media = {}, cityName, citySlug }) => {
  const liveCategories = categories.filter((c) => (coverage[c.slug] ?? 0) > 0);

  return (
    <MainLayout>
      <HeroBand
        crumbs={[{ name: "Home", href: "/" }, { name: "Services" }]}
        eyebrow="Explore"
        title="Explore services on Kartsquare"
        lead="Find local service providers, read their profiles and send a request. Start with a category to see what it covers and what to ask before you choose."
        actions={
          <>
            <HeroButton href="/cus/services-list">Browse all services</HeroButton>
            {liveCategories[0] && (
              <HeroButton href={`/${citySlug}/${liveCategories[0].slug}`} variant="ghost">
                {liveCategories[0].name} in {cityName}
              </HeroButton>
            )}
          </>
        }
      />

      <PageContainer>
        <Section id="categories" eyebrow="Categories" title="Service categories">
          <CardGrid min={250}>
            {categories.map((c) => (
              <CategoryCard key={c.slug} href={categoryContentPath(c.slug)} name={c.name} text={c.commonServices.slice(0, 4).join(", ")} media={media[c.slug]} />
            ))}
          </CardGrid>
        </Section>

        {liveCategories.length > 0 && (
          <Section id="city" eyebrow={cityName} title={`Providers in ${cityName}`}>
            <Paragraphs items={[`These categories have providers listed in ${cityName} right now. Each link opens the list for that category.`]} />
            <Box component="ul" sx={{ display: "flex", flexWrap: "wrap", gap: 1, listStyle: "none", m: 0, p: 0 }}>
              {liveCategories.map((c) => (
                <li key={c.slug}>
                  <Box
                    component={Link}
                    href={`/${citySlug}/${c.slug}`}
                    sx={{ display: "inline-block", px: 2, py: 1, borderRadius: 9999, bgcolor: COLORS.PURPLE_ALPHA_10, color: COLORS.PRIMARY_PURPLE, textDecoration: "none", fontSize: "0.9rem", fontWeight: 600, "&:hover": { bgcolor: COLORS.PURPLE_ALPHA_20 } }}
                  >
                    {c.name} in {cityName}
                  </Box>
                </li>
              ))}
            </Box>
          </Section>
        )}

        <Section id="how" eyebrow="Simple" title="How Kartsquare works">
          <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" } }}>
            {STEPS.map((s, i) => (
              <Box key={s.title} sx={{ p: 3, borderRadius: 4, border: "1px solid", borderColor: "divider", bgcolor: "background.paper" }}>
                <Box aria-hidden sx={{ width: 36, height: 36, borderRadius: "50%", display: "grid", placeItems: "center", mb: 1.5, bgcolor: COLORS.PURPLE_ALPHA_10, color: COLORS.PRIMARY_PURPLE, fontWeight: 700 }}>
                  {i + 1}
                </Box>
                <Typography component="h3" sx={{ fontWeight: 700, fontSize: "1.0625rem", mb: 0.5 }}>
                  {s.title}
                </Typography>
                <Typography sx={{ color: "text.secondary", lineHeight: 1.65 }}>{s.text}</Typography>
              </Box>
            ))}
          </Box>
          <Box sx={{ mt: 2 }}>
            <Paragraphs items={["Kartsquare helps you find and contact providers. The work, the visit and the price are agreed between you and the provider. A listing is not a promise of availability, a result or a price."]} />
          </Box>
        </Section>

        <Section id="check" eyebrow="Before you choose" title="What to check before choosing a provider">
          <CheckList items={CHECKS} />
        </Section>

        <CtaBand
          title="Ready to look for a provider?"
          text="Browse every service on Kartsquare or pick a category above to read about it first."
          primary={{ label: "Browse all services", href: "/cus/services-list" }}
          secondary={liveCategories[0] ? { label: `${liveCategories[0].name} in ${cityName}`, href: `/${citySlug}/${liveCategories[0].slug}` } : undefined}
        />
      </PageContainer>
    </MainLayout>
  );
};

export default ServicesHubView;
