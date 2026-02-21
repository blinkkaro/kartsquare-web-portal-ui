"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { getFaqItems } from "./constants";
import { useTranslate } from "@/hooks/useTranslate";
import { COLORS } from "@/constants/colors";
import SectionHeading from "./SectionHeading";
import SectionCTA from "./SectionCTA";

const PURPLE = COLORS.PRIMARY_PURPLE;

interface FAQProps {
  expandedFaq: string | false;
  handleFaqChange: (
    panel: string
  ) => (event: React.SyntheticEvent, isExpanded: boolean) => void;
}

const FAQ: React.FC<FAQProps> = ({ expandedFaq, handleFaqChange }) => {
  const { t } = useTranslate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const faqItems = getFaqItems(t);
  const [allExpanded, setAllExpanded] = useState(false);

  const handleExpandAll = () => {
    setAllExpanded((prev) => !prev);
  };

  return (
    <Box
      sx={{
        py: { xs: 6, md: 8 },
        bgcolor: isDark ? COLORS.BACKGROUND.PRIMARY_DARK : "#fff",
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ mb: 4 }}>
          <SectionHeading
            title={t("yourQuestionsAnswered")}
            variant="minimal"
            align="center"
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 3,
          }}
        >
          <Button
            variant="text"
            onClick={handleExpandAll}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              color: PURPLE,
              fontSize: "0.875rem",
              "&:hover": { bgcolor: "transparent", textDecoration: "underline" },
            }}
          >
            {allExpanded ? t("collapseAll") : t("expandAll")}
          </Button>
        </Box>
        <Box sx={{ "& .MuiAccordion-root": { mb: 1 } }}>
          {faqItems.map((faq, index) => (
            <Accordion
              key={index}
              expanded={allExpanded || expandedFaq === `faq${index}`}
              onChange={(e, isExpanded) => {
                if (allExpanded) {
                  setAllExpanded(false);
                  handleFaqChange(`faq${index}`)(e, false);
                } else {
                  handleFaqChange(`faq${index}`)(e, isExpanded);
                }
              }}
              sx={{
                boxShadow: "none",
                border: "1px solid transparent",
                background: isDark
                  ? `linear-gradient(${COLORS.BACKGROUND.PAPER_DARK}, ${COLORS.BACKGROUND.PAPER_DARK}) padding-box, var(--gradient-border-dark) border-box`
                  : "linear-gradient(#fff, #fff) padding-box, var(--gradient-border) border-box",
                backgroundOrigin: "border-box",
                borderRadius: "12px !important",
                overflow: "hidden",
                backdropFilter: isDark ? "none" : "saturate(1.1)",
                "&:before": { display: "none" },
                "&.Mui-expanded": {
                  margin: 0,
                  "& + .MuiAccordion-root": { marginTop: 1 },
                },
              }}
            >
              <AccordionSummary
                expandIcon={
                  <ExpandMoreIcon
                    sx={{
                      color: PURPLE,
                      fontSize: 28,
                      transition: "transform 0.2s ease",
                      ".Mui-expanded &": { transform: "rotate(180deg)" },
                    }}
                  />
                }
                aria-controls={`faq${index}-content`}
                id={`faq${index}-header`}
                sx={{
                  py: 0,
                  minHeight: 56,
                  "& .MuiAccordionSummary-content": {
                    my: 1.5,
                    mr: 1,
                  },
                }}
              >
                <Typography
                  fontWeight={600}
                  variant="subtitle1"
                  sx={{
                    color: isDark ? COLORS.TEXT.PRIMARY_DARK : "#202124",
                    fontSize: "0.9375rem",
                    lineHeight: 1.4,
                  }}
                >
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0, pb: 2, px: 3 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                    lineHeight: 1.75,
                    fontSize: "0.875rem",
                  }}
                >
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", mt: { xs: 6, md: 8 } }}>
          <SectionCTA labelKey="getStartedNow" variant="contained" size="large" />
        </Box>
      </Container>
    </Box>
  );
};

export default FAQ;
