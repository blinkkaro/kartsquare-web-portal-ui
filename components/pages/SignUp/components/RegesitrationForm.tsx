"use client";
import React, { useState } from "react";
import { Grid, MenuItem, InputAdornment, Typography, Box } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SignUpSchema, SignUpFormData } from "../signUpSchema";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { useTranslate } from "@/hooks/useTranslate";
import { countries } from "./data";
import { AppUserType } from "@/services/auth/auth.interface";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import Link from "next/link";
import { COLORS } from "@/constants/colors";
import GoogleIcon from "@mui/icons-material/Google";

interface RegistrationFormProps {
  onSubmit: (data: SignUpFormData) => void;
  loading: boolean;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onSubmit,
  loading,
}) => {
  const { t } = useTranslate();
  const [showPassword, setShowPassword] = useState(false);

  // Calculate max date (13 years ago)
  const today = new Date();
  const maxDate = new Date(
    today.getFullYear() - 13,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0];

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: yupResolver(SignUpSchema(t)),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      country_code: "+91", // Default to India code
      gender: undefined,
      country: "India",
    },
  });

  const selectedCountryCode = watch("country_code");
  const selectedCountry = countries.find(
    (c) => c.phone_code === selectedCountryCode
  );

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{ mt: 1 }}
    >
      <Grid container spacing={2}>
        {/* First Name & Last Name */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            {t("first_name")}*
          </Typography>
          <Input
            name="first_name"
            control={control}
            placeholder="Masruq Jaun"
            startIcon={<i className="ri-user-line" />} // Using remixicon or similar if available, else standard icon
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            {t("last_name")}*
          </Typography>
          <Input
            name="last_name"
            control={control}
            placeholder="Haik"
            startIcon={<i className="ri-user-line" />}
          />
        </Grid>

        {/* Email */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            {t("email_address")}*
          </Typography>
          <Input
            name="email"
            control={control}
            placeholder="masruqjaunhaik@mail.in"
            startIcon={<i className="ri-mail-line" />}
          />
        </Grid>

        {/* Phone Number */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            {t("phone_number")}*
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            {/* Country Code Selector */}
            <Box sx={{ minWidth: 100 }}>
              <Input
                name="country_code"
                control={control}
                select
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {selectedCountry?.flag}
                    </InputAdornment>
                  ),
                }}
              >
                {countries.map((option) => (
                  <MenuItem key={option.code} value={option.phone_code}>
                    {option.phone_code}
                  </MenuItem>
                ))}
              </Input>
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Input
                name="phone_number"
                control={control}
                placeholder="621 121221"
              />
            </Box>
          </Box>
        </Grid>

        {/* Password */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            {t("password")}*
          </Typography>
          <Input
            name="password"
            control={control}
            type={showPassword ? "text" : "password"}
            placeholder="********"
            startIcon={<i className="ri-lock-line" />}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Country */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            {t("country")}*
          </Typography>
          <Input
            name="country"
            control={control}
            select
            placeholder="Select Country"
            SelectProps={{
              renderValue: (selected: any) => {
                const country = countries.find((c) => c.name === selected);
                return (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <span style={{ marginRight: 8 }}>{country?.flag}</span>
                    {selected}
                  </Box>
                );
              },
            }}
          >
            {countries.map((option) => (
              <MenuItem key={option.code} value={option.name}>
                <span style={{ marginRight: 8 }}>{option.flag}</span>{" "}
                {option.name}
              </MenuItem>
            ))}
          </Input>
        </Grid>

        {/* Birth Date */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            {t("birth_date")}
          </Typography>
          <Input
            name="birth_date"
            control={control}
            type="date"
            InputProps={{
              inputProps: { max: maxDate },
            }}
            startIcon={<i className="ri-calendar-line" />}
          />
        </Grid>

        {/* Gender */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            {t("gender")}
          </Typography>
          <Input
            name="gender"
            control={control}
            select // Keep select prop
            SelectProps={{
              displayEmpty: true,
              renderValue: (selected: any) => {
                if (!selected) {
                  return (
                    <Typography color="textSecondary">
                      {t("select_gender")}
                    </Typography>
                  );
                }
                const genderOptions: Record<string, string> = {
                  MALE: t("male"),
                  FEMALE: t("female"),
                  OTHER: t("other"),
                  PREFER_NOT_TO_SAY: t("prefer_not_to_say"),
                };
                return genderOptions[selected] || selected;
              },
            }}
            startIcon={<i className="ri-women-line" />}
          >
            <MenuItem value="MALE">{t("male")}</MenuItem>
            <MenuItem value="FEMALE">{t("female")}</MenuItem>
            <MenuItem value="OTHER">{t("other")}</MenuItem>
            <MenuItem value="PREFER_NOT_TO_SAY">
              {t("prefer_not_to_say")}
            </MenuItem>
          </Input>
        </Grid>
      </Grid>
      <Typography
        variant="body1"
        color="textSecondary"
        sx={{ mt: 1, display: "block", textAlign: "center" }}
      >
        by signup to Accept{" "}
        <span style={{ textDecoration: "underline", fontWeight: 600 }}>
          privacy policy
        </span>{" "}
        and{" "}
        <span style={{ textDecoration: "underline", fontWeight: 600 }}>
          terms & conditions
        </span>
      </Typography>

      <Box sx={{ mt: 4, display: "flex", gap: 2, flexDirection: "column" }}>
        <Button
          fullWidth
          size="large"
          type="submit"
          isLoading={loading}
          variant="contained"
          sx={{ borderRadius: "50px", height: "50px" }}
        >
          {t("signup")}
        </Button>
        <Button
          variant="contained"
          startIcon={<GoogleIcon />}
          sx={{
            bgcolor: COLORS.DARK,
            color: "white",
            textTransform: "none",
            borderRadius: "50px",
            padding: "10px 30px",
            "&:hover": {
              bgcolor: COLORS.DARK,
            },
          }}
        >
          Continue with Google
        </Button>
      </Box>
    </Box>
  );
};

export default RegistrationForm;
