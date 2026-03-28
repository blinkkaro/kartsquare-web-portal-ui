"use client";
import React, { useEffect, useState } from "react";
import { 
  Box, Typography, Card, CardContent, Button, TextField, Grid, 
  FormControlLabel, Switch, IconButton, InputAdornment, Alert, CircularProgress, Divider
} from "@mui/material";
import { 
  Visibility, VisibilityOff, 
  Save as SaveIcon, 
  WifiTethering as TestIcon,
  ArrowBack as BackIcon
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useTranslationContext } from "@/features/i18n/TranslationContext";
import { emailMarketingService } from "@/services/emailMarketing/emailMarketing.service";
import { SmtpSettings as SmtpSettingsType } from "@/services/emailMarketing/emailMarketing.interface";
import toast from "react-hot-toast";

interface SmtpSettingsProps {
  role: "supplier" | "spr";
}

export default function SmtpSettings({ role }: SmtpSettingsProps) {
  const router = useRouter();
  const { t } = useTranslationContext();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const translate = (key: string, fallback: string) => {
    const res = t(key as any);
    return res && typeof res === 'string' && res !== key ? res : fallback;
  };

  const basePath = role === "supplier" ? "/supplier" : "/spr";

  const { control, handleSubmit, reset, getValues } = useForm<SmtpSettingsType>({
    defaultValues: {
      host: "",
      port: 465,
      secure: true,
      username: "",
      password: "",
      fromEmail: "",
      fromName: "",
    }
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await emailMarketingService.getSmtpSettings();
        if (res.data) {
          reset({
            host: res.data.host || "",
            port: res.data.port || 465,
            secure: res.data.secure !== undefined ? res.data.secure : true,
            username: res.data.username || "",
            password: "", // Hide password dynamically (Backend doesn't return it)
            fromEmail: res.data.fromEmail || "",
            fromName: res.data.fromName || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch SMTP Settings", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [reset]);

  const onSubmit = async (data: SmtpSettingsType) => {
    try {
      setSaving(true);
      await emailMarketingService.saveSmtpSettings(data);
      toast.success(translate("smtp_saved", "SMTP settings saved successfully"));
      if (data.password) {
        // Option to reset form password field
        reset({ ...data, password: "" });
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || translate("smtp_save_failed", "Failed to save SMTP settings"));
    } finally {
      setSaving(false);
    }
  };

  const onTestConnection = async () => {
    try {
      setTesting(true);
      const data = getValues();
      await emailMarketingService.testSmtpConnection(data);
      toast.success(translate("smtp_test_success", "Connection successful! Delivery engine is ready."));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || translate("smtp_test_failed", "Failed to connect to SMTP server"));
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 800, margin: "0 auto" }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 4, gap: 2 }}>
        <IconButton onClick={() => router.push(`${basePath}/marketing-tools/email-marketing`)} sx={{ bgcolor: 'white', boxShadow: 1 }}>
          <BackIcon />
        </IconButton>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            {translate("smtp_settings", "SMTP Provider Settings")}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {translate("smtp_settings_subtitle", "Configure your own completely private email server to distribute campaigns.")}
          </Typography>
        </Box>
      </Box>

      <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
        <CardContent sx={{ p: 4 }}>
          <Alert severity="info" sx={{ mb: 4, borderRadius: 2 }}>
            {translate("smtp_alert", "Important: Your password securely encrypted on our servers using symmetric encryption.")}
          </Alert>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 8 }}>
                <Controller
                  name="host"
                  control={control}
                  rules={{ required: translate("required_field", "This field is required") as string }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label={translate("smtp_host", "SMTP Host")}
                      placeholder="e.g. smtp.gmail.com"
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Controller
                  name="port"
                  control={control}
                  rules={{ required: translate("required_field", "This field is required") as string }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label={translate("smtp_port", "Port")}
                      type="number"
                      placeholder="465"
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 1 }} />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="fromName"
                  control={control}
                  rules={{ required: translate("required_field", "This field is required") as string }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label={translate("from_name", "From Name")}
                      placeholder="Kartsquare Shop"
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="fromEmail"
                  control={control}
                  rules={{ 
                    required: translate("required_field", "This field is required") as string,
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: translate("invalid_email", "Invalid email address")
                    }
                  }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label={translate("from_email", "From Email (Sender)")}
                      placeholder="hello@yourshop.com"
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 1 }} />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="username"
                  control={control}
                  rules={{ required: translate("required_field", "This field is required") as string }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label={translate("smtp_username", "SMTP Username")}
                      placeholder="your.email@example.com"
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="password"
                  control={control}
                  // Not strictly required if they're just editing the host and password was already saved,
                  // but for the sake of simplicity, we can make it optional on update, and required on create.
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label={translate("smtp_password", "SMTP Password / App Password")}
                      type={showPassword ? "text" : "password"}
                      placeholder="Leave plain if no changes"
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Controller
                  name="secure"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Switch {...field} checked={field.value} color="primary" />}
                      label={translate("use_secure_connection", "Use Secure Connection (SSL/TLS - recommended for port 465)")}
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 5, display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <Button 
                variant="outlined" 
                size="large" 
                color="secondary"
                onClick={onTestConnection}
                disabled={testing || saving}
                startIcon={testing ? <CircularProgress size={20} color="inherit" /> : <TestIcon />}
                sx={{ borderRadius: 2, px: 3 }}
              >
                {testing ? translate("testing", "Testing...") : translate("test_connection", "Test Connection")}
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                size="large" 
                color="primary"
                disabled={saving || testing}
                startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                sx={{ borderRadius: 2, px: 4 }}
              >
                {saving ? translate("saving", "Saving...") : translate("save_settings", "Save Settings")}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
