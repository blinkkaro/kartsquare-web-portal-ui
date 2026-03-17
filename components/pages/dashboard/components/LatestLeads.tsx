"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  TextField,
  InputAdornment,
} from "@mui/material";
import CenteredLoader from "@/components/common/Loader/CenteredLoader";
import SearchIcon from "@mui/icons-material/Search";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import { useLeads } from "@/hooks/useLeads";
import ServicesPagination from "../../servicesList/ServicesPagination";
import EmptyState from "@/components/common/EmptyState";
import dayjs from "dayjs";
import { Lead } from "@/services/leads/lead.interface";

import LeadDetailsModal from "./LeadDetailsModal";

const LatestLeads = () => {
  const theme = useTheme();
  const { t } = useTranslate();
  const isDark = theme.palette.mode === "dark";
  const [page, setPage] = useState(1);
  const limit = 15; // Start with 15 items per page for dashboard view
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Debounce search effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to first page on search
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  const { data, isLoading } = useLeads(page, limit, debouncedSearch);

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleRowClick = (lead: Lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const leads = data?.leads || [];
  const totalPages = data?.pagination?.total_pages || 0;

  return (
    <>
      <Paper
        sx={{
          borderRadius: "12px",
          p: 2,
          bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : COLORS.WHITE,
          border: `1px solid ${
            isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT
          }`,
          boxShadow: isDark
            ? "0px 2px 8px rgba(0, 0, 0, 0.2)"
            : "0px 2px 8px rgba(0, 0, 0, 0.05)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {t("latest_leads")}
          </Typography>

          <TextField
            size="small"
            placeholder={t("search")}
            value={search}
            onChange={handleSearchChange}
            sx={{
              width: { xs: "100%", sm: "250px" },
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {isLoading ? (
          <CenteredLoader p={5} />
        ) : leads.length > 0 ? (
          <>
            <TableContainer sx={{ overflowX: "auto" }}>
              <Table size="small" sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>{t("name")}</TableCell>
                    <TableCell>{t("email")}</TableCell>
                    <TableCell>{t("phoneNumber")}</TableCell>
                    <TableCell>{t("date")}</TableCell>
                    <TableCell>{t("message")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leads.map((lead: Lead) => (
                    <TableRow
                      key={lead.lead_id}
                      onClick={() => handleRowClick(lead)}
                      sx={{
                        cursor: "pointer",
                        "&:hover": {
                          bgcolor: isDark
                            ? "rgba(255, 255, 255, 0.05)"
                            : "rgba(0, 0, 0, 0.02)",
                        },
                      }}
                    >
                      <TableCell>
                        {lead.first_name} {lead.last_name}
                      </TableCell>
                      <TableCell>{lead.email}</TableCell>
                      <TableCell>
                        {lead.country_code} {lead.phone_number}
                      </TableCell>
                      <TableCell>
                        {dayjs(lead.created_at).format("MMM DD, YYYY")}
                      </TableCell>
                      <TableCell
                        sx={{
                          maxWidth: 200,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        <Tooltip title={lead.message} arrow>
                          <span>{lead.message}</span>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <ServicesPagination
              totalPages={totalPages}
              currentPage={page}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <EmptyState
            titleKey=""
            title={t("no_leads_yet")}
            description={t("no_leads_desc")}
            minHeight={200}
            iconSize={48}
          />
        )}
      </Paper>

      <LeadDetailsModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        lead={selectedLead}
      />
    </>
  );
};

export default LatestLeads;
