import React from "react";
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
import { getFaqItems } from "./constants";
import { useTranslate } from "@/hooks/useTranslate";
import { COLORS } from "@/constants/colors";

interface FAQProps {
  expandedFaq: string | false;
  handleFaqChange: (
    panel: string,
  ) => (event: React.SyntheticEvent, isExpanded: boolean) => void;
}

const FAQ: React.FC<FAQProps> = ({ expandedFaq, handleFaqChange }) => {
  const { t } = useTranslate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const faqItems = getFaqItems(t);

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: isDark
          ? COLORS.BACKGROUND.PRIMARY_DARK
          : COLORS.BACKGROUND.PAPER_LIGHT,
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ textAlign: "center", mb: { xs: 5, md: 6 }, maxWidth: 480, mx: "auto" }}>
          <Typography
            variant="overline"
            fontWeight={700}
            color={COLORS.PRIMARY_PURPLE}
            sx={{ letterSpacing: 1.5, display: "block", mb: 1 }}
          >
            {t("commonQuestions")}
          </Typography>
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{
              mt: 0.5,
              color: isDark
                ? COLORS.TEXT.PRIMARY_DARK
                : COLORS.TEXT.PRIMARY_LIGHT,
              fontSize: { xs: "1.75rem", md: "2rem" },
              letterSpacing: "-0.02em",
              lineHeight: 1.25,
            }}
          >
            {t("gotAQuestion")}
          </Typography>
          <Typography
            variant="body1"
            color={isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT}
            sx={{ mt: 1.5, lineHeight: 1.6 }}
          >
            {t("quickAnswers")}
          </Typography>
        </Box>
        <Box sx={{ "& .MuiAccordion-root": { mb: 1.5 } }}>
          {faqItems.map((faq, index) => (
            <Accordion
              key={index}
              expanded={expandedFaq === `faq${index}`}
              onChange={handleFaqChange(`faq${index}`)}
              sx={{
                boxShadow: "none",
                border: `1px solid ${
                  isDark
                    ? COLORS.BORDER.DEFAULT_DARK
                    : "rgba(94, 24, 233, 0.12)"
                }`,
                borderRadius: "12px !important",
                overflow: "hidden",
                bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : "white",
                "&:before": { display: "none" },
                transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                  borderColor: isDark ? COLORS.BORDER.HOVER_DARK : COLORS.PRIMARY_PURPLE,
                },
                "&.Mui-expanded": {
                  borderColor: COLORS.PRIMARY_PURPLE,
                  boxShadow: isDark ? "none" : "0 4px 20px rgba(94, 24, 233, 0.08)",
                },
              }}
            >
              <AccordionSummary
                expandIcon={
                  <ExpandMoreIcon
                    sx={{
                      color: COLORS.PRIMARY_PURPLE,
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
                  "& .MuiAccordionSummary-content": {
                    my: 2,
                    mr: 1,
                  },
                }}
              >
                <Typography
                  fontWeight={600}
                  variant="subtitle1"
                  color={isDark ? COLORS.TEXT.PRIMARY_DARK : "text.primary"}
                  sx={{ pr: 1, lineHeight: 1.4 }}
                >
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0, pb: 2.5, px: 3 }}>
                <Typography
                  variant="body2"
                  color={isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT}
                  sx={{ lineHeight: 1.75 }}
                >
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default FAQ;
