import BackButton from "@/components/common/BackButton";
import ProfileWrapper from "@/components/common/profileWrapper";
import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import { useTheme } from "@mui/material/styles";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import { EditOutlined } from "@mui/icons-material";
import { useProfile } from "@/hooks/useProfile";
import Labels from "./components/labels";
import Button from "@/components/common/Button";
import { formatDate } from "@/helper/helper";

function PersonalInfoView() {
  const theme = useTheme();
  const { t } = useTranslate();
  const { data: profileData } = useProfile();

  const isDark = theme.palette.mode === "dark";

  return (
    <ProfileWrapper>
      <BackButton />
      <Box
        sx={{
          my: "2rem",
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
          {t("personalInfoTitle")}
        </Typography>
        <Box
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

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Labels
          label={t("name")}
          description={`${profileData?.first_name || ""} ${
            profileData?.last_name || ""
          }`}
        />

        <Labels
          label={t("bio")}
          description={profileData?.bio || t("noBioAvailable")}
        />

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Labels
              label={t("email")}
              description={profileData?.email || ""}
              verified={true}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Labels
              label={t("phone_number")}
              description={profileData?.phone_number || ""}
              verified={true}
            />
          </Grid>
        </Grid>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Labels
              label={t("country")}
              description={profileData?.country || ""}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Labels
              label={t("gender")}
              description={profileData?.gender || ""}
            />
          </Grid>
        </Grid>
        <Labels
          label={t("birth_date")}
          description={
            profileData?.birth_date ? formatDate(profileData.birth_date) : "-"
          }
        />

        <Box sx={{ mt: 4 }}>
          <Button
            variant="text"
            sx={{
              color: "#FF3B30", // Danger Red
              fontWeight: 500,
              padding: 0,
              textTransform: "none",
              fontSize: "1rem",
              "&:hover": {
                bgcolor: "transparent",
                textDecoration: "underline",
              },
            }}
          >
            {t("deleteAccount")}
          </Button>
        </Box>
      </Box>
    </ProfileWrapper>
  );
}

export default PersonalInfoView;
