import React from "react";
import { Avatar, Box, Typography, Button, useTheme } from "@mui/material";
import { COLORS } from "@/constants/colors";
import { providerProfileInterface } from "@/services/profile/profileInterface";
import ProfileStats from "./ProfileStats";
import { useTranslate } from "@/hooks/useTranslate";

interface ProfileHeaderProps {
  profile: providerProfileInterface;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
  const theme = useTheme();
  const { t } = useTranslate();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        gap: { xs: 1, md: 2 },
        mb: 3,
        flexWrap: "wrap",
      }}
    >
      <Avatar
        src={profile.profile_pic}
        alt={profile.first_name}
        sx={{
          width: { xs: 100, md: 80 },
          height: { xs: 100, md: 80 },
          border: `3px solid ${COLORS.WHITE}`,
          boxShadow: COLORS.SHADOW.DEFAULT,
        }}
      />
      <Box
        sx={{ flex: 1, width: "100%", textAlign: { xs: "center", md: "left" } }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color:
              theme.palette.mode === "dark"
                ? COLORS.TEXT.PRIMARY_DARK
                : COLORS.TEXT.PRIMARY_LIGHT,
            lineHeight: 1.2,
          }}
        >
          {profile.business_name }
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color:
              theme.palette.mode === "dark"
                ? COLORS.TEXT.PRIMARY_DARK
                : COLORS.TEXT.PRIMARY_LIGHT,
            mb: 1,
          }}
        >
          {`${t("by")} ${profile.first_name} ${profile.last_name}`}
        </Typography>
      </Box>

      <ProfileStats profile={profile} />
    </Box>
  );
};

export default ProfileHeader;
