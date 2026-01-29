"use client";

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
import { COLORS } from "@/constants/colors";
import { freeListingData } from "@/data/freeListingData";

const FAQ = () => {
  return (
    <Box sx={{ py: 10, bgcolor: COLORS.WHITE }}>
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          sx={{
            mb: 6,
            fontWeight: 700,
            color: COLORS.TEXT.PRIMARY_LIGHT,
          }}
        >
          Got a question?
        </Typography>

        <Box sx={{ maxWidth: 900, mx: "auto" }}>
          {freeListingData.faqs.map((faq, index) => (
            <Accordion
              key={index}
              disableGutters
              elevation={0}
              sx={{
                mb: 2,
                border: `1px solid ${COLORS.BORDER.DEFAULT_LIGHT}`,
                borderRadius: "12px !important",
                "&:before": { display: "none" },
              }}
            >
              <AccordionSummary
                expandIcon={
                  <ExpandMoreIcon sx={{ color: COLORS.PRIMARY_BLUE }} />
                }
                sx={{
                  borderRadius: "12px",
                  "&.Mui-expanded": {
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                  },
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, color: COLORS.TEXT.PRIMARY_LIGHT }}
                >
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1" color="text.secondary">
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
