"use client";

import React from "react";
import Link from "next/link";
import { Box, Typography } from "@mui/material";
import MainLayout from "@/app/mainLayout";
import CategoryIcon from "@/components/common/CategoryIcon";
import { COLORS } from "@/constants/colors";
import { categoryContentPath, relatedCategories } from "@/lib/services/content";
import type { CategoryMedia } from "@/lib/services/coverage";
import type { CategoryContent } from "@/lib/services/types";
import type { Service } from "@/services/serviceList/listInteraface";
import { getServiceHref } from "@/utils/serviceRoute";
import {
  CardGrid,
  CategoryCard,
  CategoryVisual,
  CheckList,
  CtaBand,
  Faq,
  HeroBand,
  HeroButton,
  LinkCard,
  NoticeList,
  PageContainer,
  Paragraphs,
  Section,
  SideCard,
} from "./ContentBlocks";

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

  return (
    <MainLayout>
      <HeroBand
        crumbs={[{ name: "Home", href: "/" }, { name: "Services", href: "/services" }, { name: content.name }]}
        eyebrow="Service category"
        title={content.h1}
        lead={content.intro[0]}
        actions={<HeroButton href={primary.href}>{primary.label}</HeroButton>}
        aside={
          <Box sx={{ display: { xs: "none", lg: "block" }, p: 1, borderRadius: "28px", bgcolor: "rgba(255,255,255,0.12)" }}>
            <CategoryVisual media={media[content.slug]} height={320} radius="22px" iconSize={96} />
          </Box>
        }
      />

      <PageContainer>
        <Box sx={{ display: "grid", gap: { xs: 2, lg: 5 }, gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1fr) 340px" }, alignItems: "start" }}>
          <Box>
            <Section id="about" eyebrow="Overview" title={`About ${content.name}`}>
              <Paragraphs items={content.intro.slice(1)} />
              <Box component="ul" aria-label="Common services" sx={{ display: "flex", flexWrap: "wrap", gap: 1, listStyle: "none", m: 0, mt: 2, p: 0 }}>
                {content.commonServices.map((s) => (
                  <Box component="li" key={s} sx={{ px: 2, py: 0.75, borderRadius: 9999, bgcolor: COLORS.PURPLE_ALPHA_10, color: COLORS.PRIMARY_PURPLE, fontSize: "0.9rem", fontWeight: 600 }}>
                    {s}
                  </Box>
                ))}
              </Box>
            </Section>

            <Section id="help" eyebrow="What to expect" title="What providers may help with">
              <CheckList items={content.mayHelp} />
            </Section>
            <Section id="not" eyebrow="Good to know" title="What Kartsquare and its providers may not do">
              <NoticeList items={content.mayNotDo} />
            </Section>
            <Section id="choose" eyebrow="Before you decide" title="How to choose a provider">
              <CheckList items={content.howToChoose} />
            </Section>
            <Section id="info" eyebrow="Your request" title="What to include in a service request">
              <CheckList items={content.requestInfo} />
            </Section>

            {live && (
              <Section id="providers" eyebrow={cityName} title={`${content.name} providers in ${cityName}`}>
                {providers.length > 0 && (
                  <CardGrid>
                    {providers.map((p) => (
                      <LinkCard key={p.service_id} href={getServiceHref(p)} title={p.service_name}>
                        Listed by {p.provider_name}
                      </LinkCard>
                    ))}
                  </CardGrid>
                )}
                <Typography sx={{ mt: 2 }}>
                  <Box component={Link} href={cityHref} sx={{ color: COLORS.PRIMARY_PURPLE, fontWeight: 700 }}>
                    See all {content.name} providers in {cityName}
                  </Box>
                </Typography>
              </Section>
            )}

            <Section id="faq" eyebrow="FAQ" title="Frequently asked questions">
              <Faq items={content.faq} />
            </Section>
          </Box>

          <SideCard title={live ? `Find a provider in ${cityName}` : "Explore services"} text="Read provider profiles and send a request. The provider replies to you directly and you agree the details with them." action={primary}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, pt: 1.5, borderTop: "1px solid", borderColor: "divider" }}>
              <CategoryIcon icon={media[content.slug]?.icon} color={media[content.slug]?.color} size={26} tile={44} radius="12px" />
              <Typography sx={{ fontSize: "0.9rem", color: "text.secondary", lineHeight: 1.5 }}>{content.name}</Typography>
            </Box>
          </SideCard>
        </Box>

        <Section id="related" eyebrow="Keep exploring" title="Related categories">
          <CardGrid min={240}>
            {related.map((r) => (
              <CategoryCard key={r.slug} href={categoryContentPath(r.slug)} name={r.name} text={r.commonServices.slice(0, 3).join(", ")} media={media[r.slug]} />
            ))}
          </CardGrid>
        </Section>

        <CtaBand
          title={live ? `Find ${content.name} providers in ${cityName}` : "Explore services on Kartsquare"}
          text="Read provider profiles and send a request describing what you need. The provider replies to you directly and you agree the details with them."
          primary={primary}
          secondary={{ label: "All service categories", href: "/services" }}
        />
      </PageContainer>
    </MainLayout>
  );
};

export default CategoryContentView;
