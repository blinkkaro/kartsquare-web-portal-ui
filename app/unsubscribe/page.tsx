"use client";
import React, { useState, useEffect, Suspense } from "react";
import { Box, Typography, Card, CardContent, Button, CircularProgress } from "@mui/material";
import { CheckCircle as SuccessIcon, Error as ErrorIcon, Unsubscribe as UnsubscribeIcon } from "@mui/icons-material";
import { useSearchParams } from "next/navigation";
import { emailMarketingService } from "@/services/emailMarketing/emailMarketing.service";
import { useTranslationContext } from "@/features/i18n/TranslationContext";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const { t } = useTranslationContext();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const translate = (key: string, fallback: string) => {
    const res = t(key as any);
    return res && typeof res === 'string' && res !== key ? res : fallback;
  };

  const handleUnsubscribe = async () => {
    if (!email) {
      setError(translate("email_missing", "Email address is missing from the link."));
      return;
    }

    try {
      setLoading(true);
      await emailMarketingService.unsubscribe(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || translate("unsubscribe_failed", "Failed to process your request. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <Card sx={{ maxWidth: 400, width: "100%", borderRadius: 3, boxShadow: "0 10px 30px rgba(0,0,0,0.1)", textAlign: "center" }}>
        <CardContent sx={{ p: 4 }}>
          <ErrorIcon color="error" sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            {translate("invalid_link", "Invalid Link")}
          </Typography>
          <Typography color="text.secondary">
            {translate("email_param_missing", "We couldn't identify your email address. Please make sure you clicked the exact link from your email.")}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (success) {
    return (
      <Card sx={{ maxWidth: 400, width: "100%", borderRadius: 3, boxShadow: "0 10px 30px rgba(0,0,0,0.1)", textAlign: "center" }}>
        <CardContent sx={{ p: 5 }}>
          <SuccessIcon color="success" sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            {translate("unsubscribed", "Unsubscribed Successfully")}
          </Typography>
          <Typography color="text.secondary">
            {translate("unsubscribe_success_message", `You have been safely removed from our mailing list. You will no longer receive marketing emails at ${email}.`)}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ maxWidth: 400, width: "100%", borderRadius: 3, boxShadow: "0 10px 30px rgba(0,0,0,0.1)", textAlign: "center" }}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ bgcolor: "#f5f5f5", display: "inline-flex", p: 2, borderRadius: "50%", mb: 3 }}>
          <UnsubscribeIcon sx={{ fontSize: 40, color: "text.secondary" }} />
        </Box>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {translate("unsubscribe", "Unsubscribe")}
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          {translate("unsubscribe_confirm_message", `Are you sure you want to stop receiving emails at ${email}?`)}
        </Typography>

        {error && (
          <Box sx={{ bgcolor: '#ffebee', color: '#c62828', p: 2, borderRadius: 2, mb: 3 }}>
            <Typography variant="body2">{error}</Typography>
          </Box>
        )}

        <Button 
          variant="contained" 
          color="error" 
          fullWidth 
          size="large"
          onClick={handleUnsubscribe}
          disabled={loading}
          sx={{ borderRadius: 2, py: 1.5, fontWeight: "bold" }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : translate("confirm_unsubscribe", "Confirm Unsubscribe")}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function UnsubscribePage() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fafafa", display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}>
      {/* We use Suspense because useSearchParams causes client-side deopt if not wrapped */}
      <Suspense fallback={<CircularProgress />}>
        <UnsubscribeContent />
      </Suspense>
    </Box>
  );
}
