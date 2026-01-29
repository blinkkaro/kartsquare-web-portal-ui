"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Container,
  Paper,
  useTheme,
  useMediaQuery,
  MenuItem,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { CheckCircle, Flag } from "@mui/icons-material";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { COLORS } from "@/constants/colors";
import { freeListingData } from "@/data/freeListingData";
import { countries } from "@/components/pages/SignUp/components/data";

// Validation schema
const schema = yup.object().shape({
  country_code: yup.string().required(),
  mobileNumber: yup
    .string()
    .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
    .required("Mobile number is required"),
  otp: yup.string().when("isOtpSent", {
    is: true,
    then: (schema) =>
      schema
        .length(6, "OTP must be 6 digits")
        .required("OTP is required")
        .test("otp-match", "Invalid OTP", (val) => val === "111111"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

const Hero = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // Logic to derive selected country will be added after useForm hook via watch

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(schema),
    context: { isOtpSent }, // Pass context for conditional validation
    defaultValues: {
      country_code: "+91",
      mobileNumber: "",
      otp: "",
    },
  });

  const selectedCountryCode = watch("country_code");
  const selectedCountry =
    countries.find((c) => c.phone_code === selectedCountryCode) || countries[0];

  const onSubmit = async (data: any) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      if (!isOtpSent) {
        setIsOtpSent(true);
      } else {
        if (data.otp === "111111") {
          alert("Phone number verified successfully!");
          // Proceed to next step (simulated)
        } else {
          setError("otp", { type: "manual", message: "Invalid OTP" });
        }
      }
    }, 1500);
  };

  return (
    <Box
      sx={{
        background: `linear-gradient(180deg, ${COLORS.BACKGROUND.SECONDARY_LIGHT} 0%, #FFFFFF 100%)`,
        // Tuned padding for mobile
        pt: { xs: 4, md: 8 },
        pb: { xs: 4, md: 10 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="lg">
        <Grid
          container
          spacing={4}
          alignItems="center"
          direction={isMobile ? "column-reverse" : "row"}
        >
          {/* Left Content */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                maxWidth: { xs: "100%", md: 500 },
                textAlign: { xs: "center", md: "left" },
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "1.75rem", sm: "2.25rem", md: "3rem" }, // Responsive font sizes
                  mb: 1,
                  color: COLORS.TEXT.PRIMARY_LIGHT,
                  lineHeight: { xs: 1.2, md: 1.3 },
                }}
              >
                {freeListingData.hero.title}{" "}
                <span style={{ color: COLORS.PRIMARY_BLUE }}>for FREE</span>
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: COLORS.TEXT.SECONDARY_LIGHT,
                  mb: 4,
                  fontWeight: 500,
                  fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
                }}
              >
                {freeListingData.hero.subtitle}
              </Typography>

              {/* Form Section */}
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, md: 3 },
                  border: `1px solid ${COLORS.BORDER.DEFAULT_LIGHT}`,
                  borderRadius: "16px",
                  mb: 4,
                  background: "rgba(255, 255, 255, 0.9)", // slightly less transparent on mobile for readability
                  backdropFilter: "blur(10px)",
                  mx: { xs: "auto", md: 0 },
                }}
              >
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Box sx={{ mb: 2, textAlign: "left" }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ mb: 1, color: COLORS.PRIMARY_PURPLE }}
                    >
                      Enter Mobile No.
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        flexDirection: "column",
                      }}
                    >
                      {/* Stack inputs on very small devices if needed, but flex-row usually works for phone inputs */}
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          width: "100%",
                        }}
                      >
                        <Box
                          sx={{
                            width: { xs: "100px", sm: "110px", md: "120px" },
                          }}
                        >
                          <Input
                            name="country_code"
                            control={control}
                            select
                            sx={{
                              "& .MuiSelect-select": {
                                display: "flex",
                                alignItems: "center",
                                paddingLeft: "8px",
                              },
                            }}
                            InputProps={{
                              startAdornment: selectedCountry ? (
                                <span
                                  style={{
                                    fontSize: "1.2rem",
                                    marginRight: "4px",
                                  }}
                                >
                                  {selectedCountry.flag}
                                </span>
                              ) : null,
                            }}
                          >
                            {countries.map((country) => (
                              <MenuItem
                                key={country.code}
                                value={country.phone_code}
                              >
                                <span style={{ marginRight: "8px" }}>
                                  {country.flag}
                                </span>
                                {country.phone_code}
                              </MenuItem>
                            ))}
                          </Input>
                        </Box>

                        <Input
                          name="mobileNumber"
                          control={control}
                          placeholder="Mobile Number"
                          type="tel"
                          disabled={isOtpSent}
                          sx={{ flex: 1 }}
                        />
                      </Box>

                      {!isOtpSent && (
                        <Button
                          type="submit"
                          isLoading={loading}
                          fullWidth={isMobile} // Full width button on mobile
                          sx={{
                            borderRadius: "12px",
                            minWidth: "120px",
                            // height: "56px", // Consistent height
                            mt: { xs: 1, sm: 0 },
                            whiteSpace: "nowrap",
                          }}
                        >
                          Start Now
                        </Button>
                      )}
                    </Box>
                  </Box>

                  {isOtpSent && (
                    <Box
                      sx={{
                        mt: 2,
                        display: "flex",
                        gap: 1,
                        flexDirection: { xs: "column", sm: "row" },
                      }}
                    >
                      <Input
                        name="otp"
                        control={control}
                        placeholder="Enter OTP (111111)"
                        type="text"
                        sx={{ flex: 1 }}
                      />
                      <Button
                        type="submit"
                        isLoading={loading}
                        fullWidth={isMobile}
                        sx={{
                          borderRadius: "12px",
                          minWidth: "120px",
                          height: "56px",
                        }}
                      >
                        Verify
                      </Button>
                    </Box>
                  )}
                </form>
              </Paper>

              {/* Benefits */}
              <Box sx={{ display: "inline-block", textAlign: "left" }}>
                {freeListingData.hero.benefits.map((benefit, index) => (
                  <Box
                    key={index}
                    sx={{ display: "flex", alignItems: "flex-start", mb: 1.5 }}
                  >
                    <CheckCircle
                      sx={{
                        color: COLORS.SUCCESS_GREEN,
                        mr: 1.5,
                        fontSize: 20,
                        mt: 0.5,
                      }}
                    />
                    <Typography
                      variant="body1"
                      sx={{
                        color: COLORS.TEXT.PRIMARY_LIGHT,
                        fontSize: { xs: "0.9rem", md: "1rem" },
                      }}
                    >
                      {benefit}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Right Image */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                position: "relative",
                height: { xs: 300, md: 500 },
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                alt="Free Listing Banner"
                sx={{
                  maxWidth: "100%",
                  height: { xs: "auto", md: "400px" }, // Fixed height on desktop for consistency
                  width: { xs: "100%", md: "auto" }, // Auto width on desktop to maintain aspect ratio
                  maxHeight: { xs: 300, md: 450 },
                  objectFit: "contain",
                  borderRadius: "20px",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                  animation: isMobile
                    ? "none"
                    : "float 6s ease-in-out infinite",
                  "@keyframes float": {
                    "0%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(-20px)" },
                    "100%": { transform: "translateY(0px)" },
                  },
                }}
              />

              {/* Stats Cards overlay - Hide on mobile to keep it clean */}
              <Box
                sx={{
                  position: "absolute",
                  top: "20%",
                  left: "-20px",
                  bgcolor: "#E8F5E9",
                  p: 2,
                  borderRadius: "16px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  display: { xs: "none", md: "block" },
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  19.3 Crore+
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Buyers
                </Typography>
              </Box>

              <Box
                sx={{
                  position: "absolute",
                  bottom: "20%",
                  right: "-20px",
                  bgcolor: "#FFF3E0",
                  p: 2,
                  borderRadius: "16px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  display: { xs: "none", md: "block" },
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  6.1 Lakh+
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Happy Customers
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Hero;
