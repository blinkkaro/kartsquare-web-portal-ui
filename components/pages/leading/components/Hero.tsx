import React from "react";
import {
  Box,
  Typography,
  Grid,
  Container,
  Paper,
  Chip,
  TextField,
  Button,
  useTheme,
} from "@mui/material";
import Link from "next/link";
import ShieldIcon from "@mui/icons-material/Shield";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { getHeroBenefits, getStatCards } from "./constants";
import { COLORS } from "@/constants/colors";
import Image from "next/image";
import { useTranslate } from "@/hooks/useTranslate";

interface HeroProps {
  mobile: string;
  setMobile: (value: string) => void;
  termsChecked: boolean;
  setTermsChecked: (value: boolean) => void;
}

const Hero: React.FC<HeroProps> = ({
  mobile,
  setMobile,
  termsChecked,
  setTermsChecked,
}) => {
  const { t } = useTranslate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        py: { xs: 5, md: 10 },
        px: { xs: 2, md: 4 },
        background: isDark ? COLORS.DARK_GRADIENT : COLORS.PURPLECYAN,
        borderRadius: { xs: 0, md: 4 },
        mx: { xs: 0, md: 2 },
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={5} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Chip
              icon={<ShieldIcon sx={{ fontSize: 18 }} />}
              label={t("freeForever")}
              size="small"
              sx={{
                mb: 2,
                bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : "white",
                color: COLORS.PRIMARY_PURPLE,
                fontWeight: 600,
                "& .MuiChip-icon": { color: COLORS.PRIMARY_PURPLE },
              }}
            />
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 700,
                color: isDark
                  ? COLORS.TEXT.PRIMARY_DARK
                  : COLORS.TEXT.PRIMARY_LIGHT,
                lineHeight: 1.2,
                mb: 1.5,
                fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.5rem" },
              }}
            >
              {t("growYourBusinessWith")}{" "}
              <Box component="span" sx={{ color: COLORS.PRIMARY_PURPLE }}>
                {t("freeListing")}
              </Box>
            </Typography>
            <Typography
              variant="h6"
              color={isDark ? COLORS.TEXT.SECONDARY_DARK : "text.secondary"}
              sx={{ mb: 3, fontWeight: 500 }}
            >
              {t("joinThousandsBusinessOwners")}
            </Typography>

            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                border: `1px solid ${
                  isDark
                    ? COLORS.BORDER.DEFAULT_DARK
                    : COLORS.BORDER.DEFAULT_LIGHT
                }`,
                bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : "white",
                boxShadow: isDark ? "none" : COLORS.SHADOW.DEFAULT,
                mb: 3,
              }}
            >
              <Typography
                variant="subtitle2"
                color={isDark ? COLORS.TEXT.SECONDARY_DARK : "text.secondary"}
                sx={{ mb: 1.5 }}
              >
                {t("startIn30Seconds")}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1.5,
                  alignItems: "stretch",
                }}
              >
                <Paper
                  variant="outlined"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    border: `1px solid ${
                      isDark
                        ? COLORS.BORDER.DEFAULT_DARK
                        : COLORS.BORDER.DEFAULT_LIGHT
                    }`,
                    borderRadius: 2,
                    overflow: "hidden",
                    flex: "1 1 200px",
                    bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : "white",
                  }}
                >
                  <Box
                    sx={{
                      px: 2,
                      py: 1.5,
                      bgcolor: isDark
                        ? COLORS.PURPLE_ALPHA_10
                        : COLORS.PURPLE_ALPHA_04,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color={
                        isDark ? COLORS.TEXT.SECONDARY_DARK : "text.secondary"
                      }
                    >
                      +91
                    </Typography>
                  </Box>
                  <TextField
                    placeholder={t("yourMobileNumber")}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    variant="standard"
                    InputProps={{
                      disableUnderline: true,
                      style: {
                        color: isDark
                          ? COLORS.TEXT.PRIMARY_DARK
                          : COLORS.TEXT.PRIMARY_LIGHT,
                      },
                    }}
                    sx={{ flex: 1, px: 2, minWidth: 140 }}
                  />
                </Paper>
                <Button
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  href="/supplier/register"
                  component={Link}
                  sx={{
                    bgcolor: COLORS.PRIMARY_PURPLE,
                    color: "white",
                    "&:hover": { bgcolor: COLORS.PURPLE_HOVER },
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    boxShadow: "0 4px 14px rgba(94, 24, 233, 0.35)",
                  }}
                >
                  {t("getMyFreeListing")}
                </Button>
              </Box>
            </Paper>

            {getHeroBenefits(t).map((text: string, i: number) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1.5,
                  mb: 1.5,
                }}
              >
                <CheckCircleIcon
                  sx={{ color: COLORS.SUCCESS_GREEN, fontSize: 24, mt: 0.25 }}
                />
                <Typography
                  variant="body1"
                  color={isDark ? COLORS.TEXT.PRIMARY_DARK : "text.primary"}
                  sx={{ fontWeight: 500 }}
                >
                  {text}
                </Typography>
              </Box>
            ))}
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                justifyContent: "center",
                alignItems: "flex-start",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Box
                sx={{
                  width: 280,
                  height: 560,
                  position: "relative",
                  border: `10px solid ${
                    isDark ? COLORS.BORDER.DEFAULT_DARK : "#1a1a1a"
                  }`,
                  borderRadius: "32px",
                  overflow: "hidden",
                }}
              >
                <Image
                  src="/auth/Home.JPG"
                  alt="App Home"
                  fill
                  style={{ objectFit: "cover", objectPosition: "center" }}
                />
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {getStatCards(t).map(({ value, label, icon: Icon, color }) => (
                  <Paper
                    key={label}
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      minWidth: 160,

                      bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : "white",
                      boxShadow: isDark ? "none" : COLORS.SHADOW.DEFAULT,
                      "&:hover": {
                        boxShadow: isDark ? "none" : "rgb(79 70 229 / 0.1)",
                      },
                      border: isDark
                        ? `1px solid ${COLORS.BORDER.DEFAULT_DARK}`
                        : undefined,
                      borderLeft: `4px solid ${color}`, // restore left border
                    }}
                  >
                    <Icon sx={{ color, mb: 0.5 }} />
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      color={isDark ? COLORS.TEXT.PRIMARY_DARK : "text.primary"}
                    >
                      {value}
                    </Typography>
                    <Typography
                      variant="body2"
                      color={
                        isDark ? COLORS.TEXT.SECONDARY_DARK : "text.secondary"
                      }
                    >
                      {label}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Hero;
