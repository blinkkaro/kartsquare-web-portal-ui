"use client";

import Title from "@/components/auth/title";
import { Box, Container } from "@mui/material";
import CenteredLoader from "@/components/common/Loader/CenteredLoader";
import ErrorMessage from "@/components/common/ErrorMessage";
import { useTranslate } from "@/hooks/useTranslate";
import { formatDateToString } from "@/helper/helper";
import { useTermsAndConditions } from "@/hooks/useAppConfig";
import MainLayout from "@/app/mainLayout";

function TermsConditionsView() {
  const { t } = useTranslate();
  const { data: termsConditions, isLoading, isError } = useTermsAndConditions();

  if (isLoading) {
    return <CenteredLoader minHeight="50vh" />;
  }

  if (isError) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <ErrorMessage isVisible={true} error={t("something_went_wrong")} />
      </Container>
    );
  }

  return (
<MainLayout>
<Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Title
        title={t("termsConditionsTitle")}
        subtitle={
          termsConditions?.created_at
            ? `${t("lastUpdatedAt")} ${formatDateToString(
                new Date(termsConditions.created_at)
              )}`
            : ""
        }
      />
      <Box
        dangerouslySetInnerHTML={{ __html: termsConditions?.description || "" }}
        sx={{
          lineHeight: 1.7,
          color: "text.primary",

          // Headings
          "& h1": {
            fontSize: { xs: "1.75rem", md: "2.25rem" },
            fontWeight: 700,
            color: "text.primary",
            mt: { xs: 3, md: 4 },
            mb: { xs: 1.5, md: 2 },
            lineHeight: 1.3,
          },
          "& h2": {
            fontSize: { xs: "1.5rem", md: "1.875rem" },
            fontWeight: 600,
            color: "text.primary",
            mt: { xs: 2.5, md: 3.5 },
            mb: { xs: 1.25, md: 1.75 },
            lineHeight: 1.35,
          },
          "& h3": {
            fontSize: { xs: "1.25rem", md: "1.5rem" },
            fontWeight: 600,
            color: "text.primary",
            mt: { xs: 2, md: 3 },
            mb: { xs: 1, md: 1.5 },
            lineHeight: 1.4,
          },

          // Paragraphs
          "& p": {
            fontSize: { xs: "0.9375rem", md: "1rem" },
            mb: { xs: 1.5, md: 2 },
            color: "text.secondary",
            lineHeight: 1.7,
          },

          // Lists
          "& ul, & ol": {
            mb: { xs: 2, md: 2.5 },
            pl: { xs: 2.5, md: 3 },
          },
          "& li": {
            fontSize: { xs: "0.9375rem", md: "1rem" },
            mb: { xs: 0.75, md: 1 },
            color: "text.secondary",
            lineHeight: 1.7,
            "& p": {
              mb: 0.5,
            },
          },

          // Links
          "& a": {
            color: "primary.main",
            textDecoration: "underline",
            "&:hover": {
              color: "primary.dark",
            },
          },

          // Strong/Bold text
          "& strong": {
            fontWeight: 600,
            color: "text.primary",
          },

          // Dividers
          "& hr": {
            my: { xs: 2, md: 3 },
            borderColor: "divider",
          },

          // Code blocks (if any)
          "& code": {
            backgroundColor: "action.hover",
            px: 0.75,
            py: 0.25,
            borderRadius: 0.5,
            fontSize: "0.875em",
            fontFamily: "monospace",
          },

          // Block quotes (if any)
          "& blockquote": {
            borderLeft: "4px solid",
            borderColor: "primary.main",
            pl: 2,
            py: 1,
            my: 2,
            backgroundColor: "action.hover",
            fontStyle: "italic",
          },
        }}
      />
    </Container>
</MainLayout>
  );
}

export default TermsConditionsView;
