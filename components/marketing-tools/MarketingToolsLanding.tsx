"use client";
import React from "react";
import { Box, Typography, Grid, Card, CardContent, Button, Chip } from "@mui/material";
import { Email as EmailIcon, WhatsApp as WhatsAppIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useTranslationContext } from "@/features/i18n/TranslationContext";

interface MarketingToolsLandingProps {
  role: "supplier" | "spr";
}

export default function MarketingToolsLanding({ role }: MarketingToolsLandingProps) {
  const router = useRouter();
  const { t } = useTranslationContext();

  // Helper for i18n with fallback to avoid strict typescript errors on missing keys
  const translate = (key: string, fallback: string) => {
    const res = t(key as any);
    return res && typeof res === 'string' && res !== key ? res : fallback;
  };

  const handleNavigate = (path: string) => {
    // If role is supplier, the path in layout is /supplier/marketing-tools
    // If provider, it might be /spr/marketing-tools
    const basePath = role === "supplier" ? "/supplier" : "/spr";
    router.push(`${basePath}/marketing-tools/${path}`);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, margin: "0 auto" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {translate("marketing_tools_title", "Marketing Tools")}
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        {translate("marketing_tools_subtitle", "Grow your business by reaching out to your customers effectively.")}
      </Typography>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        {/* Email Marketing Card */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card 
            sx={{ 
              height: "100%", 
              display: "flex", 
              flexDirection: "column",
              borderRadius: 4,
              transition: "transform 0.2s, box-shadow 0.2s",
              '&:hover': { transform: "translateY(-4px)", boxShadow: 6 }
            }}
          >
            <CardContent sx={{ flexGrow: 1, p: 4, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
              <Box sx={{ 
                bgcolor: "primary.light", 
                color: "primary.main", 
                p: 3, 
                borderRadius: "50%", 
                mb: 3,
                display: "inline-flex",
                opacity: 0.9
              }}>
                <EmailIcon sx={{ fontSize: 48 }} />
              </Box>
              <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
                {translate("email_marketing_title", "Email Marketing")}
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 4, flexGrow: 1 }}>
                {translate("email_marketing_desc", "Create, track, and manage your email campaigns. Send newsletters or promotional offers to your customers to keep them engaged.")}
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                fullWidth
                onClick={() => handleNavigate('email-marketing')}
                sx={{ mt: "auto", py: 1.5, borderRadius: 2, fontWeight: "bold" }}
              >
                {translate("go_to_email_dashboard", "Go to Email Dashboard")}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* WhatsApp Marketing Card */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card 
            sx={{ 
              height: "100%", 
              display: "flex", 
              flexDirection: "column",
              borderRadius: 4,
              opacity: 0.85
            }}
          >
            <CardContent sx={{ flexGrow: 1, p: 4, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", position: "relative" }}>
              <Chip 
                label={translate("coming_soon", "Coming Soon")}
                color="secondary" 
                size="small" 
                sx={{ position: "absolute", top: 16, right: 16, fontWeight: "bold" }} 
              />
              <Box sx={{ 
                bgcolor: "#e8f5e9", // Light green for Whatsapp style
                color: "#2e7d32", 
                p: 3, 
                borderRadius: "50%", 
                mb: 3,
                display: "inline-flex"
              }}>
                <WhatsAppIcon sx={{ fontSize: 48 }} />
              </Box>
              <Typography variant="h5" component="h2" gutterBottom fontWeight="bold" color="text.secondary">
                {translate("whatsapp_marketing_title", "WhatsApp Marketing")}
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 4, flexGrow: 1 }}>
                {translate("whatsapp_marketing_desc", "Engage directly with your customers on WhatsApp. Automate responses, send bulk updates, and manage conversations efficiently.")}
              </Typography>
              <Button 
                variant="outlined" 
                color="inherit" 
                size="large"
                fullWidth
                disabled
                sx={{ mt: "auto", py: 1.5, borderRadius: 2, fontWeight: "bold" }}
              >
                {translate("available_soon", "Available Soon")}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
