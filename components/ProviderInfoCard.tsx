import React from "react";
import {
  Box,
  Avatar,
  Typography,
  Button,
  Chip,
  useTheme,
} from "@mui/material";
import { useFollowUser, useUnfollowUser } from "@/hooks/useFollow";
import { getUserId } from "@/utils/auth";
import { openLoginModal } from "@/features/ui/loginModalSlice";
import {
  Person,
  PersonAdd,
  CheckCircle,
  Call,
  WorkspacePremium,
} from "@mui/icons-material";
import { COLORS } from "../constants/colors";
import { english } from "../features/i18n/en";
import { useDispatch } from "react-redux";
import { openDrawer } from "@/features/ui/profileDrawerSlice";
import { useIncreasePhoneNumberViewCount } from "@/hooks/useServicesList";
import { AppUserType } from "@/services/auth/auth.interface";

interface ProviderInfoCardProps {
  providerId: string;
  providerName: string;
  providerImageUrl?: string | null;
  isHotSeller?: boolean;
  businessName?: string;
  isFollowing?: boolean;
  providerPhoneNumber?: string;
  gstNumber?: string;
  disableDrawer?: boolean;
  role?: AppUserType;
  username?: string;
}

const ProviderInfoCard: React.FC<ProviderInfoCardProps> = ({
  providerId,
  providerName,
  providerImageUrl,
  businessName,
  isFollowing = false,
  providerPhoneNumber,
  gstNumber,
  username,
  role = AppUserType.SERVICE_PROVIDER,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const dispatch = useDispatch();
  const currentUserId = getUserId();
  const [following, setFollowing] = React.useState(isFollowing);
  const [showPhoneNumber, setShowPhoneNumber] = React.useState(false);
  const increasePhoneNumberViewCountMutation =
    useIncreasePhoneNumberViewCount(providerId);

  React.useEffect(() => {
    setFollowing(isFollowing);
  }, [isFollowing]);

  const followMutation = useFollowUser(currentUserId || "");
  const unfollowMutation = useUnfollowUser(currentUserId || "");

  const handleFollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUserId) {
      dispatch(openLoginModal());
      return;
    }

    if (following) {
      unfollowMutation.mutate(providerId, {
        onSuccess: () => setFollowing(false),
      });
    } else {
      followMutation.mutate(providerId, {
        onSuccess: () => setFollowing(true),
      });
    }
  };

  const handleShowPhoneNumber = () => {
    setShowPhoneNumber(true);
    increasePhoneNumberViewCountMutation.mutate();
  };

  const handleOpenDrawer = () => {
    dispatch(openDrawer({ userId: providerId, role, username }));
  };

  const isLoading = followMutation.isPending || unfollowMutation.isPending;

  return (
    <Box
      sx={{
        bgcolor: isDark ? "rgba(255, 255, 255, 0.05)" : "white",
        border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)"}`,
        borderRadius: "16px",
        boxShadow: isDark ? "none" : "0 1px 3px rgba(30, 20, 60, 0.05), 0 8px 24px rgba(30, 20, 60, 0.04)",
        p: { xs: 2, sm: 2.5 },
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "flex-start", sm: "center" },
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 0 }}>
        <Avatar
          src={providerImageUrl || undefined}
          sx={{
            width: 60,
            height: 60,
            flexShrink: 0,
            border: `2px solid ${isDark ? "rgba(255,255,255,0.1)" : COLORS.PURPLE_ALPHA_10}`,
          }}
        >
          {providerName.charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 0.5,
              flexWrap: "wrap",
            }}
          >
            <Typography
              sx={{
                fontWeight: 800,
                color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                lineHeight: 1.2,
                fontSize: "1.05rem",
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
              }}
              onClick={handleOpenDrawer}
            >
              {businessName || providerName}
            </Typography>

            <Chip
              icon={<CheckCircle sx={{ fontSize: "14px !important" }} />}
              label={english.verified}
              size="small"
              sx={{
                bgcolor: isDark ? "rgba(29, 78, 216, 0.16)" : "#EFF6FF",
                color: "#1D4ED8",
                fontWeight: 800,
                fontSize: "0.68rem",
                height: 22,
              }}
            />
            <Chip
              icon={<WorkspacePremium sx={{ fontSize: "14px !important" }} />}
              label="Trust"
              size="small"
              sx={{
                bgcolor: isDark ? "rgba(245, 158, 11, 0.18)" : "#FEF3C7",
                color: "#92400E",
                fontWeight: 800,
                fontSize: "0.68rem",
                height: 22,
              }}
            />
          </Box>
          {businessName && (
            <Typography
              variant="caption"
              sx={{
                color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                fontSize: "0.85rem",
                fontWeight: 500,
                display: "block",
                mb: 0.5,
              }}
            >
              by {providerName}
            </Typography>
          )}
          <Typography
            variant="caption"
            sx={{
              color: isDark ? COLORS.TEXT.SECONDARY_DARK : "#64748B",
              fontWeight: 600,
              display: "block",
            }}
          >
            {english.highly_responsive ?? "Highly Responsive"} •{" "}
            {english.top_professional ?? "Top Professional"}
          </Typography>
          {gstNumber && (
            <Typography
              variant="caption"
              sx={{
                color: "#059669",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                mt: 0.5,
              }}
            >
              <CheckCircle sx={{ fontSize: "14px" }} />
              GST: {gstNumber}
            </Typography>
          )}
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "row", sm: "row" },
          gap: 1,
          width: { xs: "100%", sm: "auto" },
          flexShrink: 0,
        }}
      >
        {providerPhoneNumber && (
          <Button
            variant="contained"
            fullWidth
            size="small"
            startIcon={<Call sx={{ fontSize: "1rem !important" }} />}
            onClick={handleShowPhoneNumber}
            disabled={showPhoneNumber}
            sx={{
              borderRadius: "30px",
              textTransform: "none",
              bgcolor: isDark ? COLORS.ACCENT_BLUE_DARK : COLORS.PRIMARY_PURPLE,
              color: "white",
              fontWeight: 700,
              px: 2.5,
              py: 1,
              minWidth: 0,
              whiteSpace: "nowrap",
              "&:hover": {
                bgcolor: isDark ? COLORS.ACCENT_BLUE_DARK : COLORS.PURPLE_HOVER,
              },
              "&.Mui-disabled": {
                bgcolor: isDark ? COLORS.ACCENT_BLUE_DARK : COLORS.PRIMARY_PURPLE,
                color: "white",
                opacity: 0.9,
              },
            }}
          >
            {showPhoneNumber ? providerPhoneNumber : english.show_number}
          </Button>
        )}
        <Button
          variant="outlined"
          fullWidth
          size="small"
          onClick={handleFollow}
          disabled={isLoading}
          startIcon={
            following ? (
              <Person sx={{ fontSize: "1rem !important" }} />
            ) : (
              <PersonAdd sx={{ fontSize: "1rem !important" }} />
            )
          }
          sx={{
            borderRadius: "30px",
            textTransform: "none",
            borderColor: isDark ? "rgba(255,255,255,0.16)" : COLORS.BORDER.DEFAULT_LIGHT,
            color: isDark ? COLORS.ACCENT_BLUE_DARK : COLORS.PRIMARY_PURPLE,
            fontWeight: 700,
            px: 2.5,
            py: 1,
            whiteSpace: "nowrap",
            "&:hover": {
              borderColor: isDark ? COLORS.ACCENT_BLUE_DARK : COLORS.PRIMARY_PURPLE,
              bgcolor: isDark ? "rgba(130,72,247,0.1)" : COLORS.PURPLE_ALPHA_04,
            },
          }}
        >
          {following ? "Following" : "Follow"}
        </Button>
      </Box>
    </Box>
  );
};

export default ProviderInfoCard;
