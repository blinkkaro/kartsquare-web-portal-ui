"use client";
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Box, Typography, Autocomplete, TextField, Grid } from "@mui/material";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { useTranslate } from "@/hooks/useTranslate";
import {
  useSupplierProfile,
  useUpdateSupplierProfile,
} from "@/hooks/useSupplier";
import { BUSINESS_TYPES } from "@/constants/common";

interface BusinessProfileStepProps {
  onNext: () => void;
}

const BusinessProfileStep: React.FC<BusinessProfileStepProps> = ({
  onNext,
}) => {
  const { t } = useTranslate();
  const { data: profileArgs, isLoading: isLoadingProfile } =
    useSupplierProfile();
  const updateProfile = useUpdateSupplierProfile();

  const schema = yup.object().shape({
    business_name: yup
      .string()
      .trim()
      .max(100, t("valNameMax"))
      .required(t("businessNameRequired")),
    contact_person: yup
      .string()
      .trim()
      .max(100, t("valNameMax"))
      .required(t("kyc_owner_name_required")),
    contact_number: yup
      .string()
      .trim()
      .matches(/^[0-9]+$/, t("phoneNumberInvalid"))
      .length(10, t("valPhoneExact"))
      .required(t("phoneNumberRequired")),
    description: yup
      .string()
      .trim()
      .min(20, t("businessDescriptionRequired"))
      .max(2000, t("valDescMax"))
      .required(t("businessDescriptionRequired")),
    business_type: yup
      .string()
      .trim()
      .required(t("store_setup_business_type_required")),
    website: yup
      .string()
      .trim()
      .max(255, t("valNameMax"))
      .url("Invalid URL")
      .nullable()
      .transform((v) => (v === "" ? null : v)),
    establishment_year: yup
      .number()
      .typeError("Must be a number")
      .required("Establishment year is required"), // Assuming 4 or 6 digits,
    employee_count: yup.string().trim().required("Employee count is required"),
    address_line: yup
      .string()
      .trim()
      .max(255, t("addressMax"))
      .required(t("addressRequired")),
    city: yup.string().trim().max(50, t("cityMax")).required(t("cityRequired")),
    state: yup
      .string()
      .trim()
      .max(50, t("stateMax"))
      .required(t("stateRequired")),
    pincode: yup
      .string()
      .trim()
      .matches(/^\d{5,6}$/, t("pincodeInvalid"))
      .required(t("pincodeRequired")),
    email: yup
      .string()
      .trim()
      .email(t("emailInvalid"))
      .lowercase()
      .max(255, t("valEmailMax"))
      .required(t("emailRequired")),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (profileArgs?.data) {
      // Filter out nulls from pre-fill data to avoid validation issues
      const cleanData = { ...profileArgs.data } as any;
      Object.keys(cleanData).forEach((key) => {
        if (cleanData[key] === null) {
          delete cleanData[key];
        }
      });
      reset(cleanData);
    }
  }, [profileArgs, reset]);

  const onSubmit = async (values: any) => {
    try {
      // Clean values before sending to backend
      const payload = { ...values } as any;
      Object.keys(payload).forEach((key) => {
        if (payload[key] === "" || payload[key] === null) {
          delete payload[key];
        }
      });
      await updateProfile.mutateAsync(payload);
      onNext();
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  if (isLoadingProfile) return <Typography>Loading profile...</Typography>;

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h6" mb={2}>
        Business Details
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Input
            name="business_name"
            control={control}
            label="Company Name"
            placeholder="My Business Pvt Ltd"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="business_type"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Autocomplete
                options={BUSINESS_TYPES}
                value={value || null}
                onChange={(_, newValue) => onChange(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t("business_type") || "Business Type"}
                    error={!!errors.business_type}
                    helperText={errors.business_type?.message as string}
                  />
                )}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Input
            name="contact_person"
            control={control}
            label="Contact Person"
            placeholder="John Doe"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Input
            name="contact_number"
            control={control}
            label="Contact Number"
            placeholder="+91 9876543210"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Input
            name="email"
            control={control}
            label="Email Address"
            placeholder="business@example.com"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Input
            name="establishment_year"
            control={control}
            label="Foundation Year"
            placeholder="2020"
            type="number"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Input
            name="employee_count"
            control={control}
            label="Employee Count"
            placeholder="10-50"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Input
            name="website"
            control={control}
            label="Website URL"
            placeholder="https://mybusiness.com"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Input
            name="address_line"
            control={control}
            label="Address Line"
            placeholder="123 Main St"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Input
            name="city"
            control={control}
            label="City"
            placeholder="Mumbai"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Input
            name="state"
            control={control}
            label="State"
            placeholder="Maharashtra"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Input
            name="pincode"
            control={control}
            label="Pincode"
            placeholder="400001"
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Input
            name="description"
            control={control}
            label="Description"
            multiline
            rows={4}
            placeholder="Tell us about your business..."
          />
        </Grid>
      </Grid>
      <Box mt={3} display="flex" justifyContent="flex-end">
        <Button type="submit" isLoading={updateProfile.isPending}>
          Save & Next
        </Button>
      </Box>
    </Box>
  );
};

export default BusinessProfileStep;
