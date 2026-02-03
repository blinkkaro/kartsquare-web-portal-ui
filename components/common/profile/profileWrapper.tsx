import React from "react";
import { Box, Grid, useTheme } from "@mui/material";
import { useProfile } from "@/hooks/useProfile";
import Profile from "./components/profile";
import BackButton from "../BackButton";
import { COLORS } from "@/constants/colors";

interface ProfileWrapperProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  showProfileOnMobile?: boolean;
}

const ProfileWrapper = ({
  children,
  showBackButton = false,
  showProfileOnMobile = false,
}: ProfileWrapperProps) => {
  const { data: profile, isLoading } = useProfile();

  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  return (
    <Box sx={{ px: { xs: 2, sm: 3, md: 5, lg: 5, xl: 10 }, py: 5 }}>
      {showBackButton && (
        <Box sx={{ display: { xs: "block", lg: "none" }, mb: 2 }}>
          <BackButton />
        </Box>
      )}
      <Grid
        container
        spacing={4}
        direction={{ xs: "column-reverse", lg: "row" }}
      >
        <Grid size={{ xs: 12, lg: 8 }}>
          {showBackButton && (
            <Box sx={{ display: { xs: "none", lg: "block" }, mb: 2 }}>
              <BackButton />
            </Box>
          )}
          {children}
        </Grid>
        <Grid
          size={{ xs: 12, lg: 4 }}
          sx={{
            display: {
              xs: showProfileOnMobile ? "block" : "none",
              lg: "block",
            },
          }}
        >
          {profile && <Profile profile={profile!} />}
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfileWrapper;
