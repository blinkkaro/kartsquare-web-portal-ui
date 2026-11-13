"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Box,
    Typography,
    Grid,
    Paper,
    Divider,
    IconButton,
    Chip,
    Stack,
    alpha,
    useTheme,
    Breadcrumbs,
    Link
} from "@mui/material";
import LogoLoader from "@/components/common/Loader/LogoLoader";
import {
    ArrowBack,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Verified as VerifiedIcon,
    LocalShipping,
    AccountBalance,
    InfoOutlined
} from "@mui/icons-material";
import { useSupplierProduct, useDeleteProduct } from "@/hooks/useSupplier";
import { useTranslate } from "@/hooks/useTranslate";
import Button from "@/components/common/Button";
import { COLORS } from "@/constants/colors";
import { motion } from "framer-motion";
import NextLink from "next/link";

export default function ProductDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { t } = useTranslate();
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const id = params.id as string;

    const { data, isLoading } = useSupplierProduct(id);
    const deleteProduct = useDeleteProduct();

    if (isLoading) return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <LogoLoader />
        </Box>
    );

    const product = data?.data as any;
    if (!product) return <Typography>Product not found.</Typography>;

    const images = product.product_images || [];
    const mainImage = images.length > 0 ? images[0] : "https://via.placeholder.com/600";
    const supplier = product.supplier || {};

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            await deleteProduct.mutateAsync(id);
            router.push("/supplier/products");
        }
    };

    return (
        <Box sx={{ pb: 10 }}>
            {/* Navigation & Breadcrumbs */}
            <Box sx={{ mb: 4 }}>
                <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
                    <Link underline="hover" color="inherit" component={NextLink} href="/supplier/products">
                        Products
                    </Link>
                    <Typography color="text.primary">{product.product_name}</Typography>
                </Breadcrumbs>

                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Button
                        variant="text"
                        startIcon={<ArrowBack />}
                        onClick={() => router.back()}
                        sx={{ color: 'text.secondary' }}
                    >
                        Back to List
                    </Button>

                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="outlined"
                            startIcon={<EditIcon />}
                            onClick={() => router.push(`/supplier/products/edit/${id}`)}
                            sx={{ borderRadius: 2 }}
                        >
                            Edit Product
                        </Button>
                        <Button
                            color="error"
                            variant="outlined"
                            startIcon={<DeleteIcon />}
                            onClick={handleDelete}
                            sx={{ borderRadius: 2 }}
                            isLoading={deleteProduct.isPending}
                        >
                            Delete
                        </Button>
                    </Stack>
                </Box>
            </Box>

            <Grid container spacing={5}>
                {/* Left Side: Images */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                borderRadius: 6,
                                overflow: 'hidden',
                                border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT}`,
                                bgcolor: isDark ? alpha(COLORS.BACKGROUND.SECONDARY_DARK, 0.4) : 'white',
                                p: 2
                            }}
                        >
                            <Box
                                component="img"
                                src={mainImage}
                                alt={product.product_name}
                                sx={{
                                    width: '100%',
                                    height: 'auto',
                                    borderRadius: 4,
                                    maxHeight: 500,
                                    objectFit: 'contain'
                                }}
                            />

                            {/* Thumbnails if multiple images (placeholder) */}
                            {images.length > 1 && (
                                <Stack direction="row" spacing={2} sx={{ mt: 2, overflowX: 'auto', pb: 1 }}>
                                    {images.map((img: string, idx: number) => (
                                        <Box
                                            key={idx}
                                            component="img"
                                            src={img}
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                borderRadius: 2,
                                                cursor: 'pointer',
                                                border: idx === 0 ? `2px solid ${COLORS.PRIMARY_PURPLE}` : 'none'
                                            }}
                                        />
                                    ))}
                                </Stack>
                            )}
                        </Paper>
                    </motion.div>
                </Grid>

                {/* Right Side: Details */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Box>
                        {/* Status Badges */}
                        <Stack direction="row" spacing={1} mb={2}>
                            <Chip
                                label={product.is_available ? "Active" : "Inactive"}
                                sx={{
                                    bgcolor: product.is_available ? `${COLORS.SUCCESS_GREEN}15` : 'rgba(0,0,0,0.05)',
                                    color: product.is_available ? COLORS.SUCCESS_GREEN : 'text.secondary',
                                    fontWeight: 700,
                                    borderRadius: '8px'
                                }}
                            />
                            {product.is_returnable && (
                                <Chip label="Returnable" variant="outlined" size="small" sx={{ borderRadius: '8px' }} />
                            )}
                            <Chip label={product.product_origin || "Global"} variant="outlined" size="small" sx={{ borderRadius: '8px' }} />
                        </Stack>

                        <Typography variant="h3" fontWeight="800" gutterBottom sx={{ color: isDark ? 'white' : COLORS.DARK }}>
                            {product.product_name}
                        </Typography>

                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            SKU: {product.sku_number}
                        </Typography>

                        <Box sx={{ my: 3, display: 'flex', alignItems: 'baseline', gap: 1 }}>
                            <Typography variant="h2" fontWeight="900" sx={{ color: COLORS.PRIMARY_PURPLE }}>
                                {product.currency === "USD" ? "$" : "₹"}{product.price}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                + Taxes & Shipping
                            </Typography>
                        </Box>

                        <Divider sx={{ my: 4 }} />

                        <Box mb={4}>
                            <Typography variant="h6" fontWeight="700" gutterBottom>
                                Description
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                                {product.product_description}
                            </Typography>
                        </Box>

                        {/* Specifications Placeholder */}
                        {product.specifications ? (
                            <Box mb={4}>
                                <Typography variant="h6" fontWeight="700" gutterBottom>
                                    Technical Specifications
                                </Typography>
                                <Grid container spacing={2}>
                                    {Object.entries(product.specifications).map(([key, value]: any) => (
                                        <Grid size={{ xs: 6 }} key={key}>
                                            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                                                {key.replace('_', ' ')}
                                            </Typography>
                                            <Typography variant="body2" fontWeight="600">
                                                {value}
                                            </Typography>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        ) : (
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 3,
                                    bgcolor: isDark ? 'rgba(255,255,255,0.02)' : COLORS.BACKGROUND.SECONDARY_LIGHT,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    border: `1px dashed ${theme.palette.divider}`
                                }}
                            >
                                <InfoOutlined sx={{ color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                    No technical specifications provided for this product.
                                </Typography>
                            </Box>
                        )}

                        {/* Supplier Info Section */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                mt: 5,
                                borderRadius: 4,
                                bgcolor: isDark ? alpha(COLORS.PRIMARY_PURPLE, 0.1) : `${COLORS.PRIMARY_PURPLE}08`,
                                border: `1px solid ${alpha(COLORS.PRIMARY_PURPLE, 0.1)}`
                            }}
                        >
                            <Typography variant="subtitle2" color="primary" fontWeight="700" gutterBottom sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                                Supplier Details
                            </Typography>
                            <Box display="flex" alignItems="center" gap={2} mt={2}>
                                <Box
                                    component="img"
                                    src={supplier.logo_url}
                                    sx={{ width: 50, height: 50, borderRadius: '50%', bgcolor: 'white', objectFit: 'contain', border: '1px solid #eee' }}
                                />
                                <Box>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Typography variant="h6" fontWeight="700">
                                            {supplier.store_name}
                                        </Typography>
                                        {supplier.is_verified && <VerifiedIcon sx={{ color: COLORS.PRIMARY_BLUE, fontSize: 20 }} />}
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                        GSTIN: {supplier.gst_in}
                                    </Typography>
                                </Box>
                                <Box sx={{ ml: 'auto' }}>
                                    <Chip
                                        label="Trusted Business"
                                        size="small"
                                        sx={{ bgcolor: COLORS.SUCCESS_GREEN, color: 'white', fontWeight: 700 }}
                                    />
                                </Box>
                            </Box>
                        </Paper>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}
