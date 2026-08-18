"use client";
import ProfileWrapper from "@/components/common/profile/profileWrapper";
import {
  Box,
  Typography,
  Grid,
  IconButton,
  Avatar,
  CardMedia,
} from "@mui/material";
import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import { EditOutlined } from "@mui/icons-material";
import EditBusinessInfoModal from "./components/EditBusinessInfoModal";
import { useGetBusinessInfo } from "@/hooks/useBusinessInfo";
import { useGetAddress } from "@/hooks/useAddress";

import { IBusinessInfo } from "@/services/auth/auth.interface";
import Labels from "../personalInfo/components/labels";
import AddressCard from "../address/components/AddressCard";
import { Address } from "@/services/address/addressInterface";

function MyBusinessInfoView() {
  const theme = useTheme();
  const { t } = useTranslate();
  const isDark = theme.palette.mode === "dark";

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fetch Business Info
  const { data: businessInfo, isLoading: isBusinessLoading } =
    useGetBusinessInfo();

  // Fetch Addresses to resolve address_id
  const { data: addresses } = useGetAddress();

  const matchedAddress = addresses?.find(
    (addr: Address) => addr.id === businessInfo?.address_id,
  );

  // Safely access data
  const info = businessInfo || ({} as Partial<IBusinessInfo>);

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
            fontWeight: "500",
            color: isDark
              ? COLORS.TEXT.PRIMARY_DARK
              : COLORS.TEXT.PRIMARY_LIGHT,
          }}
        >
          {t("businessInfo")}
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
        {/* Business Name */}
        <Labels
          label={t("businessName")}
          description={info.business_name}
        />

        {/* Description */}
        <Labels
          label={t("description")}
          description={info.description || "-"}
        />
        <Grid container>
          <Grid size={{ xs: 12, md: 6 }}>
            {/* Address */}
            <Labels label={t("address")} />
            {info.address_id && matchedAddress ? (
              <Box sx={{ mt: 2, width: "60%" }}>
                <AddressCard address={matchedAddress} />
              </Box>
            ) : (
              <Typography variant="body1" color="text.secondary">
                -
              </Typography>
            )}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            {/* Business Images */}
            <Box sx={{ mt: 2 }}>
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
                {t("businessImages" as any) || "Business Images"}
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                {info.business_images &&
                Array.isArray(info.business_images) &&
                info.business_images.length > 0 ? (
                  (info.business_images as string[]).map(
                    (img: string, index: number) => (
                      <Box
                        key={index}
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
                          image={img}
                          // alt={`Business Image ${index + 1}`}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </Box>
                    ),
                  )
                ) : (
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
      <EditBusinessInfoModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={info}
      />
    </ProfileWrapper>
  );
}

export default MyBusinessInfoView;
