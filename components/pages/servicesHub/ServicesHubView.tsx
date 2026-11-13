"use client";

import React from "react";
import Link from "next/link";
import { Box, Typography } from "@mui/material";
import MainLayout from "@/app/mainLayout";
import { COLORS } from "@/constants/colors";
import { categoryContentPath } from "@/lib/services/content";
import type { CategoryContent } from "@/lib/services/types";
import { Breadcrumbs, BulletList, CardGrid, CtaBand, LinkCard, PageContainer, PageHeader, Paragraphs, Section } from "./ContentBlocks";

interface Props {
  categories: CategoryContent[];
  /** Live service counts by category slug in the coverage city. */
  coverage: Record<string, number>;
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
  "Are the details of what is and is not included clear before work starts?",
  "Is everything you agree written down in the chat or a bill?",
];

const ServicesHubView: React.FC<Props> = ({ categories, coverage, cityName, citySlug }) => {
  const liveCategories = categories.filter((c) => (coverage[c.slug] ?? 0) > 0);

  return (
    <MainLayout>
      <PageContainer>
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Services" }]} />
        <PageHeader title="Explore services on Kartsquare" lead="Find local service providers, read their profiles and send a request. Start with a category to see what it covers and what to ask before you choose." />

        <Section id="categories" title="Service categories">
          <CardGrid>
            {categories.map((c) => (
              <LinkCard key={c.slug} href={categoryContentPath(c.slug)} title={c.name}>
                {c.commonServices.slice(0, 4).join(", ")}
              </LinkCard>
            ))}
          </CardGrid>
        </Section>

        {liveCategories.length > 0 && (
          <Section id="city" title={`Providers in ${cityName}`}>
            <Paragraphs items={[`These categories have providers listed in ${cityName} right now. Each link opens the list for that category.`]} />
            <Box component="ul" sx={{ display: "flex", flexWrap: "wrap", gap: 1, listStyle: "none", m: 0, p: 0 }}>
              {liveCategories.map((c) => (
                <li key={c.slug}>
                  <Box component={Link} href={`/${citySlug}/${c.slug}`} sx={{ display: "inline-block", px: 2, py: 1, borderRadius: 9999, border: `1px solid ${COLORS.NEW_UI.CARD_BORDER_LIGHT}`, color: "text.primary", textDecoration: "none", fontSize: "0.9rem", fontWeight: 500, "&:hover": { borderColor: COLORS.PRIMARY_PURPLE } }}>
                    {c.name} in {cityName}
                  </Box>
                </li>
              ))}
            </Box>
          </Section>
        )}

        <Section id="how" title="How Kartsquare works">
          <CardGrid>
            {STEPS.map((s, i) => (
              <Box key={s.title} sx={{ p: 3, borderRadius: "24px", border: `1px solid ${COLORS.NEW_UI.CARD_BORDER_LIGHT}` }}>
                <Typography component="h3" sx={{ fontWeight: 700, fontSize: "1.0625rem", mb: 0.5 }}>
                  {i + 1}. {s.title}
                </Typography>
                <Typography sx={{ color: "text.secondary", lineHeight: 1.6 }}>{s.text}</Typography>
              </Box>
            ))}
          </CardGrid>
          <Box sx={{ mt: 2 }}>
            <Paragraphs items={["Kartsquare helps you find and contact providers. The work, the visit and the price are agreed between you and the provider. A listing is not a promise of availability, a result or a price."]} />
          </Box>
        </Section>

        <Section id="check" title="What to check before choosing a provider">
          <BulletList items={CHECKS} />
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
