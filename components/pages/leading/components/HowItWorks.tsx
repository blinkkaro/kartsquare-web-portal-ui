import React from "react";
import { Box, Typography, Container, Grid, Paper } from "@mui/material";
import { LISTING, getSteps } from "./constants";
import { useTranslate } from "@/hooks/useTranslate";

const HowItWorks = () => {
  const { t } = useTranslate();
  return (
    <Box sx={{ py: 8, bgcolor: LISTING.bgSoft }}>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="overline"
            fontWeight={700}
            color="text.secondary"
            sx={{ letterSpacing: 1 }}
          >
            {t("howItWorks")}
          </Typography>
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{ mt: 1, color: LISTING.text }}
          >
            {t("getFreeListingSteps")}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
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
                  border: `1px solid ${LISTING.border}`,
                  bgcolor: "white",
                  boxShadow: LISTING.cardShadow,
                  textAlign: "center",
                  transition: "box-shadow 0.2s ease",
                  "&:hover": { boxShadow: LISTING.cardShadowHover },
                }}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    bgcolor: LISTING.primaryLight,
                    color: LISTING.primary,
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
                          sx={{ fontSize: 44, color: LISTING.primary }}
                        />
                      ))}
                    </Box>
                  ) : (
                    <item.Icon sx={{ fontSize: 72, color: LISTING.primary }} />
                  )}
                </Box>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{ mb: 1, color: LISTING.text }}
                >
                  {item.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
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
