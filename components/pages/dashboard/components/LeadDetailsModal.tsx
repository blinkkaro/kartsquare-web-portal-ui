"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import dayjs from "dayjs";
import { Lead } from "@/services/leads/lead.interface";

interface LeadDetailsModalProps {
  open: boolean;
  onClose: () => void;
  lead: Lead | null;
}

const LeadDetailsModal: React.FC<LeadDetailsModalProps> = ({
  open,
  onClose,
  lead,
}) => {
  const { t } = useTranslate();

  if (!lead) return null;

  const DetailItem = ({ label, value }: { label: string; value: string }) => (
    <Box sx={{ mb: 2 }}>
      <Typography
        variant="caption"
        sx={{
          color: COLORS.TEXT.SECONDARY_LIGHT,
          fontWeight: 500,
          display: "block",
          mb: 0.5,
        }}
      >
        {label}
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 500 }}>
        {value}
      </Typography>
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          p: 1,
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          {t("lead_details")}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <DetailItem
            label={t("name")}
            value={`${lead.first_name} ${lead.last_name}`}
          />
          <DetailItem label={t("email")} value={lead.email} />
          <DetailItem
            label={t("phoneNumber")}
            value={`${lead.country_code} ${lead.phone_number}`}
          />
          <DetailItem
            label={t("date")}
            value={dayjs(lead.created_at).format("MMM DD, YYYY HH:mm")}
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography
            variant="caption"
            sx={{
              color: COLORS.TEXT.SECONDARY_LIGHT,
              fontWeight: 500,
              display: "block",
              mb: 0.5,
            }}
          >
            {t("message")}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              p: 2,
              bgcolor: "rgba(0, 0, 0, 0.03)",
              borderRadius: "8px",
              whiteSpace: "pre-wrap",
              minHeight: "100px",
            }}
          >
            {lead.message}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            bgcolor: COLORS.PRIMARY_PURPLE,
            "&:hover": { bgcolor: COLORS.PRIMARY_PURPLE, opacity: 0.9 },
            borderRadius: "8px",
            px: 4,
          }}
        >
          {t("close")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LeadDetailsModal;
