import React from "react";
import { Avatar, Box, Typography, Button } from "@mui/material";
import { COLORS } from "@/constants/colors";
import { providerProfileInterface } from "@/services/profile/profileInterface";

interface ProfileHeaderProps {
  profile: providerProfileInterface;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 2,
        mb: 3,
      }}
    >
      <Avatar
        src={profile.profile_pic}
        alt={profile.first_name}
        sx={{
          width: 80,
          height: 80,
          border: `3px solid ${COLORS.WHITE}`,
          boxShadow: COLORS.SHADOW.DEFAULT,
        }}
      />
      <Box sx={{ flex: 1 }}>
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
          {profile.role || "Service Provider"}
        </Typography>

        {/* Placeholder for "Open for Collaboration" - ideally this comes from backend */}
        <Box
          sx={{
            display: "inline-block",
            padding: "4px 12px",
            borderRadius: "20px",
            backgroundColor: COLORS.BACKGROUND.PAPER_LIGHT,
            border: `1px solid ${COLORS.BORDER.DEFAULT_LIGHT}`,
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: COLORS.TEXT.PRIMARY_LIGHT, fontWeight: 500 }}
          >
            Open for Collaboration
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileHeader;
