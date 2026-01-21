"use client";
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Box, Typography, Autocomplete, TextField } from "@mui/material";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { useTranslate } from "@/hooks/useTranslate";
import { useSupplierProfile, useUpdateSupplierProfile } from "@/hooks/useSupplier";
import { BUSINESS_TYPES } from "@/constants/common";

interface BusinessProfileStepProps {
    onNext: () => void;
}

const BusinessProfileStep: React.FC<BusinessProfileStepProps> = ({ onNext }) => {
    const { t } = useTranslate();
    const { data: profileArgs, isLoading: isLoadingProfile } = useSupplierProfile();
    const updateProfile = useUpdateSupplierProfile();

    const schema = yup.object().shape({
        business_name: yup.string().required("Business name is required"),

        description: yup.string().min(20, "Description must be at least 20 characters").optional(),
        business_type: yup.string().required("Business type is required"),
        website: yup.string().url("Invalid URL").optional(),
        establishment_year: yup.number().typeError("Must be a number").required("Establishment year is required"),
        employee_count: yup.string().required("Employee count is required"),
        address_line: yup.string().required("Address is required"),
        city: yup.string().required("City is required"),
        state: yup.string().required("State is required"),
        pincode: yup.string().required("Pincode is required"),
    });

    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        if (profileArgs?.data) {
            reset(profileArgs.data);
        }
    }, [profileArgs, reset]);

    const onSubmit = async (data: any) => {
        try {
            await updateProfile.mutateAsync(data);
            onNext();
        } catch (error) {
            console.error("Failed to update profile", error);
        }
    };

    if (isLoadingProfile) return <Typography>Loading profile...</Typography>;

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="h6" mb={2}>Business Details</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Input name="business_name" control={control} label="Company Name" placeholder="My Business Pvt Ltd" />


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

                <Input name="establishment_year" control={control} label="Establishment Year" placeholder="2020" type="number" />
                <Input name="employee_count" control={control} label="Employee Count" placeholder="10-50" />
                <Input name="website" control={control} label="Website URL" placeholder="https://mybusiness.com" />
                <Input name="address_line" control={control} label="Address Line" placeholder="123 Main St" />
                <Input name="city" control={control} label="City" placeholder="Mumbai" />
                <Input name="state" control={control} label="State" placeholder="Maharashtra" />
                <Input name="pincode" control={control} label="Pincode" placeholder="400001" />

                <Input name="description" control={control} label="Description" multiline rows={4} placeholder="Tell us about your business..." />
            </Box>
            <Box mt={3} display="flex" justifyContent="flex-end">
                <Button type="submit" isLoading={updateProfile.isPending}>
                    Save & Next
                </Button>
            </Box>
        </Box>
    );
};

export default BusinessProfileStep;
