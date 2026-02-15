import React from "react";
import { Box, Avatar, Typography, Button, Chip, useTheme } from "@mui/material";
import { useFollowUser, useUnfollowUser } from "@/hooks/useFollow";
import { getUserId } from "@/utils/auth";
import { openLoginModal } from "@/features/ui/loginModalSlice";
import { Person, PersonAdd, Message, CheckCircle, Call } from "@mui/icons-material";
import { COLORS } from "../constants/colors";
import { useDispatch } from "react-redux";
import { openDrawer } from "@/features/ui/profileDrawerSlice";
import { useIncreasePhoneNumberViewCount } from "@/hooks/useServicesList";

interface ProviderInfoCardProps {
  providerId: string;
  providerName: string;
  providerImageUrl?: string | null;
  isHotSeller?: boolean;
  businessName?: string;
  isFollowing?: boolean;
  providerPhoneNumber?: string;
  gstNumber?: string;
}

const ProviderInfoCard: React.FC<ProviderInfoCardProps> = ({
  providerId,
  providerName,
  providerImageUrl,
  isHotSeller = false,
  businessName,
  isFollowing = false,
  providerPhoneNumber,
  gstNumber,
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

  const isLoading = followMutation.isPending || unfollowMutation.isPending;

  return (
    <Box
      sx={{
        bgcolor: isDark ? "rgba(94, 24, 233, 0.08)" : "rgba(94, 24, 233, 0.05)",
        borderRadius: "16px",
        p: { xs: 2, sm: 2.5 },
        border: `1px dashed ${COLORS.PRIMARY_PURPLE}40`,
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "flex-start", sm: "center" },
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar
          src={providerImageUrl || undefined}
          sx={{
            width: 56,
            height: 56,
            border: `2px solid ${isDark ? "rgba(255,255,255,0.1)" : "white"}`,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          {providerName.charAt(0).toUpperCase()}
        </Avatar>
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mb: 0.5,
              flexWrap: "wrap",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 800,
                color: isDark
                  ? COLORS.TEXT.PRIMARY_DARK
                  : COLORS.TEXT.PRIMARY_LIGHT,
                lineHeight: 1.2,
                fontSize: "1.1rem",
                cursor: "pointer",
              }}
              onClick={() => {
                dispatch(openDrawer({ userId: providerId }));
              }}
            >
              {businessName || providerName}
            </Typography>

            {/* Badges Row from Reference Image */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {/* Verified Badge - Blue check + text */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  color: "#1D4ED8", // Professional Blue
                  fontWeight: 800,
                  fontSize: "0.75rem",
                  letterSpacing: "-0.01em",
                }}
              >
                <CheckCircle sx={{ fontSize: "15px" }} />
                <Typography
                  sx={{
                    fontWeight: 900,
                    fontSize: "0.75rem",
                    fontStyle: "italic",
                    fontFamily: "system-ui",
                  }}
                >
                  Verified
                </Typography>
              </Box>

              {/* Trust Badge - Styled like the image */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  bgcolor: "#FEF3C7",
                  borderRadius: "4px",
                  overflow: "hidden",
                  border: "1px solid #FCD34D",
                }}
              >
                <Box
                  sx={{
                    bgcolor: "#F59E0B",
                    color: "white",
                    px: 0.5,
                    py: 0.1,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography sx={{ fontSize: "0.6rem", fontWeight: 900 }}>
                    T
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontSize: "0.6rem",
                    fontWeight: 900,
                    px: 0.8,
                    color: "#92400E",
                  }}
                >
                  Trust
                </Typography>
              </Box>
            </Box>
          </Box>
          {businessName && (
            <Typography
              variant="caption"
              sx={{
                color: isDark
                  ? COLORS.TEXT.SECONDARY_DARK
                  : COLORS.TEXT.SECONDARY_LIGHT,
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
              color: "#64748B",
              fontWeight: 600,
              display: "block",
              mb: 0.5,
            }}
          >
            Highly Responsive • Top Professional
          </Typography>
          {gstNumber && (
            <Typography
              variant="caption"
              sx={{
                color: "#059669", // Success Green
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

      <Box sx={{ display: "flex", gap: 1, width: { xs: "100%", sm: "auto" } }}>
        {/* <Button
          variant="contained"
          fullWidth
          size="small"
          startIcon={<Message sx={{ fontSize: "1rem !important" }} />}
          sx={{
            borderRadius: "10px",
            textTransform: "none",
            bgcolor: COLORS.PRIMARY_PURPLE,
            color: "white",
            fontWeight: 700,
            px: 2,
            "&:hover": {
              bgcolor: COLORS.PURPLE_HOVER,
            },
          }}
        >
          Message
        </Button> */}
        <Button
          variant="contained"
          fullWidth
          size="small"
          startIcon={<Call sx={{ fontSize: "1rem !important" }} />}
          onClick={handleShowPhoneNumber}
          disabled={showPhoneNumber}
          sx={{
            borderRadius: "10px",
            textTransform: "none",
            bgcolor: COLORS.PRIMARY_PURPLE,
            color: "white",
            fontWeight: 700,
            px: 2,
            "&:hover": {
              bgcolor: COLORS.PURPLE_HOVER,
            },
            "&.Mui-disabled": {
              bgcolor: COLORS.PRIMARY_PURPLE,
              color: "white",
            },
          }}
        >
          {showPhoneNumber ? providerPhoneNumber : "Show Number"}
        </Button>
        <Button
          variant={"outlined"}
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
            borderRadius: "10px",
            textTransform: "none",
            borderColor: isDark
              ? COLORS.ACCENT_BLUE_DARK
              : COLORS.BORDER.DEFAULT_DARK,
            color: isDark ? COLORS.ACCENT_BLUE_DARK : COLORS.PRIMARY_PURPLE,
            fontWeight: 700,
            px: 2,
            bgcolor: "transparent",
            "&:hover": {
              borderColor: isDark
                ? COLORS.ACCENT_BLUE_DARK
                : COLORS.PRIMARY_PURPLE,
              bgcolor: isDark ? COLORS.ACCENT_BLUE_DARK : COLORS.PRIMARY_PURPLE,
              color: "white",
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
