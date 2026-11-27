"use client";

import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CenteredLoader from "@/components/common/Loader/CenteredLoader";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import { useLeads } from "@/hooks/useLeads";
import EmptyState from "@/components/common/EmptyState";
import type { Lead } from "@/services/leads/lead.interface";
import ServicesPagination from "../../servicesList/ServicesPagination";
import LeadDetailsModal from "./LeadDetailsModal";
import LeadRow from "./LeadRow";

export const LEADS_PAGE_SIZE = 5;

const LatestLeads = () => {
  const { t } = useTranslate();
  const [page, setPage] = useState(1);
  const limit = LEADS_PAGE_SIZE;
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
          borderRadius: "16px",
          p: { xs: 1.5, md: 2 },
          bgcolor: COLORS.WHITE,
          border: `1px solid ${COLORS.NEW_UI.CARD_BORDER_LIGHT}`,
          boxShadow: COLORS.NEW_UI.CARD_SHADOW_LIGHT,
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
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
            {t("latest_leads")}
          </Typography>
          {/* Stays visible while searching, so a search with no match can be cleared. */}
          {(leads.length > 0 || search) && (
            <TextField
              size="small"
              placeholder={t("leads_search")}
              value={search}
              onChange={handleSearchChange}
              sx={{
                width: { xs: "100%", sm: "280px" },
                "& .MuiOutlinedInput-root": { borderRadius: "12px", minHeight: 44 },
              }}
              slotProps={{
                htmlInput: { "aria-label": t("leads_search") },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          )}
        </Box>

        {isLoading ? (
          <CenteredLoader p={5} />
        ) : leads.length > 0 ? (
          <>
            <Box
              component="ul"
              sx={{ listStyle: "none", m: 0, p: 0, display: "flex", flexDirection: "column", gap: 1.5 }}
            >
              {leads.map((lead: Lead) => (
                <LeadRow key={lead.lead_id} lead={lead} onOpen={handleRowClick} />
              ))}
            </Box>

            <ServicesPagination
              totalPages={totalPages}
              currentPage={page}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <EmptyState
            titleKey=""
            title={debouncedSearch ? `${t("noResultsFound")} "${debouncedSearch}"` : t("no_leads_yet")}
            description={debouncedSearch ? "" : t("no_leads_desc")}
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
