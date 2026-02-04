"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Box, Typography, Grid } from "@mui/material";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import ImageUpload from "@/components/ImageUpload";
import { useRouter, useParams } from "next/navigation";
import { useTranslate } from "@/hooks/useTranslate";
import { useProductDetails, useUpdateProduct } from "@/hooks/useSupplier";

const EditProductPage = () => {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const { t } = useTranslate();

    const { data: productData, isLoading: isLoadingProduct } = useProductDetails(id);
    const updateProductMutation = useUpdateProduct();
    const [error, setError] = useState<string | null>(null);

    const schema = yup.object().shape({
        name: yup.string().required(t("productName") + " is required"),
        price: yup.number().typeError("Price must be a number").required(t("productPrice") + " is required"),
        category: yup.string().required(t("productCategory") + " is required"),
        description: yup.string().required(t("productDescription") + " is required"),
        stock: yup.number().typeError("Stock must be a number").required(t("productStock") + " is required"),
        images: yup.array().of(yup.string()).min(1, "At least one image is required"),
    });

    const { control, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: "",
            price: 0,
            category: "",
            description: "",
            stock: 0,
            images: [],
        },
    });

    useEffect(() => {
        if (productData?.data) {
            // Ideally response structure matches form. If not, map here.
            reset(productData.data);
        }
    }, [productData, reset]);

    const onSubmit = async (data: any) => {
        setError(null);
        try {
            await updateProductMutation.mutateAsync({ id, ...data });
            router.push("/supplier/products");
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || t("something_went_wrong"));
        }
    };

    if (isLoadingProduct) return <Typography>Loading product...</Typography>;

    return (
        <Box>
            <Box display="flex" alignItems="center" mb={4}>
                <Button variant="text" onClick={() => router.back()} sx={{ mr: 2 }}>
                    &larr; {t("cancel")}
                </Button>
                <Typography variant="h4" fontWeight="bold">
                    {t("editProduct")}
                </Typography>
            </Box>

            {error && (
                <Typography color="error" mb={2}>
                    {error}
                </Typography>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Box mb={2}>
                            <Input name="name" control={control} label={t("productName")} placeholder="Product Name" />
                        </Box>
                        <Box mb={2}>
                            <Input name="description" control={control} label={t("productDescription")} multiline rows={4} placeholder="Detailed description..." />
                        </Box>
                        <Box mb={2}>
                            <Typography variant="subtitle2" mb={1}>{t("productImages")}</Typography>
                            <ImageUpload
                                maxImages={5}
                                onUploadComplete={(urls) => setValue("images", urls as any)}
                                existingUrls={watch("images") as string[]}
                                label=""
                            />
                            {errors.images && <Typography color="error" variant="caption">{errors.images.message as string}</Typography>}
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box mb={2}>
                            <Input name="price" control={control} label={t("productPrice")} type="number" placeholder="0.00" />
                        </Box>
                        <Box mb={2}>
                            <Input name="stock" control={control} label={t("productStock")} type="number" placeholder="0" />
                        </Box>
                        <Box mb={2}>
                            <Input name="category" control={control} label={t("productCategory")} placeholder="Electronics, Clothing..." />
                        </Box>

                        <Button fullWidth type="submit" isLoading={updateProductMutation.isPending} size="large" sx={{ mt: 2 }}>
                            {t("save")}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
};

export default EditProductPage;
