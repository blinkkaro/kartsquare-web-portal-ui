"use client";

import React from "react";
import Link from "next/link";
import { Box, Typography } from "@mui/material";
import CategoryIcon from "@/components/common/CategoryIcon";
import MainLayout from "@/app/mainLayout";
import { COLORS } from "@/constants/colors";
import { categoryContentPath, SERVICES_HUB_PATH, subServicePath, subServicesFor } from "@/lib/services/content";
import type { CategoryMedia } from "@/lib/services/coverage";
import type { CategoryContent, SubServiceContent } from "@/lib/services/types";
import type { Service } from "@/services/serviceList/listInteraface";
import { getServiceHref } from "@/utils/serviceRoute";
import FaqSection from "./FaqSection";
import KartAiHowItWorks from "./KartAiHowItWorks";
import { Band, EditorialHero, EmptyProviderState, Heading, MarkList, PillLink, PlayStoreButton, ProviderRow, RequestNote, StepTimeline } from "./editorial";
import { GuideArticle, GuideCard, GuideGrid, GuideToc, SymptomGrid } from "./guideBlocks";

interface Props {
  content: SubServiceContent;
  parent: CategoryContent;
  /** Live services in the coverage city whose listing names this service. Empty means none found. */
  providers: Service[];
  /** Live service counts by category slug in the coverage city. */
  coverage: Record<string, number>;
  media?: Record<string, CategoryMedia>;
  cityName: string;
  citySlug: string;
}

const h3 = { fontWeight: 700, fontSize: "1.2rem", mb: 2 } as const;

const SubServiceView: React.FC<Props> = ({ content, parent, providers, coverage, media = {}, cityName, citySlug }) => {
  const color = media[parent.slug]?.color;
  const parentLive = (coverage[parent.slug] ?? 0) > 0;
  const cityHref = `/${citySlug}/${parent.slug}`;
  const siblings = subServicesFor(parent.slug).filter((s) => s.slug !== content.slug);
  const primary = parentLive ? { label: `${parent.name} in ${cityName}`, href: cityHref } : { label: "Browse all services", href: "/cus/services-list" };
  // Mid-sentence form: "laptop repair", but acronyms stay as written ("CCTV repair").
  const lower = /^[A-Z]{2}/.test(content.name) ? content.name : content.name.charAt(0).toLowerCase() + content.name.slice(1);

  const toc = [
    { id: "problems", label: "Common problems" },
    { id: "guide", label: "Good to know" },
    { id: "expect", label: "What to expect" },
    { id: "cost", label: "Cost and preparation" },
    { id: "choose", label: "Choosing a repairer" },
    { id: "providers", label: `In ${cityName}` },
    { id: "faq", label: "FAQ" },
  ];

  return (
    <MainLayout>
      <EditorialHero
        crumbs={[{ name: "Home", href: "/" }, { name: "Services", href: SERVICES_HUB_PATH }, { name: parent.name, href: categoryContentPath(parent.slug) }, { name: content.name }]}
        eyebrow={parent.name}
        title={content.h1}
        tagline={content.tagline}
        lead={content.intro[0]}
        aside={
          <Box sx={{ display: { xs: "none", md: "grid" }, placeItems: "center", justifySelf: "end", width: "100%", maxWidth: 380, aspectRatio: "4 / 5", borderRadius: "999px 999px 24px 24px", bgcolor: COLORS.NEW_UI.EDITORIAL_TINT }}>
            <CategoryIcon icon={content.icon} color={color} size={140} />
          </Box>
        }
      >
        <PlayStoreButton onDark />
        <PillLink href={primary.href} onDark>{primary.label}</PillLink>
      </EditorialHero>

      <GuideToc items={toc} />

      <Band id="problems" labelledBy="problems-title">
        <Box sx={{ display: "grid", gap: { xs: 2, md: 8 }, gridTemplateColumns: { xs: "1fr", md: "1fr 1.4fr" }, mb: { xs: 4, md: 5 } }}>
          <Heading id="problems-title" eyebrow="Signs to look for" title={`Common ${lower} problems`} />
          <Box>
            {content.intro.slice(1).map((p) => (
              <Typography key={p} sx={{ lineHeight: 1.8, color: "text.secondary", "& + &": { mt: 2 } }}>{p}</Typography>
            ))}
          </Box>
        </Box>
        <SymptomGrid items={content.symptoms} />
        <Typography sx={{ mt: 2.5, fontSize: "0.85rem", color: "text.secondary" }}>These are common causes, not a diagnosis. A repairer has to check the device to say what is wrong.</Typography>
      </Band>

      <Band tone="tint" id="guide" labelledBy="guide-title">
        <Heading id="guide-title" eyebrow="Good to know" title={`What to know before a ${lower}`} />
        <GuideArticle sections={content.guide} />
      </Band>

      <Band id="expect" labelledBy="expect-title">
        <Heading id="expect-title" eyebrow="What to expect" title="What a repairer may help with, and what they may not" />
        <Box sx={{ display: "grid", gap: { xs: 4, md: 8 }, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" } }}>
          <Box>
            <Typography component="h3" sx={h3}>A repairer may help with</Typography>
            <MarkList kind="yes" items={content.mayHelp} />
          </Box>
          <Box>
            <Typography component="h3" sx={h3}>Limits to keep in mind</Typography>
            <MarkList kind="no" items={content.mayNotDo} />
          </Box>
        </Box>
      </Band>

      <Band tone="tint" id="cost" labelledBy="cost-title">
        <Heading id="cost-title" eyebrow="Cost and preparation" title="What changes the price, and how to get ready" lead="Kartsquare does not set prices. Each repairer quotes for your device, so it helps to know what moves the figure." />
        <Box sx={{ display: "grid", gap: { xs: 4, md: 8 }, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, alignItems: "start" }}>
          <Box>
            <Typography component="h3" sx={h3}>What affects the cost</Typography>
            <MarkList kind="yes" items={content.costFactors} />
          </Box>
          <Box>
            <Typography component="h3" sx={h3}>Before you hand it over</Typography>
            <StepTimeline items={content.beforeRepair} />
          </Box>
        </Box>
      </Band>

      <Band id="choose" labelledBy="choose-title">
        <Box sx={{ display: "grid", gap: { xs: 4, md: 8 }, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, alignItems: "start" }}>
          <Box>
            <Heading id="choose-title" eyebrow="Before you decide" title="How to choose a repairer" lead="Read the profile first, then ask about anything it does not say." />
            <StepTimeline items={content.howToChoose} />
          </Box>
          <RequestNote items={content.requestInfo} />
        </Box>
      </Band>

      <Band tone="tint" id="providers" labelledBy="providers-title">
        <Heading id="providers-title" eyebrow={cityName} title={`${content.name} in ${cityName}`} />
        {providers.length > 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, maxWidth: 820 }}>
            {providers.map((p) => (<ProviderRow key={p.service_id} href={getServiceHref(p)} title={p.service_name} by={p.provider_name} />))}
            {parentLive && (
              <Typography sx={{ mt: 1 }}>
                <Box component={Link} href={cityHref} sx={{ color: COLORS.PRIMARY_PURPLE, fontWeight: 700 }}>See every {parent.name} listing in {cityName}</Box>
              </Typography>
            )}
          </Box>
        ) : (
          <EmptyProviderState>
            <Typography sx={{ lineHeight: 1.7 }}>
              No listing in {cityName} names {lower} yet.{" "}
              {parentLive ? (
                <Box component={Link} href={cityHref} sx={{ color: COLORS.PRIMARY_PURPLE, fontWeight: 700 }}>See {parent.name} listings in {cityName}</Box>
              ) : (
                <Box component={Link} href="/cus/services-list" sx={{ color: COLORS.PRIMARY_PURPLE, fontWeight: 700 }}>Browse all services</Box>
              )}
            </Typography>
          </EmptyProviderState>
        )}
      </Band>

      <KartAiHowItWorks intro={`Not sure whether you need ${lower}? Describe the problem to Kart AI.`} />

      <FaqSection items={content.faq} title="Frequently asked questions" intro={`Short answers about ${lower}.`} />

      {siblings.length > 0 && (
        <Band id="more" labelledBy="more-title">
          <Heading id="more-title" eyebrow={parent.name} title="Other repair guides" />
          <GuideGrid>
            {siblings.map((s) => (<GuideCard key={s.slug} href={subServicePath(s.categorySlug, s.slug)} name={s.name} text={s.tagline} icon={s.icon} color={color} />))}
          </GuideGrid>
          <Box sx={{ mt: 5, display: "flex", flexWrap: "wrap", gap: 2 }}>
            <PillLink href={categoryContentPath(parent.slug)}>{parent.name} guide</PillLink>
            <PillLink href={SERVICES_HUB_PATH}>All service categories</PillLink>
          </Box>
        </Band>
      )}
    </MainLayout>
  );
};

export default SubServiceView;
