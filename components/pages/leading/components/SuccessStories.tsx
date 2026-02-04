import React from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Button,
  useTheme,
} from "@mui/material";
import Link from "next/link";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import { getSuccessStories } from "./constants";
import { useTranslate } from "@/hooks/useTranslate";
import { COLORS } from "@/constants/colors";

const SuccessStories = () => {
  const { t } = useTranslate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const stories = getSuccessStories(t);

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: isDark ? COLORS.BACKGROUND.SECONDARY_DARK : COLORS.BACKGROUND.SECONDARY_LIGHT,
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ textAlign: "center", mb: { xs: 5, md: 7 }, maxWidth: 600, mx: "auto" }}>
          <Typography
            variant="overline"
            fontWeight={700}
            color={COLORS.PRIMARY_PURPLE}
            sx={{ letterSpacing: 1.5, display: "block", mb: 1 }}
          >
            {t("successStories")}
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
            {t("hearFromOwners")}
          </Typography>
          <Typography
            variant="body1"
            color={isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT}
            sx={{ mt: 1.5, lineHeight: 1.6 }}
          >
            {t("seeHowOthers")}
          </Typography>
        </Box>
        <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center">
          {stories.map((person, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
              <Paper
                elevation={0}
                sx={{
                  overflow: "hidden",
                  borderRadius: 3,
                  border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : "rgba(94, 24, 233, 0.1)"}`,
                  height: "100%",
                  bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : "white",
                  boxShadow: isDark ? "none" : "0 4px 24px rgba(94, 24, 233, 0.06)",
                  transition: "all 0.25s ease",
                  display: "flex",
                  flexDirection: "column",
                  "&:hover": {
                    borderColor: COLORS.PRIMARY_PURPLE,
                    boxShadow: isDark ? "none" : "0 12px 32px rgba(94, 24, 233, 0.12)",
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    pt: 3,
                    px: 2.5,
                    pb: 0,
                  }}
                >
                  <FormatQuoteIcon
                    sx={{
                      position: "absolute",
                      top: 16,
                      left: 20,
                      fontSize: 36,
                      color: COLORS.PRIMARY_PURPLE,
                      opacity: 0.25,
                    }}
                  />
                  <Typography
                    variant="body1"
                    color={isDark ? COLORS.TEXT.PRIMARY_DARK : "text.primary"}
                    sx={{
                      fontWeight: 500,
                      lineHeight: 1.65,
                      fontStyle: "italic",
                      pl: 3,
                      minHeight: 72,
                    }}
                  >
                    &ldquo;{person.tagline}&rdquo;
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 2.5,
                    mt: "auto",
                    borderTop: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : "rgba(94, 24, 233, 0.08)"}`,
                  }}
                >
                  <Box
                    component="img"
                    src={person.image}
                    alt={person.name}
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: `2px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : "rgba(94, 24, 233, 0.2)"}`,
                    }}
                  />
                  <Box>
                    <Typography
                      fontWeight={700}
                      variant="subtitle2"
                      color={isDark ? COLORS.TEXT.PRIMARY_DARK : "text.primary"}
                    >
                      {person.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      color={isDark ? COLORS.TEXT.SECONDARY_DARK : "text.secondary"}
                    >
                      {person.role}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <Button
            variant="outlined"
            href="/supplier/register"
            component={Link}
            sx={{
              borderColor: COLORS.PRIMARY_PURPLE,
              color: COLORS.PRIMARY_PURPLE,
              textTransform: "none",
              fontWeight: 600,
              px: 4,
              py: 1.5,
              borderRadius: 2,
              "&:hover": {
                borderColor: COLORS.PURPLE_HOVER,
                bgcolor: isDark ? COLORS.PURPLE_ALPHA_10 : COLORS.PURPLE_ALPHA_04,
                boxShadow: "0 4px 12px rgba(94, 24, 233, 0.2)",
              },
              transition: "all 0.2s ease",
            }}
          >
            {t("seeAllStories")}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default SuccessStories;
