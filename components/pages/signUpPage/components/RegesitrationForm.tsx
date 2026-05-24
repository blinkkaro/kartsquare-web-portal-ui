"use client";
import React, { useState, useRef } from "react";
import {
  Grid,
  MenuItem,
  InputAdornment,
  Typography,
  Box,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
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
import PersonIcon from "@mui/icons-material/PersonOutline";
import EmailIcon from "@mui/icons-material/EmailOutlined";
import LockIcon from "@mui/icons-material/LockOutlined";
import CalendarIcon from "@mui/icons-material/CalendarTodayOutlined";
import FemaleIcon from "@mui/icons-material/WomanOutlined";
import MaleIcon from "@mui/icons-material/ManOutlined";
import IconButton from "@mui/material/IconButton";
import { COLORS } from "@/constants/colors";
import GoogleIcon from "@mui/icons-material/Google";

interface RegistrationFormProps {
  onSubmit: (data: SignUpFormData) => void;
  loading: boolean;
  role: AppUserType;
  initialData?: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone_number?: string;
    country_code?: string;
    country?: string;
    birth_date?: string;
    gender?: string;
    whatsapp_number?: string;
    whatsapp_country_code?: string;
  };
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onSubmit,
  loading,
  role,
  initialData,
}) => {
  const { t } = useTranslate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const birthDateRef = useRef<HTMLInputElement>(null);

  // Calculate max date (13 years ago)
  const today = new Date();
  const maxDate = new Date(
    today.getFullYear() - 13,
    today.getMonth(),
    today.getDate(),
  )
    .toISOString()
    .split("T")[0];

  const isServiceProvider =
    role === AppUserType.SERVICE_PROVIDER || role === AppUserType.SUPPLIER;

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: yupResolver(SignUpSchema(t, role)),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      confirm_password: "",
      phone_number: isServiceProvider ? (initialData?.whatsapp_number || "") : "",
      country_code: isServiceProvider ? (initialData?.whatsapp_country_code || "+91") : "+91",
      gender: isServiceProvider ? ("PREFER_NOT_TO_SAY" as SignUpFormData["gender"]) : undefined,
      country: "India",
      birth_date: maxDate,
      role: role,
      whatsapp_number: initialData?.whatsapp_number || "",
      whatsapp_country_code: initialData?.whatsapp_country_code || "+91",
    },
  });

  React.useEffect(() => {
    if (!initialData) return;
    if (initialData.first_name) setValue("first_name", initialData.first_name);
    if (initialData.last_name) setValue("last_name", initialData.last_name);
    if (initialData.email) setValue("email", initialData.email);
    // Always sync hidden fields from lead data for service providers
    if (isServiceProvider) {
      setValue("phone_number", initialData.whatsapp_number || initialData.phone_number || "");
      setValue("country_code", initialData.whatsapp_country_code || initialData.country_code || "+91");
      setValue("country", "India");
      setValue("birth_date", maxDate);
      setValue("gender", "PREFER_NOT_TO_SAY" as SignUpFormData["gender"]);
    } else {
      if (initialData.phone_number) setValue("phone_number", initialData.phone_number);
      if (initialData.country_code) setValue("country_code", initialData.country_code);
      if (initialData.country) setValue("country", initialData.country);
      if (initialData.birth_date) setValue("birth_date", initialData.birth_date.split("T")[0]);
      if (initialData.gender) setValue("gender", initialData.gender as SignUpFormData["gender"]);
    }
    if (initialData.whatsapp_number) setValue("whatsapp_number", initialData.whatsapp_number);
    if (initialData.whatsapp_country_code) setValue("whatsapp_country_code", initialData.whatsapp_country_code);
  }, [initialData, setValue, isServiceProvider, maxDate]);

  const selectedCountryCode = watch("country_code");
  const whatsappCountryCode = watch("whatsapp_country_code");
  const gender = watch("gender");
  const whatsappNumber = watch("whatsapp_number");
  const selectedCountry = countries.find(
    (c) => c.phone_code === selectedCountryCode,
  );
  const selectedWhatsappCountry = countries.find(
    (c) => c.phone_code === whatsappCountryCode,
  );

  // React.useEffect(() => {
  //   if (isSameAsPhone) {
  //     setValue("phone_number", whatsappNumber || "");
  //     setValue("country_code", whatsappCountryCode || "");
  //   }
  // }, [isSameAsPhone, whatsappNumber, whatsappCountryCode, setValue]);

  // const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setIsSameAsPhone(event.target.checked);
  //   if (event.target.checked) {
  //     setValue("phone_number", whatsappNumber || "");
  //     setValue("country_code", whatsappCountryCode || "");
  //   } else {
  //     setValue("phone_number", "");
  //     setValue("country_code", "+91");
  //   }
  // };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{
        width: "100%",
        mt: 2
      }}
    >
      <Grid container spacing={3}>
        {/* Section: Personal Identity */}

        {isServiceProvider ? (
          <Grid size={{ xs: 12 }}>
            <Typography
              variant="body2"
              sx={{ mb: 1, fontWeight: 600, color: '#374151', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
            >
              Full Name*
            </Typography>
            <Input
              name="first_name"
              control={control}
              placeholder="Arjun Sharma"
              startIcon={<PersonIcon sx={{ color: COLORS.PRIMARY_PURPLE }} />}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />
          </Grid>
        ) : (
          <>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography
                variant="body2"
                sx={{ mb: 1, fontWeight: 600, color: '#374151' }}
              >
                {t("first_name")}*
              </Typography>
              <Input
                name="first_name"
                control={control}
                placeholder="Arjun"
                startIcon={<PersonIcon sx={{ color: COLORS.PRIMARY_PURPLE }} />}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography
                variant="body2"
                sx={{ mb: 1, fontWeight: 600, color: '#374151' }}
              >
                {t("last_name")}*
              </Typography>
              <Input
                name="last_name"
                control={control}
                placeholder="Sharma"
                startIcon={<PersonIcon sx={{ color: COLORS.PRIMARY_PURPLE }} />}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            </Grid>
          </>
        )}

        <Grid size={{ xs: 12 }}>
          <Typography
            variant="body2"
            sx={{ mb: 1, fontWeight: 600, color: '#374151' }}
          >
            {t("email_address")}*
          </Typography>
          <Input
            name="email"
            control={control}
            placeholder="arjun.sharma@mail.in"
            startIcon={<EmailIcon sx={{ color: COLORS.PRIMARY_PURPLE }} />}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography
            variant="body2"
            sx={{ mb: 1, fontWeight: 600, color: '#374151' }}
          >
            {t("password")}*
          </Typography>
          <Input
            name="password"
            control={control}
            type={showPassword ? "text" : "password"}
            placeholder="********"
            startIcon={<LockIcon sx={{ color: COLORS.PRIMARY_PURPLE }} />}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography
            variant="body2"
            sx={{ mb: 1, fontWeight: 600, color: '#374151' }}
          >
            Confirm Password*
          </Typography>
          <Input
            name="confirm_password"
            control={control}
            type={showConfirmPassword ? "text" : "password"}
            placeholder="********"
            startIcon={<LockIcon sx={{ color: COLORS.PRIMARY_PURPLE }} />}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Customer Specific Fields */}
        {!isServiceProvider && (
          <>
            <Grid size={{ xs: 12 }} sx={{ mt: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700, color: COLORS.PRIMARY_PURPLE, textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.75rem' }}>
                Additional Details
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography
                variant="body2"
                sx={{ mb: 1, fontWeight: 600, color: '#374151' }}
              >
                {t("phone_number")}*
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Box sx={{ width: "90px" }}>
                  <Input
                    name="country_code"
                    control={control}
                    select
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                  >
                    {countries.map((option) => (
                      <MenuItem key={option.code} value={option.phone_code}>
                        {option.phone_code}
                      </MenuItem>
                    ))}
                  </Input>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Input
                    name="phone_number"
                    control={control}
                    placeholder="98765 43210"
                    type="tel"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    inputProps={{
                      maxLength: 10,
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                    }}
                  />
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography
                variant="body2"
                sx={{ mb: 1, fontWeight: 600, color: '#374151' }}
              >
                {t("birth_date")}*
              </Typography>
              <Input
                name="birth_date"
                control={control}
                type="date"
                inputRef={birthDateRef}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                InputProps={{
                  inputProps: { max: maxDate },
                }}
                startIcon={
                  <CalendarIcon
                    sx={{ cursor: "pointer", color: COLORS.PRIMARY_PURPLE }}
                    onClick={() => birthDateRef.current?.showPicker()}
                  />
                }
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography
                variant="body2"
                sx={{ mb: 1, fontWeight: 600, color: '#374151' }}
              >
                {t("country")}*
              </Typography>
              <Input
                name="country"
                control={control}
                select
                placeholder="Select Country"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
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

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography
                variant="body2"
                sx={{ mb: 1, fontWeight: 600, color: '#374151' }}
              >
                {t("gender")}*
              </Typography>
              <Input
                name="gender"
                control={control}
                select
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                SelectProps={{
                  displayEmpty: true,
                  renderValue: (selected: any) => {
                    if (!selected) {
                      return (
                        <Typography color="textSecondary" sx={{ fontSize: '0.875rem' }}>
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
                startIcon={gender === "MALE" ? <MaleIcon sx={{ color: COLORS.PRIMARY_PURPLE }} /> : <FemaleIcon sx={{ color: COLORS.PRIMARY_PURPLE }} />}
              >
                <MenuItem value="MALE">{t("male")}</MenuItem>
                <MenuItem value="FEMALE">{t("female")}</MenuItem>
                <MenuItem value="OTHER">{t("other")}</MenuItem>
                <MenuItem value="PREFER_NOT_TO_SAY">
                  {t("prefer_not_to_say")}
                </MenuItem>
              </Input>
            </Grid>
          </>
        )}
      </Grid>

      <Typography
        variant="body2"
        color="textSecondary"
        sx={{
          mt: 4,
          display: "block",
          textAlign: "center",
          fontSize: '0.8rem',
          lineHeight: 1.6
        }}
      >
        {t("by_signup_to_accept")}{" "}
        <span style={{ color: COLORS.PRIMARY_PURPLE, fontWeight: 700, cursor: 'pointer' }}>
          {t("privacy_policy")}
        </span>{" "}
        and{" "}
        <span style={{ color: COLORS.PRIMARY_PURPLE, fontWeight: 700, cursor: 'pointer' }}>
          {t("termsConditionsTitle")}
        </span>
      </Typography>

      <Box sx={{ mt: 4 }}>
        <Button
          fullWidth
          size="large"
          type="submit"
          isLoading={loading}
          variant="contained"
          sx={{
            borderRadius: "12px",
            py: 1.8,
            fontSize: { xs: '0.9rem', sm: '1rem' },
            fontWeight: 700,
            bgcolor: COLORS.PRIMARY_PURPLE,
            boxShadow: `0 8px 20px rgba(94, 24, 233, 0.25)`,
            '&:hover': {
              bgcolor: '#4c14c0',
              boxShadow: `0 10px 25px rgba(94, 24, 233, 0.35)`,
            }
          }}
        >
          {t("signup")}
        </Button>
      </Box>
    </Box>
  );
};

export default RegistrationForm;
