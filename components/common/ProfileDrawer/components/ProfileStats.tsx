import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import { COLORS } from "@/constants/colors";
import { providerProfileInterface } from "@/services/profile/profileInterface";

interface ProfileStatsProps {
  profile: providerProfileInterface;
}

const StatItem = ({
  count,
  label,
}: {
  count: number | string;
  label: string;
}) => (
  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
    <Typography
      variant="subtitle1"
      sx={{ fontWeight: "bold", color: COLORS.TEXT.PRIMARY_LIGHT }}
    >
      {count}
    </Typography>
    <Typography
      variant="caption"
      sx={{ color: COLORS.TEXT.SECONDARY_LIGHT, textTransform: "capitalize" }}
    >
      {label}
    </Typography>
  </Box>
);

const ProfileStats: React.FC<ProfileStatsProps> = ({ profile }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: COLORS.WHITE,
        borderRadius: "16px",
        height: "100%",
        minHeight: "80px",
      }}
    >
      <StatItem count={profile.total_posts || 0} label="Posts" />
      <Divider
        orientation="vertical"
        flexItem
        sx={{ height: 30, alignSelf: "center" }}
      />
      <StatItem count={profile.followers_count || 0} label="Followers" />
      <Divider
        orientation="vertical"
        flexItem
        sx={{ height: 30, alignSelf: "center" }}
      />
      <StatItem count={profile.following_count || 0} label="Following" />
    </Box>
  );
};

export default ProfileStats;
