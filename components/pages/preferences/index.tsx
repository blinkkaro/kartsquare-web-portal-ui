"use client";
import AuthWrapper from "@/components/auth/authWrapper";
import { useTranslate } from "@/hooks/useTranslate";
import React, { useState, useMemo, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useGetUserPreference } from "@/hooks/usePreference";
import { COLORS } from "@/constants/colors";
import { useCategories } from "@/hooks/useCategories";
import PreferenceCard from "./components/PreferenceCard";
import {
  Typography,
  Grid,
  Button,
  Box,
  TextField,
  InputAdornment,
  useTheme,
  Chip,
} from "@mui/material";
import CenteredLoader from "@/components/common/Loader/CenteredLoader";
import LogoLoader from "@/components/common/Loader/LogoLoader";
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

  const { data: rawPreferences, isLoading: isPrefLoading, error, isError } = useGetUserPreference();
  const { data: categories, isLoading: isCatLoading } = useCategories();

  const isLoading = isPrefLoading || isCatLoading;

  const preferences = useMemo(() => {
    if (user?.role === "CUSTOMER") {
      return rawPreferences || [];
    } else {
      if (!categories) return [];
      return categories.map((cat) => ({
        id: cat.id,
        preference_name: cat.name,
        description: cat.description,
        icon: "Category",
        is_selected: rawPreferences?.some((p: any) => p.id === cat.id && p.is_selected) || false,
      }));
    }
  }, [user?.role, rawPreferences, categories]);

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
    return preferences.filter((p: any) =>
      p.preference_name?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
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
    return <CenteredLoader minHeight="50vh" />;
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
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              color: COLORS.PRIMARY_BLUE,
              fontSize: { xs: "2rem", sm: "2.5rem", md: "2.75rem" },
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              mb: 0.5,
            }}
          >
            {headerTitle}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              mt: 2,
              mb: 1,
              fontSize: { xs: "1rem", sm: "1.0625rem" },
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
                borderColor: COLORS.PRIMARY_BLUE,
                boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.08)",
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
              color: COLORS.PRIMARY_BLUE, // Use theme blue
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
          {user?.role === "CUSTOMER" ? (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1.5,
                justifyContent: "center",
                pt: 1,
              }}
            >
              {filteredPreferences.map((preference: any) => (
                <Chip
                  key={preference.id}
                  label={preference.preference_name}
                  onClick={() => handleToggle(preference.id)}
                  sx={{
                    px: 1,
                    py: 2.25,
                    borderRadius: "100px",
                    fontSize: { xs: "0.875rem", sm: "0.9375rem" },
                    backgroundColor: selectedPreferenceIds.has(preference.id) 
                      ? COLORS.PRIMARY_BLUE 
                      : "transparent",
                    color: selectedPreferenceIds.has(preference.id) 
                      ? "white" 
                      : COLORS.PRIMARY_BLUE,
                    fontWeight: selectedPreferenceIds.has(preference.id) ? 600 : 500,
                    borderWidth: "2px",
                    borderStyle: "solid",
                    transition: "all 0.2s ease",
                    borderColor: selectedPreferenceIds.has(preference.id) 
                      ? COLORS.PRIMARY_BLUE 
                      : (theme.palette.mode === "dark" ? "rgba(59, 130, 246, 0.4)" : "rgba(59, 130, 246, 0.2)"),
                    "&:hover": {
                      backgroundColor: selectedPreferenceIds.has(preference.id)
                        ? COLORS.BUSINESS_PROFILE_BLUE_HOVER
                        : theme.palette.mode === "dark"
                        ? "grey.800"
                        : "grey.100",
                    },
                  }}
                />
              ))}
            </Box>
          ) : (
            <Grid container spacing={2}>
              {filteredPreferences.map((preference: any) => (
                <Grid size={{ xs: 12, sm: 6, md: 6 }} key={preference.id}>
                  <PreferenceCard
                    title={preference.preference_name}
                    description={preference.description}
                    onPress={() => handleToggle(preference.id)}
                    isSelected={selectedPreferenceIds.has(preference.id)}
                    id={preference.id}
                  />
                </Grid>
              ))}
            </Grid>
          )}
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
              : "0 4px 14px rgba(59, 130, 246, 0.35)",
            bgcolor: isContinueDisabled
              ? theme.palette.mode === "dark"
                ? "action.disabledBackground"
                : "grey.300"
              : COLORS.PRIMARY_BLUE,
            color: isContinueDisabled
              ? theme.palette.mode === "dark"
                ? "action.disabled"
                : "grey.600"
              : "white",
            "&:hover": {
              boxShadow: isContinueDisabled
                ? "none"
                : "0 6px 20px rgba(59, 130, 246, 0.4)",
              bgcolor: isContinueDisabled
                ? theme.palette.mode === "dark"
                  ? "action.disabledBackground"
                  : "grey.300"
                : COLORS.BUSINESS_PROFILE_BLUE_HOVER,
            },
          }}
          onClick={handleSave}
          fullWidth
          disabled={isSaving || selectedCount === 0}
        >
          {isSaving ? (
            <>
              <LogoLoader size={20} />
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
