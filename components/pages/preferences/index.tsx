"use client";
import AuthWrapper from "@/components/auth/authWrapper";
import { useTranslate } from "@/hooks/useTranslate";
import React, { useState, useMemo, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useGetUserPreference } from "@/hooks/usePreference";
import PreferenceCard from "./components/PreferenceCard";
import {
  Typography,
  Grid,
  Button,
  Box,
  CircularProgress,
  TextField,
  InputAdornment,
  useTheme,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { prefranceService } from "@/services/auth/preference.service";
import { useRouter } from "next/navigation";
import ErrorMessage from "@/components/common/ErrorMessage";
import { UserRegisterSteps } from "@/types/resgistrationFlow";
import { handleRegistrationStepNavigation } from "@/helper/registrationNavigation";

function PreferencesView() {
  const [selectedPreferenceIds, setSelectedPreferenceIds] = useState<
    Set<string>
  >(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | "">("");
  const [searchQuery, setSearchQuery] = useState("");

  const { user } = useAppSelector((state) => state.auth);
  const { t } = useTranslate();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const theme = useTheme();

  const headerTitle =
    user?.role === "CUSTOMER" ? t("preferences") : t("category");

  const { data: preferences, isLoading, error, isError } = useGetUserPreference();

  useEffect(() => {
    if (preferences) {
      const activePreferences = preferences
        .filter((pref: any) => pref.is_selected)
        .map((pref: any) => pref.id);
      setSelectedPreferenceIds(new Set(activePreferences));
    }
  }, [preferences]);


  const filteredPreferences = useMemo(() => {
    if (!preferences) return [];
    if (!searchQuery.trim()) return preferences;
    const q = searchQuery.trim().toLowerCase();
    return preferences.filter((p) =>
      p.preference_name.toLowerCase().includes(q)
    );
  }, [preferences, searchQuery]);

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
        Array.from(selectedPreferenceIds),
      );
      handleRegistrationStepNavigation(
        dispatch,
        router,
        UserRegisterSteps.COMPLETED,
      );
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

  const selectedCount = selectedPreferenceIds.size;
  const isContinueDisabled = isSaving || selectedCount === 0;

  return (
    <AuthWrapper>
      <Box
        sx={{
          maxWidth: 720,
          mx: "auto",
          width: "100%",
          px: { xs: 2, sm: 3 },
          py: { xs: 2, sm: 4 },
        }}
      >
        {/* Centered heading with subtitle */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              fontSize: { xs: "1.75rem", sm: "2rem", md: "2.25rem" },
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            {headerTitle}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              mt: 1,
              fontSize: { xs: "0.875rem", sm: "0.9375rem" },
            }}
          >
            {user?.role === "CUSTOMER"
              ? "Choose what you're interested in"
              : "Select the categories you offer"}
          </Typography>
        </Box>

        {/* Pill-shaped search bar with soft shadow */}
        <TextField
          fullWidth
          placeholder={t("search") || "Search categories..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          variant="outlined"
          size="small"
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "24px",
              bgcolor: "background.paper",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              "& fieldset": {
                borderColor: "divider",
                transition: "border-color 0.2s, box-shadow 0.2s",
              },
              "&:hover fieldset": {
                borderColor: "action.hover",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              },
              "&.Mui-focused fieldset": {
                borderWidth: "2px",
                borderColor: "primary.main",
                boxShadow: "0 0 0 3px rgba(94, 24, 233, 0.08)",
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ ml: 0.5 }}>
                <SearchRoundedIcon
                  sx={{ color: "text.secondary", fontSize: "1.25rem" }}
                />
              </InputAdornment>
            ),
            sx: { py: 0.75 },
          }}
        />

        <ErrorMessage isVisible={!!errorMsg} error={errorMsg || ""} />

        {/* Selection count chip (when any selected) */}
        {selectedCount > 0 && (
          <Typography
            variant="caption"
            sx={{
              display: "block",
              color: "primary.main",
              fontWeight: 600,
              mb: 1,
              fontSize: "0.8125rem",
            }}
          >
            {selectedCount} {selectedCount === 1 ? "category" : "categories"}{" "}
            selected
          </Typography>
        )}

        {/* Preferences container - scrollable with custom scrollbar */}
        <Box
          sx={{
            height: 400,
            overflowY: "auto",
            overflowX: "hidden",
            borderRadius: "20px",
            p: 2,
            mb: 3,
            bgcolor: theme.palette.mode === "dark" ? "background.default" : "grey.50",
            border: "1px solid",
            borderColor: theme.palette.mode === "dark" ? "divider" : "grey.200",
            boxShadow: theme.palette.mode === "dark" ? "none" : "inset 0 1px 2px rgba(0,0,0,0.04)",
            "&::-webkit-scrollbar": { width: 8 },
            "&::-webkit-scrollbar-track": {
              bgcolor: theme.palette.mode === "dark" ? "background.paper" : "grey.100",
              borderRadius: 4,
            },
            "&::-webkit-scrollbar-thumb": {
              bgcolor: theme.palette.mode === "dark" ? "grey.700" : "grey.400",
              borderRadius: 4,
            },
            "&::-webkit-scrollbar-thumb:hover": { bgcolor: theme.palette.mode === "dark" ? "grey.600" : "grey.500" },
          }}
        >
          <Grid container spacing={2}>
            {filteredPreferences.map((preference) => (
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
          {filteredPreferences.length === 0 && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                minHeight: 200,
                color: "text.secondary",
                gap: 1,
              }}
            >
              <Typography variant="body2" fontWeight={500}>
                {searchQuery.trim()
                  ? `${t("noResultsFound")} "${searchQuery}"`
                  : "No categories available"}
              </Typography>
              {searchQuery.trim() && (
                <Typography variant="caption">
                  {t("tryDifferentSearch")}
                </Typography>
              )}
            </Box>
          )}
        </Box>

        {/* Continue button - pill style, clear disabled state */}
        <Button
          variant="contained"
          disableElevation
          sx={{
            borderRadius: "28px",
            py: 1.5,
            fontWeight: 600,
            textTransform: "none",
            fontSize: "1rem",
            boxShadow: isContinueDisabled
              ? "none"
              : "0 4px 14px rgba(94, 24, 233, 0.35)",
            bgcolor: isContinueDisabled ? (theme.palette.mode === "dark" ? "action.disabledBackground" : "grey.300") : undefined,
            color: isContinueDisabled ? (theme.palette.mode === "dark" ? "action.disabled" : "grey.600") : undefined,
            "&:hover": {
              boxShadow: isContinueDisabled
                ? "none"
                : "0 6px 20px rgba(94, 24, 233, 0.4)",
              bgcolor: isContinueDisabled ? (theme.palette.mode === "dark" ? "action.disabledBackground" : "grey.300") : undefined,
            },
          }}
          onClick={handleSave}
          fullWidth
          disabled={isSaving || selectedCount === 0}
        >
          {isSaving ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1, color: "inherit" }} />
              Saving...
            </>
          ) : (
            t("continue")
          )}
        </Button>
      </Box>
    </AuthWrapper>
  );
}

export default PreferencesView;
