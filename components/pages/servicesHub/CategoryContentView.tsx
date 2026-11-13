"use client";

import React from "react";
import Link from "next/link";
import { Box, Typography } from "@mui/material";
import MainLayout from "@/app/mainLayout";
import { COLORS } from "@/constants/colors";
import { categoryContentPath, relatedCategories } from "@/lib/services/content";
import type { CategoryContent } from "@/lib/services/types";
import { getServiceHref } from "@/utils/serviceRoute";
import type { Service } from "@/services/serviceList/listInteraface";
import { Breadcrumbs, BulletList, CardGrid, CtaBand, Faq, LinkCard, PageContainer, PageHeader, Paragraphs, Section } from "./ContentBlocks";

interface Props {
  content: CategoryContent;
  /** Live services in Jaipur for this category, from the API. Empty means no coverage. */
  providers: Service[];
  /** Live service counts by category slug in Jaipur, to decide which links to show. */
  coverage: Record<string, number>;
  cityName: string;
  citySlug: string;
}

const CategoryContentView: React.FC<Props> = ({ content, providers, coverage, cityName, citySlug }) => {
  const live = (coverage[content.slug] ?? 0) > 0;
  const related = relatedCategories(content);
  const cityHref = `/${citySlug}/${content.slug}`;

  return (
    <MainLayout>
      <PageContainer>
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Services", href: "/services" }, { name: content.name }]} />
        <PageHeader title={content.h1} />
        <Box sx={{ pb: 1 }}>
          <Paragraphs items={content.intro} />
        </Box>

        <Section id="common" title="Common services in this category">
          <Box component="ul" sx={{ display: "flex", flexWrap: "wrap", gap: 1, listStyle: "none", m: 0, p: 0 }}>
            {content.commonServices.map((s) => (
              <Box component="li" key={s} sx={{ px: 2, py: 0.75, borderRadius: 9999, border: `1px solid ${COLORS.NEW_UI.CARD_BORDER_LIGHT}`, fontSize: "0.9rem", fontWeight: 500 }}>
                {s}
              </Box>
            ))}
          </Box>
        </Section>

        <Section id="help" title="What providers may help with">
          <BulletList items={content.mayHelp} />
        </Section>
        <Section id="not" title="What Kartsquare and its providers may not do">
          <BulletList items={content.mayNotDo} />
        </Section>
        <Section id="choose" title="How to choose a provider">
          <BulletList items={content.howToChoose} />
        </Section>
        <Section id="info" title="What to include in a service request">
          <BulletList items={content.requestInfo} />
        </Section>

        {live && (
          <Section id="providers" title={`${content.name} providers in ${cityName}`}>
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
              <Box component={Link} href={cityHref} sx={{ color: COLORS.PRIMARY_PURPLE, fontWeight: 600 }}>
                See all {content.name} providers in {cityName}
              </Box>
            </Typography>
          </Section>
        )}

        <Section id="faq" title="Frequently asked questions">
          <Faq items={content.faq} />
        </Section>

        <Section id="related" title="Related categories">
          <CardGrid>
            {related.map((r) => (
              <LinkCard key={r.slug} href={categoryContentPath(r.slug)} title={r.name}>
                Explore {r.name}
              </LinkCard>
            ))}
          </CardGrid>
        </Section>

        <CtaBand
          title={live ? `Find ${content.name} providers in ${cityName}` : `Explore services on Kartsquare`}
          text="Read provider profiles and send a request describing what you need. The provider replies to you directly and you agree the details with them."
          primary={live ? { label: `View providers in ${cityName}`, href: cityHref } : { label: "Browse all services", href: "/cus/services-list" }}
          secondary={{ label: "All service categories", href: "/services" }}
        />
      </PageContainer>
    </MainLayout>
  );
};

export default CategoryContentView;
