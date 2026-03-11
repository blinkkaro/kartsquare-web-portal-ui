"use client";
import ProfileWrapper from "@/components/common/profile/profileWrapper";
import {
  Box,
  Typography,
  Grid,
  CardMedia,
} from "@mui/material";
import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import { EditOutlined } from "@mui/icons-material";
import { useSupplierStore } from "@/hooks/useSupplier";
import { useGetAddress } from "@/hooks/useAddress";
import AddressCard from "@/components/pages/address/components/AddressCard";

import Labels from "../personalInfo/components/labels";
import EditStoreInfoModal from "./components/EditStoreInfoModal";
import { SupplierStore } from "@/services/supplier/supplier.service";

function StoreInfoView() {
  const theme = useTheme();
  const { t } = useTranslate();
  const isDark = theme.palette.mode === "dark";

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fetch Store Info
  const { data: storeInfoData } = useSupplierStore();
  
  // Fetch Addresses to resolve store_address_id
  const { data: addresses } = useGetAddress();

  // Safely access data
  const info = storeInfoData?.data || ({} as Partial<SupplierStore>);

  const matchedAddress = addresses?.find(
    (addr: any) => addr.id === info.store_address_id
  );

  return (
    <ProfileWrapper showBackButton>
      <Box
        sx={{
          my: "1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
            fontWeight: "500",
            color: isDark
              ? COLORS.TEXT.PRIMARY_DARK
              : COLORS.TEXT.PRIMARY_LIGHT,
          }}
        >
          {t("storeInfo" as any) || "Store Info"}
        </Typography>
        <Box
          onClick={() => setIsEditModalOpen(true)}
          sx={{
            cursor: "pointer",
            bgcolor: isDark
              ? COLORS.BACKGROUND.PRIMARY_DARK
              : COLORS.BACKGROUND.PRIMARY_LIGHT,
            p: "0.5rem",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              bgcolor: isDark
                ? COLORS.BACKGROUND.PAPER_DARK
                : COLORS.BACKGROUND.PAPER_LIGHT,
            },
            boxShadow: `0px 2px 8px ${COLORS.SHADOW.DEFAULT}`,
          }}
        >
          <EditOutlined
            sx={{
              color: isDark
                ? COLORS.TEXT.PRIMARY_DARK
                : COLORS.TEXT.PRIMARY_LIGHT,
            }}
          />
        </Box>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        {/* Basic Store Info */}
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Labels label={t("storeName")} description={info.store_name || "-"} />
            <Labels label={t("description")} description={info.description || info.about_us || "-"} />
            
            <Labels label={t("contactEmail")} description={info.contact_email || "-"} />
            <Labels label={t("primaryMobile")} description={info.primary_mobile || info.contact_phone || "-"} />

            <Labels label={t("categoriesServed")} description={info.categories_served?.join(", ") || "-"} />
            <Labels label={t("operatingLocations")} description={info.operating_locations?.join(", ") || "-"} />
            <Labels label={t("businessType")} description={info.business_type || "-"} />
            <Labels label={t("establishmentYear")} description={info.establishment_year || "-"} />
            <Labels label={t("websiteUrl")} description={info.website_url || "-"} />
          </Grid>
          
          <Grid size={{ xs: 12, md: 6 }}>
            <Labels label={t("address")} />
            {matchedAddress ? (
              <Box sx={{ mt: 2, width: "100%", maxWidth: 400 }}>
                <AddressCard address={matchedAddress} />
              </Box>
            ) : (
               <Typography variant="body1" color="text.secondary">
                -
              </Typography>
            )}
            
            {/* Store Images */}
            <Box sx={{ mt: 4 }}>
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  color: isDark
                    ? COLORS.TEXT.SECONDARY_DARK
                    : COLORS.TEXT.SECONDARY_LIGHT,
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                }}
              >
                {t("storeImages" as any) || "Store Images"}
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
                {info.logo_url && (
                  <Box
                    sx={{
                      width: 100,
                      height: 100,
                      borderRadius: "8px",
                      overflow: "hidden",
                      border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT}`,
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={info.logo_url}
                      sx={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                  </Box>
                )}
                {info.banner_url && (
                  <Box
                    sx={{
                      width: 150,
                      height: 100,
                      borderRadius: "8px",
                      overflow: "hidden",
                      border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT}`,
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={info.banner_url}
                      sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </Box>
                )}
                {!info.logo_url && !info.banner_url && (
                  <Typography variant="body1" color="text.secondary">
                    -
                  </Typography>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <EditStoreInfoModal
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          initialData={info}
        />
      )}
    </ProfileWrapper>
  );
}

export default StoreInfoView;
