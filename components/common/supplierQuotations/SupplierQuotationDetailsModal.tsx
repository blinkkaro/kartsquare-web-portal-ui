"use client";

import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Divider,
  Avatar,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  AccessTime,
  Person,
  Email,
  Phone,
  Inventory2,
  CalendarToday,
  LocalPostOffice,
} from "@mui/icons-material";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import dayjs from "dayjs";
import { SupplierQuotation } from "@/services/supplierDashboard/supplierDashoard.interface";
import { useMarkQuotationViewed } from "@/hooks/useSupplierQuotations";

interface SupplierQuotationDetailsModalProps {
  open: boolean;
  onClose: () => void;
  enquiry: SupplierQuotation | null;
}

const SupplierQuotationDetailsModal: React.FC<
  SupplierQuotationDetailsModalProps
> = ({ open, onClose, enquiry }) => {
  const { t } = useTranslate();
  const markViewed = useMarkQuotationViewed();

  useEffect(() => {
    if (open && enquiry && !enquiry.is_viewed) {
      markViewed.mutate(enquiry.supplier_quotation_id);
    }
  }, [open]);

  if (!enquiry) return null;

  const DetailItem = ({
    icon,
    label,
    value,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string;
  }) => (
    <Box sx={{ mb: 2.5 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
        {icon}
        <Typography
          variant="caption"
          sx={{
            color: COLORS.TEXT.SECONDARY_LIGHT,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          {label}
        </Typography>
      </Box>
      <Typography variant="body1" sx={{ fontWeight: 600, ml: 3 }}>
        {value}
      </Typography>
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "20px",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2.5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: COLORS.PURPLE_ALPHA_04,
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: COLORS.PRIMARY_PURPLE }}
        >
          {t("enquiry_details")}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
            "&:hover": { color: COLORS.PRIMARY_PURPLE },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 4 }}>
        {/* Product Summary */}
        <Box sx={{ display: "flex", gap: 3, mb: 4, alignItems: "center" }}>
          <Box
            component="img"
            src={enquiry.product_images?.[0] || "/placeholder-service.png"}
            alt={enquiry.product_name}
            sx={{
              width: 100,
              height: 100,
              borderRadius: "16px",
              objectFit: "cover",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              border: `1px solid ${COLORS.BORDER.DEFAULT_LIGHT}`,
            }}
          />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
              {enquiry.product_name}
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontWeight: 800, color: COLORS.PRIMARY_PURPLE }}
            >
              {enquiry.currency} {enquiry.price}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <DetailItem
              icon={
                <Person sx={{ fontSize: 18, color: COLORS.PRIMARY_PURPLE }} />
              }
              label={t("customer_name")}
              value={enquiry.customer_name}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <DetailItem
              icon={
                <Inventory2
                  sx={{ fontSize: 18, color: COLORS.PRIMARY_PURPLE }}
                />
              }
              label={t("quantity")}
              value={enquiry.quantity.toString()}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <DetailItem
              icon={
                <Phone sx={{ fontSize: 18, color: COLORS.PRIMARY_PURPLE }} />
              }
              label={t("phoneNumber")}
              value={enquiry.phone_number}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <DetailItem
              icon={
                <Email sx={{ fontSize: 18, color: COLORS.PRIMARY_PURPLE }} />
              }
              label={t("email")}
              value={enquiry.email}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <DetailItem
              icon={
                <CalendarToday
                  sx={{ fontSize: 18, color: COLORS.PRIMARY_PURPLE }}
                />
              }
              label={t("date")}
              value={dayjs(enquiry.created_at).format("MMM DD, YYYY")}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <DetailItem
              icon={
                <AccessTime
                  sx={{ fontSize: 18, color: COLORS.PRIMARY_PURPLE }}
                />
              }
              label={t("time")}
              value={dayjs(enquiry.created_at).format("HH:mm A")}
            />
          </Grid>
        </Grid>

        {enquiry.details && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <LocalPostOffice
                sx={{ fontSize: 18, color: COLORS.PRIMARY_PURPLE }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: COLORS.TEXT.SECONDARY_LIGHT,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {t("message")}
              </Typography>
            </Box>
            <Typography
              variant="body1"
              sx={{
                p: 2.5,
                bgcolor: "rgba(0, 0, 0, 0.03)",
                borderRadius: "12px",
                whiteSpace: "pre-wrap",
                minHeight: "80px",
                fontStyle: "italic",
                color: COLORS.TEXT.PRIMARY_LIGHT,
                border: "1px solid rgba(0, 0, 0, 0.05)",
              }}
            >
              "{enquiry.details}"
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: "rgba(0, 0, 0, 0.02)" }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: "10px",
            px: 4,
            textTransform: "none",
            fontWeight: 600,
            borderColor: COLORS.BORDER.DEFAULT_LIGHT,
            color: COLORS.TEXT.SECONDARY_LIGHT,
          }}
        >
          {t("close")}
        </Button>
        <Button
          variant="contained"
          sx={{
            bgcolor: COLORS.PRIMARY_PURPLE,
            "&:hover": { bgcolor: COLORS.PRIMARY_PURPLE, opacity: 0.9 },
            borderRadius: "10px",
            px: 4,
            textTransform: "none",
            fontWeight: 600,
          }}
          onClick={() => {
            window.open(
              `https://wa.me/${enquiry.country_code}${enquiry.phone_number.replace(/\D/g, "")}`,
              "_blank",
            );
          }}
        >
          {t("respond")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SupplierQuotationDetailsModal;
