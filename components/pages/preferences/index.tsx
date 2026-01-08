"use client";
import AuthWrapper from "@/components/auth/authWrapper";
import Title from "@/components/auth/title";
import { useTranslate } from "@/hooks/useTranslate";
import React, { useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { usePreference } from "@/hooks/usePreference";
import PreferenceCard from "./components/PreferenceCard";
import {
  Typography,
  Grid,
  Button,
  Box,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import { prefranceService } from "@/services/auth/preference.service";
import { useRouter } from "next/navigation";
import ErrorMessage from "@/components/common/ErrorMessage";

function PreferencesView() {
  const [selectedPreferenceIds, setSelectedPreferenceIds] = useState<
    Set<string>
  >(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | "">("");

  const { user } = useAppSelector((state) => state.auth);
  const { t } = useTranslate();
  const router = useRouter();

  const headerTitle =
    user?.role === "CUSTOMER" ? t("preferences") : t("category");

  const { data: preferences, isLoading, error, isError } = usePreference();

  const handleToggle = (id: string) => {
    setSelectedPreferenceIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSave = async () => {
    if (selectedPreferenceIds.size === 0) return;

    setIsSaving(true);
    setErrorMsg("");
    try {
      await prefranceService.addPreferenceForTheUser(
        Array.from(selectedPreferenceIds)
      );
      // Navigate to home or dashboard after success
      router.push("/");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save preferences");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <AuthWrapper>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
        >
          <Typography color="error">Error: {error?.message}</Typography>
        </Box>
      </AuthWrapper>
    );
  }

  return (
    <AuthWrapper>
      <Box sx={{ maxWidth: 800, mx: "auto", width: "100%" }}>
        <Title title={headerTitle} />
        <ErrorMessage isVisible={!!errorMsg} error={errorMsg || ""} />
        <Box sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            {preferences?.map((preference) => (
              <Grid size={{ xs: 6, sm: 4, md: 4 }} key={preference.id}>
                <PreferenceCard
                  title={preference.preference_name}
                  iconName={preference.icon}
                  onPress={() => handleToggle(preference.id)}
                  isSelected={selectedPreferenceIds.has(preference.id)}
                  id={preference.id}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        <Button
          variant="contained"
          sx={{
            borderRadius: "30px",
          }}
          onClick={handleSave}
          fullWidth
          disabled={isSaving || selectedPreferenceIds.size === 0}
        >
          {t("continue")}
        </Button>
      </Box>
    </AuthWrapper>
  );
}

export default PreferencesView;
