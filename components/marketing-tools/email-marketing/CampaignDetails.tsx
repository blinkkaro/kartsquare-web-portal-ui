"use client";
import React, { useEffect, useState } from "react";
import { 
  Box, Typography, Card, CardContent, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, CircularProgress, Button,
  Grid, LinearProgress, IconButton, Paper, Divider
} from "@mui/material";
import { 
  ArrowBack as BackIcon,
  PlayArrow as PlayIcon,
  Refresh as RefreshIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon
} from "@mui/icons-material";
import { useRouter, useParams } from "next/navigation";
import { useTranslationContext } from "@/features/i18n/TranslationContext";
import { emailMarketingService } from "@/services/emailMarketing/emailMarketing.service";
import { VendorCampaignDetail } from "@/services/emailMarketing/emailMarketing.interface";
import toast from "react-hot-toast";

interface CampaignDetailsProps {
  role: "supplier" | "spr";
}

export default function CampaignDetails({ role }: CampaignDetailsProps) {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { t } = useTranslationContext();
  
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [campaign, setCampaign] = useState<VendorCampaignDetail | null>(null);

  const translate = (key: string, fallback: string) => {
    const res = t(key as any);
    return res && typeof res === 'string' && res !== key ? res : fallback;
  };

  const basePath = role === "supplier" ? "/supplier" : "/spr";

  const fetchCampaign = async (isPoll = false) => {
    try {
      if (!isPoll) setLoading(true);
      const res = await emailMarketingService.getCampaignDetails(id);
      if (res.data) setCampaign(res.data);
    } catch (error) {
      console.error("Failed to fetch campaign details", error);
      if (!isPoll) toast.error(translate("campaign_fetch_failed", "Failed to load campaign details"));
    } finally {
      if (!isPoll) setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCampaign();
    }
  }, [id]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (campaign?.status === 'processing') {
      interval = setInterval(() => {
        fetchCampaign(true);
      }, 5000); // poll every 5 seconds
    }
    return () => clearInterval(interval);
  }, [campaign?.status, id]);

  const handleStartCampaign = async () => {
    try {
      setStarting(true);
      await emailMarketingService.startCampaign(id);
      toast.success(translate("campaign_started", "Campaign successfully started"));
      fetchCampaign();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || translate("campaign_start_failed", "Failed to start campaign"));
    } finally {
      setStarting(false);
    }
  };

  const getStatusChip = (status: string) => {
    const map: Record<string, "default"|"primary"|"secondary"|"error"|"info"|"success"|"warning"> = {
      draft: "default",
      scheduled: "info",
      processing: "primary",
      completed: "success",
      failed: "error"
    };
    return <Chip label={status.toUpperCase()} color={map[status] || "default"} sx={{ fontWeight: 'bold' }} />;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!campaign) {
    return (
      <Box sx={{ textAlign: 'center', p: 10 }}>
        <Typography variant="h6" color="text.secondary">
          {translate("campaign_not_found", "Campaign not found")}
        </Typography>
        <Button sx={{ mt: 2 }} onClick={() => router.push(`${basePath}/marketing-tools/email-marketing/campaigns`)}>
          {translate("back_to_campaigns", "Back to Campaigns")}
        </Button>
      </Box>
    );
  }

  const progress = campaign.totalRecipients > 0 
    ? ((campaign.sentCount + campaign.failedCount) / campaign.totalRecipients) * 100 
    : 0;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, margin: "0 auto" }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", mb: 4, gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton onClick={() => router.push(`${basePath}/marketing-tools/email-marketing/campaigns`)} sx={{ bgcolor: 'white', boxShadow: 1 }}>
            <BackIcon />
          </IconButton>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 0.5 }}>
              <Typography variant="h4" fontWeight="bold">
                {campaign.name}
              </Typography>
              {getStatusChip(campaign.status)}
            </Box>
            <Typography variant="body1" color="text.secondary">
              {translate("subject", "Subject")}: {campaign.subject}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <IconButton onClick={() => fetchCampaign(true)} title={translate("refresh", "Refresh")}>
            <RefreshIcon />
          </IconButton>
          
          {campaign.status === 'draft' && (
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={starting ? <CircularProgress size={20} color="inherit" /> : <PlayIcon />}
              onClick={handleStartCampaign}
              disabled={starting}
              sx={{ borderRadius: 2, px: 3 }}
            >
              {translate("start_campaign", "Start Campaign")}
            </Button>
          )}
        </Box>
      </Box>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          {/* Stats Card */}
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)", mb: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {translate("campaign_overview", "Overview")}
              </Typography>
              
              <Box sx={{ mt: 4, mb: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2" fontWeight="bold">{translate("progress", "Progress")}</Typography>
                  <Typography variant="body2" fontWeight="bold">{Math.round(progress)}%</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={progress} 
                  sx={{ height: 10, borderRadius: 5 }} 
                />
              </Box>

              <Divider sx={{ my: 3 }} />

              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary" fontWeight="bold">{translate("total_recipients", "Total Recipients")}</Typography>
                    <Typography variant="h5" fontWeight="bold" color="primary">{campaign.totalRecipients}</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Box sx={{ p: 2, bgcolor: '#e8f5e9', borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="#2e7d32" fontWeight="bold">{translate("sent", "Sent")}</Typography>
                    <Typography variant="h5" fontWeight="bold" color="#2e7d32">{campaign.sentCount}</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Box sx={{ p: 2, bgcolor: '#ffebee', borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="#c62828" fontWeight="bold">{translate("failed", "Failed")}</Typography>
                    <Typography variant="h5" fontWeight="bold" color="#c62828">{campaign.failedCount}</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Box sx={{ p: 2, bgcolor: '#e3f2fd', borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="#1565c0" fontWeight="bold">{translate("pending", "Pending")}</Typography>
                    <Typography variant="h5" fontWeight="bold" color="#1565c0">
                      {(campaign.totalRecipients || 0) - (campaign.sentCount || 0) - (campaign.failedCount || 0)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          {/* Recipients Table */}
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)", height: '100%' }}>
            <CardContent sx={{ p: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Box sx={{ p: 3, borderBottom: '1px solid #f0f0f0' }}>
                <Typography variant="h6" fontWeight="bold">
                  {translate("recipients", "Recipients")}
                </Typography>
              </Box>
              
              <TableContainer sx={{ flexGrow: 1, maxHeight: 600 }}>
                {campaign.recipients && campaign.recipients.length > 0 ? (
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>{translate("email", "Email")}</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>{translate("name", "Name")}</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>{translate("status", "Status")}</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>{translate("error", "Error")}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {campaign.recipients.map((rec, idx) => (
                        <TableRow key={idx} hover>
                          <TableCell sx={{ fontWeight: 500 }}>{rec.email}</TableCell>
                          <TableCell>{rec.name || "-"}</TableCell>
                          <TableCell>
                            {rec.status === 'sent' && <Chip icon={<SuccessIcon />} label={translate("sent", "Sent")} color="success" size="small" />}
                            {rec.status === 'failed' && <Chip icon={<ErrorIcon />} label={translate("failed", "Failed")} color="error" size="small" />}
                            {rec.status === 'pending' && <Chip icon={<ScheduleIcon />} label={translate("pending", "Pending")} color="default" size="small" />}
                          </TableCell>
                          <TableCell sx={{ maxWidth: 200, color: 'error.main', fontSize: '13px' }}>
                            {rec.error || ""}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                    <Typography color="text.secondary">{translate("no_recipients_found", "No recipients data found.")}</Typography>
                  </Box>
                )}
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
