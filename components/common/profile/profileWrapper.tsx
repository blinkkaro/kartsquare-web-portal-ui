import React from "react";
import { Box, Grid } from "@mui/material";
import { useProfile } from "@/hooks/useProfile";
import Profile from "./components/profile";

interface ProfileWrapperProps {
  children: React.ReactNode;
}

const ProfileWrapper = ({ children }: ProfileWrapperProps) => {
  const { data: profile, isLoading } = useProfile();
  return (
    <Box sx={{ px: { xs: 2, sm: 3, md: 5, lg: 5, xl: 10 }, py: 5 }}>
      <Grid
        container
        spacing={4}
        direction={{ xs: "column-reverse", lg: "row" }}
      >
        <Grid size={{ xs: 12, lg: 8 }}>{children}</Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Profile profile={profile!} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfileWrapper;
