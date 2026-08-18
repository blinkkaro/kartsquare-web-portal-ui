import { Container, Box } from "@mui/material";
import Title from "@/components/auth/title";
import MainLayout from "@/app/mainLayout";
import { COOKIE_POLICY_HTML, COOKIE_POLICY_LAST_UPDATED } from "@/data/legal/cookiePolicyContent";

const htmlStyles = {
  lineHeight: 1.7,
  color: "text.primary",
  "& h2": { fontSize: { xs: "1.5rem", md: "1.875rem" }, fontWeight: 600, color: "text.primary", mt: { xs: 2.5, md: 3.5 }, mb: { xs: 1.25, md: 1.75 } },
  "& h3": { fontSize: { xs: "1.25rem", md: "1.5rem" }, fontWeight: 600, color: "text.primary", mt: { xs: 2, md: 3 }, mb: { xs: 1, md: 1.5 } },
  "& p": { fontSize: { xs: "0.9375rem", md: "1rem" }, mb: { xs: 1.5, md: 2 }, color: "text.secondary", lineHeight: 1.7 },
  "& ul, & ol": { mb: { xs: 2, md: 2.5 }, pl: { xs: 2.5, md: 3 } },
  "& li": { fontSize: { xs: "0.9375rem", md: "1rem" }, mb: { xs: 0.75, md: 1 }, color: "text.secondary", lineHeight: 1.7 },
  "& a": { color: "primary.main", textDecoration: "underline", "&:hover": { color: "primary.dark" } },
  "& strong": { fontWeight: 600, color: "text.primary" },
  "& hr": { my: { xs: 2, md: 3 }, borderColor: "divider" },
};

export default function CookiePolicyView() {
  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        <Title
          title="Cookie Policy"
          subtitle={`Last updated: ${COOKIE_POLICY_LAST_UPDATED}`}
        />
        <Box dangerouslySetInnerHTML={{ __html: COOKIE_POLICY_HTML }} sx={htmlStyles} />
      </Container>
    </MainLayout>
  );
}
