"use client";

import React, { useState } from "react";
import { Box, Typography, useTheme, Avatar, Divider } from "@mui/material";
import { COLORS } from "@/constants/colors";
import { AccessTime, Email, Phone, ArrowForwardIos } from "@mui/icons-material";
import { useTranslate } from "@/hooks/useTranslate";
import dayjs from "dayjs";
import { SupplierQuotation } from "@/services/supplierDashboard/supplierDashoard.interface";
import SupplierQuotationDetailsModal from "./SupplierQuotationDetailsModal";
import { supplierService } from "@/services/supplier/supplier.service";
import { useQueryClient } from "@tanstack/react-query";

interface SupplierQuotationCardProps {
  enquiry: SupplierQuotation;
  onClick?: (id: string) => void;
}

const SupplierQuotationCard: React.FC<SupplierQuotationCardProps> = ({
  enquiry,
  onClick,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { t } = useTranslate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const handleOpenModal = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
    if (!enquiry.is_viewed) {
      try {
        await supplierService.markQuotationViewed(
          enquiry.supplier_quotation_id,
        );
        queryClient.invalidateQueries({ queryKey: ["supplier-quotations"] });
      } catch (error) {
        console.error("Error marking quotation as viewed", error);
      }
    }
    if (onClick) {
      onClick(enquiry.supplier_quotation_id);
    }
  };

  return (
    <>
      <Box
        sx={{
          bgcolor: isDark
            ? COLORS.BACKGROUND.PRIMARY_DARK
            : COLORS.BACKGROUND.PAPER_LIGHT,
          p: 2.5,
          borderRadius: "20px",
          boxShadow: isDark
            ? "0px 4px 12px rgba(0, 0, 0, 0.3)"
            : "0px 4px 12px rgba(0, 0, 0, 0.05)",
          cursor: "pointer",
          border: `1px solid ${
            isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT
          }`,
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: isDark
              ? "0px 6px 16px rgba(0, 0, 0, 0.4)"
              : "0px 6px 16px rgba(0, 0, 0, 0.08)",
          },
        }}
        onClick={handleOpenModal}
      >
        {/* Header with ID and Date */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: "12px",
              color: COLORS.PRIMARY_PURPLE,
              fontWeight: 600,
              bgcolor: COLORS.PURPLE_ALPHA_10,
              px: 1.5,
              py: 0.5,
              borderRadius: "20px",
            }}
          >
            #{enquiry.supplier_quotation_id}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <AccessTime
              sx={{ fontSize: 14, color: COLORS.TEXT.SECONDARY_LIGHT }}
            />
            <Typography
              sx={{
                fontSize: "12px",
                color: isDark
                  ? COLORS.TEXT.SECONDARY_DARK
                  : COLORS.TEXT.SECONDARY_LIGHT,
                fontWeight: 500,
              }}
            >
              {dayjs(enquiry.created_at).format("MMM DD, YYYY")}
            </Typography>
          </Box>
        </Box>

        {/* Product Info */}
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <Box
            component="img"
            src={enquiry.product_images?.[0] || "/placeholder-service.png"}
            alt={enquiry.product_name}
            sx={{
              width: 70,
              height: 70,
              borderRadius: "12px",
              objectFit: "cover",
              border: `1px solid ${
                isDark
                  ? "rgba(255, 255, 255, 0.08)"
                  : COLORS.BORDER.DEFAULT_LIGHT
              }`,
            }}
          />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 700,
                color: isDark
                  ? COLORS.TEXT.PRIMARY_DARK
                  : COLORS.TEXT.PRIMARY_LIGHT,
                mb: 0.5,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {enquiry.product_name}
            </Typography>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}
            >
              <Typography
                sx={{
                  fontSize: "18px",
                  fontWeight: 800,
                  color: isDark
                    ? COLORS.TEXT.PRIMARY_DARK
                    : COLORS.TEXT.PRIMARY_LIGHT,
                }}
              >
                {enquiry.currency} {enquiry.price}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 1.5, opacity: 0.5 }} />

        {/* Customer Info */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                fontSize: "14px",
                fontWeight: 600,
                bgcolor: COLORS.PURPLE_ALPHA_10,
                color: COLORS.PRIMARY_PURPLE,
              }}
            >
              {enquiry.customer_name.charAt(0)}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: isDark
                    ? COLORS.TEXT.PRIMARY_DARK
                    : COLORS.TEXT.PRIMARY_LIGHT,
                }}
              >
                {enquiry.customer_name}
              </Typography>
              <Box sx={{ display: "flex", gap: 2, mt: 0.25 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Phone
                    sx={{ fontSize: 12, color: COLORS.TEXT.SECONDARY_LIGHT }}
                  />
                  <Typography
                    sx={{
                      fontSize: "11px",
                      color: COLORS.TEXT.SECONDARY_LIGHT,
                    }}
                  >
                    {enquiry.country_code} {enquiry.phone_number}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Email
                    sx={{ fontSize: 12, color: COLORS.TEXT.SECONDARY_LIGHT }}
                  />
                  <Typography
                    sx={{
                      fontSize: "11px",
                      color: COLORS.TEXT.SECONDARY_LIGHT,
                      maxWidth: "120px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {enquiry.email}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Footer / Action */}
        <Box
          sx={{
            mt: 2,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              color: COLORS.PRIMARY_PURPLE,
              fontWeight: 600,
              fontSize: "13px",
            }}
          >
            {t("view_details")}
            <ArrowForwardIos sx={{ fontSize: 12 }} />
          </Box>
        </Box>
      </Box>

      <SupplierQuotationDetailsModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        enquiry={enquiry}
      />
    </>
  );
};

export default SupplierQuotationCard;
