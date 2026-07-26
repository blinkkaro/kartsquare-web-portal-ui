"use client";
import ProfileWrapper from "@/components/common/profile/profileWrapper";
import { Box, Grid } from "@mui/material";
import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import { EditOutlined } from "@mui/icons-material";
import { useDeleteProfile, useProfile } from "@/hooks/useProfile";
import Labels from "./components/labels";
import Button from "@/components/common/Button";
import { formatDate } from "@/helper/helper";
import EditProfileModal from "./components/EditProfileModal";
import WarningModel from "@/components/common/WarningModel";
import { getUserRole, UserRole } from "@/utils/auth";
import { UserRegisterSteps } from "@/types/resgistrationFlow";
import PageHeading from "@/components/common/PageHeading";

function PersonalInfoView() {
  const theme = useTheme();
  const { t } = useTranslate();
  const { data: profile } = useProfile();
  const { mutate: deleteProfile, isPending: isDeleting } = useDeleteProfile();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const isDark = theme.palette.mode === "dark";
  const userRole = getUserRole();
  const isServiceProvider = userRole === UserRole.SERVICE_PROVIDER;

  const handleDeleteAccount = () => {
    deleteProfile();
  };

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
        <PageHeading title={t("personalInfoTitle")} sx={{ mb: 0 }} />
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
        <Labels
          label={t("name")}
          description={`${profile?.first_name || ""} ${
            profile?.last_name || ""
          }`}
        />

        {isServiceProvider && (
          <Labels
            label={t("username" as any) || "Username"}
            description={"@"+profile?.username || "-"}
          />
        )}

        <Labels
          label={t("bio")}
          description={profile?.bio || t("noBioAvailable")}
        />

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Labels
              label={t("email")}
              description={profile?.email || ""}
              verified={(profile?.register_step ?? 0) > UserRegisterSteps.EMAIL_VERIFIED}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box
              sx={{
                display: "flex",
                borderLeft: { sm: "1px solid #E0E0E0", xs: "none" },
                height: "50%",
                p: { xs: "0", sm: "1rem" },
                mt: { xs: "0", sm: "1rem" },
                alignItems: "center",
              }}
            >
              <Labels
                label={t("phone_number")}
                description={profile?.phone_number || ""}
                verified={(profile?.register_step ?? 0) > UserRegisterSteps.EMAIL_VERIFIED}
              />
            </Box>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Labels label={t("country")} description={profile?.country || ""} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box
              sx={{
                display: "flex",
                borderLeft: { sm: "1px solid #E0E0E0", xs: "none" },
                height: "50%",
                p: { xs: "0", sm: "1rem" },
                mt: { xs: "0", sm: "1rem" },
                alignItems: "center",
              }}
            >
              <Labels label={t("gender")} description={profile?.gender || ""} />
            </Box>
          </Grid>
        </Grid>
        <Labels
          label={t("birth_date")}
          description={
            profile?.birth_date ? formatDate(profile.birth_date) : "-"
          }
        />

        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            onClick={() => setIsDeleteModalOpen(true)}
            sx={{
              color: "error.main",
              fontWeight: 500,
              padding: { xs: "0.4rem 0.8rem", sm: "0.5rem 1rem" },
              textTransform: "none",
              fontSize: { xs: "0.875rem", sm: "1rem" },
              boxShadow: `0px 2px 8px ${COLORS.SHADOW.DEFAULT}`,
              bgcolor:
                theme.palette.mode === "dark"
                  ? COLORS.BACKGROUND.PRIMARY_DARK
                  : COLORS.BACKGROUND.PRIMARY_LIGHT,
              "&:hover": {
                bgcolor:
                  theme.palette.mode === "dark"
                    ? COLORS.BACKGROUND.PRIMARY_DARK
                    : COLORS.BACKGROUND.PRIMARY_LIGHT,
                textDecoration: "underline",
                boxShadow: `0px 2px 8px ${COLORS.SHADOW.DEFAULT}`,
              },
            }}
          >
            {t("deleteAccount")}
          </Button>
        </Box>
      </Box>

      {/* Edit Profile Modal */}
      <EditProfileModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

      {/* Delete Account Warning Modal */}
      <WarningModel
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={t("deleteAccountTitle")}
        description={t("deleteAccountDescription")}
        ActionsButtons={
          <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
            <Button
              variant="outlined"
              onClick={() => setIsDeleteModalOpen(false)}
              sx={{
                flex: 1,
                borderColor: isDark
                  ? COLORS.BORDER.DEFAULT_DARK
                  : COLORS.BORDER.DEFAULT_LIGHT,
                color: isDark
                  ? COLORS.TEXT.PRIMARY_DARK
                  : COLORS.TEXT.PRIMARY_LIGHT,
              }}
            >
              {t("deleteAccountCancel")}
            </Button>
            <Button
              variant="contained"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              sx={{
                flex: 1,
                bgcolor: "error.main",
                color: "white",
                "&:hover": {
                  bgcolor: "error.dark",
                },
              }}
            >
              {isDeleting ? "..." : t("deleteAccountConfirm")}
            </Button>
          </Box>
        }
      />
    </ProfileWrapper>
  );
}

export default PersonalInfoView;
