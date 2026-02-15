"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Typography,
    Box,
    IconButton,
    Grid,
} from "@mui/material";
import { Close, Send } from "@mui/icons-material";
import { COLORS } from "@/constants/colors";

interface InquiryModalProps {
    open: boolean;
    onClose: () => void;
    productName?: string;
    supplierName?: string;
    productImage?: string;
    productPrice?: string;
}

const InquiryModal: React.FC<InquiryModalProps> = ({
    open,
    onClose,
    productName,
    supplierName,
    productImage,
    productPrice,
}) => {
    const [form, setForm] = useState({
        name: "",
        mobile: "",
        quantity: "",
        details: "",
    });

    const handleSubmit = () => {
        // In a real app, this would send data to backend
        console.log("Lead Submitted:", { ...form, productName, supplierName });

        // Show success feedback (mock)
        alert(`Thank you ${form.name}! Your inquiry for ${productName} has been sent to ${supplierName}.`);

        setForm({ name: "", mobile: "", quantity: "", details: "" });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: COLORS.PRIMARY_PURPLE, color: "white", py: 1.5 }}>
                <Typography variant="h6" fontWeight={700}>
                    Get Best Price
                </Typography>
                <IconButton onClick={onClose} size="small" sx={{ color: "white" }}>
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ mt: 2, pb: 2 }}>
                {productName && (
                    <Box
                        sx={{
                            mb: 3,
                            p: 1.5,
                            bgcolor: "rgba(94, 24, 233, 0.04)",
                            borderRadius: 2,
                            border: `1px solid rgba(94, 24, 233, 0.1)`,
                            display: 'flex',
                            gap: 2,
                            alignItems: 'center'
                        }}
                    >
                        {productImage && (
                            <Box
                                component="img"
                                src={productImage}
                                alt={productName}
                                sx={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: 1,
                                    objectFit: 'cover',
                                    border: '1px solid #eee',
                                    bgcolor: 'white'
                                }}
                            />
                        )}
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.2 }}>I AM INTERESTED IN:</Typography>
                            <Typography variant="subtitle1" fontWeight={800} sx={{ color: '#1a1a2e', lineHeight: 1.2 }}>{productName}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                {productPrice && <Typography variant="body2" fontWeight={800} color={COLORS.PRIMARY_PURPLE}>{productPrice}</Typography>}
                                {supplierName && <Typography variant="caption" sx={{ color: 'text.secondary', bgcolor: 'rgba(0,0,0,0.05)', px: 0.8, borderRadius: 1 }}>{supplierName}</Typography>}
                            </Box>
                        </Box>
                    </Box>
                )}

                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Mobile Number *"
                            value={form.mobile}
                            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                            size="small"
                            InputProps={{
                                startAdornment: <Typography color="text.secondary" sx={{ mr: 1 }}>+91</Typography>
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Your Name *"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            size="small"
                        />
                    </Grid>
                    <Grid size={12}>
                        <TextField
                            fullWidth
                            label="Quantity"
                            placeholder="e.g. 100 Pieces"
                            value={form.quantity}
                            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                            size="small"
                        />
                    </Grid>
                    <Grid size={12}>
                        <TextField
                            fullWidth
                            label="Requirement Details"
                            multiline
                            rows={3}
                            placeholder="Describe your requirement in detail..."
                            value={form.details}
                            onChange={(e) => setForm({ ...form, details: e.target.value })}
                            size="small"
                        />
                    </Grid>
                </Grid>

                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2, textAlign: "center" }}>
                    By clicking "Send Inquiry", you agree to our Terms & Conditions.
                </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 2, borderTop: "1px solid #f0f0f0" }}>
                <Button
                    fullWidth
                    variant="contained"
                    onClick={handleSubmit}
                    startIcon={<Send />}
                    sx={{ bgcolor: COLORS.PRIMARY_PURPLE, py: 1.5, fontSize: "1rem" }}
                >
                    Send Inquiry Now
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default InquiryModal;
