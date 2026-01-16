"use client";
import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import { Close, CameraAlt } from "@mui/icons-material";
import Button from "@/components/common/Button";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import ErrorMessage from "@/components/common/ErrorMessage";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useUpdateProfile } from "@/hooks/useProfile";

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
  const profile = useSelector((state: RootState) => state.profile.profile);
  const { mutate: updateProfile, isPending, error } = useUpdateProfile();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicFile, setProfilePicFile] = useState<File | string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");

  // Initialize form with profile data when modal opens
  useEffect(() => {
    if (open && profile) {
      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
      setBio(profile.bio || "");
      setProfilePicFile(profile.profile_pic || "");
    }
  }, [open, profile]);

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

  const handleSave = () => {
    updateProfile(
      {
        first_name: firstName,
        last_name: lastName,
        bio: bio,
        profile_pic: profilePicFile || undefined,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const isDark = theme.palette.mode === "dark";

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          //   borderRadius: "16px",
          padding: { xs: "1.5rem", sm: "2rem" },
          maxWidth: "500px",
          bgcolor: isDark
            ? COLORS.BACKGROUND.PRIMARY_DARK
            : COLORS.BACKGROUND.PRIMARY_LIGHT,
        },
      }}
    >
      <ErrorMessage
        error={error?.response?.data?.message || error?.message}
        isVisible={!!error}
      />
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: isDark
              ? COLORS.TEXT.PRIMARY_DARK
              : COLORS.TEXT.PRIMARY_LIGHT,
          }}
        >
          {t("editPersonalInfo")}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </Box>

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
            src={profilePicFile instanceof File ? undefined : profilePicFile}
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
          sx={{
            mt: 2,
            py: 1.5,
          }}
        >
          {t("save")}
        </Button>
      </Box>
    </Drawer>
  );
};

export default EditProfileModal;
