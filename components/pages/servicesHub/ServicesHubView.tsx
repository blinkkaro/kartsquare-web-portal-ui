"use client";

import React from "react";
import Link from "next/link";
import { Box, Typography } from "@mui/material";
import MainLayout from "@/app/mainLayout";
import { COLORS } from "@/constants/colors";
import { categoryContentPath } from "@/lib/services/content";
import type { CategoryMedia } from "@/lib/services/coverage";
import type { CategoryContent } from "@/lib/services/types";
import FaqSection from "./FaqSection";
import KartAiHowItWorks from "./KartAiHowItWorks";
import { AvatarStack, PeopleIllustration } from "./illustrations";
import { Band, CategoryTile, EditorialHero, Heading, HowItWorksBand, MarkList, PillLink, PlayStoreButton, ServiceChip, TileGrid } from "./editorial";

interface Props {
  categories: CategoryContent[];
  /** Live service counts by category slug in the coverage city. */
  coverage: Record<string, number>;
  /** Icon, colour and photo per category slug, from the API. Optional. */
  media?: Record<string, CategoryMedia>;
  /** Slugs whose /services/c/{slug} page can be opened. Others link to the city list when they have providers, or are left out. */
  contentSlugs?: string[];
  cityName: string;
  citySlug: string;
}

/** Real category slugs, grouped by what the customer needs. A category not listed here goes under "More services". */
const GROUPS: { id: string; title: string; slugs: string[] }[] = [
  { id: "fix", title: "Repairs and upkeep", slugs: ["home-services", "mobile-electronics-repair", "automotive", "security-services", "energy-environment"] },
  { id: "body", title: "Health and fitness", slugs: ["fitness-sports"] },
  { id: "occasions", title: "Food, events and ceremonies", slugs: ["restaurants-food", "photography-videography", "religious-spiritual"] },
  { id: "digital", title: "Digital and business", slugs: ["it-digital-services"] },
];

const STEPS = [
  { title: "Explore a category", text: "Pick the kind of service you need and read what it covers." },
  { title: "Review provider profiles", text: "Open a profile to see what the provider lists and where they work." },
  { title: "Send a request", text: "Describe what you need. The provider replies to you directly." },
];

const YOU_CAN = ["Explore service categories and read what each covers", "Open provider profiles and check the service details", "Send a request describing what you need", "Ask Kart AI when you are not sure which service to pick"];
const STAYS = ["The visit, the work and the price are agreed with the provider", "A listing does not promise availability, a result or a price", "Kartsquare does not do the work itself", "Details such as what is included are confirmed before work starts"];

const FAQ = [
  { q: "What is Kart AI?", a: "An assistant in the app and on the website. Describe a problem in Hindi, Hinglish or English, by typing or speaking, and it suggests matching services." },
  { q: "Which city does Kartsquare cover?", a: "We are starting in Jaipur. Categories with no providers listed there yet are marked as coming next." },
  { q: "How do I contact a provider?", a: "Open the provider's profile and send a request with what you need. The provider replies to you directly." },
  { q: "Can I use Kartsquare on my phone?", a: "Yes. Use the website in your browser or install the Kartsquare Android app from Google Play." },
];

const ServicesHubView: React.FC<Props> = ({ categories, coverage, media = {}, contentSlugs, cityName, citySlug }) => {
  const isLive = (slug: string) => (coverage[slug] ?? 0) > 0;
  const liveCategories = categories.filter((c) => isLive(c.slug));
  // Every tile must open a real page: the category guide when it is viewable, else the city list if it has providers.
  const hrefFor = (slug: string): string | null =>
    !contentSlugs || contentSlugs.includes(slug) ? categoryContentPath(slug) : isLive(slug) ? `/${citySlug}/${slug}` : null;
  const bySlug = new Map(categories.map((c) => [c.slug, c]));
  const grouped = GROUPS.map((g) => ({ ...g, items: g.slugs.map((s) => bySlug.get(s)).filter((c): c is CategoryContent => Boolean(c)) }));
  const known = new Set(GROUPS.flatMap((g) => g.slugs));
  const rest = categories.filter((c) => !known.has(c.slug));
  if (rest.length) grouped.push({ id: "more", title: "More services", slugs: rest.map((c) => c.slug), items: rest });
  const groupOf = new Map(grouped.flatMap((g) => g.items.map((c) => [c.slug, g.title] as const)));
  const ordered = grouped.flatMap((g) => g.items);
  const tiles = (items: CategoryContent[]) =>
    items.flatMap((c) => {
      const href = hrefFor(c.slug);
      return href ? [<CategoryTile key={c.slug} href={href} name={c.name} media={media[c.slug]} note={isLive(c.slug) ? `Listed in ${cityName}` : groupOf.get(c.slug)} />] : [];
    });

  return (
    <MainLayout>
      <EditorialHero
        crumbs={[{ name: "Home", href: "/" }, { name: "Services" }]}
        eyebrow={`Explore · ${cityName}`}
        title="Find the right local service for what you need."
        tagline={`Explore categories and read provider profiles in ${cityName}.`}
        lead="Start with a category to see what it covers and what to ask before you choose. Then send a request to a provider."
        aside={<Box sx={{ display: { xs: "none", md: "block" }, maxWidth: 480, ml: "auto", width: "100%" }}><PeopleIllustration /></Box>}
      >
        <PlayStoreButton onDark />
        <PillLink href="/cus/services-list" onDark>Browse all services</PillLink>
      </EditorialHero>

      <Band id="categories" labelledBy="categories-title">
        <Heading id="categories-title" eyebrow="Our services" title="Start with what you need" lead="Each category has a short guide: what it covers, what to ask a provider and what to include in your request." />
        <TileGrid fiveUp>{tiles(ordered)}</TileGrid>
      </Band>

      <Band tone="ink" id="how" labelledBy="how-title">
        <Heading id="how-title" onDark eyebrow="How it works" title="Three steps from a problem to a request." lead="Describe what you need, pick a provider and send your request." />
        <HowItWorksBand steps={STEPS} samples={categories.slice(0, 3).map((c) => ({ name: c.name, media: media[c.slug] }))} />
      </Band>

      {liveCategories.length > 0 && (
        <Band tone="tint" id="city" labelledBy="city-title">
          <Heading id="city-title" eyebrow={cityName} title={`Services listed in ${cityName}`} lead={`Providers are listed in ${cityName} for these categories right now. Each link opens the list.`} />
          <Box component="ul" sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, listStyle: "none", m: 0, p: 0 }}>
            {liveCategories.map((c) => (
              <li key={c.slug}>
                <Box component={Link} href={`/${citySlug}/${c.slug}`} sx={{ textDecoration: "none", color: "inherit", "&:focus-visible": { outline: `3px solid ${COLORS.PRIMARY_PURPLE}`, outlineOffset: 2, borderRadius: "14px" } }}>
                  <ServiceChip>{c.name}</ServiceChip>
                </Box>
              </li>
            ))}
          </Box>
        </Band>
      )}

      <Band id="clarity" labelledBy="clarity-title">
        <Heading id="clarity-title" eyebrow="Good to know" title="What you can do, and what stays with the provider" />
        <Box sx={{ display: "grid", gap: { xs: 4, md: 8 }, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" } }}>
          <Box>
            <Typography component="h3" sx={{ fontWeight: 700, fontSize: "1.2rem", mb: 2 }}>On Kartsquare you can</Typography>
            <MarkList kind="yes" items={YOU_CAN} />
          </Box>
          <Box>
            <Typography component="h3" sx={{ fontWeight: 700, fontSize: "1.2rem", mb: 2 }}>Between you and the provider</Typography>
            <MarkList kind="no" items={STAYS} />
          </Box>
        </Box>
      </Band>

      <KartAiHowItWorks />

      <FaqSection items={FAQ} />

      <Band id="cta" labelledBy="cta-title">
        <Box sx={{ textAlign: "center", maxWidth: 640, mx: "auto" }}>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}><AvatarStack /></Box>
          <Heading id="cta-title" title={`Explore services in ${cityName}`} lead="Browse every service on Kartsquare, or pick a category above to read about it first." />
          <PillLink href="/cus/services-list">Explore services in {cityName}</PillLink>
        </Box>
      </Band>
    </MainLayout>
  );
};

export default ServicesHubView;
