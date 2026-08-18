"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  FormControlLabel,
  Stack,
  Switch,
  Typography,
  useTheme,
  alpha,
} from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  broadcastingChanged,
  consentGranted,
  consentPromptClosed,
  consentPromptOpened,
  fetchLiveLocationStatus,
  selectLiveLocation,
} from "@/features/ui/liveLocationSlice";
import { useLiveLocation } from "@/hooks/useLiveLocation";
import { useTranslate } from "@/hooks/useTranslate";
import LocationConsentDialog from "./LocationConsentDialog";

/**
 * The provider's control for broadcasting their current position.
 *
 * Consent is requested once, before the browser permission prompt — asking for
 * GPS access without first explaining why is what trains people to decline.
 */
export default function GoLiveToggle() {
  const theme = useTheme();
  const { t } = useTranslate();
  const dispatch = useAppDispatch();
  const isDark = theme.palette.mode === "dark";

  const { hasConsented, consentPromptOpen, isBroadcasting: reduxLive } =
    useAppSelector(selectLiveLocation);

  const [pendingStart, setPendingStart] = useState(false);
  const mirroredOnce = useRef(false);

  const {
    isBroadcasting,
    isStarting,
    error,
    lastSample,
    pendingCount,
    isThrottled,
    status,
    start,
    stop,
    refreshStatus,
  } = useLiveLocation();

  // Load the server's view once on mount — the provider may already be live
  // from another tab or a previous session.
  useEffect(() => {
    void dispatch(fetchLiveLocationStatus());
  }, [dispatch]);

  // Mirror the hook's state into Redux so the always-visible chip reacts.
  // Skipped on mount: the hook starts at `false` and would otherwise overwrite
  // the server status fetched above, hiding a broadcast started elsewhere.
  useEffect(() => {
    if (!mirroredOnce.current) {
      mirroredOnce.current = true;
      if (!isBroadcasting) return;
    }
    dispatch(broadcastingChanged(isBroadcasting));
  }, [isBroadcasting, dispatch]);

  const beginBroadcast = useCallback(async () => {
    await start();
    await refreshStatus();
  }, [start, refreshStatus]);

  const handleToggle = useCallback(
    async (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      if (!checked) {
        await stop();
        return;
      }
      if (!hasConsented) {
        setPendingStart(true);
        dispatch(consentPromptOpened());
        return;
      }
      await beginBroadcast();
    },
    [beginBroadcast, dispatch, hasConsented, stop],
  );

  const handleAccept = useCallback(async () => {
    dispatch(consentGranted());
    if (pendingStart) {
      setPendingStart(false);
      await beginBroadcast();
    }
  }, [beginBroadcast, dispatch, pendingStart]);

  const handleDecline = useCallback(() => {
    setPendingStart(false);
    dispatch(consentPromptClosed());
  }, [dispatch]);

  const live = isBroadcasting || reduxLive;

  return (
    <>
      <Card variant="outlined">
        <CardContent>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            spacing={1.5}
          >
            {/* minWidth:0 lets this column shrink instead of pushing the
                switch out of a narrow sidebar. */}
            <Box sx={{ minWidth: 0, flex: "1 1 auto" }}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                flexWrap="wrap"
                useFlexGap
              >
                {live ? (
                  <MyLocationIcon color="error" fontSize="small" />
                ) : (
                  <HomeWorkIcon color="action" fontSize="small" />
                )}
                <Typography variant="subtitle1" fontWeight={700}>
                  {t("liveLocationTitle")}
                </Typography>
                {live && (
                  <Chip
                    size="small"
                    color="error"
                    label={t("liveLocationLive")}
                    sx={{ height: 20, fontWeight: 700 }}
                  />
                )}
              </Stack>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5, maxWidth: 520, overflowWrap: "anywhere" }}
              >
                {live
                  ? t("liveLocationOnBody")
                  : t("liveLocationOffBody")}
              </Typography>
            </Box>

            <FormControlLabel
              sx={{ mr: 0, ml: 0, flexShrink: 0 }}
              control={
                isStarting ? (
                  <Box sx={{ px: 1.5, display: "flex" }}>
                    <CircularProgress size={20} />
                  </Box>
                ) : (
                  <Switch
                    checked={live}
                    onChange={handleToggle}
                    color="error"
                    inputProps={{
                      "aria-label": t("liveLocationToggleAria"),
                    }}
                  />
                )
              }
              label=""
            />
          </Stack>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }} variant="outlined">
              {error}
            </Alert>
          )}

          {live && isThrottled && (
            <Alert severity="warning" sx={{ mt: 2 }} variant="outlined">
              {t("liveLocationThrottled")}
            </Alert>
          )}

          {live && (
            <>
              <Divider sx={{ my: 2 }} />
              <Stack
                direction="row"
                spacing={{ xs: 2, sm: 3 }}
                flexWrap="wrap"
                useFlexGap
                sx={{
                  p: 1.5,
                  borderRadius: 1,
                  bgcolor: alpha(theme.palette.primary.main, isDark ? 0.12 : 0.06),
                }}
              >
                <Stat
                  label={t("liveLocationRadius")}
                  value={
                    status?.live_radius_km
                      ? `${status.live_radius_km} km`
                      : t("liveLocationRadiusDefault")
                  }
                />
                <Stat
                  label={t("liveLocationLastUpdate")}
                  value={
                    lastSample
                      ? new Date(lastSample.recorded_at).toLocaleTimeString()
                      : "—"
                  }
                />
                <Stat
                  label={t("liveLocationAccuracy")}
                  value={
                    lastSample?.accuracy_m
                      ? `±${Math.round(lastSample.accuracy_m)} m`
                      : "—"
                  }
                />
                {pendingCount > 0 && (
                  <Stat
                    label={t("liveLocationQueued")}
                    value={String(pendingCount)}
                  />
                )}
              </Stack>
            </>
          )}
        </CardContent>
      </Card>

      <LocationConsentDialog
        open={consentPromptOpen}
        onAccept={handleAccept}
        onDecline={handleDecline}
      />
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600}>
        {value}
      </Typography>
    </Box>
  );
}
