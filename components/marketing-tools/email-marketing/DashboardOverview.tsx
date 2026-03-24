"use client";
import React, { useEffect, useState } from "react";
import { 
  Box, Typography, Grid, Card, CardContent, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, Chip, CircularProgress, Button
} from "@mui/material";
import { 
  Send as SendIcon, 
  Campaign as CampaignIcon, 
  ErrorOutline as ErrorIcon, 
  ShowChart as ChartIcon,
  Add as AddIcon,
  Settings as SettingsIcon,
  FormatListBulleted as ListIcon
} from "@mui/icons-material";
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from "recharts";
import { useRouter } from "next/navigation";
import { useTranslationContext } from "@/features/i18n/TranslationContext";
import { emailMarketingService } from "@/services/emailMarketing/emailMarketing.service";
import { VendorCampaign } from "@/services/emailMarketing/emailMarketing.interface";

interface DashboardOverviewProps {
  role: "supplier" | "spr";
}

// Mock chart data while backend is empty
const mockLineData = [
  { name: 'Mon', sent: 400 },
  { name: 'Tue', sent: 300 },
  { name: 'Wed', sent: 550 },
  { name: 'Thu', sent: 450 },
  { name: 'Fri', sent: 700 },
  { name: 'Sat', sent: 200 },
  { name: 'Sun', sent: 300 },
];

const mockBarData = [
  { name: 'Welcome', target: 1000, sent: 800 },
  { name: 'Promo Q1', target: 2000, sent: 1800 },
  { name: 'Update', target: 500, sent: 490 },
];

export default function DashboardOverview({ role }: DashboardOverviewProps) {
  const router = useRouter();
  const { t } = useTranslationContext();
  
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<VendorCampaign[]>([]);

  // Helper for i18n
  const translate = (key: string, fallback: string) => {
    const res = t(key as any);
    return res && typeof res === 'string' && res !== key ? res : fallback;
  };

  const basePath = role === "supplier" ? "/supplier" : "/spr";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await emailMarketingService.getCampaigns();
      if (res.data) setCampaigns(res.data);
    } catch (error) {
      console.error("Failed to fetch campaigns", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (path: string) => {
    router.push(`${basePath}/marketing-tools/email-marketing/${path}`);
  };

  const stats = {
    total: campaigns.length,
    active: campaigns.filter(c => c.status === "processing" || c.status === "scheduled").length,
    sentEmails: campaigns.reduce((acc, c) => acc + (c.sentCount || 0), 0),
    failedEmails: campaigns.reduce((acc, c) => acc + (c.failedCount || 0), 0),
  };

  const renderStatCard = (title: string, value: string | number, icon: React.ReactNode, color: string) => (
    <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
      <CardContent sx={{ display: "flex", alignItems: "center", p: 3 }}>
        <Box sx={{ 
          bgcolor: `${color}15`, 
          color: color, 
          p: 2, 
          borderRadius: 3, 
          mr: 3,
          display: "flex"
        }}>
          {icon}
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary" fontWeight="bold">
            {title}
          </Typography>
          <Typography variant="h4" fontWeight="bold">
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  const getStatusChip = (status: string) => {
    const map: Record<string, "default"|"primary"|"secondary"|"error"|"info"|"success"|"warning"> = {
      draft: "default",
      scheduled: "info",
      processing: "primary",
      completed: "success",
      failed: "error"
    };
    return <Chip label={status.toUpperCase()} color={map[status] || "default"} size="small" sx={{ fontWeight: 'bold', fontSize: '11px' }} />;
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, margin: "0 auto" }}>
      {/* Header & Actions */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", mb: 4, gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {translate("email_dashboard", "Email Marketing Dashboard")}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {translate("email_dashboard_subtitle", "Manage your campaigns and track their performance.")}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button 
            variant="outlined" 
            startIcon={<SettingsIcon />}
            onClick={() => handleNavigate('smtp-settings')}
            sx={{ borderRadius: 2 }}
          >
            {translate("smtp_settings", "SMTP Settings")}
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={() => handleNavigate('campaigns/create')}
            sx={{ borderRadius: 2, boxShadow: 2 }}
          >
            {translate("new_campaign", "New Campaign")}
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {renderStatCard(
            translate("total_campaigns", "Total Campaigns"), 
            loading ? "-" : stats.total, 
            <CampaignIcon fontSize="large" />, 
            "#1976d2"
          )}
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {renderStatCard(
            translate("active_campaigns", "Active Campaigns"), 
            loading ? "-" : stats.active, 
            <ChartIcon fontSize="large" />, 
            "#2e7d32"
          )}
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {renderStatCard(
            translate("emails_sent", "Emails Sent"), 
            loading ? "-" : stats.sentEmails, 
            <SendIcon fontSize="large" />, 
            "#ed6c02"
          )}
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          {renderStatCard(
            translate("failed_emails", "Failed Emails"), 
            loading ? "-" : stats.failedEmails, 
            <ErrorIcon fontSize="large" />, 
            "#d32f2f"
          )}
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)", height: "100%" }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {translate("emails_sent_over_time", "Emails Sent Over Time")}
              </Typography>
              <Box sx={{ height: 300, mt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockLineData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <RechartsTooltip contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }} />
                    <Line type="monotone" dataKey="sent" stroke="#1976d2" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, lg: 5 }}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)", height: "100%" }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {translate("campaign_performance", "Campaign Performance")}
              </Typography>
              <Box sx={{ height: 300, mt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockBarData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }} />
                    <Legend />
                    <Bar dataKey="sent" fill="#2e7d32" radius={[4, 4, 0, 0]} barSize={30} />
                    <Bar dataKey="target" fill="#e0e0e0" radius={[4, 4, 0, 0]} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Campaigns Table */}
      <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
            <Typography variant="h6" fontWeight="bold">
              {translate("recent_campaigns", "Recent Campaigns")}
            </Typography>
            <Button 
              size="small" 
              startIcon={<ListIcon />}
              onClick={() => handleNavigate('campaigns')}
            >
              {translate("view_all", "View All")}
            </Button>
          </Box>
          <TableContainer component={Box} sx={{ maxHeight: 400 }}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress />
              </Box>
            ) : campaigns.length === 0 ? (
              <Box sx={{ textAlign: "center", p: 6 }}>
                <Typography color="text.secondary">
                  {translate("no_campaigns_found", "No campaigns found. Create one to get started!")}
                </Typography>
              </Box>
            ) : (
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>{translate("campaign_name", "Name")}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{translate("status", "Status")}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{translate("recipients", "Recipients")}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{translate("sent", "Sent")}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{translate("date", "Date")}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>{translate("action", "Action")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {campaigns.slice(0, 5).map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell sx={{ fontWeight: 500 }}>{row.name}</TableCell>
                      <TableCell>{getStatusChip(row.status)}</TableCell>
                      <TableCell>{row.totalRecipients}</TableCell>
                      <TableCell>{row.sentCount}</TableCell>
                      <TableCell>{new Date(row.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell align="right">
                        <Button 
                          size="small" 
                          variant="outlined" 
                          onClick={() => handleNavigate(`campaigns/${row.id}`)}
                          sx={{ borderRadius: 2 }}
                        >
                          {translate("view", "View")}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
