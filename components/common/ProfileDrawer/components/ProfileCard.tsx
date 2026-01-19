import React from "react";
import { Box, Typography, Button, Chip } from "@mui/material";
import { COLORS } from "@/constants/colors";
import { providerProfileInterface } from "@/services/profile/profileInterface";
import ProfileHeader from "./ProfileHeader";
import ProfileStats from "./ProfileStats";
import ProfileSocials from "./ProfileSocials";
import { useFollowProvider } from "@/hooks/useProviderProfile";

interface ProfileCardProps {
  profile: providerProfileInterface;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  const followMutation = useFollowProvider(profile.id);

  const handleFollow = () => {
    followMutation.mutate(profile.is_following);
  };

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: "24px",
        background: COLORS.BACKGROUND.PRIMARY_LIGHT,
        boxShadow: "0px 10px 40px rgba(0, 0, 0, 0.05)",
      }}
    >
      <ProfileHeader profile={profile} />

      <Typography
        variant="body2"
        sx={{ color: COLORS.TEXT.SECONDARY_LIGHT, mb: 2, lineHeight: 1.6 }}
      >
        {profile.bio ||
          "Revitalize your senses and unwind with a rejuvenating experience. (No bio available)"}
      </Typography>

      {/* Categories - Mocked as they aren't in the interface yet */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
        {["Category 1", "Category 1", "Category 1", "Category 1"].map(
          (tag, index) => (
            <Chip
              key={index}
              label={tag}
              sx={{
                backgroundColor: COLORS.BACKGROUND.PAPER_LIGHT,
                color: COLORS.TEXT.SECONDARY_LIGHT,
                fontWeight: 500,
                fontSize: "0.75rem",
                borderRadius: "12px",
              }}
            />
          ),
        )}
      </Box>

      {/* Stats Row */}
      <Box sx={{ mb: 3 }}>
        <ProfileStats profile={profile} />
      </Box>

      {/* Actions Row */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={handleFollow}
          disabled={followMutation.isPending}
          sx={{
            backgroundColor: profile.is_following
              ? COLORS.BACKGROUND.PAPER_LIGHT
              : COLORS.PRIMARY_PURPLE,
            color: profile.is_following
              ? COLORS.TEXT.PRIMARY_LIGHT
              : COLORS.WHITE,
            textTransform: "none",
            borderRadius: "50px",
            padding: "10px 0",
            fontWeight: 600,
            fontSize: "1rem",
            boxShadow: profile.is_following ? "none" : COLORS.SHADOW.BLUE,
            "&:hover": {
              backgroundColor: profile.is_following
                ? "#e0e0e0"
                : COLORS.PURPLE_HOVER,
            },
          }}
        >
          {profile.is_following ? "Following" : "Follow"}
        </Button>

        <Box sx={{ flex: 1 }}>
          <ProfileSocials />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileCard;
