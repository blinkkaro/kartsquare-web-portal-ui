import React, { useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { COLORS } from "@/constants/colors";
import { providerProfileInterface } from "@/services/profile/profileInterface";
import ProfileHeader from "./ProfileHeader";
import { useFollowProvider } from "@/hooks/useProviderProfile";
import { useTranslate } from "@/hooks/useTranslate";
import Button from "../../Button";
import { useRouter } from "next/navigation";

interface ProfileCardProps {
  profile: providerProfileInterface;
  onClose: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onClose }) => {
  const followMutation = useFollowProvider(profile.id);
  const [isExpand, setIsExpand] = useState(false);
  const { t } = useTranslate();
  const theme = useTheme();
  const router = useRouter();

  const handleFollow = () => {
    followMutation.mutate(profile.is_following ?? false);
  };

  const handleViewProfile = () => {
    router.push(`/in/${profile.username}`);
    onClose();
  };

  return (
    <Box
      sx={{
        mx: { xs: 1, md: 2 },
        p: { xs: 1.5, md: 2 },
        borderRadius: "24px",
        background: COLORS.PRIMARY_PURPLE + "10",
        boxShadow: "0px 10px 40px rgba(0, 0, 0, 0.05)",
      }}
    >
      <ProfileHeader profile={profile} />

      <Typography
        variant="body2"
        sx={{
          color:
            theme.palette.mode === "dark"
              ? COLORS.TEXT.SECONDARY_DARK
              : COLORS.TEXT.SECONDARY_LIGHT,
          mb: 2,
          lineHeight: 1.6,
        }}
      >
        {profile.bio && profile.bio.length > 100
          ? isExpand
            ? profile.bio
            : profile.bio?.slice(0, 100) + "..."
          : profile.bio}
        {!isExpand && profile.bio && (
          <Box
            component="span"
            onClick={() => setIsExpand(true)}
            sx={{
              color:
                theme.palette.mode === "dark"
                  ? COLORS.TEXT.PRIMARY_DARK
                  : COLORS.TEXT.PRIMARY_LIGHT,
              cursor: "pointer",
              fontWeight: 500,
              ml: 0.5,
            }}
          >
            {t("continueReading")}
          </Box>
        )}
      </Typography>

      {/* Actions Row */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: { xs: "center", md: "left" },
          gap: { xs: 2, md: 5 },
        }}
      >
        <Button fullWidth onClick={handleFollow}>
          {profile.is_following ? t("following") : t("follow")}
        </Button>
        <Button
          fullWidth
          variant="outlined"
          onClick={handleViewProfile}
          sx={{
            color:
              theme.palette.mode === "dark"
                ? COLORS.TEXT.PRIMARY_DARK
                : COLORS.TEXT.PRIMARY_LIGHT,
            borderColor:
              theme.palette.mode === "dark"
                ? COLORS.TEXT.PRIMARY_DARK
                : COLORS.TEXT.PRIMARY_LIGHT,
          }}
        >
          {t("viewProfile")}
        </Button>
      </Box>
    </Box>
  );
};

export default ProfileCard;
