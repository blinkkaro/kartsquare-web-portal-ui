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
}

const InquiryModal: React.FC<InquiryModalProps> = ({
    open,
    onClose,
    productName,
    supplierName,
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
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: COLORS.PRIMARY_PURPLE, color: "white" }}>
                <Typography variant="h6" fontWeight={600}>
                    Get Best Price
                </Typography>
                <IconButton onClick={onClose} sx={{ color: "white" }}>
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
                {productName && (
                    <Box sx={{ mb: 3, p: 2, bgcolor: "#f5f5f5", borderRadius: 1, borderLeft: `4px solid ${COLORS.PRIMARY_PURPLE}` }}>
                        <Typography variant="subtitle2" color="text.secondary">I am interested in:</Typography>
                        <Typography variant="h6" fontWeight={600}>{productName}</Typography>
                        {supplierName && <Typography variant="caption">Sold by: {supplierName}</Typography>}
                    </Box>
                )}

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
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
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Your Name *"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Quantity"
                            placeholder="e.g. 100 Pieces"
                            value={form.quantity}
                            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12}>
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
