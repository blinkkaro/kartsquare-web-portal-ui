"use client";

import React, { useEffect, useState } from "react";
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
  CircularProgress,
} from "@mui/material";
import { Close, Send, CheckCircleOutline } from "@mui/icons-material";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { COLORS } from "@/constants/colors";
import { supplierService } from "@/services/supplier/supplier.service";
import { CreateSupplierQuotation } from "@/services/supplier/supplier.interface";

interface InquiryModalProps {
  open: boolean;
  onClose: () => void;
  productName?: string;
  supplierName?: string;
  productImage?: string;
  productPrice?: string;
  supplierId?: string;
  productId?: string;
}

const validationSchema = yup.object({
  customer_name: yup.string().required("Name is required"),
  phone_number: yup
    .string()
    .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
    .required("Mobile number is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  quantity: yup
    .number()
    .typeError("Quantity must be a number")
    .positive("Quantity must be positive")
    .integer("Quantity must be an integer")
    .required("Quantity is required"),
  details: yup.string().optional(),
});

type FormData = yup.InferType<typeof validationSchema>;

const InquiryModal: React.FC<InquiryModalProps> = ({
  open,
  onClose,
  productName,
  supplierName,
  productImage,
  productPrice,
  supplierId,
  productId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  useEffect(() => {
    console.log("supplierId", supplierId);
  }, [supplierId]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      customer_name: "",
      phone_number: "",
      email: "",
      quantity: undefined,
      details: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    try {
      const payload: CreateSupplierQuotation = {
        phone_number: data.phone_number,
        customer_name: data.customer_name,
        email: data.email,
        quantity: Number(data.quantity),
        details: data.details || "details",
        country_code: "+91",
        supplier_id: supplierId || "",
        product_id: productId || "",
      };

      await supplierService.createQuotation(payload);

      setShowSuccess(true);
      reset();
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      alert("Failed to send inquiry. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: COLORS.PRIMARY_PURPLE,
            color: "white",
            py: 1.5,
          }}
        >
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
                display: "flex",
                gap: 2,
                alignItems: "center",
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
                    objectFit: "cover",
                    border: "1px solid #eee",
                    bgcolor: "white",
                  }}
                />
              )}
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 600, display: "block", mb: 0.2 }}
                >
                  I AM INTERESTED IN:
                </Typography>
                <Typography
                  variant="subtitle1"
                  fontWeight={800}
                  sx={{ color: "#1a1a2e", lineHeight: 1.2 }}
                >
                  {productName}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mt: 0.5,
                  }}
                >
                  {productPrice && (
                    <Typography
                      variant="body2"
                      fontWeight={800}
                      color={COLORS.PRIMARY_PURPLE}
                    >
                      {productPrice}
                    </Typography>
                  )}
                  {supplierName && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        bgcolor: "rgba(0,0,0,0.05)",
                        px: 0.8,
                        borderRadius: 1,
                      }}
                    >
                      {supplierName}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          )}

          <form id="inquiry-form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Mobile Number *"
                  {...register("phone_number")}
                  error={!!errors.phone_number}
                  helperText={errors.phone_number?.message}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <Typography color="text.secondary" sx={{ mr: 1 }}>
                        +91
                      </Typography>
                    ),
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Your Name *"
                  {...register("customer_name")}
                  error={!!errors.customer_name}
                  helperText={errors.customer_name?.message}
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Email *"
                  {...register("email")}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  size="small"
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Quantity *"
                  placeholder="e.g. 100"
                  {...register("quantity")}
                  error={!!errors.quantity}
                  helperText={errors.quantity?.message}
                  size="small"
                  type="number"
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Requirement Details"
                  multiline
                  rows={3}
                  placeholder="Describe your requirement in detail..."
                  {...register("details")}
                  error={!!errors.details}
                  helperText={errors.details?.message}
                  size="small"
                />
              </Grid>
            </Grid>
          </form>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mt: 2, textAlign: "center" }}
          >
            By clicking "Send Inquiry", you agree to our Terms & Conditions.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: "1px solid #f0f0f0" }}>
          <Button
            fullWidth
            variant="contained"
            type="submit"
            form="inquiry-form"
            disabled={isLoading}
            startIcon={
              isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <Send />
              )
            }
            sx={{ bgcolor: COLORS.PRIMARY_PURPLE, py: 1.5, fontSize: "1rem" }}
          >
            {isLoading ? "Sending..." : "Send Inquiry Now"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showSuccess}
        onClose={handleCloseSuccess}
        maxWidth="xs"
        fullWidth
      >
        <DialogContent sx={{ textAlign: "center", py: 4 }}>
          <CheckCircleOutline sx={{ fontSize: 60, color: "green", mb: 2 }} />
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Inquiry Sent Successfully!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your inquiry has been sent to the supplier. They will contact you
            shortly.
          </Typography>
          <Button
            variant="contained"
            fullWidth
            onClick={handleCloseSuccess}
            sx={{ mt: 3, bgcolor: COLORS.PRIMARY_PURPLE }}
          >
            Okay, Got it
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InquiryModal;
