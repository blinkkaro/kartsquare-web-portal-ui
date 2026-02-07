"use client";
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Box, Typography, Autocomplete, TextField, Grid } from "@mui/material";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import ImageUpload from "@/components/ImageUpload";
import { useTranslate } from "@/hooks/useTranslate";
import { useSupplierKyc, useUpdateSupplierKyc } from "@/hooks/useSupplier";
import { ID_PROOF_TYPES } from "@/constants/common";

interface KycStepProps {
    onNext: () => void;
    onBack: () => void;
}

const KycStep: React.FC<KycStepProps> = ({ onNext, onBack }) => {
    const { t } = useTranslate();
    const { data: kycData, isLoading: isLoadingKyc } = useSupplierKyc();
    const updateKyc = useUpdateSupplierKyc();

    const schema = yup.object().shape({
        gst_number: yup.string().required("GST number is required"),
        gst_state: yup.string().required("GST state is required"),
        pan_number: yup.string().required("PAN number is required"),

        owner_name: yup.string().required("Owner name is required"),
        owner_mobile: yup.string().required("Owner mobile is required"),
        owner_email: yup.string().email("Invalid email").required("Owner email is required"),

        bank_account_number: yup.string().required("Account number is required"),
        ifsc_code: yup.string().required("IFSC code is required"),
        bank_name: yup.string().required("Bank name is required"),

        gst_certificate_url: yup.string().required("GST certificate is required"),
        pan_card_url: yup.string().required("PAN card image is required"),
        cancelled_cheque_url: yup.string().required("Cancelled cheque image is required"),

        id_proof_type: yup.string().required("ID Proof type is required"),
        id_proof_url: yup.string().required("ID proof image is required"),
        address_proof_url: yup.string().required("Address proof image is required"),
    });

    const { control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        if (kycData?.data) {
            const cleanData = { ...kycData.data } as any;
            Object.keys(cleanData).forEach(key => {
                if (cleanData[key] === null) {
                    delete cleanData[key];
                }
            });
            reset(cleanData);
        }
    }, [kycData, reset]);

    const onSubmit = async (values: any) => {
        try {
            const payload = { ...values } as any;
            Object.keys(payload).forEach(key => {
                if (payload[key] === "" || payload[key] === null) {
                    delete payload[key];
                }
            });
            await updateKyc.mutateAsync(payload);
            onNext();
        } catch (error) {
            console.error("Failed to update KYC", error);
        }
    };

    if (isLoadingKyc) return <Typography>Loading KYC data...</Typography>;

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="h6" mb={2}>KYC Verification</Typography>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle1" fontWeight="bold">Business Info</Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Input name="gst_number" control={control} label="GST Number" placeholder="22AAAAA0000A1Z5" />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Input name="gst_state" control={control} label="GST State" placeholder="Maharashtra" />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Input name="pan_number" control={control} label="PAN Number" placeholder="ABCDE1234F" />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle1" fontWeight="bold" mt={1}>Owner Details</Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Input name="owner_name" control={control} label="Owner Name" placeholder="John Doe" />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Input name="owner_mobile" control={control} label="Owner Mobile" placeholder="+91 9876543210" />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Input name="owner_email" control={control} label="Owner Email" placeholder="owner@example.com" />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle1" fontWeight="bold" mt={1}>Documents</Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Box>
                        <Typography variant="subtitle2" mb={1}>GST Certificate *</Typography>
                        <ImageUpload
                            maxImages={1}
                            onUploadComplete={(urls) => setValue("gst_certificate_url", urls[0])}
                            existingUrls={watch("gst_certificate_url") ? [watch("gst_certificate_url") as string] : []}
                            label=""
                        />
                        {errors.gst_certificate_url && <Typography color="error" variant="caption">{errors.gst_certificate_url.message as string}</Typography>}
                    </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Box>
                        <Typography variant="subtitle2" mb={1}>PAN Card *</Typography>
                        <ImageUpload
                            maxImages={1}
                            onUploadComplete={(urls) => setValue("pan_card_url", urls[0])}
                            existingUrls={watch("pan_card_url") ? [watch("pan_card_url") as string] : []}
                            label=""
                        />
                        {errors.pan_card_url && <Typography color="error" variant="caption">{errors.pan_card_url.message as string}</Typography>}
                    </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Box>
                        <Controller
                            name="id_proof_type"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <Autocomplete
                                    options={ID_PROOF_TYPES}
                                    value={value || null}
                                    onChange={(_, newValue) => onChange(newValue)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={t("id_proof_type") || "ID Proof Type"}
                                            error={!!errors.id_proof_type}
                                            helperText={errors.id_proof_type?.message as string}
                                        />
                                    )}
                                />
                            )}
                        />
                    </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Box>
                        <Typography variant="subtitle2" mb={1}>ID Proof *</Typography>
                        <ImageUpload
                            maxImages={1}
                            onUploadComplete={(urls) => setValue("id_proof_url", urls[0])}
                            existingUrls={watch("id_proof_url") ? [watch("id_proof_url") as string] : []}
                            label=""
                        />
                        {errors.id_proof_url && <Typography color="error" variant="caption">{errors.id_proof_url.message as string}</Typography>}
                    </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Box>
                        <Typography variant="subtitle2" mb={1}>Address Proof *</Typography>
                        <ImageUpload
                            maxImages={1}
                            onUploadComplete={(urls) => setValue("address_proof_url", urls[0])}
                            existingUrls={watch("address_proof_url") ? [watch("address_proof_url") as string] : []}
                            label=""
                        />
                        {errors.address_proof_url && <Typography color="error" variant="caption">{errors.address_proof_url.message as string}</Typography>}
                    </Box>
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle1" mt={2} fontWeight="bold">Bank Details</Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Input name="bank_account_number" control={control} label="Account Number" />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Input name="ifsc_code" control={control} label="IFSC Code" />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Input name="bank_name" control={control} label="Bank Name" />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Box>
                        <Typography variant="subtitle2" mb={1}>Cancelled Cheque *</Typography>
                        <ImageUpload
                            maxImages={1}
                            onUploadComplete={(urls) => setValue("cancelled_cheque_url", urls[0])}
                            existingUrls={watch("cancelled_cheque_url") ? [watch("cancelled_cheque_url") as string] : []}
                            label=""
                        />
                        {errors.cancelled_cheque_url && <Typography color="error" variant="caption">{errors.cancelled_cheque_url.message as string}</Typography>}
                    </Box>
                </Grid>
            </Grid>

            <Box mt={3} display="flex" justifyContent="space-between">
                <Button variant="outlined" onClick={onBack}>Back</Button>
                <Button type="submit" isLoading={updateKyc.isPending}>Save & Next</Button>
            </Box>
        </Box>
    );
};

export default KycStep;
