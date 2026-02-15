"use client";
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
    Box,
    Typography,
    Autocomplete,
    TextField,
    Grid,
    useTheme,
    Paper,
    InputAdornment,
    MenuItem,
    CircularProgress
} from "@mui/material";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import ImageUpload from "@/components/common/ImageUpload";
import { useTranslate } from "@/hooks/useTranslate";
import { useSupplierKyc, useUpdateSupplierKyc } from "@/hooks/useSupplier";
import { ID_PROOF_TYPES } from "@/constants/common";
import { COLORS } from "@/constants/colors";
import { useRouter } from "next/navigation";
import { verifyDocumentService } from "@/services/auth/verifyDocument.service";
import { countries } from "@/components/pages/SignUp/components/data";

import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";

interface KycStepProps {
    onBack: () => void;
}

const KycStep: React.FC<KycStepProps> = ({ onBack }) => {
    const { t } = useTranslate();
    const router = useRouter();
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const { data: kycData, isLoading: isLoadingKyc } = useSupplierKyc();
    const updateKyc = useUpdateSupplierKyc();
    const [isUploading, setIsUploading] = React.useState(false);

    const schema = yup.object().shape({
        // GST Fields (Optional)
        gst_in: yup.string().optional(),
        gst_state: yup.string().optional(),
        gst_certificate_url: yup.string().optional(),

        // PAN & Identity (Required)
        pan_number: yup.string()
            .required("PAN number is required")
            .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN card format (e.g. ABCDE1234F)"),
        pan_card_url: yup.string().required("PAN card image is required"),
        id_proof_type: yup.string().required("ID Proof type is required"),
        id_proof_url: yup.string().required("ID proof image is required"),
        address_proof_url: yup.string().required("Address proof image is required"),

        // Owner Details (Required)
        owner_name: yup.string().required("Owner name is required"),
        owner_country_code: yup.string().required("Country code is required"),
        owner_mobile: yup.string()
            .required("Owner mobile is required")
            .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits"),
        owner_email: yup.string().email("Invalid email").required("Owner email is required"),
    });

    const { control, handleSubmit, reset, setValue, watch, setError, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            id_proof_type: "",
            owner_country_code: "+91",
        }
    });

    const selectedCountryCode = watch("owner_country_code");
    const selectedCountry = countries.find((c) => c.phone_code === selectedCountryCode);

    useEffect(() => {
        if (kycData?.data) {
            const data = { ...kycData.data } as any;

            // Remove null values
            Object.keys(data).forEach(key => {
                if (data[key] === null) {
                    delete data[key];
                }
            });

            // Map backend keys if different
            const formData = {
                ...data,
                gst_in: data.gst_in || data.gst_number || "",
                owner_country_code: data.owner_country_code
                    ? (data.owner_country_code.startsWith("+") ? data.owner_country_code : `+${data.owner_country_code}`)
                    : "+91",
            };

            reset(formData);
        }
    }, [kycData, reset]);

    const handleImageChange = async (files: (File | string)[], field: string) => {
        const newFile = files.find(f => typeof f !== 'string') as File | undefined;
        if (!newFile) {
            const currentString = files.find(f => typeof f === 'string') as string | undefined;
            setValue(field as any, currentString || "", { shouldValidate: true });
            return;
        }

        try {
            setIsUploading(true);
            const urls = await verifyDocumentService.uploadImages([newFile]);
            if (urls && urls[0]) {
                setValue(field as any, urls[0], { shouldValidate: true });
            }
        } catch (error) {
            console.error("Image upload failed", error);
        } finally {
            setIsUploading(false);
        }
    };

    const onSubmit = async (values: any) => {
        try {
            const payload = { ...values } as any;

            // Clean empty strings
            Object.keys(payload).forEach(key => {
                if (payload[key] === "" || payload[key] === null) {
                    delete payload[key];
                }
            });

            await updateKyc.mutateAsync(payload);
            router.push("/");
        } catch (error: any) {
            console.error("Failed to update KYC", error);
            if (error?.response?.data?.errors) {
                error.response.data.errors.forEach((err: any) => {
                    setError(err.field as any, { type: "server", message: err.message });
                });
            }
        }
    };

    if (isLoadingKyc) return (
        <Box display="flex" justifyContent="center" py={10}>
            <CircularProgress />
        </Box>
    );

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ pb: 4 }}>
            <Paper elevation={0} sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 4,
                border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT}`,
                bgcolor: isDark ? "background.paper" : "white",
                boxShadow: isDark ? "none" : "0 8px 32px rgba(94, 24, 233, 0.04)"
            }}>
                <Typography variant="h5" fontWeight="700" mb={4} sx={{ color: COLORS.PRIMARY_PURPLE }}>
                    KYC Verification
                </Typography>

                <Grid container spacing={4}>
                    {/* GST & Tax Section */}
                    <Grid size={{ xs: 12 }}>
                        <Typography variant="subtitle1" fontWeight="600" mb={2} mt={1} display="flex" alignItems="center" gap={1}>
                            <BusinessOutlinedIcon fontSize="small" color="primary" /> Business Tax Details
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="body2" fontWeight="500" mb={1}>GST Number (Optional)</Typography>
                        <Input name="gst_in" control={control} placeholder="Enter GSTIN Number" startIcon={<DescriptionOutlinedIcon fontSize="small" />} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="body2" fontWeight="500" mb={1}>GST State (Optional)</Typography>
                        <Input name="gst_state" control={control} placeholder="Enter Registered State" />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="body2" fontWeight="500" mb={1}>PAN Card Number*</Typography>
                        <Input name="pan_number" control={control} placeholder="ABCDE1234F" startIcon={<BadgeOutlinedIcon fontSize="small" />} />
                    </Grid>

                    {/* Owner Info Section */}
                    <Grid size={{ xs: 12 }}>
                        <Typography variant="subtitle1" fontWeight="600" mb={2} mt={3} display="flex" alignItems="center" gap={1}>
                            <PersonOutlineOutlinedIcon fontSize="small" color="primary" /> Owner Information
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Typography variant="body2" fontWeight="500" mb={1}>Owner Name*</Typography>
                                <Input name="owner_name" control={control} placeholder="Full Legal Name" startIcon={<PersonOutlineOutlinedIcon fontSize="small" />} />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Typography variant="body2" fontWeight="500" mb={1}>Owner Email*</Typography>
                                <Input name="owner_email" control={control} placeholder="owner@business.com" startIcon={<EmailOutlinedIcon fontSize="small" />} />
                            </Grid>
                            <Grid size={{ xs: 12, md: 7 }}>
                                <Typography variant="body2" fontWeight="500" mb={1}>Owner Mobile*</Typography>
                                <Box sx={{ display: "flex", gap: 1.5 }}>
                                    <Box sx={{ width: { xs: "85px", md: "95px" } }}>
                                        <Input
                                            name="owner_country_code"
                                            control={control}
                                            select
                                            sx={{ height: 48 }}
                                            InputProps={{
                                                sx: { borderRadius: "12px", height: 48 },
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
                                    <Box sx={{ flex: 1 }}>
                                        <Input
                                            name="owner_mobile"
                                            control={control}
                                            placeholder="91234 56789"
                                            startIcon={<PhoneOutlinedIcon fontSize="small" />}
                                            type="tel"
                                            sx={{ height: 48 }}
                                        />
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Documents Upload Section */}
                    <Grid size={{ xs: 12 }}>
                        <Typography variant="subtitle1" fontWeight="600" mb={2} mt={3} display="flex" alignItems="center" gap={1}>
                            <DescriptionOutlinedIcon fontSize="small" color="primary" /> Required Documents
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <ImageUpload
                            title="GST Certificate (Optional)"
                            images={watch("gst_certificate_url") ? [watch("gst_certificate_url") as string] : []}
                            onChange={(files) => handleImageChange(files, "gst_certificate_url")}
                            maxImages={1}
                            error={!!errors.gst_certificate_url}
                            helperText={errors.gst_certificate_url?.message as string}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <ImageUpload
                            title="PAN Card Image*"
                            images={watch("pan_card_url") ? [watch("pan_card_url") as string] : []}
                            onChange={(files) => handleImageChange(files, "pan_card_url")}
                            maxImages={1}
                            error={!!errors.pan_card_url}
                            helperText={errors.pan_card_url?.message as string}
                        />
                    </Grid>

                    {/* Identity Verification Section */}
                    <Grid size={{ xs: 12 }}>
                        <Typography variant="subtitle1" fontWeight="600" mb={2} mt={3} display="flex" alignItems="center" gap={1}>
                            <BadgeOutlinedIcon fontSize="small" color="primary" /> Identity Verification
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="body2" fontWeight="500" mb={1}>Select ID Proof Type*</Typography>
                        <Controller
                            name="id_proof_type"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <Autocomplete
                                    options={ID_PROOF_TYPES}
                                    value={value || ""}
                                    onChange={(_, newValue) => onChange(newValue)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="Choose Document Type"
                                            error={!!errors.id_proof_type}
                                            helperText={errors.id_proof_type?.message as string}
                                            InputProps={{
                                                ...params.InputProps,
                                                sx: { borderRadius: "12px" }
                                            }}
                                        />
                                    )}
                                />
                            )}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <ImageUpload
                            title="ID Proof Image*"
                            images={watch("id_proof_url") ? [watch("id_proof_url") as string] : []}
                            onChange={(files) => handleImageChange(files, "id_proof_url")}
                            maxImages={1}
                            error={!!errors.id_proof_url}
                            helperText={errors.id_proof_url?.message as string}
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <ImageUpload
                            title="Address Proof Image*"
                            images={watch("address_proof_url") ? [watch("address_proof_url") as string] : []}
                            onChange={(files) => handleImageChange(files, "address_proof_url")}
                            maxImages={1}
                            error={!!errors.address_proof_url}
                            helperText={errors.address_proof_url?.message as string}
                        />
                    </Grid>
                </Grid>

                <Box mt={10} display="flex" justifyContent="space-between" alignItems="center">
                    <Button variant="outlined" onClick={onBack} sx={{ borderRadius: '50px', px: 4, height: 48 }}>
                        {t("goBack" as any)}
                    </Button>
                    <Button
                        type="submit"
                        isLoading={updateKyc.isPending || isUploading}
                        variant="contained"
                        size="large"
                        sx={{
                            borderRadius: '50px',
                            px: 10,
                            height: 56,
                            boxShadow: isDark ? 'none' : `0 10px 25px ${COLORS.PRIMARY_PURPLE}40`,
                            '&:hover': {
                                boxShadow: isDark ? 'none' : `0 15px 35px ${COLORS.PRIMARY_PURPLE}60`,
                                transform: 'translateY(-2px)'
                            },
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                    >
                        Complete Registration
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default KycStep;
