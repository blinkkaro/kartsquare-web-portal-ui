import React from "react";
import { Avatar, Box, Typography, Button } from "@mui/material";
import { COLORS } from "@/constants/colors";
import { providerProfileInterface } from "@/services/profile/profileInterface";
import ProfileStats from "./ProfileStats";

interface ProfileHeaderProps {
  profile: providerProfileInterface;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
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
      <Box sx={{ flex: 1, width: "100%", textAlign: { xs: "center", md: "left" } }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: COLORS.TEXT.PRIMARY_LIGHT,
            lineHeight: 1.2,
          }}
        >
          {profile.first_name} {profile.last_name}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: COLORS.TEXT.SECONDARY_LIGHT, mb: 1 }}
        >
          {/* Fallback for job title as it's not in the interface */}
          {profile.role.toString().replaceAll("_", " ")}
        </Typography>
      </Box>

      <ProfileStats profile={profile} />
    </Box>
  );
};

export default ProfileHeader;
