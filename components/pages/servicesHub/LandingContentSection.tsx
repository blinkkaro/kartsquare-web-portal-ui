"use client";

import React from "react";
import { Box } from "@mui/material";
import type { LandingContent } from "@/lib/services/types";
import { CheckList, Faq, NoticeList, PageContainer, Paragraphs, Section } from "./ContentBlocks";

/** Explanatory copy shown under a /{city}/{category}/{sub-category} listing. Headings are H2: the listing owns the H1. */
const LandingContentSection: React.FC<{ content: LandingContent }> = ({ content }) => (
  <Box sx={{ borderTop: "1px solid", borderColor: "divider", mt: 4 }}>
    <PageContainer>
      <Section id="about" eyebrow="Overview" title={`About ${content.h1.toLowerCase()}`}>
        <Paragraphs items={content.intro} />
      </Section>
      <Section id="may-help" eyebrow="What to expect" title="What providers may help with">
        <CheckList items={content.mayHelp} />
      </Section>
      <Section id="may-not" eyebrow="Good to know" title="What Kartsquare and its providers may not do">
        <NoticeList items={content.mayNotDo} />
      </Section>
      <Section id="request" eyebrow="Your request" title="What to include in your request">
        <CheckList items={content.requestInfo} />
      </Section>
      {content.localNotes.length > 0 && (
        <Section id="local" eyebrow="Jaipur" title="Local notes">
          <Paragraphs items={content.localNotes} />
        </Section>
      )}
      <Section id="faq" eyebrow="FAQ" title="Frequently asked questions">
        <Faq items={content.faq} />
      </Section>
    </PageContainer>
  </Box>
);

export default LandingContentSection;
