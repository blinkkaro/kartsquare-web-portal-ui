"use client";

import React from "react";
import { Box } from "@mui/material";
import type { LandingContent } from "@/lib/services/types";
import { BulletList, Faq, PageContainer, Paragraphs, Section } from "./ContentBlocks";

/** Explanatory copy shown under a /{city}/{category}/{sub-category} listing. Headings are H2: the listing owns the H1. */
const LandingContentSection: React.FC<{ content: LandingContent }> = ({ content }) => (
  <Box sx={{ borderTop: "1px solid", borderColor: "divider", mt: 4 }}>
    <PageContainer>
      <Section id="about" title={`About ${content.h1.toLowerCase()}`}>
        <Paragraphs items={content.intro} />
      </Section>
      <Section id="may-help" title="What providers may help with">
        <BulletList items={content.mayHelp} />
      </Section>
      <Section id="may-not" title="What Kartsquare and its providers may not do">
        <BulletList items={content.mayNotDo} />
      </Section>
      <Section id="request" title="What to include in your request">
        <BulletList items={content.requestInfo} />
      </Section>
      {content.localNotes.length > 0 && (
        <Section id="local" title="Local notes">
          <Paragraphs items={content.localNotes} />
        </Section>
      )}
      <Section id="faq" title="Frequently asked questions">
        <Faq items={content.faq} />
      </Section>
    </PageContainer>
  </Box>
);

export default LandingContentSection;
