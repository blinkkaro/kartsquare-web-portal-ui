import React from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  useTheme,
} from "@mui/material";
import { getSteps } from "./constants";
import { useTranslate } from "@/hooks/useTranslate";
import { COLORS } from "@/constants/colors";

const HowItWorks = () => {
  const { t } = useTranslate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{ py: 8, bgcolor: isDark ? COLORS.BACKGROUND.PRIMARY_DARK : "white" }}
    >
      <Container maxWidth="xl">
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="overline"
            fontWeight={700}
            color={isDark ? COLORS.TEXT.SECONDARY_DARK : "text.secondary"}
            sx={{ letterSpacing: 1 }}
          >
            {t("howItWorks")}
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
            {t("getFreeListingSteps")}
          </Typography>
          <Typography
            variant="body1"
            color={isDark ? COLORS.TEXT.SECONDARY_DARK : "text.secondary"}
            sx={{ mt: 1 }}
          >
            {t("takesLessThanMinutes")}
          </Typography>
        </Box>
        <Grid
          container
          spacing={4}
          justifyContent="center"
          alignItems="stretch"
        >
          {getSteps(t).map((item, index) => (
            <Grid size={{ xs: 12, md: 3 }} key={item.step}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: "100%",
                  borderRadius: 3,
                  border: `1px solid ${
                    isDark
                      ? COLORS.BORDER.DEFAULT_DARK
                      : COLORS.BORDER.DEFAULT_LIGHT
                  }`,
                  bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : "white",
                  boxShadow: isDark ? "none" : COLORS.SHADOW.DEFAULT,
                  textAlign: "center",
                  transition: "box-shadow 0.2s ease",
                  "&:hover": {
                    boxShadow: isDark ? "none" : "rgb(79 70 229 / 0.1)",
                    borderColor: COLORS.PURPLE_HOVER,
                  },
                }}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    bgcolor: isDark
                      ? COLORS.PURPLE_ALPHA_10
                      : COLORS.PURPLE_ALPHA_10,
                    color: COLORS.PRIMARY_PURPLE,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "1.25rem",
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  {item.step}
                </Box>
                <Box
                  sx={{
                    height: 100,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  {item.subIcons ? (
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1.5,
                        justifyContent: "center",
                      }}
                    >
                      {item.subIcons.map((Icon, i) => (
                        <Icon
                          key={i}
                          sx={{ fontSize: 44, color: COLORS.PRIMARY_PURPLE }}
                        />
                      ))}
                    </Box>
                  ) : (
                    <item.Icon
                      sx={{ fontSize: 72, color: COLORS.PRIMARY_PURPLE }}
                    />
                  )}
                </Box>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{
                    mb: 1,
                    color: isDark
                      ? COLORS.TEXT.PRIMARY_DARK
                      : COLORS.TEXT.PRIMARY_LIGHT,
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  variant="body2"
                  color={isDark ? COLORS.TEXT.SECONDARY_DARK : "text.secondary"}
                  sx={{ lineHeight: 1.6 }}
                >
                  {item.desc}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HowItWorks;
