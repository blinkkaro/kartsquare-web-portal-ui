"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BackButton from "@/components/common/BackButton";
import { useTranslationContext } from "@/features/i18n/TranslationContext";
import { COLORS } from "@/constants/colors";

// Dummy data based on the user's provided image
const FAQ_DATA = [
  {
    question: "How can I browse and purchase products on the app?",
    answer:
      "You can browse products by category or use the search bar to find specific items. To purchase, simply add items to your cart and proceed to checkout.",
  },
  {
    question: "Can I book services along with shopping for products?",
    answer:
      "Yes, you can book services and shop for products in the same session.",
  },
  {
    question: "How do I book a service appointment?",
    answer:
      "Navigate to the services section, choose your desired service, and follow the booking prompts to select a date and time.",
  },
  {
    question: "Is there a way to track my product orders and service bookings?",
    answer:
      "Yes, you can track your orders and bookings in the 'My Orders' and 'My Bookings' sections respectively.",
  },
  {
    question:
      "What payment methods are accepted for both products and services?",
    answer: "We accept major credit cards, debit cards, and digital wallets.",
  },
  {
    question: "Are there any discounts or promotions available?",
    answer: "Check the 'Offers' section for current discounts and promotions.",
  },
  {
    question:
      "What happens if I need to cancel or reschedule a service appointment?",
    answer:
      "You can cancel or reschedule through the 'My Bookings' section, subject to the cancellation policy.",
  },
  {
    question: "Is my personal and payment information secure on the app?",
    answer:
      "Yes, we use industry-standard encryption to protect your personal and payment information.",
  },
];

function FAQView() {
  const { t } = useTranslationContext();
  const [expanded, setExpanded] = useState<string | false>("panel0");

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Container
      maxWidth="xl"
      sx={{
        py: 4,
        display: "flex",
        backgroundColor:isDark ? COLORS.BACKGROUND.PRIMARY_DARK : COLORS.BACKGROUND.SECONDARY_LIGHT,
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "space-around",
      }}
    >
      <Box>
        <BackButton sx={{ mr: 2, mb: 2 }} />
      </Box>

      <Box>
        <Typography variant="h4" component="h1" sx={{ fontWeight: "500", mb:5 }}>
          {t("faqs")}
        </Typography>
        {FAQ_DATA.map((faq, index) => (
          <Accordion
            key={index}
            expanded={expanded === `panel${index}`}
            onChange={handleChange(`panel${index}`)}
            sx={{
              mb: 2,
              boxShadow: "none",
              borderRadius: "8px !important",
              backgroundColor:
                expanded === `panel${index}`
                  ? "background.paper"
                  : "transparent",
              "&:before": { display: "none" }, // Remove default border top
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
              sx={{
                fontWeight: "500",
                "& .MuiAccordionSummary-expandIconWrapper": {
                  background: COLORS.PROFILE_GRADIENT,
                  borderRadius: "50%",
                  p: 0.5,
                  color: COLORS.PRIMARY_PURPLE,
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform:
                    expanded === `panel${index}`
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                },
              }}
            >
              <Typography
                sx={{
                  fontWeight: "bold",
                  fontSize: "1rem",
                  color: "text.primary",
                }}
              >
                {faq.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0 }}>
              <Typography variant="body2" color="text.secondary">
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Container>
  );
}

export default FAQView;
