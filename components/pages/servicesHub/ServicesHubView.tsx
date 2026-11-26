"use client";

import React from "react";
import Link from "next/link";
import { Box, Typography } from "@mui/material";
import MainLayout from "@/app/mainLayout";
import { COLORS } from "@/constants/colors";
import { COMMITMENTS, HUB_FAQ, PLAYBOOK, SEASON_SOURCES, SEASONS, SITUATIONS } from "@/data/services/hubCopy";
import { categoryContentPath, subServicePath } from "@/lib/services/content";
import type { CategoryMedia } from "@/lib/services/coverage";
import type { ListingLink } from "@/lib/services/listingDirectory";
import { photoSrc } from "@/lib/services/photo";
import type { CategoryContent, SubServiceContent } from "@/lib/services/types";
import FaqSection from "./FaqSection";
import { PeopleIllustration } from "./illustrations";
import { Band, CategoryTile, EditorialHero, Heading, HowItWorksBand, PillLink, PlayStoreButton, ServiceChip, TileGrid } from "./editorial";
import { ChipLink, CommitmentGrid, GuideCard, GuideGrid, GuideToc, PhotoCollage, SeasonTimeline, SituationGrid, SourcesNote } from "./guideBlocks";

interface Props {
  categories: CategoryContent[];
  /** Service guides inside categories (/services/c/{category}/{slug}). Optional. */
  guides?: SubServiceContent[];
  /** Live service counts by category slug in the coverage city. */
  coverage: Record<string, number>;
  /** Icon, colour and photo per category slug, from the API. Optional. */
  media?: Record<string, CategoryMedia>;
  /** Slugs whose /services/c/{slug} page can be opened. Others link to the city list when they have providers, or are left out. */
  contentSlugs?: string[];
  cityName: string;
  citySlug: string;
  /** Optional strip along the bottom of the hero (the home page's moving list of services). */
  heroStrip?: React.ReactNode;
  /** Every listing page in the coverage city, linked in plain HTML. */
  listings?: ListingLink[];
}

/** Real category slugs, grouped by what the customer needs. A category not listed here goes under "More services". */
const GROUPS: { id: string; title: string; lead: string; slugs: string[] }[] = [
  { id: "fix", title: "Repairs and upkeep", lead: "The house, the gadgets and the vehicle.", slugs: ["home-services", "mobile-electronics-repair", "automotive", "security-services", "energy-environment"] },
  { id: "body", title: "Health and fitness", lead: "Trainers, classes and coaching near home.", slugs: ["fitness-sports"] },
  { id: "occasions", title: "Food, events and ceremonies", lead: "For the days that matter.", slugs: ["restaurants-food", "photography-videography", "religious-spiritual"] },
  { id: "digital", title: "Digital and business", lead: "Help for shops and small businesses.", slugs: ["it-digital-services"] },
];

const STEPS = [
  { title: "Say what is wrong", text: "Pick a problem or a category, or just tell Kart AI in your own words." },
  { title: "Pick a provider", text: "Read profiles: what they offer, where they work and, where there are any, real reviews." },
  { title: "Send your request", text: "Add a photo and a time that suits you. The provider replies to you directly." },
];

const ServicesHubView: React.FC<Props> = ({ categories, guides = [], coverage, media = {}, contentSlugs, cityName, citySlug, heroStrip, listings = [] }) => {
  const isLive = (slug: string) => (coverage[slug] ?? 0) > 0;
  const liveCategories = categories.filter((c) => isLive(c.slug));
  // Every tile must open a real page: the category guide when it is viewable, else the city list if it has providers.
  const hrefFor = (slug: string): string | null =>
    !contentSlugs || contentSlugs.includes(slug) ? categoryContentPath(slug) : isLive(slug) ? `/${citySlug}/${slug}` : null;
  const viewable = (href: string) => {
    const m = href.match(/^\/services\/c\/([^/]+)(?:\/([^/]+))?$/);
    if (!m) return true;
    if (m[2]) return guides.some((g) => g.categorySlug === m[1] && g.slug === m[2]);
    return !contentSlugs || contentSlugs.includes(m[1]);
  };
  const bySlug = new Map(categories.map((c) => [c.slug, c]));
  const grouped = GROUPS.map((g) => ({ ...g, items: g.slugs.map((s) => bySlug.get(s)).filter((c): c is CategoryContent => Boolean(c)) }));
  const known = new Set(GROUPS.flatMap((g) => g.slugs));
  const rest = categories.filter((c) => !known.has(c.slug));
  if (rest.length) grouped.push({ id: "more", title: "More services", lead: "Other kinds of local help.", slugs: rest.map((c) => c.slug), items: rest });
  const visibleGroups = grouped
    .map((g) => ({
      ...g,
      tiles: g.items.flatMap((c) => {
        const href = hrefFor(c.slug);
        return href ? [<CategoryTile key={c.slug} href={href} name={c.name} media={media[c.slug]} note={isLive(c.slug) ? `Listed in ${cityName}` : undefined} />] : [];
      }),
    }))
    .filter((g) => g.tiles.length > 0);
  // Links into guides only when that page can be opened, so nothing on the hub leads to a 404.
  const situations = SITUATIONS.filter((s) => viewable(s.href));
  const seasons = SEASONS.map((s) => ({ ...s, links: s.links.filter((l) => viewable(l.href)) }));
  const photos = categories.map((c) => photoSrc(media[c.slug]?.image)).filter((p): p is string => Boolean(p));
  const guideHref = (g: SubServiceContent) => subServicePath(g.categorySlug, g.slug);

  const toc = [
    { id: "problems", label: "By problem" },
    { id: "categories", label: "Categories" },
    ...(guides.length ? [{ id: "guides", label: "Repair guides" }] : []),
    { id: "seasons", label: `${cityName} through the year` },
    { id: "playbook", label: "Hiring tips" },
    { id: "promise", label: "Our promise" },
    { id: "faq", label: "FAQ" },
  ];

  return (
    <MainLayout>
      <EditorialHero
        crumbs={[{ name: "Home", href: "/" }, { name: "Services" }]}
        eyebrow={`Local services · ${cityName}`}
        title={`Find the right local help in ${cityName}, and know what to ask.`}
        strip={heroStrip}
        tagline="Repairs, home jobs, functions and more, explained in plain words."
        lead="Start with the problem in front of you. Each guide tells you what the job involves, what usually goes wrong, what changes the price and what to say in your first message. Then pick a provider and send your request."
        aside={photos.length >= 4 ? <PhotoCollage photos={photos} /> : <Box sx={{ display: { xs: "none", md: "block" }, maxWidth: 480, ml: "auto", width: "100%" }}><PeopleIllustration /></Box>}
      >
        <PlayStoreButton onDark />
        <PillLink href="#problems" onDark>Start with your problem</PillLink>
        {guides.length > 0 && (
          <Box sx={{ flexBasis: "100%", mt: 1.5 }}>
            <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: COLORS.NEW_UI.EDITORIAL_LILAC, mb: 1 }}>Popular guides</Typography>
            <Box component="ul" sx={{ display: "flex", flexWrap: "wrap", gap: 1, listStyle: "none", m: 0, p: 0 }}>
              {guides.slice(0, 4).map((g) => (<li key={g.slug}><ChipLink onDark href={guideHref(g)}>{g.name}</ChipLink></li>))}
            </Box>
          </Box>
        )}
      </EditorialHero>

      <GuideToc items={toc} />

      <Band id="problems" labelledBy="problems-title">
        <Heading id="problems-title" eyebrow="Start here" title="What do you need help with?" lead="Pick the line closest to your problem. Each one opens the guide that explains it, with providers in the city where there are any." />
        <SituationGrid items={situations} />
      </Band>

      <Band tone="tint" id="categories" labelledBy="categories-title">
        <Heading id="categories-title" eyebrow="All categories" title="Or browse by kind of service" lead="Every category has its own guide: what it covers, what to ask a provider and what to put in your request." />
        <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 5, md: 6 } }}>
          {visibleGroups.map((g) => (
            <Box component="section" key={g.id} aria-labelledby={`group-${g.id}`}>
              <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", gap: 1, mb: 2, pb: 1.5, borderBottom: "1px solid", borderColor: COLORS.NEW_UI.OUTLINE_LIGHT }}>
                <Typography id={`group-${g.id}`} component="h3" sx={{ fontWeight: 700, fontSize: { xs: "1.2rem", md: "1.4rem" } }}>{g.title}</Typography>
                <Typography sx={{ color: "text.secondary", fontSize: "0.95rem" }}>{g.lead}</Typography>
              </Box>
              <TileGrid fiveUp>{g.tiles}</TileGrid>
            </Box>
          ))}
        </Box>
      </Band>

      {guides.length > 0 && (
        <Band tone="ink" id="guides" labelledBy="guides-title">
          <Heading id="guides-title" onDark eyebrow="In depth" title="Repair guides" lead="The repairs people ask about most, covered properly: the common faults, what changes the cost and how to get your device ready." />
          <GuideGrid cards>
            {guides.map((g) => (<GuideCard card key={g.slug} href={guideHref(g)} name={g.name} text={g.tagline} icon={g.icon} color={media[g.categorySlug]?.color} />))}
          </GuideGrid>
        </Band>
      )}

      <Band id="how" labelledBy="how-title">
        <Heading id="how-title" eyebrow="How it works" title="From a problem to a request in three steps." />
        <HowItWorksBand steps={STEPS} />
      </Band>

      <Band tone="night" id="seasons" labelledBy="seasons-title">
        <Heading id="seasons-title" onDark eyebrow="Plan ahead" title={`${cityName} through the year`} lead="Most service problems here follow the weather and the calendar. Knowing what is coming lets you book before everyone else does." />
        <SeasonTimeline items={seasons} />
        <SourcesNote items={SEASON_SOURCES} />
      </Band>

      <Band tone="tint" id="playbook" labelledBy="playbook-title">
        <Box sx={{ display: "grid", gap: { xs: 3, md: 8 }, gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) minmax(0, 1.8fr)" }, alignItems: "start" }}>
          <Box sx={{ position: { md: "sticky" }, top: { md: 140 } }}>
            <Heading id="playbook-title" eyebrow="Hiring tips" title="Hiring local help, the practical way" lead="Five habits that save money and arguments, whoever you hire and whatever the job." />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 3, md: 4 } }}>
            {PLAYBOOK.map((s) => (
              <Box component="article" key={s.heading} sx={{ pb: { xs: 3, md: 4 }, borderBottom: "1px solid", borderColor: COLORS.NEW_UI.CARD_BORDER_LIGHT, "&:last-of-type": { borderBottom: 0, pb: 0 } }}>
                <Typography component="h3" sx={{ fontWeight: 700, fontSize: { xs: "1.2rem", md: "1.35rem" }, mb: 1.5 }}>{s.heading}</Typography>
                {s.paragraphs.map((p) => (
                  <Typography key={p} sx={{ color: "text.secondary", lineHeight: 1.8, "& + &": { mt: 1.5 } }}>{p}</Typography>
                ))}
              </Box>
            ))}
          </Box>
        </Box>
      </Band>

      <Band tone="ink" id="promise" labelledBy="promise-title">
        <Heading id="promise-title" onDark eyebrow="Our promise" title="What you can count on here" lead="Four things we hold to on every page, every listing and every request." />
        <CommitmentGrid onDark items={COMMITMENTS} />
      </Band>

      {liveCategories.length > 0 && (
        <Band id="city" labelledBy="city-title">
          <Heading id="city-title" eyebrow={cityName} title={`Listed in ${cityName} right now`} lead="These categories already have providers in the city. Each link opens the list." />
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

      {listings.length > 0 && (
        <Band tone="tint" id="listings" labelledBy="listings-title">
          <Heading id="listings-title" eyebrow={cityName} title={`Businesses listed in ${cityName}`} lead="Open a listing to see what it offers, its charges where given and the area it covers." />
          <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", columnGap: 3, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", lg: "repeat(3, minmax(0, 1fr))" } }}>
            {listings.map((l) => (
              <li key={l.href}>
                <Box component={Link} href={l.href} sx={{ display: "flex", alignItems: "center", minHeight: 48, borderBottom: "1px solid", borderColor: COLORS.NEW_UI.CARD_BORDER_LIGHT, color: "text.primary", fontWeight: 600, textDecoration: "none", "&:hover": { color: COLORS.PRIMARY_PURPLE }, "&:focus-visible": { outline: `3px solid ${COLORS.PRIMARY_PURPLE}`, outlineOffset: 2 } }}>{l.name}</Box>
              </li>
            ))}
          </Box>
        </Band>
      )}

      <FaqSection items={HUB_FAQ} title="Questions people ask" intro={`Straight answers about finding local services in ${cityName} on Kartsquare.`} />

      <Band id="cta" labelledBy="cta-title">
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" } }}>
          <Box sx={{ p: { xs: 3, md: 5 }, borderRadius: "24px", color: COLORS.WHITE, bgcolor: COLORS.NEW_UI.INK }}>
            <Typography id="cta-title" component="h2" sx={{ fontWeight: 700, fontSize: { xs: "1.375rem", md: "1.875rem" }, lineHeight: 1.2 }}>Need something done?</Typography>
            <Typography sx={{ mt: 1.5, mb: 3, lineHeight: 1.7, color: "rgba(255,255,255,0.85)" }}>Browse every service listed in {cityName}, or describe the problem and let Kart AI point you to the right one.</Typography>
            <PillLink href="/cus/services-list" onDark>Browse services in {cityName}</PillLink>
          </Box>
          <Box sx={{ p: { xs: 3, md: 5 }, borderRadius: "24px", bgcolor: COLORS.WHITE, border: "1px solid", borderColor: COLORS.NEW_UI.CARD_BORDER_LIGHT }}>
            <Typography component="h2" sx={{ fontWeight: 700, fontSize: { xs: "1.375rem", md: "1.875rem" }, lineHeight: 1.2 }}>Do this work yourself?</Typography>
            <Typography sx={{ mt: 1.5, mb: 3, lineHeight: 1.7, color: "text.secondary" }}>Create a free profile, list your services and the areas you cover, and get requests from customers nearby.</Typography>
            <PillLink href="/business-listing">List your business</PillLink>
          </Box>
        </Box>
      </Band>
    </MainLayout>
  );
};

export default ServicesHubView;
