"use client";
import ProfileWrapper from "@/components/common/profile/profileWrapper";
import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import CenteredLoader from "@/components/common/Loader/CenteredLoader";
import PreferenceCards from "@/components/pages/preferences/components/PreferenceCard";
import {
  useGetUserPreference,
  usePreference,
  useUpdatePreference,
} from "@/hooks/usePreference";
import { useTranslationContext } from "@/features/i18n/TranslationContext";
import { secureStorage } from "@/helper/SecureStorage";

function MyPreferencesView() {
  const { t } = useTranslationContext();
  const { data: preferencesData, isLoading, refetch } = useGetUserPreference();
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [userRole, setUserRole] = useState<string>("");

  // Get user role from secure storage
  useEffect(() => {
    const userData = secureStorage.getItem("user");
    if (userData?.role) {
      setUserRole(userData.role);
    }
  }, []);

  // Initialize selected preferences from API data
  useEffect(() => {
    if (preferencesData) {
      const activePreferences = preferencesData
        .filter((pref) => pref.is_selected)
        .map((pref) => pref.id);
      setSelectedPreferences(activePreferences);
    }
  }, [preferencesData]);

  const updatePreferenceMutation = useUpdatePreference();

  const handlePreferenceToggle = async (id: string) => {
    const newSelectedPreferences = selectedPreferences.includes(id)
      ? selectedPreferences.filter((prefId) => prefId !== id)
      : [...selectedPreferences, id];

    setSelectedPreferences(newSelectedPreferences);

    // Update preferences on the server
    if (preferencesData) {
      const updatedPreferences = preferencesData
        .filter((pref) => newSelectedPreferences.includes(pref.id))
        .map((pref) => pref.id);

      try {
        await updatePreferenceMutation.mutateAsync(updatedPreferences);
        refetch();
      } catch (error) {
        console.error("Failed to update preferences:", error);
        // Revert on error
        setSelectedPreferences(selectedPreferences);
      }
    }
  };

  // Determine title based on user role
  const getTitle = () => {
    if (userRole === "SERVICE_PROVIDER") {
      return t("category");
    }
    return t("preferences");
  };

  return (
    <ProfileWrapper showBackButton>
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Typography
          variant="h4"
          sx={{
            mb: 4,
            fontWeight: 600,
            fontSize: { xs: "1.5rem", md: "2rem" },
          }}
        >
          {getTitle()}
        </Typography>

        {isLoading ? (
          <CenteredLoader />
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                sm: "repeat(3, 1fr)",
                md: "repeat(4, 1fr)",
                lg: "repeat(5, 1fr)",
              },
              gap: 3,
            }}
          >
            {preferencesData?.map((preference) => (
              <PreferenceCards
                key={preference.id}
                // iconName={preference.icon}
                title={preference.preference_name}
                isSelected={selectedPreferences.includes(preference.id)}
                onPress={handlePreferenceToggle}
                id={preference.id}
              />
            ))}
          </Box>
        )}
      </Box>
    </ProfileWrapper>
  );
}

export default MyPreferencesView;
