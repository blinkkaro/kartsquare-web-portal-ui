"use client";
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Box, Typography, FormControlLabel, Checkbox, Autocomplete, TextField, FormGroup, Chip } from "@mui/material";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import ImageUpload from "@/components/ImageUpload";
import { useTranslate } from "@/hooks/useTranslate";
import { useSupplierStore, useUpdateSupplierStore } from "@/hooks/useSupplier";
import { useRouter } from "next/navigation";
import { STORE_CATEGORIES, OPERATING_LOCATIONS } from "@/constants/common";

interface StoreStepProps {
    onBack: () => void;
}

const StoreStep: React.FC<StoreStepProps> = ({ onBack }) => {
    const router = useRouter();
    const { t } = useTranslate();
    const { data: storeData, isLoading: isLoadingStore } = useSupplierStore();
    const updateStore = useUpdateSupplierStore();

    const schema = yup.object().shape({
        store_name: yup.string().required("Store name is required"),
        slug: yup.string().required("Store URL slug is required"),
        about_us: yup.string().optional(),
        contact_email: yup.string().email("Invalid email").optional(),
        primary_mobile: yup.string().required("Primary mobile is required"),
        address: yup.string().optional(),
        city: yup.string().optional(),
        state: yup.string().optional(),
        logo_url: yup.string().optional(),
        banner_url: yup.string().optional(),
        categories_served: yup.array().of(yup.string()).min(1, "Select at least one category").required("Categories served is required"),
        operating_locations: yup.array().of(yup.string()).min(1, "Select at least one location").required("Operating locations is required"),
        contact_preferences: yup.array().of(yup.string()).min(1, "Select at least one contact preference").required("Contact preferences is required"),
    });

    const { control, handleSubmit, reset, setValue, watch, setError, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            categories_served: [],
            operating_locations: [],
            contact_preferences: [],
        }
    });

    useEffect(() => {
        if (storeData?.data) {
            // Transform contact_preferences object to array for UI
            const backendData = { ...storeData.data };
            if (backendData.contact_preferences && typeof backendData.contact_preferences === 'object') {
                const prefs: string[] = [];
                if (backendData.contact_preferences.show_phone) prefs.push('show_phone');
                if (backendData.contact_preferences.show_whatsapp) prefs.push('show_whatsapp');
                if (backendData.contact_preferences.allow_calls) prefs.push('allow_calls');
                if (backendData.contact_preferences.allow_chat) prefs.push('allow_chat');
                if (backendData.contact_preferences.enquiry_only) prefs.push('enquiry_only');
                backendData.contact_preferences = prefs;
            } else {
                backendData.contact_preferences = [];
            }
            reset(backendData);
        }
    }, [storeData, reset]);

    const onSubmit = async (data: any) => {
        try {
            // Transform contact_preferences array to object for Backend
            const payload = { ...data };
            const prefs = Array.isArray(payload.contact_preferences) ? payload.contact_preferences : [];

            payload.contact_preferences = {
                show_phone: prefs.includes('show_phone'),
                show_whatsapp: prefs.includes('show_whatsapp'),
                allow_calls: prefs.includes('allow_calls'),
                allow_chat: prefs.includes('allow_chat'),
                enquiry_only: prefs.includes('enquiry_only'),
            };

            await updateStore.mutateAsync(payload);
            // On success, redirect to dashboard or next expected flow
            router.push("/supplier/dashboard");
        } catch (error: any) {
            console.error("Failed to update store", error);
            if (error?.response?.data?.errors) {
                error.response.data.errors.forEach((err: any) => {
                    setError(err.field, { type: "server", message: err.message });
                });
            }
        }
    };

    if (isLoadingStore) return <Typography>Loading Store data...</Typography>;

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="h6" mb={2}>Store Setup</Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Input name="store_name" control={control} label="Store Name" />
                <Input name="slug" control={control} label="Store URL (Slug)" placeholder="my-store-name" />
                <Input name="about_us" control={control} label="About Us" multiline rows={3} />

                <Controller
                    name="categories_served"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <Autocomplete
                            multiple
                            options={STORE_CATEGORIES}
                            value={Array.isArray(value) ? value : []}
                            onChange={(_, newValue) => onChange(newValue)}
                            renderTags={(value: readonly string[], getTagProps) =>
                                value.map((option: string, index: number) => (
                                    <Chip variant="outlined" label={option} {...getTagProps({ index })} key={option} />
                                ))
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Categories Served"
                                    error={!!errors.categories_served}
                                    helperText={errors.categories_served?.message as string}
                                />
                            )}
                        />
                    )}
                />

                <Controller
                    name="operating_locations"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <Autocomplete
                            multiple
                            options={OPERATING_LOCATIONS}
                            value={Array.isArray(value) ? value : []}
                            onChange={(_, newValue) => onChange(newValue)}
                            renderTags={(value: readonly string[], getTagProps) =>
                                value.map((option: string, index: number) => (
                                    <Chip variant="outlined" label={option} {...getTagProps({ index })} key={option} />
                                ))
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Operating Locations"
                                    error={!!errors.operating_locations}
                                    helperText={errors.operating_locations?.message as string}
                                />
                            )}
                        />
                    )}
                />

                <Box>
                    <Typography variant="subtitle2" mb={1}>Store Logo</Typography>
                    <ImageUpload
                        maxImages={1}
                        onUploadComplete={(urls) => setValue("logo_url", urls[0] || "")}
                        existingUrls={watch("logo_url") ? [watch("logo_url")] : []}
                        label=""
                    />
                </Box>

                <Box>
                    <Typography variant="subtitle2" mb={1}>Store Banner</Typography>
                    <ImageUpload
                        maxImages={1}
                        onUploadComplete={(urls) => setValue("banner_url", urls[0] || "")}
                        existingUrls={watch("banner_url") ? [watch("banner_url")] : []}
                        label=""
                    />
                </Box>

                <Typography variant="subtitle1" mt={2} fontWeight="bold">Contact Information</Typography>

                <Box>
                    <Typography variant="subtitle2" gutterBottom>Contact Preferences *</Typography>
                    <Controller
                        name="contact_preferences"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <FormGroup row>
                                {[
                                    "show_phone",
                                    "show_whatsapp",
                                    "allow_calls",
                                    "allow_chat",
                                    "enquiry_only"
                                ].map((pref) => (
                                    <FormControlLabel
                                        key={pref}
                                        control={
                                            <Checkbox
                                                checked={(value as string[])?.includes(pref) || false}
                                                onChange={(e) => {
                                                    const current = (value as string[]) || [];
                                                    if (e.target.checked) {
                                                        onChange([...current, pref]);
                                                    } else {
                                                        onChange(current.filter((v: string) => v !== pref));
                                                    }
                                                }}
                                            />
                                        }
                                        label={t(pref as any) || pref}
                                    />
                                ))}
                            </FormGroup>
                        )}
                    />
                    {errors.contact_preferences && <Typography color="error" variant="caption">{errors.contact_preferences.message as string}</Typography>}
                </Box>


                <Input name="primary_mobile" control={control} label="Primary Mobile" />
                <Input name="contact_email" control={control} label="Public Email" />
                <Input name="contact_phone" control={control} label="Public Phone (Optional)" />
                <Input name="address" control={control} label="Store Address" />
                <Box display="flex" gap={2}>
                    <Input name="city" control={control} label="City" />
                    <Input name="state" control={control} label="State" />
                </Box>
            </Box>

            <Box mt={3} display="flex" justifyContent="space-between">
                <Button variant="outlined" onClick={onBack}>Back</Button>
                <Button type="submit" isLoading={updateStore.isPending}>Finish & Go to Dashboard</Button>
            </Box>
        </Box>
    );
};

export default StoreStep;
