"use client";

import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
  alpha,
} from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TimerOffIcon from "@mui/icons-material/TimerOff";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import { useTranslate } from "@/hooks/useTranslate";

interface Props {
  open: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

/**
 * Consent shown before a provider broadcasts their position for the first time.
 *
 * Written to be read, not clicked past: it says what is shared, who can see it,
 * and how it ends. Continuous location tracking of a working person needs
 * informed opt-in, and under India's DPDP Act it needs a stated purpose.
 */
export default function LocationConsentDialog({
  open,
  onAccept,
  onDecline,
}: Props) {
  const theme = useTheme();
  const { t } = useTranslate();
  const isDark = theme.palette.mode === "dark";

  const points = [
    {
      icon: <MyLocationIcon fontSize="small" />,
      primary: t("liveLocationConsentWhatTitle"),
      secondary:
        t("liveLocationConsentWhatBody"),
    },
    {
      icon: <VisibilityIcon fontSize="small" />,
      primary: t("liveLocationConsentWhoTitle"),
      secondary:
        t("liveLocationConsentWhoBody"),
    },
    {
      icon: <TimerOffIcon fontSize="small" />,
      primary: t("liveLocationConsentExpiryTitle"),
      secondary:
        t("liveLocationConsentExpiryBody"),
    },
    {
      icon: <PowerSettingsNewIcon fontSize="small" />,
      primary: t("liveLocationConsentStopTitle"),
      secondary:
        t("liveLocationConsentStopBody"),
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={onDecline}
      maxWidth="sm"
      fullWidth
      aria-labelledby="live-location-consent-title"
    >
      <DialogTitle id="live-location-consent-title" sx={{ pb: 1 }}>
        <Typography component="span" variant="h6" fontWeight={700}>
          {t("liveLocationConsentTitle")}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t("liveLocationConsentIntro")}
        </Typography>

        <List dense disablePadding>
          {points.map((p) => (
            <ListItem key={p.primary} alignItems="flex-start" disableGutters>
              <ListItemIcon
                sx={{
                  minWidth: 36,
                  mt: 0.5,
                  color: theme.palette.primary.main,
                }}
              >
                {p.icon}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="subtitle2" fontWeight={700}>
                    {p.primary}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    {p.secondary}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>

        <Box
          sx={{
            mt: 2,
            p: 1.5,
            borderRadius: 1,
            bgcolor: alpha(theme.palette.warning.main, isDark ? 0.15 : 0.1),
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {t("liveLocationConsentBrowserNote")}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onDecline} color="inherit">
          {t("notNow")}
        </Button>
        <Button onClick={onAccept} variant="contained" autoFocus>
          {t("liveLocationConsentAccept")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
