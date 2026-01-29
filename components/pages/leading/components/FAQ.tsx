import React from "react";
import {
  Box,
  Typography,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { LISTING, getFaqItems } from "./constants";
import { useTranslate } from "@/hooks/useTranslate";

interface FAQProps {
  expandedFaq: string | false;
  handleFaqChange: (
    panel: string,
  ) => (event: React.SyntheticEvent, isExpanded: boolean) => void;
}

const FAQ: React.FC<FAQProps> = ({ expandedFaq, handleFaqChange }) => {
  const { t } = useTranslate();
  return (
    <Box sx={{ py: 8, bgcolor: LISTING.bgSoft }}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="overline"
            fontWeight={700}
            color="text.secondary"
            sx={{ letterSpacing: 1 }}
          >
            {t("commonQuestions")}
          </Typography>
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{ mt: 1, color: LISTING.text }}
          >
            {t("gotAQuestion")}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
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
              border: `1px solid ${LISTING.border}`,
              borderRadius: "12px !important",
              bgcolor: "white",
              "&:before": { display: "none" },
              "&.Mui-expanded": { boxShadow: LISTING.cardShadow },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: LISTING.primary }} />}
              aria-controls={`faq${index}-content`}
              id={`faq${index}-header`}
              sx={{ "& .MuiAccordionSummary-content": { my: 1.5 } }}
            >
              <Typography fontWeight={600} color="text.primary">
                {faq.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0, pb: 2 }}>
              <Typography
                variant="body2"
                color="text.secondary"
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
