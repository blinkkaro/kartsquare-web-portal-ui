"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  Dialog,
  Box,
  Typography,
  IconButton,
  Avatar,
  Grid,
  TextField,
  useTheme,
  Drawer,
  InputAdornment,
  CardMedia,
} from "@mui/material";
import LogoLoader from "@/components/common/Loader/LogoLoader";
import {
  Close,
  CameraAlt,
  CheckCircle,
  Error as ErrorIcon,
} from "@mui/icons-material";
import Button from "@/components/common/Button";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import ErrorMessage from "@/components/common/ErrorMessage";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { secureStorage } from "@/helper/SecureStorage";
import { getUserRole, UserRole } from "@/utils/auth";
import { usernameValidationService } from "@/services/profile/usernameValidationService";
import SuccessModel from "@/components/common/SuccessModel";
import RightDrawer from "@/components/common/RightDrawer";

export interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  open,
  onClose,
}) => {
  const theme = useTheme();
  const { t } = useTranslate();
  const profile = useProfile();
  const { mutate: updateProfile, isPending, error } = useUpdateProfile();
  const role = secureStorage.getItem("role") as UserRole;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");
  const [profilePicFile, setProfilePicFile] = useState<File | string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [successmodelOpen, setSuccessmodelOpen] = useState(false);
  const [bannerImage, setBannerImage] = useState<string>("");
  const [bannerFile, setBannerFile] = useState<File | string>("");
  const [bannerPreview, setBannerPreview] = useState<string>("");

  // Store original username to compare against
  const originalUsernameRef = useRef<string>("");

  // Username validation states
  const [usernameValidation, setUsernameValidation] = useState<{
    isValidating: boolean;
    isValid: boolean | null;
    error: string | null;
  }>({
    isValidating: false,
    isValid: null,
    error: null,
  });

  const userRole = getUserRole();
  const isServiceProvider = userRole === UserRole.SERVICE_PROVIDER;

  // Initialize form with profile data when modal opens
  useEffect(() => {
    if (open && profile?.data) {
      const profileData = profile.data;
      setBannerImage(profileData.banner_image || "");
      setBannerFile(profileData.banner_image || "");
      setBannerPreview(profileData.banner_image || "");
      setFirstName(profileData.first_name || "");
      setLastName(profileData.last_name || "");
      setBio(profileData.bio || "");
      const initialUsername = profileData.username || "";
      setUsername(initialUsername);
      originalUsernameRef.current = initialUsername;
      setProfilePicFile(profileData.profile_pic || "");
      setPreviewUrl(profileData.profile_pic || "");
      // Reset validation when modal opens
      setUsernameValidation({
        isValidating: false,
        isValid: null,
        error: null,
      });
    }
  }, [open]); // Only depend on open, not profile

  // Debounced username validation
  useEffect(() => {
    // Don't validate if not service provider, username is empty, or hasn't changed
    if (
      !isServiceProvider ||
      !username ||
      username === originalUsernameRef.current
    ) {
      return;
    }

    // Reset validation state
    setUsernameValidation({
      isValidating: true,
      isValid: null,
      error: null,
    });

    const timeoutId = setTimeout(async () => {
      try {
        const response =
          await usernameValidationService.validateUsername(username);

        if (response.status === "success" && response.data?.isAvailable) {
          setUsernameValidation({
            isValidating: false,
            isValid: true,
            error: null,
          });
        } else {
          const errorMessage =
            response.errors?.[0]?.message ||
            response.message ||
            "Username is not available";
          setUsernameValidation({
            isValidating: false,
            isValid: false,
            error: errorMessage,
          });
        }
      } catch (error: any) {
        setUsernameValidation({
          isValidating: false,
          isValid: false,
          error: error?.message || "Failed to validate username",
        });
      }
    }, 1500); // 2.5 seconds debounce

    return () => clearTimeout(timeoutId);
  }, [username, isServiceProvider]); // Only depend on username and isServiceProvider

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfilePicFile(file);
      // Create preview URL for display
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setBannerFile(file);
      // Create preview URL for display
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Validate username if service provider and username has changed
    if (isServiceProvider && username !== originalUsernameRef.current) {
      if (usernameValidation.isValidating) {
        return; // Don't save while validating
      }
      if (usernameValidation.isValid === false) {
        return; // Don't save if validation failed
      }
    }

    updateProfile(
      {
        banner_image: bannerFile || "",
        first_name: firstName,
        last_name: lastName,
        bio: bio,
        profile_pic: profilePicFile || "",
        ...(isServiceProvider && username ? { username } : {}),
      },
      {
        onSuccess: () => {
          setSuccessmodelOpen(true);
        },
      },
    );
  };

  const isDark = theme.palette.mode === "dark";

  return (
    <>
      <RightDrawer
        open={open}
        onClose={onClose}
        title={t("editPersonalInfo")}
        width={500}
      >
        <Box sx={{ padding: "1rem" }}>
          <ErrorMessage
            error={error?.response?.data?.message || error?.message}
            isVisible={!!error}
          />
          {/* Banner Image - Editable */}
          {role !== UserRole.CUSTOMER && (
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: 200,
                mb: 2,
                borderRadius: "12px",
                overflow: "hidden",
                bgcolor: isDark
                  ? COLORS.BACKGROUND.PAPER_DARK
                  : COLORS.BACKGROUND.PAPER_LIGHT,
                border: `2px dashed ${isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT}33`,
                "&:hover .banner-overlay": {
                  opacity: 1,
                },
              }}
            >
              {bannerPreview ? (
                <CardMedia
                  component="img"
                  image={bannerPreview}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  <CameraAlt
                    sx={{
                      fontSize: 48,
                      color: isDark
                        ? COLORS.TEXT.SECONDARY_DARK
                        : COLORS.TEXT.SECONDARY_LIGHT,
                      opacity: 0.4,
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      color: isDark
                        ? COLORS.TEXT.SECONDARY_DARK
                        : COLORS.TEXT.SECONDARY_LIGHT,
                      opacity: 0.6,
                    }}
                  >
                    Add Banner Image
                  </Typography>
                </Box>
              )}
              <Box
                className="banner-overlay"
                component="label"
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  bgcolor: "rgba(0, 0, 0, 0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                  cursor: "pointer",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <CameraAlt sx={{ fontSize: 36, color: "white" }} />
                  <Typography
                    variant="body2"
                    sx={{ color: "white", fontWeight: 500 }}
                  >
                    {bannerPreview ? "Change Banner" : "Upload Banner"}
                  </Typography>
                </Box>
                <input
                  type="file"
                  hidden
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleBannerChange}
                />
              </Box>
            </Box>
          )}

          {/* Profile Picture */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 3,
            }}
          >
            <Box sx={{ position: "relative" }}>
              <Avatar
                src={previewUrl}
                sx={{
                  width: 100,
                  height: 100,
                  border: `3px solid ${COLORS.PRIMARY_PURPLE}`,
                }}
              />
              <IconButton
                component="label"
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  bgcolor: COLORS.PRIMARY_PURPLE,
                  color: "white",
                  width: 32,
                  height: 32,
                  "&:hover": {
                    bgcolor: COLORS.PRIMARY_PURPLE,
                  },
                }}
              >
                <CameraAlt sx={{ fontSize: 18 }} />
                <input
                  type="file"
                  hidden
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleImageChange}
                />
              </IconButton>
            </Box>
          </Box>

          {/* Form Fields */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            {/* First Name & Last Name */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography
                  variant="body2"
                  sx={{
                    mb: 0.5,
                    color: isDark
                      ? COLORS.TEXT.SECONDARY_DARK
                      : COLORS.TEXT.SECONDARY_LIGHT,
                  }}
                >
                  {t("first_name")}
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder={t("first_name")}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      bgcolor: isDark
                        ? COLORS.BACKGROUND.PAPER_DARK
                        : COLORS.BACKGROUND.PAPER_LIGHT,
                    },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography
                  variant="body2"
                  sx={{
                    mb: 0.5,
                    color: isDark
                      ? COLORS.TEXT.SECONDARY_DARK
                      : COLORS.TEXT.SECONDARY_LIGHT,
                  }}
                >
                  {t("last_name")}
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder={t("last_name")}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      bgcolor: isDark
                        ? COLORS.BACKGROUND.PAPER_DARK
                        : COLORS.BACKGROUND.PAPER_LIGHT,
                    },
                  }}
                />
              </Grid>
            </Grid>

            {/* Username (Service Provider only) */}
            {isServiceProvider && (
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    mb: 0.5,
                    color: isDark
                      ? COLORS.TEXT.SECONDARY_DARK
                      : COLORS.TEXT.SECONDARY_LIGHT,
                  }}
                >
                  {t("username" as any) || "Username"}
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t("username" as any) || "Username"}
                  error={usernameValidation.isValid === false}
                  helperText={
                    usernameValidation.isValidating
                      ? "Validating..."
                      : usernameValidation.error ||
                        (usernameValidation.isValid === true
                          ? "Username is available"
                          : "")
                  }
                  InputProps={{
                    endAdornment: usernameValidation.isValidating ? (
                      <InputAdornment position="end">
                        <LogoLoader size={20} />
                      </InputAdornment>
                    ) : usernameValidation.isValid === true ? (
                      <InputAdornment position="end">
                        <CheckCircle
                          sx={{ color: COLORS.SUCCESS_GREEN, fontSize: 20 }}
                        />
                      </InputAdornment>
                    ) : usernameValidation.isValid === false ? (
                      <InputAdornment position="end">
                        <ErrorIcon sx={{ color: "error.main", fontSize: 20 }} />
                      </InputAdornment>
                    ) : null,
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      bgcolor: isDark
                        ? COLORS.BACKGROUND.PAPER_DARK
                        : COLORS.BACKGROUND.PAPER_LIGHT,
                    },
                  }}
                />
              </Box>
            )}

            {/* Bio */}
            <Box>
              <Typography
                variant="body2"
                sx={{
                  mb: 0.5,
                  color: isDark
                    ? COLORS.TEXT.SECONDARY_DARK
                    : COLORS.TEXT.SECONDARY_LIGHT,
                }}
              >
                {t("bio")}
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder={t("bioPlaceholder")}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    bgcolor: isDark
                      ? COLORS.BACKGROUND.PAPER_DARK
                      : COLORS.BACKGROUND.PAPER_LIGHT,
                  },
                }}
              />
            </Box>

            {/* Save Button */}
            <Button
              fullWidth
              variant="contained"
              onClick={handleSave}
              isLoading={isPending}
              disabled={
                isServiceProvider &&
                username !== originalUsernameRef.current &&
                (usernameValidation.isValidating ||
                  usernameValidation.isValid === false)
              }
              sx={{
                mt: 2,
                py: 1.5,
              }}
            >
              {t("save")}
            </Button>
          </Box>
        </Box>
      </RightDrawer>
      <SuccessModel
        open={successmodelOpen}
        onClose={() => setSuccessmodelOpen(false)}
        title={t("profileUpdated")}
        description={t("profileUpdatedDescription")}
        onAction={() => {
          setSuccessmodelOpen(false);
          onClose();
        }}
      />
    </>
  );
};

export default EditProfileModal;
