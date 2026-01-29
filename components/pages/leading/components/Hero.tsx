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
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import Link from "next/link";
import ShieldIcon from "@mui/icons-material/Shield";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import StarIcon from "@mui/icons-material/Star";
import { LISTING, getHeroBenefits, getStatCards } from "./constants";
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
  return (
    <Box
      sx={{
        py: { xs: 5, md: 10 },
        px: { xs: 2, md: 4 },
        background: LISTING.gradient,
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
                bgcolor: "white",
                color: LISTING.primary,
                fontWeight: 600,
                "& .MuiChip-icon": { color: LISTING.primary },
              }}
            />
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 700,
                color: LISTING.text,
                lineHeight: 1.2,
                mb: 1.5,
                fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.5rem" },
              }}
            >
              {t("growYourBusinessWith")}{" "}
              <Box component="span" sx={{ color: LISTING.primary }}>
                {t("freeListing")}
              </Box>
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ mb: 3, fontWeight: 500 }}
            >
              {t("joinThousandsBusinessOwners")}
            </Typography>

            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                border: `1px solid ${LISTING.border}`,
                bgcolor: "white",
                boxShadow: LISTING.cardShadow,
                mb: 3,
              }}
            >
              <Typography
                variant="subtitle2"
                color="text.secondary"
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
                    border: `1px solid ${LISTING.border}`,
                    borderRadius: 2,
                    overflow: "hidden",
                    flex: "1 1 200px",
                    bgcolor: "white",
                  }}
                >
                  <Box
                    sx={{
                      px: 2,
                      py: 1.5,
                      bgcolor: LISTING.bgSoft,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="text.secondary"
                    >
                      +91
                    </Typography>
                  </Box>
                  <TextField
                    placeholder={t("yourMobileNumber")}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    variant="standard"
                    InputProps={{ disableUnderline: true }}
                    sx={{ flex: 1, px: 2, minWidth: 140 }}
                  />
                </Paper>
                <Button
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  href="/supplier/register"
                  component={Link}
                  sx={{
                    bgcolor: LISTING.primary,
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
                  sx={{ color: LISTING.success, fontSize: 24, mt: 0.25 }}
                />
                <Typography
                  variant="body1"
                  color="text.primary"
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
                  border: "10px solid #1a1a1a",
                  borderRadius: "32px",
                  overflow: "hidden",
                  // boxShadow: "0 24px 48px rgba(0,0,0,0.12)",
                }}
              >
                <Image
                  src="/auth/Home.JPG"
                  alt="App Home"
                  fill
                  style={{ objectFit: "cover", objectPosition: "center" }}
                />
              </Box>
              {/* <Box
                sx={{
                  width: 280,
                  border: "14px solid #1a1a1a",
                  borderRadius: "32px",
                  overflow: "hidden",
                  boxShadow: "0 24px 48px rgba(0,0,0,0.12)",
                }}
              >
                <Box sx={{ height: 440, bgcolor: "#fafafa", p: 2 }}>
                  <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        bgcolor: "#e8e8e8",
                      }}
                    />
                    <Box
                      sx={{
                        flex: 1,
                        height: 28,
                        borderRadius: 2,
                        bgcolor: "#e8e8e8",
                      }}
                    />
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: 2,
                        bgcolor: "#e8e8e8",
                      }}
                    />
                  </Box>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: `1px solid ${LISTING.border}`,
                      bgcolor: "white",
                      boxShadow: LISTING.cardShadow,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        gap: 0.5,
                        mb: 1,
                        flexWrap: "wrap",
                      }}
                    >
                      {["Verified", "Trusted", "Responsive"].map((b) => (
                        <Chip
                          key={b}
                          label={b}
                          size="small"
                          sx={{
                            bgcolor: LISTING.bgSoft,
                            fontWeight: 600,
                            fontSize: "0.7rem",
                          }}
                        />
                      ))}
                    </Box>
                    <Typography
                      variant="subtitle1"
                      fontWeight={700}
                      color="text.primary"
                    >
                      Your business
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mt: 1,
                      }}
                    >
                      <Chip
                        icon={
                          <StarIcon
                            sx={{ fontSize: 16, color: "white !important" }}
                          />
                        }
                        label="4.8"
                        size="small"
                        sx={{
                          bgcolor: LISTING.success,
                          color: "white",
                          fontWeight: 700,
                        }}
                      label={
                  <Typography variant="caption" color="text.secondary">
                    {t("agreeToTerms")}
                  </Typography>
                }  />
                    </Box>
                  </Paper>
                  <Box sx={{ mt: 2 }}>
                    {[1, 2, 3].map((i) => (
                      <Box
                        key={i}
                        sx={{
                          height: 10,
                          borderRadius: 1,
                          bgcolor: "#e8e8e8",
                          width: "100%",
                          mb: 1,
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Box> */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {getStatCards(t).map(({ value, label, icon: Icon, color }) => (
                  <Paper
                    key={label}
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      minWidth: 160,
                      borderLeft: `4px solid ${color}`,
                      bgcolor: "white",
                      boxShadow: LISTING.cardShadow,
                      "&:hover": { boxShadow: LISTING.cardShadowHover },
                    }}
                  >
                    <Icon sx={{ color, mb: 0.5 }} />
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      color="text.primary"
                    >
                      {value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
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
