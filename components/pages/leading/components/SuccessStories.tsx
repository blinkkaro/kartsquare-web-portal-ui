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
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import { getSuccessStories } from "./constants";
import { useTranslate } from "@/hooks/useTranslate";
import { COLORS } from "@/constants/colors";

const SuccessStories = () => {
  const { t } = useTranslate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{ py: 8, bgcolor: isDark ? COLORS.BACKGROUND.PRIMARY_DARK : "white" }}
    >
      <Container maxWidth="xl">
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Typography
            variant="overline"
            fontWeight={700}
            color={isDark ? COLORS.TEXT.SECONDARY_DARK : "text.secondary"}
            sx={{ letterSpacing: 1 }}
          >
            {t("successStories")}
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
            {t("hearFromOwners")}
          </Typography>
          <Typography
            variant="body1"
            color={isDark ? COLORS.TEXT.SECONDARY_DARK : "text.secondary"}
            sx={{ mt: 1, maxWidth: 560, mx: "auto" }}
          >
            {t("seeHowOthers")}
          </Typography>
        </Box>
        <Grid container spacing={3} justifyContent="center">
          {getSuccessStories(t).map((person, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
              <Paper
                elevation={0}
                sx={{
                  overflow: "hidden",
                  borderRadius: 3,
                  border: `1px solid ${
                    isDark
                      ? COLORS.BORDER.DEFAULT_DARK
                      : COLORS.BORDER.DEFAULT_LIGHT
                  }`,
                  height: "100%",
                  bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : "white",
                  transition: "box-shadow 0.2s ease, transform 0.2s ease",
                  "&:hover": {
                    boxShadow: isDark ? "none" : "rgb(79 70 229 / 0.1)",
                    transform: "translateY(-2px)",
                    borderColor: COLORS.PURPLE_HOVER,
                  },
                }}
              >
                <Box
                  sx={{
                    aspectRatio: "1",
                    bgcolor: isDark
                      ? COLORS.PURPLE_ALPHA_04
                      : COLORS.PURPLE_ALPHA_10,
                    position: "relative",
                  }}
                >
                  <Box
                    component="img"
                    src={person.image}
                    alt={person.name}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
                <Box sx={{ p: 2.5 }}>
                  <Typography
                    fontWeight={700}
                    variant="subtitle1"
                    color={isDark ? COLORS.TEXT.PRIMARY_DARK : "text.primary"}
                  >
                    {person.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color={
                      isDark ? COLORS.TEXT.SECONDARY_DARK : "text.secondary"
                    }
                    sx={{ mb: 0.5 }}
                  >
                    {person.role}
                  </Typography>
                  <Typography
                    variant="body2"
                    color={COLORS.PRIMARY_PURPLE}
                    fontWeight={600}
                  >
                    &ldquo;{person.tagline}&rdquo;
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ textAlign: "center", mt: 4 }}>
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
              "&:hover": {
                borderColor: COLORS.PURPLE_HOVER,
                bgcolor: isDark
                  ? COLORS.PURPLE_ALPHA_10
                  : COLORS.PURPLE_ALPHA_04,
              },
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
