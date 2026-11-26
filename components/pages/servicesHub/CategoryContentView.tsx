"use client";

import React from "react";
import Link from "next/link";
import { Box, Typography } from "@mui/material";
import MainLayout from "@/app/mainLayout";
import { COLORS } from "@/constants/colors";
import { categoryContentPath, relatedCategories, SERVICES_HUB_PATH, subServicePath, subServicesFor } from "@/lib/services/content";
import type { CategoryMedia } from "@/lib/services/coverage";
import type { CategoryContent } from "@/lib/services/types";
import type { Service } from "@/services/serviceList/listInteraface";
import { getServiceHref } from "@/utils/serviceRoute";
import { CategoryVisual } from "./ContentBlocks";
import FaqSection from "./FaqSection";
import KartAiHowItWorks from "./KartAiHowItWorks";
import { Band, CategoryTile, EditorialHero, Heading, MarkList, PillLink, PlayStoreButton, ProviderRow, RequestNote, ServiceChip, StepTimeline, TileGrid } from "./editorial";
import { ChipLink, GuideArticle, GuideCard, GuideGrid, GuideToc, SourcesNote } from "./guideBlocks";

interface Props {
  content: CategoryContent;
  /** Live services in the coverage city for this category, from the API. Empty means no coverage. */
  providers: Service[];
  /** Live service counts by category slug in the coverage city, to decide which links to show. */
  coverage: Record<string, number>;
  /** Icon, colour and photo per category slug, from the API. Optional: a plain icon tile is used without it. */
  media?: Record<string, CategoryMedia>;
  cityName: string;
  citySlug: string;
}

const CategoryContentView: React.FC<Props> = ({ content, providers, coverage, media = {}, cityName, citySlug }) => {
  const live = (coverage[content.slug] ?? 0) > 0;
  const related = relatedCategories(content);
  const cityHref = `/${citySlug}/${content.slug}`;
  const primary = live ? { label: `View providers in ${cityName}`, href: cityHref } : { label: "Browse all services", href: "/cus/services-list" };
  const guides = subServicesFor(content.slug);
  const guideFor = (name: string) => guides.find((g) => g.name.toLowerCase() === name.toLowerCase());
  const color = media[content.slug]?.color;
  const toc = [
    { id: "about", label: "What is included" },
    ...(guides.length ? [{ id: "guides", label: "Guides" }] : []),
    ...(content.guide?.length ? [{ id: "know", label: "Good to know" }] : []),
    { id: "help", label: "What to expect" },
    { id: "choose", label: "How to choose" },
    { id: "info", label: "Your request" },
    ...(live ? [{ id: "providers", label: `In ${cityName}` }] : []),
    { id: "faq", label: "FAQ" },
  ];

  return (
    <MainLayout>
      <EditorialHero
        crumbs={[{ name: "Home", href: "/" }, { name: "Services", href: SERVICES_HUB_PATH }, { name: content.name }]}
        eyebrow="Service category"
        title={content.h1}
        tagline={content.tagline}
        lead={content.intro[0]}
        aside={
          <Box sx={{ display: { xs: "none", md: "block" }, width: "100%", maxWidth: 440, justifySelf: "end" }}>
            <CategoryVisual media={media[content.slug]} height={500} radius="999px 999px 24px 24px" iconSize={112} />
          </Box>
        }
      >
        <PlayStoreButton onDark />
        <PillLink href={primary.href} onDark>{primary.label}</PillLink>
      </EditorialHero>

      <GuideToc items={toc} />

      <Band id="about" labelledBy="about-title">
        <Box sx={{ display: "grid", gap: { xs: 3, md: 8 }, gridTemplateColumns: { xs: "1fr", md: "1fr 1.2fr" }, alignItems: "start" }}>
          <Heading id="about-title" eyebrow="What is included" title={`What ${content.name} covers`} />
          <Box>
            <Box component="ul" aria-label="Common services" sx={{ display: "flex", flexWrap: "wrap", gap: 1.25, listStyle: "none", m: 0, p: 0 }}>
              {content.commonServices.map((s) => {
                const g = guideFor(s);
                return <li key={s}>{g ? <ChipLink href={subServicePath(g.categorySlug, g.slug)}>{s}</ChipLink> : <ServiceChip>{s}</ServiceChip>}</li>;
              })}
            </Box>
            {content.intro.slice(1).map((p) => (
              <Typography key={p} sx={{ mt: 3, lineHeight: 1.75, color: "text.secondary" }}>{p}</Typography>
            ))}
          </Box>
        </Box>
      </Band>

      {guides.length > 0 && (
        <Band tone="tint" id="guides" labelledBy="guides-title">
          <Heading id="guides-title" eyebrow="Guides" title={`${content.name} guides`} lead="Each guide explains the common faults, what changes the cost and what to tell a repairer." />
          <GuideGrid>
            {guides.map((g) => (<GuideCard key={g.slug} href={subServicePath(g.categorySlug, g.slug)} name={g.name} text={g.tagline} icon={g.icon} color={color} />))}
          </GuideGrid>
        </Band>
      )}

      {content.guide && content.guide.length > 0 && (
        <Band id="know" labelledBy="know-title">
          <Heading id="know-title" eyebrow="Good to know" title={`${content.name} in ${cityName}: what to know`} />
          <GuideArticle sections={content.guide} />
          {content.sources && <SourcesNote items={content.sources} />}
        </Band>
      )}

      <Band tone="tint" id="help" labelledBy="help-title">
        <Heading id="help-title" eyebrow="What to expect" title="What providers may help with, and what they may not" />
        <Box sx={{ display: "grid", gap: { xs: 4, md: 8 }, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" } }}>
          <Box>
            <Typography component="h3" sx={{ fontWeight: 700, fontSize: "1.2rem", mb: 2 }}>Providers may help with</Typography>
            <MarkList kind="yes" items={content.mayHelp} />
          </Box>
          <Box>
            <Typography component="h3" sx={{ fontWeight: 700, fontSize: "1.2rem", mb: 2 }}>Kartsquare and providers may not</Typography>
            <MarkList kind="no" items={content.mayNotDo} />
          </Box>
        </Box>
      </Band>

      <Band id="choose" labelledBy="choose-title">
        <Box sx={{ display: "grid", gap: { xs: 3, md: 8 }, gridTemplateColumns: { xs: "1fr", md: "1fr 1.2fr" }, alignItems: "start" }}>
          <Heading id="choose-title" eyebrow="Before you decide" title="How to choose a provider" lead="Read the profile first, then ask the provider about anything it does not say." />
          <StepTimeline items={content.howToChoose} />
        </Box>
      </Band>

      <Band tone="tint" id="info" labelledBy="info-title">
        <Box sx={{ display: "grid", gap: { xs: 3, md: 8 }, gridTemplateColumns: { xs: "1fr", md: "1fr 1.2fr" }, alignItems: "start" }}>
          <Heading id="info-title" eyebrow="Your request" title="What to include in a service request" lead="A clear request gets a clearer reply. Mention these when you write to a provider." />
          <RequestNote items={content.requestInfo} />
        </Box>
      </Band>

      {live && (
        <Band id="providers" labelledBy="providers-title">
          <Heading id="providers-title" eyebrow={cityName} title={`${content.name} providers in ${cityName}`} />
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, maxWidth: 820 }}>
            {providers.map((p) => (<ProviderRow key={p.service_id} href={getServiceHref(p)} title={p.service_name} by={p.provider_name} />))}
            <Typography sx={{ mt: 1 }}>
              <Box component={Link} href={cityHref} sx={{ color: COLORS.PRIMARY_PURPLE, fontWeight: 700 }}>See all {content.name} providers in {cityName}</Box>
            </Typography>
          </Box>
        </Band>
      )}

      <KartAiHowItWorks intro={`Not sure which ${content.name} service you need? Describe the problem to Kart AI.`} />

      <FaqSection items={content.faq} title="Frequently asked questions" intro={`Short answers about ${content.name} on Kartsquare.`} />

      <Band id="related" labelledBy="related-title">
        <Heading id="related-title" eyebrow="Keep exploring" title="Related services" />
        <TileGrid>
          {related.map((r) => (<CategoryTile key={r.slug} href={categoryContentPath(r.slug)} name={r.name} media={media[r.slug]} />))}
        </TileGrid>
        <Box sx={{ mt: 5, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 2 }}>
          <PillLink href={SERVICES_HUB_PATH}>All service categories</PillLink>
        </Box>
      </Band>
    </MainLayout>
  );
};

export default CategoryContentView;
