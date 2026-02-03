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

  return (
    <Box
      sx={{
        py: 8,
        bgcolor: isDark
          ? COLORS.BACKGROUND.PRIMARY_DARK
          : COLORS.BACKGROUND.PAPER_LIGHT,
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="overline"
            fontWeight={700}
            color={isDark ? COLORS.TEXT.SECONDARY_DARK : "text.secondary"}
            sx={{ letterSpacing: 1 }}
          >
            {t("commonQuestions")}
          </Typography>
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{
              mt: 1,
              color: isDark
                ? COLORS.TEXT.PRIMARY_DARK
                : COLORS.TEXT.PRIMARY_LIGHT,
            }}
          >
            {t("gotAQuestion")}
          </Typography>
          <Typography
            variant="body1"
            color={isDark ? COLORS.TEXT.SECONDARY_DARK : "text.secondary"}
            sx={{ mt: 0.5 }}
          >
            {t("quickAnswers")}
          </Typography>
        </Box>
        {getFaqItems(t).map((faq, index) => (
          <Accordion
            key={index}
            expanded={expandedFaq === `faq${index}`}
            onChange={handleFaqChange(`faq${index}`)}
            sx={{
              mb: 1.5,
              boxShadow: "none",
              border: `1px solid ${
                isDark
                  ? COLORS.BORDER.DEFAULT_DARK
                  : COLORS.BORDER.DEFAULT_LIGHT
              }`,
              borderRadius: "12px !important",
              bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : "white",
              "&:before": { display: "none" },
              "&.Mui-expanded": {
                boxShadow: isDark ? "none" : COLORS.SHADOW.DEFAULT,
              },
            }}
          >
            <AccordionSummary
              expandIcon={
                <ExpandMoreIcon sx={{ color: COLORS.PRIMARY_PURPLE }} />
              }
              aria-controls={`faq${index}-content`}
              id={`faq${index}-header`}
              sx={{ "& .MuiAccordionSummary-content": { my: 1.5 } }}
            >
              <Typography
                fontWeight={600}
                color={isDark ? COLORS.TEXT.PRIMARY_DARK : "text.primary"}
              >
                {faq.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0, pb: 2 }}>
              <Typography
                variant="body2"
                color={isDark ? COLORS.TEXT.SECONDARY_DARK : "text.secondary"}
                sx={{ lineHeight: 1.7 }}
              >
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>
    </Box>
  );
};

export default FAQ;
