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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Close, Send } from "@mui/icons-material";
import { COLORS } from "@/constants/colors";
import { supplierQuotationServices } from "@/services/supplierQuotation/supplierQuotation.services";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState({
    customer_name: "",
    email: "",
    phone_number: "",
    quantity: "",
    details: "",
    country_Code: "+91",
  });

  const countryCodes = [
    { code: "+91", country: "India", flag: "🇮🇳" },
    { code: "+1", country: "USA", flag: "��🇸" },
    { code: "+44", country: "UK", flag: "🇬🇧" },
    { code: "+971", country: "UAE", flag: "🇦🇪" },
    { code: "+65", country: "Singapore", flag: "🇸🇬" },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const validateForm = (): boolean => {
    if (!formData.customer_name.trim()) {
      setError("Name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!formData.phone_number.trim()) {
      setError("Phone number is required");
      return false;
    }
    if (formData.phone_number.replace(/\D/g, "").length < 7) {
      setError("Please enter a valid phone number");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError("");

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Log data to console for verification
      console.log("Supplier Inquiry Submitted:", {
        ...formData,
        productName,
        supplierName,
      });

      // Show success feedback
      alert(
        `Thank you ${formData.customer_name}! Your inquiry for ${productName} has been sent to ${supplierName}.`,
      );

      // Reset form
      setFormData({
        customer_name: "",
        email: "",
        phone_number: "",
        quantity: "",
        details: "",
        country_Code: "+91",
      });
      await supplierQuotationServices.createSupplierQuotation({
        phone_number: formData.phone_number,
        customer_name: formData.customer_name,
        email: formData.email,
        quantity: Number(formData.quantity) || 0,
        details: formData.details,
        country_code: formData.country_Code,
        supplier_id: supplierId || "",
        product_id: productId || "",
      });
      onClose();
    } catch (error: any) {
      console.error("Error submitting inquiry:", error);
      setError(
        error.message || "Failed to send inquiry. Please try again later.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
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
                sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}
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

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography
              variant="body2"
              sx={{
                mb: 1,
                fontWeight: 500,
                fontSize: { lg: "0.875rem", xl: "1rem" },
              }}
            >
              Your Name *
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Enter your name"
              value={formData.customer_name}
              onChange={(e) =>
                handleInputChange("customer_name", e.target.value)
              }
              sx={{
                borderRadius: "12px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography
              variant="body2"
              sx={{
                mb: 1,
                fontWeight: 500,
                fontSize: { lg: "0.875rem", xl: "1rem" },
              }}
            >
              Email Address *
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              sx={{
                borderRadius: "12px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography
              variant="body2"
              sx={{
                mb: 1,
                fontWeight: 500,
                fontSize: { lg: "0.875rem", xl: "1rem" },
              }}
            >
              Mobile Number *
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Box sx={{ width: { sm: "80px", lg: "100px" } }}>
                <FormControl size="small" fullWidth>
                  <Select
                    value={formData.country_Code}
                    onChange={(e) =>
                      handleInputChange("country_Code", e.target.value)
                    }
                    sx={{
                      borderRadius: "12px",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                      },
                    }}
                  >
                    {countryCodes.map((country) => (
                      <MenuItem key={country.code} value={country.code}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Typography sx={{ fontSize: "0.9rem" }}>
                            {country.flag}
                          </Typography>
                          <Typography sx={{ fontSize: "0.7rem" }}>
                            {country.code}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Enter phone number"
                  value={formData.phone_number}
                  onChange={(e) =>
                    handleInputChange(
                      "phone_number",
                      e.target.value.replace(/\D/g, ""),
                    )
                  }
                  inputProps={{
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                  }}
                  sx={{
                    borderRadius: "12px",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </Box>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography
              variant="body2"
              sx={{
                mb: 1,
                fontWeight: 500,
                fontSize: { lg: "0.875rem", xl: "1rem" },
              }}
            >
              Quantity
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="e.g. 100 Pieces"
              value={formData.quantity}
              onChange={(e) => handleInputChange("quantity", e.target.value)}
              sx={{
                borderRadius: "12px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              }}
            />
          </Grid>
          <Grid size={12}>
            <Typography
              variant="body2"
              sx={{
                mb: 1,
                fontWeight: 500,
                fontSize: { lg: "0.875rem", xl: "1rem" },
              }}
            >
              Requirement Details
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Describe your requirement in detail..."
              size="small"
              value={formData.details}
              onChange={(e) => handleInputChange("details", e.target.value)}
              sx={{
                borderRadius: "12px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              }}
            />
          </Grid>
        </Grid>

        {error && (
          <Typography
            variant="body2"
            color="error"
            sx={{ mt: 2, textAlign: "center" }}
          >
            {error}
          </Typography>
        )}

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
          onClick={handleSubmit}
          startIcon={<Send />}
          disabled={loading}
          sx={{
            bgcolor: COLORS.PRIMARY_PURPLE,
            py: 1.5,
            fontSize: "1rem",
            borderRadius: "50px",
            "&:hover": {
              bgcolor: COLORS.PRIMARY_PURPLE,
              opacity: 0.9,
            },
            "&:disabled": {
              bgcolor: "text.secondary",
            },
          }}
        >
          {loading ? "Sending..." : "Send Inquiry Now"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InquiryModal;
