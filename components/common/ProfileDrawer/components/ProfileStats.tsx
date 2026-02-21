import React from "react";
import { Box, Typography, Divider, useTheme } from "@mui/material";
import { COLORS } from "@/constants/colors";
import {
  providerProfileInterface,
  ISupplierProfile,
} from "@/services/profile/profileInterface";
import { AppUserType } from "@/services/auth/auth.interface";

interface ProfileStatsProps {
  profile: providerProfileInterface | ISupplierProfile;
}

const StatItem = ({
  count,
  label,
  theme,
}: {
  count: number | string;
  label: string;
  theme: any;
}) => (
  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
    <Typography
      variant="subtitle1"
      sx={{
        fontWeight: "bold",
        color:
          theme.palette.mode === "dark"
            ? COLORS.TEXT.PRIMARY_DARK
            : COLORS.TEXT.PRIMARY_LIGHT,
      }}
    >
      {count}
    </Typography>
    <Typography
      variant="caption"
      sx={{
        color:
          theme.palette.mode === "dark"
            ? COLORS.TEXT.SECONDARY_DARK
            : COLORS.TEXT.SECONDARY_LIGHT,
        textTransform: "capitalize",
      }}
    >
      {label}
    </Typography>
  </Box>
);

const ProfileStats: React.FC<ProfileStatsProps> = ({ profile }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor:
          theme.palette.mode === "dark"
            ? COLORS.BACKGROUND.PAPER_DARK
            : COLORS.BACKGROUND.PAPER_LIGHT,
        borderRadius: "16px",
        height: "100%",
        minHeight: "80px",
        gap: { xs: 2, md: 5 },
        px: { xs: 2, md: 3 },
      }}
    >
      <StatItem
        count={
          profile.role === AppUserType.SUPPLIER
            ? (profile as ISupplierProfile).products_count || 0
            : (profile as providerProfileInterface).total_posts || 0
        }
        label={profile.role === AppUserType.SUPPLIER ? "Products" : "Posts"}
        theme={theme}
      />
      <Divider
        orientation="vertical"
        flexItem
        sx={{ height: 30, alignSelf: "center" }}
      />
      <StatItem
        count={profile.followers_count || 0}
        label="Followers"
        theme={theme}
      />
      <Divider
        orientation="vertical"
        flexItem
        sx={{ height: 30, alignSelf: "center" }}
      />
      <StatItem
        count={profile.following_count || 0}
        label="Following"
        theme={theme}
      />
    </Box>
  );
};

export default ProfileStats;
