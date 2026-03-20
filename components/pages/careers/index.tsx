"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  useTheme,
  Divider,
  InputAdornment,
} from "@mui/material";
import LogoLoader from "@/components/common/Loader/LogoLoader";
import {
  Work,
  School,
  Groups,
  TrendingUp,
  Email,
  Phone,
  Upload,
  AttachFile,
  Person,
  Business,
} from "@mui/icons-material";
import { motion, useInView } from "framer-motion";
import { useTranslate } from "@/hooks/useTranslate";
import { COLORS } from "@/constants/colors";
import Title from "@/components/auth/title";
import NavLogo from "@/components/common/Nav/components/NavLogo";

const CareersView: React.FC = () => {
  const { t } = useTranslate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    coverLetter: "",
    resume: null as File | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Refs for scroll animations
  const heroRef = useRef(null);
  const benefitsRef = useRef(null);
  const cultureRef = useRef(null);
  const formRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true, amount: 0.3 });
  const benefitsInView = useInView(benefitsRef, { once: true, amount: 0.2 });
  const cultureInView = useInView(cultureRef, { once: true, amount: 0.3 });
  const formInView = useInView(formRef, { once: true, amount: 0.2 });

  const benefits = [
    {
      icon: <Work />,
      title: t("competitiveSalary"),
      description: t("competitiveSalaryDesc"),
      color: COLORS.PRIMARY_PURPLE,
    },
    {
      icon: <School />,
      title: t("learningDevelopment"),
      description: t("learningDevelopmentDesc"),
      color: "#00B2FF",
    },
    {
      icon: <Groups />,
      title: t("collaborativeCulture"),
      description: t("collaborativeCultureDesc"),
      color: "#79adff",
    },
    {
      icon: <TrendingUp />,
      title: t("careerGrowth"),
      description: t("careerGrowthDesc"),
      color: "#9cc2dd",
    },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, resume: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setSubmitSuccess(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        position: "",
        experience: "",
        coverLetter: "",
        resume: null,
      });
      setSubmitSuccess(false);
    }, 3000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      {/* Hero Section with Logo */}
      <motion.div
        ref={heroRef}
        initial="hidden"
        animate={heroInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <Box
          sx={{
            textAlign: "center",
            mb: { xs: 6, md: 10 },
            px: { xs: 2, md: 0 },
          }}
        >
          <motion.div variants={itemVariants}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mb: 3,
              }}
            >
              <NavLogo isMobile={false} mode={isDark ? "dark" : "light"} />
            </Box>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3.5rem", lg: "4rem" },
                fontWeight: 700,
                mb: 2,
                background: `linear-gradient(135deg, ${COLORS.PRIMARY_PURPLE} 0%, #00B2FF 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                lineHeight: 1.2,
              }}
            >
              {t("joinOurTeam")}
            </Typography>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: "1rem", md: "1.25rem" },
                color: isDark
                  ? COLORS.TEXT.SECONDARY_DARK
                  : COLORS.TEXT.SECONDARY_LIGHT,
                maxWidth: "700px",
                mx: "auto",
                lineHeight: 1.7,
                mb: 4,
              }}
            >
              {t("careersHeroDescription")}
            </Typography>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 2,
                p: 2,
                borderRadius: 2,
                bgcolor: isDark
                  ? COLORS.BACKGROUND.SECONDARY_DARK
                  : COLORS.PURPLE_ALPHA_10,
                border: `2px solid ${COLORS.PRIMARY_PURPLE}`,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 600,
                  color: COLORS.PRIMARY_PURPLE,
                }}
              >
                {t("currentlyNoOpenings")}
              </Typography>
            </Box>
          </motion.div>
        </Box>
      </motion.div>

      {/* Benefits Section */}
      <motion.div
        ref={benefitsRef}
        initial="hidden"
        animate={benefitsInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <Box sx={{ mb: { xs: 6, md: 10 } }}>
          <motion.div variants={itemVariants}>
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: "1.75rem", md: "2.5rem" },
                fontWeight: 700,
                mb: 1,
                textAlign: "center",
                color: isDark
                  ? COLORS.TEXT.PRIMARY_DARK
                  : COLORS.TEXT.PRIMARY_LIGHT,
              }}
            >
              {t("whyJoinUs")}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                textAlign: "center",
                mb: 5,
                color: isDark
                  ? COLORS.TEXT.SECONDARY_DARK
                  : COLORS.TEXT.SECONDARY_LIGHT,
              }}
            >
              {t("whyJoinUsSubtitle")}
            </Typography>
          </motion.div>
          <Grid container spacing={3}>
            {benefits.map((benefit, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <motion.div variants={itemVariants}>
                  <Card
                    sx={{
                      height: "100%",
                      bgcolor: isDark
                        ? COLORS.BACKGROUND.PAPER_DARK
                        : COLORS.BACKGROUND.PAPER_LIGHT,
                      border: `2px solid ${
                        isDark
                          ? COLORS.BORDER.DEFAULT_DARK
                          : "transparent"
                      }`,
                      borderRadius: 3,
                      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                      position: "relative",
                      overflow: "hidden",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "4px",
                        background: `linear-gradient(90deg, ${benefit.color}, ${COLORS.PRIMARY_PURPLE})`,
                        transform: "scaleX(0)",
                        transformOrigin: "left",
                        transition: "transform 0.4s ease",
                      },
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: `0 20px 40px -10px ${benefit.color}40`,
                        borderColor: benefit.color,
                        "&::before": {
                          transform: "scaleX(1)",
                        },
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: 2,
                          bgcolor: `${benefit.color}15`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: 3,
                          color: benefit.color,
                          "& svg": {
                            fontSize: "2rem",
                          },
                        }}
                      >
                        {benefit.icon}
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          mb: 1.5,
                          fontSize: { xs: "1.125rem", md: "1.25rem" },
                          color: isDark
                            ? COLORS.TEXT.PRIMARY_DARK
                            : COLORS.TEXT.PRIMARY_LIGHT,
                        }}
                      >
                        {benefit.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: isDark
                            ? COLORS.TEXT.SECONDARY_DARK
                            : COLORS.TEXT.SECONDARY_LIGHT,
                          lineHeight: 1.7,
                        }}
                      >
                        {benefit.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </motion.div>

      {/* Culture Section */}
      <motion.div
        ref={cultureRef}
        initial="hidden"
        animate={cultureInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Box
            sx={{
              position: "relative",
              bgcolor: isDark
                ? COLORS.BACKGROUND.SECONDARY_DARK
                : COLORS.PURPLE_ALPHA_10,
              borderRadius: 4,
              p: { xs: 4, md: 6 },
              mb: { xs: 6, md: 10 },
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "100%",
                background: `linear-gradient(135deg, ${COLORS.PRIMARY_PURPLE}08 0%, #00B2FF08 100%)`,
                zIndex: 0,
              },
            }}
          >
            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: "1.75rem", md: "2.5rem" },
                  fontWeight: 700,
                  mb: 3,
                  textAlign: "center",
                  color: isDark
                    ? COLORS.TEXT.PRIMARY_DARK
                    : COLORS.TEXT.PRIMARY_LIGHT,
                }}
              >
                {t("ourCulture")}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: "1rem", md: "1.125rem" },
                  color: isDark
                    ? COLORS.TEXT.SECONDARY_DARK
                    : COLORS.TEXT.SECONDARY_LIGHT,
                  lineHeight: 1.9,
                  maxWidth: "900px",
                  mx: "auto",
                  textAlign: "center",
                }}
              >
                {t("cultureDescription")}
              </Typography>
            </Box>
          </Box>
        </motion.div>
      </motion.div>

      {/* Resume Submission Form */}
      <motion.div
        ref={formRef}
        initial="hidden"
        animate={formInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Box
            sx={{
              bgcolor: isDark
                ? COLORS.BACKGROUND.PAPER_DARK
                : COLORS.BACKGROUND.PAPER_LIGHT,
              borderRadius: 4,
              p: { xs: 4, md: 6 },
              border: `2px solid ${COLORS.PRIMARY_PURPLE}`,
              boxShadow: `0 8px 32px ${COLORS.PRIMARY_PURPLE}20`,
            }}
          >
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: "1.75rem", md: "2.5rem" },
                  fontWeight: 700,
                  mb: 2,
                  background: `linear-gradient(135deg, ${COLORS.PRIMARY_PURPLE} 0%, #00B2FF 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {t("submitYourResume")}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: isDark
                    ? COLORS.TEXT.SECONDARY_DARK
                    : COLORS.TEXT.SECONDARY_LIGHT,
                  maxWidth: "600px",
                  mx: "auto",
                }}
              >
                {t("submitResumeDescription")}
              </Typography>
            </Box>

            {submitSuccess ? (
              <Box
                sx={{
                  textAlign: "center",
                  p: 4,
                  bgcolor: `${COLORS.PRIMARY_PURPLE}15`,
                  borderRadius: 2,
                  border: `2px solid ${COLORS.PRIMARY_PURPLE}`,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: COLORS.PRIMARY_PURPLE,
                    fontWeight: 600,
                    mb: 1,
                  }}
                >
                  {t("thankYou")}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: isDark
                      ? COLORS.TEXT.SECONDARY_DARK
                      : COLORS.TEXT.SECONDARY_LIGHT,
                  }}
                >
                  {t("resumeSubmittedSuccess")}
                </Typography>
              </Box>
            ) : (
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      name="fullName"
                      label={t("fullName")}
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person sx={{ color: COLORS.PRIMARY_PURPLE }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "&:hover fieldset": {
                            borderColor: COLORS.PRIMARY_PURPLE,
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: COLORS.PRIMARY_PURPLE,
                          },
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: COLORS.PRIMARY_PURPLE,
                        },
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      name="email"
                      type="email"
                      label={t("email_address")}
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email sx={{ color: COLORS.PRIMARY_PURPLE }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "&:hover fieldset": {
                            borderColor: COLORS.PRIMARY_PURPLE,
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: COLORS.PRIMARY_PURPLE,
                          },
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: COLORS.PRIMARY_PURPLE,
                        },
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      name="phone"
                      type="tel"
                      label={t("phone_number")}
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone sx={{ color: COLORS.PRIMARY_PURPLE }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "&:hover fieldset": {
                            borderColor: COLORS.PRIMARY_PURPLE,
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: COLORS.PRIMARY_PURPLE,
                          },
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: COLORS.PRIMARY_PURPLE,
                        },
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      name="position"
                      label={t("interestedPosition")}
                      value={formData.position}
                      onChange={handleInputChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Business sx={{ color: COLORS.PRIMARY_PURPLE }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "&:hover fieldset": {
                            borderColor: COLORS.PRIMARY_PURPLE,
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: COLORS.PRIMARY_PURPLE,
                          },
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: COLORS.PRIMARY_PURPLE,
                        },
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      name="experience"
                      label={t("yearsOfExperience")}
                      type="number"
                      value={formData.experience}
                      onChange={handleInputChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Work sx={{ color: COLORS.PRIMARY_PURPLE }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "&:hover fieldset": {
                            borderColor: COLORS.PRIMARY_PURPLE,
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: COLORS.PRIMARY_PURPLE,
                          },
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: COLORS.PRIMARY_PURPLE,
                        },
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      name="coverLetter"
                      label={t("coverLetter")}
                      multiline
                      rows={4}
                      value={formData.coverLetter}
                      onChange={handleInputChange}
                      placeholder={t("coverLetterPlaceholder")}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "&:hover fieldset": {
                            borderColor: COLORS.PRIMARY_PURPLE,
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: COLORS.PRIMARY_PURPLE,
                          },
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: COLORS.PRIMARY_PURPLE,
                        },
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Box
                      sx={{
                        border: `2px dashed ${
                          formData.resume
                            ? COLORS.PRIMARY_PURPLE
                            : isDark
                              ? COLORS.BORDER.DEFAULT_DARK
                              : COLORS.BORDER.DEFAULT_LIGHT
                        }`,
                        borderRadius: 2,
                        p: 3,
                        textAlign: "center",
                        bgcolor: isDark
                          ? COLORS.BACKGROUND.SECONDARY_DARK
                          : COLORS.PURPLE_ALPHA_10,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          borderColor: COLORS.PRIMARY_PURPLE,
                          bgcolor: `${COLORS.PRIMARY_PURPLE}10`,
                        },
                      }}
                    >
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                        id="resume-upload"
                      />
                      <label htmlFor="resume-upload">
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 2,
                            cursor: "pointer",
                          }}
                        >
                          <Box
                            sx={{
                              width: 56,
                              height: 56,
                              borderRadius: "50%",
                              bgcolor: COLORS.PRIMARY_PURPLE,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: COLORS.WHITE,
                            }}
                          >
                            {formData.resume ? (
                              <AttachFile />
                            ) : (
                              <Upload />
                            )}
                          </Box>
                          <Box>
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: 600,
                                color: COLORS.PRIMARY_PURPLE,
                                mb: 0.5,
                              }}
                            >
                              {formData.resume
                                ? formData.resume.name
                                : t("uploadResume")}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: isDark
                                  ? COLORS.TEXT.SECONDARY_DARK
                                  : COLORS.TEXT.SECONDARY_LIGHT,
                              }}
                            >
                              {t("resumeFileTypes")}
                            </Typography>
                          </Box>
                        </Box>
                      </label>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      size="large"
                      disabled={isSubmitting}
                      sx={{
                        bgcolor: COLORS.PRIMARY_PURPLE,
                        py: 1.5,
                        fontSize: "1.125rem",
                        fontWeight: 600,
                        borderRadius: 2,
                        textTransform: "none",
                        "&:hover": {
                          bgcolor: COLORS.PURPLE_HOVER,
                          transform: "translateY(-2px)",
                          boxShadow: `0 8px 24px ${COLORS.PRIMARY_PURPLE}40`,
                        },
                        "&:disabled": {
                          bgcolor: COLORS.PRIMARY_PURPLE,
                          opacity: 0.7,
                        },
                      }}
                    >
                      {isSubmitting ? (
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <LogoLoader size={20} />
                          <Typography>{t("submitting")}</Typography>
                        </Box>
                      ) : (
                        t("submitApplication")
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default CareersView;
