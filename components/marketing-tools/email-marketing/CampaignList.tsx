"use client";
import React, { useEffect, useState } from "react";
import { 
  Box, Typography, Card, CardContent, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, CircularProgress, Button,
  TextField, MenuItem, Select, FormControl, InputLabel, InputAdornment, IconButton
} from "@mui/material";
import { 
  Search as SearchIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  ChevronRight
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useTranslationContext } from "@/features/i18n/TranslationContext";
import { emailMarketingService } from "@/services/emailMarketing/emailMarketing.service";
import { VendorCampaign } from "@/services/emailMarketing/emailMarketing.interface";

interface CampaignListProps {
  role: "supplier" | "spr";
}

export default function CampaignList({ role }: CampaignListProps) {
  const router = useRouter();
  const { t } = useTranslationContext();
  
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<VendorCampaign[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const translate = (key: string, fallback: string) => {
    const res = t(key as any);
    return res && typeof res === 'string' && res !== key ? res : fallback;
  };

  const basePath = role === "supplier" ? "/supplier" : "/spr";

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

  useEffect(() => {
    fetchData();
  }, []);

  const handleNavigate = (path: string) => {
    router.push(`${basePath}/marketing-tools/email-marketing/${path}`);
  };

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

  const filteredCampaigns = campaigns.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          c.subject.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, margin: "0 auto" }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", mb: 4, gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {translate("campaigns", "Campaigns")}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {translate("campaigns_subtitle", "View and manage all your email marketing campaigns.")}
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={() => handleNavigate('campaigns/create')}
          sx={{ borderRadius: 2, px: 3, py: 1.5 }}
        >
          {translate("create_campaign", "Create Campaign")}
        </Button>
      </Box>

      {/* Filters & Table */}
      <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
        <CardContent sx={{ p: 0 }}>
          {/* Toolbar */}
          <Box sx={{ p: 3, borderBottom: '1px solid #f0f0f0', display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder={translate("search_campaigns", "Search campaigns...")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 250, flexGrow: { xs: 1, md: 0 } }}
            />
            
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel id="status-filter-label">{translate("status", "Status")}</InputLabel>
              <Select
                labelId="status-filter-label"
                value={statusFilter}
                label={translate("status", "Status")}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">{translate("all_statuses", "All Statuses")}</MenuItem>
                <MenuItem value="draft">{translate("draft", "Draft")}</MenuItem>
                <MenuItem value="scheduled">{translate("scheduled", "Scheduled")}</MenuItem>
                <MenuItem value="processing">{translate("processing", "Processing")}</MenuItem>
                <MenuItem value="completed">{translate("completed", "Completed")}</MenuItem>
                <MenuItem value="failed">{translate("failed", "Failed")}</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ flexGrow: 1 }} />
            
            <IconButton onClick={fetchData} title={translate("refresh", "Refresh")}>
              <RefreshIcon />
            </IconButton>
          </Box>

          <TableContainer>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 8 }}>
                <CircularProgress />
              </Box>
            ) : filteredCampaigns.length === 0 ? (
              <Box sx={{ textAlign: "center", p: 8 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {translate("no_campaigns", "No campaigns found")}
                </Typography>
                <Typography color="text.disabled" mb={3}>
                  {search || statusFilter !== "all" 
                    ? translate("adjust_filters", "Try adjusting your search or filters to find what you're looking for.")
                    : translate("get_started_campaign", "Create your first email campaign to engage with your customers.")}
                </Typography>
                {!(search || statusFilter !== "all") && (
                  <Button variant="outlined" onClick={() => handleNavigate('campaigns/create')}>
                    {translate("create_campaign", "Create Campaign")}
                  </Button>
                )}
              </Box>
            ) : (
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>{translate("campaign_name", "Campaign Name")}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{translate("status", "Status")}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{translate("recipients", "Recipients")}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{translate("sent", "Sent")}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{translate("failed", "Failed")}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{translate("created_date", "Created Date")}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>{translate("actions", "Actions")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCampaigns.map((row) => (
                    <TableRow key={row.id} hover sx={{ cursor: 'pointer' }} onClick={() => handleNavigate(`campaigns/${row.id}`)}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">{row.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{row.subject}</Typography>
                      </TableCell>
                      <TableCell>{getStatusChip(row.status)}</TableCell>
                      <TableCell>{row.totalRecipients}</TableCell>
                      <TableCell>{row.sentCount}</TableCell>
                      <TableCell>{row.failedCount > 0 ? <Typography color="error.main" variant="body2">{row.failedCount}</Typography> : "0"}</TableCell>
                      <TableCell>{new Date(row.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell align="right">
                        <IconButton size="small" color="primary">
                          <ChevronRight />
                        </IconButton>
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
