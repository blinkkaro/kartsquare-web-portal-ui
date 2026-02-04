"use client";
import React from "react";
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    useMediaQuery,
    useTheme,
    Card,
    CardContent,
    CardActions
} from "@mui/material";
import Button from "@/components/common/Button";
import { useTranslate } from "@/hooks/useTranslate";
import { useSupplierProducts } from "@/hooks/useSupplier";
import { useRouter } from "next/navigation";

export default function SupplierProductsPage() {
    const router = useRouter();
    const { t } = useTranslate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const { data, isLoading } = useSupplierProducts();

    if (isLoading) return <Typography>Loading products...</Typography>;

    // Ensure products is an array
    const products = Array.isArray(data?.data) ? data.data : [];

    const handleAddProduct = () => {
        router.push("/supplier/products/add");
    };

    const handleEditProduct = (id: string) => {
        router.push(`/supplier/products/edit/${id}`);
    };

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4" fontWeight="bold">
                    {t("products") || "Products"}
                </Typography>
                <Button onClick={handleAddProduct}>
                    {t("addProduct") || "Add Product"}
                </Button>
            </Box>

            {products.length === 0 ? (
                <Typography>{t("noProductsFound") || "No products found."}</Typography>
            ) : isMobile ? (
                // Mobile View: Cards
                <Box display="flex" flexDirection="column" gap={2}>
                    {products.map((product: any) => (
                        <Card key={product.id} elevation={2}>
                            <CardContent>
                                <Typography variant="h6">{product.name}</Typography>
                                <Typography color="text.secondary" variant="body2">
                                    {t("productCategory")}: {product.category}
                                </Typography>
                                <Typography variant="body1" fontWeight="bold" mt={1}>
                                    {product.price}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button variant="text" size="small" onClick={() => handleEditProduct(product.id)}>
                                    {t("edit")}
                                </Button>
                            </CardActions>
                        </Card>
                    ))}
                </Box>
            ) : (
                // Desktop View: Table
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>{t("productName")}</TableCell>
                                <TableCell>{t("productPrice")}</TableCell>
                                <TableCell>{t("productCategory")}</TableCell>
                                <TableCell>{t("actions")}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.map((product: any) => (
                                <TableRow key={product.id}>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{product.price}</TableCell>
                                    <TableCell>{product.category}</TableCell>
                                    <TableCell>
                                        <Button variant="text" onClick={() => handleEditProduct(product.id)}>
                                            {t("edit")}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}
