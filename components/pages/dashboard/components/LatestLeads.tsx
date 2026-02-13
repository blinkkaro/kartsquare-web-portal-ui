"use client";

import React, { useState } from "react";
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
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import { useLeads } from "@/hooks/useLeads";
import ServicesPagination from "../../servicesList/ServicesPagination";
import EmptyState from "@/components/common/EmptyState";
import dayjs from "dayjs";
import { Lead } from "@/services/leads/lead.interface";

const LatestLeads = () => {
  const theme = useTheme();
  const { t } = useTranslate();
  const isDark = theme.palette.mode === "dark";
  const [page, setPage] = useState(1);
  const limit = 5; // Start with 5 items per page for dashboard view

  const { data, isLoading } = useLeads(page, limit);

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value);
  };

  const leads = data?.leads || [];
  const totalPages = data?.pagination?.total_pages || 0;

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
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
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        {t("latest_leads")}
      </Typography>

      {leads.length > 0 ? (
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
                  <TableRow key={lead.lead_id}>
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
  );
};

export default LatestLeads;
