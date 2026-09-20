"use client";
import React, { useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Typography, useMediaQuery, useTheme } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import { useRouter } from "next/navigation";
import { COLORS } from "@/constants/colors";
import { useAppDispatch } from "@/store/hooks";
import { setAiOpen } from "@/features/ui/uiSlice";
import { useAILocation } from "@/components/common/Ai/useAILocation";
import { Section, sectionEyebrowSx, sectionTitleSx, sectionSubtitleSx } from "./shared";

interface Faq {
  q: string;
  /** Plain text: also used for the FAQPage structured data, so keep it factual. */
  a: string;
  /** Optional in-page action shown under the answer */
  action?: "list-business" | "ask-ai";
}

// Every answer describes behaviour the product has today. Deliberately absent: payment
// terms, warranties, refunds, police/background checks, insurance - none are backed by data.
const faqs = (city: string): Faq[] => [
  {
    q: "What is Kartsquare?",
    a: "Kartsquare is a marketplace that connects you with local service providers and suppliers. You describe what you need, compare approved providers, and contact them directly.",
  },
  {
    q: "How do I find the right provider?",
    a: `Type your problem the way you would say it, in English, Hindi or Hinglish, for example "AC thanda nahi kar raha". Kartsquare works out the service you need and shows matching providers in ${city}. You can also browse by category.`,
    action: "ask-ai",
  },
  {
    q: `How do I find an AC repair, plumber or electrician in ${city}?`,
    a: `Type what you need, such as "AC repair", "plumber near me" or "light bar bar ja rahi hai", into the search box. Kartsquare shows approved providers for that exact service in ${city}. If nobody offers it in your area, you will see that clearly instead of unrelated results.`,
    action: "ask-ai",
  },
  {
    q: "Can I search in Hindi or Hinglish?",
    a: `Yes. You can describe the problem in English, Hindi or Hinglish, for example "mera AC kharab ho rha h" or "nal se pani leak ho raha hai". Kartsquare understands common problems, spelling mistakes and area names like Mansarovar or Vaishali Nagar.`,
  },
  {
    q: "What does “approved listing” mean?",
    a: "A service only appears on Kartsquare after it has been reviewed and approved. Listings that have not been approved are not shown to customers.",
  },
  {
    q: "How do ratings and reviews work?",
    a: "A rating is shown only when a service has real customer reviews. If a provider has no reviews yet, you will see “No reviews yet” instead of a made-up score.",
  },
  {
    q: "How do I contact a provider?",
    a: "Open the provider's profile. Where the provider has shared a phone or WhatsApp number you can call or message them directly from the listing.",
  },
  {
    q: "What if there is no provider for my service in my area?",
    a: "You will see a clear message instead of unrelated results, along with related categories to explore. You can also change the city or area from the location selector and search again.",
  },
  {
    q: "Which cities does Kartsquare cover?",
    a: "Kartsquare starts in Jaipur. Use the location selector to pick your city and area; the providers you see depend on who has listed services there.",
  },
  {
    q: "I offer a service. How do I list my business?",
    a: "Choose “List your business”, create your provider profile and add your services. Once a listing is approved it becomes visible to customers searching in your city.",
    action: "list-business",
  },
];

export default function FaqSection() {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  const router = useRouter();
  const dispatch = useAppDispatch();
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  const { location } = useAILocation();
  const [open, setOpen] = useState<number | false>(0);
  const items = faqs(location.city);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <Section id="faq" sx={{ pt: { xs: 3, md: 5 }, pb: { xs: 2, md: 4 } }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "minmax(0, 340px) minmax(0, 1fr)" }, gap: { xs: 2, md: 6 }, alignItems: "start" }}>
        {/* heading + help card */}
        <Box sx={{ position: { md: "sticky" }, top: { md: 96 } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <Box sx={{ width: 22, height: 3, borderRadius: 2, background: `linear-gradient(90deg, ${COLORS.PRIMARY_PURPLE}, #e11d74)` }} />
            <Typography sx={{ ...sectionEyebrowSx, color: dark ? "#d6b8ff" : COLORS.PRIMARY_PURPLE }}>
              Got questions?
            </Typography>
          </Box>
          <Typography component="h2" sx={sectionTitleSx}>
            Frequently asked questions
          </Typography>
          <Typography sx={sectionSubtitleSx}>
            Quick answers about finding, comparing and contacting providers.
          </Typography>

          <Box
            sx={{
              display: { xs: "none", md: "block" },
              mt: 2.5,
              p: 2,
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: dark ? "rgba(130,72,247,0.10)" : COLORS.PURPLE_ALPHA_04,
            }}
          >
            <Typography sx={{ fontWeight: 800, fontSize: "0.95rem" }}>Still have a question?</Typography>
            <Typography sx={{ fontSize: "0.8rem", color: "text.secondary", mt: 0.25, mb: 1.25 }}>Ask Kart AI — it replies in your language.</Typography>
            <Button
              variant="contained"
              disableElevation
              startIcon={<AutoAwesomeRoundedIcon />}
              onClick={() => dispatch(setAiOpen(true))}
              sx={{ minHeight: 44, borderRadius: 3, textTransform: "none", fontWeight: 700, bgcolor: COLORS.PRIMARY_PURPLE, "&:hover": { bgcolor: COLORS.PURPLE_HOVER } }}
            >
              Ask Kart AI
            </Button>
          </Box>
        </Box>

        {/* accordion list */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
          {items.map((f, i) => {
            const on = open === i;
            return (
              <Accordion
                key={f.q}
                expanded={on}
                onChange={(_, exp) => setOpen(exp ? i : false)}
                disableGutters
                elevation={0}
                square
                slotProps={{ transition: { timeout: reduce ? 0 : 280 } }}
                sx={{
                  borderRadius: "16px !important",
                  border: "1.5px solid",
                  borderColor: on ? COLORS.PRIMARY_PURPLE : "divider",
                  bgcolor: on ? (dark ? "rgba(130,72,247,0.10)" : COLORS.PURPLE_ALPHA_04) : "background.paper",
                  overflow: "hidden",
                  transition: reduce ? "none" : "border-color 200ms ease, background-color 200ms ease",
                  "&::before": { display: "none" },
                }}
              >
                <AccordionSummary
                  id={`faq-h-${i}`}
                  aria-controls={`faq-p-${i}`}
                  expandIcon={
                    <Box
                      sx={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: on ? "#fff" : COLORS.PRIMARY_PURPLE,
                        bgcolor: on ? COLORS.PRIMARY_PURPLE : COLORS.PURPLE_ALPHA_10,
                        transition: reduce ? "none" : "background-color 200ms ease, color 200ms ease",
                      }}
                    >
                      <AddRoundedIcon sx={{ fontSize: 20 }} />
                    </Box>
                  }
                  sx={{
                    minHeight: 56,
                    px: 2,
                    "& .MuiAccordionSummary-content": { my: 1.25 },
                    // + turns into an × when open
                    "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": { transform: "rotate(45deg)" },
                    "& .MuiAccordionSummary-expandIconWrapper": { transition: reduce ? "none" : "transform 250ms ease" },
                  }}
                >
                  <Typography sx={{ fontWeight: 700, fontSize: { xs: "0.92rem", md: "1rem" }, pr: 1 }}>{f.q}</Typography>
                </AccordionSummary>
                <AccordionDetails id={`faq-p-${i}`} role="region" aria-labelledby={`faq-h-${i}`} sx={{ px: 2, pt: 0, pb: 2 }}>
                  <Typography sx={{ fontSize: { xs: "0.86rem", md: "0.92rem" }, color: "text.secondary", lineHeight: 1.65 }}>{f.a}</Typography>
                  {f.action === "list-business" && (
                    <Button onClick={() => router.push("/business-listing")} sx={{ mt: 1, minHeight: 44, px: 0, textTransform: "none", fontWeight: 700, color: dark ? "#d6b8ff" : COLORS.PRIMARY_PURPLE }}>
                      List your business →
                    </Button>
                  )}
                  {f.action === "ask-ai" && (
                    <Button onClick={() => dispatch(setAiOpen(true))} startIcon={<AutoAwesomeRoundedIcon />} sx={{ mt: 1, minHeight: 44, px: 0, textTransform: "none", fontWeight: 700, color: dark ? "#d6b8ff" : COLORS.PRIMARY_PURPLE }}>
                      Try it with Kart AI
                    </Button>
                  )}
                </AccordionDetails>
              </Accordion>
            );
          })}

          {/* mobile help card (desktop has it beside the heading) */}
          <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", justifyContent: "space-between", gap: 1.5, mt: 1, p: 1.75, borderRadius: 4, border: "1px solid", borderColor: "divider", bgcolor: dark ? "rgba(130,72,247,0.10)" : COLORS.PURPLE_ALPHA_04 }}>
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: "0.92rem" }}>Still have a question?</Typography>
              <Typography sx={{ fontSize: "0.76rem", color: "text.secondary" }}>Ask Kart AI in your language.</Typography>
            </Box>
            <Button variant="contained" disableElevation onClick={() => dispatch(setAiOpen(true))} sx={{ minHeight: 44, px: 2, flexShrink: 0, borderRadius: 3, textTransform: "none", fontWeight: 700, bgcolor: COLORS.PRIMARY_PURPLE, "&:hover": { bgcolor: COLORS.PURPLE_HOVER } }}>
              Ask AI
            </Button>
          </Box>
        </Box>
      </Box>
    </Section>
  );
}
